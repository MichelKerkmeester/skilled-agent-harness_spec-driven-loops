---
title: "PB-005: Audit Procedure Selection Proof"
description: "Verify audit mode selects the correct audit procedure card and disambiguates accessibility audit from AI-slop review."
version: 1.0.0.0
id: PB-005
expected_workflow_mode: audit
expected_leaf_resources: []
---

# PB-005: Audit Procedure Selection Proof

## 1. OVERVIEW

This scenario verifies that `audit` procedure-card selection is evidence-specific: accessibility and WCAG language selects `accessibility-audit.md`, while generic visual-language or AI-template risk selects `ai-slop-check.md`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A launch reviewer needs both accessibility and anti-slop review but must see which private audit card is selected for each prompt shape.

**Exact prompt**:
```text
audit: review this checkout screen for WCAG contrast, keyboard focus, and form accessibility. State the public sk-design mode, the internal procedure card you selected, and why it is not the AI-slop card.
```

**Expected mode resolution**: `audit`.

**Expected procedure card**: `design-audit/procedures/accessibility-audit.md`.

**Negative-control variant**: Change the prompt to `audit: review this hero section for generic AI-template visual language and model-tell decoration.` Expected card becomes `design-audit/procedures/ai-slop-check.md`.

**Why**:
- `design-audit/SKILL.md` maps accessibility, WCAG, contrast, keyboard, focus, forms, and release-readiness review to `procedures/accessibility-audit.md`.
- The same table maps AI-template risk, generic visual language, over-decoration, slop, or model-tell review to `procedures/ai-slop-check.md`.

**Expected tool surface**: read-only. Audit may inspect evidence but must not edit files.

## 3. TEST EXECUTION

### Preconditions

1. `design-audit/SKILL.md` contains `Procedure Card Selection` and `Context, Proof, And Direct Fallback`.
2. Both `design-audit/procedures/accessibility-audit.md` and `design-audit/procedures/ai-slop-check.md` exist.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB005-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture selected mode, card, rationale, evidence labels, tool calls, and response in `/tmp/skd-PB005-response.txt`.
4. Run the negative-control variant and confirm it selects `ai-slop-check.md`.

### Pass/Fail Criteria

- **PASS** iff accessibility/WCAG prompt selects `design-audit/procedures/accessibility-audit.md`, the negative-control prompt selects `design-audit/procedures/ai-slop-check.md`, both responses cite why the selected card fits, and no mutating tool is used.
- **FAIL** iff the audit card is omitted, both variants select the same card without evidence, an accessibility claim appears without evidence labels, or audit edits files.

### Failure Triage

1. Re-read `design-audit/SKILL.md` `Procedure Card Selection` request-shape rows.
2. Check whether the prompt accidentally mixes accessibility and AI-template terms; if mixed, require the response to choose one primary card and name secondary concerns.
3. Compare tool calls with the audit read-only fallback contract.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-audit/procedures/accessibility-audit.md`
- `.opencode/skills/sk-design/design-audit/procedures/ai-slop-check.md`
- `.opencode/skills/sk-design/mode-registry.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
