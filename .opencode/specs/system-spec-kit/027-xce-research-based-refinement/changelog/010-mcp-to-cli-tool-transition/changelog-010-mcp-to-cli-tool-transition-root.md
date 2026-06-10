---
title: "Changelog: 010-mcp-to-cli-tool-transition (phase rollup)"
description: "Complete rollup for the MCP-to-CLI tool transition phase: dual-stack CLI front-doors over all 3 MCP daemons (spec-memory 37 tools / code-index 8 tools / skill-advisor 9 tools), hardening suites, runtime hook integration, tri-daemon drill passed, and full doc-alignment sweep."
trigger_phrases:
  - "010 mcp to cli transition rollup"
  - "028 cli workstream complete"
  - "dual stack cli changelog root"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition` (Phase Parent)

### Summary

Phase 010 delivered dual-stack CLI front-doors over all three MCP daemons in the system-spec-kit infrastructure layer: mk-spec-memory (37 tools), mk-code-index (8 tools), and mk-skill-advisor (9 tools). Each daemon gained a research phase confirming GO with zero feature loss, a CLI core phase shipping a manifest-backed IPC client with auto-spawn, a hardening phase locking critical safety contracts in Vitest, and a runtime integration phase wiring warm-only fallback into Claude and Codex prompt-time hooks. The tri-daemon spawn drill — which exercises all three launchers auto-spawning simultaneously with per-launcher single-owner, respawn-lock serialization, and zero orphans — passed as the program gate. A final doc-alignment sweep (phase 004) closed all eight doc groups across all three systems, verified SC-001 and SC-002, and executed the 028 CLI stress scenarios (434-438) with all passing.

### Included Phases

| Phase | Title | Date | Status |
|-------|-------|------|--------|
| `001-spec-memory-cli` | spec-memory lane: research, core, hardening, runtime | 2026-06-06 to 2026-06-09 | Complete |
| `001/000-spec-memory-cli-research` | Feasibility research (4 runs, GO verdict) | 2026-06-06 | Complete |
| `001/001-cli-core` | CLI core: shim, IPC, 37 subcommands | 2026-06-07 | Complete |
| `001/002-hardening-and-tests` | Hardening: dual-spawn, dual-client, lifecycle, parity | 2026-06-09 | Complete |
| `001/003-runtime-integration` | Runtime: hooks, plugin bridge, allowlists | 2026-06-09 | Complete |
| `002-code-index-cli` | code-index lane: research, core, hardening, runtime | 2026-06-06 to 2026-06-09 | Complete |
| `002/000-code-index-cli-research` | Feasibility research (10 iterations, GO verdict) | 2026-06-06 | Complete |
| `002/001-cli-core` | CLI core: manifest, shim, blocked-read | 2026-06-09 | Complete |
| `002/002-hardening-and-tests` | Hardening: 6 suites, bridge repair | 2026-06-09 | Complete |
| `002/003-runtime-integration` | Runtime: bridge repair, hooks, maintenance block | 2026-06-09 | Complete |
| `003-skill-advisor-cli` | skill-advisor lane: research, core, hardening, runtime | 2026-06-06 to 2026-06-10 | Complete |
| `003/000-skill-advisor-cli-research` | Feasibility research (10 iterations, GO verdict) | 2026-06-06 | Complete |
| `003/001-cli-core` | CLI core: 9 commands, trusted-mutation gate | 2026-06-09 | Complete |
| `003/002-hardening-and-tests` | Hardening: parity, job semantics, orphan reaping, tri-daemon drill | 2026-06-09 | Complete |
| `003/003-runtime-integration` | Runtime: hooks, bridge, doctor probes, Gate-2 guidance | 2026-06-10 | Complete |
| `004-release-and-program-cleanup` | Doc alignment: 8 groups × 3 systems, SC-001/SC-002, stress set | 2026-06-10 | Complete |

### Added

- 3 CLI entrypoints: `spec-memory-cli.ts`, `code-index-cli.ts`, `skill-advisor-cli.ts`
- 3 manifest modules: `code-index-cli-manifest.ts`, `skill-advisor-cli-manifest.ts` (spec-memory uses runtime generation)
- 3 stable executable shims: `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, `.opencode/bin/skill-advisor.cjs`
- 3 warm-only CLI fallback helpers wired into Claude and Codex prompt-time hooks
- 2 OpenCode plugins and CLI/IPC bridges (spec-memory, code-graph)
- Hardening suites across all three lanes (spec-memory: 4 suites, 10 tests; code-index: 6 suites, 16 tests; skill-advisor: 5 suites + shared utils, 9 + 1 drill)
- Tri-daemon spawn drill (`tri-daemon-drill.vitest.ts`) as the program gate
- Read-only doctor CLI probes for advisor status and skill-budget
- Feature catalog entries and manual-testing playbook rows (434-438) for all three CLI surfaces
- 11 CLI env vars documented in `ENV_REFERENCE.md`

### Changed

- `mk-code-graph-bridge.mjs` — repaired from reverted in-process import approach to CLI/IPC route
- Claude/Codex hook files (session-prime, compact-inject, session-stop, session-start, user-prompt-submit) — warm-only CLI fallback paths added across all three systems
- Runtime allowlists (`.codex/settings.json`, `.claude/settings.local.json`)
- `AGENTS.md` — transport-down fallback and maintenance-tool policy guidance
- 8 doc groups (commands, agent rosters, references, ENV_REFERENCE, catalogs, playbooks, changelogs, skill READMEs) aligned to dual-stack reality
- `SKILL.md`, `README.md` for skill-advisor — Gate-2 facade-vs-CLI guidance
- `doctor_skill-advisor.yaml`, `doctor_skill-budget.yaml`, `_routes.yaml`, `doctor_memory.yaml`, `doctor_code-graph.yaml` — warm-only CLI probes

### Fixed

- `mk-code-graph-bridge.mjs` — removed dual-writer hazard (in-process dist/DB imports); replaced with CLI/IPC route
- `doctor_memory.yaml`, `doctor_code-graph.yaml` — CLI-probe gap closed (REQ-004); warm-only `cli_health_command` rows added and smoke-verified

### Verification

| Check | Result |
|-------|--------|
| spec-memory research: all 4 runs terminal | PASS — 0 unresolved |
| code-index research: 10/10 forced iterations | PASS — GO verdict |
| skill-advisor research: 10/10 forced iterations | PASS — GO verdict, 824.8ms one-shot ban established |
| CLI cores: manifest parity (37 / 8 / 9 commands) | PASS across all three |
| Hardening suite totals (10 + 16 + 9 + 1 drill) | PASS — all green in sandbox |
| Tri-daemon drill (program gate) | PASSED 1/1: per-launcher single-owner, respawn-lock serialization, zero orphans |
| Hook smoke (fail-open + warm, all three systems) | PASS |
| Bridge warm smokes | PASS (spec-memory: `status ok`; code-index: real payload; skill-advisor: fallback route) |
| SC-001 stale-claim grep | PASS — 0 sole-path MCP assertions |
| SC-002 ENV_REFERENCE bidirectional diff | PASS — 11 CLI env vars, 0 missing, 0 phantom |
| Stress scenarios 434-438 | All PASS (triple-verified) |
| `validate.sh --strict` (all closed phases) | PASS (exit 0) |

### Files Changed

See per-lane root changelogs and per-leaf changelogs for full file tables:
- `changelog-010-001-spec-memory-cli-root.md` (4 phases)
- `changelog-010-002-code-index-cli-root.md` (4 phases)
- `changelog-010-003-skill-advisor-cli-root.md` (4 phases)
- `changelog-010-004-release-and-program-cleanup.md`

### Follow-Ups

- Dual-stack observation windows remain open across all three systems by design; MCP registrations stay untouched during this window
- Final program-level multi-runtime transport-down drill remains as tracked follow-on work
- Three out-of-028-scope defects reported not fixed: `.claude/agents/` frontmatter grant mismatch for `mk-spec-memory`; `launcher_lease.md` §1 wording vs `bridgeOrReportLeaseHeld()` behavior; typo "spec docss" in `speckit/implement.md`
