---
title: "Implementation Plan: Phase 1: provenance-and-audit [template:level_1/plan.md]"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-06T10:10:45Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 1 provenance-and-audit plan"
    next_safe_action: "Plan or implement T001 source_kind column migration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: provenance-and-audit

<!-- SPECKIT_LEVEL: 1 -->

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
- [ ] Add the `source_kind` enum column to `vector-index-schema.ts`.
- [ ] Write the forward migration (default `source_kind` from existing `provenance_source`).
- [ ] Confirm the constitutional "field class" set (which fields count as manual/constitutional) against the live schema.

### Phase 2: Core Implementation
- [ ] Derive `source_kind` at write ingress in `create-record.ts` and `memory-crud-update.ts` (server-side, from caller/path/tool).
- [ ] Enforce the manual/constitutional overwrite guard in the pre-mutation phase of `memory-crud-update.ts` (skip protected fields, persist safe fields).
- [ ] Attach the "skipped to protect manual data" hint to the response envelope when an overwrite is blocked.
- [ ] Standardize the automated-mutation audit append in `mutation-hooks.ts` + `mutation-ledger.ts` with a deterministic dedup key.
- [ ] Add the constitutional rule file under `constitutional/`.

### Phase 3: Verification
- [ ] vitest: automated overwrite of a manual/constitutional field is blocked while safe fields still save.
- [ ] vitest: automated mutation appends exactly one `mutation_ledger` row; a repeat appends none.
- [ ] vitest: every create/update path persists a non-null `source_kind`.
- [ ] Update the memory-system docs to describe `source_kind` and the overwrite guard.
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

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

