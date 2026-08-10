---
title: "Tasks: Goal Isolation Verification and Validation"
description: "Final acceptance tasks for concurrent-session isolation, regression proof, metadata reconciliation, and Pi rollout."
trigger_phrases:
  - "goal isolation validation tasks"
  - "pi goal re-enable tasks"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/005-verification-and-validation"
    last_updated_at: "2026-08-10T15:19:41Z"
    last_updated_by: "codex"
    recent_action: "Final validation tasks completed"
    next_safe_action: "Monitor session-isolated goals during normal Pi use"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal Isolation Verification and Validation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete with command evidence |
| `[B]` | Blocking failure |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record final baseline and exact authoritative commands. [Evidence: `node --test` goal commands exited 0 with baselines 82 and 119]
- [x] T002 Run the full A/B lifecycle and byte-equivalence matrix. [Evidence: integrated goal tests 82/82]
- [x] T003 Run namespace, workspace, missing-id, resume, fork, malformed, concurrency, and legacy rows. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` and adapter suites]
- [x] T004 Run core, CLI, adapter, and OpenCode plugin regression suites. [Evidence: final 82/82 and 119/119 test receipts]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run two Pi sessions with distinct canaries and current-session management. [Evidence: `PI_TWO_SESSION_CANARY=PASS`]
- [x] T006 Inspect persisted state for cross-session leakage; command-only sessions short-circuited before model transcript creation. [Evidence: `.opencode/hooks/goal/pi/goal-pi.test.mjs` plus live files showed two paths with correct A/B objectives]
- [x] T007 Parse runtime configuration and verify every registered adapter path. [Evidence: `FINAL_RUNTIME_CONFIG=PASS`]
- [x] T008 Verify state permissions, privacy, and bounded lookup behavior. [Evidence: modes 0600, opaque paths, and `BOUNDED_SCOPED_READ=PASS`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run documentation scans and manual playbook scenarios. [Evidence: 16/16 documents and 199/199 relative links passed]
- [x] T010 Run the authoritative workspace gate and recursive strict packet validation. [Evidence: stack folders passed, router-sync 10/10, packet-scoped alignment 8 files/0 findings; recursive strict passed before reconciliation]
- [x] T011 Reconcile checklists, summaries, parent map, description files, and graph metadata. [Evidence: `description.json` and `graph-metadata.json` generators exited 0]
- [x] T012 Inspect scoped diff and remove task-created residue. [Evidence: `git diff --check` exited 0 and `/tmp/goal-phase5.*` had no matches]
- [x] T013 Re-enable Pi only on full pass, or retain disablement with exact blocker evidence. [Evidence: `PI_NORMAL_DISCOVERY_CANARY=PASS` after exclusion removal]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every P0 requirement has observed evidence.
- [x] No cross-session or cross-runtime canary leak exists.
- [x] Required goal-specific and packet-scoped gates pass from final state; the unrelated global drift backlog is recorded.
- [x] Pi rollout state and rollback are verified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
