---
title: "bots-status"
description: "Status mode of system-skilled-bots: read installed bots, last runs and deliveries, and the needs-you inbox. Read-only."
version: 1.0.0.0
---

# bots-status

> The status mode of `system-skilled-bots`. It reads installed bots, their last runs and deliveries, and the needs-you inbox through `bots status` and `bots inbox`. It writes nothing in the consumer checkout.

---

## 1. OVERVIEW

The status mode answers what the bots did and what they need. Every read goes through the two `bots.cjs` read verbs, and no other Bash runs from this mode. The table names what it covers and what it hands to the sibling modes.

| Aspect | What it gives you |
|---|---|
| **Use it for** | A request to list installed bots, their last run or its delivery. A request to read the needs-you inbox. A request to check whether a schedule needs a reinstall or a run folder vanished |
| **Command** | `/bots:status` |
| **Tools** | Read, Bash (only `bots status` and `bots inbox`), Grep, Glob. No write or edit tool |
| **Hands off** | Answering an inbox item, which the run mode owns through `bots answer`. Changing a schedule, which the schedule mode owns |

`bots inbox` lives here because reading the inbox is a status read. Every status request reaches this mode through the hub's `status` signal, or through `/bots:status`.

---

## 2. VERBS

The mode runs the two read verbs below. Each takes `--repo <path>` for the consumer checkout.

```text
node .skilled/bin/bots.cjs status --repo <path>
node .skilled/bin/bots.cjs status --repo <path> --json
node .skilled/bin/bots.cjs inbox --repo <path>
```

`bots status` lists every installed bot with its last run and delivery, and the open needs-you items, read from the status index. `--json` returns the same rows as data. `bots inbox` lists open and expired needs-you items.

`--rebuild` and `--unregister` write, so this mode never runs them. When the index looks stale, name `bots status --rebuild` as the operator's next step. `--unregister` hides an identity's rows without deleting anything, and it is the operator's call too.

---

## 3. READING THE ROWS

A row can report a missing checkout, a changed runner path that needs a reinstall, or a run folder that vanished. Quote each row as the CLI printed it. Then name the mode that acts on it: a needs-you item belongs to the run mode for its answer, and a reinstall belongs to the schedule mode.

---

## 4. HOW TO USE

1. Confirm the repository, or read every identity with `--all`.
2. Run `bots status` or `bots inbox` with `--repo <path>`, adding `--json` when the reader wants rows as data.
3. Report the rows as printed.
4. Point each open needs-you item at the run mode, and each reinstall at the schedule mode.

---

## 5. RELATED

- [`SKILL.md`](./SKILL.md): the status workflow, its rules and its success criteria.
- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/status-and-inbox.md`](./references/status-and-inbox.md): the status verbs and their contract.
- [`../README.md`](../README.md): the hub overview with all four modes.
- [`../mode-registry.json`](../mode-registry.json): the packet registration this mode resolves through.

---

## 6. FILES

- `SKILL.md`: the status workflow, its rules and its success criteria.
- `ROUTER.md`: the packet machine router.
- `references/status-and-inbox.md`: the status verbs and their contract.
- `changelog/`: release notes for this packet.

---

## 7. VERIFICATION

The hub's structural gate verifies the packet's shape:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

The run passes when it ends with `OK: parent-skill-check`. A routing replay with a real status request confirms the hub selects this mode, because the structural gate asserts presence and never reachability.
