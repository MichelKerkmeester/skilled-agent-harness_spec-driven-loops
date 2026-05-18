---
title: "Tasks: Scope-Change Guard"
description: "Task breakdown for Phase 026/007/012/005 F-002 scope-change promotion guard."
trigger_phrases:
  - "026/007/012/005 tasks"
  - "scope-change guard tasks"
  - "F-002 task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/005-scope-change-scan-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Completed F-002 task list"
    next_safe_action: "Review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "026-007-012-005-scope-change-scan-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Scope-Change Guard

<!-- SPECKIT_LEVEL: 2 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the council R1 plan (`004-zero-node-and-parser-remediation/scratch/f002-council-r1-cli-copilot.md`).
- [x] T002 Read existing scan guard and scope metadata helper surfaces.
- [x] T003 [P] Read schema validation and tool schema surfaces.
- [x] T004 [P] Scaffold and author Level 2 Phase 005 planning artifacts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add failing nonzero scope-mismatch guard regression test.
- [x] T006 Add `forceScopeChange` bypass regression test.
- [x] T007 Add same-scope dramatic shrink regression test.
- [x] T008 Add `forceScopeChange` to public and internal schemas.
- [x] T009 Add `scopeChangePromotionBlocked` predicate before the zero-node predicate.
- [x] T010 Add blocked response preserving prior graph state and failed-scan metadata.
- [x] T011 Rebuild dist output with `npm run build`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run targeted `code-graph-scan.vitest.ts`.
- [x] T013 Run all `code_graph/tests/`.
- [x] T014 Run `tests/tool-input-schema.vitest.ts`.
- [x] T015 Run OpenCode alignment verification for changed source scope.
- [x] T016 Run strict validation for child packet.
- [x] T017 Run strict validation for parent packet.
- [x] T018 Update checklist and implementation summary with evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Build, vitest, alignment, and strict validation evidence recorded.
- [x] Parent metadata includes `005-scope-change-scan-guard`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision Record**: See `decision-record.md`.
- **Source Council Plan**: See `../004-zero-node-and-parser-remediation/scratch/f002-council-r1-cli-copilot.md`.
<!-- /ANCHOR:cross-refs -->
