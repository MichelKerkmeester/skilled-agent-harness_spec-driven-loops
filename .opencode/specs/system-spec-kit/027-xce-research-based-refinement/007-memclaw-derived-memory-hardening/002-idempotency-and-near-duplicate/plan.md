---
title: "Implementation Plan: Phase 2: idempotency-and-near-duplicate [template:level_1/plan.md]"
description: "Plan for a minimal SQLite idempotency receipt plus a pre-mutation replay wrapper for memory_save/memory_update, a deterministic advisory near_duplicate_of computed only when embeddings exist, and a last_dedup_checked_at marker to skip unchanged rows. Server-derived, zero added friction, behind a flag."
trigger_phrases:
  - "memory save idempotency receipt"
  - "retry-safe memory write replay"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "pre-mutation replay wrapper plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
    last_updated_at: "2026-06-06T10:10:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 2 idempotency-and-near-duplicate plan"
    next_safe_action: "Plan or implement T001 receipt table + schema columns"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-idempotency-and-near-duplicate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: idempotency-and-near-duplicate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node (local single-user Spec Kit Memory MCP server) |
| **Framework** | MCP server at `.opencode/skills/system-spec-kit/mcp_server/`; signals ride the existing MCP response envelope |
| **Storage** | SQLite + vector store (receipt table + `near_duplicate_of` / `last_dedup_checked_at` columns on `memory_index`) |
| **Testing** | vitest (unit) |

### Overview
This phase adds a minimal SQLite idempotency receipt keyed by a server-derived operation/content/request fingerprint plus a pre-mutation replay wrapper for `memory_save`/`memory_update`, so an identical retry replays the prior result with `replayed:true` and a same-key/changed-payload retry fails closed. It also computes a deterministic, advisory `near_duplicate_of` (with similarity metadata) only when embeddings already exist, surfaced as one non-blocking hint via the existing response builder, and records a `last_dedup_checked_at` marker so unchanged rows are not rescanned. Everything is server-derived (no user-supplied tokens), reuses the existing `dedup.ts` and `response-builder.ts` substrate, and fires from existing save/index paths with no manual steps.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-phase write path (per the parent integration plan's architectural rule): a **pre-mutation receipt wrapper** (write ingress) does receipt lookup/replay before the write; the **transactional writer** performs the insert/update and records the receipt in the same transaction; **post-write** computes the advisory near-duplicate after embeddings exist and repairs deferred vectors via index-scan. Integrity decisions (replay, fail-closed) live in the pre-mutation guard and the transactional writer; only enrichment/advisory work lives post-write.

### Key Components
- **Idempotency receipt store** (`lib/search/vector-index-schema.ts`): a minimal SQLite table keyed by a server-derived operation/content/request fingerprint, recording the prior response payload for replay. One table, written inside the write transaction.
- **Pre-mutation replay wrapper** (`handlers/memory-save.ts`, `handlers/memory-crud-update.ts`): before mutating, looks up the receipt; on a hit with matching payload it replays the prior response (`replayed:true`); on a same-key/changed-payload hit it fails closed; on a miss it proceeds to the writer.
- **Retry-vs-content classifier** (`handlers/save/dedup.ts`): reuses `content_hash` / `checkExistingRow` / `checkContentHashDedup` to separate "same retry" from "same content already exists" from "same key, changed payload".
- **Advisory near-duplicate enricher** (`handlers/memory-index.ts`, `handlers/save/enrichment-state.ts`): post-embedding, computes a deterministic `near_duplicate_of` against a fixed threshold only when an embedding exists, writes `last_dedup_checked_at`, and skips unchanged rows.
- **Response surface** (`handlers/save/response-builder.ts`): extends the existing recommendation / `related_ids` substrate to carry `replayed:true` and the single `near_duplicate_of` hint on the existing envelope.
- **Replay/reconsolidation guard** (`handlers/save/reconsolidation-bridge.ts`): ensures a replayed write does not re-trigger reconsolidation side effects.

### Data Flow
`memory_save`/`memory_update` request -> derive server-side receipt key (operation + content hash + request fingerprint) -> receipt lookup: hit+match replays prior response (`replayed:true`, 0 new rows); hit+mismatch fails closed; miss continues -> transactional writer inserts/updates the row and records the receipt atomically -> post-write, once an embedding exists, the enricher computes `near_duplicate_of` + similarity against the fixed threshold and stamps `last_dedup_checked_at` (unchanged rows skipped) -> response builder attaches `replayed:true` and/or the one near-duplicate hint to the existing response envelope. Deferred-vector rows are repaired on a later index scan rather than blocking the write.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/vector-index-schema.ts` (schema boundary) | Owns `memory_index` schema + idempotent numbered migrations | Update — add receipt table + `near_duplicate_of` / `last_dedup_checked_at` columns | Migration is idempotent (re-run safe); vitest schema/migration assertion |
| `handlers/memory-save.ts` (producer / public response) | Entry point for `memory_save` | Update — add pre-mutation receipt lookup/replay; emit `replayed:true` | vitest retry test: 0 duplicate rows, replay returns prior success |
| `handlers/memory-crud-update.ts` (producer / public response) | Entry point for `memory_update` | Update — same receipt replay + fail-closed-on-mismatch | vitest mismatch test: same-key/changed-payload fails closed |
| `handlers/save/dedup.ts` (policy / helper) | Owns `content_hash` + `checkExistingRow` + `checkContentHashDedup` | Update — add retry-vs-content classification on top of existing checks | vitest classification test: same-retry vs same-content vs changed-payload |
| `handlers/save/response-builder.ts` (public response) | Already emits recommendations + `related_ids` advisory substrate | Update — carry `replayed:true` and the single `near_duplicate_of` hint | vitest response-shape test: exactly one near-dup hint, never a rejection |
| `handlers/memory-index.ts` (post-write enrichment) | Index/enrichment scan path for deferred vectors | Update — compute `near_duplicate_of` post-embedding; honor `last_dedup_checked_at` | vitest near-dup test: skipped when no embedding; unchanged rows not rescanned |
| `handlers/save/enrichment-state.ts` (persistence / state) | Tracks post-insert enrichment state | Update — record `last_dedup_checked_at` | vitest: marker written; rescan short-circuits |
| `handlers/save/reconsolidation-bridge.ts` (consumer) | Bridges save into reconsolidation | Update — suppress reconsolidation on a replayed write | vitest: replayed write does not re-trigger reconsolidation |
| `handlers/mutation-hooks.ts` (post-write hook) | Post-write cache/audit/enrichment | Unchanged — integrity decisions stay in the pre-mutation guard, not here | grep: no receipt/replay logic added to `mutation-hooks.ts` |

Required inventories:
- Same-class producers: `rg -n 'content_hash|checkExistingRow|checkContentHashDedup|related_ids|recommendation' .opencode/skills/system-spec-kit/mcp_server/handlers/save`.
- Consumers of changed symbols: `rg -n 'near_duplicate_of|last_dedup_checked_at|replayed|idempotency|receipt' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '*.md'`.
- Matrix axes: (1) receipt state {miss, hit-match, hit-mismatch}; (2) embedding state {present, deferred/absent}; (3) operation {`memory_save`, `memory_update`}; (4) row-changed-since-`last_dedup_checked_at` {yes, no}. Enumerate the required rows before implementation.
- Algorithm invariant: the server-derived receipt key is a pure function of (operation, content hash, request fingerprint); identical inputs always replay the identical prior response (0 new rows), and any payload change under the same key fails closed. Near-duplicate is advisory-only: it never changes write acceptance. Adversarial cases — concurrent identical retries; same key with a one-field payload edit; a row with no embedding yet; a row already stamped `last_dedup_checked_at` whose content later changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add the idempotency-receipt table to `vector-index-schema.ts` (server-derived operation/content/request fingerprint key + stored prior-response payload), via an idempotent numbered migration.
- [ ] Add the `near_duplicate_of` and `last_dedup_checked_at` columns to `memory_index` in the same migration; confirm re-run safety against the live schema.
- [ ] Confirm the existing `dedup.ts` symbols (`content_hash`, `checkExistingRow`, `checkContentHashDedup`) and the `response-builder.ts` advisory substrate (`assistiveRecommendation`, `related_ids`) against the current code before wiring.

### Phase 2: Core Implementation
- [ ] Add the pre-mutation replay wrapper to `memory-save.ts` and `memory-crud-update.ts`: derive the receipt key, look it up before the write, replay the prior response on a hit-match, fail closed on a hit-mismatch, proceed on a miss; record the receipt inside the write transaction.
- [ ] Add retry-vs-content classification in `dedup.ts` on top of the existing checks: separate "same retry" from "same content already exists" from "same key, changed payload".
- [ ] Compute the deterministic advisory `near_duplicate_of` + similarity metadata in `memory-index.ts` post-embedding only (skip silently when no embedding exists); stamp `last_dedup_checked_at` via `enrichment-state.ts` and skip rows unchanged since that marker.
- [ ] Extend `response-builder.ts` to carry `replayed:true` and the single `near_duplicate_of` hint on the existing envelope; suppress reconsolidation on a replayed write in `reconsolidation-bridge.ts`.

### Phase 3: Verification
- [ ] vitest: a retried `memory_save`/`memory_update` creates 0 duplicate rows and the replay returns the prior success with `replayed:true`.
- [ ] vitest: a same-key/changed-payload retry fails closed; the retry-vs-content classifier distinguishes same-retry / same-content / changed-payload.
- [ ] vitest: `near_duplicate_of` appears as exactly one inline advisory hint, is skipped when no embedding exists, and is never a rejection; a row unchanged since `last_dedup_checked_at` is not rescanned.
- [ ] Update the memory-system docs to describe the idempotency receipt, the `replayed:true` flag, and the advisory near-duplicate behavior.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Receipt key derivation and replay (hit-match/hit-mismatch/miss), the retry-vs-content classifier, the deterministic near-duplicate threshold, and the `last_dedup_checked_at` short-circuit. | vitest |
| Integration | `memory_save` / `memory_update` round-trip: identical retry replays with `replayed:true` and 0 new rows, changed-payload retry fails closed, the near-duplicate hint rides the existing response envelope. | vitest |
| Manual | One end-to-end MCP check that a retried save replays the prior success and that a near-duplicate surfaces as a single inline advisory hint, never a block or queue. | MCP call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (`001-provenance-and-audit`) pre-mutation write-ingress guard | Internal | Yellow | The replay wrapper needs Phase 1's pre-mutation hook point; without it there is no clean place for receipt lookup before the write. Sequence after Phase 1. |
| Existing dedup substrate (`handlers/save/dedup.ts`: `content_hash`, `checkExistingRow`, `checkContentHashDedup`) | Internal | Green | Retry-vs-content classification (REQ-001) loses its reuse base; would have to be re-implemented from scratch. |
| Existing advisory substrate (`handlers/save/response-builder.ts`: `assistiveRecommendation`, `related_ids`) | Internal | Green | The `replayed:true` flag and `near_duplicate_of` hint (REQ-001/REQ-002) lose their existing envelope surface. |
| Embeddings / vector store (existing index-scan path, `handlers/memory-index.ts` + `enrichment-state.ts`) | Internal | Green | Near-duplicate (REQ-002) and `last_dedup_checked_at` (REQ-003) cannot compute or repair deferred vectors; near-dup is then permanently skipped. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The receipt replay wrongly suppresses a legitimate distinct write, the near-duplicate advisory adds noise or false positives, the migration corrupts existing `memory_index` rows, or receipt lookup degrades write latency.
- **Procedure**: Keep the idempotency receipt behind a feature flag for the first rollout; with the flag off, `memory_save`/`memory_update` revert to their current pass-through behavior and no receipt is written. The advisory `near_duplicate_of` hint is additive and independently removable from the response builder without touching write acceptance (it never gates a write). The schema additions are idempotent, additive columns plus one table, so dropping them via the migration's down path leaves the write path functional. Revert the handler/schema edits and re-run the migration's down path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: receipt table + columns) ──► Phase 2 (Core: replay wrapper + classifier + enricher) ──► Phase 3 (Verify: retry + fail-closed + advisory tests)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 (`001-provenance-and-audit`) pre-mutation write-ingress guard | Core |
| Core | Setup (receipt table + `near_duplicate_of` / `last_dedup_checked_at` columns) | Verify |
| Verify | Core (wrapper, classifier, enricher, response carry) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (receipt table + 2 additive columns via idempotent migration) | Low | 1-2 hours |
| Core Implementation (pre-mutation replay wrapper, retry-vs-content classifier, advisory near-dup enricher, `last_dedup_checked_at`, response carry) | Med | 4-7 hours |
| Verification (vitest: replay 0-dup, fail-closed, classifier, advisory-only, no-embedding skip, rescan short-circuit) | Med | 2-3 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] SQLite DB backed up before the additive migration runs (receipt table + `near_duplicate_of` / `last_dedup_checked_at` columns).
- [ ] Idempotency-receipt feature flag wired and defaulted off until retry tests pass.
- [ ] Latency check on a representative save confirms receipt lookup stays under the NFR-P01 budget.

### Rollback Procedure
1. Disable the idempotency-receipt feature flag — `memory_save`/`memory_update` revert to current pass-through behavior and no receipt is written.
2. If the advisory hint is the problem, remove the `near_duplicate_of` carry from `response-builder.ts`; it is additive and never gates write acceptance.
3. Revert the handler/schema edits and re-run the migration's down path to drop the additive columns and receipt table.
4. Smoke-test a save and an update to confirm the write path is functional without the receipt.

### Data Reversal
- **Has data migrations?** Yes — one additive receipt table plus two additive `memory_index` columns, all idempotent.
- **Reversal procedure**: Run the migration down path to drop the receipt table and the `near_duplicate_of` / `last_dedup_checked_at` columns; existing rows are untouched because the columns are additive and nullable.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

