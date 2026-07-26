---
title: "Tasks: Cursor session-start spec-gate prebinding"
description: "Task breakdown for hardening, wiring, testing, and documenting Cursor startup prebinding."
trigger_phrases:
  - "Cursor prebind tasks"
  - "Cursor Gate-3 wiring tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/018-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-26T06:02:44Z"
    last_updated_by: "opencode"
    recent_action: "Phase and recursive strict validation pass with zero errors and warnings."
    next_safe_action: "Pin final evidence to the resulting commit SHA after an explicit commit request."
    blockers: ["Final P1 evidence requires a commit SHA; no commit has been requested."]
    key_files: ["spec.md", "plan.md", ".opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs", ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Wire Cursor session-start spec gate prebinding

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

- [x] T001 Confirm the prebind gap and `sessionStart` delivery authority. [EVIDENCE: parent handover and live `.cursor/hooks.json` establish the inactive enforce path.]
- [x] T002 Audit shared state, validation, disabled, and child-session contracts. [EVIDENCE: public exports in `spec-gate-core.mjs` and `gate-3-classifier.ts` inspected.]
- [x] T003 Define the startup matrix and rollback boundary. [EVIDENCE: `spec.md` and `plan.md` enumerate all independent axes.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add process-level tests for malformed input, identity, env, binding, and state rows. [EVIDENCE: prebind suite reports 9/9 passing after repair (added padded-id and enforce-off rows).]
- [x] T005 Harden the prebind around top-level identity, verbatim session ids, and terminal-state preservation. [EVIDENCE: `spec-gate-prebind.test.mjs` padded-id, child, missing-identity, and terminal-state subtests pass; suite reports 9/9.]
- [x] T006 Wire the real path into `.cursor/hooks.json` and add the discovery symlink. [EVIDENCE: one resolving config entry and symlink checks exit 0.]
- [x] T007 Update Cursor hook inventories and current-state docs. [EVIDENCE: `validate_document.py` reports 0 issues across the 9 touched Cursor hook documents.]
- [x] T008 Resolve the autonomous-child contract in the shared core: a child is a complete no-op in classifyIntent/evaluateMutation. [EVIDENCE: core suite 67/67; OpenCode plugin suite 11/11.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run prebind, shared-core, and OpenCode consumer tests. [EVIDENCE: prebind 9/9, core 67/67 with module mocks, and plugin 11/11 pass during repair.]
- [x] T010 Verify config parsing, command resolution, mirror resolution, and comment hygiene. [EVIDENCE: `.cursor/hooks.json` has one resolving entry, the mirror symlink resolves, syntax passes, and `check-comment-hygiene.sh` reports no violations.]
- [x] T011 Run OpenCode alignment and document validators. [EVIDENCE: `run-all-drift-guards.sh` passes 3/3 and `validate_document.py` passes 21/21 affected Markdown documents.]
- [x] T012 Reconcile phase 017/018 and packet 030 metadata and continuity. [EVIDENCE: phase 017 successor and metadata resolve to 018; parent graph has 18 unique on-disk children and no ghost entry.]
- [x] T013 Run phase and recursive parent strict validation. [EVIDENCE: phase 018 and packet 030 recursive strict validation each report 0 errors, 0 warnings, and `RESULT: PASSED`; the parent verifies all 18 phase links.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 tasks have command-backed evidence. [EVIDENCE: runtime and packet gates pass; CHK-FIX-007 remains open until a commit pins the SHA.]
- [x] No blocked implementation tasks remain. [EVIDENCE: T001-T013 are complete; only the commit-SHA closeout item remains open.]
- [x] Runtime, configuration, docs, and recursive packet gates pass. [EVIDENCE: all runtime suites and document checks pass; phase 018 and packet 030 recursive strict validation report 0 errors and 0 warnings.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
