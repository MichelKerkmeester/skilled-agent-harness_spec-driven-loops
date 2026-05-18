---
title: "Tasks: 020 deep-review dispatch"
description: "Task checklist for the 20-iter cli-devin SWE 1.6 review"
trigger_phrases: ["020 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack"
    last_updated_at: "2026-05-17T20:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001 pre-flight"
    blockers: []
    key_files:
      - "evidence/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000020000"
      session_id: "020-deep-review-016-019-stack-tasks"
      parent_session_id: "020-deep-review-016-019-stack"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 020 deep-review dispatch

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

- [ ] T001 Verify git status clean for in-scope paths
- [ ] T002 Verify cli-devin --version + SWE 1.6 listed
- [ ] T003 Confirm 016-019 commits on origin/main
- [ ] T004 Author `/tmp/020-deep-review-prompt.md` with scope manifest
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Dispatch /spec_kit:deep-review via cli-devin SWE 1.6 (background)
- [ ] T006 Monitor task notification on completion
- [ ] T007 Apply 3-check bundle gate per iteration output
- [ ] T008 Convergence detection (3-consecutive-no-new-findings short-circuit)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Validate `evidence/review-report.md` cites findings with file:line
- [ ] T010 Scaffold remediation packet(s) for any P0/P1 findings
- [ ] T011 Memory note ratifying review verdict
- [ ] T012 Strict-validate this packet
- [ ] T013 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 13 tasks marked `[x]`. review-report.md committed. Remediation packets queued (if any). Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Scope packets: `../016-embedder-testing-and-architecture/`, `../018-code-embedder-coderank/`, `../019-cocoindex-embedder-registry/`
- Memory notes: feedback_cli_devin_bundle_verification, feedback_bundle_gate_smoke_run, feedback_cli_dispatch_unreliability
- Skill: `/spec_kit:deep-review`
<!-- /ANCHOR:cross-refs -->
