# Iteration 5: OpenCode 2 and Devin runtime limits

## Focus

Check OpenCode 2 standalone and shared-server behavior, then compare its and Devin's model/effort limits against the current docs and tests.

## Findings

1. **P3 — OpenCode 2 does not test the equals-form shared-server flag.** The wrapper recognizes both --server and --server=value and suppresses standalone mode for either; its warning says the loop cannot arm on a shared server. The phase requirements explicitly name both forms. The test suite exercises --server followed by a separate URL, but no test passes --server=http://localhost:4096 and checks the launch, warning, and no relaunch. The current implementation branch appears to handle the equals form; this is a coverage gap, not a confirmed runtime defect. [SOURCE: .skilled/bin/skilled-loop:573-578,625-635; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1056-1064; specs/hooks/023-session-relaunch-loop/032-opencode2-standalone-replay/spec.md:106-114,166-168]

## Coverage checked

OpenCode 2 detection uses the help output. The first launch and each relaunch add --standalone unless --server was supplied; OpenCode 2 relaunch drops -m because the root command does not accept a model. Tests cover the first launch, repeated relaunch, duplicate operator-supplied --standalone, model drop, and the separate-value --server form. Devin captures and replays its launch model only; it has no live setting source or effort flag, and the CLI test confirms no live model is recorded. These limits match the README.

## Sources

- .skilled/bin/skilled-loop:352-363,573-578,617-635
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1029-1064
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2421-2428
- specs/hooks/023-session-relaunch-loop/032-opencode2-standalone-replay/spec.md:106-114,166-168
- .skilled/hooks/session-relaunch/README.md:42-47

## Iteration outcome

One narrowly scoped test gap found. Continue to operator-facing warnings, manual commands, hop cap, cancellation, and withdrawal.
