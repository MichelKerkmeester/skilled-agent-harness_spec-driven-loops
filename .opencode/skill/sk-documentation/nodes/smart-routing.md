---
description: "Intent scoring and resource loading logic for the documentation workflows."
---
# Smart Routing

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/` for documentation standards, validation rules, optimization guidance, and execution workflows.
- `assets/documentation/` for README, frontmatter, llms.txt, and install-guide templates.
- `assets/opencode/` for skill, agent, and command creation templates.
- `assets/flowcharts/` for reusable ASCII flowchart patterns and diagram examples.

### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline     |
| CONDITIONAL | If intent signals match  | Mode-specific docs/templates |
| ON_DEMAND   | Only on explicit request | Extended standards/template  |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "DOC_QUALITY": {"weight": 4, "keywords": ["dqi", "quality", "validate", "extract_structure"]},
    "OPTIMIZATION": {"weight": 3, "keywords": ["optimize", "llms.txt", "ai context"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["skill creation", "new skill", "init_skill", "package_skill"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["create agent", "create command", "agent template", "command template"]},
    "FLOWCHART": {"weight": 3, "keywords": ["flowchart", "ascii diagram", "decision tree", "swimlane"]},
    "INSTALL_GUIDE": {"weight": 3, "keywords": ["install guide", "setup instructions", "prerequisite"]},
    "HVR": {"weight": 4, "keywords": ["human voice", "hvr", "voice rules", "banned words", "writing style"]},
}

RESOURCE_MAP = {
    "DOC_QUALITY": ["references/validation.md", "references/workflows.md", "references/core_standards.md"],
    "OPTIMIZATION": ["references/optimization.md", "assets/documentation/llmstxt_templates.md"],
    "SKILL_CREATION": ["references/skill_creation.md", "assets/opencode/skill_md_template.md", "assets/opencode/skill_reference_template.md"],
    "AGENT_COMMAND": ["assets/opencode/agent_template.md", "assets/opencode/command_template.md"],
    "FLOWCHART": ["assets/flowcharts/simple_workflow.md", "assets/flowcharts/decision_tree_flow.md"],
    "INSTALL_GUIDE": ["assets/documentation/install_guide_template.md", "references/install_guide_standards.md"],
    "HVR": ["references/hvr_rules.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full standards", "all templates", "deep dive"],
    "ON_DEMAND": ["assets/documentation/readme_template.md", "assets/documentation/frontmatter_templates.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and documentation modes."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["DOC_QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_documentation_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```