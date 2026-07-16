---
title: "CocoIndex Feature Catalog: 46-snippet inventory for the mcp-coco-index skill"
description: "The mcp-coco-index skill gained a complete feature catalog with 46 current-state snippets across 9 categories, each citing live source and validation anchors."
trigger_phrases:
  - "mcp-coco-index feature catalog"
  - "cocoindex catalog"
  - "020-cocoindex-feature-catalog"
  - "semantic search skill catalog"
  - "coco index feature inventory"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/020-cocoindex-feature-catalog` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The `mcp-coco-index` skill had no structured inventory of its capabilities. Operators needed to read `SKILL.md`, references, scripts, tests plus vendored source in isolation to understand what shipped. A complete feature catalog was authored with 46 current-state snippet files across 9 category folders. Each snippet follows the canonical four-section shape (`OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, `SOURCE METADATA`) citing live implementation and validation anchors. The catalog ships as read-only documentation with zero runtime code changes.

### Added

- Root feature index at `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` linking all 46 per-feature files
- 7 CLI command snippets in `01--cli-commands/` covering project init, index build, semantic search, status, reset, MCP stdio plus daemon subcommands
- 4 MCP server snippets in `02--mcp-server/` covering search tool contract, refresh-index default, filter schema plus extended result models
- 5 indexing pipeline snippets in `03--indexing-pipeline/` covering project environment, file discovery, chunking, embedding provider selection plus vector table persistence
- Category folders `04--daemon-and-readiness/` through `09--validation-and-tests/` with the remaining 30 snippets across daemon lifecycle, search ranking, fork extensions, installation tooling, configuration plus validation

### Changed

- None. All files created net-new. No existing source or skill files were modified.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Strict packet validator (`validate.sh --strict`) | PASS |
| Catalog shape audit (four-section H2 structure) | PASS. Zero DRIFT lines detected. |
| Evergreen grep (no packet-history wording) | PASS. Zero unexempted hits. |
| Build sanity | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Created (NEW) | Root feature inventory and navigation index |
| `.opencode/skills/mcp-coco-index/feature_catalog/01--cli-commands/*.md` | Created (NEW) | 7 CLI command feature snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/*.md` | Created (NEW) | 4 MCP search tool feature snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/*.md` | Created (NEW) | 5 indexing pipeline feature snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/04--daemon-and-readiness/*.md` | Created (NEW) | Daemon lifecycle and readiness snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/*.md` | Created (NEW) | Search and ranking feature snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/06--patches-and-extensions/*.md` | Created (NEW) | Fork extension feature snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/07--installation-tooling/*.md` | Created (NEW) | Installer and helper script snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/08--configuration/*.md` | Created (NEW) | Settings and downstream adoption snippets |
| `.opencode/skills/mcp-coco-index/feature_catalog/09--validation-and-tests/*.md` | Created (NEW) | Automated and manual validation snippets |
| Packet docs | Created (NEW) | spec.md, plan.md, tasks.md, checklist.md, decision-record.md, audit-findings.md, remediation-log.md, implementation-summary.md |

### Follow-Ups

- Catalog source anchors are point references citing the current line where each function, test or doc section begins, not an exhaustive line range. Update anchors when source files shift significantly.
- Manual playbook scenario files remain separate. The catalog links validation anchors but does not duplicate scenario execution steps.
