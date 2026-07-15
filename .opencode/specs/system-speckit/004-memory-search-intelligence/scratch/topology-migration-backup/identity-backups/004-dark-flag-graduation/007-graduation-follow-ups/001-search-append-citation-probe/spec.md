---
title: "Feature Specification: Search Append-Exempt Serializer + True-Citation Density Probe"
description: "Tail-appended search rows survive the Stage-4 cap but the response-serialization token-budget trim still pops them off the end, and nothing measures whether the true-citation ledger has enough used/not-used pairs to train a reranker. This adds an append-exempt marker the serializer honors and a density probe that reports usable session-scoped pairs and advises when the reranker-training threshold is crossed."
trigger_phrases:
  - "append-exempt serializer"
  - "tail-append token budget truncation"
  - "true-citation density probe"
  - "reranker training threshold"
  - "search append citation probe"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/007-graduation-follow-ups/001-search-append-citation-probe"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase and implemented both follow-ups"
    next_safe_action: "Run the cli test pass over the two new vitest suites"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/true-citation-emitter.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Search Append-Exempt Serializer + True-Citation Density Probe

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 009 dark-flag validation found two production-readiness gaps in the search layer. First, the multihop tail-appends (`SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL`) correctly bypass the Stage-4 result cap, but a second truncation at the response-serialization token-budget trim drops results from the end of the array, which is exactly where the appended rows sit (finding P1-001). Second, the `SPECKIT_TRUE_CITATION_EMITTER` ledger only becomes worth training a reranker on once it holds enough used/not-used pairs, but nothing measures that density, so there is no signal for when the deferred reranker can graduate (finding P2-003).

### Purpose
Appended rows survive the serialization token-budget trim, and the true-citation ledger reports when it has accumulated enough usable session-scoped pairs to train the reranker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `appendExempt` marker the formatter stamps on tail-appended rows, which the serializer's token-budget trim honors by dropping non-exempt rows first.
- A density probe that reports the count of usable session-scoped used/not-used pairs and raises an advisory once a reranker-training threshold is crossed.
- A surface for the probe through the existing `memory_health` query, gated behind the emitter flag.
- Tests for both: appended rows survive the serialization trim; the probe at zero density and above threshold.

### Out of Scope
- Flipping any feature-flag default - the graduation decision stays separate.
- The deferred outcome reranker itself - this only measures readiness for it.
- The Stage-4 cap and the append modules in `lib/search/pipeline` - owned elsewhere, already correct per 009.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/formatters/search-results.ts` | Modify | Add `appendExempt` field + detection from `source`/`sources` markers |
| `mcp_server/context-server.ts` | Modify | Token-budget trim drops non-exempt rows first (`selectBudgetTrimIndex`) |
| `mcp_server/lib/feedback/true-citation-emitter.ts` | Modify | Add `probeTrueCitationDensity` + threshold constant |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Surface the probe in `memory_health`, gated behind the emitter flag |
| `mcp_server/tests/append-exempt-serializer.vitest.ts` | Create | Marking + trim-selection + survival tests |
| `mcp_server/tests/true-citation-emitter.vitest.ts` | Modify | Density-probe tests at zero and above threshold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tail-appended rows survive the serialization token-budget trim | A budget squeeze that drops baseline rows keeps the appended rows; test C1 passes |
| REQ-002 | Both follow-ups are byte-identical when their flags are off | No `appendExempt` field on any row when no append rows exist; probe surfaces nothing in `memory_health` when the emitter flag is off |
| REQ-005 | The trim reserves at least one primary row and pins constitutional rows above backfills | A maximal squeeze never returns a backfill-only answer (P1-6); a constitutional row outlives an additive backfill (P2-14); tests B6-B10, C1b, C1c pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The density probe reports usable session-scoped pairs and advises only on a learnable split | Probe returns zero on an empty ledger with no advisory; graduates only when the count, the per-class floor, AND the minority-ratio floor are all met; a 199:1 lopsided split is rejected (P2-12) |
| REQ-004 | The probe excludes legacy null-session rows from the usable count | Null-session rows count toward `total` but never `usablePairs` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tsc --noEmit --composite false` introduces no new errors over the pre-existing tsconfig `baseUrl` deprecation baseline.
- **SC-002**: The two vitest suites pass through the cli executor test pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Trim selection diverges from the original pop() on the flag-off path | Low | `selectBudgetTrimIndex` returns the last index when no row is exempt and none is constitutional, byte-identical to pop(); proven by test C2/B1 |
| Risk | Density probe over-reports readiness via legacy null-session rows | Med | Usable count filters `session_id IS NOT NULL` |
| Risk | Density gate graduates a lopsided ledger that a binary ranker cannot learn from | Med | Count threshold is joined by a per-class absolute floor and a minority-ratio floor; the 199:1 case is rejected (P2-12 regression) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The density probe runs three `COUNT(*)` queries against an indexed shadow table; negligible against the existing `memory_health` cost.

### Security
- **NFR-S01**: No new untrusted input is parsed; the probe reads only the local shadow ledger.

### Reliability
- **NFR-R01**: The probe returns a zero-density reading on any error rather than throwing, so the health surface never breaks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty ledger: probe returns all-zero, no advisory.
- Single-class ledger (all used or all not-used): never graduates regardless of count.
- All-exempt result array: trim selection falls back to the tail so the loop still converges.

### Error Scenarios
- Missing DB on the health path: probe is skipped (gated on a non-null database).
- Probe throws: caught, a short hint is pushed instead.

### State Transitions
- Below threshold accumulates silently; crossing it flips `meetsTrainingThreshold` and emits the advisory.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 source files, 2 test files, ~150 LOC |
| Risk | 6/25 | Behind existing flags, byte-identity proven, no schema change |
| Research | 4/20 | 009 review/research already located both points |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
