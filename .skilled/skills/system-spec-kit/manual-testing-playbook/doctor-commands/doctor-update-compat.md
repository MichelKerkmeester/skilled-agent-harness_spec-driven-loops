---
title: "DOC-381 -- Doctor update compat"
description: "Manual scenario validating that /doctor:update compat on a throwaway v3 fixture previews the layout move without writing, refuses a dirty spec root, asks the move and the upgrade approvals separately, and resumes an interrupted move from its move log."
version: 1.0.0.0
id: doctor-commands-doctor-update-compat
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-381 -- Doctor update compat

## 1. OVERVIEW

This scenario validates `/doctor:update compat`, the action that moves a v3 spec layout to v4 and then upgrades the legacy packets. A v3 checkout keeps its packets in `.opencode/specs` and tracks `specs` as a symlink to that folder. The action previews the move, runs it only after one approval, and runs the upgrade only after a second approval. Both mutating runs happen outside the release transaction, and every step is appended to a move log in the git directory.

The shipped `/doctor:update` fixture is a v4 checkout, so this scenario builds its own v3 fixture in a disposable repository outside the live checkout. The move renames the real spec roots, so the live checkout is never a target. The scenario covers the layout preview, the dirty-root refusal, the move approval, interrupted-run recovery, the upgrade approval and the move log.

Phase 1 of the workflow runs the release check, which needs a release record that a fresh fixture does not have. This scenario therefore drives phases 2 to 8 of the workflow. The release gate is covered by `doctor-update-compat.test.cjs`.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that the compat action previews a v3 move without writing, refuses a dirty spec root before any write, runs the move only after its own approval, resumes an interrupted move from the move log, and runs the upgrade only after its own approval.
- Playbook ID: DOC-381.
- Real user request: `Move this spec tree to the v4 layout and upgrade its legacy packets.`
- Prompt: `Move this spec tree to the v4 layout and upgrade its legacy packets.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit` and `.skilled/commands/doctor`, with Node, git and bash available. A v3 fixture built by step 1 of the commands, outside the checkout, with an empty `git status --porcelain` and no move log in its git directory. The fixture needs no network.
- Expected execution process: Build the fixture and confirm it reports layout v3. Run the dry run. Edit one packet to trigger the dirty refusal, then revert the edit. Approve the move, stop the run after `move-tree`, and resume it in a new session. Approve the upgrade. Build a second fixture, approve its move, and decline its upgrade. Compare the tree and the move log after each run.
- Expected signals: The layout map on the fresh fixture exits 0 and prints `"state": "v3"`, with one move from `.opencode/specs` to `specs` and three steps: `rm -f specs`, `git mv .opencode/specs specs` and `ln -s ../specs .opencode/specs`. The dry run prints the Spec Folder Compatibility Preview with that move, stops with `STATUS=DRY_RUN` and writes no log line. The dirty refusal prints `These spec roots have uncommitted changes:` with the edited path and the reason that the move keeps no before-image. It stops with the refusal value of its `STATUS=` line, as the result template lists it, before the move approval is asked and before any log line. The move approval reads `Move the spec tree as listed? Reply yes to run 3 steps, or no to leave the tree unchanged.` Each step prints `Step [i]/[n] [id]: started` and then `done`. The move log gains `run-started`, a `step-started` and `step-done` pair for each step, and `move-complete`. The interrupted run has no `move-complete` line. The next run first prints `A previous compatibility run stopped after move-tree. Done: remove-specs-link, move-tree. Remaining: link-legacy-path.` It then asks the move approval again. That approval runs only `link-legacy-path`, with no dirty-roots refusal, after which `.opencode/specs` is a symlink to `../specs`. The upgrade preview lists the legacy packet as failing, with its rules and the Downgrades section, and then asks `Run upgrade-legacy --apply on these packets? Reply yes or no.` A yes runs `upgrade-legacy.mjs --apply`, logs `upgrade-started` and `upgrade-done`, appends `run-complete` and ends with `STATUS=UPGRADED`. A no stops with `STATUS=DECLINED`, leaves the moved tree in place, logs no `upgrade-started` line and closes the run with `run-complete`. Every run writes its log to `<git-dir>/doctor-update-compat.log.jsonl`, which is outside the working tree.
- Desired user-visible outcome: The operator sees each planned change before it is made, a dirty tree stops the move, each mutation waits for its own yes, an interrupted move resumes from its log, and the move log records the whole sequence.
- Pass/fail: PASS if the dry run and the dirty refusal write nothing and add no log line, the move and the upgrade each run only after their own yes, the interrupted run reports its done and remaining steps and resumes with only the owed step, the log lines appear in order for each run, and a declined upgrade leaves the moved tree in place with `STATUS=DECLINED`.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Move this spec tree to the v4 layout and upgrade its legacy packets.
```

### Commands

In this scenario, each run of `/doctor:update compat` means phases 2 to 8 of `doctor-update-compat-action.yaml`, executed with the fixture as the repository. Phase 1 is skipped because the fixture has no release record.

1. Build the v3 fixture outside the checkout, and confirm its layout.
   - Set `CHECKOUT` to the checkout root, then run `FIXTURE="$(mktemp -d)"`.
   - Run `: > "$FIXTURE.gitconfig"` and `export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig"`, so that a user-level ignore cannot hide the packets.
   - Run `cd "$FIXTURE" && git init -q`. Then copy the skill and the doctor command into the fixture with `mkdir -p .skilled/skills .skilled/commands`, `rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" .skilled/skills/` and `rsync -a "$CHECKOUT/.skilled/commands/doctor" .skilled/commands/`.
   - Link the checkout's `node_modules` folders back at their relative paths, and create an empty `runtime/node_modules` folder, as `doctor-update-compat-integration.test.cjs` does at its lines 106 to 118.
   - Run `printf 'dist/\n' > .gitignore`, then `git add -A` and commit with a throwaway identity: `git -c user.name=Fixture -c user.email=fixture@test.invalid commit -q -m baseline`.
   - Write one legacy packet at `.opencode/specs/legacy-track/001-old-packet/`. Its `spec.md` has only `title` and `description` in its frontmatter. Its `plan.md` and `tasks.md` have no frontmatter. The `writeLegacyPacket` function in the integration test, at its lines 77 to 83, has the same content.
   - Run `ln -s .opencode/specs specs`, then `git add .opencode/specs specs` and commit with the same identity and the message `classic v3 fixture`.
   - Run `node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --layout-map`. Confirm it exits 0 and prints `"state": "v3"`, then confirm `git status --porcelain` prints nothing.
2. Run `/doctor:update compat --dry-run` from the fixture root. Record the Spec Folder Compatibility Preview, the `STATUS=DRY_RUN` line and `git status --porcelain`. Confirm the log does not exist with `test ! -e "$(git rev-parse --absolute-git-dir)/doctor-update-compat.log.jsonl"`.
3. Trigger the dirty refusal. Append one line to `.opencode/specs/legacy-track/001-old-packet/plan.md`, then run `/doctor:update compat`. Record the refusal text, its refusal `STATUS=` line, the absence of a move approval prompt and the absence of the log file. Revert the edit with `git checkout -- .opencode/specs/legacy-track/001-old-packet/plan.md`, then confirm `git status --porcelain` prints nothing.
4. Start the move. Run `/doctor:update compat` and reply `yes` to the move approval. Stop the run once the log has the `step-done` line for `move-tree` and before `link-legacy-path` starts, then end the session. Record the log lines. If the stop cannot land between those two steps, reproduce the same state by hand: run `rm -f specs` and `git mv .opencode/specs specs`, then append `run-started`, `step-started` and `step-done` lines for those two steps to the log, using one run id and the step argv from the layout map.
5. Resume the move. In a new session in the fixture, run `/doctor:update compat`. Record the Interrupted run line and the move approval prompt, and reply `yes`. The run goes straight to the `link-legacy-path` step with no dirty-roots refusal, because an owed recovery step is not a planned move. Record its step line, then run `readlink .opencode/specs`, which must print `../specs`.
6. Record the upgrade preview. Reply `yes` to `Run upgrade-legacy --apply on these packets? Reply yes or no.` Record the upgrade output, the `STATUS=UPGRADED` line and the full move log. The log must hold two runs. The first run has no `run-complete` line, and the second ends with `run-complete`.
7. Check the decline path on a second fixture. Build a new fixture with step 1, then run `/doctor:update compat`, reply `yes` to the move approval and reply `no` to the upgrade approval. Record `STATUS=DECLINED`, the output of `readlink .opencode/specs`, and the move log, which must hold `move-complete`, then `run-complete`, and no `upgrade-started` line.
8. Delete both fixture directories with `rm -rf`, along with their `.gitconfig` files, and unset `GIT_CONFIG_GLOBAL`.

### Expected

The fresh fixture reports layout v3 before any run. The dry run and the dirty refusal change nothing in the fixture and write no log line. The move runs only after a `yes` at the move approval. The interrupted run resumes with only `link-legacy-path` remaining. The upgrade runs only after a `yes` at its own approval, and a `no` there leaves the moved tree in place. The move log holds one `run-started` line per run, a `step-started` and `step-done` pair for each step, and `move-complete`, `upgrade-started`, `upgrade-done` and `run-complete` in that order when the upgrade runs.

### Evidence

- The layout map output of the fresh fixture, with its state, moves and steps.
- The dry-run preview, the `STATUS=DRY_RUN` line and the result of the log file check.
- The dirty-refusal text, its refusal `STATUS=` line and the log file check after the refusal, plus `git status --porcelain` after the revert.
- The move approval text, the step lines, and the log after the interrupted run.
- The Interrupted run line, the second move approval, the `link-legacy-path` step line and the output of `readlink .opencode/specs`.
- The upgrade preview, the upgrade approval, the upgrade output with its packet counts, and the `STATUS=UPGRADED` line.
- The full move log from the first fixture, with both runs.
- The `STATUS=DECLINED` line and the move log from the second fixture.

### Pass / Fail

- **Pass**: The dry run and the dirty refusal write nothing and add no log line. The move and the upgrade each run only after their own `yes`. The interrupted run reports its done and remaining steps and resumes with only the owed step, with no dirty-roots refusal. The log lines appear in order for each run, and a declined upgrade leaves the moved tree with `STATUS=DECLINED` and closes its run with `run-complete`.
- **Fail**: A move or upgrade step runs before its approval, a dirty spec root does not stop the move, the resume stops at the dirty-roots refusal, the interrupted run reruns `move-tree` or reports the wrong remaining steps, an approval is skipped, a log line is missing or out of order, a run that reached a terminal status other than a failed move step has no `run-complete` line, or a file under `.skilled/` changes.

### Failure Triage

If `--layout-map` does not report v3, check the fixture's symlink. `specs` must point at `.opencode/specs`. The planner in `upgrade-legacy.mjs` reads the kind of each root on disk, not the git index. If the dirty refusal does not fire, run `git status --porcelain=v1 --untracked-files=all -- specs .opencode/specs` by hand. The edited packet file must appear in its output. If the resume reports the wrong remaining steps, compare the newest run in the log with `--layout-map` on the disk state. After `move-tree`, `specs` is a directory and `.opencode/specs` is absent. The layout map then reports `state: v4` with no steps, so the owed `link-legacy-path` comes only from the move log. If the resume stops at the dirty-roots refusal, the `dirty_refusal` text in `doctor-update-compat-action.yaml` has lost its exemption for owed recovery steps. If a declined or cancelled run leaves no `run-complete` line, check `move_log.close_rule` in the same file. If the upgrade preview lists no failing packet, confirm that the packet's `spec.md` still has only `title` and `description` in its frontmatter. The integration test asserts that the same packet fails. If `upgrade-legacy --apply` refuses to write its manifest, show its stderr verbatim with the presentation's manifest refusal, and record the run as `FAIL`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-compat-action.yaml](../../../../commands/doctor/assets/doctor-update-compat-action.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Upgrade engine: [upgrade-legacy.mjs](../../runtime/cli/spec/upgrade-legacy.mjs)
- Integration reference: [doctor-update-compat-integration.test.cjs](../../../../commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:update compat

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-381
- Feature name: Doctor update compat
- Command mode: `/doctor:update compat`
- YAML asset: `doctor-update-compat-action.yaml`
- Mutation boundary: The disposable fixture only. The move renames its spec roots, the upgrade rewrites its packets, and the move log lives in its git directory. The live checkout is never a target, and each fixture is deleted at the end of the run.
- Feature file path: `doctor-commands/doctor-update-compat.md`
