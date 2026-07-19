---
title: "PROCCARD-001 -- md-generator procedure-card selection proof"
description: "This scenario validates that md-generator selects the measured-extraction procedure card for extraction, token capture, CSS capture, DESIGN.md, screenshots, and source-system grounding requests."
version: 1.0.0.0
---

# PROCCARD-001 -- md-generator procedure-card selection proof

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PROCCARD-001`.

---

## 1. OVERVIEW

This scenario validates `design-md-generator/SKILL.md` section `Procedure Card Selection`: measured extraction, token capture, CSS capture, `DESIGN.md` generation, source design systems, screenshots, brand references, gaps, inconsistencies, or grounding future work in an existing surface select `procedures/design-system-extraction.md`.

### Why This Matters

The card shapes planning and proof, but it must not replace the Playwright extraction backend or grant mutating permissions to other modes.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm md-generator selects `procedures/design-system-extraction.md` for measured design-system extraction requests.
- Real user request: `Extract a measured design system and write a DESIGN.md from a live URL.`
- Prompt: `md-generator: extract measured CSS tokens from https://example.com into a DESIGN.md, and before planning, state the selected private procedure card, backend boundary, source type, output paths, and value-origin risks.`
- Expected execution process: Read `SKILL.md`; select `procedures/design-system-extraction.md`; preserve `backendKind: playwright-extract`; name backend entrypoints and output provenance before any completion claim.
- Expected signals: Card path appears; backend boundary remains md-generator-only; extraction planning cites source URL, output paths, token/Style Reference provenance, validation risks.
- Desired user-visible outcome: A measured-extraction plan with card proof and backend preservation.
- Pass/fail: PASS if exact card selected and backend boundary preserved; FAIL if no card is named, mode becomes read-only, or other modes get mutating authority.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PROCCARD-001 | md-generator card selection | Verify measured-extraction card selection with backend preservation | `md-generator: extract measured CSS tokens from https://example.com into a DESIGN.md, and before planning, state the selected private procedure card, backend boundary, source type, output paths, and value-origin risks.` | grep procedure selection in `SKILL.md` -> agent: run prompt -> inspect selected card and backend boundary | `procedures/design-system-extraction.md` named; `backendKind: playwright-extract` preserved; output provenance and validation risks named | Transcript, response, selected-card proof line | PASS if exact card selected and backend boundary preserved; FAIL if omitted or flattened | 1. Re-read `SKILL.md` procedure section; 2. Re-read `Backend Boundary Preservation`; 3. Confirm no other mode receives Write/Edit/Bash |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | md-generator procedure table and backend boundary |
| `../../procedures/design-system-extraction.md` | Measured-extraction procedure card |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: PROCCARD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/card-selection-proof.md`
