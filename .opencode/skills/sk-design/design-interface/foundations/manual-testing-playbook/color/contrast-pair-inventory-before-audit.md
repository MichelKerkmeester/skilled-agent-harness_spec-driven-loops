---
title: Contrast Pair Inventory Before Audit Scenario
description: Manual scenario verifying changed foreground/background pairs are inventoried and checked during foundations work before an audit can discover WCAG-AA failures late.
trigger_phrases:
  - "test contrast pair inventory"
  - "test foreground background pairs"
  - "foundations contrast scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: COLOR
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - ../shared/context-loading-contract.md
  - references/color/oklch-workflow.md
  - assets/contrast-pair-inventory.md
---

# FOUND-COLOR-002 | Contrast Pair Inventory Before Audit

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-COLOR-002`.

**Exact prompt**

```text
Create a refreshed color token plan for a healthcare appointments dashboard with new card, button, status, and muted text colors, and prove the text and control contrast before handoff.
```

---

## 1. OVERVIEW

This scenario validates that foundations color work inventories and checks actual foreground/background pairs before handoff. It catches the miss where a WCAG-AA P1 only appears during a later audit because the token work treated contrast as visual taste instead of pair verification.

### Why This Matters

Color tokens can look coherent while a muted label, button text, or status color fails against its real surface. The foundations phase owns that prevention step. The contrast-pair inventory proves each changed text, icon, control, and surface pair has an actual foreground value, background value, target, result, and fix when needed.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a realistic color-token request loads the foundations contrast references, fills contrast pairs early, and blocks handoff while required pairs fail or remain unassessed.
- Real user request: `Refresh the healthcare dashboard color system, but make sure no contrast issues get kicked to audit.`
- Prompt: `Create a refreshed color token plan for a healthcare appointments dashboard with new card, button, status, and muted text colors, and prove the text and control contrast before handoff.`
- Expected execution process: Route to `foundations`; load `../../references/color/oklch-workflow.md`, `../../assets/contrast-pair-inventory.md`, and `../../../shared/context-loading-contract.md`; set the register from `../../../shared/register.md`; inventory actual pairs for body text, muted text, primary buttons, focus rings, status text, and disabled controls; repair failed pairs through OKLCH lightness first.
- Expected signals: `CONTRAST PAIRS:` or the worksheet appears before final token handoff; each required pair has foreground token/value, background token/value, surface, target, result, and fix-if-fail; failed and unknown pairs block ready language.
- Desired user-visible outcome: A color token plan with a completed contrast inventory and no late audit-only discovery of WCAG-AA failures.
- Pass/fail: PASS if contrast pairs are inventoried and checked during foundations work; FAIL if the response only promises a later audit, uses palette intent without pair data, or marks unassessed pairs as passing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the task as foundations-owned color and token work.
2. Load the contrast workflow, contrast-pair inventory, shared context-loading contract, and register.
3. Produce semantic token roles plus actual text/control/surface pairs before final values are approved.
4. Verify body text targets WCAG AA 4.5:1 and large text, icons, focus, and UI controls target at least 3:1.
5. Mark the scenario FAIL if the first contrast proof appears only as an audit caveat.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-COLOR-002 | Contrast-pair inventory before audit | Confirm changed foreground/background pairs are inventoried during foundations work before audit | `Create a refreshed color token plan for a healthcare appointments dashboard with new card, button, status, and muted text colors, and prove the text and control contrast before handoff.` | bash: rg -n "contrast-pair inventory|changed foreground/background" ../../SKILL.md -> bash: rg -n "CONTRAST REPAIR|OKLCH lightness" ../../references/color/oklch-workflow.md -> bash: rg -n "INVENTORY THE PAIRS|WCAG AA" ../../assets/contrast-pair-inventory.md -> agent: produce the token plan plus contrast-pair inventory | Step 1: foundations contrast requirement found; Step 2: repair logic found; Step 3: inventory worksheet found; Step 4: output includes actual pairs, targets, results, and fixes before handoff | Terminal transcript, token plan, contrast-pair inventory, and final PASS or FAIL verdict | PASS if required pairs are assessed early and failed or unknown pairs block handoff; FAIL if pair inventory is absent, deferred to audit, or inferred from palette intent only | 1. Re-read ../../assets/contrast-pair-inventory.md Sections 2 through 4; 2. Re-read ../../../shared/context-loading-contract.md Required Proof Fields; 3. Re-run with one known low-contrast muted-text pair and confirm it is marked fail or fixed |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | foundations resource-loading rule for contrast-pair inventory on changed foreground/background pairs |
| `../../references/color/oklch-workflow.md` | Contrast repair rules and OKLCH lightness-first repair |
| `../../assets/contrast-pair-inventory.md` | Fill-in worksheet for actual pairs and targets |
| `../../../shared/context-loading-contract.md` | `CONTRAST PAIRS` proof field and Foundations Contrast hard gate |
| `../../../shared/register.md` | Register posture that sets color strategy and token density |

---

## 5. SOURCE METADATA

- Group: Color
- Playbook ID: FOUND-COLOR-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `color/contrast-pair-inventory-before-audit.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
