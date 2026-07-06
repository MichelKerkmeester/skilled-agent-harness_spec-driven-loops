---
title: Audit Procedure Card Selection Proof Scenario
description: Manual scenario verifying audit selects accessibility or AI-slop procedure cards according to evidence shape.
trigger_phrases:
  - "test audit procedure cards"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_SELECTION
expected_resources:
  - SKILL.md
  - procedures/accessibility_audit.md
  - procedures/ai_slop_check.md
---

# AUDIT-PROCCARD-001 | Audit Procedure Card Selection Proof

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `AUDIT-PROCCARD-001`.

**Exact prompt**

```text
audit: run accessibility and AI-slop review variants. For each, state the public mode, selected private procedure card, proof line, and why the other card does not own this variant.
```

---

## 1. OVERVIEW

This scenario validates the two audit-owned private cards: `procedures/accessibility_audit.md` for accessibility/WCAG/release-readiness evidence, and `procedures/ai_slop_check.md` for generic visual language, AI-template risk, over-decoration, or model-tell review.

### Why This Matters

Audit card selection changes the evidence bar. Accessibility review needs contrast, semantics, keyboard/focus, form, and unresolved-confirmation proof; AI-slop review needs pattern evidence, severity, owner, and concrete fix direction.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm audit selects the correct private card for accessibility versus AI-slop request shapes.
- Real user request: `Review the same checkout flow once for accessibility and once for generic AI-template risk.`
- Prompt: `audit: run accessibility and AI-slop review variants. For each, state the public mode, selected private procedure card, proof line, and why the other card does not own this variant.`
- Expected execution process: Read `SKILL.md`; run one accessibility/WCAG variant and one AI-slop/generic visual-language variant; capture selected card, evidence labels, dimensions covered, and what remains not assessed.
- Expected signals: Accessibility variant selects `procedures/accessibility_audit.md`; AI-slop variant selects `procedures/ai_slop_check.md`; both remain public mode `audit` and read-only.
- Desired user-visible outcome: Two card-selection results with evidence-specific proof and no card conflation.
- Pass/fail: PASS if both owned cards are selected correctly and proof lines explain disambiguation; FAIL if both variants select one card without rationale or if audit edits files.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AUDIT-PROCCARD-001 | Audit card selection | Cover both audit-owned card rows | `audit: run accessibility and AI-slop review variants. For each, state the public mode, selected private procedure card, proof line, and why the other card does not own this variant.` | grep table in `SKILL.md` -> agent: run accessibility variant -> agent: run AI-slop variant -> inspect selected cards | Accessibility selects `accessibility_audit.md`; AI-slop selects `ai_slop_check.md`; evidence labels precede claims | Transcript, selected-card matrix, proof lines, evidence labels | PASS if both owned rows are covered with correct disambiguation; FAIL if omitted/wrong/mutating | 1. Re-read `SKILL.md` rows 293-299; 2. Check prompt vocabulary; 3. Confirm audit remains read-only |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Audit procedure table and direct proof contract |
| `../../procedures/accessibility_audit.md` | Accessibility audit procedure |
| `../../procedures/ai_slop_check.md` | AI-slop review procedure |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: AUDIT-PROCCARD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--procedure-card-contract/card-selection-proof.md`
