---
title: "Tasks: shared embedder logic with spec-memory [template:level_1/tasks.md]"
description: "Open tasks for shared embedder factory alignment."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored open task list"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Priority**: P0 blocks packet completion; P1 can be deferred only with operator approval
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read current spec-memory embedder registry/factory files. | `[ ]` | Planned |
| T002 | P0 | Read current skill-advisor embedder registry and skill-graph DB embedding path. | `[ ]` | Planned |
| T003 | P0 | Confirm exact package import path for shared module. | `[ ]` | Planned |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Extract/promote shared factory module. | `[ ]` | Planned |
| T005 | P0 | Update skill-advisor registry/default selection. | `[ ]` | Planned |
| T006 | P0 | Add parity regression test. | `[ ]` | Planned |
| T007 | P0 | Update docs or env references if implementation changes operator behavior. | `[ ]` | Planned |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T008 | P0 | Run targeted spec-memory embedder tests. | `[ ]` | Planned |
| T009 | P0 | Run targeted skill-advisor embedder/scorer tests. | `[ ]` | Planned |
| T010 | P0 | Run strict-validate on the packet. | `[ ]` | Planned |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts`
<!-- /ANCHOR:cross-refs -->
