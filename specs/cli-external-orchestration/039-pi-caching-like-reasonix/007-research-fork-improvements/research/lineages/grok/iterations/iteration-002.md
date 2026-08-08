# Iteration 002 — Test coverage inventory and gaps

## Focus

Which test-coverage gaps leave regressions uncaught for both forks?

## Actions Taken

- Inventoried `pi-cache-optimizer/tests/review-findings.test.ts` describe/test blocks
- Inventoried all eight `deep-pi/tests/*.ts` files and case titles
- Compared live-verification substitutions in 006 phase 3 against unit coverage
- Checked whether any test exercises both forks loaded together

## Findings

1. **`isDeepPiOwned` is predicate-only in the optimizer suite.** The sole dedicated block asserts four static model tuples. No test registers the real `session_start` / `model_select` / `before_agent_start` / `before_provider_request` / `after_provider_response` / `message_end` handlers and asserts early-return (no prompt rewrite, no stats mutation) for DeepSeek-direct models. A broken guard that still leaves the predicate true would pass today's suite. [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:73-80]

2. **Known untested retry path remains open.** Spec 003 limitation #2: `after_provider_response`'s 400-retry compat path is covered by the same guard by design, but was never stress-tested against a live or simulated 400. Still a concrete coverage gap for the fork. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:141]

3. **deep-pi unit/integration coverage is comparatively strong.** Eligibility, telemetry (including `costMathErrors` and missing `usage.cost`), stability, stormbreaker, hashlines, package identity, and real-hook silence for `opencode` / `opencode-go` are covered. HANDOFF already added the real-hook path that static eligibility alone missed. [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:69-91] [SOURCE: .pi/extensions/deep-pi/tests/telemetry.test.ts:112-191]

4. **No cross-extension composition test exists in either package.** Neither suite loads both vendored extensions and asserts mutual exclusion (optimizer no-op + deep-pi active on `deepseek/deepseek-v4-flash`; optimizer active + deep-pi dormant on `opencode-go/deepseek-v4-flash`). Live 006 verification proved this once manually; it is not a regression gate in CI. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:52]

5. **Live credential gap substitutes for one boundary model.** `opencode/deepseek-v4-flash-free` live regression remains substituted by source-level tests only — documented, not resolved. Improvement: add a skip-unless-credential live harness (`DEEPPI_LIVE` / optimizer equivalent) so the gap is machine-visible rather than checklist prose. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:56,123]

6. **No allowlist-parity test across forks.** Nothing asserts `DEEPPI_MODEL_IDS` equals the set encoded in `isDeepPiOwned`. A one-sided model add would not fail CI. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279-1281]

## Questions Answered

- Highest-value coverage gaps: hook-level DeepPiOwned early-return tests, cross-extension composition test, allowlist parity test, and credential-gated live harness for the substituted boundary model.

## Ruled Out

- Claiming deep-pi's unit suite is thin — evidence shows broad module coverage; gaps are integration/composition/live, not missing module tests.

## Next Focus

Telemetry/observability: persistent stats and non-interactive `/deeppi` report surfacing.

## Assessment

Distinct angle from correctness: the predicate can be right while hooks remain untested. Convergence telemetry only; continue.
