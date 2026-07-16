---
title: "Resource Map — Doctor apply-mode (Phase B) [system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-implementation/resource-map]"
description: "Flat inventory of files this packet touched. Implementation by cli-codex gpt-5.5 high fast on 2026-05-08."
trigger_phrases:
  - "doctor apply-mode resource map"
  - "026/007/013 resource map"
importance_tier: "normal"
contextType: "general"
---
# Resource Map — Doctor apply-mode (Phase B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

## New library modules

| Path | Purpose |
|------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts` | State machine, operation dispatcher, rollback executor, dry-run support, audit event writer. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/gold-battery-runner.ts` | Loader for `code-graph-gold-queries.json`; pass-policy evaluator. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/recovery-procedures.ts` | Typed CG-RP-001 / 002 / 003 implementations. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/exclude-rule-classifier.ts` | Loader for `exclude-rule-confidence.json`; tier classification. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-metadata.ts` | Persists last-run metadata for `code_graph_status` projection. |

## New MCP handler

| Path | Purpose |
|------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/apply.ts` | `code_graph_apply` MCP tool handler. |

## New tests

| Path | Purpose |
|------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` | Unit tests for state classifier, operation dispatcher, rollback. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-gold-battery.vitest.ts` | Pass policy + env-flag override tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-recovery-procedures.vitest.ts` | CG-RP-001 / 002 / 003 typed-procedure E2E. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-e2e.vitest.ts` | Apply-mode E2E across recovery scenarios. |

## New workflow YAML

| Path | Purpose |
|------|---------|
| `.opencode/commands/doctor-code-graph/apply.yaml` | Apply-mode workflow (pre-flight → operation → post-flight → commit/rollback). |

## Modified

| Path | Change | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Registers `code_graph_apply` tool schema. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modified | Adds `apply.lastRunAt`, `apply.lastResult`, `apply.batteryPassRate` to status projection. |
| `.opencode/commands/doctor-code-graph.md` | Modified | Appends apply-mode invocation docs and recovery-playbook links. |

## Spec docs (this packet)

| Path | Action | Notes |
|------|--------|-------|
| `spec.md` | Created | 14 reqs across 3 priority tiers; 4 ADRs referenced. |
| `plan.md` | Created | 3 implementation phases. |
| `tasks.md` | Created | Per-phase task decomposition (T001+). |
| `checklist.md` | Created | CHK-* IDs for every REQ. |
| `decision-record.md` | Created | ADR-001 verification-battery gating, ADR-002 recovery-playbook → workflow translation, ADR-003 rollback semantics, ADR-004 self-healing boundary. |
| `implementation-summary.md` | Created | cli-codex dispatch summary. |
| `description.json` | Created | Packet metadata (status: complete, completion_pct: 100). |
| `graph-metadata.json` | Created | Graph metadata. |
| `changelog.md` | Created | Per-packet changelog (this release). |
| `resource-map.md` | Created | This file. |

## Counts

- **New library modules**: 5
- **New MCP handlers**: 1
- **New test files**: 4 (25 tests total)
- **New workflow YAML**: 1
- **Modified source files**: 3
- **Spec docs (this packet)**: 10
- **Total file touches**: 24
- **Reqs closed**: 14 (P0: 4, P1: 6, P2: 4)
- **Deferred**: 0 (3 explicit limitations)

## Prerequisite artifacts (from research packet 007)

All consumed by this packet's implementation, none modified:

| Path | Role |
|------|------|
| `../006-code-graph-resilience-research/assets/code-graph-gold-queries.json` | 28-query battery, pass-policy 90% overall / 80% edge-focus. |
| `../006-code-graph-resilience-research/assets/staleness-model.md` | 3-state staleness model (fresh, soft-stale, hard-stale). |
| `../006-code-graph-resilience-research/assets/recovery-playbook.md` | 3 recovery procedures (CG-RP-001 / 002 / 003). |
| `../006-code-graph-resilience-research/assets/exclude-rule-confidence.json` | 3-tier exclude-rule confidence (high/medium/low). |

## Verification surfaces

- Packet-focused vitest: 4 files / 25 tests PASS.
- Strict spec validation: exit 0.
- TypeScript compile: clean.
- Phase A YAML byte-equivalent pre/post.
