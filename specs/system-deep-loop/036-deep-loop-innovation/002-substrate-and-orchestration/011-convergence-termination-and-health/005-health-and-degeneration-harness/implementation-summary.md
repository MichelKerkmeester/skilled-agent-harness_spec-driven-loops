---
title: "Implementation Summary: Health & Degeneration Harness"
description: "Delivered replay-stable cross-mode health observations, fail-closed degeneration signals, request-only responses, and additive-dark legacy isolation."
trigger_phrases:
  - "health degeneration harness implementation"
  - "mode collapse verification"
  - "health signal replay evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/005-health-and-degeneration-harness"
    last_updated_at: "2026-07-21T12:01:05Z"
    last_updated_by: "codex"
    recent_action: "Fixed silent recovery and cross-scope contamination"
    next_safe_action: "Keep health requests dark until a shared gateway grants authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/health-degeneration-harness.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The initial policy uses an eight-observation window and two-window recovery hysteresis"
      - "Recovery requires present improvement evidence for each active signal's own dimension"
      - "Detector windows, streaks, aggregates, and clearing are isolated by exact signal scope"
      - "All response actions remain pending requests with no execution receipt"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-health-and-degeneration-harness |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Repository baseline** | `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Health policy** | `health-shadow-v1` |
| **Policy digest** | `31eb385cc2069e5927885b7518ec9f980b309873921dca03ce97d58e369c4182` |
| **Projector** | `health-observation-projector-v2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime can now evaluate generic loop health at committed ledger and projection boundaries without changing any current
stop or dispatch decision. The new projector records canonical observations, emits typed degeneration or evaluability
signals, aggregates simultaneous faults deterministically, and proposes bounded response actions that remain pending at the
shared authorization boundary.

### Real Health Evidence

Mode collapse requires a registered semantic-community or canonical-fingerprint concentration and a simultaneous violation
of the novelty, independent-evidence, coverage, and claim-progress floors. Text similarity remains audit-only input and can
never confirm collapse. Novelty starvation separately requires low independent-evidence yield while an eligible frontier has
work; exhausted, empty, and unknown frontiers produce `not_evaluable` instead.

Quality decay consumes normalized lower-confidence observations with a declared baseline plus evaluator, rubric, verifier,
and calibration digests. Typed budget pressure is grouped by cost dimension and combined with realized evidence yield. The
harness does not synthesize either score. Missing inputs, stale or mixed watermarks, gaps, conflicts, unsupported versions,
and non-monotonic cursors fail closed as `telemetry_gap`, `not_evaluable`, or typed errors.

### Cycle Ownership and Recovery

The cycle adapter consumes the real sibling `CycleHealthEventPayload` schema. Suspected, confirmed, and cleared events retain
their original cursors, fingerprints, periods, progress verdicts, and detector policy; the harness runs no repeated-state
algorithm. Detector windows, aggregate inputs, and recovery streaks are keyed by the exact run, mode, lineage, and region.
Active faults clear only after two coherent same-scope windows provide qualifying progress and present improvement evidence
for every active signal's own dimension. An absent optional field emits `not_evaluable` while its signal is active and cannot
advance recovery. A `health_recovered` event clears only the current scope, while every prior signal and observation remains
in bounded append-only history.

### Requests Without Authority

The response vocabulary covers `observe`, `pause_region`, `pause_mode`, `reseed_frontier`, `quarantine_candidate`,
`request_stop`, and `repair_telemetry`. Every non-observe response names its requested scope, safe-point and budget handling,
and fixes authorization to `pending_gateway` with null gateway, execution, and receipt fields. The shadow wrapper returns the
legacy result by object identity for both healthy and degenerate observations.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/health-degeneration-harness/health-harness-types.ts` | Created | Shared observation, signal, aggregate, error, and request contracts |
| `runtime/lib/health-degeneration-harness/health-policy.ts` | Created | Versioned thresholds, bounds, cooldown, hysteresis, and closed policy registry |
| `runtime/lib/health-degeneration-harness/health-adapters.ts` | Created | Mode-neutral typed adapters, committed-gauge reads, and closed adapter registry |
| `runtime/lib/health-degeneration-harness/health-observation-projector.ts` | Created | Canonical projection, detectors, aggregation, recovery, replay, dedupe, and shadow wrapper |
| `runtime/lib/health-degeneration-harness/index.ts` | Created | Public module surface |
| `runtime/tests/unit/health-degeneration-harness.vitest.ts` | Created | Fourteen adversarial contract fixtures |
| Leaf packet documents | Modified/Created | Completion state, task evidence, checklist evidence, and this report |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All executable code is additive under `runtime/lib/health-degeneration-harness/`. The module reads the shipped projection,
gauge, budget, envelope, ledger, replay, and sibling cycle contracts through their public surfaces. It does not import or edit
`convergence.cjs`, and it does not write into any legacy control branch. The unit suite covers healthy progress, productive
revisitation, all sibling cycle health variants, semantic collapse, novelty starvation, quality decay, budget thrash,
simultaneous faults, optional-field silence during active degeneration, shared-ledger cross-lineage isolation, two-window
recovery, stale and conflicting input, unsupported versions, resume, full replay, duplicate delivery, action identity, and
healthy plus degenerate shadow parity.

Source traceability is pinned to `../002-cycle-detection/spec.md`,
`010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges/spec.md`,
`002-deep-loop-effectiveness-and-fanout/research/research-modes.md`, and
`036-deep-loop-innovation/manifest/phase-tree.json` under the system-deep-loop spec track.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require typed concentration and typed progress failure together | A similar answer or repeated wording is not evidence that a mode collapsed |
| Consume sibling cycle events without deriving repetition | Cycle identity, traversal, and progress interpretation need one owner |
| Treat absent or incoherent evidence as a fault, never health | Missing control data cannot justify clearing degradation; optional silence during an active signal is explicitly `not_evaluable` |
| Key detection and recovery state by the full signal scope | One lineage or region cannot fabricate, dilute, aggregate, or clear another scope's health signals |
| Keep quality and budget arithmetic inside typed adapters | The generic harness cannot safely invent evaluator scores or merge cost dimensions |
| Append recovery after two healthy windows | Hysteresis prevents one good boundary from erasing a persistent fault and preserves audit history |
| Return the legacy result by identity | Additive-dark isolation becomes a direct, replayable assertion instead of an integration assumption |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leaf Vitest command | PASS, 1 file and 14 tests |
| Runtime TypeScript project | PASS, exit 0 with `--noEmit` |
| Real-check collapse | PASS, typed concentration and multi-channel progress-floor failure are both required; text-only similarity does not confirm |
| Cycle ownership | PASS, suspected, confirmed periods one through four, and cleared payloads are consumed verbatim with `independentDetectionPerformed: false` |
| Fail-closed telemetry | PASS, missing, stale, gapped, conflicting, unsupported, and non-monotonic inputs never produce a healthy state |
| Frontier distinction | PASS, starvation requires eligible work; exhausted, empty, and unknown frontiers are `not_evaluable` |
| Quality and budget evidence | PASS, comparable provenance and typed dimensions are required; exhaustion is not thrash or convergence |
| Request authority | PASS, response requests stay `request_only` and `pending_gateway` with no execution decision or receipt |
| Silent recovery guard | PASS, three healthy-progress boundaries with absent optional budget telemetry leave `budget_thrash` active and emit `not_evaluable`; recovery occurs only after real high-yield normal budget evidence ages out the thrash window and satisfies two verified windows |
| Scoped projector | PASS, interleaved lineage B receives no lineage A degeneration signal or aggregate identity, B's streak matches a separate projector, and B recovery leaves lineage A's active collapse/starvation signals intact |
| Recovery and history | PASS, recovery appears only on the second verified same-scope window and prior signal identities remain stored |
| Replay, resume, and dedupe | PASS, incremental/full replay hashes match, resume matches, and duplicate delivery is idempotent |
| Additive-dark parity | PASS, healthy and degenerate shadow calls return the exact legacy result object unchanged |
| OpenCode alignment and comment hygiene | PASS, 5 runtime files report zero alignment findings and the 3 changed TypeScript files report zero hygiene violations |
| Strict packet validation | PASS, exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow only**: The harness emits observable evidence and requests, but no runtime consumer currently grants those requests authority.
2. **Adapter activation**: Modes must register exact adapter and source versions before they can supply production observations; an unknown adapter fails closed.
3. **Dirty shared worktree**: The worktree already contained unrelated modified and untracked files. Scope proof uses the leaf path delta and frozen-path audit instead of claiming a globally clean status.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
