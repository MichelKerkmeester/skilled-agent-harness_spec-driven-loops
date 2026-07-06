# create-skill

Skill-authoring workflow packet for scaffolding OpenCode standalone skills and parent hubs.

## When To Use

Use `create-skill` when you need to create, rebuild, validate, or package an OpenCode skill under `.opencode/skills/`.

It covers two workflow modes:

- `create-skill`: standalone skill with its own advisor identity.
- `create-skill-parent`: parent hub with nested workflow or surface packets.

Use another `sk-doc` packet for agents, commands, READMEs, benchmarks, feature catalogs, manual testing playbooks, flowcharts, or document-quality review.

## What's Inside

- `SKILL.md`: authoritative packet contract, routing rules, workflows, success criteria, and boundaries.
- `README.md`: human-facing packet orientation.
- `changelog/`: packet-local changelog location.
- `references/skill_creation.md`: lifecycle index and route map.
- `references/skill_creation/creation_workflow.md`: six-step standalone skill creation workflow.
- `references/skill_creation/overview.md`: skill structure and authoring overview.
- `references/skill_creation/common_pitfalls.md`: common mistakes to avoid.
- `references/skill_creation/examples_and_maintenance.md`: examples and maintenance guidance.
- `references/skill_creation/validation_and_packaging.md`: validation and packaging gates.
- `references/skill_creation/parent_skills_nested_packets.md`: parent-hub and nested-packet model.
- `references/skill_creation/parent_hub_router_schema.md`: registry and router schema.
- `assets/skill/skill_md_template.md`: standalone `SKILL.md` template.
- `assets/skill/skill_readme_template.md`: standalone skill README template.
- `assets/skill/skill_reference_template.md`: reference-file template.
- `assets/skill/skill_asset_template.md`: asset-file template.
- `assets/skill/skill_smart_router.md`: router-heavy skill pattern.
- `assets/skill/parent_skill_hub_template.md`: parent hub `SKILL.md` template.
- `assets/skill/parent_skill_registry_template.json`: parent hub `mode-registry.json` template.
- `assets/skill/parent_skill_hub_router_template.json`: parent hub router template.
- `assets/skill/parent_skill_description_template.json`: parent hub descriptor template.
- `assets/skill/parent_skill_graph_metadata_template.json`: parent hub graph metadata template.
- `scripts/init_skill.py`: scaffold helper for new standalone skill folders.
- `scripts/package_skill.py`: validation and packaging helper.

## Quick Start

For a standalone skill:

```bash
python3 scripts/init_skill.py my-skill --path .opencode/skills/my-skill
python3 scripts/package_skill.py .opencode/skills/my-skill --check
```

For a parent hub, load the parent-hub references first, then use the parent templates for the hub root and nested packets:

```text
references/skill_creation/parent_skills_nested_packets.md
references/skill_creation/parent_hub_router_schema.md
assets/skill/parent_skill_*
```

## Important Boundaries

This packet is nested under the `sk-doc` parent hub.

The shared doc-quality backbone lives at `../shared`, including global standards and shared validators.

The single advisor identity and registry live at the `sk-doc` hub root, not inside this packet.

Nested packets must not carry their own `graph-metadata.json`.
