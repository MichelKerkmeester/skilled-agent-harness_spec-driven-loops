# Iteration 10 — Final consolidation: KQ6 benchmark-design update, coverage check, confirmed/sharpened/overturned verdict table

**Focus:** close out the 10-iteration arc. Confirm all 9 KQ-CRIT questions have evidence-backed answers (charter requirement before synthesis), update the KQ6 benchmark design given this round's findings, and produce the per-original-KQ verdict table the charter (§9's implied merge step) requires.

## What was done

Coverage audit of iterations 1-9 against the 9 KQ-CRIT questions set in `deep-research-strategy.md`; no new file reads.

## Finding 20 — KQ6 benchmark design must add two preconditions this round discovered

Both prior lineages' KQ6 answer (4 modes x 2 models, route-proof + latency) is sound in shape but, per this round's findings, would currently produce **two classes of misleading results** if run as originally specified:

1. **ai-council leg is uninterpretable until Deliverable 2 lands** (iteration 4 Finding 10, iteration 8 Finding 19, code-traced): the `route_proof` validator config in `deep_ai-council_auto.yaml:132-136` cannot match what the workflow's own emitter (`:117-118`) produces, for any model. Running the benchmark today would record a route-proof FAIL for ai-council on both the GPT and Claude legs, which would be misattributed to model behavior rather than to this pre-existing harness bug.
2. **Any research/review/context/ai-council leg that trips the Phase-0 `GENERAL AGENT REQUIRED` self-check (iteration 3 Finding 7) measures Mode D, not the route-proof mechanism the benchmark is nominally designed to measure.** Until Deliverable 1 (iteration 7) lands, a benchmark run risks conflating two distinct failure classes (soft-gate misread vs. actual route mismatch) under one FAIL bucket, undermining KQ6's stated purpose of cleanly separating route-proof correctness from other failure modes — the same class of conflation gpt-fast-high's own `stuck_latency` failure class produced (glm-max/research.md:33, cited in this round's own strategy known-context).

**Addition to KQ6:** the benchmark's failure-classification schema should record, per run, whether the failure occurred at the Phase-0 self-check (Mode D bucket), inside the mode-local workflow before dispatch (env_blocked/route_mismatch, gpt-fast-high's existing taxonomy), or at post-dispatch route-proof validation (and, for ai-council specifically until Deliverable 2 lands, flag those results as `known_harness_defect`, not a model-attributable result).

## Confirmed / Sharpened / Overturned — per original KQ (KQ1-KQ9)

| KQ | Prior consolidated verdict | This round's verdict | Disposition |
|---|---|---|---|
| KQ1 | 8-run external-shell harness needed for decisive evidence | Confirmed for the GPT leg; **sharpened** — the Claude/native leg does not require the external shell (iteration 2 Finding 4-5, iteration 6 Finding 17); benchmark also needs the failure-classification addition (Finding 20) | SHARPENED |
| KQ2 | Mix of mechanisms: mis-routing + Mode D (glm-max only) + latency | **Sharpened**: Mode D upgraded from inferred hypothesis to confirmed-in-at-least-one-instance with an exact cited mechanism (iteration 3 Finding 7), not just a plausible fourth category | SHARPENED |
| KQ3 | Keep ai-council mode:all; fix naming drift | **Sharpened**: the "naming drift" is a code-traced, deterministic emitter/validator self-contradiction inside one file (iteration 4, iteration 8), not a registry-vs-YAML drift; the "do not convert" recommendation itself is CONFIRMED, unchanged | SHARPENED |
| KQ4 | Orchestrate dispatches @deep and STOP | **Overturned in its literal (glm-max) form** — violates orchestrate's own documented NDP depth cap (iteration 5 Finding 12-13); **corrected fix supplied** (iteration 7 Deliverable 3) preserves the intent without the violation. Iteration 9 self-check 3 notes an alternative reading (session-handoff, not Task-dispatch) that would not violate NDP — ambiguity itself is now a named finding | OVERTURNED (literal reading) / intent CONFIRMED via corrected mechanism |
| KQ5 | Feasible detection-only plugin in system-skill-advisor | **Sharpened**: the actual load-bearing hook (`tool.execute.before`) is now cited (iteration 2 Finding 6) rather than argued by analogy; a genuine open question (fail-closed vs. mutate-only) is now named where before "fails-closed" was asserted as settled | SHARPENED |
| KQ6 | 4x2 benchmark, route-proof + latency | **Sharpened**: two preconditions added (Finding 20) — ai-council validator fix, Mode D failure-classification bucket — without which the benchmark produces misattributed results | SHARPENED |
| KQ7 | deep.md pattern generalizes to routing surfaces only | **Confirmed and reinforced**: the Phase-0 self-check (Mode D mechanism) is a concrete counter-example of the failure mode this pattern is meant to prevent (self-classification instead of deterministic signal) — iteration 3, iteration 7 Deliverable 1 is a direct application of KQ7's own pattern to a target neither lineage identified | CONFIRMED (reinforced with a new applied example) |
| KQ8 | orchestrate.md, 4 command YAML seams, ai-council YAML, plugin surface | **Sharpened**: adds the 8 command `.md` Phase-0 self-check blocks as a concrete, evidence-backed propagation target (iteration 3 Finding 8) neither prior lineage named | SHARPENED |
| KQ9 | Wait; unpark only on negative-gate | **Confirmed**, and confirmed specifically NOT to be GPT self-protective bias (iteration 6 Finding 15, independent glm-max convergence); reinforced with a coverage argument FIX-5 wouldn't even fix (Finding 16); "gate cannot fire" residual **sharpened down** in severity (Finding 17) | CONFIRMED (bias-checked) + residual downgraded |

## Coverage check

All 9 KQ-CRIT questions from `deep-research-strategy.md` have evidence-backed answers with file:line citations: KQ-CRIT-1 (iter 1 F3, iter 6 F15), KQ-CRIT-2 (iter 1 F1-2, iter 2 F4), KQ-CRIT-3 (iter 2 F6), KQ-CRIT-4 (iter 4 F9-11, iter 8 F19), KQ-CRIT-5 (iter 3 F7-8, iter 9 SC4), KQ-CRIT-6 (iter 5 F12-14, iter 9 SC3), KQ-CRIT-7 (iter 6 F15-17), KQ-CRIT-8 (iter 7 D1-4), KQ-CRIT-9 (iter 8 F18-19). 10 iterations completed per `stopPolicy: max-iterations`; no early convergence claimed at any point (every iteration through 9 produced newInfoRatio > 0.05 and net-new findings; iteration 10 is the planned synthesis-prep close, not an early stop).

## Status

`complete`. Ready for phase_synthesis.

newInfoRatio: 0.10 — final consolidation pass; expected low ratio at the planned close of a 10-iteration arc per `stopPolicy: max-iterations`.
