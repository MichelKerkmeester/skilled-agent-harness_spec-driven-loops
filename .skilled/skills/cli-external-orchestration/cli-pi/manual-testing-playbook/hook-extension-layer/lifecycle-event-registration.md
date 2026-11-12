---
title: "PI-015 -- Lifecycle event registration"
description: "This scenario checks the real Pi extension event set and records accepted registration for the bridged `tool_call`, `tool_result`, and `input` handlers; live handler-firing is SKIP only when no authenticated provider credential is available to trigger a real tool call, for `PI-015`."
version: 1.5.1.0
---

# PI-015 -- Lifecycle event registration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-015`.

---

## 1. OVERVIEW

This scenario distinguishes type-confirmed event names, registration accepted by a live Pi startup, and an actual handler invocation caused by a real tool call.

### Why This Matters

Registering a callback without a runtime error proves the loader accepted the event name. It does not prove the callback body fired, so those evidence classes must not be collapsed.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the extension API's event taxonomy and accepted registration for the event handlers used by the twenty-two adapters.
- Real user request: `Check which lifecycle events Pi exposes, then confirm these local extensions register against them without crashing.`
- Prompt: `Start Pi with the local extensions. The check is for extension registration; do not claim a handler fired unless a real event is observed.`
- Expected execution process: Read the installed extension declarations -> count the named event set -> inspect the bridge registrations -> run the Pi startup -> distinguish accepted registration from actual event firing.
- Expected signals: The installed declaration file exposes 33 named events; local adapters register twelve event names (`agent_end`, `agent_settled`, `agent_start`, `before_agent_start`, `input`, `message_end`, `session_compact`, `session_shutdown`, `session_start`, `tool_call`, `tool_result`, `turn_end`); startup completes without registration error.
- Desired user-visible outcome: A precise registration result and an explicit boundary around event firing.
- Pass/fail: PASS for the registration-accepted check. The handler-fires-on-a-real-event sub-check is owned by `PI-020`, which live-traced it with an authenticated provider. FAIL if Pi rejects an event registration or a documented event cannot load.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the installed `types.d.ts` event declaration and record the count.
2. Read each local `pi.on(...)` registration.
3. Run the isolated startup with all 22 extensions.
4. Do not infer callback execution from absence of a startup error.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-015 | Lifecycle event registration | Confirm event registration and separate it from event firing | `Start Pi with the local extensions. The check is for extension registration; do not claim a handler fired unless a real event is observed.` | `( cd .pi/extensions && for f in *.ts; do t=$(sed -n "s/.*from '\(.*\)';.*/\1/p" "$f"); rg -o "(pi|\))\.on\(\s*[\"'][a-z_]+" "$t" | sed "s/.*[\"']//"; done | sort | uniq -c )` -> read the installed Pi `types.d.ts` event union -> `pi --offline --approve -p "list your available tools" </dev/null` | Registrations for `agent_end` (2), `agent_settled` (1), `agent_start` (1), `before_agent_start` (1), `input` (4), `message_end` (1), `session_compact` (3), `session_shutdown` (1), `session_start` (4), `tool_call` (8), `tool_result` (6), and `turn_end` (3), 35 handlers in total; no registration error | Captured registrations show exactly that twelve-event, 35-handler set across the 22 adapters. The installed declaration read records 33 named `on(...)` overloads (one more than the earlier 32-event capture; the installed package moved). Live startup exits 0 with no registration error. | PASS for registration accepted. Real handler firing is live-traced in `PI-020`. FAIL if registration itself errors. | Inspect the exact event spelling against `types.d.ts`, then use `PI-020`'s probe method to verify handler body execution rather than retrying blind. |

### Optional Supplemental Checks

- Use a harmless read-only tool call in a disposable project and capture both the event name and handler-side output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Registration-versus-firing evidence rule |
| `../../SKILL.md` | Extension routing and provider boundary |
| `../../references/native-skills-and-extensions.md` | Event registration confidence labels |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/*.ts` | Entry files that resolve to the adapters holding the actual event registrations |
| `@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts` | Installed event and factory declarations |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/lifecycle-event-registration.md`
