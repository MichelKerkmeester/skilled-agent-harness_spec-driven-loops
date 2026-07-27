---
title: "Tasks: Devin PermissionRequest handler"
description: "Task breakdown for the real PermissionRequest adapter, its registration, and its process-level plus live verification."
trigger_phrases:
  - "devin permission request handler tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Execute T001-T010 in order."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin PermissionRequest handler

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

- [ ] T001 Create `permission-request-policy.mjs` skeleton: stdin parse, fail-closed on malformed input/missing identity. [EVIDENCE: `node --check` passes.]
- [ ] T002 Implement write-class classification delegating to `guardCore.isExemptTargetPath`. [EVIDENCE: unit-level assertion that the import is the shared function, not a re-implementation.]
- [ ] T003 Implement exec-class classification delegating to `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`. [EVIDENCE: same import-sharing assertion.]
- [ ] T004 Implement default-deny for any `tool_name`/shape matching neither class. [EVIDENCE: synthetic unknown-tool row denies.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Register the adapter in `.devin/hooks.v1.json`'s `PermissionRequest` array using the documented nested `{matcher, hooks:[{type,command,timeout}]}` shape. [EVIDENCE: `.devin/hooks.v1.json` no longer contains `"PermissionRequest": []`.]
- [ ] T006 Build `permission-request-policy.test.mjs` with write-allow, write-deny, exec-allow, exec-deny, unclassifiable-deny, malformed-input, and missing-identity rows. [EVIDENCE: `node --test` reports all rows pass.]
- [ ] T007 Confirm the suite is discriminating (at least one row fails against a naive always-allow stub). [EVIDENCE: stub comparison documented in `implementation-summary.md`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Live-probe via `devin -p` with a real approval-needing tool call (mirroring the phase's original discovery methodology: back up `.devin/hooks.v1.json`, dispatch, restore). [EVIDENCE: probe transcript shows resolution through the new adapter, not silent rejection.]
- [ ] T009 Run the shared spec-gate core suite and `dispatch-rule-checks` suite to confirm no regression from composing them. [EVIDENCE: both suites report their existing pass counts unchanged.]
- [ ] T010 Run phase 013 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 013 and the 029 parent.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 tasks have command-backed evidence.
- [ ] No blocked implementation tasks remain.
- [ ] Runtime, configuration, docs, and recursive packet gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
