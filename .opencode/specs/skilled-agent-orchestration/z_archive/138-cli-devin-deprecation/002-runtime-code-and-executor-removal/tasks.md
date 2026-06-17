---
title: "Tasks: Phase 2: runtime-code-and-executor-removal"
description: "Task list for cli-devin deprecation phase 2"
trigger_phrases:
  - "phase 2 tasks"
  - "runtime-code-and-executor-removal tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation/002-runtime-code-and-executor-removal"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 2 tasks completed"
    next_safe_action: "Proceed to phase 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: runtime-code-and-executor-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Context Report §2 cluster + the target files before editing (READ-first, scope-locked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 executor-config.ts: cli-devin removed from EXECUTOR_KINDS + DEVIN_* consts/types/guards
- [x] T003 executor-audit.ts: 5 cli-devin lookup-map entries removed
- [x] T004 fanout-run.cjs: cli-devin dispatch branch + permission triad removed
- [x] T005 dispatch-model.cjs + profile-validator.cjs KNOWN_EXECUTORS cleaned
- [x] T006 3 if_cli_devin YAML blocks + 6 command-doc executor enums removed; swe-1.6 hard-code gone
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify: deep-loop-runtime executor vitest 56 passed; deep-improvement remediation 23 passed; node -c clean; grep 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Verification passed (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation**: See `implementation-summary.md`
- **Authoritative edit list**: `../context/context-report.md` §2
<!-- /ANCHOR:cross-refs -->
