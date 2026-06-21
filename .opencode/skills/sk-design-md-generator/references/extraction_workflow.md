---
title: "Extraction Workflow"
description: "Operational guide for running the design-md-generator pipeline in this framework: invocation, output paths, the verbatim-value rule, and handoff to sibling design skills."
trigger_phrases:
  - "run design extraction"
  - "extract design tokens from url"
  - "generate DESIGN.md workflow"
  - "tokens.json output path"
  - "design extraction handoff"
importance_tier: "high"
contextType: "implementation"
---

# Extraction Workflow

The framework-specific operating guide for the vendored `tool/`. Deep format and voice rules live in `tool/resources/`; this doc covers how the pipeline runs here and how it hands off.

## The three phases

1. **EXTRACT** — `cd tool && npx ts-node scripts/extract.ts <url> --fast`. Playwright crawls five viewports and writes `output/<domain>/tokens.json` plus screenshots and an extraction report. `--fast` means 5 pages at 8 concurrency; drop it (or set `--max-pages 10`) for a deeper crawl; add `--with-interaction` to capture hover/focus/active states.
2. **WRITE** — read `tool/resources/design-md-format.md` and `tool/resources/writing-style-guide.md`, then compose the 17-section `DESIGN.md`. Every hex, pixel, font-weight, shadow, and radius is copied verbatim from `tokens.json`. 6-digit lowercase hex only. L1+L2 tokens in main sections, L3 marked "Subject to change", L4 excluded.
3. **VALIDATE** — `npx ts-node scripts/validate.ts <DESIGN.md> output/<domain>/tokens.json`. Resolve every hex mismatch and missing section before claiming completion. Optional visual artifacts: `proof.ts <url> <tokens.json>`, `report-gen.ts <tokens.json> <dir> <DESIGN.md>`, `preview-gen.ts <tokens.json> <dir>`.

## The cardinal rule (why this skill exists)

A `DESIGN.md` is only useful because it is hallucination-proof: an agent can build against it without guessing. That property holds **only** if every value traces back to `tokens.json`. The moment a value is estimated, rounded, or invented, the document becomes a guess like any other. Validate before trusting.

## Stability classes

`tool/scripts/cluster.ts` tags each token L1-L4 by how stable it is. L1 (brand) and L2 (system) are the durable design system and belong in the main sections. L3 (campaign — seasonal accents, hero gradients) is real but temporary, so it is annotated "Subject to change". L4 (content — image-derived, one-off) is noise and is excluded.

## Handoff

- To **`sk-code`**: the `DESIGN.md` is the implementation contract — the source of truth for colours, type, spacing, shadows, radii.
- To **`sk-design-interface`**: when the captured system feeds *new* distinctive direction, that skill owns the taste and anti-default judgment; this skill only supplies ground truth.
- From **`mcp-figma` / `mcp-open-design`**: those transports cover Figma files and Open Design projects; this skill covers live URLs.
