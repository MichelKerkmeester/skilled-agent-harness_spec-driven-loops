---
name: sk-design
description: "Designs, builds and reviews UI from fixed value scales, interaction guidelines, motion principles and a WCAG review pass."
allowed-tools: [Read, Write, Edit, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: ui design rules, what padding, how much padding, padding, margin, spacing between elements, spacing scale, what font size, font size, type scale, font weight, color palette, hsl shades, shade ramp, shadow elevation, box shadow, border radius, visual hierarchy, de-emphasize, ui looks off, looks amateur, feels cluttered, make this look better, design tokens, contrast ratio, wcag, wcag 4.5:1, a11y, accessibility, accessibility issues, accessibility review, accessibility audit, aria-label, alt text, screen reader, grey on color, em versus rem, breakpoint scaling, empty state, interaction guidelines, focus ring, focus outline, touch target, hit area, keyboard navigation, animation duration, transition duration, easing curve, spring animation, twelve principles of animation, review this component, design review, ui review, component states, dark mode palette, where do i start designing, grayscale first, how much white space, nothing draws the eye, primary secondary tertiary, destructive button, labels are a last resort, too many options, overwhelming, cognitive load, progressive disclosure, fitts law, hicks law, doherty threshold, chunking, concentric radius, layered shadows, button shadow anatomy, text-wrap balance, tabular nums, drop shadow, shadow, draws the eye, no visual hierarchy, everything looks the same -->

# Visual UI Design

Visual design is not talent. It is a small set of systems decisions made **once**, plus a handful of techniques for building hierarchy, a set of interaction details that make a screen behave correctly, and a motion model that keeps it feeling human.

The single biggest cause of amateur-looking UI is picking values ad hoc — 17px here, `#3B82F6` there, `lighten(5%)` for a hover state, `400ms` because it seemed smooth. Design *from a scale*, always.

> **Boundary.** This skill decides values and behavior when UI is being **built, fixed, or reviewed**. It is prescriptive and emits CSS. It does not measure an existing site — `sk-design-md-generator` extracts a live surface's real CSS into a measured Style Reference, and when such a reference exists its measured values win over the defaults here. See Section 7.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the task involves:
- Building or styling any interface — web page, app screen, dashboard, landing page, single component.
- Picking a concrete value: font size, spacing, padding, color, shadow, border radius, border width, opacity, duration.
- Designing a color palette, a shade ramp, or a set of design tokens from scratch.
- Implementing inputs, menus, tooltips, dialogs, or anything with focus, keyboard and touch behavior.
- Adding or tuning animation, or deciding whether something should animate at all.
- Reviewing UI code for accessibility and visual quality, with findings rather than impressions.
- Improving UI that already exists, especially against a vague complaint.

**Keyword Triggers**: the routing vocabulary is the keyword comment above the title; it is the single list, so it is not restated here.

### Use Cases

- **Building new UI.** The systems in Section 3 replace every ad hoc value decision; the interaction and motion references cover the behavior the values do not.
- **Improving existing UI.** A vague complaint maps to a small number of mechanical causes. The symptom-to-fix table is the entry point.
- **Reviewing UI code.** A severity-tiered pass over real files: WCAG-cited accessibility first, then visual, component and motion checks, each finding carrying a file, a line and a fix.

### When NOT to Use

**Skip this skill when**:
- The task is measuring or documenting a **live site's** existing CSS. That is extraction, and it belongs to `sk-design-md-generator`.
- A measured Style Reference or an established design system already fixes the values. Those are ground truth; this skill's defaults are for what nobody has decided yet.
- The work is application logic, state or data flow with no visual or interaction surface. Route to `sk-code`.
- The request is brand identity, logo design, illustration, or copywriting.

---

## 2. SMART ROUTING

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

---

## 3. HOW IT WORKS

### The Systems

Pick from these lists. Never invent a value that is not on one.

#### Spacing and sizing

Base 16px, built from factors and multiples of it:

```text
4  8  12  16  24  32  48  64  96  128  192  256  384  512  640  768
```

Tight at the small end, spreading out at the large end. **No two adjacent values may be closer than about 25%** — that is what makes the choice obvious. A linear "multiples of 4" scale fails, because it does not help anyone decide between 120px and 124px.

Use it for margin, padding, width, height, icon sizes and border width — everything spatial. Fix a small set of opacity values too (`.05 .1 .2 .4 .6 .8`) for disabled states, overlays and hover tints, rather than eyeballing a slider each time. Same logic as the other scales: decide once, reuse everywhere.

#### Type scale

```text
12  14  16  18  20  24  30  36  48  60  72
```

Not a modular scale built from a ratio. Ratios produce fractional pixel values that round inconsistently across browsers, and they are too sparse for interface density. Hand-picked values, chosen for how they feel, win instead.

**Units: `px` or `rem` only. Never `em`.** `em` is relative to the current font size, so `.875em` inside a `1.25em` parent computes to 17.5px — a value not on the scale. The scale silently stops existing.

#### Font weight

Two weights is enough:

- **400 or 500** for body and most UI text.
- **600 or 700** for anything emphasized. Medium-sized headings usually sit best at 500 to 600.

Nothing below 400 in UI. To de-emphasize, use a lighter *color* or a smaller *size*, never a lighter weight. Weight must also not change on hover or selection, because the width change shifts the layout.

#### Color

A five-swatch palette generator gives nowhere near enough colors.

- **Greys: 8 to 10 shades.** Almost all of a UI is grey — text, backgrounds, panels, borders, form controls. Three or four shades always runs out. Start at a very dark grey, not true black, which looks unnatural.
- **Primary: 5 to 10 shades**, one or at most two primaries.
- **Accents: 5 to 10 shades each** — destructive red, warning yellow, positive green, plus whatever else the product must distinguish. Ten colors at 5 to 10 shades each is normal for a complex UI.

Name them `100` (lightest) through `900` (darkest), base `500`.

**Build the scale in this order:** pick `500` first; for a primary or accent it should be a shade that works as a button background. Then find the edges — `900` is usually the text color and `100` a background tint, and an alert component uses both, so design one and read the two values off it. Then fill `700` and `300` as the perfect compromise between their neighbours, then `800 600 400 200` the same way.

**Write colors as HSL, not hex.** `hsl(220, 95%, 34%)` and `hsl(220, 65%, 61%)` are visibly related; `#03369E` and `#507DD7` are not.

**Never generate shades at runtime** with `lighten()` or `darken()`. That is how a project ends up with 35 slightly different blues.

Full construction method — base selection, saturation at the ends, hue rotation, dark mode, contrast escape hatches — is in [`references/color-system.md`](references/color-system.md).

#### Shadows, five elevations

```css
0 1px 3px   hsla(0,0%,0%,.2)   /* barely raised - buttons */
0 4px 6px   hsla(0,0%,0%,.2)   /* dropdowns */
0 5px 15px  hsla(0,0%,0%,.2)
0 10px 24px hsla(0,0%,0%,.2)
0 15px 35px hsla(0,0%,0%,.2)   /* modals */
```

Choose by asking *where on the z-axis does this sit?*, not *what shadow looks nice?*. Closer to the user means more attention. Shrinking a button's shadow on `:active` makes it feel pressed. Growing a list item's shadow when it is picked up for drag-to-reorder does the reverse — it reads as "now above its siblings" and doubles as the drag affordance.

Every shadow in a project shares one offset direction, because there is one light source. [`references/depth-and-detail.md`](references/depth-and-detail.md) carries two refined alternatives — a **two-part** cast-plus-contact scale and a **layered** three-part set — plus the rule for tinting shadow color on non-white surfaces and the full six-layer button anatomy. The three systems are parallel and not compatible: pick one per project and never mix them, or elevation stops being readable.

#### Line-height and line length

Line-height is **inversely** proportional to font size, and proportional to line width:

- small text or wide columns: `1.5` to `2`
- large headlines: `1` is fine

Line length: **45 to 75 characters**, which is `max-width: 20em` to `35em`. This applies to the paragraph even when its container is wider. Mixed widths in one content area look more polished, not less.

`em` is correct *here* — measure should scale with the text it wraps. The "never `em`" rule is scoped to the *type scale*, where `em` compounds through nesting. Do not "fix" this.

#### Border radius

Pick one and stay consistent. Small radius reads neutral, large reads playful, none reads serious or formal. Mixing square and rounded corners in one interface always looks worse. For nested elements, inner radius equals outer radius minus the padding between them.

#### Motion durations

Timing is a scale like the others, and consistency across it outranks the perfect value for any one element.

```text
120-180ms   press, hover, direct feedback
180-260ms   small state change: toggle, dropdown, tooltip, tab
up to 500ms layout transition: modal, drawer, accordion
```

300ms is the ceiling for anything the user initiated. Similar elements use identical values. The full model — easing curves, springs, staging, and when not to animate at all — is in [`references/motion-principles.md`](references/motion-principles.md).

### The Procedure

Seven steps govern the order of work on something new: start from a feature rather than a layout, work in **grayscale first**, treat low-fidelity artifacts as disposable, build the smallest useful version, **choose each value by elimination** against its two neighbours on the scale, start with too much white space and trim, and design at about 400px before relaxing to a large screen.

Full steps with their reasoning: [`references/build-procedure.md`](references/build-procedure.md). Load it when starting something new; a value question does not need it.

### Hierarchy, The Technique That Does The Most Work

Everything on screen sits in a pyramid: primary, secondary, tertiary. When everything competes, the UI reads as noise. This is what makes a design look designed, not styling.

Four rules carry most of it:

1. **Size is not everything.** Font size alone gives primary content that is too big and secondary content that is too small. Carry emphasis with **weight** and **color**, and keep sizes near the middle of the scale.
2. **Three text colors, maximum** — dark, grey, lighter grey. All three carry body-size text, so all three need 4.5:1. "Lighter grey" is the lightest shade that still clears it, roughly the middle of a nine-step ramp.
3. **Emphasize by de-emphasizing.** When the important element will not stand out and there is nothing left to add to it, soften what competes with it instead.
4. **Style actions by hierarchy, not by semantics.** Primary is solid and high contrast, usually exactly one per page; secondary is an outline; tertiary is styled like a link. Destructive is not automatically primary.

The full method — action and destructive treatment, label suppression, the weight-versus-contrast trade, and why visual hierarchy may disagree with document hierarchy — is [`references/hierarchy.md`](references/hierarchy.md).

### Beyond The Visual System

Correct values do not make a screen behave correctly. Three references carry the rest, and each has an always-true core worth holding in mind before loading it.

| Reference | Always-true core |
| --- | --- |
| [`build-procedure.md`](references/build-procedure.md) | Feature before layout, grayscale before color, mobile before desktop, and every value chosen against its two neighbours. |
| [`hierarchy.md`](references/hierarchy.md) | Rank every element before styling any of them. Soften the competition rather than amplifying the primary. |
| [`interaction-craft.md`](references/interaction-craft.md) | Focus rings are `box-shadow`, not `outline`. Guard hover with `@media (hover: hover)`. Inputs are 16px minimum or iOS zooms. No dead space between adjacent targets. |
| [`motion-principles.md`](references/motion-principles.md) | Entrances `ease-out`, exits `ease-in`, gestures use springs, linear is only for progress. One focal point at a time. Some things should not animate at all. |
| [`ux-laws.md`](references/ux-laws.md) | Respond within 400ms or fake it honestly. Chunk into groups of five to nine. Expand hit areas with padding, not a bigger box. One element may be the exception. |
| [`review-checklist.md`](references/review-checklist.md) | Accessibility findings first, every finding with a file, a line and a fix. |

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS pick values from the scales in Section 3.** A value off the scale is the defect this skill exists to prevent; it is what makes a UI read as amateur even when nothing is individually wrong. Timing is a scale too.
2. **ALWAYS put more space around a group than within it.** This is the fix for "which label belongs to which field", cramped bullet lists (the gap must exceed the line-height), and headings that look attached to the wrong paragraph. Ambiguous spacing is a functional bug, not only an ugly one.
3. **ALWAYS meet 4.5:1 for normal text.** The 3:1 allowance applies only to *large* text, which WCAG defines as **24px regular or 18.66px bold** — not 18px. Separately, **3:1 applies to non-text** (WCAG 1.4.11): a border that is the only thing identifying a control, such as an input outline or a checkbox edge, needs 3:1 against its background. A hairline that merely divides content does not. Those are two different tokens.
4. **ALWAYS give large elements a faster shrink rate across breakpoints than small ones.** A 2.5em headline over 14px mobile body copy computes to 35px, far too big; it wants 20 to 24px there. A button's padding should get proportionally tighter as the button shrinks, not scale with its font size.
5. **ALWAYS add a second signal alongside color.** An icon, a shape or a text cue. For charts, distinguish series by *contrast* — light to dark shades of one color — rather than by hue, because colorblind users read lightness reliably and hue unreliably.
6. **ALWAYS give interactive elements their full state set.** Hover, focus, active and disabled, plus loading and error where they apply. The `:active` state needs a scale transform, or the element feels unresponsive under a finger.
7. **ALWAYS load the matching reference before acting.** `diagnosis-table.md` for an improve task, `review-checklist.md` for a review. Changing UI from a vague complaint without mapping it to a cause is a guess.

### ❌ NEVER

1. **NEVER put grey text on a colored background.** Grey on white works because it *reduces contrast*; grey on color just looks dirty. White at reduced opacity looks washed out and disabled, and lets patterns show through the glyphs. Hand-pick a color at the background's hue, adjusting saturation and lightness.
2. **NEVER use `em` for the type scale.** `px` or `rem`. `em` compounds through nesting and silently produces values that are not on the scale. The exception is line length (`max-width` in `em`), where measure should scale with its own text.
3. **NEVER generate shades at runtime** with `lighten()` or `darken()`. Define every shade up front, or the palette drifts into dozens of near-identical colors.
4. **NEVER use a percentage width for something that should not scale.** Sidebars get fixed widths and the main area flexes. Elements get a `max-width` and shrink only when the screen is actually smaller — a login card must not be *wider* at medium screens than at large.
5. **NEVER scale an icon far from its intended size.** A 16 to 24px icon at 48px looks chunky and detail-starved. Put it at its real size inside a colored circle instead.
6. **NEVER remove a focus outline without replacing it.** `outline: none` with no visible replacement is a serious accessibility defect. Replace it with a `box-shadow` ring, which respects border radius.
7. **NEVER animate high-frequency interactions or keyboard navigation.** Focus movement is instant. A search input that animates on every keystroke is a tax paid on every keystroke.
8. **NEVER mix two systems of the same kind in one project** — the five-elevation and two-part shadow scales, or two sets of motion durations. Parallel systems make the thing they encode unreadable.

### ⚠️ ESCALATE IF

1. **ESCALATE IF an existing design system or measured Style Reference conflicts with these defaults.** The established system wins. Ask which one governs before overwriting tokens, and say which values would change.
2. **ESCALATE IF a brand color cannot reach 4.5:1 in its required role.** Both escape hatches — flipping to dark colored text on a light tint, and rotating hue toward a brighter one — are in `references/color-system.md`, but changing a brand color is the operator's decision.
3. **ESCALATE IF the request implies a redesign wider than the named surface.** Hierarchy fixes often want to touch competing elements outside the stated scope; name what would need to change and get agreement first.
4. **ESCALATE IF the complaint stays vague after the diagnosis table.** Ask which specific element feels wrong and what it should communicate instead, rather than restyling broadly.
5. **ESCALATE IF a review finds accessibility defects the requester did not ask about.** Report them; do not silently fix code outside the requested scope.

---

## 5. REFERENCES

### Core References

- [build-procedure.md](references/build-procedure.md) — the seven-step order of work for something new, and why each step is in that position.
- [color-system.md](references/color-system.md) — building a palette from scratch: choosing the base, saturation at the light and dark ends, hue rotation, warm and cool greys, dark mode, and the two escape hatches for hitting contrast ratios without ugly color.
- [diagnosis-table.md](references/diagnosis-table.md) — symptom to fix table. Load first whenever the task is improving existing UI.
- [hierarchy.md](references/hierarchy.md) — the full hierarchy method: action and destructive treatment, label suppression, the weight-versus-contrast trade, and visual versus document hierarchy.
- [depth-and-detail.md](references/depth-and-detail.md) — light simulation, the three shadow systems and how to pick one, shadow color and button anatomy, typography detail, concentric radius, grids, component shape, and images.
- [interaction-craft.md](references/interaction-craft.md) — inputs, touch, hit areas, focus, keyboard, screen readers, performance and feedback.
- [motion-principles.md](references/motion-principles.md) — the twelve animation principles adapted to interfaces, plus the enforceable timing, easing, physics and staging rules.
- [ux-laws.md](references/ux-laws.md) — the cognitive and perceptual constraints that decide what is on the screen at all, how it groups, and how long it may take to respond.
- [review-checklist.md](references/review-checklist.md) — the severity-tiered audit pass over UI code, WCAG-cited.

### Templates and Assets

- [tokens.css](assets/tokens.css) — a complete, contrast-verified starting set of every scale above as CSS custom properties, including a semantic role layer and a dark-mode block.
- [token-starter-set.md](assets/token-starter-set.md) — what is in `tokens.css`, how to retune it, and the rule that components reference roles rather than raw ramps.

### Reference Loading Notes

- Load only the references the current intent requires; Section 2 is the routing authority.
- The scales themselves stay in this file. They are needed on every invocation, so moving them to a reference would add a load for no benefit.

---

## 6. SUCCESS CRITERIA

### Task Completion Checklist

**A UI task is complete when:**

- [ ] Every spatial value, font size, weight, shadow, radius and duration came from a scale in Section 3, or from an established system that supersedes it.
- [ ] The content has a stated primary, secondary and tertiary tier, separated by weight and color rather than size alone.
- [ ] Exactly one primary action is styled as primary on the surface.
- [ ] Group spacing exceeds within-group spacing everywhere grouping is meaningful.
- [ ] Every text and control pair meets its contrast minimum (4.5:1 normal text, 3:1 large text and functional non-text).
- [ ] Interactive elements carry their full state set, and focus is visible.
- [ ] Motion durations sit in their band, similar elements share values, and nothing animates that should not.
- [ ] No hard rule in Section 4 is violated, or each deviation is stated with its reason.

### Quality Gates

- **Scale conformance**: zero off-scale values, or each one named and justified.
- **Color count**: shades come from a defined ramp; no runtime-generated shades.
- **Breakpoint behavior**: large elements shrink faster than small ones; nothing scales proportionally.
- **Signal redundancy**: no state or category communicated by color alone.
- **Review output**: every finding carries a file, a line, a fix, and a criterion where one applies.

---

## 7. INTEGRATION POINTS

### Inputs

- The surface in scope: a component, a screen, a described complaint, or a set of files to review.
- Optionally, an existing token file, design system, or a measured `DESIGN.md` Style Reference. Any of these **outranks** this skill's defaults.

### Outputs

- Concrete values and CSS, plus the reason each value was chosen from its scale.
- For an improve task, the symptom-to-cause mapping that justified each change.
- For a review, severity-tiered findings with file, line and fix.

### Related Workflows

- **`sk-design-md-generator`** measures a live site's real CSS into a v3 Style Reference. It is the reading half of the pair; this skill is the writing half. When a Style Reference exists for the surface, its measured values are ground truth and this skill supplies only what the reference left undecided.
- **`sk-code`** implements the result. Hand it the chosen values, not adjectives.
- **`system-spec-kit`** owns packet documentation and continuity when the work is tracked.

### Reading Versus Authoring

`sk-design-md-generator/references/design-knowledge/numeric-design-laws.md` records type ratios, a short spacing scale and motion bands as targets for *reading* a measured surface. This skill decides those values for a surface that does not exist yet, and on three of them the two would appear to disagree if direction were ignored.

They do not. That document reports; this one decides; a measurement outranks a default for the surface it covers. Both sides now state the reconciliation — its Section 1, and [`references/motion-principles.md`](references/motion-principles.md) Section 5 here.

---

## 8. REFERENCES AND RELATED RESOURCES

Section 2 governs what loads. This skill ships no scripts: every decision is a judgment, not an automated transform. Related skills are named in Section 7.

### Sources

Original notes derived from four public sources, captured 2026-08-28. None of their text is reproduced verbatim.

- *Refactoring UI*, Adam Wathan and Steve Schoger (<https://www.refactoringui.com/>) — value systems, procedure, hierarchy, depth, diagnosis.
- Web Interface Guidelines, Rauno Freiberg (<https://interfaces.rauno.me/>) — interaction craft.
- userinterface-wiki, Raphael Salaja (<https://userinterface.wiki>) — the motion model and its ruleset, the UX laws, and the typography and visual-design rules.
- Rams design review skill (<https://www.ui-skills.com/skills/rams/rams>) — the severity-tiered review structure and its WCAG check set.
