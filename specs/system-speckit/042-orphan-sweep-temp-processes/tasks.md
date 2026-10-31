---
title: "Tasks: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "orphan sweep temp processes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent

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

`W` is `.skilled/scripts/orphan-mcp-sweeper.sh`. `R` is `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the orphan baseline and the agent state (`spec.md` Measured Behavior). Verify: `launchctl list | grep -i orphan` prints nothing.
- [x] T002 Dry-run the unmodified rules from inside a session (`W`). Verify: output proposes `kill` for this session's pid 86738.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `temp-path-orphan` class, its pre-signal recheck and the listener exception (`W`). Verify: `/bin/bash -n W` and `shellcheck -S warning W` exit 0.
- [x] T004 Pass `-a` to pgrep on Darwin in `build_session_trees` (`W`, implemented by DeepSeek V4.1 Flash via Pi). Verify: dry run prints `reason=live-session-tree pid=86738`.
- [x] T005 Preserve the advisor launcher and its launcher-parented server (`W`, implemented by DeepSeek V4.1 Flash via Pi). Verify: dry run prints `advisor-self-idle-timeout` and `advisor-launcher-child`.
- [x] T006 Add the regression tests (`R/tests/orphan-sweeper-temp-path.vitest.ts`, session-tree block by DeepSeek V4.1 Flash via Pi). Verify: `npx vitest run orphan-sweeper` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run every sweeper suite (`R`). Verify: `npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` prints `Test Files  3 passed (3)` and `Tests  18 passed (18)`.
- [x] T008 Dry-run the final script on the live process list (`W`). Verify: no `kill` line names a live session helper or the advisor.
- [x] T009 Install the LaunchAgent live (`~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`). Verify: `launchctl list com.michelkerkmeester.orphan-sweep` succeeds, its `ProgramArguments` carry no `--dry-run`, and a `launchctl kickstart` run logs `dry_run=false` and `exit_code=0`.
- [x] T010 Run `/local-skilled-alignment` over the shipped range with DeepSeek lanes and an Opus critic. Verify: report at `~/.local/state/local-skilled-alignment/Public/20261029T083826Z/report.md` lists 20 findings, P0 0.
- [x] T011 Pause the live agent after the log showed six TERMs to a launcher-supervised `hf-model-server`. Verify: `launchctl list com.michelkerkmeester.orphan-sweep` reports the service is not found.
- [x] T012 Preserve `hf-model-server` while the advisor launcher is its parent, restore mode 100755, and cover `current_class_of` (`W`, tests by DeepSeek V4.1 Flash via Pi). Verify: dry run shows no `class=hf-model-server` kill; `git ls-files -s W` shows 100755.
- [x] T013 Bring the env docs, hook runbook, root README, feature catalog, playbook (new scenario 487) and a system-spec-kit v2.12.22.0 changelog in line with the shipped behavior. Verify: `grep -rn "reaps only ownerless" .skilled/skills/system-spec-kit` prints nothing.
- [x] T014 Restore the two Devin evidence files the first commit removed. Verify: `test -e specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/runtime-verification/devin/02-dv022.txt`.
- [x] T015 Reload the LaunchAgent once T012 holds. Verify: `launchctl kickstart` logs `kills=0` with no advisor or model-server kill.
- [x] T016 Make the session tree recognise all seven CLI runtimes and preserve a temp-path process that still drives a live session (`W`, by DeepSeek V4.1 Flash via Pi). Verify: a dry run prints `reason=advisor-launcher-child` for a live `hf-model-server` and `kills=0`; the driver tests pass.
- [x] T017 Enforce `ORPHAN_AGE_MIN_SEC` as a floor for every candidate (`W`, by DeepSeek V4.1 Flash via Pi). Verify: the age-floor tests pass.
- [x] T018 Trigger `spec-kit-check.yml` on `.skilled/scripts/**` and `.opencode/scripts/**` (by DeepSeek V4.1 Flash via Pi). Verify: `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
- [x] T019 Correct the DOC-395 gold mode to `sk-code-quality`, release sk-code 3.9.23.0 and re-mint its route manifest. Verify: `compiled-route-admission.cjs --all` prints that every hub passes and `compiled-route-guard.cjs` reports all hubs fresh.
- [x] T020 Rerun the full sweeper suites and the battery over every changed file. Verify: 29 tests pass; battery rows all pass after the re-mint.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
