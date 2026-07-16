---
title: "Feature Specification: baseline, taxonomy, and state census"
description: "Freeze the immutable BASE and authoritative deep-loop taxonomy, then capture the runtime, state, schema, behavior-benchmark, replay-fixture, defect-contract, and rollback evidence every later 006 phase must preserve."
trigger_phrases:
  - "baseline taxonomy and state census"
  - "deep-loop recommendations phase 003"
  - "deep-loop immutable BASE census"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/003-baseline-taxonomy-and-state-census"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored the phase-003 baseline and census specification"
    next_safe_action: "Pin BASE before collecting census or benchmark evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Baseline, taxonomy, and state census

> Sibling phase adjacency (sorted order under the 065 parent): predecessor `002-deep-loop-effectiveness-and-fanout`; successor `004-architecture-coverage-and-transition-contract`.

> Phase adjacency under the 006 parent (dependency order): predecessor none; successor `004-architecture-coverage-and-transition-contract`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/003-baseline-taxonomy-and-state-census |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 003 of the 006 recommendations-implementation program; first leaf in `manifest/phase-tree.json` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 program will replace a live, stateful deep-loop runtime through additive dark writes, compatibility adapters,
shadow parity, staged authority cutover, and gated legacy retirement. None of those claims is testable until one
immutable BASE commit and its observable behavior are frozen. The present vocabulary is also ambiguous: the hub
documents five active workflow families, `mode-registry.json` registers seven public `workflowMode` keys, while the
research program defines eight workstreams by treating `deep-improvement` as both a workstream and the common parent
of three benchmark variants. Packet 033's behavior evidence mirrors the five package roots rather than that eight-way
research decomposition.

This phase establishes the non-negotiable reference corpus. It pins one BASE for all phases 000-014; states the 5/7/8
taxonomy authoritatively; inventories the eight runtime subsystems, every JSONL schema and its readers and writers,
every persisted in-flight state shape and backend path; separates protected behavior from known defects; extends the
existing behavior benchmarks into an eight-workstream, scenario-semantic baseline; and freezes replay fixtures and
rollback anchors keyed to BASE. Later phases must compare against these artifacts rather than a moving checkout or a
scenario-count proxy.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pin one full immutable BASE commit for the entire 006 program and record its tree cleanliness, repository state,
  tool versions, source digests, and baseline artifact hashes in a single manifest.
- Normalize three distinct taxonomy layers: **5 workflow families** (`research`, `review`, `ai-council`,
  `improvement`, `alignment`); **7 registered workflow modes** (`research`, `review`, `ai-council`,
  `agent-improvement`, `model-benchmark`, `skill-benchmark`, `alignment`); and **8 research workstreams**
  (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`, `agent-improvement`,
  `model-benchmark`, `skill-benchmark`). `deep-improvement` is the shared workstream/packet parent of the three
  improvement variants, not an eighth registered `workflowMode`; `ai-system-improvement` is excluded.
- Census exactly eight runtime subsystem lenses: convergence; state JSONL/checkpointing; fan-out/fan-in;
  dedup/novelty; gauges/observability; budget/cost; locks/recovery; continuity/threading. Each row records owners,
  entry points, callers, persisted state, tests, invariants, and candidate defects.
- Census every JSONL event surface and schema, including packet state logs, per-iteration deltas, research inbox,
  council session/round state, improvement state and lifecycle journal, fan-out events, executor failures, and
  observability events. Each schema row records its discriminator/version, required fields, writer, readers/reducers,
  repair behavior, ordering/idempotency rules, and historical-read obligation.
- Census every persisted in-flight state shape and backend path: JSON/JSONL projections, lock and pause markers,
  prompt/log/delta/iteration directories, benchmark outputs, SQLite coverage/council graphs, writer locks, and any
  packet-local state resolved through the runtime artifact-root seam.
- Produce a binary known-defect-versus-protected-contract ledger. Every observed behavior has evidence, an owner,
  a linked scenario or fixture, and one final classification before phase 004 begins; no ambiguous bucket survives.
- Inventory the five existing behavior-benchmark packages and 53 scenario IDs under
  `.opencode/skills/system-deep-loop/*/behavior_benchmark/`, then extend coverage to all eight research workstreams.
  Preserve existing IDs and compare expected routing, halt/fail-fast behavior, evidence kind, state mutation, and
  terminal semantics against BASE; package or scenario counts alone are insufficient.
- Capture minimal sanitized replay fixtures and expected projections for each state/event family, plus rollback
  anchors that identify the BASE commit, state snapshots, restoration commands, integrity digests, and success checks.

### Out of Scope
- Ratifying the typed-ledger architecture, minting the 178 recommendation IDs, or defining transition authority
.
- Implementing a new ledger, changing canonical persistence, or moving runtime authority (phases 003-011).
- Fixing defects discovered by the census. Defects are classified and linked to their owning later phase.
- Removing legacy readers or writers, or running the final whole-system gate.
- Adding `ai-system-improvement` to the program.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One immutable BASE is pinned for phases 000-014 | A full commit SHA, clean/dirty state, ref provenance, tool versions, submodule state, and source digests are recorded once; every baseline artifact references the same SHA |
| REQ-002 | The deep-loop taxonomy is normalized without conflating layers | The census states 5 workflow families, 7 registered `workflowMode` keys, and 8 research workstreams; mappings are bijective where applicable and explicitly many-to-one for the improvement family |
| REQ-003 | The eight runtime subsystems are completely inventoried | Every subsystem has owners, entry points, callers, state, tests, invariants, and defect candidates with live path evidence under `.opencode/skills/system-deep-loop/runtime/` or its mode consumers |
| REQ-004 | Every JSONL schema has closed reader/writer traceability | Every discovered JSONL path has a discriminator/shape, all writers, all readers/reducers/validators, repair and ordering semantics, and a replay fixture; an automated orphan check reports zero unclassified producers or consumers |
| REQ-005 | All persisted in-flight state and backends are censused | JSON, JSONL, SQLite, lock/pause, directory, and output artifacts have canonical/resolved paths, ownership, lifecycle, mutability, recovery, archival-read, and authority status recorded |
| REQ-006 | Current behavior is split into protected contracts and known defects | Each observed behavior is classified exactly once with evidence and an owner; protected contracts have no-regression scenarios, defects have a later-phase disposition, and no `unknown` classification remains |
| REQ-007 | Packet-033 behavior evidence becomes an eight-workstream baseline | The current 5 packages/53 scenarios are frozen by ID and semantics; coverage is extended until all 8 workstreams have independent semantic assertions and BASE results, without renumbering or weakening existing scenarios |
| REQ-008 | Replay fixtures reproduce current state semantics | Sanitized fixtures cover each event/state family, declare schema/source digests and expected reducer/projection results, and replay deterministically from a clean temporary backend |
| REQ-009 | Rollback anchors are executable and keyed to BASE | Every mutable backend has a snapshot/restore or recreate procedure, integrity digest, rollback boundary, and pass/fail check tied to BASE; fixture execution never mutates live tracked state |
| REQ-010 | Phase 004 receives a frozen, auditable handoff | A manifest enumerates all census and baseline artifacts, hashes them, reports zero unresolved taxonomy/schema/state rows, and is referenced by the phase-004 architecture contract |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All later 006 phases name the same immutable BASE and can verify the baseline manifest's digests.
- **SC-002**: The authoritative 5-family / 7-workflowMode / 8-workstream taxonomy resolves the parent spec's ambiguity.
- **SC-003**: Reader/writer, state-backend, and eight-subsystem censuses close with zero unclassified persisted surfaces.
- **SC-004**: No-regression evidence is addressable by stable scenario ID plus semantic assertions for all eight workstreams.
- **SC-005**: Replay and rollback checks reconstruct BASE behavior without writing to live tracked runtime state.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 006 parent spec: taxonomy conflation, live in-flight state, hidden cross-mode
coupling, concurrent branch movement, and accidental preservation of defects. Phase-specific risks are baseline drift
after capture, missed dynamic path construction, reader/writer discovery that stops at `runtime/` and omits mode/YAML
consumers, fixtures containing credentials or host paths, count-only benchmark comparisons, and replay against live
SQLite files. The controlling sources are the 006 parent and phase tree, the shipped
`.opencode/skills/system-deep-loop/runtime/` tree, the mode registry and packets, the five current
`behavior_benchmark/` packages, and the run-2 eight-workstream research synthesis.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for authoring. During execution, observed behavior must be resolved into protected contract or known
defect before phase 004; unresolved evidence blocks the handoff rather than creating an `unknown` taxonomy bucket.
<!-- /ANCHOR:questions -->
