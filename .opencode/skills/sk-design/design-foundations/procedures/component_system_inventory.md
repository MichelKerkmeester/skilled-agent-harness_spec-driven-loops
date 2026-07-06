---
title: Component System Inventory
description: Private procedure card for design-foundations component inventory and system-gap review.
trigger_phrases:
  - "component system inventory"
  - "component library extraction"
  - "system gap review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Component System Inventory

Private procedure card for applying the existing design-foundations component inventory workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Help `design-foundations` identify reusable components and system gaps in a finished or near-finished design. |
| Owning mode | `design-foundations` |
| Source reference | `component-extract.md` |
| Trigger | Use when a user wants to turn a design into a component library, extract reusable parts, or make an interface maintainable as a system. |
| Output contract | A component inventory grouped into foundations, atoms, molecules, organisms, and templates, with variants, states, tokens, composition, accessibility notes, and gaps. |
| Proof gate | The inventory distinguishes repeated patterns from one-offs, names missing variants or states, and traces component styling back to tokens when available. |
| Privacy rule | This is private foundations guidance and does not add a public component-extract skill. |

## 2. READ-ONLY COMPATIBILITY

The foundations mode can return the inventory as advisory content or handoff. It must not require file output, code generation, or command execution.

## 3. PROCEDURE

1. Identify the target surface and read all relevant files or artifacts available through allowed tools.
2. Walk the design section by section and mark repeatable patterns, plausible future components, variants, and states.
3. Group findings by token foundations, atoms, molecules, organisms, and templates.
4. Record accessibility notes, do/don't guidance, composition dependencies, and missing states.
5. Recommend token extraction, component implementation, or polish review as the next step.

## 4. CONFLICT RULE

If the request is measured extraction from a live site into `DESIGN.md`, route to `design-md-generator/procedures/design_system_extraction.md` instead.
