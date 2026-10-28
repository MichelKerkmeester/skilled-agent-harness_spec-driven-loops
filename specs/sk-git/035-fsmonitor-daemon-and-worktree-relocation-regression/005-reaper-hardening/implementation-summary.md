---
title: "Implementation Summary"
description: "The fsmonitor reaper no longer signals a recycled pid, ends the wrong daemon with git's stop, or ends a daemon of a worktree added mid-run, it can sweep daemons of deleted repositories on request, and the hook and launch git calls that read the index now time out and fail closed."
trigger_phrases:
  - "reaper hardening implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening"
    last_updated_at: "2026-10-27T22:15:15Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the permanent core.fsmonitor=false decision and closed the Known Limitations"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/bin/fsmonitor-daemon-reaper.sh"
      - ".skilled/scripts/git-hooks/lib/bounded-git.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-reaper-hardening |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The reaper now signals a pid only while it is still the daemon the run listed, and a daemon of a repository deleted with `rm -rf` can be found and ended on request. A wedged fsmonitor daemon now costs a commit, a push or a launch one timeout that refuses, instead of an open-ended hang. Nothing is committed.

### Phase 5: reaper-hardening

**Reaper.** Before every signal and every `stop`, the reaper compares the pid's command line and its start time with what the run listed. A pid that now runs another daemon prints `skipped ... reason=start-time-changed` and is left alone. Git's `stop` ends whichever daemon owns a worktree's socket, so the reaper uses it only when no other daemon watches that worktree; with two on one, it signals the chosen pid. Before a stray is ended, the worktree list is read again, and a worktree registered in the meantime keeps its daemon (`reason=registered-mid-run`). `--orphans` adds an `orphan` class for a daemon whose watched root is not a directory any more. A dry run lists it, `--orphans --apply` ends it by signal after checking the root once more, and without the flag nothing changes. `--orphans` cannot be combined with `--worktree`.

**Hooks and launcher.** `lib/bounded-git.sh` gives shell `git_bounded`, which runs git with `-c core.fsmonitor=false` under a 20 second bound (`SPECKIT_GIT_TIMEOUT` changes it). A timeout is written to a file in a per-run temp directory, and the hook's EXIT trap turns it into `BLOCKED [gate:git-timeout]` with exit 1, whatever the gate would have done with an empty answer. The bound sends SIGTERM and then SIGKILL after 3 seconds so git removes its index lock. With no `perl` on PATH the call runs unbounded, as before. 34 call lines now go through it: 25 in `pre-commit`, 2 in `pre-push`, 4 in the legacy `hooks/git/pre-commit`, 2 in the mass-deletion guard, and `worktree add` in `worktree-session.sh`, which gets 60 seconds (`SPECKIT_WORKTREE_ADD_TIMEOUT`) and fails the launch on a timeout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Modified | Start-time recheck, single-owner stop, fresh worktree list for strays, `--orphans` |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Modified | 35 new assertions, bounded real-daemon calls |
| `.skilled/scripts/git-hooks/lib/bounded-git.sh` | Created | `bounded_run`, `git_bounded`, timeout record and exit verdict |
| `.skilled/scripts/git-hooks/pre-commit` | Modified | 25 call lines bounded, exit trap |
| `.skilled/scripts/git-hooks/pre-push` | Modified | 2 call lines bounded, exit trap |
| `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` | Modified | Both counts through `git_bounded` |
| `.skilled/hooks/git/pre-commit` | Modified | Legacy helper: 4 call lines bounded |
| `.skilled/bin/worktree-session.sh` | Modified | `worktree add` bounded, fsmonitor off |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | Created | 36 assertions: helper, pre-commit and pre-push against a hanging `git` |
| `.skilled/bin/tests/worktree-session.test.sh` | Modified | 6 new assertions: healthy and hung `worktree add` |
| `.skilled/skills/sk-git/feature-catalog/session-lifecycle/fsmonitor-daemon-reaper.md` | Modified | New flag, class, skip reasons |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modified | One summary sentence |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/fsmonitor-daemon-reaper-scope-and-refusal.md` | Modified | Orphans and stale-state checks (GIT-047) |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md` | Modified | GIT-034: false line replaced by the catalog link |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/prepush-remote-permission-gate.md` | Modified | GIT-043: same |
| `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/spec.md` | Modified | Phase map row and handoff row for phase 5 |
| `.github/scripts/check-gate-inputs.sh` | Modified | The CI gate-input parser reads a `git_bounded` call as git, so the bounded `pre-push` pathspec stops failing parser-miss |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modified | Case 57: a bounded pathspec with both roots passes, and one without its twin fails filter-twins |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The existing suites ran first at HEAD, and every one passed. Each reaper fix then got its failing test before its code. The new reaper file, run against `git show HEAD:` of the reaper in a temp copy, failed 17 assertions. The new hook file, run against the HEAD `pre-commit`, `pre-push` and mass-deletion guard, failed 7, and the new launcher cases failed 4 against the HEAD `worktree-session.sh`. After the change every suite ran again. Nothing is committed or staged, and no git call in this run touched the checkout's index or config.

**Before and after, every suite run with `/bin/bash`:**

| Suite | HEAD | After |
|-------|------|-------|
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | PASS=126 | PASS=161 |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | new | PASS=36 |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | 145 | 145 |
| `.skilled/scripts/git-hooks/tests/pre-push.test.sh` | PASS=50 | PASS=50 |
| `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh` | PASS=15 | PASS=15 |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | PASS=45 | PASS=45 |
| `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | PASS=80 | PASS=80 |
| `.skilled/scripts/git-hooks/tests/mass-deletion-guard.test.sh` | 12 | 12 |
| `.skilled/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` | 9 | 9 |
| `.skilled/scripts/git-hooks/tests/gate-config.test.sh` | 25 | 25 |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | 60 | 60 |
| `.skilled/hooks/git/install-hooks.test.sh` | 4 | 4 |
| `.skilled/bin/tests/worktree-session.test.sh` | PASS=70 | PASS=76 |
| `.skilled/bin/tests/worktree-reaper.test.sh` | PASS=26 | PASS=26 |
| `.skilled/bin/tests/check-git-hooks.test.sh` | 4 | 4 |

**GIT-047, run as written in scratch repositories under `$TMPDIR`.** Every real-daemon call ran under a 30 to 60 second alarm so a wedged daemon could not hang the run; the commands are otherwise the playbook's.

Two runs. The first (scratch directory `tmp.v2YCij9mi7`) passed every step except the orphans check S2, which failed: the real daemon in the deleted repository exited by itself within a second, so there was nothing to list. A healthy daemon ends itself when its root is deleted; phase 003's leftovers were probably wedged ones that never read the delete event. The playbook check now freezes the daemon with `kill -STOP` before `rm -rf`, as a wedged one is, and the second run (`tmp.xJyJNJdoKw`) passed every step.

| Step | What ran | Result |
|------|----------|--------|
| 1 | Two scratch repos, `a` with a linked worktree `a-wt` | PASS |
| 2 | `git -c core.fsmonitor=true fsmonitor--daemon start` in `a`, `a-wt`, `b` | PASS, three `rc=0` |
| 3 | Reaper on `b`, filtered to `class=main` | PASS, named b's daemon pid |
| 4 | Dry run on `a` | PASS, `class=main worktree=main`, `class=keep worktree=<S>/a-wt`, b's pid `class=out-of-scope worktree=-`, `mode=dry-run signalled=0 total=8 stray=0`, `exit=0` |
| 5 | `sleep 120` parked in `a-wt` | PASS, blocker pid recorded |
| 6 | `--apply --worktree a-wt` | PASS, `refused worktree=<S>/a-wt blocker=<blocker pid>`, `mode=apply signalled=0`, `exit=0` |
| 7 | Dry run again, `ps` on b's pid | PASS, main and keep pids unchanged, b's daemon still `git fsmonitor--daemon run` |
| S1 | Kill the blocker, rerun step 6 | PASS, `ended pid=<keep pid> class=keep worktree=<S>/a-wt via=stop`, `signalled=1` |
| S2 | Frozen daemon in deleted repo `c`, `--orphans` dry run, then without the flag | PASS on run 2, FAIL on run 1 (see above): `class=orphan worktree=<S>/c`, `mode=dry-run signalled=0 total=8 stray=0 orphan=1`, `out-of-scope` without the flag |
| S3 | `--orphans --apply`, run only because the dry run listed one orphan, mine | PASS on run 2, `ended pid=<c pid> class=orphan worktree=<S>/c via=kill`, b's daemon still running; run 1 skipped it, nothing to end |
| S4 | `--orphans --worktree a-wt` | PASS, exit 2 naming `--orphans` |
| 8 | `git fsmonitor--daemon stop` on the three, then look for any daemon under the scratch directory | PASS, none left, scratch directory removed. The `a-wt` stop printed `fatal: fsmonitor--daemon is not running` because S1 had already ended it |

**`git status --porcelain` in this checkout, 5 runs each, 60 second cap, config untouched:**

| Mode | Runs (s) | Median | Max |
|------|----------|--------|-----|
| `-c core.fsmonitor=false` | 0.393, 0.282, 0.283, 0.269, 0.274 | 0.282 s | 0.393 s |
| `-c core.fsmonitor=true` | 60.096, 60.030, 60.028, 60.033, 60.022, every one killed at the 60 second cap (`rc=142`) | at least 60.03 s | at least 60.10 s, none returned |

With fsmonitor off, `git status --porcelain` here takes about a quarter of a second. With it on, none of the five calls returned in a minute, so this checkout's main daemon was wedged for the whole measurement. The runs left the checkout's `core.fsmonitor` setting as it was (`true` in `.git/config`).

**Daemon pids.** At the start of the task the daemon pids were 36337, 75028, 77720 and 96906. At the end they are 36337, 48204, 53544, 69827 and 96906. Pids 75028 and 77720 exited during the run, and 48204, 53544 and 69827 appeared; none of those five was started or signalled by this run. Every daemon this run started or ended was in a scratch directory: the stubs and one real daemon of the reaper suite, and the three GIT-047 daemons plus the frozen one. `ended` lines in the two GIT-047 transcripts name only scratch pids (97314, 46495, 51435). No daemon of this run or its scratch directories is alive. Two daemons of mine from early probing (one real daemon in a scratch repo, and its hung `git status` client) were ended by signalling their own pids, with the client first. The reaper's `--orphans --apply` runs in the suite saw only the suite's own stubs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the timeout in a file and read it in an EXIT trap | 25 hook call lines sit inside command and process substitutions, many followed by `|| true`, where an `exit` or a variable write is lost; one trap covers all of them |
| SIGTERM first, SIGKILL after 3 seconds, in the shared helper | `git add` writes the index lock, and a hard kill leaves it behind |
| Leave `perl` absent as unbounded rather than failing | A hook that errors on a host without `perl` breaks every commit there |
| Load the helper from the hook's own directory | The hooks run for every repository, and a repository controls its own `.skilled` tree |
| The reaper keeps its own copy of the bound | It is a standalone script other tools call by path, and its calls only read |
| `--orphans` rejects `--worktree` | One narrows the run to a registered worktree and the other ranges over daemons outside any repository |
| Tests filter the process list to their own stubs in the `--orphans` runs | `--orphans --apply` is machine-wide, and a test must never signal a stranger's daemon |
| Decide the stop by counting other daemons on the worktree, not by reading the socket owner | `lsof` shows the socket by its bare name for a daemon's own rows and finds no process when asked by path, so the owner cannot be read reliably |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | PASS=161 FAIL=0 |
| New reaper cases against `git show HEAD:` of the reaper | 17 FAIL |
| `/bin/bash .skilled/scripts/git-hooks/tests/bounded-git.test.sh` | PASS=36 FAIL=0 |
| The same file against the HEAD hooks and guard | PASS=29 FAIL=7 |
| New launcher cases against the HEAD `worktree-session.sh` | PASS=72 FAIL=4 |
| Fourteen other suites, before and after | Identical counts, each exits 0 |
| `bash -n` on the 10 changed shell files | exit 0 each |
| `shellcheck -S warning` on the same files | no output, exit 0 each |
| `check-comment-hygiene.sh` on the same files | exit 0 |
| GIT-047 as written | Every step PASS on the second run; one check (S2) FAILED on the first run for the reason above |
| `validate.sh <this folder> --strict` | `RESULT: PASSED`, Errors: 0, Warnings: 0 |
| `validate.sh <parent> --recursive` | `RESULT: PASSED` for the parent and each of the five children |
| `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` | `PASS package=sk-git ... violations=0 warnings=0`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The real-daemon case in the reaper suite needs a daemon that answers.** Phase 006 traced the earlier `via=term` failure: git's stop returned at once while the daemon lived on, and a fresh daemon in a clean scratch repo wedged the same way, so a longer stop bound changed nothing. The case now runs only when its daemon completes a bounded `git status`, and prints `SKIP` otherwise. It asserts that the reaper attributes and ends the daemon by either git's stop or the SIGTERM fallback, and prints a `NOTE` when the fallback ran, because git 2.50.1's stop can return while an answering daemon lives on. Accepted: the limit is git 2.50.1's own `stop`, which has no upstream fix, and the case skips rather than fails while the stub cases still cover the reaper's logic.
2. **`--orphans --apply` acts on the whole machine.** It ends every daemon whose root is gone, not just this repository's. Run the dry run first. A root on an unmounted volume also reads as missing. Accepted: the flag is opt-in, the dry run lists every orphan first, and the root is checked again just before each signal.
3. **A stranded client is invisible to the reaper.** Phase 003's item 1 described a `git commit` waiting on git's cookie wait, freed only by its caller's timeout. Resolved by the fsmonitor decision in `spec.md` section 10: with `core.fsmonitor=false` no git call in this checkout or its worktrees talks to a daemon, so none can be stranded on its cookie wait.
4. **Other `git` calls in the launcher and the hooks stay unbounded.** `rev-parse`, `config`, `symbolic-ref`, `cat-file` and `log` do not read the index, so they were left alone. `post-commit` has none that read it. Resolved by the same decision: with fsmonitor off, none of these calls can wait on a daemon.

The false catalog line in the eleven other playbook files, phase 003's stale Known Limitations items 2 and 4, and the README rows for `bounded-git.sh`, `--orphans`, `SPECKIT_GIT_TIMEOUT` and `SPECKIT_WORKTREE_ADD_TIMEOUT` were left open here and are done in phase 006.
<!-- /ANCHOR:limitations -->

---
