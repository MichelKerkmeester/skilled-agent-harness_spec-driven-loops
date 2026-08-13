# Iteration 001 — Runtime architecture and evidence baseline

## Focus

Map the two forks' runtime boundaries, state lifetimes, coexistence rules, and current test shape.

## Actions Taken

- Read both extension entry points and the DeepPi modules that own eligibility, telemetry, stability, and retry control.
- Traced pi-cache-optimizer's persistence, session lifecycle, DeepSeek ownership guard, and message accounting paths.
- Read package scripts and the existing DeepPi integration and telemetry tests.

## Findings

### F-001 — The forks have materially different telemetry durability

DeepPi creates telemetry, storm-breaker, and stability state inside the extension closure, then resets telemetry and retry counters on every `session_start`. Its `/deeppi` command renders the report through `ctx.ui.notify`, which explains why a non-interactive RPC caller can receive the command event without the full report body. The telemetry module has no filesystem or persistence boundary. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:9-14,46-68] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:27-45,121-185]

pi-cache-optimizer already provides a stronger reference design: versioned state parsing, legacy-file migration, session-scoped buckets, cumulative model totals, serialized writes, a two-second debounce, reload restoration, and shutdown flush. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4066-4103] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4265-4315] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7007-7153]

Improvement opportunity: give DeepPi a versioned persistent stats contract and a machine-readable report path, while keeping its current in-memory footer fast. Reusing the optimizer's persistence semantics is more defensible than inventing another ad hoc JSON shape.

### F-002 — Coexistence is an explicit contract, not an accidental side effect

The optimizer treats the two supported direct DeepSeek IDs as DeepPi-owned and returns before its session, prompt, request, response, and accounting hooks. DeepPi independently gates all transforms on the same provider/ID eligibility predicate. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275-1281,7279-7304,7540-7542] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-26]

Improvement opportunity: add a shared contract test that loads both extensions in one fake Pi host and proves exactly one owner handles `context`, `before_provider_request`, `message_end`, active-tool changes, and stats. The current DeepPi integration tests prove dormancy and activation separately, not the two-extension ownership boundary. [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:5-41]

### F-003 — Test investment is asymmetric

DeepPi has focused suites for eligibility, hashline races, stability, stormbreaker, telemetry, package identity, and integration behavior. Its package exposes typecheck, unit tests, packaging, and a combined verify script. [SOURCE: .pi/extensions/deep-pi/package.json:31-39] [SOURCE: .pi/extensions/deep-pi/tests]

The optimizer is a single 8,390-line entry file with one `review-findings.test.ts` suite and a typecheck/test/package check. That is useful regression coverage, but the source size and concentration make failures harder to localize and make independent provider-adapter coverage less obvious. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1-8390] [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:34-44]

Improvement opportunity: split optimizer tests by stable seams first—usage normalization, model routing/ownership, persistence migrations, prompt transforms, and JSONC repair—before extracting production modules. For DeepPi, preserve the modular test layout and add only the missing cross-module and live-boundary tests.

### F-004 — The high-value maintenance boundary is shared semantics, not shared implementation

Both forks need the same conceptual seams: model eligibility, cache usage normalization, cost math, prefix stability, report serialization, and durable state. Their current implementations differ because the optimizer serves multiple providers and routing modes while DeepPi is direct-DeepSeek-only. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:88-115] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-25]

Improvement opportunity: document a small provider-neutral telemetry schema and ownership matrix, then share only test fixtures or schema helpers where contracts truly match. A forced code merge would erase the optimizer's routed-provider distinctions and DeepPi's smaller direct-model assumptions.

## Questions Answered

- Which runtime paths can produce incorrect cache eligibility, cache accounting, or guarded DeepSeek behavior? Partially answered: ownership and lifetime boundaries are clear; detailed edge cases remain.
- Which untested seams and live checks provide the highest-value regression coverage? Partially answered: cross-extension ownership and persistence/report boundaries are the first gaps.
- What telemetry and persistence changes would make behavior diagnosable? Partially answered: DeepPi needs durable versioned state and a non-UI report surface.

## Questions Remaining

- Which concrete eligibility, usage-normalization, and retry edge cases can miscount or misapply behavior?
- Which tests are missing for cold-start writes, malformed state, and non-interactive output?
- What exact telemetry fields and retention policy support cost decisions without leaking prompts or credentials?
- Which changes have measurable cost or latency impact?
- Which abstractions can be shared without coupling the forks incorrectly?

## Ruled Out Directions

- Treating the two extensions as interchangeable implementations is ruled out by their different provider/routing scopes. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:88-115] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-26]
- Calling DeepPi's current in-memory report a persistent observability solution is ruled out by its session reset and lack of filesystem state. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46-68] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:27-45]

## Next Focus

Correctness and boundary conditions in eligibility, usage normalization, cache accounting, prompt transforms, and retry handling.

## Scope Violations

None. No target extension or test file was modified.
