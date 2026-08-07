---
title: "sk-design"
description: "Makes generated UI look custom and intentional instead of templated: visual direction, design systems, motion and live-site style extraction, decided by one advisor-routable skill and handed to sk-code to build."
trigger_phrases:
  - "design skill"
  - "ui design interface motion md-generator"
  - "design system tokens accessibility"
version: 1.7.0.0
---

# sk-design

> Make a UI look custom and intentional instead of templated: visual direction, design systems, motion and live-site CSS extraction, all decided before the build starts.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Distinctive UI design and the full design surface: visual direction, design systems, motion and live-site CSS extraction |
| **Invoke with** | `Skill(sk-design)`, the canonical `/interface:*` creation commands or the `design` agent |
| **Works on** | A design request, an existing interface or a live URL to extract from |
| **Produces** | Design direction, design tokens, motion specs or a Style Reference DESIGN.md |

---

## 2. OVERVIEW

### Why This Skill Exists

Most generated UI looks templated: default palettes, default spacing, default component shapes. A developer who wants a distinctive result rarely gets one from a code skill, because good design judgment is a different skill from writing the markup. Folding that judgment into a code skill produces safe and generic output. sk-design keeps the design judgment separate, so the taste decisions happen in a dedicated pass before any build work starts.

### What It Does

`Skill(sk-design)` loads the hub. The hub routes each request to one of two design modes or to a nested transport packet through `mode-registry.json`. The hub itself is routing-only and each mode holds its own logic. Two canonical `/interface:*` creation commands resolve to the same two public mode IDs through one shared nine-stage creation contract. sk-design owns the taste and the system. It hands the actual build to `sk-code`. `design-mcp-open-design` (nested) or `mcp-figma` (external sibling) act only as transport.

---

## 3. QUICK START

**Step 1: Invoke it.** Let the advisor route a design request, run a canonical `/interface:*` command or read `SKILL.md`.

**Step 2: Run a mode.** For an interface direction pass:

```bash
/interface:design
```

The hub resolves the request to the `design-interface` mode and applies it. Success looks like a resolved design direction with tokens, motion behavior and pre-delivery gate results, ready for the build. Motion choreography (animation, transitions, micro-interactions, reduced motion) is one of `design-interface`'s internal task lanes, not a separate command.

**Step 3: Hand off the build.** Take the design decisions to `sk-code` for the implementation.

---

## 4. HOW IT WORKS

A design request resolves through the hub to one mode when a single design axis dominates. It resolves to an ordered bundle of modes when the request clearly spans separate axes, for example interface plus md-generator. It stays at the hub for disambiguation when the intent is unclear or contradictory. The two design modes:

| Mode | Owns |
|---|---|
| `design-interface` | Visual direction, taste and the brainstorm-to-build loop for a distinctive interface. The static visual system: color and OKLCH, typography, layout, spacing and design tokens. The temporal or motion layer: animation, transitions, micro-interactions and reduced-motion behavior. The anti-slop / accessibility / production-hardening pre-delivery gate. |
| `design-md-generator` | Extraction of a live site's real CSS into a Style Reference DESIGN.md through the Playwright backend |

### Creation Commands

The canonical creation surface maps `/interface:{design,design-reference}` to the stable `interface` and `md-generator` modes. Both commands share [`shared/creation-contract.md`](./shared/creation-contract.md). The retired surface covers `/interface:foundations`, `/interface:audit`, `/interface:motion` and the former `/design:*` alias namespace, all with no alias or transition period. `/interface:*` is the sole creation surface.

### Style Retrieval Backend

Style-library retrieval can run through the `legacy`, `shadow` or `persistent` adapter in `styles/lib/engine/`. It defaults to `legacy`, so the flat files remain authoritative. The opt-in persistent backend under `styles/lib/database/` uses SQLite and FTS5 with a rebuildable vector projection, an incremental `DISCOVER` through `PUBLISH` indexer and eligibility-first weighted-RRF retrieval.

### One Advisor Identity

The mode packets carry no `graph-metadata.json` of their own, so the advisor discovers exactly one design skill. The shared baselines under `shared/` (anti-slop principles, cognitive laws and the design-token vocabulary) load for every mode.

### Private Procedure Cards

Mode packets may cite private procedure cards after the public mode is selected. These cards are maintainer-facing support for context capture, proof expectations and direct fallback execution. They are not a public taxonomy and should not be presented as user-selectable routes. The advisory `interface` mode remains Read/Glob/Grep-only. `design-md-generator` remains the only mutating mode and keeps its Playwright extraction backend boundary.

The hub manager shell is defined in `SKILL.md` Section 2. Read `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work` and `Proof Gates and Verifier Cadence` there before changing routing behavior. Transport boundaries live in `SKILL.md` Section 7, where `mcp-figma` and `design-mcp-open-design` are named as transports while sk-design owns taste and acceptance.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-design when output looks generic and needs taste, when a visual system or motion language needs designing, when a UI needs an accessibility and anti-slop pre-delivery pass or when a live site's design system needs extracting. For the implementation itself, use `sk-code`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Builds what sk-design designs. sk-design decides taste and sk-code writes the code |
| `design-mcp-open-design` | Nested transport packet for Open Design. It never decides taste, so it co-loads this hub's own workflow modes |
| `mcp-figma` | The external sibling Figma transport |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/README.md --type readme` reports zero issues |
| Human voice | the HVR punctuation grep `rg -n '\x{2014}|\x{3B}|,\s+(and|or)'` on the README body returns zero matches |
| Link state | every relative link in the README resolves on disk |
| Hub behavior | the manual testing playbook covers mode routing, the nested transport packet, advisor integration, transform verbs, md-generator, shared references, parity behavior, fallback and resilience, plus hub manager intake |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`mode-registry.json`](./mode-registry.json) | The mode-to-packet routing map |
| [`shared/creation-contract.md`](./shared/creation-contract.md) | Shared nine-stage lifecycle for the two canonical `/interface:*` creation commands |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory, including the indexed style backend and creation-command surface |
| [`benchmark/`](./benchmark/) | Frozen baseline and after-009 skill-benchmark reports for router trace scoring |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Nine-category, 35-scenario hub playbook covering mode routing, the nested transport packet, advisor integration, transform verbs, md-generator, shared references, parity behavior, fallback and resilience, plus hub manager intake |
| [`shared/procedures/polish-gate-orchestration.md`](./shared/procedures/polish-gate-orchestration.md) | Shared maintainer-facing procedure card for polish-gate orchestration across modes |
| [`sk-design-interface/SKILL.md`](./sk-design-interface/SKILL.md) | An example mode packet |
| [`changelog/v1.2.0.0.md`](./changelog/v1.2.0.0.md) | Maintainer note for the mode-local procedure operating model |
