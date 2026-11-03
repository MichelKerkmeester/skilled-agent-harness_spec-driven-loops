---
title: "sk-code-frontend"
description: "Stack-agnostic web and native frontend practice with a five-pass Figma check, bundled as read-only evidence for the sk-code hub."
trigger_phrases:
  - "web frontend practice"
  - "react native frontend practice"
  - "figma to code check"
version: 1.0.1.0
---

# sk-code-frontend

> Frontend guidance for web and React Native work, with a five-pass check for comparing a built screen with its Figma frame.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Packet kind** | `surface`, backend `evidence-base`, read-only |
| **Tools** | `Read, Bash, Grep, Glob` |
| **Use it for** | Web markup and CSS, React Native layout and accessibility, and Figma-to-code checks |
| **Invoke with** | No direct invocation. The sk-code hub bundles it beside a workflow mode when frontend evidence applies |
| **Advisor** | Invisible (`routingClass: metadata`) |
| **Bundled with** | `sk-code-quality` for authoring and `sk-code-review` for review |
| **Produces** | Cross-stack principles, web and native stack guidance, topic references, and the five-pass Figma check; the packet edits nothing |

---

## 2. OVERVIEW

### Why This Surface Exists

Frontend work needs shared rules that hold across frameworks, with separate web and native layers for the mechanics each stack uses. A design frame also needs a consistent check against the built screen without copying its layer tree into code.

### What It Holds

[`references/frontend-practice.md`](references/frontend-practice.md) is the core page for cross-stack principles, token guidance, Figma as reference, and overrides. The web layer is [`references/web-markup-and-css.md`](references/web-markup-and-css.md); the React Native layer is [`references/react-native-layout-and-a11y.md`](references/react-native-layout-and-a11y.md). Six web topic files and five native topic files provide focused guidance, and [`references/figma-to-code.md`](references/figma-to-code.md) defines the five-pass check and its verdicts.

The packet is read-only. The paired workflow mode applies its evidence to the requested work.

---

## 3. REFERENCE MAP

| File | Carries |
|---|---|
| `references/frontend-practice.md` | Cross-stack principles, token precedence, the Figma boundary, and the Frontend overrides contract |
| `references/web-markup-and-css.md` | Semantic web markup, forms, layout, responsive behavior, media, CSS architecture, and framework examples |
| `references/react-native-layout-and-a11y.md` | React Native and Yoga layout, accessibility, text scaling, inputs, images, lists, and Figma-check limits |
| Six web topic files | Elements and attributes, cascade and selectors, layout and sizing, accessibility patterns, performance and loading, and internationalization |
| `references/native-*.md` | Five focused topics: accessibility, inputs and keyboard, layout and text, lists and motion, and platform differences |
| `references/figma-to-code.md` | Read-only inputs, five passes, the verdict and report, and the Figma-side tool ladder |
| `references/workflow-*.md` | Shared implement, debug, and verify workflow doctrine |

The packet router lists each topic file and the condition that calls for it.

---

## 4. VERIFICATION

| Check | How to run it |
|---|---|
| Packet contents | `ls -la .skilled/skills/sk-code/sk-code-frontend/references` |
| Router declarations | `rg -n "## 3\. MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` |

The listing shows the stack and topic references plus the three shared workflow links. The router check prints the machine-router heading and its resource declarations.

---

## 5. RELATED DOCUMENTS

| Document | Why to read it |
|---|---|
| [SKILL.md](SKILL.md) | Surface identity, bundling conditions, and the overrides contract |
| [ROUTER.md](ROUTER.md) | Intent map, topic-file conditions, and machine router |
| [../SKILL.md](../SKILL.md) | The sk-code hub that bundles this surface beside a workflow mode |
| [references/frontend-practice.md](references/frontend-practice.md) | Cross-stack principles and the Frontend overrides contract |
| [references/figma-to-code.md](references/figma-to-code.md) | The five-pass check for a built screen and its Figma frame |
