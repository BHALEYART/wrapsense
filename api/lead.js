// Vercel serverless function: POST /api/lead
// Receives quote/contact requests (JSON from JS, or form-encoded when JS is off),
// validates them, then delivers via email (Resend) and/or a webhook (CRM, Zapier, Make, GoHighLevel, HubSpot…).
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY     – enables email delivery through resend.com
//   LEAD_TO_EMAIL      – where leads go, comma-separated (default sales@wrapsensepackaging.com)
//   LEAD_FROM_EMAIL    – verified sender, e.g. "WrapSense Website <leads@wrapsensepackaging.com>"
//   LEAD_WEBHOOK_URL   – optional; receives the full lead as JSON
//   LEAD_WEBHOOK_SECRET– optional; sent as the X-Webhook-Secret header

import { products } from '../src/data/products.mjs';

const PRODUCT = Object.fromEntries(products.map((p) => [p.slug, { name: p.fullName, url: `/machines/${p.category}/${p.slug}/` }]));
const MAX = { short: 200, long: 4000 };
const LABELS = {
  type: { 'new-machine': 'A packaging machine', line: 'A complete packaging line', custom: 'A custom machine', service: 'Service, parts or support', film: 'Packaging film' },
  timeline: { asap: 'As soon as possible', '1-3': '1–3 months', '3-6': '3–6 months', '6+': '6+ months', research: 'Just researching' },
};

const clean = (v, n = MAX.short) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, (c) => (c === '\n' ? c : ' ')).trim().slice(0, n) : '');
const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const raw = typeof req.body === 'string' ? req.body : await new Promise((resolve) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 100_000) req.destroy(); });
    req.on('end', () => resolve(s));
  });
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) { try { return JSON.parse(raw || '{}'); } catch { return {}; } }
  return Object.fromEntries(new URLSearchParams(raw));
}

function validate(b) {
  const fields = {};
  const type = LABELS.type[b.type] ? b.type : 'new-machine';
  if (!clean(b.first_name)) fields.first_name = 'First name is required.';
  if (!clean(b.last_name)) fields.last_name = 'Last name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(b.email))) fields.email = 'Enter a valid email address.';
  if (clean(b.phone).replace(/\D/g, '').length < 7) fields.phone = 'Enter a valid phone number.';
  if (type === 'service') { if (!clean(b.machine_model)) fields.machine_model = 'Machine make / model is required.'; }
  else if (!clean(b.product, 300)) fields.product = 'Tell us what you’re packaging.';
  return { type, fields };
}

function buildLead(b, type, req) {
  const attr = typeof b.attribution === 'object' && b.attribution ? b.attribution : {};
  const a = {};
  for (const [k, v] of Object.entries(attr)) a[clean(k, 40)] = clean(String(v), 600);
  return {
    received_at: new Date().toISOString(),
    type, type_label: LABELS.type[type],
    first_name: clean(b.first_name), last_name: clean(b.last_name), company: clean(b.company),
    email: clean(b.email).toLowerCase(), phone: clean(b.phone, 40), zip: clean(b.zip, 12), contact_pref: clean(b.contact_pref, 10),
    product: clean(b.product, 300), product_form: clean(b.form, 40), package: clean(b.pkg, 40), speed: clean(b.speed, 10),
    timeline: LABELS.timeline[b.timeline] || '', samples: clean(b.samples, 10),
    machine_model: clean(b.machine_model), serial: clean(b.serial, 100),
    interest: clean(b.interest, 600).split(',').map((s) => s.trim()).filter((s) => PRODUCT[s]), category: clean(b.category, 80),
    message: clean(b.message, MAX.long), page: clean(b.page, 300),
    attribution: a,
    user_agent: clean(req.headers['user-agent'] || '', 300),
  };
}

function emailHtml(L) {
  const row = (k, v) => (v ? `<tr><th align="left" style="padding:6px 12px 6px 0;color:#5a6380;font-weight:600;vertical-align:top">${escHtml(k)}</th><td style="padding:6px 0">${escHtml(v)}</td></tr>` : '');
  const src = L.attribution;
  const origin = src.ft_utm_source ? `${src.ft_utm_source} / ${src.ft_utm_medium || '—'}${src.ft_utm_campaign ? ' / ' + src.ft_utm_campaign : ''}` : src.ft_source || '';
  const site = 'https://www.wrapsensepackaging.com';
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0d1533;max-width:640px">
  <h2 style="margin:0 0 4px">New ${escHtml(L.type_label.toLowerCase())} request</h2>
  <p style="margin:0 0 16px;color:#5a6380">${escHtml(L.received_at)}</p>
  <table cellpadding="0" cellspacing="0">
    ${row('Name', `${L.first_name} ${L.last_name}`)}${row('Company', L.company)}${row('Email', L.email)}${row('Phone', L.phone)}${row('ZIP', L.zip)}${row('Prefers', L.contact_pref)}
    ${row('Packaging', L.product)}${row('Product type', L.product_form)}${row('Package', L.package)}${row('Target output', L.speed)}${row('Timeline', L.timeline)}${row('Samples for testing', L.samples)}
    ${row('Machine model', L.machine_model)}${row('Serial', L.serial)}
    ${row('Interested in', L.interest.map((s) => PRODUCT[s]?.name || s).join(', '))}${row('Category', L.category)}
  </table>
  ${L.interest.length ? `<p>${L.interest.filter((s) => PRODUCT[s]).map((s) => `<a href="${site}${PRODUCT[s].url}">${escHtml(PRODUCT[s].name)}</a>`).join(' · ')}</p>` : ''}
  ${L.message ? `<h3 style="margin:20px 0 6px">Message</h3><p style="white-space:pre-wrap;margin:0">${escHtml(L.message)}</p>` : ''}
  <h3 style="margin:24px 0 6px">Lead source</h3>
  <table cellpadding="0" cellspacing="0">
    ${row('First touch', origin)}${row('First landing page', src.ft_landing)}${row('First referrer', src.ft_referrer)}
    ${row('Latest campaign', src.lt_utm_source ? `${src.lt_utm_source} / ${src.lt_utm_medium || '—'} / ${src.lt_utm_campaign || '—'}` : src.lt_source)}
    ${row('Ad click ID', src.ft_gclid || src.lt_gclid || src.ft_fbclid || src.lt_fbclid || src.ft_msclkid || src.lt_msclkid)}
    ${row('Visits', src.visits)}${row('Machine Finder', src.finder)}${row('Machines viewed', src.viewed_machines)}${row('Pages this visit', src.pages)}${row('Submitted from', L.page)}
  </table>
  <p style="color:#5a6380;font-size:12px;margin-top:20px">Source tracking is based on what the visitor’s browser recorded; some visits (blocked storage, private browsing, other devices) arrive without it.</p>
</div>`;
}

async function sendEmail(L) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const to = (process.env.LEAD_TO_EMAIL || 'sales@wrapsensepackaging.com').split(',').map((s) => s.trim()).filter(Boolean);
  const from = process.env.LEAD_FROM_EMAIL || 'WrapSense Website <onboarding@resend.dev>';
  const subject = `New ${L.type === 'service' ? 'service' : 'quote'} request — ${L.company || `${L.first_name} ${L.last_name}`}${L.product ? ': ' + L.product.slice(0, 60) : ''}`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: L.email, subject, html: emailHtml(L) }),
  });
  if (!r.ok) throw new Error('email ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return { sent: true };
}

async function sendWebhook(L) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return { skipped: true };
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.LEAD_WEBHOOK_SECRET) headers['X-Webhook-Secret'] = process.env.LEAD_WEBHOOK_SECRET;
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(L) });
  if (!r.ok) throw new Error('webhook ' + r.status);
  return { sent: true };
}

export default async function handler(req, res) {
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const reply = (status, body) => {
    if (wantsJson) return res.status(status).json(body);
    if (status === 200) { res.statusCode = 303; res.setHeader('Location', '/thank-you/'); return res.end(); }
    res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<!doctype html><meta charset="utf-8"><title>Request not sent</title><p>${escHtml(body.error || 'Something went wrong.')}</p><p>Please go back and try again, or call 301-200-0048 / email sales@wrapsensepackaging.com.</p>`);
  };

  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, { error: 'Method not allowed.' }); }

  const b = await readBody(req);

  // Spam traps: hidden honeypot field filled, or submitted faster than a person could type.
  const started = Number(b._t) || 0;
  if (clean(b.website) || (started && Date.now() - started < 2500)) return reply(200, { ok: true });

  const { type, fields } = validate(b);
  if (Object.keys(fields).length) return reply(422, { error: 'Some fields need attention.', fields });

  const lead = buildLead(b, type, req);
  if (!process.env.RESEND_API_KEY && !process.env.LEAD_WEBHOOK_URL) {
    console.error('[lead] No delivery configured (set RESEND_API_KEY and/or LEAD_WEBHOOK_URL). Lead:', JSON.stringify(lead));
    return reply(503, { error: 'Our form isn’t connected yet.' });
  }

  const results = await Promise.allSettled([sendEmail(lead), sendWebhook(lead)]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.sent);
  results.forEach((r) => r.status === 'rejected' && console.error('[lead] delivery failed:', r.reason?.message));
  if (!delivered) { console.error('[lead] undelivered lead:', JSON.stringify(lead)); return reply(502, { error: 'We couldn’t deliver your request.' }); }
  console.log('[lead] delivered', lead.type, lead.email);
  return reply(200, { ok: true });
}
