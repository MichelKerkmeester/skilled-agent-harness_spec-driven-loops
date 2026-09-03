---
title: "Pre-edit baseline, and six ledger-schema suites that no longer assert anything"
trigger_phrases: []
---
# Pre-edit baseline, and six ledger-schema suites that no longer assert anything

## Baseline

Captured before any edit for this work, whole runtime suite, default reporter.

    HEAD       94530a29c7
    command    npx vitest run
    Test Files 17 failed | 172 passed (189)
    Tests      15 failed | 4210 passed | 39 skipped (4264)
    Duration   7891.88s
    exit       1

The file count and the test count disagree for a reason. Eleven files contain
failing assertions, accounting for all 15 failed tests. The other six failed
without running anything, reporting `No test suite found in file`.

## The six files

    tests/unit/deep-ai-council-ledger-schema.vitest.ts        11 lines, 0 suites
    tests/unit/deep-alignment-ledger-schema.vitest.ts         11 lines, 0 suites
    tests/unit/deep-improvement-common-ledger-schema.vitest.ts 11 lines, 0 suites
    tests/unit/deep-research-ledger-schema.vitest.ts          11 lines, 0 suites
    tests/unit/deep-review-ledger-schema.vitest.ts            11 lines, 0 suites
    tests/unit/skill-benchmark-ledger-schema.vitest.ts        11 lines, 0 suites

Each is a header comment and three imports. No `describe`, no `it`, no assertion.
The seventh mode's file, `model-benchmark-ledger-schema.vitest.ts`, is intact at
1622 lines and 16 suites.

## When, and whether the content moved

    2666012cfe   11 lines     chore(repo): commit accumulated spec/skill WIP...
    aa66365e78   1019 lines   feat(036/023): full upcaster coverage ...
    5c98e4654e   995 lines
    293a9e85b3   993 lines

`2666012cfe` (2026-08-07) is a bulk sync of accumulated uncommitted work. It took
the deep-research file from 1019 lines to 11, and did the same to five siblings.

The content did not move somewhere else. `unknownLegacyRecords`, one of the three
imported helpers, is imported by exactly these six stubs and defined in
`tests/helpers/legacy-real-log.ts`. Nothing else in `tests/` or `lib/` references
it. The imports left behind are unused, which is what a truncation looks like; a
deliberate deletion would have removed the imports or the file.

## Why this is recorded here rather than fixed

It is outside this phase's scope and it predates this work, so it is reported, not
repaired. Two consequences matter for what comes next.

First, it inflates the failing-file count. A reader comparing "17 failed files"
before and after a change would be comparing a number that is six-sevenths
unrelated to the change. The delta that means anything here is the failed-test
count and the identity of the failing files, not the file total.

Second, and more seriously: the typed ledger schema for deep-research has no test
coverage at all, and neither do five of the other six modes. The pilot flip and
the fleet flip both move authority for exactly these modes. Whatever assurance the
suite is providing about those flips, it is not coming from these files.
