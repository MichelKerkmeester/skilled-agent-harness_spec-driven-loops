---
title: "Feature Specification: Lineage and Metadata Repair Runner"
description: "Migration runner for stale graph metadata and memory lineage repair after memory_index_scan reported metadata-class failures."
trigger_phrases:
  - "lineage metadata repair runner"
  - "repair graph metadata"
  - "E_LINEAGE repair"
  - "importance_tier high migration"
  - "v0 graph metadata upgrade"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner"
    last_updated_at: "2026-05-19T20:08:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented repair runner and completed migration run"
    next_safe_action: "Commit staged script, packet docs, and repaired graph-metadata.json files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs"
      - "/tmp/scan-stdout.log"
      - "/tmp/scan-post-final4.json"
    session_dedup:
      fingerprint: "sha256:4a42d5cb1af37b4c2d6db6e728329f7041cfc8977db3b96d7fa31591e3e43f6b"
      session_id: "codex-019-lineage-and-metadata-repair-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "importance_tier high maps to important because the accepted enum is constitutional, critical, important, normal, temporary, deprecated."
      - "E_LINEAGE rows came from stale memory_lineage logical keys that no longer matched memory_index identities."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Lineage and Metadata Repair Runner

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-constitutional-quality-gate-exemption |
| **Successor** | None |
| **Handoff Criteria** | Runner exists, migration is idempotent, strict validation passes, and scan failures drop materially |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the spec memory stack. It handles the metadata cleanup class left after the sufficiency-gate investigation: stale lineage identities, stale graph metadata schemas, invalid importance tiers, and graph metadata that fails V8 because archived relationship fields still point at foreign packets.

**Scope Boundary**: Repair the runner, the new packet docs, parent phase-map injection from `create.sh`, and affected `graph-metadata.json` files only.

**Dependencies**:
- Investigation report from packet 016: `scratch/2026-05-19-503-failed-rejection-investigation.md`
- Scan evidence from `/tmp/scan-stdout.log`
- Graph metadata v1 schema in `mcp_server/lib/graph/graph-metadata-schema.ts`
- Importance tier enum in `mcp_server/schemas/tool-input-schemas.ts` and the SQLite check constraint

**Deliverables**:
- Direct-run repair script at `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs`
- Migrated graph metadata files under `.opencode/specs/**/graph-metadata.json`
- SQLite lineage repair for scan-proven stale predecessor rows with `/tmp` database backup
- Packet docs with verification and commit handoff

**Changelog**:
- No changelog file was added in this pass. The packet handoff records exact staging paths for the main agent commit.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_index_scan` reported 503 failures. The investigation showed only 2 were sufficiency failures; the remaining class was metadata repair work: stale `memory_lineage.logical_key` values, graph metadata that did not satisfy the v1 schema, and `importance_tier: "high"` values rejected by the database enum. A later scan also showed graph metadata V8 rejects where archived metadata still carried foreign relationship references.

### Purpose
Provide a repeatable, idempotent repair runner and use it to reduce the scan failure count from metadata-class failures to only unrelated description metadata files outside this packet scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create a repair runner with `--dry-run`, `/tmp` backups, structured JSON output, and idempotent behavior.
- Upgrade stale graph metadata to the v1 shape with required `manual` and `derived` sections.
- Normalize `derived.importance_tier: "high"` to `important`.
- Compact V8-rejected graph metadata by clearing foreign relationships and noisy derived fields while preserving required packet identity.
- Repair scan-proven stale lineage rows by realigning `memory_lineage.logical_key` with the current `memory_index` identity.

### Out of Scope
- Repair malformed `description.json` files in packet 016/004/015, 016/004/017, and 016/004/018, because those files were not listed in the allowed mutation scope.
- Change `dist/` files, because they regenerate from source.
- Modify shipped packet 016/002/016 or packet 017 authored docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` | Create | Direct-run migration runner |
| `.opencode/specs/**/graph-metadata.json` | Modify | Metadata repair output |
| `.opencode/specs/.../002-spec-memory-stack/spec.md` | Modify | Phase-map injection from `create.sh` |
| `.opencode/specs/.../019-lineage-and-metadata-repair-runner/*` | Create/Modify | Packet documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement an idempotent repair runner | Second `--dry-run` reports `graphMetadata.changed: 0` for already repaired graph metadata |
| REQ-002 | Normalize invalid importance tier values | `CHECK constraint failed: importance_tier` count drops to 0 |
| REQ-003 | Upgrade stale graph metadata to v1 | `Invalid graph metadata content` count drops to 0 |
| REQ-004 | Repair stale lineage logical keys | `E_LINEAGE` count drops to 0 |
| REQ-005 | Preserve backup safety | Real runs create `/tmp/repair-graph-metadata-*` backups before mutation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Emit structured reports | Dry-run and real-run JSON include scanned counts, changed files, fixes, failures, and before/after counters |
| REQ-007 | Keep mutation scope bounded | No source `dist/` files or shipped 016/017 packet docs are edited |
| REQ-008 | Document handoff | `implementation-summary.md` includes exact staging paths and a draft conventional commit message |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Post-repair scan failure count drops from 503 to 3.
- **SC-002**: `E_LINEAGE`, invalid graph schema, invalid `importance_tier`, and graph metadata V8 failure counts are all 0.
- **SC-003**: Strict spec validation exits 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | SQLite lineage repair touches runtime database state | Bad rewrite could corrupt active projections | Runner backs up SQLite files to `/tmp` and only updates scan-proven version-1 predecessor rows |
| Risk | V8 compaction removes useful foreign relationship hints | Archived graph metadata becomes less rich | Only V8-rejected files are compacted, and source docs remain intact |
| Dependency | Active memory scan runtime | Post-repair verification can be slow | Direct `handleMemoryIndexScan` path was used when launcher bridge was saturated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Real runs write backups under `/tmp/repair-graph-metadata-*` before mutating graph metadata or SQLite lineage state.
- **NFR-S02**: The runner only repairs lineage rows identified by scan evidence.

### Reliability
- **NFR-R01**: Re-running the runner after repair produces no graph metadata writes.
- **NFR-R02**: The runner exits non-zero if repaired graph metadata still fails local v1 validation.

### Operability
- **NFR-O01**: Reports are structured JSON so operators can inspect changed file counts, fix classes, and failures.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Missing scan log**: Graph schema and tier repairs still run; lineage and scan-driven V8 repairs do not run.
- **Malformed graph JSON**: The file is rewritten to a v1 payload using safe defaults and packet docs.
- **Archived packet path drift**: Scan-rejected graph metadata uses the on-disk archive path as the canonical packet id.

### Error Scenarios
- **SQLite CLI unavailable**: Lineage repair reports a failure and graph metadata repairs remain independent.
- **Validation after repair fails**: The report includes failed files and exits with status 2.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Area | Complexity | Reason |
|------|------------|--------|
| Graph metadata repair | Medium | Multiple legacy shapes and archive paths need safe defaults |
| Lineage repair | Medium | Database updates must preserve active projections |
| V8 compaction | Low | Scan-rejected files use a narrow compact metadata form |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
