# The step's gap is unwritten code, not a blocked precondition

## Correction to the first version of this note

The first version of this note presented "the per-mode step performs no
enablement" as a discovery, and said the phase's guards had not caught it. Both
claims were wrong, and the checklist in this folder says so plainly:

- CHK-008 is marked PARTIAL: "the step performs the checks the runtime can
  actually perform and refuses the flip with the on-disk state named."
- CHK-006 records: "No coordinator request is constructed at all, since the step
  refuses before the write path."
- CHK-015 is BLOCKED: "a reader contract needs files projected by an enabled
  mode; no mode is enabled, so running one would pass vacuously."
- CHK-017 is BLOCKED: "no mode was enabled, so the property is untested rather
  than satisfied."

The absence of the flip, the reader contract and the parity capture was recorded
item by item, with reasoning, before this session. Nothing was hidden and no
guard failed. The correction is owed.

## What is still worth adding

One distinction survives, and it changes what the remaining work is.

The checklist frames the gap as **blocked by an upstream precondition**. CHK-008
says the step "cannot be the pilot's full procedure because the pilot's own flip
is blocked", which reads as: the procedure is waiting on `cutover_ready` to
become reachable.

It is not waiting. Grepping the script returns nothing for

    requestCutover · prepareCutover · CutoverCoordinator · buildCutoverCertificate

There is no flip code to reach. The promotion edge is now built, so a mode can
reach `cutover_ready` — and the consequence is that this step would return `ok`
for that mode and the driver would report a completed enablement, having written
no authority record.

That is the difference that matters. Removing the block does not reveal a
procedure that was waiting behind it. It removes the only thing currently
producing a refusal, and what is left underneath reports success.

## Why the harness guards do not cover this

Also stated fairly: the twelve guards are real and were proven by negative
control. They cover persistence across a crash, stop-on-first-failure, untouched
modes after a stop, resumption without re-planning a completed mode, refusal of
a malformed state file, and rejection of multi-mode requests.

They test the orchestration, which is the part that exists. `runStep` is
injected and the suites supply their own, which is what lets the driver be
tested without moving authority. That is sound design, not an oversight. It does
mean the shipped step is not what those twelve guards are about.

## The remaining work

The per-mode step's five actions — migrate the write protocol, capture parity,
gate on it, flip, verify — are the content of this phase that is not yet
written. The orchestration around them is done and proven.
