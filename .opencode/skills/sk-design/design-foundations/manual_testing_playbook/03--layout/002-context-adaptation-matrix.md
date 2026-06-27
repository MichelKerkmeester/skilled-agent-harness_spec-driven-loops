---
title: Context Adaptation Matrix Scenario
description: Manual scenario verifying per-context rethinking across device, input and posture rather than pixel scaling.
trigger_phrases:
  - "test adaptation matrix"
  - "test device context adaptation"
  - "foundations adaptation scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# FOUND-LAYOUT-002 | Context Adaptation Matrix

## Prompt

`Adapt a desktop admin tool for phone, tablet and a print export without dropping any core control.`

## Expected Process

1. Route to `foundations` first. Context adaptation resolves here before any `sk-code` implementation handoff.
2. Load `references/layout/adaptation_matrix.md`.
3. Read the four adaptation dimensions before deciding what changes, device and viewport, input method, connection and capability, usage posture.
4. Rethink layout, interaction, content and navigation per target context instead of scaling the desktop design down.
5. Branch on input capability with feature queries, not on width alone.

## Pass Criteria

- Treats each context as a rethink across layout, interaction, content and navigation, not a shrink.
- Detects input capability rather than inferring it from screen width.
- Keeps every core function available on phone, tablet, desktop and print.
- Never puts functionality behind hover alone and accounts for safe areas.
- Produces a print or export view that removes interaction, expands hidden content and adds page context.
- Uses content-driven breakpoints and serves responsive image weights.
- Defers the spacing scale and container-query mechanics to `layout_responsive.md` rather than re-deriving them.
