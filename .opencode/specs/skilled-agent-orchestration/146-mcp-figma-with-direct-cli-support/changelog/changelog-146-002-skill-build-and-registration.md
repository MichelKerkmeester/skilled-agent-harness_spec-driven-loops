---
title: "Changelog: Skill Build and Registration [146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration]"
description: "Build changelog for the shipped mcp-figma terminal-control skill."
trigger_phrases:
  - "mcp-figma skill build"
  - "figma skill registration"
  - "146 phase 002 changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support`

### Summary

Phase 002 turned the research into a shipped `mcp-figma` skill at `.opencode/skills/mcp-figma/`. The skill lets an agent drive Figma Desktop from the terminal, defaults to the safe plugin connection, gates yolo patching behind explicit confirmation and keeps the community Figma MCP optional through Code Mode. The build was packaged, graph-registered, live-installed from the repo build and verified against the Code Mode `figma` manual.

### Added

- `.opencode/skills/mcp-figma/SKILL.md` with install, connect, read, author and export directions.
- Four references for the figma-cli surface, command tiers, optional MCP wiring and troubleshooting.
- Eight scripts: `install.sh`, `connect-safe.sh`, `connect-yolo.sh`, `daemon.sh`, `doctor.sh`, `unpatch.sh`, `print-utcp-snippets.sh` and `_common.sh`.
- A feature catalog and manual testing playbook.
- A human README, an INSTALL_GUIDE and initial release changelog `v0.1.0.0.md`.
- Schema-2 `graph-metadata.json` for the skill.
- Reciprocal sibling graph edges.

### Changed

- The terminal-control skill family gained a Figma skill sibling.
- Install guidance now selects the full repo build of `figma-ds-cli` when the npm publish is too small.
- The command surface now has explicit read-only, mutating and destructive tiers.
- The optional MCP path now points to the community Framelink `figma` manual through Code Mode.

### Fixed

- Prevented the npm naming trap by warning never to install the unrelated `figma-cli` package.
- Prevented unsafe default mutation by keeping destructive commands off the default path and gating mutating verbs.
- Prevented irreversible yolo patching by shipping `unpatch.sh` and keeping safe plugin connect as the default.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS: skill valid |
| Command policy coverage | PASS: every command classified read-only, mutating or destructive |
| Structure parity with siblings | PASS: same SKILL.md, references, catalog, playbook, README and changelog shape |
| Graph registration | PASS: schema-2 metadata plus reciprocal sibling edges |
| Live install | PASS: `figma-ds-cli` 1.2.0 installed from the repo build |
| Code Mode MCP discovery | PASS: `figma` manual exposes `get_figma_data` and `download_figma_images` |
| Voice sweep | PASS: no em dashes and no new prose semicolons |
| `validate.sh --strict` | PASS: 0 errors |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-figma/SKILL.md` | Created | Runtime contract for install, connect, read, author, export, traps and gating |
| `.opencode/skills/mcp-figma/references/figma_cli_reference.md` | Created | figma-cli command surface and daemon model |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | Created | Read-only, mutating and destructive command tiers |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | Created | Optional Code Mode `figma` MCP wiring |
| `.opencode/skills/mcp-figma/references/troubleshooting.md` | Created | Failure paths and recovery |
| `.opencode/skills/mcp-figma/scripts/install.sh` | Created | Full repo build install path |
| `.opencode/skills/mcp-figma/scripts/connect-safe.sh` | Created | Safe plugin connection |
| `.opencode/skills/mcp-figma/scripts/connect-yolo.sh` | Created | Gated app bundle patch connection |
| `.opencode/skills/mcp-figma/scripts/daemon.sh` | Created | Local daemon helper |
| `.opencode/skills/mcp-figma/scripts/doctor.sh` | Created | Diagnostic helper |
| `.opencode/skills/mcp-figma/scripts/unpatch.sh` | Created | Yolo patch rollback |
| `.opencode/skills/mcp-figma/scripts/print-utcp-snippets.sh` | Created | Code Mode wiring snippets |
| `.opencode/skills/mcp-figma/scripts/_common.sh` | Created | Shared script helpers |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | Created | Capability inventory |
| `.opencode/skills/mcp-figma/manual_testing_playbook/manual_testing_playbook.md` | Created | Manual testing scenarios |
| `.opencode/skills/mcp-figma/README.md` | Created | Human-facing overview |
| `.opencode/skills/mcp-figma/INSTALL_GUIDE.md` | Created | Install and safety guide |
| `.opencode/skills/mcp-figma/changelog/v0.1.0.0.md` | Created | Initial release changelog |
| `.opencode/skills/mcp-figma/graph-metadata.json` | Created | Skill graph topics, edges and source docs |
| `mcp-open-design` and `mcp-chrome-devtools` sibling graph metadata | Updated | Reciprocal sibling edges |
| `spec.md` | Created | Phase scope and acceptance record |
| `plan.md` | Created | Skill build plan |
| `tasks.md` | Created | Build task ledger |
| `checklist.md` | Created | Verification checklist |
| `implementation-summary.md` | Created | Phase completion record |

### Follow-Ups

- None.
