---
title: "Changelog: Root README Refresh with Verified Counts and Evergreen Cleanup"
description: "Root README.md updated with verified runtime counts, new capability mentions, an evergreen violation removed. The spec_kit_memory tool count now derives from TOOL_DEFINITIONS directly."
trigger_phrases:
  - "root readme refresh"
  - "root readme counts update"
  - "evergreen readme cleanup"
  - "readme tool count correction"
  - "015-root-readme-refresh changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/015-root-readme-refresh` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The root README carried stale counts from earlier commits. It contained one evergreen-doc violation linking a packet-local folder from narrative content. The MCP tool count was wrong. The CocoIndex section pointed at a real packet path. Several recent capabilities were also missing from the feature surface.

Updated sections: count table, MCP FAQ, Code Mode table, agent network intro, command count, feature catalog references and footer. Counts were sourced directly from `TOOL_DEFINITIONS`: 54 `spec_kit_memory` tools, 63 total native MCP tools, 10 agents from runtime agent directories, 23 commands from file counts. The CocoIndex narrative no longer links to a real packet folder. New brief capability mentions were added: memory retention sweep, advisor rebuild, Codex timeout fallback, CLI matrix runners, the stress suite, code-graph catalog and code-graph playbook docs.

### Added

- Brief capability mentions for memory retention sweep, advisor rebuild, Codex timeout fallback, CLI matrix runners, stress suite, code-graph catalog and code-graph playbook docs
- `verification-notes.md` (NEW) recording count sources and reproducible commands
- `audit-findings.md` (NEW) recording evergreen grep results and exempt instructional matches

### Changed

- README count table updated to reflect current runtime: 10 agents, 21 skills, 23 commands, 63 native MCP tools
- MCP FAQ updated to cite 54 `spec_kit_memory` tools sourced from `TOOL_DEFINITIONS`
- README version footer bumped to 4.5 to reflect the updated feature-surface coverage
- CocoIndex narrative section rewritten to remove the hardlink to a real packet folder

### Fixed

- README reported stale MCP tool and agent counts from earlier commits. Counts now match current runtime sources.
- CocoIndex section violated the evergreen packet-ID rule by linking to a real packet-local folder from narrative content. The link was removed and the section was rewritten.

### Verification

| Check | Result |
|-------|--------|
| Count verification | PASS. See `verification-notes.md` for source commands and numeric evidence. |
| Evergreen grep | PASS. Only exempt instructional phase-decomposition examples remain. See `audit-findings.md`. |
| Markdown wiki-link check | PASS. `rg '\[\[' README.md` returned no hits. |
| Strict validator | PASS. `validate.sh --strict` exited 0 with no warnings. |

### Files Changed

| File | What changed |
|------|--------------|
| `README.md` | Counts refreshed, feature mentions added, CocoIndex narrative rewritten, version footer bumped to 4.5. |
| `verification-notes.md` (NEW) | Count evidence: sources and reproducible commands for tools, agents, skills, commands. |
| `audit-findings.md` (NEW) | Evergreen audit evidence: grep results and documented exemptions for instructional matches. |

### Follow-Ups

- The `advisor-tool-schemas.ts` file holds Zod input/output schemas. It is not the canonical count source on its own. The four public MCP advisor descriptors live in `skill_advisor/tools/*.ts` and are imported into `TOOL_DEFINITIONS`. Any future count update should count `TOOL_DEFINITIONS` entries directly.
