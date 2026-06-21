---
title: "Changelog: decouple from Open Design [143-sk-design-interface/010-decouple-from-open-design]"
description: "Chronological changelog for the decouple from Open Design phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/010-decouple-from-open-design` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/143-sk-design-interface`

### Summary

Status: DONE. `sk-design-interface` had about 101 references to the internal `mcp-open-design` skill and the Open Design app across 23 files. Those references are gone from live content, so the skill now reads as a standalone Apache-2.0 design skill an external user can adopt alone. The integration is one-way: `mcp-open-design` still names this skill as its mandatory judgment partner, but this skill no longer knows about it.

### Added

- Created `mcp-open-design/references/design_parity_transport.md` as the transport half pointing to `real_ui_loop.md`.

### Changed

- Moved `claude_design_parity.md` to `real_ui_loop.md` and rewrote it as vendor-neutral guidance.
- Stripped Open Design transport from the renamed loop while keeping sections 6, 7 and 8.
- Removed Open Design naming from `sk-design-interface/SKILL.md`, `README.md`, `design_inventory.md`, `design_references_mcp.md`, `variation_diversity.md` and `graph-metadata.json`.
- Generalized the feature catalog and manual testing playbook in parallel.
- Renamed the open-design-grounding feature.
- Renamed the claude-design-parity playbook group.
- Repointed `mcp-open-design` docs across `SKILL.md`, README, install guide and feature catalog.
- Repointed `sk-prompt/design_generation_patterns.md`.
- Bumped versions and changelogs for `sk-design-interface v1.4.0.0` and `mcp-open-design v1.4.0.0`.
- Confirmed zero Open Design naming in live `sk-design-interface` content.
- Confirmed reverse coupling remains intact in `mcp-open-design`.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| No Open Design naming in live `sk-design-interface` content | PASS: grep confirmed zero live references. |
| Parity doc split | PASS: `real_ui_loop.md` and `design_parity_transport.md` present, old doc gone. |
| Reverse mandatory coupling | PASS: `mcp-open-design/SKILL.md` banner, gate and rules still name `sk-design-interface`. |
| No dangling `claude_design_parity` links | PASS: repo-wide live refs repointed, with only historical changelogs retaining the old name. |
| Feature catalog and playbook validators | PASS: `sk-doc` validation returned 0 issues on both indexes. |
| `validate.sh <this phase> --strict` | PASS: exit 0. |
| Tasks complete | PASS: 12 completed task items recorded. |

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Historical changelogs still name Open Design. `sk-design-interface/changelog/v1.1.0.0.md` and `v1.3.0.0.md` describe the prior coupling and were intentionally left as point-in-time records.
- The skill-advisor index reflects the old graph until a rescan. `graph-metadata.json` was updated and `mcp-open-design` edges were dropped. Refreshing the advisor graph is a separate maintenance step.
- `mcp-figma` is still named in `sk-design-interface`, correctly. The user scoped this change to Open Design only.
