---
title: "Implementation Plan: Phase 1: provenance-and-audit"
description: "Adds a server-derived source_kind enum to the memory index schema, enforces the auto-cannot-overwrite-manual/constitutional invariant in the pre-mutation phase of the write path, and standardizes automated-mutation audit on the existing mutation_ledger via the post-write hook."
trigger_phrases:
  - "memory source_kind provenance"
  - "auto overwrite manual constitutional guard"
  - "mutation_ledger automated audit"
  - "write ingress provenance derivation"
  - "three-phase write split memory"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-10T12:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented provenance guard and audit"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: provenance-and-audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node |
| **Framework** | Spec Kit Memory MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite + vector store |
| **Testing** | vitest |

### Overview
This phase tags every memory write with a server-derived `source_kind` and makes manual/constitutional data structurally un-overwritable by automated writers. The `source_kind` derivation and the overwrite guard go in the pre-mutation (write-ingress) phase of the create/update handlers; automated-mutation audit is standardized on the existing `mutation_ledger` via the post-write hook. Most substrate already exists (`provenance_source`/`provenance_actor` on save, the append-only ledger), so this is incremental hardening, not new infrastructure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-phase write split (program-wide architectural rule). The memory write path divides into a pre-mutation guard (write ingress), a transactional writer, and a post-mutation hook. Each invariant lives in the correct phase: `source_kind` derivation and the manual/constitutional overwrite refusal belong to the pre-mutation guard; audit append belongs to the post-mutation hook. `handlers/mutation-hooks.ts` is post-write only and is too late for any integrity decision.

### Key Components
- **Schema (`lib/search/vector-index-schema.ts`)**: Adds the `source_kind` enum column (`human|agent|system|import|feedback`) plus a forward migration; `source_kind` defaults to the existing `provenance_source` if the migration is reverted.
- **Write-ingress derivation + guard (`handlers/save/create-record.ts`, `handlers/memory-crud-update.ts`)**: Derives `source_kind` server-side from caller/path/tool and, for updates, refuses automated overwrites of human/constitutional fields while still persisting safe fields. This is the pre-mutation phase.
- **Post-write audit (`handlers/mutation-hooks.ts`, `lib/storage/mutation-ledger.ts`)**: Appends one deduped audit row per automated mutation (actor/source/reason) keyed by a deterministic event key. Cache/audit only — never integrity decisions.
- **Constitutional rule (`constitutional/automated-writers-never-overwrite-manual.md`)**: Registers the narrow rule that automated writers may never overwrite manual/constitutional fields; advisory in validation.

### Data Flow
A caller invokes `memory_save` or `memory_update`. At write ingress, the handler derives `source_kind` from the explicit caller/tool context. For updates, the pre-mutation guard checks the target fields: if an automated (`source_kind != human`) write would overwrite a human/constitutional field, those fields are skipped and a "skipped to protect manual data" hint is attached to the response envelope while safe fields proceed. The transactional writer performs the insert/update with the derived `source_kind` persisted. The post-mutation hook then invalidates caches and appends a deduped audit row to `mutation_ledger` for automated mutations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/vector-index-schema.ts` | Owns the memory index schema and migrations. | update — add `source_kind` enum column + forward migration. | Migration runs clean; `rg -n 'source_kind' lib/search/vector-index-schema.ts`. |
| `handlers/save/create-record.ts` | Producer: inserts new memory rows. | update — derive and persist `source_kind` at write ingress. | New rows have non-null `source_kind`; vitest unit on derivation. |
| `handlers/memory-crud-update.ts` | Producer: updates existing rows. | update — derive `source_kind` and enforce overwrite guard in pre-mutation. | Blocked-overwrite vitest case; `rg -n 'source_kind|overwrite' handlers/memory-crud-update.ts`. |
| `handlers/mutation-hooks.ts` | Post-write hook: cache invalidation + enrichment kick. | update — append deduped audit row (no integrity decisions). | Append-once vitest case; guard stays absent here. |
| `lib/storage/mutation-ledger.ts` | Append-only audit ledger (SQLite triggers). | update — add deduped audit-append entry point keyed by deterministic event key. | Dedup vitest case; ledger remains append-only. |
| `handlers/memory-save.ts` | Existing save handler; already accepts `provenance_source`/`provenance_actor`. | unchanged consumer (call path feeds `create-record.ts`) — verify it forwards caller context for derivation. | `rg -n 'provenance_source|provenance_actor|source_kind' handlers/memory-save.ts`. |
| Response envelope `hints[]` / `assistiveRecommendation` | Public response surface for assistive signals. | update — carry the "skipped to protect manual data" hint when an overwrite is blocked. | Hint present in the blocked-overwrite vitest case. |
| `constitutional/` loader + validation | Loads constitutional rules and surfaces them in validation. | update (add-only) — register the new rule file; advisory surfacing. | Rule appears in validation output; loader picks up the new file. |

Required inventories:
- Same-class producers: `rg -n 'provenance_source|provenance_actor|source_kind' .opencode/skills/system-spec-kit/mcp_server/handlers .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'source_kind|mutation_ledger|provenance_source' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: `source_kind` (`human|agent|system|import|feedback`) x operation (`create|update`) x target field class (`manual/constitutional | safe`); the required rows are every automated kind attempting both a manual-field and a safe-field write on update.
- Algorithm invariant: an automated (`source_kind != human`) update MUST NOT mutate a human/constitutional field; safe fields in the same payload still persist; the audit append for a given logical mutation happens at most once (deterministic event key). Adversarial cases: mixed payload (manual + safe fields together), repeated identical automated mutation, and a human write that legitimately overwrites a prior automated value.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Add the `source_kind` enum column to `vector-index-schema.ts`.
- [x] Write the forward migration (default `source_kind` from existing `provenance_source`).
- [x] Confirm the constitutional "field class" set (which fields count as manual/constitutional) against the live schema.

### Phase 2: Core Implementation
- [x] Derive `source_kind` at write ingress in `create-record.ts` and `memory-crud-update.ts` (server-side, from caller/path/tool).
- [x] Enforce the manual/constitutional overwrite guard in the pre-mutation phase of `memory-crud-update.ts` (skip protected fields, persist safe fields).
- [x] Attach the "skipped to protect manual data" hint to the response envelope when an overwrite is blocked.
- [x] Standardize the automated-mutation audit append in `mutation-hooks.ts` + `mutation-ledger.ts` with a deterministic dedup key.
- [x] Add the constitutional rule file under `constitutional/`.

### Phase 3: Verification
- [x] vitest: automated overwrite of a manual/constitutional field is blocked while safe fields still save.
- [x] vitest: automated mutation appends exactly one `mutation_ledger` row; a repeat appends none.
- [x] vitest: every create/update path persists a non-null `source_kind`.
- [x] Update the phase implementation summary to describe `source_kind` and the overwrite guard.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `source_kind` derivation, the pre-mutation overwrite guard, and the deduped audit append. | vitest |
| Integration | `memory_save` / `memory_update` round-trip: derived `source_kind` persisted, blocked overwrite returns the hint, ledger appends once. | vitest |
| Manual | One end-to-end check that an automated update of a human-authored field is skipped and the response carries the "skipped to protect manual data" hint. | MCP call / `/doctor memory` audit summary |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing memory write path (`create-record.ts`, `memory-crud-update.ts`, `memory-save.ts`) | Internal | Green | Phase cannot land — the guard and derivation hook into this path. |
| `mutation_ledger` (SQLite triggers, `lib/storage/mutation-ledger.ts`) | Internal | Green | Audit append (REQ-003) blocked; provenance/guard (REQ-001/002) still possible. |
| `provenance_source` / `provenance_actor` fields (already on save) | Internal | Green | `source_kind` derivation loses its conservative default fallback. |
| Constitutional rule loader + validation surface | Internal | Green | REQ-004 blocked; the rule cannot be registered or surfaced as advisory. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The overwrite guard blocks legitimate human writes, the migration corrupts existing rows, or audit append degrades write latency.
- **Procedure**: `source_kind` is designed to default to the existing `provenance_source` if the migration is reverted, so dropping the column leaves the write path functional. The overwrite guard sits behind a fail-safe (fail-open on derivation ambiguity so a write is never silently lost) and can be disabled to restore prior behavior. The audit append is additive to `mutation_ledger` and can be turned off without touching the write path. Revert the handler/schema edits and re-run the migration's down path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: source_kind column + migration) ──► Phase 2 (Core: derivation, overwrite guard, audit, rule) ──► Phase 3 (Verify: vitest + manual)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None (substrate already exists: `provenance_source`, `mutation_ledger`) | Core |
| Core | Setup (the `source_kind` column must exist before derivation/guard can persist it) | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (schema column + forward migration + confirm constitutional field set) | Low | 1-2 hours |
| Core Implementation (write-ingress derivation + overwrite guard + deduped audit append + constitutional rule) | Med | 4-6 hours |
| Verification (vitest derivation/guard/dedup cases + manual `/doctor memory` check + docs) | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup of the memory SQLite DB taken before running the `source_kind` migration
- [ ] Overwrite guard wired behind a fail-open default (ambiguous derivation never drops a field)
- [ ] `/doctor memory` audit-summary reviewed for unexpected skipped-overwrite hints after first writes

### Rollback Procedure
1. Disable the overwrite guard so the update handler resumes prior write-through behavior.
2. Revert the handler/schema edits (`create-record.ts`, `memory-crud-update.ts`, `mutation-hooks.ts`, `mutation-ledger.ts`, `vector-index-schema.ts`) and re-run the migration's down path to drop the `source_kind` column.
3. Smoke-test `memory_save` / `memory_update` round-trips and confirm no rows were lost.
4. No stakeholder notification needed — this is a local single-user system with no user-facing surface beyond the quiet skipped-overwrite hint.

### Data Reversal
- **Has data migrations?** Yes — the forward migration adds the `source_kind` column and backfills it from `provenance_source`.
- **Reversal procedure**: Run the migration's down path to drop `source_kind`; existing rows are unaffected because the value defaulted from `provenance_source` and no source data was overwritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
