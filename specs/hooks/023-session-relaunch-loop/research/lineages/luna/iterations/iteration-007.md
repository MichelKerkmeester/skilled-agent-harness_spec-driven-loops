# Iteration 7: Cancellation race and nested runs

## Focus

Trace cancellation and withdrawal against the wrapper's check-then-consume sequence, then review nested-run and hop-cap coverage.

## Findings

1. **P2 — A cancellation can race with the wrapper and still allow a relaunch.** The wrapper asks should-relaunch whether the record is armed, then later calls consume in a separate process. Withdrawal disarms the record under the shared record lock. But consume reads the record before taking that lock, does not check its status, and unlinks the current file while holding the lock. If withdrawal lands after the approval but before consume completes, consume can delete the disarmed record and return its handoff, so the wrapper continues with the relaunch it already approved. **Test coverage:** withdrawal and consume-lock behavior have separate tests; the consumer test verifies that unlink holds the lock, but no test interleaves withdrawal after should-relaunch and before consume, or between consume's read and unlink. This is a source-level race inference; a deterministic two-process interleaving test would confirm the observed user outcome. [SOURCE: .skilled/bin/skilled-loop:667-729; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:581-608,689-724; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:965-971,1021-1026; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1642-1670; .skilled/hooks/session-relaunch/tests/withdraw.test.cjs:88-140]

## Coverage checked

Nested-loop detection removes inherited SKILLED_LOOP_ variables when process ancestry proves the launched runtime is a child of the loop. Core and adapter tests cover that suppression. Hop-cap behavior, cancellation output, and ordinary withdrawal messages are also covered. The untested case is a cancellation that arrives inside the wrapper's decision/consume window.

## Sources

- .skilled/bin/skilled-loop:667-729
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:581-608,689-724
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:965-971,1021-1026
- .skilled/hooks/session-relaunch/lib/withdraw.cjs:55-90
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1642-1670
- .skilled/hooks/session-relaunch/tests/withdraw.test.cjs:88-140

## Iteration outcome

One check-then-consume race identified; next review covers stale records, concurrent state writers, and unusual paths.
