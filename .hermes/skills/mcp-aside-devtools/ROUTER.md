---
title: "Aside Browser Orchestrator - CLI + MCP Integration Router"
description: "Sibling router for mcp-aside-devtools: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-aside-devtools router"
  - "mcp-aside-devtools routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Aside Browser Orchestrator - CLI + MCP Integration Router

The machine router for [`SKILL.md`](../../../.skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request reaches this skill when the `mcp-tooling` hub's `mcp-aside-devtools` mode signal selects this packet for a prompt naming Aside, `aside exec` or `aside repl`, the Aside MCP, or an AI browser agent task: a goal-driven multi-step browser job such as booking, filling a form, comparing or signing in and downloading, a deterministic tab, snapshot or screenshot step, or browser work that must be chained with other Code Mode tools. It routes to four flat reference leaves under `references/`: `aside-cli-reference.md` for the command surface, `session-management.md` for the agent-task, REPL and browser-profile layers, `mcp-wiring.md` for the Code Mode path together with the `assets/utcp-aside-manual.md` snapshot, and `troubleshooting.md` for install and error intent. `references/aside-cli-reference.md` is the default reference and the fallback suggestion, and the dated online-research refresh sits outside the map, read only when verifying the current developer surface.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`TASK`** fires on aside, agent task, browser agent, natural language, ai browser, aside exec, autonomous, multi-step, sign in and, book and fill the form at weight 4, plus 4 more when the CLI is available. It loads `references/aside-cli-reference.md` then `references/session-management.md`.
- **`REPL`** fires on repl, deterministic, playwright, snapshot, screenshot, opentab, open tab, javascript, evidence, page.pdf and annotated at weight 4. It loads `references/aside-cli-reference.md` then `references/session-management.md`.
- **`MCP`** fires on mcp, code mode, tool chain, stdio, tools/list, call_tool_chain, manual, model context protocol and chained with other tools at weight 4, plus 4 more when Code Mode is configured. It loads `references/mcp-wiring.md`, then `references/session-management.md`, then `assets/utcp-aside-manual.md`.
- **`INSTALL`** fires on install, setup, set up, not installed, curl, sign in, sign-in, getting started, not found, first time and command -v aside at weight 4. It loads `references/troubleshooting.md`.
- **`TROUBLESHOOT`** fires on error, failed, troubleshoot, unbound, not bound, daemon, signed out, timeout, hangs, hanging, stuck, crash, broken, not working, won't connect and root cause at weight 4, plus 4 more when the request carries an error. It loads `references/troubleshooting.md` then `references/session-management.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail behind the summary above: the loading levels, the resilience bullets and the router pseudocode that reads them.

### Resource Loading Levels

| Level       | When to Load             | Resources                          |
| ----------- | ------------------------ | ---------------------------------- |
| CONDITIONAL | If intent signals match  | REPL/MCP/session/troubleshooting   |
| ON_DEMAND   | Only on explicit request | Full diagnostics set               |
| FALLBACK    | Zero-score routes only   | Core CLI reference suggested (never auto-loaded) |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

The shared helper bodies are documented once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md).

- Pattern 1: Simple Intent Routing - TASK/REPL/MCP/INSTALL/TROUBLESHOOT intents select the real flat `references/*.md` resources plus the flat `assets/utcp-aside-manual.md` snapshot. This skill has no keyed `references/<key>/` or `assets/<key>/` resource subdirectories.
- Pattern 2: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests CLI/REPL/MCP disambiguation and SUGGESTS the default CLI reference without loading it (`DEFAULT_RESOURCE_SEMANTICS = "fallback-only"`): a scored route loads exactly its intents' mapped resources, and a zero-score route loads nothing beyond the disambiguation checklist.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/aside-cli-reference.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm agent-task CLI vs deterministic REPL vs Code Mode MCP path",
    "Confirm the signed-in Aside account and target profile",
    "Provide one task goal, URL, or error message",
]

INTENT_SIGNALS = {
    "TASK": {"weight": 4, "keywords": ["aside", "agent task", "browser agent", "natural language", "ai browser", "aside exec", "autonomous", "multi-step", "sign in and", "book", "fill the form"]},
    "REPL": {"weight": 4, "keywords": ["repl", "deterministic", "playwright", "snapshot", "screenshot", "opentab", "open tab", "javascript", "evidence", "page.pdf", "annotated"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "tool chain", "stdio", "tools/list", "call_tool_chain", "manual", "model context protocol", "chained with other tools"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "set up", "not installed", "curl", "sign in", "sign-in", "getting started", "not found", "first time", "command -v aside"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "troubleshoot", "unbound", "not bound", "daemon", "signed out", "timeout", "hangs", "hanging", "stuck", "crash", "broken", "not working", "won't connect", "root cause"]},
}

RESOURCE_MAP = {
    "TASK": ["references/aside-cli-reference.md", "references/session-management.md"],
    "REPL": ["references/aside-cli-reference.md", "references/session-management.md"],
    "MCP": ["references/mcp-wiring.md", "references/session-management.md", "assets/utcp-aside-manual.md"],
    "INSTALL": ["references/troubleshooting.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/session-management.md"],
}

LOADING_LEVELS = {
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "full session guide", "all patterns", "permission model", "daemon health", "everything about aside"],
    "ON_DEMAND": ["references/troubleshooting.md", "references/session-management.md", "references/mcp-wiring.md"],
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
    """Weighted intent scoring from request text and routing signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "cli_available", False):
        scores["TASK"] += 4
    if getattr(task, "code_mode_configured", False):
        scores["MCP"] += 4
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["UNKNOWN"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_aside_devtools_resources(task):
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
        # Fallback-only: nothing is loaded on a zero-score route; the default
        # reference is offered as a suggestion beside the disambiguation ask.
        return {
            "routing_key": "aside-devtools",
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
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

    result = {"routing_key": "aside-devtools", "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
        result["suggested_fallback"] = DEFAULT_RESOURCE
    return result
```
