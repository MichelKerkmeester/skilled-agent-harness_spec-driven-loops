---
title: "FAST-001 -- LUNA priority-tier activation"
description: "This scenario validates LUNA priority-tier activation for `FAST-001`. It focuses on confirming that Fast Mode reports enabled and shows the indicator on the openai-codex/gpt-5.6-luna model."
stage: routing
version: 1.0.0.0
---

# FAST-001 -- LUNA priority-tier activation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-001`.

---

## 1. OVERVIEW

This scenario validates LUNA priority-tier activation for `FAST-001`. It focuses on confirming that Fast Mode reports enabled and shows the `fast` indicator when the active model is `openai-codex/gpt-5.6-luna`, a configured target.

### Why This Matters

LUNA is one of the three GPT-5.6 variants Fast Mode is meant to speed up. If the notification or indicator does not confirm activation on LUNA, the operator cannot trust that the priority tier is in effect for a real job.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm Fast Mode activates and is reported as active on LUNA.
- Real user request: `I'm about to kick off a big refactor on the Luna model. Turn fast mode on so it runs on the priority tier.`
- Prompt: `/fast on`
- Expected execution process: launch Pi on LUNA, enable Fast Mode, then send a normal coding request so a real provider call is made.
- Expected signals: the chat notification reads `Fast Mode enabled`, the right-aligned `fast` indicator is visible, and the follow-up request runs against LUNA.
- Desired user-visible outcome: a clear confirmation that Fast Mode is active for LUNA.
- Pass/fail: PASS if the notification is exactly `Fast Mode enabled` and the `fast` indicator is visible on a LUNA session; FAIL if the notification is missing, says `inactive`, or the indicator does not appear.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: activate Fast Mode for a LUNA session.
2. Keep the scenario local to one live Pi session.
3. Run the deterministic steps exactly as written.
4. Compare the notification and indicator against the desired outcome.
5. Record the notification text and whether the indicator appeared.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-001 | LUNA priority-tier activation | Verify Fast Mode activates on LUNA | `/fast on` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast on` -> 3. `pi> Refactor the auth module to use async/await` | Step 1: Pi starts on `openai-codex/gpt-5.6-luna`; Step 2: chat notification `Fast Mode enabled` (info) and the right-aligned `fast` indicator appears; Step 3: the request runs against LUNA | Notification text, indicator screenshot, and the active model label | PASS if the notification is exactly `Fast Mode enabled` and the indicator is visible; FAIL if it is missing, reads `inactive`, or no indicator appears | 1. Confirm the active model is `openai-codex/gpt-5.6-luna`. 2. Run `pi list` and confirm `extensions/pi-fast-mode-w-subagent-support` is loaded. 3. Read `.pi/pi-fast-mode-w-subagent-support-config.json` and confirm `enabled` is `true`. |

### Optional Supplemental Checks

For payload-level proof that `service_tier: "priority"` is injected, see `tests/payload-status.test.ts`, which asserts the mutation for configured targets.

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
- Playbook ID: FAST-001
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `model-activation/luna-priority-tier.md`
