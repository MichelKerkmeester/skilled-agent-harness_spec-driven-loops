# Iteration 9: Path quoting and simultaneous claims

## Focus

Check unusual handoff paths and manual commands, then assess concurrent receiver claims against a shared note.

## Findings

1. **P3 — Concurrent claims to one note lack a direct regression test.** `claimHandoff` holds the note lock across reading the open status and writing claimed metadata, so the implementation is structured to let only one claimant win. The tests cover a successful claim and a sequential attempt against an already-claimed note, but no test starts two claimers together and asserts one success, one rejection, and the winner’s metadata. This is a coverage gap; source inspection does not show a defect. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1065-1085; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:278-304]

## Coverage checked

Manual claim tests cover double quotes, backticks, dollar signs, backslashes, and interactive Bash history expansion for bang characters. The wrapper also refuses to print a manual command for line-broken handoff paths. Existing generic concurrent log tests do not exercise concurrent handoff claims.

## Sources

- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1065-1085
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:278-304
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1071-1101
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:966-1005
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:151-180
- .skilled/bin/skilled-loop:845-857

## Iteration outcome

Shell-sensitive path coverage is broad; one receiver concurrency coverage gap remains for the final pass.
