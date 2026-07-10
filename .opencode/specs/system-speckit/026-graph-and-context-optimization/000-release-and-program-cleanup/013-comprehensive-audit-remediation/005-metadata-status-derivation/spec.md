---
title: "Feature Specification: Phase 5: metadata-status-derivation"
description: "deriveStatus() reads spec status from YAML frontmatter only, so Draft/Placeholder specs that declare status in the markdown metadata table are mis-derived as complete from implementation-summary presence. Stale 026/027 metadata data files compound the drift."
trigger_phrases:
  - "metadata status derivation"
  - "derived status complete"
  - "graph metadata parser table status"
  - "027 placeholder child"
  - "026 last active child pointer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added table-status fallback to deriveStatus and reconciled 026/027 metadata"
    next_safe_action: "Defer dist rebuild and backfill regen to central"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-metadata-status-derivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: metadata-status-derivation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `scaffold/005-metadata-status-derivation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-mcp-contract-parity |
| **Successor** | 006-catalog-playbook-accuracy |
| **Handoff Criteria** | Parser table-status fallback lands with a passing fixture test; targeted 026/027 metadata reconciled; dist rebuild + global backfill deferred to central |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the comprehensive audit remediation specification.

**Scope Boundary**: The root parser fix in `graph-metadata-parser.ts` plus targeted 026/027 metadata data files cited in the verified backlog E-cluster. No global backfill, no dist rebuild, no files outside the cited set.

**Dependencies**:
- None blocking. The E7 parser change is the root for E3/E6 durability, so it lands first within this phase.

**Deliverables**:
- E7 parser table-status fallback plus a fixture test.
- E1-E6, E8, E9 targeted metadata and prose reconciliation across 026 and 027.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deriveStatus()` in `graph-metadata-parser.ts` populates spec status only from YAML frontmatter, but many 026/027 specs declare status only in the markdown metadata table row `| **Status** | Draft |`. With no YAML status and an implementation-summary present, the heuristic returns `complete`, mislabeling Draft and Placeholder specs. Several 026/027 metadata data files also carry stale pointers, counts, child lists, titles, and completion contradictions.

### Purpose
Make derived status honor the spec.md metadata-table status with higher precedence than the implementation-summary heuristic, and bring the cited 026/027 metadata data files into agreement with disk and spec reality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- E7 root fix: `extractMetadataTableStatus()` helper plus spec.md table-status fallback in `collectPacketDocs`.
- E1-E6 targeted metadata reconciliation in 026 program docs and 027 parent/child metadata.
- E8/E9 resource-map and spec-prose honesty fixes plus a 026-surface pin in 027.

### Out of Scope
- Global `backfill-graph-metadata.ts` run - needs the rebuilt parser dist, deferred to central.
- mcp_server dist rebuild - deferred to central to avoid clobbering peer edits.
- Tracks 003/004 changelog rollup drift beyond track-000 - flag-only to avoid scope creep.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Add table-status fallback (E7) |
| `mcp_server/tests/graph-metadata-schema.vitest.ts` | Modify | Draft/Placeholder fixture tests (E7) |
| 026 program graph-metadata.json + spec.md | Modify | Last-active pointer + prose (E1) |
| 026 track-000 changelog root + changelog README.md | Modify | Leaf-count reconciliation (E2) |
| 026 packets 009 + 016 spec/graph/checklist/impl-summary | Modify | Completion reconciliation (E3) |
| 027 parent description.json + graph-metadata.json | Modify | De-list placeholder child (E4) |
| 027 child description.json (002/007/008) | Modify | Title + trigger renumbering (E5) |
| 027 003 + 006 graph-metadata.json | Modify | derived.status Draft (E6) |
| 026 + 027 resource-map.md | Modify | Missing-on-disk honesty (E8) |
| 027 + 026 spec.md | Modify | Lean-parent note + 026-surface pin (E9) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | E7: spec.md metadata-table status overrides the implementation-summary heuristic | A Draft table-status spec with an implementation-summary and no checklist derives `draft`, not `complete`; existing YAML-status tests stay green; lean-phase-parent existingStatus preservation intact |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | E1: 026 last-active child pointer + prose reflect timeline rank-1 | `last_active_child_id` resolves to existing `006-operator-tooling`; spec prose names it; graph-metadata.json parses |
| REQ-003 | E2: 026 track-000 leaf-changelog counts match disk (129) | Rollup Summary and README track-000 leaf column read 129, not 1/128 |
| REQ-004 | E3: 026 packets 009 + 016 resolve to one truth | spec Status, graph derived.status, checklist, impl-summary, continuity agree; validate --strict Errors 0 per packet |
| REQ-005 | E4: 027 placeholder child de-listed from machine metadata | `000-release-cleanup` removed from children[]/children_ids[]; every remaining child id resolves to a dir with spec.md or description.json |
| REQ-006 | E5: 027 renumbered child title + triggers match folder numbers | No stale `phase 008/009/012/028` ids in current-child description.json; JSON parses |
| REQ-007 | E6: 027 003 + 006 derived.status match Draft table | derived.status reads `draft`, not `complete`, in both graph-metadata.json |
| REQ-008 | E8 + E9: resource-map missing-on-disk honesty; 027 lean-parent note softened; 026-surface pinned | 026 resource-map Missing-on-disk reflects 19 absent rows; `ONLY authored` removed from 027 spec; 027 names the 026 surface it builds on |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Draft/Placeholder spec with no YAML status no longer derives `complete`.
- **SC-002**: validate.sh --strict passes (Errors 0) on every 026/027 packet edited in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Rebuilt parser dist + global backfill | E3/E6 graph-metadata hand-edits could be overwritten on a future re-derive | E7 makes table-status authoritative so the corrected values survive re-derive; backfill regen deferred to central |
| Risk | Too-greedy table-status regex | Could capture the wrong row or mis-handle phase parents that have no status table | Anchor on a single `Status` cell, normalize known values only, preserve lean-phase-parent existingStatus branch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The dist rebuild and global backfill are intentionally deferred to central.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
