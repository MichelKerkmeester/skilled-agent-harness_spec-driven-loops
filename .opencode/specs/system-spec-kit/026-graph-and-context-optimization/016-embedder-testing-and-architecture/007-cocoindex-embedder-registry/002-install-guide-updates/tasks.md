---
title: "Tasks: 019/002 INSTALL_GUIDE updates"
description: "Task checklist for the new-user embedder onboarding docs"
trigger_phrases: ["019/002 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-cocoindex-embedder-registry/002-install-guide-updates"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001 once 019/001 ships"
    blockers:
      - "depends on 019/001"
    key_files:
      - "INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019002"
      session_id: "019-002-install-guide-updates-tasks"
      parent_session_id: "019-002-install-guide-updates"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 019/002 INSTALL_GUIDE updates

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Read existing INSTALL_GUIDE.md + README.md structure
- [ ] T002 Identify insertion points for new sections
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Draft "Choosing an embedder" section for INSTALL_GUIDE
- [ ] T004 Hand-author alternatives table from 019/001 registry
- [ ] T005 Document swap runbook (env var + daemon restart + first-use download)
- [ ] T006 Add MPS auto-detect note + `COCOINDEX_CODE_DEVICE=cpu` kill switch
- [ ] T007 Draft "Embedder choice" pointer paragraph for README
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Link-check: 019/001 registry + 018/001 swap-runbook + 018/003 ADR-001 references resolve
- [ ] T009 Read-through: new user can pick + activate non-default embedder in <10 min
- [ ] T010 Strict-validate this packet
- [ ] T011 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 11 tasks marked `[x]`. Links resolve. Read-through succeeds. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Source: `../001-declarative-registry/`
- Operational ref: `../../018-code-embedder-coderank/001-cocoindex-swap/evidence/swap-runbook.md`
- ADR (when available): `../../018-code-embedder-coderank/004-mxbai-swap-and-008-closure/decision-record.md`
<!-- /ANCHOR:cross-refs -->
