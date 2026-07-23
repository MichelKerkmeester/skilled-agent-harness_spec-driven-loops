---
title: "create-command"
description: "Scaffolds OpenCode slash commands with correct frontmatter, mandatory input gates, and router/presentation separation, for anyone building a repeatable workflow entry point."
trigger_phrases:
  - "create command"
  - "slash command"
version: 1.0.0.0
---

# create-command

> Turn a repeatable workflow into a validated slash command, with the frontmatter, gates, and structure that fit its type.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Scaffolding or refactoring an OpenCode slash command under `.opencode/commands/` |
| **Invoke with** | `/create:command`, "create command", or a direct read of `SKILL.md` |
| **Works on** | Root and namespace command files, plus router/presentation splits |
| **Produces** | A validated command file, or router plus presentation asset, with correct frontmatter and gates |

---

## 2. OVERVIEW

### Why This Skill Exists

A slash command looks simple until you hit its edges. `argument-hint` needs to summarize the invocation shape without ballooning past its budget. A required argument needs a gate that stops the command cold rather than letting the model guess at missing input. A mode-based command that grows a dashboard, a startup prompt sequence, and a result template inline turns into an unreadable router the moment someone adds a second mode. Get any of these wrong and the command either breaks silently or becomes the file nobody wants to touch.

### What It Does

create-command is the `sk-doc` workflow behind `/create:command`. It decides whether a command is even the right component, classifies the command type from simple through router and namespace, and walks the file through frontmatter and mandatory input gates. Mode-based commands get one more step: the router/presentation split. It does not own reusable domain knowledge or named runtime personas. Those live in `create-skill` and `create-agent`.

---

## 3. QUICK START

**Step 1: Decide the command type.** A one-off task doesn't need a command. A repeatable, multi-step workflow with defined steps does.

**Step 2: Draft frontmatter and read the template.**

```bash
cat .opencode/skills/sk-doc/create-command/assets/command-template.md
```

You get the full frontmatter shape, the command-type table, the mandatory gate pattern, and the section vocabulary to work from.

**Step 3: Validate before you ship it.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/commands/<namespace>/<action>.md --type command
```

You get `✅ VALID` with any warnings listed by name. Warnings don't block delivery. A blocking error does.

---

## 4. HOW IT WORKS

Resolve the invocation path first. `.opencode/commands/<command>.md` becomes `/<command>`, while `.opencode/commands/<namespace>/<action>.md` becomes `/<namespace>:<action>`. Read any existing command completely before editing it, and check nearby commands in the same namespace so structure and vocabulary match the family. Classify the command type from the table in `SKILL.md`, then author frontmatter first: a single-line `description`, an `argument-hint` when input is expected, and a least-privilege `allowed-tools` list.

If `argument-hint` carries a required argument, the mandatory gate goes immediately after frontmatter, before any other content. It checks whether `$ARGUMENTS` is empty, stops immediately when required input is missing, asks a specific question, and waits. It never infers missing input from context, screenshots, or conversation history.

The command-type table in `SKILL.md` covers seven shapes: simple, workflow, mode-based, router, argument dispatch, destructive, and namespace. Pick the smallest one that fits. A single action with few arguments stays a simple command in one file. A destructive command, one that deletes data or makes an irreversible change, needs confirmation by default, an affected-state display before execution, and recovery guidance, whatever type it otherwise is.

### Key Concept: A Router Owns Routing, Not Display

A mode-based command that supports `:auto` and `:confirm` can outgrow a single file fast. The moment it needs a dashboard, a startup prompt sequence, or a result template, that display content moves into an owned presentation asset (`_presentation.txt`), and the command `.md` shrinks back to a thin router: verify the agent, resolve the mode and arguments, pick the execution target, hand off. A router that still inlines its dashboard alongside its routing logic is the sign a split is overdue. The split preserves behavior. It moves where text lives, not what the command does.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-command when a workflow is repeatable and needs `$ARGUMENTS` parsing, mode routing for `:auto`/`:confirm`, a confirmation gate for something destructive, or a router/presentation split once display text outgrows the router body. Skip it for reusable domain knowledge with no invocation shape, and skip it when the workflow only needs to run once.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-agent` | Owns named runtime personas. A router may dispatch to an agent, but the agent's own frontmatter and boundary live in create-agent's contract. |
| `create-skill` | Owns reusable knowledge and standards. A command stays executable and workflow-oriented, and links out to a skill rather than becoming a reference manual. |
| `sk-git` | Owns git branch, commit, and PR mechanics. A command can prepare content but never substitutes for git workflow ownership. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Command accepts empty required input | No mandatory gate after frontmatter | Add the gate immediately after frontmatter, before any other content |
| `argument-hint` keeps growing past budget | The hint tries to enumerate every flag instead of summarizing the shape | Keep the hint under 140 characters and move the full flag surface into `EXECUTION TARGETS` |
| Router file has a dashboard baked in | Presentation content was never split out | Move startup prompts, dashboards, and result templates into a presentation asset, keep routing in the router |
| Validator flags raw argument echo | The command ends with a bare `User request: $ARGUMENTS` line | Remove it. The router already receives `$ARGUMENTS` and resolves it in the body |
| Destructive command has no confirmation step | Delete or overwrite logic was written like a normal workflow step | Add confirmation by default, an affected-state display, and recovery guidance before the action runs |
| `allowed-tools` is broader than what runs | Tools were added "in case they're needed later" | List only the tools the command actually calls, add more only when a real step needs them |

---

## 7. FAQ

**Q: Why not just write a skill instead of a command?**

A: A skill is reusable knowledge a session reads. A command is an executable entry point a user or session triggers directly, with its own arguments, gates, and tool restrictions. If nobody invokes it repeatably, it's not a command yet.

**Q: When do I need the router/presentation split?**

A: When a mode-based command grows dashboards, startup prompts, or result templates inline. Below that size, a single `.md` file with clear sections is simpler and easier to maintain.

**Q: What goes in `allowed-tools` for an MCP tool?**

A: The fully qualified name, `mcp__<server>__<tool>`, not a bare tool name. Bare names belong in prose only.

**Q: What happens if I skip validation?**

A: The command still runs, but you have no proof the frontmatter, gates, and section vocabulary are correct until it breaks in a live session. Run the validator every time before calling a command done.

**Q: How do I group several related commands?**

A: Put them under a namespace directory. `.opencode/commands/<namespace>/<action>.md` becomes `/<namespace>:<action>`. Keep namespace and action names lowercase and hyphen-case.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Filename discipline | `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <command-file>` | Filename stem is valid kebab-case |
| Document structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <command-file> --type command` | `✅ VALID` with no blocking errors |
| Structure extraction | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py <command-file>` | Section list matches the expected command shape |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, command-type classification, and the full 13-step creation workflow |
| [`assets/command-template.md`](./assets/command-template.md) | Command type templates, gates, dispatch patterns, and the validation checklist |
| [`assets/command-router-template.md`](./assets/command-router-template.md) | Canonical numbered router skeleton with variant call-outs |
| [`assets/command-presentation-template.md`](./assets/command-presentation-template.md) | Full presentation asset skeleton for split command families |
| [`references/README.md`](./references/README.md) | Overflow route map for deeper detail |
| [`references/worked-example.md`](./references/worked-example.md) | A fully worked split command, router plus presentation |
| [`references/router-presentation-split.md`](./references/router-presentation-split.md) | The router/presentation ownership boundary and split transformation |
