# create-skill

Skill-authoring workflow packet for scaffolding OpenCode standalone skills and parent hubs.

## 1. OVERVIEW

This workflow packet turns a skill-authoring request into a validated `.opencode/skills/` package, covering both standalone skills with their own advisor identity and parent hubs with nested workflow or surface packets. It scaffolds `SKILL.md`, references, and assets from the packet's templates, then validates and packages the result with `scripts/init_skill.py` and `scripts/package_skill.py` instead of inventing structure from scratch.

## 2. WHEN TO USE

Use `create-skill` when you need to create, rebuild, validate, or package an OpenCode skill under `.opencode/skills/`.

It covers two workflow modes:

- `create-skill`: standalone skill with its own advisor identity.
- `create-skill-parent`: parent hub with nested workflow or surface packets.

Use another `sk-doc` packet for agents, commands, READMEs, benchmarks, feature catalogs, manual testing playbooks, flowcharts, or document-quality review.

## 3. WHAT'S INSIDE

- `SKILL.md`: authoritative packet contract, routing rules, workflows, success criteria, and boundaries.
- `README.md`: human-facing packet orientation.
- `changelog/`: packet-local changelog location.
- `references/README.md`: lifecycle index and route map.
- `references/skill/creation_workflow.md`: standalone skill creation workflow.
- `references/skill/examples_and_maintenance.md`: examples and maintenance guidance.
- `references/shared/overview.md`: skill structure and authoring overview.
- `references/shared/common_pitfalls.md`: common mistakes to avoid.
- `references/shared/validation_and_packaging.md`: validation and packaging gates.
- `references/parent_skill/parent_skills_nested_packets.md`: parent-hub and nested-packet model.
- `references/parent_skill/parent_hub_router_schema.md`: registry and router schema.
- `assets/skill/skill_md_template.md`: standalone `SKILL.md` template.
- `assets/skill/skill_readme_template.md`: standalone skill README template.
- `assets/skill/skill_reference_template.md`: reference-file template.
- `assets/skill/skill_asset_template.md`: asset-file template.
- `assets/skill/skill_smart_router.md`: router-heavy skill pattern.
- `assets/skill/skill_procedure_template.md`: private procedure card templates and guidelines.
- `assets/parent_skill/parent_skill_hub_template.md`: parent hub `SKILL.md` template.
- `assets/parent_skill/parent_skill_registry_template.json`: parent hub `mode-registry.json` template.
- `assets/parent_skill/parent_skill_hub_router_template.json`: parent hub router template.
- `assets/parent_skill/parent_skill_description_template.json`: parent hub descriptor template.
- `assets/parent_skill/parent_skill_graph_metadata_template.json`: parent hub graph metadata template.
- `scripts/init_skill.py`: scaffold helper for new standalone skill folders.
- `scripts/package_skill.py`: validation and packaging helper.

## 4. QUICK START

For a standalone skill:

```bash
# --path is the PARENT directory; init_skill.py creates <path>/my-skill
python3 scripts/init_skill.py my-skill --path .opencode/skills
python3 scripts/package_skill.py .opencode/skills/my-skill --check
```

For a parent hub, load the parent-hub references first, then use the parent templates for the hub root and nested packets:

```text
references/parent_skill/parent_skills_nested_packets.md
references/parent_skill/parent_hub_router_schema.md
assets/parent_skill/parent_skill_*
```

## 5. IMPORTANT BOUNDARIES

This packet is nested under the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`, including global standards and shared validators.

The single advisor identity and registry live at the `sk-doc` hub root, not inside this packet.

Nested packets must not carry their own `graph-metadata.json`.
