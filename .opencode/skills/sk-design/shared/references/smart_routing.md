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
version: 1.0.0.0
---

# sk-design Surface Router — per-intent leaf sets

This is sk-design's second-layer (surface) router. The hub selects a workflow
mode in [`hub-router.json`](../../hub-router.json) (`interface` / `foundations` /
`motion` / `audit` / `md-generator` / `design-mcp-open-design`); this doc maps a
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

## 1. INTENT MODEL

- **interface leaves** — distinctive-UI direction: the design-process spine
  (`design_principles`, `brief_to_dials`) plus the interface preflight card. Broad
  "make it less generic / distinctive visual direction / hero redesign" requests,
  plus the interface-frame transform verbs (`bolder`, `quieter`, `distill`,
  `delight`, `clarify`).
- **foundations leaves** — the static visual system: OKLCH color workflow, palette
  theming, typography system, responsive layout, and the token starter. Fired by
  color/type/spacing/grid/token-system requests.
- **motion leaves** — animation and interaction feel: the decision framework,
  micro-interactions, and reduced-motion/performance guidance. Fired by
  micro-interaction, transition, hover-state, and reduced-motion requests.
- **audit leaves** — design QA: the audit contract, accessibility/performance,
  production anti-patterns, and the report template. Fired by audit / critique /
  WCAG / slop-detection requests and the audit-frame `should it be` transform verb.
- **md-generator leaves** — Style Reference DESIGN.md extraction and validation:
  the format spec, extraction workflow, taxonomies, quality checklist, and the
  authoring cards. Fired by "extract the design system / DESIGN.md / validate
  design.md / design fidelity" requests.
- **open-design leaves** — the transport packet's wiring and CLI reference. Fired
  by "wire Open Design / od cli / od mcp" requests; the transport never decides
  taste, so a design-bearing Open Design request pairs a judgment mode first.

A single dominant design axis routes to one mode's leaf set; two clearly separate
axes (e.g. an explicit interface + foundations UI build) route to both.

---

## 2. MACHINE-READABLE ROUTER (replay / benchmark source)

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
    "INTERFACE":     {"weight": 4, "keywords": ["less generic", "distinctive visual", "visual direction", "make it look good", "looks templated", "redesign the ui", "redesign the hero", "hero section", "landing page direction", "interface design", "visual identity", "premium ui", "make it beautiful", "design variations", "distinct visual directions", "variation set", "make it", "bolder", "quieter", "distill", "delight", "clarify", "polished", "feel premium"]},
    "FOUNDATIONS":   {"weight": 4, "keywords": ["oklch", "color token", "color system", "color palette", "typography scale", "typography system", "font pairing", "spacing rhythm", "spacing system", "responsive grid", "layout rhythm", "design tokens", "token system", "theme tokens", "hierarchy and spacing", "spacing rhythm review"]},
    "MOTION":        {"weight": 4, "keywords": ["micro-interactions", "micro interactions", "reduced-motion", "reduced motion", "hover micro", "hover state", "menu transition", "transition design", "interaction states", "loading state", "exit animation", "morphing", "motion budget", "choreography", "animate the", "feedback states"]},
    "AUDIT":         {"weight": 4, "keywords": ["design audit", "audit this", "wcag contrast", "wcag", "accessibility audit", "keyboard focus", "design slop", "anti-slop", "ui critique", "design review", "production hardening", "design quality score", "should it be", "should it be bolder", "should it be quieter", "should it be distill", "should it be clarify", "should it be delight", "critique this", "polish gate"]},
    "MD_GENERATOR":  {"weight": 4, "keywords": ["extract the design system", "extract design system", "design.md", "design system from", "style reference", "capture website css", "tokens.json", "design tokens from url", "validate design.md", "design fidelity", "fidelity check", "extraction", "generate a design.md", "measured css"]},
    "OPEN_DESIGN":   {"weight": 4, "keywords": ["wire open design", "open design", "open-design", "od cli", "od mcp", "connect open design", "drive od", "start_run", "open design generation", "open design run"]},
}

RESOURCE_MAP = {
    "INTERFACE": [
        "design-interface/references/design_process/design_principles.md",
        "design-interface/references/design_process/brief_to_dials.md",
        "design-interface/assets/interface_preflight_card.md",
    ],
    "FOUNDATIONS": [
        "design-foundations/references/corpus_map.md",
        "design-foundations/references/color/oklch_workflow.md",
        "design-foundations/references/color/palette_theming.md",
        "design-foundations/references/type/typography_system.md",
        "design-foundations/references/layout/layout_responsive.md",
        "design-foundations/assets/token_starter.md",
    ],
    "MOTION": [
        "design-motion/references/corpus_map.md",
        "design-motion/references/animation_decision_framework.md",
        "design-motion/references/micro_interactions.md",
        "design-motion/references/motion_strategy.md",
        "design-motion/references/performance_reduced_motion.md",
        "design-motion/assets/motion_pattern_cards.md",
    ],
    "AUDIT": [
        "design-audit/references/corpus_map.md",
        "design-audit/references/audit_contract.md",
        "design-audit/references/accessibility_performance.md",
        "design-audit/references/anti_patterns_production.md",
        "design-audit/references/critique_hardening.md",
        "design-audit/references/transform_remediation.md",
        "design-audit/assets/audit_report_template.md",
    ],
    "MD_GENERATOR": [
        "design-md-generator/references/design_md_format.md",
        "design-md-generator/references/writing_style_guide.md",
        "design-md-generator/references/color_role_taxonomy.md",
        "design-md-generator/references/component_taxonomy.md",
        "design-md-generator/references/anti_patterns.md",
        "design-md-generator/references/extraction_workflow.md",
        "design-md-generator/references/troubleshooting.md",
        "design-md-generator/references/quality_checklist.md",
        "design-md-generator/references/authoring_boundary.md",
        "design-md-generator/assets/design_md_prompt_template.md",
        "design-md-generator/assets/cardinal_rules_card.md",
        "design-md-generator/assets/source_of_truth_router_card.md",
    ],
    "OPEN_DESIGN": [
        "design-mcp-open-design/references/mcp_wiring.md",
        "design-mcp-open-design/references/od_cli_reference.md",
        "design-mcp-open-design/references/tool_surface.md",
    ],
}
```

## 3. How to read this

- One dominant design axis routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair.
- A transform verb splits by framing: interface-frame `make it <alias>` applies the
  move (interface); audit-frame `should it be <alias>` evaluates it (audit).
- No keyword match is the hub's default (`interface`) or a disambiguation request:
  confirm the dominant design axis before loading anything.
