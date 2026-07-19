---
title: "design-mcp-open-design: Smart Router Pseudocode"
description: "The full WIRE/READ/RUN intent-classification, resource-mapping, and design_gate hard-coupling implementation behind SKILL.md Section 2 (SMART ROUTING)."
trigger_phrases:
  - "open design smart router"
  - "open design intent classification"
  - "open design design_gate"
  - "od router pseudocode"
importance_tier: "normal"
contextType: "implementation"
version: 1.5.0.0
---

# design-mcp-open-design: Smart Router Pseudocode

> **Resilience pattern:** see [sk-doc smart-router template](../../../sk-doc/create-skill/assets/skill/skill_smart_router.md). This skill is a flat intent router (WIRE / READ / RUN), not a keyed `references/<key>/` or `assets/<key>/` resource router. Guard paths, discover current markdown resources at runtime, load only existing resources once, and fall back with an explicit checklist when unsure.

This is the reference implementation behind [`SKILL.md`](../SKILL.md) Section 2 (SMART ROUTING): the keyword-weighted intent classifier, the resource map per direction, and the `design_gate` hard-coupling check that blocks any RUN or design-feeding READ without a classified `openDesignPurpose`.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# `assets/` is optional for this skill; discovery is existence-guarded.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/od-cli-reference.md"

INTENT_MODEL = {
    "WIRE": {"keywords": [("install", 4), ("wire", 4), ("connect", 3), ("mcp add", 4)]},
    "READ": {"keywords": [("read", 3), ("list", 3), ("search", 3), ("design system", 4), ("tokens", 3), ("reuse", 3), ("ground", 3)]},
    "RUN":  {"keywords": [("run", 3), ("generate", 4), ("commission", 4), ("start_run", 4), ("artifact", 3)]},
}

RESOURCE_MAP = {
    "WIRE": ["references/mcp-wiring.md", "references/od-cli-reference.md"],
    "READ": ["references/tool-surface.md", "references/od-cli-reference.md"],
    "RUN":  ["references/tool-surface.md", "references/od-cli-reference.md"],
}

# ⛔ HARD COUPLING: any RUN, or any READ that feeds a design decision, is design
# work and MUST load sk-design and run its ground -> token-system ->
# critique BEFORE any design output. design-mcp-open-design owns the transport; the
# judgment is sk-design's and is non-negotiable. A design step composed
# without it is blocked (see design_gate below). Pure WIRE / bare inventory is
# exempt only when the caller positively asserts openDesignExemption.
DESIGN_INTENTS = {"READ", "RUN"}
OPEN_DESIGN_PURPOSES = {"openDesignExemption", "skDesignGate"}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the direction: wire the MCP server, read local content, or commission a run",
    "Confirm the Open Design desktop app is running (the daemon hosts every tool call)",
    "Confirm the od CLI path: node \"<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs\"",
    "For RUN or any mutating verb, confirm the user wants a write and name the target project",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)            # raises if path escapes the skill
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
        return ("READ", None, scores)
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def classify_open_design_purpose(openDesignPurpose):
    return openDesignPurpose if openDesignPurpose in OPEN_DESIGN_PURPOSES else "unclassified"

def design_gate(intents, openDesignPurpose):
    # ⛔ HARD precondition. Omitted or unknown purpose is guarded, not exempt.
    # Pure WIRE / bare inventory must assert openDesignExemption and cannot later
    # feed a design decision. skDesignGate is the design-authorized path.
    purpose = classify_open_design_purpose(openDesignPurpose)
    if purpose == "unclassified":
        raise PermissionError("openDesignPurpose is required: openDesignExemption or skDesignGate")
    if "RUN" in intents and purpose == "openDesignExemption":
        raise PermissionError("openDesignExemption is pure transport only")
    if purpose == "skDesignGate":
        require_sk_interface_design()   # load + run ground -> token-system -> critique;
                                        # RAISE/BLOCK if skipped. Never produce UI without it.

def route_open_design_resources(request: str, openDesignPurpose: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    design_gate(intents, openDesignPurpose)   # ⛔ omission is unclassified -> guarded, not exempt
    loaded, seen = [], set()

    def load_if_available(rel: str):
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 1:
        return {"intents": intents, "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## References

- [`SKILL.md`](../SKILL.md) - Section 2 (SMART ROUTING) is the single routing authority; this file is its implementation detail.
- [`od-cli-reference.md`](od-cli-reference.md) - the default-loaded resource this router always fetches.
- [`mcp-wiring.md`](mcp-wiring.md) - the WIRE-direction resource.
- [`tool-surface.md`](tool-surface.md) - the READ/RUN-direction resource.
