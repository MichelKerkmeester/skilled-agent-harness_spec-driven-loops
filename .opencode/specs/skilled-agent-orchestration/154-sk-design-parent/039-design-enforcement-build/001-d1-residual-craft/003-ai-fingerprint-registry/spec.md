---
title: "D1-R3 — Per-model AI tells: audit has only a human catalog"
description: "Add design-audit/assets/ai_fingerprint_registry.json plus a generated self-defect card and a validator that fails catalog tells lacking a registry row/fixture."
trigger_phrases:
  - "d1-r3 ai fingerprint registry"
  - "ai tell registry design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R3 — Per-model AI tells: audit has only a human catalog

## 1. OBJECTIVE
Give the audit mode a structured per-model AI-tell registry plus a generated self-defect card, matching the two enforceable layers impeccable already has, so tells are machine-checkable rather than a prose catalog.

## 2. WHY
impeccable has two enforceable layers for AI tells; audit has only a human catalog, so audit tells cannot be validated or bound to fixtures.

## 3. TARGET & CLASS
- **Target file(s):** `design-audit/assets/ai_fingerprint_registry.json`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add `design-audit/assets/ai_fingerprint_registry.json` (tell_id, model_family, self_defect_prompt, deterministic_check, fixture_id, severity_floor, owner).
- Generate a self-defect card from the registry.
- Validator fails any catalog tell lacking a registry row or fixture.
- **Candidate nested sub-phases (materialize at execution):** registry JSON schema + rows / validator + generated self-defect card

## 5. ACCEPTANCE
- Validator fails when a catalog tell has no matching registry row/fixture (deterministic). Whether a model internalizes the card stays advisory.

## 6. EVIDENCE
- `skill/SKILL.src.md:101` — impeccable's enforceable AI-tell layer that audit lacks.
- Source: `research/research.md` §4 (D1-R3)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
