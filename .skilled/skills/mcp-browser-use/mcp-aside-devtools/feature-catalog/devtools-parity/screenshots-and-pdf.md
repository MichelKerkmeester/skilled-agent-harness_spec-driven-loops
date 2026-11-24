---
title: "Screenshots, Element Captures, and PDF"
description: "Chrome-DevTools visual-capture parity through the aside repl: page.screenshot (fullPage/clip/path), locator.screenshot for a single element, and page.pdf, each verified independently by artifact bytes rather than tool response."
trigger_phrases:
  - "aside screenshot"
  - "aside full page screenshot"
  - "aside element screenshot"
  - "aside pdf"
last_updated: "2026-11-24"
version: 1.0.3.0
---

# Screenshots, Element Captures, and PDF (DevTools parity)

## 1. OVERVIEW

Chrome DevTools' capture-screenshot / capture-full-size / capture-node commands map onto three fixture-confirmed repl calls: `page.screenshot(options?)`, `locator.screenshot(options?)`, and `page.pdf(options?)`. The discovery fixture ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)) lists all three with their option sets. This overlaps the existing evidence lane ([`../repl/repl-evidence-capture.md`](../repl/repl-evidence-capture.md)) but pins the DevTools-parity option surface (`fullPage`, `clip`, element capture, PDF format) explicitly.

Capability class: MUTATING (writes artifacts to operator-directed paths). The honesty rule is unchanged: an artifact is proven by its bytes — a PNG is a non-empty file whose first four bytes are `89 50 4e 47`; a PDF starts with `%PDF`. A successful tool response never substitutes for the file check.

---

## 2. HOW IT WORKS

Fixture-documented options: `page.screenshot` supports `path`, `fullPage`, `clip`, `type`, `quality`, `timeout`; `locator.screenshot` supports `path`, `type`, `quality`, `timeout`, `margin` (default 8, default `type` `webp`); `page.pdf` supports Playwright PDF options (`path`, `format`, `width`, `height`, `margin`, `pageRanges`, `preferCSSPageSize`, `printBackground`). The fixture directs user-visible PDFs to `./artifacts/`.

On 1.26.626.1517 the REPL confines file writes to its session folder, exposed as `pwd`. A `/tmp` screenshot path is redirected there with a `[WARN]` line, and `page.pdf` refuses a `/tmp` path as escaping the session directory. The session files are gone once the REPL exits, so a shell check afterwards finds nothing. The examples below write to `./artifacts/` and read each file back with the `fs` global in the same evaluation (ASD-017). Delete the files in a `finally` block, since a signed-in page can leak into them (SKILL.md ALWAYS rule 6).

```js
await openTab('https://example.com');
await fs.mkdir('./artifacts', { recursive: true });
try {
  // Full-page PNG (DevTools "capture full size screenshot" analog)
  await page.screenshot({ path: './artifacts/full.png', fullPage: true, type: 'png' });

  // Clipped region (DevTools "capture area screenshot" analog)
  await page.screenshot({ path: './artifacts/hero.png', clip: { x: 0, y: 0, width: 1200, height: 400 } });

  // Single element (DevTools "capture node screenshot" analog)
  await page.locator('main').screenshot({ path: './artifacts/main.webp' });

  // Print to PDF (no native DevTools equivalent; Playwright print path)
  await page.pdf({ path: './artifacts/page.pdf', format: 'A4', printBackground: true });

  const png = await fs.readFile('./artifacts/full.png');
  const pdf = await fs.readFile('./artifacts/page.pdf');
  console.log(JSON.stringify({
    png: { size: png.length, magic: png.subarray(0, 4).toString('hex') },
    pdf: { size: pdf.length, head: pdf.subarray(0, 4).toString('latin1') }
  }));
} finally {
  for (const f of ['full.png', 'hero.png', 'main.webp', 'page.pdf']) {
    await fs.rm('./artifacts/' + f, { force: true });
  }
}
```

Verify every capture inside the same evaluation: size > 0 and magic bytes (`89504e47` for PNG, `%PDF` for PDF). Keep a single writer per profile; redact sensitive on-screen content from shared artifacts. `annotatedScreenshot(page)` is the extra Aside-native path (PNG with visible ref-ID labels) with no direct DevTools analog.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discovery-fixture-2026-07-16.json` | Fixture | Documents `page.screenshot`/`locator.screenshot`/`page.pdf` option sets |
| `examples/repl-evidence-capture.sh` | Example | Open, screenshot and PNG-magic check in one `aside repl` evaluation, the ASD-007 form. It has not yet been run as a script against a live Aside. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/devtools-parity/screenshot-pdf-capture.md` | Manual playbook | ASD-017 fullPage screenshot + PDF with independent byte verification |
| `manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md` | Manual playbook | ASD-007 baseline screenshot artifact verification |

---

## 4. SOURCE METADATA

- Group: DevTools Parity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `devtools-parity/screenshots-and-pdf.md`

Related references:
- [repl-evidence-capture.md](../repl/repl-evidence-capture.md) is the core evidence lane; this file pins the DevTools option parity
- [performance-timing.md](performance-timing.md) covers the non-visual measurement parity
