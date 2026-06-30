---
title: "Verification Checklist: D6-R3 — Lane C craft-stress fixtures"
description: "Verification checklist for growing the sk-design hubRoute corpus with three craft-stress fixture pairs while holding the 23/5/0 floor."
trigger_phrases:
  - "d6-r3 lane c craft fixtures checklist"
  - "craft stress fixtures verification"
  - "sk-design hubroute corpus checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/003-lane-c-craft-stress-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all items, add Fix Completeness section, recompute counts"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D6-R3 — Lane C craft-stress fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec deliverable confirmed: three craft-stress pairs (stateful-upload, dense-dashboard, locale-component) under `fixtures/sk-design/`
  - **Evidence**: all three surfaces shipped as T2 holdout + T1 derived twin (12 fixture files) under the sk-design fixture root
- [x] CHK-002 [P0] GROW-vs-SIBLING decision recorded as GROW `fixtures/sk-design/` (spec §6 EVIDENCE + homogeneous route-gold schema)
  - **Evidence**: spec/plan record GROW-in-place; new fixtures reuse the route-gold `expected` schema scored by the per-skill `hubRoute` stage
- [x] CHK-003 [P0] TRUE current baseline tally captured from the scorer/guard test on disk (not assumed); recorded as N pass / 5 known-gaps / 0 regressions
  - **Evidence**: on-disk baseline 28 routeRows / 23 pass / 5 known-gaps / 0 regressions captured before any edit
- [x] CHK-004 [P1] "proof fields" interpretation resolved (route-gold `expected` reading vs DESIGN_BOUNDARY_PROOF token) and recorded
  - **Evidence**: resolved to the route-gold `expected` block (`workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup`); no proof token; recorded in spec OPEN QUESTIONS
- [x] CHK-005 [P1] Per-surface workflow-mode bundle + `forbiddenWorkflowModes` derived from sk-design modes/register
  - **Evidence**: each surface's intended mode bundle + forbidden set derived from the sk-design modes and register dials

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each fixture is a valid public/private pair sharing one `scenarioId` (parses as JSON)
  - **Evidence**: all twelve fixture JSON files parse; each holdout/derived scenario pairs one public with one private half
- [x] CHK-011 [P0] Each public prompt passes `contamination-lint.cjs` — domain language only, no skill id / triggers / mode names / resource basenames / commands
  - **Evidence**: every new public prompt clean under `contamination-lint.cjs`
- [x] CHK-012 [P0] Private gold uses the route-gold schema (`workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`) consistent with the existing corpus
  - **Evidence**: each private fixture carries the route-gold `expected` block; corpus stays homogeneous
- [x] CHK-013 [P1] `tier` set correctly (T2 holdout `blindToRouterKeywords: true`; T1 derived paraphrased + decontaminated)
  - **Evidence**: three T2 holdouts blind to router keywords; three T1 derived twins paraphrased + decontaminated

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each fixture admits to exactly one router key; gold set to clean-pass OR `knownRouteGap: true` per router replay
  - **Evidence**: router-replay confirms each of the six new scenarios admits to one key; all set to clean-pass
- [x] CHK-021 [P0] NO REGRESSION: prior 23 pass rows still pass; 5 known-gaps unchanged; `hubRoute.regressions === 0`; gate `failed === false`
  - **Evidence**: prior 23 still pass; 5 known-gaps unchanged; `regressions===0`; no prior gold row flipped
- [x] CHK-022 [P0] Headline guard test numerics reconciled to new totals and passing (`design-token-lint.vitest.ts` route-gold guard)
  - **Evidence**: guard updated `toHaveLength(28)→(34)`, `passed.toBe(23)→(29)`; recomputed via the vitest aggregate path as 34/29/5/0
- [x] CHK-023 [P0] Full skill-benchmark vitest suite green (`scripts/skill-benchmark/tests/*.vitest.ts`)
  - **Evidence**: full suite green against the grown corpus
- [x] CHK-024 [P1] T1↔T2 circularity meter published and within authoring bounds (large gap logged as a corpus finding, not silently passed)
  - **Evidence**: T1↔T2 score-gap meter computed and within authoring bounds; no large-gap finding raised

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Every spec acceptance criterion is met
  - **Evidence**: SC-001/002/003 hold — 34/29/5/0 recomputed, +6 rows/+6 passes, every new fixture parses, scope clean
- [x] CHK-061 [P0] The corpus growth holds the no-regression invariant (not just adds rows)
  - **Evidence**: the six new scenarios only added to the pass bucket; `regressions===0`; the prior floor is intact
- [x] CHK-062 [P1] No partial port — all three named surfaces delivered (no missing surface)
  - **Evidence**: stateful-upload, dense-dashboard, locale-component each ship a T2 holdout + T1 derived twin (6/6 fixtures)
- [x] CHK-063 [P1] Rollback path validated as clean
  - **Evidence**: additive static JSON + a single guard numeric; removal of the new pairs + reverting `34/29`→`28/23` restores the prior floor

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] EVERGREEN [HARD]: no spec IDs/paths embedded in any fixture (`039`, `D6-R3`, `.opencode/specs`, packet/phase numbers) — grep confirms none
  - **Evidence**: evergreen scan of all twelve new fixtures clean — no spec ID, phase number, or spec path
- [x] CHK-031 [P1] Private gold never referenced from a public half (dispatch boundary intact)
  - **Evidence**: each public half carries dispatch material only; the private gold is scorer-only and unreferenced from the public

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized; status advanced from `planned` to executed state
  - **Evidence**: spec/plan/tasks/checklist all `status: complete`; spec upgraded to the Level 2 contract
- [x] CHK-041 [P1] FIX-COMPLETENESS: all three named surfaces delivered (no partial set); every authored task `[x]` with no orphaned `[B]`
  - **Evidence**: three surfaces × (T2 holdout + T1 derived) delivered; every task `[x]`; no `[B]` blocked task remains
- [x] CHK-042 [P2] New scenarios reflected in the fixtures README if it enumerates corpus contents
  - **Evidence**: the fixtures dir has no enumerating README to update; corpus contents are derived from the fixture files themselves

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All new files land under `fixtures/sk-design/` only; no stray files elsewhere
  - **Evidence**: all twelve new fixtures under `fixtures/sk-design/`; the only other edit is the guard assertion in `design-token-lint.vitest.ts`
- [x] CHK-051 [P1] Additive-only change — no prior fixture file mutated; scratch/temp artifacts removed
  - **Evidence**: existing fixtures, `score-skill-benchmark.cjs`, and `router-replay.cjs` untouched; no scratch artifacts left

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification against the grown sk-design route-gold corpus and the reconciled headline guard)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
