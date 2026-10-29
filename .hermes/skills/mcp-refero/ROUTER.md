---
title: "Refero (mcp-refero) Router"
description: "Sibling router for mcp-refero: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-refero router"
  - "mcp-refero routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Refero (mcp-refero) Router

The machine router for [`SKILL.md`](../../../.skilled/skills/mcp-tooling/mcp-refero/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A Refero request reaches this skill when it names Refero, or asks for real shipped app screens, user journeys, a UI reference search, a named visual style, or the full detail of a shortlisted style, screen or flow, and the `mcp-tooling` hub's `mcp-refero` mode signal selects the packet, while generic design, UI or screen wording does not. From there the router selects among three reference families and one asset: the 8-tool contract and research funnel in `references/tool-surface.md`, the manual, bridge and auth model in `references/mcp-wiring.md`, the failure modes in `references/troubleshooting.md`, and the already-registered manual snapshot in `assets/utcp-refero-manual.md`, because this is a flat intent router with no keyed resource subdirectories. `references/tool-surface.md` is the declared default, offered as a fallback suggestion rather than loaded by any scored route.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Five intents, one per `INTENT_SIGNALS` key, and each names the phrasing that fires it and the exact files its `RESOURCE_MAP` entry loads.

- **`STYLES`**: "style", "visual direction", "design reference", "aesthetic", "look and feel", "design language", "landing page", "typography reference" or "palette reference" loads `references/tool-surface.md`.
- **`SCREENS`**: "screen", "ui pattern", "similar screens", "real app", "empty state", "component example", "screenshot", "modal", "dashboard", "onboarding", "settings" or "ui element" loads `references/tool-surface.md`.
- **`FLOWS`**: "flow", "user flow", "journey", "multi-step", "steps", "checkout", "cancel subscription" or "signup process" loads `references/tool-surface.md`.
- **`WIRING_AUTH`**: "wiring", "utcp", "oauth", "bearer", "mcp-remote", "authenticate", "manual", "token", "register", "plan", "subscription", "install" or "setup" loads `references/mcp-wiring.md` and `assets/utcp-refero-manual.md`.
- **`TROUBLESHOOT`**: "error", "failed", "401", "connection closed", "not resolving", "not working", "sigsegv", "429", "quota", "timeout", "broken" or "unauthorized" loads `references/troubleshooting.md` and `references/mcp-wiring.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the detection signals, the phase order, the resource domains, the loading levels and the intent-scoring pseudocode that reads them.

### Primary Detection Signal

Route on **narrow Refero-specific signals only**. Generic "design", "UI", or "screen" phrasing is not a Refero signal; Figma work belongs to `mcp-figma`, and browser work to `mcp-chrome-devtools`.

```bash
# Signal detection (pseudo)
echo "$REQUEST" | grep -qiE 'refero' && ROUTE="MCP_REFERO"
echo "$REQUEST" | grep -qiE 'design reference|ui reference search|real app (screens|examples|flows)' && ROUTE="MCP_REFERO"
# generic design/UI phrasing WITHOUT these signals -> not this packet (Refero signals only)
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify wiring (refero manual registered; Code Mode reachable; auth state operator-confirmed)
    +- STEP 1: Score intent -> STYLES | SCREENS | FLOWS | WIRING_AUTH | TROUBLESHOOT
    +- Phase 1: Design-affecting? -> pair with sk-design-md-generator for a measured Style Reference (extracted tokens), then return here for retrieval
    +- Phase 2: Discovery (list_tools / tool_info confirms the doubled-prefix callables)   [MANDATORY]
    +- Phase 3: Retrieval funnel (search -> metadata shortlist -> get_* detail -> similar -> image last)
    +- Phase 4: Verify (evidence cited by source URL; unknown fields preserved; no invented limits)
```

### Resource Domains

Resource discovery and intent scoring are the shared helper bodies documented once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md). This skill uses a **flat intent router**: no keyed `references/<key>/` subdirectories. References are the primary loaded resources; the single asset is the paste-ready manual snapshot.

```text
references/tool-surface.md      # the 8-tool surface, args/bounds, workflows, plan gating
references/mcp-wiring.md        # manual, mcp-remote bridge, OAuth/Bearer, naming, discovery
references/troubleshooting.md   # failure modes + fixes
assets/utcp-refero-manual.md    # verified manual snapshot (already registered) + Bearer alternative
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| CONDITIONAL | Research intent (styles/screens/flows) | `references/tool-surface.md` (tool contract + workflow baseline) |
| CONDITIONAL | Wiring / auth intent | `references/mcp-wiring.md`, `assets/utcp-refero-manual.md` |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| FALLBACK | Zero-score routes only | `references/tool-surface.md` suggested (never auto-loaded) |
| ALWAYS (design work) | Retrieved evidence feeds a design decision | `sk-design-md-generator`, for a measured Style Reference (extracted design tokens) |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../../.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md). Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool-surface.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"
MIN_CONFIDENCE = 1
AMBIGUITY_DELTA = 1

INTENT_MODEL = {
    "STYLES":       {"keywords": [("style", 4), ("visual direction", 4), ("design reference", 3), ("aesthetic", 3), ("look and feel", 3), ("design language", 3), ("landing page", 2), ("typography reference", 2), ("palette reference", 2)]},
    "SCREENS":      {"keywords": [("screen", 4), ("ui pattern", 4), ("similar screens", 4), ("real app", 3), ("empty state", 3), ("component example", 3), ("screenshot", 3), ("modal", 2), ("dashboard", 2), ("onboarding", 2), ("settings", 2), ("ui element", 2)]},
    "FLOWS":        {"keywords": [("flow", 4), ("user flow", 4), ("journey", 4), ("multi-step", 3), ("steps", 2), ("checkout", 2), ("cancel subscription", 2), ("signup process", 2)]},
    "WIRING_AUTH":  {"keywords": [("wiring", 4), ("utcp", 4), ("oauth", 4), ("bearer", 4), ("mcp-remote", 4), ("authenticate", 4), ("manual", 3), ("token", 3), ("register", 3), ("plan", 2), ("subscription", 2), ("install", 2), ("setup", 2)]},
    "TROUBLESHOOT": {"keywords": [("error", 4), ("failed", 4), ("401", 4), ("connection closed", 4), ("not resolving", 4), ("not working", 4), ("sigsegv", 4), ("429", 3), ("quota", 3), ("timeout", 3), ("broken", 3), ("unauthorized", 3)]},
}

# Mirror of INTENT_MODEL in the standard {weight, keywords} shape that
# INTENT_SIGNALS parsers read (the tuple form above parses to zero intents
# there). Runtime scoring uses INTENT_MODEL; this block changes no routing.
# Per-intent weight = the MAX per-keyword weight in INTENT_MODEL for that intent
# (all five resolve to 4). Keys and keywords MUST stay identical to INTENT_MODEL;
# keep the two blocks in sync whenever either one is edited.
INTENT_SIGNALS = {
    "STYLES":       {"weight": 4, "keywords": ["style", "visual direction", "design reference", "aesthetic", "look and feel", "design language", "landing page", "typography reference", "palette reference"]},
    "SCREENS":      {"weight": 4, "keywords": ["screen", "ui pattern", "similar screens", "real app", "empty state", "component example", "screenshot", "modal", "dashboard", "onboarding", "settings", "ui element"]},
    "FLOWS":        {"weight": 4, "keywords": ["flow", "user flow", "journey", "multi-step", "steps", "checkout", "cancel subscription", "signup process"]},
    "WIRING_AUTH":  {"weight": 4, "keywords": ["wiring", "utcp", "oauth", "bearer", "mcp-remote", "authenticate", "manual", "token", "register", "plan", "subscription", "install", "setup"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "401", "connection closed", "not resolving", "not working", "sigsegv", "429", "quota", "timeout", "broken", "unauthorized"]},
}

RESOURCE_MAP = {
    "STYLES":       ["references/tool-surface.md"],
    "SCREENS":      ["references/tool-surface.md"],
    "FLOWS":        ["references/tool-surface.md"],
    "WIRING_AUTH":  ["references/mcp-wiring.md", "assets/utcp-refero-manual.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/mcp-wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the layer: styles (visual direction), screens (UI patterns), or flows (journeys)",
    "Confirm the refero manual is registered and discovery (tool_info) confirms the doubled-prefix callables",
    "Confirm the account has a Pro (or higher) plan; Free has no MCP access at all",
    "If the evidence will influence a design decision, pair with sk-design-md-generator for a measured Style Reference (extracted design tokens); this transport never decides taste",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)               # raises if path escapes the skill
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return (None, None, scores)   # unrouted -> no intent selected; fallback branch disambiguates
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_refero_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [i for i in (primary, secondary) if i]
    loaded, seen, notices = [], set(), []

    def load_if_available(rel: str) -> bool:
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)
            return True
        if guarded not in inventory:
            notices.append(f"Resource not found in inventory: {guarded}")
        return False

    if max(scores.values() or [0]) < MIN_CONFIDENCE:
        # Fallback-only: nothing is loaded on a zero-score route; the default
        # reference is offered as a suggestion beside the disambiguation ask.
        return {"intents": intents, "load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
                "suggested_fallback": DEFAULT_RESOURCE, "resources": loaded, "notices": notices}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded, "notices": notices}
```
