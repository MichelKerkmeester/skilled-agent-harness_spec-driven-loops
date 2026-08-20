# The fleet driver is built and proven; the step it drives does no enablement

## What the phase requires

The spec asks for a driver that, per mode, migrates the write protocol, captures
parity, gates on that parity, flips authority, and verifies the result. Five
actions. The check vocabulary in the driver reflects them:

    type EnablementCheck = 'protocol' | 'parity' | 'flip' | 'reader-contract'

## What the per-mode step actually does

`buildRunStep` in the enablement CLI, in full:

1. derive the mode's surface set; on throw, fail as `reader-contract`
2. if the surface set is empty, fail as `reader-contract` ("no projection-manifest entry")
3. read the authority record; on throw, fail as `flip`
4. if the record is not `cutover_ready`, fail as `flip`
5. otherwise return ok

Grepping the script for the names that would perform an enablement returns
nothing:

    requestCutover · prepareCutover · CutoverCoordinator · buildCutoverCertificate

No protocol document is migrated. No parity run is captured. No authority record
is written. No reader contract is executed. Two of the four declared check kinds
are never emitted at all, and the two that are emitted label failures of a
manifest lookup and a state read rather than of the work they are named for.

## The consequence, stated plainly

If every mode were already `cutover_ready`, this driver would return ok for all
seven and report a completed fleet enablement, having changed nothing.

That is not a driver that cannot run yet. It is a driver whose success does not
depend on any enablement occurring.

## Why the guards did not catch it

The phase records twelve guards proven by negative control, and they are real.
They cover the harness: state persistence across a crash, stop-on-first-failure,
untouched modes after a stop, resumption without re-flipping, refusal to read a
malformed state file, rejection of multi-mode requests.

Every one of those tests the orchestration. None tests what is orchestrated,
because the step is injected — `runStep` is a parameter, and the suites supply
their own. The injection is a good design; it is what makes the driver testable
without moving authority. But it also means the shipped step has never been the
thing under test.

The driver sequences, persists, resumes and halts correctly. That was verified.
What it sequences was not.

## What this changes about the phase's status

The recorded blocker was "no mode can reach cutover_ready, so no mode can be
enabled". That reads as a driver waiting on an upstream precondition. The
precondition is now buildable — the promotion edge exists — but satisfying it
would not make this driver enable anything.

The remaining work in this phase is the per-mode step itself: the five actions
the spec names. The orchestration around it is done.
