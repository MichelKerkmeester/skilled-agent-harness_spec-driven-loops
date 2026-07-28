---
title: sk-design Surface Router — per-intent leaf sets
description: Second-layer (surface) router for the sk-design hub. hub-router.json selects the workflow mode; this doc maps a request's design intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "sk-design smart routing"
  - "design surface resource map"
  - "design mode leaf routing"
  - "design intent resource map"
importance_tier: important
contextType: general
version: 1.1.0.0
---

# sk-design Surface Router — per-intent leaf sets

Maps a request's design intent to the packet-local leaf resources the selected `sk-design` mode should load.

---

## 1. OVERVIEW

This is sk-design's second-layer (surface) router. The hub selects a workflow
mode in [`hub-router.json`](../../hub-router.json) (`interface` /
`md-generator` / `design-mcp-open-design`); this doc maps a
request's design intent to the exact packet-local leaf resources that mode should
load. Every path is packet-qualified (`design-<mode>/references|assets/…`) and
converts to the canonical `(workflowMode, leafResourceId)` pair at the one
contract boundary
(`sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`), where the packet
segment (`design-interface`, …) resolves to its declared `workflowMode`
(`interface`, …).
Routing is two stages: the hub picks the WORKFLOW MODE (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub router
only emits a mode's `SKILL.md` pointer, never leaf paths, and this router never
re-decides the mode.
---

## 2. INTENT MODEL

- **interface leaves** — distinctive-UI direction and the static visual system:
  the design-process spine (`design_principles`, `brief_to_dials`), the OKLCH
  color workflow, palette theming, typography system, responsive layout, the
  token starter, and the interface preflight card (the anti-slop, accessibility,
  and production-hardening pre-delivery gate). Also includes the temporal/motion
  layer relocated in whole from the retired `motion` mode: the restraint gate,
  motion strategy, micro-interactions, and reduced-motion/performance guidance.
  Fired by "make it less generic / distinctive visual direction / hero redesign"
  requests, color/type/spacing/grid/token-system requests, the interface-frame
  transform verbs (`bolder`, `quieter`, `distill`, `delight`, `clarify`),
  critique/WCAG/slop-detection requests, and micro-interaction/transition/
  hover-state/reduced-motion requests.
- **md-generator leaves** — Style Reference DESIGN.md extraction and validation:
  the format spec, extraction workflow, taxonomies, quality checklist, and the
  authoring cards. Fired by "extract the design system / DESIGN.md / validate
  design.md / design fidelity" requests.
- **open-design leaves** — the transport packet's wiring and CLI reference. Fired
  by "wire Open Design / od cli / od mcp" requests; the transport never decides
  taste, so a design-bearing Open Design request pairs a judgment mode first.

A single dominant design axis routes to one mode's leaf set; two clearly separate
axes (e.g. an explicit interface + md-generator UI build grounded in measured
CSS) route to both.

---

## 3. MACHINE-READABLE ROUTER (REPLAY / BENCHMARK SOURCE)

The single machine-readable projection of the intent model above. The prose is the
human-facing contract; this block is the byte-for-byte source the deterministic
router-replay parses. Keep them in sync: when a map row changes above, update the
matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path resolves on disk and
is registered in `leaf-manifest.json`, so each dual-reads to a canonical typed pair.

```python
# No always-loaded preamble on the positive leaf axis: the hub's shared/ register
# and anti-slop base are cited by every mode but are not packet leaves, so they are
# not emitted as typed pairs here. Leaf routing loads only the selected mode's set.
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "INTERFACE":     {"weight": 4, "keywords": ["less generic", "distinctive visual", "visual direction", "make it look good", "looks templated", "redesign the ui", "redesign the hero", "hero section", "landing page direction", "interface design", "visual identity", "premium ui", "make it beautiful", "design variations", "distinct visual directions", "variation set", "make it", "bolder", "quieter", "distill", "delight", "clarify", "polished", "feel premium", "oklch", "color token", "color system", "color palette", "typography scale", "typography system", "font pairing", "spacing rhythm", "spacing system", "responsive grid", "layout rhythm", "design tokens", "token system", "theme tokens", "hierarchy and spacing", "spacing rhythm review", "design audit", "audit this", "wcag contrast", "wcag", "accessibility audit", "keyboard focus", "design slop", "anti-slop", "ui critique", "design review", "production hardening", "design quality score", "critique this", "polish gate", "micro-interactions", "micro interactions", "reduced-motion", "reduced motion", "hover micro", "hover state", "menu transition", "transition design", "interaction states", "loading state", "exit animation", "morphing", "motion budget", "choreography", "animate the", "feedback states"]},
    "MD_GENERATOR":  {"weight": 4, "keywords": ["extract the design system", "extract design system", "design.md", "design system from", "style reference", "capture website css", "tokens.json", "design tokens from url", "validate design.md", "design fidelity", "fidelity check", "extraction", "generate a design.md", "measured css"]},
    "OPEN_DESIGN":   {"weight": 4, "keywords": ["wire open design", "open design", "open-design", "od cli", "od mcp", "connect open design", "drive od", "start_run", "open design generation", "open design run"]},
}

RESOURCE_MAP = {
    "INTERFACE": [
        "sk-design-interface/references/design-process/design-principles.md",
        "sk-design-interface/references/design-process/brief-to-dials.md",
        "sk-design-interface/assets/interface-preflight-card.md",
        "sk-design-interface/references/foundations/corpus-map.md",
        "sk-design-interface/references/foundations/color/oklch-workflow.md",
        "sk-design-interface/references/foundations/color/palette-theming.md",
        "sk-design-interface/references/foundations/type/typography-system.md",
        "sk-design-interface/references/foundations/layout/layout-responsive.md",
        "sk-design-interface/assets/foundations/token-starter.md",
        "sk-design-interface/references/motion/corpus-map.md",
        "sk-design-interface/references/motion/animation-decision-framework.md",
        "sk-design-interface/references/motion/micro-interactions.md",
        "sk-design-interface/references/motion/motion-strategy.md",
        "sk-design-interface/references/motion/performance-reduced-motion.md",
        "sk-design-interface/assets/motion/motion-pattern-cards.md",
    ],
    "MD_GENERATOR": [
        "sk-design-md-generator/references/design-md-format.md",
        "sk-design-md-generator/references/writing-style-guide.md",
        "sk-design-md-generator/references/color-role-taxonomy.md",
        "sk-design-md-generator/references/component-taxonomy.md",
        "sk-design-md-generator/references/anti-patterns.md",
        "sk-design-md-generator/references/extraction-workflow.md",
        "sk-design-md-generator/references/troubleshooting.md",
        "sk-design-md-generator/references/quality-checklist.md",
        "sk-design-md-generator/references/authoring-boundary.md",
        "sk-design-md-generator/assets/design-md-prompt-template.md",
        "sk-design-md-generator/assets/cardinal-rules-card.md",
        "sk-design-md-generator/assets/source-of-truth-router-card.md",
    ],
    "OPEN_DESIGN": [
        "sk-design-mcp-open-design/references/mcp-wiring.md",
        "sk-design-mcp-open-design/references/od-cli-reference.md",
        "sk-design-mcp-open-design/references/tool-surface.md",
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant design axis routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair.
- The interface-frame `make it <alias>` transform verb applies the move; `interface`
  owns the alias regardless of the axis it names (direction, tokens, or quality).
- No keyword match is the hub's default (`interface`) or a disambiguation request:
  confirm the dominant design axis before loading anything.
