---
title: "Feature Specification: Phase 4: barter-repin-and-relayout"
description: "Barter's vendored tree ai-speckit/skilled is pinned to Skilled b0a3b9f, and all 131 of its overlay sources follow the old dot-dropped naming rule. Once the re-pin lands the new engine, every one is off the framework/ + root/ default, so this phase re-pins and relays out in one ai-speckit session, in three commits that each revert alone."
trigger_phrases:
  - "barter repin and relayout"
  - "re-pin ai-speckit skilled and apply --relayout"
  - "barter overlays framework root relayout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: barter-repin-and-relayout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | ../003-engine-docs-and-release/spec.md |
| **Successor** | ../005-barter-move-overlays-out-of-tree/spec.md |
| **Handoff Criteria** | Barter is on the new pin, every source sits under `framework/` or `root/`, status prints RESULT: PASSED with an empty `offLayout` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**This phase runs in ai-speckit, from an ai-speckit session with cwd `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`.** Its spec docs live here in the Skilled checkout. The ai-speckit session updates these three files at execution time and writes nothing else in Skilled.

This is **Phase 4** of the parent packet that moves a consumer's overlays out of the vendored tree into a sibling folder with framework and root source roots. It merges the earlier re-pin phase and the earlier relayout phase into one.

Target Skilled commit: <C>

`<C>` stays a placeholder until phase 3 commits phases 1-3 and writes the 40-hex id into the line above. Do not start this phase while that line still reads `<C>`.

Paths below are relative to `ai-speckit/`. `BO` is `skilled/barter-overlays/`. Engine line numbers refer to `.skilled/commands/doctor/scripts/overlay-engine.cjs` in the Skilled checkout on 2026-11-20; the vendored copy after the re-pin may carry them at other lines.

**Why one phase.** The operator made the `framework/` + `root/` naming rule the default for every engine consumer, with no opt-in manifest field. So the moment the re-pin lands the new engine, all 131 Barter entries are off-layout. Status still passes, because LAYOUT is advisory: it prints at most 20 LAYOUT lines plus one overflow line, and `status --json` lists every entry in `offLayout`. Leaving that state across sessions risks an `--adopt` that writes a new entry at `framework/...` or `root/...` beside old-layout ones and mixes the folder. And a handoff of "status passes with zero LAYOUT lines" cannot hold between a re-pin and a later relayout. So the re-pin and the relayout run in one session.

**Scope Boundary**: The re-pin of `ai-speckit/skilled/`, the relayout of every source inside `BO`, and the path fixes that follow the new source names. The folder name, `skilled/.skilled-overlays.json`, the hooks' folder lookup and every "Phase 005" hit in `../scratch/inventory/b-barter.md` stay as they are.

**Dependencies**:
- Phase 3 has committed phases 1-3 in Skilled and recorded `<C>` above.
- The local Skilled checkout at `/Users/michelkerkmeester/MEGA/Development/Skilled` holds both `b0a3b9f` and `<C>`.

**Deliverables**:
- `ai-speckit/skilled/` re-pinned to `<C>`, with `pin.commit` in `BO/overlay-manifest.json:6` naming it.
- Every manifest `source`, `fragment` and `base` under `framework/` or `root/`, every copy moved inside `BO`, and the two layout links retargeted.
- Every naming-rule hit in `../scratch/inventory/b-barter.md` section A, "Phase 004, relayout part", updated to the new source paths.
- Three Barter commits: the re-pin, its changelog record, then the relayout with its path fixes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Barter's vendored tree is pinned to Skilled `b0a3b9f2edbf0dde902929b69c6db5afd051f418` (`BO/overlay-manifest.json:6`), whose engine refuses any `overlayDir` that climbs out of the tree (`names a folder outside the tree root`, vendored `overlay-engine.cjs:443`). Every overlay command, the re-pin included, runs the vendored engine (`ENGINE_COMMAND`, `:86`), so phase 5 cannot move the folder until the new engine is inside the tree.

Barter names every source after its destination with the leading dot dropped, so 110 of the 131 sources start with `skilled/` and read `skilled/barter-overlays/skilled/...`. Under the new default all 131 are off-layout, and phase 5 cannot move the folder out of the tree until sources follow a rule that does not depend on the tree's name.

### Purpose
`ai-speckit/skilled/` runs the engine from Skilled commit `<C>`, every Barter source sits under `BO/framework/` or `BO/root/`, and status passes with an empty `offLayout`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Status baseline, run read-only by the orchestrator in `ai-speckit/skilled` on 2026-11-20 with the vendored `b0a3b9f` engine. Output as received; the leading `...` was trimmed there. The old engine has no LAYOUT cap, so the `grep -c` count is exact here; from the re-pin on, counts use `status --json` instead.
```text
$ cd ai-speckit/skilled && node .skilled/commands/doctor/scripts/overlay-engine.cjs status
...
in-sync=487 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
NOTE     speckit-command-metadata-plan-signals: appendItems at 0.userIntent.ownedSignals goes through an array index, so it lands on another item when an item before it is added or removed
checked=135 ok=135 miss=0
RESULT: PASSED
exit=0
$ ... | grep -c '^LAYOUT'
0
```

Manifest count, run read-only from `ai-speckit/` on 2026-11-20. The last field counts destinations that start `skilled/` with no dot, the one case the relayout refuses to move.
```text
$ node -e 'const m=require(process.argv[1]); const w=m.overlays.filter(e=>typeof e.destination==="string"); const on=w.filter(e=>(e.source||e.fragment)===e.destination.replace(/^\.+/,"")); const sk=w.filter(e=>e.destination.startsWith(".skilled/")).length; const bad=w.filter(e=>e.destination.startsWith("skilled/")).length; console.log("entries="+m.overlays.length,"with_destination="+w.length,"source_equals_dot_dropped_destination="+on.length,"skilled_destinations="+sk,"other_destinations="+(w.length-sk),"undotted_skilled_destinations="+bad)' "$PWD/skilled/barter-overlays/overlay-manifest.json"
entries=133 with_destination=131 source_equals_dot_dropped_destination=131 skilled_destinations=110 other_destinations=21 undotted_skilled_destinations=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Re-pin `ai-speckit/skilled/` from `b0a3b9f` to `<C>` through `/doctor:overlay repin`, staged first, after rebasing the one overlay that phase 3's upstream edit moves.
- Record the re-pin in Barter's current changelog entry.
- Relay out every source with `/doctor:overlay apply --relayout`, in the same session, right after the re-pin's verification.
- Fix every test, script and doc that names an old source path, editing each at its new source path under `framework/` or `root/`.
- Commit in three steps so each reverts alone, and delete the relayout backup once verification passes.

### Out of Scope
- Moving the folder out of the tree, the `overlayDir` setting and the hooks' folder lookup - phase 5 owns them. The hooks keep working here because they find the folder by its name, which does not change (`../scratch/inventory/b-barter.md` section C).
- Any opt-in manifest field for the layout - the operator made the rule the default, so there is none to add.
- Overlay content changes beyond path strings and the one rebase - the parent spec excludes them.
- Spec history under `ai-speckit/specs/` and changelog entries - they record past work and keep their old paths.
- Any write in the Skilled checkout other than this phase's three spec docs.

### Files to Change
All paths are relative to `ai-speckit/`. Paths after the relayout name the new source location.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `skilled/.skilled/**` and the other vendored roots | Modify | The engine's re-pin copies upstream `<C>` and re-applies every overlay |
| `BO/skilled/commands/doctor/_routes.yaml` | Modify | Rebased onto upstream `<C>` before the live re-pin: Barter's copy carries the dot-drop sentence at `:708` that phase 3 rewrites upstream at `:699`; `pinnedSha256` follows |
| `BO/overlay-manifest.json` | Modify | The re-pin writes `pin.commit` (`:6`); the relayout rewrites 131 sources, the `review-core-code-review` fragment and base, and the link targets at `:148,152` |
| `BO/sync-state.json` | Modify by the engine only | Recorded hashes for the new pin; its `files` map is keyed by destination, and the two link records name the old targets |
| `BO/**` source copies | Move | `BO/skilled/X` to `BO/framework/X`; every other source `X` to `BO/root/X` |
| `skilled/.skilled/changelog/sk-git-skilled`, `skilled/.skilled/changelog/skilled-coder` | Modify | The two tracked layout links (mode `120000`), retargeted by the relayout |
| `BO/skilled/changelog/skilled-coder/v4.1.0.0.md` | Modify | The re-pin record, written before the relayout at this old path; the relayout then moves it to `BO/framework/changelog/...`. v4.1.0.0 is current at plan time; use whichever entry is current |
| `.index/*.json` | Modify | UNKNOWN whether they change. The `b0a3b9f` re-pin `e4292f39ab4` also rewrote `.index/trigger-index.json` and three siblings |
| `BO/tests/compiled-route-guard.test.cjs` | Modify | `:16` climbs to `'..','skilled','bin',...`; becomes `'..','framework','bin',...` |
| `BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` | Modify | `:24` climbs to `skilled/skills/sk-git/...`; gains one `..` and names `framework/skills/...` |
| `BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | Modify | `:41` source path becomes `framework/hooks/...`; the refusal regexes at `:102,109` gain `root\/` |
| `BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` | Modify | Fixture source paths at `:149-201`: check each against the rule |
| `init-repository.sh` | Modify | `MODE_REL` at `:40`, the `destination.slice(1)` rule at `:58`, the next-step text at `:113-114,124-127` including the bare `skilled/skills/sk-code/assets/router-source.json` at `:127` |
| `tests/init-repository.test.sh`, `tests/node-version-policy.test.sh` | Modify | The source segment after `barter-overlays/` at `init-repository.test.sh:41,47,53,63,64,70,97` and `node-version-policy.test.sh:169-173` becomes `framework/skills/sk-code/...`; the folder name stays |
| `BO/README.md` | Modify | The stated rule at `:54,426-432`, the layout tree at `:434-452`, and the source paths at `:139,202,214,234,357,458` |
| `BO/root/AGENTS.md` (today `BO/AGENTS.md`) | Modify | `:324,327` name `skilled/barter-overlays/skilled/skills/sk-git/sk-git-skilled/SKILL.md`; `apply` carries it to `skilled/AGENTS.md` and the generated `skilled/.cursor/rules/repo-local.md:31` |
| `BO/framework/repo-rules/barter-overlay-first.md` | Modify | The rule at `:50,59` and the source paths at `:48,52,101,146` |
| Docs under `BO/framework/skills/` | Modify | `sk-git/assets/worktree-checklist.md:27`, the sk-git-skilled playbook `:71-72`, `sk-code/ROUTER.md:294`, `sk-code/sk-code-frontend/README.md:61`, `sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:58`, plus the other sk-git and sk-code hits b-barter lists, each checked against the rule |
| `README.md`, `CONTRIBUTING.md`, `developer-questions.md` | Modify | Only the source segment after `barter-overlays/` (`README.md:105,428`, `CONTRIBUTING.md:26-171`, `developer-questions.md:7`); the folder name stays for phase 5 |
| This phase's `spec.md`, `plan.md`, `tasks.md` in Skilled | Modify | Status and evidence at execution time |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`OFF` below is the length of `offLayout` in `status --json`, the helper defined in `tasks.md` Task Notation. Never count LAYOUT lines with `grep -c '^LAYOUT'`: status caps them at 20, and the overflow line also starts with `LAYOUT`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The tree is pinned to `<C>` | `node -p "require('./barter-overlays/overlay-manifest.json').pin.commit"` in `skilled/` prints the id on the Target Skilled commit line |
| REQ-002 | No `--adopt` and no overlay edit runs between the re-pin and the relayout, apart from the changelog record that edits one existing source in place, and the relayout runs in the same session right after the re-pin's verification | `tasks.md` runs the relayout task directly after the re-pin's verification tasks with no other `BO` write between them, and `git log --format=%s -3` shows the relayout commit directly above the changelog commit |
| REQ-003 | Status passes on the new pin before the relayout, with every entry reported off-layout | `status` in `skilled/` prints `RESULT: PASSED`, and `OFF` prints at least 131 (one per off-layout field; `review-core-code-review` adds its fragment and `.base` file; the exact number is UNKNOWN until run) |
| REQ-004 | The overlay that collides with phase 3's upstream edit is rebased before the live re-pin | The staged run after the rebase prints no `blocked` line for `adopted-skilled-commands-doctor-routes-yaml`, and its `pinnedSha256` equals the sha256 of `.skilled/commands/doctor/_routes.yaml` at `<C>` |
| REQ-005 | Every manifest `source`, `fragment` and `base` sits under `framework/` or `root/` | The relayout task's checks in `tasks.md` (T020) pass: the `"source": "skilled/` grep over the manifest prints nothing, and its `node -e` scan of every `source`, `fragment` and `base` prints `off-rule=0` |
| REQ-006 | The phase is not closeable until status reports no off-layout source | `status` prints `RESULT: PASSED` and no line starting `LAYOUT`, and `OFF` prints 0 |
| REQ-007 | The relayout leaves every destination byte unchanged; only the two tracked layout links retarget | Right after the relayout and before any path fix, a second `apply` prints `0 changed`, the status in-sync count equals the post-re-pin count, and `git status --short -- skilled ':!skilled/barter-overlays'` adds only the two links under `skilled/.skilled/changelog/` to the post-re-pin listing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The vendored engine accepts a sibling folder | The probe in `tasks.md` prints a resolved label for `../overlays` after the re-pin, where the same probe before it printed `names a folder outside the tree root` |
| REQ-009 | Every upstream change the re-pin did not copy has a recorded decision; a decision that needs an `--adopt` becomes its own change after this phase closes, and a `STALE` line halts the run for the operator | Each `not-copied` and `STALE` line from the live run appears in the decisions task's note with its decision, and no `--adopt` runs inside this phase |
| REQ-010 | Barter's own checks and tests pass after the re-pin and again after the relayout | The verify steps `compiled-routing-byte-parity` and `repin-survival` are on no `MISS` line, `node --test` on every `BO` test file exits 0, and `bash tests/run-all.sh` exits 0 |
| REQ-011 | No doc, test or script outside history names an old source path | The old-path grep in `tasks.md` (T037) prints nothing. It matches `barter-overlays/` followed by any old source root (`skilled/`, `opencode/`, `pi/`, `vibe/`, `AGENTS.md`, `REPO RULES.md`, `opencode.json`, `utcp_config.json`) and skips `specs/`, changelogs, `.index/`, `.git/`, `relayout-runs/` and `repin-runs/` |
| REQ-012 | The work lands as three commits in Barter's convention | `git log --format=%s -3` prints the relayout commit, then `docs(changelog): record the <short C> re-pin in <release>`, then `chore(overlays): re-pin Skilled to <short C>` |
| REQ-013 | The relayout backup never reaches git and is deleted after verification | `git show --stat HEAD` lists no path under `relayout-runs/`, and `ls BO/relayout-runs` fails after cleanup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: On pin `<C>`, `status` in `ai-speckit/skilled` prints `RESULT: PASSED` with an empty `offLayout`, where the Measured Behavior block shows `RESULT: PASSED` on `b0a3b9f`.
- **SC-002**: `rg -n '"source": "skilled/' skilled/barter-overlays/overlay-manifest.json` prints nothing, where the Measured Behavior block counts 110 such sources today.
- **SC-003**: The probe resolves `../overlays` after the re-pin and refuses it before.
- **SC-004**: `bash tests/run-all.sh` exits 0 and every `BO` `node --test` file exits 0.
- **SC-005**: The three phase commits are the top three of `git log --oneline` in ai-speckit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 recorded `<C>` in this spec | The phase cannot start | Setup refuses to run while the Target Skilled commit line still reads `<C>` |
| Risk | An `--adopt` or an overlay edit runs between the re-pin and the relayout, or the relayout waits for another session | High: an adopt writes at `framework/...` or `root/...` beside old-layout sources and mixes the folder, and the off-layout state outlives the session | The relayout runs in the same session directly after the re-pin's verification and its two commits; the changelog record is the one in-place edit between them. Not-copied decisions are recorded, and any `--adopt` they need becomes its own change after this phase. A `STALE` line, which fails status and the commit gate, halts the run for the operator rather than prompt an overlay edit. The phase is not closeable until `OFF` prints 0 |
| Risk | The re-pin brings every other upstream change since `b0a3b9f`, not only phases 1-3 | High: an overlay can block or a check can fail on the copy | Run the staged re-pin first and read its report. The engine's drift refusals stop a blocked overlay before any live write |
| Risk | Barter owns `.skilled/commands/doctor/_routes.yaml` as a pinned whole-file overlay (`adopted-skilled-commands-doctor-routes-yaml`), and phase 3 edits that file upstream at `:699` | High: the overlay comes back `upstream-moved` and the re-pin is refused | Rebase the copy (`BO/skilled/commands/doctor/_routes.yaml:708`) before the live run. The overlap was checked against every upstream path phases 1-3 touch (`.skilled/commands/doctor/`, `.skilled/skills/system-skilled-doctor/`, `.skilled/hooks/overlay-guard/`): no other Barter overlay owns a file those phases change. `system-skilled-doctor/graph-metadata.json` is a json-entry overlay on a file the manifest lists as generated, and the symlink overlays own files this packet does not touch |
| Risk | A live edit or conflict state on the post-re-pin status | Med: the relayout route stops before its question (`overlay.md` step 9), stranding the off-layout state | Halt, and roll back the re-pin with `/doctor:overlay repin --rollback <run-id>` before its commit rather than leave the tree off-layout. A `MISS` or `STALE` line does not stop the relayout |
| Risk | The ai-speckit working tree holds unrelated changes (`git status --porcelain` printed 79 lines on 2026-11-20, deleted `specs/clickup-cli/` files) | Med: they could ride along in a commit, and a "prints nothing" check would fail | Record the baseline porcelain in Setup, compare against it, and stage each commit by explicit pathspec |
| Risk | Tests that climb to a source path fail between the relayout and the path fixes | Med | The relayout and every path fix land in one commit, so no commit is red |
| Risk | `BO/relayout-runs/` is not git-ignored (`.gitignore:68` lists only `repin-runs`) | Med: a broad stage would commit the full backup | Keep it until verification passes, stage commit 3 with a plain `git add --` of explicit paths that leave `relayout-runs/` out (the git-write gate refuses `-A` and pathspec magic while another track has changes), check `git show --stat HEAD`, then delete it |
| Risk | The apply after the relayout may leave the two `sync-state.json` link records on the old targets | Low | UNKNOWN until run. The diff check on `sync-state.json` catches it, and a stale record means halt and report rather than edit the state by hand |
| Dependency | `core.hooksPath` is `skilled/.opencode/scripts/git-hooks` (measured 2026-11-20), a destination path | The commit gate must keep running across all three commits | The relayout moves only the gate's source; its destination and the folder name it tests (`pre-commit:83-89`) do not change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None open. The operator resolved the parent's questions on 2026-11-20: the naming rule is the default for everyone, only a direct sibling folder is allowed, a folder outside git is refused, the stage holds both folders, the setting stays at the tree root, and this phase records the commit phase 3 produces.

Execution-time UNKNOWNs, settled by running:
- The exact `OFF` count after the re-pin, at least 131.
- Whether the re-pin rewrites `.index/*.json`.
- The exact wording of the `/doctor:update record-base` result line and of the probe's resolved label.
- Whether the apply after the relayout updates the two `sync-state.json` link records.
- How `skilled/.cursor/rules/repo-local.md` is rebuilt from `skilled/AGENTS.md`. The plan assumes the apply's regenerate step rebuilds it, and verification greps it.
- Whether Barter's own rules require a Barter spec packet for this work, as the `b0a3b9f` re-pin added one (`specs/skilled-barter-overlays/002-spec-tracks-restructure/037-repin-b0a3b9f2ed/` in `e4292f39ab4`). Default: this phase's docs in Skilled are the record, and the session adds a Barter packet only if Barter's Gate 3 asks for one.
<!-- /ANCHOR:questions -->

---
