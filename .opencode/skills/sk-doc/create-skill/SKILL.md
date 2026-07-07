---
name: create-skill
description: Scaffold OpenCode skills and parent hubs for the sk-doc family, covering standalone skills and two-axis parent hubs with nested workflow or surface packets.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.0.0
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
    |   +- scripts/init_skill.py
    |   +- assets/skill/skill_md_template.md
    |   +- assets/skill/skill_readme_template.md
    |
    +- Parent hub -> workflowMode: create-skill-parent
        +- assets/parent_skill/parent_skill_hub_template.md
        +- assets/parent_skill/parent_skill_registry_template.json
        +- assets/parent_skill/parent_skill_hub_router_template.json
```

### Route Selection

Choose `create-skill` when the artifact is one skill with one advisor identity and one runtime contract.

Choose `create-skill-parent` when the artifact is one advisor-routable hub that dispatches to nested workflow packets or read-only surface packets.

Ask one focused clarification before authoring if it is unclear whether the user wants a standalone skill or a parent hub.

### Resource Domains

| Domain | Core Resources | Use |
| --- | --- | --- |
| Scaffolding | `scripts/init_skill.py`, `assets/skill/skill_md_template.md`, `assets/skill/skill_readme_template.md` | Create or normalize standalone skill files. |
| Resource templates | `assets/skill/skill_reference_template.md`, `assets/skill/skill_asset_template.md`, `assets/skill/skill_smart_router.md` | Create routed references, assets, and resilient smart-router pseudocode. |
| Procedure cards | `assets/skill/skill_procedure_template.md` | Add a private, triggerable internal procedure to a skill or mode without a new public identity. |
| Parent hubs | `assets/parent_skill/parent_skill_*` | Create hub SKILL, registry, router, description, and graph metadata files. |
| Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
| Overflow detail | `references/README.md`, `references/{shared,skill,parent_skill}/`, `../shared/` | Load only for edge cases, exhaustive examples, or schema details beyond this SKILL.md. |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"
RESOURCE_KEY_BY_MODE = {
    "create-skill": "skill",
    "create-skill-parent": "parent_skill",
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the artifact is a standalone skill or parent hub",
    "Confirm the target skill folder and intended advisor identity",
    "Provide one concrete trigger, output contract, or resource example",
    "Confirm the validation command before completion",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path: str, inventory: set[str], loaded: list[str], seen: set[str]) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route_skill_authoring_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    if asks_for_parent_hub_or_mode_registry(request):
        workflow_mode = "create-skill-parent"
    elif asks_for_nested_workflow_or_surface_packets(request):
        workflow_mode = "create-skill-parent"
    elif asks_for_one_skill_package(request):
        workflow_mode = "create-skill"
    elif unclear_standalone_vs_parent(request):
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }
    else:
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {"load_level": "DEFER", "next": "matching sk-doc packet", "resources": loaded}

    routing_key = RESOURCE_KEY_BY_MODE[workflow_mode]
    shared_refs = sorted(path for path in inventory if path.startswith("references/shared/"))
    keyed_refs = sorted(path for path in inventory if path.startswith(f"references/{routing_key}/"))
    keyed_assets = sorted(path for path in inventory if path.startswith(f"assets/{routing_key}/"))

    if not keyed_refs and not keyed_assets:
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "workflowMode": workflow_mode,
            "routing_key": routing_key,
            "notice": f"No create-skill resources found for routing key '{routing_key}'",
            "resources": loaded,
        }

    for path in shared_refs + keyed_refs + keyed_assets:
        load_if_available(path, inventory, loaded, seen)

    return {"workflowMode": workflow_mode, "routing_key": routing_key, "resources": loaded}
```

---

## 3. HOW IT WORKS

### Standalone Skill Creation Workflow

Follow these steps in order, skipping only when the target skill already exists and the skipped step is plainly not applicable.

1. Understand the skill through concrete examples.
2. Identify direct user examples or generate examples and validate them with the user when needed.
3. Clarify the skill purpose, trigger phrases, output contract, tool needs, and boundaries.
4. Ask only the most important missing questions first; conclude this step when the supported functionality is clear.
5. Plan reusable skill contents before writing final instructions.
6. For each expected use case, decide whether repeated work belongs in `scripts/`, `references/`, or `assets/`.
7. Put deterministic or repeatedly rewritten code in `scripts/`.
8. Put domain knowledge, schemas, policies, workflows, and detailed guidance in `references/`.
9. Put templates, boilerplate, images, or output resources in `assets/`.
10. Put a private, triggerable procedure in `references/procedures/` using `assets/skill/skill_procedure_template.md` when the skill has multiple distinct, individually-selected internal processes rather than one dominant workflow.
11. Scaffold a new skill when creating a new folder with `scripts/init_skill.py <skill-name> --path <output-directory>`.
12. Normalize generated files to this repo's section order after scaffolding.
13. Delete generated example files and directories that the final skill does not need.
14. Create reference markdown from `assets/skill/skill_reference_template.md`.
15. Create asset markdown from `assets/skill/skill_asset_template.md`.
16. Use snake_case filenames for `references/` and `assets/` markdown.
17. Create `README.md` from `assets/skill/skill_readme_template.md` when operators need quick start, examples, troubleshooting, or a package map.
18. Author `SKILL.md` as the executable runtime contract, not as a link farm.
19. Keep `WHEN TO USE` limited to activation triggers, use cases, keyword triggers, and when-not-to-use boundaries.
20. Put resource selection in `SMART ROUTING`, including detection signals, resource domains, loading levels, and smart-router pseudocode.
21. Put the ordered execution path and decision points in `HOW IT WORKS`.
22. Put required actions, forbidden actions, and escalation conditions in `RULES`.
23. Put completion checks in `SUCCESS CRITERIA`.
24. Put references only as overflow pointers for deep detail, examples, or schemas.
25. Run `scripts/package_skill.py <path/to/skill-folder> --check` before claiming the skill is complete.
26. Fix every hard failure and rerun the check until it exits clean.
27. Package only after validation passes with `scripts/package_skill.py <path/to/skill-folder> <output-directory>`.
28. Iterate after real usage by improving unclear instructions, adding missing resources, trimming bloated `SKILL.md` content into references, and improving trigger descriptions.

### Required Standalone Skill Shape

```text
skill-name/
├── SKILL.md
├── README.md
├── references/
├── assets/
└── scripts/
```

`SKILL.md` is required. `README.md`, `references/`, `assets/`, and `scripts/` are optional only when they are genuinely unnecessary.

### SKILL.md Frontmatter Contract

Every `SKILL.md` must include:
- `name`: lowercase hyphen-case and matching the folder name.
- `description`: single-line, specific, non-placeholder routing description.
- `allowed-tools`: YAML array format such as `[Read, Write, Edit, Bash, Grep, Glob]`.
- `version`: four-part `X.Y.Z.W`.

Every authored `references/*.md` and markdown asset should carry the full reference/asset frontmatter block from the packet templates, including `version`. `README.md` is exempt from the full reference block but still uses the README template frontmatter.

### Parent Hub Creation Workflow

Use the parent-hub path when one public skill identity must dispatch to multiple packets.

1. Confirm the hub is one advisor-routable identity, not multiple standalone skills.
2. Keep the hub routing-only; nested packets own detailed workflows, evidence, examples, tool boundaries, and validation.
3. Create the hub root with `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `changelog/`, `manual_testing_playbook/`, and `benchmark/`.
4. Create each nested packet with `SKILL.md`, `README.md`, and `changelog/`.
5. Add `references/` and `assets/` to surface packets when they carry evidence material.
6. Give a workflow packet its own `procedures/` folder, using `assets/skill/skill_procedure_template.md`, when it has multiple distinct, individually-triggered internal processes; use `shared/procedures/` only for a card that genuinely coordinates two or more packets.
7. Do not add `graph-metadata.json` to nested workflow packets or surface packets.
8. Define every packet in one `mode-registry.json > modes[]` array.
9. Use `packetKind: "workflow"` for lifecycle or process packets.
10. Use `packetKind: "surface"` for read-only evidence packets.
11. For every `modes[]` entry, define `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, `grandfatheredFolderMismatch`, `aliases`, and `advisorRouting`.
12. Keep `folder == packetSkillName` for all new packets.
13. Set `grandfatheredFolderMismatch: false` unless preserving an existing mismatch.
14. Keep aliases unique across all modes.
15. Put all workflow and surface packets in `modes[]`; never create a second array such as `surfacePackets[]`.
16. Create `hub-router.json` with `routerPolicy`, `routerSignals`, and `vocabularyClasses`.
17. Ensure `routerSignals` keys match `mode-registry.json > modes[].workflowMode` exactly.
18. Ensure `routerPolicy.tieBreak` lists every registry mode once, with workflow modes before surface packets.
19. Ensure router outcomes include `single`, `orderedBundle`, `defer`, and `surfaceBundle`.
20. Ensure all router resources are hub-root-relative, packet-qualified paths that resolve on disk.
21. Use named `extensions` only when real routing semantics require them; do not add extra directory tiers for extensions.

### Parent Hub Shape

```text
parent-hub/
├── SKILL.md
├── mode-registry.json
├── hub-router.json
├── description.json
├── graph-metadata.json
├── changelog/
├── manual_testing_playbook/
├── benchmark/
├── workflow-packet/
│   ├── SKILL.md
│   ├── README.md
│   ├── procedures/       (optional - only if the packet has multiple distinct, triggered procedures)
│   └── changelog/
└── surface-packet/
    ├── SKILL.md
    ├── README.md
    ├── references/
    ├── assets/
    └── changelog/
```

### Validation And Packaging Gate

Run the completion gate before any completion claim:

```bash
scripts/package_skill.py <path/to/skill-folder> --check
```

`--check` hard-fails on missing SKILL frontmatter or required fields, non-four-part versions, folder/name mismatches, missing required sections, malformed names, and descriptions that are missing, multiline, or contain angle brackets. It warns (does not fail) on TODO-placeholder descriptions, non-snake_case filenames in `references/` and `assets/`, missing resource-doc frontmatter, and absent smart-router markers.

Use structure extraction when quality evidence is needed:

```bash
../shared/scripts/extract_structure.py <path/to/skill/SKILL.md>
```

Package only after validation passes:

```bash
scripts/package_skill.py <path/to/skill-folder> <output-directory>
```

---

## 4. RULES

### ALWAYS

1. Read existing target skill or hub files before editing them.
2. Select `create-skill` or `create-skill-parent` before authoring.
3. Build the skill for another AI agent instance to execute; include information that is beneficial and non-obvious.
4. Use local templates under `assets/skill/` rather than inventing file shapes from memory.
5. Keep `SKILL.md` under 5k words and focused on activation, routing, core workflow, rules, and success criteria.
6. Move deep examples, schemas, edge cases, and long guidance into `references/`.
7. Keep `WHEN TO USE` free of file references and navigation tables.
8. Keep one authoritative routing source in `SMART ROUTING`.
9. Delete TODO placeholders and generated example files before validation.
10. Run `scripts/package_skill.py <path> --check` before calling the scaffold complete.
11. Use `assets/skill/skill_procedure_template.md` for a private, triggerable internal procedure; use `assets/skill/skill_reference_template.md` when no trigger-based selection is needed.

### NEVER

1. Never defer the core executable creation workflow out of `SKILL.md`.
2. Never create multiple advisor identities when the requested artifact is a parent hub.
3. Never add `graph-metadata.json` to a nested workflow or surface packet.
4. Never add `surfacePackets[]` or another parallel registry array.
5. Never create new folder/name mismatches for convenience.
6. Never use multiline YAML descriptions in skill frontmatter.
7. Never leave angle-bracket placeholders, TODO text, or generic descriptions in shipped artifacts.
8. Never claim automatic platform behavior that OpenCode does not provide; document manual verification instead.
9. Never package or distribute a skill before validation passes.
10. Never broaden into unrelated sk-doc artifact types.

### ESCALATE IF

1. It is unclear whether the target should be a standalone skill or parent hub.
2. Tool permissions, mutation authority, or advisor identity boundaries are ambiguous.
3. Existing folder names conflict with required `name` or `packetSkillName` rules.
4. A parent hub needs routing semantics beyond the core two-tier model.
5. Validation fails for reasons that would require changing the public contract.

---

## 5. SUCCESS CRITERIA

- The correct workflow mode was selected: `create-skill` or `create-skill-parent`.
- Concrete trigger examples, boundaries, tool needs, and output contracts are reflected in the artifact.
- Standalone skills contain valid frontmatter, executable `SKILL.md` workflow content, useful resources, and no placeholder examples.
- Parent hubs contain one hub identity, one `modes[]` registry, valid router metadata, and nested packets without packet-local graph metadata.
- References and assets use the packet templates and snake_case filenames.
- `scripts/package_skill.py <path> --check` exits clean, or exact blockers are reported.
- Shared doc-quality standards from `../shared` were applied when quality evidence was needed.

---

## 6. REFERENCES

Use these only for overflow detail, exhaustive examples, or schema checks beyond the core workflow above.

- `references/README.md` - route map for the full reference set.
- `references/shared/overview.md` - deeper anatomy, layered-doc structure, and resource placement guidance.
- `references/skill/creation_workflow.md` - expanded examples for the six-step standalone workflow.
- `references/shared/validation_and_packaging.md` - detailed validation, packaging, and distribution notes.
- `references/shared/common_pitfalls.md` - examples of recurring trigger, YAML, style, and context-budget defects.
- `references/parent_skill/parent_skills_nested_packets.md` - detailed parent-hub and nested-packet model.
- `references/parent_skill/parent_hub_router_schema.md` - full router and registry schema.
- `assets/skill/skill_md_template.md` - standalone skill SKILL.md template.
- `assets/skill/skill_readme_template.md` - skill README template.
- `assets/skill/skill_reference_template.md` - reference markdown template.
- `assets/skill/skill_asset_template.md` - asset markdown template.
- `assets/skill/skill_smart_router.md` - resilient smart-router pattern.
- `assets/skill/skill_procedure_template.md` - private procedure card templates and guidelines.
- `assets/parent_skill/parent_skill_*` - parent hub templates.
- `scripts/init_skill.py` - standalone skill scaffold helper.
- `scripts/package_skill.py` - validation and packaging helper.
- `../shared/references/global/core_standards.md` - shared markdown standards.
- `../shared/references/global/validation.md` - shared validation workflow.
