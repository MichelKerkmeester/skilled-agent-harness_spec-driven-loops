---
title: "Iteration 2: Measured advisor baseline for plain-word setup and health prompts"
trigger_phrases: []
---
# Iteration 2: Measured advisor baseline for plain-word setup and health prompts

## Focus

Measure what the live advisor returns today for the required plain-word setup/health prompts, exactly as the research topic prescribes, and classify the outcomes. Raw payloads are persisted under `events/measure-iter2-NN.json`.

## Actions Taken

- Composed 12 plain-word setup/health prompts: the four topic examples plus eight paraphrases (`set up my repo correctly`, `verify my repository health`, `is the skill setup working`, `my hooks are not running`, `check if my environment is configured properly`, `something is wrong with my setup`, `help me get started with this repo`, `are my rules being enforced`).
- Ran each through `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json` and stored the full envelope per prompt.
- Summarized recommendations, confidence, score, dominant lane, thresholds and freshness across the sample.

## Findings

1. All 12 measured calls exit 0 against a live advisor: `freshness: "live"`, `trustState.generation: 1033`, `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`. The measurement is reproducible from `events/measure-iter2-index.json`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json]

2. Ten of the twelve prompts return **zero recommendations** (`recommendations: []`), so the hook would render `Advisor: no skill matched.` for them: `help me set up skilled`, `is my repo set up right`, `why is this rule not enforced`, `set up my repo correctly`, `verify my repository health`, `is the skill setup working`, `my hooks are not running`, `check if my environment is configured properly`, `something is wrong with my setup`, and `are my rules being enforced`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-04.json]

3. Three of the four topic-named example prompts return an empty recommendation — `help me set up skilled`, `is my repo set up right`, `why is this rule not enforced` — and only `check my git hooks` routes. The flagship onboarding phrase in the research topic has no advisor owner today. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-02.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json]

4. `check my git hooks` routes to `sk-git` with `confidence 0.8316`, `score 0.579682`, `dominantLane: explicit_author`, `status: active` — consistent with the explicit lane's `git -> sk-git 1.0` token boost rather than any hooks or doctor vocabulary. The recommendation names the skill, not `/doctor:git` or `/doctor:git setup`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:37]

5. `help me get started with this repo` routes to `sk-doc` with `confidence 0.82`, `score 0.229089`, `dominantLane: lexical`, plus a `compiledRoute` with `action: "defer"` and no targets. A getting-started/onboarding prompt is answered with a documentation skill on a weak lexical match. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json]

6. The recommendation gate is confidence (0.8), not raw score: a `0.229089` score still surfaces at `0.82` confidence. Routing-accuracy work therefore has to consider calibration behaviour, not only phrase coverage. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json]

7. Every empty result is a genuine no-route outcome under a live graph — the envelopes show `freshness: "live"` and no degradation marker, so the gaps are vocabulary/ownership gaps rather than staleness or daemon failure. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-10.json]

8. No recommendation in the sample carries `kind: "command"`; both non-empty results are skills (`sk-git`, `sk-doc`). Combined with iteration 1, this confirms doctor commands cannot appear as candidates until something introduces them to the projection. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json]

9. Each payload carries a `_shadow` block (`advisor-shadow-learned-weights-v1`, `liveWeightsFrozen: true`) with parallel shadow scores for every emitted recommendation — a read-only learned-weights telemetry path that could inform later calibration but does not affect live routing. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json]

10. The measurement preserves raw artifacts: twelve per-prompt envelopes plus an index with exit code, duration, byte size and prompt text are on disk in the lineage for later regression baselining. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json]

## Ruled Out

- Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0.
- Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics.

## Dead Ends

- None; the measurement surface delivered exactly what the topic asked for.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the sample covers 12 prompts, exceeding the required ten.

## Sources Consulted

- events/measure-iter2-01.json … events/measure-iter2-12.json
- events/measure-iter2-index.json
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts

## Corrections

- Earlier revisions of this narrative and its delta said nine empty results. A recount of the persisted envelopes (12 measured, exactly two non-empty: `measure-iter2-03.json`, `measure-iter2-11.json`) corrects the count to ten. The delta carries a matching correction observation.

## Assessment

- New information ratio: 0.95
- Questions addressed: measured advisor baseline (Q2)
- Questions answered: Q2

## Reflection

- What worked and why: invoking the documented CLI verbatim gave clean, comparable JSON envelopes; persisting raw payloads keeps every later design claim anchored to observed behavior.
- What did not work and why: nothing failed; the initial shell attempt to compose records inline hit a quoting error, so record generation moved into a small committed script under `prompts/`.
- What I would do differently: add a control set of skill-shaped prompts in the same batch so the empty results can be contrasted against known-good routes without a second round trip.

## Recommended Next Focus

Read the doctor command family: `.skilled/commands/doctor/_routes.yaml` trigger_phrases per route, the `/doctor:*` markdown surfaces, and the doctor assets — then compare their vocabulary against the measured gaps.
