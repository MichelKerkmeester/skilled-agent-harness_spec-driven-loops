---
title: "Implementation Plan: Lineage and Metadata Repair Runner"
description: "Plan for a direct-run migration script that repairs graph metadata files and scan-proven lineage identity drift."
trigger_phrases:
  - "lineage metadata repair plan"
  - "graph metadata migration plan"
  - "memory lineage logical key repair"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner"
    last_updated_at: "2026-05-19T20:08:00Z"
    last_updated_by: "codex"
    recent_action: "Planned and executed metadata repair runner"
    next_safe_action: "Commit repaired graph metadata and runner"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:5e60859cae51308d516e260e76edb2f2e6f4b58f1812f43572d1281907996d76"
      session_id: "codex-019-lineage-and-metadata-repair-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Lineage and Metadata Repair Runner

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM, SQLite CLI, JSON files |
| **Framework** | Spec Kit MCP server scripts |
| **Storage** | `.opencode/specs/**/graph-metadata.json`, `context-index.sqlite` |
| **Testing** | `node --check`, dry-run, real-run, direct `handleMemoryIndexScan`, strict spec validation |

### Overview
The runner walks graph metadata files under `.opencode/specs`, repairs only files with schema or scan-proven defects, and emits a structured report. It also reads scan logs for `E_LINEAGE` predecessor ids and realigns stale version-1 lineage keys to the current `memory_index` identity after copying the SQLite files to `/tmp`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failure classes identified from `/tmp/scan-stdout.log`.
- [x] Graph metadata v1 schema identified in `graph-metadata-schema.ts`.
- [x] Importance tier enum identified in `tool-input-schemas.ts` and SQLite check constraint.

### Definition of Done
- [x] Runner supports `--dry-run`.
- [x] Runner writes backups before real mutations.
- [x] Runner is idempotent after repair.
- [x] Post-repair scan clears targeted metadata classes.
- [x] Packet docs are complete and strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct maintenance CLI with filesystem repair plus guarded SQLite repair.

### Key Components
- **Graph file walker**: Finds `graph-metadata.json` files inside spec folders that have `spec.md`.
- **Schema normalizer**: Writes v1 fields: `schema_version`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `manual`, and `derived`.
- **Tier normalizer**: Maps legacy `high` to `important`, the canonical accepted replacement.
- **V8 compactor**: For scan-rejected graph metadata, clears foreign manual relationships and noisy derived references.
- **Lineage repair**: Reads `E_LINEAGE` predecessor ids from the scan log and updates stale `memory_lineage.logical_key` rows to the current `memory_index` identity.

### Data Flow
Scan log input identifies graph metadata failures and stale lineage predecessor ids. The graph repair path rewrites only changed JSON files after copying originals to `/tmp`. The lineage path copies SQLite files to `/tmp`, updates stale lineage rows, and refreshes active projections for those memory ids.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-metadata.json` files | Packet graph metadata indexed by memory scan | Upgrade v0 and stale v1 files, normalize tier values, compact V8 rejects | Post-repair scan shows invalid graph schema 0, tier check 0, V8 0 |
| `memory_lineage` table | Append-first lineage identity store | Repair scan-proven stale version-1 logical keys | Post-repair scan shows E_LINEAGE 0 |
| `active_memory_projection` table | Active lineage projection | Replace stale projection keys for repaired memory ids | Scan completed without E_LINEAGE |
| `description.json` files | Packet description metadata | Unchanged, outside allowed scope | Final scan shows only 3 description metadata failures remain |

Required inventories:
- Same-class producers: `rg -n "graphMetadataSchema|importanceTierEnum|E_LINEAGE" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-spec-kit/scripts`
- Consumers of changed script: direct operator invocation, no source imports.
- Matrix axes: dry-run vs real-run, graph-only vs graph plus lineage, schema repair vs tier repair vs V8 compaction.
- Algorithm invariant: a real run must only mutate files it can validate to v1 and lineage rows proven stale by scan output.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation
- [x] Read investigation report and scan output.
- [x] Confirm `E_LINEAGE` mismatch recipe.
- [x] Confirm graph metadata v1 shape.
- [x] Confirm accepted importance tier enum.

### Phase 2: Core Implementation
- [x] Create direct-run repair script.
- [x] Add graph metadata repair and backup path.
- [x] Add guarded SQLite lineage repair and backup path.
- [x] Add V8 compaction for scan-rejected graph metadata.

### Phase 3: Verification
- [x] Run dry-run and inspect counts.
- [x] Run real migration.
- [x] Re-run scan until targeted classes are clear.
- [x] Update packet docs and commit handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Runner parses as Node ESM | `node --check` |
| Dry-run | Planned file and lineage repairs | `node repair-graph-metadata.mjs --dry-run` |
| Migration | Real file and SQLite repair | `node repair-graph-metadata.mjs` |
| Integration | Full memory scan failure count | Direct `handleMemoryIndexScan` script |
| Documentation | Packet template compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite CLI | Local tool | Green | Lineage repair cannot run without `sqlite3` |
| Scan logs | Runtime evidence | Green | Runner cannot know stale predecessor ids or V8 targets without scan evidence |
| Spec Kit graph schema | Internal source | Green | Defines v1 required fields |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-repair scan shows new graph schema, tier, or lineage failures caused by this packet.
- **Procedure**: Restore affected graph metadata files and SQLite database files from the `/tmp/repair-graph-metadata-*` backup directories recorded in `implementation-summary.md`, then rerun scan.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigation | Scan log and schema source reads | Implementation |
| Implementation | Investigation | Verification |
| Verification | Implementation | Handoff |
| Handoff | Verification | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Investigation | Medium | Completed in-session |
| Runner implementation | Medium | Completed in-session |
| Migration and scan verification | Medium | Completed in-session |
| Documentation and validation | Low | Completed in-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Artifact | Rollback Source |
|----------|-----------------|
| Graph metadata files | `/tmp/repair-graph-metadata-*` backup directories |
| SQLite lineage state | Backed up `context-index.sqlite` files in the first real-run backup directory |
| Packet docs and runner | Do not stage or revert from commit scope before commit |
<!-- /ANCHOR:enhanced-rollback -->
