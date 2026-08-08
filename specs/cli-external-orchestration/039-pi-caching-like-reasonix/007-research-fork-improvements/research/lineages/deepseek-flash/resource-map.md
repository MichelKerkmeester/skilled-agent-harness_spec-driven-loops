---
title: "Resource Map — Packet 039 Pi Fork Improvements (deepseek-flash lineage)"
description: "Evidence inventory for the deepseek-flash detached research lineage."
---

# Resource Map

## Summary

- Local source files: 11 primary implementation/manifest/test surfaces
- External primary sources: 1 official DeepSeek page (fetched 2026-08-08)
- Iteration narratives: 4
- Scope: correctness, tests, observability, economics, and maintainability for both packet 039 forks
- Parent synthesis: `../research.md` (3-lineage run; this lineage corroborates/extends it)

## Implementation Sources

| Resource | Category | Research use | Status |
|---|---|---|---|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Source | ownership guard, stats persistence, usage normalization, message_end guard, cold-start instrumentation | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Source | report command/transport, report-command side effect | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` | Source | canonical DeepPi ownership predicate | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | Source | cost formula, availability check, session reset | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts` | Source | atomic writes, endpoint-only validation, write queue | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/stability.ts` | Source | hot-path prefix digesting, un-surfaced counters | Analyzed |
| `.pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts` | Source | errorsEnhanced counter, guard/abort state | Analyzed |

## Test and Packaging Sources

| Resource | Category | Research use | Status |
|---|---|---|---|
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Test | present coverage and missing persistence/restart tests; runner style (node:test) | Analyzed |
| `.pi/extensions/deep-pi/tests/telemetry.test.ts` | Test | fixture gaps (cacheWrite, stopReason, NaN) | Analyzed |
| `.pi/extensions/deep-pi/tests/deeppi.integration.test.ts` | Test | FakePi harness = composition-test seam | Analyzed |
| `.pi/extensions/deep-pi/package.json` | Config | benchmark:live double-break, files allowlist | Analyzed |
| `.pi/extensions/pi-cache-optimizer/package.json` | Config | test runner (jiti), upstream metadata | Analyzed |

## External Sources

| Resource | Category | Research use | Status |
|---|---|---|---|
| https://api-docs.deepseek.com/quick_start/pricing | Docs | cache-hit/miss prices; no separate write tier; volatility warning | Fetched 2026-08-08 |
