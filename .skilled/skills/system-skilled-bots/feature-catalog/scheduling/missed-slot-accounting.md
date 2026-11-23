---
title: "Missed-slot accounting"
description: "Names the slot each scheduled fire stands for, classifies how late it ran and summarizes missed slots without running them."
trigger_phrases:
  - "missed-slot accounting"
  - "bot catch-up fire"
  - "skipped slots summary"
  - "scheduled fire lateness"
version: 1.0.0.0
---

# Missed-slot accounting

## 1. OVERVIEW

Names the slot each scheduled fire stands for, classifies how late it ran and summarizes missed slots without running them.

launchd merges every slot a sleeping host missed into one fire and never says which slot a fire stood for. Without accounting, a fire after a week asleep would read like an on-time one. Each scheduled fire therefore records its slot and lateness before anything is dispatched.

---

## 2. HOW IT WORKS

The slot lister reads only the translator's dictionaries, never a cron string, so it cannot drift from what is installed. Calendar keys are read as local wall-clock values. Across a daylight-saving change a wall-clock time that does not exist is not listed, and a repeated one is listed once, so the lister never invents or doubles a slot.

The fired slot is the latest slot at or before the fire, and every earlier slot after the previous fire is skipped. A fire with skipped slots is `catch-up`. Otherwise it is `on-time` within a grace window of half the schedule period, clamped to a floor and a ceiling, and `late` past it. Skipped slots are summarized with their count, first and last, plus the most recent ones up to the retention cap. They are never run, because a backfill would turn one wake-up into a burst of unattended runs.

The previous fire comes from one small record per schedule under the user-level state root. The fire writes its own record before dispatch, so even a fire that is held or refused is counted once and the next fire never lists it again. A fire held by an open needs-you item is recorded with the reason `held-needs-you`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-lister.ts` | Shared | Lists slots from translated dictionaries with the daylight-saving rule |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` | Shared | Grace window, lateness classes, skipped-slot summary and the per-schedule fire record |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/slot-lister.vitest.ts` | Vitest | Time zone guard, daylight-saving rule and lister-translator agreement |
| `.skilled/skills/system-skilled-bots/runtime/tests/slot-accounting.vitest.ts` | Vitest | Grace window, lateness classes and scheduled fires through the runner |

---

## 4. SOURCE METADATA

- Group: Scheduling
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scheduling/missed-slot-accounting.md`

Related references:
- [cron-translation.md](cron-translation.md) - the only source of the dictionaries the lister reads
- [launchd-installer.md](launchd-installer.md) - the job that produces each scheduled fire
