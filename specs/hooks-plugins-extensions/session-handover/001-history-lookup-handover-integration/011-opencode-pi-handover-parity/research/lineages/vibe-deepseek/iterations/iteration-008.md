# Iteration 8: The History Lookup CLI's own failure surface

## Focus

The lookup the receiver is offered can be withheld, and a withheld lookup looks identical to a lookup that was never needed. This iteration enumerates every condition under which the offer disappears, plus the freshness bound that makes a stale locator refuse at redeem time. A hop that fails here fails silently, because the claim output simply prints no section.

## Actions Taken

1. Read `mintHandoverLocator` and every early return in it.
2. Read `handoverLookupSection`'s placement and checkout checks.
3. Read the CLI's locator freshness check and its TTL constant.
4. Read `lookupRunsFrom`, which gates the printed command on the workspace's contents.

## Findings

1. The CLI refuses a locator older than 30 minutes: `LOCATOR_TTL_MS = 30 * 60 * 1000`, and `isFresh` requires `ageMs >= 0 && ageMs < LOCATOR_TTL_MS`. [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:37]

2. A locator whose `mintedAt` is in the future counts as stale, because a future timestamp is clock skew rather than freshness. [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:217]

3. The mint is done at claim time rather than at prepare time precisely because of that TTL, so a note claimed hours after it was written still redeems. This is the correct design and is not a failure mode. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1060]

4. `mintHandoverLocator` returns null, and therefore withholds the offer, on any of: an empty runtime or session id, a runtime with no locator kind, a transcript-based runtime with no transcript path, a `placeLookup` miss, a reader that cannot find the session, or a recorded folder outside the sender's checkout. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929]

5. For Pi and OpenCode the mint asks the reader directly (`readerFindsSession`) instead of resolving a transcript path, so the mint and the lookup agree on whether the session exists. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929]

6. The offer is withheld unless the receiver's workspace and the sender's workspace are the same checkout, because the printed command moves to the locator's workspace and would otherwise read the wrong repository. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1090]

7. `lookupRunsFrom` requires three things in the workspace: a `.git` entry, the entry script, and the compiled core at `.skilled/hooks/session-handover/history/dist/cli.js`. A checkout without a built core gets no offer at all. [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts]

8. Every one of those conditions fails closed by returning null, and the claim command wraps the call in a bare `catch {}`, so a withheld offer produces no message, no log line and no marker in the claim output. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

## Ruled Out

- "A withheld offer is visible to the receiver." The claim output prints the section only when it is non-null, and the surrounding `catch {}` swallows any error, so absence is silent.
- "The 30-minute TTL is a bug." Minting at claim time makes the TTL irrelevant to a normal hop; it only bites a locator minted and redeemed across a long gap, which the design avoids.

## Dead Ends

- Looking for a reason code on a withheld offer. There is none; the function returns null rather than a typed refusal.

## Edge Cases

- Ambiguous input: "fail to recover a detail" could mean the lookup was never offered or the receiver never ran it. This iteration covers the first; iteration 1 covers the second.
- Contradictory evidence: none.
- Missing dependencies: the compiled core's presence was checked by path, not by running the CLI.
- Partial success: the conditions are enumerated from code, not observed as a withheld offer in a run.

## Sources Consulted

- `.skilled/hooks/session-handover/history/lib/cli.ts:37`
- `.skilled/hooks/session-handover/history/lib/cli.ts:217`
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:929`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1060`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1090`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:729`

## Assessment

- New information ratio: 0.72
- Questions addressed: the lookup offer's withholding conditions and the freshness bound
- Questions answered: none new; this iteration bounds the recovery-path failure surface

## Reflection

- What worked and why: counting the early returns in one function gave an exhaustive list. A function that fails closed by returning null has a finite failure surface, and enumerating it is cheaper than testing each case.
- What did not work and why: expecting a withheld offer to be diagnosable. The bare `catch {}` at the call site removes the last trace.
- What I would do differently: read the call site before the mint, because the silent catch is what turns a design choice into an invisible failure.

## Recommended Next Focus

The redaction contract end to end: what a planted token must look like to be caught, and what the `[REDACTED:` marker guarantees.

## Fixes Named

- Return a typed refusal from `mintHandoverLocator` instead of null, and print one line in the claim output naming why the offer was withheld, so a missing lookup is diagnosable. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929]
- Log the withheld-offer reason to the handover log rather than swallowing it in the bare `catch {}`. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]
- Have the claim output state that no lookup is available when the offer is withheld, so a receiver does not read silence as "nothing to look up". [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts]
