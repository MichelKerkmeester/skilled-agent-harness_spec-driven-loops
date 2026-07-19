---
title: Anti-Slop And Production Hardening Scenario
description: Manual scenario verifying AI-slop detection, critique, copy clarity, pseudo-element checks, and hardening behavior.
trigger_phrases:
  - "test anti-slop audit"
  - "test production hardening"
  - "slop hardening scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: ANTI_PATTERNS_PRODUCTION
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/critique-hardening.md
  - references/anti-patterns-production.md
  - references/ai-fingerprint-tells.md
  - assets/anti-patterns-score-rubric.md
---

**Exact prompt**

```
This landing page looks AI-generated. Check it for design slop, theme and token drift, pseudo-element tells, and vague copy I should clarify.
```

# AUDIT-SLOP-001 | Anti-Slop And Production Hardening

## Target

Supply one concrete landing-page or marketing UI artifact in the `<TARGET>` slot: a source file path, a rendered URL, a screenshot, or a design plan. If no target is available, record SKIP with the blocker "no target artifact supplied"; do not invent tells or copy evidence.

## Prompt

`Critique <TARGET> for AI-generated design tells, unclear copy, brittle edge cases, and production hardening gaps.`

## Expected Process

1. Load `references/critique-hardening.md`, `references/anti-patterns-production.md`, and `references/audit-contract.md`.
2. Check anti-slop signals, cognitive load, copy clarity, edge cases, i18n, pseudo-elements, and theming drift.
3. Check committed `DESIGN.md` or design-token exports against the rendered surface for source-of-truth drift, hard-coded values, off-token color, one-off spacing, and primitive tokens used directly in product UI.
4. Check layering against a named semantic z-index scale: dropdown, sticky, modal-backdrop, modal, toast, tooltip.
5. Map findings to sibling owners.

## Pass Criteria

- Starts anti-pattern verdict with concrete tells.
- Applies the visual-critique crosswalk dimensions as lenses feeding existing severity: hierarchy, brand consistency, composition, typography, color, affordance, and information density.
- Flags `DESIGN.md` or design-token drift when the rendered surface bypasses committed tokens with hard-coded values, off-token colors, one-off spacing, or primitive tokens in product UI.
- Bans magic z-index values such as `999` or `9999` and replaces them with a named semantic layer scale in the order dropdown, sticky, modal-backdrop, modal, toast, tooltip.
- Includes hardening checks for long text, empty/error/loading states, and localization/RTL risk.
- Flags component-completeness gaps and token-tier misuse where anatomy, variants, states, accessible names, keyboard behavior, or primitive/semantic token layers are incomplete.
- Runs a pseudo-localization check for expansion, special characters, overflow, truncation, and broken glyph handling before localized UI is called ready.
- Does not confuse critique with implementation.
- Provides concrete next actions by owner.
