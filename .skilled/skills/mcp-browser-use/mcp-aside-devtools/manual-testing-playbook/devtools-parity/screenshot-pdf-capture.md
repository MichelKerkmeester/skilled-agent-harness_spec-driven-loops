---
title: "ASD-017 -- Full-page screenshot + PDF capture"
description: "This scenario validates Chrome-DevTools visual-capture parity for `ASD-017`: page.screenshot({ fullPage }) and page.pdf through the aside REPL, each verified by artifact magic bytes, with a SKIP-valid path when no bound session exists."
version: 1.0.4.0
---

# ASD-017 -- Full-page screenshot + PDF capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-017`.

---

## 1. OVERVIEW

This scenario extends the baseline screenshot check (ASD-007) to the DevTools-parity option surface: a `fullPage` PNG and a `page.pdf` render, both verified independently by their magic bytes. It pins the option parity (`fullPage`, PDF `format`) that DevTools' capture-full-size and print flows expose.

### Why This Matters

On Aside 1.26.626.1517 the REPL confines file writes to the session folder: a `/tmp` screenshot path is redirected into the session `tmp` folder with a `[WARN]`, and `page.pdf` with a `/tmp` path fails with `escapes the session directory`. The scenario therefore writes under `./artifacts/` in the session folder, the location the REPL tool description names for user-visible PDFs, and checks both files with the REPL's `fs` global inside the same evaluation.

Full-page and print-to-PDF are common evidence deliverables. Aside supports both through fixture-documented options; the honest standard is that the artifact is proven by its bytes (`89 50 4e 47` for PNG, `%PDF` for PDF), never by a successful tool response.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-017` and confirm the expected signals without contradictory evidence.

- Objective: On a tab opened in the same evaluation, write a full-page PNG and an A4 PDF under `./artifacts/` in the session folder, and verify each file exists, is non-empty, and starts with the correct magic bytes.
- Real user request: `"Capture a full-page screenshot and a PDF of this page as evidence."`
- Prompt: `Capture a full-page screenshot and a PDF through the aside REPL and confirm both artifacts are valid by magic bytes.`
- Expected execution process: one REPL evaluation that opens the tab, makes the screenshot and pdf calls, runs both byte checks with `fs`, and deletes both files.
- Expected signals: the logged PNG magic is `89504e47`; the logged PDF header is `%PDF`; both sizes > 0; the output carries no error line.
- Desired user-visible outcome: Two artifact paths with sizes and magic confirmation, PASS verdict.
- Pass/fail: PASS when both artifacts verify; SKIP (valid) with the blocker "no bound Aside session available"; FAIL on missing/zero-byte/wrong-magic file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture a full-page screenshot and a PDF through the aside REPL and confirm both artifacts are valid by magic bytes.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. If no bound session is available, SKIP with that blocker.
2. `bash:` capture, check and delete in one evaluation, since files written by the REPL do not outlive it at a shell-checkable path:
   `aside repl "await openTab('https://example.com'); await fs.mkdir('./artifacts', { recursive: true }); try { await page.screenshot({ path: './artifacts/asd017.png', fullPage: true, type: 'png' }); await page.pdf({ path: './artifacts/asd017.pdf', format: 'A4', printBackground: true }); const pngBuf = await fs.readFile('./artifacts/asd017.png'); const pdfBuf = await fs.readFile('./artifacts/asd017.pdf'); console.log(JSON.stringify({ dir: pwd, png: { size: pngBuf.length, magic: pngBuf.subarray(0, 4).toString('hex') }, pdf: { size: pdfBuf.length, head: pdfBuf.subarray(0, 4).toString('latin1') } })); } finally { await fs.rm('./artifacts/asd017.png', { force: true }); await fs.rm('./artifacts/asd017.pdf', { force: true }); }" 2>&1`

### Expected

- Step 2 prints one JSON line with `png.size` > 0, `png.magic` equal to `89504e47`, `pdf.size` > 0 and `pdf.head` equal to `%PDF`; no error line, no `[WARN] Use <session>/tmp instead of /tmp` line and no `escapes the session directory` text. Exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.
- The `./artifacts/` PDF path is the form the REPL tool description documents; it holds on Aside 1.26.626.1517, where ASD-017 verified both artifacts by magic bytes.

### Evidence

The step 2 output, which carries the session folder, both sizes and both magic values. Never quote page content from either file (SKILL.md ALWAYS rule 6). The evaluation's `finally` block deletes both files after the check, since they can show a signed-in page.

### Pass / Fail

- **Pass**: both artifacts exist, non-empty, correct magic.
- **Skip**: no bound session — documented blocker.
- **Fail**: any artifact missing, zero bytes, or wrong magic. A "successful" response with a bad file is a FAIL.

### Failure Triage

1. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
2. `[WARN] Use <session>/tmp instead of /tmp` or `escapes the session directory`: a path left the session folder; keep both paths relative to `./artifacts/`.
3. Zero-byte/wrong-magic: retry once after `page.waitForLoadState('load')`; record the exact call form used.
4. The output names an error but no `dir`: the `finally` block still removes both files, so no capture of a signed-in page is left behind; quote the error verbatim.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/devtools-parity/screenshots-and-pdf.md` | Capability leaf with the repl code patterns |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | REPL tool description: `fs`, `pwd` as the session directory, and `./artifacts/` as the PDF location |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/screenshot-pdf-capture.md`
