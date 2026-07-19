---
title: Motion No-Card Fallback Scenario
description: Manual scenario verifying the exact motion no-procedure fallback line.
trigger_phrases:
  - "test motion no card fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_FALLBACK
expected_resources:
  - SKILL.md
---

**Exact prompt**

```text
motion: advise whether this transition should be faster or slower, and state whether a private procedure card applies before answering.
```

# MOTION-PROCCARD-002 | Motion No-Card Fallback

## 1. OVERVIEW

This scenario validates `Procedure applied: none - baseline motion workflow` for non-card motion advice.

## 2. SCENARIO CONTRACT

- Objective: Confirm motion states exact fallback and continues with restraint gate, temporal concern routing, and handoff.
- Real user request: `Should this transition feel faster or slower?`
- Prompt: `motion: advise whether this transition should be faster or slower, and state whether a private procedure card applies before answering.`
- Expected execution process: Read fallback line; confirm no card trigger; state exact fallback; answer using baseline motion workflow.
- Expected signals: Exact fallback line before advice; no card loaded.
- Desired user-visible outcome: Narrow motion advice without invented procedure support.
- Pass/fail: PASS if exact fallback appears; FAIL if omitted, wrong, or all cards loaded.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-PROCCARD-002 | Motion no-card fallback | Verify exact baseline fallback | `motion: advise whether this transition should be faster or slower, and state whether a private procedure card applies before answering.` | grep fallback in `SKILL.md` -> agent: run prompt -> inspect proof line | Exact fallback appears; baseline workflow continues | Transcript and response | PASS if exact fallback appears and no card selected; FAIL otherwise | 1. Re-read fallback line; 2. Remove state-feedback triggers; 3. Confirm baseline proof remains |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Exact no-card fallback line |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: MOTION-PROCCARD-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/no-card-fallback.md`
