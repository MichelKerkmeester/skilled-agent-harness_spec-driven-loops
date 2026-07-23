---
title: "create-agent"
description: "Scaffolds or updates one runtime agent markdown file with runtime-correct frontmatter, explicit permissions, and validation, for anyone building a specialized AI persona."
trigger_phrases:
  - "create agent"
  - "agent frontmatter"
version: 1.0.0.0
---

# create-agent

> Turn a role idea into one validated runtime agent file, with the frontmatter schema that actually matches where it lives.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Scaffolding or updating one OpenCode or Claude Code agent markdown file |
| **Invoke with** | `/create:agent`, "create agent", or a direct read of `SKILL.md` |
| **Works on** | Agent files under `.opencode/agents/` or `.claude/agents/` |
| **Produces** | One validated agent file with runtime-correct frontmatter, boundaries, workflow, and verification |

---

## 2. OVERVIEW

### Why This Skill Exists

Two runtimes read agent frontmatter differently, and neither warns you when you get it wrong. OpenCode enforces the `permission:` object and quietly ignores a bare `tools:` key. Claude Code enforces only `tools:` and ignores `permission:` outright. Skip `tools:` entirely in a Claude Code agent and it inherits the parent session's full tool set, which is the opposite of what a scoped persona needs. Add the standing question of whether a task even needs a named persona instead of a skill or a command, and a hand-rolled agent file drifts from the contract fast.

### What It Does

create-agent is the `sk-doc` workflow behind `/create:agent`. It decides whether an agent is the right component, places the file in the active runtime directory, writes the runtime-correct frontmatter schema with least-authority permissions, and requires a hard boundary section, a core workflow, and output verification before the file ships. It does not own reusable domain knowledge or slash-command entry points. Those live in `create-skill` and `create-command`.

---

## 3. QUICK START

**Step 1: Confirm an agent is the right call.** A skill answers how the work should be done. A command answers how a user triggers it. An agent answers who does it, with explicit authority. Only write an agent when you need that third answer.

**Step 2: Copy the scaffold and fill it in.**

```bash
cat .opencode/skills/sk-doc/create-agent/assets/agent-template.md
```

You get the full frontmatter shape, the hard boundary section, the workflow, and the verification contract to fill in for the target runtime.

**Step 3: Validate before you ship it.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/agents/agent-name.md --type agent
```

A clean file reports `✅ VALID: <path>` with `Total issues: 0`.

---

## 4. HOW IT WORKS

Start by choosing the component: agent, skill, or command. Search existing agents for overlap before creating a new one, so you don't end up with two personas covering the same authority. Resolve the runtime directory, `.opencode/agents/` or `.claude/agents/`, and draft frontmatter first, especially `permission` or `tools`. Write the hard boundary section before the general workflow. The boundary comes first on purpose: it states what the agent must never do, nested dispatch, writes outside its scope, before the file describes what it does do, so a reader who only skims the top already knows the limits.

From there, add a capability scan of relevant skills and tools, explicit output verification, anti-patterns, and related resources. Together with the H1, the hard boundary, and the core workflow already written, that's the full required shape, seven sections beyond frontmatter, each earning its place. Remove every placeholder from the template and run the validation gate before delivery.

One family of agents uses a different section vocabulary on purpose. The deep-loop leaf-iteration agents (`@deep-alignment`, `@deep-review`, `@deep-research`) read more clearly under lane-named headings like `ROUTING SCAN` and `ADVERSARIAL CHECK` instead of the default skeleton. That's a documented, sanctioned dialect, not drift, and it still carries every boundary and verification responsibility the default shape requires. Reach for it only when authoring another member of that specific family.

### Key Concept: Runtime-Correct Frontmatter Is Not Optional

The same role needs two different frontmatter blocks depending on where it lives. An OpenCode reviewer agent gets `permission: { read: allow, write: deny, task: deny }`. The same reviewer for Claude Code gets `tools: Read, Grep, Glob` and no `permission:` block at all, since Claude Code silently ignores it. Write the OpenCode schema into a `.claude/agents/` file, or the reverse, and the runtime does not error. It just ignores the block, and the agent runs on whatever the omission defaults to. That's why the validation gate checks runtime directory against frontmatter schema, not just YAML syntax.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-agent when a request needs a stable named persona with explicit tool permissions and behavioral limits, when you're weighing agent against skill against command for a new capability, when an existing agent's permissions or boundary need a material rewrite, or when a workflow needs orchestration authority no existing agent already covers. Skip it for a one-off task or for reusable knowledge that has no runtime persona of its own.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-skill` | Owns reusable knowledge, standards, and domain guidance. create-agent links to a skill instead of pasting its content into the agent body. |
| `create-command` | Owns slash-command entry points. Pair a command with an agent when the command needs to dispatch to a named persona, but don't build an agent just for the trigger. |
| `create-quality-control` | Audits, scores, and validates an agent that already exists. create-agent authors and updates it. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Agent runs with unrestricted tools | `.claude/agents/` file omits `tools:` | Add an explicit least-authority `tools:` allow-list, never leave it empty |
| Permissions block has no effect | `permission:` written into a `.claude/agents/` file, or `tools:` written into `.opencode/agents/` | Match the schema to the runtime directory, never mix them |
| Validator flags a missing section | Hard boundary, workflow, verification, or related resources section absent | Copy the full scaffold from `assets/agent-template.md` rather than writing from a blank file |
| Filename and `name` field disagree | Frontmatter `name` was edited without renaming the file, or the reverse | Keep the filename stem and frontmatter `name` identical |
| Agent has broad permissions "just in case" | Permissions were scoped to the role's imagined ceiling instead of its actual authority | Grant only what the current responsibilities need, and revisit if the role genuinely grows |
| New agent overlaps an existing one | An agent covering the same authority already exists | Search the active runtime directory first and extend the existing agent instead of duplicating it |

---

## 7. FAQ

**Q: Why not just add another skill instead of an agent?**

A: A skill is knowledge a session can read. An agent is a persona with its own tool permissions, boundaries, and orchestration authority. If the task doesn't need a scoped tool policy or a stable role identity, a skill is lighter and easier to maintain.

**Q: Can one agent definition work for both runtimes?**

A: No. Author two files, one per runtime directory, each with its own runtime-correct frontmatter. Map the OpenCode `allow` permissions to the Claude Code `tools:` list when the role is the same, but leave `mode` and `temperature` out of the Claude Code file since neither field has an equivalent there.

**Q: When should an agent get `task: allow`?**

A: Only when orchestration, dispatching other agents or subtasks, is the agent's explicit stated authority. A LEAF agent that only reads, writes, and reports never gets it.

**Q: Does this workflow also cover updating an existing agent?**

A: Yes. Read the current file completely first, apply the same frontmatter and section rules a new agent would follow, and preserve behavior the user didn't ask to change. Validate the result the same way you would a fresh file.

---

## 8. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Document structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <agent-file> --type agent` | `✅ VALID` with zero blocking issues |
| Structure extraction | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py <agent-file>` | Section list matches the required body shape |
| Filename discipline | `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <agent-file>` | Filename stem is valid kebab-case and matches `name` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, component-choice rule, and the full creation workflow |
| [`assets/agent-template.md`](./assets/agent-template.md) | Canonical scaffold: frontmatter, boundaries, workflow, verification, anti-patterns |
| [`references/README.md`](./references/README.md) | Overflow route map for deeper detail |
| [`references/agent-vs-skill-vs-command.md`](./references/agent-vs-skill-vs-command.md) | The full component-choice decision, when the call is close |
| [`references/permission-design.md`](./references/permission-design.md) | `mode` selection and least-authority permission design |
| [`references/common-pitfalls.md`](./references/common-pitfalls.md) | Recurring mistakes with why they break and the correct fix |
