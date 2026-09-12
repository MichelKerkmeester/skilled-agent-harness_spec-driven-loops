---
title: "Convergence Report: goal unification lineage deepseek"
stop_reason: "maxIterationsReached"
iterations_completed: 10
max_iterations: 10
convergence_threshold: 0.05
final_status: "max-iterations-reached"
---

# Convergence Report — fanout lineage `deepseek`

## Stop reason

**`maxIterationsReached`** — the loop reached `config.maxIterations = 10`. Convergence was never treated as
a stop condition for this lineage (stop policy: `max-iterations`); the composite trend is reported as
telemetry only.

## Iterations

| # | Angle | Focus | newInfoRatio | Status |
|---|-------|-------|--------------|--------|
| 1 | A1 | Session-to-packet binding mechanisms (D1) | 0.90 | complete |
| 2 | A2 | Render surfaces and strip placement (D3) | 0.75 | complete |
| 3 | A3 | Legacy store inventory and fate (D2) | 0.70 | complete |
| 4 | A4 | Resend predicate, cadence, dedup (D4) | 0.68 | complete |
| 5 | A5 | Runtime surface and identity map (D5) | 0.65 | complete |
| 6 | A6 | Isolation regression (D7) | 0.60 | complete |
| 7 | A7 | Authority ladder and child→parent amendment | 0.60 | complete |
| 8 | A8 | Budget and truncation arithmetic (D6) | 0.72 | complete |
| 9 | A1+A3 | Binding + store fate as one mechanism | 0.55 | complete |
| 10 | A2+A4 | Strip + resend as one pipeline | 0.50 | complete |

## Metrics

- **Total iterations completed:** 10 / 10
- **Average newInfoRatio:** 0.665
- **Trend:** 0.90 → 0.75 → 0.70 → 0.68 → 0.65 → 0.60 → 0.60 → **0.72** → 0.55 → 0.50 (declining with one
  rebound at iteration 8, where measured budget arithmetic replaced assumption)
- **Last 3 ratios:** 0.72 → 0.55 → 0.50 (declining)
- **Stuck count:** 0 (no iteration produced no new information; no recovery event fired)
- **Guard violations:** none — every iteration cited sources that resolve, and the two citation defects found
  (a stale charter path, one errata row of off-by-one constants) were reported as findings rather than left
  silent
- **Questions answered ratio:** 8 / 8 angles carry an evidence-backed answer (KQ1-KQ8); 4 residual unknowns
  are recorded explicitly for the successor lineage
- **Source diversity:** repo code (hook core, plugin, adapters, validator, CLI), packet documents (charter,
  playbook, template, plan asset), history packets (003-adjacent, 009 + phase 6, 029, 010), and host-level
  runtime state (`~/.claude`, `~/.codex`). No finding rests on a single weak source.

## Quality gates

| Gate | Result |
|------|--------|
| Iteration markdown present, non-empty, per iteration | pass (10/10) |
| Delta file per iteration | pass (10/10) |
| Canonical record per iteration through the ledger append gateway | pass (10/10, ledger sequences 2-11) |
| State log projection refreshed | pass (10/10) |
| Sources cited for every behavioural claim | pass |
| Ruled-out direction recorded per iteration | pass (18 entries) |
| Convergence evaluated per iteration | pass (telemetry only; stop policy is max-iterations) |
| Synthesis artifacts at the cap | pass (`research.md`, this report, registry, dashboard) |

## Deviation recorded

`synthesis_complete` is a **pinned legacy event** in the ledger schema
(`.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:53`, and
the pinned set at `:44`), so the append gateway refuses it by design (`pin-old-runtime`). The terminal
synthesis record is therefore written as a plain artifact beside the state log (`synthesis.json`), not
through the gateway. All ten iteration records *were* written through the gateway.

## Handover to the successor lineage (`glm`, iterations 11-15)

1. Verify A5's runtime claims (iteration 5) against the repo — especially the two host-private stores and
   the devin command-surface absence.
2. Reconcile A6 + A7: whether the authority ladder survives a phased packet with three children.
3. Verify the budget arithmetic (iteration 8) against the *real* parent `goal.md` of packet 036 — this
   lineage did not size that file (it was out of scope: read-only research on the charter packet, and the
   parent goal belongs to the packet, not the lineage).
4. Attack the weakest-evidence angle: the CommonJS/ESM seam and the plugin drift risk (iterations 5 F7,
   9 F7, 10 F2) carry the thinnest evidence in run 1.
5. Produce the ranked D1-D7 synthesis with rejected alternatives and enforcement sites.
