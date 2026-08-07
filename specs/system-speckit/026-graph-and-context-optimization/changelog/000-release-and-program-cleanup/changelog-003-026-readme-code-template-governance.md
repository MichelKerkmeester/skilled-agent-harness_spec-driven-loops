---
title: "README Code Template Governance: Template Revisions, Diagram Styling, Batch README Remediation"
description: "Two sk-doc README documentation templates were expanded and corrected to sk-doc Unicode box drawing style. Eighteen code-folder README files were remediated across P1 and P2 batches, HVR blockers were cleared. A final sweep manifest was recorded with one known exception."
trigger_phrases:
  - "readme code template governance"
  - "readme_code_template diagram styling"
  - "sk-doc readme template expansion"
  - "code folder readme remediation"
  - "hvr blocker readme fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/026-readme-code-template-governance` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The two `sk-doc` README documentation templates, `readme_template.md` and `readme_code_template.md`, had no architecture zone diagram, no package topology section, no control-flow example. The code template also contained ASCII diagram patterns that did not match the sk-doc Unicode box drawing style. Eighteen code-folder README files across the `system-spec-kit` MCP server tree contained HVR violations and lowercase-v diagram blockers.

Task 5 expanded `readme_template.md` for skill and project README alignment. It added architecture, topology, dependency, tree, key-file, control-flow guidance to `readme_code_template.md`. Task 9 corrected all ASCII diagram patterns in `readme_code_template.md` to sk-doc Unicode box drawing style. Both files passed `validate_document.py` at exit 0 with DQI 99 excellent. Tasks 25 and 28 batched and remediated all eighteen README targets in the sweep manifest. HVR blockers and lowercase-v diagram blockers were cleared. The `shared/README.md` was fixed in the final remediation pass. One exception remained: `templates/scratch/README.md` was skipped by template-path rule and reported DQI 64.

### Added

- Architecture zone diagram, package topology, dependency direction, key-file table, control-flow example section to `readme_code_template.md`
- Explicit README sweep target manifest in `implementation-summary.md` covering eighteen `system-spec-kit` README paths and their final remediation status

### Changed

- `readme_template.md` expanded for skill and project README alignment based on sampled skill READMEs
- `readme_code_template.md` diagram patterns updated from ASCII `+---`, `--->`, lowercase `v`, bracket-list `->` to sk-doc Unicode box drawing style. Directory trees remain as tree blocks.
- Eighteen code-folder README files remediated across P1 batches and P2 batches 01 through 22

### Fixed

- HVR punctuation and banned-word violations in code-folder README files, confirmed no matches after remediation
- Lowercase-v diagram blocker patterns in code-folder README files
- `system-spec-kit/shared/README.md` blocker cleared in the final remediation pass
- Semicolon prose in `mcp_server/code_graph/README.md` (at the time of authoring), validation passed
- Banned term removed from prose in `mcp_server/stress_test/README.md`, term retained only inside command text `npm run stress:harness`

### Verification

| Check | Result |
|-------|--------|
| `readme_template.md` `validate_document.py` | PASS, exit 0. Non-blocking `non_sequential_numbering` warnings from scaffold headings inside code fences. |
| `readme_code_template.md` `validate_document.py` | PASS, exit 0. Non-blocking `non_sequential_numbering` warnings from scaffold headings inside code fences. |
| `readme_template.md` `extract_structure.py` | PASS, exit 0. DQI 99 excellent. |
| `readme_code_template.md` `extract_structure.py` | PASS, exit 0. DQI 99 excellent. |
| HVR punctuation scan on both template files | PASS, no matches found. |
| HVR banned-word scan on both template files | PASS, no matches found. |
| `readme_code_template.md` diagram styling (Task 9) | PASS. All ASCII `+---`, `--->`, lowercase `v`, bracket-list `->` patterns replaced. Directory trees retained. |
| `readme_code_template.md` `validate_document.py` after Task 9 | PASS, exit 0. |
| `readme_code_template.md` `extract_structure.py` after Task 9 | PASS, exit 0. DQI 99 excellent. |
| Flowchart validator on extracted blocks | Non-blocking. Exit 1 from centered-connector indentation counted as nesting depth. Box widths, arrows, labels all passed. Primary validators exited 0. |
| Code-folder README P1 batches | PASS, all completed. |
| Code-folder README P2 batches 01 through 22 | PASS, all completed. |
| `system-spec-kit/shared/README.md` | PASS, fixed in final remediation. |
| `mcp_server/stress_test/README.md` final P1 cleanup | PASS, banned term removed from prose. Term remains in command text `npm run stress:harness`. |
| `templates/scratch/README.md` | Known exception. Validator skipped by template-path rule. `extract_structure` reported DQI 64. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/sk-doc/assets/readme/readme_template.md` | Expanded for skill and project README alignment. New guidance sections added from sampled skill READMEs. |
| `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Architecture zone diagram, topology, dependency, tree, key-file, control-flow guidance added (Task 5). Diagram patterns corrected to sk-doc Unicode box drawing style (Task 9). |

### Follow-Ups

- Each README template file retains accepted non-blocking `non_sequential_numbering` warnings from scaffold headings inside code fences. These are documented and validation exits 0.
- The flowchart validator centered-connector limitation is documented as non-blocking. A future pass may address the extracted-block validator to handle centered connectors without counting indentation as nesting depth.
- `templates/scratch/README.md` remains the only recorded exception: skipped by template-path rule and DQI 64 from `extract_structure`. A decision on this file is deferred to a future cleanup pass.
- Some batch agents reported `verify_alignment_drift.py` or markdownlint as validator alternatives. A final global review pass should confirm consistent tooling across the full README surface.
