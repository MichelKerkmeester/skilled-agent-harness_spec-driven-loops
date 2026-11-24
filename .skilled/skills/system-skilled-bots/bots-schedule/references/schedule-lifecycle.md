---
title: "Bot Schedules: Install, Enable, Pause and Uninstall"
description: "How a cron bot's launchd schedule is installed held disabled, enabled, paused, resumed and removed through the bots CLI."
trigger_phrases:
  - "schedule a bot"
  - "pause the bot"
  - "bot schedule lifecycle"
importance_tier: normal
contextType: reference
version: 1.0.2.0
---

# Bot Schedules: Install, Enable, Pause and Uninstall

A cron bot runs from a launchd agent that only the installer writes. This reference names the verbs that install, hold and remove it.

---

## 1. OVERVIEW

### Purpose

Give the schedule mode the lifecycle of a scheduled bot, from a held install to its removal, so no schedule fires before the operator lifts the hold.

### When to Use

- Installing a cron bot's schedule, or the repository's queue-drain job.
- Enabling, disabling, pausing or resuming a bot.
- Removing a schedule and sweeping orphaned ones.

---

## 2. LIFECYCLE

| Verb | Does |
|------|------|
| `bots schedule install <id>` | Installs a cron bot's schedule, held disabled until `bots enable`, and approves the bot's current `BOT.md` and `bots/config.json` for its unattended runs. The id `drain` installs this repository's queue-drain job |
| `bots enable <id>` | Lifts a disable and approves the bot's current `BOT.md` and `bots/config.json`, with or without a schedule. For an installed schedule it rechecks the schedule and lets it fire |
| `bots disable <id>` | Stops every run of a bot until enabled, and its installed schedule |
| `bots pause <id>` | Holds a bot's runs after the lease until resumed |
| `bots resume <id>` | Lifts a pause. It is not the resume of a parked run, which `bots answer` queues |
| `bots schedule uninstall <id>` | Removes a schedule and sweeps this repository's orphaned ones |

Each verb takes `--repo <path>` for the consumer checkout.

---

## 3. SAFETY

Installing writes a launchd agent into the user's `~/Library/LaunchAgents` and loads it. A first install is always held disabled, so nothing fires until `bots enable`. Confirm the bot id and the repository before installing, and read `bots status` afterwards: an install whose recorded runner path no longer resolves shows as needing reinstall.

A scheduled or queued run uses only the `BOT.md` and `bots/config.json` an operator approved. After either file changes it is refused as `definition-drifted` until the change is reviewed and approved again with `bots enable <id>` or a hand-typed `bots run <id>`. Enabling therefore approves whatever the files say now, so read them first.

Every job file pins the state root and identity it was installed under, and a bot's job file carries the marker that lets it pass `--schedule-index`. A job file installed before those values existed exits 2 at every fire. Run `bots schedule install <id>` again to rewrite it.
