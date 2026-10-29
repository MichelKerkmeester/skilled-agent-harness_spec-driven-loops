---
title: "Chrome DevTools Orchestrator - CLI + MCP Integration Router"
description: "Sibling router for mcp-chrome-devtools: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-chrome-devtools router"
  - "mcp-chrome-devtools routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Chrome DevTools Orchestrator - CLI + MCP Integration Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name browser debugging, Chrome DevTools, CDP, `bdg` or `browser-debugger-cli`, when they ask for a screenshot, HAR export, console log, network inspection, DOM query or an in-browser script, when they need a CI-ready automation script, or when a Chrome DevTools MCP call chains browser work with other tools or runs parallel isolated sessions. It routes to three resource families: `references/cdp-patterns.md` for the CDP command patterns, `references/session-management.md` for the session lifecycle, and `references/troubleshooting.md` for an install, a failure, or the fuller diagnostics an on-demand keyword requests.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CLI`** (weight 4) fires on "bdg", "browser-debugger-cli", "terminal", "cli", "command line", "shell", "headless", "lightweight" and "token efficient", and a `bdg` binary on PATH adds 5 on top. It loads `references/cdp-patterns.md` and `references/session-management.md`.
- **`MCP`** (weight 4) fires on "mcp", "code mode", "multi-tool", "tool chain", "isolated instances", "parallel sessions" and "in parallel", and a configured Code Mode adds 4 on top. It loads `references/session-management.md` and `references/cdp-patterns.md`.
- **`INSTALL`** (weight 4) fires on "install", "setup", "not installed", "not found", "command -v bdg", "npm install", "getting started" and "first time". It loads `references/troubleshooting.md`.
- **`TROUBLESHOOT`** (weight 4) fires on "error", "failed", "troubleshoot", "keeps dropping", "won't connect", "hangs", "stuck", "not working" and "root cause", and a request carrying an error adds 4 on top. It loads `references/troubleshooting.md`.
- **`AUTOMATION`** (weight 3) fires on "ci", "continuous integration", "pipeline", "automation", "production", "automate" and "batch". It loads `references/cdp-patterns.md` and `references/session-management.md`.

The two highest-scoring intents load together when their scores sit within 1.0 of each other, at most two intents per request, and a request that scores on none loads nothing: it returns `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST`, and `references/cdp-patterns.md` is suggested beside that checklist as a fallback-only default, so it never enters a scored route's loaded set. A scoring `ON_DEMAND_KEYWORDS` term then adds `references/troubleshooting.md` and `references/session-management.md` on top of the scored set.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail behind the summary above: the loading levels, the resilience bullets and the router pseudocode that reads them.

### Resource Loading Levels

| Level       | When to Load             | Resources                       |
| ----------- | ------------------------ | ------------------------------- |
| CONDITIONAL | If intent signals match  | CLI/MCP/session/troubleshooting |
| ON_DEMAND   | Only on explicit request | Full diagnostics set            |
| FALLBACK    | Zero-score routes only   | Core CDP pattern reference suggested (never auto-loaded) |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

The shared helper bodies are documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md).

- Pattern 1: Simple Intent Routing - CLI/MCP/install/troubleshoot/automation intents select the real flat `references/*.md` resources. This skill currently has no keyed `references/<key>/` or `assets/<key>/` resource subdirectories.
- Pattern 2: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests CLI/MCP/session disambiguation and SUGGESTS the default CDP reference without loading it (`DEFAULT_RESOURCE_SEMANTICS = "fallback-only"`): a scored route loads exactly its intents' mapped resources, and a zero-score route loads nothing beyond the disambiguation checklist.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cdp-patterns.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm CLI vs MCP path",
    "Confirm target browser/session",
    "Provide one error, URL, or task goal",
]

INTENT_SIGNALS = {
    "CLI": {"weight": 4, "keywords": ["bdg", "browser-debugger-cli", "terminal", "cli", "command line", "command-line", "shell", "headless", "lightweight", "token efficient"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "multi-tool", "parallel sessions", "model context protocol", "multiple tools", "isolated instances", "tool chain", "in parallel"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "not installed", "command -v bdg", "set up", "getting started", "download", "npm install", "not found", "first time"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "troubleshoot", "session issue", "keeps dropping", "won't connect", "figure out why", "work out the cause", "hangs", "hanging", "stuck", "crash", "crashing", "broken", "not working", "timeout", "disconnect", "flaky", "root cause"]},
    "AUTOMATION": {"weight": 3, "keywords": ["ci", "pipeline", "automation", "production", "automate", "unattended", "continuous integration", "batch", "recurring"]},
}

RESOURCE_MAP = {
    "CLI": ["references/cdp-patterns.md", "references/session-management.md"],
    "MCP": ["references/session-management.md", "references/cdp-patterns.md"],
    "INSTALL": ["references/troubleshooting.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md"],
    "AUTOMATION": ["references/cdp-patterns.md", "references/session-management.md"],
}

LOADING_LEVELS = {
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "full session guide", "all patterns", "capture a har", "console errors", "routing dashboard", "staging", "devtools"],
    "ON_DEMAND": ["references/troubleshooting.md", "references/session-management.md"],
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
        scores["CLI"] += 5
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

def route_chrome_devtools_resources(task):
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
            "routing_key": "chrome-devtools",
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

    result = {"routing_key": "chrome-devtools", "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
        result["suggested_fallback"] = DEFAULT_RESOURCE
    return result
```
