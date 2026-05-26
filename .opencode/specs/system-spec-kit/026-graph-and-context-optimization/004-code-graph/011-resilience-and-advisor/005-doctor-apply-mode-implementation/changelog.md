# Changelog — 012-doctor-apply-mode-implementation

## 2026-05-08

> Spec folder: `026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-implementation` (Level 3)
> Parent packet: `026-graph-and-context-optimization/005-code-graph`
> Predecessor: `005-doctor-diagnostic-command-phase-a/` (Phase A); `006-code-graph-resilience-research/` (4 prerequisite artifacts)

### Summary

Ships Phase B (apply-mode auto-fix operations) for `/doctor:code-graph`. cli-codex gpt-5.5 high fast dispatched in a single ~30 minute run. All P0/P1 reqs closed (REQ-001 through REQ-010), P2 reqs (REQ-011 through REQ-014) closed or explicitly limited.

### Added

- `mcp_server/code_graph/lib/apply-orchestrator.ts` — state machine + operation dispatcher + rollback executor + `--dry-run` support + JSONL audit events under `apply-audit/`.
- `mcp_server/code_graph/lib/gold-battery-runner.ts` — wraps the existing `gold-query-verifier`; loads `code-graph-gold-queries.json`; evaluates 90% overall / 80% edge-focus pass policy.
- `mcp_server/code_graph/lib/recovery-procedures.ts` — typed implementations of CG-RP-001 (SQLite corruption), CG-RP-002 (partial-scan failure), CG-RP-003 (bad-apply rollback).
- `mcp_server/code_graph/lib/exclude-rule-classifier.ts` — loads `exclude-rule-confidence.json`; per-pattern tier classification (high/medium/low).
- `mcp_server/code_graph/lib/apply-metadata.ts` — last-run metadata persistence for `code_graph_status` projection.
- `mcp_server/code_graph/handlers/apply.ts` — MCP handler exposing `code_graph_apply`.
- `mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` — state classification, dispatch, rollback unit tests.
- `mcp_server/tests/code-graph-gold-battery.vitest.ts` — battery runner + pass policy + env-flag override tests.
- `mcp_server/tests/code-graph-recovery-procedures.vitest.ts` — CG-RP-001 / 002 / 003 typed-procedure E2E tests.
- `mcp_server/tests/code-graph-apply-e2e.vitest.ts` — apply-mode E2E covering recovery-playbook scenarios.
- `commands/doctor-code-graph/apply.yaml` — apply-mode workflow YAML (pre-flight battery → state classify → operation → post-flight battery → commit/rollback).

### Changed

- `mcp_server/tool-schemas.ts` — registers the new `code_graph_apply` tool.
- `code_graph_status` response — gains `apply.lastRunAt`, `apply.lastResult`, `apply.batteryPassRate` projection.
- `commands/doctor-code-graph.md` — appends apply-mode invocation docs and links to the recovery playbook procedures.

### Decisions

- **REQ Q1** (--dry-run flag): YES, shipped. Operators can run gold battery + state classification without committing changes.
- **REQ Q2** (audit log location): `apply-audit/` subdir under code_graph data dir.
- **REQ Q3** (recovery report markdown): SKIP in MVP; JSONL audit events are sufficient for v1.

### Verification

- TypeScript compile clean (via `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json`).
- Packet-focused vitest: **PASS, 4 files / 25 tests** (apply-orchestrator, gold-battery, recovery-procedures, apply-e2e).
- Strict spec validation: PASS (0 errors, 0 warnings, post-fingerprint cleanup).
- Phase A YAML diff check: PASS — `auto.yaml` and `confirm.yaml` byte-equivalent pre/post.

### Known limitations

1. **Recovery report markdown is skipped in MVP.** Per Q3 resolution; JSONL is the audit surface.
2. **Prune-excludes is scan-scoped, not config-persistent.** Uses the live scanner's `excludeGlobs` parameter rather than persisting through a new scanner config schema. Operators reconfigure per-scan.
3. **Forensic SQLite `.recover` is not shell-executed.** CG-RP-001 preserves forensic copies and rebuilds from source via typed APIs; manual forensic salvage with `sqlite3 .recover` remains an operator action because arbitrary shell execution is forbidden by the design (NFR-S01).
