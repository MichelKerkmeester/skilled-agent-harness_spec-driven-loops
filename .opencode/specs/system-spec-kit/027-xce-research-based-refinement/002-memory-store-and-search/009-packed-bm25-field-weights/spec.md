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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights"
    last_updated_at: "2026-06-11T07:05:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Deep-review remediation; realistic fixture breached 150MB RSS-spike budget"
    next_safe_action: "User decides minisearch contingency (RSS-spike breach) in section 7"
    blockers:
      - "RAM gate test failing by design: realistic-fixture RSS spike 686.8MB > 150MB budget; awaiting contingency decision"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Minisearch contingency re-opened: realistic-fixture RSS spike breaches the 150MB budget while retained heap stays within it — accept dependency, amend REQ-001 metric, or fund a churn fix?"
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

- **Minisearch contingency — RE-OPENED by fixture re-validation (2026-06-11); user decision required.** The original "within budget" evidence (111 MB RSS) was measured against a corpus fixture whose body filler was 100% stop words, so body postings were never indexed and the RAM gate exercised an effectively empty postings store. Re-validation with a realistic non-stop-word, per-doc-varying fixture at the same byte target (10,245 docs / 69.2 MB) measured: warmup RSS spike **686.8 MB** (committed gate) / 799.4 MB (batched probe with forced GC) — a **breach** of the 150 MB budget — while retained heap after GC is **104.9 MB (within budget)** and warmup latency ~2 s (within the 10 s budget). The breach is tokenization/warmup allocation churn, not retained index size; the packed engine's structural RAM goal is met, but the process-level RSS bound REQ-001 specifies is not. Tokenizer changes are out of scope (§3), so per REQ-001's acceptance criteria the RAM gate test is left failing and the contingency decision fires: (a) accept minisearch as a dependency, (b) amend REQ-001 to a retained-heap bound with a documented warmup spike, or (c) fund a warmup-churn fix in a follow-on packet. Evidence: `scratch/rss-probe-evidence.md`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
