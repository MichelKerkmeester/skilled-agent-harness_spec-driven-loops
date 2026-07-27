---
title: "PI-015 -- Lifecycle event registration"
description: "This scenario checks the real Pi extension event set and records accepted registration for the bridged `tool_call`, `tool_result`, and `input` handlers, with event firing left SKIP for `PI-015`."
version: 1.0.0.0
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

- Objective: Confirm the extension API's event taxonomy and accepted registration for the event handlers used by the seven bridges.
- Real user request: `Check which lifecycle events Pi exposes, then confirm these local extensions register against them without crashing.`
- Prompt: `Start Pi with the local extensions and report the provider blocker if no model turn starts. The check is for extension registration; do not claim a handler fired unless a real event is observed.`
- Expected execution process: Read the installed extension declarations -> count the named event set -> inspect the bridge registrations -> run the isolated Pi startup -> distinguish accepted registration from actual event firing.
- Expected signals: The installed declaration file exposes 32 named events; local files register `tool_call`, `tool_result`, and `input`; startup reaches the provider gate without registration error.
- Desired user-visible outcome: A precise registration result and an explicit boundary around event firing.
- Pass/fail: PASS for the registration-accepted check. SKIP the handler-fires-on-a-real-event sub-check with blocker `provider credentials are absent on this machine`. FAIL if Pi rejects an event registration or a documented event cannot load.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the installed `types.d.ts` event declaration and record the count.
2. Read each local `pi.on(...)` registration.
3. Run the isolated startup with all seven extensions.
4. Do not infer callback execution from absence of a startup error.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-015 | Lifecycle event registration | Confirm event registration and separate it from event firing | `Start Pi with the local extensions and report the provider blocker if no model turn starts. The check is for extension registration; do not claim a handler fired unless a real event is observed.` | `rg -n 'pi\.on\("(tool_call|tool_result|input)"' .pi/extensions` -> read the installed Pi `types.d.ts` event union -> copy extensions into an isolated fixture -> `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "list your available tools" </dev/null` | Registrations for `tool_call`, `tool_result`, and `input`; no registration error; actual handler firing requires a real tool event | Captured registrations show `tool_call`, `tool_result`, and `input`. The installed declaration read records 32 named events. Isolated live output is `No API key found for the selected model.` with `probe_rc=1`; no registration error appears. | PASS for registration accepted. SKIP real handler firing with blocker `provider credentials are absent on this machine`. FAIL if registration itself errors. | Inspect the exact event spelling against `types.d.ts`, then use a credentialed tool call to verify handler body execution rather than retrying blind. |

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
| `.pi/extensions/*.ts` | Actual event registrations |
| `@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts` | Installed event and factory declarations |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/lifecycle-event-registration.md`
