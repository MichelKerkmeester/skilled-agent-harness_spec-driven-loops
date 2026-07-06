---
name: create-skill
description: Scaffold OpenCode skills and parent hubs for the sk-doc family, covering standalone skills and two-axis parent hubs with nested workflow or surface packets.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-skill, create-skill-parent, skill scaffolding, parent hub, nested workflow packet, mode-registry, hub-router, package-skill, init-skill, /create:sk-skill, /create:sk-skill-parent -->

# Create Skill

`create-skill` is the skill-authoring workflow packet of the `sk-doc` parent hub. It owns standalone OpenCode skill scaffolding and parent-hub scaffolding through two workflow modes: `create-skill` and `create-skill-parent`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:
- Creating or rebuilding an OpenCode skill under `.opencode/skills/`.
- Running `/create:sk-skill` for a standalone skill with its own advisor identity.
- Running `/create:sk-skill-parent` for a parent hub with nested workflow or surface packets.
- Authoring or repairing `SKILL.md`, `README.md`, `references/`, `assets/`, `scripts/`, or `changelog/` for a skill package.
- Creating parent-hub router files such as `mode-registry.json`, `hub-router.json`, `description.json`, or hub-level `graph-metadata.json`.
- Validating and packaging a skill with `scripts/package_skill.py`.

Keyword triggers: `create skill`, `new skill`, `skill scaffold`, `OpenCode skill`, `parent skill`, `parent hub`, `mode packet`, `workflowMode`, `mode-registry`, `hub-router`, `package skill`, `/create:sk-skill`, `/create:sk-skill-parent`.

### When NOT to Use

Skip this packet when:
- The user asks for agent scaffolding, command scaffolding, README creation, benchmark folders, feature catalogs, or manual testing playbooks. Route to the matching sk-doc packet.
- The task is only quality review of an existing document. Route to `doc-quality`.
- The task is application code implementation. Route to `sk-code`.
- The user only needs conceptual advice and no artifact authoring or validation.

### Packet Boundary

This packet may create and edit skill artifacts. It does not own the sk-doc hub identity, and this nested workflow packet must not carry its own `graph-metadata.json`.

---

## 2. SMART ROUTING

### Primary Detection Signal

```text
SKILL AUTHORING REQUEST
    |
    +- Standalone skill -> workflowMode: create-skill
    |   +- references/skill_creation.md
    |   +- references/skill_creation/creation_workflow.md
    |   +- assets/skill/skill_md_template.md
    |   +- scripts/init_skill.py
    |
    +- Parent hub -> workflowMode: create-skill-parent
        +- references/skill_creation/parent_skills_nested_packets.md
        +- references/skill_creation/parent_hub_router_schema.md
        +- assets/skill/parent_skill_hub_template.md
        +- assets/skill/parent_skill_registry_template.json
        +- assets/skill/parent_skill_hub_router_template.json
```

### Resource Domains

| Domain | Resources | Purpose |
| --- | --- | --- |
| Skill workflow | `references/skill_creation.md`, `references/skill_creation/creation_workflow.md` | Six-step lifecycle: understand, plan, initialize, edit, package, iterate. |
| Skill structure | `references/skill_creation/overview.md`, `assets/skill/skill_md_template.md`, `assets/skill/skill_readme_template.md` | Required frontmatter, section order, README shape, progressive disclosure. |
| Skill resources | `assets/skill/skill_reference_template.md`, `assets/skill/skill_asset_template.md`, `assets/skill/skill_smart_router.md` | Reference and asset frontmatter, resilient router pattern. |
| Parent hubs | `references/skill_creation/parent_skills_nested_packets.md`, `references/skill_creation/parent_hub_router_schema.md` | Hub, packet, registry, router, and `packetKind` rules. |
| Parent templates | `assets/skill/parent_skill_*` | Hub SKILL, registry, router, description, and graph metadata templates for target hubs. |
| Automation | `scripts/init_skill.py`, `scripts/package_skill.py` | Scaffold, validate, and package skill folders. |
| Shared quality | `../shared/references/global/*`, `../shared/scripts/*` | Doc standards, frontmatter/version checks, structure extraction, validation. |

### Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any invocation | `references/skill_creation.md`, `../shared/references/global/core_standards.md`, `../shared/references/global/validation.md` |
| CONDITIONAL | Standalone skill | `creation_workflow.md`, `overview.md`, `common_pitfalls.md`, `skill_md_template.md`, `skill_readme_template.md` |
| CONDITIONAL | Parent hub | `parent_skills_nested_packets.md`, `parent_hub_router_schema.md`, `parent_skill_hub_template.md`, `parent_skill_registry_template.json`, `parent_skill_hub_router_template.json` |
| CONDITIONAL | Validation or release | `validation_and_packaging.md`, `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` |
| ON_DEMAND | Router-heavy skill | `assets/skill/skill_smart_router.md` |

---

## 3. HOW IT WORKS

### Standalone Skill Workflow

1. Clarify the skill's concrete trigger examples, output contract, tool needs, and boundaries.
2. Plan reusable `references/`, `assets/`, and `scripts/` before writing `SKILL.md`.
3. Scaffold with `python3 scripts/init_skill.py <skill-name> --path <target-dir>` when creating a new folder.
4. Replace generated placeholders with real workflow content using `assets/skill/skill_md_template.md` and `assets/skill/skill_readme_template.md`.
5. Move deep instructions into `references/`; keep `SKILL.md` concise and routable.
6. Validate with `python3 scripts/package_skill.py <path/to/skill> --check`.
7. Run shared structure review with `python3 ../shared/scripts/extract_structure.py <path/to/skill/SKILL.md>` when quality evidence is needed.
8. Package with `python3 scripts/package_skill.py <path/to/skill> <output-dir>` only after validation passes.

### Parent Hub Workflow

1. Confirm the hub is one advisor-routable identity with nested packets, not separate advisor identities.
2. Define each mode in a single `mode-registry.json > modes[]` entry with `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, `aliases`, and `advisorRouting`.
3. Use `packetKind: "workflow"` for lifecycle/process packets and `packetKind: "surface"` for read-only evidence packets.
4. Create hub-root router files from the parent templates: `parent_skill_hub_template.md`, `parent_skill_registry_template.json`, `parent_skill_hub_router_template.json`, `parent_skill_description_template.json`, and `parent_skill_graph_metadata_template.json`.
5. Create each nested packet with its own `SKILL.md`, `README.md`, and `changelog/`.
6. Do not create `graph-metadata.json` inside nested packets; only the parent hub carries advisor graph identity.
7. Validate paths in `hub-router.json` and keep aliases unique across modes.

### Validation Gate

`package_skill.py --check` must pass before any completion claim. It checks required SKILL frontmatter, four-part version, folder/name match, required sections, and resource warnings. Use shared validators for document structure, frontmatter versioning, and global markdown standards.

---

## 4. RULES

### ALWAYS

1. Read the target skill or hub files before editing them.
2. Load the matching workflow reference before authoring: `creation_workflow.md` for standalone skills, `parent_skills_nested_packets.md` for parent hubs.
3. Use the packet's local templates under `assets/skill/` rather than inventing structure from memory.
4. Keep `SKILL.md` focused on activation, routing, workflow, rules, references, and success criteria.
5. Put reusable deep guidance in `references/`, deterministic helpers in `scripts/`, and reusable boilerplate in `assets/`.
6. Include a packet-local `README.md` and `changelog/` for nested workflow packets.
7. Run `scripts/package_skill.py <path> --check` before calling a skill scaffold complete.
8. Consume shared doc-quality standards through `../shared`; do not duplicate global validators in this packet.

### NEVER

1. Never add `graph-metadata.json` to a nested workflow or surface packet.
2. Never create multiple advisor identities when the user requested a parent hub.
3. Never add a second registry array such as `surfacePackets[]`; all packets belong in `modes[]`.
4. Never leave TODO placeholders in generated `SKILL.md`, README, references, assets, registry, or router files.
5. Never use multiline YAML descriptions or non-four-part versions in skill frontmatter.
6. Never package a skill before validation passes.
7. Never broaden into unrelated sk-doc artifact types.

### ESCALATE IF

1. It is unclear whether the user needs a standalone skill or a parent hub.
2. Tool permissions, mutation authority, or advisor identity boundaries are ambiguous.
3. Existing folder names conflict with `packetSkillName` or hub naming rules.
4. The target hub needs extensions beyond the core parent-hub pattern.
5. Validation fails for reasons that would require changing the public contract.

---

## 5. SUCCESS CRITERIA

- The correct workflow mode was selected: `create-skill` or `create-skill-parent`.
- Required references and templates were loaded before authoring.
- Standalone skills contain real frontmatter, concise workflow content, README, and only useful resources.
- Parent hubs contain a single hub identity, valid registry/router files, and nested packets without packet-local graph metadata.
- `scripts/package_skill.py <path> --check` exits clean or blockers are reported with exact errors.
- Shared doc-quality standards from `../shared` were applied.

---

## 6. REFERENCES

- `references/skill_creation.md` - skill lifecycle index and route map.
- `references/skill_creation/creation_workflow.md` - six-step standalone skill creation workflow.
- `references/skill_creation/validation_and_packaging.md` - validation and packaging gates.
- `references/skill_creation/parent_skills_nested_packets.md` - canonical parent-hub and nested-packet model.
- `references/skill_creation/parent_hub_router_schema.md` - registry and router schema.
- `assets/skill/skill_md_template.md` - standalone skill SKILL.md template.
- `assets/skill/skill_readme_template.md` - skill README template.
- `assets/skill/parent_skill_hub_template.md` - parent hub SKILL.md template.
- `assets/skill/parent_skill_registry_template.json` - parent hub mode registry template.
- `assets/skill/parent_skill_hub_router_template.json` - parent hub router template.
- `scripts/init_skill.py` - standalone skill scaffold helper.
- `scripts/package_skill.py` - validation and packaging helper.
- `../shared/references/global/core_standards.md` - shared markdown standards.
- `../shared/references/global/validation.md` - shared validation workflow.
