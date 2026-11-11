# Iteration 4: Do the ledger read-caching ideas buy measurable time, and what risk do they carry

## Focus

The packet's fourth open item is the ledger read caching that read-only reviews proposed — `singleWriterReadCache` and the gateway's rescans — and deliberately left out because it changes runtime behavior. This iteration asked two things: whether that caching would buy measurable time on the test path, and what a reader would risk by extending it.

## Actions Taken

1. Located `singleWriterReadCache` and read its implementation in `AppendOnlyLedger`, including where the memo is populated and where it is dropped.
2. Checked whether the gateway enables it, and read the gateway's bootstrap.
3. Walked the gateway's dynamic import graph and checked for a compiled `dist/` fallback.
4. Counted how many test files spawn the gateway and how often.
5. Read the existing `ledger-read-cache` test to see what is already proven.

## Findings

1. `append-mode-event.cjs` is a TSX bootstrap: when `DEEP_LOOP_TSX_LOADED` is unset it re-executes itself as a child process with `--import tsx`, because every real module it needs is a `.ts` source. One gateway append therefore costs two node processes before any ledger work starts. `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:15]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:20]`
2. The gateway's dynamic import graph is 79 modules and 1.09 MB of TypeScript, all of it loaded through tsx because the deep-loop runtime has no `dist/` directory at all — there is no compiled path to fall back on. `[SOURCE: measured: static import-graph walk of append-mode-event.cjs → 79 modules, 77 .ts files, 1089 KB]` `[SOURCE: measured: ls .skilled/skills/system-deep-loop/runtime/dist → No such file or directory]`
3. `singleWriterReadCache` is a per-process memo of one verified scan. A hit returns the memoized head and events without re-taking the lock; a miss takes the lock, scans, and memoizes. Every append nulls the memo, because the append changed the verified head. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:389]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`
4. The gateway never enables the cache, and enabling it there would not help: one gateway invocation is one process that performs one append, and the append is exactly what invalidates the memo. The only saving would be the second read before the append, not the rescans the packet's note implies. `[SOURCE: measured: grep singleWriterReadCache over scripts/append-mode-event.cjs and lib/mode-append-gateway → no matches]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`
5. The cache is already adopted where it does pay: `fanout-effect-dispatch.ts` constructs its ledger with `singleWriterReadCache: true`, which is the long-lived-reader shape the memo was built for, and `ledger-read-cache.vitest.ts` already asserts that the domain read lock is taken once rather than once per read. So the proposal in the packet is not an unbuilt idea; it is built, tested, and enabled at its one useful call site. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:420]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:71]`
6. The gateway path is tens of spawns, not hundreds: 13 test files reference `append-mode-event`, at most four references each. Its cost is bounded, but every one of those spawns pays finding 1's double process and finding 2's 79-module load. `[SOURCE: measured: grep -rc append-mode-event over runtime/tests → 13 files, max 4 per file]`

## Ruled Out

- **Enabling `singleWriterReadCache` in the gateway.** One append per process plus a nulled memo on append leaves nothing to reuse. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`
- **Extending the cache across appends.** A memo that survives an append would let a reader return a head another writer already advanced, which is the durability contract the ledger exists to enforce.
- **Treating the caching idea as unbuilt work.** It is built, has its own test, and is enabled where a process reads repeatedly.
- **Blaming fsync for the ledger tests' time.** The fsync is one `appendFileSync` per event; the double process and the 79-module load happen once per invocation and dominate a short test.

## Dead Ends

- No compiled `dist/` exists for the deep-loop runtime, so there is no cheap alternative to tsx loading today; building one is a packaging change, not a test change, and is out of this packet's scope.

## Edge Cases

- Ambiguous input: "ledger read caching ideas" was read as the `singleWriterReadCache` option and the gateway's read scans, not as a general caching mandate.
- Contradictory evidence: the packet says caching was "left out", while the code shows it implemented and enabled at one call site. Both are recorded: the packet's statement is true of the gateway path, and finding 5 corrects the broader reading.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:15`
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:20`
- `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:389`
- `.skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:420`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:71`
- measured: static import-graph walk of `append-mode-event.cjs` → 79 modules, 77 `.ts` files, 1089 KB
- measured: `ls .skilled/skills/system-deep-loop/runtime/dist` → absent
- measured: `grep -rc append-mode-event` over `runtime/tests` → 13 files, max 4 references each

## Assessment

- New information ratio: 0.95
- Questions addressed: Q4 (ledger read caching: does it buy time, what risk does it carry)
- Questions answered: Q4

## Reflection

- What worked and why: reading where the memo is invalidated answered the question in one function. A cache that is dropped on every write cannot serve a write-per-process path, and that is a code fact rather than an argument.
- What did not work and why: the packet's framing implied the caching was unbuilt, so the first read was aimed at a feature that already exists. Reading the option's default and its one caller corrected the premise.
- What I would do differently: check for an existing implementation before modelling a proposed one, because a proposal recorded in a packet may already have shipped.

## Recommended Next Focus

Take Q5, the smaller-CI-runner question, because every saving proposed so far is a parallelism saving and the packet's own limitation 2 says a smaller runner gains less from parallel files. The answer should rank the surviving cuts by whether they help on 2 cores as well as on 18, and name the measurement that would settle each.

## Questions Answered

- Do the ledger read-caching ideas (singleWriterReadCache, gateway rescans) buy measurable time, and what runtime risk do they carry?

## Questions Remaining

- 2 of 5 key questions remain open.
