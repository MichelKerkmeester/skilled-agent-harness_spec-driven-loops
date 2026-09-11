---
title: "Tasks: A New Worktree Should Be Able To Build"
description: "The ordered work for the worktree provisioning step."
trigger_phrases:
  - "worktree provisioning tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/029-worktree-dependency-provisioning"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the task list"
    next_safe_action: "Start T1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-029"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A New Worktree Should Be Able To Build

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

`[ ]` open · `[x]` done, with the evidence that closed it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T1 `scripts/worktree-provision-paths.txt` lists 9 packages, covering all six levels that failed in practice.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T2 `provision` installs missing, skips present, reports each, exits non-zero on any failure. First run: 3 installed, 6 present, 0 failed.
- [x] T3 `create` parses `--no-provision` and calls the step otherwise.
- [~] T4 **Not done, deliberately.** The wrapper symlinks where this installs; pointing it at this list would extend symlinking to trees whose workspace self-links resolve back into the source checkout, which is the failure this packet exists to prevent. The wrapper keeps its own narrower list.
- [x] T5 `SKILL.md` rule 8 rewritten: it already named the problem and now names the fix and why installing beats symlinking.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T6 `bash -n` clean on the allocator.
- [x] T7 Worktree 051 created via `create`; advisor runtime built (dist produced) and CLI answered 9 commands, no manual install.
- [x] T8 Re-run reports `0 installed, 9 already present, 0 failed`, exit 0.
- [x] T9 Worktree and branch `worktrees/051-provision-smoke` removed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Every task above closed with evidence, and the success criteria in `spec.md` met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — the problem and its requirements.
- `plan.md` — the phases these tasks implement.
<!-- /ANCHOR:cross-refs -->
