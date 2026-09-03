---
title: "The delta says one fewer failure. It is not an improvement."
trigger_phrases: []
---
# The delta says one fewer failure. It is not an improvement.

## What the receipt shows

    failed  -1     (14 vs 15)
    passed  +79
    total   +78
    files   +6

A negative failure delta invites the reading that this work fixed something. It did not, and the
difference is worth recording so nobody later cites it as evidence of one.

## What actually moved

Exactly one test changed state between the baseline and the final capture:

    model-benchmark-ledger-schema > extends all common stems and appends every
    common and mode-specific stem

Its failure is not an assertion. It is a timeout:

    Error: Test timed out in 30000ms.

Run in isolation three times, it fails all three. In the full suite it failed at the baseline and
passed at the final capture. So its outcome is not stable across contexts, and nothing in this work
touches the model-benchmark ledger schema.

## Why this matters for the delta

The failure count is a weaker measure than it looks while a timing-sensitive test sits near its
timeout boundary: it can move in either direction between runs without any code changing. The
comparison that carries weight is the one by name — every one of the remaining fourteen failures is
identical to a baseline failure, and no test that passed at the baseline fails now.

So the honest claim is: **no regressions, and no earned fix**. The `-1` is noise from one slow test,
not a result.

## Not fixed here

The timeout belongs to a different subsystem's test and raising it, or making that test faster, is
outside this packet. It is recorded so the next person to see a negative failure delta does not
inherit a false positive.
