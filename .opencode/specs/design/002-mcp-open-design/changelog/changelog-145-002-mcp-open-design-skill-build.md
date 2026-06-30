---
title: "Changelog: mcp-open-design skill build [145-mcp-open-design/002-mcp-open-design-skill-build]"
description: "Chronological changelog for the mcp-open-design skill build phase."
trigger_phrases:
  - "phase changelog"
  - "skill build"
  - "mcp-open-design build"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/002-mcp-open-design/002-mcp-open-design-skill-build` (Level 2)
> Parent packet: `.opencode/specs/design/002-mcp-open-design`

### Summary

This phase built `mcp-open-design`, the skill that lets an agent drive the installed Open Design desktop app from the terminal. It shipped as commit `0508518ac9` with 20 files and the deliverable lives at `.opencode/skills/mcp-open-design/`. This record documents the completed build and does not re-run it.

### Added

- Authored `README.md`, `changelog/v1.0.0.0.md` and `graph-metadata.json`.
- Added the `mcp-magicpath` reciprocal edge.
- Completed the voice sweep with no em dashes and no prose semicolons in new prose.
- Recorded `CHK-002`, `CHK-013`, `CHK-040` and `CHK-050` as verified or confirmed.

### Changed

- Read the phase 001 research ground truth for terminal surface, tool tiers and transport.
- Read the `mcp-magicpath` package as the structural model.
- Authored `SKILL.md` with wire, read and run directions, ALWAYS and NEVER rules and version `1.0.0`.
- Authored `references/mcp_wiring.md` for `od mcp install` wiring, config shape and socket discovery.
- Authored `references/tool_surface.md` for the roughly 18 MCP tools and the surface, gate and omit policy.
- Authored `references/od_cli_reference.md` for headless `od` verbs and transport.

### Fixed

- Corrected the surface, gate and omit policy for every verb class.
- Recorded `CHK-FIX-001` through `CHK-FIX-005`, covering work class, surface inventory, consumer inventory, adversarial scope and matrix axes.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS: skill valid with no word-count warning. |
| Tool policy coverage | PASS: every verb classified as surface, gate or omit. |
| Structure parity with `mcp-magicpath` | PASS: same `SKILL.md`, references, catalog, playbook, README and changelog shape. |
| Voice sweep | PASS: no em dashes and no new prose semicolons. |
| Shipped | PASS: commit `0508518ac9`, 20 files. |
| `validate.sh --strict` | PASS: this packet returned 0 errors. |
| P0 `CHK-FIX-004` | PASS: adversarial tests scoped, N/A for docs-only skill with no security, path or parser surface. |
| P1 `CHK-FIX-005` | PASS: matrix axes listed, N/A for prose skill with no test matrix. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `SKILL.md` | Created | Runtime contract with wire, read and run directions, the surface, gate and omit policy and ALWAYS and NEVER rules. |
| `references/mcp_wiring.md` | Created | `od mcp install` wiring, config shape and socket-discovery transport. |
| `references/tool_surface.md` | Created | The roughly 18 MCP tools and the surface, gate and omit policy. |
| `references/od_cli_reference.md` | Created | The headless `od` verbs and transport. |
| `feature_catalog/` | Created | Capability inventory for wiring, reading, grounding, runs and transport. |
| `manual_testing_playbook/` | Created | Operator scenarios for wiring, reading, gated runs and failure paths. |
| `README.md` | Created | Narrative overview, troubleshooting and FAQ. |
| `changelog/v1.0.0.0.md` | Created | Initial release changelog. |
| `graph-metadata.json` | Created | Skill graph topics, edges and source docs. |
| `mcp-magicpath/graph-metadata.json` | Updated | Reciprocal edge to the new skill. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `this file` | Created | Packet control docs for the retroactive record. |

### Follow-Ups

- The build came from research and reverse engineering, not a live wire. A live `od mcp install opencode` wire against a running daemon moved to phase 004.
- The generation flow was later corrected. Version `1.0.0` described generation as one-shot `start_run`, and phase 007 corrected it to the live-verified multi-turn flow.
- Daemon lifecycle and per-verb auth were inferred at build time and carried forward for live confirmation.
