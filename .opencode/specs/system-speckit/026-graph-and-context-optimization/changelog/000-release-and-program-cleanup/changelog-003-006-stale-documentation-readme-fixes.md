---
title: "Stale Doc + README Fixes (Tier 1+2)"
description: "Twelve stale documentation targets closed in one pass: three packet-continuity files, five code-adjacent READMEs plus three skill READMEs. Retired 011 deep-review findings F-001, F-002, F-004 plus F-006, along with all five HIGH plus three MEDIUM findings from the README staleness audit."
trigger_phrases:
  - "stale documentation readme fixes"
  - "readme staleness remediation"
  - "011 deep-review F-001 F-002 F-004 F-006"
  - "tier 1 tier 2 doc cleanup"
  - "embedding readiness readme removed"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

A batch of runtime and skill-contract changes shipped faster than packet continuity and adjacent READMEs caught up. Three packet-continuity files still carried stale narrative: the 023 implementation summary described TC-3 as `expected_fail`, the 025 tasks file still marked a typecheck-blocked state. The 028 spec continuity still said "Authored Level 1 spec" despite the packet being complete. Five code-adjacent READMEs referenced deleted embedding-readiness functions and outdated parser defaults. Three skill READMEs documented an old `review/{packet}/` first-run shape instead of the flat-first `{artifact_dir}` layout. The `sk-doc` doctype list was missing `playbook_feature`.

All twelve targets were updated in a single documentation-only pass. The edits retire 011 deep-review findings F-001, F-002, F-004 plus F-006, along with the README staleness audit's five HIGH plus three MEDIUM findings, without touching runtime code or tests. Strict packet validation passed after the final continuity update.

### Added

- `playbook_feature` doctype entry and per-feature playbook path explanation in `.opencode/skills/sk-doc/README.md`

### Changed

- 023 implementation summary: TC-3 narrative updated from stale `expected_fail` marker prose to packet-025 passing-state description
- 025 tasks file: stale typecheck-blocked annotation removed and final batch marked clean
- 028 spec continuity: `recent_action` updated to implementation complete, `completion_pct` set to 100
- `folder_structure.md`: child-phase layout example replaced with flat-first pattern, `pt-NN` shown as second-run conditional
- `mcp_server/core/README.md`: stale embedding-readiness ownership line replaced with current DB rebind and cache responsibilities
- `mcp_server/scripts/README.md`: `setEmbeddingModelReady` mention replaced with lazy embedding and provider startup path
- `mcp_server/lib/search/README.md`: Stage 3 rerank updated to conditional default-on, four-candidate floor plus `rerankGateDecision` metadata
- `mcp_server/code_graph/README.md`: `fallbackDecision` field added to blocked and degraded operator surfaces
- `mcp_server/code_graph/lib/README.md`: parser contract updated to Tree-sitter WASM default plus regex fallback, newer modules listed
- `sk-deep-review/README.md`: runtime-state layout rewritten around flat-first `{artifact_dir}` with `pt-NN` explicitly conditional
- `sk-deep-research/README.md`: quick-start and runtime layout rewritten around flat-first `{artifact_dir}` with `pt-NN` explicitly conditional

### Fixed

- Deleted `setEmbeddingModelReady`, `isEmbeddingModelReady`, `embeddingModelReady` plus `waitForEmbeddingModel` identifiers no longer appear in any code-adjacent README
- Stale `pt-01` first-run path removed from skill READMEs so readers see the correct flat-first artifact layout
- Stale `regex-only, tree-sitter planned` parser description replaced with the current Tree-sitter WASM plus regex fallback contract

### Verification

| Check | Result |
|-------|--------|
| `rg -n 'setEmbeddingModelReady\|isEmbeddingModelReady\|embeddingModelReady\|waitForEmbeddingModel'` across five code-adjacent READMEs | PASS: exit 1, 0 matches |
| `rg -n 'pt-01'` in `sk-deep-review/README.md` and `sk-deep-research/README.md` | PASS: exit 1, 0 matches |
| `rg -n 'regex-only\|tree-sitter planned'` in target docs | PASS: exit 1, 0 matches |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS: exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `specs/.../023-live-handler-envelope-capture-interface/implementation-summary.md` | TC-3 narrative updated from stale gap marker prose to packet-025 passing-state prose |
| `specs/.../025-memory-search-degraded-readiness-wiring/tasks.md` | Stale typecheck-blocked annotation removed. Final batch marked clean. |
| `specs/.../028-deep-review-research-skill-contract-fixes/spec.md` | Continuity updated to implementation complete and 100 percent |
| `.opencode/skills/system-spec-kit/references/structure/folder_structure.md` | Child-phase layout example replaced with flat-first plus conditional `pt-NN` |
| `.opencode/skills/system-spec-kit/mcp_server/core/README.md` | Stale embedding-readiness ownership replaced with DB rebind and cache ownership |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/README.md` | Deleted readiness setter replaced with lazy embedding and provider startup path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md` | Stage 3 rerank updated to conditional default-on, four-candidate floor, `rerankGateDecision` metadata |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | `fallbackDecision` added to blocked and degraded operator surfaces |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/README.md` | Parser contract updated to Tree-sitter WASM default plus regex fallback. Newer modules listed. |
| `.opencode/skills/sk-deep-review/README.md` | Runtime-state layout rewritten around flat-first `{artifact_dir}`, `pt-NN` explicitly conditional |
| `.opencode/skills/sk-deep-research/README.md` | Quick-start and runtime layout rewritten around flat-first `{artifact_dir}`, `pt-NN` explicitly conditional |
| `.opencode/skills/sk-doc/README.md` | `playbook_feature` doctype added to Document Quality mode list |

### Follow-Ups

- Re-run the README staleness audit to confirm zero STALE-HIGH findings remain on the listed files after subsequent sessions have touched the same READMEs.
- The 011 deep-review findings registry (`review/deep-review-findings-registry.json`) was unavailable at implementation time. Confirm F-001, F-002, F-004 plus F-006 are formally closed in the registry when it is next accessible.
- The 025 implementation summary still contains historical typecheck-fail prose. Widening scope would have violated the packet contract at the time, so it was left unchanged. A follow-on edit can address it.
