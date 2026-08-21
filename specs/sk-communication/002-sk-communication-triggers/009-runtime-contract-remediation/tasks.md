---
title: "Tasks: Phase 9: runtime contract remediation"
description: "Task list for the coded model default, the local static-text entrypoint, the verifiable read-only flags, and the metadata reconcile."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/009-runtime-contract-remediation"
    last_updated_at: "2026-08-20T21:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed T-001 through T-006"
    next_safe_action: "Parent closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-runtime-contract-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: runtime contract remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` open. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Add tests: the default-model map, the updated pi/devin argv, and the local static-text projection with its fallbacks. Verify: the new/updated tests fail against the current code.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add `defaultModelForEngine`, export it, and fall back to it in the external launcher with a clear pi error. Verify: engine-only dispatch resolves a model; typecheck and build pass.
- [x] T-003 Add `runLocalProjection`, its launcher, and rewrite Branch C to project target text. Verify: the local-projection tests pass.
- [x] T-004 Add the pi read-only tool allowlist, move devin off auto-approve, and correct the read-only claim in docs. Verify: the updated argv tests pass and the docs match the code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-005 Run the full package gate. Verify: typecheck 0, build 0, tests pass, import smoke OK.
- [x] T-006 Reconcile parent and child metadata and run recursive strict validation. Verify: `validate.sh --strict --recursive` reports zero errors and parity passes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All four requirements met: engine-only external dispatch resolves a model, local mode projects target text, read-only is enforced where verifiable and documented honestly elsewhere, and the packet metadata is internally consistent with the package gate and recursive strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Package: `.opencode/skills/sk-communication/cli-communication-projection/`
- Predecessor: `../008-spawn-process-group-hardening/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
