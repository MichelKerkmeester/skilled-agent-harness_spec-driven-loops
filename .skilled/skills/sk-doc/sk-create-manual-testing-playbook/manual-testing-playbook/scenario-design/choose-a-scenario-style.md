---
title: "MTP-008 -- Choose a scenario style"
description: "This scenario validates the scenario-style choice for `MTP-008`. It focuses on the four ordered questions and the single-prompt or conversation style each check needs."
version: 1.0.0.0
---

# MTP-008 -- Choose a scenario style

This document captures the operator contract for `MTP-008`.

---

## 1. OVERVIEW

This scenario validates the Choosing the Scenario Style section of the manual testing playbook authoring mode. It checks that an author applies the four ordered questions to each check, stops at the first yes and names the question that decided the style.

### Why This Matters

The style choice decides how a scenario runs: one prompt the operator reads, or a conversation the shared runner plays. An author who picks a style by feel writes a conversation for a check one exchange settles, or a single prompt for state that must survive a restart. The questions exist so the style follows from the behavior, and the named question number is what makes the choice reviewable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-008` and compare every expected signal with the answers the mode returns.

- Objective: pick the scenario style for three checks and name the question that decides each one
- Realistic user request: `Pick the scenario style for each of these three checks and name the question that decides it: the router sends a playbook request to the playbook mode; the runtime asks which colour I want, I answer, and the answer is still saved after a restart; a generated README reads clearly to a new user.`
- Prompt: `Pick the scenario style for each of these three checks and name the question that decides it: the router sends a playbook request to the playbook mode; the runtime asks which colour I want, I answer, and the answer is still saved after a restart; a generated README reads clearly to a new user.`
- Expected execution process: read the Choosing the Scenario Style section, apply the four questions in order to each check and stop at the first yes, then return the three styles with their deciding question numbers. Use SKIP only when a named sandbox or runtime blocker prevents the check.
- Expected signals: the router check is a single prompt, decided by question 4, because it needs one exchange and no runtime list was given. The colour check is a conversation, decided by question 2, because it needs a question asked back and a restart. The README check is a single prompt, decided by question 1, because a person must judge whether it reads clearly.
- Desired user-visible outcome: three styles, each with the number of the question that decided it, and the reason the earlier questions did not decide it.
- Pass/fail: PASS when all three styles and deciding question numbers match. FAIL when any style or question number differs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Pick the scenario style for each of these three checks and name the question that decides it: the router sends a playbook request to the playbook mode; the runtime asks which colour I want, I answer, and the answer is still saved after a restart; a generated README reads clearly to a new user.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-008 | Choose a scenario style | Pick the style and the deciding question for three checks | `Pick the scenario style for each of these three checks and name the question that decides it: the router sends a playbook request to the playbook mode; the runtime asks which colour I want, I answer, and the answer is still saved after a restart; a generated README reads clearly to a new user.` | 1. `agent: Read the Choosing the Scenario Style section of .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` -> 2. `agent: Apply the four questions in order to the router check and stop at the first yes` -> 3. `agent: Apply the four questions in order to the colour-answer-restart check and stop at the first yes` -> 4. `agent: Apply the four questions in order to the README-readability check and stop at the first yes` -> 5. `agent: Return the three styles with their deciding question numbers` | Step 1: the four questions and their order are named. Step 2: the router check is a single prompt, decided by question 4, for one exchange and no runtime list. Step 3: the colour check is a conversation, decided by question 2, for the question asked back and the restart. Step 4: the README check is a single prompt, decided by question 1, for the judgment a person makes. Step 5: all three styles and question numbers are returned | The exact prompt, the four questions in order, the first yes reached for each check, the returned styles with their question numbers and the final verdict with its reason | PASS when all three styles and deciding question numbers match. FAIL when any style or question number differs. SKIP only with a named sandbox or runtime blocker | 1. Re-read the section and name the question that was misapplied. 2. Check the questions were applied in order and stopped at the first yes. 3. Re-apply the questions per check and record each deciding number before rerunning the request |

### Commands

1. `agent: Read the Choosing the Scenario Style section of .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
2. `agent: Apply the four questions in order to the router check and stop at the first yes`
3. `agent: Apply the four questions in order to the colour-answer-restart check and stop at the first yes`
4. `agent: Apply the four questions in order to the README-readability check and stop at the first yes`
5. `agent: Return the three styles with their deciding question numbers`

### Expected

Step 1 names the four questions and their order. Step 2 records a single prompt decided by question 4, because the router check needs one exchange and no runtime list was given. Step 3 records a conversation decided by question 2, because the runtime asks a question back and the answer must survive a restart. Step 4 records a single prompt decided by question 1, because a person must judge whether the README reads clearly. Step 5 returns the three styles with their question numbers and a reason for each.

### Evidence

Capture the exact prompt, the four questions in order, the first yes reached for each of the three checks, the styles and question numbers the mode returned, and the final verdict with its reason.

### Pass / Fail

- **Pass**: all three styles and deciding question numbers match. The router check is a single prompt decided by question 4, the colour check is a conversation decided by question 2 and the README check is a single prompt decided by question 1.
- **Fail**: any style or question number differs, a check names a question the earlier ones already answered, or the questions are applied out of order.

### Failure Triage

1. Re-read the section and name the question that was misapplied.
2. Check that the questions were applied in order and stopped at the first yes.
3. Re-apply the questions per check and record each deciding number before rerunning the request.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | The Choosing the Scenario Style section and its four ordered questions |
| [`assets/manual-testing-playbook-snippet-template.md`](../../assets/manual-testing-playbook-snippet-template.md) | Single-prompt scenario structure |
| [`assets/manual-testing-playbook-conversation-snippet-template.md`](../../assets/manual-testing-playbook-conversation-snippet-template.md) | Conversation script placement |
| [`references/conversation-scenarios.md`](../../references/conversation-scenarios.md) | Conversation block schema used by the conversation style |

---

## 5. SOURCE METADATA

- Group: SCENARIO DESIGN
- Playbook ID: MTP-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scenario-design/choose-a-scenario-style.md`
