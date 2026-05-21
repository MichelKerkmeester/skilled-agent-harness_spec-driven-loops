---
title: "Tasks: CocoIndex install hygiene pipx repair [template:level_1/tasks.md]"
description: "Open tasks for CocoIndex pipx repair after diagnosis."
trigger_phrases:
  - "cocoindex pipx repair"
  - "pipx editable cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/006-cocoindex-install-hygiene-pipx-repair"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored open task list"
    next_safe_action: "Repair pipx editable install after operator-side config is available"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CocoIndex install hygiene pipx repair

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
| T001 | P0 | Re-read predecessor implementation summary repair blockers. | `[ ]` | Planned |
| T002 | P0 | Confirm operator-side pipx write access is available. | `[ ]` | Planned |
| T003 | P0 | Snapshot current `which ccc`, version, and direct_url state. | `[ ]` | Planned |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Run editable pipx repair. | `[ ]` | Planned |
| T005 | P0 | Verify repaired direct_url and module imports. | `[ ]` | Planned |
| T006 | P0 | Apply harness/install-guide changes only after repair evidence. | `[ ]` | Planned |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T007 | P0 | Run `ccc --version` and import checks. | `[ ]` | Planned |
| T008 | P0 | Run relevant CocoIndex harness smoke. | `[ ]` | Planned |
| T009 | P0 | Run strict-validate on the packet. | `[ ]` | Planned |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor `../005-cocoindex-install-hygiene/implementation-summary.md`
- `/Users/michelkerkmeester/.local/bin/ccc` stale executable path from diagnosis
- `.opencode/skills/mcp-coco-index/mcp_server` editable source path
<!-- /ANCHOR:cross-refs -->
