---
title: "Runtime suite baseline and delta"
trigger_phrases: []
---
# Runtime suite baseline and delta

## Baseline at e6f17e1cbf5, before any edit
 Test Files  20 failed | 160 passed (180)
      Tests  35 failed | 4074 passed | 39 skipped (4148)
   Duration  10060.27s (transform 4.76s, setup 0ms, import 13.37s, tests 10018.51s, environment 12ms)

## Pre-existing failing files (20)
- tests/unit/model-benchmark-ledger-schema.vitest.ts (15 tests | 1 failed) 32712ms
- tests/unit/legacy-projections.test.ts (15 tests | 1 failed) 10099ms
- tests/stress/cli-adapter/fanout.vitest.ts (20 tests | 1 failed | 1 skipped) 15689ms
- tests/stress/cli-adapter/cli-devin.vitest.ts (19 tests | 1 failed | 1 skipped) 10603ms
- tests/unit/spawn-cjs.vitest.ts (6 tests | 1 failed) 334ms
- tests/unit/combo-matrix.vitest.ts (2 tests | 1 failed) 300ms
- tests/unit/render-command-contract.vitest.ts (16 tests | 3 failed) 199ms
- tests/unit/check-contract-drift.vitest.ts (8 tests | 1 failed) 45ms
- tests/integration/review-depth-convergence.vitest.ts (1 test | 1 failed) 6ms
- tests/unit/deep-ai-council-ledger-schema.vitest.ts (0 test)
- tests/unit/deep-alignment-ledger-schema.vitest.ts (0 test)
- tests/unit/deep-improvement-common-ledger-schema.vitest.ts (0 test)
- tests/unit/deep-research-ledger-schema.vitest.ts (0 test)
- tests/unit/deep-review-ledger-schema.vitest.ts (0 test)
- tests/unit/skill-benchmark-ledger-schema.vitest.ts (0 test)
- tests/unit/deep-research-rollback-gate.vitest.ts (81 tests | 6 failed) 1829359ms
- tests/unit/deep-ai-council-rollback-gate.vitest.ts (32 tests | 10 failed) 1273656ms
- tests/unit/deep-ai-council-shadow-parity.vitest.ts (59 tests | 5 failed | 2 skipped) 1048523ms
- tests/unit/authorized-ledger.vitest.ts (53 tests | 1 failed) 54877ms
- tests/unit/dependency-seams.vitest.ts (7 tests | 2 failed) 166ms
- tests/integration/review-depth-convergence.vitest.ts:25:24
- tests/unit/authorized-ledger.vitest.ts:903:3
- tests/unit/authorized-ledger.vitest.ts:259:15
- tests/unit/check-contract-drift.vitest.ts:145:29
- tests/unit/combo-matrix.vitest.ts:228:36
- AppendOnlyLedger.#verifyProof lib/authorized-ledger/append-only-ledger.ts:708:13
- lib/authorized-ledger/append-only-ledger.ts:440:7
- ImmutableFrameStore.withExclusiveLock lib/authorized-ledger/immutable-frame-store.ts:319:14
- FencedLeaseCoordinator.#withMutex lib/locks-and-fencing/fenced-lease-coordinator.ts:637:18
- lib/locks-and-fencing/fenced-lease-coordinator.ts:472:16
- AuthorizedEvidenceWriter.append lib/receipts-and-effect-recovery/authorized-writer.ts:165:25
- BoundaryReceiptIssuer.#issueLocked lib/receipts-and-effect-recovery/boundary-receipts.ts:432:22
- BoundaryReceiptIssuer.#withLock lib/receipts-and-effect-recovery/boundary-receipts.ts:456:14
- issueSharedTransitionReceipt lib/deep-ai-council-certificates/deep-ai-council-certificates.ts:1193:18
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1307:3
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1330:3
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1336:3
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1343:64
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1376:3
- AppendOnlyLedger.#validateCapability lib/authorized-ledger/append-only-ledger.ts:518:13
- AppendOnlyLedger.#appendAuthorized lib/authorized-ledger/append-only-ledger.ts:391:24
- lib/authorized-ledger/append-only-ledger.ts:364:42
- invokeAppendAuthorized lib/authorized-ledger/append-only-ledger.ts:767:10
- lib/locks-and-fencing/fenced-ledger-writer.ts:82:14
- FencedLeaseCoordinator.#withMutex lib/locks-and-fencing/fenced-lease-coordinator.ts:637:18
- lib/locks-and-fencing/fenced-lease-coordinator.ts:472:16
- appendAuthorizedForTest tests/fixtures/authorized-ledger-test-helper.ts:49:12
- authorizedLedger tests/unit/deep-ai-council-rollback-gate.vitest.ts:697:5
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1410:3
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1467:3
- tests/unit/deep-ai-council-rollback-gate.vitest.ts:1517:3
- tests/unit/deep-ai-council-shadow-parity.vitest.ts:1799:3
- tests/unit/deep-ai-council-shadow-parity.vitest.ts:1931:3
- tests/unit/deep-ai-council-shadow-parity.vitest.ts:1955:3
- tests/unit/deep-ai-council-shadow-parity.vitest.ts:1970:3
- tests/unit/deep-ai-council-shadow-parity.vitest.ts:2001:3
- AppendOnlyLedger.#validateCapability lib/authorized-ledger/append-only-ledger.ts:518:13
- AppendOnlyLedger.#appendAuthorized lib/authorized-ledger/append-only-ledger.ts:391:24
- lib/authorized-ledger/append-only-ledger.ts:364:42
- invokeAppendAuthorized lib/authorized-ledger/append-only-ledger.ts:767:10
- lib/locks-and-fencing/fenced-ledger-writer.ts:82:14
- FencedLeaseCoordinator.#withMutex lib/locks-and-fencing/fenced-lease-coordinator.ts:637:18
- lib/locks-and-fencing/fenced-lease-coordinator.ts:472:16
- appendAuthorizedForTest tests/fixtures/authorized-ledger-test-helper.ts:49:12
- certificateLedger tests/unit/deep-research-rollback-gate.vitest.ts:486:5
- certificateVerificationInput tests/unit/deep-research-rollback-gate.vitest.ts:788:50
- tests/unit/deep-research-rollback-gate.vitest.ts:2499:3
- FencedLeaseCoordinator.#assertCurrentLease lib/locks-and-fencing/fenced-lease-coordinator.ts:1144:13
- lib/locks-and-fencing/fenced-lease-coordinator.ts:476:18
- FencedLeaseCoordinator.#withLeaseMutexes lib/locks-and-fencing/fenced-lease-coordinator.ts:616:40
- lib/locks-and-fencing/fenced-lease-coordinator.ts:620:18
- FencedLeaseCoordinator.#withMutex lib/locks-and-fencing/fenced-lease-coordinator.ts:637:24
- FencedLeaseCoordinator.#withLeaseMutexes lib/locks-and-fencing/fenced-lease-coordinator.ts:617:17
- lib/locks-and-fencing/fenced-lease-coordinator.ts:472:27
- tests/unit/deep-research-rollback-gate.vitest.ts:2561:3
- tests/unit/deep-research-rollback-gate.vitest.ts:2575:3
- tests/unit/deep-research-rollback-gate.vitest.ts:2595:3
- tests/unit/dependency-seams.vitest.ts:42:51
- tests/unit/dependency-seams.vitest.ts:63:75
- tests/unit/legacy-projections.test.ts:449:39
- tests/unit/model-benchmark-ledger-schema.vitest.ts:1070:3
- assertCompiledContractFresh scripts/render-command-contract.cjs:76:11
- renderPayload scripts/render-command-contract.cjs:88:5
- Object.renderCommandContract scripts/render-command-contract.cjs:140:16
- tests/unit/render-command-contract.vitest.ts:100:71
- withInjectionMode tests/unit/render-command-contract.vitest.ts:64:12
- tests/unit/render-command-contract.vitest.ts:100:20
- assertCompiledContractFresh scripts/render-command-contract.cjs:76:11
- renderPayload scripts/render-command-contract.cjs:88:5
- Object.renderCommandContract scripts/render-command-contract.cjs:140:16
- tests/unit/render-command-contract.vitest.ts:100:71
- withInjectionMode tests/unit/render-command-contract.vitest.ts:64:12
- tests/unit/render-command-contract.vitest.ts:100:20
- tests/unit/render-command-contract.vitest.ts:160:49
- tests/unit/spawn-cjs.vitest.ts:49:22
- expectSuccessArgs tests/stress/cli-adapter/fixtures/adapter-suite.ts:110:20
- tests/stress/cli-adapter/fixtures/adapter-suite.ts:246:7
- tests/stress/cli-adapter/fanout.vitest.ts:758:33

## Targeted delta after the gateway landed
 Test Files  3 failed | 2 passed (5)
      Tests  4 failed | 81 passed (85)

Failures in the delta run, all byte-identical to baseline:
- authorized-ledger: serializes concurrent processes into one contiguous unambiguous head
- legacy-projections: closes every JSON-bearing state census row with one owned disposition
- dependency-seams: resolves zod, better-sqlite3, and tsx from the runtime's own node_modules
- dependency-seams: bare-resolves the tsx loader the .cjs scripts boot from

Net: zero regressions, plus 10 new passing tests.
