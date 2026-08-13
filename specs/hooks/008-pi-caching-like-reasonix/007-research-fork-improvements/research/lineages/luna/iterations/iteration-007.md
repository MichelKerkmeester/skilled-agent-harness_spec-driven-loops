# Iteration 007 — Evidence reconciliation and priority closure

## Focus

Reconcile the research against sibling-packet acceptance evidence, distinguish confirmed code gaps from external verification blockers, and establish the implementation order for synthesis.

## Actions Taken

- Read the optimizer guard packet's final verification and limitations.
- Read the DeepPi fix, vendoring, and live-verification summaries.
- Compared already-proven live and unit boundaries with the still-missing combined-host, cold-write, report, and benchmark seams.
- Classified the remaining questions as confirmed, testable next work, or externally blocked.

## Findings

### F-026 — Existing acceptance evidence proves the current guard boundary, not future ownership changes

The sibling optimizer packet records passing typecheck/tests, live non-DeepSeek regression, live `opencode` DeepSeek-family coverage, and zero direct DeepSeek stats. The DeepPi packet records passing 60-test/typecheck verification, a live direct round-trip, and live regressions for `opencode-go` and `openai-codex`. These receipts mean a new phase should not spend its first effort repeating the current two-model guard smoke test. They do not cover loading both extensions together, adding a future model ID, or validating cache-write/retry accounting. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:113-132] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/implementation-summary.md:97-110] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:102-114]

Improvement opportunity: preserve these receipts as regression baselines, then target the unproven matrix: both extensions in one host, exact ownership IDs plus aliases, cold writes, failed retries, malformed usage, and report serialization.

### F-027 — Remaining live gaps are verification boundaries, not evidence that the local code path is absent

The DeepPi packet explicitly records that `/deeppi`'s full body was not confirmed through `pi --print` or `pi --mode rpc`, that `opencode/deepseek-v4-flash-free` lacked a live credential, and that RPC only exposed a partial UI signal. The local FakePi and source tests still prove the formatter and provider guard, but they cannot establish the real host transport or missing credential behavior. The benchmark declaration is also currently unexecutable because its script is absent. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:102-124] [SOURCE: .pi/extensions/deep-pi/tests/fake-pi.ts:36-61] [SOURCE: .pi/extensions/deep-pi/package.json:51-56]

Improvement opportunity: label the next verification plan with three states—local proof, live proof, and blocked prerequisite. Do not convert a missing credential or host transport into a false correctness failure, and do not claim a live report or performance result until the real boundary is instrumented.

### F-028 — Evidence supports a staged improvement order with correctness gates before economics polish

The strongest direct correctness risks are the cache-write omission, failed-attempt accounting, and unvalidated usage values; their fixes can be proven with deterministic fixtures. Ownership and report-schema contracts then unlock combined-host and non-interactive tests. Only after those semantics are stable can persistence retention, optional pricing, and cold/warm latency measurements be interpreted consistently. The sibling packets' successful guard/live baselines and known transport limits support this order. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47-67,130-185] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2147-2168,7566-7643] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:123-143] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:104-124]

Improvement opportunity: use this sequence for implementation planning: (1) normalized usage, retry filtering, and ownership matrix; (2) boundary/lifecycle/combined-host tests; (3) structured report and persistence health/retention; (4) cost registry and controlled benchmark; (5) narrow module extraction and provenance automation. Each stage has a pass/fail gate and avoids measuring economics on invalid denominators.

## Questions Answered

- Which prior findings are already covered by sibling packet acceptance evidence versus still needing new tests? Answered: current guard and basic load/regression paths are covered; cross-extension ownership, cold-write/retry/malformed usage, report transport, and controlled economics remain.
- What final priority order balances correctness, observability, economics, and maintenance cost? Answered: correctness and contracts first, observability and persistence second, economics third, extraction/provenance alongside or after stable boundaries.
- What telemetry and persistence changes would make cache economics and guarded-loop behavior diagnosable? Answered across iterations 4-5: complete counters, versioned numeric schema, explicit retention/health, and separate observed versus counterfactual cost.
- Which changes have measurable cost or latency impact, and how should they be evaluated? Answered: use the four-mode controlled replay only after accounting semantics pass deterministic fixtures.
- Which maintainability boundaries should be shared, simplified, or documented across the forks? Answered: share contracts and fixtures; keep provider-specific runtime implementations separate.

## Questions Remaining

None for the research pass. Live-host transport, credentials, benchmark execution, and implementation results remain external follow-up states, not unanswered source questions.

## Ruled Out Directions

- Repeating the already-proven current two-model guard smoke test as the primary next step is ruled out; it has acceptance receipts. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:123-132]
- Treating blocked live prerequisites as resolved evidence is ruled out; the sibling packet records the credential and RPC limitations explicitly. [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:122-124]

## Next Focus

Phase synthesis: write the evidence-backed research report, resource map, convergence report, and final lineage state inside this directory.

## Scope Violations

None. No target extension, package, sibling spec, or runtime state was modified.
