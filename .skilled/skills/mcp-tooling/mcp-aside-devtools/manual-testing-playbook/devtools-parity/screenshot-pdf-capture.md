---
title: "ASD-017 -- Full-page screenshot + PDF capture"
description: "This scenario validates Chrome-DevTools visual-capture parity for `ASD-017`: page.screenshot({ fullPage }) and page.pdf through the aside REPL, each verified by artifact magic bytes, with a SKIP-valid path when no bound session exists."
version: 1.0.0.0
---

# ASD-017 -- Full-page screenshot + PDF capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-017`.

---

## 1. OVERVIEW

This scenario extends the baseline screenshot check (ASD-007) to the DevTools-parity option surface: a `fullPage` PNG and a `page.pdf` render, both verified independently by their magic bytes. It pins the option parity (`fullPage`, PDF `format`) that DevTools' capture-full-size and print flows expose.

### Why This Matters

Full-page and print-to-PDF are common evidence deliverables. Aside supports both through fixture-documented options; the honest standard is that the artifact is proven by its bytes (`89 50 4e 47` for PNG, `%PDF` for PDF), never by a successful tool response.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-017` and confirm the expected signals without contradictory evidence.

- Objective: On a bound tab, write a full-page PNG and an A4 PDF under `./artifacts/`, and verify each file exists, is non-empty, and starts with the correct magic bytes.
- Real user request: `"Capture a full-page screenshot and a PDF of this page as evidence."`
- Prompt: `Capture a full-page screenshot and a PDF through the aside REPL and confirm both artifacts are valid by magic bytes.`
- Expected execution process: screenshot + pdf calls, then two byte checks.
- Expected signals: PNG file with `89 50 4e 47`; PDF file with `%PDF`.
- Desired user-visible outcome: Two artifact paths with sizes and magic confirmation, PASS verdict.
- Pass/fail: PASS when both artifacts verify; SKIP (valid) with the blocker "no bound Aside session available"; FAIL on missing/zero-byte/wrong-magic file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture a full-page screenshot and a PDF through the aside REPL and confirm both artifacts are valid by magic bytes.`

### Commands

1. Precondition: a bound tab (ASD-006). If none, SKIP with that blocker.
2. `bash: mkdir -p ./artifacts && rm -f ./artifacts/asd017.png ./artifacts/asd017.pdf`
3. `bash: aside repl "await page.screenshot({ path: './artifacts/asd017.png', fullPage: true, type: 'png' }); await page.pdf({ path: './artifacts/asd017.pdf', format: 'A4', printBackground: true }); console.log('captured')" 2>&1`
4. `bash: ls -la ./artifacts/asd017.png ./artifacts/asd017.pdf`
5. `bash: xxd ./artifacts/asd017.png | head -1 && head -c 4 ./artifacts/asd017.pdf`

### Expected

- Step 3 exits 0; Step 4 both files size > 0; Step 5 PNG magic `89 50 4e 47` and PDF header `%PDF`.

### Evidence

Command outputs, file sizes, and the magic-byte lines. Record the step-3 response shape as an installed-version fixture.

### Pass / Fail

- **Pass**: both artifacts exist, non-empty, correct magic.
- **Skip**: no bound session — documented blocker.
- **Fail**: any artifact missing, zero bytes, or wrong magic. A "successful" response with a bad file is a FAIL.

### Failure Triage

1. Binding error: cross-reference ASD-006/ASD-010.
2. Zero-byte/wrong-magic: retry once after `page.waitForLoadState('load')`; record the exact call form used.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/devtools-parity/screenshots-and-pdf.md` | Capability leaf with the repl code patterns |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/examples/repl-evidence-capture.sh` | Scripted screenshot equivalent with the same verification gate |

---

## 5. SOURCE METADATA

- Group: DEVTOOLS PARITY
- Playbook ID: ASD-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `devtools-parity/screenshot-pdf-capture.md`
