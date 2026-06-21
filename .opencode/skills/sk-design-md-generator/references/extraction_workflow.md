---
title: "Extraction Workflow"
description: "Operational guide for running the extraction pipeline: invocation, output paths, the verbatim-value rule, and handoff to sibling design skills."
trigger_phrases:
  - "run design extraction"
  - "extract design tokens from url"
  - "generate design.md workflow"
  - "tokens.json output path"
  - "design extraction handoff"
importance_tier: "high"
contextType: "implementation"
---

# Extraction Workflow

Operational guide for running the three-phase pipeline in this framework and handing its output to sibling design skills.

---

## 1. OVERVIEW

### Purpose

Cover how the embedded `tool/` runs here: the exact invocations, where output lands, the rule that makes the output trustworthy, and who consumes it. The deep format and voice rules live in `tool/resources/`; this doc is the operating layer above them.

### Core Principle

A `DESIGN.md` is only useful because it is hallucination-proof. That property holds only if every value traces back to `tokens.json` - validate before trusting.

### When to Use

- Running a full extraction (URL to validated `DESIGN.md`).
- Deciding crawl depth, interaction capture, or output paths.
- Handing a finished `DESIGN.md` to `sk-code` or `sk-design-interface`.

---

## 2. THE THREE PHASES

You MUST complete each phase before proceeding to the next; VALIDATE and REPORT can also run standalone on an existing pair.

#### Phase 1: EXTRACT

**Actions**:
1. `cd tool && npx ts-node scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output`
2. Playwright crawls five viewports and writes `<--output>/tokens.json` plus screenshots and an extraction report.
3. `--fast` means 5 pages at 8 concurrency; drop it (or set `--max-pages 10`) for a deeper crawl; add `--with-interaction` to capture hover/focus/active states.

**Validation**: `tokens_emitted`

#### Phase 2: WRITE

**Actions**:
1. Read `tool/resources/design_md_format.md` and `tool/resources/writing_style_guide.md`.
2. Compose the 17-section `DESIGN.md`, copying every hex, pixel, font-weight, shadow, and radius verbatim from `tokens.json`.
3. 6-digit lowercase hex only. L1+L2 tokens in main sections, L3 marked "Subject to change", L4 excluded.

**Validation**: `design_md_written`

#### Phase 3: VALIDATE

**Actions**:
1. `npx ts-node scripts/validate.ts <DESIGN.md> <--output>/tokens.json`
2. Resolve every hex mismatch and missing section before claiming completion.
3. Optional visual artifacts: `proof.ts <url> <tokens.json>`, `report-gen.ts <tokens.json> <dir> <DESIGN.md>`, `preview-gen.ts <tokens.json> <dir>`.

**Validation**: `fidelity_confirmed`

---

## 3. STABILITY CLASSES

`tool/scripts/cluster.ts` tags each token L1-L4 by how stable it is. The class governs whether the token reaches `DESIGN.md`.

| Class | Name | Meaning | In DESIGN.md? |
|-------|------|---------|---------------|
| L1 | Permanent | Brand identity (logo colours, brand typeface, core radii) | Main sections |
| L2 | System | Design-system tokens (semantic colours, spacing scale) | Main sections |
| L3 | Campaign | Temporary (seasonal accents, hero gradients) | With "Subject to change" |
| L4 | Content | Image-derived, one-off | Excluded |

Boundary tokens take the higher (more restrictive) class.

---

## 4. HANDOFF

| To | Contract |
|----|----------|
| `sk-code` | The `DESIGN.md` is the implementation contract - source of truth for colours, type, spacing, shadows, radii |
| `sk-design-interface` | When the captured system feeds *new* distinctive direction, that skill owns the taste and anti-default judgment; this skill supplies ground truth |
| `mcp-figma` / `mcp-open-design` | Those transports cover Figma files and Open Design projects; this skill covers live URLs |
