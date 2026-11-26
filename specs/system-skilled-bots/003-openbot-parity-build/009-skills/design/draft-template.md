---
title: "Design: the literal draft SKILL.md template"
description: "The exact draft bots skill propose writes, the run-record field that fills each slot, the literal used where no field fills one and the validator run that proves the draft passes validate_skill_package.py."
trigger_phrases:
  - "skill draft template"
  - "proposal draft SKILL.md"
  - "draft passes the skill validator"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The literal draft `SKILL.md` template

`bots skill propose` builds the draft with no model call, so the draft is a template filled from one run record. This note holds the template, the field table and the validator proof. A builder copies the template and the table and chooses nothing.

Paths are relative to the repository root. `$R` is `.skilled/skills/system-skilled-bots/runtime`.

---

## 1. THE TEMPLATE

The text below is the draft, with each slot written as `<slot>`. The field table in section 2 fills every slot. The blank lines and the heading levels are part of the template, because the validator reads the section headings.

```text
---
name: <name>
description: "<description>"
allowed-tools: ["Read"]
version: 1.0.0.0
---

# <name>

## WHEN TO USE

Use this skill when a run has to repeat what run <runId> did.

## SMART ROUTING

| Request | Route |
|---------|-------|
| A run of <botId> that repeats this work | This file |

## HOW IT WORKS

1. Read the run folder at <runFolder>.
2. Follow the steps the run's ledger records.

## RULES

- The run this skill came from exited <exitReason>.

## REFERENCES

- Run folder: <runFolder>
```

---

## 2. WHICH RUN-RECORD FIELD FILLS EACH SLOT

| Slot | Source | Literal when no field fills it |
|------|--------|--------------------------------|
| `<name>` | the `--name` value, else the record's `identity.botId` | none, the slot is always filled |
| `<description>` | none | `Proposed from run <runId> of bot <botId>. Rewrite this line before the skill goes live.` |
| `allowed-tools` | none | `["Read"]` |
| `version` | none | `1.0.0.0` |
| the `# <name>` heading | the same value as `name` | none |
| `<runId>` | `identity.runId` | none |
| `<botId>` | `identity.botId` | none |
| `<runFolder>` | `evidence.runFolder` | none |
| `<exitReason>` | `exit.reason` | none |

The record's field names are `contracts/records.md` section 4 and the reader's own type. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:196-206] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:130-139] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:149-159]

**Why the description states provenance.** The draft is built with no model call, so the only true sentence about it is where it came from. A description that guessed at the skill's purpose would be a claim nobody checked, and the operator rewrites the line before the skill goes live. The line is 108 characters on the sample run, under the 130-character soft target the skill contract sets.

**Why `allowed-tools` is `["Read"]`.** A proposed skill has not been reviewed, so the draft asks for the narrowest set that lets a run read its own run folder. The operator widens it when the skill goes live, and a draft that asked for `Write` and `Bash` would grant more than the review approved.

**Why `version` is `1.0.0.0`.** The skill contract requires a four-part version and the first edition is the first part. [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:58]

---

## 3. THE VALIDATOR PROOF

The draft must pass `validate_skill_package.py`, which runs `package_skill.py --check` over the folder. [SOURCE: .skilled/skills/sk-doc/scripts/validate_skill_package.py:258-272] The check requires four frontmatter fields, five section headings and a frontmatter `name` equal to the folder name. [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:58] [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:68-74] [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1658-1664]

The filled template, written to a folder named for the skill, prints:

```text
$ python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py /tmp/drafttest/report
Skill: /tmp/drafttest/report
Detected kind: standalone
- package_skill.py --check: PASS (exit 0)
$ echo $?
0
```

The command that reproduces it, with the sample run's values filled in:

```bash
mkdir -p /tmp/drafttest/report
cat > /tmp/drafttest/report/SKILL.md <<'EOF'
---
name: report
description: "Proposed from run 20261125T210204Z-0b6e5f72 of bot hello. Rewrite this line before the skill goes live."
allowed-tools: ["Read"]
version: 1.0.0.0
---

# report

## WHEN TO USE

Use this skill when a run has to repeat what run 20261125T210204Z-0b6e5f72 did.

## SMART ROUTING

| Request | Route |
|---------|-------|
| A run of hello that repeats this work | This file |

## HOW IT WORKS

1. Read the run folder at /Users/ada/code/skilled/.skilled/skills/.state/system-skilled-bots/local%2Ftool/runs/20261125T210204Z-0b6e5f72.
2. Follow the steps the run's ledger records.

## RULES

- The run this skill came from exited completed.

## REFERENCES

- Run folder: /Users/ada/code/skilled/.skilled/skills/.state/system-skilled-bots/local%2Ftool/runs/20261125T210204Z-0b6e5f72
EOF
python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py /tmp/drafttest/report
```

**Why the folder name matters.** The validator refuses a frontmatter `name` that differs from the folder name, so the draft is only valid once it sits in `.skilled/skills/<name>/`. The proposal writes it to `proposals/<runId>/SKILL.md` first, where the folder is the run id and the check would fail. The check therefore runs on the draft's text with the target name, not on the proposals folder, and the operator's move into `.skilled/skills/<name>/` is what makes the folder name agree.

**The test this gives.** `tests/skill-proposal.vitest.ts` writes the draft to a temp folder named for the target and runs `validate_skill_package.py` over it, so a template edit that breaks the validator fails the suite rather than the operator's move.

---

## 4. THE SECRET CHECK

The draft is checked before either file is written, through `findSecretLiteral` with the known-secret map the answer path already builds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:287] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88] A match refuses `proposal-secret` naming the key and never the value, and neither file is written.

The check covers the whole draft text, because a run's `exit.reason` and its run folder path are the two slots a stored value could reach. A run folder path holds no value, so in practice the check fires on `exit.reason` when a child printed a value and the run recorded it.

---

## 5. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The draft is a template filled from the record, with no model call | The research records the proposal as having no design and no model call, and a template is the only form that is reproducible and testable |
| The description states provenance and tells the operator to rewrite it | No field in the record says what the skill is for, and a guessed purpose would be a claim nobody checked |
| `allowed-tools` is `["Read"]` | A draft has not been reviewed, so it asks for the narrowest set that lets a run read its own run folder |
| The validator runs on the draft's text with the target name, not on the proposals folder | The validator requires the frontmatter name to equal the folder name, and the proposals folder is named for the run |
| The template carries five sections and no more | The validator requires five and warns on two more, and a draft with empty recommended sections would read as complete when it is not |
