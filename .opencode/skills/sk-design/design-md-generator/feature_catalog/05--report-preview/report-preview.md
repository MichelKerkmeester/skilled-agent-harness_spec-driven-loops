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
version: 1.0.0.7
---

# Report and preview (report-gen.ts / preview-gen.ts / proof.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Renders visual artifacts from a validated DESIGN.md + tokens.json pair. Three scripts cover distinct review needs: a token-to-section HTML report for provenance auditing, a CSS visual preview that renders the design system as styled HTML, and a fidelity proof that compares live extraction against the token set. These outputs serve human review, team handoff, and stakeholder sign-off. All three scripts take `tokens.json` as their first argument and write to an output directory.

---

## 2. HOW IT WORKS

### HTML report (report-gen.ts)

```bash
npx ts-node scripts/report-gen.ts <--output>/tokens.json <output-dir> <DESIGN.md>
```

Produces an HTML file that maps every token to its DESIGN.md section. The report shows:

- Token provenance: which section of DESIGN.md each token flows into.
- Occurrence counts: how many times each color, spacing value, or shadow appears across the crawled pages.
- Section coverage: which DESIGN.md sections received tokens and which are empty.
- Stability-class distribution: L1 through L4 token counts with gating rationale.

The report is a single HTML file with embedded CSS, designed for browser viewing without a local server.

### Visual preview (preview-gen.ts)

```bash
npx ts-node scripts/preview-gen.ts <--output>/tokens.json <output-dir>
```

Renders the design system as styled HTML: color swatches with hex labels and role names, typography samples at each hierarchy level with actual font-family, size, weight, line-height, and letter-spacing applied, shadow examples rendered as layered boxes, spacing scale visualized as proportional bars, and border radius examples. The preview uses the exact values from `tokens.json` -- every rendered element reflects measured CSS, not approximations.

### Fidelity proof (proof.ts)

```bash
npx ts-node scripts/proof.ts <url> <--output>/tokens.json
```

Takes the original extraction URL and the token set, then produces a proof artifact that compares the live page against the extracted values. This catches changes to the source site between extraction and review. The proof highlights any value that would now extract differently, giving reviewers confidence that the DESIGN.md still represents the live site.

### Output paths

All three scripts resolve their output directory through the shared output-policy module, which requires it to live inside a spec folder or an approved sandbox. They do not silently overwrite existing artifacts: if `report.html`, `preview.html`, `proof.html`, or `proof-data.json` already exists at the target path, the script refuses and exits with an error. Pass `--force` to accept the overwrite explicitly (e.g. `npx ts-node scripts/report-gen.ts <tokens.json> <output-dir> --force`). The HTML report and visual preview are standalone browser-viewable files. The proof artifact is a structured comparison document.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `backend/scripts/report-gen.ts` | Script | Token-to-section HTML report generator |
| `backend/scripts/preview-gen.ts` | Script | Visual CSS preview renderer |
| `backend/scripts/proof.ts` | Script | Fidelity proof artifact generator |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/07--report/report-generation.md` | Manual playbook | Report and preview generation scenario (REPORT-001) — runs report-gen, preview-gen, and proof and confirms each emits its artifact |
| `backend/tests/report-preview-overwrite.test.ts` | Automated test | Overwrite-guard behavior (refuses without `--force`, succeeds with it) and a CSS-value-injection integration check for both report-gen and preview-gen |
| `backend/tests/render-safety.test.ts` | Automated test | Unit coverage for the CSS-value sanitizers (`safeColor`/`safeLength`/`safeShadow`/etc.) both scripts route source-derived style values through |

---

## 4. SOURCE METADATA

- Group: REPORT AND PREVIEW
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--report-preview/report-preview.md`

Related references:
- [validate.md](../04--validate/validate.md) — the validation phase that precedes report generation
- [references/extraction_workflow.md](../../references/extraction_workflow.md) — the full pipeline including report as Phase 4
