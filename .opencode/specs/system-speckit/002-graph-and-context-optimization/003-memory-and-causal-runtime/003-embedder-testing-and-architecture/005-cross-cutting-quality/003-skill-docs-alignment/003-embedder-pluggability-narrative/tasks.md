---
title: "Tasks: 021/003 narrative"
description: "Tasks"
trigger_phrases: ["021/003 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: ["evidence/embedder-pluggability.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021003"
      session_id: "021-003-embedder-pluggability-narrative-tasks"
      parent_session_id: "021-003-embedder-pluggability-narrative"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 021/003 narrative

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Author Opus markdown-agent dispatch prompt with source allowlist + LOC cap
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Dispatch markdown agent (background, parallel with 021/001 + 021/002)
- [ ] T003 Spot-check citations resolve
- [ ] T004 Verify out-of-box matrix matches registered_embedders.py
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Read-through as "new contributor"; swap demo in <10 min
- [ ] T006 Cross-link wiring (INSTALL_GUIDE §4 + root README)
- [ ] T007 Strict-validate this packet
- [ ] T008 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

8 tasks `[x]`. Document ≤ 600 LOC, cited, cross-linked. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Sibling: `../002-root-readme-update/` (cross-link consumer)
- Output: `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`
<!-- /ANCHOR:cross-refs -->
