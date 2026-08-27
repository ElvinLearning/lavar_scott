#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  'index.html', 'story.html', 'track.html', 'offtrack.html',
  'community.html', 'schedule.html', 'partner.html',
  'summer_nights_in_daytona.html'
];
const publicPages = pages.filter((page) => !page.startsWith('summer_'));
const failures = [];
const fail = (message) => failures.push(message);
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

for (const page of pages) {
  const html = read(page);
  const rendered = html.replace(/<!--[\s\S]*?-->/g, '');
  const count = (pattern) => (html.match(pattern) || []).length;
  if (!/<html\b[^>]*\blang="en"/i.test(html)) fail(`${page}: missing lang=en`);
  if (count(/<main\b/gi) !== 1) fail(`${page}: expected exactly one main`);
  if (count(/<h1\b/gi) !== 1) fail(`${page}: expected exactly one h1`);
  if (!/<link\b[^>]*rel="icon"[^>]*href="favicon\.svg"/i.test(html)) fail(`${page}: missing local favicon`);
  if (/[—–]/.test(rendered) || /&(?:n|m)dash;/i.test(rendered)) fail(`${page}: contains a banned long dash`);
  if (/<form\b/i.test(html)) fail(`${page}: unapproved form transport present`);

  const ids = [...html.matchAll(/\bid="([^"]+)"/gi)].map((match) => match[1]);
  for (const id of new Set(ids)) {
    if (ids.filter((value) => value === id).length > 1) fail(`${page}: duplicate id ${id}`);
  }

  for (const match of rendered.matchAll(/\b(?:href|src|poster)="([^"]+)"/gi)) {
    const target = match[1];
    if (!target || /^(?:https?:|mailto:|tel:|#|data:|\/\/)/i.test(target)) continue;
    const local = target.split('#')[0].split('?')[0];
    if (local && !fs.existsSync(path.resolve(root, local))) fail(`${page}: missing local target ${local}`);
  }

  const videos = count(/<video\b/gi);
  if (videos > 1) fail(`${page}: more than one cinematic video`);
  if (videos && !/<video\b[^>]*\bpreload="none"/i.test(html)) fail(`${page}: video must be poster-first with preload=none`);
}

for (const page of publicPages) {
  const html = read(page);
  if (!/document\.documentElement\.classList\.add\('js'\)/.test(html)) fail(`${page}: missing early progressive-enhancement hook`);
  if (/\bscroll-cue\b/i.test(html)) fail(`${page}: obsolete scroll cue remains`);
}

for (const page of pages) {
  const html = read(page);
  if (!/<a\b[^>]*class="skip-link"[^>]*href="#main"/i.test(html)) fail(`${page}: missing skip link`);
}

const css = read('styles.css');
const js = read('script.js');
if (!/@media\s*\(prefers-reduced-motion:reduce\)/.test(css)) fail('styles.css: missing reduced-motion fallback');
if (!/html\.js-anim\s+\.rv/.test(css)) fail('styles.css: reveals are not progressively enhanced');
if (!/createElement\('button'\)/.test(js) || !/Pause film/.test(js)) fail('script.js: accessible video controls missing');
if (!/navigator\.connection/.test(js)) fail('script.js: Save-Data video guard missing');
if (!/max-width:700px/.test(js) || !/deferAutoplay/.test(js)) fail('script.js: mobile autoplay is not deferred');
if (/addEventListener\(['"]scroll['"]/.test(js)) fail('script.js: raw scroll listener present');
for (let index = 1; index <= 5; index += 1) {
  const asset = `img/video-fill/edit-0${index}.webp`;
  if (!fs.existsSync(path.join(root, asset))) fail(`pre-rendered video fill missing: ${asset}`);
}

const home = read('index.html');
for (const asset of ['sunoco', 'uac', 'strictly-friendly', 'archer-greiner']) {
  if (!home.includes(`img/proof/${asset}.webp`)) fail(`index.html: optimized proof image missing: ${asset}`);
}
for (const asset of ['story', 'track', 'offtrack', 'community', 'schedule', 'partner']) {
  if (!home.includes(`img/nav/${asset}.webp`)) fail(`index.html: lazy navigation image missing: ${asset}`);
}
if ((home.match(/class="navcard__media"[^>]*loading="lazy"/g) || []).length !== 6) fail('index.html: all six navigation images must be lazy');

const partner = read('partner.html');
if (!partner.includes('NASCAR_Sponsorship_Overview_2026.pdf')) fail('partner.html: sponsorship evidence source missing');
if ((partner.match(/<a class="presscard"/g) || []).length !== 6) fail('partner.html: press coverage must link to six primary sources');
if (/General population:|NASCAR fans: 92%|NASCAR fans: 87%/.test(partner)) fail('partner.html: unsupported legacy chart data remains');

const daytona = read('summer_nights_in_daytona.html');
if ((daytona.match(/<img\b[^>]*loading="lazy"/g) || []).length < 3) fail('summer_nights_in_daytona.html: gallery images must be lazy');

for (const asset of ['sunoco.svg', 'uac.png', 'alpha-prime.png', 'archer.svg', 'SOURCES.md']) {
  if (!fs.existsSync(path.join(root, 'img', 'partners', asset))) fail(`partner asset missing: ${asset}`);
}

if (failures.length) {
  console.error(`Site verification failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Site verification passed: ${pages.length} pages, local targets, motion, accessibility, and partner provenance.`);
