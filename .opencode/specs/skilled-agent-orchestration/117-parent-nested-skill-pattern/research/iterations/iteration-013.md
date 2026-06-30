# Iteration 013 — ADVERSARIAL-1: refute model A + registry-driven design

- **Model**: opus-4.8 (claude2/account2, read-only)
- **Seat**: 013
- **model_pick**: A

## Analysis

I now have everything needed. The keystone, both routing layers, the registry, the scoring code, and the fixtures are all verified against source. Here is my adversarial analysis.

---

## SEAT 013/15 — ADVERSARIAL-1: Refuting Model A + the registry-driven design

**Stakes read:** medium-blast, fully reversible (config/test-only changes, no runtime data). The keystone is right; my attack lands on the *mechanism* the consensus attached to it.

### What I confirmed before attacking (so the refutation is grounded, not rhetorical)

- **The one-identity keystone is real.** `discoverGraphMetadataFiles` collects only files named `graph-metadata.json` (`skill-graph-db.ts:601`, push/match at `:617-621`); `find` proves the hub has exactly one and the five nested packets carry none. `parseSkillMetadata` throws on `skill_id !== folderName` (`:656-660`) and `family ∉ ALLOWED_FAMILIES` (`:662-664`). The hub's `graph-metadata.json` has `skill_id: deep-loop-workflows`, `family: deep-loop` — valid. **Model B would force each packet to ship a valid metadata file**, and the `ai-council` folder (whose `SKILL.md` name is `deep-ai-council`) would have to take `skill_id: "ai-council"` to dodge the throw — breaking its own identity. So **A-beats-B holds**; I do not contest the keystone.

- **The TS layer does not score.** `aliases.ts` contains only alias→canonical and canonical→mode *maps* (`DEEP_MODE_BY_CANONICAL`, `:96-101`); the deep-routing weighted regex scoring exists **only in Python** (`skill_advisor.py:2326-2366`). The TS `lib/scorer/` weights are the generic lane-fusion system, unrelated to deep-mode tuning. This guts tension #5's premise.

Now the three attacks.

---

### Attack (a): Does runtime registry-loading add real fragility vs. hardcoded constants? — **Model A HOLDS, with a caveat**

The intuitive adversarial claim is "a hardcoded constant can't fail to load; a file read can." But the precedent kills most of it: `skill_advisor.py:170-171` **already** does an unconditional, unguarded import-time `json.load` of `compat-contract.json`, and the module *cannot import* if that file is missing/corrupt — the `--deep-skill-routing-json` path included. The advisor also already runtime-scans every sibling skill's `graph-metadata.json` (`:681-687`, `:736-742`). So "the advisor reads JSON config at startup" is an established, accepted pattern, not a new fragility class.

**Where the attack partially lands:** every existing import-time load is *in-skill* (`../schemas/`, `./skill-graph.json`). `mode-registry.json` lives in a **different** skill (`deep-loop-workflows/`). Deriving from it at import time would make the advisor's *importability* depend on a sibling workflow skill's internal file — a coupling direction the advisor does not currently have (the graph-metadata scans are guarded and runtime; one missing file just skips that skill, `:682`). The `--deep-skill-routing-json` main path (`:3761-3775`) is otherwise I/O-light — it skips `get_skills()` entirely — and the parity test spawns a fresh `python3` per assertion (`:40-47`), so each of the 9 invariants pays the import cost.

**Verdict:** fragility is *marginal, not disqualifying* — but it argues for a **guarded load with a hardcoded fallback**, which is functionally C-plus (see below), not naive runtime derivation.

---

### Attack (b): Can the registry reproduce `DEEP_ROUTING_LEXICAL_PATTERNS` scoring exactly? — **Refutes the over-reading of A; the narrow A HOLDS**

This is the strongest attack and it forces a precision the consensus blurred. Model A says "derive **mode projections**." There are two very different things one could move:

1. **The projection maps** (`DEEP_ROUTING_MODE_BY_KEY`, `:2320-2324`; TS `DEEP_MODE_BY_CANONICAL`, `aliases.ts:96-101`) — pure identity mapping. Registry-derivable. Scoring-neutral. Fixtures unaffected.
2. **The weighted regex tuning** (`:2326-2366`), the multiplicative incompatibility penalties (`:2440-2457`), the confidence formula `min(0.95, total/(total+2.0))` (`:2462`), and band cutoffs (`:2491-2497`).

The parity fixtures assert **exact score thresholds** — `scores.research >= 0.75 && scores.review < 0.40` (`routing-parity-deep-skills.vitest.ts:65-66`), `>= 0.80`, `>= 0.65`, `< 0.30`. These are functions of the #2 tuning. Moving #2 into JSON:
- Floats round-trip exactly (IEEE-754; `1.8` literal == JSON `1.8`), and addition is commutative so dict-iteration order is safe — **so "JSON can't reproduce the numbers" FAILS as an objection.**
- **But** every regex must be double-escaped in JSON (`\b` → `"\\b"`); one missed escape silently changes a word-boundary into a literal and shifts a score below a fixture threshold — a corruption footgun with **zero offsetting benefit**, because TS never reads these weights (confirmed above) so there is no Python↔TS divergence to cure.

Semantically this mirrors **CORRECTION #1's own principle**: scoring tuning is a *scorer-execution* concern (it belongs with the scorer, like `artifact-root.cjs` belongs in the runtime), not an *identity/topology* concern (which is what a "mode registry" is). 

**Verdict:** the registry **can** safely carry the projection maps (narrow A holds); it **must not** absorb the lexical/structural weights. Tension #5 resolves to **weights stay in Python code**. Any reading of "derive both layers" that drags the weights into JSON is refuted.

---

### Attack (c): Is C-plus (hardcoded + drift-guard test) the better trade? — **YES; this AMENDS A's mechanism**

Here I genuinely diverge from the unanimous stage-1 framing. The consensus's *goal* — "routing cannot drift from the registry" — is correct and I affirm it. But its *mechanism* ("DERIVE at runtime") is not the only way to get it, and the evidence says it's the worse way:

- A pure-field registry loader **regresses routing** as-is. `DEEP_ROUTING_MODE_BY_KEY`'s key for council is `"deep-ai-council"`, but the registry's council `packet` is `"ai-council"` (`mode-registry.json:45`) with `deep-ai-council` buried in `aliases` (`:49`). And `deep-improvement` is **one packet → four `workflowMode`s** (`:51-96`), so array-order can't pick the advisor default. So **both** the runtime-derivation path and a guard test need the registry enriched with an explicit `advisorRouting` block (`routingClass`, `legacyCanonicalId`, `advisorDefaultMode`) — confirming tensions #1, #2, #3. Neither approach is free of that.

- Given that the enrichment is *shared*, the only delta between the two is **runtime-load vs. CI-assert**. The maps are tiny (4 entries) and change ~never. A drift-guard — a vitest that reads `mode-registry.json` and asserts the importable TS `DEEP_MODE_BY_CANONICAL` equals the registry projection, plus a Python unit test (or a `--dump-deep-routing-maps` flag) asserting `DEEP_ROUTING_MODE_BY_KEY` does too — delivers the **same practical guarantee** (you cannot merge a drifted map; CI fails with a clean diff) while avoiding: hot-path per-spawn I/O, the new cross-skill *import-time* coupling from attack (a), and the regex-escaping risk from attack (b). It also keeps the scoring constants co-located with the scorer.

**Verdict:** C-plus gets ~90% of the benefit (anti-drift, enforced) at ~10% of the risk. **A's keystone and single-source-of-truth goal survive; A's "derive at runtime" mechanism should be replaced by C-plus.**

---

### Where I disagree with the stage-1 consensus

1. **The registry is the source of *identity/topology*, not scoring.** "Derive both advisor layers from the registry" must be scoped to the projection maps. The weighted regex (`:2326-2366`), penalties, confidence formula, and bands stay in Python — they are scorer-execution tuning, and TS has no copy to diverge.
2. **Prefer a drift-guard test over runtime derivation.** Same anti-drift guarantee, strictly less runtime/coupling risk, for config that changes once a year and gates a per-prompt subprocess spawn.
3. **Tension #5 is largely a non-problem.** It rests on a Python↔TS weight-sharing need that does not exist — `aliases.ts` carries no weights.

Everything else in the consensus (one hub identity, registry as single source of truth for the projection, explicit `advisorRouting` block, fixture coverage for context + the improvement lanes) I affirm.

===RESEARCH-JSON===
{"angle":"adversarial: refute registry-driven runtime derivation","verdict":"Model A's one-identity keystone and single-source goal hold, but the 'derive at runtime' mechanism should be amended to C-plus (hardcoded maps + drift-guard test), and the lexical/structural weights must stay in Python — not the registry.","model_pick":"A","decisions":[{"question":"#1/#2/#3 registry shape & cardinality","resolution":"Add an explicit per-mode advisorRouting block (routingClass, legacyCanonicalId, advisorDefaultMode); pure-field derivation regresses because council packet='ai-council' != key 'deep-ai-council' and deep-improvement is 1 packet -> 4 modes","evidence":"mode-registry.json:45,49,51-96; aliases.ts:96-101; skill_advisor.py:2320-2324"},{"question":"#5 lexical weights: registry or code?","resolution":"Stay in Python code; they are scorer-execution tuning (semantic mirror of CORRECTION #1), TS holds no copy so there is no divergence to cure, and JSON regex escaping is a benefit-free footgun","evidence":"skill_advisor.py:2326-2366,2440-2462; aliases.ts has no scorer"},{"question":"mechanism: runtime-derive vs drift-guard","resolution":"Use C-plus: keep hardcoded projection maps + CI test asserting maps==registry projection; same anti-drift guarantee, avoids cross-skill import-time coupling and per-spawn I/O","evidence":"skill_advisor.py:170-171,3761-3775; routing-parity-deep-skills.vitest.ts:40-47"},{"question":"#6 ai-council folder vs name","resolution":"Represent explicitly in registry as packetSkillName; under one-identity the folder/name mismatch is advisor-irrelevant (no nested graph-metadata.json, parseSkillMetadata never runs on it)","evidence":"skill-graph-db.ts:601,644,656-660; deep-loop-workflows/ai-council/SKILL.md name=deep-ai-council"},{"question":"#4 fixture coverage","resolution":"Add a registry-coverage fixture asserting projection-map parity (TS+Python) against the registry, plus context/improvement-lane routing-class assertions; current parity tests only cover research/review/ai-council","evidence":"routing-parity-deep-skills.vitest.ts:52-197"}],"refutations":[{"target":"runtime registry load adds disqualifying fragility vs hardcoded constants","held":true,"note":"Mostly fails: advisor already does unguarded import-time json.load (skill_advisor.py:170-171). Survives only as a marginal NEW cross-skill import-time coupling -> argues for guarded load / C-plus, not naive derivation"},{"target":"registry can losslessly absorb DEEP_ROUTING_LEXICAL_PATTERNS scoring","held":false,"note":"Floats round-trip and addition is order-safe, so numbers reproduce; but regex double-escaping in JSON is a silent-corruption risk against exact fixture thresholds (>=0.75/<0.40) for ZERO benefit since TS never scores. Weights must stay in code"},{"target":"A's 'derive both layers at runtime' is the right mechanism","held":false,"note":"C-plus drift-guard gives the same anti-drift guarantee at lower risk; both still need the advisorRouting enrichment, so runtime-load buys nothing but hot-path I/O and coupling"}],"standardize":["sk-doc: document 'parent skill with nested sub-skills' pattern = one hub graph-metadata.json + verbatim packets that DROP per-mode metadata so the advisor sees one identity","create: scaffold should emit hub graph-metadata.json + mode-registry.json with an explicit advisorRouting block (routingClass: lexical|metadata|command-bridge, legacyCanonicalId, advisorDefaultMode, packetSkillName)","doctor: add a drift-guard check asserting hardcoded DEEP_ROUTING_MODE_BY_KEY (Python) and DEEP_MODE_BY_CANONICAL (TS) equal the registry projection","benchmark/skill-benchmark: keep scoring weights co-located with the scorer; registry holds identity/topology only, never tuning"],"risks":["Enriching mode-registry.json for derivation without a guard test re-introduces a second source of truth and silent drift","Moving weighted regex into JSON risks an escaping error that shifts a score under a fixture threshold with no upside","Runtime/import derivation in skill_advisor.py couples advisor importability to a sibling workflow skill's file — a new failure mode on a per-prompt subprocess-spawn hot path","context + 4 improvement lanes remain fixture-untested, so any registry refactor can regress them invisibly"]}
===END===

## Structured output

```json
{
  "angle": "adversarial: refute registry-driven runtime derivation",
  "verdict": "Model A's one-identity keystone and single-source goal hold, but the 'derive at runtime' mechanism should be amended to C-plus (hardcoded maps + drift-guard test), and the lexical/structural weights must stay in Python — not the registry.",
  "model_pick": "A",
  "decisions": [
    {
      "question": "#1/#2/#3 registry shape & cardinality",
      "resolution": "Add an explicit per-mode advisorRouting block (routingClass, legacyCanonicalId, advisorDefaultMode); pure-field derivation regresses because council packet='ai-council' != key 'deep-ai-council' and deep-improvement is 1 packet -> 4 modes",
      "evidence": "mode-registry.json:45,49,51-96; aliases.ts:96-101; skill_advisor.py:2320-2324"
    },
    {
      "question": "#5 lexical weights: registry or code?",
      "resolution": "Stay in Python code; they are scorer-execution tuning (semantic mirror of CORRECTION #1), TS holds no copy so there is no divergence to cure, and JSON regex escaping is a benefit-free footgun",
      "evidence": "skill_advisor.py:2326-2366,2440-2462; aliases.ts has no scorer"
    },
    {
      "question": "mechanism: runtime-derive vs drift-guard",
      "resolution": "Use C-plus: keep hardcoded projection maps + CI test asserting maps==registry projection; same anti-drift guarantee, avoids cross-skill import-time coupling and per-spawn I/O",
      "evidence": "skill_advisor.py:170-171,3761-3775; routing-parity-deep-skills.vitest.ts:40-47"
    },
    {
      "question": "#6 ai-council folder vs name",
      "resolution": "Represent explicitly in registry as packetSkillName; under one-identity the folder/name mismatch is advisor-irrelevant (no nested graph-metadata.json, parseSkillMetadata never runs on it)",
      "evidence": "skill-graph-db.ts:601,644,656-660; deep-loop-workflows/ai-council/SKILL.md name=deep-ai-council"
    },
    {
      "question": "#4 fixture coverage",
      "resolution": "Add a registry-coverage fixture asserting projection-map parity (TS+Python) against the registry, plus context/improvement-lane routing-class assertions; current parity tests only cover research/review/ai-council",
      "evidence": "routing-parity-deep-skills.vitest.ts:52-197"
    }
  ],
  "refutations": [
    {
      "target": "runtime registry load adds disqualifying fragility vs hardcoded constants",
      "held": true,
      "note": "Mostly fails: advisor already does unguarded import-time json.load (skill_advisor.py:170-171). Survives only as a marginal NEW cross-skill import-time coupling -> argues for guarded load / C-plus, not naive derivation"
    },
    {
      "target": "registry can losslessly absorb DEEP_ROUTING_LEXICAL_PATTERNS scoring",
      "held": false,
      "note": "Floats round-trip and addition is order-safe, so numbers reproduce; but regex double-escaping in JSON is a silent-corruption risk against exact fixture thresholds (>=0.75/<0.40) for ZERO benefit since TS never scores. Weights must stay in code"
    },
    {
      "target": "A's 'derive both layers at runtime' is the right mechanism",
      "held": false,
      "note": "C-plus drift-guard gives the same anti-drift guarantee at lower risk; both still need the advisorRouting enrichment, so runtime-load buys nothing but hot-path I/O and coupling"
    }
  ],
  "standardize": [
    "sk-doc: document 'parent skill with nested sub-skills' pattern = one hub graph-metadata.json + verbatim packets that DROP per-mode metadata so the advisor sees one identity",
    "create: scaffold should emit hub graph-metadata.json + mode-registry.json with an explicit advisorRouting block (routingClass: lexical|metadata|command-bridge, legacyCanonicalId, advisorDefaultMode, packetSkillName)",
    "doctor: add a drift-guard check asserting hardcoded DEEP_ROUTING_MODE_BY_KEY (Python) and DEEP_MODE_BY_CANONICAL (TS) equal the registry projection",
    "benchmark/skill-benchmark: keep scoring weights co-located with the scorer; registry holds identity/topology only, never tuning"
  ],
  "risks": [
    "Enriching mode-registry.json for derivation without a guard test re-introduces a second source of truth and silent drift",
    "Moving weighted regex into JSON risks an escaping error that shifts a score under a fixture threshold with no upside",
    "Runtime/import derivation in skill_advisor.py couples advisor importability to a sibling workflow skill's file — a new failure mode on a per-prompt subprocess-spawn hot path",
    "context + 4 improvement lanes remain fixture-untested, so any registry refactor can regress them invisibly"
  ]
}
```
