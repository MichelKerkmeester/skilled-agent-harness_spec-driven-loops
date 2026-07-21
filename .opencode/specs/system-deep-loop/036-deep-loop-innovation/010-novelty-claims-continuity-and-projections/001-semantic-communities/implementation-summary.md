---
title: "Implementation Summary: semantic communities"
description: "Verified additive semantic-community projection with deterministic replay, guarded cohesion, and shadow novelty."
trigger_phrases:
  - "semantic communities implementation"
  - "semantic communities verification"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:33:34Z"
    last_updated_by: "codex"
    recent_action: "Hardened replay-stable edges and bridge-order projection"
    next_safe_action: "Keep the projection shadow-only while calibration evidence accumulates"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/semantic-communities/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/semantic-communities.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Semantic Communities

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-semantic-communities |
| **Completed** | 2026-07-21 |
| **Level** | 3 |
| **Status** | Complete |
| **Baseline revision** | `012652b479` plus the scoped additive working-tree delta |
| **Runtime LOC added** | 1,830 |
| **Test LOC added** | 1,039 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented a version-addressed semantic-equivalence edge and deterministic community-membership projection as a new sidecar.
The reducer preserves raw claim identity, admits only provenance-complete exact-equivalence edges, recomputes only affected
components as a pure function of final component content, guards bridge merges with explicit cohesion, retains merge/split
lineage, and classifies concept novelty separately from evidence novelty. Pair-local edge provenance is independent of which
endpoint arrived later, while directional retrieval remains in the ledger observation. The adapter calls the unchanged legacy
graph novelty functions and labels them as authoritative.

| File | Purpose |
|------|---------|
| `semantic-community-types.ts` | Config, claim, edge, membership, lineage, novelty, and graph-boundary types |
| `semantic-equivalence.ts` | Config digesting, immutable claim adapter, bounded namespace retrieval, and edge admission |
| `community-projection.ts` | Incremental reducer, independent whole-graph rebuild, canonical communities, cohesion guard, lineage, history, and snapshots |
| `semantic-community-events.ts` | Versioned envelope schema, typed ledger reducer, rebuild, and replay component |
| `semantic-novelty.ts` | Shadow output paired with unchanged legacy novelty calculations |
| `index.ts` | Public API |
| `semantic-communities.vitest.ts` | Adversarial semantic and parity fixtures |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was delivered as six new runtime files, one new leaf suite, and this packet's documentation. No coverage writer, graph
database, graph signal, graph query, or substrate file was edited. Verification ran the leaf suite, all four frozen boundary
suites, the repository TypeScript compiler, strict packet validation, and path-filtered scope checks.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

### Architecture Decision Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Version-addressed sidecar projection | Accepted | Adds concept grouping without redefining coverage storage or novelty authority |

See `decision-record.md` for the trade-offs and rollback.

| Decision | Rationale |
|----------|-----------|
| Exact evaluator decision plus threshold | High embedding proximity alone cannot prove equivalence |
| Digest-derived projection version | Any model or policy drift becomes a new immutable version |
| Canonical pair-local edge provenance | Reversed arrivals retain byte-identical edges without erasing the directional ledger observation |
| Canonical member-set community identity | Six arrival-order permutations retain stable core identities |
| Pure affected connected-component rescan | Incremental work excludes unrelated communities and cannot mark the last arrival ambiguous by history |
| Independent whole-graph rebuild | Incremental parity no longer compares two executions of the same fold |
| Ambiguous membership on failed cohesion | A bridge cannot silently chain distinct concepts |
| Direct legacy-function calls | Shadow parity has one authoritative implementation |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Leaf Vitest | PASS | 16/16 tests; precision 1.0, recall 1.0; exit 0 |
| Frozen substrate and coverage signals | PASS | 4 files, 141/141 tests; suite duration 40.80 s |
| TypeScript | PASS | Repository-pinned TypeScript 5.9 `tsc --noEmit -p runtime/tsconfig.json`, exit 0 |
| Strict packet validation | PASS | Errors 0, warnings 0, exit 0 |

The fixture config pins model `fixture-semantic-model@2026-07-01`, cosine metric, equivalence threshold `0.8`, cohesion score
`0.93`, cross-community ratio `0.75`, and a maximum of 64 candidates. Candidate-set forgery, over-budget work, non-finite
scores, malformed Unicode, oversized text, topical-only proximity, cross-namespace admission, bridge chaining, replay drift,
re-observed claim identities, duplicate candidate ranks, and projection-version/config-digest collisions are executable negative
fixtures. Six arrival permutations, including bridge-first and bridge-middle, have byte-identical final edges, communities, and
memberships; every incremental prefix also matches the independent whole-graph rebuild. The fixture-corpus SHA-256 is
`5292ecba59b7c16c76a285171d2c30d8f37ac0d05be836d920239328af8b4dd7`.
<!-- /ANCHOR:verification -->

### Milestone Achievement

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Versioned admission | Complete | Provenance and topical-only fixtures |
| Deterministic projection | Complete | Independent rebuild, six arrival orders, edge, representative, and membership-hash fixtures |
| Cohesion and lineage | Complete | Bridge-first/middle/last ambiguity plus explicit merge/split fixtures |
| Novelty shadow | Complete | Concept/evidence dual-direction and legacy parity fixture |

<!-- ANCHOR:limitations -->
## Known Limitations

1. The module consumes versioned exact-scoring assessments; it does not select or call an embedding provider.
2. Semantic novelty remains shadow-only and does not affect convergence or termination.
3. Runtime latency is measured by the verifier command, not written into replay state, because nondeterministic timing would break canonical replay.
<!-- /ANCHOR:limitations -->

## Risks Realized

| Risk | Occurred | Resolution |
|------|----------|------------|
| Distinct candidate mislabeled as old concept during implementation | Yes | Novelty now consults admitted equivalence endpoints only; regression fixture added |
| Native SQLite ABI mismatch in test environment | Yes | Rebuilt the ignored package-local dependency; no repository source changed |
| Existing unrelated dirty worktree | Yes | Scope proof uses baseline-aware and path-filtered status; unrelated changes were preserved |

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Provider-owned embedding records | Versioned externally scored assessments | Provider selection is out of scope; admission still binds model and evaluator provenance |
| Persist projection latency telemetry | Measure latency outside replay state | Wall-clock values would violate byte-stable replay |
| Level 2 packet | Level 3 docs | Runtime and test additions exceed the repository LOC threshold |

## Follow-Up Items

No implementation work remains in this leaf. Authority changes, persistence transactions, claim continuity, contradiction
semantics, and convergence integration remain owned by their existing sibling phases.
