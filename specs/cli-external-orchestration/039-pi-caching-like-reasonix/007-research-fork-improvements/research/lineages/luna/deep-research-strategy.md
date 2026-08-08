---
title: Detached Deep Research Strategy
description: Iteration strategy for evidence-based improvement research across the two packet 039 Pi forks.
contextType: planning
version: 1.0
---

# Deep Research Strategy - Luna Lineage

## 1. OVERVIEW

This detached lineage investigates concrete improvements to the DeepSeek-guard cache optimizer and hardened DeepSeek-direct extension. Findings are evidence-backed and implementation-free; the canonical synthesis is `research.md` in this lineage.

## 2. TOPIC

Improve correctness, test coverage, telemetry/observability, cost economics, and maintainability across both forks, while building on the four known limitations supplied in the research brief.

## 3. KEY QUESTIONS

- [x] Which runtime paths can produce incorrect cache eligibility, cache accounting, or guarded DeepSeek behavior?
- [x] Which untested seams and live checks provide the highest-value regression coverage?
- [ ] What telemetry and persistence changes would make cache economics and guarded-loop behavior diagnosable?
- [ ] Which changes have measurable cost or latency impact, and how should they be evaluated?
- [ ] Which maintainability boundaries should be shared, simplified, or documented across the forks?

## 4. NON-GOALS

- Do not modify either extension or its tests.
- Do not re-run or re-litigate the four known limitations as if they were new discoveries.
- Do not claim live-provider behavior that cannot be verified from local code, tests, or captured command output.
- Do not prescribe a full rewrite or merge the forks without evidence that their contracts are equivalent.

## 5. STOP CONDITIONS

- Run all seven iterations because max-iterations is the active stop policy.
- Treat convergence below 0.05 as telemetry only and broaden the review angle.
- Preserve negative knowledge when a direction is blocked by missing credentials, unavailable runtime state, or unsupported test seams.

## 6. ANSWERED QUESTIONS

- The forks have different telemetry durability and lifecycle boundaries.
- The two extensions have an explicit DeepSeek ownership exclusion contract.
- Test coverage is modular in deep-pi and concentrated in pi-cache-optimizer.
- DeepPi can drop pure cache-write usage and does not filter failed or aborted message-end events. (iteration 2)
- Ownership lists are duplicated and numeric usage validation is asymmetric. (iteration 2)
- DeepPi lacks boundary fixtures for cold writes, malformed numbers, and failed retries; the optimizer lacks end-to-end accounting/persistence tests. (iteration 3)
- The FakePi harness cannot verify non-interactive report transport, and no combined-host test enforces one owner. (iteration 3)
- The declared DeepPi live benchmark entry point is absent. (iteration 3)
- DeepPi maintains storm/stability counters that `/deeppi` omits, while both forks expose text-only reports. (iteration 4)
- Optimizer trend samples and persistence health are not durable across restart or failure. (iteration 4)
- DeepPi mixes observed cost with a rate-based counterfactual; optimizer economics are token-only and the fork denominators differ. (iteration 5)
- No controlled cold/warm replay measures extension overhead, and live evidence remains one-request or partial-observability evidence. (iteration 5)
- The optimizer needs narrow extraction seams, DeepPi needs explicit reset/report contracts, ownership needs a first-class matrix, and vendored provenance needs a drift guard. (iteration 6)
- Existing sibling acceptance proves current guard/load paths; remaining work is combined-host/future-ID, accounting, report, benchmark, and provenance follow-up. (iteration 7)
- Remaining live limitations are explicit blocked prerequisites, not unanswered local-source questions. (iteration 7)

## 7. WHAT WORKED

Initialization and direct source comparison worked. The correctness pass found concrete cache-write and retry-accounting risks, the coverage pass mapped those risks to executable seams, the observability pass traced state to report and persistence boundaries, the economics pass separated observed from counterfactual cost, and the maintainability pass identified contract-first seams without requiring a rewrite. (iterations 1-6)

## 8. WHAT FAILED

No evidence-gathering approach failed. The standard reducer is intentionally not used because it resolves the parent research root; detached derived state is maintained locally. Live benchmark and RPC transport evidence remain unavailable because the package entry point and host channel are absent. (iterations 1-4)

## 9. EXHAUSTED APPROACHES

Forced implementation sharing across the two forks is exhausted as a direction; their provider/routing scopes differ. (iteration 1)
Assuming cacheWrite is always zero is exhausted; the contract and optimizer normalizer model cache writes explicitly. (iteration 2)

## 10. RULED OUT DIRECTIONS

- Treating both extensions as interchangeable implementations: provider and routing scopes differ. (iteration 1)
- Treating DeepPi's current in-memory report as persistent observability: state resets on session start and has no filesystem boundary. (iteration 1)
- Auto-enabling DeepPi from broad model-name matching: exact provider and model identity is the safety boundary. (iteration 2)
- Persisting raw messages or provider payloads: numeric-only samples are sufficient and safer. (iteration 4)
- Adding another human-only formatter before a shared report object: it would preserve schema drift and parsing brittleness. (iteration 4)
- Inferring dollar prices from model names or adapter families: pricing and routing are external configuration. (iteration 5)
- Replacing provider-reported costs with a local estimate: observed cost and counterfactual estimates serve different purposes. (iteration 5)
- A full optimizer rewrite as the first step: narrow extraction and lifecycle/contract tests have lower risk. (iteration 6)
- Merging DeepPi and optimizer into one implementation: their provider and lifecycle contracts differ. (iteration 6)

## 11. CARRIED-FORWARD OPEN QUESTIONS

The four supplied limitations remain baseline context; they are not counted as newly discovered findings. Iterations 3 and 7 added tests, verification boundaries, and staged follow-up around them rather than treating them as fresh runtime discoveries.

## 12. NEXT FOCUS

Synthesis complete. The evidence-backed research report, resource map, convergence report, and terminal lineage state are materialized in this directory.

## 13. KNOWN CONTEXT

- `.pi/extensions/pi-cache-optimizer/index.ts` contains the cache-prefix optimizer, provider adapters, persistence, commands, and footer status.
- `.pi/extensions/deep-pi/extensions/deeppi.ts` composes eligibility, hashed-line editing, stability, stormbreaker, and telemetry modules.
- The two sibling packet specs contain prior acceptance evidence, known limitations, and prior live-verification boundaries.
- The parent fan-out owns the shared research lock and root-level orchestration; this lineage may write only within its own directory.

## 14. RESEARCH BOUNDARIES

- Max iterations: 7
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence is telemetry-only
- Per-iteration budget: 12 tool calls, 10 minutes
- Executor: cli-codex / gpt-5.6-luna
- Lineage session: fanout-luna-1786163355542-f6htbk
