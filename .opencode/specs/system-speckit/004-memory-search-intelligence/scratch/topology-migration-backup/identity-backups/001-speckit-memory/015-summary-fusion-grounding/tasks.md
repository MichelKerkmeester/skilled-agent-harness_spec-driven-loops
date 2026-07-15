---
title: "Tasks: Summary Fusion and World-Summary Grounding"
description: "Task breakdown for promoting built community/summary evidence into a first-class weighted RRF lane (retiring the two legacy inject paths) and adding a two-tier world-summary grounding prelude, shadow-gated and baseline-validated."
trigger_phrases:
  - "fused summary channel tasks"
  - "summary rrf lane tasks"
  - "world summary grounding tasks"
  - "summary fusion baseline tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding"
    last_updated_at: "2026-07-04T17:51:04.196Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented default-off code and unit tests, benchmark/schema gates pending"
    next_safe_action: "Run final broad verification, then capture benchmark deltas before promotion."
    blockers:
      - "T001/T014/T024 require a live benchmark delta, explicitly out of scope for this turn."
      - "T015 requires a persistent hierarchy schema migration, explicitly out of scope for this turn."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    completion_pct: 70
    open_questions:
      - "Final fused-lane RRF weight (resolved by the baseline-and-delta retune)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Summary Fusion and World-Summary Grounding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> **Status note**: `MEM-fused-summary-channel` is implemented as default-off shadow code. `CG-global-context-summary-hierarchy` has a read-only default-off prelude over existing summaries, but its persistent hierarchy remains pending because it requires schema migration.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the pre-change retrieval baseline (precision/recall/order) on the ~1000-memory corpus [45m]. LEFT PENDING: live benchmark/reindex/scan was explicitly out of scope.
- [x] T002 Read the five hardcoded channel-list sites (`hybrid-search.ts:1310,:951`, `query-router.ts:36,:68,:74,:106-107`, `routing-telemetry.ts:17`) [15m]
- [x] T003 Read the RRF `lists.push` fusion site (`hybrid-search.ts:~1394-1495`) and the adaptive-weight model (`artifact-routing.ts`) [15m]
- [x] T004 [P] Read both legacy inject paths: community fallback (`memory-search.ts:1158-1228`) + summary stage-1 inject (`stage1-candidate-gen.ts:~1304-1326`) [15m]
- [x] T005 [P] Read `searchCommunities` (`community-search.ts:101`), `querySummaryEmbeddings` (`memory-summaries.ts:213`) and the flat summaries index [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fused Summary/Community Lane

- [x] T006 Add `summary`/`community` to the `ChannelName` union (`query-router.ts:36`) [10m]
- [x] T007 Update all hardcoded channel-list sites to include the new channel (`query-router.ts:68,:74,:106-107`, `routing-telemetry.ts:17`, `hybrid-search.ts:1310,:951`) [25m]
- [x] T008 Add a default-off shadow flag for the fused lane (`search-flags.ts`) [10m]
- [x] T009 Adapt `searchCommunities` + `querySummaryEmbeddings` output into the fused ranked-list shape (`community-search.ts`, `memory-summaries.ts`) [30m]
- [x] T010 Push the fused lane into the RRF fusion site behind the shadow flag (`hybrid-search.ts:~1394-1495`) [30m]
- [x] T011 Retire the community weak-result post-pipeline fallback inject (`memory-search.ts:1158-1228`) [20m]
- [x] T012 Retire/redirect the summary stage-1 candidate inject into the lane (`stage1-candidate-gen.ts:~1304-1326`) [20m]
- [x] T013 Add a per-channel weight slot for the lane in the adaptive-weight model (`artifact-routing.ts`) [25m]
- [ ] T014 Re-tune the ablation-derived RRF weights perturbed by the new lane against the captured baseline [40m]. LEFT PENDING: benchmark acceptance was explicitly out of scope.

### World-Summary Grounding Prelude

- [ ] T015 Build the two-tier world-summary hierarchy (root world-summary + top-k subsections) (`memory-summaries.ts`) [40m]. LEFT PENDING: persistent hierarchy/index requires schema migration.
- [x] T016 Add a prelude provider that selects the relevant hierarchy slice (`memory-summaries.ts`) [25m]
- [x] T017 Add a default-off shadow flag for the grounding prelude (`search-flags.ts`) [10m]
- [x] T018 Prepend the coarse-to-fine prelude before retrieved context behind the flag (`handlers/memory-context.ts`) [25m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Add a lane-fusion test (lane contributes ranked, weighted) (`tests/**`) [25m]
- [x] T020 Add a double-count-avoidance test (evidence counted exactly once after inject-path retirement) (`tests/**`) [25m]
- [x] T021 Add a weight-wiring test (per-channel slot applied) (`tests/**`) [15m]
- [x] T022 Add a grounding-prelude test (prelude prepended coarse-to-fine) (`tests/**`) [20m]
- [ ] T023 Add a flags-off no-op test (recall serialization byte-identical to baseline) (`tests/**`) [20m]. LEFT PENDING: byte-identical recall proof requires the T001 baseline. Unit coverage verifies default-off routing/cache identity only.
- [ ] T024 Report the shadow before/after retrieval delta vs the T001 baseline [20m]. LEFT PENDING: live benchmark/reindex/scan was explicitly out of scope.
- [x] T025 Run `npx tsc --noEmit` from the MCP server directory [10m]
- [x] T026 Run the requested vitest suites and record exact counts [20m]. Evidence: broad related slice passed 15 files, 1 skipped. 455 tests passed, 13 skipped.
- [x] T027 Run strict spec validation for this phase [10m]. Evidence: `validate.sh --strict` passed with 0 errors, 0 warnings.
- [x] T028 Run changed-code comment-hygiene checks [10m]. Evidence: Python hygiene checker passed on changed code files. Explicit comment grep found no banned artifact IDs or spec paths.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] The pre-change baseline is captured and the post-change delta shows no regression on primary recall order. Pending: live benchmark/reindex/scan out of scope.
- [x] Summary/community is a first-class weighted RRF lane with both legacy inject paths retired (single-count test passes).
- [x] The world-summary grounding prelude prepends coarse-to-fine before retrieved context.
- [ ] Both candidates are default-off shadow-gated, flags-off is byte-identical to baseline. Pending: byte-identical proof requires the T001 baseline.
- [x] No live `mcp_server/database/**` shard or host daemon was used.
- [x] Final TypeScript, requested tests, strict spec validation and comment-hygiene checks pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Spec**: See `../spec.md`.
- **Source research**: `../../research/roadmap.md`, `../../research/synthesis/06-memory-systems-findings.md`.
<!-- /ANCHOR:cross-refs -->
