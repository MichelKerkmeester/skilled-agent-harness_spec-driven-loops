---
name: sk-design-motion
description: Temporal interaction design for purposeful animation, micro-interactions, transitions, motion materials, AnimatePresence, and reduced motion.
allowed-tools: [Read, Grep, Glob, Task]
version: 1.0.1.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: sk-design-motion, motion-design, animation, transitions, micro-interactions, framer-motion, AnimatePresence, reduced-motion, motion-performance -->

# Design Motion (sk-design-motion)

`sk-design-motion` owns the temporal layer of the `sk-design` family: animation purpose, interaction feedback, transition choreography, motion materials, `motion/react` and `AnimatePresence` patterns, morphing icon behavior, and reduced-motion alternatives.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Designing or implementing animation, transitions, micro-interactions, hover/focus/active feedback, loading motion, or gesture behavior.
- Choosing timing, easing, spring behavior, stagger, entrance/exit choreography, or motion materials.
- Reviewing or authoring `motion/react`, Framer Motion, `AnimatePresence`, CSS transitions, View Transitions, or SVG icon morphs.
- Creating reduced-motion alternatives while preserving information and state feedback.

Keyword triggers: `animation`, `motion`, `micro-interaction`, `transition`, `hover state`, `loading state`, `stagger`, `AnimatePresence`, `framer-motion`, `motion/react`, `morphing icons`, `reduced motion`, `spring`, `gesture`, `exit animation`.

### When NOT to Use

Skip this skill when:
- The task is static color, type, layout, responsive, or theme-token work. Use `sk-design-foundations`.
- The task is to invent the full visual direction or interface concept. Use `sk-design-interface` first.
- The task is a findings-first quality audit or motion performance review. Use `sk-design-audit`, which may cite this skill.
- The task is pure code implementation after choreography is specified. Hand off to `sk-code`.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It owns motion build guidance. `sk-design-audit` owns motion-performance findings and release scoring; this child supplies the standards audit can cite.

Pairs well with:
- `sk-design-interface` for one memorable motion moment tied to the design direction.
- `sk-design-foundations` for motion tokens that match static visual-system tokens.
- `sk-design-audit` for post-build motion-performance and accessibility checks.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by temporal concern:

```text
MOTION TASK
    |
    +- Purpose/timing/easing/choreography -> references/motion_strategy.md
    +- Feedback/loading/gestures/delight -> references/micro_interactions.md
    +- motion/react, AnimatePresence, exits, lists -> references/animate_presence_patterns.md
    +- Reduced motion or jank/perf-sensitive choices -> references/performance_reduced_motion.md
```

### Phase Detection

```text
MOTION TASK
    |
    +- STEP 0: Detect temporal concern (strategy/interaction/presence/performance)
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Choreography decisions (purpose, timing, easing, material)
    +- Phase 2: Interaction/presence build guidance
    +- Phase 3: Performance and reduced-motion verification
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_MODEL`.

- `references/motion_strategy.md` covers why motion exists, timing, easing, staging, animation principles, and materials.
- `references/micro_interactions.md` covers interaction feedback, loading states, gesture patterns, delight, and morphing icons.
- `references/animate_presence_patterns.md` covers `motion/react`, `AnimatePresence`, exit props, keys, modes, nested exits, and presence hooks.
- `references/performance_reduced_motion.md` covers compositor safety, FLIP, scroll motion, expensive effects, off-screen pausing, and reduced-motion alternatives.
- `references/corpus_map.md` maps the source corpus.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any motion task | `references/corpus_map.md` plus the matching temporal-concern reference (`references/motion_strategy.md` for strategy/timing) |
| CONDITIONAL | Micro-interactions, loading, gestures, delight, icons | `references/micro_interactions.md` |
| CONDITIONAL | `motion/react`, Framer Motion, exits, lists, modal transitions | `references/animate_presence_patterns.md` |
| CONDITIONAL | Reduced-motion, jank, scroll, blur/filter, performance constraints | `references/performance_reduced_motion.md` |
| ON_DEMAND | Static token coordination | Parent `sk-design/references/design_token_vocabulary.md` and `sk-design-foundations` |

### Smart Router Pseudocode

The authoritative routing logic: runtime discovery, scoped path guards, weighted intent scoring with top-2 ambiguity handling, a runtime routing key, and a multi-tier graceful fallback. See [skill_smart_router.md](../sk-doc/assets/skill/skill_smart_router.md) for the full resilience pattern.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/corpus_map.md"

INTENT_MODEL = {
    "STRATEGY": {"keywords": [("motion strategy", 4), ("timing", 3), ("easing", 3), ("choreography", 3), ("stagger", 3), ("material", 2)]},
    "MICRO_INTERACTIONS": {"keywords": [("micro", 4), ("hover", 3), ("active", 3), ("loading", 3), ("gesture", 3), ("delight", 3), ("icon", 3), ("morph", 3)]},
    "PRESENCE": {"keywords": [("animatepresence", 4), ("framer", 4), ("motion/react", 4), ("exit", 3), ("presence", 3), ("modal", 3), ("list", 2)]},
    "PERFORMANCE": {"keywords": [("reduced motion", 4), ("performance", 4), ("jank", 4), ("scroll", 3), ("blur", 3), ("filter", 3), ("will-change", 3), ("flip", 3)]},
}

RESOURCE_MAP = {
    "STRATEGY": ["references/motion_strategy.md"],
    "MICRO_INTERACTIONS": ["references/micro_interactions.md"],
    "PRESENCE": ["references/animate_presence_patterns.md"],
    "PERFORMANCE": ["references/performance_reduced_motion.md"],
}

LOAD_LEVELS = {
    "STRATEGY": "STANDARD",
    "MICRO_INTERACTIONS": "STANDARD",
    "PRESENCE": "STANDARD",
    "PERFORMANCE": "STANDARD",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the temporal concern: strategy, interaction, presence, or performance",
    "Confirm the task intent and the affected interaction or state",
    "Provide one concrete input, target component, or expected motion behavior",
    "Confirm reduced-motion and performance expectations before completion",
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
        return ("STRATEGY", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_motion_resources(user_request, task=None):
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

## 3. HOW IT WORKS

### Motion Design Workflow

1. Name the purpose: feedback, orientation, focus, continuity, perceived performance, or earned delight.
2. Decide the motion budget: one hero moment, local feedback layer, state transitions, or no motion.
3. Choose timing and easing:
   - `100-150ms` for instant feedback.
   - `200-300ms` for small state transitions.
   - `300-500ms` for modal, drawer, or layout transitions.
   - `500-800ms` only for earned entrances or choreographed brand moments.
4. Choose the material: transform/opacity first; bounded blur, filter, mask, clip-path, shadow, or color only when it creates a real effect and can be verified smooth.
5. Define reduced-motion behavior that preserves state information without non-essential movement.
6. Hand implementation to `sk-code` with timing, easing, states, reduced-motion fallback, and performance risks.

### Motion Judgment

Good motion clarifies. Bad motion decorates, delays, or competes. One well-rehearsed transition beats scattered reveal effects across every section.

---

## 4. RULES

### ALWAYS

1. State the purpose of every animation before specifying properties.
2. Keep user-initiated feedback fast, usually under `300ms`.
3. Make exits faster than entrances, usually about 75 percent of enter duration.
4. Use ease-out for entrances and ease-in for exits unless a spring is explicitly justified.
5. Respect `prefers-reduced-motion` and preserve equivalent state feedback.
6. For `AnimatePresence`, ensure conditional motion elements have wrappers, stable keys, exit props, and coordinated modes.
7. Pause, stop, or avoid looping motion when off-screen.
8. Keep delight earned, brief, contextual, and non-blocking.

### NEVER

1. Never animate without a user, state, hierarchy, or continuity reason.
2. Never scatter fade-and-rise scroll reveals across every section as default choreography.
3. Never animate layout-driving properties casually (`width`, `height`, `top`, `left`, margins) when transform, FLIP, or grid-row techniques can work.
4. Never use bounce or elastic easing as a default; it draws attention to the animation itself.
5. Never let `mode="wait"` double total transition time without reducing each phase.
6. Never use index keys in animated dynamic lists.
7. Never make delight block a task or hide poor UX.
8. Never partially migrate animation libraries inside one interaction surface.

### ESCALATE IF

1. Performance constraints, target devices, or motion sensitivity requirements are unknown and affect the motion budget.
2. The requested effect requires large continuous blur/filter/layout animation.
3. The stack has an existing animation system and the request implies replacing it.
4. The motion is compensating for unclear static hierarchy; route back to foundations or interface first.

---

## 5. REFERENCES

### Core References

- [`references/motion_strategy.md`](references/motion_strategy.md) - Purpose, timing, easing, staging, principles, and motion materials.
- [`references/micro_interactions.md`](references/micro_interactions.md) - Feedback, loading, gestures, delight, sound boundaries, and morphing icons.
- [`references/animate_presence_patterns.md`](references/animate_presence_patterns.md) - `motion/react` and `AnimatePresence` patterns.
- [`references/performance_reduced_motion.md`](references/performance_reduced_motion.md) - Performance, FLIP, scroll, layers, blur/filter, and reduced-motion guidance.
- [`references/corpus_map.md`](references/corpus_map.md) - Source traceability for the distilled corpus.

### Parent Shared Base

Use, do not duplicate, the parent references for shared vocabulary:
- `../sk-design/references/anti_slop_principles.md`
- `../sk-design/references/design_token_vocabulary.md`
- `../sk-design/references/cognitive_laws.md`

---

## 6. SUCCESS CRITERIA

- Every motion choice has a purpose and an affected state.
- Timing, easing, and material choices are explicit.
- Reduced-motion behavior is specified.
- Implementation handoff names the target states, target properties, and verification risks.
- Motion does not block interaction, compete with primary hierarchy, or exhaust the user.

---

## 7. INTEGRATION POINTS

- `sk-design` routes motion-family prompts here.
- `sk-design-interface` defines the visual story this child choreographs.
- `sk-design-foundations` supplies static tokens and layout constraints.
- `sk-design-audit` uses this skill's rules when scoring motion performance and accessibility.
- `sk-code` implements motion in the target stack.

---

## 8. REFERENCES AND RELATED RESOURCES

Feature inventory lives in `feature_catalog/feature_catalog.md`. Manual validation scenarios live in `manual_testing_playbook/manual_testing_playbook.md`. The initial release notes are in `changelog/v1.0.0.0.md`.
