---
title: "The gate's only failing check had never run"
trigger_phrases: []
---
# The gate's only failing check had never run

## Symptom

Every receipt this phase produced carried the same `authority-state` detail:

    Cannot find module '.../per-mode-authority-flip/authority-registry.js'
    imported from '.../per-mode-authority-flip/index.ts'

Three committed receipts, all identical, all reporting `status: fail`.

## Why it went unnoticed for so long

The check was failing, and it was *supposed* to fail — no mode has been flipped, so a truthful
authority check fails too. A red check that is expected to be red invites no scrutiny. It had the
same status, in the same row, that a real measurement would have produced, so it read as the gate
working exactly as designed.

That is the more dangerous direction of this class of bug. A check stuck green gets challenged the
first time someone doubts a pass. A check stuck red is quietly cited as evidence of rigour.

## Root cause

The runtime is TypeScript whose internal imports use the `.js` specifiers the TS-ESM convention
requires. Node strips types from a `.ts` entry file but does not rewrite those specifiers, so the
barrel's `export ... from './authority-registry.js'` resolves to a file that was never emitted. The
harness was written to be launched under a loader that handles this, and was launched without one.

The invocation was the trigger. The defect is that the harness turned its own resolution failure
into a verdict about the system: a `catch` around each check wrote `status: 'fail'` with the
exception text, making a broken check indistinguishable from a measured one.

## Fixes

1. **Resolution is now self-contained.** A `registerHooks` resolver maps a missing `.js` back to
   `.ts`. Correctness stops depending on the command line used to start the gate — an
   invocation-dependent gate reports defects in itself as defects in the system.
2. **`error` is now a distinct status from `fail`.** They mean opposite things: `fail` is a
   measurement, `error` is the absence of one. `error` outranks `fail` in the verdict, because while
   a check is broken the gate cannot claim to have measured the system at all. Exit code `3`
   separates a broken harness from a measured failure at the shell.
3. **Per-mode records reach the receipt.** The projection previously dropped them, so the receipt
   held a count and not the states the success criteria call for.

## What the check reports now

    read 8 modes; 8 on legacy_authoritative;
    0 from a stored record, 8 from the absent-record default

Verdict stays FAIL, for the first time on evidence.

## A second finding, from actually running it

The authority root holds only its `README.md`. No authority record exists on disk for any mode, and
`read()` answers an absent record with a synthesized `legacy_authoritative` default rather than an
error.

Today that default is the correct reading: nothing has flipped. The concern is afterwards. Once
records exist, deleting one would read as ordinary legacy authority rather than as the corruption it
is — the fleet would look like it had been rolled back rather than damaged. The receipt now records
provenance per mode so the two can be told apart while the distinction still exists.

Not fixed here: making `read()` itself distinguish them changes runtime behaviour and belongs with
the flip work, not with a phase whose contract is to measure without touching anything.

## Negative controls

| Control | Result |
|---|---|
| Import `index.ts` with no resolver hook | Fails with the original module error |
| Import `index.ts` with the hook | Succeeds; 8 modes resolve |
| Point the authority import at a nonexistent module, re-run the gate | `status: error`, verdict `ERROR`, exit `3` — not `fail` |
| Restore | Byte-identical, verdict returns to `FAIL` on the real reading |
