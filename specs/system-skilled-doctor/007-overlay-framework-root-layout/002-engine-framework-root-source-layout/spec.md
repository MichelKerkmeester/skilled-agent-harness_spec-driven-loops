---
title: "Feature Specification: Phase 2: engine-framework-root-source-layout"
description: "The overlay engine names every source after its destination with the leading dot dropped, so framework overlays repeat skilled and share a namespace with the overlay folder's own files. This phase makes the framework/ and root/ naming rule the default for every engine consumer, with old-layout trees still applying and status giving a capped LAYOUT notice until one apply --relayout."
trigger_phrases:
  - "engine framework root source layout"
  - "phase 2 engine framework root source layout"
  - "framework root naming rule default"
  - "adoptSource framework root naming rule"
  - "old layout overlay migration relayout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: engine-framework-root-source-layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/481-overlay-framework-root-layout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | ../001-engine-out-of-tree-overlay-folder/spec.md |
| **Successor** | ../003-engine-docs-and-release/spec.md |
| **Handoff Criteria** | The new default fixtures pass, an old-layout fixture still applies with status RESULT: PASSED and capped LAYOUT notes; `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Move a consumer's overlays out of the vendored tree into a sibling overlays folder with framework and root source roots specification. This phase runs in Skilled, this repository.

**Scope Boundary**: The source naming rule inside `.skilled/commands/doctor/scripts/overlay-engine.cjs`, the status LAYOUT output, and the engine tests that state the rule. No doc, no Barter file, and no change to where the overlay folder sits.

**Dependencies**:
- Phase 001 for commit order only. The rule works the same with an in-tree or a sibling folder.
- Node.js with the built-in `node --test` runner.

**Deliverables**:
- `adoptSource` giving `framework/` and `root/` paths for every tree, with no manifest field to choose a rule.
- Status that keeps passing for an old-layout tree, with at most 20 LAYOUT lines and one overflow line.
- Adopt that still finds a `repin.exclude` copy kept at the old path.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The engine has one source naming rule. `adoptSource(key)` is `key.replace(/^\.+/, '')` (`overlay-engine.cjs:5399-5401`), so a source is its destination with the leading dot dropped. In Barter's manifest, 131 of the 131 entries with a destination follow that rule, and 110 of them sit under `.skilled/`, so every framework source repeats `skilled/` under a folder already inside the tree. The other 21 land at the overlay folder's top level, beside its own `README.md`, `checks/` and `tests/`, so a root `README.md` or `tests/` overlay would collide with them.

### Purpose
For every engine consumer, `adoptSource` maps a destination `.skilled/X` to `framework/X` and any other destination `X` to `root/` plus `X` with its leading dots dropped. A consumer whose sources still follow the old rule keeps applying and passing status until it runs `apply --relayout` once.

### Migration for Existing Consumers
The operator made the new rule the default, so every existing consumer is on the old layout the moment it takes the new engine. Under the new rule all 131 of Barter's entries with a destination are off-layout, since every one sits at its dot-dropped path in the block below. This subsection is the decision for that state.

**Nothing changes what apply writes.** `planFileOverlay` joins `entry.source` onto the overlay root as written (`overlay-engine.cjs:1817`), and `planDirectoryOverlay` does the same (`:1855`). The naming rule decides only four things: the source `--adopt` creates, the strict-write and adopt hint text, the LAYOUT notes, and the `apply --relayout` targets. So the flip changes no destination on any tree.

**Old-layout trees keep working with a standing notice, and nothing is refused for layout.** Status and apply keep reading old-layout sources. Status reports each off-layout source as a LAYOUT note and still prints `RESULT: PASSED`, because `isInSync` does not read `offLayout` (`:3569-3570`) and LAYOUT is not in `BLOCKING_STATES` (`:85`).

**The notice is capped.** One line per entry would bury the lines that need action, so status prints at most 20 LAYOUT lines, then one line `LAYOUT   … N more; run <engine> apply --relayout`. This follows the existing cap on not-copied paths, `NOT_COPIED_SHOWN = 20` (`:4646`). `status --json` keeps the full `offLayout` list. A tree with 20 or fewer off-layout entries prints them exactly as today: the assertion at `tests/overlay-engine-follow-up.test.cjs:957` keeps its source line unedited.

**Why not refuse an old-layout tree.** A consumer gets the new engine only through a re-pin, and the re-pin runs with the old vendored engine (`ENGINE_COMMAND`, `:86`). A refusal in the new engine would therefore land on every consumer's first status after the re-pin, before it could act. It would also buy no correctness, since verbatim reads apply old sources correctly.

**Why not keep the old rule for old trees.** Detecting an old-layout tree and choosing the rule per tree is the opt-in switch the operator rejected, only made implicit. One rule with a notice is simpler, and every consumer converges on it.

**Transition window.** None is enforced. Reading old-layout sources is supported with no deadline. Retiring that support would be a future packet, and none is planned.

**A consumer that never relayouts.** It keeps working through every re-pin and apply, with the standing notice. The one visible change is that `--adopt` writes new entries at `framework/` or `root/`, so its folder is mixed until a relayout. The mixture is harmless, because each entry names its own source.

**The one consumer action.** Run `apply --relayout` once after the re-pin. It moves every copy, rewrites the manifest and retargets the layout links. It refuses only a move whose target is already taken (`tests/overlay-engine-follow-up.test.cjs:1143-1170`) and an entry whose new-rule path would land under `root/skilled/`, which stays where it is and is named in the refusal.

**Rollback.** Reverting this phase restores the old default. A tree already relaid out still applies through the verbatim reads and gets LAYOUT notes pointing back to the old paths. Those notes are advisory, so nothing breaks in either direction.

**Adopting an excluded path on an old-layout tree.** `hasOverlayCopy` (`:5544`) and the `repin.exclude` refusal (`:5556`) look for the copy only at the rule path. After the flip, a consumer whose excluded-path copy sits at the old dot-dropped path would be refused, and relayout cannot help, because that copy is not in the manifest yet. So for an excluded path, adopt also accepts an existing copy at the old dot-dropped path, prefers the new-rule path when both exist, and names the new-rule path when it refuses. Barter is unaffected, since its excluded paths are already adopted.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node -e 'const m=require("<barter>/skilled/barter-overlays/overlay-manifest.json"); const w=m.overlays.filter(e=>typeof e.destination==="string"); const on=w.filter(e=>(e.source||e.fragment)===e.destination.replace(/^\.+/,"")); const sk=w.filter(e=>e.destination.startsWith(".skilled/")).length; console.log("entries="+m.overlays.length,"with_destination="+w.length,"source_equals_dot_dropped_destination="+on.length,"skilled_destinations="+sk,"other_destinations="+(w.length-sk),"sourceLayout="+String(m.sourceLayout))'
# <barter> is /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit
entries=133 with_destination=131 source_equals_dot_dropped_destination=131 skilled_destinations=110 other_destinations=21 sourceLayout=undefined
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Change `adoptSource` (`:5399-5401`) to the `framework/` and `root/` rule for every tree. Its six callers keep calling it with one argument: `layoutMoves` (`:3371`, with the `.base` name at `:3381-3384`), the two strict-write hints (`:5465`, `:5469`), and adopt (`:5544`, `:5556`, `:5563`).
- Refuse a `source`, `fragment` or `base` at or under `root/skilled/` as a blocked overlay reported per entry id by `assertSafeToPlan` (`:2759`), and refuse an adopt or a relayout move whose new-rule source would land there. This keeps one source per destination.
- Cap the status LAYOUT lines at 20 plus one overflow line (`:3606-3608`), leaving `status --json` complete.
- Let adopt take an excluded path's copy from the old dot-dropped path when the new-rule path holds none (`:5544`, `:5556`, `:5563`).
- Update the engine tests that state the old rule, and keep fixture sources on the old layout so they also prove old sources still apply.

### Out of Scope
- A manifest field or any other switch that chooses the rule; the operator rejected it.
- Retiring support for reading old-layout sources; no deadline is set.
- Doctor docs, the skill references and the manual testing playbook; phase 003 owns them.
- Any Barter file; phase 004 re-pins Barter and runs its relayout.
- Where the overlay folder sits; phase 001 owns it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | New `adoptSource` rule, the `root/skilled/` refusal in `assertSafeToPlan`, adopt and relayout, the LAYOUT cap in status, the excluded-path fallback in adopt |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modify | Layout constants for the new rule, the LAYOUT cap case, the old-layout apply case, the `root/skilled/` relayout refusal |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Adopt and hint path expectations for the new rule, the excluded-path fallback cases, the `root/skilled/` adopt and blocked-source cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `adoptSource` maps `.skilled/X` to `framework/X`, a destination of exactly `.skilled` to `framework`, and any other destination `X` to `root/` plus `X` with its leading dots dropped, for every tree. No manifest field changes the rule. | `apply --adopt .skilled/skills/brand` prints `adopted .skilled/skills/brand as skilled-overlays/framework/skills/brand`, and `--adopt "REPO RULES.md"` writes `root/REPO RULES.md`, in `overlay-engine-strict-writes.test.cjs`. |
| REQ-002 | Every `adoptSource` caller follows the new rule: `:3371` with the `.base` name, `:5465`, `:5469`, `:5544`, `:5556` and `:5563`. | The strict-write hint for an unowned `.skilled/` file names `skilled-overlays/framework/...`, and the root-file hint names `skilled-overlays/root/REPO RULES.md`, in `overlay-engine-strict-writes.test.cjs`. |
| REQ-003 | A `source`, `fragment` or `base` at or under `root/skilled/` is a blocked overlay. An adopt of a destination starting `skilled/` is refused, and relayout refuses an entry whose new-rule path lands under `root/skilled/`, leaving it in place and naming it. | Status reports the entry id as blocked and exits non-zero, the adopt exits 2 without writing, and the relayout exits 2 naming the entry, in `overlay-engine-strict-writes.test.cjs` and `overlay-engine-follow-up.test.cjs`. |
| REQ-004 | An old-layout tree keeps applying and passing status. Status prints a LAYOUT note per off-layout source and `RESULT: PASSED`. | An old-layout fixture applies with exit 0 and its status prints `RESULT: PASSED` with LAYOUT lines naming `framework/` targets, in `overlay-engine-follow-up.test.cjs`. |
| REQ-005 | Status prints at most 20 LAYOUT lines, then one `LAYOUT   … N more; run <engine> apply --relayout` line. `status --json` keeps every entry in `offLayout`. With 20 or fewer, no overflow line prints. | With 25 off-layout entries status prints 20 entry lines and `LAYOUT   … 5 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, and `offLayout` has 25 items; with 20 entries no overflow line prints, in `overlay-engine-follow-up.test.cjs`. |
| REQ-006 | `apply --relayout` moves an old-layout tree onto the new rule, and status then prints no LAYOUT line. | Relayout moves `custom/...` and dot-dropped sources to `framework/...` and `root/...`, and the following status prints no line starting `LAYOUT`, in `overlay-engine-follow-up.test.cjs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | For a path under `repin.exclude`, adopt accepts a copy at the old dot-dropped path when the new-rule path holds none, prefers the new-rule path when both exist, and names the new-rule path when it refuses. | The old-path copy case adopts with source `skilled/local/hook.sh`, the two-copy case adopts with source `framework/local/hook.sh`, and the no-copy refusal names `skilled-overlays/framework/local/hook.sh`, in `overlay-engine-strict-writes.test.cjs`. |
| REQ-008 | The shared fixture manifests keep their sources as written, off both rules, so the suite proves sources outside the rule still apply. | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0, and, before the phase commit, `git diff HEAD -- .skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` prints nothing, which leaves the sources at `overlay-engine-fixtures.cjs:139-172` unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with the new default cases included.
- **SC-002**: An old-layout fixture applies, and its status prints `RESULT: PASSED` with LAYOUT lines capped at 20 plus one overflow line.
- **SC-003**: After `apply --relayout` on that fixture, status prints zero LAYOUT lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's commit lands first | Only the commit order depends on it. The rule needs nothing from 001, but 001's sibling cases may assert adopt or hint paths | Start from the tree with 001 committed, sweep its sibling cases, and rerun the whole suite |
| Risk | An existing test still asserts an old-rule path and is missed in the sweep | Med | The whole suite must exit 0, and `rg -n 'skilled-overlays/skilled/' $T` lists every remaining hit for review |
| Risk | Every existing consumer prints LAYOUT notes after its re-pin, which reads as breakage | Med | Status still prints `RESULT: PASSED`, the notes cap at 20 plus one line naming the fix, and phase 003 documents the one relayout |
| Risk | `.skilled/X` and a destination `skilled/X` would both map near `skilled`, giving two sources for one destination | Low | Anything at or under `root/skilled/` is refused, so `framework/` is the only home for framework sources |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Naming rule: resolved — default for every consumer, no opt-in field (operator, 2026-11-20).
- None open.
<!-- /ANCHOR:questions -->

---
