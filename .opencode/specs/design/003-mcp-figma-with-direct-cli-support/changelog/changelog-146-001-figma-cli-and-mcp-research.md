---
title: "Changelog: Figma CLI and MCP Research [146-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research]"
description: "Research changelog for the Figma CLI, MCP and mcp-figma architecture phase."
trigger_phrases:
  - "figma cli research"
  - "mcp-figma research"
  - "146 phase 001 changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/003-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research` (Level 1)
> Parent packet: `.opencode/specs/design/003-mcp-figma-with-direct-cli-support`

### Summary

Phase 001 answered the tool question before the packet touched a skill surface. Five `gpt-5.5-fast` research iterations and an orchestrator ground-truth pass converged on a CLI-first architecture: drive Figma Desktop with the silships figma-cli published as `figma-ds-cli`, build the skill in the sibling terminal-control shape and keep the Figma MCP optional through Code Mode. The phase also made the npm traps explicit, because installing the wrong package would defeat the whole path.

### Added

- `research/research.md`, the canonical cross-checked recommendation.
- Five research iteration records under `research/iterations/`.
- `research/iterations/orchestrator-verifications.md` for the live-fact ground-truth pass.
- `research/prompts/` and `research/raw/` for prompt material and raw executor output.
- Packet control docs for the research phase.

### Changed

- The packet moved from an open question to a phaseable recommendation.
- The expected skill architecture shifted to a terminal-control skill modeled on `mcp-open-design`, `mcp-chrome-devtools` and `mcp-magicpath`.
- The install recommendation shifted away from npm-only assumptions toward the full silships repo build.

### Fixed

- Captured that npm `figma-cli` is unrelated and must never be installed.
- Captured that npm `figma-ds-cli@1.0.0` is minimal and lacks the safe connect, daemon and extract surface.
- Closed the ambiguity between CLI and MCP by making the CLI primary and the MCP opt-in.

### Verification

| Check | Result |
|-------|--------|
| Iteration completion | PASS: five iterations produced findings |
| Convergence | PASS: recommendation converged across iterations |
| npm trap capture | PASS: both naming and version traps recorded as warnings |
| Orchestrator ground-truth | PASS: live-observed capability and transport facts checked |
| `validate.sh --strict` | PASS: packet validation passed |
| Task completion | PASS: 15 tasks complete |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/research.md` | Created | Canonical research synthesis and recommendation |
| `research/iterations/iteration-001.md` | Created | First research pass |
| `research/iterations/iteration-002.md` | Created | Second research pass |
| `research/iterations/iteration-003.md` | Created | Third research pass |
| `research/iterations/iteration-004.md` | Created | Fourth research pass |
| `research/iterations/iteration-005.md` | Created | Fifth research pass |
| `research/iterations/orchestrator-verifications.md` | Created | Ground-truth verification pass |
| `research/prompts/` | Created | Iteration prompt materials |
| `research/raw/` | Created | Raw executor output |
| `spec.md` | Created | Phase scope and acceptance record |
| `plan.md` | Created | Research execution plan |
| `tasks.md` | Created | Research task ledger |
| `implementation-summary.md` | Created | Phase completion record |

### Follow-Ups

- None.
