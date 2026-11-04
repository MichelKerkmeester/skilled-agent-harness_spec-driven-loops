---
title: Frontend Practice
description: Shared frontend principles for web surfaces, with a web layer, token guidance and a five-pass Figma check.
trigger_phrases:
  - "frontend practice"
  - "global interface principles"
  - "frontend stack overrides"
  - "figma to code review"
importance_tier: important
contextType: implementation
version: 1.0.3.0
---

# Frontend Practice

Shared rules for frontend work, expressed through the web layer and the project-specific layer.

---

## 1. OVERVIEW

### Purpose

This file owns the shared principles. The core states what good frontend work must preserve.

### When to Use

- Checking a change against the eleven principles
- Deciding values and precedence
- Reading a Figma frame as a reference
- Declaring a project mode override
- Running the frontend pre-completion checklist

### Boundaries

This file does not own:

- **Web mechanics.** The web layer expresses the principles through DOM and CSS. It names the vocabulary and mechanics that implement them, in [web-markup-and-css.md](web-markup-and-css.md).
- **Project-specific conventions.** Each project mode adds the conventions it uses, in its own `SKILL.md`.

---

## 2. THE ELEVEN PRINCIPLES

1. **Actions are buttons, and navigation is links.** People get the expected interaction and navigation behavior. See [web structure](web-markup-and-css.md#2-structure-and-semantics).
2. **Every control has a name, a role and a state.** People need to identify a control and understand its current condition. See [web structure](web-markup-and-css.md#2-structure-and-semantics).
3. **Every input has a visible label, and its affordance matches the data.** A visible label stays available after a person starts typing, while the input cue helps them enter the right data. See [web forms](web-markup-and-css.md#3-forms).
4. **Layout follows content flow, siblings have consistent spacing, text containers grow with their text, overlays leave the flow, and content respects device safe areas.** This lets content adapt without clipping or hiding ordinary content. See [web layout](web-markup-and-css.md#4-layout).
5. **Text survives translation and font scaling.** Longer translations and larger system text must remain readable and reachable. See [web responsive rules](web-markup-and-css.md#5-responsive).
6. **Every image has a text-alternative decision and reserved dimensions.** People using assistive technology need the image's meaning, and the layout needs its space before it loads. See [web media](web-markup-and-css.md#6-media).
7. **Values come from installed tokens, and a missing token is reported.** Installed tokens keep values consistent across the app, while a report gives the design system a clear gap to resolve. See [web CSS architecture](web-markup-and-css.md#7-css-architecture).
8. **Figma is a reference, not a code structure.** A design shows intended appearance and states, while the app's own conventions decide its structure. See the [web boundary](web-markup-and-css.md#1-overview) and [Figma to code](figma-to-code.md).
9. **Responsive behavior is checked at narrow, medium and wide widths and under zoom.** These checks expose wrapping, overflow and clipping before release. See [web responsive rules](web-markup-and-css.md#5-responsive).
10. **Assistive-technology checks are part of completion, and non-essential motion respects the user's reduced-motion setting.** They confirm names, order, states and feedback when people do not use the visual layout. See the [web checklist](web-markup-and-css.md#9-pre-completion-checklist).
11. **Text and controls meet the contrast target set by sk-design-fundamentals on every theme the mode supports.** Contrast remains readable in each supported theme. See [web structure](web-markup-and-css.md#2-structure-and-semantics) and [sk-design-fundamentals](../../../sk-design/sk-design-fundamentals/SKILL.md).

---

## 3. VALUES AND PRECEDENCE

Values come from the project's installed tokens. Report a missing token instead of inventing a value. When the tokens or the frame leave a value open, use [sk-design-fundamentals](../../../sk-design/sk-design-fundamentals/SKILL.md) for guidance.

Use [interaction-craft.md](../../../sk-design/sk-design-fundamentals/references/interaction-craft.md) for interaction detail. This core carries only the shared interaction rules:

- Make thumb-operated targets 44 px. Keep 32 px as the dense floor.
- Keep font weight stable across interaction states.
- Update optimistically, then roll back when the server reports an error.
- Show feedback beside the action that triggered it.
- Design empty states with a useful next action.

---

## 4. FIGMA AS REFERENCE

A Figma frame records intended appearance and states. Its layer tree does not decide the code structure. The five-pass check is in [figma-to-code.md Section 5](figma-to-code.md#5-the-check).

1. **Passes:** same-width comparison, state by state, render and source token checks, variable to token, range and access.
2. **Verdict:** PASS only when all passes pass. A pass marked NOT RUN with its reason makes the overall verdict INCOMPLETE.
3. **Figma transport ladder:** use an available official Figma connection first, then a verified connector or CLI, then a static export marked as possibly stale.

Check dark mode only where the mode supports it.

---

## 5. OVERRIDES

A project mode wins for its app when it declares a change to one core or web-layer statement. A mode may replace, extend or disable that statement.

- It records each change under a `Frontend overrides` heading in its own `SKILL.md`, naming the section, action and reason.
- When nothing differs, the heading says: none: this mode follows the core and its web layer unchanged.
- A project mode's completion report names the overrides it applied.

---

## 6. LAYERS AND TOPIC FILES

Load this core, the web layer and the one topic file the change touches. Load a second topic file only when the change crosses into it.

**Layers**

| Layer | Applies to | Reference |
|---|---|---|
| Web | Any DOM and CSS app, whatever the framework | [web-markup-and-css.md](web-markup-and-css.md) |
| Project-specific | Each project's own conventions | The project mode's `SKILL.md` |

**Web topic files**

| Topic | File | Load when |
|---|---|---|
| Elements and attributes | [web-elements-and-attributes.md](web-elements-and-attributes.md) | Adding or changing a dialog, popover, disclosure, form-control attribute or resource hint |
| Cascade and selectors | [web-cascade-and-selectors.md](web-cascade-and-selectors.md) | Changing selector reach, cascade layers, specificity or component style boundaries |
| Layout and sizing | [web-layout-and-sizing.md](web-layout-and-sizing.md) | Changing stacking, containing blocks, intrinsic sizing, container queries or scrolling |
| Accessibility patterns | [web-accessibility-patterns.md](web-accessibility-patterns.md) | Changing a widget pattern, accessible name, focus behavior, live region, browser preference or form validation and error messaging |
| Performance and loading | [web-performance-and-loading.md](web-performance-and-loading.md) | Changing vitals, resource loading, image delivery, fonts or main-thread work |
| Internationalization | [web-internationalization.md](web-internationalization.md) | Changing locale, direction, bidirectional text, formatting or translation tolerance |

---

## 7. PRE-COMPLETION CHECKLIST

- [ ] Actions use button behavior, navigation uses link behavior, and every control has a name, role and state.
- [ ] Every input has a visible label and matching affordance, and text remains readable after translation and font scaling.
- [ ] Layout follows content flow, respects safe areas and is checked at narrow, medium and wide widths and under zoom.
- [ ] Every image has a text alternative and reserved dimensions, and values use installed tokens with missing tokens reported.
- [ ] Figma informs appearance and states without dictating code structure, and the verdict is PASS or explains why it is INCOMPLETE.
- [ ] Non-essential motion respects the user's reduced-motion setting, and assistive-technology checks are recorded.
- [ ] Text and controls meet the contrast target on supported themes, and dark mode is checked only where the mode supports it.
