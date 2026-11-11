# Iteration 5: Ledger cache and gateway read behavior

## Focus
What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?

## Actions Taken
1. Searched the packet and current runtime for the ledger read-cache option, gateway scan/read call sites, and focused cache tests.
2. Read the cache option contract, AppendOnlyLedger read/append paths, its existing long-lived caller, and the cache-specific unit tests.
3. Traced the CLI gateway preflight, retry, locked append, and projection reads.
4. Compared the current code with the packet’s production-change scope and prior timing summary.

## Findings
1. The singleWriterReadCache option is opt-in and defaults off. Its documented safety condition is that the ledger instance remains the sole writer for its lifetime: a cache hit skips the cross-process lock, so another process’s append can remain invisible until a miss triggers a rescan. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:104] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:383] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:399]
2. The cache is already enabled for the long-lived per-lineage effect ledger, whose source says it has one owning process. Its focused unit tests assert that repeated reads avoid extra locks, an instance’s own append invalidates the memo, cached events and heads match lock-per-read results, and the default-off path locks on every read. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:411] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:420] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:130] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:154] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:164] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:198]
3. The CLI gateway leaves the cache option unset (therefore default-off) and performs freshness-sensitive reads around the append: it reads a current head before event preparation; the gateway reads verified events for provenance and idempotency and a verified head before authorization; the append rescans under the exclusive lock; projection then reads the head and events again. These reads support replay detection, current-head authorization and fencing, and refreshed state, so removing them requires a measured design that preserves those contracts. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:261] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:307] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:507] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:541] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:432] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:668]
4. The packet excludes additional production changes that alter runtime behavior and records that fixture sharing was a test-only cut. The current code’s existing single-writer cache does not contradict that boundary: it is already present and narrowly used, while a new gateway cache or rescan reduction remains unproven. Justify another production change only with profile evidence that the affected scans materially contribute to the target suite and with separate tests for stale cross-process reads, append visibility, fencing and retries, and projection parity; keep test-fixture reuse in a test-only change. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:72] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81] [INFERENCE: based on the ledger cache contract and gateway call sequence above]

## Questions Answered
- Production cache or gateway-rescan changes need measured evidence of a material contribution to the target test run, plus correctness evidence for the single-writer boundary and the gateway’s freshness, fencing, retry, and projection contracts. Test-only fixture reuse remains a separate lower-risk path.

## Questions Remaining
- No before/after wall-time or scan-duration profile for these gateway operations is present, so no speed-up is claimed.
- The smaller-runner tradeoff remains open.

## Next Focus
How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?

## Ruled Out
- Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers.
- Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher.
- Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior.

## Dead Ends
- Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the packet says profile-proposed ledger caching was left out, while current code contains an opt-in cache and a single-writer call site. Read consistently as no additional cache cut was adopted in the five speed changes; the existing bounded implementation remains. The steering file was checked and absent.
- State consistency: iteration 4’s gateway record has answeredQuestions empty, while the reducer registry marks the import-time key question resolved at iteration 4 and retains its exact-module residual. The reducer-owned state was not edited; the discrepancy is recorded here.
- Missing dependencies: no profile attributes runtime cost to the gateway scans.
- Partial success: mapped current behavior, the safe-use condition, and the evidence needed for a new change; no performance benefit was measured.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:98-114
- .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:372-405,432-440,514-518
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:411-428
- .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:130-211
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:258-277,307-317
- .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:507-541,616-669
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:72-75
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.88 (three findings add current code facts; the fourth reconciles those facts with the packet boundary and separates evidence standards).
- Questions addressed: What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
- Questions answered: What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
- Source inspection found no timing measurement for gateway reads; no speed-up is claimed.

## Reflection
- What worked and why: reading the option contract, only enabled caller, focused tests, and gateway flow showed where a cache is safe and which fresh reads protect the write path.
- What did not work and why: the packet’s short note does not distinguish the existing single-writer cache from additional gateway changes; source-level scan counts also do not establish elapsed time.
- What I would do differently: profile scan duration and call counts in the actual test workload before deciding whether any further production change is worth its runtime risk.
- durationMs records elapsed wall time since the previous iteration gateway append, including reducer and orchestration time.

## Recommended Next Focus
How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?
