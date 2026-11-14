---
title: "Implementation Summary"
description: "The speckit routers, README.txt and presentation files state the step counts, flags, files and next steps that the workflows and routers own."
trigger_phrases:
  - "router readme presentation alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment"
    last_updated_at: "2026-11-14T16:47:43Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 8 with every acceptance row Met at 32fe50e944"
    next_safe_action: "Run validate.sh --recursive --strict on the parent packet"
    packet_purpose: "Purpose: Every count, flag, file name, artifact and next step that a router, a presentation file or `README.txt` states is derived from the workflow or router that owns it, and a named check proves each one."
    blockers: []
    key_files:
      - ".skilled/commands/speckit/README.txt"
      - ".skilled/commands/speckit/assets/speckit-plan-presentation.txt"
      - ".skilled/commands/speckit/assets/speckit-complete-presentation.txt"
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/skills/system-spec-kit/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:184c6272be4df3d73fabf85b1874579894354acb9dc9b1b24627fc0180acefdd"
      session_id: "scaffold-008-router-readme-presentation-alignment"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "9779735f-9302-4aae-a461-3abede5e49b7"
      workspace: "/Users/michelkerkmeester/worktrees/public/381-speckit-command-gates-step-order-drift"
      savedAt: "2026-11-14T16:47:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-router-readme-presentation-alignment |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The speckit routers, `README.txt` and the presentation files now state the step counts, flags, files, artifacts and next steps that the workflows and routers own, and the setup prompts ask no question that no workflow reads.

### Phase 8: router-readme-presentation-alignment

You can now trust any one of the four places that describe a command. Plan says 7 steps and complete says 13 in the router, the README, the dashboard and the success line. Implement already said 9. The README resume row says 5 where it said `varies`. Complete's `termination.after_step` is 13, the last step every mode runs, and a new `autopilot_after_step: 13.5` names the step only autopilot adds.

The README command table copies each router's `argument-hint`, so it shows autopilot, `:with-context`, `--level`, `--phase-folder`, `--no-redirect` and `--limit`. Its tree lists every file in `assets/`, section 7 lists all six workflow inputs of complete and an Autopilot mode row, and the phase example uses the router form with the mode as its own argument.

The plan, implement and complete setup prompts lose Q3 Dispatch Mode and the `dispatch_mode` field, and their later questions are renumbered with matching reply examples. The four lifecycle presentation files name the field `prior_continuity_choice`. Q1 option D in plan and complete states its outcome, and both workflows carry it as `spec_folder_skip`. Plan's success text and dashboard name only the files a plan step writes.

Two operator decisions on 2026-11-14 widened the phase. The copies of the two changed router descriptions were updated: `command-metadata.json`, the generated command bridges with `projection.ts`, and the parent commands README. Seven stale lines were fixed: four in the plan workflow and one in the plan presentation that said step 7 or Steps 1-7, and two in the README.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/README.txt` | Modified | Command table invocations and steps, tree, section 7 mode and flag tables, phase example, overview sentence, shared-tail bullet |
| `.skilled/commands/speckit/plan.md`, `complete.md` | Modified | Step count in the `description` line |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt`, `speckit-complete-presentation.txt` | Modified | Q3 and `dispatch_mode` removed, questions renumbered, field renamed, Q1 option D outcome, artifacts and step counts, failure block placeholders |
| `.skilled/commands/speckit/assets/speckit-implement-presentation.txt` | Modified | Q3 and `dispatch_mode` removed, questions renumbered, field renamed |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modified | Field renamed |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modified | `spec_folder_skip`, router-form `next_steps`, four lines that named step 7 |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | `spec_folder_skip`, `after_step: 13` and `autopilot_after_step: 13.5` |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modified | The plan and complete descriptions match the routers again |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`, `runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerated | `derive-command-bridges.cjs` copied the two descriptions |
| `.skilled/commands/README.txt` | Modified | The complete row says 13 steps |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nineteen dispatches went to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one brief each and one at a time in worktree 381. Twelve carried the planned edits, six the two operator-approved additions and one a fix the review gate suggested. Every one matched its expected bytes on the first try. One of the six ran `derive-command-bridges.cjs`, and its two generated files matched a trial run of the same command.

The orchestrating session wrote the full target text of every file first, applied it to the worktree, ran the twelve CHECK blocks, the YAML parse, the mode-tag check and the tests on it and restored the files before any dispatch. It did the same for the second set on top of the first. The session ran every check and test again on the final tree and again from the committed tree.

The `@review` gate ran once on the thirteen changed files, read-only, on Opus. It returned APPROVED with no P0 or P1 finding and an advisory score of 96. It derived the step counts itself, confirmed that no script or test reads `after_step`, and found the step-key list of all four workflows identical before and after. Of its four suggestions one was taken before the commit: the second implement reply example gave `A` for Q0, which asks for a folder path, and now gives `-`. The other three are items 9, 10 and 11 under Known Limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Complete's `termination.after_step` is 13 and a sibling `autopilot_after_step: 13.5` is added | REQ-004 excludes a step that runs only under autopilot, so the last counted step is 13. This reverses the value 13.5 that phase 6 set. The sibling key keeps the autopilot end point in the block, and the message already names both. No test or script reads either key |
| The copies of the two router descriptions were updated, although `plan.md` lists `command-metadata.json` as unchanged | The operator approved it on 2026-11-14 through the question tool. `command-metadata.json` copies each router description, and the deriver copies it again into the generated bridges and `projection.ts`. Without the edit the mirror check gained two `description differs from frontmatter` warnings and the advisor kept saying 8 and 14+ steps |
| Seven stale lines outside the named keys were fixed | The operator approved it on 2026-11-14 through the question tool. Four lines of the plan workflow and one of the plan presentation said step 7 or Steps 1-7, although plan's last step is 6. The README said the save tail holds anchor requirements, which phase 6 removed, and its overview named two modes |
| The README section 7 mode table gains an Autopilot row | The command table now shows the autopilot tokens, so a mode table with two rows would contradict it. The row text follows the three routers |
| `spec_folder_skip` sits under `field_handling`, directly after `defaults` | `defaults.spec_folder_empty` states what an empty folder means, and the skip outcome is the other answer to the same question |
| The plan success text drops `acceptance-criteria.md` | REQ-001 allows only files that a plan step `outputs:` list writes, and no plan step lists it |
| The implement resolution table keeps its column padding on the renamed row | The new field name is wider than the column. Padding the whole table again would change eight lines the phase has no reason to touch |
| The README resume Steps cell is 5 | CHECK-A1 reads it, and `speckit-resume.yaml` has five step keys |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CHECK-A1 step counts | PASS: prints nothing. The baseline printed seven MISMATCH lines |
| CHECK-A2 README invocation tokens | PASS: prints nothing. The baseline printed five DRIFT lines |
| CHECK-A3 README tree | PASS: prints nothing. The baseline printed five NOT IN TREE lines and a COUNT line |
| CHECK-A4 README section 7 flags | PASS: prints nothing. The baseline printed five MISSING lines and the `two additional flags` sentence |
| CHECK-A5 attached mode suffix | PASS: no match line, then `rg exit=1` |
| CHECK-A6 asset names and callers | PASS: lists both files, no `UNRESOLVED` line, sentence count 1, `STATUS=OK` |
| CHECK-A7 repeated presentation blocks | PASS: prints 1 five times. The baseline printed 2 first |
| CHECK-A8 Q1 options C and D | PASS: `pass 17`, `fail 0` and a count of 1 for each of the four files |
| CHECK-A9 one README row per router | PASS: no `README ROWS` line, `STATUS=OK` |
| CHECK-A10 plan success artifacts | PASS: prints nothing |
| CHECK-X2 Q3 and `dispatch_mode` | PASS: prints only `rg exit=1` |
| CHECK-X3 `memory_choice` renamed | PASS: `rg exit=1`, then 2 for each of the four files |
| Retired fields in the command folder | PASS: `rg -n -w -e dispatch_mode -e memory_choice` prints nothing with exit 1 |
| YAML parse | PASS: PyYAML loads the three lifecycle workflows with exit 0 |
| Mode tags | PASS: `untagged: 0` and `autopilot_ask: 0` |
| `test-phase-command-workflows.js` | PASS: `Result: passed=131 failed=0`, as before the phase |
| `speckit-goal-offer-contract.test.cjs`, `gate-3-menu-parity.test.mjs` | PASS: `pass 5` and `pass 17`, no failure |
| `command-catalog-mirror-check.cjs` and its test | PASS: `STATUS=OK` with the three prose warnings the baseline had, and `pass 14` |
| `derive-command-bridges.cjs --check` | PASS: `"changed": []` |
| Advisor tests that read command descriptions | PASS: `doctor-command-bridges`, `command-metadata-e2e` and `command-policy-derivation` print `Tests  16 passed (16)` |
| `ci-skill-root-metadata.cjs` | PASS: `checked=14 passed=14 failed=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No lifecycle command was run end to end on the new text.** The checks prove that the copies match their owners. They do not prove that an agent reads the renumbered questions correctly.
2. **The plan presentation still says `Continue planning first child` in its phase checkpoint.** The shared include says `Continue with first child`. No requirement of this phase names that line.
3. **Two prose warnings of the mirror check remain.** `/speckit:resume` and `/speckit:search` have an `argumentHint` in `command-metadata.json` that differs from the router. Both predate this phase, which changed descriptions only.
4. **Three phrases from the prose blocks phase 7 deleted have no restatement.** `maintain audit trail` and a general `choose conservative approach` in complete, and `document alternatives` in plan. An operator who reads one as a rule can add a rule id.
5. **The `principle`, `approach` and `mandate` keys under `mode_overrides.confirm` override nothing.** Their base keys left with the prose blocks in phase 7. This belongs to the mode contract.
6. **The goal-hook scenario names `AGENTS.md` for a fence sentence it does not hold, and the literal-naming feature catalog and its playbook are stale.** Both predate this packet and are outside it.
7. **Two phase 6 questions were never answered.** The Done and View Summary options on complete's save checkpoint, and one row of `shared/tests/README.md`. The third, complete's `after_step`, is settled by this phase.
8. **The Autopilot row and the overview sentence of the README name the mode without its contract.** The contract is `unattended_autopilot` in each workflow.
9. **`stops before step 1` can be read as allowing a write in step 0 or step 0.5.** Complete's autopilot envelope and the intake branch both run before step 1 and both can write. The wording is the outcome REQ-003 records, and the review gate suggests `stops at setup, before step 0`. Changing it is a decision for the operator.
10. **CHECK-A2 reads only the first plan row of the README.** The `plan --intake-only` row names `--intake-only`, which the plan `argument-hint` lacks, and no check compares it.
11. **The parent commands README still says complete supports two additional modes and names a `_confirm.yaml` layout.** Both sit beside the one line this phase changed there and predate it.
<!-- /ANCHOR:limitations -->

---


