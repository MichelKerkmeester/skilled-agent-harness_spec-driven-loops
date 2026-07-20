---
title: "Implementation Plan: baseline, taxonomy, and state census"
description: "Implementation Plan for phase 003 of the 006 recommendations-implementation program: freeze BASE, normalize taxonomy, census runtime state, and establish replayable no-regression evidence."
trigger_phrases:
  - "baseline taxonomy and state census implementation plan"
  - "deep-loop recommendations phase 003 plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored the phase-003 execution plan"
    next_safe_action: "Pin BASE before collecting census or benchmark evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Baseline, taxonomy, and state census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + five mode packets + behavior benchmarks |
| **Change class** | Baseline capture / taxonomy normalization / state census / benchmark extension |
| **Execution** | Read-first inventory and deterministic fixture capture pinned to one immutable BASE |

### Overview
This phase creates the evidence boundary for the 006 migration. Execution starts by freezing BASE, then derives
machine-readable censuses from the shipped runtime and all of its mode/YAML/script consumers. The census closes
reader/writer and backend ownership before behavior is classified. Existing benchmark results are frozen by scenario
ID and semantics, coverage is extended from five package roots to all eight research workstreams, and sanitized replay
fixtures plus rollback anchors prove the evidence can be reconstructed without mutating live state.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The checkout selected for execution is clean and resolves to one full immutable BASE commit
- [ ] The 006 parent, phase tree, mode registry, five mode packets, runtime references, and benchmark packages are readable
- [ ] Fixture capture uses temporary copies and excludes credentials, user paths, and live database mutation
- [ ] Artifact schemas and output locations are fixed before census collection begins

### Definition of Done
- [ ] The BASE manifest is complete, internally consistent, and referenced by every phase artifact
- [ ] The 5-family / 7-workflowMode / 8-workstream taxonomy is explicit and machine-checkable
- [ ] All eight subsystem, JSONL reader/writer, and persisted-state/backend rows are closed
- [ ] Every behavior row is either a protected contract or a known defect with a disposition
- [ ] The 5-package/53-scenario benchmark inventory is frozen and all eight workstreams have semantic BASE evidence
- [ ] Replay fixtures and rollback procedures pass from clean temporary state
- [ ] The phase-004 handoff manifest has zero unresolved rows and stable digests
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The phase produces a BASE-keyed evidence bundle inside the phase packet. File names may be finalized at execution, but
the logical artifacts and their relationships are fixed:

| Artifact | Required content | Closure check |
|----------|------------------|---------------|
| BASE manifest | Full SHA, ref provenance, clean/dirty status, tool/submodule versions, source and artifact digests | One SHA across every row and fixture |
| Taxonomy census | Five families, seven registry keys, eight research workstreams, aliases, packet/backend/runtime-loop mappings, exclusion list | No conflated layer; improvement many-to-one mapping explicit |
| Subsystem census | The eight required subsystem lenses with entry points, owners, callers, state, tests, invariants, defects | Exactly 8 complete subsystem rows |
| Event-schema census | JSONL path/pattern, event discriminator/version, required fields, writers, readers, reducers, validators, repair/order rules | Zero producer-only, consumer-only, or unclassified schema rows |
| State/backend census | JSON/JSONL/SQLite/lock/pause/directory/output shape, resolved path, authority, lifecycle, recovery, archival reader | Zero persisted surfaces without owner and recovery policy |
| Contract/defect ledger | Observed behavior, evidence, classification, rationale, scenario/fixture, later-phase owner | Binary classification; no `unknown` |
| Behavior baseline | Existing and added scenario IDs, workstream mapping, semantic oracle, BASE result, evidence digest | Eight-workstream coverage; semantic parity, not count parity |
| Replay/rollback manifest | Sanitized fixtures, expected projections, snapshots, restore/recreate commands, hashes and checks | Clean-temp replay and rollback pass |

The census starts from `.opencode/skills/system-deep-loop/runtime/references/state-format.md` and
`integration-points.md`, then verifies implementation truth in `runtime/lib/`, `runtime/scripts/`, command YAML,
and mode-owned reducers. Seeded JSONL families include `deep-{research,review,alignment}-state.jsonl`, iteration
`deltas/*.jsonl`, research `inbox.jsonl`, council session/round state, improvement
`agent-improvement-state.jsonl` and `improvement-journal.jsonl`, fan-out state events, dispatch failures, and
`runtime/database/observability-events.jsonl`. Seeded backends include `deep-loop-graph.sqlite`,
`council-graph.sqlite`, loop/writer locks, pause markers, and packet-local projections. Discovery must add any runtime
surface not named here; this list is a starting set, not an allowlist.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm this leaf has no predecessor and freeze one full BASE SHA before any generated evidence exists.
- Record repository cleanliness, ref provenance, tool versions, submodule state, and source-tree digests.
- Create the empty evidence-bundle layout and schemas under this phase packet; keep replay work on temporary copies.
- Snapshot the current mode registry and benchmark inventory: five families, seven registry entries, five benchmark
  package roots, and 53 existing scenario files.

### Phase 2: Implementation
- Normalize the 5/7/8 taxonomy and prove the mapping: the improvement family contains a common
  `deep-improvement` workstream and three variant workstreams, while the registry exposes only the three variant keys.
- Build the eight-row subsystem census across convergence, state/checkpointing, fan-out/fan-in, dedup/novelty,
  gauges/observability, budget/cost, locks/recovery, and continuity/threading.
- Trace every JSONL path from writer to all readers, reducers, validators, repair routines, and archival consumers;
  capture discriminators, field requirements, order/idempotency expectations, and compatibility behavior.
- Trace every in-flight state shape and backend through literal paths and artifact-root/path resolvers, including
  packet projections, SQLite stores, lock/pause state, iteration/delta/log trees, and benchmark outputs.
- Classify each observed behavior using executable evidence. Freeze protected contracts as scenario/fixture assertions;
  assign each known defect to its later owning phase without fixing it here.
- Run all current behavior scenarios at BASE, retain their IDs and semantic oracles, and add the missing independent
  workstream coverage until the eight research workstreams can be compared separately.
- Capture sanitized minimal and corrupt-tail/crash-boundary fixtures where applicable; record expected reducers,
  projections, graph state, exit behavior, and integrity digests.
- Define rollback per backend: restore snapshot, rebuild derived projection, reclaim stale lock, or return to BASE.

### Phase 3: Verification
- Verify all artifacts reference the identical full BASE SHA and their hashes reproduce from a clean checkout.
- Verify registry-derived counts are 5 families, 7 workflow modes, and 8 research workstreams with
  `ai-system-improvement` explicitly excluded.
- Verify the subsystem count is exactly eight and reader/writer plus state/backend orphan scans return zero unresolved rows.
- Verify the current 53 scenario IDs remain present and semantically unchanged, while all eight workstreams have
  independent BASE evidence.
- Replay every fixture twice from clean temporary state and compare normalized outputs, reducer projections, and hashes.
- Execute every rollback procedure against temporary copies and prove live tracked runtime/database state is unchanged.
- Freeze the phase-004 handoff manifest only after the contract/defect ledger contains no unknown classification.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Resolve BASE independently, verify full-SHA equality across artifact headers, and reproduce source digests from a clean checkout |
| REQ-002 | Parse `mode-registry.json` and hub declarations; assert 5 family, 7 registry, and 8 workstream rows with the documented improvement mapping |
| REQ-003 | Validate exactly eight subsystem rows and require non-empty owner, entrypoint, state, test, invariant, and evidence fields |
| REQ-004 | Scan JSONL literals/resolvers and append/read/reduce/validate call sites; fail on an unmatched writer, reader, discriminator, or fixture |
| REQ-005 | Compare the backend census with filesystem, config, artifact-root, SQLite, lock, pause, and output-path discovery; fail on unowned persistence |
| REQ-006 | Schema-validate the behavior ledger; assert one of `protected_contract` or `known_defect`, evidence present, and zero unknown rows |
| REQ-007 | Assert all 53 existing scenario IDs remain, run semantic-oracle comparisons, and require independent coverage rows for all eight workstreams |
| REQ-008 | Replay each fixture twice in fresh temporary directories/backends and compare normalized projection and digest output |
| REQ-009 | Run each restore/recreate recipe on a copied backend and verify integrity checks plus no tracked mutation |
| REQ-010 | Verify the handoff manifest enumerates and hashes every required artifact and reports all closure counters at zero |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase has no predecessor (`depends_on: []`). It depends on read access to the 036 parent and phase tree, the
shipped `.opencode/skills/system-deep-loop/runtime/` implementation and integration consumers, the hub
`mode-registry.json`, the five current mode packets, and all five behavior-benchmark packages under
`.opencode/skills/system-deep-loop/*/behavior-benchmark/`. Research truth for the eight-workstream layer comes from
`002-deep-loop-effectiveness-and-fanout/research/research-modes.md`. Phase 004 is blocked until this phase's BASE,
taxonomy, census, behavior baseline, fixtures, and rollback anchors are frozen.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Baseline capture is additive. Generated census and fixture artifacts are regenerated or reverted without changing
BASE. Benchmark extensions preserve existing scenario IDs and are reverted as path-scoped changes if their semantic
oracles are wrong. SQLite and JSONL verification always runs on copies or freshly created temporary backends; rollback
restores the copied snapshot or rebuilds a derived projection from the frozen fixture. If BASE itself is incorrect or
drifts, stop the program and invalidate dependent artifacts explicitly; never silently repoint BASE after phase 004
starts. The final rollback check is a clean tracked tree plus byte/digest parity for every protected source artifact.
<!-- /ANCHOR:rollback -->
