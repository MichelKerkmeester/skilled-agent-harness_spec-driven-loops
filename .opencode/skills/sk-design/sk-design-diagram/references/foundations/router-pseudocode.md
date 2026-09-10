---
title: "Diagram Router Pseudocode"
description: "The reference implementation of the diagram skill's smart router, moved out of SKILL.md so the contract stays short and the code stays whole."
trigger_phrases:
  - "diagram router pseudocode"
  - "route_diagram_resources"
  - "diagram smart router"
importance_tier: "normal"
contextType: "reference"
version: 1.1.0.2
---

# Diagram Router Pseudocode

This is the reference implementation of the routing rules stated in `SKILL.md` § Smart Routing. The rules there are the contract; this is one way to hold them, kept whole here so the skill contract does not carry a fifth of its bytes as code.

---

## 1. IMPLEMENTATION

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/foundations/style-guide.md"

INTENT_MODEL = {
    "GENERATE": {"keywords": [("diagram", 4), ("architecture", 3), ("sequence", 3), ("swimlane", 3), ("er model", 3), ("venn", 3)]},
    "IMPORT": {"keywords": [("drawio", 4), ("draw.io", 4), ("mermaid", 4), ("mmd", 4), ("redraw", 3)]},
    "EXPORT": {"keywords": [("export", 4), ("png", 3), ("svg", 3), ("rasterize", 3)]},
    "ASCII_MARKDOWN": {"keywords": [("ascii flowchart", 4), ("workflow diagram", 4), ("text diagram", 4), ("decision tree", 3), ("decision branch", 3), ("approval loop diagram", 3), ("parallel execution diagram", 3)]},
    "STYLE": {"keywords": [("customize", 3), ("onboard", 3), ("style guide", 2), ("palette", 2), ("brand", 2)]},
}

RESOURCE_MAP = {
    "GENERATE": ["references/foundations/style-guide.md"],
    "IMPORT": ["references/import-export/import-drawio.md", "references/import-export/import-mermaid.md", "references/foundations/output-spec.md"],
    "EXPORT": ["references/import-export/export.md", "references/foundations/output-spec.md"],
    "ASCII_MARKDOWN": ["references/ascii-format/pattern-selection.md", "references/ascii-format/notation-and-validator.md"],
    "STYLE": ["references/foundations/onboarding.md", "references/foundations/style-guide.md"],
}

LOAD_LEVELS = {
    "GENERATE": "STANDARD",
    "IMPORT": "STANDARD",
    "EXPORT": "STANDARD",
    "STYLE": "MINIMAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the request shape (generate, import, or export) and the diagram type",
    "Confirm the target file path for the .html deliverable",
    "Confirm whether the style guide should be customized first",
    "Confirm verification expectations (taste gate, self-contained output) before completion",
]

AMBIGUITY_DELTA = 1

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
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().lower()
    if override:
        return override
    return (intents[0] if intents else "unknown").lower()

def classify_intents(user_request, task=None):
    text = (user_request or "").lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("GENERATE", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_diagram_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    baseline_count = len(loaded)
    if max(scores.values() or [0]) < 0.5:
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

    return {"routing_key": routing_key, "intents": intents, "intent_scores": scores, "resources": loaded}
```
