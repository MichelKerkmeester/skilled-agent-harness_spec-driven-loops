---
name: design-foundations
description: Static visual-system design for color, typography, layout, spacing, hierarchy, responsive adaptation, themes, and design tokens.
allowed-tools: [Read, Grep, Glob, Task]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: foundations, color-system, oklch, typography, layout, spacing, hierarchy, grid, responsive, dark-mode, design-tokens -->

# Design Foundations (foundations)

`foundations` owns the static visual system of the `sk-design` family: color, type, spacing, layout, hierarchy, grids, responsive adaptation, theming, and token vocabulary. It turns a visual direction into a coherent system, or audits a system proposal before implementation.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Building or correcting a color system, OKLCH palette, theme, dark mode, or semantic color token set.
- Choosing type scale, font pairing, line length, hierarchy, tabular numerals, or typography roles.
- Fixing layout rhythm, spacing, density, alignment, grid behavior, hierarchy, or responsive adaptation.
- Adapting a design across device, input method, orientation and context, including print and constrained surfaces.
- Encoding quantitative content: chart-type selection, axis honesty, color-for-data scales, sparklines and data-table alignment.
- Translating a design direction into reusable static tokens for `sk-code` implementation, often by filling the token starter scaffold.

Keyword triggers: `OKLCH`, `palette`, `contrast`, `dark mode`, `theme tokens`, `typography scale`, `font pairing`, `measure`, `spacing`, `grid`, `layout rhythm`, `responsive`, `container queries`, `adaptation matrix`, `data visualization`, `chart type`, `data tables`, `design tokens`, `token starter`.

### When NOT to Use

Skip this skill when:
- The task is to invent the overall interface direction, voice, or signature visual concept. Use `interface` first.
- The task is animation, transition choreography, micro-interactions, or reduced-motion behavior. Use `motion`.
- The task is a review, score, accessibility audit, or production-hardening report. Use `audit`.
- The task is extracting measured tokens from a live site into `DESIGN.md`. Use `md-generator` or the future `sk-design-spec` child.
- The static visual system (including layout, spacing, and grid decisions) is already fully specified and only code implementation remains. Hand off to `sk-code`. Designing or fixing the layout/spacing/grid system itself stays here first; only the implementation handoff goes to `sk-code`.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It may cite the parent shared base for anti-slop vocabulary, token names, and cognitive laws, but detailed static-system decisions live here.

This skill owns the static visual system. Layout, spacing, grid, and rhythm prompts resolve here first, ahead of `sk-code`; `sk-code` receives the system only for implementation after the static decisions are made.

Pairs well with:
- `interface` when a distinctive direction needs a disciplined token system.
- `motion` when static tokens must be matched by motion tokens.
- `audit` when the finished visual system needs scoring and release hardening.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by the static axis the user is asking about:

```text
STATIC SYSTEM TASK
    |
    +- Color/theme/dark-mode/contrast/OKLCH -> references/color/*
    +- Typography/font scale/pairing/measure -> references/type/*
    +- Layout/spacing/grid/responsive/density -> references/layout/*
    +- Multi-axis token system -> load one reference from each matching folder
```

### Resource Domains

- `references/color/` contains OKLCH workflow, palette generation, contrast, gamut, color dosage, semantic colors, theme tokens, and dark mode.
- `references/type/` contains typography scale, pairing, measure, hierarchy, role tokens, and text rendering checks.
- `references/layout/` contains spacing systems, rhythm, hierarchy, grids, density, responsive adaptation, container queries, touch targets, platform context, and the context adaptation matrix.
- `references/data_viz.md` contains chart-type selection, axis and encoding, color-for-data scales, sparklines and data-table alignment.
- `assets/` contains fill-in scaffolds, starting with `token_starter.md` for an OKLCH ramp, type scale and spacing scale.
- `references/corpus_map.md` records the source corpus distilled into this skill.
- `../shared/sk_code_handoff.md` defines the family handoff envelope used for the final foundations card.

The folders are intentionally split-ready so `color`, `type`, and `layout` could become separate children later without rewriting the knowledge base.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | The first step of any foundations task | `../shared/register.md` (set the Brand-vs-Product register, which sets the color strategy and token density this skill inherits) |
| ALWAYS | Any foundations task | `references/corpus_map.md` plus the matching axis reference |
| CONDITIONAL | Color or theme work | `references/color/oklch_workflow.md`, `references/color/palette_theming.md` |
| CONDITIONAL | Typography work | `references/type/typography_system.md` |
| CONDITIONAL | Layout or responsive work | `references/layout/layout_responsive.md` |
| CONDITIONAL | Data visualization, charts, or data tables | `references/data_viz.md` |
| CONDITIONAL | Device, input, or context adaptation | `references/layout/adaptation_matrix.md` |
| CONDITIONAL | Scaffolding a new token system or handing tokens to sk-code | `assets/token_starter.md` (fill-in OKLCH ramp, type scale, and spacing scale) and `../shared/sk_code_handoff.md` (final foundations handoff card) |
| ON_DEMAND | Cross-axis token-system work | Load all three axis folders plus parent `sk-design/references/design_token_vocabulary.md` |

### Smart Router Pseudocode

The authoritative routing logic discovers markdown at runtime, guards every path inside the skill folder, scores the static axis as a routing key, loads only files that exist, and returns an `UNKNOWN_FALLBACK` checklist when confidence is too low. See [skill_smart_router.md](../sk-doc/assets/skill/skill_smart_router.md) for the full resilience pattern.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = ["references/corpus_map.md", "../shared/register.md"]

INTENT_SIGNALS = {
    "COLOR": {"weight": 4, "keywords": ["oklch", "palette", "color", "contrast", "theme", "dark mode", "gamut", "semantic color", "surface scale"]},
    "TYPE": {"weight": 4, "keywords": ["typography", "font", "type scale", "measure", "line length", "pairing", "tabular numerals", "type roles"]},
    "LAYOUT": {"weight": 4, "keywords": ["layout", "spacing", "grid", "responsive", "breakpoint", "density", "container query", "rhythm", "hierarchy"]},
    "ADAPTATION": {"weight": 4, "keywords": ["adaptation matrix", "context adaptation", "device adaptation", "input method", "orientation", "print", "posture", "constrained surface"]},
    "DATA_VIZ": {"weight": 4, "keywords": ["data visualization", "chart", "chart type", "axis", "sparkline", "data table", "color-for-data", "encoding", "data-viz"]},
    "TOKENS": {"weight": 4, "keywords": ["token starter", "token scaffold", "design tokens", "token system", "starter scaffold", "handoff", "fill-in scaffold"]},
}

RESOURCE_MAP = {
    "COLOR": ["references/corpus_map.md", "references/color/oklch_workflow.md", "references/color/palette_theming.md"],
    "TYPE": ["references/corpus_map.md", "references/type/typography_system.md"],
    "LAYOUT": ["references/corpus_map.md", "references/layout/layout_responsive.md"],
    "ADAPTATION": ["references/corpus_map.md", "references/layout/adaptation_matrix.md"],
    "DATA_VIZ": ["references/corpus_map.md", "references/data_viz.md"],
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

---

## 3. HOW IT WORKS

### Static-System Workflow

1. Identify the system role: brand surface, product UI, marketing page, data UI, or multi-platform adaptation.
2. Ground constraints: existing brand colors, design system tokens, target platforms, contrast bar, density bar, and whether the brief pins any axis.
3. Build the static system in layers:
   - Color: OKLCH primitives, semantic tokens, contrast pairs, surface scale, dark-mode mapping.
   - Type: role scale, pairing, measure, line height, data/text utilities.
   - Layout: spacing scale, grouping, hierarchy, grid, responsive and input adaptation, with the adaptation matrix when a surface spans device, input and context.
   - Data: when the surface carries charts or tables, encode the question with the right chart type, axis discipline, color-for-data scale and table alignment.
4. Test against the parent anti-slop base: every token needs a purpose, and free axes must not default to the median AI look.
5. Produce a compact handoff for implementation: named tokens, usage rules, responsive breakpoints, and explicit risks. The token starter scaffold turns this into a fill-in deliverable.

### Foundations sk-code Handoff Card

When foundations sends a static system to `sk-code`, fill the shared envelope from `../shared/sk_code_handoff.md`. The foundations-owned fields are required: register posture, surface role, source evidence, output schema, CSS-variable or theme-token names, breakpoint intent, accessibility checks, and unresolved risks. `sk-code` implements those tokens and breakpoints. It must not invent new token roles or change breakpoint intent.

### Decision Rules

- Prefer OKLCH for new color systems because lightness and chroma behave predictably across palette steps.
- Fix contrast by changing lightness first; chroma has little effect on readability.
- Treat dark mode as a separate surface system, not an inverted light palette.
- Use spacing and hierarchy before adding borders, colors, or cards.
- Let content drive breakpoints. Device sizes are a starting hypothesis, not the truth.
- Adapt across contexts by rethinking layout, interaction, content and navigation, and detect input capability rather than inferring it from width.
- Match a chart to the question, keep one variable per visual channel, and choose the color-for-data scale by the question rather than the dataset shape.

---

## 4. RULES

### ALWAYS

1. Name the system role before choosing tokens: brand, product, data, marketing, or platform adaptation.
2. Use semantic token names for the canonical color roles (`primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`) before implementation values; `focus` is an accent state, not a separate role.
3. For color work, check contrast and gamut; high-chroma OKLCH values must be clamped or wrapped with a fallback.
4. For dark mode, rebuild surface elevation with lightness and contrast, not shadows or inverted values.
5. For typography, set display, heading, body, caption, and utility roles before selecting decorative type moves.
6. For layout, establish a spacing scale and use proximity before adding containers.
7. For responsive work, adapt the experience to input method, viewport, orientation, and context; do not scale pixels.
8. Cite parent `sk-design` shared references only as vocabulary; keep foundations-specific decisions here.

### NEVER

1. Never use color without a role: semantic meaning, hierarchy, wayfinding, brand voice, or state.
2. Never make a palette more colorful just because the current screen is dull.
3. Never ship gray text on colored backgrounds; use a darker shade of the background hue or a defined token.
4. Never use arbitrary spacing values when a scale exists.
5. Never make every section the same card grid.
6. Never hide core functionality on mobile or rely on hover for touch contexts.
7. Never invent a design-system token when an existing token already carries the role.

### ESCALATE IF

1. Brand colors, required contrast level, target platforms, or design-system source are unknown and materially change the token system.
2. The requested palette or typography fails accessibility constraints.
3. A responsive adaptation would require changing information architecture, not just layout.
4. The system needs measured existing tokens from a live site; route to `md-generator`.

---

## 5. REFERENCES

### Core References

- [`references/color/oklch_workflow.md`](references/color/oklch_workflow.md) - OKLCH conversion, palette generation, contrast, gamut, and review output.
- [`references/color/palette_theming.md`](references/color/palette_theming.md) - Color dosage, semantic roles, tinted neutrals, surface scales, and dark mode.
- [`references/type/typography_system.md`](references/type/typography_system.md) - Type roles, scale, pairing, measure, hierarchy, and text checks.
- [`references/layout/layout_responsive.md`](references/layout/layout_responsive.md) - Spacing, rhythm, hierarchy, grids, responsive adaptation, and input contexts.
- [`references/layout/adaptation_matrix.md`](references/layout/adaptation_matrix.md) - Device, input, and context adaptation across mobile, tablet, desktop, print, and constrained surfaces as rethinking for context.
- [`references/data_viz.md`](references/data_viz.md) - Chart-type selection, axis and encoding, color-for-data scales, sparklines and data-table alignment.
- [`references/corpus_map.md`](references/corpus_map.md) - Source traceability for the distilled corpus.

### Assets

- [`assets/token_starter.md`](assets/token_starter.md) - Fill-in scaffold for an OKLCH ramp, type scale, and spacing scale, keyed to the shared register for color strategy and density.

### Parent Shared Base

Use, do not duplicate, the parent vocabulary:
- [`../shared/register.md`](../shared/register.md) - The shared Brand-vs-Product operating register. Set it first. It sets the color strategy and token density this skill inherits. The mode router does not discover `shared/`, so this pointer is explicit.
- [`../shared/sk_code_handoff.md`](../shared/sk_code_handoff.md) - Shared sk-code handoff envelope. Foundations uses it for register posture, surface role, source evidence, output schema, CSS variables and breakpoint intent.
- `../shared/anti_slop_principles.md`
- `../shared/design_token_vocabulary.md`
- `../shared/cognitive_laws.md`

---

## 6. SUCCESS CRITERIA

- Color tokens have OKLCH values or a deliberate compatibility reason, semantic names, contrast evidence, and dark-mode behavior when needed.
- Typography has role-based sizes, pairing rationale, line-height and measure constraints, and data/text utility guidance.
- Layout uses a consistent spacing scale, clear grouping, visible hierarchy, and content-driven responsive behavior.
- Context adaptation rethinks layout, interaction, content and navigation per target, keeps core functionality everywhere, and responds to input method rather than width alone.
- Data visualization matches the chart to the question, keeps axes honest with one variable per channel, chooses the color-for-data scale by the question, and aligns numeric tables with tabular numerals.
- When a token system is scaffolded, the token starter is filled from the register with OKLCH values, type roles and scale-bound spacing.
- The final handoff is implementable by `sk-code` without guessing token roles or breakpoint intent.
- The handoff card carries CSS-variable or theme-token names, breakpoint intent, source evidence and verification risks from the shared schema.

---

## 7. INTEGRATION POINTS

- `sk-design` routes static visual-system prompts here.
- `interface` supplies the distinctive direction this skill systematizes.
- `motion` consumes static tokens when defining motion materials and interaction states.
- `audit` scores the result for accessibility, performance, responsiveness, theming, and anti-slop risk.
- `sk-code` implements the token system in the detected stack.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual_testing_playbook/manual_testing_playbook.md`. The initial release notes are in `changelog/v1.0.0.0.md`.
