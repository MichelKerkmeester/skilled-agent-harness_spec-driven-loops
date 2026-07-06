---
name: create-agent
description: Scaffold OpenCode agents with runtime-aware placement, permission frontmatter, authority boundaries, workflow sections, and validation.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-agent, /create:agent, opencode agent, agent frontmatter, permission object, authority boundary, agent template, runtime agent directory -->

# Create Agent (workflow)

`create-agent` is the agent-authoring WORKFLOW packet of the `sk-doc` parent hub. It creates or updates one OpenCode agent markdown file using the packet-local template and standards, while consuming shared `sk-doc` validation through `../shared`.

This packet owns `/create:agent`, `references/agent_creation.md`, and `assets/agent_template.md`. It does not own advisor identity and must not add a packet-local `graph-metadata.json`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:

- Creating a new OpenCode agent under the active runtime agent directory.
- Updating an existing agent's frontmatter, permissions, authority boundary, workflow, verification contract, or anti-patterns.
- Converting a vague role description into a durable runtime persona.
- Deciding whether a requested component should be an agent, skill, or command.
- Running `/create:agent` or authoring the target file that command produces.

Keyword triggers: `create agent`, `new agent`, `OpenCode agent`, `agent frontmatter`, `permission object`, `authority boundary`, `mode: subagent`, `task permission`, `agent template`, `/create:agent`.

### When NOT to Use

Skip this workflow when:

- The request only needs reusable knowledge, references, standards, or templates. Use a skill workflow instead.
- The request only needs a slash-command entry point. Use the command workflow instead.
- The task is documentation quality review without creating or editing an agent. Use the doc-quality workflow.
- The requested role duplicates an existing agent with only wording changes.
- The user asks for broad agent orchestration design rather than authoring one concrete agent file.

### Packet Boundary

This packet authors agent files only. It may read supporting skills, commands, and existing agents to avoid duplication, but it must keep generated content focused on the agent's role, permissions, workflow, limits, and output contract.

---

## 2. HOW IT WORKS

### Source Materials

Load these resources before writing or materially editing an agent:

| Purpose | Resource |
| --- | --- |
| Agent standards and workflow | `references/agent_creation.md` |
| Canonical scaffold | `assets/agent_template.md` |
| Shared validation rules | `../shared/references/global/validation.md` |
| Shared structure rules | `../shared/references/global/core_standards.md` |
| Shared frontmatter guidance | `../shared/assets/frontmatter_templates.md` when frontmatter is unclear |

### Runtime Placement

Resolve the active runtime before choosing the output path:

| Runtime profile | Agent directory |
| --- | --- |
| OpenCode | `.opencode/agents/` |
| Claude Code | `.claude/agents/` |
| Copilot/default OpenCode profile | `.opencode/agents/` |

The filename must be kebab-case, end in `.md`, and match the frontmatter `name` field.

### Authoring Workflow

1. Confirm the requested role needs a durable persona with tool permissions and authority boundaries.
2. Search existing agents for overlap before creating a new one.
3. Resolve the runtime directory and target filename.
4. Start from `assets/agent_template.md`; do not invent a new structure from scratch.
5. Write YAML frontmatter first, using the unified `permission:` object.
6. Set `mode`, `temperature`, and each permission from the role's actual needs.
7. Write the body with role purpose, illegal nesting or write boundary, core workflow, capability scan, output verification, anti-patterns, and related resources.
8. Keep deep domain knowledge in skills or references; link to it instead of pasting it into the agent.
9. Validate the document with shared sk-doc validators before delivery.

### Canonical Frontmatter Shape

```yaml
---
name: agent-name
description: One-line purpose statement with scope and boundary
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  task: deny
  list: allow
  patch: deny
  external_directory: allow
---
```

Use `allow`, `deny`, or `ask`. Do not use the deprecated standalone `tools:` object as the canonical contract.

### Validation

Run shared validation against the final agent file:

```bash
python .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/agent-name.md --type agent
python .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/agents/agent-name.md
```

If the active runtime is Claude Code, validate the `.claude/agents/agent-name.md` path instead.

---

## 3. RULES

### ALWAYS

1. Read `references/agent_creation.md` and `assets/agent_template.md` before authoring.
2. Decide agent vs skill vs command before writing the file.
3. Use the active runtime agent directory, not a convenient nearby path.
4. Keep filename stem and frontmatter `name` identical.
5. Use the unified `permission:` object with explicit least-authority choices.
6. Set `task: allow` only when orchestration is the agent's explicit authority.
7. Include a hard boundary section that states nesting, delegation, and write limits.
8. Include output verification and anti-pattern sections.
9. Validate with `../shared/scripts/validate_document.py` before delivery.
10. Keep this packet self-contained and leave advisor graph identity at the `sk-doc` hub root.

### NEVER

1. Never add `graph-metadata.json` to this packet.
2. Never create an agent for reusable knowledge alone.
3. Never use deprecated standalone `tools:` frontmatter as the canonical permission model.
4. Never grant broad permissions because they might be useful later.
5. Never give a leaf agent `task: allow`.
6. Never paste full skill guidance into an agent body.
7. Never write an agent into the wrong runtime directory.
8. Never leave placeholders from `assets/agent_template.md` in the final file.

### ESCALATE IF

1. The role's authority boundary is unclear.
2. Existing agents already cover the requested role.
3. The requested permissions exceed the stated purpose.
4. Runtime placement is ambiguous.
5. Validation fails with blocking frontmatter, section, or markdown errors.
