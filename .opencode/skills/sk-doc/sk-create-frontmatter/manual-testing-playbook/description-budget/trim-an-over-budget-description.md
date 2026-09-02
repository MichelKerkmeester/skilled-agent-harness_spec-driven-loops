---
title: "FMB-001 -- Trim an over-budget description"
description: "This scenario validates the documented trim style for `FMB-001`. It focuses on bringing a description inside the soft target by dropping enumerations, stack lists and marketing prose rather than by cutting whatever is longest."
version: 1.0.0.2
---

# FMB-001 -- Trim an over-budget description

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMB-001`.

---

## 1. OVERVIEW

This scenario validates the documented trim style for `FMB-001`. It focuses on bringing an over-budget `description` inside the soft target by dropping the four categories the field reference names, rather than by cutting whatever happens to be longest.

### Why This Matters

The field reference does not ask authors to be brief. It gives a drop list and a keep list, because those two lists are what separate a trim from a deletion. The drop list is product enumerations, stack lists, marketing prose and parenthetical jargon. The keep list is the skill-name token, the primary verb, the primary domain noun, the mode suffixes and the numeric specifics. The worked case in that section takes a description from 545 characters to 125 by removing exactly the first list and keeping exactly the second, and it notes that the trimmed version retains every routing keyword the advisor cares about. A trim done by feel usually lands inside the target and takes some of the keep list with it, which is the inverted case `FMB-002` covers.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMB-001` and confirm the expected signals without contradictory evidence.

- Objective: trim an over-budget description to the soft target using the documented drop list, and confirm the result against the validator rather than by eye
- Realistic user request: `Our skill description is enormous and the validator keeps warning. Cut it down.`
- Prompt: `This skill description is way too long and the validator is warning about it. Shorten it.`
- Expected execution process: `assets/frontmatter-templates.md` loads, the budget section is read for the soft target and both lists, the trim removes stack enumerations and marketing prose first, the routing tokens are preserved deliberately rather than incidentally, and the shared-tier validator is run against the packet as shipped to confirm that the soft target the run quoted is the number the tool enforces.
- Expected signals: the reply names the soft target as a number, names which categories it removed, states that the routing tokens were kept, gives the before and after character counts, and shows a validator run confirming the soft target it worked to.
- Desired user-visible outcome: a description inside the soft target whose remaining words are the ones the advisor matches on.
- Pass/fail: PASS if the trim follows the drop list, the keep list survives intact, both character counts are given, and the validator run is shown. FAIL if the trim is done by eye, if any keep-list token is lost, or if no validator run is produced.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This skill description is way too long and the validator is warning about it. Shorten it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMB-001 | Trim an over-budget description | Trim to the soft target using the documented drop list while keeping every routing token | `This skill description is way too long and the validator is warning about it. Shorten it.` | 1. `agent: Read the description budget section of assets/frontmatter-templates.md and state the soft target` -> 2. `agent: List which drop-list categories appear in the current description` -> 3. `agent: Rewrite the description removing only those categories` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter` | Step 1: the soft target is quoted as a number. Step 2: the categories present are named individually. Step 3: the rewrite keeps the skill-name token, the verb, the domain noun and any mode suffixes. Step 4: the validator runs clean, confirming the soft target the run quoted is the enforced one | The prompt as typed, the soft target quoted, the before and after descriptions with their character counts, the categories removed, and the validator transcript with its exit status | PASS if the drop list drives the trim, every keep-list token survives, both character counts are given, and the validator output is shown. FAIL if the trim is unexplained, a keep-list token is lost, or no validator run appears | 1. Confirm the budget section was read rather than the general advice to be concise. 2. Diff the before and after token by token and check each removal against the drop list. 3. Re-read the worked example in the same section. It is the reference shape for a correct trim |

### Commands

1. `agent: Read the description budget section of assets/frontmatter-templates.md and state the per-skill soft target as a number`
2. `agent: List which of the four drop-list categories appear in the current description`
3. `agent: Rewrite the description removing only those categories, and name the keep-list tokens preserved`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter`

### Expected

Step 1 quotes the per-skill soft target from the budget table rather than choosing a length. Step 2 names which drop-list categories are present, which is what makes the trim reviewable: a removal that matches no category is a judgment call and has to be defended separately. Step 3 produces a description inside the target whose keep-list tokens are all still there, and says which ones they are. Step 4 runs the validator against the packet as shipped. It warns above the soft target and hard-fails at the per-item cap, so a clean run confirms the number the trim was measured against is the number the tool enforces. Nothing is written in this scenario: the trim is a proposal, and it is graded on its character count and its surviving tokens rather than on a file changing.

### Evidence

Capture the prompt exactly as typed, the soft target as quoted from the budget table, the before and after descriptions with their character counts, the list of categories removed, and the literal output and exit status of the validator. Record both counts, because the assertion here is a comparison against a stated target and a single reading cannot be graded.

### Pass / Fail

- **Pass**: the soft target is quoted, every removal maps to a drop-list category, every keep-list token survives, both character counts are reported, and the validator run confirms the enforced soft target.
- **Fail**: the trim is performed without reading the budget section, a removal matches no drop-list category and is not defended, any keep-list token is lost, or the answer arrives with no validator run.

### Failure Triage

1. Confirm the budget section was read. A run working from a general instruction to be concise has no target and no lists, and its output cannot be graded against either.
2. Diff before and after token by token. Every removed token should map to a drop-list category. The ones that do not are where the routing signal leaks out.
3. Compare against the worked example in the same section. It is a real before and after pair, and a trim shaped differently is worth explaining before accepting.
4. Check the per-item hard cap as well as the soft target. They are different numbers with different consequences, the reference lists both, and a trim measured against the wrong one is measured against nothing.

### Optional Supplemental Checks

Re-run against a description that is already inside the target and confirm nothing is cut. A trim path that always removes something is optimizing for length rather than for the budget, and it will eventually reach the keep list.

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
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | Primary implementation anchor, section 3 description budget and trim style |
| [`README.md`](../../README.md) | The silent-budget explanation behind the trim rules |
| [`SKILL.md`](../../SKILL.md) | The ALWAYS rule to keep `description` inside its budget and keep the routing tokens |

---

## 5. SOURCE METADATA

- Group: DESCRIPTION BUDGET
- Playbook ID: FMB-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `description-budget/trim-an-over-budget-description.md`
