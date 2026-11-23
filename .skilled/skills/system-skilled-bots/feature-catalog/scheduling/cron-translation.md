---
title: "Cron translation"
description: "Turns a cron expression into launchd calendar dictionaries that fire exactly as cron would, or refuses it with a named invariant id."
trigger_phrases:
  - "cron translation"
  - "cron to launchd"
  - "StartCalendarInterval"
  - "cron refusal id"
version: 1.0.0.0
---

# Cron translation (translateCron)

## 1. OVERVIEW

Turns a cron expression into launchd calendar dictionaries that fire exactly as cron would, or refuses it with a named invariant id.

launchd takes calendar dictionaries with one integer per key, and an author writes cron. A translation that fires on a superset or a subset of cron's days would run an unattended agent at the wrong time, so the translator either matches cron exactly or refuses. It is the only cron reader in the hub: the checker, the installer and the slot lister all read its output.

---

## 2. HOW IT WORKS

An every-minute schedule becomes `StartInterval 60`. Any other five-field expression expands each field to its sorted values and emits the cross product as `StartCalendarInterval` dictionaries in a fixed order (month, day, weekday, hour, minute, each ascending), so one string always yields one list. A field that covers every value is left out of the dictionary, which launchd reads as a wildcard. The product is capped, and an expression that would need more dictionaries than the cap is refused as `cron-over-cap` with a hint to split it.

Each refusal carries an id from one shared list: an empty or malformed expression, a wrong field count, an out-of-range value, a `%` stdin marker, an unknown macro, `@reboot` (launchd's load-time run also fires on every load) and a power-condition macro with no calendar form. When both day fields are restricted but one is written with a star, cron and launchd disagree on whether both must match, so that form is refused as `cron-day-fields-and`.

A schedule that restricts only one of the two day fields, such as `0 9 * * 1-5` or `@weekly`, is refused today as `cron-single-day-field-unverified`. launchd documents a missing key as a wildcard but never states how a lone Weekday or Day key behaves, and no fire log has confirmed it. The rule is one constant in the translator, so the form can be admitted once a fire log confirms it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts` | Shared | Cron parser, translator, dictionary cap and the shared refusal id list |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts` | Vitest | Field expansion, day-field rules, the weekday example and every refusal |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/cron-untranslatable` | Fixture | A definition whose cron the checker must report under the translator's id |

---

## 4. SOURCE METADATA

- Group: Scheduling
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scheduling/cron-translation.md`

Related references:
- [launchd-installer.md](launchd-installer.md) - writes the translated dictionaries into a job file
- [missed-slot-accounting.md](missed-slot-accounting.md) - lists slots from the same dictionaries
