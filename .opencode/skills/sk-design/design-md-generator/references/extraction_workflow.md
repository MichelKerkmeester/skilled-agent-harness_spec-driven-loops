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
contextType: implementation
version: 1.0.0.7
---

# Extraction Workflow

Operational guide for running the three-phase pipeline in this framework and handing its output to sibling design skills.

---

## 1. OVERVIEW

### Purpose

Cover how the embedded `backend/` runs here: the exact invocations, where output lands, the rule that makes the output trustworthy, and who consumes it. The deep format and voice rules live in `references/`; this doc is the operating layer above them.

### Core Principle

A `DESIGN.md` is only useful because it is hallucination-proof. That property holds only if every value traces back to `tokens.json` - validate before trusting.

### When to Use

- Running a full extraction (URL to validated `DESIGN.md`).
- Deciding crawl depth, interaction capture, or output paths.
- Handing a finished `DESIGN.md` to `sk-code` or `interface`.

---

## 2. THE THREE PHASES

You MUST complete each phase before proceeding to the next; VALIDATE and REPORT can also run standalone on an existing pair.

#### Phase 1: EXTRACT

**Actions**:
1. Run from the **repo root** (a one-time `cd .opencode/skills/sk-design/design-md-generator/backend && npm install && npx playwright install chromium` handles setup): `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output`. `extract.ts` refuses any `--output` that resolves inside the skill, so the relative spec-folder path must resolve from the repo root.
2. Playwright crawls five viewports and writes `<--output>/tokens.json` plus screenshots and an extraction report.
3. `--fast` means 5 pages at 8 concurrency. Interaction capture (hover/focus/active states) runs by **default**, including under `--fast`; drop `--fast` (or set `--max-pages 10`) for a deeper crawl. To opt out of interaction capture pass `--no-interaction`, or `--fast-no-interaction` for a fast crawl that also skips it (the old `--fast` behavior).
4. Per-page async accessibility is captured alongside the crawl: page language, skip-link presence, tab order, alt-text coverage, and reduced-motion support populate the a11y tokens.

**Validation**: `tokens_emitted`

#### Phase 2: WRITE

**Actions**:
1. Run `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts <--output>/tokens.json` first. It pre-renders the value-bearing token sections — Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, and the Quick Start CSS + Tailwind — deterministically from the tokens (via `formatters-v3.ts`), and emits a FACTS block of locked values (type scale, shadow/gradient counts, dark-mode/motion/icon/focus state) for the prose phase.
2. Read `references/design_md_format.md` and `references/writing_style_guide.md`.
3. Paste the pre-rendered value sections unchanged; author the prose sections (intro, Tokens — Typography, Components, Do's and Don'ts, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands), taking every hex, pixel, font-weight, shadow, and radius from a pre-rendered section or the FACTS block — never by hand.
4. Conditional sections follow the FACTS: when the data is present, write from it; when it is absent (e.g. no dark palette, zero shadows, no motion), state the absence honestly rather than inventing. Interpretive claims cite a token or are labelled `[INFERRED]`.
5. 6-digit lowercase hex only. L1+L2 tokens in main sections, L3 marked "Subject to change", L4 excluded.

**Validation**: `design_md_written`

#### Phase 3: VALIDATE

**Actions**:
1. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts <DESIGN.md> <--output>/tokens.json` (from the repo root).
2. Resolve every hex mismatch and missing section before claiming completion.
3. Optional visual artifacts (also from the repo root, full script path): `proof.ts <url> <tokens.json>`, `report-gen.ts <tokens.json> <dir> <DESIGN.md>`, `preview-gen.ts <tokens.json> <dir>`.

**Validation**: `fidelity_confirmed`

---

## 3. STABILITY CLASSES

`backend/scripts/cluster.ts` tags each token L1-L4 by how stable it is. The class governs whether the token reaches `DESIGN.md`.

| Class | Name | Meaning | In DESIGN.md? |
|-------|------|---------|---------------|
| L1 | Permanent | Brand identity (logo colours, brand typeface, core radii) | Main sections |
| L2 | System | Design-system tokens (semantic colours, spacing scale) | Main sections |
| L3 | Campaign | Temporary (seasonal accents, hero gradients) | With "Subject to change" |
| L4 | Content | Image-derived, one-off | Excluded |

Boundary tokens take the higher (more restrictive) class.

**Coverage-election pre-gate.** A colour seen on fewer than 30% of crawled pages is capped at L3 (campaign) even when its raw frequency would otherwise elect it to L1/L2. A site-wide system colour has to appear across the crawl, not concentrate on a single page.

---

## 4. HANDOFF

| To | Contract |
|----|----------|
| `sk-code` | The `DESIGN.md` is the implementation contract - source of truth for colours, type, spacing, shadows, radii |
| `interface` | When the captured system feeds *new* distinctive direction, that skill owns the taste and anti-default judgment; this skill supplies ground truth |
| `mcp-figma` / `mcp-open-design` | Those transports cover Figma files and Open Design projects; this skill covers live URLs |
