# T015 verification evidence (orchestrator-run, worktree 016, base `409e2346c0a`)

## tsc --noEmit
exit 0 (project TS 5.9.3 at `system-spec-kit/node_modules/.bin/tsc`)

## Green-after — full `authorized-ledger.vitest.ts`
```
Tests  1 failed | 52 passed (53)
Duration  47.27s
```
53 = the 52 pre-existing tests + the new crash-injection test. The new test PASSES.
The single failure is `serializes concurrent processes into one contiguous unambiguous head`
— proven pre-existing below.

## Negative control A — the new test against the UNFIXED lib (proves it is not hollow)
```
× completes an interrupted quarantine when the recovery marker is already durable 1062ms
AuthorizedLedgerError: Recovery marker does not match its byte-preserved quarantine file
Tests  1 failed | 52 skipped (53)
```
Exactly the failure mode the ordering change removes.

## Negative control B — the multiprocess failure is PRE-EXISTING, not caused by T015
Lib and test both reverted to the worktree base commit, running only that test:
```
× serializes concurrent processes into one contiguous unambiguous head 20665ms
Tests  1 failed | 51 skipped (52)   <- 52, i.e. the new test is absent
Error: Writer 3 exited 1: .../immutable-frame-store.ts:590
AuthorizedLedgerError: Ledger writer lock identity changed before release
```
It reproduces at base with T015 absent, so T015 introduces no regression.

## Open finding raised by this work (NOT fixed here — out of T015 scope)
`serializes concurrent processes into one contiguous unambiguous head` is a genuine
multi-process concurrency failure at HEAD in a **024-owned** suite. The error is an
assertion from the lock-release identity check, not merely a timeout, and it reproduced
across four independent runs (15920ms / 20665ms / 28113ms / 30271ms — the longest hitting
the 30s cap and cascading an `ENOTEMPTY` in cleanup). This contradicts the packet
handover's claim that 024's eight owned suites pass 223/223 in isolation. It needs its own
disposition before CHK-110 can be called green.
