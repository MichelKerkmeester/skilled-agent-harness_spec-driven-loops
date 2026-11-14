---
title: "Feature Specification: Phase 8: router-readme-presentation-alignment"
description: "Phase 8 aligns the speckit routers, README.txt, the presentation files and the asset names with the workflows that phases 1 to 7 leave behind. Every stated step count, flag list, file list, artifact list and next step then matches the file that owns it."
trigger_phrases:
  - "router readme presentation alignment"
  - "phase 8 router readme presentation alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: router-readme-presentation-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-shared-blocks-and-retired-mechanisms |
| **Successor** | None |
| **Handoff Criteria** | Every CHECK block in `plan.md` section 5 prints its expected output, `acceptance-criteria.md` has no `Unmet` row and `validate.sh --strict` prints `RESULT: PASSED`. This is the last phase, so the parent closes next |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: This phase edits text that describes the workflows. It touches the seven routers, `README.txt`, the presentation files and two kinds of key in the lifecycle workflows: `termination` and the Q1 option D outcome. It changes no step order, gate, mode contract, dispatch rule or resume logic. Those belong to phases 1 to 7.

**Dependencies**:
- Phases 1 to 7 are Complete. Each requirement here reads its truth from the workflow files as they stand when this phase starts, so this phase runs last.
- Phase 2 makes `/speckit:plan` write `tasks.md` in a new task breakdown step (finding G3). REQ-001 follows the plan workflow's `outputs:` lists as phase 2 leaves them.
- Phase 3 settles the mode tokens in each router's `argument-hint`. REQ-005 copies them.
- Phase 4 removes the dispatch config that setup question Q3 maps to. REQ-012 then removes Q3.
- Phase 5 leaves one resume workflow. REQ-004 and REQ-006 read it.
- Phase 6 settles `save.md` and `search.md` and removes the closing step from each lifecycle workflow. REQ-004 counts the steps that remain, and REQ-008 checks the two presentation assets under the names they keep.
- Phase 7 may add a shared include under `assets/`. REQ-006 lists it in the README tree.

**Deliverables**:
- Routers, `README.txt` and presentation files that state the same step counts, flags, files and next steps as the workflows.
- `save-presentation.txt` and `search-presentation.txt` under their current names, with the naming rule stated once in `README.txt` and every caller resolving.
- One wording for the blocks the lifecycle presentation files repeat, kept in place.
- Q1 option D in plan and complete that states its outcome.
- Setup prompts with no Q3 Dispatch Mode and a `prior_continuity_choice` field in place of `memory_choice`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The router, the workflow, the presentation file and `README.txt` of one command state different facts, so an agent or operator who trusts any one of them is misled. The plan router claims a step count its workflow does not have. The plan success text names `tasks.md` and `acceptance-criteria.md` although no plan step writes them. The plan workflow and the README tell the reader to type `/speckit:implement:auto` and `/speckit:plan:auto`, which no router parses. Setup question Q1 offers option D with no stated outcome, and no workflow step handles it. The README omits flags, presentation files and the autopilot mode. The plan, implement and complete setup prompts ask a dispatch question that no workflow will read once phase 4 lands, and four presentation files name a `memory_choice` field in retired vocabulary.

### Purpose
Every count, flag, file name, artifact and next step that a router, a presentation file or `README.txt` states is derived from the workflow or router that owns it, and a named check proves each one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -c '^  step_[1-9][0-9]*_[a-z]' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml && rg -n '^description: .*steps|^\| \*\*(plan|implement|complete)\*\* ' .skilled/commands/speckit/plan.md .skilled/commands/speckit/implement.md .skilled/commands/speckit/complete.md .skilled/commands/speckit/README.txt
.skilled/commands/speckit/assets/speckit-implement.yaml:9
.skilled/commands/speckit/assets/speckit-complete.yaml:14
.skilled/commands/speckit/assets/speckit-plan.yaml:7
.skilled/commands/speckit/implement.md:2:description: "Implementation workflow, 9 steps: execute pre-planned work from plan.md. Modes :auto, :confirm, :autopilot."
.skilled/commands/speckit/complete.md:2:description: "End-to-end SpecKit workflow, 14+ steps. Modes :auto, :confirm, :autopilot; :with-* workflow modifiers."
.skilled/commands/speckit/plan.md:2:description: "Planning workflow, 8 steps: spec through plan only. Modes :auto, :confirm, :autopilot; :with-* modifiers."
.skilled/commands/speckit/README.txt:82:| **plan** | `/speckit:plan <description> [:auto\|:confirm] [:with-phases]` | 7 | Create spec folder and plan without implementation. `:with-phases` adds phase decomposition pre-workflow |
.skilled/commands/speckit/README.txt:83:| **implement** | `/speckit:implement <spec-folder> [:auto\|:confirm]` | 9 | Execute pre-planned work (requires existing plan.md) |
.skilled/commands/speckit/README.txt:88:| **complete** | `/speckit:complete <description> [:auto\|:confirm] [:with-research] [:with-phases]` | 14+ | Full end-to-end workflow combining all phases. `:with-phases` adds phase decomposition pre-workflow |
$ bash check-a1.sh   # the CHECK-A1 block from plan.md section 5
MISMATCH plan router=8 count=7
MISMATCH implement router=9 count=12
MISMATCH implement readme=9 count=12
MISMATCH implement success=9 count=12
MISMATCH implement dashboard=9 count=12
MISMATCH complete router=14+ count=18
MISMATCH complete readme=14+ count=18
MISMATCH complete success=14 count=18
MISMATCH complete dashboard=14 count=18
NOT ONE WORKFLOW resume
```

The plan workflow has 7 numbered steps and its router says 8. The complete workflow has 14 and its router and README say `14+`. The README invocation cells carry no `:autopilot`, `:with-context` or `--phase-folder`, which the router `argument-hint` lines carry. These counts skip half-step keys such as `step_6_5_checkpoint_development`. REQ-004 counts them, so the CHECK-A1 run above counts 12 steps in implement and 18 in complete. The other defects this phase closes are shown by the CHECK blocks in `plan.md` section 5, which were run on 2026-11-14 against the review-time files.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Set every stated step count in the routers, `README.txt`, the presentation files and the `termination` blocks to the number the workflow derives.
- Rewrite the README command table, tree, execution-mode flag table and usage examples from the routers and the `assets/` listing.
- Keep `save-presentation.txt` and `search-presentation.txt` under their names, keep the one README sentence that states the naming rule where the tree lists the assets and prove every caller still resolves.
- Align the blocks that the lifecycle presentation files repeat in place. No shared presentation file is created, because none of the presentation files under `.skilled/commands/` includes another and the only measured drift is one placeholder pair in the complete failure block.
- State the outcome of Q1 option D in the plan and complete presentation files and workflows, and list in plan's success text only the files plan writes.
- Remove setup question Q3 and the `dispatch_mode` field from the plan, implement and complete presentation files, and rename `memory_choice` to `prior_continuity_choice` in the four lifecycle presentation files.

### Out of Scope
- Step order, gate checks, mode contracts, review dispatch, resume detection, save and search contracts and shared workflow blocks. Phases 1 to 7 own them.
- Renaming the two presentation assets. Both names stay, so no caller outside `.skilled/commands/speckit/` changes.
- The `dispatch_modes:` blocks in the lifecycle workflows. Phase 4 owns them.
- The `memory_choice` keys under `.skilled/commands/create/`. They belong to another command family.
- The wording of Q1 option C. It is the canonical Gate 3 text in `GATE_3_CHOICE_RELATED`, which `gate-3-menu-parity.test.mjs` enforces across many files. Changing it is a script change, which the parent excludes.
- The attached-suffix form outside this command folder, at `auto-mode-contract.md:200`, `text.ts:39` and `skill_advisor.py:2999`. The advisor scorer accepts that form on purpose when it scores a prompt.
- The `/deep:*` rows and the `deep/` tree in `README.txt`. The parent excludes the `/deep:*` group.
- A shared presentation include file. See the fourth In Scope line for why.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/README.txt` | Modify | Command table steps and invocations, tree, section 7 flag table, usage example. The naming-rule sentence stays |
| `.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modify | Step count in the `description` line |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` | Modify | Step counts, `Artifacts:` lines, Q1 option D, Q3 and `dispatch_mode` removed, `memory_choice` renamed |
| `.skilled/commands/speckit/assets/speckit-implement-presentation.txt` | Modify | Step counts, Q3 and `dispatch_mode` removed, `memory_choice` renamed |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | Step counts, failure block, Q1 option D, Q3 and `dispatch_mode` removed, `memory_choice` renamed |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modify | `memory_choice` renamed |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modify | `termination` step number, plan `next_steps`, `spec_folder_skip` in plan and complete |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Each CHECK named below is a fenced block in `plan.md` section 5. Run it with `bash` from the repository root.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | (closes A10) The success `Artifacts:` line and the dashboard `Artifacts:` row of `speckit-plan-presentation.txt` name only `.md` files that a step `outputs:` list in `speckit-plan.yaml` writes, as that workflow stands when this phase starts. CHECK-A10 prints nothing |
| REQ-002 | (closes A5) No file under `.skilled/commands/speckit/` writes a command with an attached mode suffix such as `/speckit:plan:auto`. The README example and the plan `termination.next_steps` use the router form, for example `/speckit:implement <spec-folder> :auto`. CHECK-A5 prints no match line and `rg` exits 1 |
| REQ-003 | (closes A8, option D) Q1 option D in `speckit-plan-presentation.txt` and `speckit-complete-presentation.txt` states its outcome in parentheses after `D) Skip documentation`. Each of `speckit-plan.yaml` and `speckit-complete.yaml` carries one `spec_folder_skip:` key that states the same outcome. The outcome, decided 2026-11-14: the run stops before step 1 and writes nothing. CHECK-A8 prints a count of 1 for each of the four files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | (closes A1) For each command whose router names exactly one workflow YAML with a `step_1_` key, the step count N is the number of top-level step keys numbered 1 or more in that workflow as it stands when this phase starts. Half-step keys such as `step_6_5_checkpoint_development` count. The half-step separator may be `_` or `.`, as in `step_0.5_intake_branch`, and a key numbered below 1 is not counted. A key whose name holds `autopilot` runs only under autopilot and is not counted. The integer parts of the counted keys run from 1 with no gap. The last step L is the highest counted key number. The router `description`, the README Steps cell, the success line and the dashboard total each state N or state no number. `termination.after_step` and the termination message each state L or state no number. A `+` suffix such as `14+` is dropped. This spec fixes no value for N or L, because the new plan task breakdown step and the removed closing steps change both before this phase starts. The README handoff Steps cell equals the number of step rows in `handoff.md` section 3. CHECK-A1 prints nothing |
| REQ-005 | (closes A2) The Invocation cell of each README command row carries the same mode and flag tokens as the `argument-hint` line of that router, as the routers stand when this phase starts. CHECK-A2 prints nothing |
| REQ-006 | (closes A3) The `speckit/` tree in `README.txt` lists every router, `README.txt` and every file in `assets/`, lists no file that does not exist and states no command count that `ls .skilled/commands/speckit/*.md` disproves. CHECK-A3 prints nothing |
| REQ-007 | (closes A4) README section 7 lists every entry of the Workflow Flag Surface table in `complete.md` and its lead sentence states no number of flags. CHECK-A4 prints nothing |
| REQ-008 | (closes A6 as intentional) `save-presentation.txt` and `search-presentation.txt` keep their names. `README.txt` states the naming rule in one sentence in its structure section, where the tree lists the assets: `save` and `search` drop the `speckit-` prefix because the bare command name reads unambiguously. The sentence at review-time line 166 already does this and stays. Every presentation-asset path under `.skilled` that names `save` or `search` resolves to a file that exists, and no caller is edited for the names. CHECK-A6 lists both files, prints no `UNRESOLVED` line, prints a count of 1 for the README sentence and prints `STATUS=OK` |
| REQ-009 | (closes A7) The failure block and the auto fail-fast block of the plan, implement and complete presentation files read the same apart from the command title. The preamble line and the closing line of all four lifecycle presentation files read the same apart from the command name. Resume keeps its own fail-fast hint because its one required input is a spec folder. No shared presentation file is created, so each presentation file is loaded by exactly one router. Every line CHECK-A7 prints is 1 |
| REQ-010 | (closes A8, option C) Q1 option C keeps the canonical `GATE_3_CHOICE_RELATED` text in every file the parity test lists. CHECK-A8 prints `ℹ fail 0` |
| REQ-011 | (closes A9) Each router in `.skilled/commands/speckit/` has exactly one row in the README command table, and the `/speckit:handoff` row at review-time line 91 stays. CHECK-A9 prints no `README ROWS` line and prints `STATUS=OK` |
| REQ-012 | (closes X2) Setup question Q3 Dispatch Mode and the `dispatch_mode` field leave `speckit-plan-presentation.txt`, `speckit-implement-presentation.txt` and `speckit-complete-presentation.txt`: the question line, the pre-bound marker line and the resolution table row. The later questions are renumbered so each file's questions run from Q0 with no gap. The `Reply format covers` range ends at the last question, and each example reply holds one value per question. CHECK-X2 prints only `rg exit=1` |
| REQ-013 | (closes X3) The `memory_choice` field is renamed to `prior_continuity_choice` in the pre-bound marker block and the resolution table of `speckit-plan-presentation.txt`, `speckit-implement-presentation.txt`, `speckit-complete-presentation.txt` and `speckit-resume-presentation.txt`. The new name says what the field holds: a choice about prior continuity. CHECK-X3 prints `rg exit=1` and then a count of 2 for each of the four files |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: Each CHECK block in `plan.md` section 5, run from the repository root after phases 1 to 7 close, prints the expected output its acceptance row names.
- **SC-002**: `node --test gate-3-menu-parity.test.mjs` prints `ℹ fail 0` and `command-catalog-mirror-check.cjs` prints `STATUS=OK`, as both did on 2026-11-14 before this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 to 7 Complete | A count or flag copied before an earlier phase lands goes stale again | Start only when phase 7's `acceptance-criteria.md` has no `Unmet` row. Run every CHECK block again at the end of this phase |
| Risk | Phase 1 or 7 changes the shape of the step keys, for example by moving steps into the shared include that phase 7 may add to each router's owned assets | Med. CHECK-A1 would read the wrong number or the wrong file | CHECK-A1 picks the one owned YAML that has a `step_1_` key, so an include without steps is skipped. It counts half-step keys and prints `NOT ONE WORKFLOW` or `GAP` when the shape is not one file whose integer step parts run from 1 with no gap. Update its key pattern to the new shape before editing any count |
| Risk | Removing Q3 leaves a gap in the question numbers or a reply example with the wrong number of values | Med. An operator's reply maps to the wrong question | CHECK-X2 compares the question numbers with the `Reply format covers` range and counts the values in each example reply |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

N/A. This phase edits command documents. It runs no service and adds no code path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a file that states no step count passes CHECK-A1, because an absent number cannot disagree with the workflow.
- Maximum input: CHECK-A2, CHECK-A3 and CHECK-A9 loop over every router and every file in `assets/`, so a file added by an earlier phase fails CHECK-A3 until the README tree lists it.
- Failure path: a router that names two workflow files prints `NOT ONE WORKFLOW` in CHECK-A1, which is what resume prints today while it has `speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 11 files, all text, all under `.skilled/commands/speckit/` |
| Risk | 8/25 | A gap in the renumbered setup questions maps a reply to the wrong question. CHECK-X2 catches it |
| Research | 4/20 | The callers and the counting rule are already found |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: `save-presentation.txt` and `search-presentation.txt` keep their names, and finding A6 closes as intentional. `README.txt` states the naming rule in one sentence where it lists the assets. REQ-008 is written to this, so no file outside `.skilled/commands/speckit/` changes for the names.
- Decided 2026-11-14: Q1 option D keeps the outcome REQ-003 states. The run stops before step 1 and writes nothing, because both commands exist to write a packet.
- Decided 2026-11-14: a phase may edit the tests and docs outside `.skilled/commands/speckit/` that assert the current text, and it updates the ones it invalidates. A search on 2026-11-14 found none that this phase invalidates. The goal offer contract test matches the Session Goal line by its text and the Gate 3 parity test reads only the Q1 line, so removing Q3 and renumbering the later questions breaks neither.
- Decided 2026-11-14: `/speckit:plan` writes `tasks.md` in a new task breakdown step, and the closing step that only offers a second save leaves plan, implement and complete. REQ-001 and REQ-004 read the workflows as they stand after both changes and fix no step number.
- Phase 8 owns findings X2 and X3. REQ-012 removes Q3 and `dispatch_mode` (closes X2). REQ-013 renames `memory_choice` to `prior_continuity_choice` (closes X3).
- The parent's Files to Change table gives phase 8 no row for `speckit-plan.yaml`, `speckit-implement.yaml` or `speckit-complete.yaml`. REQ-001, REQ-002, REQ-003 and REQ-004 need small edits there. The parent table should add phase 8 to those rows.
- Ledger row A9 is wrong. `README.txt:91` already holds the `/speckit:handoff` row. REQ-011 keeps it as an invariant instead of adding it.
- Ledger row A1 counts "15 numbered steps" for complete, which includes `step_0_autopilot_envelope`. REQ-004 counts from step 1 and counts half-step keys. Phase 3 may remove step 0 anyway.
- Ledger row A5 says no router parses the attached suffix. That is true of the routers. The skill advisor scorer does accept it when it scores a prompt, and this phase leaves the scorer alone.
<!-- /ANCHOR:questions -->

---


