---
title: "Changelog: 004-release-and-program-cleanup"
description: "028 doc-alignment sweep closed across all 8 doc groups (3x systems): commands, agent rosters, skill references, ENV_REFERENCE, feature catalogs, playbooks, and three release changelog entries. SC-001/SC-002 green. 028 CLI stress set 434-438 all passed."
trigger_phrases:
  - "028 release cleanup changelog"
  - "004 release and program cleanup changelog"
  - "cli transition doc cleanup changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/004-release-and-program-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition`

### Summary

The 028 documentation surface was fully aligned to the shipped dual-stack reality across all three systems (spec-memory, code-index, skill-advisor) and all eight doc groups. The work ran in three waves: waves 1-2 covered skill/code/root READMEs, ENV_REFERENCE CLI env-var rows, feature catalogs, manual-testing playbooks (including 028 CLI stress set 434-438), and the three release changelogs. Wave 3 used three parallel Fable 5 agents on disjoint paths to close commands, agent rosters, and skill references. SC-001 (stale-claim grep) and SC-002 (bidirectional ENV_REFERENCE-vs-code diff) both passed. All five 028 stress scenarios passed triple-verified.

### Added

- `.opencode/plugins/mk-spec-memory.js` — OpenCode plugin surface (waves 1-2)
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` — CLI/IPC bridge (waves 1-2)
- Feature catalog entries and manual-testing playbook rows (434-438) for all three CLI surfaces

### Changed

- `.opencode/commands/doctor/{_routes.yaml,assets/doctor_skill-advisor.yaml,assets/doctor_skill-budget.yaml}` — `--warm-only` added so probes never spawn a daemon (wave 3)
- `.opencode/commands/memory/{manage,save,search,learn}.md`, `memory/README.txt` — `spec-memory` CLI warm-only fallback and exit-75 recovery rows (wave 3)
- `.opencode/commands/speckit/{resume,plan,complete,implement}.md`, `speckit/assets/*.yaml` — transport-down CLI-fallback references (wave 3)
- 12 reference files under `system-spec-kit/`, `system-code-graph/`, `system-skill-advisor/references/` — CLI-reference and hook-fallback alignment (wave 3 + T060)
- `AGENTS.md` — transport-down fallback guidance (waves 1-2)
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` — phase-close reconciliation
- Parent `spec.md` — phase map row for 004 marked Complete

### Fixed

- `doctor_memory.yaml` / `doctor_code-graph.yaml` — CLI-probe gap closed (operator sign-off REQ-004): warm-only `cli_health_command`/`cli_health_policy` + route-action + `_routes.yaml` `script_invocations` rows added; `spec-memory.cjs memory_health --warm-only` and `code-index.cjs code_graph_status --warm-only` smoke-verified exit 75

### Verification

| Check | Result |
|-------|--------|
| SC-001 stale-claim grep | PASS — 0 sole-path MCP assertions, 0 live Gemini/Devin references |
| SC-002 ENV_REFERENCE bidirectional diff | PASS — all 11 CLI env vars documented, 0 missing, 0 phantom |
| Playbook count self-check | PASS — deterministic count 399 = expected |
| Stress 434 concurrent dual-client | PASS — 9/9 suite executions across 3 rounds, launcher delta 0 |
| Stress 435 warm-only churn | PASS — 0/60 non-75 probes, lifecycle suite green, launcher delta 0 |
| Stress 436 large-payload | PASS — 75,538 bytes, 1 stable hash across 10 reps, 0 parse-fails |
| Stress 437 numeric coercion | PASS — 8x exit-75 (coerced) / 4x exit-64 (rejected), matrix correct |
| Stress 438 trust-gate fuzz | PASS — 9x exit-64 untrusted / 5x exit-75 controls, gate holds all shapes |
| `validate.sh --strict` (this folder + parent) | PASS (exit 0) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/commands/doctor/_routes.yaml` + 2 doctor assets | Modified | `--warm-only` added to CLI probes |
| `.opencode/commands/memory/*.md` + `README.txt` | Modified | `spec-memory` CLI fallback and exit-75 recovery rows |
| `.opencode/commands/speckit/*.md` + 2 YAML assets | Modified | Transport-down CLI-fallback references |
| 12 skill reference files (system-spec-kit + system-code-graph + system-skill-advisor) | Modified | CLI-reference and hook-fallback alignment |
| `AGENTS.md` | Modified | Transport-down fallback guidance |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (T060) | Modified | All 11 CLI env vars documented |
| `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modified | Phase-close reconciliation |
| Parent `spec.md` | Modified | Phase map row 004 → Complete |

### Follow-Ups

- Three out-of-028-scope defects reported but not fixed (scope lock): `.claude/agents/` frontmatter grants mismatch for `mk-spec-memory`; `launcher_lease.md` §1 wording vs `bridgeOrReportLeaseHeld()` behavior; typo "spec docss" in `speckit/implement.md`. Flagged for a follow-on packet.
- T9xx transport-down drills tracked by the workstream phases; tri-daemon drill already passed under `003/002-hardening`
