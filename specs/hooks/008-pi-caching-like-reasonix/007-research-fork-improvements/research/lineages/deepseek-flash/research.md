# Research Synthesis: deepseek-flash Lineage — Further Improvements to the Packet 008 Pi Forks

## 1. Executive Summary

This is the **4th independent lineage** in a completed 3-lineage fan-out (sol/luna/grok) for packet `007-research-fork-improvements`. It re-read both forks' source directly and did **not** restate the parent synthesis. Its contribution is threefold: (1) exact-line corroboration of the parent Tier 1 set from its own read, (2) several genuinely new mechanisms the parent did not name, and (3) two corrections to parent claims — one severity overstatement and one stale-counter refutation that was itself wrong.

The single highest-value new finding: **deep-pi's establishing cache write is entirely invisible to its own telemetry** — the first request of every session (`input: 0, cacheRead: 0, cacheWrite > 0`) is silently dropped *and* flips `usageUnavailable` to true for the rest of the session. The parent flagged cold-start writes as "uncharacterized" for pi-cache-optimizer; for deep-pi the behavior is now characterized, and it is a silent data-loss bug in the telemetry the report advertises. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:52]

## 2. Research Question and Scope

Topic: concrete, evidence-based improvement opportunities in correctness, test coverage, telemetry/observability, cost-economics, and maintainability for the two forked Pi extensions. This lineage independently read `.pi/extensions/pi-cache-optimizer/` and `.pi/extensions/deep-pi/` (4 iterations, 20 findings, 5 per iteration), treating the parent synthesis as a hypothesis set to corroborate or refute, not as ground truth.

Method per iteration: corroborate a parent claim with exact current line numbers, then look for a new mechanism the parent did not name. Iterations: (1) Tier 1/2 corroboration, (2) correctness + test coverage, (3) telemetry + cost-economics (with a live 2026-08-08 DeepSeek pricing fetch), (4) maintainability + genuinely new surface. Writes were confined to `research/lineages/deepseek-flash/`.

## 3. Corroboration Summary (parent Tier 1/2, confirmed from this lineage's own read)

| Parent finding | This lineage's evidence | Verdict |
|---|---|---|
| Ownership predicate duplicated in both forks | `eligibility.ts:1-4` (`DEEPPI_MODEL_IDS`) vs `index.ts:1279-1281` (`isDeepPiOwned`, identical pair) | Corroborated |
| `/deeppi` report is UI-notify-only | `deeppi.ts:64-82` routes the full report exclusively through `ctx.ui.notify` | Corroborated |
| deep-pi has no persistent stats file | `telemetry.ts:123-128` resets in-memory state on every `session_start` (`deeppi.ts:46-58`); pi-cache-optimizer persists versioned buckets (`index.ts:4066-4103`) | Corroborated |
| Savings arithmetic omits cache-write cost | `telemetry.ts:52` drops pure-cache-write usage; `telemetry.ts:65-66` ignores `cacheWrite`; pco tracks `cacheWriteInputTokens` (`index.ts:3645-3651`) | Corroborated, mechanism sharpened |
| Missing boundary/fault-injection/composition tests | pco has one 887-line test file with no persistence/restart test; deep-pi's `telemetry.test.ts` never uses `cacheWrite > 0` | Corroborated |
| deep-pi `benchmark:live` script missing | `scripts/` directory absent (`ls` → no such directory) | Corroborated |
| pco stats persistence has no cross-process concurrency control | `index.ts:4264-4321` read-merge-rename, no lock; `pid.DateNow().tmp` temp name | Corroborated |
| Vendored provenance fully manual | Both `package.json` manifests retain upstream author/repo metadata | Corroborated |
| pco is an 8,390-line monolith | single `index.ts`, single test file | Corroborated |

## 4. New Findings (beyond the parent synthesis)

1. **deep-pi's establishing cache write is invisible and flips `usageUnavailable` permanently** — a message with `input: 0, cacheRead: 0, cacheWrite > 0` hits the `recordUsage` availability check and is dropped from counters while setting `usageUnavailable = true` for the whole session. The first request of every conversation is exactly this shape. [SOURCE: telemetry.ts:52]
2. **The `message_end` `stopReason` gap has a concrete wrong-output consequence** — a failed/aborted attempt (which pi-cache-optimizer explicitly skips at `index.ts:7576-7579`) flips the same `usageUnavailable` flag, so the report can show "Usage unavailable: true" for an otherwise healthy session. [SOURCE: telemetry.ts:135] [SOURCE: index.ts:7576]
3. **`edit_lines` validates only range endpoints** — an in-place interior-line modification (same line count) between read and edit passes both endpoint hashes and is silently overwritten. `validateEdits` (`hashlines.ts:403-443`) has no interior coverage; no test exercises this scenario. [SOURCE: hashlines.ts:403]
4. **deep-pi's `before_provider_request` digests the entire conversation on every request** — `structuredClone` + `sortProviderTools` + per-message sha256 (`stability.ts:192-206`, `104-123`), with `previousShape.messageDigests` growing unboundedly per session. Hot-path O(conversation) hashing purely to compute the `latestChurn` diagnostic. [SOURCE: stability.ts:192]
5. **The composition-test seam exists but the forks use divergent test runners** — deep-pi's `FakePi` + `deeppi.integration.test.ts` drives the real extension, the exact harness a combined-host test needs; pco runs node:test via `jiti` while deep-pi runs vitest. A runner decision must precede the P0 composition test. [SOURCE: deeppi.integration.test.ts:1] [SOURCE: pi-cache-optimizer/package.json:22]
6. **`benchmark:live` is doubly broken** — the script is missing *and* deep-pi's `files` allowlist (`["LICENSE", "README.md", "extensions", "tsconfig.json"]`) would exclude a `scripts/` dir from `npm pack` even if added. [SOURCE: package.json:30,44]
7. **The read-only `/deeppi` report command mutates telemetry state** — `telemetry.latestChurn = stability.latestChurn` (`deeppi.ts:67`) couples two modules' state from a render-only command; a structured-report refactor must explicitly break it. [SOURCE: deeppi.ts:67]
8. **Cold-start cache-write behavior is now characterized for both forks** — deep-pi: dropped (finding 1); pi-cache-optimizer: fully instrumented (`totalInput = input + cacheRead + cacheWrite`, `index.ts:2228`; `emptyCacheStats` seeds zeros for new models) but never measured. The parent's "uncharacterized" gap is now a measurement gap, not an instrumentation gap. [SOURCE: index.ts:2228]

## 5. Corrections to the Parent Synthesis

| Parent claim | Correction | Evidence |
|---|---|---|
| deep-pi's `edit_lines` CAS has a TOCTOU gap (Tier 2 #7 framing) | **Severity overstated.** `atomicWriteFile` already verifies landed content post-rename and refuses to report success on drift (`hashlines.ts:96-101`). The residual window is narrow; the correct framing is "verified-but-not-prevented," not "silent lost update." The parent's pco-stats version of the race (no such verification) is the accurate one. | hashlines.ts:91 |
| luna `f-014`: deep-pi omits `errorsEnhanced` from the report | **Stands.** This lineage's iteration-1 claim that "`errorsEnhanced` does not exist" was a false negative caused by grepping the wrong module. It lives in `stormbreaker.ts:33,144` and is not wired into `deeppi.ts:64-82`. Also omitted: `prunedThinking`, `preservedThinking` (stability). | stormbreaker.ts:144; deeppi.ts:75 |
| (parent Tier 1 #5) "No test loads both extensions together" | **Refined:** the harness for exactly that test already exists (`FakePi`); the actual blocker is the runner divergence (finding 5). | deeppi.integration.test.ts:1 |

## 6. Decision and Priority Ranking

This lineage endorses the parent's P0/P1/P2 ordering and adds four items to it:

1. **P0 — add the `stopReason` guard + fix the `usageUnavailable` side effect** in deep-pi's `message_end` (port pi-cache-optimizer's `index.ts:7576-7579` pattern). Cheap, copyable, fixes a live misreport.
2. **P0 — combined-host composition test**, unblocked by first choosing a test runner (vitest recommended: deep-pi already uses it; pco's node:test suite can be wrapped or gradually migrated).
3. **P1 — deep-pi persistent stats file** built on its own `atomicWriteFile` (write-queue + post-rename verification), versioned schema, session + cumulative-daily scope — deliberately *not* a copy of pco's racy read-merge-rename.
4. **P1 — structured report data separated from rendering and transport**, breaking the `telemetry.latestChurn` command-side-effect coupling in the process.
5. **P1 — cold-start crossover fixture** for both forks (deep-pi currently cannot even observe the establishing write; pco can, it just hasn't been run).
6. **P1 — honest cost labels**: `estimatedSavings` is a no-cache counterfactual; DeepSeek v4 bills writes at the cache-miss price (no separate write tier), so write cost is real and should be included when Pi reports it.
7. **P2 — fix `benchmark:live` doubly**: restore `scripts/live-benchmark.mjs` AND add `scripts` to the `files` allowlist, then make the package test prove both (dry-run).
8. **P2 — bound deep-pi's per-request prefix digesting** (memoize on a conversation-length/pointer, or cap `messageDigests` retention).
9. **P2 — surface `errorsEnhanced`, `prunedThinking`, `preservedThinking`** in the report — mechanical, matches the already-applied `costMathErrors` fix shape.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Shared runtime ownership module | Would couple two independently-packaged extensions; a test fixture is the right seam | eligibility.ts:1 / index.ts:1279 | 1 |
| `errorsEnhanced` "does not exist" | False negative; the counter exists in stormbreaker and is simply un-surfaced | stormbreaker.ts:144 | 1, 4 |
| Treating post-rename verification as strict CAS | Detects races after the fact; cannot prevent a mixed-file state | hashlines.ts:91 | 2 |
| Shared single stats file for both forks | Couples failure domains and privacy boundaries | persistence analysis | 3 |
| Copying pco's read-merge-rename into deep-pi | Would import the known race instead of reusing deep-pi's superior `atomicWriteFile` | index.ts:4264 vs hashlines.ts:41 | 3 |
| Treating the test-runner difference as a non-issue | A combined-host test cannot be written once under both current setups | package.json scripts | 4 |
| Changing report transport before separating data from rendering | The report command's state mutation is only safe while the report is the sole consumer | deeppi.ts:67 | 4 |
| A separate DeepSeek cache-write price tier | None exists in v4 pricing; write cost is the cache-miss price | api-docs.deepseek.com pricing | 3 |

## 7. Open Questions (carried to the parent)

- Does Pi's `usage` record reliably report `cacheWrite` for direct DeepSeek, or does the `getDeepSeekRawUsage` `cacheWrite: 0` fallback (`index.ts:2174-2186`) hide real writes from both forks?
- How many concurrent Pi processes actually share the cache-optimizer stats file in real deployments (justifying the P0 lock work)?

## 8. Known-Limitation Advancement

| Parent/006 limitation | Advancement from this lineage |
|---|---|
| `/deeppi report` full body not available non-interactively | Corroborated the UI-notify coupling; the fix seam is the report-command side effect plus a structured-report refactor |
| deep-pi keeps no persistent stats file | Provided the concrete design: reuse `atomicWriteFile`, versioned schema, session + cumulative-daily scope |
| One live regression check blocked by missing opencode credential | Deep-pi's `FakePi` integration harness already proves routing locally without credentials — the pattern should extend to the combined-host test |
| Cold-start cache-write behavior uncharacterized | Now characterized for both forks: deep-pi drops it silently (bug), pco is instrumented-but-unmeasured |

## 9. Testable Acceptance Conditions

- deep-pi records zero responses and leaves `usageUnavailable` false for a `message_end` with `stopReason: "error"`/`"aborted"` and for a pure-cache-write message.
- `validateEdits` rejects an edit whose interior lines changed since the source read (endpoint hashes match, interior differs).
- A combined-host run of both extensions on one `FakePi` activates exactly one extension per model id.
- `npm pack --dry-run` includes `scripts/live-benchmark.mjs` once it exists.
- `/deeppi` report output and a future JSON snapshot derive from one structured report object; the command has no state mutation.
- `before_provider_request` digests at most a bounded prefix per request.
- The report surfaces `errorsEnhanced`, `prunedThinking`, and `preservedThinking`.

## 10. Convergence Report

- Stop reason: `maxIterationsReached` (stop policy `max-iterations`)
- Total iterations: 4 / 4
- Questions answered: 6 / 6
- Remaining tracked questions: 0
- New-info ratios: 0.8 → 0.75 → 0.8 → 0.85
- Rolling avg (last 3): 0.80 (above threshold; signal CONTINUE)
- MAD noise floor: 0.037 (latest 0.85 above floor; signal CONTINUE)
- Question entropy: 6/6 = 1.00 (signal STOP)
- Composite stop score: 0.00 (no STOP votes weighted above 0.60)
- Threshold treated as telemetry only: per the configured stop policy, the loop ran the full 4 iterations and broadened angles instead of synthesizing early.
- Divergence: none (no pivot events; breadth via focus rotation).

## 11. References

### Local primary evidence

- `.pi/extensions/pi-cache-optimizer/index.ts` (lines 1279, 2228, 3645, 4066, 4264, 7576)
- `.pi/extensions/pi-cache-optimizer/package.json`
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`
- `.pi/extensions/deep-pi/extensions/deeppi.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/stability.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts`
- `.pi/extensions/deep-pi/tests/deeppi.integration.test.ts`
- `.pi/extensions/deep-pi/tests/telemetry.test.ts`
- `.pi/extensions/deep-pi/package.json`
- `.pi/extensions/deep-pi/README.md`

### External primary evidence

- DeepSeek, [Current pricing](https://api-docs.deepseek.com/quick_start/pricing) (fetched 2026-08-08)
