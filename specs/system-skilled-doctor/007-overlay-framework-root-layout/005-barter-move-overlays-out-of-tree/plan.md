---
title: "Implementation Plan: Phase 5: barter-move-overlays-out-of-tree"
description: "Two commits in ai-speckit. Commit 1 teaches the edit guard, commit gate and git-write gate to find the overlay folder in either place while it is still in the tree. Commit 2 moves skilled/barter-overlays to overlays, sets overlayDir to ../overlays, fixes the verify argv, link targets, checks, tests, scripts, ignore rules and docs, and drops the old-location fallback."
trigger_phrases:
  - "barter move overlays out of tree plan"
  - "barter overlays move hook ordering"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: barter-move-overlays-out-of-tree

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM), POSIX shell, JSON, Markdown, gitignore |
| **Framework** | Skilled doctor overlay engine vendored at `ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`; Barter's three hooks |
| **Storage** | Files only: the overlay folder, `skilled/.skilled-overlays.json`, `overlay-manifest.json`, `sync-state.json` |
| **Testing** | `node --test` per overlay test file, `bash tests/run-all.sh` (CI, `.github/workflows/root-tests.yml:71`), `/doctor:overlay status`, direct hook runs |

### Overview
The session runs in `ai-speckit`, in two commits. Commit 1 teaches the three hooks both locations while the folder is still in the tree. Commit 2 moves the folder to `overlays/` and fixes every path that assumed the old place. Status, the hook checks, a staged re-pin and the test suites prove it. Paths are relative to `ai-speckit/`, and every engine command runs from `ai-speckit/skilled`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 004 is committed, re-pin and relayout both: `cd skilled && node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `result` `PASSED` and an `offLayout` list of length 0, and `rg -n '"source": "skilled/' skilled/barter-overlays/overlay-manifest.json` prints nothing
- [ ] The vendored engine accepts a sibling folder: `resolveOverlayDir` in `skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` accepts `../<name>`
- [ ] The working tree is clean: `git status --short` prints nothing

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `status --json` reports `result` `PASSED`, an `offLayout` list of length 0, `check.miss` 0 and the baseline in-sync count; `bash tests/run-all.sh` and every overlay `node --test` file exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Expand, move, contract. The hooks first accept both places, then the folder moves, then the hooks drop the old one.

### Key Components
- **Edit guard core** (`framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`): `findBarterOverlays` (`:60-84`) finds the folder by name under the tree, and `:149` takes `treeRoot` as the folder's parent. Without the change, `:83` throws after the move and the plugin allows the edit (`opencode/plugins/barter-overlay-guard.js:41-43`).
- **Commit gate** (`root/opencode/scripts/git-hooks/pre-commit`): `:83-89` tests `$TREE_ROOT/barter-overlays/overlay-manifest.json`. Without the change, the overlay checks are skipped silently.
- **Git-write gate** (`framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`): `aiSpeckitRoot` (`:180-185`) probes `<tree>/barter-overlays/overlay-manifest.json`. Without the change, every session reads as `project`.
- **Manifest** (`overlay-manifest.json`): the verify argv at `:1540-1542,1557-1559` and the layout-link targets at `:146-153`. `runCommand` runs the argv with `cwd: root` and no path check (`overlay-engine.cjs:2525-2529`), so `../overlays/checks/...` works.
- **Checks** (`checks/repin-survival.cjs:16-17`, `checks/compiled-routing-byte-parity.cjs:93-94`): `treeRoot` is the overlay folder's parent today and becomes `<parent>/skilled`.

### Data Flow
The setting names `../overlays`, and the engine resolves the folder beside the tree. `apply` reads the manifest there, writes the destinations, retargets the two recorded links (`overlay-engine.cjs:2473-2476`) and runs the verify argv from the tree root. Each hook finds the folder through its own probe of `<tree>/../overlays`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

This phase changes path handling, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Edit guard core | Finds the folder and the tree root for every guarded edit | update twice: both places in commit 1, new place only in commit 2 | `node --test` on its core test and the plugin test |
| `pre-commit` commit gate | Runs overlay status and pre-commit when the folder exists | update twice, as above | `skilled/.opencode/scripts/git-hooks/pre-commit` exits 0 on a clean index and prints the overlay status |
| sk-git git-write gate | Tells an ai-speckit session from a project session | update twice, as above | `--check` and `--session-kind` print what they printed before the move |
| `checks/*.cjs` | Verify steps run by `apply` and `status` | update `treeRoot` | status prints no `MISS` line |
| Manifest verify argv and link targets | Name the check scripts and link targets | update | `rg -n '(^|[^-])barter-overlays' overlays/overlay-manifest.json` prints nothing |
| `sync-state.json` | Records the links the engine owns | not edited by hand; `apply` updates it | `git diff overlays/sync-state.json` shows only the two link records |
| Overlay engine | Resolves `overlayDir` | unchanged here; phase 004 vendored the sibling support | status passes |
| `skilled/specs` link and `AGENT_TRACK` | Name the spec track `skilled-barter-overlays` | not a consumer | they are the false positives the final grep allows |

Required inventories:
- Same-class producers: `rg -n --hidden '(^|[^-])barter-overlays' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' .`, 87 files today per `spec.md` Measured Behavior.
- Consumers of the changed lookups: `rg -n 'findBarterOverlays|aiSpeckitRoot|TREE_ROOT' skilled/barter-overlays`.
- Matrix axes: folder location (in tree, beside the tree, neither) by hook (edit guard, commit gate, git-write gate). Commit 1 needs rows for the first two locations, plus the neither row that keeps today's failure. Commit 2 needs the beside-the-tree row and the neither row.
- Algorithm invariant: each hook resolves the tree root as the folder holding `.skilled`, never as the overlay folder's parent. Adversarial cases: a project repository with a fake `barter-overlays/overlay-manifest.json` marker still reads as `project` (the existing case in the sk-git hub docs), and a stray `overlays/` folder without the engine beside it is not taken.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:location-matrix -->
## FIX ADDENDUM: LOCATION MATRIX

Folder location by hook, filled from the execution evidence in `tasks.md`. In-tree is `skilled/barter-overlays/`, beside-tree is `ai-speckit/overlays/`, none is neither. "No folder found" means: the edit guard core throws and runs no overlay check, the commit gate leaves `HAS_OVERLAYS` unset and skips its overlay checks, and the git-write gate's `aiSpeckitRoot` returns null so the session reads as `project`.

### Commit 1, `a954fc956ce`: the hooks accept both places

| # | Location | Hook | Expected | Evidence |
|---|----------|------|----------|----------|
| 1 | In-tree | Edit guard | Accepts; refuses an owned destination | T013: `--guard` exit 1, named `barter-overlays/framework/repo-rules/barter-overlay-first.md` |
| 2 | In-tree | Commit gate | Accepts; runs the overlay checks | T013: ran during commit 1; clean index exit 0, an unowned staged change refused exit 1 |
| 3 | In-tree | Git-write gate | Accepts; `ai-speckit` | T013: `ai-speckit` and `allow`; refuses outside ai-speckit |
| 4 | Beside-tree | Edit guard | Accepts | T006, T007: the beside-tree cases pass in the core and plugin guard tests |
| 5 | Beside-tree | Commit gate | Accepts | T008: `HAS_OVERLAYS` set for either manifest, `bash -n` exit 0; run live beside the tree at T041 and T047 |
| 6 | Beside-tree | Git-write gate | Accepts; `ai-speckit` | T010, T011: the beside-tree fixtures pass in both gate tests |
| 7 | None | Edit guard | Not accepted: no folder found | No-folder case in the core test, kept through commit 2 (T021-T025, 41 pass) |
| 8 | None | Commit gate | Not accepted: no folder found, overlay checks skipped | The `HAS_OVERLAYS` test finds neither manifest; no live run recorded at commit 1 |
| 9 | None | Git-write gate | Not accepted: no folder found, `project` | The fake-marker and no-folder cases in the gate tests (T025) |

### Commit 2, `2a8f454c8d1`: the hooks accept only beside-tree

In-tree now behaves like none: each hook probes only `<tree>/../overlays`, so a folder left at `skilled/barter-overlays/` is not found. The in-tree fixtures were removed (T021, T025).

| # | Location | Hook | Expected | Evidence |
|---|----------|------|----------|----------|
| 1 | Beside-tree | Edit guard | Accepts; refuses an owned destination, allows an edit in the folder | T045 exit 1 naming `../overlays/framework/...`; T046 `allow`; T048 live plugin refusal |
| 2 | Beside-tree | Commit gate | Accepts; runs the overlay checks | T041 staged index and T047 clean index exit 0, `HAS_OVERLAYS=1`, status in-sync=487 |
| 3 | Beside-tree | Git-write gate | Accepts; `ai-speckit` | T049: `ai-speckit` and `allow` |
| 4 | In-tree or none | Edit guard | Not accepted: no folder found | No-folder case in the core test passes; error reads "could not locate the overlays folder beside the tree" (T023) |
| 5 | In-tree or none | Commit gate | Not accepted: no folder found | pre-commit tests only `$TREE_ROOT/../overlays/overlay-manifest.json` (T024); the old-name grep prints nothing |
| 6 | In-tree or none | Git-write gate | Not accepted: no folder found, `project` | `aiSpeckitRoot` probes only the beside-tree manifest; no-folder and fake-marker cases pass (T025); T049 refusal outside ai-speckit |
<!-- /ANCHOR:location-matrix -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the status in-sync count, the hook answers, `core.hooksPath` and the sha256 of the live manifest, state and `repin-runs/`. Implementation is two commits: step A teaches the three hooks and their tests both places, and step B runs `git mv skilled/barter-overlays overlays` and fixes the setting, the manifest, the checks and every remaining hit under "Phase 005: the location" in `../scratch/inventory/b-barter.md`. Before commit 2, the commit gate runs on the staged index and the old-name grep runs. Verification reruns status, the three hook checks, a staged re-pin, both test suites and the grep. Setup records the test pass and fail counts first, so verification reports a delta.

**Ordering is mandatory.** The hooks find the folder by the name `barter-overlays` under the tree (`../scratch/inventory/b-barter.md` C1-C3). Moved first, the edit guard fails open, the commit gate skips its checks, and the git-write gate fails closed, so the move commit itself could be refused. Step A must be committed before `git mv` runs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three hooks' tests and the two checks' tests under `overlays/` | `node --test $(find overlays \( -name relayout-runs -o -name repin-runs \) -prune -o \( -name '*.test.cjs' -o -name '*.test.mjs' \) -print)` exits 0 |
| Integration | Status, `--guard`, `pre-commit`, the git-write gate and a staged re-pin on the live tree | `node .skilled/commands/doctor/scripts/overlay-engine.cjs status`, `--guard`, `repin --stage`; `bash tests/run-all.sh` |
| Manual | One guarded edit in an OpenCode session refused by the plugin; one commit through the gate | The OpenCode edit guard plugin and `git commit` in ai-speckit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004, the re-pin and relayout phase: the new engine (phases 001-002) vendored in Barter, and every source relaid out under `framework/` and `root/` | Internal | Green: complete | Without the re-pin, `../overlays` is refused and nothing in this phase can run. Without the relayout, the hook source paths and link targets this plan names do not exist yet |
| A local Skilled checkout that holds the current pin | Internal | Green | The staged re-pin check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: after commit 2, status fails, a hook check prints something other than its baseline, or a test suite fails for a reason that is not a path string.
- **Procedure**: `git revert` commit 2, then `/doctor:overlay apply`. That restores the folder in the tree, the setting and the in-tree paths, and the hooks fall back to step A, which accepts both places. Revert commit 1 too only if the hooks themselves misbehave.
- **Compatibility**: during step A the hooks accept both places, so either commit reverts alone safely. The setting file is not in `repin.rootFiles`, so no re-pin rewrites it. File destinations do not change, so the in-sync count stays the same; only the two tracked layout links retarget.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Step A (commit 1: hooks accept both) ──► Step B (commit 2: move and contract) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 committed, re-pin and relayout both | Step A |
| Step A, commit 1 | Setup baselines recorded | Step B: `git mv` must not run before commit 1 exists |
| Step B, commit 2 | Commit 1 and its hook tests passing | Verification |
| Verification | Commit 2 | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

