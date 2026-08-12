---
title: "references/primitives: Optional Diagram Primitives"
description: "Index of the on-demand primitives layered onto a base diagram: annotation callouts, sketchy variant, terminal skin, icon set."
importance_tier: normal
trigger_phrases:
  - "diagram primitives index"
  - "annotation sketchy terminal icons"
contextType: general
version: 1.0.0.0
---

# references/primitives

Optional primitives layered onto a base diagram, loaded only when the request calls for one.

---

## 1. OVERVIEW

Every file here is `ON_DEMAND` in `SKILL.md`'s Resource Loading Levels — none load by default. Each documents one independent primitive that composes with any diagram type.

---

## 2. FILES

| File | Primitive |
|---|---|
| `primitive-annotation.md` | Italic annotation callouts (max 2 per diagram). |
| `primitive-icons.md` | The monochrome icon set (`currentColor`-inheriting). |
| `primitive-sketchy.md` | The hand-drawn/sketchy rendering variant. |
| `primitive-terminal.md` | The fixed CLI-chrome terminal skin (independent of onboarding/brand tokens). |

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | When each primitive loads. |
| [`../foundations/style-guide.md`](../foundations/style-guide.md) | The base design tokens primitives layer onto. |
