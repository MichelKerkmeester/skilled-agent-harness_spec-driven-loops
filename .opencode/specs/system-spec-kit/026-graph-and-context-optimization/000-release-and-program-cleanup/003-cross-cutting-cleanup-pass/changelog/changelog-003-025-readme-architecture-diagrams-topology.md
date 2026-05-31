---
title: "025 README Architecture Diagrams and Topology"
description: "ASCII box-art architecture diagrams and directory topology trees were added to all 17 code-folder READMEs and ARCHITECTURE.md in system-spec-kit. Only shared/README.md had both before this work. Operators can now orient themselves visually when entering any principal code directory."
trigger_phrases:
  - "architecture diagram readme"
  - "topology tree code folder"
  - "box-art diagram spec-kit"
  - "mcp_server README diagrams"
  - "025-readme-architecture-diagrams-topology"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/025-readme-architecture-diagrams-topology` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Eighteen of nineteen principal code-area documentation files in `system-spec-kit/` had incomplete visual documentation. Eleven files were missing both an ASCII box-art architecture diagram and a directory topology tree. Six files had a tree but no diagram. That gap left developers without a visual entry point when reading into any code folder beyond `shared/`.

Architecture diagrams using Unicode box-drawing characters (`┌┐└┘──│◄►▲`) and directory topology trees were added to all 17 target files in a parallel-track sync commit on 2026-05-02. Eleven files received both diagram and tree from scratch. Six files that already had a tree received a diagram. All diagrams follow the style established in `shared/README.md:46-78`. After the work, every principal code-area documentation file in `system-spec-kit/` has both elements.

### Added

- Architecture diagrams and topology trees added to 11 files that previously had neither: `mcp_server/handlers/README.md`, `mcp_server/hooks/README.md`, `mcp_server/tools/README.md`, `mcp_server/matrix_runners/README.md`, `mcp_server/stress_test/README.md`, `scripts/README.md`, `scripts/lib/README.md`, `scripts/spec/README.md`, `scripts/memory/README.md`, `mcp_server/code_graph/lib/README.md`, `mcp_server/code_graph/handlers/README.md`.

### Changed

- Architecture diagrams added to 6 files that had a topology tree but no diagram: `mcp_server/README.md`, `mcp_server/lib/README.md`, `mcp_server/skill_advisor/README.md`, `mcp_server/code_graph/README.md`, `templates/README.md`, `ARCHITECTURE.md`.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| All 17 target files have a box-art diagram | PASS. Verified via grep for box-drawing chars across all target paths. |
| All 17 target files have a topology tree | PASS. Confirmed in implementation summary Modified Files list. |
| Diagram style matches `shared/README.md:46-78` reference | PASS. Same Unicode box-drawing character set used throughout. |
| Implementation summary status | COMPLETE. All 17 files updated, shared/README.md unchanged as reference. |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/handlers/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/hooks/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/tools/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/matrix_runners/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/stress_test/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/code_graph/lib/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/code_graph/handlers/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `scripts/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `scripts/lib/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `scripts/spec/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `scripts/memory/README.md` | Added architecture diagram and directory topology tree (NEW content). |
| `mcp_server/README.md` | Added architecture diagram to existing topology tree. |
| `mcp_server/lib/README.md` | Added architecture diagram to existing topology tree. |
| `mcp_server/skill_advisor/README.md` | Added architecture diagram to existing topology tree. |
| `mcp_server/code_graph/README.md` | Added architecture diagram to existing topology tree. |
| `templates/README.md` | Added architecture diagram to existing topology tree. |
| `ARCHITECTURE.md` | Added architecture diagram to existing topology tree. |

### Follow-Ups

- Four of the 17 target files (`mcp_server/code_graph/lib/README.md`, `mcp_server/code_graph/handlers/README.md`, `mcp_server/skill_advisor/README.md`, `mcp_server/code_graph/README.md`) were later extracted to their own skill packages (`system-code-graph`, `system-skill-advisor`). Verify that diagram coverage is maintained in those new locations.
