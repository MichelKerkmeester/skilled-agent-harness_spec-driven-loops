---
title: "Stop switches"
description: "Disables or pauses a bot through switch files under the user-level state root that no run can reach."
trigger_phrases:
  - "stop switches"
  - "pause the bot"
  - "disable a bot"
  - "bots enable"
version: 1.0.0.0
---

# Stop switches (bots disable, bots pause)

## 1. OVERVIEW

Disables or pauses a bot through switch files under the user-level state root that no run can reach.

A bot run may write its checkout, so a stop kept there could be cleared by the run it is meant to stop. The switches live outside every checkout, one file per bot and kind, and the schedule mode sets and clears them.

---

## 2. HOW IT WORKS

`bots disable <id>` stops every run of a bot until `bots enable <id>`, and for an installed schedule it also holds the launchd job. The runner reads the disable switch before the lease. `bots pause <id>` is read after the lease, so a paused run still shows who asked, and `bots resume <id>` lifts it. That resume is a switch verb and not the continuation of a parked run, which `bots answer` queues.

A disabled or paused run is refused before dispatch with a record and no notice. A queued request for a paused bot is quarantined and is not replayed when the pause lifts. A switch file records when it was set, so status can report it. A damaged switch file reads as set, the same fail-closed rule the needs-you hold uses, and an unreadable switch stops an install. A child that tampers with everything under its checkout still cannot reach a switch.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | Shared | Switch paths, set, clear and read for disable and pause |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Shared | Enable and disable of an installed schedule |
| `.skilled/bin/bots.cjs` | Handler | The `enable`, `disable`, `pause` and `resume` verbs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/switches.vitest.ts` | Vitest | Setting, clearing and reading switches, a damaged file read as set |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Vitest | Disabled and paused refusals and switches out of a tampering child's reach |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Vitest | A reinstall stops at a kill switch and unreadable switches are refused |

---

## 4. SOURCE METADATA

- Group: Operator loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operator-loop/stop-switches.md`

Related references:
- [run-delivery.md](run-delivery.md) - why a switched-off run sends no notice
- [../scheduling/launchd-installer.md](../scheduling/launchd-installer.md) - the job a disable also holds
