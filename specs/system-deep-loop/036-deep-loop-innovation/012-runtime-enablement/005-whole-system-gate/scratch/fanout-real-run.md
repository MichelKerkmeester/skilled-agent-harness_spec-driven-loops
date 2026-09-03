---
title: "A real fan-out, and a deferral of mine that was wrong"
trigger_phrases: []
---
# A real fan-out, and a deferral of mine that was wrong

## The deferral I accepted, and why it was wrong

The unrun fan-out was recorded as deferred because the authority check already fails, so the verdict
is determined, and a real fan-out would spend model budget confirming a foregone conclusion. I
reviewed that reason earlier in this work and let it stand, on the grounds that its premise was
verifiable.

Its premise is verifiable and it is still the wrong reason, because it answers a question the
requirement does not ask. The requirement does not ask the fan-out to change the verdict. It asks the
gate to contain a real fan-out run rather than a fixture. What that buys is the one thing nothing
else in the gate provides: every other check reads a captured artifact, so only this one exercises
the runtime end to end. After thirty-odd commits to the write path, that is exactly the evidence a
unit suite cannot give.

## What ran

One lineage, one iteration, through the shipped runner.

    executor    cli-opencode, cline-pass/cline-pass/deepseek-v4-flash, xhigh
    lineages    1, concurrency 1
    result      status ok, lineage fulfilled, 281s, exit 0

It produced twelve non-empty artifacts, including a real `iteration-001.md` of 4,978 bytes, a
`research.md`, a findings registry, a dashboard, orchestration status and summary, and observability
events emitted by the `fanout-run` producer.

One of those artifacts is worth noting on its own. The lineage's `deep-research-state.jsonl` opens
with a `{"type":"config", ...}` row — a legacy-shaped record, written by the legacy direct-append
path. A live run therefore corroborates from the outside what the append-site census found by
counting: the legacy writers are still the active path, and the gateway is not yet canonical.

## Two false starts, both mine

The first attempt failed fatally with `artifact scope ... is outside the git worktree — containment
cannot be enforced`, naming a path that is plainly inside the worktree. The message is misleading:
the containment check resolves the artifact directory relative to `process.cwd()`, and I had invoked
the runner from the runtime directory rather than the repository root, so the artifact resolved as
`../../../..` and could not be expressed as a repo-relative subpath. The condition it reports is not
the condition it fails on. Invoking from the repository root resolved it.

The second was a flag-form error: the runner parses space-separated arguments, not `--key=value`.

Neither was a product defect, and neither should be recorded as one.

## The check now reads that evidence and can fail on it

The gate's not-run stub is replaced by a check that requires the summary to parse, the counts to be
consistent (`total >= 1`, `succeeded >= 1`, `failed === 0`, `all_failed === false`, no orphaned
lineages), and — the condition that matters — the lineage's iteration artifact to exist and be
non-empty.

That last one is the difference between reading evidence and reading a claim. A summary is written by
the thing being measured. Without an independent artifact check, a run that declared success while
producing nothing would pass.

| perturbation | result |
| ------------ | ------ |
| summary file hidden | fail — `summary unreadable` |
| iteration emptied, summary still declaring success | fail — `iteration artifact empty or zero-size` |
| both restored | pass, iteration size 4,978 identical |

The middle row is the one worth keeping: the check refuses a self-declared success.
