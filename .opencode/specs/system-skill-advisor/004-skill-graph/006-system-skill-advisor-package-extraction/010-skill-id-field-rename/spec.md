---
title: "Feature Specification: Align system-skill-advisor skill id"
description: "Level 2 packet for renaming the advisor graph skill id from skill_advisor to system-skill-advisor and closing the remaining graph-health failure."
trigger_phrases:
  - "013/009/010"
  - "skill id rename"
  - "system-skill-advisor graph health"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename"
    last_updated_at: "2026-05-14T18:20:00Z"
    last_updated_by: "codex"
    recent_action: "Skill id rename implemented; advisor Vitest green"
    next_safe_action: "Commit scoped changes and update parent handover"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Align system-skill-advisor skill id

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Spec Folder** | `010-skill-id-field-rename` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The extracted advisor skill lives at `.opencode/skills/system-skill-advisor/`, but its graph metadata and compiled graph still used `skill_advisor` as the skill id. The graph compiler enforces `skill_id == folder name`, so the remaining advisor graph-health test failed until the id, adjacency references, cache, and runtime health allowlist were re-keyed together.

### Purpose

Make `system-skill-advisor` the canonical graph skill id while preserving the Python module filename `skill_advisor.py` and all public MCP tool ids.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the graph skill id from `skill_advisor` to `system-skill-advisor`.
- Update compiler injection, Python health parity, generated graph JSON, tracked SQLite graph cache, and graph-health expectations.
- Retarget adjacent graph metadata references in `sk-code` and `mcp-coco-index`.
- Repair live graph topology metadata required for strict graph validation.
- Baseline the two remaining parity tests with the single accepted drift row.

### Out of Scope

- Renaming `skill_advisor.py`; it remains the Python module filename.
- Renaming public MCP tool ids such as `advisor_*` or `skill_graph_*`.
- Broad scorer refactors or changes above the accepted parity-baseline adjustment.
- Touching unrelated dirty parallel-session files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Modify | Canonical skill id becomes `system-skill-advisor`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modify | Compiler injection uses the extracted skill folder/id. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Runtime tolerated graph-only id follows the new skill id. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerate | JSON cache reflects the renamed graph. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite*` | Regenerate | SQLite cache no longer contains the old `skill_advisor` node. |
| `.opencode/skills/{sk-code,mcp-coco-index}/graph-metadata.json` | Modify | Adjacent prerequisite edges target the new skill id. |
| `.opencode/skills/{system-code-graph,system-spec-kit}/graph-metadata.json` | Modify | Reciprocal topology edges satisfy graph validator symmetry. |
| Advisor parity and graph-health tests | Modify | Pin current graph-health and accepted parity-drift baselines. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `system-skill-advisor` graph metadata uses a skill id matching its folder. | `skill_graph_compiler.py --validate-only` exits 0. |
| REQ-002 | Runtime health has no stale `skill_advisor` node or edge references. | `skill_advisor.py --health` reports `status: ok` and inventory parity `in_sync: true`. |
| REQ-003 | Graph-health Vitest passes. | `advisor-graph-health.vitest.ts` passes both tests. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Adjacent graph references use `system-skill-advisor`. | `rg '"skill_advisor"' .opencode/skills/*/graph-metadata.json` has no skill-id target hits. |
| REQ-005 | Parity drift remains explicit and bounded. | Both parity tests pass with accepted regression id `rr-iter3-146`. |
| REQ-006 | Full advisor Vitest and strict spec validation pass. | Final verification records suite and validation results. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Advisor package Vitest reaches `291 passed`.
- **SC-002**: Graph-health validator reports zero remaining errors.
- **SC-003**: No public MCP tool ids or Python filenames are renamed.
- **SC-004**: Scope stays inside the dispatch whitelist plus graph metadata needed to satisfy live validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Confusing skill id with Python module name | Could break direct Python imports. | Only graph ids changed; `skill_advisor.py` and `spec_from_file_location('skill_advisor', ...)` remain unchanged. |
| Risk | Stale generated caches | Health may keep reading old ids. | Regenerate JSON and rebuild tracked SQLite graph cache. |
| Dependency | Existing dirty worktree | Unrelated files could be accidentally committed. | Stage only dispatch-owned paths. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The rename is visible as a graph-id alignment, not a tool-id migration.
- **NFR-M02**: The parity allowance is row-specific and numeric, not a broad skip.

### Reliability

- **NFR-R01**: Compiler, JSON cache, SQLite cache, and health check agree on the same skill ids.
- **NFR-R02**: Full advisor tests and strict validation are run before completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Identity Boundaries

- `skill_advisor.py` remains valid as a module name.
- `system_skill_advisor` remains valid as the MCP server id.
- `system-skill-advisor` is the only graph skill id.

### Cache Boundaries

- JSON cache regeneration alone is insufficient when SQLite exists.
- SQLite must not retain stale `skill_advisor` nodes or incoming edges.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Several graph metadata surfaces plus generated caches and tests. |
| Risk | 16/25 | Runtime health and scorer projection read generated graph state. |
| Research | 10/20 | Required handover, sibling packets, compiler, health, and parity reads. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option C with permission to create `010-skill-id-field-rename`.
<!-- /ANCHOR:questions -->
