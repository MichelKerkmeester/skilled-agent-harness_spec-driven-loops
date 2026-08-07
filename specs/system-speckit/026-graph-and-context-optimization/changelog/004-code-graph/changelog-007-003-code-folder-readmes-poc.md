---
title: "Phase A: sk-doc-aligned READMEs for 3 system-code-graph code folders"
description: "Three README gaps in system-code-graph/mcp_server/ were filled using a two-pass cli-devin (SWE 1.6 context gathering) plus cli-opencode (deepseek-v4-pro authoring) pipeline, followed by a Sonnet review pass that corrected P0 hallucinations in 2 of 3 bundles. All 3 READMEs passed sk-doc validate_document.py exit 0 and HVR checks. Phase A validated the pipeline shape for Phases B, C and D."
trigger_phrases:
  - "code-folder readmes proof-of-concept"
  - "system-code-graph mcp_server README"
  - "cli-devin cli-opencode readme pipeline"
  - "Phase A readme authoring"
  - "sk-doc aligned code readmes"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/003-code-folder-readmes-poc` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

Three code folders under `.opencode/skills/system-code-graph/mcp_server/` shipped without a README, which degraded the smart router's ability to surface the right docs and removed the quick orientation map contributors need when landing in the folder. A two-pass pipeline resolved the gap: cli-devin (SWE 1.6) ran Pass 1 to gather per-folder context bundles, then cli-opencode (deepseek-v4-pro, variant high) ran Pass 2 to author the three READMEs from those bundles using the sk-doc CODE template. A Sonnet review pass caught and patched P0 hallucinations in 2 of 3 bundles before the READMEs were considered final. All three READMEs passed `validate_document.py --type readme` exit 0 and the strict-validate gate. Phase A validated the full pipeline shape for the larger Phases B, C and D that follow.

### Added

- `mcp_server/README.md` with 9 anchored sections, YAML frontmatter and a two-branch architecture diagram showing the ListTools vs CallTool request paths through `index.ts`
- `mcp_server/core/README.md` in compact variant covering `DATABASE_DIR` consumers (`code-graph-db.ts`, `apply-orchestrator.ts`, `recovery-procedures.ts`) and a load-throw note for unwritable resolved paths
- `mcp_server/plugin_bridges/README.md` with corrected validation commands (build first, then invoke with `--minimal --spec-folder`) and a note that `console.*` output is redirected to stderr
- Three context bundles under `research/context-bundles/` (`mcp_server-root.json`, `core.json`, `plugin_bridges.json`) produced by Pass 1 with file inventories, exports, architecture observations and integration notes

### Changed

- None.

### Fixed

- Two P0 findings in `core/README.md` where the cli-devin bundle had hallucinated `DATABASE_DIR` consumers as "vector index and session manager". Replaced with grep-verified actual consumers.
- One P0 finding in `plugin_bridges/README.md` where the bundle suggested `--help` as a validation command. The flag is unsupported and falls through to `main()` causing an error. Replaced with a real exercise command.
- Four P2 findings in `mcp_server/README.md` covering dispatch path wording, architecture diagram shape, build-output file placement in the key-files table and server-identifier framing.
- One stray em-dash in `mcp_server/README.md` Build outputs note. Replaced with a period split.

### Verification

| Check | Result | Command |
|-------|--------|---------|
| Per-README sk-doc validate (all 3) | PASS | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` exit 0 x 3 |
| Per-README HVR sweep | PASS | 0 em-dashes, 0 semicolons across all 3 files |
| Strict-validate packet | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exit 0 |
| Sonnet review accuracy (post-patch) | PASS | Expected PASS on all 3 after P0+P2 patches applied |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/README.md` (NEW) | Full 9-section sk-doc CODE README. Architecture diagram revised to show ListTools vs CallTool branching. Build outputs moved out of key-files table. Final em-dash removed. |
| `.opencode/skills/system-code-graph/mcp_server/core/README.md` (NEW) | Compact README. P0 consumer list corrected to grep-verified files. Load-throw note added. |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md` (NEW) | Full README. Validation command corrected from unsupported --help to real build-then-invoke sequence. stderr note added. |
| `research/context-bundles/mcp_server-root.json` (NEW) | Pass 1 context bundle: file inventory, exports, architecture observations for the mcp_server root. |
| `research/context-bundles/core.json` (NEW) | Pass 1 context bundle for core/. |
| `research/context-bundles/plugin_bridges.json` (NEW) | Pass 1 context bundle for plugin_bridges/. |

### Follow-Ups

- Apply the lesson learned here (cli-devin SWE 1.6 bundles need grep-verification of internal_imports and validation_commands before use) to the Pass 1 prompt for Phase B (008/024) and Phase C (014/054).
- Track HVR score numeric values for all 3 READMEs once `validate_document.py --json` is confirmed available in the Phase B scope.
