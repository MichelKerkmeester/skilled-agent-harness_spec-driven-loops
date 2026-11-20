---
title: "Feature Specification: Phase 5: barter-move-overlays-out-of-tree"
description: "Barter's overlay folder still sits inside the vendored tree at skilled/barter-overlays/, and three hooks, two checks, the verify argv, tests, scripts and docs find it there by name. This phase first teaches the three hooks both locations, then moves the folder to ai-speckit/overlays/, points skilled/.skilled-overlays.json at ../overlays and fixes every path that assumed the old place."
trigger_phrases:
  - "barter move overlays out of tree"
  - "barter overlays folder ai-speckit/overlays"
  - "overlayDir ../overlays barter hooks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: barter-move-overlays-out-of-tree

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
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | ../004-barter-repin-and-relayout/spec.md |
| **Successor** | None |
| **Handoff Criteria** | Barter status passes with the folder at ai-speckit/overlays and all three hooks behave as before |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**This phase runs in ai-speckit, from a session opened in `ai-speckit`.** Its spec docs live in the Skilled checkout. That session updates these docs as it works and writes nothing else in Skilled.

This is **Phase 5**, the last phase of the overlay framework/root layout packet. Barter's overlay folder leaves the vendored tree and becomes `ai-speckit/overlays/`, a sibling of `ai-speckit/skilled/`.

Paths are relative to `ai-speckit/`. `BO` is `skilled/barter-overlays/` before the move, and `overlays/` after it. Engine line numbers refer to `.skilled/commands/doctor/scripts/overlay-engine.cjs` in the Skilled checkout on 2026-11-20, and may shift once phases 001-002 land.

**Scope Boundary**: The folder's location only. Every hit under "Phase 005: the location" in section A of `../scratch/inventory/b-barter.md`, and every hook in its section C. The source layout that the relayout in phase 004 set is already in place and does not change.

**Dependencies**:
- Phase 004, the re-pin and relayout phase, has run in full. Its re-pin put the new engine (phases 001-002) into Barter's vendored tree, so `overlayDir: "../overlays"` resolves and every engine path works with the folder beside the tree. Its relayout moved every source under `framework/` or `root/`, so status passes and `status --json` reports an `offLayout` list of length 0.
- The hook source paths and layout-link targets this phase names exist only after that relayout. Before it, they sit at their old `skilled/...` and `opencode/...` sources.

**Deliverables**:
- Commit 1: the three hooks and their tests find the folder at either `<tree>/barter-overlays` or `<tree>/../overlays`.
- Commit 2: the folder at `overlays/`, the setting naming `../overlays`, every check, test, script, doc and ignore rule updated, and the old-location fallback removed from the hooks.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Barter's own files live inside the copy it vendors from Skilled, at `skilled/barter-overlays/`, and 52 non-hidden files outside spec history and changelogs name the folder there. Moving the folder breaks three hooks that find it by that name (`../scratch/inventory/b-barter.md` C1-C3). The edit guard then fails open, the commit gate skips its overlay checks without a word, and the git-write gate fails closed, so an ai-speckit session loses commit and push rights.

### Purpose
The overlay folder lives at `ai-speckit/overlays/`, `skilled/.skilled-overlays.json` names `../overlays`, status passes there with the same in-sync count, and all three hooks behave as they do today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Read-only, run in `ai-speckit/` on 2026-11-20, before phase 004:
```text
$ cat skilled/.skilled-overlays.json; ls -d skilled/barter-overlays overlays; rg -l barter-overlays --glob "!specs/**" --glob "!**/changelog/**" --glob "!.index/**" . | wc -l
{ "overlayDir": "barter-overlays" }
ls: overlays: No such file or directory
skilled/barter-overlays
      52
$ rg -l --hidden barter-overlays --glob "!specs/**" --glob "!**/changelog/**" --glob "!.index/**" --glob "!.git/**" --glob "!skilled/barter-overlays/repin-runs/**" . | wc -l
      87
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Teach the edit guard core, the `pre-commit` commit gate and the sk-git git-write gate, with their tests, to find the folder at either place, and commit that alone while the folder is still in the tree.
- Move the folder with `git mv skilled/barter-overlays overlays` and set `skilled/.skilled-overlays.json` to `{ "overlayDir": "../overlays" }`.
- Point the manifest's verify argv, layout-link targets and the two checks' `treeRoot` at the new place.
- Update every remaining hit under "Phase 005: the location" in `../scratch/inventory/b-barter.md`, add root `.gitignore` lines for what `skilled/.gitignore` no longer covers, and remove the hooks' old-location fallback.

### Out of Scope
- Spec history under `specs/`, changelogs and the generated `.index/` - they record past work.
- The track name `skilled-barter-overlays`: the `skilled/specs` link and `AGENT_TRACK` in the git-write gate - it is a spec track name, not the folder (`../scratch/inventory/b-barter.md` B).
- Reading the setting from beside the tree - the operator's answer keeps `skilled/.skilled-overlays.json` inside the vendored copy.

### Files to Change

Paths before the move use the names the relayout in phase 004 gave them.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `BO/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` | Modify | `findBarterOverlays` (`:60-84`) and `treeRoot` (`:149`): find `<tree>/../overlays` and take the folder holding `.skilled` as treeRoot |
| `BO/root/opencode/scripts/git-hooks/pre-commit` | Modify | `:83-89` tests `$TREE_ROOT/barter-overlays/...`; learns `overlays/overlay-manifest.json` beside `skilled/` |
| `BO/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` | Modify | `aiSpeckitRoot` (`:180-185`) probes `<tree>/barter-overlays/...`; learns `path.join(path.dirname(tree), 'overlays', 'overlay-manifest.json')` |
| The hook tests | Modify | `root/opencode/plugins/tests/barter-overlay-guard.test.cjs`, `framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`, `root/opencode/plugins/tests/barter-git-write-gate.test.cjs`, `framework/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs` |
| `skilled/barter-overlays/` | Move | To `overlays/` |
| `skilled/.skilled-overlays.json` | Modify | `{ "overlayDir": "../overlays" }` |
| `overlays/overlay-manifest.json` | Modify | Verify argv at `:1540-1542,1557-1559` to `../overlays/checks/...`; layout-link targets to `../../../overlays/framework/...` |
| `overlays/checks/repin-survival.cjs`, `overlays/checks/compiled-routing-byte-parity.cjs` | Modify | `treeRoot` at `:16-17` and `:93-94` becomes `path.resolve(overlayRoot, '..', 'skilled')` |
| `overlays/tests/compiled-route-guard.test.cjs`, `overlays/tests/compiled-routing-byte-parity.test.cjs` | Modify | `:17` climbs into `skilled/.skilled`; `:64` fixture name (optional) |
| `init-repository.sh`, `sync-skilled-specs.mjs`, `tests/init-repository.test.sh`, `tests/node-version-policy.test.sh` | Modify | `OVERLAYS_DIR`, the manifest path and the fixture paths |
| `.gitignore` | Modify | `:68` becomes `/overlays/repin-runs/`; add node_modules and dist lines for `overlays/framework/` |
| `README.md`, `CONTRIBUTING.md`, `developer-questions.md`, `skilled/README.md`, `skilled/CONTRIBUTING.md`, `overlays/README.md`, `overlays/root/REPO RULES.md`, `overlays/root/AGENTS.md`, `overlays/framework/repo-rules/barter-overlay-first.md`, sk-git and sk-code docs | Modify | Prose naming the folder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before the folder moves, all three hooks find it at either `<tree>/barter-overlays` or `<tree>/../overlays`, and that change is its own commit |
| REQ-002 | The folder is at `overlays/`, `skilled/.skilled-overlays.json` names `../overlays`, and status passes with an `offLayout` list of length 0 in `status --json` and the same in-sync count as before the move |
| REQ-003 | The edit guard refuses an edit to an owned destination and names the source under `../overlays/`, and allows an edit inside `overlays/` |
| REQ-004 | The commit gate still runs the overlay status and pre-commit checks, and exits 0 on a clean index |
| REQ-005 | The git-write gate classifies an ai-speckit session exactly as before the move |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A staged re-pin to the current pin writes nothing in the live overlay folder |
| REQ-007 | Every overlay test and the CI suite pass at the new location |
| REQ-008 | Outside spec history, changelogs and `.index/`, `barter-overlays` not preceded by `-` appears only in the track-name false positives and one temp-folder fixture name |
| REQ-009 | The hooks keep no old-location fallback after commit 2, and git ignores `overlays/repin-runs/` and the node_modules and dist folders under `overlays/framework/` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: From `ai-speckit/skilled`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `result` `PASSED`, an `offLayout` list of length 0, `check.miss` 0 and the in-sync count in `counts` recorded before the move.
- **SC-002**: `ls -d skilled/barter-overlays` fails and `cat skilled/.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`, where the Measured Behavior block shows the opposite today.
- **SC-003**: The three hook checks in `acceptance-criteria.md` print what they printed before the move.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's vendored engine accepts `../<name>` and handles a sibling folder in status, apply, guard, pre-commit and `repin --stage` | Without it `resolveOverlayDir` refuses `../overlays` (`overlay-engine.cjs:442-444`) and every engine command fails | Setup reads the vendored `resolveOverlayDir` (`rg -n 'function resolveOverlayDir' skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`) and confirms it accepts `../<name>` before any move |
| Risk | The hooks are moved before they learn the new place | High: the edit guard fails open (core throws at `:83`, the plugin allows the edit at `opencode/plugins/barter-overlay-guard.js:41-43`), the commit gate skips its checks, and the git-write gate fails closed, so every session reads as `project` and the move commit itself could be refused | Commit 1 changes only the hooks and tests, so they accept both places, and lands before `git mv` |
| Risk | The verify argv and checks resolve from the wrong root | Med: `apply` and `status` run `node ../overlays/checks/...` with `cwd` the tree root and no path check (`overlay-engine.cjs:2525-2529`), so a wrong climb fails as a `MISS` | Status must print no `MISS` line after commit 2 |
| Risk | `node_modules` or `dist` under `overlays/framework/` gets committed | Med: `skilled/.gitignore:38-40` no longer covers them | Add root `.gitignore` lines; `git check-ignore` proves each |
| Risk | The engine's commit check reads the staged deletions under `skilled/barter-overlays/` or the staged setting as unowned vendored changes | Low: in today's Skilled engine `isVendoredKey` (`overlay-engine.cjs:5382-5385`) counts only `repin.roots` and `rootFiles`, so neither path is vendored | The commit gate runs on the staged index before commit 2; a refusal there is a gap for phase 001 to close, not a reason to skip the hook |
| Risk | The layout links keep the in-tree target | Low | Edit the targets in the manifest by hand; `apply` retargets recorded links (`overlay-engine.cjs:2473-2476`) and updates `sync-state.json`, which is never edited by hand |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The hooks probe at most two fixed paths each, and no directory walk is added, so a guarded edit and a commit take no measurably longer than before.
- **NFR-P02**: N/A for throughput: no service runs.

### Security
- **NFR-S01**: The edit guard never fails open because of the move: during and after it, an edit to an owned destination is refused.
- **NFR-S02**: The git-write gate's answer for a session opened outside `ai-speckit` stays `project`, so the move grants no git rights anywhere else.

### Reliability
- **NFR-R01**: Either commit reverts alone and leaves working hooks, because commit 1 accepts both places.
- **NFR-R02**: A re-pin never rewrites the setting, because `.skilled-overlays.json` is not in `repin.rootFiles` (`BO/overlay-manifest.json:10` onward), and a staged re-pin writes nothing in the live folder.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a clean index makes `pre-commit` exit 0 after running the overlay checks, not by skipping them.
- Maximum input: a staged re-pin copies the tree and the sibling folder into the stage directory, and leaves the live `overlays/` byte-identical.
- Failure path: with neither place holding a manifest, the edit guard core throws and the git-write gate returns `project`, as today; the commit gate's skip is the one silent outcome, so commit 2 checks it ran.
- A session started before the move holds a cached realpath for the hook core. Restart open sessions after commit 2, because whether a running plugin re-reads the path is UNKNOWN.
- `skilled/.gitignore` coverage: its `.skilled/**` rules stop covering the sources once they live in `overlays/framework/`.
- `core.hooksPath`: `git config --get core.hooksPath` prints `skilled/.opencode/scripts/git-hooks` today, a destination path the move does not change. What sets it is UNKNOWN (`../scratch/inventory/b-barter.md` C), so setup and verification both read it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 30 files, mostly path strings, one folder move and three hook lookups |
| Risk | 17/25 | Hooks that guard edits and git writes; a wrong order fails open or locks out commits |
| Research | 6/20 | The inventory already lists every hit; the hooksPath setting and cached realpaths stay to confirm |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

Resolved by the operator on 2026-11-20:
- How far outside the tree: only a direct sibling `../<name>` is allowed, and a deeper path is refused. `../overlays` is a direct sibling.
- Overlay folder outside the git repository: refused. `ai-speckit/` is the git top level and `skilled/` is a folder inside it, so `overlays/` stays inside the repository and is allowed.
- Stage layout: the stage holds `<dir>/<tree>` and `<dir>/<overlays>`, so `repin --stage <dir>` copies the tree to `<dir>/skilled` and the folder to `<dir>/overlays`.
- Setting file location: `skilled/.skilled-overlays.json` stays inside the vendored copy and names `../overlays`.

Still UNKNOWN until execution, and read during it:
- What sets `core.hooksPath`. Setup and verification both read it (T003, T054).
- Whether a running OpenCode plugin re-reads the cached realpath of the hook core. Open sessions are restarted after commit 2.
- Whether a staged re-pin to the current pin exits 0. T050 records the exit status and judges by the hashes.

Answered during execution, 2026-11-20, in ai-speckit commits `a954fc956ce` (hooks, commit 1) and `2a8f454c8d1` (move, commit 2):
- `core.hooksPath` printed `skilled/.opencode/scripts/git-hooks` before and after the move (T003, T054).
- The live OpenCode plugin refused a guarded edit after the move and named `../overlays/...` (T048).
- The staged re-pin to the current pin exited 0, printed `nothing to copy` and `RESULT: PASSED`, and left the live hashes unchanged (T050).
<!-- /ANCHOR:questions -->

---

