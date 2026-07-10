---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status IMPLEMENTED with verification limitations. Content-rich short-query graph/degree preservation and channel-skip visibility are built and covered by targeted tests."
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
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-query-channel-calibration |
| **Status** | IMPLEMENTED, verification-limited |
| **Completed** | Packet scope implemented; package-wide full-suite gates still have unrelated failures |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the query-channel calibration and visibility fix.

### Query-Channel Calibration and Visibility

The shipped change keeps content-rich 2-3 term queries in the `simple` tier but preserves graph and degree channels for them when the dedicated flag is enabled. The flag is HELD at default-OFF (opt-in): the 2026-07-09 audit found the earlier default-on wording here contradicted both the code and ENV_REFERENCE, and graduation is deferred until the now-shipped response-path wiring has a production-path benchmark behind it. Single-token lookups and trigger-anchored controls remain on the narrow fast path.

Runtime channel visibility is additive. The existing `s3meta.routing.skippedChannels: string[]` shape is preserved, while `skippedChannelDetails` and `channelExceptions` provide structured reasons for planned skips, runtime skips, and fail-open exceptions.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-exceptions.ts` | Added | Shared channel exception type/helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Added `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Modified | Added content-rich short-query signal |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modified | Preserves graph/degree for content-rich short queries and records routing reasons |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified | Adds runtime vector skip metadata and channel-exception propagation for vector, BM25, FTS, trigger, graph, and degree paths |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modified | Adds graph traversal and graph-context injection exception metadata |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Modified | Adds Stage 2 channel-exception metadata type |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | Propagates causal channel exceptions into Stage 2 metadata |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts` | Added | Named fixture for invocation-rate, latency, controls, vector skip, and channel exceptions |
| Existing routing/search tests | Modified | Updated expectations and flag registry coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as a minimal additive routing/metadata change. No new persistence path, database schema, or response-field removal was introduced.

The content-rich path is guarded by `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`. Setting it to `false` returns the fixture to pre-recalibration behavior without restarting the process.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Decision | Why |
|----------|-----|
| Keep content-rich short queries in `simple` tier | Avoids broad tier escalation while restoring graph/degree for the specific query shape shown to benefit |
| Add a dedicated rollback flag | Allows disabling only the new calibration without disabling existing graph-preservation behavior |
| Preserve `skippedChannels: string[]` and add details additively | Avoids breaking existing consumers while making skip/exception causes visible |
| Record FTS capability fallback as a channel exception | The FTS helper can return an empty result after recording an unavailable capability instead of throwing, so callers need metadata visibility for that case too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline targeted tests | PASS: `npm run test:core -- tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts` (`3 passed`, `162 tests`) |
| Targeted implementation suite | PASS: `npm run test:core -- tests/query-channel-calibration.vitest.ts tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/hybrid-search.vitest.ts tests/flag-ceiling.vitest.ts tests/routing-telemetry-stress.vitest.ts` (`7 passed`, `286 tests`) |
| Typecheck | PASS: `npm run typecheck` |
| Build | PASS: `npm run build` |
| Changed-file lint | PASS: `npm exec -- eslint ...` over changed source/test files |
| Global lint | FAIL outside this diff: unused-symbol errors in `context-server.ts`, `core/db-state.ts`, `hooks/claude/session-stop.ts`, `lib/feedback/batch-learning.ts`, `lib/validation/orchestrator.ts`, and `scripts/migrations/rebuild-memory-index-archived-check.mjs` |
| Full `test:core` | TIMED OUT after 120s with broad failures outside this packet's targeted suite |
| Rebuilt `dist` live route timing probe | BLOCKED: current daemon holds the single-writer lock for `mcp_server/database/context-index.sqlite`; two override attempts still resolved the live DB |

### Fixture Evidence

| Metric | Before | After | Evidence |
|--------|--------|-------|----------|
| Graph invocation on 7-query fixture | `2/7` | `6/7` | `tests/query-channel-calibration.vitest.ts` |
| Degree invocation on 7-query fixture | `0/7` | `6/7` | `tests/query-channel-calibration.vitest.ts` |
| Trigger/single-token false escalation | `0` expected | `0` observed | `save context` and `cli-opencode` controls stay without graph/degree |
| Latency threshold | n/a | `avgMs < 5`, `maxMs < 5` | Named fixture assertion |
| Runtime vector skip visibility | absent before | `vector` in `skippedChannels` with runtime reason | Named fixture assertion |
| Channel exception visibility | console-only before | metadata for FTS, BM25, trigger, graph search, causal traversal, graph-context injection | Named fixture assertion |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Package-wide lint is not green.** The changed files pass eslint, but `npm run lint` fails on unrelated unused-symbol issues outside this diff.
2. **Package-wide `test:core` is not green.** The targeted suite for this packet passes; the all-file run timed out after 120s with broad failures across unrelated areas.
3. **Rebuilt `dist` live timing could not be captured.** The current daemon holds the single-writer DB lock, and the compiled router still resolved the live DB during the probe attempts. The reproducible timing evidence is the isolated Vitest fixture.
<!-- /ANCHOR:limitations -->
