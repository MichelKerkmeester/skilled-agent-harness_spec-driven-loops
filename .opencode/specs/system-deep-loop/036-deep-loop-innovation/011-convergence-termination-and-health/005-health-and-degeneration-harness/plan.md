---
title: "Implementation Plan: Health & Degeneration Harness"
description: "Implementation Plan for phase 008 of the convergence-termination-and-health program: a generic monitor for mode collapse, repetition, novelty starvation, quality decay, budget thrash, and unusable health inputs."
trigger_phrases:
  - "health and degeneration harness implementation plan"
  - "deep-loop health signal implementation"
  - "mode collapse detection plan"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-21T12:01:05Z"
    last_updated_by: "codex"
    recent_action: "Hardened recovery evidence and scope isolation"
    next_safe_action: "Keep health requests dark until a shared gateway grants authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/health-degeneration-harness.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Health & Degeneration Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared convergence/health runtime |
| **Change class** | New additive-dark health projection, typed signal events, and action-request boundary |
| **Execution** | Isolated worktree pinned to the phase baseline; no authority cutover in this phase |

### Overview
The harness is a shared monitor over durable ledger and projection evidence. It consumes phase-010 gauges and projection
watermarks, sibling 002 cycle events, fan-in/result receipts, VOC allocation decisions, typed budget activity, and
mode-adapter quality evidence. It emits replayable health observations, individual signals, aggregate health state, and
non-authoritative response requests. It must identify when the loop is going bad without reducing health to output count,
text similarity, model/provider count, iteration count, or budget exhaustion.

The first implementation remains shadow-only. Legacy convergence, fan-in, allocation, and dispatch continue to own behavior;
the harness records parity and degeneration evidence beside them. A later phase may authorize action requests after fixtures,
shadow calibration, and the shared mode contract are complete.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The authorized event/projection boundary and phase-010 gauge versions are available at one coherent watermark
- [x] Sibling `002-cycle-detection` event schema and progress verdict are registered as an input, not reimplemented
- [x] Every registered mode has an adapter manifest for novelty, independent evidence, quality, frontier eligibility, and cost/yield fields
- [x] The initial health policy records windows, minimum samples, thresholds, hysteresis, cooldown, and a policy digest
- [x] Response actions are defined as requests with authorization state, safe-point behavior, scope, and rollback handling
- [x] Shadow fixtures cover healthy progress and each degeneration class before any runtime consumer changes

### Definition of Done
- [x] Health observations and signals replay identically from incremental and full ledger input
- [x] Mode collapse, repetition, novelty starvation, quality decay, budget thrash, telemetry gaps, and recovery are typed and auditable
- [x] Aggregate state and response requests are deterministic, bounded, idempotent, and fail closed on missing or inconsistent evidence
- [x] Shadow integration proves no legacy stop, dispatch, budget, fan-in, or allocation authority changed
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Observation boundary**: accept only an authorized ledger prefix, one phase-010 projection watermark, and a completed
  attempt or durable state transition. Reject mixed cursors, stale projection generations, sequence gaps, unknown reducer
  versions, and conflicting hashes.
- **Mode adapter registry**: map each mode to a shared schema for semantic community/fingerprint, novelty and independent
  evidence, path/community coverage, claim or finding progress, normalized quality, eligible frontier, and typed cost/yield.
  Adapters provide values and provenance; the generic harness owns no mode-specific evaluator or wording.
- **Health observation**: persist run, mode, region/lineage, ledger cursor, projection watermark, source event IDs, input
  gauges, adapter/policy digests, sample counts, threshold comparisons, and an idempotency key. Use canonical serialization so
  incremental and replay execution produce one digest.
- **Signal detectors**: evaluate concentration plus progress for `mode_collapse`; consume sibling 002 for `repetition`;
  compare low independent-evidence yield with an eligible frontier for `novelty_starvation`; compare normalized quality to
  a declared baseline for `quality_decay`; compare typed retry/cancel/reallocation pressure with settled yield for
  `budget_thrash`; and emit `telemetry_gap` or `not_evaluable` for insufficient input.
- **Threshold policy**: register the provisional shadow defaults from spec.md as a versioned policy. Keep window sizes,
  floors, concentration counts, decay delta, thrash ratio, severity mapping, healthy-window count, cooldown, retention, and
  dedupe keys explicit in every trace. Calibration creates a new policy version instead of mutating historical conclusions.
- **Aggregation**: retain every individual signal and compute a deterministic aggregate from the exact run/mode/lineage/region
  scope, severity, data validity, and stable signal ordering. Detector windows and recovery streaks use that same scope.
  Required-input gaps outrank positive health. A recovered state requires two coherent windows with qualifying progress and
  present improvement evidence for every active signal's own dimension; optional silence is `not_evaluable`.
- **Action-request boundary**: map aggregate state to `observe`, `pause_region`, `pause_mode`, `reseed_frontier`,
  `quarantine_candidate`, `repair_telemetry`, or `request_stop`. Requests carry safe-point, scope, evidence, and authorization
  fields. The transition gateway and stopping-clock contract decide whether any request executes.
- **Storage and retention**: use append-only signal and request events plus bounded active-state and trace projections.
  Deduplication is keyed by run, scope, ending cursor, signal kind, policy version, and evidence digest. Clearing appends a
  new event; it never edits the original signal or source observation.
- **Dark integration**: publish health outputs beside legacy convergence and allocation traces. No health output changes a
  current stop, fan-in, budget, allocation, or dispatch branch before a later authority decision.

### Initial shadow policy

| Control | Initial value | Guard |
|---------|---------------|-------|
| Observation window | 8 comparable observations | Fewer than 4 comparable observations cannot classify concentration or quality |
| Collapse candidate | 6 of 8 in one registered community/fingerprint plus below-floor progress | Similar text without typed identity/progress evidence is not sufficient |
| Novelty starvation | 4 low-independent-evidence results in 6 eligible attempts with non-empty frontier | Empty or unknown frontier emits `not_evaluable` |
| Quality decay | Lower-confidence bound falls by 0.10 from baseline across 3 comparable observations | Baseline, evaluator, or verifier digest must match |
| Budget thrash | 3 retry/cancel/reallocation events in 8 decisions or 30% retry pressure plus low yield | Compute ratios within typed dimensions; settle before escalation |
| Recovery hysteresis | 2 consecutive verified windows per exact signal scope | Missing or unrelated-dimension data cannot satisfy recovery, and clearing affects only that scope |
| Cooldown and dedupe | Policy-defined bounded cooldown keyed to evidence boundary | New material evidence still emits a new signal |

The exact policy representation, numeric precision, and storage backend are implementation decisions after the event and gauge
schemas are frozen. The invariants are the explicit policy digest, fail-closed input validation, replay-stable comparisons,
and separation between signal evidence and action authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the target worktree is clean and pinned to the phase baseline; verify that only the target runtime surface is in scope.
- Register the source schemas and digests for the authorized ledger, phase-010 transactional projections/gauges,
  `002-cycle-detection`, fan-in/result receipts, VOC decisions, and typed budget events.
- Build the mode-adapter matrix and state which fields are unavailable, optional, or required for each of the eight
  workstreams; an unregistered or incomplete adapter must fail closed.
- Freeze the initial shadow policy, health state vocabulary, action-request vocabulary, event identities, and bounded retention
  rules in fixtures before implementation begins.

### Phase 2: Implementation
- Implement canonical health observations over one committed cursor/watermark and reject stale, mixed, or unknown inputs.
- Implement typed adapters for semantic concentration, novelty/independent evidence, path/community progress, normalized
  quality, eligible frontier, typed cost/yield, and cycle-event provenance.
- Implement the six degeneration/data-gap detector paths: collapse, repetition ingestion, novelty starvation, quality decay,
  budget thrash, and telemetry gap/not-evaluable handling.
- Implement versioned threshold evaluation, severity mapping, deterministic simultaneous-signal aggregation, cooldown,
  hysteresis, and idempotent signal projection.
- Implement typed response requests with scope, evidence, safe-point, budget/lease handling, authorization state, and the
  explicit rule that `request_stop` is only a stopping-clock candidate.
- Add append-only clear/recovery events, bounded active-state projections, and replay/rebuild support without deleting source
  observations or health history.
- Wire the harness in shadow mode beside legacy convergence and allocation paths; record mismatches without changing their
  decisions.

### Phase 3: Verification
- Replay each fixture from genesis and from a committed watermark; compare observations, signal IDs, traces, active state,
  aggregate state, and request digests.
- Verify healthy progress, productive revisitation, fixed/repeated states, concentration collapse, novelty starvation, quality
  decay, budget thrash, simultaneous faults, recovery hysteresis, stale inputs, and unknown-version cases.
- Verify sibling 002 cycle events preserve their period, fingerprints, progress verdict, and policy provenance, and that the
  harness does not emit a duplicate cycle detector result.
- Verify every action request remains non-authoritative and cannot bypass the transition gateway, typed budget, fan-in, or
  stopping-clock contracts.
- Run the shadow parity suite against legacy convergence, allocation, fan-in, budget, and dispatch behavior; require zero
  behavior changes and explicit mismatch receipts where the new signal differs.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Incremental and genesis replay produce identical observation bytes, source watermarks, input digests, and idempotency keys |
| REQ-002 | Schema fixtures enumerate every signal kind, severity/status transition, source provenance, and action mapping |
| REQ-003 | Concentration without progress emits the configured collapse signal; productive claim, coverage, contradiction, or evidence progress prevents confirmation |
| REQ-004 | Sibling 002 fixed-point and period-two-to-four fixtures are consumed with the original event evidence and produce no second cycle interpretation |
| REQ-005 | Eligible-frontier starvation, exhausted-frontier, empty-frontier, and unknown-frontier fixtures remain distinct |
| REQ-006 | Comparable quality decline crosses the configured lower-confidence threshold; mixed evaluator/rubric/verifier digests fail closed |
| REQ-007 | Typed retry, cancellation, lease, denial, and settlement fixtures detect thrash without relabeling budget exhaustion as convergence |
| REQ-008 | Policy-version and threshold-boundary fixtures prove exact windows, minimum samples, hysteresis, cooldown, and unsupported-version refusal |
| REQ-009 | Signal traces contain event IDs/cursors, gauge values, threshold results, policy/adapter digests, missing-data verdicts, and deterministic evidence ordering |
| REQ-010 | Pause, re-seed, quarantine, repair, and stop requests are recorded as unauthorized or pending until the shared gateway/clock contract accepts them |
| REQ-011 | Two same-scope windows with signal-specific improvement clear only that scope; optional silence cannot advance recovery, and duplicate boundaries do not duplicate observations, signals, requests, or clear events |
| REQ-012 | Shadow integration proves legacy stop, fan-in, allocation, budget, and dispatch outputs remain byte/semantic equivalent |
| REQ-013 | Watermark gaps, stale generations, unknown reducers, conflicting hashes, missing baselines, and non-monotonic cursors never return `healthy` |
| REQ-014 | Simultaneous and cross-lineage fixtures produce stable individual records and scope-local aggregate state under input reordering |
| REQ-015 | Retention and trace-size limits bound state without changing the replay result for the retained decision window |
| REQ-016 | Verifier output cites sibling 002, phase-010 gauges, `research-modes.md`, and `manifest/phase-tree.json` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The planning contract is independent (`depends_on: []`), but runtime implementation consumes the transition-authorized
ledger and replay identity, phase-007 receipts/budgets/gauges, phase-009 durable fan-in and result receipts, phase-010
transactional projections and gauges, and phase-011 siblings 001-004. The direct input contracts that must be pinned before
implementation are:

- `011-convergence-termination-and-health/002-cycle-detection/spec.md` for cycle evidence and progress-gated repetition.
- `010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges/spec.md` for coherent gauge and
  projection watermarks; the harness consumes those gauges and does not redefine their folds.
- `002-deep-loop-effectiveness-and-fanout/research/research-modes.md` for the run-2 longitudinal evidence, falsifiability,
  quality, cost, and anti-aggregate findings.
- `036-deep-loop-innovation/manifest/phase-tree.json` for phase outcome, sequencing, and the explicit `depends_on`
  entry.

The phase-012 shared mode contract must receive the adapter and action-request boundary. The later migration and cutover
phases own authority, compatibility, rollback windows, and legacy retirement; this plan must not pull those decisions forward.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The harness lands additive and dark. If a detector, adapter, threshold policy, or projection causes false positives, disable
the shadow consumer or revert the path-scoped commits; legacy convergence, fan-in, allocation, budget, and dispatch remain
authoritative. Historical health observations and signals are append-only evidence and may be retained for diagnosis, but no
action request is executed after the consumer is disabled.

If a policy or adapter version is invalid, quarantine that version, emit `telemetry_gap`/`not_evaluable`, and replay from the
last verified watermark after the source contract is corrected. Do not delete source ledger records, rewrite cycle evidence,
erase budget receipts, or alter phase-010 gauge history. A later authority cutover requires its own rollback window and is not
part of this phase.
<!-- /ANCHOR:rollback -->
