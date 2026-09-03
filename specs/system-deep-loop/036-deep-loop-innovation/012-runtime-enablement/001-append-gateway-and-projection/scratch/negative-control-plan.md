---
title: "Phase 001 negative-control plan"
trigger_phrases: []
---
# Phase 001 negative-control plan

A guard never observed failing is an assumption, not a guard. Each control
below removes exactly one guard, runs the one test that claims to cover it, and
requires RED. Then restores and requires GREEN. Both outcomes recorded.

Run each from:
  .worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime
Test file: tests/unit/mode-append-gateway.vitest.ts

## NC-1 — envelope refusal
Guard: envelope validation before authorization.
Break: make the envelope check unconditionally pass.
Expect RED on the malformed-envelope test.
If it stays GREEN, the test does not exercise the guard -> the test is the bug.

## NC-2 — authorization refusal
Guard: gateway denial stops the append.
Break: force the authorization result to allow.
Expect RED on the authorization-denied test.
If GREEN, an unauthorized event can reach disk and the test cannot see it.

## NC-3 — ordering (authorize before fence)
This is the one a passing suite most easily hides.
Break: swap the order so the fence is acquired before authorization.
Expect: at minimum no test should pass that claims ordering. If the whole suite
stays green, ORDERING IS UNTESTED regardless of whether the code is correct.
Record that as a finding, not a pass.

## NC-4 — concurrency / lost write
Guard: fenced serialisation, total order, no lost write.
Break: bypass appendAuthorizedThroughFence with a direct unfenced append.
Expect RED on the concurrency test.
If GREEN, the test is asserting "no exception thrown" rather than ledger
contents -- a serialised-by-luck test that passes on a broken fence.

## NC-5 — projection failure mode
Guard: whatever Gemini chose (stale marker vs retry).
Break: force the projection refresh to throw.
Expect RED on the projection-failure test, and specifically NOT a reported
failure of the append itself -- the append is already durable at that point.

## Pass condition
All five go RED when broken and GREEN when restored. Any control that cannot
be made to go red is a defect in the TEST, and blocks the phase just as hard as
a defect in the code.
