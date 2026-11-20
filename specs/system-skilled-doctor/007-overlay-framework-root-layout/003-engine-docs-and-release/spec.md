---
title: "Feature Specification: Phase 3: engine-docs-and-release"
description: "The doctor overlay docs, workflows and playbook still state the old naming rule and refuse a folder beside the tree. This phase documents the framework/ and root/ rule as the new default every consumer must act on, with the one migration step, makes the relayout route read its plan from status --json, and ships system-skilled-doctor v1.2.0.0."
trigger_phrases:
  - "doctor overlay docs framework root default"
  - "system-skilled-doctor v1.2.0.0 release"
  - "overlay relayout migration step consumers"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: engine-docs-and-release

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
| **Phase** | 3 of 5 |
| **Predecessor** | ../002-engine-framework-root-source-layout/spec.md |
| **Successor** | ../004-barter-repin-and-relayout/spec.md |
| **Handoff Criteria** | Phases 1-3 are committed in Skilled and the commit id is recorded in phase 4's spec. Verification: `git -C <Skilled> log -1 --format=%H` matches the id on the `Target Skilled commit:` line of `../004-barter-repin-and-relayout/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the parent packet that moves a consumer's overlays out of the vendored tree into a sibling folder with `framework/` and `root/` source roots. It runs in the Skilled checkout.

**Scope Boundary**: Docs, workflow YAML, the playbook, the skill version and its changelog in Skilled. No engine code changes here. Phases 001 and 002 own `overlay-engine.cjs` and its tests.

**Dependencies**:
- Phase 001 has landed: the engine accepts `overlayDir: "../<name>"`, a direct sibling only, and refuses a deeper path and a folder outside the git repository.
- Phase 002 has landed: the `framework/` and `root/` rule is the engine's default for every tree, and status caps its LAYOUT lines at 20 plus one overflow line.

**Deliverables**:
- Every doc line that states the overlay location or the naming rule states the sibling folder and the new default rule.
- One migration passage, "Moving an existing tree onto the new layout", that names the one action a consumer takes.
- The relayout route takes its plan from `status --json`, so the 20-line cap hides no move.
- The two workflow steps that resolve the overlay folder themselves accept a direct-sibling value.
- The five playbook scenarios whose paths follow the old rule are rewritten, and one new scenario, `SKD-013`, covers a sibling folder and moving an old-layout tree.
- `system-skilled-doctor` version `1.2.0.0` and `changelog/v1.2.0.0.md`, leading with the default change.
- The Skilled commit that carries phases 1-3, with its id written into phase 4's spec.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
After phases 001 and 002 every engine consumer gets a new default naming rule on its next re-pin, but no doc tells them, and the operator-facing text still states the old rule and still refuses a folder beside the tree. The refusal row at `doctor-overlay-presentation.txt:557` says the setting "must name a relative folder inside the tree", and six more doc lines state only the leading-dot-dropped rule (see Measured Behavior). The relayout route takes its plan from the LAYOUT lines of the text report (`overlay.md:106`, `doctor-overlay-apply.yaml:85-86`), which the 20-line cap now truncates. Five playbook scenarios expect old-layout paths in 23 lines.

### Purpose
A consumer who re-pins onto this engine reads, in the release note and the overlay reference, that the default changed, that nothing is refused, and that the one action is `/doctor:overlay apply --relayout` once. Every doc, workflow and scenario matches the engine.

### What a consumer sees after the re-pin
- `status` prints LAYOUT notes for every old-layout source, at most 20 lines plus one overflow line, and `status --json` lists them all in `offLayout`. It still prints `RESULT: PASSED`.
- Nothing is refused and every overlay keeps applying, because the engine reads each source verbatim from the manifest.
- The one action is `/doctor:overlay apply --relayout` once, which runs the engine's `apply --relayout`.
- Skipping it breaks nothing. `--adopt` then writes new entries at `framework/...` or `root/...`, so the overlay folder is mixed until the relayout.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run read-only in the Skilled checkout on 2026-11-20. Untrimmed.
```text
$ rg -n 'leading dot dropped|inside the tree with forward slashes' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**'; rg -c 'skilled-overlays/skilled|belongs at skilled|-> skilled/|source\\?":\\?"skilled/' .skilled/skills/system-skilled-doctor/manual-testing-playbook; echo "exit=$?"
.skilled/commands/doctor/_routes.yaml:699:    gate3_location: "the overlay destinations and layout links the overlay manifest names inside the vendored tree, the outputs of the manifest's regenerate steps, and <overlay folder>/sync-state.json, all under the engine's own <overlay folder>/.build-lock; with --capture <path>, only the one overlay source that path maps to plus sync-state.json; with --adopt <path>, the copy of that vendored path in the overlay folder and one new entry in <overlay folder>/overlay-manifest.json, followed by the same apply; with --relayout, the overlay sources the manifest keeps off their layout paths, moved inside the overlay folder to the same path with the leading dot dropped, the layout-link targets that reach them, the source, fragment and base fields of <overlay folder>/overlay-manifest.json, and the backup in <overlay folder>/relayout-runs/<stamp>/, followed by the same apply; the write runs only after the operator approved the status report this run printed, or the LAYOUT lines in it when --relayout carries the run"
.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:34:    - "with --relayout, the overlay sources the manifest keeps off their layout paths, moved inside the overlay folder to the same path with the leading dot dropped, the layout links that reach them, the source, fragment and base fields of <overlay folder>/overlay-manifest.json, and the backup in <overlay folder>/relayout-runs/<stamp>/ the run writes before the first move, followed by everything a plain apply writes"
.skilled/skills/system-skilled-doctor/references/overlays.md:92:| `LAYOUT   <overlay>: <field> <from> belongs at <to>` | The copy the entry names sits off its layout path, which is the entry's destination path with the leading dot dropped. `<field>` is `source`, `fragment` or `base`, and a `marked-section` entry can print one line for each. The `base` path carries `.base` before the extension | `/doctor:overlay apply --relayout` |
.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:115:| `LAYOUT` | An overlay source sits off the layout path its destination maps to, such as a copy kept under `<overlay folder>/.skilled/skills/...` | The copy still applies, so the tree is not broken and nothing is lost. `/doctor:overlay apply --relayout` moves it to the same path with the leading dot dropped and points the manifest there | does not fail the status |
.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:273:The engine has no plan mode for `apply --relayout`, so the plan is the `LAYOUT` lines the same run's status report printed. Each one names the overlay, the manifest field, the path the copy sits at now and the path it belongs at. Every move stays inside the overlay folder: the copy keeps the same path with the leading dot dropped, and the destination the overlay writes is untouched.
.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:557:| `.skilled-overlays.json` is refused | The setting must name a relative folder inside the tree with forward slashes. Fix the file, then rerun `/doctor:overlay status` |
.skilled/commands/doctor/overlay.md:108:11. After that yes, `apply --relayout` runs `overlay-engine.cjs apply --relayout` with the same `--root`, then `overlay-engine.cjs apply` with the same `--root`. The engine takes its own lock, copies every source it moves into `<overlay folder>/relayout-runs/<stamp>/`, moves each one onto its layout path with the leading dot dropped and points the manifest's fields and layout links there. It refuses with exit 2 rather than overwrite an existing target, and then nothing is written. The run retargets each live link that named a moved copy and prints a `relinked` line for it. The apply that follows writes the destinations from the moved sources.
.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md:3
.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/status-audit-lists-unowned-drift.md:4
.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/pre-commit-refuses-unowned-change.md:5
.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/adopt-an-unowned-file.md:6
.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/strict-guard-refuses-unowned-write.md:5
exit=0
```
The first search prints 7 doc lines. The second counts 23 playbook lines in 5 files. The first misses three more statements of the old rules: `doctor-overlay-presentation.txt:228` and `references/overlays.md:188` say "without its leading dot", and `references/overlays.md:51` says the value is "a path relative to the tree root".
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Rewrite every doc line that states the naming rule or the location so it states the `framework/` and `root/` default and the direct-sibling folder, and add the migration passage to `references/overlays.md`.
- Change the relayout route so its plan and its nothing-to-move test read `offLayout` from `status --json`, and make the re-pin's next step name the relayout when LAYOUT notes remain.
- Change the two workflow steps that resolve the folder themselves, `doctor-overlay-repin.yaml:76` and `doctor-update-apply.yaml:187`, so a `../<name>` value resolves against the tree root.
- Rewrite the five old-layout playbook scenarios and add `SKD-013` for a sibling folder and an old-layout tree moved by relayout.
- Bump `SKILL.md:5` from `1.1.8.0` to `1.2.0.0` and add `changelog/v1.2.0.0.md`, which leads with the default change and the one action.

### Checked and Unchanged
- `doctor-overlay-apply.yaml:60`: `--relayout` runs only when the operator gives the flag, so no workflow relays out on its own.
- `doctor-overlay-status.yaml:58`: a LAYOUT line does not fail the status and the workflow names `/doctor:overlay apply --relayout` beside it, so no workflow stops on LAYOUT. The overflow line ends with the same command.
- `manual-testing-playbook.md:147` and `:171`, the `SKD-006` and `SKD-009` summaries, name no path and stay as they are.
- `doctor-overlay-apply.yaml:48`, `doctor-overlay-repin.yaml:47` and `doctor-overlay-status.yaml:35`: the setting stays at the tree root.

### Out of Scope
- `.skilled/commands/doctor/scripts/README.markdown` - it never documents `overlay-engine.cjs`, so there is no stale line to fix. The missing section is a gap for a separate packet.
- Generated mirrors such as `.codex/prompts/doctor-overlay.md` - `sync-prompts.cjs` writes them and they only point at the canonical `overlay.md`.
- Engine code, engine tests and comments in them, including `overlay-engine.cjs:3355,5398` - phases 001 and 002 own those files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | `:115,228,273` new rule, LAYOUT overflow line and the relayout plan from `offLayout`. `:557` refusal row. `:552` sibling example |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | `:51,60` location. `:92,96,188` rule, relayout and adopt. New passage "Moving an existing tree onto the new layout" |
| `.skilled/commands/doctor/overlay.md` | Modify | `:99` status output cap. `:105` adopt path. `:106` relayout plan from `status --json`. `:108` relayout rule. `:116` next step after a re-pin |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` | Modify | `:34` relayout write list. `:85-86` plan and nothing-to-move from `offLayout`. `:125` re-read per moved copy |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `:699` the relayout clause of `gate3_location` |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modify | `:76` resolve a `../<name>` setting against the tree root before the `find` |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modify | `:187` resolve the named folder against the tree root, `../<name>` included |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/adopt-an-unowned-file.md` | Modify | `:30,42,43,50,53,58` |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/pre-commit-refuses-unowned-change.md` | Modify | `:30,42,43,50,65` |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md` | Modify | `:30,51,58` |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/status-audit-lists-unowned-drift.md` | Modify | `:42,53,55,68` |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/strict-guard-refuses-unowned-write.md` | Modify | `:30,41,42,44,56` |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/sibling-folder-relayout.md` | Create | `SKD-013`. No scenario covers a sibling folder or the capped LAYOUT output |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Wave row at `:95`, a `SKD-013` section after `:199`, coverage row at `:209` |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Modify | `:5` version `1.1.8.0` to `1.2.0.0` |
| `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` | Create | Release record for phases 001-003 |
| `../004-barter-repin-and-relayout/spec.md` | Modify | At execution time only, the line `Target Skilled commit: <C>` gets the commit id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No doc line refuses a direct-sibling overlay folder | `rg -n 'inside the tree' .skilled/commands/doctor/assets/doctor-overlay-presentation.txt` prints no line, or only lines that also contain `../<name>` |
| REQ-002 | Every doc line that states the naming rule states the `framework/` and `root/` default, and no doc describes a per-tree switch | `rg -n -e 'leading dot dropped' -e 'without its leading dot' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/**'` prints only lines that also contain `root/`, and `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'` prints nothing |
| REQ-003 | The overlay reference states the migration: LAYOUT notes and a passing status after the re-pin, nothing refused, the one action `/doctor:overlay apply --relayout`, and the mixed folder an `--adopt` leaves when it is skipped | `rg -n '^#+ Moving an existing tree onto the new layout' .skilled/skills/system-skilled-doctor/references/overlays.md` prints one line, and the passage below it contains `apply --relayout`, `offLayout` and `--adopt` |
| REQ-004 | The relayout route takes its plan and its nothing-to-move test from `offLayout` in `status --json` | `rg -n 'offLayout' .skilled/commands/doctor/overlay.md .skilled/commands/doctor/assets/doctor-overlay-apply.yaml` prints a line at the relayout plan step of each file and one at the apply re-read check |
| REQ-005 | The repin rollback step and the update-apply overlay check resolve a `../<name>` setting against the tree root | `rg -n 'against the tree root' .skilled/commands/doctor/assets/doctor-overlay-repin.yaml .skilled/commands/doctor/assets/doctor-update-apply.yaml` prints one line in each file |
| REQ-006 | The doctor overlay contract and the route manifest still hold | `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` prints `# fail 0` and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | After a clean re-pin whose re-read shows LAYOUT notes, the command names `/doctor:overlay apply --relayout` beside `/doctor:update record-base` | The re-pin result step of `.skilled/commands/doctor/overlay.md` names both commands |
| REQ-008 | The five old-layout scenarios expect the new default paths, and each still passes when run | The Measured Behavior playbook search prints nothing, and each of `SKD-005`, `SKD-006`, `SKD-007`, `SKD-009` and `SKD-010` prints its expected signals when run |
| REQ-009 | The playbook covers a sibling folder and moving an old-layout tree, the capped status output included | `rg -c 'SKD-013' .skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` prints `4`, as `SKD-012` does today, and the scenario file exists |
| REQ-010 | The skill ships release `1.2.0.0`, whose note leads with the default change and the one action | `sed -n 5p .skilled/skills/system-skilled-doctor/SKILL.md` prints `version: 1.2.0.0`, and the intro paragraph of `changelog/v1.2.0.0.md` names `framework/`, `root/` and `/doctor:overlay apply --relayout` before its first `## ` heading |
| REQ-011 | Phase 4 can find the commit it re-pins to | The `Target Skilled commit:` line in `../004-barter-repin-and-relayout/spec.md` holds the 40-hex id `git log -1 --format=%H` printed right after the commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints only doc lines that also contain `root/` and no playbook count, where today it prints 7 doc lines and 23 playbook lines in 5 files.
- **SC-002**: Following `SKD-013` on a temporary tree with `overlayDir: "../overlays"` and 21 old-layout entries prints 20 LAYOUT lines, one overflow line and `RESULT: PASSED`, lists 21 items in `offLayout`, and after one relayout prints `RESULT: PASSED` and no `LAYOUT` line.
- **SC-003**: Phase 4's spec names the Skilled commit that carries phases 1-3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 and 002 landed with the behavior the docs describe | Docs would describe behavior the engine lacks | Setup runs the engine suite and reads the refusal messages, the default rule and the overflow line from the engine before any doc edit |
| Risk | `doctor-overlay-contract.test.cjs` asserts on presentation and workflow wording (it reads the presentation at `:40`) | Med: a reworded line fails the contract | Run the contract test after each file and keep the asserted strings |
| Risk | A consumer reads the LAYOUT notes as a failure | Low: an operator might roll back a good re-pin | The release note and the migration passage say status still passes, nothing is refused and skipping the relayout breaks nothing |
| Risk | The id written into phase 4's spec is itself an uncommitted change | Low: if that edit is committed later, `git log -1` no longer prints `<C>` | Record the id printed right after the commit, and let phase 4 commit its spec with its own work |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None open. The operator answered the parent's questions on 2026-11-20, and the docs state each answer:
- **Default or switch**: the `framework/` and `root/` rule is the default for every engine consumer, with no per-tree switch (operator, 2026-11-20).
- **How far outside the tree**: only a direct sibling `../<name>`. Deeper paths are refused (operator, 2026-11-20).
- **Overlay folder outside the git repository**: refused (operator, 2026-11-20). The row quotes the engine's message, read in Setup.
- **Stage layout**: with a sibling folder the stage holds `<dir>/<tree>` and `<dir>/<overlays>` (operator, 2026-11-20).
- **Setting file and handoff**: `.skilled-overlays.json` stays at the tree root, and phase 004 records the commit this phase produces (operator, 2026-11-20).
<!-- /ANCHOR:questions -->

---


