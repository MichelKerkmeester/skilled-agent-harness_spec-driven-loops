---
title: "Bot Definition: Writing a BOT.md"
description: "Where a bot's BOT.md lives, which fields the template carries, and which command proves the file with the definition checker."
trigger_phrases:
  - "bot definition"
  - "write a bot.md"
  - "bot template fields"
importance_tier: normal
contextType: reference
version: 1.0.5.0
---

# Bot Definition: Writing a BOT.md

A bot is one `BOT.md` file under a repository's `bots/` folder. This reference says where the file goes, where its fields come from and which command proves it before anything runs or installs it.

---

## 1. OVERVIEW

### Purpose

Give the author mode one place that names the file layout and the template, so a new bot is written from the shipped template and checked by the same predicates the runner and installer use.

### When to Use

- Writing a new bot.
- Editing an existing bot's trigger, runtime, budget, isolation or delivery.
- Reading a checker failure and fixing the field it names.

---

## 2. LAYOUT

A consumer repository holds only `bots/`:

| Path | Holds |
|------|-------|
| `bots/<id>/BOT.md` | One bot: YAML frontmatter and the standing instructions in the body |
| `bots/config.json` | Repository-level settings, such as `identity` for a repository with no remote |

Run folders and control state never live in the consumer checkout. The runtime keeps them under the user-level state root and the Skilled tree's gitignored state folder.

---

## 3. THE TEMPLATE

Copy `assets/bot-template.txt` at the hub root. Its comments name every field and its default: `id`, `trigger`, `routine`, `runtime`, `budget`, `enabled`, `memory`, `delivery`, `isolation`, `sandbox`, `secrets`, `apps`, `precheck`, `spec_folder` and `version`. A bot carries `trigger` or a `routine` block and never both: the block says `what` the bot is for, holds its one `starts` entry, says whether it `does` act or tell, names the `until` outcome in prose and may add an `until_check` command whose exit 0 switches the bot off once the outcome holds. `memory` defaults to `true`, and `false` keeps the shared memory file and the bot's own out of its prompt, while any other value is refused `memory-invalid`. A cron start fires at most every 15 minutes. Replace the `<your-bot-id>` placeholder, because the parser rejects it as written, and write a body: an empty body fails the check.

`apps` names the connector servers the run may reach, by `manual_call_templates[].name` from the checkout's `.utcp_config.json`. Omit it and the run reaches no server. A name the config does not hold is refused `apps-unknown-server` by the checker and `apps-refused` by the run, never dropped. The field narrows a run with its own worktree: a shared run's child reads the repository config through the project pin, so a shared bot that declares `apps` is refused `apps-unenforceable` and a shared bot that declares none still reaches every server.

The template is the field reference. This file does not restate a field rule, because the runtime owns every one of them.

---

## 4. CHECK THE DEFINITION

The author mode does not run the checker, because it grants no Bash. Hand the check to `/doctor:bots`, which runs the definition checker read-only over the repository's `bots/` folder:

```bash
node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout-root>
```

The checker only reads. It prints one `PASS|FAIL|INFO: <id>: <message>` line per finding and exits 0 when every hard invariant passes, 1 on any failure and 2 when the target is missing or the audit cannot finish. A folder whose name differs from the bot id fails as `folder-id-mismatch`, so keep `bots/<id>/` and the `id` field equal. `--strict` changes nothing, because no advisory invariant is defined. A failure names its invariant id, such as `definition.missing-trigger` or `isolation-undeclared`, so the field that id names is the one to fix before the next check.
