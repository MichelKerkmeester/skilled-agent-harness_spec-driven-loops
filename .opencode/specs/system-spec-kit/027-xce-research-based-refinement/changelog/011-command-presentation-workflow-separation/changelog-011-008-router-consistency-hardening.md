---
title: "Changelog: 008-router-consistency-hardening"
description: "Normalized bare MCP tool names in seven router frontmatter lines and corrected sk-doc's command-template standard to match shipped router variants."
trigger_phrases:
  - "011 008 router consistency changelog"
  - "allowed-tools mcp names"
  - "command template router variants"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-12

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/008-router-consistency-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation`

### Summary

Seven routers still carried bare or mixed MCP names in `allowed-tools`. They now use the fully qualified `mcp__<server>__<tool>` form. The sk-doc command template was also corrected so it describes the actual common core plus workflow-backed and direct-router variants instead of falsely claiming one universal six-section shape.

### Added

- Explicit `mcp__` allowed-tools rule to sk-doc command-template guidance.

### Changed

- Qualified bare `memory_*` and `code_graph_*` names in seven command-router frontmatter lines.
- Rewrote `command_template.md` section 11 to document two shipped router variants and the direct-router exception.

### Fixed

- Closed the same tool-naming defect class previously fixed in selected `resume.md` and `search.md` routers.

### Verification

| Check | Result |
|-------|--------|
| Bare-name scan | PASS: zero bare MCP names in router `allowed-tools` |
| Reference integrity | PASS: 24/24 presentation references remain valid, zero orphans |
| Body prose unchanged | PASS: per-file diffs limited to `allowed-tools` line |
| Strict validation | PASS: this folder 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/deep/{ask-ai-council,start-context-loop,start-research-loop,start-review-loop}.md` | Modified | MCP tool names qualified |
| `.opencode/commands/speckit/{complete,implement,plan}.md` | Modified | MCP tool names qualified |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modified | Router standard corrected |

### Follow-Ups

- Section-header style still varies across command families and is documented as acceptable variation, not normalized here.
