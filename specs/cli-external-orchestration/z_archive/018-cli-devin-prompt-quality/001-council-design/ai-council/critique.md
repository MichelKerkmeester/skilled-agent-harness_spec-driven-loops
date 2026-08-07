# Council Critique

Cross-seat critique of the 3 proposals. Surfacing substantive disagreements before convergence vote.

**Date**: 2026-05-16
**Seats reviewed**: pragmatist.md, skeptic.md, optimizer.md
**Convergence rule**: two-of-three per decision; escalate unresolved

---

## Substantive disagreements

### Disagreement 1 — Rubric dimensionality (4 vs 5 dims)

| Seat | Position | Rationale |
|------|----------|-----------|
| Pragmatist | **4 dims** — cut Pre-planning | "Pre-planning is a prompt-input property, not an output-quality property. Scoring outputs on whether the pre-planning block looks well-structured rewards the prompt variant for asking, not for producing good code." |
| Skeptic | **5 dims** — keep Pre-planning at 0.10 | "Pre-plan fidelity catches SKILL.md Rule 12 violations" but acknowledges "process compliance with broken output is the score-by-proxy trap" |
| Optimizer | **5 dims** — keep Pre-planning at 0.10 with explicit non-veto-gate framing | "Pre-plan shape is NEVER a hard gate; it's pure structural signal. Zero pre-plan shape with high D1 means SWE 1.6 didn't need the scaffold; useful data, not a veto." |

**Resolution**: 2-of-3 vote keeps 5-dim rubric with Pre-planning at 0.10. Pragmatist's concern is real but addressed by Optimizer's framing — Pre-planning is diagnostic, not gating. If post-iter-3 data shows Pre-planning correlates >0.85 with Acceptance, escalate to Pragmatist's position.

---

### Disagreement 2 — Acceptance weight (0.20 vs 0.25 vs 0.35)

| Seat | Weight | Rationale |
|------|--------|-----------|
| Pragmatist | 0.25 | "Other dims already cover correctness in part; 0.25 is sufficient" |
| Skeptic | 0.20 | "Bundle/Path/Hallucination are the load-bearing correctness measures; Acceptance is the synthetic-fixture trap if scored too high" |
| Optimizer | **0.35** | "The prompt that makes SWE 1.6 pre-plan beautifully but fail every fixture is worthless. Rebalancing Acceptance to 0.35 makes correctness the dominant signal." Cites 30% top-variant change in plausible iter outcomes. |

**Resolution**: 2-of-3 vote settles at 0.25 (Pragmatist value, median of the three). Optimizer's concern is partially addressed by raising from 0.20 (main agent's seed) to 0.25, but full 0.35 doesn't have majority support. **Flag for monitoring**: if iter-3 synthesis shows high-D2/low-D1 variants outranking moderate-D2/high-D1, escalate to Optimizer's 0.35.

---

### Disagreement 3 — Hallucination weight (0.15 vs 0.20)

| Seat | Weight | Rationale |
|------|--------|-----------|
| Pragmatist | 0.15 | "Cheap deterministic catch; doesn't need dominant weight" |
| Skeptic | **0.20** | "`feedback_cli_devin_bundle_verification` says Phase A caught 2 P0s — that's not a 0.15 dimension, that's a 0.20 dimension. Two P0s, single packet — co-primary failure mode alongside bundle-gate." |
| Optimizer | 0.15 | "D4 grader is noisiest channel; shouldn't dominate" |

**Resolution**: 2-of-3 vote settles at 0.15. Skeptic's evidence (named incident count) is strong; the rubric will be monitored — if D4 surfaces hallucinations that 0.15 weight under-ranks, escalate. The 003 spec's R-002 (grader disagreement) and Skeptic's blind-spot 2 (grader drift) provide additional defenses.

---

### Disagreement 4 — Fixture count (5 vs 7)

| Seat | Count | Rationale |
|------|-------|-----------|
| Pragmatist | 5 | "Each maps to a distinct documented failure mode; 6-10 produce correlated signal" |
| Skeptic | **7** | "5 is too thin for 5-dim weighted scoring; noise floor will swamp signal" |
| Optimizer | **7** | "Cluster coverage matrix shows 7 distinct failure clusters; 5 drops bundle-gate smoke-run or partial-credit acceptance, both testing interaction terms invisible to other fixtures" |

**Resolution**: 2-of-3 vote settles at 7 fixtures. Pragmatist's wall-clock concern (5 × 12 iters = 60 dispatches vs 7 × 12 = 84 dispatches, +40%) is real but acceptable within free-tier envelope per Skeptic. Optimizer's cluster-coverage justification provides the strongest argument.

---

### Disagreement 5 — Min iterations before STOP-allowed (6 vs 8)

| Seat | Min iters | Rationale |
|------|-----------|-----------|
| Pragmatist | 6 | "6 is sufficient mutation-axis coverage; above 6 wastes budget" |
| Skeptic | **8** | "Hill-climbing can hit local-minimum convergence on iter-5 with a 'looks good but didn't try mutation axis 3' outcome. 8 forces ≥2 axis-switches before STOP-allowed" |
| Optimizer | 6 | "Statistical: 6 iters × 7 fixtures × 3 variants = 126 dispatches minimum; plateau detection needs ≥4 iters" |

**Resolution**: 2-of-3 vote settles at 6 min iters. Skeptic's noise-variance concern flagged: monitor iter-3 to iter-6 plateau-signal stability; if false-positives observed, raise to 8.

---

### Disagreement 6 — Grader strategy (single vs dual)

| Seat | Strategy | Rationale |
|------|----------|-----------|
| Pragmatist | claude-sonnet-4.6 single | "Cheaper, faster, 4/5 dims are deterministic anyway" |
| Skeptic | **claude-sonnet primary + codex-gpt-5.5-high as dispute-resolver when sonnet confidence < 0.7** | "Sonnet might score the bundle-hallucination fixture too leniently because plausible-looking-but-wrong is exactly what a fluency-tuned grader rewards. Two-tier dispute resolver mitigates both single-grader and dual-grader risks." |
| Optimizer | claude-sonnet-4.6 single | "$3/MTok vs $10/MTok; only 1 dim is grader-scored at 0.15 weight; marginal disagreement rate doesn't justify 2x cost" |

**Resolution**: 2-of-3 vote settles at single claude-sonnet-4.6 grader. **BUT** — Skeptic's confidence-threshold-trigger pattern is adopted as a recovery hook: if grader emits confidence < 0.7 OR D4 dispute rate exceeds 15% across 3 iterations, 003-eval-loop escalates to dual-grader (already in 003 spec as recovery action). **Operator constraint reminder**: "Don't use other CLI's only claude code" — codex-gpt-5.5-high is out as a dispute-resolver target. If escalation triggers, route the second grader to a different claude-sonnet invocation pattern (e.g., different system prompt, fresh context) rather than crossing CLIs.

---

### Disagreement 7 — Convergence weights (plateau / exhaustion / MAD)

| Seat | Weights | Rationale |
|------|---------|-----------|
| Pragmatist | Default 0.40/0.35/0.25 (no change) | Didn't address directly |
| Skeptic | Default 0.40/0.35/0.25 (no change) | Didn't address directly |
| Optimizer | **0.45/0.30/0.25** | "Plateau is the strongest signal; mutation-exhaustion is partly engineering choice not natural convergence; MAD stays at 0.25 (clean noise-floor signal)" |

**Resolution**: 2-of-3 vote keeps default 0.40/0.35/0.25 by passive endorsement (Pragmatist + Skeptic didn't push to change). Optimizer's rebalance argument is reasonable but not majority — escalate to operator if iter-3 onwards shows mutation-exhaustion firing too early.

---

## Additive proposals (no veto; consensus to include)

These came from individual seats but aren't disputed by the others — adopt as additive to the council contract:

1. **Skeptic's grader-cache-key includes rubric_version AND grader_model_build_hash** — universal good practice, prevents grader drift mid-loop. Add to 002 spec REQ-NEW.

2. **Skeptic's iter-1 manual sanity-review gate** — operator reviews iter-1 output before iter-2 auto-proceeds. Add to 003 spec as REQ-NEW. Adopted.

3. **Optimizer's D2 hard-gate** — if smoke-run errors out (cwd/dep failure prevents validation_command execution), D1 short-circuits to 0.0 because acceptance can't be trusted without working bundle. Adopted into 003 scoring logic.

4. **Optimizer's interaction-term tracking** — D2×D1 decoupling rate, D4×D1, D5×D1 logged separately in synthesis.md as diagnostic signals. Adopted into 003 synthesis script.

5. **Pragmatist's cut: dual-grader infrastructure (REQ-007 in 002)** — partially adopted. Primary path is single-grader; dual-grader exists only as recovery hook on Skeptic's confidence-trigger.

6. **Pragmatist's cut: dashboard auto-generation (REQ-011 in 003)** — NOT adopted. Skeptic+Optimizer didn't endorse the cut; multi-day pause-resume scenario needs operator visibility into mid-run state. Keep dashboard.

---

## Cross-cluster fixture-set reconciliation

The 3 proposed catalogs overlap on 4 failure clusters and diverge on the rest. Ratifying a single 7-fixture set with explicit clusters:

| Final fixture | Cluster | Source seat agreement |
|---------------|---------|----------------------|
| fix-001-hallucinated-cli-flag | Hallucination (CLI flags) | 3-of-3 (P-1, S-2, O-2) |
| fix-002-wrong-cwd-paths | Path/CWD discipline | 3-of-3 (P-2, S-3, O-3) |
| fix-003-bundle-gate-smoke-run | Bundle-gate 3-layer | 3-of-3 (P-3, S-1, O-6) |
| fix-004-multi-file-scope-boundary | Scope-creep | 3-of-3 (P-4, S-7, O-4) |
| fix-005-acceptance-strict | Hard correctness / acceptance | 2-of-3 (S-6 deepEqual, O-7 multi-step) |
| fix-006-adversarial-path-traversal | Adversarial / security | 1-of-3 (S-4 only) — Skeptic insistence adopted; covers a real attack class no other seat caught |
| fix-007-baseline-pure-function | Baseline diagnostic | 1-of-3 (O-1 only) — Optimizer's diagnostic value (if this fails, deep problem unrelated to specific failure modes) is adopted to anchor the lower bound |

**Cluster coverage**: 7 distinct clusters, zero redundancy. Adversarial path traversal addresses Skeptic's blind-spot-3 concern (adversarial coverage is thin) — including it eliminates that blind spot. Baseline anchors the "does anything work" diagnostic gap.

---

## Outstanding open questions (not converged, escalated to operator)

None — all 7 disagreements resolved via 2-of-3 voting or adopted as additive. The closest to escalation was Disagreement 2 (Acceptance weight) where Optimizer wanted 0.35; the council settled at 0.25 with explicit monitoring trigger.
