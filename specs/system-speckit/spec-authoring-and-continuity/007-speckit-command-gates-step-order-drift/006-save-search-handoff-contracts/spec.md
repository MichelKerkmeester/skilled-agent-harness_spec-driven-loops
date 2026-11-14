---
title: "Feature Specification: Phase 6: save-search-handoff-contracts"
description: "The save, search and handoff commands each state their contract in several places that disagree. Lifecycle saves call the continuity writer without --full-auto, so they write no continuity while their outputs say they did. This phase gives each command one contract that matches the scripts it calls."
trigger_phrases:
  - "save search handoff contracts"
  - "phase 6 save search handoff contracts"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: save-search-handoff-contracts

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-resume-detection-and-single-workflow |
| **Successor** | 007-shared-blocks-and-retired-mechanisms |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is `Met`, findings S1 to S14 are closed, `test-phase-command-workflows.js` prints `failed=0` and `validate.sh --strict` prints `RESULT: PASSED` for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: The save contract in `save.md`, `save-presentation.txt`, `speckit-save-context-tail.yaml` and the save steps of the three lifecycle workflows. The search contract in `search.md` and `search-presentation.txt`. The status and runtime text in `handoff.md`. Two test assertions that read the blocks this phase removes. No script changes.

**Dependencies**:
- Phases 1 to 5 land first. They reorder and rename steps, so this phase finds the save steps by role (`step_*_save_context`) and not by number.
- Phase 2 replaces point gates with required checks. Its checks that name the save (`memory_saved`, `context_saved`) must still point at the one save step this phase keeps.
- Phase 5 makes resume read the session pointer. The writer mints that pointer only when a save passes `--session-id` and `--runtime`, and this phase adds both flags to every lifecycle save.
- Phase 7 rechecks findings B3 and B7. Part of B7's evidence (`memory_action: save` in implement `step_6_5_checkpoint_development`) sits in a step this phase deletes. B3's evidence (`speckit-implement.yaml:748`, the prose `when:`) sits inside the implement `write_continuity` block this phase deletes.
- Phase 8 aligns step counts. `save-presentation.txt` and `search-presentation.txt` keep their names, so this phase edits both files in place and leaves the counts to phase 8.

**Deliverables**:
- One writer invocation shape in the tail, `save.md` and `handoff.md`, with `--full-auto` on every continuity save.
- One save step per lifecycle workflow, with no write block of its own and no closing offer of a second save.
- A save display with a row for every item the router promises and a full-auto result block built from the writer's own output lines.
- A search router and display that cover all three output modes and give exit 2 one meaning.
- One STATUS table in `handoff.md` and runtime lists labelled with the script that owns them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The lifecycle save steps call `generate-context.js` with a temp file and no `--full-auto`, so the writer runs as `plan-only` and logs `Continuity fields not written` while each step's outputs line says continuity was refreshed. The save tail also tells the agent to regenerate metadata the writer already wrote and to add uppercase anchors that fail the corpus anchor grammar, and the search router tells the agent that exit 2 means both "retry with the raw recipe" and "execution failure". The agent reads a different contract in each file, and the operator gets a packet whose resume state is stale after a run that reported success.

### Purpose
An agent that follows `/speckit:save`, `/speckit:search`, `/speckit:handoff` or a lifecycle save step reads one contract per command, and that contract matches what `generate-context.js`, `rg-wrapper.mjs`, `lookup-trigger-index.mjs` and `session-relaunch.cjs` accept and print.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n -o 'generate-context\.js[^`"]*' .skilled/commands/speckit/save.md .skilled/commands/speckit/handoff.md .skilled/commands/speckit/assets/speckit-save-context-tail.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/handoff.md:83:generate-context.js --stdin --full-auto <spec-folder>
.skilled/commands/speckit/save.md:19:generate-context.js
.skilled/commands/speckit/save.md:44:generate-context.js
.skilled/commands/speckit/save.md:113:generate-context.js
.skilled/commands/speckit/save.md:139:generate-context.js
.skilled/commands/speckit/assets/speckit-complete.yaml:1327:generate-context.js
.skilled/commands/speckit/assets/speckit-complete.yaml:1328:generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder-path]'
.skilled/commands/speckit/assets/speckit-save-context-tail.yaml:16:generate-context.js /tmp/save-context-data-<session-id>.json {spec_path}
.skilled/commands/speckit/assets/speckit-save-context-tail.yaml:17:generate-context.js. Nothing else runs after it.
.skilled/commands/speckit/assets/speckit-save-context-tail.yaml:18:generate-context.js
.skilled/commands/speckit/assets/speckit-save-context-tail.yaml:19:generate-context.js is the whole write. There is no indexing handoff, no daemon to wait for and no launcher file to check. Regenerate the packet's description.json and graph-metadata.json after it, then validate.
.skilled/commands/speckit/assets/speckit-implement.yaml:745:generate-context.js
.skilled/commands/speckit/assets/speckit-implement.yaml:746:generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder-path]'
```

The output shows three shapes. `handoff.md:83` pipes JSON with `--stdin --full-auto`. The tail and the two inline blocks pass a temp file with no `--full-auto`. `save.md:19` names the script with no arguments. Tail lines 17 and 19 contradict each other. The writer's own help says every planner mode refreshes `description.json` and `graph-metadata.json` and only `--full-auto` writes the continuity fields, and `runtime/cli/dist/core/workflow.js:1767` logs `Continuity fields not written: plan-only save` on every run without it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace the three writer invocation shapes with one `--stdin --full-auto --session-id <id> --runtime <slug>` call, and remove the tail's regenerate instruction, its anchor block and the inline write blocks in the lifecycle save steps.
- Remove the intermediate checkpoint saves and the closing offer of a second save from the plan, implement and complete workflows and from the complete closeout display, so each workflow runs one save step.
- Rewrite the save display so every promised item has a row, the trigger editor is gone and a full-auto result block renders the writer's own output lines.
- Correct the search router and display so path-only and count runs have row shapes, `--limit` is documented on both lanes and a phrase that starts with `--` is routed before any run.
- Fix `handoff.md` in place: one STATUS table holding all four shapes, and each runtime list labelled with the script that owns it. No handoff presentation file is created, because the drift is restatement inside one file and one table in that file removes it.

### Out of Scope
- Changes to `generate-context.js`, `session-relaunch.cjs`, `rg-wrapper.mjs` and `lookup-trigger-index.mjs` - the parent spec freezes the scripts, so each script defect found here is recorded as a follow-up.
- Step counts in routers, presentation files and the README - phase 8 aligns them once phases 1 to 7 have fixed the step lists.
- Renaming `save-presentation.txt` and `search-presentation.txt` - both names stay, and phase 8 closes finding A6 as intentional.
- The `memory_saved` and `context_saved` gate checks - phase 2 owns the gates and phase 7 owns the retired vocabulary.
- The resume workflow and its detection order - phase 5 owns resume.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml` | Modify | One invocation key, one post-save statement, no anchor block |
| `.skilled/commands/speckit/save.md` | Modify | Writer shape, one full-auto mode, runtime list label, presentation boundary list |
| `.skilled/commands/speckit/handoff.md` | Modify | Writer shape in Step 2, STATUS table, runtime list labels and the DSH line |
| `.skilled/commands/speckit/search.md` | Modify | `--limit` on both lanes, wrapper for path and count, phrase routing before the run |
| `.skilled/commands/speckit/assets/save-presentation.txt` | Modify | Plan rows, follow-up values, full-auto result block, no trigger editor and no anchor rows |
| `.skilled/commands/speckit/assets/search-presentation.txt` | Modify | Path-only and count row shapes, hidden counts, corrected filled example |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | One save step, no closing save offer, confirm override without the save offer |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | One save step, no checkpoint save, no inline write block, no closing save offer |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | One save step, no checkpoint saves, no inline write block, no closing save offer |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | The workflow closeout drops its `[done or memory-save]` prompt, the display side of the removed closing step |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modify | T-EM7 stops requiring `anchor_requirements:` in the tail |
| `.skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts` | Modify | The `after:` timing assertion reads the tail's `post_save_write` block instead of complete's removed `write_continuity` block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every writer call in `speckit-save-context-tail.yaml`, `save.md` and `handoff.md` reads `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin --full-auto --session-id <id> --runtime <slug> <spec-folder>` with the JSON piped in, and `save.md` names one writing mode, full-auto, in place of "apply/full-auto". `rg -n -F '/tmp/save-context-data' .skilled/commands/speckit` prints nothing and exits 1. `rg -c -F 'generate-context.js --stdin --full-auto --session-id <id> --runtime <slug>'` prints at least 1 for each of the three files. `rg -n 'apply/full-auto' .skilled/commands/speckit/save.md` prints nothing (closes S4) |
| REQ-002 | The tail states that the writer refreshes `description.json` and `graph-metadata.json` itself and names one read-only check after it, `validate.sh {spec_path} --strict`. `rg -n -e 'Regenerate the packet' -e 'Nothing else runs' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints nothing and exits 1, and `rg -c 'validate.sh' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints 1 (closes S1) |
| REQ-003 | `search.md` routes a `QUERY` that starts with `--` to the raw Section 2.1 recipe before any wrapper run, and every exit 2 or higher from either lane renders the Section 7 error display. `rg -n 'as a flag and exits' .skilled/commands/speckit/search.md` prints nothing and exits 1, and `rg -n 'starts with .--. .*before .*wrapper' .skilled/commands/speckit/search.md` prints one line (closes S8) |
| REQ-004 | The tail carries no `anchor_requirements` block, the save display carries no anchor rows and T-EM7 no longer requires the block. An agent that wrote the tail's `GENERAL-SESSION-SUMMARY-{spec#}` ids would fail the corpus anchor grammar (`check-grep-convention-helper.mjs:55` accepts lower-kebab or one uppercase segment). `rg -n -e 'anchor_requirements' -e 'minimum_anchors' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` and `rg -n -e 'ANCHORS=' -e '<anchor_1>' .skilled/commands/speckit/assets/save-presentation.txt` each print nothing and exit 1, and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` (closes S12) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The tail's invocation key is named `invocation` and sits under `post_save_write`. `rg -n 'pre_index' .skilled/commands/speckit` prints nothing and exits 1, and `rg -n '^    invocation:' .skilled/commands/speckit/assets/speckit-save-context-tail.yaml` prints one line (closes S2) |
| REQ-006 | The save display has no trigger editor and `save.md` lists no trigger-edit display. Trigger correction stays the tool-map row that edits `trigger_phrases` and reruns the writer. `rg -n -e 'SPECKIT:TRIGGERS' -e 'Trigger-edit' -e 'Record      #' .skilled/commands/speckit/save.md .skilled/commands/speckit/assets/save-presentation.txt` prints nothing and exits 1 (closes S3) |
| REQ-007 | `save.md` labels its runtime list as the writer's `--runtime` values (claude, codex, opencode, pi, devin, dsh and cursor, from `KNOWN_RUNTIMES` in `generate-context.js`). `handoff.md` labels its list as the `session-relaunch.cjs --runtime` values (claude, pi, opencode, codex, cursor and devin, from `RUNTIMES` in `relaunch-core.cjs`) and says a DSH session saves through the writer but `prepare` refuses `--runtime dsh`. `rg -n -i 'dsh' .skilled/commands/speckit/handoff.md` prints at least one line and `rg -c -F 'session-relaunch.cjs --runtime' .skilled/commands/speckit/handoff.md` prints at least 1 (closes S5) |
| REQ-008 | `search.md` runs the path-only and count modes through `rg-wrapper.mjs path` and `rg-wrapper.mjs count`, and Section 3 of the search display gives each its own row shape: `<path>` from `record.paths` and `<count>  <path>` from `record.counts`, with `HIDDEN` taken from `record.hidden`. Path-only and count runs accept the wrapper's cap of 20 files, and `search.md` names `--limit 0` as the way to lift it. The filled example's `recipe` line matches its rows. `rg -n 'run their recipe directly' .skilled/commands/speckit/search.md` prints nothing and exits 1, `rg -n 'path-only and count.*--limit 0' .skilled/commands/speckit/search.md` prints at least one line, `rg -c -F '<count>  <path>' .skilled/commands/speckit/assets/search-presentation.txt` prints at least 1 and `rg -c -F 'recipe    2.1 structured' .skilled/commands/speckit/assets/search-presentation.txt` prints 1, because the example's rows carry a line, a field and a class (closes S6) |
| REQ-009 | `search.md` documents `--limit <n>` in its argument hint and on the trigger-index lane, with the script's default of 20 and `--limit 0` for every candidate. `rg -n 'argument-hint:.*--limit' .skilled/commands/speckit/search.md` prints one line and `rg -n 'lookup-trigger-index.mjs.*--limit' .skilled/commands/speckit/search.md` prints at least one line (closes S7) |
| REQ-010 | The save plan display has a row for each item `save.md` promises in default mode: `Blockers`, `Advisories`, `Decisions` for pending operator answers and `Orphans` for the sessions `match-decision-table.js --scan-orphans` lists. `rg -c '^Blockers ' .skilled/commands/speckit/assets/save-presentation.txt` prints at least 1, and the same command prints at least 1 for each of `^Advisories `, `^Decisions ` and `^Orphans ` (closes S9) |
| REQ-011 | The save display's follow-up values drop `refresh-graph`, which every writer run already does, and a `SPECKIT:SAVE FULL-AUTO` result block renders the writer's lines: `Wrote continuity to <pointer>` or `Continuity fields not written`, `Wrote <n> operator decision(s) to <folder>` and `session_ref skipped: <reason>`. `rg -n 'refresh-graph' .skilled/commands/speckit/assets/save-presentation.txt` prints nothing and exits 1, and `rg -c 'SPECKIT:SAVE FULL-AUTO' .skilled/commands/speckit/assets/save-presentation.txt` prints 1 (closes S10) |
| REQ-012 | `handoff.md` states its STATUS shapes once, in one table in section 2 that holds four rows: prepared, manual, refused and `continuity save failed: <reason>`. Steps 2 and 5 name the row and do not restate it. No handoff presentation file is created. `rg -c -e 'STATUS=OK' -e 'STATUS=FAIL' .skilled/commands/speckit/handoff.md` prints 4 and `find .skilled/commands/speckit/assets -name '*handoff*'` prints nothing (closes S11) |
| REQ-013 | The save step of each lifecycle workflow carries no `write_continuity` block and points at the tail through `shared_tail`, so the tail is the one source of the writer call. `rg -n 'write_continuity' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1, and `node --import tsx --test tests/boolean-expr.test.ts` run from `.skilled/skills/system-spec-kit/shared` prints `fail 0` (closes S13) |
| REQ-014 | Each lifecycle workflow writes continuity in exactly one step. The intermediate checkpoint saves (implement `step_6_5_checkpoint_development`, complete `step_6_5_checkpoint_planning` and `step_10_5_checkpoint_development`) are removed, because `rg -n 'checkpoint__' .skilled` finds no reader of the scratch files they write. The closing steps (plan `step_7_handover_check`, implement `step_9_session_handover_check` and complete `step_14_handover_check`) are removed, and each one's closeout text moves to `termination.message`. The complete closeout display drops its `memory-save` choice and the `checkpoints:` lists and `termination` blocks match. `rg -n 'handover_check' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1. `sed -n '/^termination:/,/^[a-z]/p' <file> \| rg -c '^  message: ".*[Cc]omplete'` prints 1 for each of the three files. `rg -n 'memory-save' .skilled/commands/speckit/assets/speckit-complete-presentation.txt` prints nothing and exits 1. `rg -n -e 'checkpoint__' -e 'Run /speckit:save' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and exits 1, `rg -c '^  step_[0-9_]+_save_context:'` prints 1 for each of the three files and `test-phase-command-workflows.js` prints `failed=0` (closes S14) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints one argument shape, `--stdin --full-auto --session-id <id> --runtime <slug>`, and no `/tmp/save-context-data` path.
- **SC-002**: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` after the change, against a baseline of `passed=150 failed=0`.
- **SC-003**: `node --import tsx --test tests/boolean-expr.test.ts` run from `.skilled/skills/system-spec-kit/shared` prints `fail 0` after the change, against a baseline of `pass 1` and `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 to 5 rename and reorder the lifecycle steps | A requirement that names a step number would point at the wrong step | Find save steps by the `step_*_save_context` role pattern and re-read each file at phase start |
| Dependency | Two test files outside `.skilled/commands/speckit/` assert the blocks this phase removes | The suite turns red if the tests stay as they are | Update T-EM7 and the `after:` assertion in the same change. The operator allowed this edit on 2026-11-14 |
| Risk | Adding `--full-auto` makes every lifecycle save write continuity and any `operatorDecisions` in its payload | Medium. A save now writes `decision-record.md` where today it wrote nothing | The writer writes only the decisions the payload carries. The operator chose `--full-auto` on 2026-11-14 |
| Risk | Removing the closing step changes the step count the routers and presentation files state | Low. Counts are already wrong (finding A1) | Phase 8 aligns every count after this phase |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

N/A. This phase edits command text, workflow YAML and two test assertions. It runs no service and changes no script.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a runtime with no session-id variable, such as Devin or Cursor, runs `uuidgen` once as `handoff.md` Step 1 says, so the writer call always carries `--session-id`. A `--runtime cursor` save omits `session_ref` and still writes continuity.
- Maximum input: a search phrase that starts with `--` goes straight to the raw Section 2.1 recipe, because `rg-wrapper.mjs` rejects any argument that starts with `--` as `unknown argument` and exits 2.
- Failure path: a writer exit other than 0 renders the save error display with the writer's stderr, and the lifecycle workflow stops before termination.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Twelve files, about 200 changed lines, no script |
| Risk | 9/25 | Lifecycle saves start writing continuity. Two test assertions move |
| Research | 5/20 | Script argument parsing and runtime lists already read for this spec |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: lifecycle saves in plan, implement and complete pass `--full-auto` to the continuity writer. Each save step's outputs line already promises refreshed continuity and only `--full-auto` writes it. REQ-001 and REQ-013 are written to this.
- Decided 2026-11-14: a phase may edit the tests and docs outside `.skilled/commands/speckit/` that assert the current text, and it updates the ones it invalidates. This phase updates T-EM7 in `test-phase-command-workflows.js` and the `after:` assertion in `boolean-expr.test.ts`.
- Decided 2026-11-14: the closing step that only offers a second save is removed from plan, implement and complete, and its closeout text moves to `termination.message`. `/speckit:handoff` already saves before a hop. REQ-014 is written to this.
- Decided 2026-11-14: save's "apply" mode folds into full-auto. The tool-map row "edit `trigger_phrases`, then rerun the writer" now reruns a full-auto save, which writes the same metadata and adds fresh continuity.
- Decided 2026-11-14: path-only and count searches accept the wrapper's 20-file cap, and `search.md` documents `--limit 0` as the way to lift it. REQ-008 is written to this.
- Decided 2026-11-14: `save-presentation.txt` and `search-presentation.txt` keep their names. Phase 8 closes finding A6 as intentional.
- Decided 2026-11-14: two script defects stay out of scope and are recorded as follow-ups, not requirements.
- Follow-up: `session-relaunch.cjs` has no `dsh` runtime, and `prepare` with no `--runtime` outside the loop records the session as `claude`. REQ-007 states the gap in `handoff.md`.
- Follow-up: `rg-wrapper.mjs` does not accept `--` as an end-of-options marker, so a phrase that starts with `--` can never pass through it. REQ-003 routes such a phrase to the raw recipe.
<!-- /ANCHOR:questions -->

---


