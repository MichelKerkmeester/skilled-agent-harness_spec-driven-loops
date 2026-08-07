---
title: "Tasks: Health & Degeneration Harness"
description: "Tasks for phase 008 of the convergence-termination-and-health program: a generic health and degeneration harness for cross-mode safety signals and bounded response requests."
trigger_phrases:
  - "health and degeneration harness tasks"
  - "deep-loop health signal tasks"
  - "mode collapse detector tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-21T12:01:05Z"
    last_updated_by: "codex"
    recent_action: "Verified scoped recovery and optional-field fail-closed behavior"
    next_safe_action: "Keep health requests dark until a shared gateway grants authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/health-degeneration-harness.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Health & Degeneration Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the pinned baseline, pre-existing worktree state, and path scope for the additive-dark health surface [evidence: `implementation-summary.md` verification table]
- [x] T002 Inventory and pin the authorized ledger/projection watermark, phase-010 gauge schemas, reducer versions, and replay digests [evidence: `implementation-summary.md` verification table]
- [x] T003 Register sibling `002-cycle-detection` event kinds and preserve its fingerprints, periods, progress verdicts, and clearing semantics [evidence: `implementation-summary.md` verification table]
- [x] T004 Build the mode-adapter manifest contract for novelty, independent evidence, coverage, quality, frontier eligibility, and typed cost/yield [evidence: `implementation-summary.md` verification table]
- [x] T005 Freeze the initial health-policy schema, threshold defaults, severity mapping, hysteresis, cooldown, dedupe identity, and bounded retention rules [evidence: `implementation-summary.md` verification table]
- [x] T006 Create the healthy-progress and degeneration fixture matrix before wiring any legacy control path [evidence: `implementation-summary.md` verification table]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Implement canonical `HealthObservation` creation at one completed-attempt or durable state boundary with idempotent replay identity [evidence: `implementation-summary.md` verification table]
- [x] T008 Implement fail-closed validation for ledger cursor, projection watermark, input hashes, reducer/adapter versions, sample counts, and baseline compatibility [evidence: `implementation-summary.md` verification table]
- [x] T009 Implement mode-neutral adapters for semantic-community/fingerprint concentration, novelty, independent evidence, coverage, claim progress, frontier state, quality, and cost/yield [evidence: `implementation-summary.md` verification table]
- [x] T010 Implement mode-collapse detection using concentration plus a typed novelty/progress floor; reject text-only similarity as confirmation evidence [evidence: `implementation-summary.md` verification table]
- [x] T011 Implement repetition ingestion from sibling 002 without duplicating cycle detection or changing cycle event authority [evidence: `implementation-summary.md` verification table]
- [x] T012 Implement novelty-starvation detection with distinct eligible-frontier, exhausted-frontier, empty-frontier, and unknown-frontier outcomes [evidence: `implementation-summary.md` verification table]
- [x] T013 Implement calibrated quality-decay detection with comparable normalized values and evaluator/rubric/verifier provenance [evidence: `implementation-summary.md` verification table]
- [x] T014 Implement budget-thrash detection from typed retries, cancellations, leases, denials, reallocations, settlements, and realized evidence yield [evidence: `implementation-summary.md` verification table]
- [x] T015 Implement `telemetry_gap` and `not_evaluable` handling that never emits a positive `healthy` verdict for missing or inconsistent inputs [evidence: `implementation-summary.md` verification table]
- [x] T016 Implement versioned threshold evaluation, severity mapping, deterministic simultaneous-signal aggregation, cooldown, hysteresis, and bounded deduplication [evidence: `implementation-summary.md` verification table]
- [x] T017 Implement append-only signal, scope-local aggregate state, per-scope recovery streaks, and typed response-request projections [evidence: `implementation-summary.md` verification table]
- [x] T018 Implement `observe`, pause, re-seed, quarantine, repair, and stop-request mappings with safe-point and authorization fields [evidence: `implementation-summary.md` verification table]
- [x] T019 Wire shadow outputs beside legacy convergence, fan-in, allocation, budget, and dispatch paths without changing their decisions [evidence: `implementation-summary.md` verification table]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Verify: Health observations are canonical and replayable - incremental and genesis replay produce identical observation hashes and watermarks [evidence: `implementation-summary.md` verification table]
- [x] T021 Verify: The signal vocabulary is typed and mode-agnostic - every signal kind has schema, severity, provenance, and action fixtures [evidence: `implementation-summary.md` verification table]
- [x] T022 Verify: Mode collapse requires concentration plus absent progress - productive revisitation and evidence progress prevent confirmation [evidence: `implementation-summary.md` verification table]
- [x] T023 Verify: Cycle evidence remains owned by sibling 002 - period, fingerprints, progress, and clearing evidence are preserved without duplicate detection [evidence: `implementation-summary.md` verification table]
- [x] T024 Verify: Novelty starvation is distinct from an exhausted frontier - eligible, exhausted, empty, and unknown frontier cases do not collapse into one state [evidence: `implementation-summary.md` verification table]
- [x] T025 Verify: Quality decay is evidence-backed and calibrated - incompatible evaluator or baseline digests fail closed [evidence: `implementation-summary.md` verification table]
- [x] T026 Verify: Budget thrash uses typed cost and realized yield - retry pressure is detected without relabeling budget exhaustion as convergence [evidence: `implementation-summary.md` verification table]
- [x] T027 Verify: Thresholds are explicit and versioned - boundary, policy-change, hysteresis, cooldown, and unsupported-version fixtures pass [evidence: `implementation-summary.md` verification table]
- [x] T028 Verify: Signals include sufficient audit evidence - traces contain source cursors, gauges, policy/adapter digests, and deterministic comparisons [evidence: `implementation-summary.md` verification table]
- [x] T029 Verify: Responses are typed requests, not hidden authority - no request dispatches, cancels, or stops without the shared gateway or stopping-clock contract [evidence: `implementation-summary.md` verification table]
- [x] T030 Verify: Recovery has hysteresis and preserves history - optional silence remains `not_evaluable`, signal-specific improvement is required, and two same-scope windows clear only that scope without rewriting prior signals [evidence: `implementation-summary.md` verification table]
- [x] T031 Verify: Health remains additive-dark and cross-mode neutral - legacy outputs and decisions remain unchanged across all registered adapters [evidence: `implementation-summary.md` verification table]
- [x] T032 Verify: Insufficient or inconsistent inputs fail closed - gaps, stale watermarks, conflicts, and missing baselines never return `healthy` [evidence: `implementation-summary.md` verification table]
- [x] T033 Verify: Simultaneous signals have deterministic aggregation - input ordering does not change individual evidence or aggregate state [evidence: `implementation-summary.md` verification table]
- [x] T034 Verify: The harness is bounded and idempotent - retention limits hold and duplicate delivery creates no duplicate records [evidence: `implementation-summary.md` verification table]
- [x] T035 Verify: Source traceability is preserved - the report cites sibling 002, phase-010 gauges, `research-modes.md`, and `manifest/phase-tree.json` [evidence: `implementation-summary.md` verification table]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: `implementation-summary.md` verification table]
- [x] All requirements in spec.md met with evidence [evidence: `implementation-summary.md` verification table]
- [x] Phase gate green: 14 unit tests, TypeScript compilation, and strict packet validation pass [evidence: `implementation-summary.md` verification table]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
