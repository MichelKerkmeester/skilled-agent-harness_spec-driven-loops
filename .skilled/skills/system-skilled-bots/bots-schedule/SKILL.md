---
name: bots-schedule
description: "Schedule mode of system-skilled-bots: install or remove a cron bot's launchd schedule, and enable, disable, pause or resume a bot."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
---

# Bots Schedule

The schedule mode of the `system-skilled-bots` hub. It installs a cron bot's launchd schedule held disabled, lifts or sets the holds on a bot, and removes a schedule, all through `.skilled/bin/bots.cjs`.

---

## 1. WHEN TO USE

Use this packet when the `system-skilled-bots` hub selects the `schedule` mode, or when `/bots:schedule` names it.

- A request to put a cron bot on its schedule, or to install the queue-drain job.
- A request to enable, disable, pause or resume a bot.
- A request to remove a bot's schedule.

### When NOT to Use

- Running a bot once. The run mode owns that.
- Reading whether a schedule is installed. The status mode owns that.

Do not invoke this packet as a separate advisor identity. Routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves this packet through `mode-registry.json`: `hub-router.json` scores the
request, the winning `workflowMode` names this packet, and the hub loads this `SKILL.md` first.

The hub's root `ROUTER.md` stops at the packet: it names this packet and its first leaves, and the
packet's own `ROUTER.md` maps the intents that pick among the material this folder holds. That file,
not the hub router, is where a packet-local resource selection is decided.

A request that matches no registered intent returns `UNKNOWN_FALLBACK`, never a silent default.
That fallback asks for disambiguation instead of guessing a verb.
The machine router, its intent signals and its resource map live in
[`ROUTER.md`](./ROUTER.md). Read that file before loading a packet-local resource.

---

## 3. HOW IT WORKS

1. Confirm the bot id and the repository.
2. Run the one verb the request names, with `--repo <path>`: `bots schedule install <id>`, `bots enable <id>`, `bots disable <id>`, `bots pause <id>`, `bots resume <id>` or `bots schedule uninstall <id>`.
3. Read `bots status` afterwards and report the bot's row.

---

## 4. RULES

### ALWAYS

- Say that a first install is held disabled until `bots enable`.
- Confirm before an install, because it writes and loads a launchd agent.

### NEVER

- Never write a plist or call launchctl by hand. Only the installer does.
- Never enable a schedule the operator has not asked to enable.

### ESCALATE IF

- An install is refused because the repository identity is unknown.
- Status reports the schedule as needing reinstall.

---

## 5. REFERENCES

- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/schedule-lifecycle.md`](./references/schedule-lifecycle.md): the schedule verbs and their contract.
- [`README.md`](./README.md): packet overview.
- `../mode-registry.json`: authoritative packet registration.
- `../hub-router.json`: parent routing policy.

---

## 6. SUCCESS CRITERIA

- The verb ran once and the bot's status row shows the expected state.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `system-skilled-bots` hub, or `/bots:schedule`.
- Output: the verified schedule result, with the command run and its exit status.
