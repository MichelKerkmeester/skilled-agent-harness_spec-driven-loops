# Generalization Probe Results

Compiled-command-contract flip generalization beyond review/research, plus the
leaf-reliability check's effect. Leg: `gpt-fast-med`, **N=2 per cell/arm** (the
first sample as a focused set, the second as a completion run). Lever: per-command
`command-injection-rollout.json` (`fix` = compiled contract prepended; `fallback`
= legacy body). Fixtures restored between runs; lever reset to `fallback` after.

## Method notes

- **Natural-invocation confound.** CXB-004 and ACB-005 are `natural` cells (no
  `--command`), so the render lever only bites when the model self-routes to the
  slash command. RVB-REPROBE is `command`-kind, so its lever bites directly.
- **Cell expectation.** CXB-004 is a **should-halt** cell
  (`expected_interaction: question_halt`): an autonomous proceed scores as
  `setup_misbind` even when delegation works.
- **Sample-2 environment caveat.** The second samples ran while a concurrent
  workstream was actively deprecating the standalone deep-context surface
  (command stubbed, mode skill tree removed in the working tree). This
  contaminates s2 context comparability and moots context promotion regardless.

## Runs (N=2)

### Council — ACB-005 (autonomous-expecting, seat_artifacts — the novel case)

| Arm | Sample 1 | Sample 2 |
|---|---|---|
| **fix** | `pass` (D1=2 D2=2 D3=2 D4=2 — seats converged in-CLI) | `stuck_no_progress` (D1=0 D3=0 D4=0) |
| fallback | `stuck_no_progress` | `stuck_no_progress` |

**Read:** fix 1/2 vs fallback 0/2. The only pass in four council runs was under
fix — a directional signal — but fix does **not** reliably clear the council
stall: 3 of 4 runs reproduce the silent seat-convergence stall the 033 benchmark
documented. The fix-arm ~50% rate mirrors the review/research residual —
completion nondeterminism inside the work itself (here, in-CLI seat
convergence), an axis the delegation contract does not govern.

### Context — CXB-004 (should-halt cell)

| Arm | Sample 1 | Sample 2 |
|---|---|---|
| fix | `setup_misbind` (dispatched `deep-context` — mechanism bit) | `pass` (question-halt honored) |
| fallback | `setup_misbind` | `pass` |

**Read:** the arms moved in lockstep in both samples — **lever-null on this
natural cell, confirmed at N=2**. The outcome variance (misbind→halt) is model
nondeterminism, not the contract. The pilot's delegation trace (fix → real
`task` dispatch of `deep-context`) remains the mechanism-level evidence that the
compiled contract reaches context. Given the concurrent deprecation of the
standalone surface, no further context probes are warranted.

### Review re-probe — RVB-REPROBE (command-kind, route-proof) — leaf-reliability lift

| Mode | Classification | D1..D5 | Note |
|---|---|---|---|
| fix | `missing_artifact` | 2/2/1/1/· | Leaf dispatched (1 task event) but the iteration artifact + route-proof record came back incomplete. |

**Read:** an honest negative on the *lift*. Baseline RVB-007 at gpt-fast-med was
`refused` (0 task events); under fix the leaf IS dispatched (progress), but the
output is incomplete. The mechanical `verify-iteration` gate detects exactly this
failure (`route_proof_missing`), but its `redispatch_once` is model-followed in
the single-executor loop — it did not mechanically rescue this run.

## Verdict (N=2)

- **Council: NOT confirmed.** Directional signal for fix (the only observed pass),
  unreliable at N=2. The dominant failure in both arms is the pre-existing council
  seat-convergence stall — a work-completion axis, not a delegation axis.
- **Context: method-moot.** Lever-null at N=2 on the natural cell; mechanism-level
  dispatch evidence exists (pilot trace); the standalone surface is being
  deprecated concurrently.
- **The proven flips remain review/research** (rounds 1–3 in
  `../001-contract-compiler-design/early-signal-results.md`).
- **Leaf-reliability lift: honest negative** — detection, not rescue, in the
  single-executor loop.
- **Correction note:** the interim N=1 report called the council flip "decisive";
  the N=2 completion revised it. Recorded deliberately — this is why the N≥2 gate
  exists.

## Recommendations

1. **Promote review/research to `fix`** — validated across rounds 1–3.
2. **HOLD council at `fallback`.** Before promotion, fix the seat-convergence
   stall (stepwise per-seat persistence/liveness per the design's council items),
   then re-probe the fix arm at N≥3 to bound the pass rate.
3. **Context: defer to the deprecation workstream** (@context / research / review /
   plan absorb the use case). Reconcile the 036 contract surface with that
   deprecation: the compiler/renderer/drift-guard `deep/context` entries and the
   compiled context contract reference sources the deprecation deletes — they must
   be retired together or the drift guard will hard-fail on missing sources.
4. **Runner-owned mechanical re-dispatch** (fan-out granularity) and the
   **should-halt carve-out** for autonomous-precedence stand as before.
