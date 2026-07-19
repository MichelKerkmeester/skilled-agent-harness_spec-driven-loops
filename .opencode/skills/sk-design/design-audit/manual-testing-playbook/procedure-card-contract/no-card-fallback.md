---
title: Audit No-Card Fallback Scenario
description: Manual scenario verifying the exact audit no-procedure fallback line.
trigger_phrases:
  - "test audit no card fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_FALLBACK
expected_resources:
  - SKILL.md
---

# AUDIT-PROCCARD-002 | Audit No-Card Fallback

**Exact prompt**

```text
audit: answer whether this already-reviewed finding should remain P2 or P3, and state whether a private procedure card applies before answering.
```

## 1. OVERVIEW

This scenario validates `Procedure applied: none - baseline audit workflow` for audit questions that do not match accessibility, AI-slop, or full polish procedure triggers.

## 2. SCENARIO CONTRACT

- Objective: Confirm audit states the exact no-card fallback and continues with audit contract, five-dimension score, and findings-first behavior where relevant.
- Real user request: `Decide whether a reviewed finding is P2 or P3 without running a new audit pass.`
- Prompt: `audit: answer whether this already-reviewed finding should remain P2 or P3, and state whether a private procedure card applies before answering.`
- Expected execution process: Read fallback line; confirm no procedure trigger; state exact fallback; answer using baseline audit workflow and evidence labels.
- Expected signals: Exact fallback line appears before advice; no procedure file is selected or bulk-loaded.
- Desired user-visible outcome: Evidence-labeled severity advice without invented card support.
- Pass/fail: PASS if exact fallback appears and no procedure card is loaded; FAIL if a card is invented or the fallback is omitted.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AUDIT-PROCCARD-002 | Audit no-card fallback | Verify exact baseline fallback | `audit: answer whether this already-reviewed finding should remain P2 or P3, and state whether a private procedure card applies before answering.` | grep fallback in `SKILL.md` -> agent: run prompt -> inspect proof line | Exact fallback appears; baseline audit workflow continues | Transcript and response | PASS if exact fallback appears and no card selected; FAIL otherwise | 1. Re-read fallback line; 2. Remove card-trigger vocabulary; 3. Confirm evidence labels remain |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Exact no-card fallback line |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: AUDIT-PROCCARD-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/no-card-fallback.md`
