# Iteration 29: Residual Risk & Explicit Deferrals Consolidation

**Focus track:** synthesis | **Status:** thought

## Focus
Consolidate residual risks and explicit deferrals across all KQs for the synthesis Eliminated-Alternatives and Open-Questions sections (analytical).

## Findings
- **Residual risk #1: KQ2 mode-D magnitude is inferred, not measured (no GPT-vs-Claude wall-clock/halt telemetry) — KQ6 benchmark is the measurement path; until then the latency/routing split is mechanism-level only.** [SOURCE: iter 8; ../001/research.md §9]
- **Residual risk #2: KQ5 plugin catches route/identity mismatch but NOT semantic wrong-mode (the §5 false-negative) — so a "passing" plugin does not prove correct leaf behavior; the KQ1 smoke must still check real leaf execution.** [SOURCE: iter 25; ../001/research.md §5]
- **Residual risk #3: KQ9 wait-on-KQ1 depends on the external smoke actually being runnable (clean OPENCODE_PID-free shell) — if no such environment is available to the operator, the gate cannot fire and FIX-5 stays parked indefinitely (same trap as 005/006).** [SOURCE: iter 4,5,23,24; 005/verification-smoke.md:56-57]
- **Deferral #1: Codex parity (TOML contradiction) — out of scope (../001 §8). Deferral #2: improvement-family deep modes hardening — same-pattern follow-up, lower priority (iter 21). Deferral #3: host-runtime hard identity / FIX-5 — gated on KQ9 negative-gate, architectural (../001 §8b).** [SOURCE: ../001/research.md §8,§8b; iter 20,21]
- **Integrity flag: the mis-route taxonomy A/B/C and FIX-1..5 ranking remain operator-asserted axioms (../001 §0); this research builds on them as given and does not re-validate them. The KQ1 smoke is the path to validation.** [SOURCE: ../001/research.md §0]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md §0,§5,§8,§8b,§9
- iter 4,5,8,21,25,23,24

## Assessment
- **newInfoRatio:** 0.20
- **Novelty justification:** Consolidates 3 residual risks + 3 deferrals + 1 integrity flag into a single defensible residual-risk table for synthesis.
- **Confidence:** 0.82
- **Key questions considered:** KQ1, KQ2, KQ5, KQ8, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Explicit residual risks make the recommendations honest about what they do NOT prove.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Phase breakdown synthesis (numbering from 007) + final integrity check.
