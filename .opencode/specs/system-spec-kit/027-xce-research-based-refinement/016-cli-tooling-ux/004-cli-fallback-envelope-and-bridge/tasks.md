---
title: "Tasks: CLI Fallback Envelope and Bridge Allowlist [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "004-cli-fallback-envelope-and-bridge tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 task list (planned, unchecked)"
    next_safe_action: "Begin Phase 1 envelope comparison tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Fallback Envelope and Bridge Allowlist

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

- [ ] T001 Compare current envelope shapes across `spec-memory-cli-fallback.ts:148-220`, `code-index-cli-fallback.ts:151-220`, `skill-advisor-cli-fallback.ts:158-187`; identify the field superset.
- [ ] T002 Capture the code-index denylist posture (`mk-code-graph-bridge.mjs:18-25`, `:272-282`) as the allowlist pattern.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Define the normalized warm-fallback envelope + reason codes (`skipped`, `fail_open`, `exitCode`, retryability).
- [ ] T004 [P] Wire the three hook helpers to emit the normalized envelope additively (keep existing fields).
- [ ] T005 Add the prompt-time allowlist to `mk-spec-memory-bridge.mjs:206-230`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify the envelope contract test asserts one shape across all three helpers.
- [ ] T007 Verify existing consumer fields remain present (additive-only).
- [ ] T008 Verify the spec-memory bridge rejects any out-of-allowlist toolName.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
