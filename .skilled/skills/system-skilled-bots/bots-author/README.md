---
title: "bots-author"
description: "Author mode of system-skilled-bots: write or edit a BOT.md from the shipped template. The definition check runs under /doctor:bots."
version: 1.0.0.0
---

# bots-author

> The author mode of `system-skilled-bots`. It writes or edits one `BOT.md` under a repository's `bots/` folder from the shipped template, and the definition check runs under `/doctor:bots`.

---

## 1. OVERVIEW

The author mode turns a request about a file-defined bot into one `BOT.md` on disk. A bot is a single file under a repository's `bots/` folder, and this mode decides what that file says, not whether the bot runs. The table names what it covers and what it hands to the sibling modes.

| Aspect | What it gives you |
|---|---|
| **Use it for** | A request to write a new bot, or to change an existing bot's trigger, runtime, budget, isolation or delivery. A checker failure on a `BOT.md` that needs its field fixed |
| **Command** | `/bots:author` |
| **Tools** | Read, Write, Edit, Grep, Glob. No Bash, so the checker never runs from this mode |
| **Hands off** | Running, scheduling or reading a bot, which the run, schedule and status modes own. Checking every bot in a repository, which is `/doctor:bots` |

Every author request reaches this mode through the hub's `author` signal, or through `/bots:author`. The mode holds no routing logic of its own. Its `ROUTER.md` selects the one reference leaf it loads, and that leaf names the template fields.

---

## 2. LAYOUT

A consumer repository holds only its `bots/` folder. The author mode writes inside that folder and nowhere else.

```text
<repository>/bots/
  config.json        repository settings, such as identity for a repository with no remote
  <id>/BOT.md        one bot: YAML frontmatter and the standing instructions in the body
```

The id is lowercase letters, digits and hyphens. The template at `assets/bot-template.md` names every field and its default: `id`, `trigger`, `runtime`, `budget`, `enabled`, `delivery`, `isolation`, `sandbox`, `secrets`, `precheck`, `spec_folder` and `version`. Run folders and control state never live in the consumer checkout, so an author request never touches them.

---

## 3. HOW TO USE

1. Confirm the bot id and the target repository.
2. Copy `../assets/bot-template.md` to `bots/<id>/BOT.md`, or open the file that already exists.
3. Fill the fields the request names. Replace the `<your-bot-id>` placeholder, and write a body, because an empty body fails the check.
4. Report the file path and the fields you set.
5. Run `/doctor:bots` on the repository. It reports each failure by its invariant id, such as `definition.missing-trigger` or `isolation-undeclared`, and the field that id names is the one to fix.

The check is a separate step on purpose. This mode grants no Bash, so the checker is read-only and runs under the doctor command, which owns every repository-wide check.

---

## 4. RELATED

- [`SKILL.md`](./SKILL.md): the author workflow, its rules and its success criteria.
- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/bot-definition.md`](./references/bot-definition.md): the file layout, the template and the check.
- [`../README.md`](../README.md): the hub overview with all four modes.
- [`../mode-registry.json`](../mode-registry.json): the packet registration this mode resolves through.

---

## 5. FILES

- `SKILL.md`: the author workflow, its rules and its success criteria.
- `ROUTER.md`: the packet machine router.
- `references/bot-definition.md`: the author verbs and their contract.
- `changelog/`: release notes for this packet.

---

## 6. VERIFICATION

The hub's structural gate verifies the packet's shape:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

The run passes when it ends with `OK: parent-skill-check`. A routing replay with a real author request confirms the hub selects this mode, because the structural gate asserts presence and never reachability.
