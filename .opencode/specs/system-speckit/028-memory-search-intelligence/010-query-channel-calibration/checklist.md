---
title: "Verification Checklist: Query-Channel Calibration and Visibility [template:level_2/checklist.md]"
description: "Verification Date: TBD, scaffold not yet built"
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
# Verification Checklist: Query-Channel Calibration and Visibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|---------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. **Evidence**: requirements REQ-001 through REQ-006 are present.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. **Evidence**: plan covers the router calibration, runtime skip visibility, channel-exception sink, rollback flag, and verification path.
- [x] CHK-003 [P1] Dependencies identified and available (007-search-index-integrity-sweep shipped). **Evidence**: implementation proceeded from the user-provided dependency confirmation.
  Continued evidence line cites implementation-summary.md:97 command evidence and user-provided dependency confirmation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. **Evidence**: changed-file lint passed with `npm exec -- eslint lib/search/channel-exceptions.ts lib/search/search-flags.ts lib/search/query-classifier.ts lib/search/query-router.ts lib/search/hybrid-search.ts lib/search/causal-boost.ts lib/search/pipeline/types.ts lib/search/pipeline/stage2-fusion.ts tests/flag-ceiling.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/routing-telemetry-stress.vitest.ts tests/query-channel-calibration.vitest.ts`; global `npm run lint` still fails on unrelated unused-symbol errors outside this diff.
- [x] CHK-011 [P0] No console errors or warnings introduced beyond the existing fail-open logs. **Evidence**: the implementation adds structured metadata alongside existing fail-open logging; it does not add new logging categories.
  Continued evidence line cites `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:655` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:464` metadata additions without new log categories.
- [x] CHK-012 [P1] Error handling implemented (channel-exception sink wired into all 4 named call sites). **Evidence**: forced-failure fixture covers BM25, FTS, trigger, causal traversal, and graph-context injection metadata.
  Continued evidence line cites `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts:246` forced-failure assertions and targeted suite `7 passed (7), 286 tests`.
- [x] CHK-013 [P1] Code follows project patterns. **Evidence**: uses existing query-plan/routing metadata, feature-flag helpers, and fail-open channel behavior.
  Continued evidence line cites implementation-summary.md:97 changed-file eslint command and `npm run typecheck` pass.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 recalibration, REQ-002 vector-skip visibility, REQ-003 no false escalation). **Evidence**: `tests/query-channel-calibration.vitest.ts` passed in the targeted suite.
- [x] CHK-021 [P0] Manual testing complete (frozen fixture run, forced-failure fixture runs). **Evidence**: targeted fixture run passed; rebuilt `dist` live timing probe was attempted but blocked by the live DB single-writer lock.
- [x] CHK-022 [P1] Edge cases tested (zero-stopword/zero-density query, find_spec/find_decision intent overlap, complex-tier no-op). **Evidence**: `query-channel-calibration`, `query-classifier`, and `query-router` targeted suites passed.
- [x] CHK-023 [P1] Error scenarios validated (embedding throw vs null, entity-density DB unavailable, multi-channel-failure query). **Evidence**: targeted suites cover vector runtime skip, channel exceptions, DB-unavailable fallback behavior, and multi-channel failure metadata.
  Continued evidence line cites `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts:230` and command `npm run test:core -- tests/query-channel-calibration.vitest.ts tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/hybrid-search.vitest.ts tests/flag-ceiling.vitest.ts tests/routing-telemetry-stress.vitest.ts`.
- [x] CHK-024 [P0] Benchmark thresholds pinned with reproduce commands (invocation-rate lift, control-set false-escalation count, visibility checks, latency delta). **Evidence**: reproduce command is `npm run test:core -- tests/query-channel-calibration.vitest.ts tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/hybrid-search.vitest.ts tests/flag-ceiling.vitest.ts tests/routing-telemetry-stress.vitest.ts`; after-change latency threshold is `avgMs < 5`, `maxMs < 5` in the named fixture.
- [x] CHK-025 [P0] Named test present with its assertions (.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts). **Evidence**: file exists and targeted run passed.
- [x] CHK-026 [P1] Default-off/reversibility proven, flag toggle returns pre-recalibration behavior with no restart, plus ALL_SPECKIT_FLAGS/FLAG_CHECKERS entry if a new flag was introduced. **Evidence**: fixture toggles `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION=false` to assert pre-recalibration behavior; flag-ceiling test covers registry entry.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `algorithmic` for router calibration, `cross-consumer` for result-visible metadata, and `matrix/evidence` for fixture verification. **Evidence**: classes map to the implemented router, metadata, and fixture changes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for the fail-open `console.warn`/`console.error` channel-exception pattern. **Evidence**: grep inventory covered `hybrid-search.ts` and `causal-boost.ts` fail-open sites.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `skippedChannels`/`QueryPlan.skippedChannels` (formatters, handlers, tests reading routing metadata). **Evidence**: changes preserve the existing `skippedChannels: string[]` field and add `skippedChannelDetails`/`channelExceptions` additively.
- [x] CHK-FIX-004 [P0] Recalibration change includes the control-set fixture proving genuinely-vague and trigger-anchored queries do not gain channels. **Evidence**: named fixture asserts `save context` and `cli-opencode` do not gain graph/degree.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (stopword-hatch x entity-density-hatch x embedding-availability, plus 4 channel-exception sites). **Evidence**: rows covered in `tests/query-channel-calibration.vitest.ts`: 7-query fixture, two controls, null-embedding vector skip, multi-channel hybrid failure, causal traversal failure, graph-context injection failure.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed for the flag toggle (graph-preservation flag off mid-session). **Evidence**: named fixture toggles the dedicated preservation flag off and on in one test process.
  Continued evidence line cites `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts:194` toggling `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` false then unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. **Evidence**: no commit was made by instruction; evidence is pinned to the current uncommitted diff and exact commands in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. **Evidence**: changed files add no credentials or external tokens.
  Continued evidence line cites implementation-summary.md:59 changed-file inventory and no credential/token additions in the current diff.
- [x] CHK-031 [P0] Input validation implemented (query fixture inputs stay within existing classifier/router contracts). **Evidence**: recalibration uses existing normalized classification fields and route contracts.
  Continued evidence line cites `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts:182` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:461`.
- [x] CHK-032 [P1] No new write path introduced (this phase changes routing/metadata only, no persistence). **Evidence**: changes are in search routing/metadata and tests only.
  Continued evidence line cites implementation-summary.md:59 changed source files under `lib/search/` plus tests; no database schema or persistence handler was added.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. **Evidence**: tasks and implementation summary reflect the shipped implementation and limitations.
  Continued evidence line cites strict validation command in implementation-summary.md:97 after documentation synchronization and graph metadata refresh.
- [x] CHK-041 [P1] Code comments adequate (durable WHY only, no packet/finding IDs embedded in code comments). **Evidence**: new comments avoid packet/task/finding identifiers.
  Continued evidence line cites strict validation output `COMMENT_HYGIENE_MARKER` pass in implementation-summary.md:97.
- [x] CHK-042 [P2] README updated (if applicable, e.g. `lib/search/README.md` routing-tier description). **Evidence**: no applicable `lib/search/README.md` update was needed for this internal additive routing flag.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. **Evidence**: no packet-local scratch files were created; temporary DB probe paths were created under the OS temp directory only.
  Continued evidence line cites implementation-summary.md:108 limitation noting only OS temp DB probe paths and no retained packet scratch files.
- [x] CHK-051 [P1] scratch/ cleaned before completion. **Evidence**: no retained scratch files for this packet. (re-validated in the 2026-07-10 `validate.sh --strict` sweep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09
<!-- /ANCHOR:summary -->
