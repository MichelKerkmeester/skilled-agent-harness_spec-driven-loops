---
title: "Storage Adapter Ports: A Five-Port Seam Over better-sqlite3"
description: "A five-port adapter seam (vector, lexical, traversal, maintenance, contention) now sits over the better-sqlite3 layer. Testability and isolation groundwork with no caller-visible behavior change, enforced by a coupling-grep gate."
trigger_phrases:
  - "004/003 storage adapter ports changelog"
  - "five port storage seam"
  - "better-sqlite3 adapter ports"
  - "027 004/003 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/003-storage-adapter-ports` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The storage layer talked to better-sqlite3 directly from many call sites, which made the persistence boundary hard to fake in tests and hard to move later. This phase introduced a five-port adapter seam over that layer — VectorStore, LexicalSearch, GraphTraversal, Maintenance, and ContentionPolicy — and routed the existing call sites through the ports across five slices. No caller-visible behavior changed: the same queries run against the same database with the same results. The value is testability today, where a fake port can stand in for the real database, and room to move the persistence layer later without rewriting every consumer. A coupling grep tracks residual direct-to-sqlite usage and trends it down toward the ports, but it is a manual inventory rather than an enforced gate, and the residual is intentionally not zero: the hybrid lexical query path, the BM25 side-index maintenance calls, and the vector-shard lifecycle pragmas stay coupled by design and are recorded as documented exceptions.

### Added

- `lib/storage/ports/common.ts`, `vector-store.ts`, `lexical-search.ts`, `graph-traversal.ts`, `maintenance.ts`, `contention-policy.ts`, `index.ts` — the five-port adapter seam and its barrel
- `tests/fakes/storage-ports.ts` — fake port implementations for substitution in tests
- `tests/storage-ports-contract.vitest.ts` — contract suite, including the SC-002 fake-substitution test

### Changed

- Routed vector, lexical, graph-traversal, maintenance, and contention call sites through the ports across analytics, embedders, eval, governance, ops, search, and storage modules — behavior preserved
- Recorded a coupling-grep inventory of residual direct better-sqlite3 access, with the remaining sites (hybrid lexical query path, BM25 side-index maintenance, vector-shard lifecycle pragmas) kept as documented exceptions rather than forced through the ports

### Fixed

- Deep-review remediation aligned the ports with the pre-existing behavior where slice routing had drifted, keeping the seam strictly behavior-preserving.

### Verification

| Check | Result |
|-------|--------|
| Deep review | CONDITIONAL, resolved after behavior-preserving port alignment |
| Storage-ports contract suite | PASS, including the SC-002 fake-substitution test added after the initial slice-5 commit |
| Coupling-grep inventory | Residual direct better-sqlite3 access trended down toward the ports; intentionally non-zero, with documented exceptions (not an enforced gate) |
| Behavior parity | PASS: same queries, same results, no caller-visible change |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/` (7 files) | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/lib/` (analytics, embedders, eval, governance, ops, search, storage call sites) | Modified |

### Follow-Ups

- The seam is groundwork. A future move of the persistence layer can target the ports without touching consumers.
- The residual direct-sqlite exceptions (hybrid lexical, BM25 side-index, vector lifecycle) remain by design. Turning the coupling grep into an enforced gate, once those idioms are portable, is future work.
