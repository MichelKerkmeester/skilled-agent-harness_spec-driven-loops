---
title: "Bot Definition: Writing a BOT.md"
description: "Where a bot's BOT.md lives, which fields the template carries, and which command proves the file with the definition checker."
trigger_phrases:
  - "bot definition"
  - "write a bot.md"
  - "bot template fields"
importance_tier: normal
contextType: reference
version: 1.0.7.0
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

Copy `assets/bot-template.txt` at the hub root. Its comments name every field and its default: `id`, `trigger`, `routine`, `runtime`, `budget`, `enabled`, `memory`, `delivery`, `isolation`, `sandbox`, `secrets`, `apps`, `skills`, `precheck`, `spec_folder` and `version`. A bot carries `trigger` or a `routine` block and never both: the block says `what` the bot is for, holds its one `starts` entry, says whether it `does` act or tell, names the `until` outcome in prose and may add an `until_check` command whose exit 0 switches the bot off once the outcome holds. `memory` defaults to `true`, and `false` keeps the shared memory file and the bot's own out of its prompt, while any other value is refused `memory-invalid`. A cron start fires at most every 15 minutes. Replace the `<your-bot-id>` placeholder, because the parser rejects it as written, and write a body: an empty body fails the check.

`apps` names the connector servers the run may reach, by `manual_call_templates[].name` from the checkout's `.utcp_config.json`. Omit it and the run reaches no server. A name the config does not hold is refused `apps-unknown-server` by the checker and `apps-refused` by the run, never dropped. The field narrows a run with its own worktree: a shared run's child reads the repository config through the project pin, so a shared bot that declares `apps` is refused `apps-unenforceable` and a shared bot that declares none still reaches every server.

`skills` names skill folders under `.skilled/skills/` of the Skilled tree, and each one's `SKILL.md` reaches the prompt whole, inside its own `<skill_content>` block labelled untrusted, after the memory blocks and before the body. A name follows the bot id grammar, and a list that repeats a name or holds one outside the grammar is refused `skills-duplicate` or `skills-name-invalid` when it parses. One body over 16,384 bytes refuses the run `skill-too-large` and a list whose bodies pass 20,480 bytes refuses it `skills-over-budget`, so in practice a bot carries one skill. A name with no `SKILL.md` refuses `skill-unknown`, and the checker fails all three as `skills-unknown`, `skills-too-large` and `skills-over-budget` before anything installs. `bots schedule install <id>` pins the digest of every body the list names, and a body that changed since refuses `skill-changed` until the bot is installed again. A bot with no install record pins against the bodies its last dispatched run loaded, and for that bot a hand-typed `bots run <id>` loads the bodies as they are, which is how an operator approves a changed body. An installed bot's pin holds for a hand-typed run too, so a changed body there is approved by installing again. A bot installed before it named any skill refuses `skill-changed` until it is installed again.

`secrets` names one entry in the vault, in lowercase letters, digits and hyphens with at most 64 characters, and a name outside that is refused `secret-name-invalid`. The operator stores the value once with `bots secret set <name>`, which reads it from a prompt or a piped line and never from an argument. A run gives the value to its child as `SKILLED_BOT_SECRET_<NAME>`, the name upper-cased with each hyphen turned into an underscore, and records the name on the run record, never the value. A run whose name the vault does not hold is refused `secret-unknown` and starts no child.

> **Upgrading to the vault.** `secrets` now names one entry in the vault, and the child reads its value from `SKILLED_BOT_SECRET_<NAME>`. Before you upgrade, for every `BOT.md` that sets `secrets`: rename the value to lowercase letters, digits and hyphens if it is not already (`GITHUB_TOKEN` becomes `github-token`), run `bots secret set <name>` once, and change the bot body to read `SKILLED_BOT_SECRET_<NAME>` instead of the old variable. A bot whose name is not stored is refused `secret-unknown` and starts no child.

The template is the field reference. This file does not restate a field rule, because the runtime owns every one of them.

---

## 4. CHECK THE DEFINITION

The author mode does not run the checker, because it grants no Bash. Hand the check to `/doctor:bots`, which runs the definition checker read-only over the repository's `bots/` folder:

```bash
node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout-root>
```

The checker only reads. It prints one `PASS|FAIL|INFO: <id>: <message>` line per finding and exits 0 when every hard invariant passes, 1 on any failure and 2 when the target is missing or the audit cannot finish. A folder whose name differs from the bot id fails as `folder-id-mismatch`, so keep `bots/<id>/` and the `id` field equal. `--strict` changes nothing, because no advisory invariant is defined. A failure names its invariant id, such as `definition.missing-trigger` or `isolation-undeclared`, so the field that id names is the one to fix before the next check.
