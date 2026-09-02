---
title: "RRA-003 -- Trigger phrase collision"
description: "This scenario validates collision detection for `RRA-003`. It focuses on catching a trigger phrase another rule already claims, before the file is written."
stage: routing
version: 1.1.0.3
---

# RRA-003 -- Trigger phrase collision

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRA-003`.

---

## 1. OVERVIEW

This scenario validates collision detection for `RRA-003`. It focuses on catching a trigger phrase another rule already claims, before the file is written.

### Why This Matters

No phrase may appear in two rules. The set carries one hundred and forty-four phrases with zero collisions, and that property is what makes a phrase a reliable way to reach one rule. A duplicate does not make both rules findable, it makes both unfindable by that phrase, because a reader who types it has no way to know which file was meant. The check is cheap and it is easy to skip, since a colliding phrase looks correct in isolation and only fails when compared against the whole set.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRA-003` and confirm the expected signals without contradictory evidence.

- Objective: detect a proposed trigger phrase that an existing rule already claims, and name the owning rule
- Real user request: `Use "frozen scope" as one of the trigger phrases for the new rule.`
- Prompt: `For the new rule, add "frozen scope" to its trigger phrases. That is what people type when they hit this.`
- Expected execution process: before the phrase is accepted, the full set of trigger phrases is searched. The phrase is found in `scope-discipline.md`, so the proposal is refused and the owning rule is named. A replacement phrase is proposed that no rule claims, and it is checked the same way.
- Expected signals: the collision is reported with the owning rule named, the phrase is not added, and any replacement is verified against the whole set rather than assumed unique.
- Desired user-visible outcome: the author learns the phrase is taken, which rule takes it, and gets a checked alternative instead of a silent acceptance.
- Pass/fail: PASS if the collision is caught before the file is written and the owning rule is named; FAIL if the phrase is accepted, or the collision is reported without naming the owner.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For the new rule, add "frozen scope" to its trigger phrases. That is what people type when they hit this.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRA-003 | Trigger phrase collision | Verify a phrase an existing rule already claims is caught before the rule file is written | `For the new rule, add "frozen scope" to its trigger phrases. That is what people type when they hit this.` | 1. `bash: grep -rn '^  - "frozen scope"' repo-rules/` -> 2. `agent: Report the collision and name the owning rule` -> 3. `agent: Propose a replacement phrase` -> 4. `bash: grep -rn '^  - "the replacement phrase"' repo-rules/` | Step 1: a match in `scope-discipline.md`. Step 2: the collision is reported with the owner named. Step 4: no match, so the replacement is free | The step 1 match with its file and line, the reported owner, the replacement phrase, and the step 4 output | PASS if step 1 finds the collision, step 2 names `scope-discipline.md`, and step 4 returns no match for the replacement; FAIL if the phrase is accepted or the replacement is never checked | 1. Confirm the search covered every rule file rather than the one being edited, since a collision is by definition somewhere else. 2. Check that the replacement was searched too. An unchecked replacement just moves the collision rather than resolving it. 3. If step 1 finds no match, verify the phrase spelling against the corpus before concluding it is free, since a near-miss spelling reads as unique and collides in practice |

### Commands

1. `bash: grep -rn '^  - "frozen scope"' repo-rules/`
2. `agent: Report the collision and name the owning rule`
3. `agent: Propose a replacement phrase that catches the same reader`
4. `bash: grep -rn '^  - "the replacement phrase"' repo-rules/`

### Expected

Step 1 returns exactly one match, in `scope-discipline.md`, which is the file that claims the phrase. The anchored pattern matters: an unanchored search for the same words returns nine matches across four files, only one of which is a trigger-phrase entry. Body prose is not a claim on the phrase. Step 2 reports the collision and names that file rather than reporting a generic conflict. Step 3 proposes an alternative phrased the way someone types it when they have the problem, not the way the section is titled. Step 4 returns no match, confirming the replacement is genuinely free across the whole set.

### Evidence

Capture the step 1 match including its file and line number, the reported owner, the proposed replacement, and the literal step 4 output. Both greps matter: the first proves the collision, the second proves the fix, and a run that captures only the first has verified half the scenario.

### Pass / Fail

- **Pass**: the collision is found, `scope-discipline.md` is named as the owner, the phrase is not added, and the replacement returns no match in step 4.
- **Fail**: the phrase is accepted, the owner is not named, or the replacement is proposed without being checked against the set.

### Failure Triage

1. Confirm the search covered all rule files. A collision lives in another file by definition, so a search scoped to the file being edited can never find one.
2. Confirm step 4 ran. An unchecked replacement moves the problem instead of fixing it, and the run will look successful.
3. If step 1 returns nothing, check the spelling against the corpus before concluding the phrase is free. A phrase that differs by a word reads as unique to a grep and still collides for a reader. If step 1 returns many matches across several files, the pattern lost its anchor and is matching body prose rather than trigger-phrase entries.

### Optional Supplemental Checks

Sweep the whole set for duplicates rather than checking one phrase, and confirm the total still shows zero collisions. That converts a single-phrase check into a standing property of the corpus.

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
| [`references/creation-standards.md`](../../references/creation-standards.md) | Primary implementation anchor, section 2 |
| [`references/rule-anatomy.md`](../../references/rule-anatomy.md) | The frontmatter schema carrying `trigger_phrases` |

---

## 5. SOURCE METADATA

- Group: RULE AUTHORING
- Playbook ID: RRA-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-authoring/trigger-phrase-collision.md`
