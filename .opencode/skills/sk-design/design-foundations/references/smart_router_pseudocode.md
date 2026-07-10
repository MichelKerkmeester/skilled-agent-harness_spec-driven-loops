---
title: Foundations Smart Router Pseudocode
description: The mode-specific runtime routing implementation for design-foundations - intent scoring, resource map, and guarded discovery/load/fallback mechanics.
trigger_phrases:
  - "foundations smart router"
  - "foundations routing pseudocode"
  - "foundations intent signals"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Foundations Smart Router Pseudocode

The authoritative routing logic discovers markdown at runtime, guards every path inside the skill folder, scores the static axis as a routing key, loads only files that exist, and returns an `UNKNOWN_FALLBACK` checklist when confidence is too low. This is the mode-specific implementation of the general resilience pattern in [skill_smart_router.md](../../../sk-doc/create-skill/assets/skill/skill_smart_router.md): `discover_markdown_resources()` and `_guard_in_skill()` supply the discovery and guard mechanics, `route_foundations_resources()` supplies the `foundations`-specific `INTENT_SIGNALS`, `RESOURCE_MAP`, and `UNKNOWN_FALLBACK_CHECKLIST`.

---

## 1. Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = ["references/corpus_map.md", "../shared/register.md", "../shared/context_loading_contract.md"]

INTENT_SIGNALS = {
    "COLOR": {"weight": 4, "keywords": ["oklch", "palette", "color", "contrast", "theme", "dark mode", "gamut", "semantic color", "surface scale"]},
    "TYPE": {"weight": 4, "keywords": ["typography", "font", "type scale", "measure", "line length", "pairing", "tabular numerals", "type roles"]},
    "LAYOUT": {"weight": 4, "keywords": ["layout", "spacing", "grid", "responsive", "breakpoint", "density", "container query", "rhythm", "hierarchy"]},
    "ADAPTATION": {"weight": 4, "keywords": ["adaptation matrix", "context adaptation", "device adaptation", "input method", "orientation", "print", "posture", "constrained surface"]},
    "DATA_VIZ": {"weight": 4, "keywords": ["data visualization", "chart", "chart type", "axis", "sparkline", "data table", "color-for-data", "encoding", "data-viz"]},
    "WORKED_EXAMPLES": {"weight": 4, "keywords": ["worked example", "worked examples", "complete foundations answer", "annotated example", "example output", "not a preset", "dashboard example", "brand landing example"]},
    "TOKENS": {"weight": 4, "keywords": ["token starter", "token scaffold", "design tokens", "token system", "starter scaffold", "handoff", "fill-in scaffold"]},
}

RESOURCE_MAP = {
    "COLOR": ["references/corpus_map.md", "references/color/oklch_workflow.md", "references/color/palette_theming.md"],
    "TYPE": ["references/corpus_map.md", "references/type/typography_system.md"],
    "LAYOUT": ["references/corpus_map.md", "references/layout/layout_responsive.md"],
    "ADAPTATION": ["references/corpus_map.md", "references/layout/adaptation_matrix.md"],
    "DATA_VIZ": ["references/corpus_map.md", "references/data_viz.md"],
    "WORKED_EXAMPLES": ["references/corpus_map.md", "references/worked_examples.md"],
    "TOKENS": ["references/corpus_map.md", "assets/token_starter.md", "references/color/oklch_workflow.md", "references/type/typography_system.md", "references/layout/layout_responsive.md", "../shared/design_token_vocabulary.md", "../shared/sk_code_handoff.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the static axis: color, typography, or layout",
    "Confirm the system role: brand, product, data, marketing, or platform adaptation",
    "Provide one concrete input, brand constraint, or target UI",
    "Confirm verification expectations (contrast, measure, breakpoints) before completion",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    shared_root = (SKILL_ROOT.parent / "shared").resolve()
    # The sibling shared/ dir holds family docs like the operating register, a
    # sanctioned cross-packet location. Every other parent path is rejected.
    if not (resolved.is_relative_to(SKILL_ROOT) or resolved.is_relative_to(shared_root)):
        raise ValueError(f"Resource escapes the skill root: {relative_path}")
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return relative_path if resolved.is_relative_to(shared_root) else resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().lower()
    if override:
        return override
    return (intents[0] if intents else "unknown").lower()

def classify_intents(user_request, task=None):
    text = (user_request or "").lower()
    scores = {intent: 0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        weight = cfg["weight"]
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("COLOR", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_foundations_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    reference_prefix = f"references/{routing_key}/"
    keyed_refs = sorted(path for path in inventory if path.startswith(reference_prefix))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        available = guarded in inventory or (SKILL_ROOT / guarded).resolve().exists()
        if available and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for default_path in DEFAULT_RESOURCE:
        load_if_available(default_path)
    baseline_count = len(loaded)
    if max(scores.values() or [0]) < 0.5:
        # No-signal / unscoped request: load one reference from each axis as a safe fallback.
        for relative_path in RESOURCE_MAP["COLOR"] + RESOURCE_MAP["TYPE"] + RESOURCE_MAP["LAYOUT"]:
            load_if_available(relative_path)
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
    for relative_path in keyed_refs:
        load_if_available(relative_path)

    if routing_key == "unknown" or (len(loaded) == baseline_count and not keyed_refs):
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No keyed knowledge base found for routing key '{routing_key}'",
            "resources": loaded,
        }

    return {"routing_key": routing_key, "intents": intents, "intent_scores": scores, "resources": loaded}
```
