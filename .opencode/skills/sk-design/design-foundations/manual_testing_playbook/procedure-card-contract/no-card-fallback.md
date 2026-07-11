---
title: Foundations No-Card Fallback Scenario
description: Manual scenario verifying the exact foundations no-procedure fallback line.
trigger_phrases:
  - "test foundations no card fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_FALLBACK
expected_resources:
  - SKILL.md
---

**Exact prompt**

```text
foundations: answer this narrow semantic-token naming question and state whether a private procedure card applies before answering.
```

# FOUND-PROCCARD-002 | Foundations No-Card Fallback

## 1. OVERVIEW

This scenario validates the exact fallback line `Procedure applied: none - baseline foundations workflow`.

## 2. SCENARIO CONTRACT

- Objective: Confirm foundations does not invent or bulk-load procedure cards when no card row matches.
- Real user request: `Should this existing token be named surface-muted or neutral-muted?`
- Prompt: `foundations: answer this narrow semantic-token naming question and state whether a private procedure card applies before answering.`
- Expected execution process: Read `SKILL.md`; confirm no procedure trigger; state the exact fallback; continue with static-system workflow.
- Expected signals: Exact fallback line appears before advice; no procedure file is selected.
- Desired user-visible outcome: Narrow foundations advice with explicit no-card fallback.
- Pass/fail: PASS if exact fallback appears and no procedure card is loaded; FAIL if a private card is invented or all cards are loaded.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-PROCCARD-002 | Foundations no-card fallback | Verify exact baseline fallback | `foundations: answer this narrow semantic-token naming question and state whether a private procedure card applies before answering.` | grep fallback in `SKILL.md` -> agent: run exact prompt -> inspect first proof line | Exact fallback appears; static-system workflow continues; no procedure card selected | Transcript and response proof line | PASS if exact fallback appears with no card; FAIL if omitted or wrong | 1. Re-read fallback line; 2. Remove card-trigger vocabulary; 3. Confirm static-system workflow still applies |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Exact no-card fallback line |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: FOUND-PROCCARD-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/no-card-fallback.md`
