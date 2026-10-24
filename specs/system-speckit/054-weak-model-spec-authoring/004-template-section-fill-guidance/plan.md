---
title: "Implementation Plan: Phase 4: template-section-fill-guidance"
description: "Add one fill instruction with a good and a weak example to every core template section, cover the addon sections, align the hand-written examples, and guard the result with a golden render test and a drift guard."
trigger_phrases:
  - "template section fill guidance plan"
  - "fill instruction format"
  - "example drift guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: template-section-fill-guidance

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, Bash, awk, ripgrep, TypeScript, vitest |
| **Framework** | system-spec-kit renderer, validator and template contract |
| **Storage** | None. Every edit is text in a tracked file |
| **Testing** | The inline-gate renderer, the scaffold golden snapshots and a new fill-guidance test |

### Overview
Three lanes edit disjoint files. Lane A writes the fill lines into `spec.md.tmpl` and `plan.md.tmpl` and repairs the spec anchor placements. Lane B writes them into `tasks.md.tmpl`, `implementation-summary.md.tmpl` and the ten addon templates and repairs the research placements. Lane C aligns the 14 examples in the alignment table and writes the drift guard. The conductor then regenerates the golden snapshots once and runs every gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 is closed and every core template carries the value token and the v2.3 stamp
- [ ] The start commit is recorded in `goal.md` section 4
- [ ] `scratch/baseline/anchor-counts.txt` matches the frozen table in section 3
- [ ] `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` prints `12 passed`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` prints `12 passed` without `-u`
- [ ] `npx vitest run runtime/cli/tests/template-fill-guidance.vitest.ts` prints `16 passed`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`
- [ ] `git status --porcelain` lists no path outside the files named in `spec.md` section 3
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three disjoint edit lanes, then one conductor-owned golden regeneration and one gate run.

### Facts read from the tree while this plan was written

Every fact below came from a read-only command or a file read. The command is repeated so the conductor can confirm it on the post-003 tree.

| Fact | Evidence |
|------|----------|
| The Level 1 anchor lists are exactly the six to seven names in the phase brief | `tasks.md` T003 renders each core template with `inline-gate-renderer.sh --level <level>`, extracts the names with `rg -o '<!-- ANCHOR:[a-z0-9-]+'` and saves the 16 sorted lists to `scratch/baseline/anchor-lists.txt`. The Level 1 lists are the six to seven names in the phase brief |
| The renderer consumes only gate markers, and passes an ordinary HTML comment through to the output | `runtime/cli/templates/inline-gate-renderer.ts` lines 172 to 229: `GATE_OPEN`, `GATE_CLOSE` and `GATE_EMPTY` are the only comment shapes removed |
| The validator gate scans an HTML comment for token syntax | `runtime/cli/rules/check-placeholders.sh` lines 59 to 97 filters fenced blocks only, then greps `[YOUR_VALUE_HERE:` and `[NEEDS_CLARIFICATION:` |
| The standalone broad scan is `runtime/cli/spec/check-placeholders.sh`, not the rules file | `rules/check-placeholders.sh` defines `run_check` and has no main, so running it directly prints nothing and exits 0 |
| `create.sh` replaces five hard placeholders and strips the provenance token | `runtime/cli/spec/create.sh` lines 965 to 984 replace the feature name, the date, the packet pointer and the level, and strip the template provenance token |
| The contract already reports anchor drift per document | `node runtime/cli/utils/template-structure.js compare 2 tasks.md templates/examples/level-2/tasks.md anchors` prints nine `missing_anchor` lines and no `extra_anchor` line |
| The contract marks optional anchors | The same command on `2 spec.md` prints `optional_anchor nfr`, `edge-cases` and `complexity` |
| The golden suite has 12 tests and 25 stored snapshots | `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` printed `Tests  12 passed (12)`, and `rg -c '^exports\[' runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` printed `25` |
| No guard is wired as a package script | `rg -n 'check-' package.json` exited 1 with no output, so a guard is wired as a vitest test |
| The running example has a measured shape | `bash runtime/cli/spec/recommend-level.sh --loc 500 --files 15 --auth --api \| wc -l` printed `17` |

### Frozen anchor counts

The fill test hard-codes these counts. `tasks.md` T003 records them in `scratch/baseline/anchor-counts.txt` before any edit.

| Level | spec | plan | tasks | implementation-summary |
|-------|------|------|-------|------------------------|
| 1 | 7 | 7 | 6 | 6 |
| 2 | 10 | 11 | 15 | 6 |
| 3 | 7 | 14 | 21 | 6 |
| 3+ | 11 | 17 | 21 | 6 |

### The fill line format (frozen)

One physical line, placed immediately below the section heading.

```text
<!-- FILL: <instruction> GOOD: <good example> WEAK: <weak example> -->
```

When the table below has `-` in both the Good and the Weak cell, the line is:

```text
<!-- FILL: <instruction> -->
```

Rules for the text inside the line:
- The instruction opens with an imperative sentence and holds one to three sentences. It ends with a period.
- No cell contains `[YOUR_VALUE_HERE:`, `[NEEDS_CLARIFICATION:`, `-->`, `;` or an em dash. A short priority mark such as `[P0]` is allowed because it is not a token.
- The line is never wrapped. It is one line in the template source.
- The good example is concrete and short. The weak example is the failure a weak model produces: vague, generic or a restatement of the heading.
- The model deletes the line when it fills the section. A line left behind is not a placeholder, so it never fails the gate.

### The running example (frozen)

Every good and weak example is about one feature so the examples read as one packet:

**Add a `--quiet` flag to `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.** With the flag the script prints only the `Recommended Level:` line. Without it the output is unchanged and holds 17 lines.

Do not change the example. A second feature would make the examples incoherent.

### FILL TEXT TABLE A: core Level 1 sections

Insert the constructed line immediately below the heading in the Heading column. The heading occurs once in that template.

| ID | Template | Heading | FILL instruction | Good | Weak |
|----|----------|---------|------------------|------|------|
| A01 | `core/spec.md.tmpl` | `## 1. METADATA` | Fill every row: level, priority, status, date and branch. Use the real branch name. | Priority P1. Status Draft. Branch `feat/recommend-level-quiet`. | Priority TBD. Status maybe. |
| A02 | `core/spec.md.tmpl` | `## 2. PROBLEM & PURPOSE` | State the problem in two sentences: what breaks, and for whom. | The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. | The script has issues with output. |
| A03 | `core/spec.md.tmpl` | `## 3. SCOPE` | List three to five things this change does, each starting with a verb. | Add a `--quiet` flag that prints only the recommended-level line. | Update the script and docs. |
| A04 | `core/spec.md.tmpl` | `## 4. REQUIREMENTS` | Write one testable requirement per row. Name the exact command or output. | With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. | The flag should work well. |
| A05 | `core/spec.md.tmpl` | `## 5. SUCCESS CRITERIA` | Write one measurable outcome per line. A command can prove it. | `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. | The feature is successful. |
| A06 | `core/spec.md.tmpl` | `## 6. RISKS & DEPENDENCIES` | Name one dependency and one risk. Give each a concrete mitigation. | A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. | There may be some risk. |
| A07 | `core/spec.md.tmpl` | `## 7. OPEN QUESTIONS` | Write each open question as one line. Write `None` when nothing blocks. | Does `--quiet` also suppress warnings on stderr? Decision: no, stderr is unchanged. | Edge cases are unclear. |
| A08 | `core/plan.md.tmpl` | `## 1. SUMMARY` | Fill the stack row and write three sentences: what changes, where, and how you will prove it. | Change one bash script. Add one output branch. Prove it with a line count. | This plan describes the implementation. |
| A09 | `core/plan.md.tmpl` | `## 2. QUALITY GATES` | Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. | `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. | The team agrees the plan is ready. |
| A10 | `core/plan.md.tmpl` | `## 3. ARCHITECTURE` | Name the pattern in three words, then list the one component that changes. | Single script branch. The component is `recommend-level.sh`. | Standard architecture. |
| A11 | `core/plan.md.tmpl` | `## 4. IMPLEMENTATION PHASES` | Point to `tasks.md` and name the three phases in one line. | Setup reads the current output. Implementation adds the branch. Verification counts lines. | See tasks. |
| A12 | `core/plan.md.tmpl` | `## 5. TESTING STRATEGY` | Name the one command you will run and the output it must print. | `--quiet` prints 1 line. The default prints 17. | Test it manually. |
| A13 | `core/plan.md.tmpl` | `## 6. DEPENDENCIES` | List each tool the change needs, or write `None`. | `bash` and `awk`. No new package. | Usual dependencies. |
| A14 | `core/plan.md.tmpl` | `## 7. ROLLBACK PLAN` | Name the trigger and the one command that reverts the change. | Trigger: the default output changes. Revert the one commit. | Roll back if needed. |
| A15 | `core/tasks.md.tmpl` | `## Task Notation` | Keep the prefix table and add the two shell variables this task list uses. | `S` is the script path. `P` is the packet path. | Variables are defined below. |
| A16 | `core/tasks.md.tmpl` | `## Phase 1: Setup` | Replace the sample tasks with the real setup steps. Each task names a file and a verify command. | T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. | T001 Set up the project. |
| A17 | `core/tasks.md.tmpl` | `## Phase 2: Implementation` | Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. | T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. | T002 Implement the feature. |
| A18 | `core/tasks.md.tmpl` | `## Phase 3: Verification` | Write one verification task per requirement. Each one runs a command. | T003 Run both invocations. Verify: `wc -l` prints 1 and 17. | T003 Test everything. |
| A19 | `core/tasks.md.tmpl` | `## Completion Criteria` | Keep the three completion lines and add the one artifact that proves the phase is done. | `--quiet` prints one line and the suite passes. | Work is complete. |
| A20 | `core/tasks.md.tmpl` | `## Cross-References` | Name the spec and plan files. Add the decision record when the packet has one. | Specification: `spec.md`. Plan: `plan.md`. | See the other docs. |
| A21 | `core/implementation-summary.md.tmpl` | `## Metadata` | Fill the folder name, the completion date and the level. Use the real date. | `004-recommend-level-quiet`. Completed 2026-10-24. Level 1. | Folder: TBD. |
| A22 | `core/implementation-summary.md.tmpl` | `## What Was Built` | Open with the user-visible change in two sentences, then list each changed file. | `--quiet` prints one line. The default report is unchanged. | Implemented the feature. |
| A23 | `core/implementation-summary.md.tmpl` | `## How It Was Delivered` | Name the commands that proved it and the order they ran. | Ran `--quiet` and the default form, then the suite. All three passed. | Tested and shipped. |
| A24 | `core/implementation-summary.md.tmpl` | `## Key Decisions` | Write one decision per row. Give the reason, not the label. | Flag over env var: callers already pass flags. | Used the best approach. |
| A25 | `core/implementation-summary.md.tmpl` | `## Verification` | Write one check per row with the exact output. | `--quiet` line count: 1. Default line count: 17. Suite: PASSED. | All tests pass. |
| A26 | `core/implementation-summary.md.tmpl` | `## Known Limitations` | Name one real limit and the workaround. | `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. | No limitations. |

### FILL TEXT TABLE B: core Level 2 and Level 3 sections

Insert the constructed line immediately below the heading. When a section has two headings for different levels, each row names its own heading.

| ID | Template | Heading | FILL instruction | Good | Weak |
|----|----------|---------|------------------|------|------|
| B01 | `core/spec.md.tmpl` | `## L2: NON-FUNCTIONAL REQUIREMENTS` | Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. | The flag adds no measurable time: the same 40 ms run. | Performance is good. |
| B02 | `core/spec.md.tmpl` | `## 7. NON-FUNCTIONAL REQUIREMENTS` | Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. | The flag adds no measurable time: the same 40 ms run. | Performance is good. |
| B03 | `core/spec.md.tmpl` | `## L2: EDGE CASES` | Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. | Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. | Handle edge cases. |
| B04 | `core/spec.md.tmpl` | `## 8. EDGE CASES` | Name the empty input, the maximum input and the failure path. One line each. | Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. | Handle edge cases. |
| B05 | `core/spec.md.tmpl` | `## L2: COMPLEXITY ASSESSMENT` | Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. | Scope 4/25: one file and 12 lines. Total 18/100. | Complexity is medium. |
| B06 | `core/spec.md.tmpl` | `## 9. COMPLEXITY ASSESSMENT` | Score each row with the number the change earns. The total must match the level. | Scope 4/25: one file and 12 lines. Total 18/100. | Complexity is medium. |
| B07 | `core/spec.md.tmpl` | `## 10. RISK MATRIX` | List each risk with impact, likelihood and one mitigation. | R1: a caller parses the label. Impact M, likelihood L. Mitigation: a test pins the label. | Some risks exist. |
| B08 | `core/spec.md.tmpl` | `## 11. USER STORIES` | Write one story per user. Name the actor, the want and the benefit. | As a build script, I want one parseable line, so that I can skip the report. | Users want a quiet mode. |
| B09 | `core/spec.md.tmpl` | `## 12. APPROVAL WORKFLOW` | Name the real approver for each checkpoint and the date it passed. | Spec review: operator, 2026-10-24. | Approvals pending. |
| B10 | `core/spec.md.tmpl` | `## 13. COMPLIANCE CHECKPOINTS` | Mark each box or write `N/A` with one reason. Never leave the template wording. | Mark N/A with the reason: the script reads no user data and opens no socket. | Compliance checked. |
| B11 | `core/spec.md.tmpl` | `## 14. STAKEHOLDER MATRIX` | Name each stakeholder, their interest and how you update them. | Build team, high interest, weekly note. | Stakeholders informed. |
| B12 | `core/spec.md.tmpl` | `## 15. CHANGE LOG` | Add one row per version with the date and the change. | v1.0 2026-10-24: added `--quiet`. | Initial version. |
| B13 | `core/spec.md.tmpl` | `## 10. OPEN QUESTIONS` | Write each open question as one line. Write `None` when nothing blocks. | Does `--quiet` suppress warnings? No, stderr is unchanged. | Edge cases are unclear. |
| B14 | `core/spec.md.tmpl` | `## 12. OPEN QUESTIONS` | Write each open question as one line. Write `None` when nothing blocks. | Does `--quiet` suppress warnings? No, stderr is unchanged. | Edge cases are unclear. |
| B15 | `core/spec.md.tmpl` | `## 16. OPEN QUESTIONS` | Write each open question as one line. Write `None` when nothing blocks. | Does `--quiet` suppress warnings? No, stderr is unchanged. | Edge cases are unclear. |
| B16 | `core/spec.md.tmpl` | `## EXECUTIVE SUMMARY` | Write three sentences: the problem, the change and the proof. | Callers parse a 17-line report to read one value. The flag prints one line. A line count proves it. | This document describes the feature. |
| B17 | `core/spec.md.tmpl` | `## RELATED DOCUMENTS` | Leave the four links in place. | - | - |
| B18 | `core/plan.md.tmpl` | `## FIX ADDENDUM: AFFECTED SURFACES` | Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. | `recommend-level.sh`: owns the output. Action: update. | Various files. |
| B19 | `core/plan.md.tmpl` | `## L2: PHASE DEPENDENCIES` | Draw the phase order in the fence, then fill the table with depends-on and blocks. | Setup to Implementation to Verification. Verification blocks close. | Phases depend on each other. |
| B20 | `core/plan.md.tmpl` | `## L2: EFFORT ESTIMATION` | Give each phase an estimate and a total. Mark the total as an assumption. | Setup 10 minutes, implementation 30, verification 10. Total 50 minutes. | A few hours. |
| B21 | `core/plan.md.tmpl` | `## L2: ENHANCED ROLLBACK` | Name the trigger, the steps and the data reversal. Write `No` when no data changes. Delete the whole section when the packet ships no deployable service. | Trigger: default output changes. Steps: revert one commit, rerun the two commands. | Roll back if needed. |
| B22 | `core/plan.md.tmpl` | `## L3: DEPENDENCY GRAPH` | Draw the component order and fill the matrix with produces and blocks. | Script to test to close. | Components depend on each other. |
| B23 | `core/plan.md.tmpl` | `## L3: CRITICAL PATH` | Name the longest chain and its total. List what can run in parallel. | Implementation to verification, 40 minutes. Docs run in parallel. | The critical path is the main path. |
| B24 | `core/plan.md.tmpl` | `## L3: MILESTONES` | Name three milestones with a command-checkable success criterion. | M1: the branch exists. `rg -n quiet` prints it. | Milestones are tracked. |
| B25 | `core/plan.md.tmpl` | `## L3: ARCHITECTURE DECISION RECORD` | Write one ADR per decision. Name the context, the choice, the consequence and the rejected option. | ADR-001: a flag, because callers already pass flags. | We made a decision. |
| B26 | `core/plan.md.tmpl` | `## L3+: AI EXECUTION FRAMEWORK` | Name the workers, their files and the order. Keep file ownership disjoint. | One worker owns the script. One owns the test. | Agents work in parallel. |
| B27 | `core/plan.md.tmpl` | `## L3+: WORKSTREAM COORDINATION` | Name each workstream, its owner and its files. One file per owner. | W-A owns the script. W-B owns the test. | Work is split into streams. |
| B28 | `core/plan.md.tmpl` | `## L3+: COMMUNICATION PLAN` | Name the update cadence and the escalation path. | A note in `goal.md` section 4 after each task. | Communicate regularly. |
| B29 | `core/tasks.md.tmpl` | `## Verification Checklist` | Fill each checklist section below. | - | - |
| B30 | `core/tasks.md.tmpl` | `## Verification Protocol` | Keep the three rows and add the rule this packet uses for a blocked task. | P0 blocks close. P1 needs a recorded reason. | Follow the priorities. |
| B31 | `core/tasks.md.tmpl` | `## Pre-Implementation` | Write one check per setup fact, each with a command. | CHK-001 [P0] The start commit is in `goal.md` section 4. | Setup is ready. |
| B32 | `core/tasks.md.tmpl` | `## Code Quality` | Write one check per file rule. A command must answer it. | CHK-010 [P0] `bash -n recommend-level.sh` exits 0. | Code is clean. |
| B33 | `core/tasks.md.tmpl` | `## Testing Checklist` | Write one check per acceptance criterion. | CHK-020 [P0] `--quiet` prints one line. | Tests pass. |
| B34 | `core/tasks.md.tmpl` | `## Fix Completeness` | Write one check per finding class this packet can produce. Delete the rows that do not apply. | CHK-FIX-001 [P0] Every finding names one class. | All findings handled. |
| B35 | `core/tasks.md.tmpl` | `## Security` | Write one check per security surface. Write `N/A` with a reason when none applies. | CHK-030 [P0] The script reads no credential. | Security is fine. |
| B36 | `core/tasks.md.tmpl` | `## Documentation` | Write one check per document that must agree. | CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. | Docs are updated. |
| B37 | `core/tasks.md.tmpl` | `## File Organization` | Write one check per file location rule. | CHK-050 [P1] Test copies live under `scratch/test/`. | Files are organized. |
| B38 | `core/tasks.md.tmpl` | `## Verification Summary` | Count the boxes by priority and write the three totals. | P0 12, P1 13, P2 1. | Most items done. |
| B39 | `core/tasks.md.tmpl` | `## L3+: Architecture Verification` | Write one check per ADR, or delete the section when the packet records no ADR. | CHK-100 [P0] ADR-001 is followed by T002. | Architecture is verified. |
| B40 | `core/tasks.md.tmpl` | `## L3+: Performance Verification` | Write one check per performance claim, or delete the section when the packet makes none. | CHK-110 [P1] The flag adds under 5 ms. | Performance is verified. |
| B41 | `core/tasks.md.tmpl` | `## L3+: Deployment Readiness` | Write one check per deployment step, or delete the section when the packet ships no service. | CHK-120 [P0] The rollback command was run in a copy. | Ready to deploy. |
| B42 | `core/tasks.md.tmpl` | `## L3+: Compliance Verification` | Write one check per compliance surface, or delete the section when none applies. | CHK-130 [P1] No license changed. | Compliance is verified. |
| B43 | `core/tasks.md.tmpl` | `## L3+: Documentation Verification` | Write one check per document pair that must agree, or delete the section when the packet holds no paired documents. | CHK-140 [P1] `plan.md` and `tasks.md` agree on the three phases. | Docs are verified. |
| B44 | `core/tasks.md.tmpl` | `## L3+: Sign-Off` | Name the real approver for each role. Delete a row when the role does not exist. Write `N/A` or delete the section when no sign-off applies. | Conductor, runs every task. Operator, merges the commit. | Signed off. |

### FILL TEXT TABLE C: addon templates

Insert the constructed line immediately below the heading. These templates are Level 2 and Level 3 addons. The instruction line is mandatory. A pair is given where the section carries prose a weak model can ruin. The `TEMPLATE INSTRUCTIONS` and `Author Instructions` headings are fixed instructions and get no line. The `WHEN TO USE THIS TEMPLATE` heading gets a line only in `research.md.tmpl`, where it states the question the research answers.

| ID | Template | Heading | FILL instruction | Good | Weak |
|----|----------|---------|------------------|------|------|
| C01 | `addons/acceptance-criteria.md.tmpl` | `## 1. METADATA` | Fill the packet id, the level, the status and the date. | `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. | Packet TBD. |
| C02 | `addons/acceptance-criteria.md.tmpl` | `## 2. CRITERIA` | Write one row per requirement. The Then clause names a command. | AC-001: When `--quiet` runs, Then `wc -l` prints 1. | The feature works. |
| C03 | `addons/acceptance-criteria.md.tmpl` | `## 3. CLOSURE STATEMENT` | Write Yes or No and one sentence that names the criteria that carried the packet. | No. AC-002 is unmet. | Almost done. |
| C04 | `addons/before-after.md.tmpl` | `## 1. METADATA` | Fill the document id, the date and the author. | BA-001, 2026-10-24, conductor. | TBD. |
| C05 | `addons/before-after.md.tmpl` | `## 2. SUMMARY` | Write two sentences: what changed and the net effect. | The flag adds one line of output. The default path is unchanged. | A change was made. |
| C06 | `addons/before-after.md.tmpl` | `## 3. COMPARISON` | Put the before and after side by side, one row per behavior. | Before: 17 lines. After with the flag: 1 line. | Before and after differ. |
| C07 | `addons/before-after.md.tmpl` | `## 4. NET EFFECT` | State the one effect a reader should remember. | A caller can now read the level without parsing the report. | It is better. |
| C08 | `addons/before-after.md.tmpl` | `## 5. NOTES & CAVEATS` | Name one caveat and one thing not covered. | stderr is unchanged. No Windows test ran. | Some caveats apply. |
| C09 | `addons/debug-delegation.md.tmpl` | `## 1. PROBLEM SUMMARY` | State the failure, the command and the first bad output. | `--quiet` prints 3 lines. Expected 1. | It is broken. |
| C10 | `addons/debug-delegation.md.tmpl` | `## 2. ATTEMPTED FIXES` | List each attempt and its result. | Moved the exit after the print. Still 3 lines. | Tried some fixes. |
| C11 | `addons/debug-delegation.md.tmpl` | `## 3. CONTEXT FOR SPECIALIST` | Give the specialist the files, the command and the evidence. | File `recommend-level.sh` line 510. Command `--quiet`. Output 3 lines. | See the code. |
| C12 | `addons/debug-delegation.md.tmpl` | `## 4. RECOMMENDED NEXT STEPS` | Name the next check and the expected result. | Run `bash -x` and confirm one `echo` on the quiet path. | Keep debugging. |
| C13 | `addons/debug-delegation.md.tmpl` | `## 5. HANDOFF CHECKLIST` | List what the next person needs before starting. | Branch, start commit and the failing command. | Everything is in the ticket. |
| C14 | `addons/decision-record.md.tmpl` | `## ADR-001: [Decision Title]` | Write one ADR per decision with context, choice, consequences and the rejected option. | ADR-001: a flag, because callers already pass flags. | We decided on a flag. |
| C15 | `addons/goal.md.tmpl` | `## 1. DURABLE DIRECTIVE` | Write one sentence: what the packet is for, not how. | Print one parseable level line on request. | Improve the script. |
| C16 | `addons/goal.md.tmpl` | `## 2. BINDING` | List each child phase and its goal path. Name the precedence rule. | 001 and 002. Decisions here outrank child detail. | Children are bound. |
| C17 | `addons/goal.md.tmpl` | `## 3. COMPLETION CRITERIA` | Write one command-checkable criterion per line. | `--quiet` prints 1 line and exits 0. | The work is done. |
| C18 | `addons/goal.md.tmpl` | `## 4. LOG` | Record each step with its command output. Keep this table current. | T001 Done. `rg -n quiet` printed line 510. | Progress is good. |
| C19 | `addons/handover.md.tmpl` | `## 1. Handover Summary` | Write three sentences: what shipped, what is open and where to start. | The flag shipped. Docs are open. Start at `tasks.md` T004. | Work was handed over. |
| C20 | `addons/handover.md.tmpl` | `## 2. Context Transfer` | Name the files, the decisions and the state a successor needs. | Branch `feat/quiet`, start commit `abc123`. | Context is in the repo. |
| C21 | `addons/handover.md.tmpl` | `## 3. For Next Session` | Write the first command the next session should run. | Run `bash validate.sh <packet> --strict`. | Continue the work. |
| C22 | `addons/handover.md.tmpl` | `## 4. Validation Checklist` | List the checks the successor must rerun. | `--quiet` line count, default line count and the suite. | Validate everything. |
| C23 | `addons/handover.md.tmpl` | `## 5. Session Notes` | Record what was tried and what was learned. | The quiet branch must return before the report block. | Notes below. |
| C24 | `addons/research.md.tmpl` | `## WHEN TO USE THIS TEMPLATE` | State the one question this research answers. | A flag fits because callers already pass flags. | Research this topic. |
| C25 | `addons/research.md.tmpl` | `## 1. METADATA` | Fill the research id, the date and the owner. | R-001, 2026-10-24, conductor. | TBD. |
| C26 | `addons/research.md.tmpl` | `## FILE ORGANIZATION` | List each file this research produces. | `research.md`, `notes/` and `sources/`. | Files are organized. |
| C27 | `addons/research.md.tmpl` | `## 2. INVESTIGATION REPORT` | State the method and the sources in one paragraph. | Read the script, ran both forms, counted lines. | We investigated. |
| C28 | `addons/research.md.tmpl` | `## 3. EXECUTIVE OVERVIEW` | Write the answer in three sentences before the detail. | A flag fits. Callers already pass flags. An env var adds a hidden input. | This is the overview. |
| C29 | `addons/research.md.tmpl` | `## 4. CORE ARCHITECTURE` | Name the components the answer touches. | One script and one output branch. | The architecture is standard. |
| C30 | `addons/research.md.tmpl` | `## 5. TECHNICAL SPECIFICATIONS` | Describe the interface the answer adds. | `--quiet`: no argument, one output line. | The API is described. |
| C31 | `addons/research.md.tmpl` | `## 6. CONSTRAINTS & LIMITATIONS` | Name each constraint and its source. | Bash 3.2 must run the script. | There are constraints. |
| C32 | `addons/research.md.tmpl` | `## 7. INTEGRATION PATTERNS` | Name each caller and how it uses the result. | The build script reads the last line. | It integrates. |
| C33 | `addons/research.md.tmpl` | `## 8. IMPLEMENTATION GUIDE` | Write the steps in order, one command each. | 1. Add the flag. 2. Return before the report. | Follow the guide. |
| C34 | `addons/research.md.tmpl` | `## 9. CODE EXAMPLES & SNIPPETS` | Show one working example and its output. | `recommend-level.sh --quiet --loc 500` prints one line. | Code below. |
| C35 | `addons/research.md.tmpl` | `## 10. TESTING & DEBUGGING` | Name the commands that prove the answer. | `wc -l` prints 1 and 17. | Test it. |
| C36 | `addons/research.md.tmpl` | `## 11. PERFORMANCE OPTIMIZATION` | Name the measured cost, or write `N/A` with a reason. | The flag adds under 5 ms. | It is fast. |
| C37 | `addons/research.md.tmpl` | `## 12. SECURITY CONSIDERATIONS` | Name each security surface, or write `N/A` with a reason. | The flag reads no user input. | It is secure. |
| C38 | `addons/research.md.tmpl` | `## 13. FUTURE-PROOFING & MAINTENANCE` | Name what a future change must preserve. | Keep the `Recommended Level:` prefix. | Maintain it. |
| C39 | `addons/research.md.tmpl` | `## 14. API REFERENCE` | List each flag and its effect. | `--quiet`: one line. `--json`: a JSON object. | See the flags. |
| C40 | `addons/research.md.tmpl` | `## 15. TROUBLESHOOTING GUIDE` | Name one failure and its fix. | Three lines with `--quiet`: the report block ran first. | Check the logs. |
| C41 | `addons/research.md.tmpl` | `## 16. ACKNOWLEDGEMENTS` | Name the sources and people that helped. | The script author and the phase 1 baseline. | Thanks. |
| C42 | `addons/research.md.tmpl` | `## APPENDIX` | Add terms a new reader needs. | `quiet`: one-line mode. | Appendix below. |
| C43 | `addons/research.md.tmpl` | `## CHANGELOG & UPDATES` | Add one row per version with the date and the change. | 1.0.0, 2026-10-24, initial research. | Initial version. |
| C44 | `addons/resource-map.md.tmpl` | `## Summary` | Write two sentences: what this map covers and how to use it. | Every path a new session needs. Start at section 1. | This is a map. |
| C45 | `addons/resource-map.md.tmpl` | `## 1. READMEs` | List each README and why it matters. | `SKILL.md`, the router entry. | Read the READMEs. |
| C46 | `addons/resource-map.md.tmpl` | `## 2. Documents` | List each doc and its role. | `template-guide.md`, the authoring rules. | Docs are listed. |
| C47 | `addons/resource-map.md.tmpl` | `## 3. Commands` | List each command and when to run it. | `/speckit:plan`, before authoring. | Commands are listed. |
| C48 | `addons/resource-map.md.tmpl` | `## 4. Agents` | List each agent and its scope. | `markdown`, writes spec docs. | Agents are listed. |
| C49 | `addons/resource-map.md.tmpl` | `## 5. Skills` | List each skill and its trigger. | `system-spec-kit`, spec folders. | Skills are listed. |
| C50 | `addons/resource-map.md.tmpl` | `## 6. Specs` | List each spec folder and its state. | `054-weak-model-spec-authoring`, planning. | Specs are listed. |
| C51 | `addons/resource-map.md.tmpl` | `## 7. Scripts` | List each script and its one job. | `validate.sh`, strict validation. | Scripts are listed. |
| C52 | `addons/resource-map.md.tmpl` | `## 8. Tests` | List each test and what it guards. | `example-drift.vitest.ts`, anchor drift. | Tests are listed. |
| C53 | `addons/resource-map.md.tmpl` | `## 9. Config` | List each config file and its effect. | `spec-kit-docs.json`, template versions. | Config is listed. |
| C54 | `addons/resource-map.md.tmpl` | `## 10. Meta` | Record how the map itself is maintained. | Regenerate after a phase close. | Meta notes. |
| C55 | `addons/roadmap.md.tmpl` | `## 1. METADATA` | Fill the roadmap id, the date and the owner. | RM-001, 2026-10-24, conductor. | TBD. |
| C56 | `addons/roadmap.md.tmpl` | `## 2. PHASES: NOW / NEXT / LATER` | Put each item in one bucket and name its proof. | Now: the flag. Next: docs. Later: a Windows test. | Items are planned. |
| C57 | `addons/roadmap.md.tmpl` | `## 3. MILESTONES & TARGETS` | Name each milestone and the date it must pass. | M1, 2026-10-24, the flag prints one line. | Milestones are set. |
| C58 | `addons/roadmap.md.tmpl` | `## 4. DEPENDENCIES` | Name each dependency and what it blocks. | Bash 3.2 blocks the test matrix. | Dependencies exist. |
| C59 | `addons/timeline.md.tmpl` | `## 1. METADATA` | Fill the timeline id, the date and the owner. | TL-001, 2026-10-24, conductor. | TBD. |
| C60 | `addons/timeline.md.tmpl` | `## 2. TIMELINE` | Put each event in date order with its evidence. | 2026-10-24: flag merged. `rg -n quiet` printed line 510. | Events happened. |
| C61 | `addons/timeline.md.tmpl` | `## 3. MILESTONES` | Name each milestone and whether it passed. | M1 passed. One line printed. | Milestones met. |

### Applicability rules for the generic sections

A weak model fills `Feature flag configured`, `OWASP Top 10 checklist completed` and `Uptime target` with invented content. The fill line must stop that. The contract decides which form is allowed.

| Section | Contract fact | Fill line must say |
|---------|---------------|--------------------|
| `## L2: NON-FUNCTIONAL REQUIREMENTS`, `## 7. NON-FUNCTIONAL REQUIREMENTS` | The anchor is `optional` at Level 2 and unanchored at Level 3. | Write `N/A` and one reason, or delete the whole section. |
| `## L2: ENHANCED ROLLBACK`, `## L3+: Deployment Readiness` | Both anchors are `optional` at their level. | Delete the whole section when the packet ships no deployable service. |
| `## L3+: Performance Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the whole section when the packet makes no performance claim. |
| `## 13. COMPLIANCE CHECKPOINTS` | The anchor is `required` at Level 3+. | Write `N/A` and one reason. Do not delete the section. |
| `## L3+: Compliance Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the whole section when no compliance surface applies. |
| `## L2: EDGE CASES`, `## L2: COMPLEXITY ASSESSMENT` | Both anchors are `optional` at Level 2. | Write `N/A` with one reason, or delete the whole section. |
| `## FIX ADDENDUM: AFFECTED SURFACES` | The anchor is `optional` at Levels 2, 3 and 3+. | Write `N/A` or delete the whole addendum when no fix surface applies. |
| `## L3+: Architecture Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the section when the packet records no ADR. |
| `## L3+: Documentation Verification` | The anchor is `optional` at Level 3 and Level 3+. | Delete the section when the packet holds no paired documents. |
| `## L3+: Sign-Off` | The anchor is `optional` at Level 3 and Level 3+. | Write `N/A` or delete the section when no sign-off applies. |

Evidence: `node runtime/cli/utils/template-structure.js compare 3+ spec.md templates/examples/level-3+/spec.md anchors` prints `required_anchor compliance-checkpoints`, and the same command on `2 plan.md` prints `optional_anchor enhanced-rollback`.

### Anchor crossings to repair

The command below prints one line per crossing. Run it on every `.tmpl` under `templates` before and after the edit.

```bash
for f in $(find .skilled/skills/system-spec-kit/templates -name '*.tmpl' | sort); do
  awk 'BEGIN{d=0} /<!-- IF /{d++} /<!-- \/IF -->/{d--} /<!-- ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); a[substr($0,RSTART+7,RLENGTH-7)]=d} /<!-- \/ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); n=substr($0,RSTART+7,RLENGTH-7); if (a[n]!=d) print FILENAME":"NR": anchor "n" opens at "a[n]" closes at "d}' "$f"
done
```

Observed on the current tree: four lines for `core/spec.md.tmpl` (`nfr`, `edge-cases` and `questions` twice) and two lines for `addons/research.md.tmpl` (`core-architecture`, `changelog-updates`). The third research crossing, `integration-patterns`, sits at one depth and is not reported by the command, and R3 repairs it by inspection. The seven repairs are four in `core/spec.md.tmpl` and three in `addons/research.md.tmpl`.

Phase 003 runs before this phase and converts every bare hint in `core/spec.md.tmpl` to a value token. T001 writes the token count to `scratch/baseline/locator-form.txt`. A count above `0` means the tree is post-003 and every repair below quotes the post-003 form. A count of `0` means phase 003 is not closed and the repair quotes the pre-token form. An anchor marker holds no hint, so its form is the same on both trees. `addons/research.md.tmpl` is outside the five templates phase 003 converts, so its repairs have one form on both trees.

Each repair that quotes template text is written as a diff. A line that starts with `-` is removed and a line that starts with `+` is added. The leading `-` or `+` is not part of the template text. A quoted marker is written this way so that it does not read as an anchor of this plan.

**Fix S1, `nfr`.** The Level 2 anchor marks the Level 2 heading only, because the section body is shared with Level 3 and a pair that spans it would close inside a deeper gate. First insert the closing marker below the Level 2 heading. Remove the two lines and add the three lines:

```diff
-<!-- ANCHOR:nfr -->
-## L2: NON-FUNCTIONAL REQUIREMENTS
+<!-- ANCHOR:nfr -->
+## L2: NON-FUNCTIONAL REQUIREMENTS
+<!-- /ANCHOR:nfr -->
```

Then remove the closing marker that sits after the Level 2-only bullet. Post-003 form, the expected tree:

```diff
-- **NFR-R02**: [YOUR_VALUE_HERE: Error rate - e.g., <1%]
-<!-- /ANCHOR:nfr -->
-<!-- /IF -->
-<!-- /IF -->
+- **NFR-R02**: [YOUR_VALUE_HERE: Error rate - e.g., <1%]
+<!-- /IF -->
+<!-- /IF -->
```

Pre-token form, used only when T001 recorded `TOKEN=0`:

```diff
-- **NFR-R02**: [Error rate - e.g., <1%]
-<!-- /ANCHOR:nfr -->
-<!-- /IF -->
-<!-- /IF -->
+- **NFR-R02**: [Error rate - e.g., <1%]
+<!-- /IF -->
+<!-- /IF -->
```

**Fix S2, `edge-cases`.** Do the same for the Level 2 anchor, and restore the missing close after the Level 2-only bullet so Level 3 keeps the State Transitions block. First insert the closing marker below the Level 2 heading:

```diff
-<!-- ANCHOR:edge-cases -->
-## L2: EDGE CASES
+<!-- ANCHOR:edge-cases -->
+## L2: EDGE CASES
+<!-- /ANCHOR:edge-cases -->
```

Then replace the error and transition block. Post-003 form, the expected tree:

```diff
-### Error Scenarios
-- External service failure: [YOUR_VALUE_HERE: Fallback behavior]
-<!-- IF level:2,3 -->
-- Network timeout: [YOUR_VALUE_HERE: Retry strategy]
-<!-- IF level:2 -->
-- Concurrent access: [YOUR_VALUE_HERE: Conflict resolution]
-
-### State Transitions
-- Partial completion: [YOUR_VALUE_HERE: Recovery behavior]
-- Session expiry: [YOUR_VALUE_HERE: User experience]
-<!-- /ANCHOR:edge-cases -->
-<!-- /IF -->
-<!-- /IF -->
+### Error Scenarios
+- External service failure: [YOUR_VALUE_HERE: Fallback behavior]
+<!-- IF level:2,3 -->
+- Network timeout: [YOUR_VALUE_HERE: Retry strategy]
+<!-- /IF -->
+<!-- IF level:2 -->
+- Concurrent access: [YOUR_VALUE_HERE: Conflict resolution]
+<!-- /IF -->
+
+### State Transitions
+- Partial completion: [YOUR_VALUE_HERE: Recovery behavior]
+- Session expiry: [YOUR_VALUE_HERE: User experience]
```

Pre-token form, used only when T001 recorded `TOKEN=0`:

```diff
-### Error Scenarios
-- External service failure: [Fallback behavior]
-<!-- IF level:2,3 -->
-- Network timeout: [Retry strategy]
-<!-- IF level:2 -->
-- Concurrent access: [Conflict resolution]
-
-### State Transitions
-- Partial completion: [Recovery behavior]
-- Session expiry: [User experience]
-<!-- /ANCHOR:edge-cases -->
-<!-- /IF -->
-<!-- /IF -->
+### Error Scenarios
+- External service failure: [Fallback behavior]
+<!-- IF level:2,3 -->
+- Network timeout: [Retry strategy]
+<!-- /IF -->
+<!-- IF level:2 -->
+- Concurrent access: [Conflict resolution]
+<!-- /IF -->
+
+### State Transitions
+- Partial completion: [Recovery behavior]
+- Session expiry: [User experience]
```

**Fix S3, `questions`.** Replace the block that starts with the first line below and ends with the last line below. The replacement keeps the fill line for each heading. Post-003 form, the expected tree.

Start marker, unique in the file: the first three removed lines of the diff below. End marker, unique in the file: the last four removed lines. The replacement covers every line between them, including both markers.

Replacement for the whole block from the start marker through the end marker:

```diff
-<!-- IF level:2 -->
-<!-- ANCHOR:questions -->
-## 10. OPEN QUESTIONS
-<!-- /IF -->
-<!-- /IF -->
-<!-- IF level:1 -->
-<!-- ANCHOR:questions -->
-## 7. OPEN QUESTIONS
-<!-- /IF -->
+<!-- IF level:2 -->
+<!-- ANCHOR:questions -->
+## 10. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [YOUR_VALUE_HERE: Question 1 requiring clarification]
+- [YOUR_VALUE_HERE: Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
+<!-- IF level:1 -->
+<!-- ANCHOR:questions -->
+## 7. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` also suppress warnings on stderr? Decision: no, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [YOUR_VALUE_HERE: Question 1 requiring clarification]
+- [YOUR_VALUE_HERE: Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
```

Pre-token form, used only when T001 recorded `TOKEN=0`:

```diff
-<!-- IF level:2 -->
-<!-- ANCHOR:questions -->
-## 10. OPEN QUESTIONS
-<!-- /IF -->
-<!-- /IF -->
-<!-- IF level:1 -->
-<!-- ANCHOR:questions -->
-## 7. OPEN QUESTIONS
-<!-- /IF -->
+<!-- IF level:2 -->
+<!-- ANCHOR:questions -->
+## 10. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [Question 1 requiring clarification]
+- [Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
+<!-- IF level:1 -->
+<!-- ANCHOR:questions -->
+## 7. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` also suppress warnings on stderr? Decision: no, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [Question 1 requiring clarification]
+- [Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
```

**Fix S4, `questions` at Level 3 and Level 3+.** Replace the block from the start marker to the end marker below.

Start marker, unique in the file: the first two removed lines of the diff below. End marker, unique in the file: the last four removed lines. The replacement covers every line between them, including both markers. The pre-token form selects the same position, because phase 003 changes only the hint text inside the block.

Replacement, post-003 form, with the fill line kept below each heading:

```diff
-<!-- ANCHOR:questions -->
-## 16. OPEN QUESTIONS
-<!-- /IF -->
-<!-- IF level:3 -->
-<!-- ANCHOR:questions -->
-## 12. OPEN QUESTIONS
-<!-- /IF -->
-<!-- /IF -->
-
-- [YOUR_VALUE_HERE: Question 1 requiring clarification]
-<!-- IF level:3+ -->
-<!-- /ANCHOR:questions -->
-<!-- /IF -->
-<!-- IF level:1,2,3 -->
-- [YOUR_VALUE_HERE: Question 2 requiring clarification]
-<!-- /ANCHOR:questions -->
-<!-- /IF -->
+<!-- IF level:3+ -->
+<!-- ANCHOR:questions -->
+## 16. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [YOUR_VALUE_HERE: Question 1 requiring clarification]
+- [YOUR_VALUE_HERE: Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
+<!-- IF level:3 -->
+<!-- ANCHOR:questions -->
+## 12. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [YOUR_VALUE_HERE: Question 1 requiring clarification]
+- [YOUR_VALUE_HERE: Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
```

Replacement, pre-token form:

```diff
-<!-- ANCHOR:questions -->
-## 16. OPEN QUESTIONS
-<!-- /IF -->
-<!-- IF level:3 -->
-<!-- ANCHOR:questions -->
-## 12. OPEN QUESTIONS
-<!-- /IF -->
-<!-- /IF -->
-
-- [Question 1 requiring clarification]
-<!-- IF level:3+ -->
-<!-- /ANCHOR:questions -->
-<!-- /IF -->
-<!-- IF level:1,2,3 -->
-- [Question 2 requiring clarification]
-<!-- /ANCHOR:questions -->
-<!-- /IF -->
+<!-- IF level:3+ -->
+<!-- ANCHOR:questions -->
+## 16. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [Question 1 requiring clarification]
+- [Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
+<!-- IF level:3 -->
+<!-- ANCHOR:questions -->
+## 12. OPEN QUESTIONS
+<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->
+
+- [Question 1 requiring clarification]
+- [Question 2 requiring clarification]
+<!-- /ANCHOR:questions -->
+<!-- /IF -->
+<!-- /IF -->
```

**Fix R1, `core-architecture`.** Remove the two lines and add the two lines below. `addons/research.md.tmpl` is outside phase 003's five converted templates, so this repair has one form on both trees:

```diff
-<!-- ANCHOR:core-architecture -->
-<!-- IF level:2,3,3+,phase -->
+<!-- IF level:2,3,3+,phase -->
+<!-- ANCHOR:core-architecture -->
```

**Fix R2, `changelog-updates`.** Move the anchor opening marker below the `<!-- /IF -->` that closes the full-tier gate, so the changelog section and its anchor both render at every level. Remove the three lines and add the three lines:

```diff
-<!-- ANCHOR:changelog-updates -->
-<!-- /IF -->
-## CHANGELOG & UPDATES
+<!-- /IF -->
+<!-- ANCHOR:changelog-updates -->
+## CHANGELOG & UPDATES
```

**Fix R3, `integration-patterns`.** The depth command does not report this one because both markers sit at the same depth, but a Level 2 render shows an opening marker with no closing marker. Remove the three lines and add the three lines:

```diff
-<!-- ANCHOR:integration-patterns -->
-<!-- /IF -->
-<!-- IF level:3,3+,phase -->
+<!-- /IF -->
+<!-- IF level:3,3+,phase -->
+<!-- ANCHOR:integration-patterns -->
```

### Example alignment

The 21 hand-written examples under `templates/examples/level-*` carry content, so they cannot be regenerated. The table edits the 14 that drift on anchors. Phase 002 owns the separate description repair: its rows K-01 to K-18 rewrite the 18 leaked `description:` lines before this phase runs. This phase does not repeat that edit. On this tree, before phase 002 closes, 18 of the 21 examples fail the guard's three description rules, so the guard prints `EXAMPLE_DRIFT_OK` only on the post-002 tree. The authoritative diff is the contract command:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js compare <level> <doc.md> <example-path> anchors
```

The table lists every `missing_anchor` and `extra_anchor` the command printed on the current tree. An extra anchor is removed with its closing marker and the content stays. A rename changes only the anchor name. An add wraps the existing section or appends the block in `tasks.md` T012.

| File | Remove anchor pairs | Rename | Add |
|------|---------------------|--------|-----|
| `level-1/implementation-summary.md` | - | - | `how-delivered` |
| `level-2/implementation-summary.md` | `nfr-verify`, `deviations` | - | `how-delivered` |
| `level-2/plan.md` | - | `l2-phase-deps` to `phase-deps`, `l2-effort` to `effort`, `l2-rollback` to `enhanced-rollback` | - |
| `level-2/spec.md` | `related-docs` | - | - |
| `level-2/tasks.md` | - | - | the nine Verification Checklist anchors in T012 |
| `level-3/implementation-summary.md` | `exec-summary`, `arch-decisions`, `milestones`, `risks-realized`, `deviations`, `follow-up` | `impl-decisions` to `decisions` | `how-delivered` |
| `level-3/plan.md` | `l3-adr-summary` | `l2-phase-deps` to `phase-deps`, `l2-effort` to `effort`, `l2-rollback` to `enhanced-rollback`, `l3-dep-graph` to `dependency-graph`, `l3-critical-path` to `critical-path`, `l3-milestones` to `milestones` | - |
| `level-3/spec.md` | `executive-summary`, `nfr`, `edge-cases`, `risk-matrix`, `user-stories`, `related-docs` | `open-questions` to `questions` | - |
| `level-3/tasks.md` | `milestones` | - | the nine Verification Checklist anchors in T012 |
| `level-3+/decision-record.md` | `adr-index` | - | - |
| `level-3+/implementation-summary.md` | `exec-summary`, `arch-decisions`, `governance`, `workstream-perf`, `ai-analysis`, `milestones`, `risks-realized`, `deviations`, `follow-up`, `handoff` | - | `how-delivered`, `decisions` |
| `level-3+/plan.md` | `l3-adr-summary` | `l2-phase-deps` to `phase-deps`, `l2-effort` to `effort`, `l2-rollback` to `enhanced-rollback`, `l3-dep-graph` to `dependency-graph`, `l3-critical-path` to `critical-path`, `l3-milestones` to `milestones`, `l3plus-ai-exec` to `ai-execution`, `l3plus-workstreams` to `workstreams`, `l3plus-communication` to `communication` | - |
| `level-3+/spec.md` | `related-docs` | `compliance` to `compliance-checkpoints`, `stakeholders` to `stakeholder-matrix`, `changelog` to `change-log` | - |
| `level-3+/tasks.md` | `milestones`, `ai-exec`, `workstreams`, `status-log` | - | the nine Verification Checklist anchors in T012 |

The three `acceptance-criteria.md` examples and the Level 3 `decision-record.md` example not listed above already pass the contract. Do not edit them.

### Drift guard contract

`runtime/cli/spec/check-example-drift.sh` is read-only. It runs the contract command on every example, fails on any `missing_anchor` or `extra_anchor`, and checks the description:

1. The description does not contain `-->`.
2. The first character is not lowercase.
3. The last character is a period.

The full source is in `tasks.md` T005. It prints `EXAMPLE_DRIFT_OK` and exits 0 when every example passes. It prints one `FAIL` line per problem and exits 1 otherwise. The three description rules pass on the post-002 tree, where phase 002 has rewritten the 18 leaked descriptions. On a tree where phase 002 has not run, 18 of the 21 examples fail those rules.

It is wired as `runtime/cli/tests/example-drift.vitest.ts`, because `package.json` has no `check-` script and every existing guard is a vitest test. Evidence: `rg -n 'check-' package.json` exited 1, and `template-structure.vitest.ts` is a vitest guard.

### Data Flow
Lane A and Lane B edit templates. Lane C aligns examples and writes both guards. The conductor regenerates the snapshots once, then runs the fill test, the golden test, the drift guard and the validator. A failure returns to the lane that owns the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes producers that every scaffold and every example reads.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core/*.tmpl` | Rendered into every new packet | update: add one FILL line per section, repair four anchor placements in `spec.md.tmpl` | the fill test and the golden test |
| `templates/addons/*.tmpl` | Rendered into Level 2 and Level 3 packets | update: add one FILL line per section, repair three research crossings | the fill test and the golden test |
| `templates/examples/level-*/*` | Filled models a weak model imitates | update: align anchors, keep content | `check-example-drift.sh` |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Stored golden renders | regenerate once | `12 passed` without `-u` |
| `runtime/cli/spec/check-example-drift.sh` | New read-only guard | create | `EXAMPLE_DRIFT_OK` |
| `runtime/cli/tests/example-drift.vitest.ts` | Wires the guard into the suite | create | the suite passes |
| `runtime/cli/tests/template-fill-guidance.vitest.ts` | Guards the fill line and the anchor count | create | `16 passed` |

Required inventories:
- Same-class producers: every template under `templates/core` and `templates/addons` is in the fill test, so a section without a FILL line fails.
- Consumers of changed symbols: the scaffold golden test, the template structure test and `create.sh`. Each is run at phase close.
- Matrix axes: four levels by four core documents is 16 renders. Ten addon templates are checked by their fill count, and `research.md.tmpl` is rendered once at Level 2.
- Algorithm invariant: adding a FILL line never changes an anchor count. The fill test asserts the count per level and document.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Every core section has one FILL line, every anchor count is unchanged | `runtime/cli/tests/template-fill-guidance.vitest.ts` |
| Integration | Every level renders to the stored golden file | `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` |
| Integration | Every example keeps the contract anchors and a usable description | `runtime/cli/spec/check-example-drift.sh` and its vitest wrapper |
| Mutation | A leaked description fails the guard, a missing FILL line fails the fill test | copies under `scratch/test/` |
| Manual | A read-only frontier review reads the fill text against the phase goal | `cli-codex` at phase close |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 closed | Internal | Checked in T001 | Every locator is in the wrong form and the gate is absent |
| `node` and `npx vitest` in the skill root | Internal | Checked in T001 | No test can run |
| `rg`, `awk` and `git` on PATH | Internal | Checked in T001 | No locator or status check can run |
| `cli-codex` for the review | External | Checked in T015 | The review is recorded as skipped and REQ-008 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any path outside the files named in `spec.md` section 3 differs from the start commit.
- **Procedure**: `git diff --name-only <start commit>` lists the paths. Restore each with `git restore --source=<start commit> -- <path>`. Then delete the three new files with `rm` only after their paths are in `goal.md` section 4. The snapshot file is restored by the same command.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T006) ──► Lane A (T007) ──┐
                      Lane B (T008) ──┼──► Golden refresh (T010) ──► Gates (T011-T015)
                      Lane C (T009) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 close | Lane A, Lane B, Lane C |
| Lane A | Setup | Golden refresh |
| Lane B | Setup | Golden refresh |
| Lane C | Setup | Gates |
| Golden refresh | Lane A, Lane B | Gates |
| Gates | Golden refresh, Lane C | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Lane A | Med | 45 minutes |
| Lane B | Med | 45 minutes |
| Lane C | Med | 45 minutes |
| Golden refresh and gates | Low | 30 minutes |
| **Total** | | **3 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start commit recorded in `goal.md` section 4
- [ ] `git status --porcelain` saved to `scratch/baseline/status-start.txt`
- [ ] No feature flag applies, this phase ships no runtime service

### Rollback Procedure
1. List changed files with `git diff --name-only <start commit>`.
2. Restore each path with `git restore --source=<start commit> -- <path>`.
3. Delete the three new files only after their paths are in `goal.md` section 4.
4. Run `git status --porcelain` and compare it with `scratch/baseline/status-start.txt`.
5. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the phase writes text files only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────┐     ┌──────────────┐     ┌────────────────┐     ┌───────┐
│  Setup  │────►│ Lanes A, B, C│────►│ Golden refresh │────►│ Gates │
└─────────┘     └──────────────┘     └────────────────┘     └───────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 003 | Baseline counts and suite result | All lanes |
| Lane A | Setup | `spec.md.tmpl` and `plan.md.tmpl` | Golden refresh |
| Lane B | Setup | `tasks.md.tmpl`, `implementation-summary.md.tmpl`, addons | Golden refresh |
| Lane C | Setup | Aligned examples and two guards | Gates |
| Golden refresh | Lane A, Lane B | New snapshot file | Gates |
| Gates | Golden refresh, Lane C | Phase verdict | Phase 5 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lane A** - 45 minutes - CRITICAL
2. **Lane B** - 45 minutes - CRITICAL
3. **Golden refresh** - 15 minutes - CRITICAL
4. **Gates** - 30 minutes - CRITICAL

**Total Critical Path**: about 2 hours 15 minutes

**Parallel Opportunities**:
- Lanes A, B and C run together because they write disjoint files.
- Lane C finishes before the golden refresh, so the gates wait only for A and B.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T005 marked `[x]` with output | Start of phase |
| M2 | Templates filled | Lanes A and B done, the fill test passes | Mid phase |
| M3 | Examples aligned | The drift guard prints `EXAMPLE_DRIFT_OK` | Mid phase |
| M4 | Golden refreshed | `12 passed` without `-u` | End of phase |
| M5 | Phase closeable | Every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It dispatches Task subagents, runs every verify command, owns the snapshot file and edits only this phase folder.
- **Worker**: one Task subagent on `llmgateway/deepseek-v4.1-flash-1017#max`. One worker does one lane, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first dispatch
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` NEVER rules 1 and 5 before the first Task call
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4
- [ ] Confirm `rg -c 'deepseek-v4.1-flash-1017' opencode.json` prints a number above `0`
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. Tasks marked `[P]` may run together with at most three Task calls in one message, and only when no two write the same file |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the two paths filled in:

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a dispatched Task subagent. This repository's AGENTS.md treats a dispatched worker as
pre-resolved for the spec-folder question, and this prompt is that pre-resolution.
No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: You are a documentation editor. You copy text from plan.md into templates, and you
run read-only checks. Your output is checked by a script.

ALLOWED WRITE PATHS:
  <the files this lane owns>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh, generate-context.js, /speckit:save, and any edit to a file not
listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception.

### Dispatch Command

Dispatch with the Task tool: subagent_type `general`, description `<TASK id>`, prompt = the full text of `$PHASE/scratch/briefs/<TASK>.txt`. When the subagent returns, write its final reply verbatim to `$PHASE/scratch/runs/<TASK>.txt` with the write tool.

`PHASE` is this folder's path. A Task subagent inherits the session model, so no model flag or process cleanup is needed.

### Status Reporting Format

The status line `T### DONE or BLOCKED - one line of evidence`, written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Put the guidance in an HTML comment below the heading

**Status**: Accepted

**Context**: The guidance must not trip phase 003's token gate, must work for a prose paragraph, a table cell and a checklist item, and must not break the header comparison in `template-structure.js`.

**Decision**: Each section carries one ordinary HTML comment on its own line, immediately below the heading: `<!-- FILL: ... -->`. The existing value tokens stay where they are and remain field-level prompts.

**Consequences**:
- The gate ignores the line because it holds no token syntax.
- The line renders into the scaffold but is invisible on the rendered page.
- A model that leaves the line behind leaves a harmless comment, not an unfilled placeholder.

**Alternatives Rejected**:
- Inside the token: a long instruction inside a table cell breaks the table, and a checklist item cannot hold it.
- On the heading line: `template-structure.js` compares heading text, so a comment in the heading would make every filled document differ from its contract.
- A separate guide file: a weak model fills the section in front of it and does not follow a pointer to a second file.

### ADR-002: One fill line per section, not per hint

**Status**: Accepted

**Context**: The five templates phase 003 converts hold 214 hints after its conversion, and the four core templates hold 70 heading rows. One line per hint would repeat the same instruction many times and make the plan unreadable.

**Decision**: One line per `## ` section. It names the one action for the section. The tokens inside the section stay as field-level prompts.

**Consequences**:
- The plan is bounded and the model reads one instruction per section.
- A section with eight tokens still has one governing instruction.

**Alternatives Rejected**:
- Per-token guidance: repetitive, and it hides the section-level action in a crowd of field prompts.

### ADR-003: Delegate anchor comparison to the template contract

**Status**: Accepted

**Context**: A hand-rolled anchor set comparison would duplicate the contract and drift from the validator.

**Decision**: `check-example-drift.sh` calls `node runtime/cli/utils/template-structure.js compare <level> <doc> <example> anchors` and fails on any `missing_anchor` or `extra_anchor` line.

**Consequences**:
- The guard and the validator read one source of truth.
- The guard inherits the contract's dynamic ADR handling for `decision-record.md`.

**Alternatives Rejected**:
- A bash set difference: it would need its own copy of the required and optional lists.

### ADR-004: Examples satisfy required anchors and add no extra anchor

**Status**: Accepted

**Context**: The contract marks some anchors optional, and an example may legitimately omit an optional section. Full equality would force optional sections into every example and would fight the dynamic ADR anchors.

**Decision**: An example must carry every required anchor and no anchor outside the template's allowed set. Optional anchors may be absent.

**Consequences**:
- The alignment table is 14 files, not 24.
- A missing optional section is not drift.

**Alternatives Rejected**:
- Full set equality: it would force `affected-surfaces` and the L3+ workstream sections into every example.

### ADR-005: Regenerate the golden snapshots once, by the conductor

**Status**: Accepted

**Context**: The golden test stores 25 renders. Two lanes edit templates, and one snapshot file cannot take two writers.

**Decision**: Lanes A and B finish first. The conductor runs `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts -u` once, then reruns without `-u`.

**Consequences**:
- One snapshot diff covers every template change.
- No lane writes the snapshot file.
- A mutation run proves the test notices a render change: T010 inserts one Level 1-only line, expects `Tests  1 failed | 11 passed (12)` and exit 1, restores the backup and reruns to `Tests  12 passed (12)`.

**Alternatives Rejected**:
- Each lane updates the snapshots: two lanes would write one file, which breaks the frozen lane rule.

### ADR-006: Optional sections may be deleted, required sections get N/A

**Status**: Accepted

**Context**: A weak model invents a feature flag, an OWASP review and an uptime target for a documentation packet. The contract decides which sections may disappear.

**Decision**: The fill line for an optional section says either `N/A` with one reason or delete the section. The fill line for a required section says `N/A` with one reason and never says delete.

**Consequences**:
- A packet with no service stops inventing an uptime target.
- A Level 3+ compliance checkpoint stays present because the contract requires it.

**Alternatives Rejected**:
- Remove the generic sections from the templates: the Level 3+ contract requires three of them.

---
