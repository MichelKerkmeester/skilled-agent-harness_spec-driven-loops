---
title: "Tasks: Plan-Preflight Nested Packet Resolution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plan preflight nested packet tasks"
  - "check-prerequisites override tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-plan-preflight-nested-packet-resolution"
    last_updated_at: "2026-08-15T13:28:53Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Commit and push to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-15-system-speckit-034-plan-preflight"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Plan-Preflight Nested Packet Resolution

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

- [x] T001 Confirm blast radius of the resolution functions. — `rg 'get_feature_paths|find_feature_dir_by_prefix|check_feature_branch'` returns only `common.sh` and `check-prerequisites.sh`.
- [x] T002 Reproduce the failure on a non-feature branch and via the override. — `check-prerequisites.sh --paths-only` on `skilled/v4.0.0.0` errors `Not on a feature branch`; override also blocked pre-fix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Guard `check_feature_branch` behind an explicit-override check (check-prerequisites.sh). — guarded via `[[ -z "${SPECIFY_FEATURE:-}" ]]`; `bash -n` clean.
- [x] T004 Add durable WHY comment explaining the explicit-override bypass (check-prerequisites.sh). — comment added above the guard; `bash -n check-prerequisites.sh` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Syntax check. — `bash -n check-prerequisites.sh` exits 0.
- [x] T006 Nested packet resolves via override and strict validation passes. — `SPECIFY_FEATURE="anobel.com/008-disable-cookie-modal" --validate-strict` returns `RESULT: PASSED`, exit 0.
- [x] T007 Regression: default branch gate preserved. — no-override `--paths-only` still errors `Not on a feature branch`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
