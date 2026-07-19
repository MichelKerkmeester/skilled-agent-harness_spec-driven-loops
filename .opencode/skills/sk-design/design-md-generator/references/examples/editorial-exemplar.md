---
title: Editorial Extraction Exemplar
description: Non-SaaS exemplar guide for studying editorial, ecommerce, culture or hospitality extraction output without creating a preset.
trigger_phrases:
  - "editorial extraction exemplar"
  - "non-SaaS exemplar"
  - "ecommerce extraction study"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Editorial Extraction Exemplar

This exemplar is illustrative and non-SaaS. It describes how to study a real editorial or ecommerce extraction without turning it into a reusable preset.

## 1. Candidate Surface

Use a public editorial, cultural or ecommerce site with a clearly different design language from developer-tool brands.

Good candidates:

- Editorial magazine homepage.
- Museum exhibition page.
- Independent ecommerce collection page.
- Restaurant or hospitality landing page.

Avoid another developer-tool, SaaS dashboard or infrastructure brand for this exemplar.

## 2. Extraction Focus

Study these signals after a real extraction:

| Signal | What To Inspect |
| --- | --- |
| Type | Editorial display roles, body measure and caption treatment |
| Color | Paper, ink, accent, campaign and content color separation |
| Layout | Story rhythm, product rhythm or editorial pacing |
| Imagery | Cropping, aspect ratios and text-image hierarchy |
| Components | Cards, article teasers, product tiles, newsletter blocks and navigation |
| Fidelity | Every value still comes from `tokens.json` |

## 3. Writing Notes Template

```text
Source category: editorial | ecommerce | culture | hospitality
Register read: Brand or Product
Distinctive extracted signal: type, color, layout or imagery
Values copied verbatim: yes
Content-layer values excluded: yes
What not to copy: the category look, palette or type choice
What to learn: how the v3 Style Reference names roles outside SaaS aesthetics
```

## 4. Guardrail

This exemplar broadens study coverage. It is not a palette preset, landing page recipe or permission to fabricate a DESIGN.md without a live site.
