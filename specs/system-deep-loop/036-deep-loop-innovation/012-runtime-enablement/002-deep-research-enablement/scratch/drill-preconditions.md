# What a real pilot rollback drill needs, resolved

Mapping the drill's inputs against what the repository can actually supply, so the runner can
be written without guessing. Three things came out of this that were not obvious.

## The rollback window is open, not closed

At first reading the window looks like a hard blocker: the drill declares
`successfulAuthoritativeRuns`, the canonical minimum is 5, and a mode that has never held
authority has zero. That would make the drill require post-flip history while the flip requires
the drill.

It does not. `assertWindowOpenBeforeMutation` throws only when the window has **closed**, and
closure requires the run minimum met AND the calendar deadline passed:

    (runsComplete && now >= closeAt) || (stricter !== null && now >= stricter)

With zero runs against a minimum of five, `runsComplete` is false, so the first clause cannot
fire. An unflipped mode's window is open. The check is a deadline, not a readiness bar.

Worth stating plainly because the field names invite the opposite reading, and someone
"fixing" the apparent circularity would be weakening a real guard to solve a problem that does
not exist.

## The canonical window values are already pinned

`FROZEN_CENSUS_CONTRACT` carries `rollbackMinimumDays: 14` and
`rollbackMinimumSuccessfulRuns: 5`. The drill manifest should read them from there rather than
restating them, so the drill and the census cannot drift apart.

The same contract pins `stateBackendRowCount: 46` — the frozen census has 46 rows, which is a
different set from the 15 directive row shapes that gate the append-CLI translation. They are
easy to conflate by name and are unrelated.

## Two mode vocabularies

The classification and census modules use short mode names — `research`, `review`,
`ai-council`, `alignment`. The authority modules use long ones — `deep-research`,
`deep-review`, `deep-ai-council`, `deep-alignment`.

This matters for the drill because the certificate cross-checks `drillFacts.mode` against the
certificate's own mode, which is the long form. `RollbackDrillManifest.mode` is typed as a bare
`string` and the runner only checks it against `currentMode`, so the drill will accept either
spelling without complaint and produce a certificate that silently fails the later
cross-check.

The drill must therefore be run with the long form, while its classification rows come from a
census keyed by the short form. Both are correct; nothing enforces the pairing.

## Synthetic by design, and legitimately so

A drill rehearses failure, so parts of it are necessarily constructed: the injected fault, the
sandbox workload, the rollback anchor, the contract-identity bindings, and the sandbox root. A
drill with no injected fault would prove nothing.

What must be real is the binding to this commit and this mode: `candidateSha`, `baseSha`,
`verifierIdentity`, `startingAuthorityEpoch` read from the live record, and the classification
built from the real census. Those are what make the resulting certificate a statement about
this system rather than about a fixture.

The live authority record is passed as a protected path, and the runner digests protected paths
before and after. That is what proves a drill never touched live state — it is the drill's own
falsifiable claim about itself.
