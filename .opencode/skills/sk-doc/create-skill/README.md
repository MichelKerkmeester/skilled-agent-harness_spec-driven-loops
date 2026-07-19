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
- `references/skill/creation-workflow.md`: standalone skill creation workflow.
- `references/skill/examples-and-maintenance.md`: examples and maintenance guidance.
- `references/shared/overview.md`: skill structure and authoring overview.
- `references/shared/common-pitfalls.md`: common mistakes to avoid.
- `references/shared/validation-and-packaging.md`: validation and packaging gates.
- `references/parent-skill/parent-skills-nested-packets.md`: parent-hub and nested-packet model.
- `references/parent-skill/parent-hub-router-schema.md`: registry and router schema.
- `assets/skill/skill-md-template.md`: standalone `SKILL.md` template.
- `assets/skill/skill-readme-template.md`: standalone skill README template.
- `assets/skill/skill-reference-template.md`: reference-file template.
- `assets/skill/skill-asset-template.md`: asset-file template.
- `assets/skill/skill-smart-router.md`: router-heavy skill pattern.
- `assets/skill/skill-procedure-template.md`: private procedure card templates and guidelines.
- `assets/parent-skill/parent-skill-hub-template.md`: parent hub `SKILL.md` template.
- `assets/parent-skill/parent-skill-registry-template.json`: parent hub `mode-registry.json` template.
- `assets/parent-skill/parent-skill-hub-router-template.json`: parent hub router template.
- `assets/parent-skill/parent-skill-description-template.json`: parent hub descriptor template.
- `assets/parent-skill/parent-skill-graph-metadata-template.json`: parent hub graph metadata template.
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
references/parent-skill/parent-skills-nested-packets.md
references/parent-skill/parent-hub-router-schema.md
assets/parent-skill/parent-skill-*
```

## 5. IMPORTANT BOUNDARIES

This packet is nested under the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`, including global standards and shared validators.

The single advisor identity and registry live at the `sk-doc` hub root, not inside this packet.

Nested packets must not carry their own `graph-metadata.json`.
