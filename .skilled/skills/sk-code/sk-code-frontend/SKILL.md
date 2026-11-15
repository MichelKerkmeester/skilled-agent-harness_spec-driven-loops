---
name: sk-code-frontend
description: Read-only frontend evidence for stack-agnostic web practice, visual values, topic references, and Figma checks.
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.2.0.0
metadata:
  family: sk-code
  packetKind: surface
---

<!-- Keywords: frontend surface, web markup css, visual values, motion and interaction, figma to code -->

# Frontend Surface: Stack-Agnostic Web Practice

Read-only frontend evidence for web work across project stacks.

## 1. WHEN THE HUB BUNDLES THIS

The sk-code hub bundles this surface beside `sk-code-quality` for authoring or `sk-code-review` for review when a request needs shared web frontend practice, a visual value or visual review, or a Figma-to-code check, and it routes this surface alone when no workflow mode scores.

This packet writes nothing. When the hub bundles it beside a workflow mode, that mode applies the guidance it loads. When no workflow mode scores, the hub routes this packet alone, and the acting agent applies the guidance and hands the author gates to `sk-code-quality` before it claims completion.

---

## 2. REFERENCE MAP

- [`references/frontend-practice.md`](references/frontend-practice.md) holds the shared principles and the Frontend overrides contract.
- [`references/web-markup-and-css.md`](references/web-markup-and-css.md) is the web layer.
- The six web topic files cover focused implementation details for web work: [`references/web-elements-and-attributes.md`](references/web-elements-and-attributes.md), [`references/web-cascade-and-selectors.md`](references/web-cascade-and-selectors.md), [`references/web-layout-and-sizing.md`](references/web-layout-and-sizing.md), [`references/web-accessibility-patterns.md`](references/web-accessibility-patterns.md), [`references/web-performance-and-loading.md`](references/web-performance-and-loading.md) and [`references/web-internationalization.md`](references/web-internationalization.md).
- Three visual topic files decide what a surface looks like and how it behaves: [`references/web-visual-values.md`](references/web-visual-values.md) holds the value scales, colour ramps, elevation, tokens and hard rules, [`references/web-visual-hierarchy.md`](references/web-visual-hierarchy.md) holds the build procedure, symptom-to-fix tables, hierarchy method, UX laws and visual review pass, and [`references/web-motion-and-interaction.md`](references/web-motion-and-interaction.md) holds motion, input, touch, focus, performance and feedback rules.
- [`assets/tokens.css`](assets/tokens.css) is a contrast-verified starter token file for a project with no token layer.
- [`references/figma-to-code.md`](references/figma-to-code.md) holds the five-pass check for comparing a built screen with its Figma frame.
- [`references/workflow-implement.md`](references/workflow-implement.md), [`references/workflow-debug.md`](references/workflow-debug.md), and [`references/workflow-verify.md`](references/workflow-verify.md) provide the shared workflow doctrine.

### Manual Testing Playbook

Manual testing scenarios for this surface live in [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md), the root index, plus one file per intent family under `manual-testing-playbook/frontend-surface/<scenario>.md`. The category folder and each scenario file use bare descriptive slugs, with no numeric prefix.
Each scenario declares the `expected_intent` and `expected_resources` the packet router emits for its exact prompt, so the hub's router-sync guard replays both.

Validate the package with the operator-scenario contract:
`node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook`

---

## 3. SMART ROUTING

Read [`ROUTER.md`](./ROUTER.md) for the intent map, topic-file loading conditions, and machine router. The core loads by default, followed by the web layer for a web intent or the mapped files for a visual, motion or Figma intent.

---

## 4. SURFACE STANDARDS

### ✅ ALWAYS

- Read the shared principles first. Web intents add the web layer, and visual, motion and Figma intents add the files [`ROUTER.md`](./ROUTER.md) maps for them without it.
- Load a topic file when its condition in [`ROUTER.md`](./ROUTER.md) applies.
- Use installed design tokens and report a missing token instead of inventing a value.
- Mark a Figma pass `NOT RUN` with its reason; the overall verdict is `INCOMPLETE` when any pass cannot run.

### ⛔ NEVER

- Write, edit, or scaffold through this packet. The acting workflow mode applies any change.
- Treat a Figma layer tree as the code structure.

### ⚠️ ESCALATE IF

- Project conventions conflict with a core or web-layer statement; record the decision under the mode's Frontend overrides heading.

---

## 5. FRONTEND OVERRIDES

A project mode records each change to a core or web-layer statement under a `Frontend overrides` heading in its own `SKILL.md`, naming the section, whether it replaces, extends, or disables the statement, and the reason. See [Frontend practice, Section 5](references/frontend-practice.md#5-overrides).

- When nothing differs, the heading says that it follows the core and web layer unchanged.
- Its completion report names the overrides it applied.
