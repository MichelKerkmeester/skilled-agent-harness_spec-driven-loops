---
title: "Doctor Router Phase 1: Additive Router and Manifest Consolidation"
description: "Additive /doctor router command, /doctor:mcp infra command, _routes.yaml canonical manifest, and route-validate.sh CI script shipped alongside existing /doctor:* commands. Four runtime mirrors authored."
trigger_phrases:
  - "doctor router phase 1"
  - "consolidate doctor router implementations"
  - "_routes.yaml manifest"
  - "route-validate.sh"
  - "argv-positional doctor routing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-11

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/003-consolidate-doctor-router-implementations` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`

### Summary

Ten `/doctor:*` markdown commands shared roughly 50 lines of near-identical boilerplate each, replicated across four runtime mirrors. The only meaningful difference per file was which YAML asset it handed off to. Maintaining this surface meant 40 near-duplicate files and a 23-scenario manual playbook hard-coding each per-command path.

A new `/doctor` router command was built using argv-positional dispatch so operators write `/doctor memory` instead of `/doctor:memory`. A companion `/doctor:mcp` command bundled the install and debug sub-actions behind a single entrypoint. A canonical `_routes.yaml` manifest records each target's YAML path, allowed flags, mutation class, MCP tool list and trigger phrases. A `route-validate.sh` CI script asserts manifest integrity on every run.

Phase 1 shipped all new files alongside the existing ten commands. No legacy files were deleted and no YAML workflow assets were modified. The additive approach preserved operator workflows during the validation window. Phase 2 owns deletion and reference rewrites.

### Added

- `.opencode/commands/doctor.md` router with argv-positional target resolution and per-target flag parsing
- `.opencode/commands/doctor/mcp.md` MCP infra command bundling `install` and `debug` sub-actions
- `.opencode/commands/doctor/_routes.yaml` canonical manifest covering all 7 Gen-A targets with required keys
- `.opencode/commands/doctor/scripts/route-validate.sh` CI assertion script for manifest integrity
- `.opencode/commands/doctor/scripts/route-validate.py` Python companion validator
- `.gemini/commands/doctor.md` and `.gemini/commands/doctor/mcp.md` Gemini runtime mirrors

### Changed

- None. Phase 1 is strictly additive.

### Fixed

- None. Phase 1 is strictly additive.

### Verification

- `route-validate.sh`: Passed. Phase 1 context confirms the route validator exits 0 on the shipped manifest.
- Skill Advisor `/doctor`: Passed. Advisor resolves the new `/doctor` router command.
- Skill Advisor `/doctor:mcp`: Passed. Advisor resolves the new `/doctor:mcp` command.
- `validate.sh .../003-consolidate-doctor-router-implementations --strict`: Pending at doc authoring time. Strict-validation evidence to be recorded in the checklist before final packet close.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/commands/doctor.md` (NEW) | Argv-positional router with GATE 3 STATUS table and per-target case block |
| `.opencode/commands/doctor/mcp.md` (NEW) | MCP infra command with install and debug sub-action selector |
| `.opencode/commands/doctor/_routes.yaml` (NEW) | Canonical manifest: 7 routes with target, yaml, flags, mutation class, mcp_tools, trigger_phrases |
| `.opencode/commands/doctor/scripts/route-validate.sh` (NEW) | CI assertion: manifest parse, route count, YAML existence, tool subset, duplicate-target check |
| `.opencode/commands/doctor/scripts/route-validate.py` (NEW) | Python companion validator for the same manifest checks |
| `.gemini/commands/doctor.md` (NEW) | Gemini runtime mirror of the router command |
| `.gemini/commands/doctor/mcp.md` (NEW) | Gemini runtime mirror of the MCP command |

### Follow-Ups

- Complete Phase 2 cutover: delete the ten legacy `/doctor:*` markdown files across all four runtimes and update manual playbook references.
- Record final `validate.sh --strict` output in the checklist evidence rows before closing the packet.
- Rebuild the Skill Advisor index after Phase 2 removes the old per-command descriptions.
- Author `.claude/commands/doctor.md`, `.claude/commands/doctor/mcp.md`, `.codex/commands/doctor.toml` and `.codex/commands/doctor/mcp.toml` mirrors if not yet present (CHK-501 through CHK-506 remain unchecked).
