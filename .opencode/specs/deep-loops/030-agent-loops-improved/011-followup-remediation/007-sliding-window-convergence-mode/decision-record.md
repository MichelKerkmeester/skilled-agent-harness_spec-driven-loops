---
title: "Decision Record: Sliding-Window Convergence Mode"
description: "Implementation-level architecture decisions for the opt-in sliding-window convergence mode, refining the packet-level ADR into concrete code choices."
trigger_phrases:
  - "sliding window convergence decisions"
  - "convergence mode architecture"
  - "decision record"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-02T14:55:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored implementation-level ADRs refining the parent packet ADR"
    next_safe_action: "Implementer confirms decisions hold during build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-011-007-sliding-window"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Sliding-Window Convergence Mode

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Parent decision: "ADR-001: Sliding-Window Convergence Mode For Long Loops" in `../../009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md` decided THAT this mode should be built and set its contract (opt-in, validated window size, dual telemetry, drag-reproducing fixtures). The ADRs below decide HOW, at code level.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Opt-In Parallel Path, Not A Refactor Of The Existing Calculation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 030 phase 011 orchestrator (Claude), per parent ADR constraints |

---

<!-- ANCHOR:adr-001-context -->
### Context

`computeCompositeScore` and `main()` in `convergence.cjs` are shared across every loop type (research, review, context). The parent ADR requires `default` and `off` modes to keep their exact current meaning. Any approach that reworks the existing full-history calculation in place risks behavioral drift for every existing loop.

### Constraints
- `default`/`off` behavior must be byte-identical to today (spec REQ-001, verified by the full existing vitest suite).
- The mode must be explicit and opt-in; absence of config means current behavior.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Implement the windowed calculation as a separate, parallel code path selected only when `convergenceMode === "sliding-window"` is explicitly configured. The existing full-history path is not edited, moved, or re-indented.

**Details**: A new windowed novelty function lives alongside `computeGraphNoveltyDelta` in `coverage-graph-signals.ts`. `convergence.cjs` selects between the two at the mode-dispatch point in `main()`; `computeCompositeScore` receives the selected signal rather than being taught about modes internally wherever that keeps the diff additive.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel opt-in path (chosen)** | Zero risk to existing modes; additive diff; trivially reviewable | Small amount of near-duplicate calculation logic | 9/10 |
| Parameterize the existing function with a window argument | One function, no duplication | Touches the hot path every loop uses; regression risk contradicts REQ-001's byte-identical bar | 5/10 |
| Post-process the full-history ratio | No new calculation | Mathematically wrong: cannot recover a windowed denominator from an aggregated ratio | 1/10 |

**Why Chosen**: REQ-001 makes "existing behavior untouched" the P0 acceptance bar; a parallel path is the only option whose failure mode cannot regress existing loops.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- The full existing vitest suite doubles as the regression proof for REQ-001.
- Rollback is deletion of the new path plus the config plumbing.

**Negative**:
- Some duplication between the two novelty calculations. Mitigation: shared helpers where extraction is provably behavior-neutral, duplication otherwise.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared-helper extraction silently changes full-history results | H | Only extract helpers covered by existing tests; otherwise duplicate |
| Mode string typos silently fall back to default | M | Validate `convergenceMode` against the known enum; unknown values are a clear error, not a silent default |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-001 makes byte-identical existing behavior the P0 bar; only a parallel path guarantees it structurally |
| 2 | **Beyond Local Maxima?** | PASS | In-place parameterization and post-processing were evaluated and scored |
| 3 | **Sufficient?** | PASS | A selected-at-dispatch parallel path fully delivers the opt-in mode |
| 4 | **Fits Goal?** | PASS | Directly implements the parent ADR's opt-in constraint |
| 5 | **Open Horizons?** | PASS | Future modes can join the same dispatch point without touching existing paths |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: `convergence.cjs` mode dispatch, `coverage-graph-signals.ts` new function, new vitest fixtures.

**Rollback**: Delete the windowed function and config plumbing; `default`/`off`/`max-iterations` behavior is untouched by construction.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Window Anchoring Via N-Iterations-Back Snapshot

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 030 phase 011 orchestrator (Claude) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The existing calculation anchors novelty to `latestPriorSnapshot` (one iteration back) and divides by the full accumulated node/edge population. The window has to change what the novelty is measured against without inventing a new data source: iteration snapshots already exist in the coverage graph.

### Constraints
- No new persistence format; the window must be computable from data the graph already stores.
- `slidingWindowSize` must be a validated small positive integer with a documented default of 5 (parent ADR).

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: The windowed calculation anchors to the snapshot from N iterations back (N = `slidingWindowSize`) and computes the novelty ratio against the population growth within that window, instead of the all-time accumulated population.

**Details**: When fewer than N prior snapshots exist (early iterations), the window clamps to what exists — which converges to the same anchor the full-history path would use, so early-loop behavior is naturally consistent. Validation rejects 0, negatives, and non-integers with a clear error.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **N-back snapshot anchor (chosen)** | Uses existing snapshot data; matches the ADR's "recent newInfoRatio over the last N iterations" framing directly | Needs a clamp rule for early iterations | 9/10 |
| Time-based window (wall-clock) | Insensitive to iteration pacing | Iterations vary wildly in duration; wall-clock windows measure the wrong thing for a per-iteration loop | 3/10 |
| Exponential decay weighting of history | Smooth, no cliff at the window edge | A tuning-parameter surface much larger than one integer; harder to explain, test, and validate | 4/10 |

**Why Chosen**: It is the literal shape the parent ADR proposed, it reuses existing snapshots, and its one parameter has an obvious meaning and validation rule.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- The denominator stops growing monotonically, which is the entire bug.
- One understandable knob with a documented default.

**Negative**:
- A hard window edge means an N+1-iterations-old discovery ages out of the baseline at once. Mitigation: acceptable by design; the mode is opt-in and telemetry keeps the full-history signal visible for comparison.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Window too small: noisy stop decisions on sparse loops | M | Default 5 with documented range; operators tune per loop |
| Early-iteration clamp behaves differently from full-history | M | Clamp rule defined so the early window equals the full history until N snapshots exist; fixture-tested |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The window has to anchor somewhere; existing snapshots are the only data source that avoids new persistence |
| 2 | **Beyond Local Maxima?** | PASS | Wall-clock windows and exponential decay were evaluated and scored |
| 3 | **Sufficient?** | PASS | N-back anchoring plus the early clamp covers all loop lengths |
| 4 | **Fits Goal?** | PASS | Matches the parent ADR's "last N iterations" framing literally |
| 5 | **Open Horizons?** | PASS | Window size is one validated parameter; decay variants remain possible later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: New windowed function in `coverage-graph-signals.ts`; snapshot selection helper near `latestPriorSnapshot`.

**Rollback**: Same as ADR-001 — remove the parallel path.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Dual Telemetry In Sliding-Window Mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 030 phase 011 orchestrator (Claude), per parent ADR build target |

---

<!-- ANCHOR:adr-003-context -->
### Context

The parent ADR requires both full-history and windowed `newInfoRatio` to be recorded "for at least one rollout cycle" so operators can compare the two signals on real loops before trusting windowed stop decisions.

### Constraints
- Telemetry additions must not alter stop decisions in any mode.
- `default`/`off` telemetry output must remain unchanged (REQ-001 applies to observable output too).

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: When sliding-window mode is active, telemetry records BOTH ratios side by side (windowed as the deciding signal, full-history as the comparison signal). In `default`/`off` modes, telemetry is unchanged — no new fields.

**Details**: The comparison field is unconditional within sliding-window mode rather than flag-gated, because the rollout-cycle comparison is the point of the parent ADR's requirement; a flag someone forgets to enable produces no rollout evidence.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Both ratios always, in-mode only (chosen)** | Guaranteed rollout evidence; zero impact on other modes | Slightly larger telemetry records in the new mode | 9/10 |
| Separate opt-in telemetry flag | Minimal records by default | A dead control: forgetting it defeats the rollout comparison entirely | 4/10 |
| Add comparison fields to all modes | Uniform schema | Changes `default`/`off` observable output, violating REQ-001 | 2/10 |

**Why Chosen**: The parent ADR's mitigation for "runs too long on noisy novelty" is exactly this visibility; making it structural rather than optional is fail-closed by construction.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Every sliding-window run produces the comparison data the rollout decision needs.
- Divergence between the two signals is directly observable per iteration.

**Negative**:
- Marginally larger telemetry records in sliding-window mode. Mitigation: two numbers per iteration; negligible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Consumers assume the old single-ratio shape in the new mode | L | New fields are additive; existing field keeps its meaning as the deciding signal |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent ADR requires rollout-cycle comparison data; structural emission guarantees it exists |
| 2 | **Beyond Local Maxima?** | PASS | Flag-gated and all-modes emission were evaluated and scored |
| 3 | **Sufficient?** | PASS | Two numbers per iteration fully serve the comparison need |
| 4 | **Fits Goal?** | PASS | Zero impact on default/off telemetry preserves REQ-001 |
| 5 | **Open Horizons?** | PASS | Additive fields; consumers can adopt the comparison signal at their own pace |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**: Telemetry emission in `convergence.cjs`; assertions in the new fixtures.

**Rollback**: Fields disappear with the mode; no consumer migration needed.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
