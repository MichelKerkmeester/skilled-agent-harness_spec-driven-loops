---
title: "bots-schedule"
description: "Schedule mode of system-skilled-bots: install or remove a cron bot's launchd schedule, and enable, disable, pause or resume a bot."
version: 1.0.0.0
---

# bots-schedule

> The schedule mode of `system-skilled-bots`. It installs a cron bot's launchd schedule held disabled, lifts or sets the holds on a bot, and removes a schedule, all through `.skilled/bin/bots.cjs`.

---

## 1. OVERVIEW

The schedule mode decides when a bot may fire. A cron bot runs from a launchd agent that only the installer writes, and a first install is always held disabled, so nothing fires until the operator lifts the hold. The table names what it covers and what it hands to the sibling modes.

| Aspect | What it gives you |
|---|---|
| **Use it for** | A request to put a cron bot on its schedule, or to install the queue-drain job. A request to enable, disable, pause or resume a bot. A request to remove a bot's schedule |
| **Command** | `/bots:schedule` |
| **Tools** | Read, Bash, Grep, Glob. Bash runs only the `bots.cjs` schedule verbs |
| **Hands off** | Running a bot, which the run mode owns. Reading whether a schedule is installed, which the status mode owns |

Every schedule request reaches this mode through the hub's `schedule` signal, or through `/bots:schedule`. The mode holds no routing logic of its own, and its `ROUTER.md` selects the one lifecycle reference it loads.

---

## 2. VERBS

Each verb takes `--repo <path>` for the consumer checkout.

```text
bots schedule install <id> --repo <path>
bots enable <id> --repo <path>
bots disable <id> --repo <path>
bots pause <id> --repo <path>
bots resume <id> --repo <path>
bots schedule uninstall <id> --repo <path>
```

`bots schedule install` installs a cron bot's schedule held disabled. The id `drain` installs the repository's queue-drain job. `bots enable` lifts a disable and rechecks an installed schedule. `bots disable` stops every run of a bot until it is enabled. `bots pause` and `bots resume` hold and release a bot's runs after the lease. `bots schedule uninstall` removes a schedule and sweeps this repository's orphaned ones.

---

## 3. SAFETY

Installing writes a launchd agent into the user's `~/Library/LaunchAgents` and loads it. Confirm the bot id and the repository before an install, and never write a plist or call launchctl by hand, because only the installer does that. Never enable a schedule the operator has not asked to enable.

After any verb, read `bots status` and report the bot's row. An install whose recorded runner path no longer resolves shows as needing reinstall, and that row is the signal to escalate rather than retry.

---

## 4. HOW TO USE

1. Confirm the bot id and the repository.
2. Run the one verb the request names, with `--repo <path>`.
3. Read `bots status` afterwards and report the bot's row.
4. Name the next step: a first install needs `bots enable` before anything fires.

---

## 5. RELATED

- [`SKILL.md`](./SKILL.md): the schedule workflow, its rules and its success criteria.
- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/schedule-lifecycle.md`](./references/schedule-lifecycle.md): the schedule verbs and their contract.
- [`../README.md`](../README.md): the hub overview with all four modes.
- [`../mode-registry.json`](../mode-registry.json): the packet registration this mode resolves through.

---

## 6. FILES

- `SKILL.md`: the schedule workflow, its rules and its success criteria.
- `ROUTER.md`: the packet machine router.
- `references/schedule-lifecycle.md`: the schedule verbs and their contract.
- `changelog/`: release notes for this packet.

---

## 7. VERIFICATION

The hub's structural gate verifies the packet's shape:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

The run passes when it ends with `OK: parent-skill-check`. A routing replay with a real schedule request confirms the hub selects this mode, because the structural gate asserts presence and never reachability.
