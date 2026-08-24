# The flip is blocked by two states nothing can produce

## The lifecycle has six states; four have writers

`AuthorityFlipStates` declares six. `authority-registry.ts` writes exactly four:

| State | Written at | By what |
|---|---|---|
| `legacy_authoritative` | `authority-registry.ts:66` | the absent-record default |
| `new_authoritative_reversible` | `authority-registry.ts:308` | the flip compare-and-swap |
| `rollback_pending` | `authority-registry.ts:386` | rollback begin |
| `legacy_authoritative` | `authority-registry.ts:414` | rollback completion |
| `shadowing` | — | **nothing** |
| `cutover_ready` | — | **nothing** |

`cutover_ready` is required as `expectedState` by the compare-and-swap
(`authority-registry.ts:80`, `:103`), by the coordinator (`cutover-coordinator.ts:171`,
`:202`) and by the fleet driver (`enable-modes.cjs:151`). Every consumer of that state
exists. No producer does.

## The readiness verdict is computed and then discarded

`requestCutover` evaluates the full readiness judgment — parity certificate, migration
handoff, rollback assets, mode order — at `cutover-coordinator.ts:148`:

    const preflight = evaluateCutoverPreflight({ ... });
    if (preflight.verdict !== 'ready') return denied(preflight.reasonCode);

    const current = this.#registry.read(mode);
    ...
    if (current.state !== 'cutover_ready' || current.epoch !== expectedEpoch) {
      ... return denied('STALE_AUTHORITY_EPOCH');
    }

So a mode can be fully ready by every criterion the system defines and still be refused,
because `ready` is a return value that nothing persists into the record. The judgment and
the gate that consumes it are both built; the edge between them is not.

`evaluateCutoverPreflight` writes nothing — confirmed, it has no filesystem or registry
call — and its only non-test caller is this line.

## Confirmed by execution, not by reading

The fleet driver run against a scratch authority root:

    node runtime/scripts/enable-modes.cjs --authority-root <tmp> --state <tmp>

    exit 2
    {"ok":false,"phase":"enablement","code":"MODE_STEP_FAILED",
     "failure":{"mode":"deep-review","check":"flip",
       "reason":"Mode 'deep-review' is 'legacy_authoritative', but authority
                 compare-and-swap requires 'cutover_ready'"},
     "completedModes":[],
     "untouchedModes":["deep-ai-council","deep-improvement-common","agent-improvement",
                       "model-benchmark","skill-benchmark","deep-alignment"]}

No authority record was written. The real authority root still holds only its `README.md`.

The dry run exits 0 and plans all seven fleet modes, so the driver is otherwise sound: the
refusal is the state gate and nothing else.

## Why 30/30 green drills never caught this

The rollback drills seed the state they start from:

- `rollback-drills/sandbox-authority-store.ts:398` writes `state: 'cutover_ready'`
- `rollback-drills/rollback-drill-runner.ts:696` starts at `state: 'cutover_ready'`

The drills therefore begin exactly where the missing edge ends. They exercise everything
downstream of the gap — the flip, the rollback, the ledger, the fencing — and are
structurally incapable of reaching the gap itself. No perturbation of the real system can
turn them red on this defect, because they never traverse the transition that is missing.

That is the failure mode the build was told to guard against: a green that a deliberately
perturbed run cannot turn red is not evidence, it is an oracle that cannot fail. The drills
are sound for what they cover. What they cover simply does not include this.

## Scope

No phase's plan assigns a producer for either state:

- This phase consumes it. Its REQ-005 says the flip *is executed through* `requestCutover`,
  which presupposes a record already at `cutover_ready`.
- The fleet phase routes shared-machinery defects back to the pilot phase, which is closed.

Building the producer means deciding when a mode becomes eligible to flip, and persisting
that decision. The criterion is already specified — this phase's REQ-003 and REQ-004 say
parity green admits and divergence blocks — so the policy is not open. What is open is
whether writing new lifecycle machinery falls inside a build that was told not to re-plan.

That is an operator decision, and it gates this phase, the fleet phase, legacy-writer
retirement, the gate's verdict, and closeout.
