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

Cover how the embedded `backend/` runs here: the exact invocations, where output lands, the rule that makes the output trustworthy, and who consumes it. The deep format and voice rules live in `references/`; this doc is the operating layer above them.

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
1. `cd backend && npx ts-node scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output`
2. Playwright crawls five viewports and writes `<--output>/tokens.json` plus screenshots and an extraction report.
3. `--fast` means 5 pages at 8 concurrency. Interaction capture (hover/focus/active states) runs by **default**, including under `--fast`; drop `--fast` (or set `--max-pages 10`) for a deeper crawl. To opt out of interaction capture pass `--no-interaction`, or `--fast-no-interaction` for a fast crawl that also skips it (the old `--fast` behavior).
4. Per-page async accessibility is captured alongside the crawl: page language, skip-link presence, tab order, alt-text coverage, and reduced-motion support populate the a11y tokens.

**Validation**: `tokens_emitted`

#### Phase 2: WRITE

**Actions**:
1. Run `npx ts-node scripts/build-write-prompt.ts <--output>/tokens.json` first. It pre-renders §2 Color, §3 Typography, and §6 Depth deterministically from the tokens (via `formatters.ts`) and emits a PRESENT/ABSENT manifest for the data-gated sections.
2. Read `references/design_md_format_v3.md` and `references/writing_style_guide.md`.
3. Paste the pre-rendered §2/§3/§6 tables unchanged; compose the remaining sections, copying every hex, pixel, font-weight, shadow, and radius verbatim from `tokens.json`.
4. Data-driven sections (§0, §6, §6.5, §7, §9, §11, §12) follow the manifest: PRESENT → write from tokens; ABSENT → stamp `_No <X> data was extracted._`, never invent. Interpretive claims cite a token or are labelled `[INFERRED]`.
5. 6-digit lowercase hex only. L1+L2 tokens in main sections, L3 marked "Subject to change", L4 excluded.

**Validation**: `design_md_written`

#### Phase 3: VALIDATE

**Actions**:
1. `npx ts-node scripts/validate.ts <DESIGN.md> <--output>/tokens.json`
2. Resolve every hex mismatch and missing section before claiming completion.
3. Optional visual artifacts: `proof.ts <url> <tokens.json>`, `report-gen.ts <tokens.json> <dir> <DESIGN.md>`, `preview-gen.ts <tokens.json> <dir>`.

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
| `sk-design-interface` | When the captured system feeds *new* distinctive direction, that skill owns the taste and anti-default judgment; this skill supplies ground truth |
| `mcp-figma` / `mcp-open-design` | Those transports cover Figma files and Open Design projects; this skill covers live URLs |
