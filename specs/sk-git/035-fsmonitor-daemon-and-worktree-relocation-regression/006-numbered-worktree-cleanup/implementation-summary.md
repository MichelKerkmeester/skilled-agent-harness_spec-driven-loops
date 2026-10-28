---
title: "Implementation Summary"
description: "The worktree reaper can now remove finished numbered worktrees on request, a throttled session-start sweep runs it in the background, and every git call and process probe it makes is bounded and fails toward keeping."
trigger_phrases:
  - "numbered worktree cleanup implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/006-numbered-worktree-cleanup"
    last_updated_at: "2026-10-28T06:55:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed nine alignment findings in the reaper, its docs and the environment references"
    next_safe_action: "Operator commits the tree, then decides whether to widen the ignored-path allowlist"
    blockers: []
    key_files:
      - ".skilled/bin/worktree-reaper.sh"
      - ".skilled/bin/worktree-guard.sh"
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
| **Spec Folder** | 006-numbered-worktree-cleanup |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Finished numbered worktrees no longer pile up. `worktree-reaper.sh --numbered` removes a `worktrees/NNN-slug` worktree once its tree is clean, its branch is merged, nothing has touched it for 48 hours, no process works inside it and nothing irreplaceable is ignored in it. The SessionStart guard runs that sweep detached, at most once every six hours, and the doctor counts what a dry run would remove. Both lanes of the reaper also stopped trusting an empty process listing and stopped running unbounded git.

### Phase 6: numbered-worktree-cleanup

**Reaper.** Every keep rule fails toward keeping, and each prints its reason as a `numbered verdict=keep ... reason=...` row (`.skilled/bin/worktree-reaper.sh:362`). The order is: branch and folder form a numbered pair, not locked, newest of the branch reflog, the worktree's `logs/HEAD` and its index older than `--idle-hours`, branch an ancestor of the primary HEAD, no stash entry, empty `git status --porcelain --untracked-files=all`, every ignored path regenerable, and a complete process listing showing nobody inside. Removal runs the sibling fsmonitor reaper, then plain `git worktree remove` and `git branch -d` (`:280`). A refusal by either logs keep and the loop moves on. Unregistered `NNN-*` folders under the base print `orphan path=...` and are left alone (`:434`). The wrapper lane keeps its rules.

**Shared fixes.** The process probe is one bounded `lsof` listing, and an empty or timed-out listing prints `unknown`, which both lanes treat as busy (`:234`). Every git call goes through `git_bounded`, so fsmonitor is off and a hung call costs `SPECKIT_GIT_TIMEOUT` seconds. Records are read on fd 3 so no command in the loop can eat the list.

**Guard.** `worktree-guard.sh` writes `worktree-reaper-numbered.stamp` in the shared git directory and starts `worktree-reaper.sh --numbered` with `nohup` in a subshell, all descriptors redirected (`.skilled/bin/worktree-guard.sh:53`). It stops for `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_GUARD=off`, the shared kill-switch and orchestrated children. I also fixed a defect found on the way: outside a git repository the guard exited non-zero instead of 0, because `git rev-parse` failed inside an assignment under `set -e`.

**Doctor.** `numberedWorktreesDetail` (`.skilled/commands/doctor/scripts/git-setup-check.cjs:712`) runs `--numbered --dry-run` under a 45 second bound and adds one line to the worktrees row. It never changes the verdict.

**Docs and follow-ups.** Rule 17, the catalog entry (which wrongly said the reaper only touches `<repo>/.worktrees/`), GIT-034, the five READMEs, `.env.example`, the eleven playbook files with the false catalog line, and phase 003's Known Limitations items 2 and 4.

### Follow-up: regenerable ignored files and squash-merged branches

**Regenerable ignored files.** `worktree-provision-paths.txt` now carries `# regenerable: <path>` comments and the reaper reads each into its ignored-path allowlist (`.skilled/bin/worktree-reaper.sh:310`). Two files are listed. One is the sk-vision adapter bundle that sk-vision's build writes. The other is the spec-kit Node version stamp that the package's postinstall writes. Both are gitignored and both sat in nearly every worktree. No SQLite file and no `.state/` path is listed, because those can hold session state. The `specs/` refusal still runs first.

**Every other reader of the list skips the new lines.** The reaper, the provisioner (`worktree-naming.sh provision`, which the CI setup action also calls), the doctor's `readProvisionEntries` and the two list readers in `worktree-naming.test.sh` each skip a line that starts with `#`. The `# excluded:` lines already rode on the same rule. The CI action also hashes the list into its cache key, so the first CI run after this change misses the cache once.

**Squash-merged branches.** When a numbered branch is not an ancestor of the live tip, the reaper merges it into the tip in memory with `git merge-tree --write-tree --no-messages` and compares the resulting tree with the tip's tree (`:365`). Equal trees mean every change the branch made is already in the live branch, and the keep reason reads `branch content already in the live branch (squash-merged); remove by hand`. A conflict (exit 1), any other error and a timeout all count as unmerged, and the old reason stays. The reaper still never removes such a worktree. The in-memory merge first wrote an unreachable tree object into the object store, including under `--dry-run`. The alignment follow-up below moved that merge into a throwaway object directory, so it now writes nothing to the repository and changes no ref, worktree or registry entry.

**Docs.** Rule 17 of `SKILL.md` records that a session-start sweep runs the numbered reaper at most every 6 hours and that `SPECKIT_WORKTREE_AUTOREAP=0` stops it (checked against `worktree-guard.sh`, window 21600 seconds). The file stays at its word count by trimming 13 words from rule 17's own phrasing and from the launch-wrapper paragraph, where the same fact about strict validation on `main` is stated in the next paragraph. The catalog entry and the `.skilled/bin/README.md` row describe both changes. The sk-git changelog gained `v1.11.1.0`, `SKILL.md` moved to that version and the Hermes copy was synced.

### Follow-up: alignment findings

Nine findings from two alignment runs were each checked against the code before any change. All nine held. The reaper fixes each came with a failing case first.

**Unreadable registry.** `_worktree_records` used to pipe `git worktree list` straight into `awk` and was read through process substitution, so a failed or timed-out listing looked like a registry with no worktrees. The socket and marker cleanup then treated every worktree outside the configured base as gone and deleted its session marker and socket directory. `_worktree_records` now reads the listing first and returns git's status. The main loop, the orphan report and both cleanup loops are skipped when the read fails, and the log says `worktree registry could not be read`. The run still exits 0.

**Partial process listing.** `_busy_pid_in` trusted a non-empty `lsof` listing with any exit other than the 142 timeout. It now treats every non-zero exit as unknown, so a listing that printed rows and then failed keeps the worktree in both lanes. `lsof -nP -d cwd -Fpn` and its `-a` form each exit 0 with no stderr on this host (three runs, 562 processes listed), so the stricter rule keeps nothing here that it did not keep before. A host whose `lsof` exits 1 on every run, for example Linux with a stale FUSE mount, would keep every worktree with `process listing unavailable`, which is the safe direction and is visible in the sweep log.

**Writes during a dry run.** `git merge-tree --write-tree` stores the merged tree and any conflict blobs as real objects. `_branch_content_in_live` now runs it with `GIT_OBJECT_DIRECTORY` pointing at a `mktemp -d` directory and `GIT_ALTERNATE_OBJECT_DIRECTORIES` pointing at the repository's own objects, then deletes the directory. The squash-merged fixture alone could not show this, because its merged tree equals the live tree and so already exists. The unmerged branch `006-unpushed` and the colliding branch `017-conflict` do write, so the case compares `git count-objects -v` across a dry run of the whole fixture. A repository with its own `objects/info/alternates` also works, checked in a shared clone.

**State files in rebuildable folders.** `_ignored_is_regenerable` accepted any ignored path with a `node_modules`, `dist`, `build` or cache component, and git reports a wholly ignored folder as one entry, so `dist/session.sqlite` never reached the check. The function now refuses `*.sqlite`, `*.sqlite3`, `*.db`, `*-wal`, `*-shm` and `.state` as a component first, and searches a wholly ignored folder for those names before its own name can vouch for it. The search includes `node_modules`. None of this repository's `node_modules` trees holds such a file, and a package that ships one would keep its worktree, which is the safe direction.

**Docs and settings.** The catalog entry, the catalog summary and the bin README row describe the four behaviors. GIT-034 gained a numbered-lane paragraph with a rebuildable-file worktree, an unlisted-file worktree, a database under `dist` and a squash-merged branch, and a scratch repository run printed every signal it names. The doctor workflow's worktrees leg names the numbered worktrees line. The environment reference gained seven rows (`SPECKIT_WORKTREE_BASE`, `SPECKIT_GIT_TIMEOUT`, `SPECKIT_WORKTREE_ADD_TIMEOUT`, `SPECKIT_FSMON_REAPER`, `SPECKIT_WORKTREE_REAPER`, `FSMON_PROBE_TIMEOUT` in the worktree rows and `SPECKIT_PRIVATE_SKILL_ROOTS` in the skill-advisor table). The finding named six of them, and the seventh, `SPECKIT_WORKTREE_REAPER`, is in the first finding's text and is read by the guard and the doctor. The recount found the stated total already one low from an earlier row, so it moved from 189 to 197 (201 with the four governing-variable names). `GIT_BOUND_SECONDS` is the launcher's internal per-call override, set by `worktree-session.sh` from `SPECKIT_WORKTREE_ADD_TIMEOUT` and by the tests, so the lib README now says it is internal and `.env.example` still omits it. `check-env-tokens.cjs` offers only a platform-token list and test-file globs in `surface-map.yaml`, neither of which marks a variable internal, so it was left alone and still reports `GIT_BOUND_SECONDS` and `WORKTREE_REAPER_NOW`. The v4.0.0.16 notes, which no tag contains, gained a Git Worktrees entry for the sweep, its switch, the rebuildable-file rule and the squash-merged reason. sk-git moved to `v1.11.2.0` and the Hermes copy was synced.

**Alignment follow-up files**

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/worktree-reaper.sh` | Modified | Registry read keeps git's status, any non-zero `lsof` exit is unknown, scratch object directory, state-name refusal |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Modified | 33 new assertions and two fixtures (`018-sqlite-dist`, `019-state-cache`) |
| `.skilled/bin/README.md` | Modified | Reaper row names the failed listing, the unreadable registry and the state-file rule |
| `.skilled/skills/sk-git/feature-catalog/session-lifecycle/worktree-reaper.md`, `feature-catalog/feature-catalog.md` | Modified | The four behaviors, and the removed claim that a dry run may write a tree |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md` | Modified | Rebuildable-file, state-file and squash-merged signals for GIT-034 |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | The worktrees leg names the numbered worktrees line |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Seven rows and the recounted totals |
| `.skilled/scripts/git-hooks/lib/README.md` | Modified | `GIT_BOUND_SECONDS` marked internal |
| `.skilled/changelog/skilled/v4.0.0.16.md` | Modified | Numbered sweep in the Git Worktrees section |
| `.skilled/skills/sk-git/changelog/v1.11.2.0.md`, `.skilled/skills/sk-git/SKILL.md`, `.hermes/skills/sk-git/SKILL.md` | Created, modified | Release entry, version 1.11.2.0 and the synced copy |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/worktree-reaper.sh` | Modified | Numbered lane, orphan report, bounded probe and git, refusal handling, `# regenerable:` allowlist, squash-merge check |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Modified | 63 new assertions: empty-listing wrapper case and the numbered fixture. 13 more for the regenerable files and the squash-merged branch |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modified | Two `# regenerable:` lines and the comment that explains them |
| `.skilled/bin/worktree-guard.sh` | Modified | Throttled detached sweep, switch, non-git exit fix |
| `.skilled/bin/tests/worktree-guard.test.sh` | Created | 17 assertions |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | `numbered worktrees:` line |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | 3 new cases |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Modified | Real-daemon case runs only for a daemon that completes a status round trip |
| `.skilled/skills/sk-git/SKILL.md` | Modified | Rule 17, then the sweep sentence and 13 words trimmed (SKILL.md is at the 5000 word limit), version 1.11.1.0 |
| `.skilled/skills/sk-git/changelog/v1.11.1.0.md` | Created | Release entry for the follow-up |
| `.hermes/skills/sk-git/SKILL.md` | Modified | Hermes copy synced from `SKILL.md` |
| `.skilled/skills/sk-git/README.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/session-lifecycle/worktree-reaper.md` | Modified | Numbered lane, bounded calls, sweep, registry-based claim |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modified | Cross-reference row for the guard test |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/` (12 files) | Modified | GIT-034 numbered dry run; catalog link in 11 files |
| `.skilled/bin/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/scripts/git-hooks/lib/README.md`, `.skilled/scripts/git-hooks/tests/README.md`, `.skilled/hooks/git/README.md` | Modified | Phase 005's listed rows plus the numbered lane |
| `.env.example` | Modified | `SPECKIT_WORKTREE_AUTOREAP`, `SPECKIT_WORKTREE_REAPER`, `SPECKIT_GIT_TIMEOUT`, `SPECKIT_WORKTREE_ADD_TIMEOUT` |
| `specs/sk-git/035-.../003-fsmonitor-daemon-lifecycle/implementation-summary.md` | Modified | Items 2 and 4 point at phase 005 |
| `specs/sk-git/035-.../spec.md` | Modified | Phase 6 map row and handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every suite ran at HEAD first. The new reaper and guard tests were written before the code, and then run against `git show HEAD:` copies of the HEAD scripts placed in a temp tree beside the new tests. Every removal in a test ran in a scratch repository under `$TMPDIR`. The only run against this repository was `--numbered --dry-run`.

**Before and after, every suite run with `/bin/bash` or `node --test`:**

| Suite | HEAD | After |
|-------|------|-------|
| `.skilled/bin/tests/worktree-reaper.test.sh` | PASS=26 FAIL=0, exit 0 | PASS=89 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-guard.test.sh` | new | PASS=17 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-session.test.sh` | PASS=76 FAIL=0, exit 0 | PASS=76 FAIL=0, exit 0 |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | PASS=36 FAIL=0, exit 0 | PASS=36 FAIL=0, exit 0 |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | 74 pass, 0 fail, exit 0 | 77 pass, 0 fail, exit 0 |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | PASS=160 FAIL=1, exit 1 (real-daemon case, 1 clean run; a first run with a global fsmonitor override failed the same case) | PASS=159 FAIL=0, exit 0 (3 of 3 runs; the real-daemon case printed SKIP in each) |

**Failing first.** Against the HEAD reaper the new reaper file prints `PASS=57 FAIL=32` (exit 1): the numbered flag is unknown (`unknown flag: --numbered`, exit 2) and the HEAD wrapper lane removes a qualifying worktree when `lsof` prints nothing. Against the HEAD guard the new guard file prints `PASS=3 FAIL=14`. Against the HEAD doctor module, the three new cases each print `not ok`.

**Live dry run.** `bash .skilled/bin/worktree-reaper.sh --numbered --dry-run` in this repository exited 0 in about 1.4 seconds. The hashes of `git worktree list --porcelain` and `git for-each-ref` were equal before and after. All 11 numbered worktrees print `keep ... reason=active within the last 48 hours`. To see the rules behind the idle test, the same command with `WORKTREE_REAPER_NOW` set 30 days ahead (still a dry run, hashes equal) prints, per worktree: 217, 145, 232, 239 and 240 not merged into the live branch; 218, 234, 236 and 237 uncommitted or untracked files; 235 and 238 an ignored path that is not regenerable, `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js`. Nothing in this repository would be removed today.

**README checks (`check_readme_references.py` unresolved / `check_derived_readme_counts.py` failures), before and after:**

| README | Before | After |
|--------|--------|-------|
| `.skilled/bin/README.md` | 0 / 1 | 0 / 1 |
| `.skilled/scripts/git-hooks/lib/README.md` | 2 / 0 | 2 / 0 |
| `.skilled/scripts/git-hooks/README.md` | 5 / 0 | 6 / 0 |
| `.skilled/scripts/git-hooks/tests/README.md` | 0 / 0 | 0 / 0 |
| `.skilled/hooks/git/README.md` | 4 / 0 | 4 / 0 |
| `.skilled/skills/sk-git/README.md` | 0 / 0 | 0 / 0 |

The one new unresolved reference is the `bounded-git.sh` line in the git-hooks tree. The checker resolves tree names against `git ls-files`, and the file is still untracked. With a scratch copy of the index that lists it (the real index was not touched) the count returns to 5. The pre-existing failures are not caused by this phase.

**Item 10, the real-daemon assertion.** The cause was not the suite's 2 second stop bound. A trace of a failing run showed git's `stop` returning at once and the daemon still alive after the reaper's one second wait. Raising `FSMON_STOP_TIMEOUT` to 30 seconds, and then adding a 15 second post-stop wait, left the case failing, so both were backed out. Separately, a fresh daemon in a clean scratch repository left `git status` waiting for over three minutes and survived `git fsmonitor--daemon stop` ("fsmonitor--daemon is not running"); it had to be ended by its pid. That is the wedge the parent packet describes, and the reaper's SIGTERM fallback (`via=term`) is the right response to it. The case now runs only when the real daemon completes a bounded `git status --porcelain` round trip, kills the daemon it started and prints `SKIP` otherwise, so a daemon that answers and is not ended by git's stop still fails. In three consecutive runs after the change, every one printed `SKIP` for that case on this loaded host (PASS=159 FAIL=0), so the `via=stop` path had no real-daemon coverage here; a quiet host runs it. I could not show the case passing on this host.
**Follow-up before and after.** Reaper cases were written first and run against the unchanged reaper and list.

| Suite | Before | After |
|-------|--------|-------|
| `.skilled/bin/tests/worktree-reaper.test.sh` | PASS=89 FAIL=0, exit 0 | PASS=102 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-guard.test.sh` | PASS=17 FAIL=0, exit 0 | PASS=17 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-session.test.sh` | PASS=76 FAIL=0, exit 0 | PASS=76 FAIL=0, exit 0 |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | 77 pass, 0 fail | 77 pass, 0 fail, exit 0 |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | not run before | PASS=171 FAIL=0, exit 0 (it reads the edited list in two places and its assertions did not change) |

**Failing first.** With the 13 new assertions in place and the reaper and list unchanged, the reaper suite printed `PASS=96 FAIL=6` and exited 1. The six failures were the would-reap row for `014-regen`, its folder and branch removal, the reason for `015-regen-mixed`, the reason for `016-squashed` and the missing `merge-tree` call in the git shim log. The collision case `017-conflict` passed before the change, as it should, because a colliding branch was always reported as unmerged. The `006-unpushed` fixture commit became a real file change, because an empty commit adds nothing and now counts as already merged.

**Alignment follow-up before and after.** The cases were written first and run against the unmodified reaper.

| Suite | Before | After |
|-------|--------|-------|
| `.skilled/bin/tests/worktree-reaper.test.sh` | PASS=102 FAIL=0, exit 0 | PASS=135 FAIL=0, exit 0 (PASS=110 FAIL=25, exit 1, against the unmodified reaper with the new cases) |
| `.skilled/bin/tests/worktree-guard.test.sh` | PASS=17 FAIL=0, exit 0 | PASS=17 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-session.test.sh` | PASS=76 FAIL=0, exit 0 | PASS=76 FAIL=0, exit 0 |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | PASS=36 FAIL=0, exit 0 | PASS=36 FAIL=0, exit 0 |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | 77 pass, 0 fail, exit 0 | 77 pass, 0 fail, exit 0 |

Of the 25 failures against the unmodified reaper, 20 are new assertions: the partial listing in both lanes, the registry cases in both lanes and both modes, the object store, and the two state fixtures. The other 5 are older assertions for `rt-a` and `rt-child`, which fail only because the unmodified reaper, handed the partial listing, had already removed both worktrees before the main run reached them.

**Alignment follow-up live runs.** `worktree-reaper.sh --numbered --dry-run` in this repository exited 0 in about 0.7 seconds. The hashes of `git count-objects -v`, `git worktree list --porcelain` and `git for-each-ref` were equal before and after. It printed 6 verdict rows, all `active within the last 48 hours`. With `WORKTREE_REAPER_NOW` set 30 days ahead (still a dry run, 5.6 seconds) it reached the squash check and the ignored-folder search and printed 217, 145 and 251 not merged into the live branch and 218, 252 and 253 uncommitted or untracked files. The three hashes were equal again, and no `worktree-reaper-objects.*` directory was left in `$TMPDIR`. No real worktree is squash-merged or state-holding today, so those two reasons are proven in the scratch fixture and in the scratch repository run of the GIT-034 fixture only.

**README checks, alignment follow-up (`check_readme_references.py` unresolved / `check_derived_readme_counts.py` failures).**

| README | Before | After |
|--------|--------|-------|
| `.skilled/bin/README.md` | 0 / 0 | 0 / 0 |
| `.skilled/scripts/git-hooks/lib/README.md` | 2 / 0 | 2 / 0 |

The two unresolved references in the lib README (`refs/autostash-rescue/` and `tests/gate-config.test.sh`) are older than this phase.

**Readers of the list.** Run over the edited list, `worktree-naming.sh provision` in a scratch tree warned 14 times for the 14 package lines and never for a directive. With one plain extra line appended it warned 15 times, so the count can tell. The doctor's worktrees row listed the same 14 entries and no directive, and the check passed. `worktree-naming.test.sh` passed.

**Live dry run.** `worktree-reaper.sh --numbered --dry-run` exited 0 in about 1.2 seconds. The hashes of `git worktree list --porcelain` and `git for-each-ref` were equal before and after, for that run and for a second run with `WORKTREE_REAPER_NOW` set 30 days ahead. The first run printed 14 numbered verdict rows, all `keep ... reason=active within the last 48 hours`. The 30 day run printed: 217 and 145 not merged (a trial merge of each exits 1 and each is 6 and 9 commits ahead of the live tip), 218, 237, 240, 241 and 243 uncommitted or untracked files, 232, 234, 236 and 244 an ignored `.skilled/skills/.state/` file (a SQLite lease or a JSON generation file), and 235, 238 and 242 would be reaped. 235 and 238 were blocked before this change by `sk-vision.js`. No real worktree is squash-merged today, so that reason is proven in the scratch fixture only. Worktree 239 was detached during those two runs and printed no verdict row, as detached worktrees are report-only. A third run at the end, after another session had put 239 on its branch, printed 15 rows, all `active within the last 48 hours`, with the registry and ref hashes again equal before and after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Idle time is the newest of the branch reflog, the worktree's `logs/HEAD` and its index file, read before `git status` | Each catches a different activity (commit, checkout, edit), and `git status` can rewrite the index and make every worktree look fresh |
| The ignored-path allowlist is by path component, with `specs/` refused first and then every SQLite name and `.state` | A nested `node_modules` is as regenerable as a top-level one, an ignored spec file can never be rebuilt, and no folder name makes a database rebuildable |
| One `lsof` listing per surviving candidate | The process check runs last, so a process that started during the earlier checks is seen |
| The stamp is written before the sweep is spawned | A git directory that cannot be written then spawns nothing, rather than a sweep on every start |
| The doctor reads stdout rows, not log lines | The rows are a stable contract; the stderr text is for people |
| The real-daemon case skips a daemon that fails a status round trip instead of lengthening a bound | Two longer bounds were tried and neither changed the outcome; the cause is a wedged daemon |
| Rule 17 states the lane in about 80 words | `SKILL.md` is at the 5000 word limit its validator enforces, so the detail lives in the catalog entry |
| Regenerable files are `# regenerable:` comments in the existing list, not a second file or an option | Every other reader already skips comments, and the `# excluded:` lines set the precedent, so no reader needed a change |
| Squash detection compares a trial merge tree with the live tip's tree | It needs no patch matching and no extra option, and a conflict or error falls back to the old unmerged reason |
| The trial merge runs in a throwaway object directory | `merge-tree --write-tree` writes real objects, and a dry run must change nothing. Reading through to the repository's objects keeps the merge exact |
| Any non-zero `lsof` exit is an unknown listing | Rows without a clean exit do not prove the process list was complete. The rule costs nothing on this host, where `lsof` exits 0 |
| An unreadable registry skips the verdicts, the orphan report and the cleanup | Every one of them reads an empty list as "nothing exists", and the cleanup deletes on that reading |
| `GIT_BOUND_SECONDS` stays internal and out of `.env.example` | Only the launcher and the tests set it, and `SPECKIT_GIT_TIMEOUT` is the operator's setting |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reaper, guard, session, bounded-git suites and the doctor file | PASS=89, PASS=17, PASS=76, PASS=36, 77 pass; each exit 0 |
| New cases against HEAD copies | reaper PASS=57 FAIL=32, guard PASS=3 FAIL=14, doctor 3 of 3 `not ok` |
| `bash -n` and `shellcheck -x` on the 6 changed shell files | exit 0 each, no output |
| `rg` for phase, task or requirement ids in the changed scripts | no match |
| `worktree-reaper.sh --numbered --dry-run` against this repository | exit 0, registry and refs unchanged, 11 verdict rows |
| `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` | `PASS package=sk-git ... violations=0 warnings=0`, exit 0 |
| `validate_skill_package.py .skilled/skills/sk-git` | exit 0 (`package_skill.py --check: PASS`) |
| `validate.sh <this folder> --strict` | `RESULT: PASSED`, Errors: 0, Warnings: 0 (after `repair-derived.cjs --apply` on derived drift) |
| Follow-up: reaper, guard, session suites, doctor file, naming suite | PASS=102, PASS=17, PASS=76, 77 pass, PASS=171; each exit 0 |
| Follow-up: new reaper cases against the unchanged reaper | `PASS=96 FAIL=6`, exit 1 |
| Follow-up: `bash -n` and `shellcheck -x` on the reaper and its test | exit 0 each, run from the file's own directory |
| Follow-up: `validate_skill_package.py`, `validate_document.py` on the entry, `SKILL.md`, the catalog entry and the bin README, `frontmatter-version.mjs verify --skill sk-git`, `sync-skills-hermes.cjs --check` | exit 0 each, `Total issues: 0`, `ok=84`, `PASS: 67 Hermes skill copies in sync` |
| Alignment follow-up: reaper, guard, session, bounded-git suites and the doctor file | PASS=135, PASS=17, PASS=76, PASS=36, 77 pass, 0 fail, exit 0; each exit 0 |
| Alignment follow-up: new reaper cases against the unmodified reaper | `PASS=110 FAIL=25`, exit 1 |
| Alignment follow-up: `bash -n` and `shellcheck -x -P .skilled/bin` on the reaper and its test | exit 0 each, no output |
| Alignment follow-up: `rg` for phase, task, requirement or check ids in the reaper and its test | no match |
| Alignment follow-up: live `--numbered --dry-run`, now and 30 days ahead | exit 0, object, registry and ref hashes equal before and after each |
| Alignment follow-up: `validate-playbook-package.cjs`, `validate_skill_package.py`, `frontmatter-version.mjs verify --skill sk-git`, `validate_document.py` on the new entry, the notes, the catalog entry and both READMEs, `sync-skills-hermes.cjs --check`, `env-reference-drift.vitest.ts` | `violations=0`, exit 0, `ok=84`, `Total issues: 0`, `PASS: 67 Hermes skill copies in sync`, 5 passed |
| `validate.sh <parent> --recursive` | `RESULT: PASSED` seven times (the parent and its six children), after `repair-derived.cjs --apply` on the parent and on phase 003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The allowlist still keeps some real worktrees here.** The sk-vision bundle and the Node version stamp are now listed, but four worktrees hold `.skilled/skills/.state/` files (a SQLite lease and a JSON generation file) and stay kept on purpose, because session state can hold work. Any other rebuildable file takes one `# regenerable: <path>` line in `worktree-provision-paths.txt`.
2. **A squash-merged branch is never removed.** The reaper now says the branch was squash-merged and leaves removal to the operator. A squash merge followed by a later edit to the same lines in the live branch makes the trial merge conflict, so the branch reads as unmerged. A branch that adds nothing, such as one empty commit, also reads as squash-merged.
3. **`bounded-git.sh` and the new guard test were untracked when this phase was built.** Resolved: both were committed with it in `710888eb15` and are tracked. The reaper still falls back to an unbounded call with fsmonitor off if the library is ever missing.
4. **Phase 005's documents are stale in places this phase fixed and did not edit.** Its Known Limitations items 1, 4 and 6 and the "README changes recommended, not made" table describe work done here.
5. **The real-daemon case can skip.** On a host where fresh daemons wedge it prints `SKIP` and the reaper's `via=stop` path then has no real-daemon coverage in that run. A wedged daemon can also outlive the case even after the SIGTERM the skip branch sends: one such daemon, watching a deleted scratch repository, was found after the runs and ended by hand by its pid.
6. **Resolved by the alignment follow-up:** `ENV-REFERENCE.md` now has a row for `SPECKIT_WORKTREE_AUTOREAP` and for the other worktree and git timeout settings.
7. **A host whose `lsof` exits non-zero on every run keeps every worktree.** The reaper prints `process listing unavailable` for each, which is the safe direction. This host exits 0.
8. **A database or `.state` folder anywhere inside `node_modules` keeps its worktree.** The search for state names includes `node_modules`, and a package that ships a `*.db` file would trigger it. None in this repository does.
9. **`check-env-tokens.cjs` still reports `GIT_BOUND_SECONDS` and `WORKTREE_REAPER_NOW`.** Both are internal (a per-call override and a test clock), and the script has no way to mark a variable internal, so each run needs a reviewer to dismiss them.
<!-- /ANCHOR:limitations -->

---
