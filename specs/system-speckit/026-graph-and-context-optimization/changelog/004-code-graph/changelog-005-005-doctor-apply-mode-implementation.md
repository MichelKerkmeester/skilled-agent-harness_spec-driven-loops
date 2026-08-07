---
title: "Code Graph Phase 005-005: /doctor:code-graph Apply-Mode (Phase B)"
description: "Phase B apply-mode shipped for /doctor:code-graph. The command can now run a verification-gated recovery pipeline. Five new TypeScript modules wire the 28-query gold battery, the three-state staleness model and three recovery procedures into a pre-flight and post-flight gated apply flow with rollback semantics and JSONL audit logging."
trigger_phrases:
  - "doctor code graph apply mode"
  - "code_graph_apply handler"
  - "apply mode phase b implementation"
  - "code graph recovery procedures"
  - "gold battery gating apply"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/005-doctor-apply-mode-implementation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor`

### Summary

Phase A of `/doctor:code-graph` shipped diagnostic-only workflows in an earlier packet. Operators could see what was wrong with the code graph but had no automated path to fix it. Manual recovery required walking three documented procedures against a degraded graph without any verification gate.

Phase B wired the four prerequisite artifacts from the resilience research packet into a fully automated, verification-gated apply pipeline. The new `code_graph_apply` MCP tool runs a 28-query gold battery before and after each recovery operation. It dispatches the procedure matched to the current staleness state (fresh, soft-stale or hard-stale) and rolls back to a known-good database triplet if the post-flight battery fails. Every apply run produces a JSONL audit log capturing battery results, the operation invoked and the commit-or-rollback decision. The Phase A diagnostic workflows were not modified.

### Added

- `apply-orchestrator.ts` state machine classifying fresh, soft-stale and hard-stale states with hard-stale confirmation boundary and `--dry-run` support
- `gold-battery-runner.ts` wrapping the existing gold-query verifier for pre-flight and post-flight battery execution against the 28-query fixture
- `recovery-procedures.ts` implementing CG-RP-001 (SQLite corruption recovery), CG-RP-002 (partial-scan failure) and CG-RP-003 (bad-apply rollback) as typed TypeScript with no arbitrary shell execution
- `exclude-rule-classifier.ts` loading the 3-tier exclude-rule confidence tiers from the research artifact
- `apply-metadata.ts` persisting last-run metadata for status reporting
- `handlers/apply.ts` exposing the `code_graph_apply` MCP tool
- `doctor_code-graph_apply.yaml` apply-mode workflow documenting Phase B invocation and recovery mapping
- Four vitest test files covering orchestrator state machine, gold battery runner, recovery procedures and end-to-end apply scenarios

### Changed

- `tool-schemas.ts` updated to register the `code_graph_apply` tool schema and Zod validation
- `handlers/status.ts` extended to return `apply.lastRunAt`, `apply.lastResult` and `apply.batteryPassRate` fields

### Fixed

- Operators previously had no automated path from diagnosis to recovery. The apply pipeline closes that gap for all three documented failure classes without requiring manual procedure walkthroughs.

### Verification

| Check | Result |
|-------|--------|
| `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json` | PASS |
| `pnpm vitest run tests/code-graph-apply-orchestrator.vitest.ts tests/code-graph-gold-battery.vitest.ts tests/code-graph-recovery-procedures.vitest.ts tests/code-graph-apply-e2e.vitest.ts` | PASS, 4 files / 25 tests |
| Phase A YAML diff check (`doctor_code-graph_auto.yaml` and `doctor_code-graph_confirm.yaml` unchanged) | PASS |
| Strict spec validation (`validate.sh --strict`) | PASS, 0 errors / 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts` (NEW) | Apply state machine. Classifies staleness, enforces confirmation boundary, dispatches operations, snapshots DB triplets, writes JSONL audit events. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/gold-battery-runner.ts` (NEW) | Wraps the existing gold-query verifier. Evaluates 28-query fixture with 90% overall floor and 80% edge-focus floor. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/recovery-procedures.ts` (NEW) | Typed implementations of CG-RP-001, CG-RP-002, CG-RP-003. No shell execution. Preserves forensic copies and quarantines bad triplets. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/exclude-rule-classifier.ts` (NEW) | Loads 3-tier exclude-rule confidence tiers from the research artifact JSON. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-metadata.ts` (NEW) | Persists last-run apply metadata for status reporting. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/apply.ts` (NEW) | MCP handler exposing `code_graph_apply` with Zod-validated input. |
| `.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml` (NEW) | Apply-mode workflow YAML documenting Phase B invocation and recovery procedure mapping. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Extended with `apply.lastRunAt`, `apply.lastResult`, `apply.batteryPassRate` fields. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Registered `code_graph_apply` tool schema and Zod validation. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` (NEW) | Unit tests for state classification, operation dispatch and rollback paths. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-gold-battery.vitest.ts` (NEW) | Gold battery runner tests against the fixture queries. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-recovery-procedures.vitest.ts` (NEW) | Tests for all three recovery procedures. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-e2e.vitest.ts` (NEW) | End-to-end apply scenarios covering the recovery-playbook paths. |

### Follow-Ups

- Recovery report markdown is not produced in this release. The apply pipeline writes JSONL audit events only. A markdown report surface can be added in a follow-on packet if operators need a human-readable recovery summary.
- Prune-excludes operates via `excludeGlobs` on the live scanner and is not config-persistent. A persistent scanner config schema was deferred to avoid introducing a new configuration surface in this packet.
- Forensic SQLite `.recover` salvage is not shell-executed. CG-RP-001 preserves forensic copies and rebuilds from source with typed APIs. Manual `.recover --ignore-freelist` salvage remains a manual operator step when the typed rebuild path is insufficient.
