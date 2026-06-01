---
title: "Memory Indexer Invariants: Lineage, Concurrency, Index Scope, and Constitutional Tier Enforcement"
description: "Patched E_LINEAGE cross-file reuse and candidate_changed recheck false positives, eliminated 5700 spurious constitutional rows and 5947 z_future rows, and installed a shared SSOT with defense-in-depth guards at every mutation surface."
trigger_phrases:
  - "memory indexer invariants"
  - "E_LINEAGE fix"
  - "candidate_changed fix"
  - "constitutional tier pollution"
  - "index scope exclusion"
  - "cleanup CLI"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/010-memory-indexer-invariants` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Two save-path regressions shipped during the 026 optimization cycle: cross-file lineage reuse produced E_LINEAGE errors, and scan rechecks generated spurious candidate_changed warnings. Simultaneously the live database was polluted with 5700 constitutional rows from only 2 real rule files and 5947 forbidden z_future rows. This packet closed both tracks through a shared index-scope SSOT, multi-layer defense-in-depth guards at every mutation surface, and a transactional cleanup CLI.

### Added

- Shared index-scope helper (single source of truth) for memory and code-graph path exclusions.
- Realpath canonicalization helper so symlinks into forbidden paths cannot bypass string-normalized checks.
- Canonical path plumbing in SimilarMemory so prediction-error orchestration can reason about same-file identity.
- Save-time path rejection that deletes forbidden z_future saves and downgrades invalid constitutional-tier saves to important.
- Cleanup CLI with dry-run, apply, and verify modes for scanning and repairing index-scope and tier violations.
- Transaction-snapshot-based cleanup apply planning that closes the TOCTOU window between inspection and mutation.
- Walker denial-of-service caps on .gitignore reads, recursion depth, and node count for memory and code-graph scanners.
- Shared governance-audit action strings and helpers so every tier-downgrade emitter produces consistent, durable audit rows.

### Changed

- Memory discovery and spec-doc classification now call the shared index-scope helper as their single source of truth.
- isMemoryFile() aligned to classify only files under /constitutional/ as constitutional tier, matching the rule-file-only policy.
- Storage-layer UPDATE and post-insert metadata paths now enforce constitutional-tier validity, closing bypasses that the handler-only guard missed.
- Checkpoint restore re-asserts index-scope and constitutional-tier invariants inside the barrier-held transaction.
- Cleanup apply preserves historical governance_audit rows for deleted memories and emits one audit row per downgraded row.

### Fixed

- Cross-file prediction-error UPDATE and REINFORCE decisions now downgrade to CREATE when the candidate canonical path differs from the save target.
- Scan-originated saves now carry `fromScan: true` and skip the transactional reconsolidation recheck, eliminating false candidate_changed warnings while keeping the guarded path for non-scan saves.
- Default scan batch size restored after live evidence proved the transactional recheck, not batch overlap, was the real candidate_changed source.
- 5700 spurious constitutional-tier rows reduced to 2 (only the real /constitutional/ rule files remain).
- 5947 forbidden z_future rows deleted and permanently excluded from future indexing.
- Duplicate gate-enforcement rule rows collapsed from 2 to 1.

### Verification

- Track A focused regression suite: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` - `26/26` passed.
- Wave-2 focused Vitest suite (index-scope, memory-save-index-scope, memory-crud-update-constitutional-guard, checkpoint-restore-invariant-enforcement, cleanup-script-audit-emission, exclusion-ssot-unification, symlink-realpath-hardening, walker-dos-caps) - `20/20` passed.
- README-regression Vitest (handler-memory-index, memory-parser-extended, full-spec-doc-indexing, gate-d-regression-constitutional-memory) - `218/218` passed.
- `tests/memory-governance.vitest.ts` - passed with cleanup action-string coverage added.
- Typecheck and build: `npm run typecheck` exit `0`, `npm run build` exit `0`.
- Cleanup CLI verify: `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1`.
- Strict packet validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict --no-recursive` exit `0`.
- Full core suite: exit `124` with unrelated carryover failures in `copilot-hook-wiring.vitest.ts` and `stage3-rerank-regression.vitest.ts`, both outside packet scope and reproducible in isolation.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/handlers/save/pe-orchestration.ts` | Modified | Downgrades cross-file UPDATE and REINFORCE to CREATE via canonical path comparison |
| `mcp_server/handlers/save/pe-gating.ts` | Modified | Added canonical path plumbing for SimilarMemory same-file identity |
| `mcp_server/handlers/memory-index.ts` | Modified | Threads `fromScan: true` into scan-originated saves and restores default scan batch size |
| `mcp_server/handlers/memory-save.ts` | Modified | Skips transactional reconsolidation recheck for fromScan saves, adds save-time path rejection and tier downgrade |
| `mcp_server/lib/utils/index-scope.ts` | Created | Shared SSOT for memory and code-graph path exclusions with public predicates |
| `mcp_server/lib/utils/canonical-path.ts` | Created | Realpath canonicalization helper for symlink-safe invariant checks |
| `mcp_server/handlers/memory-index-discovery.ts` | Modified | Wired to shared index-scope helper for exclusion enforcement |
| `mcp_server/lib/config/spec-doc-paths.ts` | Modified | Spec-doc classification calls shared index-scope helper as SSOT |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modified | SQL-layer constitutional-tier downgrade before UPDATE, shared audit emission |
| `mcp_server/lib/storage/post-insert-metadata.ts` | Modified | Inline guard on post-insert metadata constitutional writes |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | Atomic restore validation of index-scope and constitutional-tier invariants |
| `mcp_server/lib/governance/scope-governance.ts` | Modified | Centralized governance-audit action strings and tier-downgrade audit emission |
| `code_graph/lib/structural-indexer.ts` | Modified | Code-graph walker calls shared index-scope helper with realpath and DoS caps |
| `scripts/memory/cleanup-index-scope-violations.ts` | Created | Transactional cleanup CLI with dry-run, apply, and verify modes |
| `tests/pe-orchestration.vitest.ts` | Modified | Regression coverage for sibling-doc lineage and cross-file CREATE downgrade |
| `tests/handler-memory-index.vitest.ts` | Modified | Regression coverage for fromScan propagation and non-scan control path |
| Packet docs (spec, plan, tasks, checklist, decision-record, implementation-summary) | Modified | Both phase tracks merged into root docs with legacy-path aliases preserved |

### Follow-Ups

- Track A live MCP rescan on the hook-parity packet is pending. Code-level fixes are shipped and focused regressions pass but the live re-verification gate requires an MCP restart in an embedding-capable runtime.
- MCP restart is required before the new save, scan, update, checkpoint, code-graph, and cleanup-helper behavior is active for connected clients.
- `npm run test:core` carryover: unrelated failures in `copilot-hook-wiring.vitest.ts` and `stage3-rerank-regression.vitest.ts` remain, both outside this packet's scope.
