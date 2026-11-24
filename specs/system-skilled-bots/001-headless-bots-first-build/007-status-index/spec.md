---
title: "Feature Specification: Phase 7: status-index"
description: "No command tells an operator which bots are installed, when each last ran and whether its result was delivered. This phase builds a rebuildable SQLite index under the state root and a bots status command that merges it with launchctl print."
trigger_phrases:
  - "status index"
  - "phase 7 status index"
  - "bots status"
  - "bots status index sqlite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: status-index

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/007-status-index` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-launchd-installer |
| **Successor** | 008-hub-wiring |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is `Met`, and `bots status` shows installed, last run, delivery and missing-checkout states from the index alone |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: the status index, the `bots status` verb and retention. It reads what phases 3 and 6 write. It adds no trigger, no runner behavior and no install path. It does not route any mode. Routing is phase 8's.

**Dependencies**:
- `003-manual-runner`: writes the run records and evidence pointers the index is built from, and, per ADR-004, a generation stamp after each run record. Phase 3 owns it as REQ-015 and T026.
- `006-launchd-installer`: writes the hub-labeled plists whose state `launchctl print` reports, and an install record with the resolved runner path and the `.skilled` kind (checkout, symlink or vendored).
- `003-manual-runner` also writes needs-you items under `<state root>/<identity>/needs-you/`, owns `bots inbox` and holds a bot while it has an open item. `005-request-pipeline` owns `bots answer` (operator decision D12).
- `001-contracts-and-state-root`: fixes the run record shape, repository identity, the registered-roots list and the state-root layout this phase reads. Its ADR-006 (proposed) decides that two clones share one identity.
- The Predecessor row is folder order. Build dependencies are: phases 3 and 6, matching the parent phase map, with phase 1 before them.

**Deliverables**:
- A SQLite index in WAL mode under the state root, with `builtAt` and `--rebuild`.
- `bots status`, merging index rows with `launchctl print`.
- Row states for missing and unreadable checkouts, relink by identity and explicit unregister.
- Bounded, tested retention for index rows, run folders, skipped-slot summaries and closed needs-you items.
- Open needs-you items shown as their own rows.
- A reinstall flag for a schedule whose recorded runner path no longer resolves or points at a different tree.

**Operator decisions (2026-11-22)**: retention defaults are accepted (ADR-002). Run folders live in the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`, which git ignores. The SQLite index, the registered roots and needs-you items stay under the user-level state root. A run that needs a human parks as a needs-you item. A moved checkout or a changed `.skilled` is detected and reinstalled.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phases 3 and 6, bots run by hand and on launchd, but nothing answers "what is installed, what ran and did it deliver". Run records alone miss a bot that is installed and has never run, and `launchctl print` alone says nothing about what ran or whether the result was delivered (research.md §12). Reading run folders on every status call would also tie status to their layout and cost.

### Purpose
`bots status` answers from one derived index that can be deleted and rebuilt to the same rows, says when it is stale, and shows every installed bot, including those whose checkout moved or vanished.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The hub folder exists and is empty, and the binding the repository's coverage graph already uses is `better-sqlite3`, with WAL and foreign keys as its only pragmas.

```text
$ ls .skilled/skills/system-skilled-bots 2>&1; echo "exit=$?"
exit=0
$ rg -n "from 'better-sqlite3'|db.pragma" .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts
9:import Database from 'better-sqlite3';
342:    db.pragma('journal_mode = WAL');
343:    db.pragma('foreign_keys = ON');
$ rg -n '"better-sqlite3"' .skilled/skills/system-deep-loop/runtime/package.json
17:    "better-sqlite3": "^12.11.1",
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build a SQLite index under the state root in WAL mode, with a five-second busy timeout and `synchronous = FULL`, keyed by repository identity plus last known path (research.md §12).
- Record `builtAt` on every build and add `bots status --rebuild`, which drops the index and rebuilds it from run records.
- Add `bots status`, which merges index rows with `launchctl print` for each hub label.
- Add row states for a missing checkout and an unreadable checkout, relink a moved checkout by identity and add an explicit unregister that retires a repository and deletes nothing.
- Add bounded retention for index rows, run directories and the skipped-slot summary, with tests. The defaults are the ADR-002 numbers, read from `bots/config.json`.
- Show a row whose run folder vanished with the row state `run-folder-gone`, never a crash. A vendored tree re-pin can lose run folders.
- Show each open needs-you item as its own row, and bound answered and expired items with `retention.closedNeedsYouPerIdentity` (ADR-005, operator decision D10).
- Show a bot that has an open needs-you item with the row state `held` (operator decision D9).
- Flag a schedule as `needs-reinstall` when its recorded runner path no longer resolves or resolves to a different tree.

### Out of Scope
- Any dashboard, web page or app. The research scopes status to the terminal (parent scope).
- Writing or repairing plists. A moved checkout is repaired by running the phase 6 install again (research.md §7).
- New run record fields. Record changes go back through phase 1's spec.
- Routing the status mode. Phase 8 owns all routing.

### Files to Change

Paths assume the hub layout phase 1 picks. The folder `.skilled/skills/system-skilled-bots/` exists and is empty today.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Create | Open the index, set pragmas, build, rebuild, upsert from a run record and a needs-you item, retention |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Create | Merge index rows with `launchctl print`, assign row states, needs-you rows, the reinstall flag, relink and unregister |
| `.skilled/skills/system-skilled-bots/runtime/lib/launchctl-print.ts` | Create | Run `launchctl print` for one label and parse state, run count and last exit code |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Create | Rebuild parity, stale flag, retention bounds, terminal row immutability |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Create | Missing, unreadable, moved, never-run and launchd-failed rows |
| `.skilled/skills/system-skilled-bots/runtime/package.json` | Modify | Declare the SQLite binding ADR-001 settles, if an earlier phase created the file. Create it otherwise |
| `.skilled/bin/bots.cjs` (phase 3's CLI entry) | Modify | Wire the `status` verb and `--rebuild`, `--unregister` options |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots status` reads only the index and `launchctl print`. It never opens a run folder. Deleting the index file and running `bots status --rebuild` produces the same rows as before the delete. |
| REQ-002 | Every build writes `builtAt`. When the generation stamp the runner writes (ADR-004) is newer than the stamp the index last consumed, `bots status` prints that it is stale and prints `builtAt`. |
| REQ-003 | A checkout whose path is gone is shown with the row state `missing`, and no row is pruned because of it. A checkout whose path exists but cannot be read is shown as `unreadable`, never as `missing`. |
| REQ-004 | A bot installed by phase 6 that has never run, and a bot whose last fire failed at launchd level with no run record, are both shown as rows. |
| REQ-005 | The index opens in WAL mode with `busy_timeout = 5000` and `synchronous = FULL`. Index writes use a transaction, and derived files are written to a temp file and renamed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | When a registered root reports the same repository identity as a missing one, status relinks the rows to the new path and records the old path as the previous path. |
| REQ-007 | `bots status --unregister <identity>` retires a repository. Its rows stop showing by default. No file, run directory or plist is deleted. |
| REQ-008 | Retention keeps at most the numbers ADR-002 settles for index rows, run directories and skipped-slot summaries. A test fills past each bound and counts the result. |
| REQ-009 | A row in a terminal state is never updated. Retention may delete it, oldest first, and nothing else may change it. |
| REQ-010 | When the registered-roots list holds two present paths for one identity, `bots status` flags that identity and names both paths. It moves no rows between them. |
| REQ-011 | Run folders live in the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`. The index, the registered roots and needs-you items stay under the user-level state root. When a row's run folder is gone, status shows the row state `run-folder-gone` and exits 0. A rebuild keeps such a row from the old index, so its summary survives. Status only checks that the folder path exists and never reads inside it. |
| REQ-012 | Retention deletes run folders only under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` for the identity it is working on. It resolves each target path first and refuses one outside that folder. |
| REQ-013 | Status shows each open needs-you item as its own row with the row state `needs-you`, the item id, bot id and run id, and no question text. An open item past its expiry time shows as `expired`. Status never answers or closes an item. |
| REQ-014 | Retention keeps at most `retention.closedNeedsYouPerIdentity` (default 200, ADR-005) answered or expired needs-you items per identity, read from `bots/config.json`, oldest deleted first. It never deletes an open item and touches only `<state root>/<identity>/needs-you/`. |
| REQ-015 | Status flags a schedule as `needs-reinstall` when the runner path in phase 6's install record no longer exists, or when its real path now differs from the real path recorded at install. The flag names the fix, which is the phase 6 install. Status changes no plist. |
| REQ-016 | A bot with an open needs-you item shows the row state `held` on its row and names the item id. The state comes from the index's item rows at read time, and it clears once the item is answered or past its expiry. Status never writes a hold (operator decision D9). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With three recorded runs, `bots status --json` before and after deleting the index and running `--rebuild` prints identical rows, ignoring `builtAt`.
- **SC-002**: A fixture with one installed never-run bot, one launchd-failed bot, one missing checkout and one unreadable checkout prints four rows with the states `never-run`, `launchd-failed`, `missing` and `unreadable`. A fifth fixture checkout moved with the same identity shows its new path and its previous path.
- **SC-003**: After writing more runs than the retention bound, the index row count equals the bound and every remaining terminal row is byte-identical to its first write.
- **SC-004**: A fixture with one deleted run folder, one open needs-you item and one install record whose runner path was retargeted prints the row states `run-folder-gone`, `needs-you` and `needs-reinstall`, the open item's bot row prints `held`, and status exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Run record and state-root layout from phases 1 and 3 | The index cannot be built until the record shape is frozen | Build only from fields phase 1 fixes. A new field goes back through phase 1 |
| Dependency | Hub-labeled plists from phase 6 in `~/Library/LaunchAgents` | Never-run and launchd-failed bots cannot be shown | Phase 6 must be complete before this phase starts |
| Risk | Two clones of one repository share an identity, so relink could move rows to the wrong clone | High | Relink only when the original path is `missing` and exactly one other root matches, never when it is `unreadable` or present (ADR-003). Phase 1 ADR-002 proposes that clones share one identity on purpose |
| Risk | `man launchctl` says `print` output is not API, so its format can change | Med | The parser is best-effort and tolerant. It reads only state, run count and last exit code and skips any line it does not know. A parse failure shows as the explicit launchd state `unknown` on the row, never as `ok` and never as `launchd-failed` |
| Risk | A native binding fails to load under a new Node release | Med | ADR-001 weighs the built-in `node:sqlite` against `better-sqlite3`. Status prints a clear error and exits non-zero when the binding fails |
| Risk | The index and a running bot write at the same time | Med | WAL mode with a five-second busy timeout, as Hermes does (research.md §12) |
| Risk | A vendored tree re-pin or reinstall replaces `.skilled` and loses run folders | Med | The index row survives under the user-level state root and shows `run-folder-gone`. Run history inside the tree is best-effort. Phase 1 records what a re-pin does to `.skilled/skills/.state/` |
| Risk | Several consumer repos share one symlinked Skilled tree, so their run folders sit side by side | Med | Run folders are split by identity, and retention prunes only its own identity's runs folder (REQ-012) |
| Dependency | Phase 6 install record with the resolved runner path | High | Without it, `needs-reinstall` cannot be shown. Status then prints the schedule without the flag and says the record is missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `bots status` on an index of 1,000 rows and ten labels returns in under two seconds on the operator's Mac. The budget is a target to measure, not a measured number.
- **NFR-P02**: `--rebuild` over 1,000 run records finishes in under ten seconds. Also a target to measure.

### Security
- **NFR-S01**: The index lives under the user-level state root with mode 0600 and its folder with mode 0700. Nothing is written into a checkout. In the Skilled tree, this phase only deletes run folders under the identity's gitignored runs folder.
- **NFR-S02**: The index stores no secrets and no run output. It copies summary fields and evidence pointers only.

### Reliability
- **NFR-R01**: A crash during a build leaves the previous index readable. A rebuild writes a new file and renames it into place.
- **NFR-R02**: A missing path is not a failure, and an unreadable one is not missing (research.md §15 invariants).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no run records and no installed labels. `bots status` prints no rows, prints `builtAt` and exits 0.
- Maximum input: run records past the retention bound. The index keeps the newest rows up to the bound and drops the oldest terminal rows.
- Failure path: the index file is corrupt or the binding fails to load. `bots status` names the file, suggests `--rebuild` and exits non-zero. It never falls back to reading run folders.
- A label from `launchctl print` with no index row: shown as `never-run` when a hub-labeled plist exists for it, or `launchd-failed` when launchd reports a non-zero last exit code. The drain label `com.skilled.bots.<identity>.drain` (phase 2 ADR-004) is the repository's queue-drain agent and is never shown as a bot row.
- A bot with an index row and no label: shown as not installed, which is normal for a manual bot.
- A run folder deleted by hand or lost on an overlay re-pin: the row shows `run-folder-gone` and keeps its summary. Status exits 0.
- An open needs-you item for a bot that was later uninstalled: the item row still shows, since only the operator can close it.
- A `.skilled` symlink retargeted to another checkout: each schedule whose recorded runner real path differs shows `needs-reinstall`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three modules, two test files, one CLI verb. My estimate is 600 to 900 lines with tests |
| Risk | 10/25 | A native binding, a parser over `launchctl print` and relink rules that can move rows |
| Research | 8/20 | Retention numbers and the stale signal are open. The binding is answered by the repository |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered: the retention numbers for the index, the run directories and the skipped-slot summary are ADR-002's, Accepted by the operator (D5).
- Which signal tells status the index is stale without reading run folders? ADR-004 proposes a generation stamp the runner writes. Phase 3 must add that write to its spec before this phase builds.
- Does phase 1 give two clones of one repository the same identity? Its ADR-002 proposes yes, and it is not accepted yet. ADR-003's relink rule and REQ-010's flag hold either way.
- Answered by phase 1: the run record lives user-level at `<state root>/<identity>/records/<run id>.json`, never inside the run folder. A rebuild keeps a gone run's row from the record.
- Answered by the operator (D10): keep 200 closed needs-you items per identity through `retention.closedNeedsYouPerIdentity`. ADR-005, Accepted.
- Answered by phase 6: the install record is `<state root>/<identity>/installs/<bot-id>.json`. This phase reads it for REQ-015.
- Answered by the operator (Q003, 2026-11-23): `better-sqlite3@^12.11.1` is installed in the bots runtime. ADR-001 is Accepted.
- Open, found during the build: the runner writes the generation stamp after each record but does not add the run to the index. Plain `bots status` therefore reports `stale` after every run until `--rebuild`. The index exposes `indexRunRecord` and `indexNeedsYouItem` for the runner, which is outside this phase's files. Status never rebuilds an existing index's run rows on its own, so a stale read always says so.
- Answered by the operator (Q004, 2026-11-23): retirements are stored in the registered-roots file under the state root, rewritten by temp file and rename, and every build reads them, so a deleted and rebuilt index keeps an identity hidden. When no registered-roots file exists yet, `--unregister` writes the first one and says so; that is the one case where the state root's file count grows.
- Answered by the operator (Q005, 2026-11-23): plain `bots status` replaces the needs-you item rows of a stale identity from its item files, so an answer clears `held` without `--rebuild`. This is the one read status makes beyond the index, `launchctl print`, the install records and the registered roots; it never opens a run folder.
- Answered in the build: retention never prunes an answered item whose resume has not run (no resume request recorded yet, or its request still in `requests/inbox/` or `requests/claimed/`), nor the run folder of a run an open or such an item names. An identity whose checkout cannot be read gets no retention at all, rather than the defaults.
- Answered: phase 006's closure line now reads `**Closeable:** Yes`, and T001 prints three lines.
- Follow-up for ADR-002: run records under `<state root>/<identity>/records/` are never pruned. Index rows and run folders are bounded, but the records a rebuild reads grow without bound, and a rebuild reads all of them. A record bound needs its own decision, because records are the source a rebuild restores rows from.
<!-- /ANCHOR:questions -->

---
