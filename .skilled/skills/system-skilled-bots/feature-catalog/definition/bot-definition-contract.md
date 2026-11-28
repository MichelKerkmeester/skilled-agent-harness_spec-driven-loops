---
title: "BOT.md definition contract"
description: "Parses one BOT.md into a typed bot definition and returns a named refusal for every field defect instead of throwing."
trigger_phrases:
  - "bot.md definition contract"
  - "bot definition fields"
  - "bot template"
  - "/bots:author"
version: 1.0.3.0
---

# BOT.md definition contract (/bots:author)

## 1. OVERVIEW

Parses one BOT.md into a typed bot definition and returns a named refusal for every field defect instead of throwing.

A bot is one `bots/<id>/BOT.md` file: YAML frontmatter for the machine fields and a body for the standing instructions. The checker, the runner and the installer all import the same predicates, so a field rule exists once and a file the checker passes is one the runtime accepts. The author mode writes the file from the shipped template and hands the check to `/doctor:bots`.

---

## 2. HOW IT WORKS

### Fields

The frontmatter accepts `id`, `trigger`, `runtime`, `budget`, `enabled`, `delivery`, `isolation`, `sandbox`, `secrets`, `apps`, `precheck`, `spec_folder` and the document `version`, which is checked and dropped because it describes the file and not the bot. An unknown key is refused. A bot id is label-safe: lowercase letters, digits and hyphens, starting with a letter or digit. The body must not be empty, because it is the prompt the executor receives. `apps` lists the connector servers a run may reach by name from the checkout's `.utcp_config.json`. Absent means none, and a name the config does not hold is refused.

### Triggers And Runtime

A trigger has one of four kinds: `cron` with an expression, `queue` with a name, `git-hook` or `manual`, and each kind accepts only its own keys. The `runtime` block names a deep-loop executor kind and passes any further keys to that executor. The budget uses the deep-loop vocabulary (`maxIterations`, `maxDurationMinutes` and `timeoutSeconds`), and a bound check refuses an executor kind the deep-loop runtime does not know or a timeout outside its schema.

### Delivery, Posture And Precheck

`delivery` is either `local-only`, which sends nothing, or a list of targets with an optional separate list for failures. The posture fields declare isolation (`worktree` or `shared`) and a sandbox class. `secrets` names one vault entry in lowercase letters, digits and hyphens with at most 64 characters: the operator stores it with `bots secret set <name>`, a run gives the value to its child as `SKILLED_BOT_SECRET_<NAME>` and records only the name, a name outside the grammar is refused `secret-name-invalid` and a name the vault does not hold refuses the run `secret-unknown`. A missing isolation falls back to the repository default, and with no default either it is refused as `isolation-undeclared`. `precheck` names a command whose non-zero exit or `[SILENT]` output skips the run, and `spec_folder` binds a spec folder before dispatch.

### Template

`assets/bot-template.txt` carries every field with its default in comments. Its `<your-bot-id>` placeholder is rejected as written, so a copied template cannot pass the check until the author names the bot.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Shared | Frontmatter parser, field predicates, isolation resolution and executor bound check |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Shared | The authoring template with every field and its default |
| `.skilled/skills/system-skilled-bots/bots-author/SKILL.md` | Handler | Author mode contract: write from the template, hand the check to `/doctor:bots` |
| `.skilled/commands/bots/author.md` | Handler | The `/bots:author` command router |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` | Vitest | Worked shapes, rejected definitions and isolation resolution |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Reference | Layout, template fields and the check command for authors |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/author-new-bot.md` | Manual playbook | Routes an author request to the author mode |

---

## 4. SOURCE METADATA

- Group: Definition
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `definition/bot-definition-contract.md`

Related references:
- [definition-checker.md](definition-checker.md) - the read-only audit built on these predicates
- [../foundations/repository-config-and-identity.md](../foundations/repository-config-and-identity.md) - repository defaults the definition falls back to
