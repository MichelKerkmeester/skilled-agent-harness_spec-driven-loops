---
title: "Create Skill Router"
description: "Sibling router for sk-create-skill: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-skill router"
  - "sk-create-skill routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Skill Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-skill/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this packet when they ask to create or rebuild an OpenCode skill under `.skilled/skills/`, to run `/create:skill` for a standalone skill or `/create:skill-parent` for a parent hub, to author or repair a skill package's `SKILL.md`, `README.md`, `references/`, `assets/`, `scripts/` or `changelog/`, or to validate and package a skill with `scripts/package_skill.py`. Its vocabulary is `create skill`, `new skill`, `skill scaffold`, `SKILL.md scaffold`, `OpenCode skill`, `parent hub`, `mode packet`, `nested workflow packet` and `package skill`. It routes to two resource families: the `references/shared/` doctrine and its root-metadata contract, which both modes load first, and the mode's own `references/<key>/` plus `assets/<key>/` trees, where `create-skill` resolves the `skill` key and `create-skill-parent` resolves `parent-skill`.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`SKILL_PACKAGE`** fires on `create skill`, `/create:skill`, `new skill`, `skill scaffold`, `SKILL.md scaffold`, `OpenCode skill`, `sk-skill`, `create sk-`, `reusable capability`, `reusable helper`, `starter reference docs` and `package skill` at weight 4. It loads the five shared docs — `references/shared/overview.md`, `references/shared/common-pitfalls.md`, `references/shared/validation-and-packaging.md`, `references/shared/advisor-index-handoff.md`, `references/shared/skill-root-metadata-contract.md` — then `references/skill/creation-workflow.md`, `references/skill/examples-and-maintenance.md`, `references/skill/upgrading-a-skill-to-v4.md`, and the nine `assets/skill/` templates: `assets/skill/skill-md-template.md`, `assets/skill/skill-readme-template.md`, `assets/skill/skill-reference-template.md`, `assets/skill/skill-asset-template.md`, `assets/skill/skill-procedure-template.md`, `assets/skill/skill-scaffold-template.md`, `assets/skill/skill-smart-router.md`, `assets/skill/skill-router-template.md`, `assets/skill/skill-sync-manifest-template.md`.
- **`PARENT_HUB`** fires on `/create:skill-parent`, `parent skill`, `parent hub`, `mode packet`, `nested workflow packet`, `mode-registry.json` and `hub-router.json` at weight 4. It loads the same five shared docs, then `references/parent-skill/parent-skills-nested-packets.md`, `references/parent-skill/parent-hub-router-schema.md`, `references/parent-skill/compiled-routing-architecture.md`, and the five `assets/parent-skill/` templates: `assets/parent-skill/parent-skill-hub-template.md`, `assets/parent-skill/parent-skill-readme-template.md`, `assets/parent-skill/parent-skill-root-router-template.md`, `assets/parent-skill/scaffold/hub-skill-scaffold.md`, `assets/parent-skill/scaffold/packet-skill-scaffold.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's mode tree, its route selection, the resource domains it loads and the smart-router pseudocode that reads them.

### Primary Detection Signal

```text
SKILL AUTHORING REQUEST
    |
    +- Standalone skill -> workflowMode: sk-create-skill
    |   +- scripts/init_skill.py
    |   +- assets/skill/skill-md-template.md
    |   +- assets/skill/skill-readme-template.md
    |   +- assets/skill/skill-sync-manifest-template.md
    |
    +- Parent hub -> workflowMode: sk-create-skill-parent
        +- assets/parent-skill/parent-skill-hub-template.md
        +- assets/parent-skill/parent-skill-registry-template.json
        +- assets/parent-skill/parent-skill-hub-router-template.json
```

### Route Selection

Choose `create-skill` when the artifact is one skill with one advisor identity and one runtime contract.

Choose `create-skill-parent` when the artifact is one advisor-routable hub that dispatches to nested workflow packets or read-only surface packets.

Ask one focused clarification before authoring if it is unclear whether the user wants a standalone skill or a parent hub.

### Resource Domains

| Domain | Core Resources | Use |
| --- | --- | --- |
| Scaffolding | `scripts/init_skill.py`, `assets/skill/skill-md-template.md`, `assets/skill/skill-readme-template.md`, `assets/skill/skill-router-template.md` | Create or normalize standalone skill files. |
| Resource templates | `assets/skill/skill-reference-template.md`, `assets/skill/skill-asset-template.md`, `assets/skill/skill-smart-router.md` | Create routed references, assets, and resilient smart-router pseudocode. |
| Runtime sync manifests | `assets/skill/skill-sync-manifest-template.md` | Document how a runtime config dir derives from the canonical `.skilled` tree (SYNC manifest). |
| Procedure cards | `assets/skill/skill-procedure-template.md` | Add a private, triggerable internal procedure to a skill or mode without a new public identity. |
| Parent hubs | `assets/parent-skill/parent-skill-*` | Create hub SKILL, registry, router, description, and graph metadata files. |
| Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
| Leaf-route replay | `scripts/leaf-route-replay.cjs` | Replay the committed stage-two keyword block of each hub's `ROUTER.md` against its gold scenarios with zero model calls. `--transcripts` recounts `ROUTER.md` reads and `--prose` compares the prose arm. |
| Overflow detail | `references/README.md`, `references/{shared,skill,parent-skill}/`, `../shared/` | Load only for edge cases, exhaustive examples, or schema details beyond this SKILL.md. |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"
RESOURCE_KEY_BY_MODE = {
    "sk-create-skill": "skill",
    "sk-create-skill-parent": "parent-skill",
}

INTENT_MODEL = {
    "SKILL_PACKAGE": {"weight": 4, "keywords": ["create skill", "/create:skill", "new skill", "skill scaffold", "skill.md scaffold", "opencode skill", "sk-skill", "create sk-", "reusable capability", "reusable helper", "starter reference docs", "package skill"]},
    "PARENT_HUB": {"weight": 4, "keywords": ["/create:skill-parent", "parent skill", "parent hub", "mode packet", "nested workflow packet", "mode-registry.json", "hub-router.json"]},
}

# The keyed selection below resolves to exactly these sets. Enumerating them keeps
# the routed inventory legible to a reader and to the connectivity scan, which is
# what catches a new reference that the keyed load silently picks up but no
# documented route names.
RESOURCE_MAP = {
    "SKILL_PACKAGE": [
        "references/shared/overview.md",
        "references/shared/common-pitfalls.md",
        "references/shared/validation-and-packaging.md",
        "references/shared/advisor-index-handoff.md",
        "references/shared/skill-root-metadata-contract.md",
        "references/skill/creation-workflow.md",
        "references/skill/examples-and-maintenance.md",
        "references/skill/upgrading-a-skill-to-v4.md",
        "assets/skill/skill-md-template.md",
        "assets/skill/skill-readme-template.md",
        "assets/skill/skill-reference-template.md",
        "assets/skill/skill-asset-template.md",
        "assets/skill/skill-procedure-template.md",
        "assets/skill/skill-scaffold-template.md",
        "assets/skill/skill-smart-router.md",
        "assets/skill/skill-router-template.md",
        "assets/skill/skill-sync-manifest-template.md",
    ],
    "PARENT_HUB": [
        "references/shared/overview.md",
        "references/shared/common-pitfalls.md",
        "references/shared/validation-and-packaging.md",
        "references/shared/advisor-index-handoff.md",
        "references/shared/skill-root-metadata-contract.md",
        "references/parent-skill/parent-skills-nested-packets.md",
        "references/parent-skill/parent-hub-router-schema.md",
        "references/parent-skill/compiled-routing-architecture.md",
        "assets/parent-skill/parent-skill-hub-template.md",
        "assets/parent-skill/parent-skill-readme-template.md",
        "assets/parent-skill/parent-skill-root-router-template.md",
        "assets/parent-skill/scaffold/hub-skill-scaffold.md",
        "assets/parent-skill/scaffold/packet-skill-scaffold.md",
    ],
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
        workflow_mode = "sk-create-skill-parent"
    elif asks_for_nested_workflow_or_surface_packets(request):
        workflow_mode = "sk-create-skill-parent"
    elif asks_for_one_skill_package(request):
        workflow_mode = "sk-create-skill"
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
