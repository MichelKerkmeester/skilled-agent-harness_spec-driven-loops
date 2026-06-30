---
title: "Changelog: Figma Desktop Terminal Control [146-mcp-figma-with-direct-cli-support/root]"
description: "Packet rollup for the research, build and verification of the mcp-figma skill."
trigger_phrases:
  - "146 root changelog"
  - "mcp-figma packet changelog"
  - "figma desktop terminal control"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/003-mcp-figma-with-direct-cli-support` (Level Phase Parent)

### Summary

Spec 146 turned a risky tool question into a shipped terminal-control skill. The packet first established the source of truth: use the silships figma-cli published as `figma-ds-cli`, never the unrelated npm package named `figma-cli`, and treat the CLI as primary while keeping the Figma MCP optional through Code Mode. It then built `.opencode/skills/mcp-figma/` in the same house shape as the sibling terminal-control skills, with safe install paths, gated command tiers, reversible yolo patching and live verification.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| [`001-figma-cli-and-mcp-research`](./changelog-146-001-figma-cli-and-mcp-research.md) | Complete | Five research iterations converged on the CLI-first architecture and captured the npm naming traps. |
| [`002-skill-build-and-registration`](./changelog-146-002-skill-build-and-registration.md) | Complete | Built, registered and live-verified the `mcp-figma` skill with scripts, references, catalog, playbook and graph metadata. |

### Added

- `research/research.md`, five iteration records and an orchestrator verification pass that establish the CLI-first recommendation.
- `.opencode/skills/mcp-figma/`, a new skill for driving Figma Desktop from the terminal.
- A skill runtime contract in `SKILL.md` covering install, connect, read, author and export paths.
- Four references for the figma-cli surface, command tiers, optional MCP wiring and troubleshooting.
- Eight scripts for install, safe connect, yolo connect, daemon control, diagnostics, rollback, UTCP snippets and shared helpers.
- A feature catalog, manual testing playbook, README, INSTALL_GUIDE, initial release changelog and `graph-metadata.json`.

### Changed

- The packet moved from recommendation to shipped skill across its two phases.
- The terminal-control skill family gained a Figma sibling modeled on `mcp-open-design` and `mcp-chrome-devtools`.
- Skill graph metadata gained schema-2 registration plus reciprocal sibling edges.
- The installation guidance now prefers the full repo build of `figma-ds-cli` because npm publishes only a minimal `1.0.0`.

### Fixed

- Resolved the package-name hazard by making the unrelated npm `figma-cli` package a first-class warning.
- Resolved the version-surface hazard by documenting that the full command surface requires the repo build, not the minimal npm publish.
- Resolved the safety boundary by separating read-only, mutating and destructive commands and gating risky paths.

### Verification

| Check | Result |
|-------|--------|
| Phase 001 research iterations | PASS: five iterations produced findings and converged on the same recommendation |
| Phase 001 npm trap capture | PASS: both the package-name trap and version-surface trap were recorded as warnings |
| Phase 001 orchestrator ground-truth | PASS: live-observed capability and transport facts were checked |
| Phase 001 `validate.sh --strict` | PASS: packet validation passed with 15 tasks complete |
| Phase 002 `package_skill.py --check` | PASS: skill package valid |
| Phase 002 command policy coverage | PASS: every command classified read-only, mutating or destructive |
| Phase 002 structure parity | PASS: skill matched the sibling terminal-control shape |
| Phase 002 graph registration | PASS: schema-2 metadata plus reciprocal sibling edges |
| Phase 002 live install | PASS: `figma-ds-cli` 1.2.0 installed from the repo build |
| Phase 002 Code Mode discovery | PASS: `figma` manual exposes `get_figma_data` and `download_figma_images` |
| Phase 002 voice sweep | PASS: no em dashes and no new prose semicolons |
| Phase 002 `validate.sh --strict` | PASS: 0 errors |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `001-figma-cli-and-mcp-research/research/research.md` | Created | Canonical research synthesis for the CLI-first architecture |
| `001-figma-cli-and-mcp-research/research/iterations/iteration-001..005.md` | Created | Per-iteration research findings |
| `001-figma-cli-and-mcp-research/research/iterations/orchestrator-verifications.md` | Created | Ground-truth verification pass |
| `001-figma-cli-and-mcp-research/research/prompts/` | Created | Research prompt materials |
| `001-figma-cli-and-mcp-research/research/raw/` | Created | Raw executor output |
| `001-figma-cli-and-mcp-research/spec.md` | Created | Phase control documentation |
| `001-figma-cli-and-mcp-research/plan.md` | Created | Phase plan |
| `001-figma-cli-and-mcp-research/tasks.md` | Created | Phase task ledger |
| `001-figma-cli-and-mcp-research/implementation-summary.md` | Created | Phase completion record |
| `.opencode/skills/mcp-figma/SKILL.md` | Created | Runtime contract for the Figma terminal-control skill |
| `.opencode/skills/mcp-figma/references/figma_cli_reference.md` | Created | figma-cli command and daemon reference |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | Created | Read-only, mutating and destructive command tiers |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | Created | Optional Code Mode `figma` MCP wiring |
| `.opencode/skills/mcp-figma/references/troubleshooting.md` | Created | Failure paths and recovery guidance |
| `.opencode/skills/mcp-figma/scripts/` | Created | Install, connection, daemon, doctor, rollback and wiring helpers |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | Created | Skill capability inventory |
| `.opencode/skills/mcp-figma/manual_testing_playbook/manual_testing_playbook.md` | Created | Operator validation scenarios |
| `.opencode/skills/mcp-figma/README.md` | Created | Human-facing overview and FAQ |
| `.opencode/skills/mcp-figma/INSTALL_GUIDE.md` | Created | Phase-based install and safety guide |
| `.opencode/skills/mcp-figma/changelog/v0.1.0.0.md` | Created | Initial release changelog |
| `.opencode/skills/mcp-figma/graph-metadata.json` | Created | Skill graph topics and edges |
| `mcp-open-design`, `mcp-chrome-devtools` sibling graph metadata | Updated | Reciprocal sibling edges |
| `002-skill-build-and-registration/spec.md` | Created | Phase control documentation |
| `002-skill-build-and-registration/plan.md` | Created | Phase plan |
| `002-skill-build-and-registration/tasks.md` | Created | Phase task ledger |
| `002-skill-build-and-registration/checklist.md` | Created | Phase verification checklist |
| `002-skill-build-and-registration/implementation-summary.md` | Created | Phase completion record |

### Follow-Ups

- None.
