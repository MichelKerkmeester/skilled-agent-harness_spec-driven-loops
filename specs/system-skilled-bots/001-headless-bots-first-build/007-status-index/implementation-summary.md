---
title: "Implementation Summary"
description: "bots status now answers from a rebuildable SQLite index under the state root, merged with the installer's records and launchctl print; both reviews are closed, all 16 rows are Met and the live status check passed on 2026-11-23."
trigger_phrases:
  - "status index implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/007-status-index"
    last_updated_at: "2026-11-23T11:20:00Z"
    last_updated_by: "implement-007-status-index"
    recent_action: "Fixed the first review findings"
    next_safe_action: "Second review, then the live status check"
    blockers:
      - "AC-005 and T017 wait on the live check the orchestrator runs"
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/status-index.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/status.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/launchctl-print.ts"
      - ".skilled/bin/bots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-007-status-index"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the runner add each run to the index, so plain status is not stale after every run?"
    answered_questions:
      - "Q003: install better-sqlite3@^12.11.1 (Yes, install it)"
      - "Q004: keep retirements in a file (registered-roots)"
      - "Q005: plain status refreshes a stale identity's item rows"
      - "Q006: the live status check may run after the second review"
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
| **Spec Folder** | 007-status-index |
| **Completed** | 2026-11-23: 16 of 16 rows Met. The second review APPROVED, and the live status check passed (Q006) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots status` now shows every installed bot, its last run and delivery, and each open needs-you item, from one SQLite file you can delete and rebuild to the same rows. It says when that file is older than the runs, and it shows a checkout that moved, vanished or cannot be read instead of dropping its rows.

### Phase 7: status-index

- **The index.** `<state root>/index/status.sqlite`, owner-only in an owner-only folder, opened with `journal_mode = WAL`, `busy_timeout = 5000` and `synchronous = FULL`. It is built only from the run records and needs-you item files under the state root, never from a run folder. A run row holds a summary (ids, times, exit, refusal cause, run folder path, skipped slots cut to the bound) and is written once with `INSERT OR IGNORE`. Delivery outcomes, which a later pass rewrites into the record, sit in their own table with channel and state only, never the target, which can carry a token. Item rows hold ids and times, never the question or the answer.
- **Rebuild.** `bots status --rebuild` builds a new file beside the old one with a rollback journal, closes it, removes any write-ahead side file the old file left, and renames it into place, so a crash mid-build leaves the old index readable. Every build writes `builtAt` and the generation stamp it consumed per identity, read before the records, so a run that lands during the build shows as stale rather than as missed.
- **Stale.** Plain `bots status` builds the index only when the file does not exist yet. It never re-reads the runs of an existing one, so when a generation stamp is newer than the one the index consumed it prints `stale`, the identities and `builtAt`. For such an identity it does replace the needs-you item rows from the item files (Q005), so an answer clears `held` at once while the index still reads stale.
- **Retention.** Bounds come from `bots/config.json` of the identity's first present, readable checkout (`retention.*`, defaults 1000, 200, 100, 200); an identity with no readable checkout gets no retention at all and is named in the build report. A build plans run folders past the per-bot bound, index rows past the per-identity bound (oldest first) and closed items past their bound, removes the rows in the new file, and deletes the files only after the new file is renamed into place, so a failed build deletes nothing. Never pruned: an open item, an answered item whose resume has not run (no resume request recorded, or its request still in `requests/inbox/` or `requests/claimed/`), and the run folder of a run either names. A run folder is deleted only when it is a real folder directly inside `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`, checked on the path and on its real path; a link, or a path into another identity's folder, is refused and listed. Run records are never deleted, so a rebuild reapplies the same bound and lands on the same rows.
- **Row states.** A bot row lists every state that applies in `flags` and shows the first in this order: `retired`, `missing`, `unreadable`, `needs-reinstall`, `held`, `launchd-failed`, `run-folder-gone`, `unknown`, `never-run`, `ok`. Open items are their own `needs-you` rows, or `expired` past their expiry. A checkout path is `missing` only on `ENOENT` or `ENOTDIR`; any other failure, or a path that exists but cannot be read, is `unreadable` and is never relinked. A run folder is gone only on `ENOENT` or `ENOTDIR`, so a runs folder that cannot be read never reads as gone.
- **Relink and clones.** A `missing` path is relinked when exactly one other registered checkout is present and still resolves to the same identity under `jobEnv`; the row shows the new path and `previousPath`. Two present checkouts of one identity are named in `duplicateRoots` and no row moves.
- **Installed state.** Read through the installer, never restated: `checkInstalls` over the identity's install records and agents folder, `checkInstallsFor` for each present checkout to add `identity-changed` and `state-root-changed`, and `jobCheckout` for the checkout a job file's `--repo` names. A `needs-reinstall` row names the reasons and the fix `bots schedule install <id>`. Status writes no job file.
- **launchd.** `launchctl print gui/<uid>/<label>` through the installer's seam, for bot labels only (the drain label is never a bot row). Status 113 is not loaded; another non-zero status, or output whose top-level `state`, `runs` and `last exit code` do not parse, is `unknown`. Nested blocks and repeated fields are never read as the service's own.
- **The verb.** `bots status [--json] [--rebuild] [--all] [--unregister <owner/name>]`. The state root resolves under `jobEnv` like every other verb. The status modules load only in this branch, so a native binding that fails to load can break status and never `bots disable`. An index failure exits 1 and names the file and `run bots status --rebuild`. `--unregister` writes the retired identity into the registered-roots file by temp file and rename (Q004), mirrors it into an index already in place, and builds nothing, so no retention runs and nothing is deleted; `--all` shows it again. With no registered-roots file yet it writes the first one and says so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Create | Open with the pragmas, build and rebuild, run and item rows, retention, stale stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Create | Merge index rows with install checks and launchd, row states, relink, clones, unregister, text output |
| `.skilled/skills/system-skilled-bots/runtime/lib/launchctl-print.ts` | Create | `print` through the installer seam and a tolerant parser |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Create | 13 cases: pragmas, damaged file and binding, parity, stale, retention bounds, immutability, prune boundary, item retention, pending resume, an open item's run folder, unreadable checkout, failed build deletes nothing, empty root |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Create | 20 cases: parser, every row state, relink, clones, needs-you, held without a rebuild, reinstall, unregister, seven through the real CLI |
| `.skilled/skills/system-skilled-bots/runtime/package.json`, `package-lock.json` | Modify (shared) | `better-sqlite3` `^12.11.1`, on operator answer Q003. The lock adds only the binding's tree |
| `.skilled/bin/bots.cjs` | Modify (shared) | The `status` verb and its four options, loaded lazily |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify (contract, outside the table) | `statusIndexFile`, because the module says no caller joins a state path by hand and `index` is a folder; `readRetiredIdentities` and `retireIdentityRoots` keep retirements in the registered-roots file, and `registerRoot` writes that list back unchanged |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modify (shared, outside the table) | Exported `jobCheckout(label)`, the `--repo` of one job file, so status reuses the installer's private lookup instead of parsing job files itself |
| `.skilled/skills/system-skilled-bots/runtime/lib/better-sqlite3.d.ts` | Create (outside the table) | Type declaration for the binding, the same shape the deep-loop runtime declares, with the `simple` pragma option |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-support.ts` | Create (outside the table) | Shared fixtures: records, items, install records with rendered job files, a launchctl stand-in, captured-format print output |
| `scratch/live-status-check.sh` | Create | The live check on one held-disabled label, run 2026-11-23 (`scratch/live-status-result.txt`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement` in autonomous mode in the worktree, with the review and save steps left to the orchestrator. No real scheduler call ran: every library test hands status a temp agents folder and an in-memory launchctl that answers only `print`, and every CLI test loads `tests/fixtures/launchctl-intercept.cjs` with a temp account home. Only plutil is real, run on files in temp folders.

1. Baseline: 31 files, 322 tests, exit 0 (`scratch/bots-suite-baseline.txt`). `~/Library/LaunchAgents` hashed first (`scratch/launchagents-hash-before.txt`).
2. `npm install better-sqlite3@^12.11.1` in the runtime, on operator answer Q003: exit 0, 12.11.1, the binding opened `:memory:`. The lock diff only adds the binding's tree.
3. The three modules, the contract helpers, the CLI verb, then the two test files and their support file. Both suites passed, 26 of 26.
4. Thirteen mutation controls (`scratch/mutation-controls.txt`). Of the first ten, eight failed their tests at once and two survived: judging every stat failure missing reached a branch no fixture hit, so a locked-parent case was added and the rerun failed; removing the link check alone was caught by the real-path check behind it, and removing both failed the boundary test. Removing one identity-folder check alone is caught by the other; removing both failed.
5. Whole suite and typecheck, the grep gates, a timing run, and the `~/Library/LaunchAgents` hash again.

6. First review (REQUESTED_CHANGES), fixed: retirements moved to the registered-roots file (Q004); unregister builds no index; retention keeps answered items whose resume has not run and the run folders open or such items name; an unreadable checkout gets no retention; plain status refreshes a stale identity's item rows (Q005); deletions wait for the rename. Eight mutation controls, R1 to R7 plus a no-op sanity control, each fix's control failing its test (`scratch/mutation-controls.txt`). Whole suite twice: 33 files, 355 tests, exit 0.

### Operator steps

- Show: `bots status` or `bots status --json`. It builds the index the first time, and every build applies retention: on a large state root the first call can delete run folders past the per-bot bound and closed needs-you items past theirs.
- After runs: `bots status --rebuild` when it says `stale`.
- Retire a repository: `bots status --unregister owner/name`. `--all` shows it again.
- A damaged index: `bots status --rebuild`. Nothing but the index holds index state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001 Accepted: `better-sqlite3` in the hub's own dependency root | The operator approved the install (Q003); the same range as the deep-loop and advisor runtimes |
| Delivery and items in their own mutable tables; run rows never updated | The delivery pass rewrites a record after the run, so a run row that carried delivery could not stay byte-identical |
| Relink is computed at read time, never written | A relink written into a run row would update a terminal row, and a rebuild would lose it anyway |
| Plain status never re-reads an existing index's runs, but refreshes a stale identity's item rows | Otherwise the stale signal could never show; the operator chose to clear `held` on answer without a rebuild (Q005) |
| No retention for an identity whose checkout cannot be read | Its config may have raised the bounds; the defaults could delete what it meant to keep |
| Retirements live in the registered-roots file | Q004: an index-only retirement broke delete-and-rebuild parity. That file already exists once any checkout is registered, so the count holds; the list sits beside the roots it retires |
| Unregister builds nothing | Building there ran retention and could delete files while the verb said nothing was deleted |
| Deletions happen after the rename | A build that fails must leave the files the old index still names |
| A link or a foreign path in the runs folder is refused, not followed | Retention may delete only what it owns; refused paths are listed in the build report |
| The index drops the delivery target | A webhook target can carry a token, and status needs only the channel and the outcome |
| Print fixtures are written in the documented format, not captured from this Mac | Capturing one would mean a live `print`; the parser reads only three fields and treats anything else as unknown |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Status suites | `Test Files  2 passed (2)`, `Tests  33 passed (33)`, no skipped test |
| Whole bots suite, twice | After the review fixes: `Test Files  33 passed (33)`, `Tests  355 passed (355)`, exit 0, both runs (`scratch/bots-suite-after-1.txt`, `-2.txt`). Baseline 322; the delta of 33 is the status cases |
| `npm run typecheck` | exit 0 (`scratch/typecheck-after.txt`) |
| Mutation controls | 13 from the build and 8 from the review fixes; every guard is caught by a failing test, alone or with its twin (`scratch/mutation-controls.txt`) |
| Grep gates | No `bootstrap` or `.plist` in the status files (exit 1); the only launchctl call is `print`; no em dash and no spec id in the new code (`scratch/grep-gates.txt`) |
| `~/Library/LaunchAgents` | Hash `9b45b717...` before the first build, before the review-fix suite and after it (`scratch/launchagents-hash-before.txt`, `-before-fixes.txt`, `-after.txt`); no `com.skilled.bots.` file |
| Timing | Rebuild over 1,000 records 38 ms; status over 1,000 rows and ten bots 3 ms, with no installed label, so no real print ran (`scratch/perf.txt`) |
| Acceptance criteria | 16 of 16 Met. AC-005 by the live check: a held-disabled bot shows installed and `never-run` through a real `launchctl print` |
| Live check (T017) | Not run by the builder. Approved (Q006); the orchestrator runs `scratch/live-status-check.sh` after the second review |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stale after every run.** The runner writes the generation stamp but does not call `indexRunRecord`, so status reads `stale` after each run until `--rebuild`. Wiring the runner is outside this phase's files.
2. **Run records are never pruned.** Index rows and run folders are bounded, the records a rebuild reads are not. Recorded as a follow-up for ADR-002 in `spec.md`.
3. **Real print output is unverified here.** The parser was tested against the documented format; the live script records a real `print` of a held label.
4. **The timing target with real labels is unmeasured.** Each installed label costs one `launchctl print`.
5. **First unregister on a bare state root.** With no registered-roots file yet, `--unregister` writes the first one, so that one call grows the file count; it says so.
6. **Second-review P2 follow-ups, not fixed.** The second review approved the phase and left six suggestions:
   - A quarantined resume counts as run, so retention can later prune its answered item. The fix is to count a resume as run only when its request is in `done/`.
   - Plain `bots status`'s first build, and retired identities, get retention.
   - A rebuild removes the WAL and SHM files of an index another process holds.
   - `--unregister` reports failure after the retirement was already written.
   - A damaged registered-roots file throws instead of naming itself.
   - A retired identity stays hidden after a reinstall.
<!-- /ANCHOR:limitations -->
