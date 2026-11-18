---
title: "create-command"
description: "Turns a repeatable workflow into a validated OpenCode slash command with the frontmatter, input gates and router or presentation structure its type needs."
trigger_phrases:
  - "create command"
  - "slash command"
version: 1.0.5.0
---

# create-command

> Turn a workflow you repeat into a slash command that declares its input and keeps user-facing text in one place.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Turning a repeatable workflow into an OpenCode slash command under `.skilled/commands/` |
| **Invoke with** | `/create:command`, "create command" or "slash command" |
| **Works on** | Root commands, namespace commands, mode suffixes and split router packages |
| **Produces** | A validated command file, or a thin router with the assets it owns |

### What It Does

create-command is the command-authoring packet of the `sk-doc` hub. It takes a workflow you run more than once and shapes it into a slash command: path and invocation, frontmatter, a gate for required input, an executable body and the assets a mode-based command owns. Every command it produces is meant to clear `validate_document.py --type command` before delivery.

The packet does not own reusable knowledge or named runtime roles. Those belong to `create-skill` and `create-agent`, and an audit of a command already written belongs to `create-quality-control`.

### Why This Skill Exists

A command looks like a small markdown file until you reach one of its edges. A required argument with no gate lets the agent invent the missing value. An `argument-hint` that lists every flag runs past its budget. A namespace action written with an underscore fails the name check. A mode-based command that keeps its dashboards inline turns into an unreadable router.

This skill meets those edges while the file is still being written, not in a live session.

### The Command-Type Layer

The type picks the shape. Choose the smallest one that fits, then add the safety the action needs.

| Type | What the skill produces |
|---|---|
| **Simple** | One file with direct steps for a single action and few arguments |
| **Workflow** | One file with an overview, instructions and recovery for a multi-step process |
| **Mode-based** | `:auto` and `:confirm` routing, with a thin router and owned assets once it grows |
| **Router** | A thin dispatcher that verifies the agent, resolves mode and arguments, then hands off to owned assets |
| **Argument dispatch** | An ASCII routing tree with one handler per action keyword or query form |
| **Destructive** | Confirmation by default, an affected-state display, execution logging and recovery guidance |
| **Namespace** | A directory of related commands under `.skilled/commands/` |

---

## 2. QUICK START

**Step 1: Invoke it.**

```text
/create:command <command_invocation> [command_request] [:auto|:confirm]
```

A run opens with the Phase 0 self-check from the presentation contract. If a required resource is missing, it stops with `STATUS=FAIL` before any workflow loads.

**Step 2: Read the template before drafting.**

```bash
sed -n '1,40p' .skilled/skills/sk-doc/sk-create-command/assets/command-template.md
```

The output opens with the template frontmatter and the H1. The overview starts on the same screen. Later sections carry a template per command type. Section 8 sets out the shared gate pattern, and the Simple, Workflow and Mode-Based templates carry the gate block inside them.

**Step 3: Validate before delivery.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/create/command.md --type command
```

```text
✅ VALID: .skilled/commands/create/command.md
Document type: command
Total issues: 0
```

Exit 0 means the document cleared the command gate. Exit 1 means a blocking issue, so fix what the report names and run it again.

---

## 3. HOW IT WORKS

The workflow starts before the file exists. Decide first whether a command is the right component, because a one-off task and reusable guidance both belong elsewhere. Then resolve the invocation, so the path and the name are settled before any drafting starts.

From there the shape follows the type. Author the frontmatter first, then add the gate for every required argument, then write the body as executable steps. A command with several entry points gets an argument routing tree. A command with `:auto` and `:confirm` gets mode detection and a realized target for each mode. A destructive command gets confirmation by default, an affected-state display, execution logging and recovery guidance whatever its type.

```text
                    ┌──────────────────────────────┐
                    │ Request                      │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Decide a command is the      │
                    │ right component              │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Classify the type and        │
                    │ resolve the path             │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Author frontmatter and the   │
                    │ required-input gate          │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Write the executable body    │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Does display text outgrow    │
                    │ the file?                    │
                    └────┬────────────────────┬────┘
                         │                    │
                   [YES] ▼                    ▼ [NO]
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ Router plus owned            │        │ One command file             │
│ presentation asset           │        └─────┬────────────────────────┘
└────────────────────────┬─────┘              │
                         │                    │
                         ▼                    ▼
                    ┌──────────────────────────────┐
                    │ validate_document.py         │
                    │ --type command               │
                    └──────────────────────────────┘
```

A hint in angle brackets is a promise that the command cannot run without that input. The gate sits after the H1 and its purpose line. It runs before mode routing and before the first workflow step, and no asset loads ahead of it. It checks `$ARGUMENTS` for real content, ignores a mode suffix, stops, asks a specific question and waits. It must not read a missing value out of open files or earlier conversation.

### Where The Split Happens

A mode-based command earns the split when its display text outgrows the file. Startup prompts, dashboards, result templates and next-step wording move to `<namespace>-<action>-presentation.txt`. The router keeps the gate, the owned-assets table, mode resolution, argument routing and the execution targets.

`/create:command` ships in exactly that shape. `.skilled/commands/create/command.md` is the thin router, and its presentation asset and its two workflow files sit in `.skilled/commands/create/assets/`.

A router has to carry `OWNED ASSETS` and `PRESENTATION BOUNDARY`. The four remaining canonical sections are recommended, and the validator reports them as warnings when they are absent. The split moves text. It never changes routing, gates, modes or `allowed-tools`.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-command when a workflow repeats and the invocation carries input: a path, a target, a request, a mode suffix. It also fits a refactor that pulls dashboards and prompts out of a command file. A namespace of related actions is another reason to open this packet.

Skip it when the work is reusable knowledge a session reads. Skip it too when you need a named runtime role. A review of a command that already exists belongs to `create-quality-control`.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-skill` | Owns reusable knowledge and standards. A command links to a skill instead of turning into a reference manual. |
| `create-agent` | Owns named runtime personas. A router may dispatch to an agent, and that agent's frontmatter stays with create-agent. |
| `create-quality-control` | Audits or scores an existing command document. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| A required argument is accepted when empty | No gate sits before the workflow steps | Add the gate after the H1 and its purpose line, before mode routing and the first step |
| `argument-hint` runs past 140 characters | The hint tries to list every flag | Keep the hint a summary and move the full flag surface into the router's `EXECUTION TARGETS` section |
| The router carries a dashboard or a startup prompt | Display text was never moved out | Move startup prompts, dashboards, result templates and next-step wording into the presentation asset |
| The validator warns about a raw argument echo | The command ends with `User request: $ARGUMENTS` | Remove that line. The router resolves `$ARGUMENTS` in its body. |
| A router lacks a recommended section | Only `OWNED ASSETS` and `PRESENTATION BOUNDARY` block | Add the section, or accept the warning while a migration lands |
| A destructive command deletes without asking | The action was written as a normal step | Add confirmation by default, an affected-state display, execution logging and recovery guidance |

---

## 6. FAQ

### Is this a command or a skill?

A command is the entry point a person triggers. A skill is knowledge the session reads. If nobody would type the invocation twice, keep it out of `.skilled/commands/`.

### When does a command need the router and presentation split?

When it supports `:auto` and `:confirm` and its display text grows past a few lines. Below that size, one file is easier to read and easier to maintain.

### Are the auto and confirm workflow files always needed?

Only when the family routes execution into workflow assets. A direct-dispatch router calls tools or scripts and carries no workflow YAML. The family entry in [the machine contract](./assets/command-contract.json) settles which one applies.

### What goes in `allowed-tools` for an MCP tool?

The fully qualified name, `mcp__<server>__<tool>`. A bare name belongs in prose, never in frontmatter.

### How should I group related commands?

Keep them in a namespace directory. `.skilled/commands/<namespace>/<action>.md` becomes `/<namespace>:<action>`. Both segments stay lowercase hyphen-case.

---

## 7. VERIFICATION

| Check | Command and pass criterion |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-command/README.md --type readme` prints `Total issues: 0` and exits 0 |
| Command structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <command-file> --type command` prints `✅ VALID` and exits 0 |
| Name shape | `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <command-file>` prints `PASS` and exits 0 |
| Score and checklist | `python3 .skilled/skills/sk-doc/scripts/extract_structure.py <command-file>` prints JSON keyed by `dqi` and `checklist` |
| Router drift | `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` ends with `path-drift=0 shape-drift=0` and exits 0 |

The manual playbook runs six scenarios in three categories, and a run counts only when its result is recorded. It lives at [the manual playbook](./manual-testing-playbook/manual-testing-playbook.md).

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The workflow: thirteen numbered steps from the component decision to validation |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent model and the resource loading sequence |
| [`assets/command-template.md`](./assets/command-template.md) | Type templates, gate patterns and the validation checklist |
| [`assets/command-router-template.md`](./assets/command-router-template.md) | Canonical numbered router skeleton with the variant call-outs |
| [`assets/command-presentation-template.md`](./assets/command-presentation-template.md) | Presentation asset skeleton for a split command family |
| [`assets/command-contract.json`](./assets/command-contract.json) | The machine contract for the six router-shaped command families |
| [`assets/command-contract.schema.json`](./assets/command-contract.schema.json) | Schema the contract validates against |
| [`references/README.md`](./references/README.md) | Route map for the overflow references |
| [`references/worked-example.md`](./references/worked-example.md) | The file contract plus a full router and presentation pair |
| [`references/router-presentation-split.md`](./references/router-presentation-split.md) | What each side owns and the rule that a split keeps behavior |
| [`references/argument-hints-and-modes.md`](./references/argument-hints-and-modes.md) | Hint patterns, mode design and frontmatter budget |
| [`references/common-pitfalls.md`](./references/common-pitfalls.md) | Component choice and the recurring authoring mistakes |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Six operator scenarios across three categories |
