# Iteration 3: Template-Rendering-Correctness

## Focus
Verify inline-gate-renderer.ts batch mode, template-utils.sh scaffolding, create.sh integration, manifest sectionGates rendering, and the .sh wrapper. Files: inline-gate-renderer.ts, inline-gate-renderer.sh, template-utils.sh, create.sh, template-structure.js, spec-kit-docs.json.

## Scorecard
- Dimensions covered: template-rendering-correctness
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

Severity-weighted: new P1 × 5.0 + new P2 × 1.0 = 6.0. Total weighted = 6.0. Ratio = 1.0.

## Findings

### P1 — Required

- **F008**: `copy_templates_batch()` silently returns 0 when no templates found
  - `scripts/lib/template-utils.sh:143-145` — When `template_paths` array is empty (no docs to render), `copy_templates_batch` returns 0 silently. This is technically correct (nothing to copy = success) but callers (like `create.sh`) expect at least one file to be created. If the level contract returns an empty doc list, the scaffold would succeed without creating any files — a silent no-op.
  - Evidence: Lines 143-145: `if [[ ${#template_paths[@]} -eq 0 ]]; then return 0; fi`. No warning when 0 templates processed.
  - Recommendation: Add a warning or make callers validate that at least one template was copied after the batch call returns.

### P2 — Suggestion

- **F009**: `inline-gate-renderer.ts` --out-dir mode uses `filePath.split('/').pop()` which doesn't handle Windows paths
  - `scripts/templates/inline-gate-renderer.ts:288-289` — `filePath.split('/').pop()!.replace(/\.tmpl$/, '')`. While this project runs on macOS/Linux, using `path.basename()` from Node would be more robust and platform-independent.
  - Recommendation: Replace with `path.basename(filePath).replace(/\.tmpl$/, '')`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | Batch mode, template utils, create.sh all integrate correctly | Verified |

## Assessment
- The inline-gate-renderer .sh wrapper (14 lines) correctly delegates via `exec node --import "$LOADER" "$RENDERER" "$@"`. The LOADER resolves to `tsx/dist/loader.mjs` and RENDERER to the .ts file. This ensures shell callers use the same rendering as Node callers. ✓
- template-utils.sh's `copy_templates_batch()` correctly collects template paths per document name via `_manifest_template_path`, validates with `_validate_contract_doc_name` and `_ensure_dest_within_dir`, then calls the renderer once (`--level $render_level --out-dir $dest_dir "${template_paths[@]}"`). This matches DEFER-G7-02 spec. ✓
- create.sh's subfolder mode (lines 816-831) resolves the level contract, iterates doc names, and copies individually via `copy_template()` (not batch). Phase-child mode (line 626-632) does the same. Neither uses batch mode — they iterate per-document. This is acceptable as a simpler path for small doc sets, but means the batch optimization doesn't cover all scaffold paths. ✓
- template-structure.js has `sectionGates` and `sectionGatesByDocument` mapping with per-document anchor definitions (CUSTOM_ALLOWED_ANCHORS at lines 19-45). This aligns with the manifest per-document sectionGates profiles. ✓
- spec-kit-docs.json sectionGates are structured as nested JSON (document name → section names → level arrays). The level-contract-resolver's `assertSectionGatesByDocument()` correctly extracts document-keyed entries (lines 151-174). ✓
- New findings ratio: 1.00
- Dimensions addressed: template-rendering-correctness
- Novelty justification: F008 identifies a silent-no-op edge case not covered by tests. F009 is a minor portability improvement.

## Recommended Next Focus
Iteration 4: validator-coverage — systematic coverage audit of orchestrator.ts checks against spec-kit-docs.json rules.
