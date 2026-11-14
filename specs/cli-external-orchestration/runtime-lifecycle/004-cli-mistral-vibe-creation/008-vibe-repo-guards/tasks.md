---
title: "Tasks: Phase 8: vibe-repo-guards"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe repo guards tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: vibe-repo-guards

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`V` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. `G` is `.vibe/plugins/repo-guards`. A fixture run is `cd <checkout>/<non-root folder> && VIBE_HOME=<tmp> vibe -p <prompt> --model <roster alias> --trust --output-dir <tmp>/out </dev/null`. It starts inside the checkout but not at its root, so Vibe's upward walk still finds `.vibe/` and phase 007's `no-repo-root-cwd` rule passes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Count the OpenCode plugins (`.opencode/plugins/`). Verify: `ls .opencode/plugins/*.js | wc -l` prints 21.
- [ ] T002 Confirm phase 006's config loads (`.vibe/config.toml`). Verify: `vibe config schema` under `--trust` exits 0, the phase 006 handoff check.
- [ ] T003 Write the classification table, one row per plugin with verdict and Vibe event (`V/references/guards-and-hooks.md`). Verify: the table's plugin rows number 21, and `rg -c 'not portable' V/references/guards-and-hooks.md` counts at least the two turn-stopping guards and `session-relaunch.js`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a fixture `pre_tool` hook that writes its input to a file and denies one tool (`G/fixtures/wire-format`). Verify: one fixture run leaves the input file non-empty, and the run's output folder shows where and how the deny is recorded.
- [ ] T005 Record the wire format and where a deny is visible, from the T004 run (`V/references/guards-and-hooks.md`). Verify: the wire-format section quotes the recorded input, the deny reply and the file that shows the deny, and no longer says UNKNOWN.
- [ ] T006 Port the spec gate as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "pre_tool"` and `strict = true`, and its script exists under `G/`.
- [ ] T007 Port the dispatch preflight as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `strict = true` and its script calls `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`.
- [ ] T008 Port the env-secret guard as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "pre_tool"` and `strict = true`.
- [ ] T009 Port the overlay guard as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "pre_tool"` and `strict = true`.
- [ ] T010 Port the MCP-route guard as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "pre_tool"` and `strict = true`.
- [ ] T011 Port the git-message gate as a strict `pre_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "pre_tool"` and `strict = true`.
- [ ] T012 Port post-edit quality as a strict `post_tool` hook (`.vibe/hooks.toml`). Verify: the entry has `type = "post_tool"` and `strict = true`.
- [ ] T013 Port each further plugin the T003 table marks `hook`, apart from the phase 011 bridges (`.vibe/hooks.toml`). Verify: every `hook` row in the table names a `.vibe/hooks.toml` entry or phase 011.
- [ ] T014 List the guard bundle as hand-authored (`.vibe/SYNC.md`). Verify: `rg -n 'repo-guards' .vibe/SYNC.md` prints a line that says hand-authored.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run each guard's violating fixture (`G/fixtures/`). Verify: each run shows the crafted call denied, in the place T005 recorded.
- [ ] T016 Run each guard's clean fixture (`G/fixtures/`). Verify: each run shows the clean call completing, in the same place.
- [ ] T017 Check that only strict-capable types carry `strict` (`.vibe/hooks.toml`). Verify: `python3 -c "import tomllib; ..."` over the file prints 0 strict entries outside `pre_tool`, `post_tool` and `pre_agent`, and a fixture run shows no `strict is only valid` error.
- [ ] T018 Confirm no OpenCode plugin changed (`.opencode/plugins/`). Verify: `git diff --stat -- .opencode/plugins` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the classification covers 21 of 21 and every ported guard has a blocked and an allowed fixture run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
