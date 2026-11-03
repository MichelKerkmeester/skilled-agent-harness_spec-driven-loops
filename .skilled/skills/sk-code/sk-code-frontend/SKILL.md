---
name: sk-code-frontend
description: Read-only frontend evidence for stack-agnostic web and native practice, topic references, and Figma checks.
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.1.0
metadata:
  family: sk-code
  packetKind: surface
---

<!-- Keywords: frontend surface, web markup css, react native layout, figma to code -->

# Frontend Surface: Stack-Agnostic Web and Native Practice

Read-only frontend evidence for web and React Native work across project stacks.

## 1. WHEN THE HUB BUNDLES THIS

The sk-code hub bundles this surface beside `sk-code-quality` for authoring and `sk-code-review` for review when a request needs shared web or native frontend practice, or a Figma-to-code check.

This packet writes nothing. The paired workflow mode applies the guidance it loads.

---

## 2. REFERENCE MAP

- [`references/frontend-practice.md`](references/frontend-practice.md) holds the cross-stack core and the Frontend overrides contract.
- [`references/web-markup-and-css.md`](references/web-markup-and-css.md) and [`references/react-native-layout-and-a11y.md`](references/react-native-layout-and-a11y.md) are the web and native stack layers.
- The six web topic files and five native topic files cover focused implementation details for each stack.
- [`references/figma-to-code.md`](references/figma-to-code.md) holds the five-pass check for comparing a built screen with its Figma frame.
- [`references/workflow-implement.md`](references/workflow-implement.md), [`references/workflow-debug.md`](references/workflow-debug.md), and [`references/workflow-verify.md`](references/workflow-verify.md) provide the shared workflow doctrine.

### Manual Testing Playbook

Manual testing scenarios for this surface live in [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md), the root index, plus one file per intent family under `manual-testing-playbook/frontend-surface/<scenario>.md`. The category folder and each scenario file use bare descriptive slugs, with no numeric prefix.
Each scenario declares the `expected_intent` and `expected_resources` the packet router emits for its exact prompt, so the hub's router-sync guard replays all three.

Validate the package with the operator-scenario contract:
`node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook`

---

## 3. SURFACE STANDARDS

### ✅ ALWAYS

- Read the cross-stack core and matching stack layer before applying a topic reference.
- Load a topic file when its condition in [`ROUTER.md`](./ROUTER.md) applies.
- Use installed design tokens and report a missing token instead of inventing a value.
- Mark a Figma pass `NOT RUN` with its reason; the overall verdict is `INCOMPLETE` when any pass cannot run.

### ⛔ NEVER

- Write, edit, or scaffold through this packet. The acting workflow mode applies any change.
- Treat a Figma layer tree as the code structure.

### ⚠️ ESCALATE IF

- Project conventions conflict with a core or stack-layer statement; record the decision under the mode's Frontend overrides heading.

---

## 4. FRONTEND OVERRIDES

A project or stack mode records each change to a core or stack-layer statement under a `Frontend overrides` heading in its own `SKILL.md`, naming the section, whether it replaces, extends, or disables the statement, and the reason; when nothing differs, it says that it follows the core and stack layer unchanged. Its completion report names the overrides it applied. See [Frontend practice, Section 5](references/frontend-practice.md#5-overrides).

---

## 5. SMART ROUTING

Read [`ROUTER.md`](./ROUTER.md) for the intent map, topic-file loading conditions, and machine router. The core loads by default, followed by the matching web, native, or Figma-to-code references.
