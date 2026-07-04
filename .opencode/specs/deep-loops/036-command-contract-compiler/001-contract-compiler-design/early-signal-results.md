# P1+P4 Early-Signal Results

> Live-model probe run after building P1 (compiler) + P4 (rollout live consumer). Goal: does injecting the compiled contract flip GPT behavior on the 035 T002 delegation cells? Executor: gpt-fast-med, N=1 per cell/mode. This is a directional early signal, not a full acceptance round.

## What was run

RVB-007 (review) and RSB-007 (research), each in `fallback` (no contract) and `fix` (contract injected), on gpt-fast-med. **RSB-005 was excluded**: it is an E4 (orchestrate-routed, natural-language) cell, so it never dispatches via `opencode run --command` and the command-scoped bang-shell prelude never fires — the current contract mechanism cannot reach it. Orchestrate-entry injection is a separate, later mechanism.

## Integration finding (mechanism)

The compiled contract injects correctly, but **only via the rollout JSON**, not the env override. `SPECKIT_COMMAND_INJECTION_MODE` does not cross OpenCode's `--command` bang-shell subprocess boundary (the interpolation subprocess does not inherit it). `command-injection-rollout.json` is the working lever — the renderer reads that file directly via `resolveInjectionMode`. Proven both ways (JSON flip → renderer emits the contract header with zero env flags). Any T002 run must drive `fix` through the rollout JSON.

## Results (terminal bucket, all `missing_artifact`; the paths differ)

| Cell | Fallback (no contract) | Fix (contract injected) |
|------|------------------------|-------------------------|
| RVB-007 | setup-halt, ~38s, 0 tool calls ("target/mode not specified in your message") | **engaged + dispatched** a `task`, ~124s — got *past* the setup-halt, did NOT absorb, but mis-executed (dispatched "a read-only review pass over the pasted command contract", verdict FAIL) |
| RSB-007 | setup-halt, ~34s, 0 tool calls ("setup blocked … research_topic, spec_folder") | setup-halt, ~28s (framed as the contract's "STATUS: ☐ BLOCKED"), no outcome change |

## Findings

1. **The 033 baseline is stale.** 033 recorded RVB-007-med / RSB-007-med as `role_absorption` (ran the loop inline, faked route-proofs). The current gpt-fast-med baseline is a **setup-halt** — the model does not recognize the `:auto` + bound flags as satisfied setup and halts asking for the inputs, with OR without the contract. gpt-fast-med behavior drifted since 033. **T002 must be re-baselined before any pass/fail is claimed.**
2. **No clean flip to a pass.** All four runs ended `missing_artifact`. The contract did not produce autonomous completion on either cell at med.
3. **The contract has a partial, real effect — but only on review.** RVB-007 flipped from "won't start (setup-halt)" to "recognizes autonomous execution and dispatches, without absorbing" — the absorption-abort + delegation rules landed. But execution was degenerate: it dispatched a one-shot "review the contract" pass instead of running the loop over the target. RSB-007 was unchanged (setup-halt in both modes).
4. **The dominant blocker is the setup-halt**, present in fallback for both cells — the model does not treat `:auto` + a bound target as satisfied setup. The contract's autonomous-precedence overcomes it sometimes (RVB) but not reliably (RSB).

## Verdict

**Mechanism proven; behavior flip NOT achieved at med (N=1).** The injection pipeline works end-to-end via the rollout JSON. The contract measurably changes review behavior (past-the-halt, no absorption) but does not yet drive a clean autonomous, correctly-delegated completion; on research it has no effect. The result is dominated by a setup-halt that the current contract does not reliably resolve.

## Recommendation

Do **not** proceed to the full retrofit (P5/P6/P7) on this contract as-is. Before that:
1. **Re-baseline T002** against current gpt-fast behavior (the 033 absorption baseline is stale).
2. **Strengthen the contract's autonomous-precedence** so `:auto` + a bound target unambiguously satisfies setup and the model proceeds (kills the setup-halt) — this is the highest-leverage fix and directly targets the dominant failure.
3. **Fix the execution guidance** so a review/research dispatch runs the loop over the target, not a one-shot review of the contract text (RVB-007's degenerate dispatch).
4. **Test the "minimum legacy body" variant** — `fix` currently emits contract + the *full* legacy body, so the model reads two overlapping instruction sets; the design's minimum-legacy optimization may reduce the confusion.
5. **Widen the sample** — N≥3 + the gpt-fast-high leg — before drawing firm conclusions; N=1 med is noisy, and RVB-007's partial-positive could be variance.

---

## Refinement round 1: front-loaded autonomous-execution directive

Added an imperative `## autonomousExecutionDirective` as the FIRST block of the compiled contract (addressed to the executor, not "the classifier"): under `:auto` + a bound spec_folder/target, setup is resolved — do not emit the A/B/C/D setup question, do not halt for the CLAUDE.md Gate-3 gate, dispatch the leaf and run the loop over the bound target (not review this contract). Committed; Sonnet-verified (correct for both commands, front-loaded, 6/6 tests, byte-identical fallback intact).

### Re-probe (RVB-007 + RSB-007 fix, gpt-fast-med, N=1)

| Cell | Original contract (fix) | Refined directive (fix) |
|------|-------------------------|-------------------------|
| RVB-007 | dispatched but degenerate | dispatched (`skill, task`), ~115s — no bare halt |
| RSB-007 | **setup-halt, 0 tools** | **dispatched (`skill, skill, task`), ~86s** — halt killed |

**The directive works: it killed the bare setup-halt.** RSB-007, which setup-halted with zero tool calls under the original contract, now routes and dispatches. Both cells proceed instead of asking the A/B/C/D question.

### But no clean flip yet — a distinct, newly-isolated blocker (renderer, not contract)

Both cells still end `missing_artifact`. RSB-007's own words: *"deep-research was dispatched. Result: FAIL_FAST. Missing required setup values: research_topic."* The topic IS in the invocation message, but the model reports it missing. Root cause, confirmed directly: **the renderer discards the user invocation message.** `render-command-contract.cjs` captures `$ARGUMENTS` only for the manifest hash and never echoes it to stdout (`render --command deep/review -- 'MARKER…'` → MARKER absent from output). So the model never sees the bound target/topic/flags. The working precedent — `/memory:search:17` — *echoes* its args ("bind your control flow to these values… do not ask the startup question"); this renderer does not. This is a **regression introduced by the P4 restructure** (bootstrap + prelude), which the byte-identical-body fallback check did not catch because the loss is in message-passing, not body content.

### Verdict (round 1)

The contract's autonomous-precedence directive is **effective at killing the setup-halt** — the goal's primary objective. The remaining barrier to a clean flip is a **renderer** issue: the invocation message must be surfaced to the model (echo `$ARGUMENTS`, like `/memory:search`). That fix necessarily changes the current strict byte-identical-fallback invariant (the args echo is a dynamic prefix), so it is a **design decision** deferred for approval rather than made silently.

### Next (recommended)

Fix the renderer to surface the invocation message to the model in both modes (mirroring `/memory:search`'s ARGS_PRESENT/QUERY echo + "bind setup from these" instruction), and evolve the fallback invariant to "static command body byte-identical, dynamic invocation message surfaced". Then re-probe — this is the likely last blocker to an actual completion/flip.
