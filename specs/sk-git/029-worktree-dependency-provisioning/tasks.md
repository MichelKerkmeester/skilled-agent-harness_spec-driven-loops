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
## Task Notation

`[ ]` open · `[x]` done, with the evidence that closed it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1 `scripts/worktree-provision-paths.txt` lists 9 packages, covering all six levels that failed in practice.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T2 `provision` installs missing, skips present, reports each, exits non-zero on any failure. First run: 3 installed, 6 present, 0 failed.
- [x] T3 `create` parses `--no-provision` and calls the step otherwise.
- [~] T4 **Not done, deliberately.** The wrapper symlinks where this installs; pointing it at this list would extend symlinking to trees whose workspace self-links resolve back into the source checkout, which is the failure this packet exists to prevent. The wrapper keeps its own narrower list.
- [x] T5 `SKILL.md` rule 8 rewritten: it already named the problem and now names the fix and why installing beats symlinking.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T6 `bash -n` clean on the allocator.
- [x] T7 Worktree 051 created via `create`; advisor runtime built (dist produced) and CLI answered 9 commands, no manual install.
- [x] T8 Re-run reports `0 installed, 9 already present, 0 failed`, exit 0.
- [x] T9 Worktree and branch `worktrees/051-provision-smoke` removed.
- [x] T10 Amendment: `.opencode/` gained its own tracked `package.json` in commit e84663a8c5 (2026-09-18), after this packet closed, and the list never named it. A fresh worktree's plugin suite passed 80 of 356, failing with "Cannot find package 'zod'". The list now has a `.opencode` entry, and the `.skilled` entry's comment no longer says plugin tests import from it.
- [x] T11 `provision` on worktree 147 installed `.opencode` (`ci`) and reported 1 installed, 9 already present, 0 failed, exit 0 (`scratch/amendment/provision-first.txt`, rerun after removing the install so the output was kept). A re-run reported 0 installed, 10 already present, exit 0 (`scratch/amendment/provision-rerun.txt`).
- [x] T12 Plugin suite after: 355 of 356. The one failure is `sk-vision exports and registers v2 hooks`, which imports sk-vision's bun-built bundle, a separate gap recorded under Known Limitations. `worktree-naming.test.sh`: 88 pass, 0 fail, before and after.
- [x] T13 Amendment: `provision` now treats a package with a `bun.lock` and no `package-lock.json` as a bun package. Only its own `node_modules` counts as installed, it installs with `bun install --frozen-lockfile` and builds with `bun run --silent build`, and it fails loudly when bun is not on PATH. The list gained `.skilled/skills/sk-vision/vision-runtime  dist/plugin.js`.
- [x] T14 `worktree-naming.test.sh`: 97 pass, 0 fail (`scratch/amendment/naming-after-bun.txt`). Against the previous function six of the seven bun assertions fail; the missing-bun exit code passes there for another reason, and its companion "never falls back to npm" assertion catches it (`scratch/amendment/naming-old-function.txt`). Review found that a relative worktree path left the dependency walk unbounded, so `provision` now resolves its directory first; the relative-path assertion fails against the earlier version (`scratch/amendment/naming-relative-mutation.txt`). The build check runs after the install again, as before the change.
- [x] T15 `provision` on worktree 147: 1 installed, 1 built, 10 already present, 0 failed, exit 0 (`scratch/amendment/provision-bun.txt`); a re-run reported 11 already present (`provision-bun-rerun.txt`). Plugin suite: 356 of 356 (`plugins-after-bun.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every task above closed with evidence, and the success criteria in `spec.md` met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — the problem and its requirements.
- `plan.md` — the phases these tasks implement.
<!-- /ANCHOR:cross-refs -->
