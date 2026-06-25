---
name: sk-design
description: Design-family umbrella router that selects the smallest useful sk-design child and exposes shared design-base references.
allowed-tools: [Read, Grep, Glob, Task]
version: 1.0.0.0
---

<!-- Keywords: sk-design, design-family, umbrella-router, interface-design, design-tokens, motion-design, design-audit, design-spec -->

# Design Family Router (sk-design)

`sk-design` is the thin entry point for the design skill family. It routes design intent to the smallest useful sibling skill and provides shared base vocabulary that children may cite.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request is design-family work and the best child is not already obvious:
- Interface direction, visual identity, UI build guidance, redesign, or "make it look good" prompts.
- Color, typography, spacing, layout, hierarchy, theme, or design-token prompts.
- Animation, transition, motion, micro-interaction, or reduced-motion prompts.
- Accessibility, performance, critique, production hardening, or design-quality audit prompts.
- `DESIGN.md`, style-reference extraction, design-system capture, or design-spec authoring prompts.

### When NOT to Use

Skip this skill when:
- The user names a specific child skill; invoke that child directly.
- The work is pure implementation after design direction is settled; hand off to `sk-code`.
- The work only needs a transport such as Figma or Open Design; load the correct design judgment skill first, then use the transport.

---

## 2. SMART ROUTING

### Primary Detection Signal

The routing key is the dominant design intent in the prompt, not a project or stack marker. Score the request against the five design intents and route to the matching child; the smallest useful child wins.

```bash
# Example intent detection (illustrative, not exhaustive)
echo "$REQUEST" | grep -Eqi "motion|transition|animation|micro-interaction" && INTENT="MOTION"
echo "$REQUEST" | grep -Eqi "token|color|typography|spacing|layout|hierarchy" && INTENT="FOUNDATIONS"
echo "$REQUEST" | grep -Eqi "audit|critique|accessibility|performance|slop" && INTENT="AUDIT"
echo "$REQUEST" | grep -Eqi "design\.md|style reference|extract" && INTENT="SPEC"
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect dominant design intent (interface/foundations/motion/audit/spec)
    +- STEP 1: Score intents (top-2 only when axes are clearly separate)
    +- Phase 1: Route to the smallest useful child
    +- Phase 2: Expose shared base references the child may cite
    +- Phase 3: Hand built design output to sk-code
```

### Resource Domains

The router discovers shared base markdown recursively from `references/` and applies intent scoring from `INTENT_MODEL`. Children own their own resources; this parent exposes only shared base vocabulary.

```text
references/anti_slop_principles.md
references/cognitive_laws.md
references/design_token_vocabulary.md
```

- `references/` for shared design-base vocabulary (anti-slop principles, cognitive laws, token vocabulary).
- Child skills own their own `references/`, `assets/`, and workflow guidance.

### Resource Loading Levels

| Level       | When to Load             | Resources                              |
| ----------- | ------------------------ | -------------------------------------- |
| ALWAYS      | Every routing decision   | None; choose a child first             |
| CONDITIONAL | If a child cites it      | Shared base reference for that intent  |
| ON_DEMAND   | Only on explicit request | Full shared base vocabulary set        |

### Domain-Based Routing

Route to one child first. Add another child only when the prompt has clearly separate design axes.

| Intent | Route To | Boundary |
| --- | --- | --- |
| Interface direction, UI build, visual identity, redesign, interface copy | `sk-design-interface` | Owns direction and build judgment for distinctive interfaces |
| Color, type, layout, spacing, hierarchy, grids, themes, design tokens | `sk-design-foundations` | Owns static visual-system decisions and token vocabulary |
| Animation, transitions, micro-interactions, motion timing, reduced motion | `sk-design-motion` | Owns temporal behavior and interaction feel |
| Accessibility, performance, critique, slop detection, QA, hardening | `sk-design-audit` | Owns review, scoring, risk surfacing, and production hardening |
| `DESIGN.md`, style reference, design-system extraction or authoring | `sk-design-spec` | Owns design artifacts that other skills consume |

### Routing Rules

1. Prefer the smallest useful child.
2. Default generic "make this look good" prompts to `sk-design-interface` unless the prompt is explicitly audit, token, motion, or spec work.
3. Pair children only for distinct axes, such as `sk-design-interface` plus `sk-design-motion` for a landing page with substantial interaction choreography.
4. Keep this parent loaded only long enough to choose the child and expose shared base references.

### Smart Router Pseudocode

#### Smart Router (Resilience Pattern)

> Pattern: see [sk-doc smart-router resilience template](../sk-doc/assets/skill/skill_smart_router.md). The mechanics below stay unchanged; only the design-intent `INTENT_MODEL`, `RESOURCE_MAP`, and routing key are skill-specific.

The router discovers shared base references at runtime, guards every path before loading, derives a routing key from the dominant design intent, and returns an `UNKNOWN_FALLBACK` checklist when intent confidence is too low to pick a child.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/anti_slop_principles.md"

INTENT_MODEL = {
    "INTERFACE": {"keywords": [("interface", 4), ("visual identity", 4), ("redesign", 3), ("make it look good", 3), ("ui build", 3)]},
    "FOUNDATIONS": {"keywords": [("token", 4), ("color", 3), ("typography", 3), ("spacing", 3), ("layout", 3), ("hierarchy", 3)]},
    "MOTION": {"keywords": [("motion", 4), ("animation", 4), ("transition", 3), ("micro-interaction", 3), ("reduced motion", 3)]},
    "AUDIT": {"keywords": [("audit", 4), ("critique", 4), ("accessibility", 3), ("performance", 3), ("slop", 3), ("hardening", 3)]},
    "SPEC": {"keywords": [("design.md", 4), ("style reference", 4), ("extract", 3), ("design system", 3)]},
}

RESOURCE_MAP = {
    "INTERFACE": ["references/anti_slop_principles.md", "references/cognitive_laws.md"],
    "FOUNDATIONS": ["references/design_token_vocabulary.md", "references/anti_slop_principles.md"],
    "MOTION": ["references/cognitive_laws.md", "references/anti_slop_principles.md"],
    "AUDIT": ["references/anti_slop_principles.md", "references/cognitive_laws.md"],
    "SPEC": ["references/design_token_vocabulary.md"],
}

LOAD_LEVELS = {
    "INTERFACE": "STANDARD",
    "FOUNDATIONS": "STANDARD",
    "MOTION": "STANDARD",
    "AUDIT": "STANDARD",
    "SPEC": "MINIMAL",
}

ROUTE_TO_CHILD = {
    "INTERFACE": "sk-design-interface",
    "FOUNDATIONS": "sk-design-foundations",
    "MOTION": "sk-design-motion",
    "AUDIT": "sk-design-audit",
    "SPEC": "sk-design-spec",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the dominant design intent (interface, foundations, motion, audit, or spec)",
    "Confirm whether this is direction, build, critique, or extraction work",
    "Provide one concrete artifact, screen, or design goal",
    "Confirm verification expectations before handing off to sk-code",
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
        return ("INTERFACE", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_design_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    children = [ROUTE_TO_CHILD[i] for i in intents if i in ROUTE_TO_CHILD]
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
            "route_to": children,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    if not children or (len(loaded) == baseline_count and not RESOURCE_MAP.get(primary)):
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No design child resolved for routing key '{routing_key}'",
            "route_to": children,
            "resources": loaded,
        }

    return {"routing_key": routing_key, "intents": intents, "intent_scores": scores, "route_to": children, "resources": loaded}
```

---

## 3. HOW IT WORKS

`sk-design` is an umbrella-router over independent sibling skills. It is not a monolithic hub and does not co-load children by default.

The parent owns:
- Family entry triggers.
- Routing boundaries between the five children.
- Shared design-base references under `references/`.

The children own:
- Their workflow, examples, standards, and verification guidance.
- Their detailed design judgment or extraction mechanics.
- Their own resource loading and task-specific rules.

The shared base exists so children can use consistent language for anti-slop critique, design-token vocabulary, and cognitive laws without duplicating that material.

**Routing Flow**:
```
STEP 1: Detect dominant design intent
       ├─ Score request against the five intents
       ├─ Keep top-2 only when axes are clearly separate
       └─ Resolve routing key
       ↓
STEP 2: Route to the smallest useful child
       ├─ Default generic prompts to sk-design-interface
       └─ Pair children only for distinct axes
       ↓
STEP 3: Expose shared base references
       └─ Child cites anti-slop, cognitive laws, or token vocabulary as needed
```

---

## 4. RULES

### ALWAYS

1. Route to the smallest useful design child.
2. Preserve child independence; each `sk-design-*` skill remains directly invokable.
3. Use the shared base as vocabulary, not as a substitute for child-owned workflow guidance.
4. Keep design transports separate from design judgment.
5. Hand implementation to `sk-code` after the design output is clear.

### NEVER

1. Never embed per-child design instructions in this parent.
2. Never co-load the whole design family for a single-axis prompt.
3. Never treat `mcp-figma` or `mcp-open-design` as taste or critique authority; they are transports.
4. Never route pure code, backend, or data work through the design family.

### ESCALATE IF

1. The prompt spans more than three design axes and needs an explicit workflow order.
2. A named child skill conflicts with the request's actual intent.
3. Brand, accessibility, or production constraints make the requested visual direction unsafe or contradictory.

---

## 5. REFERENCES

### Core References

Shared design-base references:
- [anti_slop_principles.md](references/anti_slop_principles.md) - Shared anti-slop critique vocabulary
- [design_token_vocabulary.md](references/design_token_vocabulary.md) - Shared color, type, layout, and motion token terms
- [cognitive_laws.md](references/cognitive_laws.md) - Shared cognitive-law rationale for hierarchy and interaction

### Reference Loading Notes

- Load a shared base reference only when a child cites it.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

- The parent selects one primary child for the request.
- The selected child owns the detailed design workflow.
- Shared references are used only for common vocabulary and cross-child consistency.
- No design task requires loading all five children by default.

---

## 7. INTEGRATION POINTS

### Child Skills

- `sk-design-interface`: direction, distinctive UI build judgment, interface writing.
- `sk-design-spec`: `DESIGN.md` extraction and authoring; currently represented by `sk-design-md-generator` until the spec child is fully onboarded.
- `sk-design-foundations`: color, typography, layout, responsive systems, tokens.
- `sk-design-motion`: animation, transitions, micro-interactions, temporal feel.
- `sk-design-audit`: accessibility, performance, critique, hardening, production readiness.

### Transports and Consumers

- `mcp-figma` and `mcp-open-design` are transports. Use them after selecting the design judgment skill.
- `sk-code` consumes design output and implements it in the detected code surface.
- `sk-code-review` can audit implementation quality after design and build work converge.

---

## 8. REFERENCES AND RELATED RESOURCES

The router exposes shared base references under `references/`. Start with `references/anti_slop_principles.md`, `references/design_token_vocabulary.md`, and `references/cognitive_laws.md`, then route to the child that owns the detailed workflow per Section 2.

Related current children: `sk-design-interface` for direction and build judgment, and `sk-design-md-generator` for current `DESIGN.md` and style-reference extraction work.

Related skills: `sk-code` for implementation handoff, and `system-spec-kit` when packet documentation or memory continuity applies.
