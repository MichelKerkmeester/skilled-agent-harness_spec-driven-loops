---
title: "Tasks: CP-Sandbox speckit Path Fix (007)"
description: "Task list for the stale spec_kit to speckit CP setup-script remediation."
trigger_phrases:
  - "cp sandbox speckit path fix tasks"
  - "030 phase 007 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/007-cp-sandbox-speckit-path-fix"
    last_updated_at: "2026-05-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Script fixes done and sandbox build verified"
    next_safe_action: "Run CP scenarios then flip ledgers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Tasks: CP-Sandbox speckit Path Fix (007)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 deep-review `07/setup-cp-sandbox.sh` line 61 require_path spec_kit to speckit
- [x] T002 deep-review `07/setup-cp-sandbox.sh` line 73 copy_dir spec_kit to speckit
- [x] T003 deep-research `07/setup-cp-sandbox.sh` line 74 copy_dir spec_kit to speckit

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `rg "commands/spec_kit"` returns nothing in both scripts
- [x] T005 deep-review setup-cp-sandbox.sh re-run exits 0; sandbox + speckit present

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Run CP-052..057 (deep-review) in sandbox; flip 003 ledger rows
- [ ] T007 Run CP-046..051 (deep-research) in sandbox (phase 004); flip 004 ledger rows

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Setup scripts free of `commands/spec_kit`
- [x] deep-review sandbox builds cleanly
- [ ] CP scenario verdicts recorded + ledgers flipped
- [ ] Matrix remediation lineage recorded

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md` (030 phase parent)

<!-- /ANCHOR:cross-refs -->
