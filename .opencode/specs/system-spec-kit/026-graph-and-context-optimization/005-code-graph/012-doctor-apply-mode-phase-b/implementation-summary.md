---
title: "Implementation Summary: /doctor:code-graph apply-mode Phase B [system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-phase-b/implementation-summary]"
description: "Phase B apply-mode shipped: code_graph_apply MCP tool, verification-battery gating, staleness-state dispatch, typed recovery procedures, rollback, JSONL audit logging, status metrics, command docs, and targeted tests."
trigger_phrases:
  - "doctor code graph apply implementation"
  - "code_graph_apply implementation"
  - "013 doctor apply mode phase b implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-phase-b"
    last_updated_at: "2026-05-08T22:50:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase B apply-mode and verified targeted gates"
    next_safe_action: "Use code_graph_apply for verification-gated code graph recovery"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/apply.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/recovery-procedures.ts"
      - ".opencode/commands/doctor/assets/doctor_code-graph_apply.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: "doctor-apply-mode-phase-b-2026-05-08"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "--dry-run shipped"
      - "Audit log location is code_graph data dir apply-audit/"
      - "Recovery report markdown skipped in MVP; JSONL only"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `012-doctor-apply-mode-phase-b` |
| **Completed** | 2026-05-08 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase B now has a real apply surface instead of a command-level placeholder. You can call `code_graph_apply` to run a pre-flight gold battery, classify the graph, dispatch a typed recovery operation, run a post-flight battery, and commit or roll back with JSONL audit evidence.

### Apply Orchestrator

`apply-orchestrator.ts` owns the state machine. It classifies `fresh`, `soft-stale`, and `hard-stale` states, enforces the hard-stale confirmation boundary, supports `--dry-run`, writes audit events under `apply-audit/`, snapshots known-good DB triplets, and records last apply metadata for status reporting.

### Verification Battery

`gold-battery-runner.ts` wraps the existing `gold-query-verifier` so apply-mode uses the same query semantics as `code_graph_verify`. The artifact defaults remain 90% overall and 80% edge-focus; `SPECKIT_CODE_GRAPH_BATTERY_OVERALL_FLOOR` and `SPECKIT_CODE_GRAPH_BATTERY_EDGE_FLOOR` can raise but not lower those floors.

### Recovery Procedures

`recovery-procedures.ts` implements CG-RP-001, CG-RP-002, and CG-RP-003 with filesystem and SQLite APIs. It preserves forensic copies, quarantines bad triplets, restores known-good snapshots when available, and falls back to source rebuild when no snapshot exists.

### MCP and Command Surface

`handlers/apply.ts` exposes `code_graph_apply`. Tool schemas, Zod validation, code graph dispatch, and handler exports are wired. `code_graph_status` now returns `apply.lastRunAt`, `apply.lastResult`, and `apply.batteryPassRate`. The apply workflow YAML and command markdown document Phase B invocation and recovery mapping.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reuses existing runtime primitives instead of duplicating them: `code_graph_scan` for reindexing, `code_graph_status` for readiness, and `gold-query-verifier` for battery execution. The recovery playbook is translated into typed procedures, not shell execution. Tests inject scan and battery functions where possible so rollback and state-machine behavior are deterministic.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Wrap the existing gold verifier | Keeps `code_graph_apply`, `code_graph_verify`, and scan verification on the same query parser and pass-policy model. |
| Store audit logs under `apply-audit/` | Keeps mutation evidence next to the code graph data without mixing it into the DB triplet. |
| Make hard-stale require `confirm:true` | Matches the staleness model and prevents silent full scans or corruption recovery. |
| Implement recovery as typed TypeScript | Satisfies the no-arbitrary-shell constraint while keeping CG-RP procedures testable. |
| Apply prune-excludes via scan `excludeGlobs` | Avoids inventing a new config schema while still letting high-tier excludes affect the apply scan. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json` | PASS |
| `pnpm vitest run tests/code-graph-apply-orchestrator.vitest.ts tests/code-graph-gold-battery.vitest.ts tests/code-graph-recovery-procedures.vitest.ts tests/code-graph-apply-e2e.vitest.ts` | PASS, 4 files / 25 tests |
| Phase A YAML diff check | PASS, `doctor_code-graph_auto.yaml` and `doctor_code-graph_confirm.yaml` unchanged |
| Strict spec validation | PASS, 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recovery report markdown is skipped in MVP.** The user resolved Q3 as JSONL only, so apply-mode writes structured audit events but no markdown report.
2. **Prune-excludes is scan-scoped, not config-persistent.** The live scanner already accepts `excludeGlobs`; this packet uses that path instead of inventing a new persistent scanner config schema.
3. **Forensic SQLite `.recover` is not shell-executed.** CG-RP-001 preserves forensic copies and rebuilds from source with typed APIs; manual forensic salvage remains outside the MVP because arbitrary shell execution is forbidden.
<!-- /ANCHOR:limitations -->
