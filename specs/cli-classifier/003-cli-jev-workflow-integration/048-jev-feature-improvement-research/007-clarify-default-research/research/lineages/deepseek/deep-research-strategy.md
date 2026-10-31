---
title: "Deep Research Strategy — Jev routing clarify default (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Strategy — Jev routing clarify default (deepseek lineage)

<!-- MACHINE-OWNED (detached lineage: no reducer runs here; this file was authored in full) -->

## Research Charter

**Topic:** Improve, refine and expand the Jev routing clarify default (cli-jev feature 020). The scorer is
`.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`; it measures the compiled router
front door `.skilled/bin/compiled-route.cjs` when a hub returns a `clarify` between two of its modes.
Recorded measurement (2026-10-02): `verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`,
baseline: first alternative right on 15 of 54; a 54-prompt fixture corpus written to tie; 34 of 54 rows
labeled `none_of_these`.

**Five questions**
1. What drove the measured result.
2. How to raise its accuracy or lower its cost.
3. How to make the measurement more trustworthy.
4. Where else in `.skilled` the same judgment would pay off.
5. What a default-on integration would need, cost and risk.

**Non-Goals:** editing any scorer, router, hub skill or live workflow; re-measuring the feature with new
model calls; implementation work of any kind. This lineage writes only inside its own artifact directory.

## Known Context

- The scorer runs a zero-call census over committed prompts and, past a 30-row label gate, a Jev arm that
  asks three rotated `choice` calls per labeled row and prints the Keep Rule verdict.
- The recorded 020 run lives outside the repository: labels in `~/.skilled/.labels/020-rows.jsonl`, the run
  in `~/.skilled/.labels/runs/047-020-jev-20261002/` (`calls.jsonl`, `report.json`) and the arbiter draft in
  `~/.skilled/.labels/drafts/020-arbiter.jsonl`. The fixture rows are committed at
  `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl`.
- Labels come from the delegated Opus 5.5 medium arbiter of 042's ADR-001. For 020 only the arbiter draft is
  on disk; no per-row two-draft pair was kept.
- The live integration seam is missing: `compiledRoute` returns action/targets/identity and drops
  `clarify.alternatives`, so a served default has no consumer today.
- Seven hubs are compiled-serving by default (`resolve.cjs` DEFAULT_ON_HUBS); the fixture covers five:
  cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc.

## Key Questions

- [x] Q1 What drove the measured result: the 34/54 none-label geometry floors the baseline at 15/54; A=28 is
      12 none recognitions + 16 mode rights; W=17 is 12+5; errors cluster in sk-design chart+diagram (9/9
      missed) and the surface-noun shape; probabilities do not separate; only 12 of 54 fixture rows
      reproduce a clarify.
- [x] Q2 How to raise its accuracy or lower its cost: early stop 118 calls byte-equal (-27.6%); two-call
      abstain-on-disagreement A=31 at 109 calls (-33%); single-call 28-29/54; ceiling is none-recall
      (A=50 perfect).
- [x] Q3 How to make the measurement more trustworthy: counts and options digest reproduce; report identity
      missing; premise check absent; baseline framing weak; single-arbiter labels; no class floor; F
      conflates noise and position; production rate unmeasured.
- [x] Q4 Where else the judgment pays off: four reachable mode-alternative clarify hubs; per-hub spread
      2/11 to 9/13; advisor killed the same judgment twice; the measurement kit is the reusable asset.
- [x] Q5 What default-on would need: seam, reader, amendment, operator call; ~357 tokens and ~1 s per
      clarify; served suggestions 61.9 percent wrong, 45.2 percent stable-wrong; tiers T0-T3.

## What Worked

- 2026-10-03 iteration 1: reading `calls.jsonl` beside the labels turns the aggregate verdict into a
  per-row anatomy (which 17 wins, which 4 losses, which 10 splits).
- 2026-10-03 iteration 1: replaying the 54 fixture prompts through the scorer's own `runCensus` on the
  current tree reproduced the committed-corpus census shape and exposed that only 12 of 54 fixture rows
  produce a `clarify` action; the other 42 route as bundles.
- 2026-10-03 iteration 2: recomputing seven call-shape variants from the recorded votes gives exact
  cost/accuracy tradeoffs with no new model call (early stop 118 calls byte-equal; tie-to-none A=31 at 109).
- 2026-10-03 iteration 3: reproducing the options digest and hashing the rows/labels/arbiter files turns
  the run's identity gaps into four concrete digests a future report can carry.
- 2026-10-03 iteration 4: reading the advisor's 002/019 measurements against this one separates "the
  judgment" from "this corpus" (kill there, keep here).

## What Failed

- 2026-10-03 iteration 1: an initial count of "17 unanimous wrong picks" was corrected to 19 (17 none-row,
  2 mode-row) by a recount; the earlier number had conflated it with W=17.
- 2026-10-03 iterations 2–5: no probability-based gate could be found because the recorded right and wrong
  probabilities overlap; that lever is closed on this corpus.

## Exhausted

- Reading the recorded artifacts for new signal: every claim in this packet traces to the recorded labels,
  calls, report, stdout, the scorer, the routers, or the sibling measurements. New claims need new labels
  or new calls.
- Counterfactual scoring from the recorded calls: all call-shape variants (early stop, tie rules, single
  order, any-none) are computed; a different variant needs a new run.
- Premise re-verification: the fixture's clarify/route split is measured on the frozen tree; re-measuring it
  again adds nothing.

## Next Focus

Loop complete at max-iterations. Synthesis written to `research.md`; the findings registry holds 47 findings,
5 resolved questions, 0 open questions and 7 ruled-out directions. Stop reason: `maxIterationsReached`.
