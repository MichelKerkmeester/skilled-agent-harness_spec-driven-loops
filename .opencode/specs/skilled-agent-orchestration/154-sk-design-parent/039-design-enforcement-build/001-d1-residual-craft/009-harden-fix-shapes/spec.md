---
title: "D1-R9 — Harden fix-shapes not systematic in the matrix"
description: "Add a 'Fix shape to recommend' column to hardening_edge_cases.md, keeping the audit/implement boundary (recommend shape+owner; sk-code implements)."
trigger_phrases:
  - "d1-r9 harden fix shapes"
  - "harden fix shapes design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R9 — Harden fix-shapes not systematic in the matrix

## 1. OBJECTIVE
Add a recommended fix-shape column to the hardening matrix so each edge case names the shape of its fix and its owner without crossing the audit/implement boundary.

## 2. WHY
Fix shapes are not systematic in the harden matrix, so audits flag edge cases without a consistent recommended remedy.

## 3. TARGET & CLASS
- **Target file(s):** `hardening_edge_cases.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a `Fix shape to recommend` column to `hardening_edge_cases.md`.
- Keep the audit/implement boundary: recommend shape + owner; sk-code implements.

## 5. ACCEPTANCE
- Matrix check: each edge-case row carries a recommended fix shape and owner (deterministic shape); fix correctness stays with sk-code.

## 6. EVIDENCE
- `harden.md:30` — impeccable's systematic fix-shape pattern absent from the live matrix.
- Source: `research/research.md` §4 (D1-R9)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
