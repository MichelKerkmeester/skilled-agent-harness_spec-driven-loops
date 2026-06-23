---
title: "Grounding and reuse loop"
description: "Any Open Design read or run that feeds a design decision MUST load sk-design-interface first (a hard precondition): ground, build a token system, critique, and reuse one resolved system live. Pure transport (wiring, bare inventory) is exempt."
trigger_phrases:
  - "ground a design in open design"
  - "reuse open design tokens"
  - "design system grounding"
  - "sk-design-interface integration"
  - "reuse before generate"
importance_tier: "important"
version: 1.4.0.5
---

# Grounding and reuse loop (sk-design-interface integration)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Turns a read of an Open Design system into a grounded design decision. The transport belongs to this skill, but the taste belongs to `sk-design-interface`, which is a hard precondition: any read or run that feeds a design decision MUST load `sk-design-interface` first. Only pure transport — wiring the MCP server, a bare inventory listing that feeds no design decision — is exempt.

The point of the loop is to reuse a real, lint-governed design system instead of drifting into AI defaults. An Open Design system is an input to judgment, never the authority. The two skills share the real-UI loop in `sk-design-interface/references/design-process/real_ui_loop.md`, and this skill's Open Design transport for that loop lives in `references/design_parity_transport.md`.

---

## 2. HOW IT WORKS

### Apply the judgment layer

When grounding a design in an Open Design system, or on any read or run that feeds a design decision, the agent MUST load `sk-design-interface`'s design principles first and run ground then token-system then critique before deciding — there is no design output without it. The Open Design read supplies the raw material: a system's `DESIGN.md`, its `tokens.css`, and its `components.html`. The design skill decides what to keep, adapt, and reject against its quality floor and anti-default critique. A design step composed without `sk-design-interface` loaded is blocked, not merely flagged.

### Reuse before generate, and the guardrails that survive

Reuse before generating: prefer one resolved system's tokens and components, and author net-new only when nothing fits. Reuse happens at build time in the target app, never by caching Open Design files into a repo. Several guardrails must survive the integration. There is no style chooser, so the roughly 150 Open Design systems are never surfaced as a pick-a-vibe menu. At most one system is resolved from the subject and brief. `sk-design-interface` only reads Open Design through this skill and never generates into it. The integration is mandatory, not optional: any read or run that feeds a design decision MUST load `sk-design-interface` first (a hard precondition), and the loop depends on this skill being wired first. Only pure transport — wiring, or a bare inventory that feeds no design decision — is exempt.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design_parity_transport.md` | This skill | The Open Design transport mechanics for the real-UI loop |
| `../sk-design-interface/references/design-process/real_ui_loop.md` | Shared | The real-UI loop (ground, reuse-before-generate, fidelity, handoff) it serves |
| `references/tool_surface.md` | Shared | The read tools that feed grounding |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--reading/read-design-system.md` | Manual playbook | Reading a system as the grounding input |

---

## 4. SOURCE METADATA

- Group: Design-System Grounding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--grounding/design-system-grounding.md`

Related references:
- [read-only-content.md](../02--reading/read-only-content.md) covers the read that supplies the grounding input
- [headless-runs.md](../04--runs/headless-runs.md) covers when a grounded decision drives a run
