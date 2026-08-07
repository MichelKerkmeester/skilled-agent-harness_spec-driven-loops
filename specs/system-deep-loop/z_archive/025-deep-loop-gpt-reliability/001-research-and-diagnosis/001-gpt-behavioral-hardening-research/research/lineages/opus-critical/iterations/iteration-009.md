# Iteration 9 — Adversarial self-check of this lineage's own findings

**Focus:** KQ-OPUS-9 — Apply the charter's own skepticism (§9.3) reflexively to opus-critical's findings, especially the headline overturn (KQ-OPUS-2), symmetric to the pressure applied to the prior rounds.

## Re-examined claims

### KQ-OPUS-2 (ai-council validator PASSES, not "guaranteed FAIL") — SURVIVES

Steel-manning sonnet-critical: could `record.mode` ever be `'ai-council'` at runtime? The record is built by `appendRoundCompletion` (`orchestrate-topic.cjs:306-320`) with literal `mode:'council'` — not from `executorConfig.route_fields` (which is `ai-council`). There is no code path that substitutes `route_fields.mode` into the `round_completed` record; the record's `mode` is a hardcoded string literal. So `record.mode === 'council'` is not configuration-dependent. The overturn holds. **One honest caveat:** I verified the emitter and the validator expectation statically; I did not execute the workflow end-to-end (no runnable GPT/OpenCode harness in this session), so "the validator returns null/PASS" is a code-trace conclusion, not an observed run. Given the literal string equality, the residual risk is very low, but I downgrade the phrasing from "the validator passes" to "the validator passes by static trace of literal-equal fields." This is still strictly more grounded than sonnet-critical's claim, which was a static trace of the *wrong* field value.

### KQ-OPUS-3 (naming false-negative; `deep-ai-council` is not an agent) — SURVIVES, one downgrade

`target_agent:'deep-ai-council'` names the packet, and no `.opencode/agents/deep-ai-council.md` exists (registry `agent` is `ai-council`). Solid. Downgrade: I called it a "false-negative that will mis-certify a future benchmark." That assumes the future benchmark reuses this exact route-proof path for ai-council. If phase 010 instead asserts route-proof against the registry directly (not against this validator block), the mis-certification would not occur. So the risk is "false-negative in the *current* validator," conditional on the benchmark reusing it — I add that conditional.

### KQ-OPUS-5 (minimal KQ4 fix = 2 rows + registry-resolved field) — SURVIVES

The claim rests on orchestrate already having the Deep Route field (`:207`) and agent paths (`:184-185`). Verified by direct read. No downgrade; it is a scope-reduction of an already-agreed fix, low risk.

### KQ-OPUS-6 (fail-closed possible-by-throw, host-undetermined) — SURVIVES

Type-level facts (`Promise<void>`, mutable `args`) are certain. The "host semantics undetermined" is itself the honest limit — I am not claiming throw definitely aborts; I am claiming the type cannot tell us. That is correctly hedged already.

### KQ-OPUS-7 (Phase-0 self-check is redundant → pure downside) — SURVIVES, one caveat

The redundancy argument assumes the self-check's only function is role-attestation and that routing is fully done by `deep.md`. Caveat: in a *direct* `/deep:research` invocation (no `@deep` router in the path), the command file itself is the entry point, and the Phase-0 gate is the only place that asserts "you are the general orchestrator, not a mis-dispatched leaf." So "provides no routing value" is true when reached via `deep.md`, but via direct command invocation it is the sole role-assertion. The fix (deterministic dispatch-context signal) is still correct and still strictly better than fuzzy self-classification — but "pure downside" overstates it for the direct-invocation path. Downgrade to "no *incremental* value beyond a deterministic check, and a halt risk for literal models."

## Net effect

No proposed fix changes. Two confidence phrasings downgraded (KQ-OPUS-2 "passes" → "passes by static trace"; KQ-OPUS-7 "pure downside" → "no incremental value + halt risk"). One conditional added (KQ-OPUS-3 mis-certification is conditional on benchmark reusing the current validator). The headline overturn survives.

## Ruled out this iteration

- Treating this lineage's static code-trace of the ai-council validator as equivalent to an observed workflow run — RULED OUT; it is a static trace (very low residual risk given literal string equality, but named).

## Status

`insight` — reflexive skepticism, symmetric to the pressure applied to prior rounds; findings survive with two phrasing downgrades.

newInfoRatio: 0.30 — novelty: self-adversarial pass; no new external evidence, but calibrated confidence on this lineage's own claims.
