---
title: "Implementation Plan: path-covering termination (006 phase 008 child 001)"
description: "Implementation plan for mode coverage profiles, replay-stable coverage universes, blocker-aware termination, partial-coverage reporting, and additive shadow integration."
trigger_phrases:
  - "path-covering termination implementation plan"
  - "coverage certificate plan"
  - "deep-loop phase 008 child 001 plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-15T15:19:24Z"
    last_updated_by: "codex"
    recent_action: "Planned coverage certificates, termination evaluation, and shadow integration"
    next_safe_action: "Implement the mode profiles and replay-stable coverage reducer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Path-Covering Termination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + coverage graph (phase 008 child 001) |
| **Change class** | Additive termination logic, projections, reports, and fixtures |
| **Execution** | Dark/shadow evaluation; legacy convergence remains authoritative |

### Overview
Implement a mode-profiled coverage layer above the shipped coverage graph and phase-007 semantic-community projection. The layer
freezes a replayable path universe, reduces evidence and contradiction events into explicit path states, emits complete or partial
coverage certificates, and evaluates a fail-closed termination predicate. Existing iteration snapshots and council bridge fields
remain available for parity, but an iteration/time/budget cap below complete mandatory coverage becomes `INCOMPLETE_LIMIT`, not
convergence. Exact profile thresholds and evidence sufficiency are calibrated during implementation against frozen fixtures.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The supported mode inventory and owner for each `ModeCoverageProfile` are frozen against the phase-009 shared-mode boundary
- [ ] Phase-007 community, contradiction, claim-continuity, and projection schemas have stable version fields consumable by the evaluator
- [ ] Existing coverage-signal and council decision outputs are captured as shadow-parity baselines
- [ ] Mandatory-region, authorized-exclusion, evidence-sufficiency, and universe-expansion policies are explicit per mode
- [ ] Complete, partial, blocked, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replay, and limit-exhausted fixtures are frozen

### Definition of Done
- [ ] Every supported mode compiles a deterministic, versioned coverage universe and rejects unknown or incomplete profiles
- [ ] The path reducer and full replay produce identical path states, coverage ratios, projection versions, and certificate hashes
- [ ] `STOP_ALLOWED` occurs only on complete mandatory coverage with fresh projections, resolved critical contradictions, and zero blockers
- [ ] Non-stop outcomes emit actionable partial coverage; resource exhaustion is `INCOMPLETE_LIMIT`
- [ ] Shadow integration preserves legacy authority and exposes decision/certificate parity without changing production thresholds
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Mode coverage profile**: a versioned declarative contract keyed by supported mode. It defines path dimensions, deterministic ID derivation, major/mandatory rules, evidence obligations, contradiction policy, exclusion authority, weighting, and closeable states. Profiles are intentionally mode-specific; the shared evaluator does not invent a universal convergence formula.
- **Coverage-universe compiler**: expands the mode profile plus immutable run inputs into a frozen `CoverageUniverse`. The snapshot binds profile version, input fingerprint, namespace, run ID, ledger position, and phase-007 projection versions. Late major-region discovery creates a successor universe and invalidates older stop candidates.
- **Path-state reducer**: folds ledger and projection events into `unvisited`, `active`, `addressed`, `blocked`, or `excluded` records with evidence locators and transition provenance. Incremental reduction must equal a full replay; ambiguous communities and stale projections stay open.
- **Coverage certificate**: records the full denominator, addressed/total major regions, weighted and unweighted coverage, mandatory gaps, blocker and contradiction IDs, exclusions, community/projection versions, evidence references, and replay fingerprint. The certificate hash is the auditable stop proof.
- **Termination evaluator**: a pure decision function over the frozen universe, current path projection, blockers, contradiction state, and clock outcome. Precedence is fail-closed: invalid/stale input or STOP blocker → `STOP_BLOCKED`; full mandatory coverage → `STOP_ALLOWED`; remaining work with capacity → `CONTINUE`; remaining work after a safety clock fires → `INCOMPLETE_LIMIT`.
- **Partial-coverage reporter**: serializes every open or blocked path, closure evidence still required, applicable contradiction, and ranked next focus. Weighting directs attention but cannot erase a mandatory gap.
- **Compatibility bridge**: maps the new decision, trace, blockers, and certificate reference into the existing council/coverage observability shape. Shadow mode compares decisions and records disagreements while leaving the legacy predicate authoritative until phase 011.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the supported mode/profile inventory, current decision schemas, phase-007 projection inputs, and baseline fixtures.
- Record the exact current behavior of coverage snapshots and council `STOP_ALLOWED`/`STOP_BLOCKED`/`CONTINUE` decisions for shadow comparison.
- Define profile-version, universe-version, projection-freshness, certificate, and exclusion-authorization schemas before writing reducers.

### Phase 2: Implementation
- Implement mode-profile validation and deterministic coverage-universe compilation with stable path IDs and successor-version semantics.
- Implement the incremental path-state reducer plus full-replay rebuild over evidence, semantic-community, contradiction, and exclusion events.
- Implement coverage aggregation without allowing weighted scores to override uncovered mandatory paths.
- Implement the pure termination predicate and strict outcome precedence, including `INCOMPLETE_LIMIT` for exhausted clocks below full coverage.
- Implement complete and partial certificate serialization, certificate hashing, blocker/contradiction traces, and ranked uncovered-path output.
- Add the shadow compatibility bridge and disagreement telemetry; retain existing convergence authority and thresholds.

### Phase 3: Verification
- Prove mode-profile completeness and fail-closed handling of unknown modes, invalid profiles, stale projections, and empty universes.
- Prove incremental/full-replay parity and stable certificate hashes across event order, process restart, and mixed-version fixtures.
- Prove paraphrases do not inflate concept coverage, evidence novelty stays visible, and community drift supersedes stale certificates.
- Prove every mandatory gap, critical contradiction, ambiguous major community, and STOP blocker prevents `STOP_ALLOWED`.
- Prove iteration, time, or budget exhaustion below complete coverage returns `INCOMPLETE_LIMIT` with the exact remaining paths.
- Compare shadow outcomes with legacy council and coverage signals; classify every disagreement without moving authority.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Profile-schema and per-mode golden fixtures prove every supported mode declares dimensions, mandatory regions, evidence, contradictions, exclusions, and a version |
| REQ-002 | Golden universe fixtures and replay tests produce identical path IDs, denominators, versions, and fingerprints from identical inputs |
| REQ-003 | Paraphrase, distinct-neighbor, ambiguous-community, and evidence-only fixtures prove concept coverage follows committed phase-007 membership |
| REQ-004 | Truth-table/property tests cover every validity, freshness, mandatory-path, contradiction, ambiguity, and blocker combination; no forbidden state returns `STOP_ALLOWED` |
| REQ-005 | Iteration, time, and budget exhaustion fixtures below full coverage return `INCOMPLETE_LIMIT`; complete coverage remains independently provable |
| REQ-006 | Partial-report snapshots contain denominator, ratios, open/blocked IDs, required evidence, contradiction IDs, versions, and deterministic next-path ranking |
| REQ-007 | Evidence and exclusion provenance tests reject aggregate-only closure, unauthorized exclusion, missing policy version, and dangling ledger references |
| REQ-008 | Shadow integration tests preserve legacy authority and bridge fields while recording old/new decision disagreements and certificate references |
| REQ-009 | Incremental-vs-replay, restart, event-order, late-discovery, community-drift, mixed-version, empty, and limit-exhaustion suites produce stable outcomes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child has no sibling `depends_on`; adjacency is navigational. It consumes the program-level typed ledger and transition gate
(phase 003), budgets and projection/identity services (004), durable fan-in (006), and committed semantic-community,
contradiction, claim-continuity, and transactional projection outputs (007). Grounding contracts are
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`,
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities/spec.md`,
`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts`, and
`.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and shadow-only. Disable the path-coverage evaluator and certificate projection, stop its shadow
writer, and continue using the legacy council/coverage predicate; no authoritative event or in-flight state requires rewriting.
Retain emitted certificates as non-authoritative diagnostics keyed by schema version. Revert the phase's path-scoped commits if
shadow processing itself is unsafe, then replay from the ledger after correction. Authority cutover and its rollback window remain
owned by phase 011, so this phase cannot strand a run on the new predicate.
<!-- /ANCHOR:rollback -->
