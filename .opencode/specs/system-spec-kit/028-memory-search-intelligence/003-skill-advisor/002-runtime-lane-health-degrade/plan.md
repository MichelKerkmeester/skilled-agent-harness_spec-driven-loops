---
title: "Implementation Plan: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "Baseline-first, P0-prerequisite-first sequencing for the advisor graceful-degradation unit: capture the confidence baseline, build the runtime per-lane health signal, then elide only runtime-degraded lanes from liveTotal (C5), surface the degraded-lane list (C5a), and extend the ambiguity/abstention explanation (AMB). Single-skill seam, S-effort, reversible, default-inert on the happy path."
trigger_phrases:
  - "advisor lane health degrade plan"
  - "C5 liveTotal elision sequencing"
  - "advisor confidence baseline first"
  - "degrade to remaining advisor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T08:19:43Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented the runtime lane-health degrade plan and recorded baseline evidence"
    next_safe_action: "Run final strict validation and keep packet 030 untouched"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-002-runtime-lane-health-degrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | Skill Advisor 5-lane fusion scorer (`lib/scorer/fusion.ts`, `lane-registry.ts`) |
| **Storage** | skill-graph.sqlite (projection); embeddings cache (semantic-shadow lane) |
| **Testing** | vitest |

### Overview
This is a graceful-degradation unit, not a single fix. The confirmed bug is that `liveTotal` (`fusion.ts:343-345`) sums registry-static live weights filtered only by the config `disabled` set, so a lane that runs but returns `[]` at runtime keeps its weight in the denominator and skews every survivor's `liveNormalized = score / liveTotal` (`fusion.ts:388`) uniformly downward [CONFIRMED: iter-003 F5/F7]. The naive fix — drop any empty lane — is unsafe: without a runtime health signal it cannot tell a degraded-empty lane (mid-rebuild) from a matched-nothing-empty lane, and would over-credit non-matching skills, a skew OPPOSITE the bug [CONFIRMED: synthesis 01-go-candidates.md:103; iter-014 G14-03; iter-016 J16-01]. The shipped sequence is **baseline → lane-health signal → C5 (elide degraded only) → C5a (surface) → AMB (explain)**. The prior unmeasured skew claim is replaced by the measured fixture: confidence `0.6060 -> 0.6189` (`+0.0129`) and `liveNormalized 0.1600 -> 0.1839`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (C5/C5a/AMB + P0 lane-health + baseline)
- [x] Success criteria measurable (degrade-to-remaining vs over-credit distinguished; happy path byte-identical)
- [x] P0 prerequisite identified (runtime per-lane health signal the scorer lacks)
- [x] Confidence baseline captured (REQ-001 — measured confidence `0.6060 -> 0.6189`, delta `+0.0129`)

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-001..003)
- [x] Tests passing (degrade-vs-matched-nothing fixtures + happy-path byte-identical assertion)
- [x] Docs updated (spec/plan/tasks/checklist; the prior unmeasured skew claim replaced)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-process graceful-degrade, mirroring aionforge "degrade to the remaining live signals" + `embedder_available:false` reporting, applied to the advisor's normalization denominator. This is the in-process sibling of the spine Code Graph already lives (the `memory-context.ts:1513` graph-unavailable degrade) and the daemon exit-75 retryable-unavailability discipline [CONFIRMED: roadmap.md:85,92,95].

### Key Components
- **Runtime lane-health signal (P0)**: classes each lane per call as `healthy` / `runtime_degraded` / `matched_nothing`. Derived from runtime score-presence (`laneScores[lane].length` / `scores.graph_causal`) AND a degraded/rebuild state — NOT from the config `disabled` set or the registry-static `isLiveScorerLane` filter. Must be call-scoped: iter-016 warns the per-lane signal "collapses to identical workspace-wide totals when `laneAttributionBySkill` is empty" [CONFIRMED: iter-016 J16-01].
- **C5 — `liveTotal` (`fusion.ts:343-345`)**: filter is widened from `!disabled.has(lane)` to also exclude `runtime_degraded` lanes; `matched_nothing` lanes STAY in the denominator. `liveNormalized` then degrades-to-remaining.
- **C5a — explanation/metrics (`fusion.ts:535-536`)**: the existing `metrics.liveLaneCount` (registry-derived: `isLiveScorerLane && !disabled`) is corrected/complemented to reflect runtime degradation, plus a per-call degraded-lane list.
- **AMB — ambiguity/abstention surface (`fusion.ts:484-513`)**: report the degraded-lane condition alongside the existing ambiguity reason without changing the abstention threshold semantics.

### Data Flow
Prompt → `buildLaneScores` → per-lane runtime health classification → C5 `liveTotal` = Σ weights over `{healthy, matched_nothing}` lanes (degraded excluded) → `liveNormalized = score / liveTotal` (degrade-to-remaining) → recommendations carry the degraded-lane list (C5a) and the ambiguity/abstention surface reports degradation (AMB). When no lane is degraded, the filter set is unchanged and the flow is byte-identical to baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a degrade/normalization fix touching a confidence-bearing output and the public explanation, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fusion.ts:343-345` `liveTotal` | Sums registry-static live weights, config-`disabled`-filtered only | Update — also exclude `runtime_degraded` lanes; keep `matched_nothing` lanes in | Degrade fixture: degraded lane elided (confidence rises to degrade-to-remaining); zero-match fixture: lane retained (no over-credit) |
| `fusion.ts:388` `liveNormalized` | `score / liveTotal` feeds confidence | Unchanged formula; denominator now degrade-aware | Baseline before/after confidence delta recorded (REQ-001) |
| `fusion.ts:535-536` `metrics.liveLaneCount` | Registry-derived live-lane count (`isLiveScorerLane && !disabled`) | Update — make runtime-accurate + add degraded-lane list (C5a) | Explanation shows degraded lane on a degraded call |
| `fusion.ts:484-513` ambiguity/abstention | TASK_INTENT/breadth/multi-concern regexes for abstention | Update — report degradation alongside the ambiguity reason (AMB); thresholds unchanged | Abstention semantics unchanged on the healthy path; degradation legible on a degraded call |
| `lane-registry.ts` per-lane shape | `live` / weights / shadow weights | Update only if the health flag is registry-keyed; default weights UNCHANGED | Default weights byte-identical (no re-weighting) |

Required invariant: the all-lanes-healthy path is byte-identical (the degrade branch is inert), and a `matched_nothing` lane is NEVER elided (no over-credit of non-matching skills).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline + Prerequisite (P0 — HARD GATE)
- [x] Capture the confidence baseline: representative prompt `alpha routing surface nearby neutral words`; confidence `0.6060 -> 0.6189`; `liveNormalized 0.1600 -> 0.1839`; delta `+0.0129` (REQ-001)
- [x] Build the runtime per-lane health signal (`healthy` / `runtime_degraded` / `matched_nothing`), call-scoped, from runtime score-presence + rebuild/health state (REQ-002)

### Phase 1: C5 Elision
- [x] Widen the `liveTotal` filter to exclude `runtime_degraded` lanes only; keep `matched_nothing` lanes in (REQ-003)
- [x] Prove `liveNormalized` degrades-to-remaining for a degraded lane and is unchanged for a zero-match lane

### Phase 2: C5a + AMB (legibility)
- [x] C5a: add the per-call degraded-lane list; make `metrics.liveLaneCount` runtime-accurate (REQ-005)
- [x] AMB: report the degraded condition on the ambiguity/abstention surface without changing thresholds (REQ-006)

### Phase 3: Verification
- [x] Degrade-vs-matched-nothing fixtures + all-lanes-healthy byte-identical assertion (SC-001..003)
- [x] `tsc` + targeted advisor suite green; mutation falsifier proved the C5 denominator test turns red if degraded lanes remain in `liveTotal`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline | Record before/after confidence with `graph_causal` runtime-empty (REQ-001) | vitest + fixture |
| Unit | Lane-health classifier: degraded vs matched-nothing vs healthy | vitest |
| Unit | C5 `liveTotal`: degraded lane elided; matched-nothing lane retained (no over-credit) | vitest |
| Regression | All-lanes-healthy output byte-identical to baseline | vitest |
| Legibility | C5a degraded-lane list + runtime live-lane count; AMB degradation in the abstention surface | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Confidence baseline capture (REQ-001) | Internal (this phase) | DONE | Measured in `tests/scorer/runtime-lane-health.vitest.ts`: confidence `0.6060 -> 0.6189`, delta `+0.0129` |
| Runtime per-lane health signal (REQ-002) | Internal-gap (this phase, P0) | DONE | Call-scoped scorer option + handler-owned stale graph signal; C5 consumes it only when the lane is degraded-empty |
| aionforge degrade-to-remaining / `embedder_available:false` reference | External doc | Reference only | Local `external/` tree was not present in this workspace; implementation follows the packet's degrade-to-remaining contract and does not depend on the external doc |
| C3 (shared RRF import) | Sibling 028/003 sub-phase | Independent | None — C5/C5a/AMB do not depend on the RRF determinism spine; off-path parallel track [CONFIRMED: iter-016 J16-01 "C3/C5/SA-asymmetric are off-path parallel"] |
| C4 / Beta posterior / SA-two-gate chain | Sibling 028/003 sub-phase | Out of scope | None — this unit ships before and independent of the C4 Phase-2/3 chain |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A degraded call now over-credits non-matching skills (the over-credit inversion), the happy path regresses, or confidence magnitudes shift in a way that breaks abstention/ambiguity downstream.
- **Procedure**: Revert the sub-phase commit(s) (branch-only; never pushed to main or deployed without explicit go). The change is a self-contained, additive scorer-seam edit; the degrade branch is inert when all lanes are healthy, so reverting restores the registry-static `liveTotal` exactly.
- **What still speaks the old contract**: any caller reading `metrics.liveLaneCount` gets the corrected runtime value after C5a — confirm no consumer keys on the old registry-derived count before shipping.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Baseline + lane-health) ──► Phase 1 (C5 elision) ──► Phase 2 (C5a + AMB) ──► Phase 3 (Verify)
        HARD GATE
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0: Baseline + lane-health signal | None | C5 elision (HARD GATE — REQ-001 + REQ-002) |
| Phase 1: C5 elision | Phase 0 | C5a/AMB, Verify |
| Phase 2: C5a + AMB | Phase 1 | Verify |
| Phase 3: Verify | Phase 1, Phase 2 | None |

C3 (shared RRF) and the C4/Beta chain are OFF-PATH parallel tracks — this unit does not depend on them [CONFIRMED: iter-016 J16-01].
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0: Baseline + lane-health signal | Med | 2-4 hours (baseline capture is the gating cost) |
| Phase 1: C5 elision | Low | 1-2 hours (filter-only change at `fusion.ts:343-345`) |
| Phase 2: C5a + AMB | Low | 1-2 hours (explanation/metrics + abstention surface) |
| Phase 3: Verification | Med | 2-3 hours (degrade-vs-matched-nothing fixtures + byte-identical assertion + adversarial review) |
| **Total** | | **S-effort overall (6-11 hours); research rates C5/C5a S** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confidence baseline captured and recorded (REQ-001) — without it C5 cannot ship
- [x] All-lanes-healthy byte-identical assertion green (the degrade branch is inert on the happy path)
- [x] No changed production consumer keys on the old registry-derived `metrics.liveLaneCount`; handler output adds prompt-safe `runtimeLaneHealth` only when degraded lanes exist

### Rollback Procedure
1. Revert the sub-phase commit(s) (branch-only; never pushed to main or deployed without explicit go).
2. The registry-static `liveTotal` is restored exactly — the change is additive and inert when healthy.
3. Re-run the advisor test suite + a smoke recommendation to confirm confidence magnitudes return to baseline.

### Data Reversal
- **Has data migrations?** No — pure scorer-seam logic, no schema/DB change.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
