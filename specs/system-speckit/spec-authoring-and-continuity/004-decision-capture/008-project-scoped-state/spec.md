---
title: "Feature Specification: Phase 8: project-scoped-state"
description: "Every project that links `.skilled` from one shared checkout writes its decision-capture queue and consumed log into one shared folder. A save in one project lists another project's sessions as orphans, and a key consumed in one project is hidden in all of them. This phase gives each project its own hashed subfolder, with a dual-read migration for the old root files."
trigger_phrases:
  - "project scoped state"
  - "phase 8 project scoped state"
  - "decision capture project token"
  - "linked projects share decision capture state"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: project-scoped-state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-gap-closure |
| **Successor** | 009-chat-answer-evidence |
| **Handoff Criteria** | Every acceptance criterion is Met, the decision-capture suites pass, and the two-project scratch run shows no shared queue or consumed key. 009 then plans its candidate evidence against the scoped queue. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the decision-capture series. It builds gap 2 of `../research/research.md`, as corrected by that file's §13 addendum and by `../research/synthesis-review.md` P1-1, P1-2, P2-5 and P2-6.

**Scope Boundary**: Where the decision-capture state lives and how its readers find it: `capture-core.mjs`, `decision-record-writer.ts`, the runtime API barrel, `match-decision-table.ts`, their tests, the state README, the hooks README, and the playbooks and catalog entry that read the state path. No change to the queue row format, the key format, a sweep, an adapter or the save step's wording.

**Dependencies**:
- `../research/research.md` §4 and §13, the design and its corrections.
- `../research/synthesis-review.md`, the review findings this phase answers.
- Parent goal D4: every test runs in a scratch project, never in this repository's `.skilled/skills/.state/decision-capture/`.
- Parent goal D6: the implementation worker and its fallback.

**Deliverables**:
- One canonical project token, computed the same way in ESM and TypeScript, and one state subfolder per project.
- A dual-read, single-write migration that keeps pre-fix answers and consumed keys visible.
- Tests for two projects, the token parity and the migration, and updated docs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`doctor:symlink` links `.skilled` whole, so every linked project resolves `.skilled/skills/.state/decision-capture/` to one shared folder. `--scan-orphans` lists every queue file in that folder with no project filter, so a save in one project names another project's sessions, and one `consumed.jsonl` serves every project, so a key consumed in one project is hidden in all of them. The path is also spelled three times: once in the hook core and once each in the writer and the matcher.

### Purpose
Each project reads and writes only its own decision-capture state, and no answer captured before the change goes missing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run on 2026-11-03 from the repository root. The last two commands ran in the session scratchpad: `app-a` and `app-b` each link `.skilled` to one `shared/.skilled` folder. `demo.mjs` calls `appendRecords(app-a, 'session-a', ...)` for one answer, appends that key to `consumed.jsonl` under `queueDir(app-a)`, then compares the two real queue folders and reads `readConsumedKeys(app-b)`. The consumed row was deleted before the matcher ran. Nothing was written under this repository's state folder.

```text
$ rg -n "QUEUE_RELATIVE_DIR =|STATE_DIR_SEGMENTS =" .skilled/hooks/decision-capture/lib/capture-core.mjs .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:39:const STATE_DIR_SEGMENTS = ['.skilled', 'skills', '.state', 'decision-capture'];
.skilled/hooks/decision-capture/lib/capture-core.mjs:38:export const QUEUE_RELATIVE_DIR = '.skilled/skills/.state/decision-capture';
.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:122:const STATE_DIR_SEGMENTS = ['.skilled', 'skills', '.state', 'decision-capture'];
exit=0
$ sed -n 280,290p .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
function runScan(projectRoot: string): number {
  const directory = stateDir(projectRoot);
  let entries: string[];
  try {
    entries = fs.readdirSync(directory);
  } catch {
    entries = [];
  }

  const consumedKeys = new Set(readConsumedRows(projectRoot).map((line) => line.key));
  let listed = 0;
$ rg -c "projectToken|stateDirPath" .skilled/hooks/decision-capture/lib/capture-core.mjs .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
exit=1
$ node demo.mjs app-a app-b   # app-a and app-b each link .skilled to one shared folder
queueDir(app-a) === queueDir(app-b) after realpath: true
readConsumedKeys(app-b) holds app-a key: true
exit=0
$ node match-decision-table.js --scan-orphans --project-root app-b
1 session-a
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `projectToken(projectDir)` to `capture-core.mjs`: the first 12 hex characters of the SHA-256 of one canonical root. The root is the git top-level of the given directory, passed through `realpath`; outside a git repository it is the `realpath` of the given directory. The helper resolves the root itself, so every producer agrees whatever directory it passes. `queueDir` becomes `<root>/.skilled/skills/.state/decision-capture/<projectToken>/`.
- Export `stateDirPath(projectRoot)` from `decision-record-writer.ts` with the same root rule and token. `consumedLogPath` and `recordConsumedKeys` use it, and `match-decision-table.ts` deletes its own `STATE_DIR_SEGMENTS` and `stateDir` and calls `stateDirPath`.
- Read both locations and write only the new one. `capture-core` `readQueue` and `readConsumedKeys`, the matcher's `readQueueRecords`, and the writer's `readConsumedRows` union the project subfolder and the legacy root files, deduplicated by key. `--release` removes the key from whichever log holds it, the legacy root `consumed.jsonl` included. `--scan-orphans` lists only the project subfolder.
- Add tests: two linked projects stay apart, the ESM and TypeScript tokens agree for a root, a subfolder, a symlinked path and a non-git folder, and a seeded root queue file and root consumed row stay visible.
- Update the state README and the hooks README, and point the playbooks and catalog entry that read the state path at the project subfolder.

### Out of Scope
- A project-local state folder outside `.skilled`, such as `<project>/.decision-capture/` - rejected: it adds an untracked folder to every linked project, each needing its own ignore rule. See `plan.md` §3.
- Real-path containment for the state folder - the review's P2 `symlinked_queue_path_escape` (`../review/review-report.md:124-132`) stays open as a sanctioned-link exception. A strict check would reject every linked project, because the sanctioned `.skilled` link resolves outside the project root.
- A `project` field on queue or consumed rows - the subfolder scopes the data, and a row field would leave the filtering to every reader.
- Moving pre-fix root files into subfolders - the old root cannot say which project wrote a file, so dual-read keeps it visible and the README says how to clear it.
- Changing `doctor:symlink` - it cannot help a whole `.skilled` link and it changes every skill's state folder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Modify | Canonical root, `projectToken`, scoped `queueDir`, dual-read in `readQueue` and `readConsumedKeys` |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Modify | Two-project case, migration case, token value and fallback cases |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modify | Export `stateDirPath`; `consumedLogPath` uses it; `readConsumedRows` reads both logs; `recordConsumedKeys` writes only the project log |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts` | Modify | Re-export `stateDirPath` and the legacy log path the matcher's `--release` needs |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Modify | ESM and TypeScript token parity; legacy consumed rows read, never rewritten |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Modify | Delete `STATE_DIR_SEGMENTS` and `stateDir`; dual-read `readQueueRecords`; `--release` walks both logs; `--scan-orphans` lists the subfolder only |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts` | Modify | Two-project scan, legacy queue read, legacy `--release`, root queue not listed |
| `.skilled/skills/.state/decision-capture/README.md` | Modify | Structure with `<project-token>/`, the legacy root files, cleanup, the sanctioned-link note |
| `.skilled/hooks/README.md` | Modify | The decision-capture row names the per-project subfolder |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-{claude-hook,transcript-sweeps,kill-switch-conversation,live-conversation,sibling-reproof-conversation,save-writer}.md` | Modify | Resolve the queue folder through `queueDir` instead of the flat root, so no check reads an empty root and passes |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modify | Name the per-project subfolder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Two scratch projects whose `.skilled` links to one shared folder keep apart: an answer appended through project A lands in A's token subfolder, `readConsumedKeys(B)` does not hold A's consumed key, and `match-decision-table.js --scan-orphans --project-root B` prints `no session queues with pending records`. |
| REQ-002 | `queueDir(dir)` in `capture-core.mjs` and `stateDirPath(dir)` in `decision-record-writer.ts` return the same path for a git project root, a subfolder of it, a symlinked path to it and a folder outside git. The last path segment is the first 12 hex characters of the SHA-256 of the canonical root. |
| REQ-003 | With a root queue file and a root `consumed.jsonl` row seeded from before the change, `readQueue`, `pendingRecords`, the matcher's `--session` mode and `readConsumedRows` all see the legacy rows; `appendRecords` and `recordConsumedKeys` write only into the project subfolder and never append a key a legacy file already holds; `--release <key>` removes a key held only in the root `consumed.jsonl`. |
| REQ-004 | The decision-capture suites pass: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` and the writer and matcher vitest suites, plus the claude and devin adapter tests, the Pi vitest and `hook-session-stop.vitest.ts`, which read the queue. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `match-decision-table.ts` holds no copy of the state path: `rg -c 'STATE_DIR_SEGMENTS' .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` prints nothing, and the writer holds the one TypeScript copy. |
| REQ-006 | `--scan-orphans` lists only the project subfolder: a pending answer in a root queue file is not listed. |
| REQ-007 | The state README shows `<project-token>/` in its structure table and describes the legacy root files and how to clear them; the hooks README and the catalog entry name the subfolder; no playbook reads `.skilled/skills/.state/decision-capture/*.jsonl` at the flat root. |
| REQ-008 | The state README and this packet record that the token scopes data but does not contain it: the state folder may resolve outside the project through the sanctioned `.skilled` link, and the review's `symlinked_queue_path_escape` finding stays open for that reason. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The scratch two-project run from Measured Behavior, rerun on the new code, prints `false` for both comparisons and the matcher prints `no session queues with pending records` for `app-b`.
- **SC-002**: The `rg -c "projectToken|stateDirPath"` command from Measured Behavior prints a count for all three files, and `rg -c 'STATE_DIR_SEGMENTS'` on the matcher prints nothing.
- **SC-003**: `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/008-project-scoped-state --strict` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git` on the PATH for the top-level lookup | Without it every producer falls back to `realpath` of the directory it was given, so a run from a subfolder gets a different token | The fallback is the operator's rule for a folder outside git; a test pins it, and the hooks already need `git` for the save step |
| Risk | The ESM and TypeScript token code drift apart | High: a hook would write one folder and the save would read another, and answers would look lost | The parity test imports `capture-core.mjs` from the writer suite and compares paths for four directory shapes |
| Risk | A pre-fix answer is offered twice or lost at the switch | Med: a duplicate decision row or a missing one | Dual-read on every reader, dedup by key, and a migration test seeded with a root queue file and a root consumed row |
| Risk | A playbook check reads the empty flat root and passes | Med: a broken capture would go unnoticed, as 007's missed playbook did | The six playbooks resolve the folder through `queueDir`; `rg` for the flat glob must print nothing |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The root lookup runs `git rev-parse --show-toplevel` at most once per directory per process, memoized, so a hook that calls `queueDir` several times pays for one `git` call.
- **NFR-P02**: The `git` call has a 5 second timeout, as `gitTopLevel` in `config.ts` does, and a timeout falls back to `realpath`; the hook adapters' 3000 ms stdin deadline is unchanged.

### Security
- **NFR-S01**: The token is a one-way hash, so the folder name does not reveal the project path.
- **NFR-S02**: New folders keep mode `0o700` and new files `0o600`, as today.

### Reliability
- **NFR-R01**: A failed root lookup never fails a hook: it falls back to `realpath`, then to the absolute path, and the adapters' fail-open catch is unchanged.
- **NFR-R02**: The `git` call ignores `GIT_DIR` and `GIT_WORK_TREE` from the environment, so a hook started inside another repository's git hook still hashes its own project.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a project with no state folder reads no rows, creates nothing until an answer is appended, and `--scan-orphans` prints `no session queues with pending records`.
- Maximum input: a legacy root that holds many sessions' queues stays readable by each session's own save; `--scan-orphans` lists none of them, and the README tells the operator to save or delete them.
- Failure path: a directory that does not exist, or a `git` that fails, resolves to the absolute path given; a test pins that fallback so it cannot throw.
- Nudge cursor: the `.nudge` file moves into the subfolder, so a session that spans the switch may show its pending count once more. No answer is lost.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 production files, 3 test files, 9 docs; about 350 lines |
| Risk | 14/25 | A persisted layout moves; two token implementations must agree; a migration covers four readers |
| Research | 4/20 | Done in `../research/research.md` §4 and §13 and `../research/synthesis-review.md` |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Legacy root queues in `--scan-orphans`? Decided by the operator: the scan lists only the project subfolder; the README records the one-time cleanup.
- Containment or exception for `symlinked_queue_path_escape`? Decided by the operator: a sanctioned-link exception; the finding stays open.
- A project whose `.skilled` sits below its git top-level would keep its state under the top-level, because the root rule takes the top-level first. No linked project has that shape today. The build follows the operator's rule and raises the case only if a test or a live project hits it.
<!-- /ANCHOR:questions -->

---
