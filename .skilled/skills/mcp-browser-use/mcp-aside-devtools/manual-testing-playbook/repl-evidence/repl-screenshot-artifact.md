---
title: "ASD-007 -- Screenshot artifact verification"
description: "This scenario validates REPL screenshot evidence for `ASD-007`. It focuses on writing a real PNG via `page.screenshot` into the session folder and verifying it by existence, size, and magic bytes inside the same REPL process."
version: 1.0.4.0
---

# ASD-007 -- Screenshot artifact verification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-007`.

---

## 1. OVERVIEW

This scenario captures a screenshot through the REPL's advertised Playwright surface and verifies the artifact independently: existence, size > 0, and PNG magic bytes `89 50 4e 47`.

On Aside 1.26.626.1517 the REPL confines file writes to the session folder. A `/tmp` path is redirected with `[WARN] Use <session>/tmp instead of /tmp`, and the redirected file is gone once the REPL exits, so a shell check after the call finds nothing. The scenario therefore writes to `./tmp/` under the session folder (the REPL's working directory, exposed as `pwd`) and runs every file check with the REPL's `fs` global inside the same evaluation.

### Why This Matters

The packet's artifact-evidence standard says a screenshot is a non-empty PNG-magic file, never a successful tool response. Bound-page output shapes are untested research territory, so the written file is the only trustworthy signal, and a corrupt or zero-byte PNG is silently broken without the magic-byte check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `page.screenshot({ path })` on a tab opened in the same evaluation writes a file under the session folder that exists, has size > 0, and begins with PNG magic bytes.
- Real user request: `"Screenshot the page you just opened and prove the file is a real image."`
- Prompt: `Capture a screenshot of the open page through the aside REPL and confirm the saved file is a valid PNG.`
- Expected execution process: one REPL evaluation that opens the tab, takes the screenshot, and reads the file back with `fs`.
- Expected signals: the logged JSON shows the file size > 0 and magic `89504e47`; the output carries no error line.
- Desired user-visible outcome: A short report quoting the session path, size, and magic confirmation with a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL on error, missing file, zero bytes, or wrong magic.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture a screenshot of the open page through the aside REPL and confirm the saved file is a valid PNG.`

### Commands

1. Precondition: ASD-006 passed, so `openTab()` works on this profile. Its tab does not carry over, because each `aside repl` call starts a new process with `page` null.
2. `bash: aside repl "await openTab('https://example.com'); await fs.mkdir('./tmp', { recursive: true }); const shotBytes = await page.screenshot({ path: './tmp/aside-test.png' }); const shotStat = await fs.stat('./tmp/aside-test.png'); const shotHead = (await fs.readFile('./tmp/aside-test.png')).subarray(0, 4).toString('hex'); console.log(JSON.stringify({ dir: pwd, size: shotStat.size, magic: shotHead, returnedBytes: shotBytes ? shotBytes.length : null }))" 2>&1`

### Expected

- Step 2: prints one JSON line with `size` > 0 and `magic` equal to `89504e47`, plus the session folder in `dir`; no error line and no `[WARN] Use <session>/tmp instead of /tmp` line. Exit 0 alone is not a pass signal, because an `aside repl` error still exits 0.
- The `./tmp/` path is the form the REPL tool description and the redirect warning point to; it holds on Aside 1.26.626.1517, where ASD-007 verified the PNG by magic bytes.

### Evidence

The full step 2 output, which carries the session folder, file size and magic bytes. Record the `returnedBytes` value as an installed-version fixture, since the response shape of `page.screenshot` is undocumented territory.

### Pass / Fail

- **Pass**: logged `size` > 0 AND `magic` is `89504e47` AND the output carries no error.
- **Fail**: any signal missing. A "successful" response with a bad file is a FAIL.

### Failure Triage

1. `page` is null or a binding error: the tab was not opened in the same evaluation, or the profile is unbound; cross-reference ASD-006/ASD-010.
2. `[WARN] Use <session>/tmp instead of /tmp` or `escapes the session directory`: the path left the session folder; keep it relative to `./tmp/`.
3. Zero-byte or wrong-magic file: retry once after `await page.waitForLoadState('load')`; if it persists, record the exact call form used, since evaluate/argument edge cases are a known vendor-changelog theme.

### Optional Supplemental Checks

- Compare `returnedBytes` with `size`: when `page.screenshot` returns the bytes, the two should match.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | REPL globals: `fs`, `pwd` as the session directory, `page.screenshot` options and the `./tmp/` example path |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | Scripted equivalent that runs this same one-evaluation form and gates on its logged JSON. It has not yet been run as a script against a live Aside. |

---

## 5. SOURCE METADATA

- Group: REPL EVIDENCE
- Playbook ID: ASD-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `repl-evidence/repl-screenshot-artifact.md`
