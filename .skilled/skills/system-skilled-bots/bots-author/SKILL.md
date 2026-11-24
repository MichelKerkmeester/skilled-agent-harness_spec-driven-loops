---
name: bots-author
description: "Author mode of system-skilled-bots: write or edit a BOT.md from the shipped template. /doctor:bots runs the definition check."
allowed-tools: [Read, Write, Edit, Grep, Glob]
version: 1.0.0.0
---

# Bots Author

The author mode of the `system-skilled-bots` hub. It writes or edits one `BOT.md` under a repository's `bots/` folder from the shipped template. The mode grants no Bash, so the definition checker does not run here: `/doctor:bots` runs it read-only over the whole `bots/` folder once the file is written.

---

## 1. WHEN TO USE

Use this packet when the `system-skilled-bots` hub selects the `author` mode, or when `/bots:author` names it.

- A request to write a new bot, or to change an existing bot's trigger, runtime, budget, isolation or delivery.
- A checker failure on a `BOT.md` that needs its field fixed. The fix is made here, and the re-check runs under `/doctor:bots`.

### When NOT to Use

- Running, scheduling or reading a bot. The hub routes those to run, schedule and status.
- Checking every bot in a repository as a doctor task. Use `/doctor:bots`.

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

1. Confirm the bot id and the target repository. The id is lowercase letters, digits and hyphens.
2. Copy `../assets/bot-template.txt` to `bots/<id>/BOT.md`, or open the existing file, and fill the fields the request names.
3. Write the standing instructions in the body. An empty body fails the check.
4. Report the file path and the fields you set. Name `/doctor:bots` as the next step, which runs the definition checker read-only over the repository.

---

## 4. RULES

### ALWAYS

- Start from the shipped template, never from memory.
- Name the invariant id of any field the request asks you to change, so the re-check can be read against it.

### NEVER

- Never restate a field rule the runtime owns.
- Never run, schedule or install the bot from this mode.
- Never run the checker from this mode, because it grants no Bash.

### ESCALATE IF

- The request needs a field the template does not carry.
- The bot id collides with an existing `bots/<id>/` folder that the request did not name.

---

## 5. REFERENCES

- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/bot-definition.md`](./references/bot-definition.md): the author verbs and their contract.
- [`README.md`](./README.md): packet overview.
- `../mode-registry.json`: authoritative packet registration.
- `../hub-router.json`: parent routing policy.

---

## 6. SUCCESS CRITERIA

- `bots/<id>/BOT.md` exists with every field the request named, and the report names `/doctor:bots` as the check that follows.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `system-skilled-bots` hub, or `/bots:author`.
- Output: the written or edited `BOT.md` path and the fields set, for `/doctor:bots` to check.
