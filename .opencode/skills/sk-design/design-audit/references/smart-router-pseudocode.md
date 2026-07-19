---
title: "design-audit: Smart Router Pseudocode"
description: "The full a11y/perf/critique/harden intent-classification, keyed routing-key derivation, and existence-guarded resource-loading implementation behind SKILL.md Section 2 (SMART ROUTING)."
trigger_phrases:
  - "design audit smart router"
  - "audit intent classification"
  - "audit routing key"
  - "audit router pseudocode"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# design-audit: Smart Router Pseudocode

> **Resilience pattern:** see [sk-doc smart-router resilience template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md) for the full runtime discovery, guarded load, routing-key, and fallback reference.

This is the reference implementation behind [`SKILL.md`](../SKILL.md) Section 2 (SMART ROUTING): the keyword-weighted `INTENT_SIGNALS` classifier, the `RESOURCE_MAP` per audit intent, the routing-key-derived keyed folder lookup, and the existence-guarded `load_if_available()` loader.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = ["references/corpus-map.md", "../shared/register.md", "../shared/context-loading-contract.md"]

INTENT_SIGNALS = {
    "AUDIT_CONTRACT": {"weight": 4, "keywords": ["audit", "score", "release readiness", "severity", "p0", "p1", "quality score", "report template"]},
    "ACCESSIBILITY_PERFORMANCE": {"weight": 4, "keywords": ["accessibility", "wcag", "aria", "keyboard", "focus", "contrast", "performance", "jank", "core web vitals", "a11y fix"]},
    "CRITIQUE_HARDENING": {"weight": 4, "keywords": ["critique", "cognitive", "heuristic", "persona", "polish", "harden", "edge case", "i18n", "production readiness"]},
    "ANTI_PATTERNS_PRODUCTION": {"weight": 4, "keywords": ["slop", "ai-generated", "theme", "token", "pseudo", "copy", "clarify", "view transition", "fingerprint", "model tell", "anti-patterns score", "anti patterns score", "score calibration"]},
    "TRANSFORM_REMEDIATION": {"weight": 4, "keywords": ["bolder", "quieter", "distill", "redesign", "transform", "remediation", "make it bolder"]},
    "EVIDENCE_CAPTURE": {"weight": 3, "keywords": ["evidence", "screenshot", "browser", "deterministic scan", "source target", "provenance"]},
}

RESOURCE_MAP = {
    "AUDIT_CONTRACT": ["references/corpus-map.md", "references/audit-contract.md", "assets/audit-report-template.md", "../shared/sk-code-handoff.md"],
    "ACCESSIBILITY_PERFORMANCE": ["references/accessibility-performance.md", "assets/a11y-quick-fixes.md"],
    "CRITIQUE_HARDENING": ["references/critique-hardening.md", "references/hardening-edge-cases.md"],
    "ANTI_PATTERNS_PRODUCTION": ["references/anti-patterns-production.md", "references/ai-fingerprint-tells.md", "assets/ai-fingerprint-registry.json", "assets/ai-fingerprint-self-defect-card.md", "assets/anti-patterns-score-rubric.md"],
    "TRANSFORM_REMEDIATION": ["references/transform-remediation.md"],
    "EVIDENCE_CAPTURE": ["references/evidence-capture.md", "assets/audit-evidence-worksheet.md"],
}

LOAD_LEVELS = {
    "AUDIT_CONTRACT": "STANDARD",
    "ACCESSIBILITY_PERFORMANCE": "STANDARD",
    "CRITIQUE_HARDENING": "STANDARD",
    "ANTI_PATTERNS_PRODUCTION": "STANDARD",
    "TRANSFORM_REMEDIATION": "STANDARD",
    "EVIDENCE_CAPTURE": "STANDARD",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the audit mode: contract/score, accessibility/performance, critique/hardening, or anti-pattern/production",
    "Confirm the target artifact: file, URL, screenshot, or design plan",
    "Provide one concrete input, rendered observation, or expected output",
    "Confirm whether a full five-dimension score or a focused review is needed",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    shared_root = (SKILL_ROOT.parent / "shared").resolve()
    # The sibling shared/ dir holds family docs like the operating register, a
    # sanctioned cross-packet location. Every other parent path is rejected.
    if not (resolved.is_relative_to(SKILL_ROOT) or resolved.is_relative_to(shared_root)):
        raise ValueError(f"Resource escapes the skill root: {relative_path}")
    if resolved.suffix.lower() not in (".md", ".json"):
        raise ValueError(f"Only markdown or JSON resources are routable: {relative_path}")
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
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_audit_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    reference_prefix = f"references/{routing_key}/"
    asset_prefix = f"assets/{routing_key}/"
    keyed_refs = sorted(path for path in inventory if path.startswith(reference_prefix))
    keyed_assets = sorted(path for path in inventory if path.startswith(asset_prefix))
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
    for relative_path in keyed_assets:
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

---

## References

- [`SKILL.md`](../SKILL.md) - Section 2 (SMART ROUTING) is the single routing authority; this file is its implementation detail.
- [`corpus-map.md`](corpus-map.md) - part of the always-loaded `DEFAULT_RESOURCE` set.
- [`../shared/register.md`](../../shared/register.md) - part of the always-loaded `DEFAULT_RESOURCE` set.
- [`../shared/context-loading-contract.md`](../../shared/context-loading-contract.md) - part of the always-loaded `DEFAULT_RESOURCE` set.
