---
description: Write one focused test for code the project's tests don't reach yet, measured with Supercov.
argument-hint: "[test command]"
disable-model-invocation: true
---

Use `$ARGUMENTS` as the test command if one was given; otherwise use the project's full test suite.

1. Measure it: `npx supercov -- <test command>`.
2. List targets with `npx supercov runs latest gaps --limit 5`, pick the most useful one, and inspect it with `npx supercov runs latest file <path>`.
3. Write one focused test. Change only tests.
4. Rerun the same command and report the test with coverage before and after.

`npx supercov docs agent-loop` has the full workflow for the installed version.
