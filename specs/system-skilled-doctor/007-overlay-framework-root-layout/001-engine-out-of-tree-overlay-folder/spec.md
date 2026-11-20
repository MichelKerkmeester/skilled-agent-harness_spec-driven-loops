---
title: "Feature Specification: Phase 1: engine-out-of-tree-overlay-folder"
description: "The doctor overlay engine refuses an overlayDir that leaves the vendored tree, so a consumer cannot keep its overlays beside the tree. This phase lets .skilled-overlays.json name one sibling folder and makes status, apply, guard, pre-commit, adopt, capture, relayout and every re-pin path work with it."
trigger_phrases:
  - "engine out of tree overlay folder"
  - "phase 1 engine out of tree overlay folder"
  - "sibling overlay folder overlayDir ../overlays"
  - "repin stage with a sibling overlay folder"
  - "backup area overlay entries"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: engine-out-of-tree-overlay-folder

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | ../002-engine-framework-root-source-layout/spec.md |
| **Handoff Criteria** | Sibling-folder fixtures pass, and the existing in-tree suite passes unchanged: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots specification. This phase runs in Skilled, this repository.

**Scope Boundary**: The doctor overlay engine `.skilled/commands/doctor/scripts/overlay-engine.cjs`, its tests under `.skilled/commands/doctor/scripts/tests/`, and one new test in `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`. No doc, workflow yaml or Barter file.

**Dependencies**:
- None upstream. This is the first phase.
- Node.js with the built-in `node --test` runner and the git CLI, both already used by the engine suite.

**Deliverables**:
- An engine that accepts `overlayDir: "../<one segment>"` and runs every command against a sibling overlay folder.
- Sibling-folder test cases in the engine suite and the guard core test, with the existing suite unchanged apart from the one refusal test that must flip.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`resolveOverlayDir` refuses any `overlayDir` that normalizes to `..` or starts with `../` (`overlay-engine.cjs:442-444`), so a consumer cannot keep its overlays beside the vendored tree, and every command exits 2 before it reads the manifest. Opening that gate alone is not enough: the re-pin backup, rollback, relayout backup and pre-commit pin check all key overlay-folder files as tree-relative paths (`:4508`, `:4529-4530`, `:5196`, `:6254-6257`, `:5706`), and `repin --stage` copies only the tree (`:5094`, `:5175`), so with a stage beside the tree the staged run would write the LIVE overlay folder's lock, repin-runs, pin and sync-state.

### Purpose
A consumer whose `.skilled-overlays.json` names `../<name>` runs status, apply, `--guard`, pre-commit, `--adopt`, `--capture`, `--relayout`, re-pin (live and `--stage`) and `repin --rollback` with the overlay folder beside the tree, while an in-tree folder behaves byte for byte as today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ mkdir -p <probe>/tree && printf '{ "overlayDir": "../overlays" }\n' > <probe>/tree/.skilled-overlays.json
$ node -e 'const e=require("./.skilled/commands/doctor/scripts/overlay-engine.cjs"); try { console.log(e.resolveOverlayDir(process.argv[1])) } catch (x) { console.log("Error: " + x.message) }' <probe>/tree
Error: .skilled-overlays.json names a folder outside the tree root: ../overlays
$ node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root <probe>/tree
[overlay-engine] .skilled-overlays.json names a folder outside the tree root: ../overlays
exit=2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Accept a normalized `overlayDir` of exactly `../<segment>` in `resolveOverlayDir` (`:442-444`), and keep refusing `..`, `.`, absolute paths, backslashes, NUL and deeper climbs such as `../../x` or `../a/b`.
- Record overlay-folder files in a re-pin backup as `"area": "overlay"` entries with overlay-relative paths in their own run subfolder, and restore each entry from its area in `repin --rollback`. Without this, every live and staged re-pin throws in `writeBackup` before its first write (`:4529-4530`).
- Make `repin --stage <dir>` copy the tree to `<dir>/<tree folder name>` and the overlay folder to `<dir>/<overlay folder name>`, and refuse a stage folder inside the live overlay folder. Without this, a stage beside the tree runs against the live overlay folder.
- Compute the relayout backup paths relative to the overlay root, and compute the pre-commit manifest git path from its absolute path. Without this, relayout throws at `:6254` and pre-commit loses its pin-change exemption when the tree is the git top level (`:5706-5710`).
- Add sibling-folder fixtures and cases for every command named in the Purpose, plus one guard core test.

### Out of Scope
- The `framework/` + `root/` naming rule, which becomes the default for every consumer - phase 002 owns it.
- Doctor docs and workflow yaml (`doctor-overlay-presentation.txt:557`, `doctor-overlay-repin.yaml:76`, `doctor-update-apply.yaml:187`) - phase 003 owns them, after the behavior exists.
- Any file in the Barter repository - phases 004 and 005 run there.
- Code at `:4670` and `:4988` - both compare the label as a tree-relative path and become no-ops with a sibling folder, which is the right result, so they stay as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | `resolveOverlayDir`, `writeBackup`, `backupLeaves`, `rollbackUnderLock`, the `--stage` branch of `repinRun` with `stageFolderProblem` and `copyTreeForStage`, `relayoutUnderLock`, `stagedUnownedChanges` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` | Modify | Option that puts the overlay folder at `workspace/overlays` with the setting `../overlays` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modify | The refusal test at `:102-105` asserts the new accept/refuse split |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Sibling-folder status, apply and capture cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Sibling-folder guard, adopt and pre-commit cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | Sibling-folder live re-pin, `--stage` and rollback cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modify | Sibling-folder relayout case |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | Modify | One case proving the guard core honours a sibling folder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `engine.resolveOverlayDir(tree)` returns `../overlays` for the settings `../overlays`, `../overlays/` and `a/../../overlays`, and throws an error naming `.skilled-overlays.json` for `..`, `../`, `.`, `/etc`, `C:\overlays`, a value holding NUL, `../../x` and `../a/b`. |
| REQ-002 | With an in-tree overlay folder every existing engine test passes unedited, apart from the refusal test at `overlay-engine-fixes.test.cjs:102-105`, and an in-tree re-pin writes a `backup.json` whose entries carry no `area` field. |
| REQ-003 | With the overlay folder at `workspace/overlays` and the setting `../overlays`, `status` exits 0 on an in-sync tree, `apply` writes each destination from its source, and `apply --capture` writes a live edit back into the sibling folder. |
| REQ-004 | With a sibling folder, a live re-pin exits 0 and its `backup.json` lists the manifest and `sync-state.json` as `"area": "overlay"` entries with overlay-relative paths, stored under a run subfolder separate from the tree backup. |
| REQ-005 | With a sibling folder, `repin --rollback` restores the manifest pin and `sync-state.json` byte for byte, and a run folder written before this change, with no `area` entries, still rolls back as it does today. |
| REQ-006 | With a sibling folder, `repin --stage <dir>` builds the staged tree at `<dir>/<tree folder name>` with the overlay copy at `<dir>/<overlay folder name>`, and the live manifest, live `sync-state.json` and live `repin-runs/` are byte-unchanged after the run. A stage folder inside the live overlay folder is refused with exit 2. |
| REQ-007 | With a sibling folder under strict writes, `--guard` refuses a write to an owned destination and allows a write to a file inside the sibling folder. |
| REQ-008 | With a sibling folder in the same git repository as the tree, pre-commit lets a re-pin commit through when the staged and HEAD pins differ. When the tree is the git top level, so the manifest sits outside the repository, pre-commit exits 2 with a line saying the overlay folder must sit inside the same repository. |
| REQ-009 | With a sibling folder, `apply --adopt <path>` writes the copy into the sibling folder and adds its manifest entry. |
| REQ-010 | With a sibling folder, `apply --relayout` exits 0 and backs up each moved source and the manifest at paths relative to the overlay root under `relayout-runs/<stamp>/`. An in-tree folder keeps today's `runDir/<overlayLabel>/...` layout (`overlay-engine-follow-up.test.cjs:1094,1098,1138-1139`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` holds a sibling-folder case beside the custom-overlayDir case at `:184`, and it shows an owned destination denied and a write inside the sibling folder allowed. It needs no change to `overlay-guard.cjs:61-64,71-74,81`, because a sibling folder always comes with the setting file. |
| REQ-012 | Sibling-folder tests assert the display text that names overlay paths, such as `../overlays/<source>`, relative to the tree root, as the inventory's display-only lines print it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with the sibling-folder cases included, and its pass count is the baseline count plus the new cases.
- **SC-002**: `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0 with the sibling-folder case included.
- **SC-003**: The probe tree from the Measured Behavior block no longer prints `names a folder outside the tree root: ../overlays`, and `status --root <probe tree>` exits 0 once the probe holds a manifest.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The engine test fixtures (`overlay-engine-fixtures.cjs:53-69`) always put the folder inside the tree | No sibling case can run until the fixture can place the folder at `workspace/overlays` | Add the fixture option first, as the first implementation task |
| Risk | `--stage` beside the tree, the layout the re-pin tests already use (`overlay-engine-repin.test.cjs:485`), resolves `../overlays` to the live overlay folder, so a staged run takes the live lock and writes the live `repin-runs/`, pin and `sync-state.json` | High | The stage copies the overlay folder too, and a test asserts the live manifest, `sync-state.json` and `repin-runs/` bytes are unchanged after `--stage` |
| Risk | A rollback of a run folder written before this change finds no `area` field | Med | Entries without `area` restore as tree paths exactly as today, and a test rolls back such a run folder |
| Risk | `a/../../outside` normalizes to `../outside` and becomes allowed | Low | The accept/refuse test names it as an accepted case on purpose, so the change is visible and reviewed |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the engine is a local CLI with no latency target. The only added work is one extra copy of the overlay folder during `repin --stage`.
- **NFR-P02**: N/A: the engine serves no requests, so it has no throughput target.

### Security
- **NFR-S01**: The overlay folder may climb at most one segment above the tree root. `resolveOverlayDir` refuses every other path that leaves the tree.
- **NFR-S02**: Every file a re-pin or relayout backup writes lands inside its run folder. No backup entry path resolves outside it, which `path.join(backupDir, rel)` at `:4543-4571` would allow for a `../` key.

### Reliability
- **NFR-R01**: A run folder written by the current engine still rolls back with the new engine.
- **NFR-R02**: A `repin --stage` run that fails at any step leaves the live tree and the live overlay folder byte-unchanged.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: `overlayDir: "../"` normalizes to `..` and stays refused; an empty string keeps today's non-empty-string error (`:435-437`).
- Maximum input: one parent segment is the limit. `../../x` and `../a/b` are refused, and `a/../../outside` is accepted because it normalizes to `../outside`.
- Failure path: a sibling folder with no manifest exits 2 with `no overlay manifest at ../overlays/overlay-manifest.json` from `loadManifest` (`:474-485`). Pre-commit with the manifest outside the git repository exits 2 with the same-repository line from REQ-008.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One engine file, seven functions, six engine test files and one guard test |
| Risk | 16/25 | The backup and rollback format gains a field, and the stage must never write live state |
| Research | 6/20 | The inventory in `../scratch/inventory/a-engine.md` already lists every site with its line |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Resolved (operator, 2026-11-20): only a direct sibling `../<name>` is allowed; deeper paths such as `../../x` or `../a/b` are refused.
- Resolved (operator, 2026-11-20): an overlay folder outside the git repository that holds the tree is refused; pre-commit exits 2 with a same-repository line.
- Resolved (operator, 2026-11-20): with a sibling folder, `--stage <dir>` holds `<dir>/<tree folder name>` and `<dir>/<overlay folder name>`; an in-tree folder stages as today.
- Resolved (operator, 2026-11-20): `.skilled-overlays.json` stays at the tree root, inside the vendored copy.
- Settled: a layout link may target a sibling overlay folder. No containment check applies to `link.target`: `planLayoutLinks` compares only the current and wanted targets (`overlay-engine.cjs:2473-2479`), and `relayoutLinkTargets` retargets links into moved copies (`:6104-6120`). Barter's two `.skilled/changelog/*` links (`overlay-manifest.json:146-153`) will be the first real links into a sibling folder. `copyTreeForStage` copies links as links (`:5106-5107`), so in a stage they resolve to the staged overlay copy only because the stage holds the overlay folder beside the tree. `tasks.md` T023 tests that.
<!-- /ANCHOR:questions -->

---
