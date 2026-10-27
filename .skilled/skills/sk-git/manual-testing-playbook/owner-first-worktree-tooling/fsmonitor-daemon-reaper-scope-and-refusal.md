---
title: "GIT-047 -- fsmonitor daemon reaper stays inside its scope"
description: "This scenario validates the fsmonitor daemon reaper for `GIT-047`. It focuses on prove the dry run ends nothing, --apply --worktree refuses while a live process is inside the worktree and another repository's daemon is never touched."
version: 1.0.0.0
---

# GIT-047 -- fsmonitor daemon reaper stays inside its scope

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GIT-047`.

---

## 1. OVERVIEW

This scenario validates the fsmonitor daemon reaper for `GIT-047`. It focuses on prove the dry run ends nothing, `--apply --worktree` refuses while a live process is inside the worktree and another repository's daemon is never touched.

### Why This Matters

The reaper runs unattended on every top-level launch and before every worktree removal, so it signals processes nobody is watching. Ending the wrong daemon costs another repository its file watcher, and ending the daemon of a worktree someone is still working in pulls the watcher out from under them. The three boundaries this scenario checks are the ones that keep an unattended run safe.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-047` and confirm the expected signals without contradictory evidence.

- Objective: prove the reaper's dry run signals nothing, `--apply --worktree` prints a `refused` line and ends nothing while a live process has its working directory inside the worktree and a daemon that belongs to another repository is reported `out-of-scope` and keeps running.
- Real user request: `Git keeps stalling and I have a pile of fsmonitor daemons. Can the cleanup script end them without touching my other repos or the worktree I am still in?`
- Prompt: `Run the fsmonitor daemon reaper against scratch repositories only, show that its dry run ends nothing, that it refuses to end a worktree's daemon while a process is inside that worktree and that another repository's daemon is left alone.`
- Expected execution process: Build two scratch repositories, give the first one a linked worktree, start a real fsmonitor daemon in all three trees, run the reaper's dry run, park a process inside the linked worktree, run `--apply --worktree` against it, then confirm every daemon pid is unchanged and stop the daemons through git's own stop.
- Expected signals: the dry run of the first repository prints one `class=main` line, one `class=keep worktree=<scratch>/a-wt` line, the second repository's daemon pid as `class=out-of-scope worktree=-` and `mode=dry-run signalled=0`, then exits 0. The occupied run prints `refused worktree=<scratch>/a-wt blocker=<parked pid>` and `mode=apply signalled=0`, then exits 0. Afterwards the main and keep pids match the dry run and the second repository's daemon still runs.
- Desired user-visible outcome: A concise PASS or FAIL verdict with the reaper lines as evidence. SKIP only when `git fsmonitor--daemon start` fails because the platform has no built-in fsmonitor daemon, or when `lsof` is unavailable.
- Pass/fail: PASS if the dry run signals nothing, the occupied run refuses with signalled=0 and every scratch daemon pid survives both runs. FAIL if any run ends a daemon, if the occupied run prints no `refused` line or if the second repository's daemon is classed anything other than `out-of-scope`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

Run every command from the repository root, in one shell so `$S` persists. Every daemon and repository the scenario touches lives under `$S`. Never point `--apply` at the live checkout.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-047 | fsmonitor daemon reaper stays inside its scope | prove the dry run ends nothing, `--apply --worktree` refuses while a live process is inside the worktree and another repository's daemon is never touched. | `Run the fsmonitor daemon reaper against scratch repositories only, show that its dry run ends nothing, that it refuses to end a worktree's daemon while a process is inside that worktree and that another repository's daemon is left alone.` | 1. `bash: S="$(cd "$(mktemp -d)" && pwd -P)"; for r in a b; do git init -q "$S/$r" && git -C "$S/$r" -c user.name=t -c user.email=t@t.t commit -q --allow-empty -m init; done; git -C "$S/a" worktree add -q -b demo/wt "$S/a-wt"` -> 2. `bash: for d in "$S/a" "$S/a-wt" "$S/b"; do git -c core.fsmonitor=true -C "$d" fsmonitor--daemon start; done` -> 3. `bash: bash .skilled/bin/fsmonitor-daemon-reaper.sh --repo "$S/b" \| grep 'class=main'` -> 4. `bash: bash .skilled/bin/fsmonitor-daemon-reaper.sh --repo "$S/a"; echo "exit=$?"` -> 5. `bash: (cd "$S/a-wt" && exec sleep 120) & echo "blocker=$!"` -> 6. `bash: bash .skilled/bin/fsmonitor-daemon-reaper.sh --repo "$S/a" --apply --worktree "$S/a-wt"; echo "exit=$?"` -> 7. `bash: bash .skilled/bin/fsmonitor-daemon-reaper.sh --repo "$S/a"; ps -o command= -p <b-pid>` -> 8. `bash: kill <blocker-pid>; for d in "$S/a-wt" "$S/a" "$S/b"; do git -c core.fsmonitor=true -C "$d" fsmonitor--daemon stop; done; rm -rf "$S"` | Step 3 names the second repository's daemon pid as <b-pid>. Step 4 prints `class=main worktree=main`, `class=keep worktree=$S/a-wt`, <b-pid> as `class=out-of-scope worktree=-` and `mode=dry-run signalled=0`, then `exit=0`. Step 6 prints `refused worktree=$S/a-wt blocker=<blocker-pid>` and `mode=apply signalled=0`, then `exit=0`. Step 7 repeats the step 4 main and keep pids, and `ps` prints a `git fsmonitor--daemon run` command for <b-pid>. | The step 3, 4, 6 and 7 transcripts with their exit lines and the blocker pid from step 5. | PASS if the dry run signals nothing, the occupied run refuses with `signalled=0` and every scratch daemon pid survives both runs. FAIL if any run ends a daemon, if the occupied run prints no `refused` line or if the second repository's daemon is classed anything other than `out-of-scope`. | A missing `keep` line points at attribution: confirm the worktree daemon holds `$S/a/.git/worktrees/a-wt`. A missing `refused` line points at the cwd listing in `_cwd_intruder`. Another repository's daemon classed `keep` or `stray` points at the administrative-directory check in the classification loop. |

### Optional Supplemental Checks

Before step 8, end the parked process with `kill <blocker-pid>` and rerun step 6. The run then prints `ended pid=<keep pid> class=keep worktree=$S/a-wt via=stop`, which shows the refusal was the only thing holding the daemon.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [fsmonitor-daemon-reaper.md](../../feature-catalog/session-lifecycle/fsmonitor-daemon-reaper.md) | Matching feature catalog entry |

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../bin/fsmonitor-daemon-reaper.sh` | Classification, the apply contract and the occupancy refusal |
| `../../../../bin/tests/fsmonitor-daemon-reaper.test.sh` | Automated coverage of the same three boundaries with stub and real daemons |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-047
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/fsmonitor-daemon-reaper-scope-and-refusal.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
