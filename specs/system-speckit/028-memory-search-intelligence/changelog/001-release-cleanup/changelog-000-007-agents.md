---
title: "Changelog: Agent Definition Cleanup"
description: "Chronological changelog for the agent definition cleanup phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/007-agents` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup`

### Summary

The agent definition cleanup ran across the OpenCode, Claude and Codex agent mirrors. Discovery found 39 in-scope files: 12 agent definitions plus one README in each runtime. The three README files were rewritten to match the live 12-agent set and the correct runtime packaging. Two Claude path-convention lines were localized to `.claude/agents/*.md`. Agent bodies were verified accurate and left unchanged.

### Added

- Added current runtime-specific README prose for the three agent mirrors.
- Added verification evidence for agent counts, path resolution and mirror parity.

### Changed

- Updated README inventories that listed retired agents and missed live agents.
- Corrected runtime names and the Codex `.toml` packaging description.
- Localized the Claude path-convention lines that pointed at the OpenCode agent directory.

### Fixed

- Removed stale `create`, `handover` and `speckit` agent listings.
- Added the live `deep-context`, `markdown` and `deep-improvement` agents to the mirror READMEs.
- Brought Claude path-convention wording into line with the local mirror.

### Verification

| Check | Result |
|-------|--------|
| Cleanup execution | PASS, 5 files modified |
| Agent body review | PASS, 12 bodies verified in each runtime |
| Edited README em dash scan | PASS, 0 hits |
| Edited README semicolon scan | PASS, 0 hits |
| Edited README Oxford comma scan | PASS, 0 hits |
| Stale-reference scan | PASS, 0 actionable hits |
| Strict validation | PASS, 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/agents/README.txt` | Modified | Corrected agent list, runtime name and voice |
| `.claude/agents/README.txt` | Modified | Corrected agent list, runtime name and voice |
| `.codex/agents/README.txt` | Modified | Corrected agent list, runtime name, extension and voice |
| `.claude/agents/deep-review.md` | Modified | Localized path convention |
| `.claude/agents/review.md` | Modified | Localized path convention |

### Follow-Ups

- Leave agent bodies alone unless a future verification pass finds a concrete stale claim.
- Treat corpus-wide voice restyling as separate work because this phase only rewrote confirmed stale prose.
