---
title: "Implementation Summary: Benchmark — Compiled Lane C Parity"
description: "Completion record for the non-frozen compiled Lane C parity harness. Implemented and committed in 8532c4b64b: compiled-routing-parity.cjs, the orchestrator hooks, the qualifiedIdToLeaf shape bridge, the vacuous-parity guard, and the flag-state/verdict-substate matrices — the frozen scorer trio untouched (SHA-256 unchanged)."
trigger_phrases:
  - "compiled lane c parity implementation summary"
  - "benchmark parity delivered build record"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/004-benchmark-compiled-lane-c"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled delivery evidence to commit 8532c4b64b"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Lane C parity is implemented in the non-frozen harness at 8532c4b64b"
---
# Implementation Summary: Benchmark — Compiled Lane C Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — landed in `8532c4b64b`. The non-frozen `compiled-routing-parity.cjs` harness, its orchestrator hooks, the `qualifiedIdToLeaf` bridge, the vacuous-parity guard, and the flag-state/verdict-substate matrices are built; the three frozen scorer files stayed byte-identical (SHA-256 unchanged) and routing stays identical to legacy |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Not applicable — this child never changes serving authority; it is a benchmark/CI diagnostic that reads it |
| **Strict validation** | Rerun after the final metadata regeneration; the result is recorded at handoff |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Implemented and committed in `8532c4b64b`.** The non-frozen `compiled-routing-parity.cjs` harness now exercises the promoted compiled-routing closure and calls the frozen `evaluateRouteGold` evaluator without re-implementing it. It hard-fails vacuous parity unless the promoted hub manifest is compiled-serving, translates `targetQualifiedIds` through the shared `qualifiedIdToLeaf` boundary, preserves distinct compiled-serving/drifted/broken sub-verdicts, covers the full unset/`0`/`1`/invalid flag matrix, and names this lane as the single blocking drift-gate owner.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Harness | `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` | Non-frozen parity comparison, frozen-scorer pins, vacuous guard, translation, flag and sub-verdict logic |
| Orchestrator hooks | `.../skill-benchmark/run-skill-benchmark.cjs`, `.../skill-benchmark/build-report.cjs` | Attach/roll up parity, enforce the distinct blocking verdict, and render the JSON result |
| Shared bridge | `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | Added the shared `qualifiedIdToLeaf` reverse lookup |
| CLI wiring | `.../deep-improvement/scripts/shared/loop-host.cjs` | Forwards `--compiled-routing-parity` to the benchmark runner |
| Verification | `.../skill-benchmark/tests/compiled-routing-parity.vitest.ts` | Covers frozen pins, vacuous guard, all-hub bijection, flag states, sub-verdicts, rendering, and default-off behavior |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness reads the promoted hub manifest first and returns `vacuous` before comparison work when the hub is not compiled-serving. Eligible targets are translated through `qualifiedIdToLeaf` and judged by the unchanged frozen evaluator. `run-skill-benchmark.cjs` attaches per-row parity, rolls up the three distinct sub-verdicts, and maps blocking drift/breakage to `BLOCKED-BY-COMPILED-DRIFT`; `build-report.cjs` renders the populated `compiledRouting` block directly from JSON. `loop-host.cjs` forwards the opt-in flag, whose default remains off.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| The verdict sub-state lives in `run-skill-benchmark.cjs`, never `score-skill-benchmark.cjs` | The frozen scorer stays byte-identical; the non-frozen orchestrator owns verdict-to-exit-code mapping |
| `qualifiedIdToLeaf` landed in the shared `leaf-resource-contract.cjs`, not a local copy | One shared implementation prevents drift between the benchmark and the `sk-code` guard |
| The vacuous-parity guard reads the promoted hub manifest directly | The benchmark checks the same stable runtime artifact that would serve; it never reads the mutable spec tree |
| This packet will be the single named blocking drift-gate owner | F-25-8 — prevents two gates disagreeing, or neither blocking |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frozen scorer pins | Covered by the committed test against the real three files, including seeded drift and missing-file failures; end-of-reconciliation SHA-256 is checked separately |
| Vacuous-parity guard | Covered for all seven live manifests plus synthetic legacy and missing-manifest fixtures |
| `qualifiedIdToLeaf` bijection | Covered for every compiled route-gold target across the eligible hub manifests; unknown modes fail closed |
| Flag-state matrix | Covered for unset/`0`/`1`/invalid as four distinct states |
| Verdict sub-state | Covered for compiled-serving, legacy-fallback-drifted, and broken-compiled-path without OR-collapse |
| Report rendering | Covered for a populated JSON-derived block and omission when parity did not run |
| Default-off behavior | Covered: parity is disabled unless the operator opts in |
| Commit evidence | All implementation and tests above landed in `8532c4b64b` |

## Milestone Status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M0 readiness | Done | Promoted runtime and frozen-scorer pins available before `8532c4b64b` |
| M1 harness + bridge | Done | Parity harness and `qualifiedIdToLeaf` landed in `8532c4b64b` |
| M2 orchestration | Done | Row attach, rollup, blocking verdict, report renderer, and loop-host forwarding landed |
| M3 verification | Done | Comprehensive parity Vitest file landed with the implementation |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Parity is opt-in and diagnostic.** `--compiled-routing-parity` defaults off; this child does not change serving authority or enable compiled routing for any hub.
2. **No live default-on canary ran here.** The harness proves the lane and safety classifications, while the actual canary/cutover remains operator-gated in P4/011.
3. **The frozen scorer remains an external authority.** The harness imports it read-only and aborts on any digest drift; it deliberately cannot repair or rewrite the scorer.

<!-- /ANCHOR:limitations -->

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Harness, orchestrator integration, shared shape bridge, renderer, and verification suite landed in `8532c4b64b`.
- [ ] Exercise the opt-in lane during the operator-gated P4/011 canary after the coverage-closure join gate is green.
- [ ] Keep the repository default off until that operator decision; this packet provides evidence but never performs the flip.

<!-- /ANCHOR:follow-up -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

The final harness reads the promoted runtime manifests delivered by `002`, not the mutable spec-tree copy described in the original plan. The safety intent is unchanged and stronger: the parity lane observes what would actually serve. The implementation also added a dedicated Vitest suite in the same commit. No frozen scorer or live routing file changed.

<!-- /ANCHOR:deviations -->
