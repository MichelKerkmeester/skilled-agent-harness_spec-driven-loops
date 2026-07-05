---
title: "Tasks: Speckit Unattended/Autopilot Lifecycle"
description: "Completed task ledger for the speckit :autopilot branch-preserved unattended lifecycle work."
trigger_phrases:
  - "speckit autopilot lifecycle"
  - "speckit unattended"
  - "branch preserved failure"
  - "terminal reason codes speckit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/complete.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/speckit/implement.md"
      - ".opencode/commands/speckit/assets/speckit_complete_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Speckit Unattended/Autopilot Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the completed spec and confirm the unattended lifecycle scope (`spec.md`).
- [x] T002 Identify speckit command docs and auto YAML asset as affected surfaces (`complete.md`, `plan.md`, `implement.md`, `speckit_complete_auto.yaml`).
- [x] T003 [P] Preserve deep-loop-runtime and unrelated subsystem changes as out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `:autopilot` / `--unattended` contract and branch-preserved failure path (`complete.md`).
- [x] T005 Add unattended-ready task metadata fields for executor routing (`plan.md`).
- [x] T006 Emit `no_eligible_tasks`, `retry_exhausted`, `verification_failed`, and `uncertainty_blocked` (`implement.md`).
- [x] T007 Sequence branch, propose, apply, archive, verify, and merge-on-clean steps (`speckit_complete_auto.yaml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify a failing unattended run emits `verification_failed` and exits without merge.
- [x] T009 Verify all four terminal reason codes are documented verbatim.
- [x] T010 Verify branch-preserved failure behavior matches the completed specification.
- [x] T011 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
