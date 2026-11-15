---
title: "Goal: Fork Source Baseline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline"
    last_updated_at: "2026-10-03T16:52:11Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-leaf-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Fork Source Baseline

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Copy the pinned upstream `pi-openai-fast-mode` source (commit `9b28456`, v0.3.0) unchanged into an isolated working package at `packages/pi-fast-mode-w-subagent-support/`, with a recorded inventory and rollback path, so later phases can compare identity, config and handoff changes against an untouched reference.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The working package lives at `packages/pi-fast-mode-w-subagent-support/`, outside `context/`. |
| D2 | No source logic, package name or config path changes in this phase. `package.json` keeps the upstream name. |
| D3 | `package-lock.json`, `.git` and `node_modules` are not copied. The lockfile is regenerated in a later phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `find packages/pi-fast-mode-w-subagent-support -type f` lists 16 files: six `src/*.ts`, four `tests/*.test.ts`, `package.json`, `tsconfig.json`, `README.md`, `LICENSE`, `.gitignore` and `preview-img.png`
- [x] `diff -rq` on `src/` and `tests/` and `cmp` on the six root files against `context/pi-openai-fast-mode/` print nothing
- [x] `git status --short context/pi-openai-fast-mode` prints 0 lines both before and after the copy
- [x] The working package contains no `package-lock.json`, `.git` or `node_modules` entry
- [x] This folder's `plan.md` rollback section records `rm -rf packages/pi-fast-mode-w-subagent-support` followed by a re-copy from `context/pi-openai-fast-mode/`
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
| Location, inventory, copy and reference checks | Done (2026-08-16) | `tasks.md` T101 to T105; `implementation-summary.md` Verification rows (16 files, 0 leaked artifacts, diff silent, 0 lines before and after) |
| Rollback path recorded | Done | `tasks.md` T106; `plan.md` §7 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Lockfile left out of the copy | `package-lock.json` exists upstream but was excluded on purpose; `implementation-summary.md` Key Decisions defers it to `003-package-baseline-gates` |
| Evidence is recorded, not re-run | Every tick cites a result recorded in `tasks.md` or `implementation-summary.md`; this goal pass ran none of those commands |
<!-- /ANCHOR:log -->
