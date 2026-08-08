# Iteration 2: Persistence and Concurrency Correctness

## Focus

Audit the two forks' state-write behavior under malformed files, concurrent Pi processes, interrupted writes, and non-cooperating file editors.

## Findings

1. `pi-cache-optimizer` serializes writes only inside one extension closure. Its persistent writer performs an unlocked read/merge/temp-write/rename against a shared agent-directory file; two Pi processes can both read the same baseline and the later rename can discard the earlier process's session or total updates. The in-process queue does not protect cross-process writers. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4215] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4264] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6772]
2. A malformed or unreadable current stats file is silently treated as empty during writes: the broad catch at lines 4293-4295 discards the read/parse error, then writes a fresh payload. That turns a recoverable corruption signal into irreversible history loss. Preserve the corrupt file, emit a typed diagnostic, and fail closed or rebuild only from explicit in-memory authority. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4271] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4293]
3. `pi-cache-optimizer` uses process-id plus millisecond timestamps for temporary paths and has no `finally` cleanup around stats/config writes. A rename or write failure can leave sidecars, and multiple extension instances in one process can collide within a millisecond. `deep-pi` already demonstrates the stronger pattern: UUID temp names, exclusive `wx` creation, `fsync`, mode preservation, and cleanup. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1170] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4312] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:58]
4. `deep-pi`'s `edit_lines` protects cooperating same-process writers and detects some non-cooperating changes, but it is not an atomic compare-and-swap: another process can change the target after the expected-content read at lines 83-89 and before rename at line 91; the subsequent rename overwrites that change. The post-rename reread can detect a later replacement but cannot restore content already clobbered by this window. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:83] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:91] [INFERENCE: POSIX rename has no expected-old-content predicate]
5. Existing tests are asymmetric: `deep-pi` has explicit same-process queue and injected rename/chmod race tests, while `pi-cache-optimizer` has no direct tests of `writePersistedCacheStats`, malformed-state preservation, cross-process lost updates, or temp cleanup. [SOURCE: .pi/extensions/deep-pi/tests/review2.test.ts:50] [SOURCE: .pi/extensions/deep-pi/tests/review2.test.ts:108] [INFERENCE: focused repository search found no `writePersistedCacheStats` call in pi-cache-optimizer tests]

## Ruled Out

- Treating atomic rename alone as sufficient concurrency control. It prevents partial target files, not last-writer-wins loss across independent read/merge/write transactions. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4314]
- Replacing all writes with a permanent sidecar lock without stale-owner recovery. That can trade silent loss for permanent deadlock after crashes; any lock design needs owner identity, bounded staleness, and cleanup semantics. [INFERENCE: failure-mode analysis of the shared state path]

## Dead Ends

- The existing `createSerializedAsyncRunner` cannot be extended to protect other Pi processes because its promise tail is process-local. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4215]

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: deep-pi's comments describe robust atomic replacement, but source-level ordering leaves a narrow cross-process TOCTOU; both statements are true at different guarantees.
- Missing dependencies: no platform-wide file-lock primitive is currently declared in either package.
- Partial success: none.

## Sources Consulted

- `.pi/extensions/pi-cache-optimizer/index.ts` persistence and queue helpers
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts`
- `.pi/extensions/deep-pi/tests/review2.test.ts`

## Assessment

- New information ratio: 0.90
- Novelty justification: Four of five findings are new; one partly extends the known atomic-write hardening evidence.
- Questions addressed: correctness/failure isolation and missing tests.
- Questions answered: identified the highest-value persistence correctness gaps and their proof tests.

## Reflection

- What worked and why: tracing the actual write transaction exposed guarantees that filenames and comments alone do not prove.
- What did not work and why: broad test search cannot prove absence by itself; the recommendation is framed as a focused inventory result.
- What I would do differently: build deterministic child-process race fixtures before changing persistence code.

## Recommended Next Focus

Inventory test coverage quantitatively and design high-value negative controls, including cold-start cache writes and the blocked live credential case.
