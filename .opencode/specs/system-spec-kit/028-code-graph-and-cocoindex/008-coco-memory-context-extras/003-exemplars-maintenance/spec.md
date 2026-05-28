---
title: "Feature Specification: 003 Exemplars Maintenance"
description: "Level 2 child packet for Coco exemplar TTL, cap, reconciliation, and clear operation."
trigger_phrases:
  - "027 011 003 exemplars maintenance"
  - "coco exemplar maintenance"
  - "exemplar_maintenance.py"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/003-exemplars-maintenance"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Plan implementation for exemplar_maintenance.py"
    blockers: ["001-exemplars-schema", "002-exemplars-retriever"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 003 Exemplars Maintenance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras` |
| **Track** | A: Coco Exemplars |
| **Depends On** | `001-exemplars-schema`, `002-exemplars-retriever`, `system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Exemplar rows can become stale as source files move, line ranges change, or content hashes drift. Without maintenance, a helpful example bank slowly turns into misleading presentation context.

### Purpose
Create `cocoindex_code/exemplars/exemplar_maintenance.py` for TTL cleanup, cap enforcement, stale reconciliation, and the `ccc_examples_clear` maintenance path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- TTL cleanup for expired exemplar rows.
- Cap enforcement around 1000-2000 rows per project.
- Stale reconciliation for missing files, invalid ranges, and content hash mismatches.
- Clear-history maintenance operation for opt-out and reset workflows.

### Out of Scope
- Initial schema creation.
- Query-time retrieval semantics.
- Active rollout beyond default-off/shadow-first governance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_maintenance.py` | Create | TTL, cap, reconciliation, clear helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modify | Register clear operation if required by fork API |
| `.opencode/skills/mcp-coco-index/tests/test_exemplar_maintenance.py` | Create | Maintenance and stale-row tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Expired exemplar rows are removed or suppressed | TTL test covers expired and unexpired rows |
| REQ-002 | Stale rows are reconciled by file, range, and hash | Tests cover all three stale conditions |
| REQ-003 | Clear operation deletes exemplar rows only | Test proves code chunk rows are untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Storage cap is enforced deterministically | Cap test evicts oldest eligible rows |
| REQ-005 | Maintenance is safe to run repeatedly | Repeat maintenance test is idempotent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Maintenance can clear all exemplar rows without touching code chunks.
- **SC-002**: Reconciliation suppresses or removes stale file, range, and hash rows.
- **SC-003**: Cap and TTL behavior are covered by tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Schema and retriever children | Maintenance must match table and identity contracts | Keep sequential Track A dependency |
| Risk | Clear operation deletes wrong table | Data loss | Table-name constants and destructive-operation tests |
| Risk | Hash reconciliation is too expensive | Query latency regression | Run purge in maintenance path, suppress cheaply at retrieval time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Maintenance cleanup runs in bounded batches.
- **NFR-P02**: Retrieval-time stale suppression stays cheap.

### Security
- **NFR-S01**: Clear operation only targets exemplar storage.
- **NFR-S02**: Maintenance does not expose feedback comments.

### Reliability
- **NFR-R01**: Maintenance is idempotent.
- **NFR-R02**: Partial failures leave rows either unchanged or safely removed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty table: maintenance exits cleanly.
- Table at cap: oldest eligible rows are evicted.
- All rows expired: cleanup removes all exemplar rows.

### Error Scenarios
- File deleted: stale row is suppressed or purged.
- Line range invalid: stale row is suppressed or purged.
- Content hash mismatch: stale row is suppressed or purged.

### State Transitions
- User clear request: bank returns to cold-start behavior.
- Repeated maintenance: second run has no extra effect.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One maintenance module plus tests |
| Risk | 15/25 | Destructive clear and stale reconciliation |
| Research | 6/20 | Needs current schema and query identity |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for scaffolding. Implementation should confirm whether `ccc_examples_clear` is CLI-only, MCP-only, or both in the fork surface.
<!-- /ANCHOR:questions -->
