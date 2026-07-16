---
title: "Resource Map: Code-Graph Extraction Touchpoints (ADR-001 locked)"
description: "Tabular catalog of every code-graph touchpoint with final disposition (move / update / stay-and-rewire / never-move) locked by ADR-001. 280+ touchpoints across 20 categories."
trigger_phrases:
  - "code graph extraction resource map"
  - "code-graph touchpoint inventory"
importance_tier: "important"
contextType: "reference"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/002-extraction-design-and-decision-record"
    last_updated_at: "2026-05-14T10:00:00Z"
    last_updated_by: "claude"
    recent_action: "Finalized resource map with ADR-001 dispositions"
    next_safe_action: "Child 002 scaffold system-code-graph skill"
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->
# Resource Map: Code-Graph Extraction Touchpoints

<!-- SPECKIT_LEVEL: 2 -->

Final disposition catalog. All `tbd` markers resolved by ADR-001. Disposition counts: ~170 move, ~90 update, ~25 stay-and-rewire, ~5 never-move.

## Legend

| Disposition | Meaning |
|-------------|---------|
| `move` | File physically relocates to `.opencode/skills/system-code-graph/` (git mv preserves history) |
| `update` | File stays in place; import paths / tool-id references / doc text update |
| `stay-and-rewire` | File stays in place AND has structural changes (handlers that import code-graph symbols) |
| `never-move` | Shared resource that must not move (e.g., other subsystems' DBs, shared configs) |
| `tbd` | Disposition pending ADR-001 |

## READMEs

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | code | move | package overview |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/README.md` | code | move | lib module index |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/README.md` | code | move | handler dispatch overview |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/README.md` | code | move | tool surface |

## Documents (system-spec-kit references that mention code-graph)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | doc | update | sections covering graphQualitySummary, fallback to session_bootstrap |
| `.opencode/skills/system-spec-kit/references/config/environment_variables.md` | doc | update | code-graph env vars (`SPECKIT_PARSER_SKIP_LIST_ENABLED`, `SPECKIT_PARSER`, etc.) |
| `.opencode/skills/system-spec-kit/references/memory/memory_system.md` | doc | update | L6 analysis layer code-graph mentions |
| `.opencode/skills/system-spec-kit/SKILL.md` | doc | update | code-graph references |
| `.opencode/skills/system-spec-kit/README.md` | doc | update | code-graph feature summary |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | doc | update | code-graph handler refs |
| `README.md` (repo root) | doc | update | §2 (COCOINDEX + CODE GRAPH), §4 (Maintainer-Mode Flags), §5 (startup injection + lazy refresh) |
| `CLAUDE.md` | doc | update | fallback recovery section + /doctor surface |
| `AGENTS.md` | doc | update | mirror of CLAUDE.md |
| `opencode.json` | config | update | note #8 (_NOTE_8_CODE_GRAPH_SCOPE) |

## Documents — Feature Catalog (category 22)

(Inventory: 33 files under `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/`; deep-research enumerates each with disposition.)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.../feature_catalog/22--*/01-category-overview.md` through `30-coverage-graph-query.md` | doc | tbd | 33 files (some are code-graph core, some are coverage/skill-graph related; ADR-001 decides per-file split) |

## Documents — Manual Testing Playbook (category 22)

(Inventory: 30 files under `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/`; deep-research enumerates each.)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.../manual_testing_playbook/22--*/248-precompact-hook.md` through `286-coverage-graph-query.md` | doc | tbd | 30 files; same split concern as feature catalog |

## Documents — In-package code-graph docs

(Inventory: 16 files under `.opencode/skills/system-spec-kit/mcp_server/code_graph/{feature_catalog,manual_testing_playbook}/`; all move with code_graph/ as a unit.)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/code_graph/feature_catalog/*` | doc | move | in-package feature docs |
| `mcp_server/code_graph/manual_testing_playbook/*` | doc | move | in-package test docs |

## Commands

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/commands/spec_kit/deep-research.md` | command | update | allowed-tools: code_graph_query, code_graph_context |
| `.opencode/commands/spec_kit/deep-review.md` | command | update | same |
| `.opencode/commands/memory/search.md` | command | update | code-graph bridging in memory retrieval |
| `.opencode/commands/memory/README.txt` | command | update | tool ownership matrix |
| `.opencode/commands/doctor.md` | command | update | code-graph target in router |
| `.opencode/commands/doctor/_routes.yaml` | command | update | code-graph target → doctor_code-graph.yaml |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml` | command | move | code-graph diagnostic workflow |
| `.opencode/commands/doctor/update.md` | command | update | dependency-ordered update includes code-graph tier |

## Agents

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/agents/context.md` | agent | update | tools: code_graph_query, code_graph_context, code_graph_status |
| `.opencode/agents/deep-research.md` | agent | update | code-graph tools in research loop |
| `.opencode/agents/deep-review.md` | agent | update | code-graph tools in review loop |
| `.claude/agents/context.md` | agent | update | Claude runtime mirror |
| `.claude/agents/deep-review.md` | agent | update | Claude deep-review mirror |
| `.gemini/agents/context.md` | agent | update | Gemini runtime mirror |
| `.gemini/agents/deep-review.md` | agent | update | Gemini deep-review mirror |
| `.codex/agents/context.toml` | agent | update | Codex runtime mirror |
| `.codex/agents/deep-research.toml` | agent | update | Codex research mirror |
| `.codex/agents/deep-review.toml` | agent | update | Codex review mirror |

## Skills (cross-references)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/skills/deep-research/changelog/v1.6.0.0.md` | skill | update | provisioning of code-graph tools in command LEAF-tool budget |
| `.opencode/skills/deep-review/changelog/v1.3.0.0.md` | skill | update | same |
| `.opencode/skills/mcp-coco-index/README.md` | skill | update | code-graph vs CocoIndex decision matrix |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | skill | update | search pattern reference |
| `.opencode/skills/system-code-graph/.gitkeep` | skill | n/a | placeholder confirms destination is approved |

## Specs

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| This packet (014-extraction-design-and-decision-record/) | spec | n/a | the research packet itself |
| `005-code-graph/002-code-graph-self-contained-package/` | spec | n/a | superseded by 014 |
| `005-code-graph/` (parent) | spec | update | phase map appends 014 row |

## Scripts

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/skills/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` | script | update | scope-validation mentions |
| `.opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | script | update | code-graph scenario execution |

## Tests

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/code_graph/tests/*.vitest.ts` (28 files + gold-queries asset) | test | move | full code-graph vitest suite |
| `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` | test | move | outside code_graph/ but code-graph-owned |

## Config

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/vitest.config.ts` (lines 20-21) | config | update | test-discovery patterns reference `mcp_server/code_graph/tests/**` AND `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` |
| `mcp_server/core/config.ts` (DATABASE_DIR resolution, lines 33-109) | config | never-move | Stays for memory DB; code-graph resolves its own DB from new skill config |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | config | move | Moves to system-code-graph/plugins/; BRIDGE_PATH updated in child 004 |
| `mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` | config | never-move | Shared by skill-advisor bridge too |
| `mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` | config | move | Code-graph-specific bridge; moves with plugin |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | config | never-move | Skill-advisor bridge (not code-graph) |

## Database

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/database/code-graph.sqlite` (+ -wal, -shm) | data | move | 55 MB live index; moves to `system-code-graph/database/`; env fallback `SPECKIT_CODE_GRAPH_DB_DIR` |
| `mcp_server/database/speckit-eval.db` | data | never-move | other subsystem |
| `mcp_server/database/context-index__*.sqlite` | data | never-move | memory subsystem |
| `mcp_server/database/skill-graph.sqlite` | data | never-move | skill-advisor subsystem |

## Constitutional

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md` | constitutional | update | always-on code-graph context injection rule |

## Meta (this extraction's own metadata)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `.../013-system-code-graph-extraction/spec.md` | meta | n/a | parent manifest |
| `.../013-system-code-graph-extraction/description.json` | meta | n/a | parent description |
| `.../013-system-code-graph-extraction/graph-metadata.json` | meta | n/a | parent graph metadata |
| `.../014-extraction-design-and-decision-record/{spec,plan,tasks,checklist}.md` | meta | n/a | child packet docs |

## Cross-subsystem integration handlers (stay in system-spec-kit; re-wire imports)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/handlers/memory-search.ts` | code | stay-and-rewire | imports `getGraphReadinessSnapshot()` from `code_graph/lib/ensure-ready.js` |
| `mcp_server/handlers/session-resume.ts` | code | stay-and-rewire | imports `graphDb.*`, `getGraphFreshness()` |
| `mcp_server/handlers/session-bootstrap.ts` | code | stay-and-rewire | imports ops-hardening from code_graph |
| `mcp_server/handlers/session-health.ts` | code | stay-and-rewire | ops-hardening import |
| `mcp_server/handlers/memory-context.ts` | code | stay-and-rewire | imports `classifyQueryIntent()`, `buildContext()` |
| `mcp_server/context-server.ts` | code | stay-and-rewire | imports `graphDb`, `detectRuntime` |
| `mcp_server/tool-schemas.ts` | code | stay-and-rewire | code-graph tool schema definitions |
| `mcp_server/tools/index.ts` | code | stay-and-rewire | dispatcher registration |

## Hooks (stay in system-spec-kit; re-wire imports)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/hooks/memory-surface.ts` | code | stay-and-rewire | code-graph data refs |
| `mcp_server/hooks/claude/compact-inject.ts` | code | stay-and-rewire | startup-injection |
| `mcp_server/hooks/claude/session-prime.ts` | code | stay-and-rewire | startup-injection |
| `mcp_server/hooks/gemini/session-prime.ts` | code | stay-and-rewire | startup-injection |
| `mcp_server/hooks/gemini/compact-cache.ts` | code | stay-and-rewire | compaction refresh |
| `mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | code | stay-and-rewire | codex freshness fallback |

## Newly discovered touchpoints (research enrichment)

| Path | Category | Disposition | Notes |
|------|----------|-------------|-------|
| `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | test | move | stress test |
| `mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts` | test | move | stress test |
| `mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts` | test | move | stress test |
| `mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts` | test | move | stress test |
| `mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts` | test | move | stress test |
| `mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | test | stay-and-rewire | imports from code_graph handlers |
| `mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | test | stay-and-rewire | imports from code_graph handlers |
| `mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` | test | stay-and-rewire | imports from code_graph lib |
| `mcp_server/tests/code-graph-apply-e2e.vitest.ts` | test | stay-and-rewire | imports from code_graph lib |
| `mcp_server/tests/code-graph-recovery-procedures.vitest.ts` | test | stay-and-rewire | imports from code_graph lib |
| `mcp_server/tests/code-graph-gold-battery.vitest.ts` | test | stay-and-rewire | imports from code_graph lib |
| `mcp_server/tests/code-graph-query-fallback-decision.vitest.ts` | test | stay-and-rewire | imports from code_graph handlers |
| `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | test | stay-and-rewire | imports from code_graph |
| `mcp_server/tests/code-graph-db.vitest.ts` | test | stay-and-rewire | imports from code_graph lib |
| `mcp_server/lib/session/session-snapshot.ts` (lines 10-11) | code | stay-and-rewire | imports getStats(), getGraphFreshness() |
| `mcp_server/skill_advisor/lib/freshness/trust-state.ts` (line 44) | code | stay-and-rewire | type-export from code_graph (type-only) |
| `mcp_server/skill_advisor/bench/code-graph-parse-latency.bench.ts` | code | stay-and-rewire | bench import (not functional) |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | config | move | plugin .js (added to plugin bridges section above) |

## Verified counts (post-research)

- Code files (move): 71 TS files in `code_graph/` + 6 stress test TS files + tools/index.ts + barrel exports = ~80 TS files move; all 111 code_graph/ tree entries move as unit
- DB files (move): 3 (code-graph.sqlite + wal + shm) → `.opencode/skills/system-code-graph/database/`; 7 exclusive tables
- MCP tools: 12 stable (code_graph_scan, query, status, context, verify, apply, detect_changes, ccc_status, ccc_reindex, ccc_feedback + 2 future phase slots)
- Cross-subsystem handlers (stay-and-rewire): 5 + context-server + tools/index.ts + tool-schemas.ts = 8
- Hooks (stay-and-rewire): 6
- Top-level docs (update): 4
- Commands (update): 5 + 3 doctor sub-files = 8
- Agents (update): 10 across 4 runtimes
- Skill cross-refs (update): 3
- Constitutional rules (update): 1
- system-spec-kit references (update): 3
- Feature catalog cat-22 (split move/update): 33 (9 code-graph core move, 24 shared context/hooks/skill_advisor update)
- Manual testing playbook cat-22 (split move/update): 30
- In-package docs (move with code_graph/): 37 (4 READMEs + 16 feature catalog + 11 playbook + main README + 2 catalog indexes + 3 doc roots)
- Scripts (update): 2
- External test files (stay-and-rewire): 9
- Session snapshot (stay-and-rewire): 1
- Skill advisor refs (stay-and-rewire): 2 (type + bench)
- Config files (mix): 5 + 1 opencode.json + 1 vitest.config.ts = 7
- Plugin bridges (mix): 4 (1 move plugin .js, 1 move bridge .mjs, 1 never-move shared schema, 1 never-move advisor bridge)

**Total verified touchpoint count: 280+**. ADR-001 locks all dispositions.
