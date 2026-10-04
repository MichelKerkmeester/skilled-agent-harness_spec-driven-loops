---
title: "Tasks: Doctor update fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor update fix tasks"
  - "release-update engine tasks"
  - "doctor update verification checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor update fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Build one phase at a time in this order: A, B, C, D. Each phase block in Phase 2 lists its tasks, and Phase 3 holds that phase's verification checklist. Do not start a phase until the previous phase's checklist passes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the inputs before the first edit of a phase (`../005-doctor-update-research/research/research.md`, `plan.md`)
  - Read the research.md Section 11 entry for every finding in your phase, the verdict table and decisions in `plan.md` Section 3, and every file your phase's tasks name.
  - Line numbers in this file cite commit `506bc5a10c`. Earlier phases move them. Find code by its function name. If the code does not match a brief, stop and report the mismatch instead of guessing.
- [x] T002 Capture the baseline at the start of each phase (`.skilled/commands/doctor/scripts/tests/`)
  - Run `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` and record the `tests`, `pass` and `fail` lines and the exit status. On 2026-10-03 it reported 56, 56, 0, exit 0, in 91 seconds.
  - Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` and record its last two lines and exit status. On 2026-10-03 it reported 8 suites passed, 0 failed, exit 0, with 183 node:test tests across 9 files.
- [x] T003 Follow these rules in every phase (all files below)
  - Never put a finding id (such as DU-01), a spec path, a packet number, a phase number or a phase letter into a code comment, a test name, an error message or a YAML comment. Keep the durable reason instead.
  - Follow `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/javascript-checklist.md`: keep the box header and `'use strict'`, keep the numbered ALL-CAPS sections, use camelCase function names, write comments that explain why, never commit commented-out code, and keep the `[release-update]` log prefix.
  - Run engine commands only inside throwaway fixtures made by the suite's helpers. Never run `align`, `apply`, `rollback`, `record-base` or `unlock` against this repository.
  - Every new engine test must fail against the old engine. Prove it once per phase with the fail-first recipe in `plan.md` Section 5, and never use `git stash`.
  - Keep every existing assertion except the three that REQ-001 names. Keep the message prefixes `apply lock already exists: .skilled/release/.apply.lock` and `target has staged or unstaged changes against HEAD: ` because existing tests match them.
  - Keep each workflow YAML parseable by PyYAML, and keep each presentation template inside a fenced `text` block like its neighbours.
  - Run a single engine test with `node --test --test-name-pattern "<part of its name>" .skilled/commands/doctor/scripts/tests/release-update.test.cjs`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: engine integrity (DU-01, DU-15, engine half of DU-02)

- [x] T010 DU-01 and DU-15: apply a decided unit only when every file that would change has an operator decision (`.skilled/commands/doctor/scripts/release-update.cjs`, `prepareWrites` at lines 1664-1773, non-update branch at 1691-1719)
  - Add a helper `isOperatorDecision(record)` in section 8 next to `prepareWrites`. It returns true for a non-empty string record, which older runs stored, and for an object whose `decision` is a string and whose `source` is not `'prefilled'`. Give it a WHY comment: a prefilled record is the engine's own suggestion, and the align workflow requires the operator to confirm every file through decide.
  - In the non-update branch, build the decided list from operator decisions only: `fileEntries.filter((file) => isOperatorDecision(decided[file.path]))`. When it is empty, push `{ unit: key, reason: 'no decisions' }` and continue, as today.
  - Then collect `undecided`, the paths of `fileEntries` whose `class` is `take-release` or `conflict` and that have no operator decision. When it is not empty, push `{ unit: key, reason: 'undecided files', paths: undecided }` and continue before any write, ledger row or `appliedUnits.add`. Give it a WHY comment: applying a unit records the release as its base, so an undecided file would lose its release change without a trace.
  - Otherwise loop over the operator-decided files exactly as lines 1697-1717 do today.
  - Leave align's prefill at lines 1277-1279 unchanged. It stays a visible suggestion.
  - In `doctor-update-align.yaml` `phase_5_summary_handoff.summarize`, define an unresolved file: a `take-release` or `conflict` file of a customized, conflict or removed unit that is not deferred and has no decide record, where a prefilled record counts as unresolved. Change `handoff` to offer `/doctor:update apply --decisions=<runDir>/decisions.json` only when no file is unresolved, and to say that apply skips a unit with an unresolved file.
  - In `doctor-update-apply.yaml` `phase_2_engine_dry_run.checks`, add: "Show each skipped unit with its reason, and for reason undecided files list its paths."
  - In `doctor-update-presentation.txt` line 200, change the skipped line to `Skipped units: [unit and reason, with the paths for undecided files, or none]`.
  - Test, new, in section 5: `apply skips a unit whose changing files are only partly decided and keeps its base`. Use `makePair` with base files `.skilled/skills/hub-a/SKILL.md` (`# hub-a\n`), `.skilled/skills/hub-a/references/a.md` (`base a\n`) and `.skilled/skills/hub-a/references/b.md` (`base b\n`), and release changes `a.md` to `release a\n` and `b.md` to `release b\n`. In the operator clone write `a.md` as `operator a\n`, commit, then call `ignoreRuns`. Align, decide only `a.md` as `keep-local`, then `apply --decisions <run>/decisions.json`. Assert exit 0, a skipped entry deep-equal to `{ unit: 'skill:hub-a', reason: 'undecided files', paths: ['.skilled/skills/hub-a/references/b.md'] }`, `b.md` still `base b\n`, no `skill:hub-a` key in `.skilled/release/base.json`, and no `.skilled/release/divergence.json`. Commit, run `check`, and assert `skill:hub-a` is `conflict` and `b.md` is `take-release`. Then align a second run, decide only `b.md` as `adopt-release`, apply it, and assert the skipped entry names `a.md` and `b.md` is still `base b\n`.
  - Test, rewritten: rename `apply leaves customized-unit release files alone unless a decisions file is named` (`release-update.test.cjs:822-839`) to `apply writes a customized unit only after decide records its release files`. Keep its first half. In the second half, after align, run `apply --decisions <path> --dry-run` and assert the skipped list holds `{ unit: 'skill:hub-b', reason: 'no decisions' }` and no write targets `HUB_B_RELEASE_FILE`. Then decide `HUB_B_RELEASE_FILE` as `adopt-release`, apply with `--decisions`, and assert exit 0 and the file reads `release-managed\n`.
  - Run: `node --test --test-name-pattern "partly decided|only after decide" .skilled/commands/doctor/scripts/tests/release-update.test.cjs`.

- [x] T011 DU-02: record the lock owner, report a stale lock with its recovery, and add `unlock` (`release-update.cjs`, `acquireLock` 1775-1795, `applyPlan` 1834-1836, `rollbackPlan` 2035, `COMMAND_OPTIONS` 45-59, `COMMAND_PURPOSES` 61-68, `runCommand` 2143-2175)
  - Change `acquireLock(repo)` to `acquireLock(repo, owner)` and write `{ pid, startedAt, command: owner.command, runDir: owner.runDir || null }`. Call it with `{ command: 'apply', runDir: run.runDir }` in `applyPlan` and `{ command: 'rollback', runDir: run.runDir }` in `rollbackPlan`.
  - Add `processRunning(pid)`. It calls `process.kill(pid, 0)` and returns true when that returns or throws `EPERM`, and false for any other error such as `ESRCH`.
  - Add `readLockState(repo)`. It returns `{ state: 'absent', owner: null }` when the lock file does not exist. It parses the file as JSON. When parsing fails or `pid` is not a positive integer it returns `{ state: 'unknown', owner }`, with `owner` null when parsing failed. Otherwise it returns `{ state: processRunning(pid) ? 'live' : 'stale', owner }`.
  - Add `lockConflictError(repo)`, which returns an `Error` built from `readLockState`. Every message starts with `apply lock already exists: .skilled/release/.apply.lock`. A live owner adds `, held by running process <pid> (<command>), so wait for it to finish`. An unknown owner adds `, and it has no readable owner, so confirm that no apply, rollback or record-base is running before removing it by hand`. A stale owner adds `, and it is stale because process <pid> (<command>, started <startedAt>) is no longer running. Clear it with node .skilled/commands/doctor/scripts/release-update.cjs unlock`, and, when `owner.runDir` holds `rollback.json`, also `, then restore the interrupted run with <rollbackCommand(repo, owner.runDir)>`.
  - Throw `lockConflictError(repo)` in `applyPlan`'s pre-check (replace lines 1834-1836) and in `acquireLock`'s `EEXIST` branch (replace line 1782).
  - Add the subcommand `unlock`: `COMMAND_OPTIONS.unlock = new Set(['repo', 'json', 'dry-run'])`, purpose `Remove an apply lock whose owner process is no longer running.`, and a `runCommand` branch that calls a new `unlockStale(repo, options)`. It returns `{ command: 'unlock', dryRun, lock: <state>, owner, removable: <state is stale>, removed, runDir: <owner.runDir or null>, rollbackRecorded, rollback }`. `rollbackRecorded` is true when `runDir` holds `rollback.json`, false when `runDir` is set without one, and null when there is no `runDir`. `rollback` is `rollbackCommand(repo, runDir)` when `rollbackRecorded` is true, else null. An absent lock returns with `removed: false`. A dry run returns for every state without removing anything. A stale lock is removed with `fs.rmSync` and returns `removed: true`. A live or unknown lock throws `lockConflictError(repo)`, so the command exits 1. Give `unlockStale` a WHY comment: only a lock whose owner is gone may be removed, never a running or unreadable owner's.
  - Add `deferSignals()`. It registers one no-op listener each for `SIGINT`, `SIGTERM` and `SIGHUP` and returns a function that removes exactly those three listeners. Give it a WHY comment: Node runs no finally block when a signal ends the process by default, so while the lock is held a listener lets the synchronous command finish and its finally block remove the lock, and only SIGKILL or power loss can still strand it, which unlock recovers.
  - In `applyPlan` call `const restoreSignals = deferSignals()` right before `acquireLock`. If `acquireLock` throws, call `restoreSignals()` and rethrow. In the `finally` at lines 1903-1905, call `restoreSignals()` after the lock file is removed. Do the same around lines 2035-2059 in `rollbackPlan`.
  - In `doctor-update-apply.yaml` line 126, replace the guarantee with: "Release the lock in the engine finally path on every exit after acquisition. SIGINT, SIGTERM and SIGHUP are deferred while the lock is held, so only SIGKILL or power loss can strand it, and the engine then reports the lock as stale."
  - In `.skilled/commands/doctor/scripts/README.md` line 130, add that `unlock` removes only a lock whose owner process is gone.
  - Test, new, in section 5: `a signal while the apply lock is held cannot strand the lock`. Use `makeFixture` and `ignoreRuns`. Write a preload file into `fixture.root` that replaces `fs.openSync` with a wrapper: it calls the original, and when the path ends with `.apply.lock` and the flag is `'wx'`, it calls `process.kill(process.pid, 'SIGTERM')` before returning the descriptor. Run `spawnSync(process.execPath, ['--require', preload, SCRIPT_PATH, 'apply', '--repo', operator, '--json'], { encoding: 'utf8' })`. Assert `signal` is null, `status` is 0, the lock file is absent and `HUB_A_FILE` reads `Release line`. Parse stdout, run `rollback --run <runDir>` and assert exit 0 and `Base line`. On the old engine the child dies by SIGTERM and leaves the lock.
  - Test, new, in section 5: `a stale apply lock is reported with its recovery and only unlock clears it`. Use `makeFixture` and `ignoreRuns`, then a bare `apply`, and keep its `runDir`. Get a dead pid from `spawnSync(process.execPath, ['-e', '']).pid`. Write the lock as JSON `{ pid: <dead>, startedAt: '2026-01-01T00:00:00.000Z', command: 'apply', runDir: <runDir> }`. Assert `apply --dry-run` exits 1 with an error matching `apply lock already exists`, `stale`, `unlock` and the run directory. Assert `rollback --run <runDir>` exits 1 with `stale`. Assert `unlock --dry-run` exits 0 with `lock: 'stale'`, `removable: true` and `rollbackRecorded: true`, and the lock still exists. Assert `unlock` exits 0 with `removed: true` and the lock is gone. Assert `rollback --run <runDir>` then exits 0 and restores `Base line`. Then write a lock owned by `process.pid` and assert `unlock` exits 1 with `held by running process` and keeps the file. Then write `{}\n` and assert `unlock` exits 1 with `no readable owner` and keeps the file.
  - Run: `node --test --test-name-pattern "signal while|stale apply lock|lock" .skilled/commands/doctor/scripts/tests/release-update.test.cjs`. The existing tests at lines 1017-1043 and 1073-1087 write `{}` and must still pass.

- [x] T012 DU-02 follow-up: re-raise a signal that arrived while the lock was held, after the lock is released (`release-update.cjs`, `deferSignals`)
  - Why: `applyPlan` and `rollbackPlan` run synchronously, so a signal's listener cannot run until the command returns, and by then the restore function has removed it. The signal is dropped and the operator's Ctrl-C is silently ignored. The lock no longer strands, but the interrupt must still take effect once the lock is gone.
  - Change: have the listener record the first signal it receives. Make the restore function wait one event-loop turn (for example `setImmediate`) so a pending signal can reach the listener, then remove the three listeners and, when a signal was recorded, re-send it to the process with `process.kill(process.pid, signal)` so the default action ends it. Keep the existing WHY comment accurate.
  - Test, new, beside the existing signal test: `a signal deferred during apply still ends the process after the lock is released`. Reuse the existing preload approach so the child receives SIGTERM while the lock is held. Assert that the lock file is gone, that the child ended by signal (`signal === 'SIGTERM'` or exit status 143), and that `rollback` still succeeds. It must fail against the engine before this change.
  - Run: `node --test --test-name-pattern "signal" .skilled/commands/doctor/scripts/tests/release-update.test.cjs`.

### Phase B: copied-tree journey (DU-03, DU-04, DU-07, DU-08, DU-14, DU-25, DU-13 item 5)

- [x] T020 DU-03: resolve the framework remote from the flag, then `base.json`, then `origin`, and say when a remote lists no release tags (`release-update.cjs`, `parseArgs` 2068-2119, `runCommand` 2143-2175, `releaseContext` 739-785, `buildReport` 1102-1111, `recordBase` 1971-2013, `prepareWrites` 1721-1731)
  - In `parseArgs`, remove `remote: 'origin'` from the defaults at line 2073. After the loop, when `options.remote` is set and starts with `-`, throw `usageError('--remote must name a remote or a repository URL, not an option')`.
  - Add `persistedRemote(repo)`. It reads `base.json` with `loadJson` and returns its top-level `remote` when that is a non-empty string, else null. When the value starts with `-` it throws `base.json remote must name a remote or a repository URL, not an option: <value>`. Give it a WHY comment: `base.json` is a shared tracked file, and git reads a value that starts with a dash as an option.
  - In `runCommand`, after `resolveRepo`, when the command's options include `remote`, set `options.remoteSource` to `'flag'`, `'base'` or `'default'`, and set `options.remote` to the flag value, else the persisted remote, else `'origin'`.
  - In `releaseContext`, when `upstream.known` is true and `upstreamLatest` is null, return `upstream.error` as `remote <name> lists no stable vN.N.N.N release tags, so name the framework repository with --remote`. Drop the word `stable` when `options.includePrerelease` is set. Keep `status: 'unknown'`.
  - In `buildReport`, when `options.remoteSource` is `'flag'`, append ` --remote <shellQuote(remote)>` to `baseRecording.action`.
  - In `recordBase`, when `options.remoteSource` is `'flag'`, write `remote: options.remote` into the new base. Otherwise keep `existing.remote` when it is a string. Keep the key order `schemaVersion`, `remote`, `units`.
  - In `prepareWrites`, keep `oldBase.remote` in `newBase` when it is a string.
  - Router `.skilled/commands/doctor/update.md`: in lines 36-38, check, align and apply each accept `--remote=<name-or-url>`, and apply also accepts `--offline`, which closes DU-13 item 5. Add `--remote=<name-or-url>` to the equals-form list at line 18.
  - Workflows: in `doctor-update-check.yaml`, `doctor-update-align.yaml` and `doctor-update-apply.yaml`, add a `remote` user input (optional framework remote name or repository URL), a default `remote_empty: base_json_remote_or_origin`, an engine mapping `--remote <value> when supplied, and otherwise the engine uses the remote recorded in base.json, then origin`, and `[--remote <value>]` in every engine command line and flag rule. In `doctor-update-apply.yaml` also add an `offline` input, a default `offline_empty: false`, a mapping `--offline when requested`, and `[--offline]` in the dry-run and apply command lines at lines 51-52, 105 and 121.
  - Presentation: add `--remote=<name-or-url>` to the check, align and apply rows of the flag table at lines 27-29, and `--offline` to the apply row. After the base-recording block at lines 82-88, add this note for a report whose `upstream.error` says the remote lists no release tags:

    ```text
    This checkout's remote lists no framework release tags. If .skilled/ was copied from the framework, name the framework repository with --remote=<name-or-url>. When the base is recorded with --remote, .skilled/release/base.json keeps that remote, and later commands use it without the flag.
    ```

  - Test, new, in section 6: `a copied tree names its framework remote once and later checks use it`. Use `makeFixture` and `makeVendor`. Create a bare repository with `git init --bare -q` under `fixture.root`, and add it as the vendor's `origin`. Assert `check` exits 0 with `upstream.status` `unknown` and `upstream.error` matching `lists no stable vN\.N\.N\.N release tags`. Assert `check --remote <upstream>` has `baseRecording.action` containing `--remote`. Run `record-base --release v1.0.0.0 --remote <upstream>` and assert exit 0 and `base.json` `remote` equals the upstream path. Commit. Assert a plain `check` now reports `upstream.latest` `v1.1.0.0`, `skill:hub-a` with status `update` and base source `recorded`. Assert `check --remote=-uevil` exits 2. Finally write `base.json` with `remote: '-uevil'`, and assert `check` exits 1 with an error matching `base.json remote`.

- [x] T021 DU-14: declare `include_prerelease` in align and apply (`doctor-update-align.yaml` lines 33-45, `doctor-update-apply.yaml` lines 37-49)
  - Add `include_prerelease` to both `user_inputs` blocks, worded like `doctor-update-check.yaml:40`, and add `include_prerelease_empty: false` to both `field_handling.defaults` blocks.
  - Test: the phase D contract test asserts every routed flag has a declared input.

- [x] T022 DU-07, with the ignore half of DU-02: ship the release ignore rule and an exact-lines template (`.skilled/release/.gitignore`, `doctor-update-align.yaml` phase 1, `doctor-update-apply.yaml` phase 1, presentation)
  - Create `.skilled/release/.gitignore` with a one-line comment saying run directories and the apply lock are local state, then the two lines `runs/` and `.apply.lock`. Do not ignore `base.json` or `divergence.json`, which must stay tracked.
  - In both workflows' phase 1 `on_failure`, say that when `git check-ignore` does not match the run root, the workflow shows the presentation's run-root template and stops.
  - Add this template to the presentation under the align and apply sections:

    ```text
    The release run root is not ignored by git in this checkout.
    Add these two lines to .skilled/release/.gitignore:
      runs/
      .apply.lock
    Or add these two lines to the repository .gitignore:
      .skilled/release/runs/
      .skilled/release/.apply.lock
    Commit the ignore file, then run /doctor:update again.
    ```

  - Test, new, in section 6: `the shipped release ignore rule covers runs and the apply lock and not the base records`. Create a fresh repository with `git init -q` under a temp root, copy the real file from `path.join(__dirname, '..', '..', '..', '..', 'release', '.gitignore')` into its `.skilled/release/.gitignore`, and write no root `.gitignore`. Assert `git check-ignore -q` exits 0 for `.skilled/release/runs/x` and `.skilled/release/.apply.lock`, and exits 1 for `.skilled/release/base.json` and `.skilled/release/divergence.json`. Use `spawnSync('git', ...)` to read the exit status.

- [x] T023 DU-08: keep `.skilled/release/` out of units and keep units with no local files out of `baseRecording` (`release-update.cjs`, `enumerateUnits` 496-548, `buildReport` 1015-1111)
  - In `enumerateUnits`, drop every path that starts with `RELEASE_DIR + '/'` before building units. Give it a WHY comment: the directory holds the engine's own records and run state, never framework content.
  - In `buildReport`, record which units have a present local entry (`hasPresentEntry(localUnit)`) while building reports, and filter `unrecorded` to those units only. Do not add a new field to the unit report.
  - In the existing test `a copied tree reports a recorded base after record-base`, change line 569 to assert `baseRecording.units` deep-equals `[]` and `baseRecording.needed` is false. This is one of the three updates REQ-001 allows.
  - Test, new, in section 6: `a copied tree needs no further base recording after record-base and a commit`. Use `makeFixture` and `makeVendor`. Run `record-base --release v1.0.0.0 --remote <upstream>`, commit, then `check --remote <upstream>`. Assert exit 0, `baseRecording.needed` false, `baseRecording.units` empty, and no unit whose key is `directory:release`.

- [x] T024 DU-04: refuse a named release that another release is nearer to, and take the lock in record-base (`release-update.cjs`, `baseForUnit` 820-835, `recordBase` 1971-2013, `COMMAND_OPTIONS['record-base']`, `parseArgs`)
  - Extract `unitDistance(localEntries, releaseEntries)` from lines 826-830: the count of paths in the union of both maps whose states differ by `sameState`. Use it in `baseForUnit` without changing behaviour. Give it a WHY comment: record-base and base inference must agree on what nearest means.
  - Add `trust-release` to the record-base options, to `booleanOptions`, and to `booleanKeys` as `trustRelease`.
  - In `recordBase`, after `units` is known and before the dirty check, unless `options.trustRelease` is set: list the candidate tags as the local tags plus `remoteTags(repo, options.remote).tags`, filtered by `acceptsTag(options.includePrerelease)`. When offline, or when the remote listing fails, throw `cannot list release tags (<reason>), so release <release> cannot be checked against nearer releases. Pass --trust-release to record it unchecked`. Read the local tree with `localFiles(repo, [...releaseFiles.keys()])`. For each candidate other than the named release, resolve its commit with `tagCommit(repo, tag, options.remote, !options.offline, commits)` and read its files once per tag. For each unit, compare the named release's distance with each candidate's. When any unit has a strictly nearer candidate, throw `release <release> is not the nearest release to this tree: <entries>. Name the release this tree was installed from, or pass --trust-release to record <release> anyway`, where each entry reads `<unit key> is nearest <tag> (<n> files differ, against <m> from <release>)`.
  - Before writing, and also on a dry run, throw `lockConflictError(repo)` when `readLockState(repo).state` is not `absent`. For a real write, call `deferSignals()`, then `acquireLock(repo, { command: 'record-base', runDir: null })`, write `base.json` in a `try`, and in `finally` remove the lock and restore the signal listeners.
  - Add `verified: !options.trustRelease` to the result.
  - Presentation: in the base-recording block, add the sentence `Record-base refuses a release that is farther from this tree than another release, and names the nearest one.`, and add `[--remote <framework-remote>]` to its command line at line 86.
  - Test, new, in section 6: `record-base refuses a release that is not the nearest to the local tree`. Use `makeFixture` and `makeVendor`. Assert `record-base --release v1.1.0.0 --remote <upstream>` exits 1 with an error matching `not the nearest`, `skill:hub-a` and `v1\.0\.0\.0`, and that `base.json` does not exist. Assert `record-base --release v1.0.0.0 --remote <upstream> --dry-run` exits 0 with `verified: true`. Assert `record-base --release v1.1.0.0 --remote <upstream> --trust-release` exits 0 with `verified: false`. Then, in the `fixture.operator` clone, assert `record-base --release v1.0.0.0 --offline` exits 1 with `--trust-release`, and with `--trust-release` added exits 0.
  - The existing record-base tests at lines 541-574, 619-669, 697-712 and 1204-1214 name the installed release and must still pass.

- [x] T025 DU-25: report a base record without a tree fingerprint as unverified (`release-update.cjs`, `baseForUnit` 797-810, `buildReport` 1102-1104, `doctor-update-check.yaml` line 140)
  - In `baseForUnit`, when the record's commit resolves and the record has no `tree`, return `source: 'recorded-unverified'` with the same release, commit and files. A matching `tree` keeps `source: 'recorded'`.
  - In `buildReport`, add `'recorded-unverified'` to the `unrecorded` filter.
  - In `doctor-update-check.yaml` `phase_4_next_steps.routing.base_recording`, say that `baseRecording.needed` covers a unit with local files whose base source is `inferred`, `none` or `recorded-unverified`. In the presentation base-recording block, change the first sentence to `[count] unit(s) have no verified recorded base, so their status rests on an inferred or unverified base.`
  - In the existing test `a name-only base.json record reads as the one unit with that name and is rewritten`, change line 689 to expect `recorded-unverified`, and add an assertion that `baseRecording.units` includes `skill:hub-a`. This is one of the three updates REQ-001 allows.

### Phase C: approval, recovery and journey (DU-05, DU-06, DU-09, DU-10, DU-11, DU-12, DU-16, workflow half of DU-02, DU-13 items 3 and 4)

- [x] T030 DU-05: bind the real apply to the dry-run plan with a digest (`release-update.cjs`, `applyPlan` 1824-1920, `parseArgs`, `COMMAND_OPTIONS.apply`)
  - Add `plan-digest` to the apply options and to the parser's value options. Store it as `options.planDigest` through a `valueKeys` map placed beside `booleanKeys`. After the loop, when it is set and does not match `^[0-9a-f]{64}$`, throw `usageError('--plan-digest must be the 64-character digest that apply --dry-run printed')`.
  - Add `planDigest(run, prepared)` in section 8. It returns the sha256 hex of `JSON.stringify` over `release`, `releaseCommit` (or null), the writes sorted by path, the sorted applied unit keys, and the skipped units as `[unit, reason]` pairs sorted. A target write contributes `{ path, before, after }` with each state as `{ mode, blob }` or null. A write marked `metadata: true` contributes `{ path }` only. Give it a WHY comment: the digest covers what the operator approved, while the release records' contents follow from that set, and the run directory name carries a timestamp.
  - In `applyPlan`, after `regenerate` is computed, compute the digest. When `options.planDigest` is set and differs, throw `plan changed since the dry-run: its digest no longer matches. Run apply --dry-run again and approve the new plan`. This check runs on a dry run too.
  - Add `release`, `releaseCommit`, `runDir` (null when `run.withoutRun` is true) and `planDigest` to the dry-run result, and `planDigest` to the apply result.
  - `doctor-update-apply.yaml`: add `release`, `releaseCommit`, `runDir` and `planDigest` to `engine_plan_fields` (line 54). In phase 4, the command passes the same optional flags as the dry-run plus `--release <dry-run release>`, omitted when that value is `unknown`, and `--plan-digest <dry-run planDigest>`. Replace `changed_plan` with: "If the engine refuses because the plan changed since the dry-run, discard the approval, rerun the dry-run and ask again."
  - Presentation plan template, lines 191-193: keep `Release: [release]`, and change the run line to `Run directory: [runDir, or a new run under .skilled/release/runs when apply plans without a run]`.
  - Test, new, in section 5: `apply binds to the dry-run release and refuses a plan that changed`. Part one: `makeFixture`, then `apply --dry-run`, and assert `release` is `v1.1.0.0`, `runDir` is null and `planDigest` matches `^[0-9a-f]{64}$`. Publish `v1.2.0.0` upstream with `HUB_A_FILE` set to `# a reference\nThird line\n`. Run `apply --release v1.1.0.0 --plan-digest <digest>` and assert exit 0, `release` `v1.1.0.0` and `HUB_A_FILE` reading `Release line`. Part two, on a fresh `makeFixture`: take a dry-run digest, write and commit `HUB_A_FILE` as `# a reference\nOperator line\n`, run `apply --plan-digest <digest>`, and assert exit 1 with `plan changed since the dry-run` and that `HUB_D_FILE` does not exist. Also assert `apply --plan-digest xyz` exits 2.

- [x] T031 DU-06: name the commit remedy when a release record is dirty (`release-update.cjs` lines 1756-1759 and 1878-1881, presentation, `doctor-update-align.yaml` phase 5)
  - Add `dirtyTargetError(filePath)`. Its message is `target has staged or unstaged changes against HEAD: <path>`, and for `BASE_FILE` or `DIVERGENCE_FILE` it adds `, a release record that an earlier apply or record-base wrote. Commit it together with the files that apply changed, then run apply again`. Throw it at both sites.
  - Presentation apply result template (lines 310-322): add the line `Commit the applied files and the changed release records under .skilled/release/ before the next /doctor:update apply.` above the status line.
  - `doctor-update-align.yaml` `phase_5_summary_handoff`: add "If an earlier apply's files and release records are not committed, say to commit them before applying this decision set." Add the matching line to the presentation align summary.
  - Test, new, in section 5: `a second apply names the uncommitted release record and the commit remedy`. Use `makeFixture({ withHubBRelease: true })` and `ignoreRuns`. Run a bare `apply`. Without committing, align, decide `HUB_B_RELEASE_FILE` as `adopt-release` and `CHILD_FILE` as `keep-local`, then `apply --decisions`. Assert exit 1 and an error matching `\.skilled/release/base\.json` and `Commit it`.

- [x] T032 DU-09: refuse to reuse a run that holds operator choices (`release-update.cjs`, `resolveApplyRun` 1564-1572, `doctor-update-apply.yaml` line 46)
  - After `loadRun(latest, repo)`, when any record in `run.decisions.files` passes `isOperatorDecision` or `run.decisions.deferredUnits` is not empty, throw `the newest alignment run at this HEAD holds operator decisions: <runDir>. Apply them with --decisions <runDir>/decisions.json, or run align for a new plan`. Give it a WHY comment: a bare apply discards a run's decisions and deferrals, so reusing a decided run would write a unit the operator deferred and use up the run.
  - In `doctor-update-apply.yaml` `field_handling.defaults.decisions_empty`, add that a run holding an operator decision or a deferred unit is refused, and that the engine names its `--decisions` path.
  - Test, new, in section 5: `a bare apply refuses an alignment run that holds operator decisions`. Use `makeFixture({ withHubBRelease: true })`, align, and decide `HUB_B_RELEASE_FILE` as `adopt-release`. Assert a bare `apply` exits 1 with `holds operator decisions` and `--decisions`, and that the run has no `rollback.json`. Assert `apply --decisions <run>/decisions.json` then exits 0.

- [x] T033 DU-11: report and skip a downgrade (`release-update.cjs`, `buildReport` after line 1058, `prepareWrites` line 1680, `doctor-update-check.yaml`, `doctor-update-align.yaml` line 102, presentation)
  - In `buildReport`, after `unitStatus`, set the status to `'downgrade'` when `base.release` and `context.release` are both set, the computed status is not `current`, `local` or `blocked`, and `compareVersions(context.release, base.release) < 0`.
  - In `prepareWrites`, push `{ unit: key, reason: 'downgrade' }` for a `downgrade` unit and continue.
  - `doctor-update-check.yaml`: add `downgrade` to `status_values.unit` (line 58) and to `phase_3_render_dashboard.grouping.separate` (line 128). Add a routing entry: explain that the selected release is older than the unit's base, that apply never writes such a unit, and that rolling back the apply that took the newer release, or git, returns a tree to an older release. In `doctor-update-align.yaml` line 102, add `downgrade` to the skipped statuses.
  - Presentation: add `downgrade` to the dashboard status column at line 53, and add this check next step:

    ```text
    Downgrade units are older in the selected release than in this checkout. Apply never writes them. Roll back the apply that took the newer release, or use git, to return to an older release.
    ```

  - Test, new, in section 5: `an explicit older release reports downgrade and apply leaves the unit alone`. Use `makeFixture` and `ignoreRuns`, run a bare `apply`, and commit. Assert `check --release v1.0.0.0` reports `skill:hub-a` as `downgrade`. Run `apply --release v1.0.0.0`, and assert exit 0, a skipped entry `{ unit: 'skill:hub-a', reason: 'downgrade' }`, and `HUB_A_FILE` still reading `Release line`.

- [x] T034 DU-12, DU-16 and DU-13 item 4: class activation manifests as generated and act on every named generator (`release-update.cjs` lines 70-100, `doctor-update-apply.yaml` lines 133-176, `doctor-update-check.yaml` line 119, presentation lines 59 and 218-232)
  - Engine: add `COMPILED_ROUTE_GENERATOR = 'node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>'` beside the other generator constants, and a `GENERATED_ARTIFACTS` entry with pattern `^\.skilled\/bin\/lib\/compiled-routing\/[^/]+\/activation\/[^/]+\/manifest\.json$`, scope `'file'` and that generator. Extend the comment above the list with two reasons: `fence-state.json` beside an activation manifest stays authored because no operator-side tool writes it, and the `intent_signals` key of `graph-metadata.json` stays authored because its generator appends to an authored list and keeps its order.
  - `doctor-update-apply.yaml` battery: change `leaf_manifests.when` to "For every hub name in followUps.regenerateHubs, check the directory .skilled/skills/<hub>. For every leaf-manifest.json path in followUps.regenerate, check the directory that holds it. Check each directory once." Keep its command and repair with that directory in place of `<hub-dir>`. This closes DU-13 item 4.
  - Add a `trigger_index` step: `when` "followUps.regenerate names generate-trigger-index.mjs", command `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check`, repair "With approval, run the same command without --check, then rerun --check."
  - Add a `compiled_routes` step: `when` "followUps.regenerate names compiled-route-manifest.cjs", command `node .skilled/bin/compiled-route-guard.cjs`, repair "With approval, for each hub the guard reports stale, run node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>, then rerun the guard."
  - Keep `skill_derived_metadata` as is. It runs always and covers the graph-metadata generator.
  - Add a compiled-route activation manifest to the generated lists in `doctor-update-check.yaml` line 119 and presentation line 59. Add `Trigger index` and `Compiled routes` rows, each `[PASS|FAIL|not applicable]`, to the battery table in the presentation.
  - Test, new, in section 5: `regenerated trigger-index and route manifests are generated and name their generators`. Use `makePair`. The base holds `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (`{"v":1}\n`), `.skilled/skills/system-spec-kit/references/r.md` (`base\n`), `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` (`{"generation":1}\n`) and `.skilled/bin/tool.cjs` (`base\n`). The release changes `r.md` and `tool.cjs` to `release\n`. In the operator clone, rewrite the trigger index to `{"v":2}\n` and the manifest to `{"generation":2}\n`, then commit. Assert `check` reports both files as `generated`, and `skill:system-spec-kit` and `directory:bin` as `update`. Assert `apply --dry-run` writes `r.md` and `tool.cjs` and neither generated file, and that `followUps.regenerate` names generators matching `generate-trigger-index\.mjs` and `compiled-route-manifest\.cjs`.

- [x] T035 DU-10: add `rollback --dry-run` for the affected-state preview (`release-update.cjs`, `rollbackPlan` 2015-2062, `COMMAND_OPTIONS.rollback`, `runCommand`)
  - Add `dry-run` to the rollback options, and pass `options` to `rollbackPlan`.
  - On a dry run, keep the path confinement check at lines 2027-2034, throw `lockConflictError(repo)` when a lock exists, and classify each entry without the lock and without writing: current equals `before` or `after` goes to `restored`, anything else to `skipped`. Return `{ command: 'rollback', dryRun: true, runDir, restored, skipped }` with exit 0.
  - Test, new, in section 5: `rollback --dry-run previews restored and skipped paths and writes nothing`. Use `makeFixture`, run a bare `apply`, and keep its `runDir`. Assert `rollback --run <runDir> --dry-run` exits 0 with `dryRun: true` and `restored` including `HUB_A_FILE` and `HUB_D_FILE`, while `HUB_A_FILE` still reads `Release line` and no lock exists. Edit `HUB_A_FILE` and assert a second dry run lists it under `skipped` and still exits 0.

- [x] T036 DU-10 and the recovery half of DU-02: create the routed rollback workflow (`.skilled/commands/doctor/assets/doctor-update-rollback.yaml`, new)
  - Model its layout on `doctor-update-apply.yaml`: header box, `role`, `purpose`, `action`, `operating_mode` (interactive, one approval for the rollback plus one for clearing a stale lock), invariant, `upstream_assets`, `user_inputs` (`run`, an optional run directory below `.skilled/release/runs`, and `dry_run`), `field_handling` with engine mappings, `mutation_boundaries`, `state_log_schema`, `workflow` phases and `terminal_statuses`.
  - Phase 1, preflight: confirm the repository and the engine. When `run` is bound, resolve it to a canonical real directory below `.skilled/release/runs`.
  - Phase 2, lock check: run `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run`. An absent lock continues. A live or unknown lock shows the lock template and stops with `STATUS=FAILED`. A stale lock shows the lock template and asks the stale-lock approval. On yes, run `unlock --repo . --json` and continue. On no, stop with `STATUS=DECLINED`. On cancel or interrupt, stop with `STATUS=CANCELLED ACTION=cancelled`. When `run` is unbound, use the stale owner's `runDir`. When `run` is bound and the owner names a different `runDir`, show both and ask which run to restore.
  - Phase 3, run selection: when no run is bound and no stale lock named one, list the run directories below `.skilled/release/runs` that hold `rollback.json`, newest first, and ask the operator to choose one. When the chosen run has no `rollback.json` and a stale lock was just cleared, report that the interrupted run wrote nothing and stop with `STATUS=UNLOCKED`.
  - Phase 4, preview: run `rollback --repo . --run <runDir> --dry-run --json` and show every path it would restore and every path it would skip. When the operator passed `--dry-run`, stop here with `STATUS=DRY_RUN` and write no state log.
  - Phase 5, approval, under the key `phase_5_approval`: ask once to restore the displayed paths. No means `STATUS=DECLINED`, and cancel or interrupt means `STATUS=CANCELLED ACTION=cancelled`, each with no engine write.
  - Phase 6, engine rollback: run `rollback --repo . --run <runDir> --json`. Exit 0 means every path was restored. Exit 1 with `ok: false` and a non-empty `skipped` array is the partial path, not a failure. Read `restored` and `skipped` before judging the exit code. Exit 1 with an `error` is a failure.
  - Phase 7, skipped paths: list each skipped path and say it changed after apply and was left unchanged. Never run `git restore` from this workflow, because after the session the commit state of those paths is unknown. Stop with `STATUS=PARTIAL` when any path was skipped.
  - Phase 8, state log: write `<runDir>/.doctor-update-rollback.last-run.json` on every terminal path except a dry run and a preflight failure, with `command`, `start`, `end`, `duration_seconds`, `run_dir`, `lock` (`absent`, `cleared` or `refused`), `restored`, `skipped` and `final_status`.
  - `mutation_boundaries.allowed_targets`: the paths that the engine's rollback record lists and the engine validates, the apply lock through the engine only, and the state log. Forbidden: every other path, and any lock whose owner is running or unreadable.
  - `terminal_statuses`: `STATUS=ROLLED_BACK`, `STATUS=PARTIAL`, `STATUS=UNLOCKED`, `STATUS=DRY_RUN`, `STATUS=DECLINED`, `STATUS=CANCELLED`, `STATUS=FAILED`.

- [x] T037 DU-10: create the routed record-base workflow (`.skilled/commands/doctor/assets/doctor-update-record-base.yaml`, new)
  - Use the same layout. `user_inputs`: `release` (required, asked through the presentation when absent), `remote`, `scope`, `offline`, `include_prerelease`, `trust_release` and `dry_run`.
  - Phase 1, preflight: confirm the repository and the engine. When `release` is not bound, ask for the release this tree was installed from.
  - Phase 2, engine dry run: run `record-base --repo . --json --dry-run --release <tag>` with every bound optional flag. On success show the units it would record and whether the nearest-release check ran (`verified`). When the engine refuses because another release is nearer, show the nearest-release template and offer two choices: rerun with the nearest release when every listed unit names the same one, or record the named release anyway with `--trust-release` after an explicit approval that names the risk. When it refuses because `base.json` has uncommitted changes, show the commit instruction and stop. When it refuses because of a lock, show the lock template.
  - Phase 3: when the operator passed `--dry-run`, stop with `STATUS=DRY_RUN` and write no state log.
  - Phase 4, approval, under the key `phase_4_approval`: ask once to write `.skilled/release/base.json` for the listed units. No means `STATUS=DECLINED`, and cancel or interrupt means `STATUS=CANCELLED ACTION=cancelled`.
  - Phase 5, engine record-base: run the same command without `--dry-run`, then show the result and the presentation's commit instruction.
  - Phase 6, state log: write `.skilled/release/runs/.doctor-update-record-base.last-run.json` when `git check-ignore` matches the runs root, otherwise return the status in the presentation only. Fields: `command`, `start`, `end`, `duration_seconds`, `release`, `remote`, `units`, `verified` and `final_status`.
  - `mutation_boundaries.allowed_targets`: `.skilled/release/base.json` through the engine, the apply lock through the engine, and the state log.
  - `terminal_statuses`: `STATUS=RECORDED`, `STATUS=DRY_RUN`, `STATUS=DECLINED`, `STATUS=CANCELLED`, `STATUS=FAILED`.

- [x] T038 DU-10: route the two actions and register them (`update.md`, presentation, `_routes.yaml`, `command-contract.json`, `.skilled/commands/README.txt`, `README.md`, `.skilled/commands/doctor/scripts/README.md`)
  - `update.md`: change the frontmatter description to `Route /doctor:update check, align, apply, rollback or record-base operations for a spec-kit release.` (under 110 characters). In MODE ROUTING, resolve the first token as `check`, `align`, `apply`, `rollback` or `record-base`. Add `rollback` accepts `--run=<runDir>` and `--dry-run`, and `record-base` accepts `--release=<tag>`, `--remote=<name-or-url>`, `--scope=all|<unit,...>`, `--offline`, `--include-prerelease`, `--trust-release` and `--dry-run`. Add `--run=<runDir>` to the equals-form list at line 18. Add both YAMLs to the OWNED ASSETS table. Add one WORKFLOW SUMMARY sentence for each action, without the word commit, because the presentation owns that instruction. Leave the argument hint for phase D.
  - Presentation: change the unknown-action line at line 11 to `Choose check, align, apply, rollback or record-base.`, and add rows for both actions to the flag table. Add a `Rollback` section with the run list, the preview table, the approval prompt, the skipped-path explanation and a result template, and a `Record base` section with the release question, the units table, the nearest-release refusal, the trust approval, the write approval and a result template that ends with the commit instruction. Each result template lists every terminal status of its workflow.
  - Replace the base-recording command line from T024 with `/doctor:update record-base --release=<installed-release> [--remote=<framework-remote>]`, and change `doctor-update-check.yaml` line 140 to name that routed action instead of `baseRecording.action`.
  - `_routes.yaml` standalone `/doctor:update` (lines 241-259): add `rollback` with `yaml: doctor-update-rollback.yaml` and `mutating: mutates`, and `record-base` with `yaml: doctor-update-record-base.yaml` and `mutating: mutates`.
  - `command-contract.json` doctor block: add execution targets with selectors `rollback` and `record-base` that point at the two YAMLs. Add both YAMLs to `owned_assets` with purpose `other`. Change the update loader requirement to `Bare /doctor:update runs the read-only check action, and /doctor:update apply, rollback and record-base each request approval before their first write`. Append to the destructive operations: `update rollback restores a run's rollback record after one approval and clears a stale apply lock only with its own approval`, and `update record-base writes .skilled/release/base.json after one approval`. Change the alias to `/doctor:update [check|align|apply|rollback|record-base] [flags]`. Leave `argument_hint` for phase D.
  - `.skilled/commands/README.txt` line 162 and `README.md` line 1219: name the five actions.
  - `.skilled/commands/doctor/scripts/README.md` line 59: name the five `/doctor:update` workflows.

- [x] T039 The workflow half of DU-02, with DU-13 item 3: route lock recovery and bound apply's runtime (`doctor-update-apply.yaml` lines 98, 119-131, 178-181, presentation)
  - Replace the phase 1 lock check at line 98: run `unlock --repo . --json --dry-run`. An absent lock continues. A live or unknown lock shows the lock template and stops without removing it. A stale lock shows the lock template, which routes to `/doctor:update rollback`, and stops. This workflow never removes a lock itself.
  - In phase 4, add an `execution_rule`: "Run engine apply in one call with no tool timeout shorter than the run needs. Use the runtime's longest timeout, or run it in the background and wait for its exit. A killed apply leaves a stale lock that /doctor:update rollback recovers."
  - In `failure_recovery.rollback_order` at line 180, add: "Engine rollback exits 1 with ok false when it skipped any path. That is the partial path, not a failed rollback, so read restored and skipped before judging the exit code." This closes DU-13 item 3.
  - Add this lock template to the presentation:

    ```text
    The release apply lock is held.
    Owner: process [pid] ([command]), started [startedAt]
    State: [running, stale or unreadable]
    Running: another /doctor:update apply, rollback or record-base is still working. Wait for it to finish, then try again.
    Stale: that process is no longer running. Run /doctor:update rollback to clear the lock with your approval and, when the interrupted run recorded a rollback, to restore its partial changes.
    Unreadable: the lock names no owner. Confirm that no /doctor:update apply, rollback or record-base is running, then remove .skilled/release/.apply.lock by hand.
    ```

### Phase D: contract hygiene (DU-13 items 1, 2 and 6, DU-17 to DU-24, DU-26)

- [x] T050 DU-13 items 1, 2 and 6: use the engine's vocabulary (`doctor-update-check.yaml` lines 57-59, 79, 120, 143-151, presentation line 44)
  - Line 79: `upstream_status: "known|unknown"`, with a note that an offline check reports `unknown` with `upstream.error` `offline mode`.
  - Add `report: [current, updates-available, blocked, unknown]` to `status_values`, and a `report_status_mapping` in phase 5: `current` and `updates-available` give `STATUS=OK`, `blocked` gives `STATUS=UNKNOWN` with the blocked units named, and `unknown` gives `STATUS=UNKNOWN`.
  - Presentation line 44: `Release position: [ahead|behind|at-release|unknown] [release tag or UNKNOWN]`.

- [x] T051 DU-17: link a release rename in the report and the evidence card (`release-update.cjs`, `buildReport` 1015-1085, `evidenceCard` 1216-1250, `doctor-update-check.yaml` line 116, presentation lines 108-117)
  - Add `releaseRenames(repo, baseCommit, releaseCommit, pathspec)`. When either commit is missing it returns an empty map. Otherwise it runs `gitTry(repo, ['diff', '-M', '--name-status', '-z', baseCommit, releaseCommit, '--', pathspec])`, parses records whose status starts with `R` into old and new paths, and returns a map from old to new. A failed call returns an empty map.
  - In `buildReport`, call it only for a unit that holds at least one file with a base entry and no release entry and at least one file with a release entry and no base entry. Use `.skilled` as the pathspec for the root unit and `.skilled/<prefix>` otherwise. For each pair whose two paths are both in this unit's file reports, set `renamedTo` on the old report and `renamedFrom` on the new one.
  - In `evidenceCard`, add the line `- Rename: <from> -> <to>` when the file has either field, else `- Rename: none`.
  - Add `renamedFrom` and `renamedTo` to `file_fields` in `doctor-update-check.yaml`, and the line `Rename: [from path -> to path, or none]` to the presentation evidence card.
  - Test, new, in section 4: `a release rename links its old and new paths`. Use `makePair` with base files `.skilled/skills/hub-a/SKILL.md` and `.skilled/skills/hub-a/references/old-name.md` (`same content\n`), where the release deletes `old-name.md` and adds `new-name.md` with the same content. Assert `check` reports `skill:hub-a` as `update`, `old-name.md` with `renamedTo` set to the new path and `new-name.md` with `renamedFrom` set to the old path. Run `apply` and assert the old file is gone and the new one exists. In a second `makePair`, have the operator edit `old-name.md` and commit, then align. Assert the plan reports `old-name.md` as a `deleted-in-release` conflict with `renamedTo` set, and its evidence card contains `Rename: .skilled/skills/hub-a/references/old-name.md -> .skilled/skills/hub-a/references/new-name.md`.

- [x] T052 DU-18: record cancellation as CANCELLED (`doctor-update-apply.yaml` lines 89, 114-117, 197-203, presentation lines 212 and 321)
  - Add `cancelled` to `final_status`. Split `no_approval`: an explicit no or an ambiguous answer stops with `STATUS=DECLINED`, and a cancellation or interruption stops with `STATUS=CANCELLED ACTION=cancelled`. Neither runs engine apply without `--dry-run`. Add `STATUS=CANCELLED` to `terminal_statuses`.
  - Presentation line 212: map no and ambiguity to `STATUS=DECLINED`, and cancellation and interruption to `STATUS=CANCELLED ACTION=cancelled`. Add `CANCELLED` to the apply result status list at line 321.

- [x] T053 DU-19: one dry-run rule for align and apply (`doctor-update-apply.yaml` lines 33, 111, 191-195, `doctor-update-align.yaml` pass policy, presentation line 320)
  - Replace `dry_run_writes_nothing: true` with `dry_run_writes: none` in apply's pass policy, and add `dry_run_writes: none` to align's pass policy.
  - Change `terminal_dry_run` to stop with `STATUS=DRY_RUN` without writing a state log. Remove dry-run from the `terminal_rule` list in phase 7 and add "A dry run writes no state log."
  - Presentation apply result: change the state-log line to `State log: .skilled/release/runs/.doctor-update.last-run.json, or none for a dry run`.

- [x] T054 DU-20: summarize the hint and sync it with the contract (`update.md` line 3, `command-contract.json` line 203)
  - Set `argument-hint: "[check|align|apply|rollback|record-base] [--release=<tag>] [--scope=all|<unit,...>] [--remote=<name-or-url>] [--dry-run] [flags]"`. It is 128 characters.
  - In `command-contract.json` `doctor.input.argument_hint`, replace the update segment so it reads that exact string followed by ` (update)`.

- [x] T055 DU-21: remove next-step wording from the router (`update.md` line 68)
  - Replace the paragraph with: "A first run on a copied or freshly installed tree reports `baseRecording.needed`. The `record-base` action records the base, and the presentation's base-recording template owns what the operator is told."

- [x] T056 DU-22: correct the generated-files sentence (`update.md` line 66)
  - Replace the second sentence with: "Generated files (leaf manifests, the trigger index and its sidecars, compiled-route activation manifests, and graph-metadata `derived` blocks) never count as customizations. A copy the operator regenerated stays in place and apply names its generator, while a release change to a copy the operator never regenerated is applied like any other file."
  - Test, new, in section 4: `a release change to an unregenerated leaf manifest is written`. Use `makePair` with base `.skilled/skills/hub-a/SKILL.md` and `.skilled/skills/hub-a/leaf-manifest.json` (`{"leaves":["base"]}\n`), where the release changes the manifest to `{"leaves":["release"]}\n`. Leave the operator copy untouched. Assert `check` reports the manifest as `take-release`, and `apply --dry-run` lists it in `writes`.

- [x] T057 DU-23: say check is read-only for the checkout (`update.md` line 16, presentation after line 31)
  - Line 16: "Bare `/doctor:update` runs the `check` action, which is read-only for the checkout."
  - Presentation, after the release-policy line: `A check may fetch release commits it lacks into the git object store. That changes no checkout file or ref. Pass --offline to prevent every fetch.`

- [x] T058 DU-24: grant only the tools the command uses (`update.md` line 4)
  - Set `allowed-tools: Read, Bash`.

- [x] T059 DU-26: refresh the release-note index (`.skilled/changelog/skilled/README.md` lines 23 and 25)
  - Run `git tag -l 'v4*'` first. Line 23 lists every top-level `vN.N.N.N.md` file. Line 25 names the top-level entry whose tag does not exist yet, which on 2026-10-03 was `v4.0.0.3.md`. If every entry is tagged, line 25 says that no upcoming entry exists.

- [x] T060 Contract test: create `doctor-update-contract.test.cjs` (`.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`, new)
  - Layout like `release-update.test.cjs`: box header, `'use strict'`, numbered ALL-CAPS sections, `node:test` and `node:assert/strict`. Read files with `fs.readFileSync`. Parse YAML text with small line-based helpers, because Node has no YAML parser, and keep each helper under 20 lines.
  - `every routed flag is a declared input of its action's workflow`: parse each `- \`<action>\` accepts ...` line in `update.md`, map each flag to an input key (strip the dashes, hyphen to underscore), and assert the key appears in that action's YAML `user_inputs` block.
  - `workflow and presentation vocabulary matches the engine`: for each engine value (`known`, `unknown`, `at-release`, `ahead`, `behind`, `current`, `updates-available`, `blocked`, `downgrade`) assert it appears quoted in `release-update.cjs`. Assert the check YAML `upstream_status` line has `known|unknown` and no `available`, the check YAML maps `blocked`, and the presentation `Release position:` line has `at-release` and no `even`.
  - `every write action records cancellation as CANCELLED`: the apply, rollback and record-base YAMLs list `STATUS=CANCELLED`, and the presentation contains `STATUS=CANCELLED ACTION=cancelled`.
  - `align and apply state the same dry-run rule`: both YAMLs contain `dry_run_writes: none`, apply's YAML contains `A dry run writes no state log.`, and neither YAML contains `dry_run_writes_nothing`.
  - `the router hint is within budget and matches the command contract`: the hint is at most 140 characters, and `doctor.input.argument_hint` contains the hint followed by ` (update)`.
  - `the router carries no next-step wording or overclaim`: `update.md` has no `release-update.cjs record-base`, no match for the whole word `commit` (`/\bcommit\b/i`), and no `instead of writing them`, and contains `read-only for the checkout`.
  - `the presentation discloses the release fetch next to --offline`: the presentation contains `fetch release commits` within the same section as the flag table.
  - `the router grants only Read and Bash`: the frontmatter line is exactly `allowed-tools: Read, Bash`.
  - `every engine write command has a routed action with an approval gate`: for `apply`, `rollback` and `record-base`, `update.md` routes the action, its YAML exists and has a phase key that matches `phase_[0-9]+_[a-z_]*approval`, and `command-contract.json` lists it as an execution target.
  - `every generator the engine names has a post-apply battery step`: extract each `node .skilled/...(.cjs|.mjs)` script path from the `*_GENERATOR` constants in `release-update.cjs`, and assert each appears in `doctor-update-apply.yaml` phase 5.
  - `the apply result tells the operator to commit the release records`: the apply result template contains `Commit the applied files`.
  - `the lock template routes stale locks to rollback`: the presentation contains `Run /doctor:update rollback to clear the lock`.
  - Run: `node --test .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`.

- [x] T061 List the contract test (`.skilled/commands/doctor/scripts/tests/README.md` line 37)
  - Add a row for `doctor-update-contract.test.cjs` that says it checks the `/doctor:update` router, workflows, presentation and command contract against each other and the engine.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase A checks

- [x] T070 Run the phase A checks and record their output and exit status (engine suite, doctor runner)
  - `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs`: expect `tests 59`, `pass 59`, `fail 0`, exit 0.
  - Fail-first: the three new tests fail against the old engine, and the rewritten prefill test fails on its new assertions.
  - `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: expect exit 0 and 0 failed suites.
  - `node .skilled/commands/doctor/scripts/release-update.cjs --help`: lists `unlock`.
  - `python3 -c "[__import__('yaml').safe_load(open(f)) for f in __import__('sys').argv[1:]]" .skilled/commands/doctor/assets/doctor-update-align.yaml .skilled/commands/doctor/assets/doctor-update-apply.yaml`: exit 0.
  - `rg -n "DU-[0-9]|specs/|049|phase [A-D]" .skilled/commands/doctor/scripts/release-update.cjs .skilled/commands/doctor/scripts/tests/release-update.test.cjs`: no new match.

### Phase B checks

- [x] T071 Run the phase B checks and record their output and exit status (engine suite, doctor runner, YAML, router)
  - Engine suite: expect `tests 63`, `pass 63`, `fail 0`, exit 0. Fail-first for the four new tests.
  - `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: exit 0.
  - YAML parse for all three workflows: exit 0.
  - `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/doctor/update.md --type command`: exit 0.
  - `git check-ignore -v .skilled/release/runs/x .skilled/release/.apply.lock` in this repository: both match. `git check-ignore -q .skilled/release/base.json`: exit 1.
  - The three prompt-sync checks: `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check`: each PASS, exit 0.
  - Comment-hygiene grep from T070: no new match.

### Phase C checks

- [x] T072 Run the phase C checks and record their output and exit status (engine suite, runner, routes, contract, catalog, guard)
  - Engine suite: expect `tests 69`, `pass 69`, `fail 0`, exit 0. Fail-first for the six new tests.
  - `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: exit 0.
  - YAML parse for all five workflows and `_routes.yaml`: exit 0.
  - `bash .skilled/commands/doctor/scripts/route-validate.sh`: exit 0.
  - `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json','utf8'))"`: exit 0.
  - `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check`: no doctor router listed as drifted. Its exit was 1 at baseline because of three speckit routers (`plan.md`, `implement.md`, `complete.md`), so compare the drift list, not the exit code.
  - `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`: `STATUS=OK`, exit 0.
  - `node .skilled/bin/compiled-route-guard.cjs`: exit 0. It is the new battery command, run read-only here.
  - `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/doctor/update.md --type command` and `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .skilled/commands/doctor/update.md`: exit 0.
  - The three prompt-sync checks: PASS. Comment-hygiene grep: no new match.

### Phase D checks

- [x] T073 Run the phase D checks and record their output and exit status (engine suite, contract test, runner, contract, router)
  - Engine suite: expect `tests 71`, `pass 71`, `fail 0`, exit 0. Fail-first for the two new tests.
  - `node --test .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`: every test passes, exit 0. Each contract test fails when its assertion is pointed at the pre-phase text of its file.
  - `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: exit 0, node:test step over 10 files.
  - `generate-command-routers.cjs --check`: no doctor router drifted. `route-validate.sh`: exit 0. Command-contract JSON parse: exit 0.
  - `validate_document.py` and `check_authored_name_kebab.py` on `update.md`: exit 0. The router hint length, measured with `printf '%s' "<hint>" | wc -c`, is 128.
  - The three prompt-sync checks: PASS. Comment-hygiene grep: no new match.

### Closure

- [x] T074 Validate and reconcile the packet (`specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes/`)
  - Mark every `acceptance-criteria.md` row with its observed evidence, and fill `implementation-summary.md`.
  - Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes --strict` and require `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, T001 to T074
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance row Met, with the engine suite at 72 of 72 (one test more than planned, from the signal re-raise task) and `run-all.sh` exit 0 from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, Section 3 for the verdicts and decisions
- **Acceptance**: See `acceptance-criteria.md`
- **Research**: See `../005-doctor-update-research/research/research.md`, Sections 5, 11 and 12
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

The operator asked for every finding to be fixed, so in this packet the P2 findings are required, not optional.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md, one per finding plus the no-regression requirement
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the four decisions and their evidence
- [x] CHK-003 [P1] Dependencies identified and available: git, Node.js 20, Python 3 with PyYAML, the compiled-route guard
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/commands/doctor/scripts/release-update.cjs` and both test files pass
- [x] CHK-011 [P0] No finding id, spec path or packet number in any changed code comment, test name or message
- [x] CHK-012 [P1] Every new refusal exits 1 before the first target write and names its remedy
- [x] CHK-013 [P1] New code follows the sk-code-opencode JavaScript checklist
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met with observed evidence
- [x] CHK-021 [P0] Engine suite 72 of 72 (71 planned plus the signal re-raise test) and `run-all.sh` exit 0 from the final state
- [x] CHK-022 [P1] Every new engine test observed failing against the old engine
- [x] CHK-023 [P1] Error scenarios validated: live, stale and unreadable locks, digest mismatch, nearer release, dirty release record
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Class-of-bug: DU-01, DU-02, DU-09, DU-15. Cross-consumer: DU-03, DU-05, DU-10, DU-13, DU-14, DU-20. Algorithmic: DU-04, DU-11, DU-17. Matrix/evidence: DU-12, DU-16. Instance-only: DU-06, DU-07, DU-08, DU-18, DU-19, DU-21 to DU-26.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with the `rg` commands in `plan.md` addendum.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `skippedUnits`, `baseRecording`, `baseSource`, the dry-run result and the lock message.
- [x] CHK-FIX-004 [P0] The remote guard has adversarial tests: a flag value and a `base.json` value that start with `-`.
- [x] CHK-FIX-005 [P1] Matrix axes from `plan.md` addendum listed with their covered rows before completion is claimed.
- [x] CHK-FIX-006 [P1] The signal test runs with a preload that changes process-wide state, inside its own child process only.
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit of each phase, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any new file
- [x] CHK-031 [P0] Remote values starting with `-` refused from the flag and from `base.json`, and plan-path and rollback-path confinement unchanged
- [x] CHK-032 [P1] `unlock` never removes a lock whose owner is running or unreadable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized with what shipped
- [x] CHK-041 [P1] Every new function carries a WHY comment where its reason is not obvious
- [x] CHK-042 [P2] Scripts and tests READMEs, the command catalog row and the root README line updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only, and fixtures under the OS temp directory
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12 of 12 |
| P1 Items | 13 | 13 of 13 |
| P2 Items | 1 | 1 of 1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
