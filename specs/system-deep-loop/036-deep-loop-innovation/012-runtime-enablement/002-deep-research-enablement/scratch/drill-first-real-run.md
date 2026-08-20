# The first real drill run, and the false blocker it produced

## What ran

A production rollback drill for `deep-research`, bound to the real commit, executed against the
live repository for the first time. Nothing in the runtime had ever called the drill outside a
test before this.

    mode                      deep-research
    candidateSha              f54af685e94749750b88bb037fbfdc67f8a0f025   (real HEAD)
    baseSha                   9399bd108143ae77cd2775124e4573e73908ab41   (real parent)
    startingAuthorityEpoch    1                                          (read from the live record)
    verifierActorId           operator:michel.k@getbarter.com            (resolved, not supplied)
    protectedPathsUnchanged   true

    ok      false
    passed  false
    reason  reconciliation_blocked
    detail  "State classification contains a live veto or lacks closure evidence"

## The result is real. The conclusion drawn from it was not.

The executor reported this as the deep-research mode's in-flight state being unreconcilable —
a genuine system blocker on the flip. That reading is wrong, and it is worth writing down
because it is convincing.

The drill's classification rows are **observations**: `activeLeaseIds`, `pendingEffectIds`,
`isQuiescent`, `terminalReceiptId`, `identityCoverageComplete`. They describe what is currently
true of live state.

`frozenPolicyFor(rowId)` returns something different — the **policy** for that row:

    'research-controls': policy(
      InflightDisposition.BLOCK,
      RESEARCH_MODE,
      'Lock or pause ownership cannot be translated in place and must drain
       before reclassification.',
    )

`BLOCK` here means "this row type must drain before it can be reclassified". It is a rule about
handling, not a report that a lock is currently held.

Seven rows carry it: `research-controls`, `review-controls`, `alignment-control`,
`council-controls`, `improvement-controls`, `database-controls`, `loop-guard-sweep-lock`.

Building the manifest from policy therefore stamps a live veto onto every control row
unconditionally, and the drill contract rejects any classification containing one. The
consequence is that the script as written **cannot pass for any mode, at any commit, in any
system state**. Its failure carries no information about deep-research at all.

## Why this was worth catching

This is the mirror of the failure this epic keeps finding. A green that cannot go red is an
oracle that cannot fail. This is an oracle that cannot pass — and it is more dangerous in this
particular spot, because it fails in the direction that looks responsible. A blocked flip reads
as the safety margin working. Accepting it would have meant reporting a system-level blocker
that does not exist, and quite possibly "fixing" it by relaxing something real.

The existing drill tests never surface this because they override every row's disposition to a
uniform `UPCAST` rather than using the census policies. So the policy path had never been
exercised, by anything, until now.

## What a correct classification requires

Observed evidence per row, not policy per row. The reading path exists —
`currentEvidenceForRow(values, rowId)` and `evaluateModeCutoverReadiness` — but it consumes
evidence records that something must first produce by inspecting live state. That producer is
the next piece of work, and it is the same shape of gap as the rest of this bundle: the
checking machinery is built, the observing machinery is not.

## Status of the drill runner

The script is kept. Everything it does apart from the classification construction is correct
and was proven by execution: real binding resolution, real epoch read from the live record,
hermetic sandbox, protected-path digests unchanged across the run, honest refusal instead of a
forced pass, and attribution preserved across the manifest's narrower identity grammar
(`operator:michel.k@getbarter.com` recorded alongside the slug it requires).

It is not yet capable of producing a certificate, and the reason is now known rather than
guessed.
