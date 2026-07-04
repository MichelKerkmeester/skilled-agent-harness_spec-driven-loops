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

---

## Refinement round 2: surface the invocation message + the contract flip

Fixed the renderer to prepend an `ARGS_PRESENT` + raw MESSAGE + "bind setup from these; do NOT ask the setup question" block in both modes (the static body stays the byte-identical invariant; the message prefix is additive — `--compare` still verifies body byte-identity). Committed; Sonnet-verified (message surfaced, body invariant not weakened, 11/11 tests).

### Re-probe (RVB-007 + RSB-007, gpt-fast-med, message surfaced)

| Cell | fallback (no contract) | fix (contract) |
|------|------------------------|-----------------|
| RVB-007 | **`role_absorption`** — ran the review loop INLINE (26 read/bash/apply_patch, no `task`), full artifacts, natural terminal | **dispatch every run (3/3)**: 2× `partial` (clean `task` dispatch, artifacts), 1× `route_mismatch` (dispatched `task`×2 but mixed heavy inline) |
| RSB-007 | `route_mismatch` — messy dispatch + heavy inline | **`partial`** — *"Dispatching the bound /deep:research:auto workflow"*, `task`×2, real research result |

### Findings

1. **The message fix root-caused and cured the setup-halt.** With the invocation message surfaced, both cells go from a bare setup-halt to a full run to natural terminal (RVB-007 fallback produced the complete review packet). The setup-halt was the restructure dropping the message, not a gpt gate. It also cleanly re-baselines the cells to their true gpt-fast failure — `role_absorption` (review) / `route_mismatch` (research).
2. **The compiled contract flips the delegation failure into real delegation.** The single controlled difference between the columns is the injected contract. Review: fallback absorbs (zero `task`); fix dispatches on all 3 runs. Research: fallback route-mismatches; fix dispatches cleanly. The `absorptionAbort` + "dispatch the leaf, don't run it yourself" directive lands.
3. **Outcome is `partial`, not a full `pass`, and gpt-fast stays nondeterministic.** 3/4 fix runs reach `partial` (real dispatch + artifacts, a residual dimension gap — likely route-proof/receipt); 1/4 is `route_mismatch` (dispatched but mixed inline). This matches the 033 finding that gpt routes inconsistently — the contract raises the floor but does not make gpt-fast deterministic.

### Verdict (round 2)

**The compiled-contract approach is validated on live cells.** Two fixes compound: surfacing the invocation message unblocks completion, and the compiled contract converts gpt-fast's delegation failures (role_absorption, route_mismatch) into proper `task` delegation — consistently (4/4 fix runs dispatch) though not yet to a uniform clean pass. This is the core 035/036 thesis demonstrated end-to-end at the real command surface.

### Recommendation

**Proceed to the retrofit (P7) — the mechanism is proven.** Carry these as iteration targets, not blockers: (a) close the `partial`→`pass` dimension gap (inspect D3 route-proof/receipt scoring under the compiled contract); (b) the 1/4 `route_mismatch` shows gpt still sometimes mixes inline work with dispatch — a sharper "dispatch ONLY, do not read/edit the target yourself" line in the contract may tighten it; (c) widen to the gpt-fast-high leg + more cells during the retrofit's acceptance pass. The two committed fixes (front-loaded directive + surfaced message) are the load-bearing wins.

---

## Refinement round 3: DISPATCH-ONLY + ROUTE-PROOF — first clean passes

Diagnosed the round-2 residual precisely: every fix run scored `D3=1` (delegation) because the dispatched leaf wrote iteration state records WITHOUT the route-proof fields, so the benchmark's `collectRouteProof` (which reads `mode`/`target_agent`/`agent_definition_loaded`/`resolved_route` from the fixture JSONL) found none. Added two front-loaded, command-specific contract rules: **DISPATCH ONLY** (dispatch the leaf; do not read/edit/patch/run the loop yourself — inline work is a route violation) and **ROUTE PROOF** (dispatch through the prompt pack so each iteration record carries the four route-proof fields). Sonnet-verified the demanded fields exactly match the scorer + the prompt-pack schema. Committed; byte-identical body invariant intact; 6/6 tests.

### Re-probe (fix mode, gpt-fast-med, N=3 each)

| Cell | r1 | r2 | r3 | pass rate |
|------|----|----|----|-----------|
| RVB-007 | `pass` (D3=2,D4=2) | `missing_artifact` (D3=1,D4=1) | `pass` (D3=2,D4=2) | **2/3** |
| RSB-007 | `pass` (D3=2,D4=2) | `missing_artifact` (D3=1,D4=1) | `missing_artifact` (D3=1,D4=1) | **1/3** |

### Findings

1. **DISPATCH-ONLY fully eliminated the route_mismatch / inline tail.** `inline=0` on every one of the 6 runs (zero read/bash/apply_patch on the target) — the executor now delegates cleanly and never mixes its own work with the dispatch. The round-2 `route_mismatch` is gone.
2. **ROUTE-PROOF enabled the first-ever clean passes.** 3 of 6 runs reached `pass` with `D3=2`, where the pre-tighten contract had ZERO passes (was capped at `partial`/`D3=1`). When the leaf completes, the iteration record now carries the route-proof fields the scorer needs.
3. **The residual relocated to the leaf, not the contract.** When a run isn't a pass it is `missing_artifact` with coupled `D3=1 + D4=1`: the executor dispatched cleanly, but the dispatched leaf (itself gpt-fast) produced an INCOMPLETE iteration (no artifacts → no route-proof fields). The nondeterminism moved from the *executor* (which the contract fixed) to the *leaf-completion* (which the contract cannot control).

### Verdict (round 3)

**The tightening succeeded at both of its goals** — it removed the inline/route_mismatch behavior entirely and raised the ceiling from `partial` to a clean `pass` (~50% overall pass rate, up from 0%). The remaining variance is **leaf-completion nondeterminism**: whether the dispatched gpt-fast leaf finishes a full iteration. That is a separate axis from the compiled contract — the contract governs the *executor's* delegation (now clean and route-proofed); it cannot make the *leaf* deterministic.

### Recommendation

**Proceed to the P7 retrofit** — the compiled-contract mechanism is validated and tightened to produce passes. Carry the leaf-completion reliability as a distinct, non-contract concern for the acceptance pass: raise the leaf pass rate via a more capable leaf model, a leaf-level completion watchdog/retry, or the leaf's own prompt-pack contract — not via more executor-contract text. The four committed 036 fixes — the compiler + renderer (P1/P4), the front-loaded autonomous directive, the surfaced invocation message, and the DISPATCH-ONLY + ROUTE-PROOF rules — are the validated foundation to roll out.

---

## P7 retrofit + generalization verdict (context, council, leaf-reliability)

The retrofit extended the validated mechanism to the remaining modes and added the two reliability tracks. Full scored tables live in `../003-generalization-probes/results.md`; this is the verdict recorded against the P7 gate.

### What was built (all committed; Sonnet-verified per piece)

- **context + ai-council compiled contracts** — compiler + renderer extended to `deep/context` and `deep/ai-council`, byte-identical fallback (comparator green). Council is a seat-mode: its directive convenes ≥3 in-CLI seats with seat-artifact proof rather than leaf-dispatch. Its authority chain enumerates the full `references/` tree including the seat-diversity/anti-patterns/command-wiring hubs.
- **drift guard (P2)** — CI-runnable checker over all four compiled contracts: stale source digest, stale compiled body, unresolved markers, tool-allowlist overflow, and the enumerated-source gap. The authority derivation is data-driven (no per-mode hardcode, no over-flag — Sonnet-confirmed). `--accept-compiled-drift` for an intentional regenerate.
- **leaf-reliability check** — `verify-iteration.cjs`, a mechanical gate wired into the review/research/context `post_dispatch_validate` step: verifies the three required iteration artifacts + the route-proof record, exits with one machine reason, and `on_failure` re-dispatches the iteration once. (Sonnet caught, and I fixed, an append-only `find`→`findLast` false-negative.)

### Generalization probes (gpt-fast-med, fix vs fallback, N=1 focused set)

| Cell / mode | fix | fallback | Read |
|---|---|---|---|
| **ACB-005 council** | `pass` (D3=2, seats converged) | `stuck_no_progress` (D3=0) | Flip generalizes decisively to the seat-mode |
| **CXB-004 context** | `setup_misbind` (dispatched `deep-context`) | `setup_misbind` | Mechanism bites; the should-halt cell confounds the score |
| **RVB-REPROBE review** | `missing_artifact` (D3=1) | — | Leaf-reliability lift NOT demonstrated |

### Verdict

- **Does the flip generalize beyond review/research?** **Council: yes, decisively** (silent stall → converged seats). **Context: mechanism yes** — under fix GPT autonomously dispatches the `deep-context` leaf — but CXB-004 is a should-halt cell, so autonomous-precedence over-rides a legitimately-ambiguous ask and both modes score `setup_misbind`; the delegation trace proves the mechanism works even though classification cannot separate the modes.
- **Did the leaf-reliability check lift the pass rate?** **No — honest negative.** The review re-probe under fix is `missing_artifact` (D3=1): the leaf is now dispatched (progress over the `refused`/0-event baseline) but its iteration artifact + route-proof came back incomplete. The mechanical gate DETECTS this exact failure (`route_proof_missing`), but its re-dispatch is model-followed in the single-executor loop, so it did not mechanically rescue the run.

### Recommendation

- **Promotion readiness:** council and the task_dispatch modes flip cleanly under the compiled contract — promoting them to `fix` by default is justified. The leaf-reliability gate should ship (it converts a silent leaf failure into a detectable one) but is best-effort until a runner owns the retry.
- **Follow-ups (out of this goal — propose as a new phase):**
  1. **should-halt carve-out** for autonomous-precedence (context CXB-004 over-trigger).
  2. **runner-owned mechanical re-dispatch** in `fanout-run.cjs` — the single-executor loop is model-driven, so `redispatch_once` cannot be mechanically enforced there.
  3. The **14-agent pointer rewrite + AGENTS.md thinning** remains explicitly deferred.
- **Adjacent, shipped this session:** the now-dead **deep-loop primary router** agent was deprecated (full delete + orchestrate reword — phase 002) now that the compiled contracts carry routing directly.
