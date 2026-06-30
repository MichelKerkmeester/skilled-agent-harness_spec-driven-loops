---
title: "Feature Specification: Phase 001 Discovery Impact Map"
description: "Produce the canonical inventory of active repo references to sk-deep-review and sk-deep-research before any rename work begins. The inventory defines phase ownership, edge cases, and validation evidence for packet 070."
trigger_phrases:
  - "070 phase 001"
  - "sk-deep rename discovery"
  - "sk-deep impact inventory"
  - "discovery impact map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 001 discovery inventory"
    next_safe_action: "Use inventory.tsv to execute Phase 002 skill-folder-root and skill-graph rename work"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "inventory.md"
      - "inventory.tsv"
      - "edge-cases.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 001 Discovery Impact Map

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 001 of 006 |
| **Handoff Criteria** | `inventory.md`, `inventory.tsv`, and `edge-cases.md` identify every active in-repo reference to `sk-deep-review` or `sk-deep-research`; child and parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 070 will rename `sk-deep-review` to `deep-review` and `sk-deep-research` to `deep-research`. The parent packet estimates hundreds of active references across skill folders, runtime mirrors, MCP server code, scripts, fixtures, specs, root docs, and config files, so the downstream phases need a measured inventory rather than an estimate.

### Purpose
Phase 001 produces the canonical exhaustive impact map for the rename without changing any rename target. It converts broad grep results into phase-owned rows and calls out edge cases that later phases must handle deliberately.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 001 Level 2 planning artifacts in this folder.
- Search active repo surfaces for exact text references to `sk-deep-review` and `sk-deep-research`.
- Search filename and folder embeds containing `sk-deep-*`.
- Audit non-trivial reference forms: path links, TypeScript/JavaScript string literals, SQLite database mentions, test snapshots, and graph metadata.
- Produce `inventory.md`, `inventory.tsv`, and `edge-cases.md`.
- Validate this child spec folder and the packet parent with strict validation.

### Out of Scope
- Renaming skill folders or source references outside this phase folder.
- Updating target files listed by the inventory.
- Rewriting historical commit messages or frozen `z_archive/` context.
- Editing binary SQLite databases or code graph databases.
- Changing changelog entries that are historical records of old names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/spec.md` | Create | Phase 001 requirements and scope |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/plan.md` | Create | Discovery method and grep plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/tasks.md` | Create | Concrete discovery task list |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/checklist.md` | Create | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/graph-metadata.json` | Create/Update | Canonical graph metadata for the phase |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/inventory.md` | Create | Human-readable impact inventory |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/inventory.tsv` | Create | Machine-readable inventory rows |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/001-discovery-impact-map/edge-cases.md` | Create | Annotated non-trivial reference patterns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory covers all requested text file extensions | Search includes `*.md`, `*.json`, `*.toml`, `*.ts`, `*.js`, `*.py`, `*.sh`, `*.yaml`, `*.yml`, `*.txt`, and `*.tmpl` across the requested roots |
| REQ-002 | Inventory excludes frozen and generated/binary surfaces correctly | `z_archive/`, `.git/`, `node_modules/`, non-included `dist/`, `.cocoindex_code/*.db`, and SQLite database binaries are excluded, while checked-in `.opencode/skills/system-spec-kit/scripts/dist/*.js` is included |
| REQ-003 | Edge cases are enumerated | `edge-cases.md` includes filename embeds, MCP TS/JS constants, SQLite indexed entries or binary database notes, snapshot fixtures, and code graph database notes |
| REQ-004 | Machine-readable inventory is complete | `inventory.tsv` contains one row per active file with old-name references and the required columns: `file_path`, `match_count`, `area`, `phase` |
| REQ-005 | Human-readable inventory gives downstream phase ownership | `inventory.md` includes total counts, category breakdown, top files per area, edge cases, and recommended 002-005 phase ordering |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Discovery commands are reproducible | `plan.md` records the grep/find commands and exclusions used |
| REQ-007 | Per-area labels match the requested taxonomy | `inventory.tsv` uses only the requested `area` values |
| REQ-008 | Parent resource-map estimates are ratified or amended | `inventory.md` explicitly validates or amends the 002-005 partitioning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase folder contains the four Level 2 planning artifacts plus `graph-metadata.json`.
- **SC-002**: `inventory.tsv` has exactly one row for every active file containing `sk-deep-review` or `sk-deep-research`.
- **SC-003**: `inventory.md` reports separate counts for `sk-deep-review`, `sk-deep-research`, their overlap, and unique union.
- **SC-004**: `edge-cases.md` lists every requested edge-case class with expected handling.
- **SC-005**: Strict validation exits 0 for both this child folder and the parent folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Grep scope misses root files because shell globs only match existing root-level files | Medium | Use explicit roots plus root file globs, then separately audit active `specs/` and `.opencode/specs/` references |
| Risk | Historical references inflate active inventory | Medium | Exclude `z_archive/` and historical changelog entries from active phase ownership; document historical counts only if observed |
| Risk | Binary databases produce noisy or unsafe grep output | Low | Exclude database binaries from text inventory and record database re-index handling as an edge case |
| Risk | Filename embeds are not counted by text grep | High | Run `find` filename and folder audits and list them separately in `edge-cases.md` |
| Dependency | Parent phase partitioning | Medium | Use parent `resource-map.md` as initial taxonomy, then amend from measured inventory if needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Traceability**: Every counted file appears in `inventory.tsv` with area and phase ownership.
- **Reproducibility**: Discovery commands in `plan.md` are specific enough for the next phase to rerun.
- **Scope Safety**: No files outside `001-discovery-impact-map/` are modified.
- **Reviewability**: Inventory documents prioritize counts, top files, and edge cases over prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Filename embeds: files and directories matching `*sk-deep-*`.
- URL/path links: markdown and config paths pointing into old skill folders.
- TypeScript/JavaScript constants: quoted string literals used as skill IDs or graph keys.
- SQLite indexed entries: database files are binary and excluded from direct edits; references to their paths still need inventory handling.
- Snapshot fixtures: Vitest/Jest snapshots or snapshot directories may embed expected old names.
- Code graph nodes: `.cocoindex_code/` databases may contain stale indexed names and need a Phase 006 refresh rather than direct edits.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | High | Parent estimates hundreds to low thousands of referencing files |
| Behavioral Risk | Low | Phase 001 is inventory-only |
| Coordination Risk | Medium | Downstream phases rely on area and phase partitioning accuracy |
| Verification Risk | Medium | Strict validation and inventory completeness both need evidence |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None for Phase 001. If discovery exposes references outside the parent partition, record the amendment in `inventory.md` rather than changing rename targets in this phase.
<!-- /ANCHOR:questions -->
