---
title: "Feature Specification: Phase 1: provenance-and-audit [template:level_1/spec.md]"
description: "Automated writers (enrichment, promoters, reducers) can overwrite human and constitutional memory fields, there is no explicit source_kind on writes, and automated mutations are not uniformly audited. This phase tags every write with a server-derived source_kind, blocks automated overwrites of manual data at write ingress, and standardizes automated-mutation audit."
trigger_phrases:
  - "memory source_kind provenance"
  - "auto overwrite manual constitutional guard"
  - "mutation_ledger automated audit"
  - "write ingress provenance derivation"
  - "constitutional immunity memory writers"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: provenance-and-audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/001-provenance-and-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-idempotency-and-near-duplicate |
| **Handoff Criteria** | `source_kind` persisted on every write, auto-overwrite guard live at write ingress, automated mutations append deduped `mutation_ledger` rows, and the constitutional immunity rule registered. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification.

**Scope Boundary**: Write-path provenance and audit only. This phase adds the `source_kind` enum, enforces the auto-cannot-overwrite-manual/constitutional invariant at write ingress, standardizes automated-mutation audit on the existing `mutation_ledger`, and registers one narrow constitutional rule. It does NOT touch idempotency receipts (phase 002), active feedback reducers (phase 003), tombstones/edges (phase 004), or any fleet/multi-tenant provenance or trust tiers.

**Dependencies**:
- None blocking — this is the first phase. It builds on substrate that already exists: `provenance_source`/`provenance_actor` accepted on save (`handlers/memory-save.ts`) and the append-only `mutation_ledger` (SQLite triggers).

**Deliverables**:
- `source_kind` enum column (`human|agent|system|import|feedback`) on the memory index schema, server-derived from caller/path/tool at write ingress.
- Write-ingress overwrite guard that skips automated updates to human/constitutional fields, still saves safe fields, and surfaces a "skipped to protect manual data" hint on the response envelope.
- Standardized automated-mutation audit: each automated mutation appends one deduped row to `mutation_ledger` with actor/source/reason.
- One narrow constitutional rule: automated writers may never overwrite manual/constitutional fields (advisory in validation).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Automated writers (enrichment, promoters, reducers) can overwrite human-authored and constitutional memory fields because the write path enforces no provenance-based protection. There is no explicit `source_kind` on a write, so a row cannot tell who wrote it or whether an automated actor should have been allowed to. Automated mutations are not uniformly audited, so there is no complete append-only trail of what each automated actor changed and why.

### Purpose
Every memory write carries an explicit, server-derived `source_kind`, automated writers cannot overwrite manual or constitutional fields, and all automated mutations append audit rows — fully automatic and invisible to the user, with zero added steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `source_kind` enum (`human|agent|system|import|feedback`) to the memory index schema, server-derived from caller/path/tool.
- Enforce auto-cannot-overwrite-manual/constitutional at WRITE INGRESS (the pre-mutation phase), not via caller discipline.
- Standardize automated-mutation audit by reusing the existing `mutation_ledger` (no parallel audit table).
- Add one narrow constitutional rule: automated writers may never overwrite manual/constitutional fields.

### Out of Scope
- Idempotency receipts and near-duplicate detection - belongs to phase 002.
- Active feedback reducers - belongs to phase 003.
- Tombstones and edge promotion - belongs to phase 004.
- Any fleet/multi-tenant provenance or trust tiers - out of program scope (this is a local single-user system).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add the `source_kind` enum column to the memory index schema plus a forward migration. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Modify | Derive `source_kind` at write ingress for new records; persist non-null on every insert. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify | Derive `source_kind` on update and enforce the manual/constitutional overwrite guard at write ingress. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modify | Append the standardized automated-mutation audit row in the post-write hook (cache/audit only, never integrity decisions). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modify | Provide a deduped audit-append entry point keyed by a deterministic event key (actor/source/reason). |
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Create | One narrow constitutional rule: automated writers may never overwrite manual/constitutional fields. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `source_kind` is persisted and server-derived from caller/path/tool. | Every write row has a non-null `source_kind`; the value is derived server-side and the user is never prompted for it. |
| REQ-002 | Auto-cannot-overwrite-manual/constitutional is enforced at write ingress. | An automated update targeting a human/constitutional field is skipped, safe fields are still saved, and the response carries a "skipped to protect manual data" hint. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Automated mutations append deduped audit rows to `mutation_ledger`. | Each automated mutation records exactly once with actor/source/reason; a repeated identical mutation does not append a duplicate row. |
| REQ-004 | The constitutional rule is registered. | The rule file exists under `constitutional/`, is picked up by the loader, and surfaces as advisory in validation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Writes are provenance-tagged automatically — every memory row has a non-null, server-derived `source_kind` and no save/update flow ever prompts the user for it.
- **SC-002**: Manual and constitutional data is structurally protected — an automated write that targets a human/constitutional field is refused at write ingress while safe fields still persist.
- **SC-003**: The audit trail is complete and append-only — every automated mutation appends one deduped `mutation_ledger` row with actor/source/reason, and no parallel audit table is introduced.
- **SC-004**: Zero added user steps — all behavior fires from the existing write path and post-write hook; the only user-visible signal is a quiet "skipped to protect manual data" hint when an overwrite was blocked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing memory write path (`create-record.ts`, `memory-crud-update.ts`) and the `mutation_ledger` SQLite triggers. | Low — substrate already exists; this is incremental hardening, not new infrastructure. | Build on `provenance_source`/`provenance_actor` and the append-only ledger already present. |
| Risk | `mutation-hooks.ts` is post-write, so a guard placed there fires too late to prevent an overwrite. | High | Put the overwrite guard and `source_kind` derivation in the PRE-mutation phase (write ingress in the update/create handlers); keep only cache invalidation and audit append in the post-write hook. |
| Risk | Audit noise — automated mutations could flood `mutation_ledger` with redundant rows. | Med | Deterministic event keys for dedup, append-once per logical mutation, and a summary view in `/doctor` rather than raw dumps. |
| Risk | Over-broad `source_kind` inference could mislabel writes (e.g. tag a human edit as `agent`). | Med | Derive strictly from explicit caller/tool context at write ingress; default conservatively and never guess from content. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The write-ingress `source_kind` derivation plus the manual/constitutional overwrite guard add < 5 ms p95 to a `memory_save`/`memory_update` call (no extra DB round-trip; derivation is in-memory from caller/tool context, the protected-field check reads only the already-loaded current row).
- **NFR-P02**: The `mutation_ledger` audit append runs in the post-write hook and is non-blocking on the caller's response — a failed or slow append never delays or fails the save it audits.

### Security
- **NFR-S01**: Manual (`human`) and constitutional fields are structurally protected from automated overwrite at write ingress — an automated (`source_kind != human`) update cannot mutate them through any normal save/update path, not merely by caller convention.
- **NFR-S02**: `source_kind` is server-derived from the caller/path/tool at write ingress and is never accepted from a client-asserted field, so provenance cannot be forged by a caller claiming to be `human`.

### Reliability
- **NFR-R01**: The overwrite guard fails safe — if the protected-field set or the row's origin is ambiguous, the field is treated as protected and the automated write to it is skipped (safe fields in the same payload still persist), so a guess never silently overwrites manual data.
- **NFR-R02**: The audit append is append-only and idempotent under retries — a deterministic event key (actor/source/reason) makes a re-delivered identical mutation append zero additional `mutation_ledger` rows.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Legacy rows with null `source_kind`**: rows written before the migration have no `source_kind`; the forward migration backfills them from the existing `provenance_source` (default conservative when that is also absent), and the guard treats an unresolved origin as protected.
- **A field that is both manual-authored and automatically enrichable** (e.g. a human-edited title that an enrichment pass would also touch): precedence is manual-wins — once a field carries a `human` origin, automated writers skip it and the safe/derived fields in the same payload still persist.
- **Mixed-origin payload** (a single update carrying both a protected manual field and a safe field): the guard partitions the payload, skips only the protected field, persists the safe field, and attaches one "skipped to protect manual data" hint.

### Error Scenarios
- **`mutation_ledger` append fails** (lock, disk, trigger error): surface a non-fatal warning, do NOT block or roll back the write it was auditing — the audit gap is logged, the save still succeeds.
- **Automated write targets a constitutional row**: the write to the protected field is skipped and the response returns a typed "skipped to protect manual data" hint rather than a hard error, so the automated actor continues with its safe fields.
- **Derivation cannot resolve a `source_kind`**: ambiguous row origin is treated as protected; the unauthenticated MCP write surface defaults to `source_kind=human` by design because it is the human channel on this local single-user system. Automated callers (enrichment, promoters, reducers, and later automated phases) must inject automated provenance context (`__provenanceContext`) so they are classified non-human and subject to the guard.

### State Transitions
- **`source_kind` changes from `agent` to `human`**: when a human manually edits a row previously written by an automated actor, the row's `source_kind` flips to `human` and the field becomes protected from future automated overwrite — a legitimate human-over-automated write is always allowed.
- **Re-running the same automated mutation**: the second identical run derives the same event key, so the row is unchanged and no duplicate audit row is appended (idempotent).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 6 files: schema + migration, two write-ingress handlers (create/update), the post-write hook, the ledger entry point, and one constitutional rule file; ~150-250 LOC plus vitest coverage. |
| Risk | 16/25 | Touches the live memory write path and adds a refusal branch that can drop fields, plus registers a constitutional rule — a wrong guard or origin inference can block legitimate human writes or mislabel provenance. |
| Research | 6/20 | Design is settled in research/008 integration; remaining unknowns are narrow (exact constitutional field set, `import`/`feedback` tier) and confirmable against the live schema during Setup. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `import` and `feedback` `source_kind` values share the same overwrite protection as `agent`/`system`, or be treated as a distinct tier? (Default assumption: all non-`human` kinds are blocked from overwriting human/constitutional fields.)
- Which exact set of fields counts as "constitutional" for the overwrite guard, and is that set derived from the row's `importance_tier`/`contextType` or from an explicit field allowlist? (To be confirmed against the schema during Setup.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
