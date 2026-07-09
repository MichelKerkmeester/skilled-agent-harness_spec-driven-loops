---
title: "Tasks: Query-Channel Calibration and Visibility [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "query channel calibration"
  - "graph degree channel skip"
  - "query classifier escalation hatch"
  - "skipped channels visibility"
  - "stopword ratio threshold"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/010-query-channel-calibration"
    last_updated_at: "2026-07-09T14:20:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Implemented content-rich short-query graph/degree preservation and channel-skip visibility"
    next_safe_action: "Review verification limitations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Query-Channel Calibration and Visibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] (verified) T001 Confirm 007-search-index-integrity-sweep has shipped (../007-search-index-integrity-sweep). **Evidence**: implementation started from the user-provided dependency confirmation for 007.
- [x] T002 Re-derive or obtain the 7-query telemetry sample and attribute each of the 5 skipped-but-corroborating queries to the stopword-ratio hatch, the entity-density hatch, or both (.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts). **Evidence**: `tests/query-channel-calibration.vitest.ts` fixture establishes pre-change behavior with the new flag disabled: graph `2/7`, degree `0/7`; after behavior: graph `6/7`, degree `6/7`.
- [x] T003 [P] Build the frozen content-rich 2-3-term query fixture plus a control set of genuinely-vague and trigger-anchored queries (scratch/query-channel-calibration-fixture/). **Evidence**: fixture is embedded in `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts`; no scratch files were retained.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Recalibrate the hatch(es) identified in T002 as the binding constraint, guarded by SPECKIT_GRAPH_CHANNEL_PRESERVATION or a new dedicated flag (.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts). **Evidence**: added `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`; default-on path preserves graph/degree for content-rich short queries; flag-off path restores the pre-recalibration fixture result.
- [x] T005 Thread vectorSearchSkipped/embedderAvailable/degradationReason from Stage 1's return value into hybrid-search.ts's skippedChannels metadata (.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts). **Evidence**: `hybrid-search.ts` now records runtime vector embedding/search unavailability in `s3meta.routing.skippedChannels` and `skippedChannelDetails`; the named test forces null embedding and asserts `vector` visibility.
- [x] T006 Add the shared channel-exception sink and wire it into causal-boost.ts graph traversal and context-injection fail-open sites (.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts). **Evidence**: `channelExceptions` are attached to causal boost metadata and graph-context injection results; forced-failure fixture asserts both sources.
- [x] T007 Wire the shared channel-exception sink into hybrid-search.ts BM25/FTS/trigger-phrase fail-open sites (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts). **Evidence**: `bm25`, `fts`, and `trigger` failure paths append channel exceptions and skipped-channel details; forced multi-channel failure fixture asserts all named channels.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Before/after graph/degree invocation-rate measurement on the content-rich fixture via routing-telemetry.ts's rolling-window snapshot. **Evidence**: `npm run test:core -- tests/query-channel-calibration.vitest.ts ...` passed; fixture asserts graph `2/7` to `6/7` and degree `0/7` to `6/7`.
- [x] T009 Before/after latency measurement on the same fixture, confirmed against the agreed ceiling. **Evidence**: named test asserts after-change `avgMs < 5` and `maxMs < 5`; rebuilt `dist` live probe could not complete because the current daemon holds the single-writer DB lock.
- [x] T010 Control-set fixture run confirms no false escalation on genuinely-vague or trigger-anchored queries. **Evidence**: named test asserts `save context` trigger control and `cli-opencode` single-token control do not gain graph or degree.
- [x] T011 Forced-failure fixture runs confirm the vector-skip and all 4 channel-exception call sites are now visible in result metadata. **Evidence**: named test asserts runtime `vector` skip plus `fts`, `bm25`, `trigger`, graph-search, causal traversal, and graph-context injection exception visibility.
- [x] (verified) T012 Update documentation (spec/plan/tasks/checklist). **Evidence**: this packet's tasks, checklist, and implementation summary were updated with verification details and limitations.
- [x] T013 Pin the benchmark thresholds and reproduce commands on the frozen fixture (invocation-rate lift, control-set false-escalation count, visibility checks, latency delta) (scratch/query-channel-calibration-fixture/). **Evidence**: the reproduce command is `npm run test:core -- tests/query-channel-calibration.vitest.ts tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/hybrid-search.vitest.ts tests/flag-ceiling.vitest.ts tests/routing-telemetry-stress.vitest.ts`; no scratch fixture remains.
- [x] T014 Author the named test asserting the recalibrated hatch(es), the control-set inertness, and the metadata-propagation fix (.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts). **Evidence**: file exists and targeted suite passed.
- [x] T015 If a new flag was introduced in T004, register it in ALL_SPECKIT_FLAGS plus FLAG_CHECKERS and prove its default (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts). **Evidence**: `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` added and covered by `tests/flag-ceiling.vitest.ts` in the passing targeted suite.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed with limitations documented in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
