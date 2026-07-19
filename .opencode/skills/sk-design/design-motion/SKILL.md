---
name: design-motion
description: Temporal interaction design for animation, micro-interactions, transitions, motion materials, AnimatePresence, and reduced motion.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: motion, motion-design, animation, transitions, micro-interactions, framer-motion, AnimatePresence, reduced-motion, motion-performance -->

# Design Motion (motion)

`motion` owns the temporal layer of the `sk-design` family: animation purpose, interaction feedback, transition choreography, motion materials, `motion/react` and `AnimatePresence` patterns, morphing icon behavior, and reduced-motion alternatives.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Deciding whether an interaction should animate at all, setting a motion budget for a surface or trimming an over-animated interface against the restraint gate.
- Designing or implementing animation, transitions, micro-interactions, hover/focus/active feedback, loading motion, or gesture behavior.
- Choosing timing, easing, spring behavior, stagger, entrance/exit choreography, or motion materials.
- Reviewing or authoring `motion/react`, Framer Motion, `AnimatePresence`, CSS transitions, View Transitions, or SVG icon morphs.
- Creating reduced-motion alternatives while preserving information and state feedback.

Keyword triggers: `animation`, `motion`, `micro-interaction`, `transition`, `hover state`, `focus state`, `active state`, `interaction states`, `loading state`, `stagger`, `choreography`, `motion budget`, `AnimatePresence`, `framer-motion`, `motion/react`, `morphing icons`, `reduced motion`, `spring`, `gesture`, `exit animation`.

### When NOT to Use

Skip this skill when:
- The task is static color, type, layout, responsive, or theme-token work. Use `foundations`.
- The task is to invent the full visual direction or interface concept. Use `interface` first.
- The task is a findings-first quality audit or motion performance review. Use `audit`, which may cite this skill.
- The task is pure code implementation after choreography is specified. Hand off to `sk-code`.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It owns motion build guidance. `audit` owns motion-performance findings and release scoring; this child supplies the standards audit can cite.

Pairs well with:
- `interface` for one memorable motion moment tied to the design direction.
- `foundations` for motion tokens that match static visual-system tokens.
- `audit` for post-build motion-performance and accessibility checks.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by temporal concern:

Route here when the user asks for temporal behavior: whether something should animate, interaction-state feedback, hover/focus/active/loading states, choreography, timing, easing, gestures, reduced motion, or motion performance. If the prompt uses polish language only to evaluate whether animation is appropriate or performant, route to `audit`; if the static hierarchy is unclear before motion can help, route back to `foundations` or `interface` first.

```text
MOTION TASK
    |
    +- Purpose/timing/easing/choreography -> references/motion-strategy.md
    +- Feedback/loading/gestures/delight -> references/micro-interactions.md
    +- motion/react, AnimatePresence, exits, lists -> references/animate-presence-patterns.md
    +- Reduced motion or jank/perf-sensitive choices -> references/performance-reduced-motion.md
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

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

- `references/animation-decision-framework.md` covers the restraint gate that decides whether an interaction animates at all, the frequency tiers, the keyboard rule, and the coupling to the register motion-budget dial.
- `references/motion-strategy.md` covers why motion exists, timing, easing, staging, animation principles, and materials.
- `references/micro-interactions.md` covers interaction feedback, loading states, gesture patterns, delight, and morphing icons.
- `references/animate-presence-patterns.md` covers `motion/react`, `AnimatePresence`, exit props, keys, modes, nested exits, and presence hooks.
- `references/performance-reduced-motion.md` covers compositor safety, FLIP, scroll motion, expensive effects, off-screen pausing, and reduced-motion alternatives.
- `references/advanced-craft.md` covers origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging and Framer Motion shorthand caveats under load.
- `references/corpus-map.md` maps the source corpus.
- `assets/motion-pattern-cards.md` provides fill-in cards for the common motion patterns (feedback, hover, focus, loading, state transition, toast, page transition, gesture, drag-and-drop), each naming owner, purpose, states, and reduced-motion path.
- `assets/animate-presence-checklist.md` provides a pass-or-fail checklist for shipping `AnimatePresence` exits.
- `assets/motion-performance-failure-card.md` provides a build-side card of motion patterns that drop frames, each with its failure signature and the cheaper mechanism to replace it.
- `../shared/register.md` is the parent Brand-vs-Product register. This child reads its motion-budget dial. It sits outside the mode and is not auto-discovered, so it is pointed to explicitly.
- `../shared/sk-code-handoff.md` defines the implementation mechanism and stack-boundary field for motion handoff.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | The first step of any motion task | `../shared/register.md` (read the motion-budget dial that sets the ceiling) and `references/animation-decision-framework.md` (the restraint gate that runs before timing and easing) |
| ALWAYS | Any motion task | `references/corpus-map.md` plus the matching temporal-concern reference (`references/motion-strategy.md` for strategy/timing) |
| CONDITIONAL | Micro-interactions, loading, gestures, delight, icons | `references/micro-interactions.md` |
| CONDITIONAL | `motion/react`, Framer Motion, exits, lists, modal transitions | `references/animate-presence-patterns.md` |
| CONDITIONAL | Reduced-motion, jank, scroll, blur/filter, performance constraints | `references/performance-reduced-motion.md` |
| CONDITIONAL | Advanced popover, tooltip, CSS entry, debugging, or shorthand-under-load craft | `references/advanced-craft.md` |
| CONDITIONAL | Specifying a motion pattern or writing a handoff | `assets/motion-pattern-cards.md` and `../shared/sk-code-handoff.md` |
| CONDITIONAL | Building or reviewing an `AnimatePresence` exit | `assets/animate-presence-checklist.md` |
| CONDITIONAL | A pre-handoff motion performance pass | `assets/motion-performance-failure-card.md` |
| CONDITIONAL | Internal procedure support | `procedures/interaction-states-pass.md` and `../shared/procedures/polish-gate-orchestration.md` when the trigger matches |
| ON_DEMAND | Static token coordination | Parent `sk-design/shared/design-token-vocabulary.md` and `foundations` |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `motion` mode is selected, choose at most one card from `procedures/` or `../shared/procedures/` and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

The authoritative routing logic: runtime discovery, scoped path guards, weighted intent scoring with top-2 ambiguity handling, a runtime routing key, and a multi-tier graceful fallback. See [skill_smart_router.md](../../sk-doc/create-skill/assets/skill/skill_smart_router.md) for the full resilience pattern.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = ["references/corpus-map.md", "../shared/register.md"]

INTENT_SIGNALS = {
    "DECISION": {"weight": 4, "keywords": ["should this animate", "restraint", "restraint gate", "animate at all", "motion budget", "frequency", "keyboard rule", "trim", "over-animated", "decision framework", "animate everywhere", "animation everywhere", "command palette", "polished"]},
    "STRATEGY": {"weight": 4, "keywords": ["motion strategy", "timing", "easing", "choreography", "stagger", "material", "purpose", "duration", "spring", "design the motion", "motion for", "premium", "feel premium", "handoff", "stack boundary", "animation library"]},
    "MICRO_INTERACTIONS": {"weight": 4, "keywords": ["micro", "hover", "active", "loading", "gesture", "delight", "icon", "morph", "feedback", "press", "pattern card", "spec card", "toast", "drawer", "notification", "button", "menu"]},
    "PRESENCE": {"weight": 4, "keywords": ["animatepresence", "framer", "motion/react", "exit", "presence", "modal", "checklist"]},
    "PERFORMANCE": {"weight": 4, "keywords": ["reduced motion", "performance", "jank", "scroll", "blur", "filter", "will-change", "flip", "dropped frames", "failure card", "compositor"]},
    "ADVANCED_CRAFT": {"weight": 4, "keywords": ["origin-aware", "origin aware", "popover", "tooltip", "instant follow-up", "follow-up tooltip", "@starting-style", "starting-style", "slow-motion debugging", "slow motion debugging", "shorthand under load", "dense toolbar"]},
}

RESOURCE_MAP = {
    "DECISION": ["references/animation-decision-framework.md"],
    "STRATEGY": ["references/motion-strategy.md", "references/corpus-map.md", "../shared/sk-code-handoff.md"],
    "MICRO_INTERACTIONS": ["references/micro-interactions.md", "assets/motion-pattern-cards.md"],
    "PRESENCE": ["references/animate-presence-patterns.md", "assets/animate-presence-checklist.md"],
    "PERFORMANCE": ["references/performance-reduced-motion.md", "assets/motion-performance-failure-card.md"],
    "ADVANCED_CRAFT": ["references/advanced-craft.md", "references/animation-decision-framework.md", "references/performance-reduced-motion.md"],
}

LOAD_LEVELS = {
    "DECISION": "STANDARD",
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
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

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

## 3. HOW IT WORKS

### Motion Design Workflow

1. Run the restraint gate first (`references/animation-decision-framework.md`): check frequency, the keyboard rule, a named purpose and the register motion-budget dial, stopping at the first no. A choice that fails ships as an instant state change, not a downgrade.
2. Name the purpose: feedback, orientation, focus, continuity, perceived performance, or earned delight.
3. Decide the motion budget: one hero moment, local feedback layer, state transitions, or no motion.
4. Choose timing and easing:
   - `100-150ms` for instant feedback.
   - `200-300ms` for small state transitions.
   - `300-500ms` for modal, drawer, or layout transitions.
   - `500-800ms` only for earned entrances or choreographed brand moments.
5. Choose the material: transform/opacity first; bounded blur, filter, mask, clip-path, shadow, or color only when it creates a real effect and can be verified smooth.
6. Define reduced-motion behavior that preserves state information without non-essential movement.
7. Spec the pattern with the matching card in `assets/motion-pattern-cards.md`, run `assets/animate-presence-checklist.md` for any exit and clear `assets/motion-performance-failure-card.md` before handoff.
8. Hand implementation to `sk-code` with timing, easing, states, reduced-motion fallback, and performance risks.

### Procedure Card Selection

After the hub selects the public `motion` mode, choose a private procedure card only when its trigger matches, then cite it by relative path in the plan or proof line. These cards support this mode; they are not public routes.

| Request shape | Procedure card | Proof to cite |
| --- | --- | --- |
| Hover, active, focus, disabled, loading, selected, navigation, forms, custom widgets, or missing feedback | `procedures/interaction-states-pass.md` | Interaction-state matrix, visible focus, feedback coverage, transition timing, and reduced-motion behavior. |
| Final polish spanning accessibility, slop, rhythm, and interaction states | `../shared/procedures/polish-gate-orchestration.md` | Consolidated blockers, quality issues, polish notes, and owner mapping. |

If no procedure card matches, state `Procedure applied: none - baseline motion workflow` and continue with the restraint gate, temporal concern routing, and motion handoff. Do not load every procedure card for a single request.

### Context, Proof, And Direct Fallback

Record the context basis before motion decisions: public mode `motion`, loaded references, selected procedure card or no-procedure fallback, target interaction, affected states, existing animation system, motion budget, reduced-motion bar, and performance constraints. Before a ready or handoff claim, include proof naming the selected procedure card, evidence labels, timing/easing decisions, reduced-motion path, and verification risks.

This mode must run directly with Read, Glob, and Grep only. If subagents are unavailable or disallowed, do not dispatch; execute the same procedure selection, context capture, and proof checks in the current session. The fallback keeps the same proof bar and cannot rely on Write, Edit, Bash, or Task.

### Motion sk-code Handoff Boundary

Before `sk-code` implements motion, fill the shared envelope from `../shared/sk-code-handoff.md`. The motion-owned field is `IMPLEMENTATION MECHANISM / STACK BOUNDARY`: name CSS transitions, Web Animations, View Transitions, `motion/react`, GSAP or the existing project animation system. If no library applies, say `no animation library`. `sk-code` must not migrate or mix animation systems inside one interaction surface without approval.

### Motion Judgment

Good motion clarifies. Bad motion decorates, delays, or competes. One well-rehearsed transition beats scattered reveal effects across every section.

---

## 4. RULES

### ✅ ALWAYS

1. State the purpose of every animation before specifying properties.
2. Keep user-initiated feedback fast, usually under `300ms`.
3. Make exits faster than entrances, usually about 75 percent of enter duration.
4. Use ease-out for entrances and ease-in for exits unless a spring is explicitly justified.
5. Respect `prefers-reduced-motion` and preserve equivalent state feedback.
6. For `AnimatePresence`, ensure conditional motion elements have wrappers, stable keys, exit props, and coordinated modes.
7. Pause, stop, or avoid looping motion when off-screen.
8. Keep delight earned, brief, contextual, and non-blocking.
9. Cite the selected procedure card or no-procedure fallback before substantial motion output when a private procedure trigger matches.

### ⛔ NEVER

1. Never animate without a user, state, hierarchy, or continuity reason.
2. Never scatter fade-and-rise scroll reveals across every section as default choreography.
3. Never animate layout-driving properties casually (`width`, `height`, `top`, `left`, margins) when transform, FLIP, or grid-row techniques can work.
4. Never use bounce or elastic easing as a default; it draws attention to the animation itself.
5. Never let `mode="wait"` double total transition time without reducing each phase.
6. Never use index keys in animated dynamic lists.
7. Never make delight block a task or hide poor UX.
8. Never partially migrate animation libraries inside one interaction surface.

### ⚠️ ESCALATE IF

1. Performance constraints, target devices, or motion sensitivity requirements are unknown and affect the motion budget.
2. The requested effect requires large continuous blur/filter/layout animation.
3. The stack has an existing animation system and the request implies replacing it.
4. The motion is compensating for unclear static hierarchy; route back to foundations or interface first.

---

## 5. REFERENCES

### Core References

- [`references/animation-decision-framework.md`](references/animation-decision-framework.md) - The restraint gate: frequency tiers, the keyboard rule, the purpose test, and register coupling. Run it before any timing or easing choice.
- [`references/motion-strategy.md`](references/motion-strategy.md) - Purpose, timing, easing, staging, principles, and motion materials.
- [`references/micro-interactions.md`](references/micro-interactions.md) - Feedback, loading, gestures, delight, sound boundaries, and morphing icons.
- [`references/animate-presence-patterns.md`](references/animate-presence-patterns.md) - `motion/react` and `AnimatePresence` patterns.
- [`references/performance-reduced-motion.md`](references/performance-reduced-motion.md) - Performance, FLIP, scroll, layers, blur/filter, and reduced-motion guidance.
- [`references/advanced-craft.md`](references/advanced-craft.md) - Compact advanced craft for origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging and Framer Motion shorthand caveats under load.
- [`references/corpus-map.md`](references/corpus-map.md) - Source traceability for the distilled corpus.

### Assets

Fill-in cards. Copy, complete, and hand off:
- [`assets/motion-pattern-cards.md`](assets/motion-pattern-cards.md) - Per-pattern motion spec cards (feedback, hover, focus, loading, state transition, toast, page transition, gesture, drag-and-drop).
- [`assets/animate-presence-checklist.md`](assets/animate-presence-checklist.md) - Pass-or-fail checklist for `AnimatePresence` exits.
- [`assets/motion-performance-failure-card.md`](assets/motion-performance-failure-card.md) - Build-side failure-mode card for motion that drops frames.
- [`../shared/sk-code-handoff.md`](../shared/sk-code-handoff.md) - Shared sk-code handoff envelope. Motion uses it for implementation mechanism and stack-boundary fields.
- [`procedures/interaction-states-pass.md`](procedures/interaction-states-pass.md) - Private support for interaction-state matrices, feedback, transitions, and reduced-motion expectations.
- [`../shared/procedures/polish-gate-orchestration.md`](../shared/procedures/polish-gate-orchestration.md) - Shared private final-polish orchestration when motion owns interaction-state or transition fixes.

### Parent Shared Base

Use, do not duplicate, the parent references for shared vocabulary:
- [`../shared/register.md`](../shared/register.md) - The Brand-vs-Product operating register. Read the motion-budget dial first, because it sets the motion ceiling for the surface.
- `../shared/anti-slop-principles.md`
- `../shared/design-token-vocabulary.md`
- `../shared/cognitive-laws.md`

---

## 6. SUCCESS CRITERIA

- The restraint gate ran first, and any high-frequency or keyboard-driven action stays instant.
- Every motion choice has a purpose and an affected state.
- Timing, easing, and material choices are explicit.
- Reduced-motion behavior is specified.
- A pattern card is filled, the AnimatePresence checklist passes for any exit and the performance failure card clears before handoff.
- Implementation handoff names the target states, target properties, and verification risks.
- Implementation handoff names the animation mechanism and forbids accidental library migration or mixed animation systems.
- Motion does not block interaction, compete with primary hierarchy, or exhaust the user.
- The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- Direct execution with Read, Glob, and Grep can produce the same context/proof result without subagent dispatch.

---

## 7. INTEGRATION POINTS

- `sk-design` routes motion-family prompts here.
- `interface` defines the visual story this child choreographs.
- `foundations` supplies static tokens and layout constraints.
- `audit` uses this skill's rules when scoring motion performance and accessibility.
- `sk-code` implements motion in the target stack.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual-testing-playbook/manual-testing-playbook.md`. The initial release notes are in `changelog/v1.0.0.0.md`.
