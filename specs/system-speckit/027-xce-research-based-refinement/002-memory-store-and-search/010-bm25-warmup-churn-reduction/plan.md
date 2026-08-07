---
title: "Implementation Plan: BM25 Warmup Churn Reduction"
description: "Reduce peak transient allocation during packed-BM25 warmup (field-by-field tokenization, buffer reuse, pre-sized postings, bounded-peak streaming) so the committed-page RSS high-water-mark stays within the 150MB budget, with BM25 ranking byte-identical."
trigger_phrases:
  - "bm25 warmup churn plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/010-bm25-warmup-churn-reduction"
    last_updated_at: "2026-06-11T07:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan from the 014 RSS-budget finding"
    next_safe_action: "Implement warmup churn reduction and re-measure RSS"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-bm25-warmup-churn-reduction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: BM25 Warmup Churn Reduction

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) |
| **Framework** | In-memory packed BM25 engine (`BM25Index`) |
| **Storage** | In-memory packed postings (Uint32Array) over SQLite-sourced docs |
| **Testing** | vitest (realistic-corpus RSS probe + ranking parity) |

### Overview
The packed-BM25 warmup transiently spikes RSS to ~687MB (retained heap only ~105MB) because V8 commits pages from peak transient allocation and does not decommit in-run. Reduce the peak transient allocation during warmup — field-by-field tokenization (no per-doc concat string), token-buffer reuse, pre-sized/pooled mutable postings, and bounded-peak streaming — so the committed-page high-water-mark stays within the 150MB budget, with BM25 ranking byte-identical.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (RSS <= 150MB; ranking parity)
- [x] Dependencies identified (014 engine + fixture + advisory gate)

### Definition of Done
- [ ] RSS spike <= 150MB on the realistic fixture with the hard gate re-enabled
- [ ] Ranking parity suites green (byte-identical scores/order)
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical allocation optimization of the existing `BM25Index` warmup/tokenization path; scoring math and packed-postings layout frozen.

### Key Components
- **Tokenizer / `flush` path**: reduce transient token-string allocation; reuse a scratch buffer.
- **Document field assembly**: tokenize title/content/triggers/path field-by-field instead of concatenating into one transient per-doc string.
- **Mutable postings growth**: pre-size or pool `number[]` postings to cut reallocation churn.

### Data Flow
docs -> (per field) tokenize with reused buffer -> accumulate postings (pre-sized) -> finalizePackedPostings -> packed Uint32Array (retained ~105MB).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review CONDITIONAL/RAM-budget finding; the change touches a hot read/index path, so behavior must be parity-gated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/bm25-index.ts` (tokenizer + warmup) | Produces tokens + packed postings during warmup | Update (allocation only) | Ranking parity suites + RSS probe |
| `tests/bm25-packed-inmemory.vitest.ts` | RSS budget + regression gate (currently advisory) | Re-enable hard RSS assertion once budget holds | Test green with hard gate |
| `tests/hybrid-search.vitest.ts` | Ranking parity oracle | Unchanged | Holds at 94 |

Required inventories:
- Algorithm invariant: same tokens in, same postings + scores + ordering out (allocation-only change). Adversarial cases: empty/very-long fields, repeated terms, unicode.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Baseline measured (~687MB realistic-fixture warmup RSS spike; retained ~105MB)
- [x] Churn sources identified (tokenizer transient strings, per-doc concat, mutable postings growth)

### Phase 2: Core Implementation
- [ ] Field-by-field tokenization (drop the per-doc concat string)
- [ ] Token-buffer reuse / reduced transient token-string allocation
- [ ] Pre-sized / pooled mutable postings
- [ ] Bounded-peak streaming warmup if it measurably lowers the high-water-mark

### Phase 3: Verification
- [ ] Realistic-fixture RSS spike <= 150MB (re-enable hard gate)
- [ ] Ranking parity green (byte-identical), warmup latency <= 10s
- [ ] Docs updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Tokenization output parity, postings size | vitest |
| Integration | Realistic-corpus warmup RSS + latency | vitest (RSS probe) |
| Regression | Packed-BM25 + hybrid-search ranking parity | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014 packed engine + realistic RAM fixture + advisory gate | Internal | Green | This phase consumes and re-enables them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: ranking parity breaks, or no measurable RSS improvement toward the budget.
- **Procedure**: revert the allocation changes in `bm25-index.ts` (mechanical, no schema/score change); leave the RSS gate advisory and return the metric decision to the operator.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
