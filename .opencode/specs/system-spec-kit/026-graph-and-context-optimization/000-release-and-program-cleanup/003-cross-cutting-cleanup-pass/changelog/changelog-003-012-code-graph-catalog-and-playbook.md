---
title: "code_graph runtime feature catalog and manual testing playbook"
description: "A runtime-package feature catalog and manual testing playbook were created for the code_graph MCP surface, mirroring the shape of the skill_advisor package. 17 per-feature catalog files across 8 groups and 15 playbook scenarios across 8 groups shipped with cross-links from the runtime README and root docs."
trigger_phrases:
  - "code_graph feature catalog"
  - "code_graph manual testing playbook"
  - "code_graph runtime catalog"
  - "code_graph playbook scenarios"
  - "code graph documentation package"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/012-code-graph-catalog-and-playbook` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The code_graph MCP runtime had README coverage and root skill catalog entries, but lacked package-local `feature_catalog/` and `manual_testing_playbook/` directories at the source-of-truth runtime path. That left runtime details scattered and made code_graph weaker than the already-documented skill_advisor package.

A runtime feature catalog and manual testing playbook were created for code_graph, mirroring the skill_advisor package shape. Automation claims were pinned to packet 013/035 reality classifications so read-path self-heal, manual scan/status/verify, CCC tools, coverage graph and doctor apply mode are each described without overclaiming. No TypeScript or runtime handler code was changed.

The catalog delivers 17 per-feature files across 8 groups. The playbook delivers 15 deterministic scenarios across 8 groups. Cross-links were added to the runtime README and to the root feature catalog and root manual testing playbook.

### Added

- `feature_catalog/` runtime package under `code_graph/` with a root index and 17 per-feature files across 8 groups (read-path freshness, manual scan and verify and status, detect-changes, context retrieval, coverage graph, MCP tool surface, CCC integration, doctor apply mode)
- `manual_testing_playbook/` runtime package under `code_graph/` with a root index and 15 deterministic scenario files across 8 groups
- Per-feature entries citing handler, tool and YAML line anchors for source evidence
- Reality-classification labels from packet 013/035 on each catalog entry (auto-fire, half-manual or manual)

### Changed

- `code_graph/README.md` updated to link the new feature catalog and manual testing playbook sub-directories
- `mcp_server/README.md` updated to surface the code_graph runtime documentation package
- Root feature catalog category 22 updated to link the runtime catalog
- Root manual testing playbook category 22 updated to link the runtime playbook

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| Source evidence inspection | PASS: per-feature entries cite handler, tool and YAML line anchors. |
| Doc-only scope | PASS: TypeScript and runtime handler files unchanged. |
| Strict validation | PASS: strict validator exited 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/feature_catalog/` (NEW) | Created | Runtime feature catalog. 17 per-feature files across 8 groups. Originally created at `mcp_server/code_graph/feature_catalog/` then relocated to system-code-graph in a later isolation phase. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/` (NEW) | Created | Runtime manual testing playbook. 15 scenario files across 8 groups. Originally created at `mcp_server/code_graph/manual_testing_playbook/` then relocated to system-code-graph in a later isolation phase. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Link to code_graph runtime documentation package. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/293-category-overview.md` | Modified | Cross-link to runtime catalog. Path was `22--context-preservation-and-code-graph/` at ship time. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/` | Modified | Cross-link to runtime playbook. Path was `22--context-preservation-and-code-graph/` at ship time. |

### Follow-Ups

- Playbook scenarios are authored but not executed in this packet. The catalog and playbook create reusable manual validation docs. Running the MCP scenarios against a live runtime is a separate verification step.
