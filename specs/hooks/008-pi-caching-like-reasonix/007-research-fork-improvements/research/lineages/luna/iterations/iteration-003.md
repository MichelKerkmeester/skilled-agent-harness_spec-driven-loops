# Iteration 003 — Test coverage and fault-injection seams

## Focus

Map the existing unit, integration, persistence, report-transport, and host seams; identify tests that can prove the correctness risks from iteration 2 without modifying either fork.

## Actions Taken

- Read both package test scripts and inventories of the focused suites.
- Compared DeepPi's telemetry and integration fixtures with the usage shapes that iteration 2 identified as risky.
- Inspected the FakePi host harness for UI, RPC, and stdout coverage.
- Checked the optimizer suite for lifecycle-hook, usage-normalization, and persisted-statistics coverage.
- Checked for a cross-extension host test and for the package's declared live benchmark entry point.
- Confirmed that hashline race and atomic-replacement coverage already exists, so that area does not need another duplicate test family.

## Findings

### F-009 — DeepPi's telemetry regression matrix does not cover the newly identified boundary cases

The telemetry and integration tests exercise a warm cache-read response with `cacheWrite: 0`, missing pricing, missing usage cost, unsupported providers, and report formatting. They do not exercise a pure cold write (`input=0`, `cacheRead=0`, `cacheWrite>0`), negative or non-finite numeric fields, or a failed/aborted usage-bearing `message_end`. [SOURCE: .pi/extensions/deep-pi/tests/telemetry.test.ts:20-38,40-52,142-226] [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:15-41]

Improvement opportunity: add table-driven fixtures for warm hit, cold write, mixed read/write, malformed numbers, aborted retry, and successful retry. Assert both totals and rejection/failed-attempt counters. This turns the iteration-2 risks into a small, deterministic regression matrix rather than relying on provider behavior to surface them.

### F-010 — The report transport seam is not testable beyond the interactive UI notification

The FakePi context records `ctx.ui.notify` messages, statuses, and aborts, but has no stdout, RPC response, or structured-command channel. The integration test therefore proves only that `/deeppi` exposes a notification containing `Cache hit rate`, not that `pi --mode rpc` exposes the full report through a non-interactive boundary. [SOURCE: .pi/extensions/deep-pi/tests/fake-pi.ts:36-61] [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:38-41]

Improvement opportunity: separate report construction from transport and add a host-level adapter fixture that captures notification, command return value, and RPC/stdout serialization. The test should assert a versioned machine-readable payload and a text projection, while retaining the supplied non-interactive report limitation as an unresolved live-host check until the real Pi transport is available.

### F-011 — The optimizer suite does not exercise its production accounting lifecycle end to end

The optimizer's one test file covers prompt reordering, ownership detection, footer-stat selection, compatibility parsing, JSONC repair, and the `/cache-optimizer fix` command. Its test inventory has no `message_end` accounting test, normalized usage matrix, failed-attempt filter test, or stats-file reload/write test for the production hook path, even though the implementation contains those paths. [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:10-887] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2147-2277,4066-4103,7279-7577]

Improvement opportunity: add a narrow event-lifecycle harness that emits `session_start`, `message_end`, `session_shutdown`, and a restart against an isolated agent directory. Assert cold write, cache hit, malformed usage, error/aborted retry, debounced flush, atomic reload, and legacy migration. Keep the existing pure tests; this seam verifies that the production wiring actually invokes them.

### F-012 — There is no cross-extension coexistence test at the Pi host boundary

DeepPi tests load only `deepPi`, while the optimizer tests import its internal test surface and create small local Pi stubs. No in-scope test loads both extensions into one host and asserts that DeepPi-owned direct models have exactly one active owner, while non-owned providers still reach the optimizer. [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:1-102] [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:1-8,300-381]

Improvement opportunity: create one contract fixture with both registrations and a matrix of `(provider, model ID, message stopReason, usage shape)`. Assert registration counts, unchanged payloads for the excluded owner, one telemetry record for the owning fork, and normal optimizer behavior for non-DeepPi routes. This is the executable guard against ownership-list drift from F-007.

### F-013 — DeepPi advertises a live benchmark script that is absent from the package tree

The package declares `benchmark:live` as `node scripts/live-benchmark.mjs`, but the package tree contains no `scripts/` directory or `live-benchmark.mjs` file. The command consequently exits with status 1 before it can provide live cold-start or warm-hit evidence. [SOURCE: .pi/extensions/deep-pi/package.json:51-56] [SOURCE: .pi/extensions/deep-pi (package file inventory), command: `test -e .pi/extensions/deep-pi/scripts/live-benchmark.mjs` → exit 1]

Improvement opportunity: either ship the benchmark entry point with explicit credential and model prerequisites, or remove/replace the stale script declaration. A usable benchmark should emit separate cold-write, warm-read, retry, and disabled-baseline measurements; it must report blocked credentials as blocked rather than silently claiming performance evidence.

## Questions Answered

- Which untested seams and live checks provide the highest-value regression coverage? Answered: DeepPi boundary fixtures, report transport, optimizer lifecycle/persistence, and a combined-host ownership matrix are higher value than duplicating the already strong hashline race tests.
- How do hashline edits and prompt stability behave under races, malformed tool payloads, and mixed message shapes? Partially answered: atomic replacement, snapshot races, hash collisions, and malformed tool-result handling are already directly covered; the remaining risk is their interaction with both extensions in the host lifecycle.

## Questions Remaining

- What telemetry fields and retention policy support cost decisions without leaking prompts or credentials?
- Which changes have measurable cost or latency impact?
- Which abstractions can be shared without coupling the forks incorrectly?
- Which live checks remain blocked by credentials or unavailable Pi RPC transport?

## Ruled Out Directions

- Duplicating more hashline race tests is low value for this pass: `hashlines.test.ts` and `review2.test.ts` already cover atomic replacement, snapshot races, symlink safety, collision resistance, overlapping edits, and non-assistant message ordering. [SOURCE: .pi/extensions/deep-pi/tests/hashlines.test.ts:18-179] [SOURCE: .pi/extensions/deep-pi/tests/review2.test.ts:51-217]
- Treating the current FakePi notification capture as proof of non-interactive report correctness is ruled out; it has no RPC/stdout model. [SOURCE: .pi/extensions/deep-pi/tests/fake-pi.ts:36-61]

## Next Focus

Telemetry and observability: report completeness, structured output, failure counters, retention boundaries, persistence diagnostics, and privacy-safe fields.

## Scope Violations

None. No target extension or test file was modified; the missing benchmark entry point was inspected only.
