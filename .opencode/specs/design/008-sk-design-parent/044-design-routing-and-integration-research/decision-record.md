---
title: "Decision Record: non-converging routing/integration research method and honest enforcement verdict"
description: "Binding decisions: run a non-converging deep-research loop where convergence is logged as a signal only (ADR-001); hold anti-convergence with a 57-angle bank plus a parallel monitor plus corpus expansion (ADR-002); reframe the 1000% guarantee honestly — selection/loading/firing/survival are deterministically enforceable on a fixture corpus and at the tool boundary while application quality and taste stay advisory (ADR-003); research only — emit a buildable backlog and defer the build (ADR-004)."
trigger_phrases:
  - "sk-design routing research decisions"
  - "non-converging research ADRs"
  - "design enforcement verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/044-design-routing-and-integration-research"
    last_updated_at: "2026-06-28T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the non-converge and research-only ADRs"
    next_safe_action: "Validate strict"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-044-design-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: non-converging routing/integration research method and honest enforcement verdict

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Non-converging by design — convergence is a logged signal, the only stop is iteration 50

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context
The charter asked for fifty iterations of genuine breadth across six dimensions, not an early-stopping convergent study. A standard convergent loop would stop near the 0.05 newInfoRatio floor after a single skill was covered, defeating the goal of sustained fresh angles across the whole sk-design family and two corpora.

### Constraints
- Operator named cli-codex gpt-5.5 xhigh fast and 50 iterations.
- Research only; no live sk-design / commands / mcp-open-design / cli-* edits.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: a no-converge driver where convergence is computed and logged purely as a signal; the only stop condition is `maxIterationsReached` at iteration 50.

**How it works**: the reducer recorded newInfoRatio per iteration (mean 0.655, min 0.57, max 0.74) — the series never approached the 0.05 floor, so non-convergence was achieved rather than merely permitted.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No-converge driver, convergence as signal (chosen)** | Sustains 50 fresh angles; honest breadth | Risks low-yield passes if angles thin | 9/10 |
| Standard convergent early-stop | Cheaper; "efficient" | Stops after one skill; defeats the breadth charter | 3/10 |
| Fixed 50 with no convergence telemetry | Simple | No signal to detect thinning info flow | 5/10 |

**Why this one**: logging convergence as a signal keeps the breadth mandate while still surfacing when a pass is lower-yield.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Fifty genuinely distinct angles across six dimensions; breadth is real, not padded synthesis after an early convergence.

**What it costs**:
- More dispatches and runtime. Mitigation: externalized resumable state; codex contention slowed but did not fail iterations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A pass claims new info it did not add | M | The monitor + convergence report flag lower-yield passes honestly (MON-B3 ran 3x) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Breadth charter requires sustained fresh angles |
| 2 | **Beyond Local Maxima?** | PASS | Considered convergent early-stop and fixed-no-telemetry |
| 3 | **Sufficient?** | PASS | 50 iterations cover all six dimensions |
| 4 | **Fits Goal?** | PASS | Produces a wide buildable backlog |
| 5 | **Open Horizons?** | PASS | Convergence telemetry feeds a future tuning decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**: research artifacts only (state machine + 50 iteration files + research.md).
**How to roll back**: re-run an iteration from externalized state; append-only state is resumable.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Anti-convergence via a 57-angle bank, a parallel monitor, and a corpus expansion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context
A no-converge stop condition (ADR-001) is necessary but not sufficient: without a fresh-angle supply, late iterations would re-mine covered ground and inflate newInfoRatio. The loop needed a mechanism that keeps each iteration genuinely novel.

### Constraints
- Each iteration must advance to an angle not previously covered.
- The supply must deepen when impeccable-main is exhausted.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: a 57-angle bank that the driver advanced one fresh angle per iteration, plus a parallel monitor that watched `deep-research-state.jsonl` and injected deeper/cross-cutting angles when the last-3 newInfoRatio shallowed, and switched the corpus to `designer-skills-main` for the back third.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **57-angle bank + monitor + corpus expansion (chosen)** | Sustains novelty; deepens late | Monitor override can persist across fast advance | 9/10 |
| Static angle list, no monitor | Simple | No reaction to thinning info; redundant late passes | 4/10 |
| Single corpus, no expansion | Focused | Exhausts novelty before iteration 50 | 4/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Sustained novelty (mean newInfoRatio 0.655) and a genuinely new corpus contribution (the command-as-workflow-verb pattern, D6-R1).

**What it costs**:
- The monitor override persisted across the driver's fast advance, re-running angle `MON-B3` three times. Mitigation: those passes deepened rather than repeated; flagged honestly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inflated newInfoRatio on re-used angles | L | ~2 of 5 D6 passes flagged as lower-yield in the convergence report |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stop condition alone cannot supply fresh angles |
| 2 | **Beyond Local Maxima?** | PASS | Considered static list and single corpus |
| 3 | **Sufficient?** | PASS | Bank + monitor + expansion held novelty to iter 50 |
| 4 | **Fits Goal?** | PASS | Delivered breadth + one net-new corpus pattern |
| 5 | **Open Horizons?** | PASS | The monitor cadence is tunable for future loops |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation
**What changes**: the angle-bank, monitor injects, and corpus switch in the loop config.
**How to roll back**: not applicable (research only); re-run with a different angle schedule.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Honest "1000%" reframing — deterministic on fixtures and at the tool boundary; application and taste stay advisory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context
The charter asked to "guarantee" routing, utilization, and pairing. A literal 100%/1000% guarantee over open-ended live prompts is not achievable: a false-default proxy swung 0.087->0.63 purely on prose interpretation, proving live natural language is not deterministic. The verdict had to separate what a hash or a fixture can prove from what only human review can.

### Constraints
- No gate may claim to certify good design or correct live-intent routing outside a fixture corpus.
- Non-utilization must nonetheless be made loud and blocking where it can be.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision
**We chose**: decompose the guarantee into a shared four-layer spine — **selection** (a parseable hub-router replayed over a private gold corpus), **loading** (content-bound proof tokens: sha256 of loaded files, not a self-checked box), **firing** (deny-by-default tool-boundary preconditions), and **survival** (inlined payload + parent-side re-validation of returned artifacts) — all deterministically enforceable. **Application** (a cited rule changed one named output choice) is hybrid (presence enforceable, quality advisory); **taste** and **open-ended live intent** stay advisory. The build target: make non-utilization loud and blocking, replace self-attestation with content-bound proof, and *measure* the residual miss-rate.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Enforceable-vs-advisory split + measure residual (chosen)** | Honest; builds only what is provable | Does not claim a literal 100% | 9/10 |
| Claim a literal 1000% guarantee | Satisfies the slogan | Dishonest; live NL is non-deterministic (proxy 0.087->0.63) | 1/10 |
| Declare everything advisory | Safe | Forfeits real, deterministic enforcement that exists today | 3/10 |
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A trustworthy build target: `intentRecall=0` and `telemetryMissingRate=1.000` become a gated failure + a computable `routeMissRate` once gold exists.

**What it costs**:
- Some surface area (taste, live intent) is explicitly left advisory. Mitigation: the deliverable makes its absence loud (a missing witness blocks a ready-claim).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Residual bypasses cannot be fully closed (unmodifiable daemon, text-only child, shell aliases) | M | Documented in research.md §7 as honest residuals, not hidden |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A literal guarantee is unachievable over live NL |
| 2 | **Beyond Local Maxima?** | PASS | Considered literal-1000% and all-advisory |
| 3 | **Sufficient?** | PASS | Four-layer spine covers selection/loading/firing/survival |
| 4 | **Fits Goal?** | PASS | Guarantees what is provable; measures the rest |
| 5 | **Open Horizons?** | PASS | Residual miss-rate is measurable and improvable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation
**What changes**: the enforceable-vs-advisory ledger + four-layer spine in research.md §10; a future build applies the spine.
**How to roll back**: not applicable (research only).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Research only — emit a buildable backlog, make no live edits, defer the build

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-28 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-004-context -->
### Context
The findings touch the live sk-design family, the `/design:*` commands, `mcp-open-design`, and three `cli-*` skills. Editing those during research would entangle discovery with implementation and risk shipping unverified architecture.

### Constraints
- The existing `research/` directory is final and must not be re-touched.
- No live file may be edited; nothing may be committed.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision
**We chose**: produce a frozen, per-dimension buildable backlog (each item labeled enforceable/advisory/hybrid with a target file and a citation) plus a verification plan, and defer all live edits to a later, separately-scoped build phase.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Backlog + verification plan, defer build (chosen)** | Clean discovery/build separation; reviewable | Value not realized until a build runs | 9/10 |
| Apply edits during research | "Faster" | Ships unverified architecture; entangles discovery | 2/10 |
| Research with no buildable backlog | Pure study | No actionable output; wastes 50 iterations | 2/10 |
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A future build inherits a verified, surgical backlog with a per-item verification gate.

**What it costs**:
- No live improvement yet. Mitigation: the backlog is implementation-ready and the spine is shared across D3/D4/D5.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backlog goes stale before a build | L | Each item cites a file:line that a build re-verifies |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Keeps discovery from shipping unverified architecture |
| 2 | **Beyond Local Maxima?** | PASS | Considered edit-now and study-only |
| 3 | **Sufficient?** | PASS | Buildable backlog + verification plan enable a clean build |
| 4 | **Fits Goal?** | PASS | Honors the research-only charter |
| 5 | **Open Horizons?** | PASS | A future build packet consumes the backlog |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation
**What changes**: research artifacts only; the backlog + verification plan in research.md.
**How to roll back**: not applicable (research only); nothing was committed.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
