---
title: "Report and preview"
description: "Generate HTML reports, visual previews, and proof artifacts from a DESIGN.md + tokens.json pair for human review and team handoff."
trigger_phrases:
  - "generate visual report"
  - "design md html preview"
  - "report-gen.ts tokens.json"
  - "visual design preview"
  - "fidelity proof artifact"
importance_tier: "normal"
---

# Report and preview (report-gen.ts / preview-gen.ts / proof.ts)

## 1. OVERVIEW

Renders visual artifacts from a validated DESIGN.md + tokens.json pair. Three scripts cover distinct review needs: a token-to-section HTML report for provenance auditing, a CSS visual preview that renders the design system as styled HTML, and a fidelity proof that compares live extraction against the token set. These outputs serve human review, team handoff, and stakeholder sign-off. All three scripts take `tokens.json` as their first argument and write to an output directory.

---

## 2. HOW IT WORKS

### HTML report (report-gen.ts)

```bash
npx ts-node scripts/report-gen.ts output/<domain>/tokens.json <output-dir> <DESIGN.md>
```

Produces an HTML file that maps every token to its DESIGN.md section. The report shows:

- Token provenance: which section of DESIGN.md each token flows into.
- Occurrence counts: how many times each color, spacing value, or shadow appears across the crawled pages.
- Section coverage: which DESIGN.md sections received tokens and which are empty.
- Stability-class distribution: L1 through L4 token counts with gating rationale.

The report is a single HTML file with embedded CSS, designed for browser viewing without a local server.

### Visual preview (preview-gen.ts)

```bash
npx ts-node scripts/preview-gen.ts output/<domain>/tokens.json <output-dir>
```

Renders the design system as styled HTML: color swatches with hex labels and role names, typography samples at each hierarchy level with actual font-family, size, weight, line-height, and letter-spacing applied, shadow examples rendered as layered boxes, spacing scale visualized as proportional bars, and border radius examples. The preview uses the exact values from `tokens.json` -- every rendered element reflects measured CSS, not approximations.

### Fidelity proof (proof.ts)

```bash
npx ts-node scripts/proof.ts <url> output/<domain>/tokens.json
```

Takes the original extraction URL and the token set, then produces a proof artifact that compares the live page against the extracted values. This catches changes to the source site between extraction and review. The proof highlights any value that would now extract differently, giving reviewers confidence that the DESIGN.md still represents the live site.

### Output paths

All three scripts write to a user-specified output directory. They do not silently overwrite existing artifacts; specify a clean directory or accept the overwrite explicitly. The HTML report and visual preview are standalone browser-viewable files. The proof artifact is a structured comparison document.

---

## 3. SOURCE FILES

- `tool/scripts/report-gen.ts` -- token-to-section HTML report generator
- `tool/scripts/preview-gen.ts` -- visual CSS preview renderer
- `tool/scripts/proof.ts` -- fidelity proof artifact generator

---

## 4. SOURCE METADATA

- Group: sk-design-md-generator
- Catalog source: `feature_catalog.md`
- Feature file: `05--report-preview/report-preview.md`

Related references:
- [validate.md](../04--validate/validate.md) -- the validation phase that precedes report generation
- [references/extraction_workflow.md](../../references/extraction_workflow.md) -- the full pipeline including report as Phase 4
