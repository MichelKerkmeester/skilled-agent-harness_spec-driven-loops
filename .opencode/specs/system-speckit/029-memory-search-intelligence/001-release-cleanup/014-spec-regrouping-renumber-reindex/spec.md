---
title: "Feature Specification: Spec Regrouping Renumber Reindex"
description: "Several spec groups were moved into new track folders with non-contiguous or duplicate numeric prefixes. This phase renumbers the selected groups, updates current path references, and reindexes spec memory so search and graph traversal resolve the new locations."
trigger_phrases:
  - "spec regrouping"
  - "renumber specs"
  - "path references"
  - "reindex specs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-speckit/029-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex"
    last_updated_at: "2026-07-04T17:31:31.478Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Corrected active orchestration numbering and added root metadata"
    next_safe_action: "Repair memory daemon and reindex"
    blockers:
      - "memory_index_scan returns E040"
    key_files:
      - ".opencode/specs/design"
      - ".opencode/specs/skilled-agent-orchestration"
      - ".opencode/specs/skilled-agent-orchestration/z_archive"
      - ".opencode/specs/deep-loops"
      - ".opencode/specs/deep-loops/z_archive"
    session_dedup:
      fingerprint: "sha256:cfedbed73bd762f1ce11b9b2601b0fca853f7f487730863dc38561bc77c71d5a"
      session_id: "spec-regrouping-renumber-reindex"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "User confirmed this phase folder as the documentation target."
      - "User explicitly declined rollback artifacts."
---
# Feature Specification: Spec Regrouping Renumber Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress - reindex blocked |
| **Created** | 2026-06-30 |
| **Branch** | current worktree |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-drift-remediation/spec.md |
| **Successor** | ../015-manual-playbook-execution-sweep/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The selected spec tracks were manually moved and regrouped, leaving gaps, duplicate numeric prefixes, and stale path references in spec metadata and markdown. These stale paths reduce continuity quality because indexed records, graph metadata, and human navigation may still point to old locations.

### Purpose
Renumber the selected spec groups into deterministic sequences, update current references under the affected roots, and refresh indexing so memory/search surfaces the moved packets correctly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renumber direct child spec folders under `.opencode/specs/design` starting at `001`.
- Compact active `.opencode/specs/skilled-agent-orchestration` numbering so it continues after archive item `116`.
- Compact archive folders under `.opencode/specs/skilled-agent-orchestration/z_archive` to `001+`.
- Verify active `.opencode/specs/deep-loops` numbering and compact only if the live filesystem needs it.
- Compact archive folders under `.opencode/specs/deep-loops/z_archive` to `001+`.
- Add missing root `description.json` and `graph-metadata.json` files for the `design` and `deep-loops` track roots.
- Update current path references inside the affected roots and this phase packet.
- Reindex affected spec roots through Spec Kit Memory.

### Out of Scope
- Creating rollback backup artifacts, by user instruction.
- Rewriting historical provenance outside the named spec roots.
- Changing non-spec application code.
- Committing or pushing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/design/*` | Rename/Modify | Reset direct child numbering to `001` through `008` and update local references. |
| `.opencode/specs/skilled-agent-orchestration/*` | Rename/Modify | Compact active and archive numbering and update local references. |
| `.opencode/specs/deep-loops/*` | Rename/Modify | Verify active numbering, compact archive numbering, and update local references. |
| `specs/design/description.json` | Create | Add missing root track metadata. |
| `specs/design/graph-metadata.json` | Create | Add missing root track graph metadata. |
| `specs/deep-loops/description.json` | Create | Add missing root track metadata. |
| `specs/deep-loops/graph-metadata.json` | Create | Add missing root track graph metadata. |
| This phase folder | Create/Modify | Track scope, tasks, checklist, and implementation evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Build rename maps from live filesystem inventory. | The migration uses current directory entries, not stale delegated findings. |
| REQ-002 | Avoid destructive delete operations. | Folder changes are renames only; no spec packet deletion is performed. |
| REQ-003 | Update current path references for all renamed folders. | Exact old-path searches in affected roots no longer find current metadata or navigation references, except preserved historical text when intentionally retained. |
| REQ-004 | Reindex affected spec roots. | `memory_index_scan` completes for the affected roots or reports a bounded failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Validate this phase folder. | `validate.sh <phase> --strict` exits successfully or any warnings/errors are reported with evidence. |
| REQ-006 | Preserve archive provenance where rewriting would falsify historical logs. | Historical iteration/review logs are not broadly rewritten unless they contain current navigational metadata. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The selected roots have deterministic direct-child numbering after migration.
- **SC-002**: `description.json`, `graph-metadata.json`, and current markdown references under affected roots point to existing paths.
- **SC-003**: Spec memory indexing has been refreshed for the affected roots.
- **SC-004**: This phase folder validates under the strict spec validator.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate numeric prefixes in source folders | Direct renames can collide | Rename through temporary names before final names. |
| Risk | Historical generated logs contain old paths | Blind rewrite can falsify provenance | Limit replacements to affected roots and current reference surfaces; preserve historical logs unless needed for navigation. |
| Dependency | Spec memory daemon | Reindex currently returns `E040` and health times out | Report blocker and retry after daemon repair. |
| Constraint | No rollback artifacts | Lower recovery margin | Use bounded rename maps and avoid deletes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep migration bounded to the named spec roots.
- **NFR-P02**: Avoid repository-wide rewrites outside the requested scope.

### Security
- **NFR-S01**: Do not expose secrets or edit environment files.
- **NFR-S02**: Do not run destructive cleanup commands.

### Reliability
- **NFR-R01**: Use deterministic sort order for maps: numeric prefix ascending, then slug.
- **NFR-R02**: Verify resulting directory names exist before claiming completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty target root: skip with evidence instead of fabricating entries.
- Duplicate prefixes: include slug in sort and use temporary names before final names.
- Already contiguous active roots: leave unchanged and document the no-op.

### Error Scenarios
- Reindex timeout: report failure and provide the affected root list.
- Rename collision: halt before final rename and report the conflicting path.
- Concurrent filesystem changes: rerun inventory before migration and use live entries.

### State Transitions
- Partial completion: keep status In Progress and list unresolved roots.
- Completion: update implementation-summary and checklist with concrete command/tool evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple spec roots and many archive packets. |
| Risk | 16/25 | Path migration affects continuity/search but not application runtime. |
| Research | 13/20 | Requires inventory and reference classification. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None currently.
<!-- /ANCHOR:questions -->
