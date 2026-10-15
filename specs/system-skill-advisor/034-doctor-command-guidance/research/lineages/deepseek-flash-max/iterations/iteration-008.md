---
title: "Iteration 8: Routing accuracy testing design"
trigger_phrases: []
---
# Iteration 8: Routing accuracy testing design

## Focus

Answer Q8: how should routing accuracy be tested for admitted doctor routes, and which existing seams should the harness reuse? Map the existing routing-accuracy infrastructure first, then specify a doctor slice and its gates.

## Actions Taken

- Inventoried `runtime/scripts/routing-accuracy/` (corpus, holdout, ambiguity files, capture and scoring scripts, baseline JSON).
- Read the baseline metrics and the bounded-delta gate policy in `references/scoring/validation-baselines.md`.
- Read `ci-router-vocabulary-reach.cjs` (probe semantics, allowlist, failure shape).
- Sampled all three corpus record shapes.

## Findings

1. A full routing-accuracy corpus infrastructure already exists: `labeled-prompts.jsonl` (195 cases), `holdout-prompts.jsonl` (66), `ambiguity-prompts.jsonl` (24), plus `capture-scorer-eval-baseline.mjs`, `score-routing-corpus.py`, `build-holdout.mjs` and `derive-ambiguity-slice.mjs`, measured against a pinned environment (semantic lane disabled, empty DB dir, filesystem projection). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3]

2. The captured baseline is explicit and comparable: full-corpus top-1 0.7949 (155/195), UNKNOWN count 13, gold-none false-fire 5, holdout top-1 0.7424, ambiguity top-1 0.7917 at tau 0.03, with per-bucket rows for review, memory_save and delegation. Captured 2026-10-11 against the pinned environment. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-58]

3. The bounded-delta gate is already policy: full-corpus top-1 must stay at or above baseline minus 0.02, holdout at or above baseline minus 0.01, UNKNOWN at or below baseline plus 2, and the docs state validation baselines are "the promotion gate for routing behavior changes, not after-the-fact reporting". Note a doc-vs-data drift worth fixing when the doctor slice lands: the doc's dated numbers (0.7544 floor / 0.7261 / 15, citing a 0.7744 snapshot) trail the current JSON baseline (0.7949), so the slice capture should re-freeze both. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:33] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:43-59]

4. `advisor_validate --confirm-heavy-run true` runs corpus, holdout, parity, safety and latency slices in one pass, and a per-skill slice form exists; this is the release-scale check that a doctor routing change must pass in addition to the fast slice. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:52-64]

5. `ci-router-vocabulary-reach.cjs` probes every multi-word phrase a hub's ROUTER.md declares and reports phrases that do not reach the declaring hub; its allowlist pins `declaredBy` + `phrase` + `wonBy`, so an allowed phrase that starts losing to someone new still fails, and single-token phrases are skipped because they fail on length rather than vocabulary. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-70]

6. That harness covers mode-registry hubs only (it filters directories with `mode-registry.json` and `ROUTER.md`), so doctor commands are outside its probe surface today; a doctor slice needs its own probe source (the `_routes.yaml` trigger phrases) and an expected-winner mapping. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:71-90]

7. Corpus records already carry everything a doctor slice needs: `id`, `bucket`, `source_type`, `prompt`, expected `skill_top_1`, `notes`, and for ambiguity cases a captured `margin_at_capture` with `tau`. A doctor slice can mirror the schema with `command-doctor-*` bridge ids as expected top-1. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl:1-2]

8. Proposed doctor golden set, seeded from this lineage's measurements: (a) an onboarding slice - the nine measured onboarding prompts with expected `/doctor:setup`; (b) a diagnostics slice - the fourteen candidate phrases from iteration 6 with expected per-route ids; (c) a control slice - the ten skill-shaped controls with their unchanged incumbent skills; (d) an ambiguity slice - cases where two owners legitimately compete, each with an expected winner and a margin. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json]

9. Proposed gates per slice: onboarding top-1 = 9/9; diagnostics top-1 >= 12/14 initially with margin >= 0.05 over the runner-up; controls top-1 = 10/10 unchanged; zero new ambiguous pairs against the iteration 6 baseline; doctor empty-rate = 0; plus the existing bounded-delta rows recomputed against the current JSON baseline (full corpus >= 0.7749, holdout >= 0.7324, UNKNOWN <= 15). [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-07.json]

10. CI wiring: structural gates stay `route-validate.sh` (manifest) and the command-bridges drift guard (projections); the outcome gate becomes a captured doctor slice in the routing-accuracy corpus with a new baseline row; the reach check gains either a doctor probe mode or a sibling script that reads `_routes.yaml` and asserts each admitted phrase reaches its declared command id. [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40]

## Ruled Out

- Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist.
- Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands.

## Dead Ends

- None; the infrastructure answered the design question directly.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl
- .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs

## Assessment

- New information ratio: 0.85
- Questions addressed: routing-accuracy testing (Q8)
- Questions answered: Q8

## Reflection

- What worked and why: discovering the existing corpus and gate policy converted the testing question from design to configuration, with named files and numbers.
- What did not work and why: nothing failed.
- What I would do differently: locate the routing-accuracy folder before designing any test shape, since the record schema should be copied, not reinvented.

## Recommended Next Focus

Consolidate the ideas to reject with reasons (Q9): gather every candidate design that the evidence has eliminated, including the ones already recorded, and add any that the full picture now makes rejectable.
