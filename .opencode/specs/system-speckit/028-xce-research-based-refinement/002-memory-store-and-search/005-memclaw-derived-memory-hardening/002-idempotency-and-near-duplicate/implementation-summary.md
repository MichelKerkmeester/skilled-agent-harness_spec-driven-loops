---
title: "Implementation Summary: Phase 2: idempotency-and-near-duplicate"
description: "Implemented server-derived idempotency receipts, replay/fail-closed handling, advisory near_duplicate_of, and last_dedup_checked_at markers behind SPECKIT_MEMORY_IDEMPOTENCY."
trigger_phrases:
  - "memory save idempotency receipt summary"
  - "retry-safe memory write replay"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "duplicate row on retried save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-idempotency-and-near-duplicate |
| **Status** | Implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

`memory_save` and `memory_update` now have a default-off, server-derived idempotency path. When `SPECKIT_MEMORY_IDEMPOTENCY=true`, identical retries replay the stored MCP response (originally with a `replayed:true` marker; phase 023 later removed the marker so replay returns the original response verbatim), changed-payload retries fail closed with `idempotency_key_conflict`, and near-duplicates can surface as one advisory `near_duplicate_of` hint without rejecting or merging the write.

### Idempotency receipt + replay wrapper

A new additive SQLite receipt table stores a server-derived receipt key, payload hash, and prior MCP response. The key ignores client-supplied idempotency-token fields and is derived from operation name, content hash, and a request fingerprint. Save and update handlers check the receipt before mutation: hit-match returns the stored response (the `replayed:true` marker this phase added was removed by phase 023 in favor of verbatim replay); hit-mismatch returns `idempotency_key_conflict` and writes nothing; miss proceeds normally. Receipt-store failure is best-effort and logs a warning while returning the normal successful write.

### Advisory near-duplicate + dedup marker

A deterministic near-duplicate helper reuses the dedup threshold constant and computes only when an embedding is already available. It writes `near_duplicate_of` as JSON metadata plus `last_dedup_checked_at`, and response building surfaces exactly one advisory hint when present. Rows without embeddings are skipped silently, and index scan can repair unstamped success rows later. A marker short-circuits rescans while `updated_at <= last_dedup_checked_at`; content changes clear the short-circuit.

### Rollout flag

The runtime behavior is gated by `SPECKIT_MEMORY_IDEMPOTENCY`, default off. With the flag off, the new schema is present but receipt lookup, replay, fail-closed conflict, and near-duplicate advisory behavior are inert.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Bumped schema 35 to 36; added receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns with idempotent migration and compatibility checks. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Added | Centralized flag, key derivation, receipt lookup/store, replay marker, and token stripping. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts` | Added | Centralized advisory computation, marker short-circuit, marker clearing, and hint parsing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Added pre-mutation receipt lookup/replay/conflict path and post-write best-effort receipt store. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modified | Added the same receipt replay and conflict handling at the guarded pre-mutation point. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | Modified | Added retry-vs-content classifier and near-duplicate threshold export. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts` | Modified | Exposed marker short-circuit and clear helpers through the enrichment state surface. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modified | Carries `replayed:true` and `near_duplicate_of` on the existing response envelope (the marker was later removed by phase 023; `near_duplicate_of` remains). |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Adds best-effort index-scan repair for unstamped success rows when the flag is on. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/**` | Modified | Added focused idempotency/near-duplicate coverage and updated schema canaries. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documents `SPECKIT_MEMORY_IDEMPOTENCY`; count 174 to 175. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Delivered in one additive pass. Schema migration is always present and idempotent; runtime behavior stays behind `SPECKIT_MEMORY_IDEMPOTENCY=false` by default so existing writes remain byte-identical unless the rollout flag is enabled. Verification used TypeScript build plus targeted Vitest canaries for schema, save/update, dedup, and the new receipt/advisory suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep the receipt minimal (one SQLite table, server-derived key only) | Avoids drifting toward HTTP idempotency semantics (sentinel/TTL/poll) that this local single-user phase does not need. |
| Near-duplicate stays advisory-only and deterministic | A fixed-threshold hint never gates a write, so it adds value without friction and needs no LLM judge or review queue. |
| Compute near-duplicate post-embedding only, gated by `last_dedup_checked_at` | Skipping rows without vectors and rows unchanged since the marker avoids noise and redundant rescans. |
| Sequence after Phase 1 and share its pre-mutation guard | Receipt lookup must run before the write; reusing Phase 1's write-ingress hook avoids adding a second hook (`mutation-hooks.ts` is post-write). |
| Make receipt persistence best-effort | A receipt-store failure must never block a legitimate write, so the successful write returns and logs a warning if receipt persistence fails. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm run build` | Pass |
| Targeted Vitest suite | Pass: 16 files, 214 tests, 53 skipped |
| vitest: idempotency receipt replays identical retry (0 duplicate rows) | Pass |
| vitest: same-key with changed-payload retry fails closed | Pass |
| vitest: forged client token cannot influence server-derived key | Pass |
| vitest: near-duplicate advisory and no-embedding skip | Pass |
| vitest: `last_dedup_checked_at` short-circuit and clear | Pass |
| vitest: receipt-store failure fallback | Pass |
| `validate.sh --strict` on this spec folder | Pending final validation run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Default off.** Runtime replay, conflict, and near-duplicate behavior only run when `SPECKIT_MEMORY_IDEMPOTENCY=true`.
2. **Near-duplicate requires embeddings.** Rows without an embedding are skipped silently; index scan can stamp them later after embeddings exist.
3. **Receipt persistence is best-effort.** If receipt storage fails after a valid write, the save/update still succeeds and logs a warning, so that specific write will not replay until a later successful receipt store.

### Verification Matrix

| Axis | Covered Values |
|------|----------------|
| Receipt state | miss, hit-match replay, hit-mismatch conflict |
| Embedding state | present advisory, absent silent skip |
| Operation | save receipt path, update receipt path |
| Row changed since marker | unchanged short-circuit, changed clear/rescan path |
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
