---
title: "Bladebro Browser Driver - CLI + MCP Integration Router"
description: "Sibling router for mcp-bladebro: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-bladebro router"
  - "mcp-bladebro routing"
importance_tier: normal
contextType: general
version: 1.2.1.0
router_state: active
skill_pointer: SKILL.md
---

# Bladebro Browser Driver - CLI + MCP Integration Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request reaches this packet when the `mcp-browser-use` hub's `mcp-bladebro` mode signal selects it for a prompt naming Bladebro, a stealth browser, `bladebro rb`, a caller-owned or already-open browser that names no Chrome, or agentic signed-in work. It routes to four flat reference leaves under `references/`: `cli-reference.md` for the five tools and the CLI, `browser-lanes.md` for the agent browser and the `rb` lanes, `mcp-wiring.md` for the Code Mode path together with the `assets/utcp-bladebro-manual.md` snapshot, and `install-and-verify.md` for install, pin and health-check intent. `references/cli-reference.md` is the fallback suggestion and never loads on its own.

Every path below stays inside this packet folder, and no resource loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CLI`** fires on bladebro, bladebro cli, see content, see model, act click, run plan, vision, state tabs, extract, agentic and branching at weight 4, plus 4 more when the CLI is available. It loads `references/cli-reference.md`.
- **`LANES`** fires on rb on, rb status, rb attach, rb mode, real browser, signed-in, signed in, profile, clone, attach, caller-owned, stealth, pause and my browser at weight 4. It loads `references/browser-lanes.md` then `references/cli-reference.md`.
- **`MCP`** fires on mcp server, bladebro mcp, code mode, call_tool_chain, tool chain, stdio, manual, composition, parallel isolated and model context protocol at weight 4, plus 4 more when Code Mode is configured. It loads `references/mcp-wiring.md`, then `references/cli-reference.md`, then `assets/utcp-bladebro-manual.md`.
- **`INSTALL`** fires on install, setup, set up, doctor, not installed, not found, command -v bladebro, version, pin, sha256, uninstall, rollback and update at weight 4, plus 4 more when the request carries an error. It loads `references/install-and-verify.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above. This section is the last in the file, and it holds the only pseudocode. The shared helper bodies are documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md).

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cli-reference.md"
# Fallback-only: a zero-score route loads nothing and offers this file
# beside the disambiguation checklist; scored routes load exactly their map.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the Bladebro outcome: an agentic run, a stealth browse, or attachment to a caller-owned browser",
    "Say whether the work needs the agent browser or an explicitly requested real-browser lane",
    "Give one target URL, task goal or error message",
]

INTENT_SIGNALS = {
    "CLI": {"weight": 4, "keywords": ["bladebro", "bladebro cli", "see content", "see model", "act click", "run plan", "vision", "state tabs", "extract", "agentic", "branching"]},
    "LANES": {"weight": 4, "keywords": ["rb on", "rb status", "rb attach", "rb mode", "real browser", "signed-in", "signed in", "profile", "clone", "attach", "caller-owned", "stealth", "pause", "my browser"]},
    "MCP": {"weight": 4, "keywords": ["mcp server", "bladebro mcp", "code mode", "call_tool_chain", "tool chain", "stdio", "manual", "composition", "parallel isolated", "model context protocol"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "set up", "doctor", "not installed", "not found", "command -v bladebro", "version", "pin", "sha256", "uninstall", "rollback", "update"]},
}

RESOURCE_MAP = {
    "CLI": ["references/cli-reference.md"],
    "LANES": ["references/browser-lanes.md", "references/cli-reference.md"],
    "MCP": ["references/mcp-wiring.md", "references/cli-reference.md", "assets/utcp-bladebro-manual.md"],
    "INSTALL": ["references/install-and-verify.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
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
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "cli_available", False):
        scores["CLI"] += 4
    if getattr(task, "code_mode_configured", False):
        scores["MCP"] += 4
    if getattr(task, "has_error", False):
        scores["INSTALL"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["UNKNOWN"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_bladebro_resources(task):
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

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": "bladebro",
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    return {"routing_key": "bladebro", "intents": intents, "intent_scores": scores, "resources": loaded}
```
