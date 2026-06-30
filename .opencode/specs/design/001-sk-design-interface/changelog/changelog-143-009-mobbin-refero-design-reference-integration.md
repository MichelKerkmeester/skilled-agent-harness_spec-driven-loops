---
title: "Changelog: Mobbin and Refero design-reference integration [143-sk-design-interface/009-mobbin-refero-design-reference-integration]"
description: "Chronological changelog for the Mobbin and Refero design-reference integration phase."
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

> Spec folder: `.opencode/specs/design/001-sk-design-interface/009-mobbin-refero-design-reference-integration` (Level 1)
> Parent packet: `.opencode/specs/design/001-sk-design-interface`

### Summary

`sk-design-interface` gained a live window onto the shipped-UI median. Before this phase, the only default it could name and depart from came from a design system read through `mcp-open-design` or from built-in AI-default calibration. The skill can now resolve one real-world reference through Mobbin or Refero, name the expected look in a line and push off it deliberately without becoming a gallery, chooser or trend follower.

### Added

- Added the Mobbin `mcp-remote` manual to `.utcp_config.json`.
- Added the Refero `mcp-remote` manual to `.utcp_config.json`.
- Integrated the capability into `SKILL.md` through the ON_DEMAND row, references entry, Related Skills bullet and loading note.
- Added the `design_inventory.md` cross-pointer.

### Changed

- Confirmed the Mobbin and Refero MCP endpoints, auth model and `mcp-remote` bridge.
- Backed up `.utcp_config.json`.
- Authored `references/design_references_mcp.md` for critique-against use and hard rules.
- Parsed JSON and probed endpoint liveness, with both endpoints returning an auth challenge.
- Ran `package_skill --check` successfully.
- Swept for em-dashes and confirmed clean output.
- Confirmed `SKILL.md` stayed under the word cap.
- Confirmed live tool resolution and invocation through `mobbin.` and `refero.`.
- Confirmed `mobbin_search_screens` returns real screen data on Node 24.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `.utcp_config.json` parse and manuals | PASS: JSON parses and both manuals are present. |
| Endpoint liveness | PASS: Mobbin and Refero both returned HTTP 401 with auth required. |
| `package_skill --check` | PASS: `sk-design-interface` validated. |
| Em-dash sweep and word count | PASS: clean sweep and `SKILL.md` at 1964 words. |
| Live tool resolution | PASS: all 10 `mobbin.` and `refero.` tools resolve with full schemas after reload and OAuth. |
| First live tool invocation | PASS: `mobbin_search_screens` returned real screen data once Code Mode ran on Node 24. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.utcp_config.json` | Modified | Added the Mobbin and Refero `mcp-remote` stdio manuals. |
| `.opencode/skills/sk-design-interface/references/design_references_mcp.md` | Created | Critique-against use and hard rules. |
| `.opencode/skills/sk-design-interface/references/mobbin_tools.md` | Created | Mobbin MCP tool catalog for `search_screens` and `search_flows`. |
| `.opencode/skills/sk-design-interface/references/refero_tools.md` | Created | Refero MCP tool catalog, 8 tools for styles, screens and flows. |
| `.opencode/skills/sk-design-interface/SKILL.md` | Modified | ON_DEMAND row, references entry, Related Skills bullet and loading note. |
| `.opencode/skills/sk-design-interface/references/design_inventory.md` | Modified | Cross-pointer to the new reference. |

### Follow-Ups

- Fully verified after a Code Mode infrastructure fix. Tools resolve and invoke. A live `mobbin_search_screens` call returned real screen data, including a Substack pricing screen and a webp image.
- First invocation attempts dropped the Code Mode connection. The root cause was an unrelated pre-existing bug: `isolated-vm 6.0.2` segfaults under Node 25. It was fixed by pinning the Code Mode launcher to Node 24 in a separate commit.
- Tools are called synchronously with no top-level await and return the MCP content array.
- Refero auth model is assumed to be OAuth. Both manuals use plain `mcp-remote` OAuth. If Refero requires a static Bearer, add `--header "Authorization: Bearer ${REFERO_TOKEN}"` to its args and a `REFERO_TOKEN` entry in `.env`.
- There is no reuse-ground path. These references are critique-against only, with no token or component reuse from them. That path stays with `mcp-open-design` design systems.
