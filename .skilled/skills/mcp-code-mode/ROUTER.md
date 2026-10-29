---
title: "MCP Code Mode Router"
description: "Sibling router for mcp-code-mode: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-code-mode router"
  - "mcp-code-mode routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# MCP Code Mode Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when a prompt names an MCP tool or an external service such as ClickUp, Notion, Figma, MyService or Chrome DevTools, asks for a multi-tool workflow, external API access or browser automation, or reports a Code Mode symptom: a tool not found, a manual-name prefix mistake, an unprefixed environment variable, or a `.utcp_config.json` that fails to load. A native file, search, shell or continuity request goes to the runtime's own tools instead, and a run that scores no intent returns `UNKNOWN_FALLBACK` with a disambiguation checklist rather than a silent default. It routes to two resource families: `references/` holds the naming convention, the configuration guide, the tool catalog, the workflow examples and the architecture notes, and `assets/` holds the config and env templates a setup route loads.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`NAMING`** fires on tool not found, naming, prefix and format at weight 4. It loads `references/naming-convention.md`.
- **`SETUP`** fires on setup, install, configure, `.utcp_config` and `.env` at weight 4. It loads `references/configuration.md`, then `assets/config-template.md` and `assets/env-template.md`.
- **`VALIDATE`** fires on validate, validation, check config and schema at weight 4. It loads `references/configuration.md`, then `references/naming-convention.md`.
- **`CATALOG`** fires on what tools, list tools, discover tools and catalog at weight 3, and the `search_tools`, `list_tools` and `tool_info` commands boost it. It loads `references/tool-catalog.md`.
- **`WORKFLOW`** fires on workflow, orchestrate, multi-tool and error handling at weight 3, and the `call_tool_chain` command boosts it. It loads `references/workflows.md`.
- **`ARCHITECTURE`** fires on architecture, token, performance and internals at weight 2. It loads `references/architecture.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the loading levels, the typed leaf projection, the router-resilience patterns and the smart-router pseudocode.

### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Core quick reference         |
| CONDITIONAL | If intent signals match  | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request | Full configuration/workflows |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.
This skill uses a simple flat-resource intent router: `references/` and `assets/` contain direct markdown resources, not keyed `references/<key>/` or `assets/<key>/` subdirectories.
Keep the resilient mechanics from the canonical router, but do not force keyed subdirectory discovery onto this skill.

**Typed leaf projection (fleet routing standard).** mcp-code-mode is a normal, standalone single-mode skill whose sole workflow mode is `mcp-code-mode` (there is no `mode-registry.json`).

Every routable leaf under `references/`, `assets/`, and the manual-testing playbook is enumerated in `leaf-manifest.json`, generated from `leaf-manifest.config.json`. Regenerate it with `generate-leaf-manifest.cjs --write .skilled/skills/mcp-code-mode`, and keep it byte-stable under `--check`.

`leaf-aliases.json` binds each router-emitted root-relative path (e.g. `references/naming-convention.md`) to its typed `(mcp-code-mode, leafResourceId)` identity, so a deterministic router replay recovers real typed pairs against the manifest.

The `RESOURCE_MAP` below emits the reference and asset paths. Playbook leaves are manifest-routed resources and must stay synchronized. Regenerate `leaf-manifest.json` and keep `leaf-aliases.json` in sync whenever any enumerated corpus changes.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories current markdown under `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards paths, checks `inventory`, and de-duplicates with `seen`.
- Pattern 3: Simple Intent Labels - intent and command signals select known flat Code Mode resources; `routing_key` stays `code-mode` because there are no runtime keyed resource subdirectories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns a disambiguation checklist and missing matches return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows.md"
ROUTING_KEY = "code-mode"

INTENT_SIGNALS = {
    "NAMING": {"weight": 4, "keywords": ["tool not found", "naming", "prefix", "format"]},
    "SETUP": {"weight": 4, "keywords": ["setup", "install", "configure", ".utcp_config", ".env"]},
    "VALIDATE": {"weight": 4, "keywords": ["validate", "validation", "check config", "schema"]},
    "CATALOG": {"weight": 3, "keywords": ["what tools", "list tools", "discover tools", "catalog"]},
    "WORKFLOW": {"weight": 3, "keywords": ["workflow", "orchestrate", "multi-tool", "error handling"]},
    "ARCHITECTURE": {"weight": 2, "keywords": ["architecture", "token", "performance", "internals"]},
}

RESOURCE_MAP = {
    "NAMING": ["references/naming-convention.md"],
    "SETUP": ["references/configuration.md", "assets/config-template.md", "assets/env-template.md"],
    "VALIDATE": ["references/configuration.md", "references/naming-convention.md"],
    "CATALOG": ["references/tool-catalog.md"],
    "WORKFLOW": ["references/workflows.md"],
    "ARCHITECTURE": ["references/architecture.md"],
}

COMMAND_BOOSTS = {
    "search_tools": "CATALOG",
    "list_tools": "CATALOG",
    "tool_info": "CATALOG",
    "call_tool_chain": "WORKFLOW",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full config", "deep dive", "full workflow", "all tools", "call_tool_chain", "tool chain", "mcp tools", "tool catalog", "code mode"],
    "ON_DEMAND": ["references/configuration.md", "references/workflows.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

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
    """Weighted intent scoring from request text and signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    command = str(getattr(task, "command", "")).lower()
    for signal, intent in COMMAND_BOOSTS.items():
        if signal in command:
            scores[intent] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["WORKFLOW"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_code_mode_resources(task):
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
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

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": ROUTING_KEY,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": ["Confirm tool discovery, setup, validation, or workflow need", "Confirm target MCP/tool family", "Provide the tool call or error if available"],
            "resources": loaded,
        }

    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    result = {"routing_key": ROUTING_KEY, "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```
