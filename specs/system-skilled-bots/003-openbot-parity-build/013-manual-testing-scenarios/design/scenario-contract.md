---
title: "Design: the scenario file contract and the run record"
description: "Every field of a scenario file, of a verdict row, of the recorded results.csv, of the run folder and of a filed failure, with the validator code that enforces each one and the sample that shows it."
trigger_phrases:
  - "scenario file contract"
  - "verdict row schema"
  - "run folder schema"
  - "failure row schema"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The scenario file contract and the run record

This file is the one place the shapes of this phase are written. A scenario file, a verdict row, a recorded run and a filed failure each have a field table here, a literal sample and the check that enforces it. The package contract that owns the five-section order is `sk-create-manual-testing-playbook`'s `SKILL.md` section 3, and the validator that enforces it is `validate-playbook-package.cjs`. This file does not restate either, it names the field and the code.

The corpus is an input. A run never rewrites it, and the recorder is the one writer of a run folder. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215]

---

## 1. THE SCENARIO FILE

Path: `.skilled/skills/system-skilled-bots/manual-testing-playbook/<category>/<slug>.md`. The category is a bare kebab-case slug with no numeric prefix, and the file name is a letter-led kebab-case slug with no numeric prefix. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:850]

### 1.1 Frontmatter

| Key | Type | Null | Required | Enforced by |
|-----|------|------|----------|-------------|
| `title` | string, `BOT-NNN -- <one sentence>` | no | yes | `FRONTMATTER_TITLE_MISSING` |
| `description` | string, one sentence naming what the scenario proves | no | yes | `FRONTMATTER_DESCRIPTION_MISSING` |
| `version` | string, four parts, `1.0.0.0` at birth | no | yes | the package contract, `SKILL.md` section 3 |

The feature id is read from the `# BOT-NNN -- <title>` heading, not from the frontmatter. A file whose heading carries no id fails `REQUIRED_FEATURE_ID`, and two files carrying one id fail `DUPLICATE_FEATURE_ID`.

### 1.2 The five sections

| # | Heading | Holds | Enforced by |
|---|---------|-------|-------------|
| 1 | `## 1. OVERVIEW` | what the operator does, and a `### Why This Matters` paragraph | `SECTION_MISSING` |
| 2 | `## 2. SCENARIO CONTRACT` | the objective, the realistic user request, the prompt, the expected execution process, the expected signals, the desired user-visible outcome and the pass/fail rule | `SECTION_MISSING` |
| 3 | `## 3. TEST EXECUTION` | the prompt, the one bash block, the per-turn expectations, the expected signals, the evidence list, the pass/fail rule and the failure triage | `SECTION_MISSING` |
| 4 | `## 4. SOURCE FILES` | the playbook sources and the implementation and test anchors | `SECTION_MISSING` |
| 5 | `## 5. SOURCE METADATA` | the group, the playbook id, the canonical root source and the feature file path | `SECTION_5_MISSING` |

The five headings appear once each and in this order. A sixth `## <n>. ` heading fails the count this phase's acceptance criterion reads, so a subsection inside section 3 is a `###` heading and never a `##` one. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:718]

### 1.3 The eight required fields

| Field | Form | Enforced by |
|-------|------|-------------|
| Feature id | `# BOT-NNN -- <title>` | `REQUIRED_FEATURE_ID` |
| Prompt | `- Prompt: \`<the words the operator types>\`` in section 2 | `REQUIRED_PROMPT` |
| Command sequence | `### Commands` holding one fenced `bash` block | `REQUIRED_COMMAND_SEQUENCE` |
| Expected signals | `### Expected` or a `Expected signals:` label | `REQUIRED_EXPECTED_SIGNALS` |
| Evidence | `### Evidence` or an `Evidence:` label | `REQUIRED_EVIDENCE` |
| Pass/fail | `### Pass / Fail` with a `**Pass**` line and a `**Fail**` line | `REQUIRED_PASS_FAIL` |
| Failure triage | `### Failure Triage` with numbered steps | `REQUIRED_FAILURE_TRIAGE` |
| Root link | a link to `manual-testing-playbook.md` | `REQUIRED_ROOT_LINK` |

### 1.4 The verdict vocabulary

A scenario's outcome is one of `PASS`, `FAIL` or `SKIP`. The words `PARTIAL`, `READY`, `UNAUTOMATABLE` and `BLOCKED` are refused anywhere in a scenario file, because each one is a verdict the recorder cannot store. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:31]

`SKIP` carries a blocker. The blocker names the missing prerequisite, which is one of four: a binary the scenario needs, the stub executor, a real channel account or the verb the scenario drives when that verb is not in the CLI's verb table. A `SKIP` with no blocker fails `SKIP_BLOCKER_MISSING`.

### 1.5 The citation rule

Every scenario cites the phase requirement it proves, in the `[SOURCE: <path>:<line>]` form, and the line resolves to the requirement row. A renamed verb breaks the citation rather than the scenario, which is the point. The phase-to-requirement map is section 6 of this file.

---

## 2. THE VERDICT ROW

The operator writes one row per scenario into a verdict CSV. The recorder reads it, so the column names are the recorder's and not the operator's invention.

| Column | Type | Null | Required | Meaning |
|--------|------|------|----------|---------|
| `scenario_id` | string, `BOT-NNN` | no | yes | the id the playbook defines. An id the playbook does not define is refused |
| `runtime` | string | yes | no | the runtime or host that ran the block. Empty for a terminal run |
| `verdict` | `PASS`, `FAIL` or `SKIP` | no | yes | the outcome |
| `reason` | string | yes for `PASS` | yes for `FAIL` and `SKIP` | why the verdict was reached, in one sentence |
| `evidence` | string, a repository-relative path or a fixed outside note | yes | no | where the transcript lives |

A `FAIL` or a `SKIP` with no `reason` is refused, and one scenario recorded twice on one runtime is refused. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs:248]

Sample, three rows:

```csv
scenario_id,runtime,verdict,reason,evidence
BOT-026,,PASS,one human and one bot message appended and one run dispatched,specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/scratch/transcripts/BOT-026.txt
BOT-036,,SKIP,the routines verb is absent from the CLI verb table so the block cannot install a schedule,specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/scratch/transcripts/BOT-036.txt
BOT-050,,FAIL,the bound refused at 59 entries rather than 60,specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/scratch/transcripts/BOT-050.txt
```

---

## 3. THE RECORDED RUN FOLDER

Path: `.skilled/skills/system-skilled-bots/benchmark/reports/<YYYY-MM-DD>--manual-testing-playbook--openbot-parity/`. The recorder writes three files and one index row, and it refuses a folder that already exists. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs:495]

### 3.1 `results.csv`

| Row | Content |
|-----|---------|
| 1 | `# recorded by record-playbook-run.cjs from <input path>`, the provenance line |
| 2 | `scenario_id,runtime,verdict,reason,evidence`, the header |
| 3 to 35 | one row per scenario, in the order the verdict CSV gave them |

The verdict is the third column, so a reader that wants the tally reads column three and never the first. The provenance line is the proof that the recorder wrote the file, which is why this phase's criterion reads it rather than counting comment lines.

### 3.2 `README.md`

The run's own page: the verdict, the tally, the input path, the executor, the base commit, the boundary statement and one table row per scenario with its verdict, reason and evidence.

### 3.3 `source.md`

Where the corpus and the raw evidence live, so a later reader can re-run the same block.

### 3.4 The index row

`benchmark/reports/README.md` gains one row in its `| Executed | Folder | Runtime | Result | Verdict | Source |` table, newest first. A reports folder with no `README.md` gets one written from the recorder's template.

---

## 4. THE FILED FAILURE

Path: `specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/scratch/failures.md`. One row per `FAIL` that is a product failure rather than a scenario defect. Five fields, all required, because a row missing one cannot be seeded as a finding by the deep review.

| Field | Type | Meaning |
|-------|------|---------|
| Scenario id | `BOT-NNN` | the scenario that failed |
| Phase | `NNN-<slug>` | the phase whose requirement the scenario proves |
| Requirement | `REQ-NNN` | the requirement row the scenario cites |
| Observed line | string | the line the run printed, quoted, with its exit status |
| Evidence path | string, repository-relative | the transcript that holds the line |

A scenario defect is not filed here. It is fixed in the scenario and its row is re-run, so the recorded run matches the corpus. The distinction is the one decision D4 draws: a product failure does not block this phase once it is filed, and it does block the deep review's PASS. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D4]

Sample, one row:

```markdown
| BOT-050 | 005-memory | REQ-003 | `bots: memory-full: <path> (59 entries, 3590 bytes), free a line with bots remember --forget <entry-id>` with `exit=4` at the 60th append | specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/scratch/transcripts/BOT-050.txt |
```

The file is copied beside `results.csv` in the run folder, so the run and the failures it produced travel together.

---

## 5. THE THROWAWAY WORLD

Every scenario builds the same skeleton under one `mktemp -d` folder and removes it in its last step. The skeleton is the fixture in `fixtures.md` section 1. Three properties bind it.

1. The state root is inside the world, so no scenario reads or writes a real bot's state.
2. `HOME` is inside the world, so no scenario reads the operator's account.
3. The stub executor is first on `PATH`, so no scenario calls a model.

A scenario that needs a second bot, a routine block, a `skills:` list or a channel config adds it to the same world and never to a second one.

---

## 6. THE PHASE-TO-REQUIREMENT MAP

One row per scenario. The line resolves to the requirement row the scenario proves, and the scenario cites it in its own section 4.

| Scenario | Phase | Requirement line | What the line fixes |
|----------|-------|------------------|---------------------|
| BOT-026 | 010 | `010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-001` | `bots chat <id> --message <text>` appends one human message and dispatches one run |
| BOT-027 | 010 | `010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-004` | `@<bot-id>` routing, and `bot-unknown` for a bot with no `BOT.md` |
| BOT-028 | 010 | `010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-012` | a resumed run appends one bot message to the conversation it came from |
| BOT-029 | 001 | `001-activity-and-actor/spec.md, REQ-010` | `--scope once\|deny`, and `grant-scope-unsupported` for any other value |
| BOT-030 | 006 | `006-approval-grants/spec.md, REQ-007` | the inbox prints each item's grant kind, rung and scope |
| BOT-031 | 005 | `005-memory/spec.md, REQ-007` | a `[REMEMBER]` line becomes a `memory-proposal` item |
| BOT-032 | 009 | `009-skills/spec.md, REQ-006` | a proposal review records the decision and enqueues no resume |
| BOT-033 | 011 | `011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-008` | a numbered reply answers an open prompt through the transport |
| BOT-034 | 011 | `011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-005` | only an owner or a member may answer from a channel |
| BOT-035 | 002 | `002-routine-layer/spec.md, REQ-007` | `bots routines [--json]` lists every bot carrying a routine block |
| BOT-036 | 002 | `002-routine-layer/spec.md, REQ-001` | `starts[0]` renders into the trigger the installer reads |
| BOT-037 | 002 | `002-routine-layer/spec.md, REQ-004` | `until_check` runs after a completed run and sets `completed` |
| BOT-038 | 002 | `002-routine-layer/spec.md, REQ-005` | a cron start under 900 seconds is refused `routine-floor-15-minutes` |
| BOT-039 | 002 | `002-routine-layer/spec.md, REQ-006` | ten consecutive failures disable the bot and raise one item |
| BOT-040 | 001 | `001-activity-and-actor/spec.md, REQ-001` | `bots activity` groups rows under the seven ids in order |
| BOT-041 | 001 | `001-activity-and-actor/spec.md, REQ-003` | `bots inbox --json` carries the ten item fields |
| BOT-042 | 001 | `001-activity-and-actor/spec.md, REQ-005` | every run record carries `actor`, and an answered run carries `answeredBy` |
| BOT-043 | 003 | `003-terminal-screen/spec.md:105` | the `ui` verb refuses `ui-unavailable` when the crate is absent |
| BOT-044 | 003 | `003-terminal-screen/spec.md, REQ-006` | the inbox pane answers with `y` and `n` through `bots answer --scope` |
| BOT-045 | 003 | `003-terminal-screen/spec.md, REQ-010` | every bound key is drawn in the frame that binds it |
| BOT-046 | 004 | `004-computer-exposure/spec.md, REQ-001` | `buildBotPrompt` emits one working-place line |
| BOT-047 | 004 | `004-computer-exposure/spec.md, REQ-004` | `bots status` prints `branch` and `worktree` |
| BOT-048 | 005 | `005-memory/spec.md, REQ-001` | `bots remember <text>` appends one five-field line |
| BOT-049 | 005 | `005-memory/spec.md, REQ-006` | `buildBotPrompt` inserts the memory blocks at the memory position |
| BOT-050 | 005 | `005-memory/spec.md, REQ-003` | the 60-entry and 3,600-byte bound refuses with `memory-full` and exit 4 |
| BOT-051 | 007 | `007-per-bot-apps/spec.md, REQ-003` | every run writes a filtered `utcp.json` before dispatch |
| BOT-052 | 007 | `007-per-bot-apps/spec.md, REQ-002` | an unknown server name is refused `apps-unknown-server` |
| BOT-053 | 008 | `008-vault/spec.md, REQ-003` | `bots secret list` prints names and metadata only |
| BOT-054 | 008 | `008-vault/spec.md, REQ-007` | the value reaches the child under `SKILLED_BOT_SECRET_<NAME>` |
| BOT-055 | 008 | `008-vault/spec.md, REQ-014` | a printed value is redacted and records `secret-in-output` |
| BOT-056 | 009 | `009-skills/spec.md, REQ-002` | each named skill's body is inserted at the skills position |
| BOT-057 | 009 | `009-skills/spec.md, REQ-003` | a list whose bodies sum over 20,480 bytes refuses `skills-over-budget`, which is the cap D11 sets |
| BOT-058 | 011 | `011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-013` | an uncertain send is recorded `unknown` and never retried |

---

## 7. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The verdict is the third column of `results.csv`, not the first | The recorder owns the column order and writes `scenario_id,runtime,verdict,reason,evidence`. A criterion that reads the first column would read the id. The phase's checks read `^BOT-0` for the row count and `,(PASS\|FAIL\|SKIP),` for the verdict count |
| The provenance line stays in `results.csv` | It is the recorder's own proof that the file was not hand-written, which is the property decision D5 protects. A criterion that demanded zero comment lines would forbid the one line that proves the recorder wrote it |
| A missing verb is a `SKIP` blocker, not a `FAIL` | The scenario cannot run because its subject is not in the CLI's verb table. A `FAIL` would assert the product is wrong when the phase that adds the verb has not landed, and it would file a defect against work in progress |
| The failure row carries five fields and no sixth | The deep review seeds each row as a finding, and a finding needs the phase, the requirement, the observed line and the evidence. A sixth field would be a field no reader consumes |
| The scenario cites the requirement line rather than the requirement text | A copied sentence drifts. A line number breaks loudly when the requirement moves, which is the signal the phase wants |
