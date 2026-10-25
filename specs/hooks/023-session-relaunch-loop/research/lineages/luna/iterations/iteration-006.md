# Iteration 6: Operator messages and failure paths

## Focus

Review the wording, exit codes, printed manual commands, shell quoting, hop-cap behavior, and what the wrapper does when a runtime command cannot start.

## Findings

1. **P3 — Missing runtime executables have no focused wrapper test.** The wrapper invokes the selected runtime, saves its exit status, then checks whether a relaunch record exists. With no runtime binary in PATH, the shell normally returns 127 and prints a command-not-found diagnostic; the wrapper appears to preserve that status through its non-relaunch branch. The repository tests malformed records, consume failures, and a missing working directory, but no test removes the runtime command from PATH and asserts status 127 and the user-visible message. This is a test gap, not a confirmed behavior defect. [SOURCE: .skilled/bin/skilled-loop:661-673,834-891; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1820-1882,1969-1998]

## Coverage checked

Manual commands quote paths, escape shell metacharacters, and handle Bash history expansion. Invalid templates warn before the wrapper falls back to a plain command. The CLI reports hop-limit and outside-loop outcomes with exit code 3, and the handoff guide tells the operator which command to copy. Cancellation and withdrawal avoid printing a claim command for a withdrawn note.

## Sources

- .skilled/bin/skilled-loop:661-673,834-891
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1223
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1820-1882,1969-1998
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:786-900
- .skilled/commands/speckit/handoff.md:107-123

## Iteration outcome

One low-priority failure-path test gap recorded. Continue to nested runs, hop caps, cancellation, withdrawal, stale records, and concurrency.
