---
title: "013 Doctor Update Orchestrator: Initial Command Set Scaffold"
description: "Phase A scaffold plus tx-model verification delivered a full Level 2 spec document set, a confirmed per-batch transaction model for memory_index_scan plus the first reference template for the /doctor:memory command. Track B2-B4 plus the /doctor:update orchestrator were planned and designed but remained pending at handoff."
trigger_phrases:
  - "013 doctor update orchestrator"
  - "doctor memory command"
  - "doctor update scaffold"
  - "initial doctor command set"
  - "memory_index_scan tx model"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-09

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/001-implement-initial-doctor-command-set` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`

### Summary

The spec-kit doctor surface covered code-graph, skill-advisor, skill-budget, mcp_install plus mcp_debug but had no commands for the four remaining subsystems (memory, causal-graph, deep-loop, cocoindex) and no unified orchestrator to rebuild all databases in dependency-safe order. Users at older schema versions such as 3.3.0.0 had no one-shot upgrade path.

This phase delivered the full Level 2 planning document set for the 013 Doctor Update Orchestrator packet plus two concrete artifacts. Six packet docs were authored: spec.md with 23 requirements, plan.md with a five-phase plan plus parallelization dispatch design, tasks.md with 59 task-graph entries, checklist.md with 80+ checkpoints, resource-map.md cataloguing 47 reference paths plus decision-record.md capturing nine ADRs from a Multi-AI Council session. A live read of `memory-index.ts` confirmed that `memory_index_scan` uses per-file (per-batch) transactions, not a single wrapping transaction. That finding narrowed the SIGINT cancel-safety settle window from the council's conservative 30-second estimate to approximately 5 seconds. The `/doctor:memory` reference template (Markdown entrypoint plus one interactive YAML asset) landed as the canonical pattern source for Track B2-B4 authoring.

### Added

- Six Level 2 packet docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `resource-map.md`, `decision-record.md`
- `.opencode/commands/doctor/memory.md` (283 LOC) as the reference template for the `/doctor:memory` command
- `.opencode/commands/doctor/assets/doctor_memory.yaml` (140 LOC) read-only diagnostic mode template
- Nine ADRs in `decision-record.md` covering tx-model verification, mode reduction, snapshot semantics plus council Q1-Q8
- `description.json` and `graph-metadata.json` auto-generated via `generate-context.js`

### Changed

- `026/graph-metadata.json` `derived.last_active_child_id` updated to reference the new orchestrator packet

### Fixed

- None. Additive-only phase.

### Verification

| Gate | Status | Detail |
|------|--------|--------|
| G1 (validate_document --type command) | Partial | `/doctor:memory.md` passes with warnings only, matching the canonical `/doctor:code-graph.md` shape |
| G2 (YAML canonical-path validator) | Partial | `doctor_memory.yaml` authored. Full canonical-path validation deferred to Phase E. |
| ADR-001 tx-model confirmation | PASS | `memory-index.ts:296` per-file loop dispatch plus `incremental-index.ts:394` better-sqlite3 primitive confirmed per-batch tx boundary |
| Council deliberation (R1) | PASS | Multi-AI Council produced 10-line orchestrator spec captured verbatim in ADR-002 through ADR-008 |
| Strict packet validation | Pending | G3 gate deferred. Known template-manifest mismatch issue shared with 002 and 003 packets. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/commands/doctor/memory.md` (NEW) | `/doctor:memory` command entrypoint following the `/doctor:code-graph.md` pattern |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` (NEW) | Read-only diagnostic mode YAML template for Track B2-B4 reference |
| `026/.../001-implement-initial-doctor-command-set/spec.md` (NEW) | Level 2 spec with REQ-001 through REQ-023 |
| `026/.../001-implement-initial-doctor-command-set/plan.md` (NEW) | Five-phase plan with Phase B parallelization dispatch design |
| `026/.../001-implement-initial-doctor-command-set/tasks.md` (NEW) | T-001 through T-059 task graph |
| `026/.../001-implement-initial-doctor-command-set/checklist.md` (NEW) | 80+ P0/P1/P2 checkpoints across all commands |
| `026/.../001-implement-initial-doctor-command-set/resource-map.md` (NEW) | 47-reference path catalog |
| `026/.../001-implement-initial-doctor-command-set/decision-record.md` (NEW) | Nine ADRs from Multi-AI Council session |
| `026/graph-metadata.json` | `derived.last_active_child_id` updated to new orchestrator packet |

### Follow-Ups

- Complete Track B2-B4: author `/doctor:causal-graph`, `/doctor:deep-loop` plus `/doctor:cocoindex` commands following the `/doctor:memory` reference template pattern.
- Author the `/doctor:update` orchestrator (Phase C): `commands/doctor/update.md` plus `assets/doctor_update.yaml` implementing the council 10-line spec per ADR-002 through ADR-008.
- Author the migration manifest (Phase D): `mcp_server/database/migration-manifest.json` with per-version blocks for 3.3.0.0, 3.4.0.0 plus 3.4.1.0.
- Run Phase E verification gates G1-G9 once Phase C and Phase D are complete.
- Advance `completion_pct` in continuity surfaces: 50% at end of Phase B, 75% at end of Phase C, 90% at end of Phase D, 100% after Phase E gates are green.
