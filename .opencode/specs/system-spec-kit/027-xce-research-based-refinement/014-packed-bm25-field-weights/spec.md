---
title: "Feature Specification: Packed In-Memory BM25 Engine with Field Weights [template:level_1/spec.md]"
description: "Implement the reserved packed-inmemory BM25 engine (typed-array postings) and BM25F per-field weighting so the fallback lexical channel is memory-safe and relevance-equivalent to FTS5."
trigger_phrases:
  - "packed bm25"
  - "in-memory bm25 engine"
  - "bm25f field weights"
  - "lexical fallback channel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights"
    last_updated_at: "2026-06-10T20:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Packed in-memory BM25 engine shipped with BM25F weighting and measured budget evidence"
    next_safe_action: "Monitor packed fallback warmups"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Packed In-Memory BM25 Engine with Field Weights

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Shipped |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The in-memory BM25 fallback channel has two latent defects at the measured corpus (10,245 docs, 69.2 MB indexed text). First, the legacy engine stores full token arrays per document (bm25-index.ts:197-207), an estimated 300-600 MB of heap if it ever warms the full corpus - a standing RAM hazard for the daemon whenever memory_fts is absent. Second, it flattens title/content/triggers/path into one field (bm25-index.ts:151-172), silently losing the title-x10 weighting that the FTS5 channel applies via bm25(memory_fts,10,5,2,1) - the engine slot packed-inmemory is reserved but unimplemented (bm25-index.ts:53,487-493) and BM25_FIELD_WEIGHTS is exported but unused there (:73-78). Source evidence: z_future/sqlite-to-turso 004 - gap-alternatives.md section 3.

### Purpose
The fallback lexical channel becomes memory-bounded and relevance-equivalent to the FTS5 primary, with weights staying query-time tunable - strengthening today's resilience story and removing the hard FTS5 dependency for any future backend.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Packed engine: term dictionary + typed-array postings; documents store term frequencies and lengths only
- BM25F per-field weighting consuming the exported BM25_FIELD_WEIGHTS
- Warmup and RAM budget gates: RSS <= 150 MB and warmup <= 10 s at the current corpus, measured
- Relevance validation against the existing bm25-baseline eval harness; fusion-channel wiring unchanged

### Out of Scope
- Replacing FTS5 as the primary lexical channel - this phase hardens the fallback only; promotion is a separate decision
- Third-party search libraries (minisearch contingency stays a documented trigger, not scope)
- Tokenizer/stemmer changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/bm25-index.ts` | Modify | Packed engine in the reserved slot + BM25F scoring |
| `mcp_server/lib/eval/bm25-baseline.ts` (+fixtures) | Modify | Eval comparison legacy vs packed vs FTS5 |
| `mcp_server/tests/` | Create | RAM/warmup budget tests + scoring parity suite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packed engine warms the full current corpus within 150 MB RSS and 10 s, with relevance >= the legacy engine on the bm25-baseline eval | Measured spike recorded; budget breach fails the phase and fires the minisearch contingency decision |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | BM25F field weighting applied with query-time-tunable weights matching the FTS5 channel's intent (title > triggers > path > content) | Eval shows the title-weighting signal restored vs the flattened legacy engine |
| REQ-003 | Engine selection (legacy/packed/auto) is explicit, logged, and the legacy engine remains available behind the existing engine flag | Toggle test; no silent engine switch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fallback channel relevance parity: packed+BM25F within agreed eval delta of the FTS5 channel on the golden set.
- **SC-002**: Fallback warm-up is bounded and non-blocking at the measured corpus.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Packed postings bugs corrupt ranking silently | Med | Scoring parity suite vs legacy engine on fixtures; eval harness gate |
| Risk | RAM estimate wrong at larger corpora | Low | Budget gate measured at 1x and 3x corpus fixtures; contingency documented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the minisearch contingency acceptable as a dependency if the packed spike breaches budget, or is buy-not-build excluded?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
