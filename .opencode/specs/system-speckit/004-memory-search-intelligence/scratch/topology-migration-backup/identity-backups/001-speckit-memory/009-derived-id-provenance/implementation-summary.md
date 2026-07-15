---
title: "Implementation Summary: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "C4-B implementation summary: generated causal edges now have default-off content-addressed derived_id provenance through a helper, v40 additive migration, write-path wiring, tombstone preservation, focused tests and packet validation."
trigger_phrases:
  - "C4-B implementation summary"
  - "derived_id status"
  - "content-addressed causal edge summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance"
    last_updated_at: "2026-07-06T19:16:29.962Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off derived-id provenance with schema v40 and focused tests"
    next_safe_action: "Keep benchmark-only insert-cost measurement pending until measured"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical field order is kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version."
      - "The feature flag is SPECKIT_DERIVED_ID_PROVENANCE and is default-off."
      - "SCHEMA_VERSION moved from 39 to 40 for the derived-id provenance migration."
---
# Implementation Summary: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-derived-id-provenance |
| **Completed** | 2026-06-19 |
| **Level** | 3 |
| **Candidate status** | DONE behind default-off `SPECKIT_DERIVED_ID_PROVENANCE` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

C4-B gives generated causal edges a content-addressed `derived_id` without changing manual causal-edge behavior. The helper freezes the canonical recipe as `kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version`, normalizes absent anchors to `""` and delegates hashing to the shipped `hashCanonicalJson` primitive. No third hash primitive was introduced.

The schema moved from `SCHEMA_VERSION` 39 to 40. The v40 migration adds `causal_edges.derived_id TEXT`, backfills generated rows using the reserved legacy sentinel `legacy-pre-derived-id`, leaves duplicate computed identities `NULL` before creating `idx_causal_edges_derived_id` and creates a partial unique index on non-null derived ids. The write path persists `derived_id` only for generated rows and only when `SPECKIT_DERIVED_ID_PROVENANCE=true`. Manual rows keep `derived_id = NULL`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Modified | Added the causal-edge derived-id helper and constants over `hashCanonicalJson` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Added default-off `SPECKIT_DERIVED_ID_PROVENANCE` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts` | Modified | Registered the new `SPECKIT_*` flag in the known list |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Added v40 schema migration, column/index creation, duplicate-safe backfill and rollback helper for tests |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modified | Wired generated-edge inserts/upserts to compute and persist derived ids behind the flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` | Modified | Preserved `derived_id` in tombstone restore metadata when the column exists |
| `.opencode/skills/system-spec-kit/mcp_server/tests/derived-id-provenance.vitest.ts` | Added | Covered helper stability, migration/backfill, flag gating, replay, tombstone metadata and rollback |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | Updated the compatible schema fixture to include v40 derived-id provenance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation extends the existing idempotent schema-upgrade pattern used by the 007 and 008 migrations rather than creating a parallel migration mechanism. `create_schema` now repairs existing `causal_edges` tables with the derived-id column/index when needed, and migration v40 performs the same ensure/backfill sequence under the normal migration runner.

SQLite compatibility changed the planning shape slightly: instead of rewriting `causal_edges` to add a text primary-key rowid alias, the delivered schema uses an additive `TEXT` identity column plus a partial `UNIQUE` index. That preserves the content-addressed identity contract without a table rewrite and keeps the existing sequential `id` column intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `hashCanonicalJson` from `lib/content-id.ts`, not a new hash | The content-id module already centralizes canonical-field hashing |
| Include anchors in the derived-id input | Anchor-less identity was the known backfill wedge against the legacy anchor-inclusive UNIQUE |
| Use `legacy-pre-derived-id` for backfilled legacy rows | Existing rows predate rule versions but still need deterministic identities |
| Gate write-time persistence behind `SPECKIT_DERIVED_ID_PROVENANCE` | The feature is new provenance behavior and remains default-off |
| Use additive `TEXT` + partial `UNIQUE` index | SQLite can apply it safely without a table rewrite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline before changes | PASS, `npm run typecheck` plus focused existing migration/currentness/flag tests, 3 files / 30 tests |
| Memory MCP typecheck | PASS, `npm run typecheck` exit 0 |
| Memory MCP build | PASS, `npm run build` exit 0 |
| Focused Vitest suite | PASS, 5 files / 41 tests (`derived-id-provenance`, schema migration/compatibility, edge presence, flag ceiling) |
| Strict packet validation | PASS, `validate.sh --strict` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Benchmark-only cost measurement remains pending.** C4-B ships for correctness, no derived-edge insert-cost benchmark or performance delta is claimed.
2. **Causal edges only.** Other derived artifact stores remain out of scope.
3. **Write-time persistence is default-off.** Existing databases receive the additive schema/backfill, but new generated writes only populate `derived_id` when `SPECKIT_DERIVED_ID_PROVENANCE=true`.
<!-- /ANCHOR:limitations -->
