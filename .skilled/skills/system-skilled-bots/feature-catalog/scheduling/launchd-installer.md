---
title: "launchd installer"
description: "Installs a cron bot or the queue-drain job as a launchd agent through one preflighted transaction, held disabled on first install."
trigger_phrases:
  - "launchd installer"
  - "bots schedule install"
  - "install a bot schedule"
  - "/bots:schedule"
version: 1.0.0.0
---

# launchd installer (bots schedule install)

## 1. OVERVIEW

Installs a cron bot or the queue-drain job as a launchd agent through one preflighted transaction, held disabled on first install.

The installer is the one module that writes a job file into `~/Library/LaunchAgents` or calls `launchctl`. A schedule is the moment an unattended agent gains a trigger, so every install reruns its preflight and refuses before it writes anything. The schedule mode drives it through `bots schedule install`, `bots schedule uninstall`, `bots enable` and `bots disable`.

---

## 2. HOW IT WORKS

### Preflight And Transaction

Every install checks the runner, the stop switches, the repository identity, the registered-roots file, the definition checker and the bot's posture first. A registered-roots file that does not read is refused as `registered-roots-unreadable` before anything is written, because the transaction registers the checkout only after the job is in place. The write is one transaction: render the job to a private temp file, lint it, boot out the old job, move the file into place, bootstrap, print and read back. Every path in a rendered job is absolute and resolved at install time, the interpreter included, because launchd starts a job with a bare `PATH` and no home expansion.

### Held First Install

A first install is held disabled through launchd's own disable override, set before the job file lands, so a login that loads every file in the folder still skips it. The install record says whether a hold came from a first install, from the definition or from an operator, because launchd's disabled list shows them the same way. `bots enable` rechecks the schedule and lifts the hold, and no path uses the `load` subcommand, whose flags can override or ignore a disable.

### Labels And Job Environment

A label carries the repository identity, the bot id and the schedule index under the `com.skilled.bots.` prefix, and it parses back so status and the uninstall sweep can tell whose job a file is. The id `drain` is reserved for the one queue-drain job per identity, which watches the request inbox, throttles its fires and backs off after repeated failures. The job environment is built in one place, and an install refuses when the installing shell and that environment would resolve a different identity or state root. Every job pins the state root in `SKILLED_BOTS_STATE_ROOT` and the identity in `SKILLED_BOTS_IDENTITY`. Both outrank `bots/config.json`, which a run could edit, and the read-back checks that the installed file carries them. A bot job also sets `SKILLED_BOTS_SCHEDULED_FIRE=1`, the marker without which `bots run --schedule-index` exits 2. A job file installed before these values existed exits 2 when it fires, and `bots schedule install <id>` rewrites it.

### Approval

An install approves the exact `BOT.md` bytes its preflight vetted and the current `bots/config.json`. `bots enable` approves the files as they are now, and for a bot with no installed schedule it only writes that approval and lifts the disable switch, so the bot's queued requests may run.

### Install Records And Uninstall

Each install writes a record under the user-level state root naming what the job runs, the real path it resolved to, the kind of `.skilled` tree and a vendored tree's pin. A read-only check compares each record with the tree as it is now and names a reinstall reason such as a missing or retargeted runner, a changed kind or pin and a changed identity or state root. `bots schedule uninstall` removes a schedule and sweeps this identity's orphaned jobs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Shared | Preflight, install transaction, hold, enable, disable, uninstall sweep, install records and the drain job |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Shared | Renders bot and drain job files with absolute paths, the pinned values and the fire marker, and reads a schedule and the pins back |
| `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts` | Shared | The approval install and enable write |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Shared | Label grammar, the reserved drain id and label parsing |
| `.skilled/bin/bots.cjs` | Handler | The `schedule`, `enable` and `disable` verbs |
| `.skilled/commands/bots/schedule.md` | Handler | The `/bots:schedule` command router |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Vitest | Install transaction, disabled default, preflight refusals with `registered-roots-unreadable`, pinned state root and identity and the approval install and enable write |
| `.skilled/skills/system-skilled-bots/runtime/tests/label.vitest.ts` | Vitest | Bot labels, drain labels and foreign labels |
| `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` | Reference | The schedule lifecycle verbs and their safety notes |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/schedule-weekday-bot.md` | Manual playbook | Routes a schedule request to the schedule mode |

---

## 4. SOURCE METADATA

- Group: Scheduling
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scheduling/launchd-installer.md`

Related references:
- [cron-translation.md](cron-translation.md) - the dictionaries a job file carries
- [missed-slot-accounting.md](missed-slot-accounting.md) - what a scheduled fire records before it runs
