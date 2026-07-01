---
title: "Decision Record: Sliding-Window Convergence Mode"
description: "Decision record for whether to build a sliding-window convergence mode now, defer it, or reject it."
trigger_phrases:
  - "sliding window convergence decision"
  - "denominator drag convergence"
  - "convergence mode follow-up"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening"
    last_updated_at: "2026-07-01T16:07:00Z"
    last_updated_by: "openai/gpt-5.5"
    recent_action: "Recorded sliding-window convergence decision"
    next_safe_action: "Implement sliding-window convergence in a follow-up phase if approved"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "openai-gpt-55-009-convergence-hardening"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Recommendation: defer sliding-window implementation to a follow-up phase, but build it next because generation-2 evidence validated denominator drag."
---
# Decision Record: Sliding-Window Convergence Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Sliding-Window Convergence Mode For Long Loops

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed follow-up |
| **Date** | 2026-07-01 |
| **Deciders** | Packet 030 phase 009 implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

Generation-2 forced-depth research changed the evidence level for denominator drag. Round 1 only hypothesized that full-history `newInfoRatio` could suppress late discoveries in 30+ iteration loops. Generation 2 ran two real 35-iteration lineages under `stopPolicy=max-iterations`; the parent research report says both lineages reached genuine 35/35 depth and found new information that early convergence would have missed. Evidence: `.opencode/specs/deep-loops/030-agent-loops-improved/research/research.md:14-22`, `.opencode/specs/deep-loops/030-agent-loops-improved/research/research.md:117`, and `.opencode/specs/deep-loops/030-agent-loops-improved/research/research.md:162`.

The glm lineage mathematically characterized the mechanism: `newInfoRatio` divides newly discovered information by accumulated research knowledge, and that denominator grows monotonically. By late iterations, a genuinely novel item is divided by a larger base, so fixed thresholds become harder to exceed even when useful novelty remains. Evidence: `.opencode/specs/deep-loops/030-agent-loops-improved/research/lineages/glm/iterations/iteration-017.md:8-14`.

The final glm synthesis says convergence telemetry averaged about 0.75 early and about 0.6 late; it also says a convergence-mode loop would have legally stopped around iteration 22-25, while forced depth surfaced 13 net-new findings. Evidence: `.opencode/specs/deep-loops/030-agent-loops-improved/research/lineages/glm/iterations/iteration-035.md:8`.

### Constraints

- This phase must not implement the sliding-window convergence mode; it is decision-record only for REQ-001.
- Existing `default` and `off` convergence modes must keep their current meaning.
- Any future mode must be explicit, opt-in, and telemetry-visible so operators can compare full-history and sliding-window signals.
- The implementation must not turn forced-depth `stopPolicy=max-iterations` into a workaround for convergence math. `max-iterations` remains valid when the operator wants fixed depth.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Defer implementation from this phase, but build a sliding-window convergence mode in a follow-up phase.

**How it works**: The follow-up should add an explicit `convergenceMode` value such as `sliding-window`, with a bounded `slidingWindowSize` such as 5 iterations. In that mode, convergence should evaluate recent `newInfoRatio` over the last N iterations rather than over the full accumulated denominator. The existing `default` full-history mode and `off` mode should remain available for backward-compatible operator intent.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer and build as follow-up** | Honors this phase's out-of-scope rule; lets the follow-up include focused algorithm tests and telemetry comparisons; matches the stronger generation-2 evidence | Leaves denominator drag unresolved until the follow-up ships | 9/10 |
| Build in this phase | Solves the validated math issue immediately | Violates this phase's explicit scope and mixes algorithm work with four independent hardening items | 4/10 |
| Keep only `max-iterations` | Already works for forced-depth runs and avoids new convergence code | Forces operators to choose fixed depth even when they want adaptive stopping that still sees late novelty | 5/10 |
| Reject sliding-window mode | No new runtime complexity | Ignores generation-2 evidence that convergence would have stopped before late findings surfaced | 2/10 |

**Why this one**: The evidence now supports building the mode, but the packet scope explicitly bans implementation in this phase. A follow-up phase preserves scope discipline while treating denominator drag as a real algorithm gap, not a speculative idea.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet records a clear recommendation instead of leaving F-013/B-010 ambiguous.
- The follow-up has a concrete target: explicit `convergenceMode=sliding-window`, bounded window size, and telemetry that compares recent-window and full-history novelty.

**What it costs**:
- The convergence algorithm remains unchanged in this phase. Mitigation: use `stopPolicy=max-iterations` for forced-depth runs until the follow-up ships.
- The follow-up must define exact threshold semantics and test fixtures for late-loop novelty. Mitigation: seed tests from generation-2 iteration telemetry and synthetic denominator-drag cases.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sliding-window mode runs too long on noisy low-value novelty | M | Keep it opt-in and expose both full-history and windowed telemetry |
| Window size becomes a magic constant | M | Make it configurable with a documented default and range validation |
| Operators confuse `max-iterations` with adaptive convergence | L | Document `max-iterations` as fixed-depth intent and `sliding-window` as adaptive late-novelty intent |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Generation 2 says convergence would have stopped around iteration 22-25 while forced depth surfaced 13 net-new findings. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include default convergence, `off`, fixed-depth `max-iterations`, and a new sliding-window mode. |
| 3 | **Sufficient?** | PASS | The proposed follow-up changes only the convergence denominator window, not the whole loop lifecycle. |
| 4 | **Fits Goal?** | PASS | It directly addresses B-010/F-013 without changing this phase's hardening scope. |
| 5 | **Open Horizons?** | PASS | It gives operators a future adaptive-depth option without removing current modes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes in this phase**:
- No sliding-window convergence code is implemented.
- Runtime hardening is limited to stall-watchdog alerting and a per-lineage budget cap in `fanout-run.cjs`.
- Existing lag-ceiling status mapping remains in place and now has a direct regression assertion.
- Existing near-duplicate dedup remains opt-in through `enableNearDuplicateDedup` or `SPECKIT_FANOUT_NEAR_DUP_DEDUP`; it is not flipped default-on because default-on would collapse previously separate cross-lineage findings and needs a broader rollout decision.

**Follow-up build target**:
- Add `convergenceMode: "sliding-window"` alongside the current default and `off` modes.
- Add `slidingWindowSize` validation, with a small default such as 5.
- Record both full-history and sliding-window `newInfoRatio` in telemetry for at least one rollout cycle.
- Add fixtures where late-loop novelty is suppressed by a monotonic full-history denominator but remains visible in a recent-window calculation.

**How to roll back**: Remove the follow-up mode and leave `default`, `off`, and `max-iterations` behavior unchanged. This decision record can remain as historical rationale even if the follow-up implementation is rolled back.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
