---
title: "Decision Record: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Architectural decisions for the retrieval-shape cluster: building C2-A as a standalone gating axis, and shipping the per-class weight mechanism with a neutral default while deferring calibrated values to a benchmark."
trigger_phrases:
  - "retrieval class routing decision record"
  - "c2-a gating axis adr"
  - "per class weight neutral default adr"
  - "memory mcp retrieval shape decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the two gating-axis + neutral-default decisions"
    next_safe_action: "Build C2-A classifier as the additive third router axis"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Retrieval-Class Routing & Recall-Shape Intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build C2-A as a standalone additive third axis, not folded into the existing classifiers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Operator, planning agent (claude-opus-4-8) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Memory MCP query router already fuses two orthogonal classifiers into `RouteResult`: complexity tier (`simple|moderate|complex`) and task intent (`add_feature|fix_bug|find_spec|…`). The 028 research names retrieval-shape (SingleHop/MultiHop/Temporal/Entity/Quote) as a distinct THIRD axis and makes C2-C (graph-gating) and C2-B (per-class weights) explicit consumers of it. We needed to decide whether to add a separate classifier or overload one of the existing two.

### Constraints

- The two existing axes must stay byte-identical for all existing fixtures (additive-reversibility guarantee).
- C2-A is the single internal critical-path dependency for the whole Cluster A. C2-C and C2-B cannot route by class without it.
- The classifier must be a synchronous pure function (no I/O, no embedding call) on the pre-fusion path.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build C2-A as a standalone pure classifier (`retrieval-class-classifier.ts`) that plumbs `retrievalClass` onto `RouteResult` as an additive third axis.

**How it works**: The classifier maps each query to exactly one class (with a neutral default and a documented precedence rule for multi-shape queries). `RouteResult` gains a `retrievalClass` field. The two existing axes are untouched. C2-C and C2-B read `retrievalClass` to gate graph expansion and select a per-class weight profile.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone additive axis (chosen)** | Clean reversibility, existing routing byte-identical until a consumer reads the axis | One new module + a new field | 9/10 |
| Overload the intent classifier to emit shape | No new module | Conflates two orthogonal axes, breaks additive-reversibility, harder to test | 3/10 |

**Why this one**: Retrieval-shape and task-intent are genuinely orthogonal. Keeping them separate preserves the additive-reversibility guarantee and isolates the new behavior behind a single readable field.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Single-hop queries can be routed graph-off for precision (C2-C) without disturbing multi-hop recall.
- The new axis is testable in isolation (per-class fixtures + a totality property test).

**What it costs**:
- One new module and a `RouteResult` field. Mitigation: the field is additive and downstream consumers tolerate it. Existing-axis output is asserted byte-identical.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| C2-A misclassifies and demotes the right answer (the costly false positive the research names) | H | Neutral default class, documented precedence, per-class adversarial fixtures |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Single-hop precision loss from indiscriminate graph expansion is a named, code-mapped failure mode (roadmap §3) |
| 2 | **Beyond Local Maxima?** | PASS | Overloading the intent classifier was considered and rejected |
| 3 | **Sufficient?** | PASS | A pure additive classifier is the simplest mechanism that gates both consumers |
| 4 | **Fits Goal?** | PASS | C2-A is the critical path for the retrieval-shape cluster |
| 5 | **Open Horizons?** | PASS | The axis generalizes to the sibling Code-Graph PPR/gating spine (002 phase) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `mcp_server/lib/search/retrieval-class-classifier.ts` (the pure classifier).
- `mcp_server/lib/search/query-router.ts` (`RouteResult` gains `retrievalClass`, and `preserved`/`includeDegree` extended for C2-C).

**How to roll back**: Revert the scoped C2-A commit. With no consumer reading `retrievalClass`, routing returns byte-identical to baseline. C2-C/C2-B revert independently to their neutral defaults.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Ship the C2-B per-class weight MECHANISM with a neutral default, and defer calibrated VALUES to a benchmark

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Operator, planning agent (claude-opus-4-8) |

---

<!-- ANCHOR:adr-002-context -->
### Context

C2-B injects per-class channel weights into `RankedList.weight` at the pre-fusion seam. The 028 research has no measured before/after benefit number for any candidate and explicitly flags the per-class `RetrievalProfile` weight VALUES as needing re-calibration on the ~1000-memory corpus. That calibration is benchmark-gated, and the reindex is gate-zero (027/002 §13). We needed to decide whether to ship guessed values now or land the mechanism with a neutral default.

### Constraints

- No measured justification exists for any specific weight value.
- C2-B's research-stated blocker (C-X1, the `bonusOverChannels` fusion option) is already satisfied (030 `65cfcea513`), so the mechanism can land safely.
- A zero-weight channel must not distort surviving channels' convergence bonus.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Land C2-B's injection seam with a neutral/identity default `RetrievalProfile` (byte-identical to baseline) and treat the tuned per-class values as a separate benchmark follow-up, explicitly out of scope here.

**How it works**: Per-class profiles map to `RankedList.weight`. Fusion runs with the live `bonusOverChannels` option so `weight:0` is honored without skewing survivors. The default profile leaves fused output unchanged. Only a tuned profile (a later, measured change) alters ranking.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mechanism + neutral default (chosen)** | Safe, reversible, byte-identical now, isolates value-tuning risk to a measured follow-up | No live ranking change until values are tuned | 9/10 |
| Ship guessed weight values now | Immediate ranking change | Un-calibrated values could demote good results with no measured basis (violates the regression-baseline discipline) | 3/10 |

**Why this one**: Shipping the mechanism is safe and unblocked. Shipping un-calibrated values is not, and 028 forbids fabricated benefit claims.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The per-class weight seam is in place and reversible, ready for a measured tuning pass.
- The `weight:0` convergence-bonus correctness is handled by the already-live `bonusOverChannels` option.

**What it costs**:
- No live ranking improvement until the values are calibrated. Mitigation: the calibration is a scoped follow-up gated on the reindex + a benchmark.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The mechanism ships but the tuning follow-up is forgotten | M | Recorded as an explicit out-of-scope deferral in spec.md §3 and §12 |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Per-class weighting is the C2-B leverage, the seam must exist before any tuning |
| 2 | **Beyond Local Maxima?** | PASS | Shipping guessed values was considered and rejected |
| 3 | **Sufficient?** | PASS | A neutral default is the minimal safe landing |
| 4 | **Fits Goal?** | PASS | C2-B is a direct consumer of C2-A in the cluster |
| 5 | **Open Horizons?** | PASS | The seam supports any future calibrated profile without re-plumbing |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `mcp_server/shared/algorithms/rrf-fusion.ts` (per-class `RankedList.weight` injection, run with `bonusOverChannels`).

**How to roll back**: Revert to the neutral/identity default profile (output returns byte-identical to baseline) or `git revert` the scoped C2-B commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
