# Iteration 2 — OVERTURN: the ai-council route-proof is NOT a "guaranteed FAIL"

**Focus:** KQ-OPUS-2 — Re-verify `sonnet-critical` §5's single most confident claim ("code-traced… guaranteed mismatch… the benchmark's ai-council leg is currently uninterpretable") against the record-emitter code, not just the validator function.

## What was read (this iteration)

- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:112-140` — `step_build_session_state` emitter block + `step_orchestrate_session.post_dispatch_validate.route_proof`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:24-33, 223-320` — the constant route header + the actual `round_completed` record emission
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-666` — `validateRouteProofRecord`

## What sonnet-critical claimed

> "Tracing the actual comparator function, `validateRouteProofRecord`… confirms this is not a probable mismatch but a guaranteed one: `record.mode !== routeProof.mode` evaluates `'ai-council' !== 'council'` → `true`, for any executor. **This means the planned KQ1/KQ6 GPT-vs-Claude benchmark's ai-council leg is currently uninterpretable** — it would record a route-proof FAIL for both models regardless of behavior." [sonnet-critical/research.md:49-51]

The load-bearing premise is `record.mode === 'ai-council'`. sonnet-critical inferred that from the emitter *header* (`deep_ai-council_auto.yaml:117-118`, which says `mode: ai-council`), but never read what the JSONL **record** actually carries.

## Finding 1 — The record emitter writes `mode: 'council'`, which MATCHES the validator

`validateRouteProofRecord` compares the **`round_completed` JSONL record** against the `route_proof` expectation. The record is produced by `orchestrate-topic.cjs`, not by the emitter header. The actual emission:

```js
// orchestrate-topic.cjs:306-320  (appendRoundCompletion → type:'round_completed')
mode: 'council',
target_agent: 'deep-ai-council',
agent_definition_loaded: true,
resolved_route: 'Resolved route: mode=council target_agent=deep-ai-council',
```

[SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:310-313]

The validator's expectation:

```yaml
# deep_ai-council_auto.yaml:132-136
route_proof:
  mode: council
  target_agent: deep-ai-council
  agent_definition_loaded: true
  resolved_route: "Resolved route: mode=council target_agent=deep-ai-council"
```

[SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:132-136]

Field-by-field against `validateRouteProofRecord` (`post-dispatch-validate.ts:636-663`):
- `record.mode` = `'council'` vs `routeProof.mode` = `'council'` → `'council' !== 'council'` is **false** → no mismatch.
- `record.target_agent` = `'deep-ai-council'` vs expected `'deep-ai-council'` → match.
- `record.agent_definition_loaded` = `true` → passes the `!== true` guard.
- `record.resolved_route` = `'Resolved route: mode=council target_agent=deep-ai-council'` vs identical expectation → match.

All four checks pass; the function returns `null` (its success value, `:665`). **The validator PASSES.** sonnet-critical's `'ai-council' !== 'council'` premise is wrong: `record.mode` is `'council'`.

## Finding 2 — This is the exact error the critical round exists to catch, committed by the critical lineage

sonnet-critical stopped at the validator function + YAML config and *inferred* the record's value from the header rather than reading the emitter script (`orchestrate-topic.cjs`). Its own §8 citation audit lists `deep_ai-council_auto.yaml:117-118,132-136` and `post-dispatch-validate.ts:619-665` — but NOT `orchestrate-topic.cjs`'s record emission. So the "code-traced" claim traced two of the three relevant sites and assumed the third. This is precisely the "trust the description of what the code does, not the code" failure mode the round is meant to correct — here surfacing inside the correction round itself. The lesson generalizes (charter §9.3 "shared blind spot"): a confident "guaranteed" verdict from a partial trace is not more reliable than the hedge it replaced.

## Ruled out this iteration

- Treating `sonnet-critical` §5's "guaranteed FAIL / benchmark leg uninterpretable" as a settled correction — RULED OUT and OVERTURNED. The record emitter and the validator were written to agree (`mode:'council'` on both sides); the validator passes.

## Status

`insight` — a materially different reading of the same subsystem via one file (`orchestrate-topic.cjs`) the prior critical lineage did not open.

newInfoRatio: 0.92 — novelty: overturns the prior critical round's single most confident, most-cited finding by reading the emitter the round assumed; changes the disposition of that finding from OVERTURN(prior)→CONFIRMED to OVERTURN(prior-critical). Highest-novelty iteration of this lineage.
