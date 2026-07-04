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
