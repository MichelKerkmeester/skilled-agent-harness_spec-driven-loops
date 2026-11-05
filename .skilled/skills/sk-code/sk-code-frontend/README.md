---
title: "sk-code-frontend"
description: "Stack-agnostic web frontend practice with a five-pass Figma check, bundled as read-only evidence for the sk-code hub."
trigger_phrases:
  - "web frontend practice"
  - "figma to code check"
version: 1.0.7.0
---

# sk-code-frontend

> Frontend guidance for web work, with a five-pass check for comparing a built screen with its Figma frame.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Packet kind** | `surface`, backend `evidence-base`, read-only |
| **Tools** | `Read, Bash, Grep, Glob` |
| **Use it for** | Web markup and CSS, web accessibility, and Figma-to-code checks |
| **Invoke with** | No direct invocation. The sk-code hub bundles it beside a workflow mode when frontend evidence applies, or routes it alone when no workflow mode scores |
| **Advisor** | Invisible (`routingClass: metadata`) |
| **Bundled with** | `sk-code-quality` for authoring and `sk-code-review` for review, or routed alone |
| **Produces** | Shared principles, web guidance, topic references, and the five-pass Figma check; the packet edits nothing |

### Why This Surface Exists

Frontend work needs shared rules that hold across frameworks, with a web layer for the mechanics the web platform uses. A design frame also needs a consistent check against the built screen without copying its layer tree into code.

### What It Holds

[`references/frontend-practice.md`](references/frontend-practice.md) is the core page for shared principles, token guidance, Figma as reference, and overrides. The web layer is [`references/web-markup-and-css.md`](references/web-markup-and-css.md). Six web topic files provide focused guidance, three visual topic files decide values, hierarchy and motion, and [`references/figma-to-code.md`](references/figma-to-code.md) defines the five-pass check and its verdicts.

The packet is read-only. The paired workflow mode applies its evidence to the requested work.

---

## 2. REFERENCE MAP

| File | Carries |
|---|---|
| `references/frontend-practice.md` | Shared principles, token precedence, the Figma boundary, and the Frontend overrides contract |
| `references/web-markup-and-css.md` | Semantic web markup, forms, layout, responsive behavior, media, CSS architecture, and framework examples |
| Six web topic files | [Elements and attributes](references/web-elements-and-attributes.md), [cascade and selectors](references/web-cascade-and-selectors.md), [layout and sizing](references/web-layout-and-sizing.md), [accessibility patterns](references/web-accessibility-patterns.md), [performance and loading](references/web-performance-and-loading.md) and [internationalization](references/web-internationalization.md) |
| Three visual topic files | [Visual values](references/web-visual-values.md), [visual hierarchy and review](references/web-visual-hierarchy.md) and [motion and interaction](references/web-motion-and-interaction.md) |
| `assets/tokens.css` | A contrast-verified starter token file for a project with no token layer |
| `references/figma-to-code.md` | Read-only inputs, five passes, the verdict and report, and the Figma-side tool ladder |
| `manual-testing-playbook/` | The routing scenarios the hub's router-sync guard replays: one web, one Figma check and one visual-values scenario |
| `references/workflow-*.md` | Shared [implement](references/workflow-implement.md), [debug](references/workflow-debug.md) and [verify](references/workflow-verify.md) workflow doctrine |
| `changelog/` | Release history for this surface |

The packet router lists each topic file and the condition that calls for it.

---

## 3. VERIFICATION

| Check | How to run it |
|---|---|
| Packet contents | `ls -la .skilled/skills/sk-code/sk-code-frontend/references` |
| Router declarations | `rg -n "## 3\. MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` |
| Playbook package | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook` |

The listing shows the web and topic references plus the three shared workflow links. The router check prints the machine-router heading and its resource declarations. The playbook check reports the three scenarios, including the visual-values scenario, and exits 0.

---

## 4. RELATED DOCUMENTS

| Document | Why to read it |
|---|---|
| [SKILL.md](SKILL.md) | Surface identity, bundling conditions, and the overrides contract |
| [ROUTER.md](ROUTER.md) | Intent map, topic-file conditions, and machine router |
| [../SKILL.md](../SKILL.md) | The sk-code hub that bundles this surface beside a workflow mode |
| [references/frontend-practice.md](references/frontend-practice.md) | Shared principles and the Frontend overrides contract |
| [references/figma-to-code.md](references/figma-to-code.md) | The five-pass check for a built screen and its Figma frame |
| [manual-testing-playbook/manual-testing-playbook.md](manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the web, Figma-check and visual-values routing |
