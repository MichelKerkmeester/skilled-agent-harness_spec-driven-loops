---
title: "Mobbin (mcp-mobbin) Router"
description: "Sibling router for mcp-mobbin: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-mobbin router"
  - "mcp-mobbin routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Mobbin (mcp-mobbin) Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A Mobbin request reaches this skill when it names Mobbin, or asks for real app screenshots, app design research, UX flow references, screen examples from shipped apps, or the wiring, auth, plan gating and rate-limit troubleshooting of the registered `mobbin` manual, while generic design, UI or screen wording does not. From there the router selects among three reference families and one asset: the live three-tool contract and query-intent workflows in `references/tool-surface.md`, the registered manual, bridge and auth model in `references/mcp-wiring.md`, the failure modes in `references/troubleshooting.md`, and the registered manual's reference shape in `assets/utcp-mobbin-manual.md`, because this is a flat intent router with no keyed resource subdirectories. `references/tool-surface.md` is the declared default, offered as a fallback suggestion rather than loaded by any scored route.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Six intents, one per `INTENT_SIGNALS` key, and each names the phrasing that fires it and the exact files its `RESOURCE_MAP` entry loads.

- **`APPS`**: "app design research", "app research", "competitor", "app comparison", "banking apps", "category", "how do apps" or "real apps" loads `references/tool-surface.md`.
- **`SCREENS`**: "screen", "screen examples", "ui pattern", "empty state", "first open", "onboarding screen", "component example", "screenshot", "paywall", "settings" or "dashboard" loads `references/tool-surface.md`.
- **`FLOWS`**: "flow", "ux flow", "user flow", "journey", "start to finish", "multi-step", "progression", "forgot password", "checkout" or "signup process" loads `references/tool-surface.md`.
- **`ELEMENTS`**: "element", "bottom sheet", "inline validation", "component behavior", "button state", "tab bar", "modal" or "confirmation dialog" loads `references/tool-surface.md`.
- **`WIRING_AUTH`**: "wiring", "utcp", "oauth", "mcp-remote", "authenticate", "pkce", "manual", "register", "token", "plan", "install" or "setup" loads `references/mcp-wiring.md` and `assets/utcp-mobbin-manual.md`.
- **`TROUBLESHOOT`**: "error", "failed", "401", "not working", "not resolving", "429", "rate limit", "timeout", "unauthorized" or "denied" loads `references/troubleshooting.md` and `references/mcp-wiring.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail behind the summary above: the detection signals, the phase sequence, the resource inventory, the loading levels and the discovery pseudocode.

### Primary Detection Signal

Route on **narrow Mobbin-specific signals only**. Generic "design", "UI", or "screen" phrasing is not a Mobbin signal; measured live-site extraction belongs to `sk-design-md-generator`, Refero references to `mcp-refero`, Figma work to `mcp-figma`, and browser work to `mcp-chrome-devtools`.

```bash
# Signal detection (pseudo)
echo "$REQUEST" | grep -qiE 'mobbin' && ROUTE="MCP_MOBBIN"
echo "$REQUEST" | grep -qiE 'app design research|real app (screenshots|screens)|ux flow reference' && ROUTE="MCP_MOBBIN"
# generic design/UI phrasing WITHOUT these signals -> not this packet (measured extraction -> sk-design-md-generator)
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify wiring state (mobbin manual registered; presence expected — absence is a failure to escalate)
    +- STEP 1: Score intent -> APPS | SCREENS | FLOWS | ELEMENTS | WIRING_AUTH | TROUBLESHOOT
    +- Phase 1: Measured Style Reference also wanted? -> pair sk-design-md-generator (extracted design tokens); retrieval stays here
    +- Phase 2: Discovery (list_tools / tool_info confirms the callable name)   [MANDATORY; needs a fresh Code Mode session]
    +- Phase 3: Retrieval (search_screens with intent-shaped query; limit 5; platform ios|web)
    +- Phase 4: Verify (evidence cited by mobbin_url; failed[] reported; unknowns preserved; no invented tools)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. This skill uses a **flat intent router**: no keyed `references/<key>/` subdirectories. References are the primary loaded resources; the single asset is the registered manual's reference shape.

```text
references/tool-surface.md      # the one-tool surface, args, response shape, workflows, plan gating
references/mcp-wiring.md        # registered manual, mcp-remote bridge, OAuth/DCR/PKCE, naming, discovery
references/troubleshooting.md   # failure modes + fixes
assets/utcp-mobbin-manual.md    # Registered manual's reference shape + post-registration checklist
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| CONDITIONAL | Research intent (apps/screens/flows/elements) | `references/tool-surface.md` (tool contract + workflow baseline) |
| CONDITIONAL | Wiring / auth intent | `references/mcp-wiring.md`, `assets/utcp-mobbin-manual.md` |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| FALLBACK | Zero-score routes only | `references/tool-surface.md` suggested (never auto-loaded) |
| PAIR (measured reference) | A measured Style Reference of extracted tokens is also wanted | `sk-design-md-generator`, the measured-extraction companion |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/sk-create-skill/assets/skill/skill-smart-router.md). Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

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
    "APPS":         {"keywords": [("app design research", 4), ("app research", 4), ("competitor", 3), ("app comparison", 3), ("banking apps", 2), ("category", 2), ("how do apps", 2), ("real apps", 3)]},
    "SCREENS":      {"keywords": [("screen", 4), ("screen examples", 4), ("ui pattern", 3), ("empty state", 3), ("first open", 3), ("onboarding screen", 3), ("component example", 3), ("screenshot", 3), ("paywall", 2), ("settings", 2), ("dashboard", 2)]},
    "FLOWS":        {"keywords": [("flow", 4), ("ux flow", 4), ("user flow", 4), ("journey", 4), ("start to finish", 3), ("multi-step", 3), ("progression", 2), ("forgot password", 2), ("checkout", 2), ("signup process", 2)]},
    "ELEMENTS":     {"keywords": [("element", 4), ("bottom sheet", 3), ("inline validation", 3), ("component behavior", 3), ("button state", 2), ("tab bar", 2), ("modal", 2), ("confirmation dialog", 2)]},
    "WIRING_AUTH":  {"keywords": [("wiring", 4), ("utcp", 4), ("oauth", 4), ("mcp-remote", 4), ("authenticate", 4), ("pkce", 3), ("manual", 3), ("register", 3), ("token", 3), ("plan", 2), ("install", 2), ("setup", 2)]},
    "TROUBLESHOOT": {"keywords": [("error", 4), ("failed", 4), ("401", 4), ("not working", 4), ("not resolving", 4), ("429", 3), ("rate limit", 3), ("timeout", 3), ("unauthorized", 3), ("denied", 3)]},
}

# Mirror of INTENT_MODEL in the standard {weight, keywords} shape that
# INTENT_SIGNALS parsers read (the tuple form above parses to zero intents
# there). Runtime scoring uses INTENT_MODEL; this block changes no routing.
# Per-intent weight = the MAX per-keyword weight in INTENT_MODEL for that intent
# (all six resolve to 4). Keys and keywords MUST stay identical to INTENT_MODEL;
# keep the two blocks in sync whenever either one is edited.
INTENT_SIGNALS = {
    "APPS":         {"weight": 4, "keywords": ["app design research", "app research", "competitor", "app comparison", "banking apps", "category", "how do apps", "real apps"]},
    "SCREENS":      {"weight": 4, "keywords": ["screen", "screen examples", "ui pattern", "empty state", "first open", "onboarding screen", "component example", "screenshot", "paywall", "settings", "dashboard"]},
    "FLOWS":        {"weight": 4, "keywords": ["flow", "ux flow", "user flow", "journey", "start to finish", "multi-step", "progression", "forgot password", "checkout", "signup process"]},
    "ELEMENTS":     {"weight": 4, "keywords": ["element", "bottom sheet", "inline validation", "component behavior", "button state", "tab bar", "modal", "confirmation dialog"]},
    "WIRING_AUTH":  {"weight": 4, "keywords": ["wiring", "utcp", "oauth", "mcp-remote", "authenticate", "pkce", "manual", "register", "token", "plan", "install", "setup"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "401", "not working", "not resolving", "429", "rate limit", "timeout", "unauthorized", "denied"]},
}

RESOURCE_MAP = {
    "APPS":         ["references/tool-surface.md"],
    "SCREENS":      ["references/tool-surface.md"],
    "FLOWS":        ["references/tool-surface.md"],
    "ELEMENTS":     ["references/tool-surface.md"],
    "WIRING_AUTH":  ["references/mcp-wiring.md", "assets/utcp-mobbin-manual.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/mcp-wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the research intent: apps, screens, flows, or elements (all are query intents over search_screens)",
    "Confirm the mobbin manual's registration state (registered; absence is a failure symptom to escalate, never repair)",
    "Confirm the account has a paid plan (Pro, Team, or Enterprise); Free has no MCP access",
    "If a measured Style Reference of extracted design tokens is also wanted, pair sk-design-md-generator; this transport only retrieves Mobbin screenshot evidence",
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

def route_mobbin_resources(request: str):
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
