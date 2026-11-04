### .skilled/skills/sk-doc/sk-create-agent/README.md
- [P2] .skilled/skills/sk-doc/sk-create-agent/README.md:29 | 4 | OVERVIEW opens with `### Why This Skill Exists` before `### What It Does`; `skill-readme-template.md` §2 says "Inside OVERVIEW, start with `### What It Does`. Add up to two optional subsections after it." | move lines 29-32 to after line 36
- [P2] .skilled/skills/sk-doc/sk-create-agent/README.md:142 | 8 | RELATED DOCUMENTS omits `ROUTER.md`, a root file of the packet it indexes (the template scaffold lists `SKILL.md` then `ROUTER.md` first) | insert after line 146: `| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |`

### .skilled/skills/sk-doc/sk-create-agent/ROUTER.md
- clean

### .skilled/skills/sk-doc/sk-create-agent/SKILL.md
- [P2] .skilled/skills/sk-doc/sk-create-agent/SKILL.md:45 | 1 | §2 SMART ROUTING carries 5 non-blank prose lines; `skill-md-template.md` §1 requires "8 to 12 non-blank lines of plain prose" | replace lines 45-51 with:
```
The `sk-doc` hub routes runtime-persona work here: a request to create or update one agent file.
The hub's `sk-create-agent` signal selects this packet.
Stay in this packet only when the artifact is a concrete runtime agent file whose authority boundary no existing agent already covers.
A skill, a command or an existing agent answers the rest.

`references/README.md` is the route map.
It is also the fallback when the component or runtime is unclear.
A resolved request loads this packet's flat references and assets first, with `assets/agent-template.md` as the scaffold.

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources.
Open only the matched files.
```
- [P2] .skilled/skills/sk-doc/sk-create-agent/SKILL.md:153 | 7 | one paragraph packs four parallel boundary variants (write-capable LEAF, read-only LEAF, orchestrator, command-driven) into semicolon clauses | replace line 153 with:
```
Boundary variants:

- LEAF write-capable agents deny nested sub-agent dispatch and restrict mutation to explicitly scoped paths.
- LEAF read-only agents deny nested dispatch and all file mutation.
- Orchestrators may dispatch only when orchestration is their explicit authority and `task` permission allows it.
- Command-driven or machine-validated agents may need input/scope gates before workflow steps.
```

### .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md
- [P1] .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:18 | 9 | `Last Updated: 2026-05-03 (post-063 alignment)` is a progress note carrying a packet number in the body; frontmatter `version` already carries currency | delete lines 18-19
- [P2] .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:113 | 6 | the `name`-regex rule sits directly under `### Mode Reference` and interrupts the mode table, though it governs the `name` field documented in the preceding block | move the paragraph at line 113 to the end of `### Required Fields`, immediately after line 98

### .skilled/skills/sk-doc/sk-create-agent/references/README.md
- clean

### .skilled/skills/sk-doc/sk-create-agent/references/agent-vs-skill-vs-command.md
- [P2] .skilled/skills/sk-doc/sk-create-agent/references/agent-vs-skill-vs-command.md:25 | 4 | `## 1. OVERVIEW` has a purpose paragraph and `**Core Principle**` but no When to Use block; the reference skeleton puts Purpose and When to Use ahead of Core Principle | insert after line 23:
```
**When to Use**:

- You are choosing a component type before authoring anything.
- A request could plausibly become an agent, a skill or a command.
- An existing component feels too heavy or too thin for the job it carries.
```

### .skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md
- [P2] .skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md:17 | 3 | intro sentence 3, "`SKILL.md` § RULES states these as NEVER lines; this file explains the *why* and the remedy.", is a pure pointer of the banned "This reference explains..." form and pushes the intro to three sentences | move that sentence to the end of line 23
- [P2] .skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md:25 | 4 | `## 1. OVERVIEW` has no When to Use block before `**Core Principle**` | insert after line 23, before the `**Core Principle**` line:
```
**When to Use**:

- Reviewing a draft agent before it ships.
- An agent fails to resolve, over-permits, or bloats over time.
- Validation flags a structural defect and you want the cause and the fix.
```

### .skilled/skills/sk-doc/sk-create-agent/references/permission-design.md
- [P2] .skilled/skills/sk-doc/sk-create-agent/references/permission-design.md:25 | 4 | `## 1. OVERVIEW` has no When to Use block before `**Core Principle**` | insert after line 23, before the `**Core Principle**` line:
```
**When to Use**:

- Choosing `mode` for a new agent.
- Scoping a `permission` value and justifying every `allow`.
- Deciding whether a `tools:` list still belongs in the file.
```
- [P2] .skilled/skills/sk-doc/sk-create-agent/references/permission-design.md:29 | 6 | `## 2. MODE SELECTION` opens with mode rules but its fourth bullet (line 34) is a `temperature` rule, a separate frontmatter field the heading does not name | replace line 29 with `## 2. MODE AND TEMPERATURE SELECTION`
