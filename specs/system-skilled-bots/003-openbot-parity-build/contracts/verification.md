---
title: "Contract: How a verify command is written"
description: "The rules every task and acceptance row in the parity build follows when it names a verify command, so a check fails on a missing or wrong build and passes on a correct one."
trigger_phrases:
  - "verify command rules"
  - "anchored vitest filter"
  - "check that cannot fail"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# How a verify command is written

A verify command is evidence only when it would print something different on a wrong build. The final review of 2026-11-26 found checks that pass before anything is built and pairs of rows that cannot both pass on a correct build. Every task and acceptance row in this packet follows the rules below. A phase document that breaks one is wrong until it is fixed.

## The vitest name filter

The runtime's vitest (4.1.12) treats `-t` as an unanchored pattern over the full test name, the `describe` path included. Three behaviours follow, each observed on 2026-11-26 against `.skilled/skills/system-skilled-bots/runtime/node_modules/.bin/vitest`:

1. A filter that matches no test exits 0 and prints `Tests  N skipped`, with no `failed`.
2. A filter matches every test inside a `describe` block whose name holds the word.
3. A short word matches any test whose name contains it, so `by` matches "a secret named by key".

The rules:

- **V1. Anchor the full name.** A filter that means one test is written `-t "^<describe path> <test name>$"`, with the describe path and the test name joined by one space, exactly as vitest prints them.
- **V2. State the pass count.** The expected output is the count line, for example `prints Tests  1 passed`. "Prints no `failed`" and "exits 0" are never the whole check for a filtered run.
- **V3. Name the test where it is created.** The task that adds a test gives its full name, and that name is unique in its file. A later phase that adds a test with a similar name picks a name no earlier anchored filter matches.
- **V4. A row that means a group says how many.** A row that covers every case in a block uses the block's anchored prefix, `-t "^<describe path> "`, and states the exact count.

## Whole-file runs

- **V5. A whole-file run proves no regression, nothing more.** A task that adds or extends tests verifies the tests it adds by name, under V1 and V2, and may add the whole-file run as a second check.
- **V6. A test file that is green today cannot be the only check** for a row that depends on new code.

## Exact counts and greps

- **V7. Count what appears once by design.** An exact-count `grep -c` matches a whole literal that occurs once, such as the full registry entry `'apps-refused': { reason: 'apps-refused', class: 'author' }`, never a bare name that the existing two-line pattern prints twice.
- **V8. No constant arithmetic.** A check reads the file it claims to check. A `node -e` line built only from constants is a note, not a check.
- **V9. A copy check compares lines.** "No reference source appears" is checked by comparing lines against the named reference files, for example `comm -12 <(sort -u <reference files> | awk 'length>30') <(sort -u <design files>)` prints nothing. A licence banner grep alone is not enough.

## State and working directory

- **V10. Never touch the operator's state.** A command that reads or writes bot state runs against a scratch checkout copy, passed as `--repo "$SCRATCH/checkout"`, with that copy's own `bots/config.json` pinning `stateRoot` under the scratch folder. This is the pattern `002-routine-layer` T031 uses. A shell `XDG_STATE_HOME` alone is not enough, because `bots.cjs` resolves state through the installed job's environment when one exists for the checkout. No verify runs `bots status` or any verb against the live state root.
- **V11. One cell runs from the repository root.** A command that needs another folder changes into it inside a subshell, `(cd "$RT" && npx vitest ...)`, so the next command in the same cell still resolves from the root.
- **V12. A literal path is a path.** A verify cell holds no placeholder such as `<runId>`. When the value is only known at run time, a test reads it.

## Baselines

- **V13. A number measured before the build is a baseline, not a floor.** A row that asserts a test count, a help line count or a file count after earlier phases land takes the number at its own setup and records it there.
