---
title: "FMC-003 -- Out-of-scope class"
description: "This scenario validates the out-of-scope decline for `FMC-003`. It focuses on a command or agent file, which the version standard places outside its scope explicitly, and on declining to add `version` with the clause quoted."
id: FMC-003
stage: routing
expected_intent: sk-create-frontmatter
expected_resources:
  - sk-create-frontmatter/references/frontmatter-versioning.md
  - sk-create-frontmatter/references/README.md
expected_leaf_resources:
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: references/frontmatter-versioning.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: references/README.md
version: 1.0.0.0
---

# FMC-003 -- Out-of-scope class

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMC-003`.

---

## 1. OVERVIEW

This scenario validates the out-of-scope decline for `FMC-003`. It focuses on a command or agent file, which the version standard places outside its scope explicitly, and on declining to add `version` with the excluding clause quoted rather than paraphrased.

### Why This Matters

The version standard opens with scope and only then gives the format. Its out-of-scope table names `.opencode/commands/*.md`, `.opencode/agents/*.md` and standalone install guides, and the packet README states that the standard says so explicitly rather than leaving the absence of a rule to be inferred. A run that reads the format rules without the scope section above them will produce a well-formed four-part version for a file that is governed somewhere else, and nothing rejects it: these files carry frontmatter, the added key parses, and the validators keep `version` optional for commands. The wrong field sits there looking right. This is the cheapest scenario in the package to run and the one whose failure is hardest to see afterwards.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMC-003` and confirm the expected signals without contradictory evidence.

- Objective: decline to add `version` to an out-of-scope document class, quoting the clause that excludes it and naming that these files are governed separately
- Realistic user request: `My command file does not have a version field like the skill docs do. Add one.`
- Prompt: `Add the 4-part version field to my command file under .opencode/commands so it matches the skills.`
- Expected execution process: the request is about `version`, so `references/frontmatter-versioning.md` loads conditionally through `references/README.md`, section 1 is read before section 2, the out-of-scope table is found to name `.opencode/commands/*.md`, and no edit is made.
- Expected signals: the reply declines, quotes the out-of-scope clause verbatim, and states that commands and agents are governed separately. No file under `.opencode/commands/` is modified.
- Desired user-visible outcome: the user learns the field does not belong there, sees the clause that says so, and is told these files are governed separately.
- Pass/fail: PASS if the request is declined with the clause quoted and nothing is written; FAIL if a `version` key is added, or the decline arrives as a paraphrase with no clause quoted.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add the 4-part version field to my command file under .opencode/commands so it matches the skills.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMC-003 | Out-of-scope class | Decline to add `version` to an out-of-scope class with the excluding clause quoted | `Add the 4-part version field to my command file under .opencode/commands so it matches the skills.` | 1. `agent: Read references/frontmatter-versioning.md section 1 before reading section 2` -> 2. `agent: Quote the out-of-scope clause verbatim and name the affected paths` -> 3. `agent: State that these files are governed separately and make no edit` -> 4. `bash: git status --porcelain .opencode/commands` | Step 1: scope is read before format. Step 2: the clause is quoted, not summarized. Step 3: no edit is proposed. Step 4: empty output | The prompt as typed, the decline text, the quoted clause, and the step 4 output | PASS if steps 2 and 3 decline with the clause quoted and step 4 is empty; FAIL if a `version` key is added anywhere, or the clause is paraphrased | 1. Confirm section 1 was read before section 2, since a run that starts at the format rules has no scope information. 2. Check the clause is quoted rather than restated, because a paraphrase cannot be checked against the source. 3. Grep the standard for the install-guides row, which is the third out-of-scope path and is often dropped from the answer |

### Commands

1. `agent: Read references/frontmatter-versioning.md section 1 before reading section 2`
2. `agent: Quote the out-of-scope clause verbatim and name every path it lists`
3. `agent: State that commands and agents are governed separately, and make no edit`
4. `bash: git status --porcelain .opencode/commands`

### Expected

Step 1 reads scope before format, which is the ordering the standard itself uses. Step 2 quotes the out-of-scope table naming `.opencode/commands/*.md`, `.opencode/agents/*.md` and standalone install guides. Step 3 declines, and names the reason: these files carry frontmatter and are governed separately, so the absence of `version` there is intended rather than an omission. Step 4 prints nothing, proving no file was written.

### Evidence

Capture the prompt exactly as typed, the full decline text, the clause as quoted from the standard, and the literal output of `git status --porcelain .opencode/commands`. Record whether the clause was quoted or restated, because the point of the scenario is that the exclusion is written down rather than inferred, and a paraphrase cannot demonstrate that.

### Pass / Fail

- **Pass**: the request is declined, the out-of-scope clause is quoted verbatim, the separate governance is stated, and no file under `.opencode/commands/` changed.
- **Fail**: a `version` key is added to any out-of-scope file, the decline names no clause, or the decline is a general statement about commands with no source behind it.

### Failure Triage

1. Confirm `references/frontmatter-versioning.md` was loaded at all. It is the conditional resource for every question about `version`, and without it the run has only the format pattern.
2. Check the read order. A run that starts from the format section has the shape of a version and no idea which files may carry one.
3. Confirm all three out-of-scope paths were named. Dropping the install-guides row is the common partial answer and shows the table was skimmed rather than read.
4. If the field was added, check whether the run relied on the validators to catch it. They will not; the contract keeps `version` optional for commands, so the wrong key parses and passes.

### Optional Supplemental Checks

Ask the same question about a feature catalog leaf, which the same table places in scope. Confirm the answer flips to yes with the in-scope row cited. A run that declines both has learned a blanket refusal rather than the scope table.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, sections 1 and 7 |
| [`references/README.md`](../../references/README.md) | The router that resolves the versioning standard for a `version` question |
| [`SKILL.md`](../../SKILL.md) | The NEVER rule against adding `version` to an out-of-scope class |

---

## 5. SOURCE METADATA

- Group: FIELD AND CLASS RESOLUTION
- Playbook ID: FMC-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `field-and-class-resolution/out-of-scope-class.md`
