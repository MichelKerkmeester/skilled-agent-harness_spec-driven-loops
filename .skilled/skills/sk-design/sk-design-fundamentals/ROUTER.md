---
title: "Visual Design Router"
description: "Sibling router for sk-design-fundamentals: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-design-fundamentals router"
  - "sk-design-fundamentals routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Visual Design Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name a value to decide or a surface to judge against values. That is a font size, spacing step, padding, colour, shadow, radius or duration, or a palette, shade ramp or token set built from scratch. It is also an input, menu, tooltip or dialog that needs focus, keyboard and touch behavior, an animation to add or retune, a UI review that has to return findings rather than impressions, or a vague complaint such as *looks off*, *feels cheap* or *cluttered* about UI that already exists. It routes to three resource families: the scales and hard rules that stay in `SKILL.md` and load on every invocation, one reference per routed intent under `references/`, and the two copy-in assets under `assets/`, `tokens.css` and `token-starter-set.md`, which load only on explicit request. A request that resolves to **improve** loads `references/diagnosis-table.md` first, a **review** loads `references/review-checklist.md`, and something new under **build** loads `references/build-procedure.md`.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Ten intents, one per `INTENT_MODEL` key the machine router scores, and each bullet names the phrasing that fires it and the files `RESOURCE_MAP` loads for it.

- **`DIAGNOSE`** fires on "looks off", "looks amateur", "feels cheap", "cluttered", "feels plain", "unfinished", "make this look better" or "improve". It loads `references/diagnosis-table.md`, the entry point that maps a symptom to its cause before any value changes.
- **`REVIEW`** fires on "review", "audit", "accessibility", "wcag", "aria", "findings", "critique" or "check this ui". It loads `references/review-checklist.md` for the severity-tiered pass.
- **`PALETTE`** fires on "color palette", "shade", "hsl", "swatch", "design tokens", "contrast ratio", "dark mode" or "accent color". It loads `references/color-system.md` and `assets/token-starter-set.md`.
- **`MOTION`** fires on "animation", "animate", "transition", "easing", "spring", "duration", "stagger" or "motion". It loads `references/motion-principles.md`.
- **`INTERACTION`** fires on "focus ring", "keyboard", "touch target", "hit area", "input", "form", "tooltip", "dropdown", "hover state" or "mobile". It loads `references/interaction-craft.md`.
- **`HIERARCHY`** fires on "hierarchy", "draws the eye", "competing", "de-emphasize", "primary action", "destructive", "emphasis", "label" or "stand out". It loads `references/hierarchy.md`.
- **`DEPTH`** fires on "shadow", "drop shadow", "elevation", "depth", "raised", "inset", "typeface", "letter-spacing", "image", "photo" or "grid". It loads `references/depth-and-detail.md`.
- **`UX_LAWS`** fires on "too many options", "overwhelming", "cognitive load", "fitts", "hick", "miller", "doherty", "progressive disclosure", "feels slow" or "onboarding". It loads `references/ux-laws.md`.
- **`PROCEDURE`** fires on "where do i start", "design a new", "from scratch", "grayscale", "wireframe", "mockup", "how much white space" or "which value". It loads `references/build-procedure.md`.
- **`SCALES`** fires on "spacing", "font size", "type scale", "padding", "border radius", "line-height" or "font weight", and is the intent a request that scores nothing falls back to. It loads nothing at level `MINIMAL`: the scales stay in `SKILL.md` Section 3, so no extra reference is needed.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the detection trees, the phase sequence, the resource domains, the loading-level table and the routing pseudocode the SMART ROUTING summary in `SKILL.md` points at.

### Primary Detection Signal

The dominant split is **build**, **improve**, or **review**, because it decides which reference loads first.

```text
WHAT IS THE STARTING POINT?
    |
    +- Nothing yet   -> BUILD.   Systems (Section 3) + procedure. Add color-system.md for a palette,
    |                            interaction-craft.md when implementing, motion-principles.md when animating.
    |
    +- A complaint   -> IMPROVE. Load references/diagnosis-table.md FIRST, map symptom to cause, then apply.
    |
    +- Existing code -> REVIEW.  Load references/review-checklist.md and run the severity-tiered pass.
```

A second signal decides depth: a request naming one property (*"what shadow?"*) needs only the relevant scale, while *"make this look designed"* needs the hierarchy technique in Section 3 and usually the diagnosis table.

### Phase Detection

```text
UI TASK
    |
    +- STEP 0: Detect build / improve / review
    +- STEP 1: Score intents (top-2 when scores are close)
    +- Phase 1: Choose values from the fixed scales
    +- Phase 2: Establish hierarchy (weight and color before size)
    +- Phase 3: Implement behavior (focus, keyboard, touch, motion)
    +- Phase 4: Verify against the hard rules and contrast minimums
```

### Resource Domains

```text
references/   design and behavior knowledge, loaded on intent
assets/       copy-paste starting values
```

- `references/` holds one document per routed intent; Section 5 lists them.
- `assets/` holds `tokens.css`, a complete contrast-verified token set to copy in and retune.

### Resource Loading Levels

| Level | When to Load | Resources |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS | Every skill invocation | The scales and hard rules in this file |
| CONDITIONAL | If intent signals match | `build-procedure.md`, `diagnosis-table.md`, `hierarchy.md`, `color-system.md`, `depth-and-detail.md`, `interaction-craft.md`, `motion-principles.md`, `ux-laws.md`, `review-checklist.md` |
| ON_DEMAND | Only on explicit request | `assets/tokens.css`, `assets/token-starter-set.md` |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/diagnosis-table.md"

INTENT_MODEL = {
    "DIAGNOSE": {"keywords": [("looks off", 4), ("looks amateur", 4), ("feels cheap", 4),
                              ("cluttered", 3), ("feels plain", 3), ("unfinished", 3),
                              ("make this look better", 4), ("improve", 2)]},
    "REVIEW": {"keywords": [("review", 4), ("audit", 4), ("accessibility", 4), ("wcag", 4),
                            ("aria", 3), ("findings", 3), ("critique", 3), ("check this ui", 4)]},
    "PALETTE": {"keywords": [("color palette", 4), ("shade", 3), ("hsl", 3), ("swatch", 3),
                             ("design tokens", 3), ("contrast ratio", 4), ("dark mode", 4),
                             ("accent color", 3)]},
    "MOTION": {"keywords": [("animation", 4), ("animate", 4), ("transition", 3), ("easing", 4),
                            ("spring", 4), ("duration", 3), ("stagger", 3), ("motion", 3)]},
    "INTERACTION": {"keywords": [("focus ring", 4), ("keyboard", 4), ("touch target", 4),
                                 ("hit area", 4), ("input", 3), ("form", 3), ("tooltip", 3),
                                 ("dropdown", 3), ("hover state", 3), ("mobile", 2)]},
    "HIERARCHY": {"keywords": [("hierarchy", 4), ("draws the eye", 4), ("competing", 3),
                               ("de-emphasize", 4), ("primary action", 4), ("destructive", 3),
                               ("emphasis", 3), ("label", 3), ("stand out", 3)]},
    "DEPTH": {"keywords": [("shadow", 4), ("drop shadow", 4), ("elevation", 4), ("depth", 3), ("raised", 3),
                           ("inset", 3), ("typeface", 3), ("letter-spacing", 3),
                           ("image", 3), ("photo", 3), ("grid", 3)]},
    "UX_LAWS": {"keywords": [("too many options", 4), ("overwhelming", 4), ("cognitive load", 4),
                             ("fitts", 4), ("hick", 4), ("miller", 4), ("doherty", 4),
                             ("progressive disclosure", 4), ("feels slow", 3), ("onboarding", 2)]},
    "PROCEDURE": {"keywords": [("where do i start", 4), ("design a new", 4), ("from scratch", 3),
                               ("grayscale", 4), ("wireframe", 3), ("mockup", 3),
                               ("how much white space", 4), ("which value", 3)]},
    "SCALES": {"keywords": [("spacing", 4), ("font size", 4), ("type scale", 4),
                            ("padding", 3), ("border radius", 3), ("line-height", 3),
                            ("font weight", 3)]},
}

# SCALES loads nothing: its content sits in SKILL.md, and it is the zero-score fallback.
NO_LOAD_INTENTS = ("SCALES",)

RESOURCE_MAP = {
    "DIAGNOSE": ["references/diagnosis-table.md"],
    "REVIEW": ["references/review-checklist.md"],
    "PALETTE": ["references/color-system.md", "assets/token-starter-set.md"],
    "MOTION": ["references/motion-principles.md"],
    "INTERACTION": ["references/interaction-craft.md"],
    "DEPTH": ["references/depth-and-detail.md"],
    "HIERARCHY": ["references/hierarchy.md"],
    "UX_LAWS": ["references/ux-laws.md"],
    "PROCEDURE": ["references/build-procedure.md"],
    "SCALES": [],  # the scales live in SKILL.md Section 3; no extra load needed
}

LOAD_LEVELS = {
    "DIAGNOSE": "STANDARD", "REVIEW": "STANDARD", "PALETTE": "STANDARD",
    "MOTION": "STANDARD", "INTERACTION": "STANDARD", "DEPTH": "STANDARD",
    "HIERARCHY": "STANDARD", "UX_LAWS": "STANDARD", "PROCEDURE": "STANDARD",
    "SCALES": "MINIMAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the UI is being built, improved, or reviewed",
    "Confirm which surface is in scope (page, screen, or one component)",
    "Name the specific complaint or the specific value that needs deciding",
    "Confirm whether an existing design system or measured reference already fixes values",
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
        return ("SCALES", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_ui_craft_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded, seen = [], set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    if max(scores.values() or [0]) < 0.5:
        load_if_available(DEFAULT_RESOURCE)
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

    return {
        "routing_key": routing_key,
        "intents": intents,
        "intent_scores": scores,
        "load_level": LOAD_LEVELS.get(primary, "STANDARD"),
        "resources": loaded,
    }
```
