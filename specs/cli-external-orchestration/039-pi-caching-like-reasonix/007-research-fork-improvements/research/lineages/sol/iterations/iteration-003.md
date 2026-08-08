# Iteration 3: Test Coverage and Executable Evidence Gaps

## Focus

Map the current suites to runtime responsibilities, find broken verification surfaces, and specify tests that reproduce the open limitations without depending entirely on paid credentials.

## Findings

1. `deep-pi` advertises an opt-in live benchmark in both README and `package.json`, but the vendored tree has no `scripts/live-benchmark.mjs`, and `package.json#files` excludes `scripts` even if the source existed upstream. The package test asserts only that the broken command string is present. This makes the documented cost-validation path non-executable. [SOURCE: .pi/extensions/deep-pi/README.md:43] [SOURCE: .pi/extensions/deep-pi/package.json:36] [SOURCE: .pi/extensions/deep-pi/package.json:56] [SOURCE: .pi/extensions/deep-pi/tests/package.test.ts:8]
2. `pi-cache-optimizer` has 25 static test cases for an 8,390-line runtime, concentrated in prompt movement, footer mode, compat precedence, JSONC repair, and the DeepPi boundary. There are no direct calls to its exported `writePersistedCacheStats`/`readPersistedCacheStats`, no adapter-normalization matrix, and no end-to-end `message_end` persistence test. Raw case count is not coverage, but the responsibility-to-test map exposes specific blind spots. [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:10] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6715] [INFERENCE: repository-wide test symbol inventory]
3. The cold-start question needs two layers. A deterministic adapter test should feed first-response usage with `cacheRead=0`, nonzero `cacheWrite`, and a new model key, then verify session/process/total buckets plus persistence. A paid/live probe should use a never-before-seen model/session key and record request 1, request 2, and restart behavior. Current code records cache writes for all adapters but only renders write tokens in the footer for adapters with `showCacheWrite` (currently Claude), so the test must inspect structured stats rather than footer text alone. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3645] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2635] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7630]
4. The missing OpenCode credential should no longer block the whole boundary contract. Add a credential-free local fake-provider integration that drives Pi's real event shape for `opencode/deepseek-v4-flash-free` and asserts: no DeepPi warning/tool activation, cache-optimizer stats increment, and no direct-DeepSeek ownership guard. Keep a separately labeled real-provider smoke as environment-dependent evidence. [SOURCE: .pi/extensions/deep-pi/tests/fake-pi.ts:1] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/tasks.md:60]
5. Coverage reporting is absent from both packages' scripts and dependencies. Introduce statement/branch/function thresholds only after the source is split into coherent modules; applying one aggregate threshold to the 8,390-line cache optimizer would encourage superficial tests and hide critical untested state paths. Use per-module risk floors for persistence, ownership, payload mutation, JSONC repair, and telemetry. [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:30] [SOURCE: .pi/extensions/deep-pi/package.json:46]

## Ruled Out

- Counting existing test cases as adequate coverage. Neither package emits coverage data, and test density differs drastically by responsibility. [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:30]
- Making real credentials mandatory for every regression run. That would preserve the current environmental blocker; local protocol fixtures can prove routing and activation while paid smoke tests prove provider reality. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/spec.md:141]
- Using footer output alone to characterize cold-start writes; non-Claude adapters persist write tokens without displaying them in the footer. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3666]

## Dead Ends

- The current `benchmark:live` command cannot close any cost-economics gap because its target file is absent from the vendored tree. [SOURCE: .pi/extensions/deep-pi/package.json:56]

## Edge Cases

- Ambiguous input: "newly-added models" is interpreted as a previously unseen provider/model key, not necessarily a newly released vendor model.
- Contradictory evidence: prior docs report 60 passing DeepPi tests; the current static tree exposes 50 literal `it`/`test` calls. Parameterization or historical suite shape may explain the difference, so this iteration does not treat the count delta as a regression.
- Missing dependencies: no coverage provider is installed.
- Partial success: no paid live requests were made because research is scoped to non-mutating evidence collection.

## Sources Consulted

- Both package manifests and READMEs
- Both test trees and exported test internals
- `pi-cache-optimizer` usage/persistence hook source
- sibling live-verification packet evidence

## Assessment

- New information ratio: 0.90
- Novelty justification: Four findings are fully new and the credential strategy materially reframes a known limitation.
- Questions addressed: test coverage, cold-start behavior, credential-blocked live regression.
- Questions answered: a concrete, prioritized test plan now covers every named open limitation.

## Reflection

- What worked and why: responsibility-to-test mapping found a broken benchmark that case-count summaries missed.
- What did not work and why: static test counts conflict with historical run totals and are not used as a quality conclusion.
- What I would do differently: restore the missing benchmark first, then baseline coverage before setting thresholds.

## Recommended Next Focus

Design an automation-safe telemetry contract for both extensions, including full non-interactive reports, durable DeepPi stats, schema/versioning, and privacy limits.
