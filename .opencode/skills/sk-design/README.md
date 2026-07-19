---
title: "sk-design"
description: "The single advisor-routable design skill: a hub that routes to five design modes (interface, foundations, motion, audit, md-generator) plus a nested Open Design transport packet."
trigger_phrases:
  - "design skill"
  - "ui design interface foundations motion audit"
  - "design system tokens accessibility"
version: 1.2.1.0
---

# sk-design

> Make a UI look custom and intentional instead of templated, across direction, system, motion, audit and CSS extraction.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Distinctive UI design and the full design surface: visual direction, design systems, motion, quality audit and live-site CSS extraction. |
| **Invoke with** | `Skill(sk-design)`, the `/design:*` commands or the `design` agent. |
| **Works on** | A design request, an existing interface or a live URL to extract from. |
| **Produces** | Design direction and tokens, motion specs, an audit with scores or a Style Reference DESIGN.md. |

---

## 2. OVERVIEW

### Why This Skill Exists

Most generated UI looks templated: default palettes, default spacing, default component shapes. Good design judgment is a different skill from writing the markup, and folding it into a code skill produces safe, generic output. sk-design keeps the design judgment separate and routes each kind of design work to a focused mode.

### What It Does

`Skill(sk-design)` loads the hub, and the hub routes the request to one of five design modes or a nested transport packet through `mode-registry.json`. Each holds its own logic and the hub itself is routing-only. Inside a selected mode, private procedure cards can shape context loading, proof, and fallback behavior, but users still choose from the same five public design modes. sk-design owns the taste and the system. It hands the actual build to `sk-code` and uses `design-mcp-open-design` (nested) or `mcp-figma` (external sibling) only as transport.

---

## 3. QUICK START

**Step 1: Invoke it.** Let the advisor route a design request, run a `/design:*` command, or read `SKILL.md`.

**Step 2: Run a mode.** For example, a visual-system pass:

```bash
/design:foundations
```

The hub resolves the request to the `design-foundations` mode and applies it.

**Step 3: Hand off the build.** Take the design decisions to `sk-code` for the implementation.

---

## 4. HOW IT WORKS

A design request resolves through the hub to one mode when a single design axis dominates, to an ordered bundle of modes when the request clearly spans separate axes (for example, interface + foundations), or stays at the hub for disambiguation when the intent is unclear or contradictory. The five design modes:

| Mode | Owns |
|---|---|
| `design-interface` | Visual direction, taste and the brainstorm-to-build loop for a distinctive interface. |
| `design-foundations` | The static visual system: color and OKLCH, typography, layout, spacing and design tokens. |
| `design-motion` | Animation, transitions, micro-interactions and reduced-motion behavior. |
| `design-audit` | Design QA: accessibility, performance, responsive, anti-slop and quality scoring. |
| `design-md-generator` | Extraction of a live site's real CSS into a Style Reference DESIGN.md. |

### One advisor identity

The mode packets carry no `graph-metadata.json` of their own, so the advisor discovers exactly one design skill. The shared baselines under `shared/` (anti-slop principles, cognitive laws and the design-token vocabulary) load for every mode.

### Private procedure support

Mode packets may cite private procedure cards after the public mode is selected. These cards are maintainer-facing support for context capture, proof expectations and direct fallback execution. They are not a public taxonomy and should not be presented as user-selectable routes. The four advisory modes remain Read/Glob/Grep-only. `design-md-generator` remains the only mutating mode and keeps its Playwright extraction backend boundary.

The hub manager shell is defined in `SKILL.md` Section 2. Read `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work` and `Proof Gates and Verifier Cadence` there before changing routing behavior. Transport boundaries live in `SKILL.md` Section 7, where `mcp-figma` and `design-mcp-open-design` are named as transports while `sk-design` owns taste and acceptance.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-design when output looks generic and needs taste, when a visual system or motion language needs designing, when a UI needs an accessibility and anti-slop audit or when a live site's design system needs extracting. For the implementation itself, use `sk-code`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Builds what sk-design designs. sk-design decides taste and sk-code writes the code. |
| `design-mcp-open-design` | Nested transport packet for Open Design. It never decides taste, so it co-loads this hub's own workflow modes. |
| `mcp-figma` | The external sibling Figma transport. |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic. |
| [`mode-registry.json`](./mode-registry.json) | The mode-to-packet routing map. |
| [`benchmark/`](./benchmark/) | Frozen baseline and after-009 skill-benchmark reports for router trace scoring. |
| [`manual-testing-playbook/`](./manual-testing-playbook/manual-testing-playbook.md) | Eight-category, 37-scenario hub playbook covering mode routing (including the nested transport packet), advisor integration, transform verbs, md-generator, shared references, parity behavior, fallback/resilience, and hub manager intake. |
| [`shared/procedures/polish-gate-orchestration.md`](./shared/procedures/polish-gate-orchestration.md) | Shared maintainer-facing procedure card for polish-gate orchestration across modes. |
| [`design-interface/SKILL.md`](./design-interface/SKILL.md) | An example mode packet. |
| [`changelog/v1.2.0.0.md`](./changelog/v1.2.0.0.md) | Maintainer note for the mode-local procedure operating model. |
