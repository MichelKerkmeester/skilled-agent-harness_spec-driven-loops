---
title: "Research Synthesis: Improvements to the Packet 039 Pi Forks"
description: "Evidence-backed improvement opportunities for pi-cache-optimizer and deep-pi, reconciled across seven detached research iterations."
contextType: research
status: complete
specFolder: specs/cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements
artifactDir: specs/cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements/research/lineages/luna
sessionId: fanout-luna-1786163355542-f6htbk
executor: cli-codex / gpt-5.6-luna
---

# Research Synthesis

## Verdict

The two forks should remain separate runtime implementations with shared contracts and a shared host-test matrix. The highest-value work is not a rewrite or another current-model guard smoke test. It is a correctness-and-contract pass that makes cache-write accounting, failed-attempt handling, ownership, and report semantics explicit before adding durable economics or extracting modules.

The recommended order is:

1. Fix and test normalized usage semantics at the telemetry boundary.
2. Make ownership and lifecycle behavior executable in a combined-host fixture.
3. Define a versioned, privacy-safe report object and expose the missing subsystem counters.
4. Add persistence health/retention and separate observed cost from counterfactual savings.
5. Re-establish a controlled cold/warm benchmark, then extract narrow maintainability seams and automate vendored-source provenance.

This ordering matters. Measuring savings before cache-write and retry semantics are correct produces plausible but incomparable numbers. Extracting the optimizer before its event lifecycle is covered increases the blast radius without improving evidence.

## Scope and evidence posture

This detached lineage ran all seven planned research iterations under `stopPolicy: max-iterations`. Convergence was telemetry only, as requested; the loop did not synthesize early. The iteration novelty ratios were `0.95, 0.84, 0.78, 0.68, 0.57, 0.43, 0.29`, with an average convergence telemetry score of `0.6486`. The final state contains 28 registered findings, 25 resolved research statements, and no open source questions. [SOURCE: deep-research-config.json] [SOURCE: deep-research-state.jsonl] [SOURCE: findings-registry.json]

Evidence came from the vendored extension source, the two extension test trees, package manifests, and sibling packet acceptance records. No target extension, test, sibling spec, settings file, or runtime state was modified. Both package typechecks were run during the loop and exited 0. The extension test suites were not re-run from this detached lineage because their fixtures create temporary files outside the user-mandated lineage directory; the sibling packets' recorded test receipts are cited where relevant.

The four limitations supplied in the brief are treated as baseline context, not new discoveries:

- DeepPi's full `/deeppi` report body is still not confirmed through `pi --print` or `pi --mode rpc`.
- DeepPi has no persistent stats file.
- One live regression path remains blocked by a missing `opencode` credential.
- pi-cache-optimizer's cold-start cache-write behavior for newly added models remains uncharacterized.

The research adds test seams, data contracts, and measurement plans around those limits without claiming that a blocked live check passed.

## What is already proven

The next work should preserve, not duplicate, the current acceptance baseline.

The optimizer sibling packet records passing typecheck and 25/25 tests, live non-DeepSeek regression, live `opencode/deepseek-v4-flash-free` coverage, zero new optimizer stats for direct DeepSeek, vendored resolution, and rollback. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:113-132]

The DeepPi fix packet records a 60-test final suite, clean typecheck, negative controls for the provider guard and unrecognized-model warning, and the corrected telemetry/report fixes. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/implementation-summary.md:97-110]

The DeepPi live packet records a real direct round-trip and unaffected regressions for `opencode-go` and `openai-codex`. It also records the partial RPC observation and the missing `opencode` credential. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:102-124]

These receipts prove the current boundary. They do not prove future model-ID ownership, both extensions loaded together, pure cache-write accounting, retry filtering, malformed usage handling, full report transport, or controlled economics.

## Priority findings

### P0 — Correctness gates

#### 1. Normalize cache usage once, including pure writes

DeepPi rejects a usage sample when `input + cacheRead === 0`, even if `cacheWrite` is positive. It increments miss tokens from `input` only, excludes cache writes from its denominator, and excludes cache-write cost from actual input economics. A first request represented as `input=0, cacheRead=0, cacheWrite=N` can therefore become “usage unavailable” instead of a measured cold write. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-10,47-67]

The optimizer already treats `cacheRead` or `cacheWrite` as a cache signal and reconstructs `totalInput` as `input + cacheRead + cacheWrite`. Its aggregate stats retain cache-write and total-input counters. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2147-2168,3630-3651]

Use one explicit accounting contract in tests and reports:

```text
totalPromptTokens = uncachedInput + cacheRead + cacheWrite
tokenHitRate       = cacheRead / totalPromptTokens
cacheWriteShare    = cacheWrite / totalPromptTokens
uncachedShare      = uncachedInput / totalPromptTokens
```

All rates should be `unknown` when the denominator is zero or the sample is invalid. Request hit rate and token hit rate should be reported separately. This is the concrete test for the supplied cold-start limitation.

#### 2. Separate successful economics from failed and aborted attempts

DeepPi records matching usage-bearing `message_end` events without checking `stopReason`. The optimizer explicitly skips `error` and `aborted` messages because Pi can emit a failed attempt before a successful retry. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:130-185] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7566-7577]

The safe contract is to exclude failed/aborted attempts from successful cache economics, while incrementing a separate failed-attempt counter. A deterministic fixture should cover: failed with zero usage, failed with nonzero usage, aborted, successful retry, and user abort. This prevents retry cost and cache ratios from being silently mixed.

#### 3. Validate numeric usage at the boundary

DeepPi mutates counters from the incoming numeric shape without finite/nonnegative validation. The optimizer has defensive nonnegative-number helpers and tracks missing usage samples. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47-67] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2151-2168,370-382]

Reject negative, `NaN`, and infinite token/cost fields before mutation. Track `invalidUsageSamples` and `usageUnavailable` separately. Keep raw provider payloads out of the state file.

#### 4. Make ownership a contract, not two drifting literals

DeepPi exports `DEEPPI_MODEL_IDS` and gates on direct provider plus exact ID. The optimizer independently repeats the two IDs in `isDeepPiOwned` and returns before its model-specific hooks. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-17] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275-1281,7279-7304,7540-7542]

Keep exact opt-in matching; broad `deepseek` name matching would incorrectly exclude provider aliases such as `opencode/deepseek-v4-flash-free`. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:100-108]

Create a small ownership matrix containing provider, model ID, owner, excluded hooks, and negative aliases. Use it in a combined-host test that loads both extensions. A shared data contract is justified; a shared runtime implementation is not.

### P1 — Test and observability closure

#### 5. Add boundary tests where the production paths are currently unproven

DeepPi has focused module and integration tests, but the telemetry fixtures use `cacheWrite: 0` and do not cover pure writes, malformed numbers, or failed/aborted usage-bearing messages. [SOURCE: .pi/extensions/deep-pi/tests/telemetry.test.ts:20-38,40-52,142-226] The FakePi harness captures UI notifications and statuses but has no RPC/stdout channel. [SOURCE: .pi/extensions/deep-pi/tests/fake-pi.ts:36-61]

The optimizer suite covers prompt reordering, ownership detection, footer scopes, compatibility parsing, JSONC repair, and the fix command. It does not drive the production `message_end` accounting path through restart and persisted reload. [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:10-887] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2147-2277,4066-4103,7279-7577]

Add three focused harnesses:

- DeepPi telemetry matrix: warm read, pure cold write, mixed read/write, malformed numeric fields, failed attempt, aborted retry, successful retry.
- Optimizer lifecycle harness: `session_start` → `message_end` → debounced flush → `session_shutdown` → restart/read, including malformed state and legacy migration.
- Combined-host contract harness: register both extensions and assert exactly one owner for direct DeepSeek IDs, optimizer behavior for non-owned providers, and no double mutation.

Hashline race coverage is already strong. It includes atomic replacement, snapshot races, symlink safety, collision resistance, overlapping edits, and mixed message ordering. [SOURCE: .pi/extensions/deep-pi/tests/hashlines.test.ts:18-179] [SOURCE: .pi/extensions/deep-pi/tests/review2.test.ts:51-217] More tests there are lower value than the host/lifecycle seams above.

#### 6. Make reports complete, structured, and transport-testable

DeepPi maintains `errorsEnhanced` in storm-breaker state and `prunedThinking`/`preservedThinking` in stability state, but the root report passes only transform errors, guard/abort counts, and hashline counters. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts:25-52,140-158] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stability.ts:140-155,170-204] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64-80]

Both forks return human-formatted strings through `ctx.ui.notify`; neither defines a versioned machine-readable report object. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:94-118] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3747-3783,7659-7705]

Define a privacy-safe `schemaVersion: 1` object first, then render text from it. Minimum fields:

- provider/model identity and eligibility;
- request, successful-response, failed-attempt, and aborted counts;
- uncached input, cache-read, cache-write, and total input tokens;
- request hit rate, token hit rate, cache-write share, and explicit missing-data markers;
- provider-reported actual cost and separately labeled counterfactual savings;
- transform, guard, abort, error-enhancement, edit, and prefix-churn counters;
- persistence status, last successful flush, and retention mode.

Add a JSON/RPC command mode and a text projection. Keep prompts, payloads, headers, API keys, and model outputs out of both. The existing optimizer sample contract already states this privacy boundary. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:370-382]

#### 7. Decide retention and persistence health explicitly

DeepPi resets all telemetry on `session_start` and has no filesystem state. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46-58] The optimizer persists aggregate buckets but keeps at most 50 recent numeric samples per model in memory only. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:350-385,7614-7642]

Choose one bounded retention design for optimizer trends: persist a numeric ring buffer with versioned truncation, or persist rolling 10/30-request aggregates plus missing-field counts. The aggregate option minimizes writes and is likely sufficient for diagnosing cold starts and proxy regressions.

When optimizer persistence fails, it logs and emits a one-time warning, then continues in memory. It does not retain durable health state. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7007-7052]

Expose `lastSuccessfulWrite`, `consecutiveWriteFailures`, `pendingFlush`, and `memoryOnly` as booleans/numbers in the report. Do not persist exception text or secret-bearing paths. If DeepPi gains persistence, use the same versioned codec and atomic temp-file/rename discipline already used by the optimizer. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4264-4316]

### P2 — Economics and measurement

#### 8. Separate observed cost from counterfactual savings

DeepPi's `actualInputCost` uses Pi-reported `usage.cost.input + usage.cost.cacheRead`, while `estimatedSavings` uses model-configured rates multiplied by cache-read tokens. Its usage contract also contains output and cache-write costs, but the report does not expose them. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-16,47-67,94-118]

Keep provider-reported actual cost authoritative for observed spend. Add separately labeled counterfactual fields for:

```text
uncachedInputCost = totalPromptTokens * uncachedInputRate / 1,000,000
cachedInputCost   = uncachedInput * uncachedRate
                  + cacheRead * cacheReadRate
                  + cacheWrite * cacheWriteRate
inputSavings      = uncachedInputCost - cachedInputCost
```

Expose output cost separately. Mark the counterfactual unavailable when rates or reconciliation are invalid. Do not silently replace provider-reported costs with local estimates.

The optimizer is multi-provider and intentionally token-only: `CacheStats` has request and token fields but no price metadata. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:222-229,3645-3670] That is a sound default. If dollar economics are needed, add an explicit per-model pricing registry with currency, unit, and effective date; never infer rates from model names or proxy families. Historical totals must retain the rate identity used to derive them.

#### 9. Publish metric definitions before comparing the forks

DeepPi's current hit rate is `cacheRead / (cacheRead + input)`, while optimizer output distinguishes hit requests, cached tokens, cache-write tokens, and total input. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:19-24,60-72] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:222-229,3645-3670]

The same headline percentage is not safely comparable across forks until the denominator is named. Report request hit rate and token hit rate separately, include cache writes in total prompt tokens, and show `unknown` rather than zero for missing usage.

#### 10. Build a controlled benchmark before making performance claims

The source records sample timestamps but no request duration or hook-overhead metric. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:375-385,7614-7621] DeepPi declares `benchmark:live`, but `scripts/live-benchmark.mjs` is absent. [SOURCE: .pi/extensions/deep-pi/package.json:51-56]

The benchmark should replay a fixed prompt sequence in four modes:

1. Both extensions disabled.
2. Enabled first request/cold write.
3. Enabled warm read.
4. Mixed failed/aborted retry and successful retry.

Capture request count, cache-read/write/uncached tokens, provider-reported cost, counterfactual cost if configured, wall-clock latency, and blocked prerequisites. Repeat enough turns to separate cold-start effects from network variance. Report medians and distributions, not a single response. The prior live records explicitly limit themselves to one-request or partial-observability evidence. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:85-92,141-143] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:102-124]

### P3 — Maintainability and release discipline

#### 11. Extract narrow optimizer seams, not the whole file

The optimizer entrypoint is 8,390 lines and contains prompt rewriting, provider adapters, usage normalizers, persistence migration, routing protocols, diagnostics, commands, and lifecycle hooks. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1-115,2613-2640,6468-6705,7279-8386]

The lowest-risk extraction order is provider adapters/normalizers, persisted stats codec, then lifecycle accounting. Keep prompt transformations and router protocols separate. Add lifecycle tests before moving code. A full rewrite is not supported by the evidence.

#### 12. Give DeepPi subsystems explicit reset/snapshot contracts

DeepPi is already modular, but its root entrypoint manually resets subsystem fields and selects report fields. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:1-7,42-80] A typed `reset()`/`snapshot()` boundary per subsystem would make omitted counters harder to introduce and reduce root-level wiring churn.

#### 13. Automate vendored provenance checks

The sibling optimizer packet records two byte-identical copies with no automatic synchronization; future upstream fixes must be manually diffed and reapplied. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:137-143] DeepPi's vendoring summary records the same byte-for-byte operational-copy model. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/002-vendor-and-repoint/implementation-summary.md:48-65]

Record upstream repository, source commit, local patch purpose, and operational path in package metadata or a provenance file. Add a read-only drift check when the source snapshot is available. Keep the vendored copy authoritative and require an intentional review for updates.

## Staged implementation plan

| Stage | Scope | Pass/fail evidence | Findings addressed |
|---|---|---|---|
| 1. Accounting and ownership | Normalize cache read/write/input, reject invalid numbers, filter failed attempts, establish ownership matrix | Deterministic fixtures pass for cold write, malformed fields, failed retry, and provider/model matrix; no double owner | F-005–F-008, F-024, F-028 |
| 2. Host and lifecycle tests | Combined-host fixture, optimizer event lifecycle, restart/migration, DeepPi report transport adapter | Both extensions load together; one owner per route; stats survive/restore as designed; RPC/JSON fixture is machine-readable | F-009–F-013, F-026–F-027 |
| 3. Reports and persistence | Report schema v1, missing counters, retention policy, persistence health | Text and JSON projections agree; missing data is explicit; failure/recovery state is visible without sensitive content | F-014–F-017, F-023 |
| 4. Economics and benchmark | Observed versus counterfactual cost, optional pricing, four-mode replay, latency | Denominators are documented; cold/warm/retry measurements are repeatable; blocked credentials are reported as blocked | F-018–F-021 |
| 5. Narrow architecture and provenance | Extract adapter/codec/lifecycle seams; add source provenance and drift check | Focused tests stay green; source commit and operational copy are traceable; no broad behavior change | F-022, F-025 |

## Negative knowledge and explicit non-recommendations

- Do not broaden DeepPi from exact direct model IDs to all names containing `deepseek`.
- Do not merge both extensions into one runtime implementation.
- Do not persist prompts, provider payloads, headers, API keys, or model outputs.
- Do not infer prices from model names, adapter names, or proxy families.
- Do not treat a UI notification capture as proof of non-interactive RPC/stdout delivery.
- Do not repeat the current two-model guard smoke test as the main next step; sibling packets already contain that evidence.
- Do not call a missing credential, missing benchmark script, or incomplete RPC observation a resolved live result.

## Final handoff

The research is complete at the lineage level. Implementation remains intentionally out of scope. The next implementation packet should start with Stage 1 and carry forward the exact evidence map and pass/fail gates in this report.
