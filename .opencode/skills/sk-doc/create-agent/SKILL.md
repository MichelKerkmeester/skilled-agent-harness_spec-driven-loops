---
name: create-agent
description: Scaffold OpenCode agents with runtime-aware placement, permission frontmatter, authority boundaries, workflow sections, and validation.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.1.1
---

<!-- Keywords: create-agent, /create:agent, opencode agent, agent frontmatter, permission object, authority boundary, agent template, runtime agent directory -->

# Create Agent - Runtime Persona Authoring

`create-agent` is the `sk-doc` workflow packet for creating or updating one runtime agent markdown file. The executable contract lives here: decide whether an agent is the right component, place it in the active runtime directory, author current frontmatter and authority boundaries, then validate before delivery.

Use `references/README.md` (the overflow route map) and `assets/agent_template.md` only for deeper examples, exhaustive variants, and long-form reference detail. Do not make those files the primary workflow contract.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:

1. Creating a new OpenCode or Claude Code agent file.
2. Updating an agent's frontmatter, permissions, authority boundary, workflow, verification contract, or anti-patterns.
3. Converting a durable role description into a runtime persona with explicit authority and tool policy.
4. Deciding whether the requested component should be an agent, skill, or command.
5. Running or supporting `/create:agent`.

Keyword triggers: `create agent`, `/create:agent`, `OpenCode agent`, `Claude Code agent`, `agent frontmatter`, `permission object`, `authority boundary`, `agent template`, `runtime agent directory`.

Create an agent only when the system needs a stable named persona with explicit tool permissions, denied capabilities, behavioral constraints, orchestration authority, or reusable execution posture.

### When NOT to Use

Use another `sk-doc` packet when:

1. The request needs reusable knowledge, standards, templates, or long-form workflow guidance. Use `create-skill`.
2. The request needs a slash-command entry point without a new runtime persona. Use `create-command`.
3. The request needs a README, install guide, feature catalog, manual testing playbook, benchmark package, flowchart, or changelog. Use `create-readme`, `create-feature-catalog`, `create-manual-testing-playbook`, `create-benchmark`, `create-flowchart`, or `create-changelog`.
4. The request audits, validates, scores, or optimizes an existing agent document. Use `create-quality-control`.

---

## 2. SMART ROUTING

Stay in this packet only when the requested artifact is a concrete runtime agent file and an existing agent does not already cover the authority boundary.

Decision rule:

```text
Need a named runtime persona with authority and tool policy?
  YES -> Create an agent
  NO  -> Use or create a skill, template, or command instead
```

### Router Resilience

This packet routes by component choice and runtime-persona requirements. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when the component choice or runtime-persona requirements are unclear.
- Ask for the missing component type, runtime profile, or authority requirements instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

---

## 3. HOW IT WORKS

### Component Choice

Choose the component type before authoring: an agent answers who should do the work, a skill answers how the work should be done, and a command answers how a user should trigger the workflow. Healthy systems often pair all three: the agent provides persona and boundaries, the skill provides detailed domain knowledge, and the command provides the ergonomic entry point.

### Output Package

Create or update one markdown file in the active runtime agent directory.

| Runtime profile | Agent directory |
| --- | --- |
| OpenCode | `.opencode/agents/` |
| Claude Code | `.claude/agents/` |
| Copilot/default OpenCode profile | `.opencode/agents/` |

The output file contract:

1. The filename is kebab-case and ends in `.md`.
2. The filename stem matches frontmatter `name` exactly.
3. The file lives in the active runtime directory, not under `sk-doc`.
4. The body is self-sufficient for the agent's role, boundaries, workflow, limits, and output contract.
5. Reusable or deep domain guidance stays in skills or references and is linked, not pasted into the agent.

### Canonical Frontmatter

Frontmatter schema is runtime-specific — never emit the same schema for both runtime directories:

| Runtime directory | Canonical schema | Rationale |
| --- | --- | --- |
| `.opencode/agents/` | `permission:` object | OpenCode enforces the `permission:` object; it ignores a standalone `tools:` key. |
| `.claude/agents/` | `tools:` allow-list | Claude Code enforces only `tools:` (a comma-separated allow-list); it silently ignores `permission:`. Omitting `tools:` makes the agent inherit the parent session's full, unrestricted tool set. |

Decision rule:

```text
Authoring for .opencode/agents/? -> emit `permission:` (never bare `tools:`)
Authoring for .claude/agents/?   -> emit `tools:` (never `permission:`)
```

**OpenCode (`.opencode/agents/`) frontmatter:**

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
  external_directory: deny
---
```

**Claude Code (`.claude/agents/`) frontmatter:**

```yaml
---
name: agent-name
description: One-line purpose statement with scope and boundary
tools: Read, Write, Edit, Bash, Grep, Glob
---
```

Map the `permission:` allow-set to the `tools:` list when authoring the same role for both runtimes: include only the tools with `allow` (or `ask`) and drop the ones with `deny`. `mode` and `temperature` are OpenCode-only fields with no Claude Code equivalent — omit both from `.claude/agents/` frontmatter.

Frontmatter rules:

1. `name` must match the filename stem.
2. `description` is one line describing role and scope.
3. `mode` and `temperature` are OpenCode-only fields; set `mode` to match runtime invocation (commonly `subagent` for specialists) and `temperature` to reflect determinism needs (commonly `0.1`) — `.claude/agents/` frontmatter omits both.
4. Under `.opencode/agents/`, `permission` values must be explicit, least-authority, justified by the role, and use only `allow`, `deny`, or `ask`.
5. Under `.claude/agents/`, `tools:` is the runtime-specific canonical schema — a comma-separated least-authority allow-list; never emit `permission:` there, and never leave `tools:` absent or empty (an absent `tools:` inherits the parent session's full tool set).
6. Set `task: allow` (or include `Task` in `tools:`) only for agents whose explicit authority is orchestration.

### Required Body Shape

Start from `assets/agent_template.md` when creating a new agent. At minimum, a production-ready agent includes:

1. H1 and short purpose statement.
2. Hard boundary section that states nesting, delegation, and write limits.
3. Core workflow section that describes how the agent acts.
4. Capability scan section that identifies relevant skills, tools, commands, or companion agents.
5. Output verification section that defines checks required before claiming completion.
6. Anti-patterns section that names failure modes.
7. Related resources section with real supporting paths.

Boundary variants: LEAF write-capable agents deny nested sub-agent dispatch and restrict mutation to explicitly scoped paths; LEAF read-only agents deny nested dispatch and all file mutation; orchestrators may dispatch only when orchestration is their explicit authority and `task` permission allows it; command-driven or machine-validated agents may need input/scope gates before workflow steps.

### Sanctioned Section-Vocabulary Dialects

The skeleton above is the default; start new agents from it. One alternate section vocabulary is also sanctioned — the **deep-loop leaf-iteration agents** (`@deep-alignment` / `@deep-review` / `@deep-research`, in both runtime directories). A per-iteration loop worker reads more clearly under lane-named headings, so these agents carry the same responsibilities under a different vocabulary: `ROUTING SCAN`, a lane `CONTRACT` (`ALIGNMENT CONTRACT` / `REVIEW CONTRACT`, or `ITERATION PROTOCOL` for the leaner research variant), `STATE MANAGEMENT` (`+ WRITE SAFETY` where the agent mutates), a lane `ADVERSARIAL CHECK` (`VERIFY-FIRST ADVERSARIAL CHECK` / `ADVERSARIAL SELF-CHECK`), and `RULES`.

This is a documented shape, not drift. `--type agent` requires only `## 1. CORE WORKFLOW`, and the dialect still carries every hard-block boundary, capability, verification, and anti-pattern responsibility from "Required Body Shape" above. Reach for it only when authoring another member of the deep-loop iteration family — do not invent a fresh dialect for a one-off agent. The concrete section order and its two sub-variants are in `assets/agent_template.md` §9.

### Ordered Creation Workflow

Follow this order for new agents and material rewrites:

1. Read the request and define the proposed role, authority boundary, and likely runtime directory.
2. Decide whether the task truly needs a new agent instead of a skill, command, or existing agent.
3. Search existing agents for overlap before creating a new one.
4. Resolve the active runtime directory and target filename.
5. Read `assets/agent_template.md` and use it as the scaffold; do not invent a new structure from scratch.
6. Draft frontmatter first, especially `mode`, `temperature`, and each `permission` value.
7. Confirm permissions against actual role needs before writing tool-heavy instructions.
8. Write the hard boundary section before the general workflow.
9. Write the core workflow and capability scan.
10. Add explicit output verification, anti-patterns, and related resources.
11. Link supporting skills, commands, references, and companion agents rather than copying their full guidance.
12. Remove template placeholders and check that the document stays focused on the runtime role.
13. Validate markdown structure, frontmatter, runtime placement, permission consistency, and related links.
14. Deliver only after validation passes or after reporting the exact blocker.

When the user invokes `/create:agent`, treat the command as the preferred entry point, but keep this same creation contract as the source of truth for the generated file.

### Validation Gate

Before delivery, verify document quality and runtime correctness.

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/agent-name.md --type agent
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/agents/agent-name.md
```

Use `.claude/agents/agent-name.md` instead when Claude Code is the active runtime.

Required checks: frontmatter parses, filename stem matches `name`, required sections are present, runtime directory is correct, permissions match authority, `task` matches orchestration intent, related resources exist, and unresolved markdown links are reported.

---

## 4. RULES

### ALWAYS

1. Decide agent vs skill vs command before writing the file.
2. Search existing agents before creating a new one.
3. Use the active runtime agent directory, not a convenient nearby path.
4. Keep filename stem and frontmatter `name` identical.
5. Use the runtime-correct frontmatter schema — `permission:` object for `.opencode/agents/`, `tools:` allow-list for `.claude/agents/` — with explicit least-authority choices.
6. Set `task: allow` only when orchestration is the agent's explicit authority.
7. Include hard boundary, core workflow, capability scan, output verification, anti-patterns, and related resources.
8. Keep deep domain knowledge in skills or references and link to it.
9. Validate with `../shared/scripts/validate_document.py` before delivery.
10. Keep this packet self-contained and leave advisor graph identity at the `sk-doc` hub root.

### NEVER

1. Never add `graph-metadata.json` to this packet.
2. Never create an agent for reusable knowledge alone.
3. `tools:` is runtime-specific, not obsolete: it is Claude Code's canonical schema. Never emit `tools:` under `.opencode/agents/`, and never emit a bare `permission:` block under `.claude/agents/`.
4. Never grant broad permissions because they might be useful later.
5. Never give a LEAF agent `task: allow`.
6. Never paste full skill guidance into an agent body.
7. Never write an agent into the wrong runtime directory.
8. Never leave placeholders from `assets/agent_template.md` in the final file.
9. Never claim completion before validation passes or the blocker is reported.

### ESCALATE IF

1. The requested role's authority boundary is unclear.
2. Existing agents already cover the requested role.
3. The requested permissions exceed the stated purpose.
4. Runtime placement is ambiguous.
5. The user asks for a component that mixes agent, skill, and command responsibilities without a clear owner.
6. Validation fails with blocking frontmatter, section, or markdown errors.

---

## 5. SUCCESS CRITERIA

The agent file is done only when all of the following hold:

1. The file lives in the active runtime agent directory, and the filename stem matches frontmatter `name`.
2. Frontmatter uses the runtime-correct schema — `permission:` object for `.opencode/agents/`, `tools:` allow-list for `.claude/agents/` — with explicit least-authority choices, and `task`/`Task` granted only when orchestration is the agent's explicit authority.
3. The body carries every required section: hard boundary, core workflow, capability scan, output verification, anti-patterns, and related resources.
4. Deep domain knowledge is linked to skills or references rather than pasted into the agent body, and no template placeholders remain.
5. `validate_document.py` and `extract_structure.py` run clean, and completion is claimed only after they pass or the exact blocker is reported.

---

## 6. REFERENCES

Use these only when the core path above is not enough:

1. `references/README.md` — route map over the overflow references below.
2. `references/agent-vs-skill-vs-command.md` for the deeper agent vs skill vs command decision and its signals.
3. `references/permission_design.md` for `mode` selection and least-authority permission design.
4. `references/common_pitfalls.md` for recurring mistakes with why-it-breaks and correct fixes.
5. `assets/agent_template.md` for exhaustive body variants, binding/refusal contracts, and scaffold examples.
6. `../shared/references/validation.md` for validation pipeline details.
7. `../shared/references/core_standards.md` for shared document structure rules.
