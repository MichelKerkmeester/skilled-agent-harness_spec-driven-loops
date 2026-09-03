---
title: "Decision package"
trigger_phrases: []
---
# Decision package

Three decisions block the remaining work. The analysis behind each is distributed across phase
scratch files; this collects it so a decision can be made without reassembling it. Each entry
states what was measured, the options, and what each option costs.

## 1. The forward authority transition

**Measured.** The cutover coordinator denies unless the durable record already reads
`cutover_ready`, and its compare-and-swap pins the same expectation. Outside its declaration in the
state union, that value appears only in those two consumer checks. No production path writes it as
a record state. The precondition is unreachable by construction, not failing on inputs.

**Why it stayed invisible.** Drills seed the state directly in a sandbox rather than reaching it
through a transition. The parity harnesses never read the registry; their authority snapshot is a
constant. Neither surface could observe a missing producer.

**Options.**

- *Build the promotion path.* Someone specifies and implements the edge from
  `legacy_authoritative` to `cutover_ready`, including what evidence admits it and who may request
  it. This is new design on the irreversible edge, with no rollback window. It is the only option
  that ends with modes enabled.
- *Amend the phases to stop at shadow.* Keep the gateway, the projections and the parity gate as
  shipped, and remove the enablement claims from the phase requirements. Nothing irreversible
  happens. The packet closes honestly at a smaller scope.
- *Leave it open.* The current state. Documented, gated, and not pretending otherwise.

**Note for whoever builds it.** The parity gate was tested and does block: perturbing a pass to
report an authority mutation turned 103 green into 30 failures reading
`expected 'blocked' to be 'green'`. That safety margin is real, which matters if the promotion path
gets built.

### Re-derived exhaustively, and it narrows to one edge

The claim above was re-tested against every occurrence of the state in the runtime, not just the two
consumer checks, because it gates five items across three phases and deserves better than a partial
search.

The production registry writes exactly four record states:

| written state | written from |
| ------------- | ------------ |
| `legacy_authoritative` | the read-time default for a mode with no record |
| `new_authoritative_reversible` | compare-and-swap expecting `cutover_ready` |
| `rollback_pending` | compare-and-swap expecting `new_authoritative_reversible` |
| `legacy_authoritative` | the rollback completion |

`cutover_ready` is never among them. It appears only as an expectation — a precondition some other
writer is assumed to have satisfied. So the lifecycle is:

    legacy_authoritative --[NO PRODUCER]--> cutover_ready --> new_authoritative_reversible
                                                                      |
                          legacy_authoritative <-- rollback_pending <--+

Exactly one edge in that cycle has no implementation, and it is the entry edge. Every other edge is
built and exercised.

### The rollback path exists, and is green

The drill suite passes 30 of 30 and asserts the full lifecycle with monotonic epochs:

    cutover_ready                --> new_authoritative_reversible   epoch 7 -> 8
    new_authoritative_reversible --> rollback_pending               epoch 8 -> 9
    rollback_pending             --> legacy_authoritative           epoch 9 -> 10

This matters for the framing above and for the instruction this work was carried out under, both of
which describe the enablement edge as having no rollback window. The runtime disagrees: the forward
state is literally named `new_authoritative_reversible`, a reverse path to legacy authority is
implemented, and it is drilled and passing. Declining to rely on rollback is a legitimate policy
choice; it is a different statement from the system not having one, and the two should not be
conflated when deciding.

The drill's isolation was checked rather than assumed. Its store validates containment on every path
against a drill-owned root under the system temp directory, throws on escape, and refuses to
overwrite an existing record. It **seeds** `cutover_ready` as a starting condition rather than
transitioning into it, which is why the drill can exercise the flip while the missing producer
remains missing.

### What this changes about the decision

The request is not to build and prove a flip mechanism. That exists, including its reverse, and it
is green. The request is narrower and sharper: authorize and specify the single entry edge — what
evidence admits a mode to `cutover_ready`, and who may assert it. Whoever takes it inherits a tested
forward transition, a tested rollback, and a parity gate already proven able to turn red.

## 2. Projection coverage, which requirement REQ-004 assumes

**Measured.** The manifest declares 28 surfaces, 22 of them projectable, and exactly one projection
contract exists. The actionable subset is smaller than that total: only 10 projectable surfaces name a
mode as their writer, and those are the ones this retirement reaches. The other 12 are written by runtime
infrastructure whose writers the phase never retires. One mode-owned surface is covered, so the gap that
blocks retirement is **nine**, not twenty-one. For the other 21 an append succeeds, reports `projectionRefreshed` false, and
never refreshes the legacy file.

REQ-004 requires every manifest-named legacy file to still be produced after its writer is retired.
That cannot hold for 21 of 22 surfaces, so retiring those writers would leave their legacy files
unproduced. The phase's in-scope work is to *re-confirm* production, not to build it.

**Options.**

- *Build the 21 contracts.* Each needs a reducer and a contract matching its own legacy file shape.
  Out of the retirement phase's frozen scope, so it wants its own phase. Largest effort, and the
  only path to retiring the writers as specified.
- *Amend REQ-004 to the covered surface.* Retire only the writer whose surface actually projects,
  and say so. Small, honest, leaves 21 writers in place.
- *Amend REQ-004 to drop retirement.* Keep the gateway as an additive path and stop claiming
  retirement in this packet.

A coverage gate now exists and fails when a projectable surface is added without a contract, so the
gap cannot grow silently while this is decided.

## 3. The directive-to-command translation, which REQ-001 assumes

**Measured.** A real directive row from the research workflow, placeholders filled and passed to
the gateway command as its event JSON, returns `exit 1` and
`Unrecognized event format: expected object with stem or event_type`.

Directive rows are legacy-shaped. The command accepts a canonical envelope. A library upcast exists
but the command never calls it, and its table maps three event names while a pinned set keeps
others on the legacy path. In the auto variant: 17 rows are `type: event`, 6 `spec_mutation`, 1
`config`, 1 `iteration`, against an exemption covering 3 lifecycle sentinels.

**Options.**

- *Build the translation.* Map every directive row this workflow emits to a registered stem with
  its scope and data. Several required stems do not exist yet, so this includes schema work. Ties
  to the same missing-schema condition already recorded for the sentinels.
- *Wire the existing upcast into the command and extend its table.* Smaller, but only reaches the
  rows the upcast can express, and the pinned set is pinned deliberately.
- *Amend REQ-001 to the executed route.* The canonical envelope through the command is proven to
  work end to end: receipt at sequence 1, projected legacy file, watermark. Claim that, and stop
  claiming the directive rows travel it.

## Independent of all three

One test in the runtime suite fails on a stale census path, where the manifest and the disk agree
and the census row does not. It sits in a different packet's folder, outside this packet's scope,
so it was left alone. It is a one-line correction whenever someone with that scope wants it.

Five commits from an earlier session reached the shared release branch through live-sync before it
was disabled. History was not rewritten, since that is a shared branch and not this packet's call.
