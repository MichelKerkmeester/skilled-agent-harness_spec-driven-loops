---
title: "ASD-007 -- Screenshot artifact verification"
description: "This scenario validates REPL screenshot evidence for `ASD-007`. It focuses on writing a real PNG via `page.screenshot` and verifying it by existence, size, and magic bytes."
version: 1.0.0.0
---

# ASD-007 -- Screenshot artifact verification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-007`.

---

## 1. OVERVIEW

This scenario captures a screenshot through the REPL's advertised Playwright surface and verifies the artifact independently: existence, size > 0, and PNG magic bytes `89 50 4e 47`.

### Why This Matters

The packet's artifact-evidence standard says a screenshot is a non-empty PNG-magic file, never a successful tool response. Bound-page output shapes are untested research territory, so the on-disk file is the only trustworthy signal — a corrupt or zero-byte PNG is silently broken without the magic-byte check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `page.screenshot({ path })` (after ASD-006's tab) writes a file that exists, has size > 0, and begins with PNG magic bytes.
- Real user request: `"Screenshot the page you just opened and prove the file is a real image."`
- Prompt: `Capture a screenshot of the open page through the aside REPL and confirm the saved file is a valid PNG.`
- Expected execution process: screenshot call, file check, magic check.
- Expected signals: file exists; size > 0; first four bytes `89 50 4e 47`.
- Desired user-visible outcome: A short report quoting the path, size, and magic confirmation with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL on error, missing file, zero bytes, or wrong magic.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture a screenshot of the open page through the aside REPL and confirm the saved file is a valid PNG.`

### Commands

1. Precondition: ASD-006 opened `https://example.com`.
2. `bash: rm -f /tmp/aside-test.png` — clean prior artifact so the existence check is meaningful
3. `bash: aside repl "await page.screenshot({ path: '/tmp/aside-test.png' })" 2>&1`
4. `bash: ls -la /tmp/aside-test.png`
5. `bash: xxd /tmp/aside-test.png | head -1`

(Or run `bash: examples/repl-evidence-capture.sh https://example.com /tmp/aside-evidence`, which chains steps 2-5.)

### Expected

- Step 3: exits 0
- Step 4: file with size > 0
- Step 5: first four bytes `89 50 4e 47`

### Evidence

All command outputs, file size, and the xxd magic-byte line. Record the response shape of step 3 as an installed-version fixture — it is currently undocumented territory.

### Pass / Fail

- **Pass**: exit 0 AND file exists AND size > 0 AND magic `89 50 4e 47`.
- **Fail**: any signal missing. A "successful" response with a bad file is a FAIL.

### Failure Triage

1. Binding error: cross-reference ASD-006/ASD-010 — the tab precondition did not hold.
2. Zero-byte or wrong-magic file: retry once after confirming page load completed; if it persists, record the exact call form used — evaluate/argument edge cases are a known vendor-changelog theme, so the used method/argument form belongs in the smoke fixture.

### Optional Supplemental Checks

- `bash: file /tmp/aside-test.png` — independent format detection (should print `PNG image data`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/examples/repl-evidence-capture.sh` | Scripted equivalent with the same verification gate |

---

## 5. SOURCE METADATA

- Group: REPL EVIDENCE
- Playbook ID: ASD-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `repl_evidence/repl_screenshot_artifact.md`
