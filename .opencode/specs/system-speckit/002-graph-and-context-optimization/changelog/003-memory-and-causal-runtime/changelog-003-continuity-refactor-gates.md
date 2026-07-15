---
title: "Continuity Memory Runtime Phase 003: Continuity refactor gates"
description: "Six gates (A-F) that built the canonical spec-doc continuity path: pre-work, schema migration, writer substrate, reader retargeting, runtime cutover, and cleanup verification."
trigger_phrases:
  - "phase 003 changelog"
  - "continuity refactor gates"
  - "gates a-f"
  - "canonical continuity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-13

> Spec folder: `002-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates` (Level 2)
> Parent packet: `002-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Six coordinated gates that together built the canonical spec-doc continuity path from preconditions through runtime cutover to cleanup verification. Former follow-on work was promoted to sibling top-level phases (007-010), narrowing this packet to Gates A-F only.

Gate A removed template blockers and proved backup readiness. Gate B advanced the schema from v25 to v26 with anchor-aware causal edges and archived 183 legacy memory-path rows. Gate C wired the canonical writer path from routing through index persistence with 5 spec-doc-structure validation rules. Gate D retargeted 6 reader handlers (memory-search, memory-context, session-resume, session-bootstrap, memory-index-discovery, memory-triggers) onto canonical docs plus thin continuity records. Gate E performed a single canonical runtime cutover across 178 files. Gate F deleted 183 stale memory-file rows with zero orphan edges and zero empty directories.

### Added

- Baseline anchors to handover, research, and debug-delegation templates.
- SQLite schema v26 with source_anchor and target_anchor columns on causal_edges plus both indexes.
- `buildCanonicalAtomicPreparedSave()` with spec-doc-structure validation rules (5 rules).
- ADR-001 through ADR-005 defining writer boundaries, validator order, Tier 3 contract, rollback guardrails, and continuity schema.
- Reader contract: doc-first resume path, shared `resumeLadder`, canonical trigger provenance, two-layer archive threshold policy.
- Recovery surface: `/spec_kit:resume`. Continuity order (handover.md to _memory.continuity to spec docs).

### Changed

- validate.sh now exempts changelog and sharded template directories from ANCHORS_VALID.
- Archived-tier ranking penalty removed from stage2-fusion.ts.
- archived_hit_rate metric removed from memory-crud-stats.ts.
- Session-prime, session-prime-migration, and other surviving paths no longer branch on is_archived.
- All shadow, dual-write, and rollout scaffolding removed from the workflow.
- `generate-context` guidance updated from legacy framing to canonical continuity wording.
- 178 files updated repo-wide: top-level docs, agents, commands, workflow YAMLs, CLI handback files, skill READMEs.

### Fixed

- Missing metadata anchor openers in level_3 and level_3+ spec templates.
- Governance anchors added to Level 3+ template.
- Archived-hit observability: post-cleanup, 0 stale memory-file rows exist with 1 baseline archived row preserved.
- 183 stale memory-path rows in memory_index deleted, 1141 dependent causal_edges deleted first to prevent orphan references.

### Verification

- Gate A through F: each complete with phase-local evidence.
- Recursive validate.sh --strict: PASS.
- 9 vitest files (215 tests): PASS for Gate C.
- 25 vitest files (177 tests): PASS for Gate D.
- memory-save-integration (10 tests): PASS.
- outsourced-agent-handback-docs + generate-context-cli-authority (13 tests): PASS.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/lib/db/code-graph-db.ts` | Schema v25 to v26 migration with causal_edges anchor columns. |
| `mcp_server/handlers/memory-save.ts` | Canonical writer integration: atomicSaveMemory routes through buildCanonicalAtomicPreparedSave. |
| `mcp_server/handlers/memory-search.ts` | Retargeted to canonical docs plus thin continuity. |
| `mcp_server/handlers/memory-context.ts` | Retargeted to canonical docs plus thin continuity. |
| `mcp_server/handlers/session-resume.ts` | Retargeted to doc-first resume path with shared resumeLadder. |
| `mcp_server/handlers/session-bootstrap.ts` | Retargeted to doc-first resume path. |
| `mcp_server/lib/resume/resume-ladder.ts` (NEW) | Shared resume ladder for resume and bootstrap alignment. |
| `mcp_server/lib/continuity/anchor-merge-operation.ts` | ADR-NNN synthetic target support. |
| `mcp_server/lib/continuity/create-record.ts` | Routed saves with target spec-doc identity. |
| `scripts/core/workflow.ts` | Shadow scaffolding removed. Canonical path only. |
| Template files (level_3, level_3+, handover, research, debug-delegation) | Anchor metadata fixes and additions. |

Reference commit: `e802a9072` (Gate C writer path). Packet-level reference: `7a987e8827`.

### Follow-Ups

- **Historical narrative in research artifacts.** Some root research still uses older phase-018 narrative language as historical context.
- **Root artifact normalization.** Existing research and review artifacts may need a follow-up pass if stricter packet-integrity cleanup is desired.
