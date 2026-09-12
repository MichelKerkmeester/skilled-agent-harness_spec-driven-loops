---
title: "Convergence Report: goal unification lineage glm (run 2)"
stop_reason: "maxIterationsReached"
iterations_completed: 5
max_iterations: 5
convergence_threshold: 0.05
final_status: "max-iterations-reached"
---

# Convergence Report — fanout lineage `glm` (program iterations 11-15)

## Stop reason

**`maxIterationsReached`** — the loop reached `config.maxIterations = 5`. Convergence was never a stop
condition for this lineage (stop policy: `max-iterations`); ratios never approached the 0.05 threshold
(0.50-0.70 throughout), so the composite trend is telemetry only — per the invocation, convergence before
the cap was treated as telemetry and the angles were neither narrowed nor synthesized early. The 15-iteration
program terminates here: 10 discovery iterations (deepseek) + 5 verification iterations (glm).

## Iterations

| # (program) | # (run) | Angle | Focus | newInfoRatio | Status |
|---|---|---|---|---|---|
| 11 | 1 | A1 (weakest) | Weakest-evidenced angle of run 1: binding, verification pass (D1) | 0.60 | complete |
| 12 | 2 | A5 | Verify or refute run 1's runtime feasibility table (D5) | 0.55 | complete |
| 13 | 2+3 | A6+A7 | Isolation (009) × auto-update authority (029) reconciliation (D7) | 0.65 | complete |
| 14 | 4 | A8+A2 | Budget arithmetic on the real 036 goal.md + extractor fixture (D6, D3) | 0.70 | complete |
| 15 | 5 | synthesis | Ranked verdicts per D1-D7 (agree/correct/overturn) | 0.50 | thought |

Average 0.60 ·Evidence calls 33 (12/9/4/8/0 — each iteration inside the 8-11 target or the 12 ceiling) ·
stuck 0 · timeouts 0 · harness rejections 0.

## Trend

Non-monotonic, and it means something: a verification lineage starts where discovery left off (0.60),
dips as the first angle's claims mostly confirm (0.55), then *rises* as the corrections compound —
citation clusters (0.65), then a changed recommendation plus a live mechanism correction (0.70) — before
the synthesis iteration spends its novelty on ranking rather than finding (0.50). A declining-into-
convergence curve would have suggested the verification was redundant; this one suggests run 1's
evidentiary foundations needed exactly this pass.

## Questions answered

8 of 8 (KQ1-KQ8) — 7 answered, 1 answered-partial (KQ5/D5: the host-cap UNKNOWNs stand, now backed by a
recorded negative search). Inherited gaps: 3 of 5 closed (G3 'unbound' → 009:152; G4 ratification → the
tmpl:77-78 naming principle; G5 the 036 measurement → 3,393-3,732), 2 advanced (G1 recorded negative;
G2 the `:391` seam + the duplication finding), 3 newly recorded (G6 |buildBlock('')|; G6b the second
writer's identity; G6c residual documentation probes).

## Quality gates

Iteration markdown ✓ (5/5, write-once) · deltas ✓ (5/5) · state records ✓ (config + 5, append-only;
direct-write with the gateway-unavailable note) · source citations ✓ (27 corrections, each with a
resolving citation; 3 residual probes documented, not silently dropped) · ruled-out recorded ✓ (8 in
deltas) · convergence evaluated ✓ (telemetry) · citations at the cap ✓ (`research.md` `stop_reason`,
this file, `synthesis.json` `stopReason`).

## Deviations

Event/state records written directly by the executor (gateway unavailable through the dispatch guard);
schemas mirror the gateway envelope — precedent: the deepseek lineage's identical, recorded deviation.
No writes outside `research/lineages/glm/`; no `generate-context.js`, no `validate.sh`, no git writes.

## What the successor (the implementation packet) inherits

The correction register (research.md §3 — 27 corrections across 4 clusters + 3 mechanism + 2 precedent +
1 recommendation), the criterion gaps (§4.1-4.3: criterion #1 failing three ways; criterion #5 vs the
read-only resume whitelist; the second restored rule), the live 1,182-vs-576 truncation, the measured
3,393-3,732 warming-zone budget, and the ready-made projection seam (`goal-core.cjs:391`).
