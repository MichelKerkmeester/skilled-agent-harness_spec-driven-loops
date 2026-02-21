---
description: "Intent scoring, resource discovery, and smart loading logic for routing requests to the right resources"
---
# Smart Routing

Authoritative routing logic for scoped resource loading, weighted intent scoring, and ambiguity handling.

## Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/implementation/` for feature implementation patterns, async workflows, and integration guidance.
- `references/debugging/` for root-cause workflows, error recovery, and troubleshooting methodology.
- `references/verification/` for browser-based verification workflows and completion validation.
- `references/standards/` for style enforcement, quality expectations, and compliance guidance.
- `references/performance/` for optimization strategies and performance diagnostics.
- `references/deployment/` for minification and CDN deployment workflows.
- `references/research/` for structured pre-implementation analysis patterns.
- `assets/checklists/` for implementation, debugging, quality, and verification gates.
- `assets/integrations/` for external integration patterns (for example Lenis and HLS).
- `assets/patterns/` for reusable implementation snippets and validation/waiting patterns.

## Resource Loading Levels

| Level       | When to Load             | Resources                          |
| ----------- | ------------------------ | ---------------------------------- |
| ALWAYS      | Every phase invocation   | Core workflow + essential patterns |
| CONDITIONAL | If task keywords match   | Domain-specific references         |
| ON_DEMAND   | Only on explicit request | Deep-dive optimization guides      |

## Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/implementation/implementation_workflows.md"

TASK_SIGNALS = {
    "VERIFICATION": {"verify": 2.4, "done": 2.1, "complete": 2.0, "works": 1.8},
    "DEBUGGING": {"bug": 2.3, "fix": 2.0, "error": 2.4, "broken": 1.8},
    "CODE_QUALITY": {"style check": 2.2, "quality check": 2.2, "check standards": 2.0},
    "IMPLEMENTATION": {"implement": 2.0, "build": 1.7, "create": 1.5, "feature": 1.5},
    "ANIMATION": {"animation": 2.1, "gsap": 2.3, "lenis": 2.1, "swiper": 2.1},
    "FORMS": {"form": 2.0, "validation": 1.7, "submit": 1.5},
    "VIDEO": {"video": 2.0, "hls": 2.4, "streaming": 2.1},
    "DEPLOYMENT": {"deploy": 2.2, "minify": 2.1, "cdn": 2.0, "r2": 1.8},
    "PERFORMANCE": {"performance": 2.2, "optimize": 1.7, "core web vitals": 2.4},
}

NOISY_SYNONYMS = {
    "DEBUGGING": {"unstable": 1.4, "janky": 1.6, "freeze": 1.6, "stutter": 1.5, "regression": 1.3},
    "PERFORMANCE": {"cls": 1.7, "layout shift": 1.7, "main thread": 1.4, "stuck frame": 1.4},
    "FORMS": {"duplicate submit": 1.9, "double submit": 1.9, "slow network": 1.2},
    "VERIFICATION": {"before claiming": 1.6, "prove": 1.4, "evidence": 1.3},
}

MULTI_SYMPTOM_TERMS = ["janky", "stutter", "freeze", "cls", "duplicate", "flaky", "intermittent", "regression"]

UNKNOWN_FALLBACK_CHECKLIST = [
    "Identify primary failing surface (animation, forms, layout, network)",
    "Capture one reproducible browser trace (console + performance profile)",
    "Confirm target environment (mobile/desktop and browser)",
    "State expected completion evidence (Lighthouse, lint, runtime checks)",
]

RESOURCE_MAP = {
    "IMPLEMENTATION": ["references/implementation/implementation_workflows.md"],
    "CODE_QUALITY": ["assets/checklists/code_quality_checklist.md", "references/standards/code_style_enforcement.md"],
    "DEBUGGING": ["assets/checklists/debugging_checklist.md", "references/debugging/debugging_workflows.md"],
    "VERIFICATION": ["assets/checklists/verification_checklist.md", "references/verification/verification_workflows.md"],
    "ANIMATION": ["references/implementation/animation_workflows.md", "references/implementation/observer_patterns.md"],
    "FORMS": ["references/implementation/form_upload_workflows.md", "references/implementation/implementation_workflows.md"],
    "VIDEO": ["references/implementation/implementation_workflows.md"],
    "DEPLOYMENT": ["references/deployment/minification_guide.md", "references/deployment/cdn_deployment.md"],
    "PERFORMANCE": ["references/implementation/performance_patterns.md", "references/implementation/async_patterns.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full checklist", "full performance plan"],
    "ON_DEMAND": ["assets/checklists/code_quality_checklist.md", "assets/checklists/verification_checklist.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "description", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
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

def score_intents(task):
    """Weighted intent scoring from request text and phase signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in TASK_SIGNALS}
    for intent, terms in TASK_SIGNALS.items():
        for term, weight in terms.items():
            if term in text:
                scores[intent] += weight
    for intent, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[intent] += weight
    if getattr(task, "phase", "") == "verification" or getattr(task, "claiming_complete", False):
        scores["VERIFICATION"] += 5
    if getattr(task, "phase", "") == "debugging":
        scores["DEBUGGING"] += 5
    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 0.8, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENTATION"]

    noisy_hits = sum(1 for term in MULTI_SYMPTOM_TERMS if term in (task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 3 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected[:max_intents]

def route_frontend_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=0.8)
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

    if sum(scores.values()) < 0.5:
        load_if_available("assets/checklists/debugging_checklist.md")
        load_if_available("assets/checklists/verification_checklist.md")
        return {
            "intents": ["IMPLEMENTATION"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = task_text
    if "lenis" in text:
        load_if_available("references/implementation/animation_workflows.md")
    if "hls" in text:
        load_if_available("references/implementation/implementation_workflows.md")
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

## Cross References
- [[when-to-use]] - Activation triggers and keyword matching
- [[how-it-works]] - Phase lifecycle that routing feeds into