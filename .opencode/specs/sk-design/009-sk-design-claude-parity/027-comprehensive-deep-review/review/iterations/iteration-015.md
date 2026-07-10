# Iteration 015 — Correctness + Security Review

## Dimension

- Correctness
- Security
- Scope: `.opencode/skills/sk-design/design-md-generator/backend/` only, with emphasis on executable pipeline scripts.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28` — severity definitions and evidence requirements loaded before final severity calls.
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:11` — confirmed `P1-001` already covers `preview-gen.ts`, `proof.ts`, and `report-gen.ts` output-boundary bypass; not re-counted.
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:36` — confirmed md-generator backend is the high-risk executable focus and prior prompt/output-boundary context.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:498` — CSS collection and parse/merge flow.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:552` — analyzer returns structured pseudo/media/transition/animation data rather than raw stylesheet bodies.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts:5` — source-derived CSS values are explicitly treated as untrusted style-context input.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts:29` — color values are shape-validated before interpolation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts:34` — lengths are shape-validated before interpolation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts:52` — font families are length/character allowlisted before interpolation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts:89` — shadows are token-validated before interpolation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:20` — HTML escape helper for text/attribute contexts.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:134` — preview-token sanitizer handoff before inline style interpolation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:161` — sanitized preview tokens are used in inline style attributes.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:469` — validation messages are escaped before report insertion.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:482` — color swatch style values use `safeColor`.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:494` — typography style values use `safeFontFamily`, `safeLength`, `safeFontWeight`, and `safeLineHeight`; visible metadata is escaped.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:541` — dark-mode variable rows use safe color rendering and escaped text values.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:622` — generated DESIGN.md preview/content is escaped.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:655` — proof-data lookup remains under `outputDir`.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:664` — standalone report write is still part of existing `P1-001`, not re-filed.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:72` — source-derived preview style values are documented as requiring CSS-shape validation.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:75` — background/text/primary colors use `safeColor`.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:205` — typography styles use safe helpers and escaped metadata.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:259` — standalone preview write is still part of existing `P1-001`, not re-filed.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:16` — scraped prompt data boundary helper reviewed.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:22` — free-form data blocks neutralize backticks and fence content as inert data.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:41` — font families are fenced through `asDataBlock`.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:69` — component sample texts are collected for fenced inert-data handling.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:124` — prompt explicitly classifies extracted values as data, never instructions.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:132` — fact section is the only source for prose values.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:5` — deterministic pre-rendered sections are emitted without AI authorship.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:224` — Quick Start CSS is fenced as a code block.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:270` — extraction resolves output via central policy before writes.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:280` — downstream writes use the resolved absolute output path.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:317` — screenshot writes are rooted under the resolved output path.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:596` — `tokens.json` write is rooted under the resolved output path.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:613` — `raw-data.json` write is rooted under the resolved output path.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:642` — `extraction-report.json` write is rooted under the resolved output path.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:140` — guided-run preflight validates output with central policy.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:200` — guided-run resolves output/design paths before spawning children.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:217` — write-prompt artifact is rooted under resolved output.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:1250` — component variant keys are classified internally, not taken from free-form site text.
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:1325` — report-visible component variant names are restricted to a fixed whitelist or `Variant-N`.
- `.opencode/skills/sk-design/design-md-generator/backend/tests/report-preview-overwrite.test.ts:69` — regression test confirms malicious color strings are not emitted raw into report style attributes.
- Grep scan: `.opencode/skills/sk-design/design-md-generator/backend/scripts/**/*.ts` write calls found only `extract.ts`, `guided-run.ts`, `preview-gen.ts`, `proof.ts`, and `report-gen.ts`.

## Findings by Severity

### P0

- None.

### P1

- None new in this iteration.
- Existing `P1-001` remains active for standalone artifact writers named in the registry. This pass did not re-count it. The adjacent write scan found no additional backend script files beyond `extract.ts`, `guided-run.ts`, `preview-gen.ts`, `proof.ts`, and `report-gen.ts`; `extract.ts` and `guided-run.ts` root their writes through `resolveOutputPath` before writing.

### P2

- None.

## Traceability Checks

- `spec_code`: PASS. Reviewed executable backend code paths directly; no implementation files were modified.
- `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not update checklist completion state.
- `skill_agent`: PASS. `@deep-review` LEAF constraints followed; no sub-agents dispatched.
- `agent_cross_runtime`: N/A. Backend scripts were reviewed directly; no runtime agent definitions were in scope.
- `feature_catalog_code`: N/A for this iteration's correctness/security backend-only scope; non-backend catalog surfaces are assigned to sibling iteration 17.
- `playbook_capability`: N/A for this iteration's correctness/security backend-only scope; manual testing playbook surfaces are assigned to sibling iteration 17.

## Verdict

PASS. No new P0/P1/P2 findings were confirmed in this assigned backend correctness/security pass. CSS-context injection appears mitigated by explicit style-context allowlists plus escaping and a regression test; prompt-data isolation fences free-form scraped text and neutralizes backticks; adjacent artifact writes outside the existing `P1-001` files are rooted through validated output paths.

## Next Dimension

Iteration 16 should continue with backend traceability/maintainability/sk-doc dimensions without re-counting this correctness/security pass. Wave-level registry updates should merge after iterations 14-17 complete to avoid concurrent writes.

Review verdict: PASS
