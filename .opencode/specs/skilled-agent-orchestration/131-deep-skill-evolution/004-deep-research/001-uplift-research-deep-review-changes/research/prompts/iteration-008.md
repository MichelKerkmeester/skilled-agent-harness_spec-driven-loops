# RCAF DEEP RESEARCH — ITERATION 8 — final devin adversarial pass

## ROLE
Last devin iter. Final adversarial sweep on areas iters 1-7 may have skimmed. Aim for 0-2 findings (convergence test).

## CONTEXT

Iter 8 of 10 (last cli-devin iter; iters 9-10 are cli-codex synthesis).

Iter-7 adjudication: of ~11 P1 candidates, only **2 CONFIRMED**. Massive false-positive rate (9/11 ≈ 82%). The 118 deep-review upgrades MOSTLY already shipped for deep-research; remaining work is small.

This iter probes areas the prior iters didn't fully cover. Aim for HIGH precision (0 false-positives) rather than coverage.

## ACTION

**Step 1: Probe untouched surfaces**

Specifically check:
- `.opencode/skills/deep-research/assets/` — full inventory + adversarial check
- `.opencode/skills/deep-research/references/` — verify each reference doc matches actual code behavior
- Recent deep-research run packets under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-deep-research-arc-investigations/` — sample 1-2 to confirm deep-research isn't producing bad output

**Step 2: Verify iter-7's 2 CONFIRMED P1s**

Re-read each CONFIRMED P1 from iter-007's delta. Confirm the iter-7 verdict is correct (not over-confirmed). If any look weaker than P1, note for synthesis.

**Step 3: Last-pass test**

Try to find ONE substantive new finding (not in F-001..DR-008). If found: convergence claim weakens. If 0 new findings: convergence holds.

## OUTPUT

`.../iterations/iteration-008.md` + `.../deltas/iter-008.jsonl`. Format same as prior.

After both:
`ITER-8 DONE: <P0>/<P1>/<P2>, dimensions=final-adversarial, new=<N>`
