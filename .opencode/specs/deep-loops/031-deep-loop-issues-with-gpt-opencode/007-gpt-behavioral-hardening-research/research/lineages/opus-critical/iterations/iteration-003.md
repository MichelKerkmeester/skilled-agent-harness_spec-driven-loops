# Iteration 3 — What the ai-council bug actually is: a naming-integrity false-negative, live and uncommitted

**Focus:** KQ-OPUS-3 — If the validator passes (iter 2), is there any real defect here, and if so what is its correct characterization and fix?

## What was read (this iteration)

- `.opencode/skills/deep-loop-workflows/mode-registry.json:64-80` — the ai-council registry entry
- `.opencode/agents/deep.md:38-46` — the deep-router route table
- `orchestrate-topic.cjs:24-33` (header constant) vs `:310-313` (record) — re-cross-referenced
- `git diff HEAD -- orchestrate-topic.cjs` — provenance of the two blocks
- `verification-smoke.md:122` — the phase-005 ai-council row

## Finding 1 — There IS a defect, but it is a false-negative, not a validator failure

The record and the validator agree with **each other** (`mode:'council'`, `target_agent:'deep-ai-council'`), but both disagree with the three authoritative sources for the same route:

| Source | mode | target agent |
|---|---|---|
| `mode-registry.json:66,71` (source of truth) | `ai-council` (`workflowMode`) | `ai-council` (`agent`) |
| `deep.md:43` route table | `ai-council` | `@ai-council` |
| council's own emitted header — `orchestrate-topic.cjs:25-32`, `deep_ai-council_auto.yaml:116-118` | `ai-council` | `@ai-council` |
| **record + validator** — `orchestrate-topic.cjs:310-313`, `deep_ai-council_auto.yaml:132-136` | **`council`** | **`deep-ai-council`** |

[SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66,71; .opencode/agents/deep.md:43; .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:25-32,310-313]

Two distinct wrongnesses in the record/validator pair:
1. `mode:'council'` is the `runtimeLoopType` (`mode-registry.json:67`), not the `workflowMode` (`ai-council`). Route-proof elsewhere echoes `workflowMode` (cf. `deep.md:72` `mode=<workflowMode>`).
2. `target_agent:'deep-ai-council'` is the **packet** name (`mode-registry.json:69` `"packet": "deep-ai-council"`), **not an agent**. There is no agent file `deep-ai-council.md`; the agent is `ai-council` (`mode-registry.json:71`, file `.opencode/agents/ai-council.md`).

So the route-proof validator returns green on a `round_completed` record whose `target_agent` names a **non-existent agent**. That is a false-negative — schema-valid, self-consistent, and semantically wrong — the exact class the predecessor research's §5 flagged and that KQ5's enforcement plugin (by both prior lineages' own admission) cannot catch. The ai-council leg is therefore not "uninterpretable" (iter 2); it is worse in a subtler way: it will report PASS while attesting to a target that doesn't exist, giving false confidence in a future GPT-vs-Claude benchmark.

## Finding 2 — The contradiction is live and uncommitted (changes fix scope)

`git diff HEAD -- orchestrate-topic.cjs` shows BOTH the `mode:'ai-council'`/`@ai-council` header block (`:25-32`) AND the `mode:'council'`/`deep-ai-council` record block (`:310-313`) as `+` additions in the working tree (part of the in-flight "155 deep-loop parent-skill alignment" work). So this is not old committed drift — it was introduced by current alignment work and is on disk now. Implication for the fix: reconcile toward the registry in ONE change touching BOTH the record emitter (`orchestrate-topic.cjs:310-313`) and the validator expectation (`deep_ai-council_auto.yaml:132-136`) together — set `mode: ai-council`, `target_agent: ai-council` (or `@ai-council`, matching whatever convention route-proof uses elsewhere), `resolved_route` to match the header. Changing only one side would convert a passing-but-wrong state into a failing state.

## Finding 3 — Empirical corroboration: phase 005 never emitted the record

`verification-smoke.md:122` — the ai-council smoke produced "no `round_completed` route-proof record because dispatch stopped at `phase_loop.step_orchestrate_session.pre_dispatch`." So in the one real GPT attempt, the validator never ran on an ai-council record at all (blocked upstream by `OPENCODE_PID`). There is therefore no empirical route-proof FAIL for ai-council either — a second, independent reason sonnet-critical's "would record a FAIL for both models" is unsupported.

## Ruled out this iteration

- Treating the ai-council fix as cosmetic / zero-value now that the validator passes (iter 2) — RULED OUT. It is a real false-negative (green on a non-existent target agent) that will mis-certify a future benchmark; worth fixing, but for integrity reasons, not to unblock a "FAIL."
- Treating a one-sided value change (validator OR emitter) as sufficient — RULED OUT. Both sides currently agree with each other; a one-sided edit creates a real mismatch.

## Status

`insight` — three cross-referenced sources (registry, deep.md, git diff) reframe the defect and its fix scope.

newInfoRatio: 0.85 — novelty: re-characterizes the ai-council defect from "guaranteed FAIL" to "false-negative on a non-existent target agent," establishes it as a live uncommitted state, and corrects the fix to a two-sided registry-aligned edit.
