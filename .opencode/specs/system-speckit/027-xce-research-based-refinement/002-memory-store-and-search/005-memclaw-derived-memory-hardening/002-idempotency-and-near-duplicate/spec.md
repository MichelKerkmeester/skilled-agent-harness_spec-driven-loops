---
title: "Feature Specification: Phase 2: idempotency-and-near-duplicate"
description: "memory_save/memory_update are retryable but a retried save can create a duplicate row, there is no operation receipt to replay a prior result, and near-duplicates are never surfaced. This phase adds a server-derived idempotency receipt so identical retries replay, mismatched-payload retries fail closed, and near-duplicates surface as one non-blocking advisory hint."
trigger_phrases:
  - "memory save idempotency receipt"
  - "retry-safe memory write replay"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "duplicate row on retried save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
    last_updated_at: "2026-06-10T11:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented idempotency receipts and near-duplicate hints"
    next_safe_action: "Run next phase after validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-idempotency-and-near-duplicate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: idempotency-and-near-duplicate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/002-idempotency-and-near-duplicate` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-provenance-and-audit |
| **Successor** | 003-feedback-log-and-005-reframe |
| **Handoff Criteria** | Idempotency receipt replays identical retries with `replayed:true`; same-key/changed-payload retry fails closed; near-duplicate surfaces as advisory only; 002 validation + retry tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification.

**Scope Boundary**: Server-derived idempotency for `memory_save`/`memory_update` only — a minimal SQLite receipt keyed by an operation/content/request fingerprint, a pre-mutation replay wrapper, an advisory `near_duplicate_of` computed only when embeddings already exist, and a `last_dedup_checked_at` marker. No HTTP idempotency middleware, no LLM-judge dedup, no hard-reject of duplicates, no human review queue, and no provenance/`source_kind` work (that is Phase 1). The receipt is a single SQLite table plus one transaction; it does not introduce sentinel/TTL/poll semantics.

**Dependencies**:
- Phase 1 (`001-provenance-and-audit`) provenance and write-ingress guard land first: the receipt lookup/replay and `source_kind` derivation share the same pre-mutation guard point, so Phase 1's write-ingress hook must exist before this phase wires the replay wrapper into it.
- Existing dedup substrate in `handlers/save/dedup.ts` (`content_hash`, `checkExistingRow`, `checkContentHashDedup`) — reused to distinguish "same retry" from "same content already exists".
- Existing advisory substrate in `handlers/save/response-builder.ts` (it already emits assistive recommendations + `related_ids`) — extended to carry the `replayed:true` flag and the `near_duplicate_of` hint on the existing response envelope.

**Deliverables**:
- A SQLite idempotency-receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns on `memory_index`, added via idempotent migrations in `lib/search/vector-index-schema.ts`.
- A pre-mutation replay wrapper for `memory_save`/`memory_update` that returns the prior result on identical retry and fails closed on a same-key/changed-payload retry.
- An advisory, deterministic `near_duplicate_of` (with similarity metadata) computed only when embeddings already exist, surfaced as one non-blocking inline hint via the existing response builder.
- A `last_dedup_checked_at` marker that prevents re-deduping unchanged rows, repaired for deferred vectors via the existing index-scan path.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_save` and `memory_update` are retryable, but a retried save can create a duplicate row because there is no operation receipt to recognize and replay a prior result. There is no way to distinguish "this is the same retry" from "different content that happens to be similar", so a same-key/changed-payload retry can silently diverge instead of failing. Near-duplicates that already share embeddings are never surfaced, even advisorily, so the user gets no quiet signal that they may be re-saving known content.

### Purpose
Make writes retry-safe and quietly self-aware: an identical retry replays the prior result with no duplicate row, a same-key/changed-payload retry fails clearly, near-duplicates surface as one non-blocking advisory hint, and every signal is server-derived (no user-supplied tokens) and rides the existing response envelope with zero added friction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A minimal SQLite idempotency receipt keyed by a server-derived operation/content/request fingerprint, plus a pre-mutation replay wrapper for `memory_save`/`memory_update`.
- Retry-vs-content classification: distinguish "same retry" (replay the prior result) from "same content already exists" from "same key, changed payload" (fail closed).
- An advisory `near_duplicate_of` field plus similarity metadata, computed deterministically against a fixed threshold, only when embeddings already exist; it is always a hint, never a hard reject and never an LLM judgment.
- A `last_dedup_checked_at` marker on the row so unchanged rows are not rescanned for near-duplicates.
- Carrying the `replayed:true` flag and the near-duplicate hint on the existing response envelope via the current response builder.

### Out of Scope
- HTTP idempotency middleware (sentinel row / TTL / poll semantics) - deferred; this phase is local server-derived receipts only, not request-level HTTP infrastructure.
- LLM-judge dedup or human review queues - excluded; near-duplicate detection stays deterministic and non-blocking, with no model-in-the-loop and no triage surface.
- Hard-reject of duplicates - excluded; duplicates are replayed or surfaced advisorily, never refused.
- Provenance / `source_kind` write-ingress derivation - owned by Phase 1 (`001-provenance-and-audit`); this phase only consumes the shared pre-mutation guard point.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add idempotency-receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns on `memory_index` via idempotent numbered migrations. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Wire the pre-mutation receipt lookup/replay wrapper into the save path; emit `replayed:true` on identical retry. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify | Apply the same receipt lookup/replay + fail-closed-on-mismatch behavior to `memory_update`. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | Modify | Add retry-vs-content classification on top of the existing `content_hash` / `checkExistingRow` / `checkContentHashDedup` duplicate checks. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Modify | Ensure replay/idempotent paths do not double-trigger reconsolidation for a replayed write. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts` | Modify | Track `last_dedup_checked_at` alongside enrichment state so unchanged rows are skipped on rescan. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modify | Extend the existing advisory/`related_ids` substrate to carry `replayed:true` and the single `near_duplicate_of` hint. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Compute `near_duplicate_of` post-embedding and repair deferred vectors via the existing index-scan path; respect `last_dedup_checked_at`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Idempotency receipt for `memory_save`/`memory_update`: an identical retry replays the prior response; a same-key/changed-payload retry fails closed; "same retry" is distinguished from "same content already exists". | A retried save creates 0 duplicate rows; the replay returns the prior success with `replayed:true`; a same-key retry whose payload changed returns a clear closed-failure rather than a divergent write. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Advisory `near_duplicate_of`: deterministic against a fixed threshold, non-blocking, computed only when embeddings already exist. | A near-duplicate appears as exactly one inline advisory hint (with similarity metadata) on the existing response envelope; it is never a rejection, never a queue, and is skipped silently when no embedding exists yet. |
| REQ-003 | `last_dedup_checked_at` marker: prevents re-deduping unchanged rows. | A row whose content has not changed since its recorded `last_dedup_checked_at` is not rescanned for near-duplicates on subsequent index/enrichment passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Retry-safe writes — a replayed `memory_save`/`memory_update` returns the prior result with `replayed:true` and creates no phantom duplicate row.
- **SC-002**: A same-key/changed-payload retry fails closed with a clear signal instead of producing a divergent write.
- **SC-003**: Near-duplicate detection adds value without friction — surfaced as one non-blocking advisory hint only when embeddings already exist, never a block or queue.
- **SC-004**: Unchanged rows are not rescanned — `last_dedup_checked_at` short-circuits redundant near-duplicate computation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 (`001-provenance-and-audit`) pre-mutation write-ingress guard | Med — the replay wrapper needs the same pre-mutation hook point Phase 1 introduces; without it there is no clean place to do receipt lookup before the write | Sequence after Phase 1 per the parent phase map; share the single pre-mutation guard rather than adding a second hook. |
| Dependency | Existing dedup substrate (`handlers/save/dedup.ts`) and advisory substrate (`handlers/save/response-builder.ts`) | Low — both already exist and are reused | Extend in place (`content_hash`/`checkExistingRow` for classification; `related_ids`/recommendations for the hint) rather than re-implementing. |
| Risk | Receipt over-engineering toward HTTP idempotency semantics | Med — sentinel/TTL/poll would add complexity this phase does not need | Keep it minimal: one SQLite receipt table plus one transaction, server-derived key only; HTTP middleware is explicitly out of scope. |
| Risk | Near-duplicate computed before embeddings exist | Low — would produce noise or errors on rows without vectors | Skip silently when no embedding exists; compute only post-embedding, repaired for deferred vectors via the existing index-scan path. |
| Risk | No pre-mutation hook point today (`mutation-hooks.ts` is post-write) | Med — receipt lookup/replay must run before the write, but the only existing hook fires after | Introduce/consume the Phase 1 pre-mutation guard for replay; keep cache/audit/enrichment in the post-write `mutation-hooks.ts`, never integrity decisions. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Receipt lookup adds < 3 ms to a `memory_save`/`memory_update` (single indexed SQLite read on the server-derived key); a hit-match replays the stored prior response without re-running the write or re-embedding.
- **NFR-P02**: The advisory `near_duplicate_of` check runs post-embedding on the existing index/enrichment pass, off the write hot path; it never blocks or delays the save response.

### Security
- **NFR-S01**: The receipt key is server-derived from the operation name plus content hash plus a request fingerprint; no client-supplied idempotency token is accepted, so a caller cannot forge a replay or collide another caller's key.
- **NFR-S02**: Near-duplicate detection is advisory only — it never deletes, overwrites, merges, or rejects a `memory_index` row; write acceptance is identical whether or not a near-duplicate is found.

### Reliability
- **NFR-R01**: An identical retry (same key, byte-identical payload) replays the prior result with `replayed:true` and creates 0 new rows; a same-key/changed-payload retry fails closed with a typed error rather than producing a divergent write.
- **NFR-R02**: A `last_dedup_checked_at` marker prevents redundant rescans — a row whose content is unchanged since its stamped marker is skipped on subsequent index/enrichment passes, so near-duplicate computation is idempotent and bounded.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A save whose embedding has not been computed yet (deferred vector): the near-duplicate check is skipped silently and the row is left for the existing index-scan repair path; no advisory hint and no error.
- Two genuinely distinct memories whose vectors score above the similarity threshold: both are saved unchanged and the second carries one advisory `near_duplicate_of` hint pointing at the first — advisory only, never deduplicated.
- A receipt-key collision across different operations (e.g. a `memory_save` fingerprint equal to a `memory_update` fingerprint): the operation name is part of the key, so the two never alias and each replays only its own prior response.

### Error Scenarios
- The idempotency-receipt table write fails inside the transaction: fall back to the normal (non-receipt) save, log a warning, and still return a valid success — a receipt-store fault never blocks a legitimate write.
- Same idempotency key with a changed payload: return a typed 422-style closed failure (`idempotency_key_conflict`) carrying enough context to distinguish it from a generic validation error; no row is written or mutated.
- Near-duplicate computation throws (corrupt vector, threshold misconfig): the hint is dropped, the save still succeeds, and the failure is logged — the advisory is best-effort and never escalates to a write error.

### State Transitions
- First save (receipt miss) → identical retry (receipt hit-match, `replayed:true`, 0 new rows) → a later content edit under the same logical request produces a new receipt key and is treated as a fresh logical operation, not a replay.
- A row stamped `last_dedup_checked_at` whose content later changes: the content-hash change clears the short-circuit so the row is rescanned for near-duplicates on the next pass and re-stamped.
- A replayed write must NOT re-trigger reconsolidation or post-write enrichment side effects that already ran for the original write; replay short-circuits those bridges.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One SQLite receipt table + 2 additive `memory_index` columns, a pre-mutation replay wrapper across 2 handlers, retry-vs-content classification on existing `dedup.ts`, an advisory near-dup enricher, and a `last_dedup_checked_at` marker — contained, additive, reuses existing substrate. |
| Risk | 11/25 | Touches the write path, but the receipt sits behind a feature flag and the near-duplicate is advisory-only (never gates a write); migrations are idempotent and additive, replay fails closed on payload mismatch. |
| Research | 6/20 | Design is settled by the parent integration plan and the research/008 reframe; threshold and key composition reuse patterns already present in `dedup.ts`, leaving only confirmation work, not open investigation. |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What server-derived inputs compose the receipt key — operation name + content hash + a request fingerprint — and exactly which fields define "same key" so a payload change is detected as a mismatch rather than a new operation?
- What is the deterministic similarity threshold for `near_duplicate_of`, and is it a fixed constant or a per-content-type value reusing the thresholds already present in `dedup.ts`?
- Should the receipt be behind a feature flag for the first rollout (per the rollback plan), and what is the default state once retry tests pass?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
