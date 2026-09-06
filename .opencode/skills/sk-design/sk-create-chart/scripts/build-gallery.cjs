#!/usr/bin/env node
/*
 * Builds the gallery: every chart form in the corpus, rendered twice, once per colour scheme.
 *
 *   node scripts/build-gallery.cjs          write assets/gallery.html
 *   node scripts/build-gallery.cjs --check   fail if the written gallery is not what this would write
 *
 * The gallery is generated rather than written by hand for one reason: a hand-listed page silently
 * omits the form somebody added last week, and the omission looks exactly like a form that was
 * never meant to be there. Reading the directory means a missing form is impossible rather than
 * merely unlikely, and --check makes a stale gallery an error a run can catch.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates');
const OUT = path.join(PACKAGE_ROOT, 'assets', 'gallery.html');

// Each card shows one form under one pinned scheme. The pin is what makes the page a comparison:
// left to right is the same chart, and top to bottom is the corpus.
const SCHEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

function textOf(src, re, fallback) {
  const m = re.exec(src);
  return m ? m[1].replace(/\s+/g, ' ').trim() : fallback;
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function forms() {
  if (!fs.existsSync(TEMPLATE_DIR)) return [];
  return fs.readdirSync(TEMPLATE_DIR)
    .filter((name) => name.endsWith('.html'))
    .sort()
    .map((name) => {
      const src = fs.readFileSync(path.join(TEMPLATE_DIR, name), 'utf8');
      const id = path.basename(name, '.html');
      return {
        id,
        file: `templates/${name}`,
        title: textOf(src, /<title id="fig-title">([\s\S]*?)<\/title>/, id),
        system: textOf(src, /<meta name="chart-color-system" content="([^"]*)"/, 'neutral'),
      };
    });
}

function render(list) {
  const cards = list.map((form) => {
    const frames = SCHEMES.map((scheme) => `
        <figure class="frame">
          <figcaption>${scheme.label}</figcaption>
          <iframe src="${escapeAttr(form.file)}" title="${escapeAttr(form.title)}, ${scheme.label.toLowerCase()} scheme"
                  loading="lazy" data-scheme="${scheme.id}"></iframe>
        </figure>`).join('');
    return `
      <section class="form" id="${escapeAttr(form.id)}">
        <h2>${escapeAttr(form.title)}</h2>
        <p class="meta"><code>${escapeAttr(form.id)}</code> &middot; ${escapeAttr(form.system)} palette</p>
        <div class="pair">${frames}
        </div>
      </section>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="chart-gallery" content="${list.length}">
<title>Chart corpus, every form in both schemes</title>
<style>
  /* The gallery frames the corpus and must not restyle it: every colour here is the page's own,
     and each chart keeps whatever its own file declares. */
  :root { color-scheme: light dark; --ink: #1a1a1a; --ground: #faf9f7; --rule: #dcd8d2; --muted: #6b665f; }
  @media (prefers-color-scheme: dark) {
    :root { --ink: #ececec; --ground: #16171a; --rule: #33363b; --muted: #9aa0a6; }
  }
  body { margin: 0; padding: 32px 24px 64px; background: var(--ground); color: var(--ink);
         font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  header { max-width: 1180px; margin: 0 auto 40px; }
  h1 { font-size: 24px; margin: 0 0 8px; }
  header p { margin: 0; color: var(--muted); max-width: 62ch; }
  .form { max-width: 1180px; margin: 0 auto 48px; padding-top: 24px; border-top: 1px solid var(--rule); }
  h2 { font-size: 17px; margin: 0 0 4px; font-weight: 600; }
  .meta { margin: 0 0 16px; color: var(--muted); font-size: 13px; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 900px) { .pair { grid-template-columns: 1fr; } }
  .frame { margin: 0; }
  figcaption { font-size: 12px; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.04em;
               text-transform: uppercase; }
  iframe { width: 100%; height: 560px; border: 1px solid var(--rule); border-radius: 8px;
           background: Canvas; display: block; }
</style>
</head>
<body>
<header>
  <h1>Chart corpus</h1>
  <p>Every form in the corpus, each rendered twice: once with a light colour scheme pinned and once
     with a dark one. This page is generated from the templates directory, so a form that exists is
     a form that appears here.</p>
</header>
${cards}
<script>
// Each frame pins its own scheme so the pair is a comparison rather than two copies of whatever the
// reader's system happens to be set to. The pin is written into the framed document once it loads,
// because a colour scheme cannot be forced on a frame from outside it.
document.querySelectorAll('iframe[data-scheme]').forEach(function (frame) {
  frame.addEventListener('load', function () {
    try {
      var doc = frame.contentDocument;
      if (!doc) return;
      var style = doc.createElement('style');
      style.textContent = ':root { color-scheme: ' + frame.dataset.scheme + ' !important; }';
      doc.head.appendChild(style);
      doc.documentElement.style.colorScheme = frame.dataset.scheme;
    } catch (err) {
      // A frame that refuses inspection keeps the reader's own scheme, which is a degraded
      // comparison rather than a broken page.
    }
  });
});
</script>
</body>
</html>
`;
}

function main() {
  const list = forms();
  if (!list.length) {
    console.error('no templates found, so there is nothing to build');
    process.exit(1);
  }
  const html = render(list);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(OUT)) {
      console.error(`RESULT: FAILED\n  the gallery has never been built, and ${list.length} forms are waiting for it`);
      process.exit(1);
    }
    const current = fs.readFileSync(OUT, 'utf8');
    if (current !== html) {
      console.error(`RESULT: FAILED\n  the gallery does not match the corpus. Rebuild it with: node scripts/build-gallery.cjs`);
      process.exit(1);
    }
    console.log(`RESULT: PASSED\n  gallery carries all ${list.length} forms, twice each`);
    return;
  }
  fs.writeFileSync(OUT, html);
  console.log(`wrote ${path.relative(PACKAGE_ROOT, OUT)}: ${list.length} forms, ${list.length * SCHEMES.length} frames`);
}

main();
