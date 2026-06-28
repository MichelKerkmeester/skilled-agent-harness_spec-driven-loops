---
title: "D1-R12 — Live-variant numeric knobs not a transport-facing contract"
description: "Add sk-design/shared/assets/variant_parameter_contract.md defining the live-variant numeric knobs with ranges and owner modes, tested across Figma/Open Design/live."
trigger_phrases:
  - "d1-r12 variant parameter contract"
  - "variant parameter contract design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R12 — Live-variant numeric knobs not a transport-facing contract

## 1. OBJECTIVE
Codify the live-variant numeric knobs as a transport-facing contract with explicit ranges and owner modes, so Figma/Open Design/live consumers share one schema instead of ad-hoc knobs.

## 2. WHY
The live-variant numeric knobs are not a transport-facing contract, so each transport interprets density/scale/color knobs independently.

## 3. TARGET & CLASS
- **Target file(s):** `sk-design/shared/assets/variant_parameter_contract.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add `sk-design/shared/assets/variant_parameter_contract.md` with knobs: density 0.6–1.4, type-scale 0.85–1.3, color-amount 0–1 step .05, structure, pairing.
- Assign owner modes per knob.
- Test the contract across Figma / Open Design / live.
- **Candidate nested sub-phases (materialize at execution):** contract doc + ranges/owners / transport conformance tests

## 5. ACCEPTANCE
- Schema check: each knob is present with its range and owner mode (deterministic); whether the chosen values look right stays advisory.

## 6. EVIDENCE
- `layout.md:143` — impeccable's variant numeric knobs not yet a shared transport contract.
- Source: `research/research.md` §4 (D1-R12)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
