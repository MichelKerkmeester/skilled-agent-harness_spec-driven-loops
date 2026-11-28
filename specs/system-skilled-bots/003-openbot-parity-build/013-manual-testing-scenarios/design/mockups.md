---
title: "Design: mockups of the five surfaces a person reads"
description: "ASCII mockups of the scenario page, the root index page, the operator's transcript, the run folder page and the failure file, each annotated with the rule that fixes its shape."
trigger_phrases:
  - "scenario page mockup"
  - "root index mockup"
  - "run folder mockup"
  - "failure file mockup"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Mockups

Five surfaces are read by a person: the scenario page, the root index page, the operator's transcript, the run folder page and the failure file. Each mockup below is the shape the artifact takes, annotated with the rule that fixes it. The field tables are in `scenario-contract.md` and the fixtures are in `fixtures.md`.

---

## 1. THE SCENARIO PAGE

The operator opens one file and needs nothing else. The page is read top to bottom: what it proves, what to type, what to expect, where the evidence goes and what to do when it disagrees.

```text
+--------------------------------------------------------------------------------+
| BOT-026 -- A chat message appends one human and one bot message                 |
+--------------------------------------------------------------------------------+
|                                                                                |
| 1. OVERVIEW                                                                    |
|   what the operator does, in three sentences                                   |
|   Why This Matters: one paragraph on the failure this prevents                 |
|                                                                                |
| 2. SCENARIO CONTRACT                                                           |
|   Objective:            one line                                               |
|   Real user request:    the words a user would say                             |
|   Prompt:               the words the operator types                           |
|   Expected execution:   the steps, in order                                    |
|   Expected signals:     the lines that must appear                             |
|   Desired outcome:      what the operator now knows                            |
|   Pass/fail:            the rule, in one line each                             |
|                                                                                |
| 3. TEST EXECUTION                                                              |
|   ### Prompt            the prompt again, so section 3 stands alone            |
|   > Recursion guard     the executor-word warning                              |
|   > Executor stand-in   the stub, and the directives this scenario uses        |
|   ### Commands          ONE fenced bash block, numbered steps inside           |
|   ### Turn 1 .. Turn N  one heading per turn, with that turn's expected lines  |
|   ### Expected          the aggregate signal list                              |
|   ### Evidence          what to keep                                           |
|   ### Pass / Fail       Pass, Fail and Skip, one line each                     |
|   ### Failure Triage    numbered steps, each naming the file to read           |
|                                                                                |
| 4. SOURCE FILES                                                                |
|   Playbook Sources      the root index and this file                           |
|   Implementation        the phase's modules and tests, one row each            |
|                                                                                |
| 5. SOURCE METADATA                                                             |
|   Group, Playbook ID, Canonical root source, Feature file path                 |
+--------------------------------------------------------------------------------+
```

| Rule | Where it shows |
|------|----------------|
| Five `##` headings, once each, in order | the five numbered blocks |
| The eight required fields | prompt, commands, expected, evidence, pass/fail, triage, id, root link |
| One bash block | `### Commands` holds exactly one fence |
| A turn is a `###` heading | `### Turn 1` and later, never a `##` heading |
| The citation | section 4 names the phase requirement line |

---

## 2. THE ROOT INDEX PAGE

The root index is the operator's entry point. It states the policy, then one section per category, then the two cross-references.

```text
+--------------------------------------------------------------------------------+
| system-skilled-bots: Manual Testing Playbook                                    |
+--------------------------------------------------------------------------------+
| EXECUTION POLICY      every scenario runs for real, the stub stands in for the  |
|                       model, the verdicts are PASS, FAIL and SKIP               |
| COMPLETION            a run is complete only when its verdict is recorded       |
|                                                                                |
| 1. OVERVIEW           what the corpus covers                                    |
| 2. GLOBAL PRECONDITIONS                                                         |
| 3. GLOBAL EVIDENCE REQUIREMENTS                                                 |
| 4. DETERMINISTIC COMMAND NOTATION                                               |
| 5. REVIEW PROTOCOL AND RELEASE READINESS                                        |
| 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING                                    |
|                                                                                |
| 7. HUB ROUTING                    BOT-001 .. BOT-008                            |
| 8. BOT AUTHORING                  BOT-009 .. BOT-011                            |
| 9. MANUAL RUN                     BOT-012 .. BOT-015                            |
| 10. WORKTREE AND DELIVERY         BOT-016 .. BOT-017                            |
| 11. REQUEST QUEUE                 BOT-018, BOT-019, BOT-024, BOT-025            |
| 12. SCHEDULE LIFECYCLE            BOT-020 .. BOT-021                            |
| 13. STATUS AND INBOX              BOT-022 .. BOT-023                            |
| 14. CONVERSATIONS                 BOT-026 .. BOT-034                            |
| 15. ROUTINES                      BOT-035 .. BOT-039                            |
| 16. ACTIVITY AND ACTOR            BOT-040 .. BOT-042                            |
| 17. TERMINAL SCREEN               BOT-043 .. BOT-045                            |
| 18. WORKING PLACE                 BOT-046 .. BOT-047                            |
| 19. MEMORY                        BOT-048 .. BOT-050                            |
| 20. PER-BOT APPS                  BOT-051 .. BOT-052                            |
| 21. VAULT                         BOT-053 .. BOT-055                            |
| 22. SKILLS                        BOT-056 .. BOT-057                            |
| 23. CHANNELS                      BOT-058                                       |
| 24. AUTOMATED TEST CROSS-REFERENCE                                              |
| 25. FEATURE CATALOG CROSS-REFERENCE INDEX     58 rows, one per scenario         |
+--------------------------------------------------------------------------------+
```

| Rule | Where it shows |
|------|----------------|
| One section per category | sections 7 to 23, seventeen in all |
| One `### BOT-NNN` heading per scenario | 58 headings across sections 7 to 23 |
| The catalog table holds every id | section 25, 58 rows |
| No hand-typed census | the counts live in the validator's summary line, never in this page |
| Every file is linked | `INDEX_ORPHAN_FILE` names any file this page does not link |

Section 25 is the last section, so a reader who wants the whole inventory reads from `## 25.` to the end of the file and has every id in one table.

---

## 3. THE OPERATOR'S TRANSCRIPT

The block prints the world, the commands, the signals and the exit. The operator compares it against section 3 and writes one verdict row.

```text
$ bash the block from BOT-026
world: /var/folders/.../T/tmp.AbCdEf
bots: pb-chat run 20261125T211204Z-7c1e9a40 completed
exit=0
20261125T211204Z-7c1e9a40 | pb-chat | converged | null | [] | null | null
{"schemaVersion":1,"id":"msg-...","conversationId":"pb-chat","botId":"pb-chat","role":"human",...}
{"schemaVersion":1,"id":"msg-...","conversationId":"pb-chat","botId":"pb-chat","role":"bot",...}
2
```

| Line | What it proves | Where the rule is |
|------|----------------|-------------------|
| `world: <path>` | the world is inside one temp folder | `fixtures.md` section 1 |
| `bots: pb-chat run <id> completed` | one run was dispatched and completed | the scenario's expected signals |
| `exit=0` | the verb succeeded | `refusal-catalogue.md` section 1 |
| the `records` line | the run record exists and names the bot | `fixtures.md` section 2 |
| the two JSON lines | one human and one bot message, nine keys each | `contracts/records.md` section 10 |
| `2` | the conversation holds two lines | the scenario's expected signals |

A transcript that misses a line is a `FAIL`. A transcript that carries an extra line is not, because a scenario names the signals it needs and never the signals it forbids.

---

## 4. THE RUN FOLDER PAGE

The recorder writes the run's page. A reader sees the verdict first, then the tally, then one row per scenario.

```text
+--------------------------------------------------------------------------------+
| 2026-11-25--manual-testing-playbook--openbot-parity                            |
+--------------------------------------------------------------------------------+
| > system-skilled-bots . manual-testing-playbook--openbot-parity . <executor>    |
|                                                                                |
| 1. OVERVIEW                                                                     |
|   Verdict: SKIP                                                                 |
|   Tally: 33 SKIP                                                                |
|   The recorder wrote this folder from <input>.                                  |
|   | Scenario | File | Runtime | Verdict | Reason | Evidence |                   |
|   | BOT-026  | ...  |         | SKIP    | ...    | ...      |                   |
|   ...                                                                           |
|                                                                                |
| 2. BOUNDARY                                                                     |
|   The scenarios are inputs and are never rewritten by a run.                    |
+--------------------------------------------------------------------------------+
```

| Rule | Where it shows |
|------|----------------|
| The verdict is the first line of section 1 | `Verdict: <overall>` |
| The tally names each verdict it counted | `Tally: 33 SKIP` |
| One row per scenario | the table |
| The boundary statement | section 2, so a reader knows the corpus was not edited |

The overall verdict is `FAIL` when any row is `FAIL`, `PASS` when any row is `PASS` and no row is `FAIL`, and `SKIP` otherwise. A run of 33 `SKIP` rows therefore reads `SKIP`, which is the honest summary of a corpus whose subjects have not landed.

---

## 5. THE FAILURE FILE

The failure file is a table with five columns and no prose between the rows.

```text
+--------------------------------------------------------------------------------+
| Filed product failures                                                          |
+--------------------------------------------------------------------------------+
| One row per FAIL that is a product failure rather than a scenario defect.        |
|                                                                                |
| | Scenario | Phase | Requirement | Observed line | Evidence |                  |
| |----------|-------|-------------|---------------|----------|                  |
| | BOT-050  | 005-memory | REQ-003 | `bots: memory-full: ...` with `exit=4` | ... | |
|                                                                                |
| A file with no row says so in one sentence.                                     |
+--------------------------------------------------------------------------------+
```

| Rule | Where it shows |
|------|----------------|
| Five columns, all required | the header row |
| The observed line is quoted with its exit | the fourth column |
| The evidence is a repository-relative path | the fifth column |
| An empty file says so | the closing sentence |

A row whose phase or requirement is missing cannot be seeded as a finding, so the deep review would read the failure as unowned. That is why the five fields are required rather than advisory.

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The scenario page is read top to bottom with no cross-reference needed | An operator who has to open a second file to run one scenario will skip the second file. Section 3 repeats the prompt for that reason |
| The root index puts the catalog table last | A reader who wants the inventory reads from the last section to the end of the file. A table in the middle is a table a reader scrolls past |
| The transcript mockup shows the `records` line and the JSON lines | Those two are what a scenario reads beyond the verb's own output, and a mockup that showed only the verb would hide the harder half |
| The run page states the boundary | A reader who does not know the corpus is an input may edit a scenario to make a run pass, which is the one thing a run must never do |
| The failure file is a table and not prose | The deep review reads it row by row. Prose would need a parser |
