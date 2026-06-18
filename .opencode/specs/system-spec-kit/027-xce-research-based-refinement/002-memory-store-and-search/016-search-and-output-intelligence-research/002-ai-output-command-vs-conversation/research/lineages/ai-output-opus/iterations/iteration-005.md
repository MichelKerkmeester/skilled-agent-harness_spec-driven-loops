# Iteration 005 — KQ5: Per-model prompt-framework fit + convergence

**Focus:** Does the right prompt framework per model reduce the command-adherence gap?
Consolidate the framework evidence and converge.
**Status:** complete · **newInfoRatio:** 0.28 (below-threshold approach; converging)

---

## Per-model framework evidence (consumed from sk-prompt-small-model profiles)

| Model | Primary framework | Fallback | Avoid | Pre-plan | Evidence strength |
| --- | --- | --- | --- | --- | --- |
| DeepSeek-v4-pro | **RCAF** | none | none | medium | reasoned default, no model-specific benchmark (confidence low) [SOURCE: deepseek-v4-pro.md:54-66,72-81] |
| Kimi-k2.7-code | **COSTAR** | TIDD-EC | **RCAF** | lean | empirical benchmark 007; RCAF objectively weakest (0.992) [SOURCE: kimi-k2.7-code.md:57-63,83] |
| MiMo-v2.5-pro | **COSTAR** | RACE | TIDD-EC, CIDI | lean | empirical benchmark 004; correctness saturated, format/efficiency discriminated [SOURCE: mimo-v2.5-pro.md:57-67] |

## Does framework fit reduce the adherence gap? (answer to KQ5)

**Partially — and only on the dimension frameworks actually control.** The benchmarks
measured *correctness and format adherence on coding fixtures*, not *command
control-flow adherence*. Key reads:
- For MiMo, "**correctness was not the discriminator** … The discriminator was format
  adherence + token efficiency." [SOURCE: mimo-v2.5-pro.md:65-67] COSTAR's `Style: "no
  preamble"` + `Audience: automated pipeline` fields *suppress preamble* — i.e. they make
  the model emit only the requested shape. That is **directly** the lever for the KQ4
  surface-parity goal (no extra prose, fixed fields), and indirectly helps KQ1/KQ3 by
  signaling "this is a pipeline, execute the shape — do not converse."
- For Kimi, RCAF (the old convention default) was **objectively weakest**; COSTAR/RACE/
  TIDD-EC tied at perfect correctness. [SOURCE: kimi-k2.7-code.md:83] A command contract
  that internally reads RCAF-flavored ("ask if empty, else…") is leaning on Kimi's
  weakest framing. Reframing the contract in COSTAR terms (Objective = "execute retrieval
  on QUERY"; Audience = "automated pipeline"; Response = the fixed envelope) plays to
  Kimi's strong tier.
- DeepSeek rewards **specificity and precise conditional framing** [SOURCE:
  deepseek-v4-pro.md:60] — which is why it alone survived the implicit empty-guard. It
  needs the contract least.

**Conclusion:** framework fit is a *real but secondary* lever. It cannot by itself fix a
control-flow defect that lives in the contract's salience ordering (KQ1/KQ3) — a
well-framed prompt still loses if the first instruction it reads says "ask a question."
But once the structural fix (KQ3) is in place, **writing the command contract in the
COSTAR register** — Objective-first, Audience=automated-pipeline, Response=fixed envelope,
no-preamble Style — is the framing that all three models tolerate best (COSTAR is the
shared strong pick for the two weak followers, and DeepSeek is framework-agnostic here).

## The unifying insight (cross-cutting)
The command-adherence gap is **three stacked layers**, and the right fix targets each:
1. Control flow (who decides the branch) → structural arg-presence flag (KQ3). *Primary.*
2. Salience (what the model reads first) → execute-path first, ask-path demoted (KQ3).
3. Framing (the register the contract speaks) → COSTAR: objective-first, pipeline
   audience, fixed response, no preamble (KQ5). *Secondary, reinforcing.*
Framework choice (layer 3) is necessary polish but **insufficient alone**; layers 1–2 are
what convert Kimi 0% / MiMo 50% execute-rates toward DeepSeek's 100%.

## Convergence assessment
- All 5 key questions now have evidence-backed answers with concrete contract
  recommendations. newInfoRatio this iteration is 0.28 and is dominated by *consolidation*
  rather than new discovery; the remaining deltas would be implementation detail (out of
  scope per charter).
- Stop condition met: **all 5 open problems answered** AND maxIterations (5) reached.

## Ruled out this iteration
- **"Pick one global framework for all commands"** — refuted: DeepSeek=RCAF vs
  Kimi/MiMo=COSTAR; RCAF is Kimi's *worst*. A one-size framework would degrade the weak
  followers. The contract should be written in the **COSTAR register** because it is the
  intersection that the weak followers need and the strong one tolerates.
- **"Framework fit alone closes the gap"** — refuted: benchmarks measured coding
  correctness/format, not command control-flow; the structural fix (KQ3) is primary.

## Next focus
Synthesis → consolidate into research.md with the prioritized contract-change list.
