---
title: "Decision Record: Eval Loop"
description: "ADR-001: 3-signal weighted-vote convergence; ADR-002: hill-climbing vs combinatorial sweep; ADR-003: pause-sentinel pattern for rate-limit handling."
trigger_phrases:
  - "114/003 decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/003-eval-loop"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded decision-record.md with ADR-001"
    next_safe_action: "Add ADR-002 (hill-climbing rationale) and ADR-003 (pause pattern) as design solidifies"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114034"
      session_id: "114-003-decisions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Eval Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: 3-signal weighted-vote convergence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-16 |
| **Deciders** | Main agent (council ratifies weights downstream) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Single-signal convergence (e.g., only score plateau) misses cases where the mutation space exhausts before plateau forms, OR plateau forms on noisy scores that haven't actually stabilized. Cost of false-converge: 004 applies a winner that's not actually the best. Cost of false-non-converge: budget burns past necessity. Memory: `feedback_codex_sandbox_blocks_network` (relevant for budget conservation pattern) and deep-research convergence patterns inform the weight distribution.

### Constraints

- Free-tier rate limits make every iteration expensive
- Synthesis must rank variants with confidence; convergence quality determines confidence band
- 3 signals available: plateau (best-score delta), mutation-exhaustion (signature coverage), MAD (noise floor)
- Operator wants a single composite stopScore for clear pass/fail
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Weighted 3-signal vote: plateau (0.40, ≥4 iters, Δ<0.02 over last 3) + mutation-exhaustion (0.35, ≥3 iters, exhausted/proposed > 0.75 on active axis) + MAD (0.25, ≥4 iters, MAD<0.01).

**How it works**: Each signal computes a 0..1 contribution to composite stopScore. stopScore > 0.60 triggers STOP candidate; then legal-stop gate must also pass (coverage ≥ 3 variants per fixture + quality best > 0.70 + budget dispatches < cap).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-signal weighted vote (chosen)** | Robust to noisy scores + exhaustion case + stable winners | Weight tuning needed | 9/10 |
| Single-signal plateau only | Simple to implement | Misses exhaustion case; false-converges on noise | 5/10 |
| Bayesian convergence | Statistically rigorous | Too much state for packet-local; library dependency | 4/10 |
| Always run to budget exhaustion | No convergence logic | Wastes credits when winner is clear early | 2/10 |

**Why this one**: Free-tier credit conservation is the dominant constraint AND we have 3 cheap signals available. The 0.40/0.35/0.25 weighting prioritizes plateau (most informative) while ensuring exhaustion and noise checks have veto power.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Convergence catches multiple failure modes (noisy scores, exhausted mutations, stable winners)
- Single composite stopScore is operator-friendly

**What it costs**:
- Weights need tuning per future packet. Mitigation: council ratifies weights; pattern reusable across deep-loops.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weights drift wrong for cli-devin's specific failure modes | M | Iterate on weights via post-loop analysis; document tuning in implementation-summary |
| MAD signal misfires on very small sample sizes (< 4 iters) | L | Require ≥4 iters before MAD contributes (encoded in signal logic) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Convergence is required to bound budget; single-signal is insufficient |
| 2 | **Beyond Local Maxima?** | PASS | Considered 4 alternatives with rationale |
| 3 | **Sufficient?** | PASS | 3 signals cover all known failure modes; more would be over-engineering |
| 4 | **Fits Goal?** | PASS | Directly serves synthesis confidence + budget conservation |
| 5 | **Open Horizons?** | PASS | Pattern reusable for any deep-loop with eval rubric |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/converge.cjs` implements 3 signals + weighted sum + legal-stop bundle
- State JSONL row includes `convergence: {plateauScore, exhaustionScore, madScore, stopScore, legalStopBundle: {coverage, quality, budget}}`

**How to roll back**: Adjust weights (0.40/0.35/0.25 → operator-tuned values) without rewriting logic. Drop a signal by setting its weight to 0.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
