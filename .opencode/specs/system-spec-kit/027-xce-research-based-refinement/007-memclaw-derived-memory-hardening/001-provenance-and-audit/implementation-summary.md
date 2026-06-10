---
title: "Implementation Summary: Phase 1: provenance-and-audit [template:level_1/implementation-summary.md]"
description: "Completed implementation summary for provenance-and-audit: source_kind tagging, write-ingress overwrite guard, deduped mutation_ledger audit, and advisory constitutional rule."
trigger_phrases:
  - "memory source_kind provenance"
  - "auto overwrite manual constitutional guard"
  - "mutation_ledger automated audit"
  - "write ingress provenance derivation"
  - "provenance audit phase summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-10T12:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Reconciled completed provenance docs"
    next_safe_action: "Begin next child phase after handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
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
| **Spec Folder** | 001-provenance-and-audit |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The provenance-and-audit hardening is implemented. Memory writes now carry a server-derived `source_kind`, automated writers are stopped at write ingress before they can overwrite protected manual or constitutional data, automated mutations append deduped audit records, and the constitutional rule is registered as advisory guidance.

### Server-derived `source_kind` on every write

The memory index schema moved from `SCHEMA_VERSION` 34 to 35 with an additive guarded `ALTER TABLE memory_index ADD COLUMN source_kind ... DEFAULT 'system' CHECK(...)` migration registered as `migrations[35]`. The migration is idempotent: re-running it leaves one `source_kind` column. Existing rows are backfilled from `provenance_source`: `manual` maps to `human`, `memory_index_scan` maps to `import`, `feedback-validator` maps to `feedback`, and missing provenance maps to `system`.

New records persist `source_kind` inside the insert transaction through `persistSourceKind`. Updates derive `source_kind` server-side through `deriveSourceKindFromContext`; callers cannot assert it directly. The `memory_update` schema is strict, so forged `source_kind` or `__provenanceContext` input is rejected at dispatch.

### Write-ingress overwrite guard

`buildGuardedUpdateParams` runs in `memory-crud-update.ts` before mutation. It skips automated overwrites of protected fields, persists safe fields from the same payload, and returns the "skipped to protect manual data" hint instead of throwing. Human writes and human-over-automated writes are allowed; a human edit flips `source_kind` to `human` and protects the field. Ambiguous row origin, including a null row `source_kind`, is treated as protected.

`mutation-hooks.ts` stays post-write only. It handles cache invalidation and audit append; it does not make integrity decisions.

### Standardized automated-mutation audit

Automated mutation audit reuses `mutation_ledger`. The append is deduped with a SHA-256 event key over actor, source, and reason; re-running the same logical mutation appends zero additional rows. Audit append is non-blocking: append failure logs a warning and never fails or rolls back the save being audited.

### Advisory constitutional rule

`constitutional/automated-writers-never-overwrite-manual.md` is registered through the constitutional loader. It is advisory only and does not add blocking machinery.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Adds the `source_kind` enum column and migration 35 with idempotent backfill. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Modified | Persists server-derived `source_kind` inside the create transaction. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modified | Derives update provenance, rejects forged provenance input, and runs the pre-mutation guard. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modified | Keeps post-write cache and audit behavior only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modified | Provides deduped audit append keyed by actor, source, and reason. |
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Created | Registers the advisory constitutional rule. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed as an additive schema migration, create/update ingress changes, post-write audit standardization, and one advisory constitutional rule. Independent verification reported `npm run build` exit 0 and 9 green vitest suites covering 74 tests: `create-record-identity`, `gate-d-regression-constitutional-memory`, `memory-crud-update-constitutional-guard`, `mutation-hooks`, `mutation-ledger`, `vector-index-schema-compatibility`, `vector-index-schema-migration-refinements`, `vector-index-schema-incremental-foundation`, and `causal-edges-write-safety`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the `source_kind` derivation and overwrite guard in the pre-mutation (write-ingress) phase, not in `mutation-hooks.ts`. | `mutation-hooks.ts` is post-write, so a guard there fires too late to prevent an overwrite. Integrity decisions have to run before the transactional writer. |
| Reuse the existing `mutation_ledger` for the audit instead of adding a parallel table. | The append-only ledger and its SQLite triggers already exist; a second table would split the trail and add maintenance for no gain. |
| Dedup audit appends with a deterministic event key over actor/source/reason. | Stops automated mutations from flooding the ledger with redundant rows while keeping one row per logical mutation. |
| Treat the protected field set as rows with `importance_tier` constitutional or critical, plus pinned data; manual protection comes from `source_kind: human`. | This resolves the open protected-set question with row metadata the write path already has, without adding a separate field allowlist. |
| Treat every non-`human` kind (`agent`, `system`, `import`, `feedback`) as automated for overwrite protection. | `import` and `feedback` are not separate trust tiers; all automated origins are blocked from overwriting human or constitutional fields. |
| Default the unauthenticated MCP write surface to `human`, while treating ambiguous row origin as protected. | On this local single-user system the MCP save/update surface is the human channel. Automated callers must inject automated provenance context so they are classified non-human and subject to the guard. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | PASS - `npm run build` exit 0. |
| Vitest | PASS - 9 suites / 74 tests green. |
| Schema migration | PASS - `SCHEMA_VERSION` 34 to 35, migration registered as `migrations[35]`, idempotent re-run yields one column. |
| Backfill mapping | PASS - `manual` to `human`, `memory_index_scan` to `import`, `feedback-validator` to `feedback`, null to `system`. |
| Create/update provenance | PASS - create persists via `persistSourceKind`; update derives via `deriveSourceKindFromContext`; forged client provenance rejected by strict dispatch schema. |
| Guard behavior | PASS - automated protected-field writes skip only protected fields, safe fields persist, response carries the skipped hint, and human writes remain allowed. |
| Audit behavior | PASS - deduped by SHA-256 actor/source/reason key; repeated mutation appends zero rows; append failure warns without rollback. |
| Constitutional rule | PASS - loader sees the rule and treats it as advisory. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P1: Human-default caller discipline for phase-003+ automated writers.** The unauthenticated MCP save/update surface defaults to `human` by design because it is the local human channel. Automated callers introduced later must inject automated provenance context (`__provenanceContext`) so they are classified as non-human and subject to the guard.
2. **P2: Startup drift repair re-runs the backfill each boot.** This is convergent and protection-only, but it is still repeated work that could be optimized later.
3. **P2: Audit event key omits a value hash.** The key matches the current requirement by hashing actor/source/reason, but it does not distinguish identical reasons that carry different values.
4. **P2: Strict-schema defense-in-depth.** Consider stripping `__provenanceContext` at dispatch when `SPECKIT_STRICT_SCHEMAS=false`, so forged provenance input is removed even if strict schemas are disabled.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
