---
title: "Goal: Phase 11: relocate-and-restore-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "relocate and restore fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/011-relocate-and-restore-fixes"
    last_updated_at: "2026-11-14T11:10:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase from the two reviews of 2026-11-14"
    next_safe_action: "Ask the operator for the build workspace, then start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-relocate-and-restore-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: relocate-and-restore-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a rerun of a stopped re-parent leave both parents' phase rows correct, and fix the five smaller relocate and restore defects the two reviews of 2026-11-14 found.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Exit statuses 0, 1, 2 and 3 keep their meanings. Only the condition for 3 narrows, to a read `RESULT: FAILED` line. |
| D2 | Every fix lands after a suite case that failed before it. No run touches the real `specs/` tree. |
| D3 | A finished map still ends on `relocate: nothing to do` with exit 0. |
| D4 | No code comment names a spec path, a packet number or a finding id. |
| D5 | An untracked packet stopped before the ledger step stays a refusal that names the move back. Phase 013 documents it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] In a `mktemp` copy, a re-parent stopped after its move is finished by `relocate.mjs --apply` with no row for the old name left in the old parent's `spec.md` and a map row in the new parent's, and the next run prints `relocate: nothing to do` Evidence: scratch/after-f1.txt, both re-parent cases pass in temp repositories.
- [x] A close validation that prints no `RESULT` line exits 2 and the rerun validates again, and one that prints `RESULT: FAILED` exits 3 Evidence: scratch/worker-011b.md cases, orchestrator rerun 115 passed, exit 0.
- [x] A renumber leaves `other-track/003-gamma` unchanged in the parent's `spec.md` and rewrites `005-p/003-gamma` and `../003-gamma/spec.md` Evidence: scratch/worker-011d.md case `leaves a bare phase name that follows another folder name`, 115 passed.
- [x] A restore into a flat track runs no `relocate.mjs` process before its move, and the mixed-track refusal case still exits 1 Evidence: scratch/worker-011e.md, the recording stub sees no call; the refusal case still exits 1.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh --help` names the mixed-track refusal and the status 3 outcome Evidence: `archive.sh --help | rg -c` printed 2; the second line is the restored-with-warning outcome that status 3 produces.
- [x] From `.skilled/skills/system-spec-kit/runtime/cli`, `npm test` exits 0 with no failure absent from the baseline Evidence: 212 files, 2613 passed, 0 failed, exit 0 against the 2603 baseline.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents authored | Done | `spec.md`, `plan.md` and `tasks.md` in this folder, 2026-11-14 |
| Implementation | Pending | Not started. The build workspace is the operator's choice |

### Deviations and findings

| Item | Note |
|------|------|
| Plan verified 2026-11-14 | A fresh Fable 5.2 at high effort returned READY WITH FIXES, in `../review/fable-plan-verification.md`. All three P1s and every P2 for this phase are applied: the case-fold probe moved out of scope as unreachable, REQ-001 gained the in-process injection, the child path and write order, REQ-002 keeps the close open, REQ-003 tests the parent-name form, REQ-004 states the shared declaration rule, and the setup saves a full-suite baseline. The orchestrator checked `relocate.mjs:61`, `:860` and `:1651` before applying |
| Findings confirmed by the orchestrator | F1 was traced in the code by the orchestrator: the move step runs before the rewrite step, `recordedMove` reads a moved folder as done, and `phaseRowEdits` plans only pending entries. It was not run. F2 was read at `relocate.mjs:1659-1666`. F3 and F4 are Fable's reports that the failing-first cases reproduce. F6 is out of scope as unreachable |
<!-- /ANCHOR:log -->
