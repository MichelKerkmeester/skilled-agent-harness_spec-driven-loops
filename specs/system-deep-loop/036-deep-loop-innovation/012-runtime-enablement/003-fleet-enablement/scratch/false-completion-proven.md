---
title: "A ready mode is recorded as enabled without an authority write, and the lie persists"
trigger_phrases: []
---
# A ready mode is recorded as enabled without an authority write, and the lie persists

## Method

Previous notes argued from reading that the per-mode step would report success
without enabling anything. This ran it.

1. A scratch authority root was created, outside the repository.
2. `prepareCutover` seeded records to `cutover_ready` for several fleet modes.
   The synthesized default sits at epoch **1**, not 0; an earlier attempt with
   `expectedEpoch: 0` was refused by the compare-and-swap, correctly.
3. The authority files were hashed.
4. `enable-modes.cjs` was run against that root with a temp state file.
5. The authority files were hashed again.

## Result

    before: af1bd557f4a9fbf9eff1ff257922c089bf2d16a8497f09f94f766d305d71f34e
    after : af1bd557f4a9fbf9eff1ff257922c089bf2d16a8497f09f94f766d305d71f34e

Byte-identical. And the run reported:

    "completedModes": ["deep-review"]

`deep-review` was seeded `cutover_ready`, the step returned ok, and the driver
recorded it as completed. No authority record changed. The mode was reported as
enabled while remaining exactly as it was.

The run then stopped at `deep-ai-council`, which had not been seeded, with the
state-mismatch reason. Stop-on-first-failure worked as designed.

## The part that makes it durable

The completion is written to the external state file:

    { "version": 1, "completedModes": ["deep-review"], "failure": { ... } }

The driver skips completed modes when resuming — that is the resume guarantee,
and it is deliberate, because re-flipping an already-flipped mode is not a
no-op. Here it means the opposite of what it was built for: a resumed run will
skip `deep-review` as already enabled, while its record still reads
`cutover_ready` and no flip has ever occurred.

So this is not only a misreport at the end of one run. It is a false fact
persisted to disk that suppresses the next attempt.

## Also found

`FLEET_MODE_ORDER` is `AUTHORITY_FLIP_MODE_ORDER` minus the pilot, which is
**seven** modes:

    deep-review, deep-ai-council, deep-improvement-common, agent-improvement,
    model-benchmark, skill-benchmark, deep-alignment

The phase's own metadata names **six**: `review`, `ai-council`,
`agent-improvement`, `model-benchmark`, `skill-benchmark`, `alignment`. Both the
count and the naming differ — `deep-improvement-common` is absent from the spec
list entirely, and four of the six are written without their `deep-` prefix.
Anyone reconciling the spec against a run's output will hit this immediately.

## What follows

The step must not return ok for work it did not do. Until it performs an
enablement, the honest outcome for a `cutover_ready` mode is a refusal naming
what is missing — not a completion recorded to state.
