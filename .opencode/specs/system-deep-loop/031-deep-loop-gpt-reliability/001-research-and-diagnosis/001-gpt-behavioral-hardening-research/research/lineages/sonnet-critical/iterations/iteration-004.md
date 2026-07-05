# Iteration 4 — The "ai-council route-proof naming drift" is not registry-vs-YAML; it is a self-contradiction inside one YAML file that would fail for any model, GPT or Claude

**Focus:** KQ-CRIT-4 — is the KQ3/KQ8 "council route-proof naming drift" correctly diagnosed?

## What was read

- `.opencode/skills/deep-loop-workflows/mode-registry.json:60-80` (ai-council registry entry)
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:95-140` (full `step_build_session_state` + `step_orchestrate_session` blocks)
- `.opencode/agents/ai-council.md:1-10, 36-60` (mode/depth confirmation)

## Finding 9 — The bug is an emitter/validator self-contradiction inside `deep_ai-council_auto.yaml`, not a registry-vs-YAML mismatch

Both prior lineages describe this identically: "Registry says workflow mode `ai-council`... while council YAML currently expects `mode: council` and `target_agent: deep-ai-council`" [gpt-fast-high/research.md:61, citing deep_ai-council_auto.yaml:128-137; glm-max implies the same via mode-registry.json:65-79 vs the YAML]. Reading the cited YAML range directly shows something more specific:

```yaml
# step_build_session_state (line 117-118) — what the workflow ACTUALLY EMITS:
resolved_route_header: "Resolved route: mode=ai-council; target_agent=@ai-council; ..."
route_fields: { mode: ai-council, target_agent: "@ai-council", ... }

# step_orchestrate_session.post_dispatch_validate.route_proof (line 132-136) — what it VALIDATES AGAINST:
route_proof:
  mode: council
  target_agent: deep-ai-council
  agent_definition_loaded: true
  resolved_route: "Resolved route: mode=council target_agent=deep-ai-council"
```
[SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-118, 132-136]

The `route_fields` the workflow itself constructs and injects at :117-118 (`mode=ai-council`, `target_agent=@ai-council`) **already correctly match** `mode-registry.json`'s `workflowMode: "ai-council"` / `agent: "ai-council"` [mode-registry.json:66,71]. There is no registry-vs-YAML drift at the emission point. The actual bug is 15 lines further down, in the SAME step's own `post_dispatch_validate.route_proof` assertion block, which checks for **different literal values** (`mode: council`, `target_agent: deep-ai-council`) that the workflow never emits and that do not match the registry either. **This is the workflow's validator disagreeing with the workflow's own emitter, inside one file, not a two-file drift.**

## Finding 10 — Consequence: this validator would deterministically fail for every executor, including Claude — a critical correction for benchmark design

Because `route_proof.mode`/`target_agent` (:133-134) can never equal what `route_fields` (:118) actually produces, `post_dispatch_validate` for ai-council would fail this specific check **regardless of which model or executor runs the council workflow** — GPT, Claude, or anything else. This has a direct, important consequence for KQ1/KQ6: if the planned GPT-vs-Claude benchmark (both lineages' KQ6 answer) runs the ai-council mode as-is, **both** legs would show a route-proof failure on this field, which could be misread as "GPT fails ai-council route-proof" (or even "both models fail," muddying the comparison) when the actual cause is a pre-existing validator bug unrelated to either model's behavior. **This must be fixed before the KQ1/KQ6 benchmark's ai-council leg is run, or that leg's results are uninterpretable.** Neither prior lineage flagged this benchmark-validity risk; both treated the naming-drift fix as a KQ3/KQ8 hygiene item, not as a precondition for KQ1/KQ6 result validity.

## Finding 11 — This also means glm-max/gpt-fast-high citing "naming drift" language they inherited from the packet's own framing without reading the emitter block is a small instance of exactly the pattern this round is charged with catching

Neither prior lineage's citation range (:128-137 for gpt-fast-high; the registry lines for glm-max) actually distinguishes the emitter (:117-118) from the validator (:132-136) — both cite roughly the validator block alone and describe the mismatch as being with the registry, when the more precise and more useful diagnosis (the emitter and validator disagree with each other, inside the same file, and the emitter is the one that's already correct) was available in the same citation range they already had open. This is not evidence of GPT-self-protective softening specifically (glm-max, non-GPT, made the same simplification) — it is evidence that **both lineages under-read a citation they already had**, worth noting because the charter's self-assessment-bias-correction framing should not be read as "GPT is uniquely sloppy" — sloppiness/under-reading here was shared by the non-GPT lineage too, and the correct fix is narrower and cheaper (edit `:132-136` to mirror `:117-118`) than either lineage's framing suggested.

## Ruled out this iteration

- The "registry-vs-YAML naming drift" diagnosis as the most precise available framing — RULED OUT; replaced with "workflow's own validator disagrees with its own emitter."
- Assuming the naming-drift fix is council-hygiene-only, independent of the KQ1/KQ6 benchmark plan — RULED OUT; it is a precondition for that benchmark's ai-council leg producing interpretable results.

## Status

`insight`.

newInfoRatio: 0.65 — novelty: reads the emitter block (:117-118) that neither prior lineage's citation distinguished from the validator block (:132-136), reframes the fix as smaller and more surgical, and connects it forward as a benchmark-validity precondition rather than a standalone hygiene item.
