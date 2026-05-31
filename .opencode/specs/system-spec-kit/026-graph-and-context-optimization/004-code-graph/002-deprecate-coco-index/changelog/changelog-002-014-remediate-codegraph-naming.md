---
title: "Code Graph 002-014: Remediate ccc Naming Residue in system-code-graph Docs"
description: "Removed all ccc-era naming residue plus the botched structural-search rename residue from 13 system-code-graph docs. Every doc now describes the real tree-sitter skill with current names, zero phantom handlers, zero links to deleted files."
trigger_phrases:
  - "ccc residue remediation code-graph"
  - "code-graph doc naming cleanup"
  - "structural search phantom removal"
  - "remediate-codegraph-naming changelog"
  - "ccc handler docs drop"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/014-remediate-codegraph-naming` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

The 014 deprecation renamed code-graph's handlers and tools to their own identifiers (`status.ts`, `scan.ts`, `verify.ts`, `code_graph_*` tools, tree-sitter engine) but the skill's documentation was never updated. Docs still referenced phantom `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` handlers, a deleted `lib/ccc/` adapter, a deleted `07--ccc-integration` catalog section, dead schema fields, ghost test names. The 013 post-deprecation deep-review (iterations 5 to 7) surfaced this class. Exact grep verification confirmed the scope.

Thirteen system-code-graph docs were edited in a single commit (`bc047a4264`). Beyond the literal `ccc` cleanup, the scope expanded to cover the botched `ccc to "structural search"` find-replace residue left by the original deprecation pass: false "structural search bridge/binary/CLI" prose, a phantom `code_graph_* and detect_changes` tool name, the broken identifier `getstructural searchBinaryPath`, plus a false "separate semantic-index runtime" claim. The code was confirmed clean before editing, so all changes are documentation-only. Every system-code-graph doc now describes the real tree-sitter skill with no phantom handlers, no deleted cross-refs, no external-binary fiction.

### Added

- Reframed README section 3.5 as `INDEX LIFECYCLE` with real handler paths for `code_graph_status`, `scan`, `verify`
- Added missing `classify-query-intent.ts` entry to the handlers README

### Changed

- Twelve system-code-graph docs updated to replace ccc-era names with current `status.ts`, `scan.ts`, `verify.ts` identifiers and `code_graph_*` tool names
- `ARCHITECTURE.md` "structural search bridge" subsystem reframed to "Index lifecycle" with corrected diagram and topology comment
- `feature_catalog.md` and `manual_testing_playbook.md` renumbered after removing the `07--ccc-integration` sections (feature catalog 9 to 8, playbook 14-18 to 13-17). Inventory counts corrected (17 to 14 features, 8 to 7 groups, 19 to 16 scenarios).

### Fixed

- Phantom `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` handler entries replaced with real `status.ts`, `scan.ts`, `verify.ts` across all docs
- Dead cross-references to `lib/ccc/`, `07--ccc-integration/`, `ccc_bridge_integration.md`, `retired-search-path.ts` removed
- False "structural search bridge/binary/CLI/facade" prose dropped from `ARCHITECTURE.md`, `README.md`, `SKILL.md`
- Phantom `code_graph_* and detect_changes` tool name removed from four docs
- Broken identifier `getstructural searchBinaryPath` removed from shared README
- False sqlite-vec and "separate semantic-index runtime" claims removed from `ARCHITECTURE.md`

### Verification

| Check | Result |
|-------|--------|
| `rg -i ccc` over system-code-graph (excl changelog/dist/package-lock) | PASS. 0 matches |
| Dead-link sweep for `07--ccc-integration`, `ccc_bridge_integration`, `retired-search-path`, `lib/ccc`, ghost tests | PASS. 0 |
| Full rename-residue sweep for `code_graph_* and detect_changes`, `structural search`, `getstructural/searchBinaryPath`, `retired-search`, `separate semantic-index runtime` | PASS. 0 (ARCHITECTURE.md explicit negation of the runtime remains, intentional) |
| Replacement targets exist (status/scan/verify/classify-query-intent handlers, real context test, code-graph-tools.ts) | PASS |
| Code leakage check (`structural search` and `getstructural` in `*.ts`) | PASS. 0 (docs-only) |
| ToC to heading numbering (feature_catalog 1-8, playbook 1-17) | PASS. Gap-free, consistent |
| `validate.sh` strict on packet | PASS. See commit `bc047a4264` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Modified | ccc-*.ts replaced with real handlers. "ccc bridge" prose dropped. Missing `classify-query-intent.ts` added. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Section 3.5 reframed from "structural search Bridge" to "INDEX LIFECYCLE" with real handler paths. Bridge cross-ref removed. Semantic-runtime prose fixed. |
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Dead `ccc_`/`ccc` keywords removed. Dead `structural` INTENT_SIGNAL and resource block removed. Bridge refs (x3) and phantom-tool garbles (x4) removed. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modified | `07--ccc-integration` section, ToC entry, table row removed. DOCTOR renumbered 9 to 8. Counts corrected. Phantom-tool plus seed garbles removed. |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | Modified | Three phantom `cccStatus` to `lib/ccc/` rows removed. Three phantom "structural" binary rows removed. Bridge cross-ref and garbles removed. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Modified | `07--ccc-integration` section, ToC entry, table row removed. Scenarios 14-18 renumbered to 13-17. Counts corrected. Garbles removed. |
| `.opencode/skills/system-code-graph/mcp_server/tools/README.md` | Modified | `ccc_*` entries dropped from tool list. Ghost telemetry test name replaced with real test. |
| `.opencode/skills/system-code-graph/mcp_server/lib/shared/README.md` | Modified | `retired-search-path.ts` rows removed. Broken `getstructural searchBinaryPath` removed. "ccc binary path" prose removed. |
| `.opencode/skills/system-code-graph/mcp_server/tests/README.md` | Modified | Ghost `retired-search-telemetry-passthrough.vitest.ts` replaced with real test name. |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md` | Modified | `shared/retired-search-path.ts` reference removed. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md` | Modified | "CCC bridge" prose removed. Ghost `ccc-integration-stress.vitest.ts` removed. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified | "structural search bridge" subsystem reframed to "Index lifecycle". Diagram and topology comment fixed. False sqlite-vec and semantic-runtime claims removed. |
| `.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md` | Modified | Phantom `code_graph_* and detect_changes` tool name removed. (File later renamed to `013-tool-registrations.md` in a subsequent catalog-standards commit.) |

### Follow-Ups

- Remaining 013 deep-review residue findings outside system-code-graph scope require a separate remediation pass: `.gemini/GEMINI.md` coco routing (P0), `/memory:manage` ccc subcommand, advisor `database/skill-graph.json`, `.gitignore`, `.opencode/bin/lib/sidecar-env-allowlist.cjs` `RERANK_`, the system-spec-kit `250-session-start` `.venv/bin/ccc` playbook.
- Several docs cite `mcp_server/tool-schemas.ts`. That file's existence and accuracy were not audited in this pass (no ccc content). A follow-up should verify the path and the schema descriptions are current.
