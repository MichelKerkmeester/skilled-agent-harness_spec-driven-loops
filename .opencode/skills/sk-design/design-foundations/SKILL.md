---
name: design-foundations
description: Static visual-system design for color, typography, layout, spacing, hierarchy, responsive adaptation, themes, and design tokens.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-design
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

Keyword triggers: `OKLCH`, `palette`, `contrast`, `dark mode`, `theme tokens`, `typography scale`, `font pairing`, `measure`, `spacing`, `grid`, `layout rhythm`, `visual hierarchy`, `information hierarchy`, `responsive`, `container queries`, `adaptation matrix`, `data visualization`, `chart type`, `data tables`, `design tokens`, `token starter`.

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

Route here when the main ask is a static visual-system decision: hierarchy, rhythm, spacing, grid, layout, typography, palette, theme tokens, responsive adaptation, or design-token system design. A `hero section` prompt routes here only when the requested fix is hierarchy/rhythm/layout/token discipline; full visual direction for the hero routes to `interface`. `tokens.json` and `DESIGN.md` route to `md-generator` when they are measured extraction or validation artifacts; keep foundations for authoring or adapting token systems.

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
- `references/data-viz.md` contains chart-type selection, axis and encoding, color-for-data scales, sparklines and data-table alignment.
- `references/worked-examples.md` contains two illustrative, fully worked examples for output-shape calibration. They are not reusable presets.
- `assets/` contains fill-in scaffolds, starting with `token-starter.md` for an OKLCH ramp, type scale and spacing scale.
- `references/corpus-map.md` records the source corpus distilled into this skill.
- `../shared/sk-code-handoff.md` defines the family handoff envelope used for the final foundations card.

The folders are intentionally split-ready so `color`, `type`, and `layout` could become separate children later without rewriting the knowledge base.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | The first step of any foundations task | `../shared/register.md` (set the Brand-vs-Product register, which sets the color strategy and token density this skill inherits) |
| ALWAYS | Any foundations task | `references/corpus-map.md` plus the matching axis reference |
| ALWAYS | Any design or UI build task | `../shared/context-loading-contract.md` (register-first gate, build bundle, context manifest, the four required proof fields, and hard gates) |
| CONDITIONAL | Color or theme work | `references/color/oklch-workflow.md`, `references/color/palette-theming.md` |
| CONDITIONAL | Any UI build with changed foreground/background text or surface pairs | `references/color/oklch-workflow.md` Section 4 plus the mandatory contrast-pair inventory `assets/contrast-pair-inventory.md`; every ratio traces to `scripts/contrast_check.py` (a calculator, not eyeballed), run downstream per §5 Scripts and `../shared/context-loading-contract.md` |
| CONDITIONAL | Typography work | `references/type/typography-system.md` |
| CONDITIONAL | Layout or responsive work | `references/layout/layout-responsive.md` |
| CONDITIONAL | Data visualization, charts, or data tables | `references/data-viz.md` |
| CONDITIONAL | Calibrating what a complete foundations answer looks like | `references/worked-examples.md` (illustrative dashboard and brand landing examples, never presets) |
| CONDITIONAL | Device, input, or context adaptation | `references/layout/adaptation-matrix.md` |
| CONDITIONAL | Scaffolding a new token system or handing tokens to sk-code | `assets/token-starter.md` (fill-in OKLCH ramp, type scale, and spacing scale) and `../shared/sk-code-handoff.md` (final foundations handoff card); validated downstream by §5 Scripts' `baseline_rhythm_check.py` and `naming_doc_check.py` |
| CONDITIONAL | Internal procedure support | `procedures/tweakable-design-controls.md`, `procedures/component-system-inventory.md`, `procedures/hierarchy-rhythm-review.md`, and `../shared/procedures/polish-gate-orchestration.md` when the trigger matches |
| ON_DEMAND | Cross-axis token-system work | Load all three axis folders plus parent `sk-design/references/design-token-vocabulary.md` |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `foundations` mode is selected, choose at most one card from `procedures/` or `../shared/procedures/` and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

The authoritative routing logic discovers markdown at runtime via `discover_markdown_resources()`, guards every path inside the skill folder via `_guard_in_skill()`, scores the static axis as a routing key, loads only files that exist, and returns an `UNKNOWN_FALLBACK` checklist when confidence is too low. See [skill_smart_router.md](../../sk-doc/create-skill/assets/skill/skill_smart_router.md) for the general resilience pattern, and [references/smart-router-pseudocode.md](references/smart-router-pseudocode.md) for this mode's full `INTENT_SIGNALS`, `RESOURCE_MAP`, and `route_foundations_resources()` implementation.

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

### Procedure Card Selection

After the hub selects the public `foundations` mode, choose at most one primary private procedure card and cite it by relative path in the plan or proof line. These cards support static-system decisions; they are not public routes.

| Request shape | Procedure card | Proof to cite |
| --- | --- | --- |
| User-adjustable options, controls, or tunable variants | `procedures/tweakable-design-controls.md` | The 3 to 8 meaningful controls, targets, defaults, and persistence expectations. |
| Component extraction, reusable parts, or system inventory | `procedures/component-system-inventory.md` | Repeated patterns versus one-offs, variants/states, token traces, and gaps. |
| Hierarchy, rhythm, spacing, density, or flat/chaotic visual order | `procedures/hierarchy-rhythm-review.md` | Scan path, scale discipline, confirmed/inferred evidence, and owner-mapped fixes. |
| Final polish spanning accessibility, slop, rhythm, and states | `../shared/procedures/polish-gate-orchestration.md` | Consolidated blockers, quality issues, polish notes, and owner mapping. |

If no procedure card matches, state `Procedure applied: none - baseline foundations workflow` and continue with the static-system workflow. Do not load every procedure card for a single request; select from the prompt and available evidence.

### Context, Proof, And Direct Fallback

Record the context basis before system decisions: public mode `foundations`, loaded references, selected procedure card or no-procedure fallback, system role, source evidence, pinned tokens, target platforms, accessibility bar, and unknowns. Before a ready or handoff claim, include proof naming the selected procedure card, evidence labels, token/scale decisions, and verification risks.

This mode must run directly with Read, Glob, and Grep only. If subagents are unavailable or disallowed, do not dispatch; execute the same procedure selection, context capture, and proof checks in the current session. The fallback keeps the same proof bar and cannot rely on Write, Edit, Bash, or Task. This includes the packet's deterministic scripts (§5 Scripts): they are never invoked by this mode in any execution path, direct or subagent, because they need Bash; they run downstream, in whichever step builds, ships, or maintains the artifact.

### Foundations sk-code Handoff Card

When foundations sends a static system to `sk-code`, fill the shared envelope from `../shared/sk-code-handoff.md`. The foundations-owned fields are required: register posture, surface role, source evidence, output schema, CSS-variable or theme-token names, breakpoint intent, accessibility checks, and unresolved risks. `sk-code` implements those tokens and breakpoints. It must not invent new token roles or change breakpoint intent.

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

### ✅ ALWAYS

1. Name the system role before choosing tokens: brand, product, data, marketing, or platform adaptation.
2. Use semantic token names for the canonical color roles (`primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`) before implementation values; `focus` is an accent state, not a separate role.
3. For color work, check contrast and gamut; high-chroma OKLCH values must be clamped or wrapped with a fallback.
4. For dark mode, rebuild surface elevation with lightness and contrast, not shadows or inverted values.
5. For typography, set display, heading, body, caption, and utility roles before selecting decorative type moves.
6. For layout, establish a spacing scale and use proximity before adding containers.
7. For responsive work, adapt the experience to input method, viewport, orientation, and context; do not scale pixels.
8. Cite parent `sk-design` shared references only as vocabulary; keep foundations-specific decisions here.
9. Cite the selected procedure card or no-procedure fallback before substantial foundations output when a private procedure trigger matches.

### ⛔ NEVER

1. Never use color without a role: semantic meaning, hierarchy, wayfinding, brand voice, or state.
2. Never make a palette more colorful just because the current screen is dull.
3. Never ship gray text on colored backgrounds; use a darker shade of the background hue or a defined token.
4. Never use arbitrary spacing values when a scale exists.
5. Never make every section the same card grid.
6. Never hide core functionality on mobile or rely on hover for touch contexts.
7. Never invent a design-system token when an existing token already carries the role.

### ⚠️ ESCALATE IF

1. Brand colors, required contrast level, target platforms, or design-system source are unknown and materially change the token system.
2. The requested palette or typography fails accessibility constraints.
3. A responsive adaptation would require changing information architecture, not just layout.
4. The system needs measured existing tokens from a live site; route to `md-generator`.

---

## 5. REFERENCES

### Core References

- [`references/color/oklch-workflow.md`](references/color/oklch-workflow.md) - OKLCH conversion, palette generation, contrast, gamut, and review output.
- [`references/color/palette-theming.md`](references/color/palette-theming.md) - Color dosage, semantic roles, tinted neutrals, surface scales, and dark mode.
- [`references/type/typography-system.md`](references/type/typography-system.md) - Type roles, scale, pairing, measure, hierarchy, and text checks.
- [`references/layout/layout-responsive.md`](references/layout/layout-responsive.md) - Spacing, rhythm, hierarchy, grids, responsive adaptation, and input contexts.
- [`references/layout/adaptation-matrix.md`](references/layout/adaptation-matrix.md) - Device, input, and context adaptation across mobile, tablet, desktop, print, and constrained surfaces as rethinking for context.
- [`references/data-viz.md`](references/data-viz.md) - Chart-type selection, axis and encoding, color-for-data scales, sparklines and data-table alignment.
- [`references/worked-examples.md`](references/worked-examples.md) - Two annotated examples, a dense product dashboard and a generous brand landing, marked illustrative and not reusable presets.
- [`references/corpus-map.md`](references/corpus-map.md) - Source traceability for the distilled corpus.
- [`references/smart-router-pseudocode.md`](references/smart-router-pseudocode.md) - This mode's full smart-router implementation (`INTENT_SIGNALS`, `RESOURCE_MAP`, `route_foundations_resources()`), split out of this file to keep SKILL.md within its word budget.

### Assets

- [`assets/token-starter.md`](assets/token-starter.md) - Fill-in scaffold for an OKLCH ramp, type scale, and spacing scale, keyed to the shared register for color strategy and density.

### Scripts

Three deterministic checks ship with this packet. `foundations` is a read-only `Read`/`Glob`/`Grep` mode (`mode-registry.json` forbids `Write`/`Edit`/`Bash` for this mode) and never executes them itself, in any execution path, direct or subagent. Each runs downstream, in whichever step actually builds, ships, or maintains the artifact (typically `sk-code` implementation, a human check, or CI) — see `../shared/context-loading-contract.md`'s deterministic-enforcement gate, which wires the same rule for the contrast check.

- [`scripts/contrast_check.py`](scripts/contrast_check.py) - WCAG/APCA contrast calculator for `assets/contrast-pair-inventory.md` rows; a pair stays `not assessed` until this has actually run.
- [`scripts/baseline_rhythm_check.py`](scripts/baseline_rhythm_check.py) - Baseline-rhythm gate for the `assets/token-starter.md` Section 5 spacing table; rejects one-off spacing values that do not resolve to the baseline.
- [`scripts/naming_doc_check.py`](scripts/naming_doc_check.py) - Naming and required-heading gate for filled token, component, or library artifacts, such as a completed `assets/token-starter.md`.

### Parent Shared Base

Use, do not duplicate, the parent vocabulary:
- [`../shared/register.md`](../shared/register.md) - The shared Brand-vs-Product operating register. Set it first. It sets the color strategy and token density this skill inherits. The mode router does not discover `shared/`, so this pointer is explicit.
- [`../shared/sk-code-handoff.md`](../shared/sk-code-handoff.md) - Shared sk-code handoff envelope. Foundations uses it for register posture, surface role, source evidence, output schema, CSS variables and breakpoint intent.
- `../shared/anti-slop-principles.md`
- `../shared/design-token-vocabulary.md`
- `../shared/cognitive-laws.md`
- [`procedures/tweakable-design-controls.md`](procedures/tweakable-design-controls.md) - Private support for small, meaningful adjustable design controls.
- [`procedures/component-system-inventory.md`](procedures/component-system-inventory.md) - Private support for reusable component inventory and system-gap discovery.
- [`procedures/hierarchy-rhythm-review.md`](procedures/hierarchy-rhythm-review.md) - Private support for hierarchy, rhythm, spacing, and scan-path review.
- [`../shared/procedures/polish-gate-orchestration.md`](../shared/procedures/polish-gate-orchestration.md) - Shared private final-polish orchestration when foundations owns static-system fixes.

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
- The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- Direct execution with Read, Glob, and Grep can produce the same context/proof result without subagent dispatch.

---

## 7. INTEGRATION POINTS

- `sk-design` routes static visual-system prompts here.
- `interface` supplies the distinctive direction this skill systematizes.
- `motion` consumes static tokens when defining motion materials and interaction states.
- `audit` scores the result for accessibility, performance, responsiveness, theming, and anti-slop risk.
- `sk-code` implements the token system in the detected stack.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual-testing-playbook/manual-testing-playbook.md`. The initial release notes are in `changelog/v1.0.0.0.md`.
