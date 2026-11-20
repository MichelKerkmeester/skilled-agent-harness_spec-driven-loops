---
title: "Implementation Plan: Phase 1: engine-out-of-tree-overlay-folder"
description: "Widen the overlay engine's folder boundary so .skilled-overlays.json may name one sibling folder, and give overlay-folder files their own key namespace in the re-pin and relayout backups. The stage copies the overlay folder beside the tree copy so a staged run writes nothing live."
trigger_phrases:
  - "engine out of tree overlay folder plan"
  - "sibling overlay folder backup area plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: engine-out-of-tree-overlay-folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, one file: `.skilled/commands/doctor/scripts/overlay-engine.cjs` (6419 lines) |
| **Framework** | None. Node built-ins only |
| **Storage** | JSON files in the overlay folder: `overlay-manifest.json`, `sync-state.json`, `repin-runs/<id>/backup.json`, `relayout-runs/<stamp>/` |
| **Testing** | `node --test` over `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` and `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` |

### Overview
The phase runs in Skilled. It changes seven functions in `overlay-engine.cjs`: `resolveOverlayDir` accepts `../<one segment>`, and the backup, rollback, stage, relayout and pre-commit paths stop treating overlay-folder files as tree-relative keys. Sibling-folder cases in the existing test files prove each command, and the unedited in-tree suite proves nothing changed for today's consumers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 on the starting tree, and its pass count is recorded in `tasks.md` T001
- [ ] `status --root <probe tree>` on a probe whose setting names `../overlays` prints the Measured Behavior refusal and exits 2
- [ ] The parent's open questions this phase depends on have the defaults listed in `spec.md` §10

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 and `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same functions and lines
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Widened path boundary. Inside one CLI module, a path belongs to one of two roots, the tree root or the overlay root, and each write is keyed against the root it lives under.

### Key Components
- **`resolveOverlayDir` (`:424-446`)**: accepts a normalized value of exactly `../<segment>`, where the segment is not `..`. It keeps refusing `..`, `.`, absolute paths, backslashes, NUL and deeper climbs. `createContext` (`:455-466`) already joins `..` correctly, so it needs no change.
- **`writeBackup` (`:4523-4572`) and `backupLeaves` (`:4505-4509`)**: when the overlay root is outside the tree, the manifest, `sync-state.json` and any other overlay-folder path become entries with `"area": "overlay"` and a path relative to the overlay root. Their bytes are stored under a separate subfolder of the run folder, not under `backup/`. Entries with no `area` are tree paths exactly as today. An in-tree folder keeps today's keys, so its `backup.json` is unchanged.
- **`rollbackUnderLock` (`:5190-5196`) with `normalizedRelative` (`:4221-4226`)**: restores each entry against the root its area names. An entry without `area` restores against the tree root, so an old run folder rolls back as before.
- **The `--stage` branch of `repinRun` (`:5131`, stage at `:5156-5176`), `stageFolderProblem` (`:5076-5083`) and `copyTreeForStage` (`:5094`)**: with a sibling folder, the tree is copied to `<dir>/<tree folder name>` and the overlay folder to `<dir>/<overlay folder name>`, and the staged context is built on `<dir>/<tree folder name>`. The sibling then resolves inside the stage. `stageFolderProblem` also refuses a stage folder inside the live overlay folder. With an in-tree folder the stage is unchanged.
- **`relayoutUnderLock` (`:6215-6267`, backup at `:6252-6257`)**: computes backup paths relative to the overlay root when the folder is a sibling. It keeps today's `runDir/<overlayLabel>/...` layout for an in-tree folder.
- **`stagedUnownedChanges` (`:5688`, manifest path at `:5706-5710`)**: builds the manifest's git path from the absolute manifest path relative to the git top level, not `prefix + path.relative(ctx.root, ...)`. When that path leaves the repository, pre-commit exits 2 with a line saying the overlay folder must sit inside the same repository.
- **`createWorkspace` in `tests/overlay-engine-fixtures.cjs:53-69`**: gains an option that puts the folder at `workspace/overlays` and writes the setting `../overlays`. No sibling test can run without it.

Left as they are: the display strings in the inventory's display-only list print `../overlays/...` relative to the tree root, as given. `:4670` and `:4988` compare the label as a tree-relative path and become no-ops with a sibling folder, which is correct. The guard core (`overlay-guard.cjs:61-64,71-74,81`) asks the engine for the manifest path, and `strictWriteRefusal` allows a path outside the tree (`:5439`).

### Data Flow
`.skilled-overlays.json` gives the label. `resolveOverlayDir` validates it, and `createContext` joins it onto the tree root to give `overlayRoot`. Destination paths stay keyed against the tree root. Manifest, state, sources and run folders are keyed against the overlay root. A backup entry records its area so rollback can join it onto the right root.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

This addendum applies: the change widens a path boundary, changes a persisted format (`backup.json`) and touches the write guard.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveOverlayDir` (`:442-444`) | Producer of the overlay label; refuses every `../` value | update | `overlay-engine-fixes.test.cjs` accept/refuse table |
| `writeBackup`, `backupLeaves` (`:4505-4572`) | Producer of `backup.json` entries | update | `overlay-engine-repin.test.cjs` live sibling case reads `backup.json` |
| `rollbackUnderLock`, `normalizedRelative` (`:5190-5196`, `:4221-4226`) | Consumer of `backup.json` entries | update | `overlay-engine-repin.test.cjs` rollback cases, new and old run folder |
| `repinRun` stage branch, `stageFolderProblem`, `copyTreeForStage` | Owner of where a staged run writes | update | `overlay-engine-repin.test.cjs` byte-unchanged live overlay folder |
| `relayoutUnderLock` (`:6252-6257`) | Producer of the relayout backup | update | `overlay-engine-follow-up.test.cjs` sibling case and `:1094,1098,1138-1139` |
| `stagedUnownedChanges` (`:5706-5710`) | Pre-commit pin-change exemption | update | `overlay-engine-strict-writes.test.cjs` nested-tree and top-level-tree cases |
| Display strings (inventory display-only list) | Print overlay paths relative to the tree root | unchanged | Sibling cases in `overlay-engine-sync.test.cjs` assert `../overlays/` text |
| `:4670`, `:4988` | Filter by tree-relative label | unchanged, vacuous with a sibling | `git diff` of the phase shows no hunk at either line |
| Guard core `overlay-guard.cjs:61-64,71-74,81` | Asks the engine for the manifest, spawns `--guard` | unchanged | New case in `overlay-guard.test.cjs` |
| `doctor-overlay-repin.yaml:76`, `doctor-update-apply.yaml:187`, `doctor-overlay-presentation.txt:557` | Resolve or describe the folder themselves | not this phase; phase 003 | `git status --porcelain .skilled/commands/doctor/assets` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'relativeKey\((root|ctx\.root), (ctx\.(manifestPath|statePath)|runDir|move\.from|leaf)' .skilled/commands/doctor/scripts/overlay-engine.cjs`. Every hit is handled or listed above.
- Consumers of changed symbols: `rg -n 'overlayRoot|overlayLabel|backup\.entries|stageFolderProblem' .skilled/commands/doctor .skilled/hooks/overlay-guard --glob '*.cjs' --glob '*.yaml' --glob '*.md'`.
- Matrix axes: folder location (in-tree, sibling) by command (status, apply, capture, adopt, guard, pre-commit, relayout, live re-pin, `--stage`, rollback) gives 20 rows. The pre-commit row adds git layout (tree nested in the repository, tree is the git top level), and rollback adds run-folder age (with `area`, without `area`), for 22 rows. The in-tree rows are the existing suite.
- Algorithm invariant: every write lands inside the tree root, the overlay root or the run folder, and every backup entry restores against the root it was taken from. Adversarial cases: `..`, `../`, `../../x`, `../a/b`, `a/../../outside`, `/etc`, `C:\overlays`, a NUL byte, and a stage folder inside the live overlay folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the baseline pass count of the engine suite and the guard core test, and reproduces the `../overlays` refusal on a probe tree. Implementation adds the sibling fixture option, then for each surface writes the failing sibling case and changes `overlay-engine.cjs` until it passes. Verification reruns both test commands, which must exit 0, and checks that no existing test changed except `overlay-engine-fixes.test.cjs:102-105`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The gate is `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs`, which must exit 0, plus `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`, which must exit 0.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveOverlayDir` accept/refuse table | `node --test` on `overlay-engine-fixes.test.cjs` |
| Integration | Engine CLI against fixture workspaces with a sibling folder: status, apply and capture (`sync`); guard, adopt and pre-commit (`strict-writes`); live re-pin, `--stage` and rollback (`repin`); relayout (`follow-up`); the guard core | `node --test`, the git CLI for the re-pin and pre-commit fixtures |
| Manual | N/A: the fixtures run every command, and the first real consumer run is Barter's, in phase 005 | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

No new package. The change uses Node built-ins, and the tests use the same runner and git CLI as today.

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js with `node --test` | Internal | Green | No test can run |
| git CLI | External | Green | The re-pin and pre-commit fixtures cannot build their repositories |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: An in-tree test fails after the phase commit, or a sibling-folder rollback leaves the manifest pin or `sync-state.json` unrestored.
- **Procedure**: `git revert <phase-001 commit>`. The reverted engine refuses `../` again in `resolveOverlayDir`, so `createContext` throws and every command exits 2 for a consumer already on a sibling folder, before any rollback runs. Such a consumer moves its folder back inside the tree and resets the setting before reverting. A run folder with `area` entries cannot be rolled back by the old engine, and in-tree consumers never write one.
- **Compatibility**: An existing consumer with an in-tree folder and the mirror layout sees nothing change. Its setting, status output, `backup.json` keys, stage location and relayout backup layout are the same as today, and the unedited suite proves it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, which needs the baseline pass count |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002 start, through the parent's handoff row |
<!-- /ANCHOR:phase-deps -->

---
