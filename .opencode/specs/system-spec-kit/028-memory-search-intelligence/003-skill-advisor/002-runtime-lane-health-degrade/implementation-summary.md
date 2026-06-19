---
title: "Implementation Summary: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "Re-plan stage record for the advisor graceful-degradation unit. NOT YET IMPLEMENTED — this summary documents the planned-but-unbuilt PENDING state so the spec folder validates at Level 2; it carries no completion claim."
trigger_phrases:
  - "advisor lane health degrade implementation summary"
  - "C5 C5a AMB status"
  - "advisor graceful degrade impl summary"
  - "runtime degraded lane elision status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded re-plan state (unit planned, not yet built)"
    next_safe_action: "Capture the confidence baseline (T001), then build the runtime lane-health signal (T002)"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-002-runtime-lane-health-degrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade |
| **Completed** | NOT YET — re-plan stage (planning only) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This document records the re-plan state: the advisor graceful-degradation unit has been scoped, sequenced, and grounded in the 028 research, but no code has changed. It is the standing summary you read when you resume this sub-phase, and it will be rewritten once the first candidate ships.

The unit you are about to build fixes a confirmed normalization skew in the Skill Advisor fusion scorer and makes the degrade legible. Today the scorer normalizes confidence against a `liveTotal` denominator built from registry-static live weights, filtered only by the config `disabled` set (`fusion.ts:343-345`); so when a lane runs but returns nothing at runtime — `graph_causal` during a skill-graph rebuild is the witnessed case — its weight stays in the denominator while no skill earns any contribution from it, and every survivor's confidence (`liveNormalized = score / liveTotal`, `fusion.ts:388`) is divided by an inflated denominator and skews uniformly downward. The naive fix is a trap: without a runtime health signal the scorer cannot tell a degraded-empty lane (mid-rebuild) from a matched-nothing-empty lane (it ran fine and matched nothing), and eliding the latter would over-credit non-matching skills — a skew opposite the bug. So the planned work captures a confidence baseline first (the often-quoted "~13%" is unsourced), builds the runtime per-lane health signal the scorer lacks, then C5 elides only runtime-degraded lanes, C5a surfaces the degraded-lane list, and AMB reports degradation on the ambiguity/abstention surface.

### Status snapshot

| Candidate | Status | Gate | Evidence |
|-----------|--------|------|----------|
| Runtime lane-health signal (P0 prereq) | PENDING | shared-infra-dep (internal-gap; scorer lacks it) | iter-014 G14-03; iter-016 J16-01 |
| Confidence baseline (P0) | PENDING | needs-benchmark (regression-baseline rule) | roadmap.md:218,262; BROADENING §2 |
| C5 — runtime-degraded lane elision (alias C5-advisor-lane-elision) | PENDING | needs-baseline + lane-health signal | roadmap.md:90; synthesis 01-go-candidates.md:103 |
| C5a — degraded-lane flag (alias C5a-advisor-degraded-lane-flag) | PENDING | pairs with C5 | iter-003 C5a; roadmap.md:91 |
| AMB — ambiguity/abstention explanation extension | PENDING | pairs with C5/C5a | deltas/iter-004.jsonl AMB rank 9 |

None of these shipped in Wave-0 (030): `git log 1ecc531431..ab5459fb6d` has no advisor/lane/C5 commit, 030 §14 has no advisor row, and 030 spec line 106 lists C5 explicitly as NO-GO until a baseline + lane-health signal exist.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered — planning only. The intended delivery path is the P0-first sequence in `plan.md`: Phase 0 (baseline capture + runtime lane-health signal, a HARD GATE), Phase 1 (C5 `liveTotal` filter widened to exclude only `runtime_degraded` lanes), Phase 2 (C5a degraded-lane list + runtime-accurate `liveLaneCount`; AMB abstention-surface reporting), Phase 3 (degrade-vs-matched-nothing fixtures + all-lanes-healthy byte-identical assertion + adversarial review refuting the over-credit inversion). All edits are confined to the advisor scorer (`fusion.ts`, possibly `lane-registry.ts`) plus tests; no schema or DB change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Baseline before any number.** The "~13% skew" is asserted, not measured (grep 0-match across `.opencode/specs` + `system-skill-advisor`); it is treated as UNKNOWN until REQ-001 measures it [CONFIRMED: roadmap.md:218,262].
- **Lane-health signal is a P0 prerequisite, not a nice-to-have.** Naive empty-lane elision over-credits non-matching skills (skew opposite the bug), so C5 is gated on the runtime `healthy`/`runtime_degraded`/`matched_nothing` classification [CONFIRMED: synthesis 01-go-candidates.md:103; iter-014 G14-03].
- **Default weights unchanged.** C5 is a denominator-filter change only; lane weights and the `liveNormalized` formula are untouched, so the all-healthy path is byte-identical.
- **C3/C4 are off-path.** The shared-RRF determinism spine (C3) and the Beta-posterior auto-tune chain (C4) are tracked in sibling 028/003 sub-phases; this unit does not depend on them [CONFIRMED: iter-016 J16-01].
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not verified — no code to verify. The planned gates are in `checklist.md`: P0 = baseline captured + the unsourced "~13%" removed + a `runtime_degraded` lane elided while a `matched_nothing` lane is retained + the all-healthy path byte-identical. Strict spec-folder validation (`validate.sh --strict`) passes for the planning docs; that is the only thing green at this stage.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skew magnitude UNKNOWN.** The confidence-skew magnitude is unmeasured until the baseline is captured (T001); do not cite "~13%".
2. **graph_causal-specific evidence.** Pass-1 evidence is `graph_causal`-specific; whether `runtime_degraded` should generalize to any transiently-empty lane (e.g. `semantic_shadow` during embedding reload) is an open question (INFERRED).
3. **Downstream confidence effects.** The effect of corrected confidence magnitudes on abstention/ambiguity/ranking ties must be re-validated, not assumed.
4. **Adjacent candidates out of scope.** C3 RRF, C4 Beta posterior + SA-two-gate chain, QCR query-class router, C1 split-conflict re-rank, and SA-asymmetric-deltas are explicitly out of scope here and tracked under sibling 028/003 sub-phases.
<!-- /ANCHOR:limitations -->
