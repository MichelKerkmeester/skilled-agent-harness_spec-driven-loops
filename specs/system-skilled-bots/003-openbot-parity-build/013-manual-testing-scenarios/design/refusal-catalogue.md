---
title: "Design: the refusal catalogue a scenario asserts"
description: "Every refusal, exit code and post-run cause the 33 scenarios assert, with its phase, its layer, its message form and the scenario that proves it, plus the validator codes and the recorder refusals that gate the corpus itself."
trigger_phrases:
  - "scenario refusal catalogue"
  - "exit codes a scenario asserts"
  - "validator violation codes"
  - "recorder refusals"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The refusal catalogue

A scenario that asserts a refusal asserts three things: the name, the exit code and the message form. This file lists every one of them, the phase that owns it and the scenario that proves it. The packet's own table is `contracts/refusals.md`, which owns the layer, the failure class and the registry entry for each name. This file adds only what a scenario needs: the exact line the operator reads and the scenario that reads it.

---

## 1. THE EXIT CODES A SCENARIO READS

| Code | Name | What a scenario sees | Source |
|------|------|----------------------|--------|
| 0 | `completed` | the verb did what it was asked, or the run completed | `contracts/refusals.md` section 1 |
| 1 | `runFailure` | a dispatched run failed, or the CLI caught a throw, or a checker printed a `FAIL:` line | `contracts/refusals.md` section 1 |
| 2 | `usage` | the command line is wrong, or `bots.cjs` refused its own input before any runtime call | `contracts/refusals.md` section 2 |
| 3 | `recursionGuard` | a failed run whose runner exit was the recursion guard | `contracts/refusals.md` section 1 |
| 4 | `refused` | a run refused before dispatch, or a verb whose runtime call returned a refusal | `contracts/refusals.md` section 1 |
| 5 | `awaitingDecision` | the run parked a needs-you item and exited | `contracts/refusals.md` section 1 |

The rule a scenario relies on: a refusal `bots.cjs` decides on its own input exits 2, and a refusal that comes back from a runtime call exits 4. Every `answerItem` refusal exits 4. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "2. LAYERS AND THE EXIT RULE"]

---

## 2. THE REFUSALS THE SCENARIOS ASSERT

| Name | Phase | Layer | Exit | The line the operator reads | Scenario |
|------|-------|-------|------|-----------------------------|----------|
| `bot-unknown` | 010 | Verb refusal (`chat`) | 4 | `bots: bot-unknown: <bot id>` and nothing appended | BOT-027 |
| `grant-scope-unsupported` | 001 | Verb refusal (`answer`) | 2 | `bots: grant-scope-unsupported` | BOT-029 |
| `--scope takes once or deny` | 001 | Verb refusal (`answer`) | 2 | `bots: --scope takes once or deny` | BOT-029 |
| `review-answer-invalid` | 005 | Verb refusal (`answer` on a review item) | 4 | `bots: review-answer-invalid` and the item stays open | BOT-031 |
| `proposal-stale` | 009 | Verb refusal (`answer` on a `skill-proposal`) | 4 | `bots: proposal-stale` and the item stays open | BOT-032 |
| `answer-not-approver` | 006 | Verb refusal (`answer`, `enable`) | 4 | `bots: answer-not-approver: <actor>` | BOT-034 |
| `routine-floor-15-minutes` | 002 | Checker invariant, and an install refusal | 1 checker, 4 install | `FAIL: routine-floor-15-minutes: <bot id>` then `bots: routine-floor-15-minutes` | BOT-038 |
| `routine-fatigued` | 002 | Run refusal | 4 | `bots: <bot id> refused before dispatch (routine-fatigued)` | BOT-039 |
| `routine-completed` | 002 | Run refusal | 4 | `bots: <bot id> refused before dispatch (routine-completed)` | BOT-037 |
| `ui-unavailable` | 003 | Verb refusal (`ui`) | 4 | `bots: ui-unavailable: <path>` | BOT-043 |
| `memory-full` | 005 | Verb refusal (`remember`, `answer confirm`) | 4 | `bots: memory-full: <path> (<n> entries, <b> bytes), free a line with bots remember --forget <entry-id>`, with ` --bot <botId>` at the end for a bot's own file | BOT-050 |
| `apps-unknown-server` | 007 | Checker invariant | 1 | `FAIL: apps-unknown-server: <names>` | BOT-052 |
| `apps-refused` | 007 | Run refusal | 4 | `bots: <bot id> refused before dispatch (apps-refused)` | BOT-051 |
| `skill-unknown` | 009 | Run refusal | 4 | `bots: <bot id> refused before dispatch (skill-unknown)` | BOT-056 |
| `skills-over-budget` | 009 | Checker invariant, and a run refusal | 1 checker, 4 run | `FAIL: skills-over-budget: <skill name>` then `bots: <bot id> refused before dispatch (skills-over-budget)` | BOT-057 |
| `secret-empty` | 008 | Verb refusal (`secret set`) | 2 | `bots: secret-empty` | BOT-053 |
| `--as needs a tty` | 001 | Verb refusal (`answer`, `run`) | 2 | `bots: --as needs a tty` | BOT-042 |
| `--as takes a name` | 001 | Verb refusal (`answer`, `run`) | 2 | `bots: --as takes a name` | BOT-042 |

Each row's layer, class and registry entry are `contracts/refusals.md` section 3. A scenario asserts the name and the exit, never the class, because the class is a run-record field and the scenario reads the record only where it says so.

---

## 3. THE POST-RUN CAUSES

A post-run cause is not a refusal. The child already ran, so the run keeps its own outcome and the cause is recorded on the run record.

| Cause | Phase | Recorded on | What the scenario reads | Scenario |
|-------|-------|-------------|-------------------------|----------|
| `secret-in-output` | 008 | `postRunCauses` and the redacted `stdout.log` line | the redacted line and the cause entry, and no delivery | BOT-055 |
| `memory-proposal-secret` | 005 | `postRunCauses` | the cause entry and no item | BOT-031 |
| `remember-type-invalid` | 005 | `postRunCauses` | the cause entry and no item | BOT-031 |

The field shape is `contracts/records.md` section 4, and the three names are `contracts/refusals.md` section 3.4 and section 3.7.

---

## 4. THE DELIVERY STATE A SCENARIO READS

`unknown` is not a refusal. It is the delivery state an uncertain send records, and it is terminal, so the queue never retries it.

| Value | Phase | Where | What the scenario reads | Scenario |
|-------|-------|-------|-------------------------|----------|
| `unknown` | 011 | the queue entry's `state` and the run record's `delivery[].state` | the entry's `state` and `attempts`, and no second attempt | BOT-058 |

The queue entry's field table is `contracts/records.md` section 14, and the never-retried rule is `contracts/refusals.md` section 3.10.

---

## 5. THE CODES THAT GATE THE CORPUS ITSELF

These are not product refusals. They are the checks that decide whether a scenario file or a run may exist, and a builder meets them while authoring rather than while executing.

### 5.1 The package validator

| Code | Severity | Meaning | Fix |
|------|----------|---------|-----|
| `SECTION_MISSING` | error | one of sections 1 to 4 is absent | write the heading |
| `SECTION_5_MISSING` | error | section 5 is absent | write `## 5. SOURCE METADATA` |
| `SECTION_ORDER_MISMATCH` | error | the five headings are out of order | reorder them |
| `REQUIRED_FEATURE_ID` | error | no `BOT-NNN` in the heading | add the id |
| `REQUIRED_PROMPT` | error | no prompt label | add `- Prompt:` |
| `REQUIRED_COMMAND_SEQUENCE` | error | no `### Commands` heading | add it |
| `REQUIRED_EXPECTED_SIGNALS` | error | no expected signals | add `### Expected` |
| `REQUIRED_EVIDENCE` | error | no evidence list | add `### Evidence` |
| `REQUIRED_PASS_FAIL` | error | no pass or fail rule | add `### Pass / Fail` |
| `REQUIRED_FAILURE_TRIAGE` | error | no triage | add `### Failure Triage` |
| `REQUIRED_ROOT_LINK` | error | no link to the root index | add the link |
| `FORBIDDEN_VERDICT` | error | `PARTIAL`, `READY`, `UNAUTOMATABLE` or `BLOCKED` appears | use `PASS`, `FAIL` or `SKIP` |
| `SKIP_BLOCKER_MISSING` | error | `SKIP` with no blocker | name the blocker |
| `FILENAME_NOT_KEBAB` | error | the file name is not a letter-led kebab slug | rename it |
| `CATEGORY_NOT_KEBAB` | error | the folder is not a bare kebab slug | rename it |
| `PATH_MISSING` | error | a markdown link does not resolve | fix the link |
| `PATH_OUTSIDE_REPO` | error | a markdown link leaves the repository | point inside it |
| `DEVELOPER_ABSOLUTE_PATH` | error | an absolute home path appears | use a relative path |
| `BAKED_RUN_TRANSCRIPT` | error | a dated run result appears in scenario truth | remove the date |
| `DUPLICATE_FEATURE_ID` | error | two files carry one id | renumber one |
| `INDEX_ORPHAN_FILE` | error | the root index does not link the file | add the link |
| `INDEX_PHANTOM_FILE` | error | the root index links a missing file | remove the link |
| `RESULT_PERSISTENCE_MARKER_MISSING` | error | the root has no result-persistence marker | copy the block |
| `HAND_TYPED_CENSUS` | warning | the root states a count by hand | let the validator derive it |
| `CENSUS_MISMATCH` | warning | a hand-typed count disagrees with the tree | remove the count |
| `PROMPT_UNSYNCED` | warning | the root summary prompt differs from the scenario's | make them one string |
| `BACKTICK_PATH_UNRESOLVED` | warning | a backticked path resolves from no base | fix the path |

The validator's own list is the authority, and this table names the codes a builder of this corpus meets. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:31]

### 5.2 The recorder

| Refusal | Meaning | Fix |
|---------|---------|-----|
| `no verdict records to save` | the CSV holds no data row | add the rows |
| `<id> is not a scenario in this playbook` | the id is not defined | correct the id |
| `verdict must be PASS, FAIL or SKIP` | another word was used | use one of the three |
| `a FAIL needs a reason` | the reason column is empty | write the reason |
| `a SKIP needs a reason` | the blocker column is empty | write the blocker |
| `<id> is recorded twice` | one scenario on one runtime twice | keep one row |
| `<folder> already exists` | the run folder is taken | pick another label |
| `has no run table headed Executed and Folder` | the index has no run table | add the header |

[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs:248]

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| A scenario asserts the name and the exit, never the failure class | The class is a run-record field. A scenario that asserted it would read a record it does not otherwise open, and the class is the phase's to change |
| The catalogue lists the validator codes as well as the product refusals | A builder meets a validator code while authoring and a product refusal while executing. One file that names both is one place to look when a check fails |
| The message form is quoted with `<angle>` placeholders | The operator compares the shape and the name, not the value. A quoted value would be a value the scenario cannot know |
| `unknown` is catalogued beside the refusals | It is the one terminal state a scenario asserts that is not a refusal, and leaving it out would send a reader to the delivery table for a name this file already uses |
