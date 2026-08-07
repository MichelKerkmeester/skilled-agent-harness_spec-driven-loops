# Iteration 002 — KQ2: `--command` vs direct-prompt vs natural conversation

**Focus:** When should a slash command be a deterministic renderer (no model latitude)
vs a model-driven flow? Characterize the three surfaces and their output variance.
**Status:** complete · **newInfoRatio:** 0.70

---

## The three surfaces, defined precisely

| Surface | What carries the contract | Model latitude |
| --- | --- | --- |
| `--command` (registered) | Full command template + presentation assets enter the session as `$ARGUMENTS`-bound context | Bounded by the contract — but model must *interpret* it |
| Direct prompt (raw `run "…"`) | Nothing — slash text is delivered as raw prose; the template never loads | Total; the model improvises a shape |
| Natural conversation | Whatever the session has loaded (CLAUDE.md, prior turns); no command envelope | Total, but context-anchored |

Key mechanic that separates surface 1 from surface 2:
> "slash-command text inside a `run` message is NOT expanded — `opencode run
> "/memory:search query"` delivers the slash text to the model as raw prose, and the
> command template … never enters the session. To execute a registered command
> non-interactively: `opencode run --command <family>/<name> "<args>"`."
[SOURCE: .opencode/skills/cli-opencode/SKILL.md:269]

**Consequence (verified):** any adherence probe of a slash command MUST use `--command`;
the raw-text form is only a labeled negative control. [SOURCE: cli-opencode SKILL.md:269]
The grounding evidence's command-vs-direct comparison is therefore valid *because* it
used `--command`, not raw `/memory:search` text. [SOURCE: grounding-evidence.md:9-10]

## Variance observed across surfaces (from verified evidence)

- **`--command` surface:** variance is in *whether the contract executes at all* —
  DeepSeek 2/2 executed; Kimi 0/N (dropped to startup); MiMo mixed.
  [SOURCE: grounding-evidence.md:11-22] The output *shape* (when it executed) was the
  fixed `MEMORY:SEARCH` block — low shape-variance, high execute/no-execute variance.
- **Direct-prompt / natural surface:** Kimi searched correctly and "reported
  `requestQuality` / `citationPolicy` more precisely than DeepSeek." MiMo "handled the
  empty-result fallback well, surfaced triggered + constitutional rows."
  [SOURCE: grounding-evidence.md:17-22] → higher *field-selection* variance: each model
  chooses which fields to surface, so the same retrieval renders differently
  (the KQ4 problem). The job gets done but the output is not cross-comparable.

**Synthesis of the tradeoff:**
- The deterministic-renderer (fixed-shape) approach **trades model latitude for
  cross-model consistency**. The `MEMORY:SEARCH … STATUS=OK` envelope is already this:
  a fixed shape with explicit field slots. [SOURCE: search.md:56-69; search_presentation.txt:40-79]
  Where it executed, shape variance was ~0.
- The model-driven (natural) approach **trades consistency for richness** — Kimi's
  `requestQuality`/`citationPolicy` precision is genuinely better content, but it is
  unpredictable and non-parseable across models.

## When each is correct (the design rule)

1. **Deterministic renderer** when the output feeds another program/agent, must be
   diffable/parseable, or must be cross-model comparable (dashboards, pipelines,
   memory-search result blocks). The contract should leave **zero shape latitude** and
   ideally **zero branch latitude** (see KQ3). The presentation contract's own framing
   confirms the intent: *"Use compact, parseable output for model dispatch."*
   [SOURCE: search_presentation.txt:38-39]
2. **Model-driven flow** only for the genuinely ambiguous step (disambiguation
   follow-ups), and even then constrained to "at most one clarifying follow-up."
   [SOURCE: search_presentation.txt:113] The richness models add (Kimi's quality fields)
   should be *promoted into the mandated field set* (KQ4) rather than left to latitude.

## Quantification (within available evidence)
- Execute-rate under `--command`: DeepSeek 2/2 = 100%; Kimi 0/1 observed = 0%; MiMo
  1/2 = 50%. [SOURCE: grounding-evidence.md:11-22] Small-n but directionally consistent
  with instruction-following strength (KQ1, KQ5). Marked as observed-sample, not a
  statistically powered rate.
- Shape variance | executed `--command`: ~0 (fixed envelope). Field-selection variance |
  natural: high (confidence vs similarity, quality fields present/absent).

## Ruled out this iteration
- **"Make everything model-driven for richness"** — refuted: it forfeits the
  cross-model comparability the spec demands (KQ4). Richness belongs in the mandated
  field set, not in latitude.
- **"Probe adherence with raw `/memory:search` text"** — refuted by the mechanic: raw
  text never loads the template; only `--command` is a valid probe. [SOURCE: cli-opencode SKILL.md:269]

## Next focus
Iteration 3 → KQ3: replace the `$ARGUMENTS`-emptiness heuristic with a structural
arg-presence signal; design the robust command-contract pattern.
