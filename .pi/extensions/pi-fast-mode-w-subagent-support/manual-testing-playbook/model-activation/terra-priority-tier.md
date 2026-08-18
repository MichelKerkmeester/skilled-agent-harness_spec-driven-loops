---
title: "FAST-002 -- TERRA priority-tier activation"
description: "This scenario validates TERRA priority-tier activation for `FAST-002`. It focuses on confirming that Fast Mode reports enabled and shows the indicator on the openai-codex/gpt-5.6-terra model."
stage: routing
version: 1.0.0.0
---

# FAST-002 -- TERRA priority-tier activation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-002`.

---

## 1. OVERVIEW

This scenario validates TERRA priority-tier activation for `FAST-002`. It focuses on confirming that Fast Mode reports enabled and shows the `fast` indicator when the active model is `openai-codex/gpt-5.6-terra`, a configured target.

### Why This Matters

TERRA is a configured Fast Mode target. Activation must be reported the same way on TERRA as on the other GPT-5.6 variants, so the operator can trust the priority tier regardless of which variant they picked.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm Fast Mode activates and is reported as active on TERRA.
- Real user request: `Switch me to Terra and turn fast mode on before I send the next batch of edits.`
- Prompt: `/fast on`
- Expected execution process: launch Pi on TERRA, enable Fast Mode, then send a normal request so a real provider call is made.
- Expected signals: the chat notification reads `Fast Mode enabled`, the `fast` indicator is visible, and the follow-up request runs against TERRA.
- Desired user-visible outcome: a clear confirmation that Fast Mode is active for TERRA.
- Pass/fail: PASS if the notification is exactly `Fast Mode enabled` and the `fast` indicator is visible on a TERRA session; FAIL if the notification is missing, says `inactive`, or the indicator does not appear.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: activate Fast Mode for a TERRA session.
2. Keep the scenario local to one live Pi session.
3. Run the deterministic steps exactly as written.
4. Compare the notification and indicator against the desired outcome.
5. Record the notification text and whether the indicator appeared.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-002 | TERRA priority-tier activation | Verify Fast Mode activates on TERRA | `/fast on` | 1. `bash: pi --model openai-codex/gpt-5.6-terra` -> 2. `pi> /fast on` -> 3. `pi> Summarize the changes in the last commit` | Step 1: Pi starts on `openai-codex/gpt-5.6-terra`; Step 2: chat notification `Fast Mode enabled` (info) and the `fast` indicator appears; Step 3: the request runs against TERRA | Notification text, indicator screenshot, and the active model label | PASS if the notification is exactly `Fast Mode enabled` and the indicator is visible; FAIL if it is missing, reads `inactive`, or no indicator appears | 1. Confirm the active model is `openai-codex/gpt-5.6-terra`. 2. Run `pi list` and confirm the extension is loaded. 3. Read `.pi/pi-fast-mode-w-subagent-support-config.json` and confirm `enabled` is `true`. |

### Optional Supplemental Checks

For payload-level proof of the `service_tier: "priority"` injection, see `tests/payload-status.test.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/index.ts` | Command handler that toggles state and posts the notification |
| `../../src/payload.ts` | Target matching and `service_tier` injection |
| `../../tests/payload-status.test.ts` | Regression anchor for the payload mutation |

---

## 5. SOURCE METADATA

- Group: Model Activation
- Playbook ID: FAST-002
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `model-activation/terra-priority-tier.md`
