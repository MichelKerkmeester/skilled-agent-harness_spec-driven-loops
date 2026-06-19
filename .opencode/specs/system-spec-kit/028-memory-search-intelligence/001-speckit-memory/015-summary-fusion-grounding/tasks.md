---
title: "Tasks: Summary Fusion and World-Summary Grounding"
description: "Task breakdown for promoting built community/summary evidence into a first-class weighted RRF lane (retiring the two legacy inject paths) and adding a two-tier world-summary grounding prelude, shadow-gated and baseline-validated. All tasks pending — neither candidate shipped in the Wave-0 record."
trigger_phrases:
  - "fused summary channel tasks"
  - "summary rrf lane tasks"
  - "world summary grounding tasks"
  - "summary fusion baseline tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown; all tasks pending"
    next_safe_action: "Start T001 — capture the retrieval baseline."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    completion_pct: 0
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

> **Status note**: Both candidates (`MEM-fused-summary-channel`, `CG-global-context-summary-hierarchy`) are PENDING — neither appears in the Wave-0 shipped record (`030-memory-search-intelligence-impl/spec.md` §14). All tasks below are unchecked.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the pre-change retrieval baseline (precision/recall/order) on the ~1000-memory corpus [45m]
- [ ] T002 Read the five hardcoded channel-list sites (`hybrid-search.ts:1310,:951`; `query-router.ts:36,:68,:74,:106-107`; `routing-telemetry.ts:17`) [15m]
- [ ] T003 Read the RRF `lists.push` fusion site (`hybrid-search.ts:~1394-1495`) and the adaptive-weight model (`artifact-routing.ts`) [15m]
- [ ] T004 [P] Read both legacy inject paths: community fallback (`memory-search.ts:1158-1228`) + summary stage-1 inject (`stage1-candidate-gen.ts:~1304-1326`) [15m]
- [ ] T005 [P] Read `searchCommunities` (`community-search.ts:101`), `querySummaryEmbeddings` (`memory-summaries.ts:213`), and the flat summaries index [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fused Summary/Community Lane

- [ ] T006 Add `summary`/`community` to the `ChannelName` union (`query-router.ts:36`) [10m]
- [ ] T007 Update all hardcoded channel-list sites to include the new channel (`query-router.ts:68,:74,:106-107`; `routing-telemetry.ts:17`; `hybrid-search.ts:1310,:951`) [25m]
- [ ] T008 Add a default-off shadow flag for the fused lane (`search-flags.ts`) [10m]
- [ ] T009 Adapt `searchCommunities` + `querySummaryEmbeddings` output into the fused ranked-list shape (`community-search.ts`, `memory-summaries.ts`) [30m]
- [ ] T010 Push the fused lane into the RRF fusion site behind the shadow flag (`hybrid-search.ts:~1394-1495`) [30m]
- [ ] T011 Retire the community weak-result post-pipeline fallback inject (`memory-search.ts:1158-1228`) [20m]
- [ ] T012 Retire/redirect the summary stage-1 candidate inject into the lane (`stage1-candidate-gen.ts:~1304-1326`) [20m]
- [ ] T013 Add a per-channel weight slot for the lane in the adaptive-weight model (`artifact-routing.ts`) [25m]
- [ ] T014 Re-tune the ablation-derived RRF weights perturbed by the new lane against the captured baseline [40m]

### World-Summary Grounding Prelude

- [ ] T015 Build the two-tier world-summary hierarchy (root world-summary + top-k subsections) (`memory-summaries.ts`) [40m]
- [ ] T016 Add a prelude provider that selects the relevant hierarchy slice (`memory-summaries.ts`) [25m]
- [ ] T017 Add a default-off shadow flag for the grounding prelude (`search-flags.ts`) [10m]
- [ ] T018 Prepend the coarse-to-fine prelude before retrieved context behind the flag (`handlers/memory-context.ts`) [25m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Add a lane-fusion test (lane contributes ranked, weighted) (`tests/**`) [25m]
- [ ] T020 Add a double-count-avoidance test (evidence counted exactly once after inject-path retirement) (`tests/**`) [25m]
- [ ] T021 Add a weight-wiring test (per-channel slot applied) (`tests/**`) [15m]
- [ ] T022 Add a grounding-prelude test (prelude prepended coarse-to-fine) (`tests/**`) [20m]
- [ ] T023 Add a flags-off no-op test (recall serialization byte-identical to baseline) (`tests/**`) [20m]
- [ ] T024 Report the shadow before/after retrieval delta vs the T001 baseline [20m]
- [ ] T025 Run `npx tsc --noEmit` from the MCP server directory [10m]
- [ ] T026 Run the requested vitest suites and record exact counts [20m]
- [ ] T027 Run strict spec validation for this phase [10m]
- [ ] T028 Run changed-code comment-hygiene checks [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] The pre-change baseline is captured and the post-change delta shows no regression on primary recall order.
- [ ] Summary/community is a first-class weighted RRF lane with both legacy inject paths retired (single-count test passes).
- [ ] The world-summary grounding prelude prepends coarse-to-fine before retrieved context.
- [ ] Both candidates are default-off shadow-gated; flags-off is byte-identical to baseline.
- [ ] No live `mcp_server/database/**` shard or host daemon was used.
- [ ] Final TypeScript, requested tests, strict spec validation, and comment-hygiene checks pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Spec**: See `../spec.md`.
- **Source research**: `../../research/roadmap.md`, `../../research/synthesis/06-memory-systems-findings.md`.
<!-- /ANCHOR:cross-refs -->
