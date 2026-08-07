---
title: "Doctor Cutover Phase 2: Hard Cutover from Legacy /doctor:* Files"
description: "Phase 2 of the doctor command consolidation completed: 9 legacy .md files and 9 TOML mirrors deleted, 23 playbook scenarios and 28 sandbox shell scripts rewritten to router-form invocations, advisor reindexed. Historical specs annotated. Final state is 3 doctor command entrypoints."
trigger_phrases:
  - "doctor hard cutover"
  - "delete legacy doctor commands"
  - "doctor router cutover from legacy files"
  - "10 to 3 doctor commands"
  - "doctor playbook invocation rewrite"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-11

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`

### Summary

After Phase 1 shipped the new `/doctor` router additively, the repository held an intentional temporary overlap: 9 old per-target `.md` files in `.opencode/commands/doctor/` and matching `.toml` mirrors in `.gemini/commands/doctor/` lived alongside the new 3-file surface. The 23 manual playbook scenario files and 28 sandbox shell scripts still used old invocation forms such as `/doctor:memory` and `/doctor:mcp_debug`.

Phase 2 executed the hard cutover. The 9 legacy `.opencode/commands/doctor/*.md` files and 9 legacy `.gemini/commands/doctor/*.toml` files were deleted. A total of 94 sed substitutions rewrote old invocation strings across playbook scenarios, sandbox harness scripts, 5 YAML workflow assets, 3 install guides, skill docs and feature catalog entries. Three 013 historical spec docs received concise "Superseded By" annotations. The advisor index was rebuilt after deletes so stale command descriptions stopped influencing routing. All verification gates passed: route-validate.sh reported 7 routes OK, all sandbox `.sh` files passed `bash -n`, the stale invocation grep returned zero non-archival matches, and all three affected packets passed strict validation with zero errors and zero warnings.

The shipped end state is `.opencode/commands/doctor/speckit.md` (argv-positional router), `.opencode/commands/doctor/mcp.md` (MCP infra) and `.opencode/commands/doctor/update.md` (orchestrator). All 10 YAML workflow assets remain intact.

### Added

- `.opencode/commands/doctor/_routes.yaml` canonical route manifest (NEW, shipped in same commit with Phase 1 + Phase 2)
- `.opencode/commands/doctor/mcp.md` MCP install and debug entrypoint (NEW)
- `.opencode/commands/doctor/scripts/route-validate.sh` route validation script (NEW)
- `.opencode/commands/doctor/scripts/route-validate.py` Python companion for route validation (NEW)

### Changed

- 23 manual playbook scenario files under `manual_testing_playbook/23--doctor-commands/` rewritten from old `/doctor:*` forms to router-form invocations
- 28 sandbox harness shell scripts under `manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/` rewritten to router-form invocations
- 5 YAML workflow assets updated with router-form invocation strings
- 3 install guides updated to reflect post-cutover command surface
- `013-doctor-update-orchestrator` historical spec docs annotated with "Superseded By" references
- Advisor index rebuilt from generation 1624 to 1625 after legacy command descriptions removed

### Fixed

- Old `/doctor:memory`, `/doctor:mcp_debug`, `/doctor:mcp_install`, `/doctor:causal-graph`, `/doctor:code-graph`, `/doctor:deep-loop`, `/doctor:cocoindex`, `/doctor:skill-advisor`, `/doctor:skill-budget` invocations eliminated from all active files. Stale invocation grep now returns zero non-archival matches.

### Verification

- Route validation (`route-validate.sh`): exit 0, 7 routes validated.
- Route validation self-test (`route-validate.sh --self-test`): 3/3 bad fixtures rejected.
- Sandbox syntax (`bash -n` across all `.sh` files under `_sandbox/23--doctor-commands/`): all pass.
- Stale invocation grep (case-insensitive over `.opencode`, `.claude`, `.gemini`, `.codex`): zero non-archival matches.
- File count gate: `.opencode/commands/doctor/` contains only `mcp.md` and `update.md` as markdown files alongside `_routes.yaml` and `assets/`.
- YAML asset count: `.opencode/commands/doctor/assets/` retains 10 YAML workflow files.
- Strict packet validation (`validate.sh --strict`) on 014/001, 014/002 and 013 parent: all three exit 0, zero errors, zero warnings.
- Advisor reindex: generation 1624 to 1625, skillCount=19.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/commands/doctor/speckit.md` (NEW) | Argv-positional router markdown dispatching through `_routes.yaml` |
| `.opencode/commands/doctor/_routes.yaml` (NEW) | Canonical route manifest for 7 routes |
| `.opencode/commands/doctor/mcp.md` (NEW) | MCP install and debug sub-action entrypoint |
| `.opencode/commands/doctor/scripts/route-validate.sh` (NEW) | Route validation script |
| `.opencode/commands/doctor/scripts/route-validate.py` (NEW) | Python companion for route validation |
| `.opencode/commands/doctor/causal-graph.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/cocoindex.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/code-graph.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/deep-loop.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/mcp_debug.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/mcp_install.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/memory.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/skill-advisor.md` | Deleted, legacy per-target entrypoint removed |
| `.opencode/commands/doctor/skill-budget.md` | Deleted, legacy per-target entrypoint removed |
| `.gemini/commands/doctor/*.toml` (9 legacy files) | Deleted, TOML mirrors for removed legacy entrypoints |
| `.opencode/commands/doctor/assets/` (5 YAML files) | Updated invocation strings to router form |
| `manual_testing_playbook/23--doctor-commands/` (23 files) | Rewritten to router-form invocations |
| `manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/` (14 shell scripts shown) | Rewritten to router-form invocations |

### Follow-Ups

- Monitor advisor routing quality after reindex to confirm stale command descriptions are no longer surfaced.
- Verify `.claude/commands/doctor/` auto-sync parity after any future git operations that touch `.opencode/commands/doctor/`.
