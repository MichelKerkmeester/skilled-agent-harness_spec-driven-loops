---
title: "Tasks: Phase 071 verifier remediation"
description: "Task checklist for the Phase 071 independent verifier remediation."
trigger_phrases:
  - "phase 071 remediation tasks"
  - "verifier findings tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation"
    last_updated_at: "2026-05-05T19:53:46Z"
    last_updated_by: "cli-codex"
    recent_action: "Created remediation task list"
    next_safe_action: "Execute V-001 through V-007 fixes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-001-remediation"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 071 Verifier Remediation

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

- [x] T001 Read independent verification report (`verification/verification-report.md`)
- [x] T002 Create Level 2 child packet (`001-remediation/`)
- [x] T003 [P] Inspect target file status and scan artifact history
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix V-005 hardcoded cli-opencode paths (`README.md`, `references/opencode_tools.md`)
- [x] T005 Fix V-004 real-client log text (`mcp-code-mode/references/workflows.md`)
- [x] T006 Fix V-006 MyService tool-name mismatch (`002-myservice-list-sites.md`)
- [x] T007 Fix V-003 tracked scan artifacts (`.folder-list.txt`, `.scan-lines.txt`)
- [x] T008 Fix V-001 CocoIndex canonical resource default (`settings.py`)
- [x] T009 Fix V-002 advisor source lanes and Python scorer (`explicit.ts`, `lexical.ts`, `skill_advisor.py`)
- [x] T010 Fix V-002 advisor dist mirrors (`dist/skill_advisor/lib/scorer/lanes/*.js`)
- [x] T011 Fix V-007 mcp-chrome-devtools dead links (`examples/README.md`)
- [x] T012 Document V-008 and V-009 (`decision-record.md`)
- [x] T013 Update parent child registration (`071-stack-agnostic-cleanup/graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run broadened non-sk-code grep gate
- [x] T015 Run surface-tag grep gate
- [x] T016 Run hardcoded `/Users/` path grep gate
- [x] T017 Run 8-prompt routing regression suite
- [x] T018 Run skill graph compiler validation
- [x] T019 Run child and parent strict spec validation
- [x] T020 Run sk-code untouched diff check
- [x] T021 Author implementation summary with before/after grep counts
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All actionable P0/P1 verifier findings fixed or explicitly reported as blocked.
- [x] P2 documentation decisions recorded.
- [x] Verification gates run and results copied into `implementation-summary.md`.
- [x] No sk-code files modified by this remediation; exact gate is polluted by pre-existing worktree state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Verification Report**: See `../verification/verification-report.md`
<!-- /ANCHOR:cross-refs -->
