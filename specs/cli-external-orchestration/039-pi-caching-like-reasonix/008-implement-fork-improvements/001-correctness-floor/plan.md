---
title: "Implementation Plan: Correctness Floor"
description: "Technical approach for the 4 P0 items: split recordUsage's cold-start guard so cache-write-only turns are recorded, single-source the DeepSeek ownership set as a test fixture, bridge the node:test/vitest runner seam with a runner-free composition body, exercise pi-cache-optimizer's 6 hook guards for real, and move latestChurn out of TelemetryState so the report command stops mutating state."
trigger_phrases:
  - "correctness floor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/001-correctness-floor"
    last_updated_at: "2026-08-08T09:03:34Z"
    last_updated_by: "implementation"
    recent_action: "Implemented and verified the correctness-floor plan"
    next_safe_action: "Hand off to phase 002"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The planned two-wrapper bridge worked: a vitest wrapper and a node:test wrapper both execute the runner-free composition body."
      - "The ownership boundary is a test-only JSON fixture; runtime predicates remain unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Correctness Floor

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (two independent Pi coding-agent extensions) |
| **Framework** | Pi extension hook API (`pi.on`, `pi.registerCommand`, `pi.registerTool`) |
| **Storage** | None in this phase — deep-pi stays in-memory; persistence is phase 002 |
| **Testing** | Two runners: `vitest --run` for deep-pi (`package.json:52`); `node:test` + `jiti` for pi-cache-optimizer (`package.json:31`) |

### Overview
Four independent P0 fixes, each small and each provable with a negative control. Two are single-condition source fixes in `deep-pi` (`recordUsage`'s cold-start guard; the `/deeppi` command's state write). Two are test-infrastructure work spanning both forks (one authoritative ownership set; a combined-host composition test plus hook-level guard tests), and it is the test work — not the source fixes — that carries the real risk, because the two forks run different test runners and no fixture currently crosses that line.

The plan deliberately keeps the accounting question out of scope. Fixing the cold-start guard makes the dropped turn *observable*; deciding where its cache-write tokens and cost belong is phase 002. That seam is stated identically in both phases' specs so neither assumes the other closed it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every P0 citation re-read against the live vendored source during planning, not carried over from `research.md` on trust
- [x] The runner mismatch identified with both concrete commands (`package.json:31` versus `package.json:52`) rather than described in the abstract
- [x] An existing host double confirmed suitable for a combined host: `deep-pi/tests/fake-pi.ts:11-13` appends handlers per event type and `:26-30` emits all of them, so two extensions can register on one `FakePi` instance
- [x] The one finding deliberately excluded (`f-deeppi-cas-gap`) verified as already-closed at `hashlines.ts:91-101` before being written off
- [x] Operator authorization to modify files under `.pi/extensions/` (user explicitly authorized implementation in the request)

### Definition of Done
- [x] REQ-001 through REQ-006 implemented, each with a test that fails when its fix is reverted
- [x] `npm test` and `npm run typecheck` both exit 0 in `.pi/extensions/deep-pi/` and `.pi/extensions/pi-cache-optimizer/`
- [x] The composition test actually executes under a named runner and its output is read, not assumed
- [x] `git diff` scoped to the files in `spec.md` §3, with no task-created incidental edits
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same shape as `../../006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi`: narrow, surgical edits to a small number of named functions, each paired with a test whose failure without the fix is demonstrated rather than claimed. The new element here is that two of the four items span both forks at once, which forces a shared, runner-neutral test surface to exist.

### Key Components

**REQ-001 — cold-start guard (`deep-pi/extensions/deeppi/telemetry.ts:52-55`).** The current guard conflates two different failure modes in one condition:

```
if (!model || usage.input + usage.cacheRead === 0) { state.usageUnavailable = true; return false; }
```

Split it into two, and make the token test total rather than partial:

- `if (!model)` keeps its current meaning: pricing metadata genuinely absent, so usage cannot be attributed. Still sets `usageUnavailable`.
- `if (usage.input + usage.cacheRead + usage.cacheWrite === 0)` keeps genuinely empty records out. A turn with zero tokens across all three buckets really is unavailable usage.

A cache-write-only turn (`input: 0, cacheRead: 0, cacheWrite: N`) now falls through to the recording path instead of being discarded. Adding `cacheWrite` to the condition rather than deleting the condition is the load-bearing choice: deleting it would admit empty records and inflate `responses`.

**Known intermediate state, by design.** After this fix alone, such a turn increments `totals.responses` (`telemetry.ts:61`) while `totals.hitTokens` and `totals.missTokens` both gain zero (`:62-63`), because `usage.cacheWrite` is not yet routed anywhere. `cacheHitRate` (`:70-73`) therefore ignores it, and `actualInputCost` (`:64`) omits `usage.cost.cacheWrite`. That is phase 002's REQ-003. This phase asserts the intermediate behavior explicitly in a test so phase 002 starts from a known state instead of guessing what 001 left behind.

**REQ-002 — one authoritative ownership set.** Default approach: a test-only shared fixture, not a runtime module.

- New file (proposed): `.pi/extensions/shared/deepseek-ownership.json`, holding an `owned` list (`deepseek/deepseek-v4-flash`, `deepseek/deepseek-v4-pro`) and an `excluded` list (`opencode/deepseek-v4-flash-free`, `opencode-go/deepseek-v4-flash` — both currently enabled in `.pi/settings.json`).
- `deep-pi`'s suite asserts `isDeepPiModel` (`eligibility.ts:14-18`) returns `true` for every `owned` entry and `false` for every `excluded` entry.
- `pi-cache-optimizer`'s suite asserts `isDeepPiOwned` (`index.ts:1279-1281`, exported for tests at `:6508`) returns the same verdicts.
- Adding a synthetic entry to the fixture without updating a fork fails that fork's test — which is the divergence alarm the research asked for.

Why a fixture rather than a shared runtime module: the two forks are independently versioned packages with their own `files` allowlists (`pi-cache-optimizer/package.json:18-20` ships only `index.ts`; `deep-pi/package.json:36-41` ships `LICENSE`, `README.md`, `extensions`, `tsconfig.json`). A runtime module would have to be added to both allowlists and vendored into both, coupling their release and vendoring paths. A test fixture couples only the test suites, which is exactly the coupling the finding calls for. The accepted trade-off is that the fixture catches divergence at test time, not at import time; the decision is recorded in `spec.md` §7.

**REQ-003 — runner bridge.** Three options were weighed; the third was implemented.

1. Migrate pi-cache-optimizer to vitest. Rejected: it rewrites the runner for an 887-line suite (`tests/review-findings.test.ts`) and its `#extension` import-map indirection (`package.json:27-29`) for the sake of one new test.
2. Migrate deep-pi to `node:test`. Rejected for the mirror-image reason — 8 vitest files, 60 tests.
3. **Implemented: a runner-free composition body.** `.pi/extensions/shared/composition/one-owner.ts` exports a pure function that takes both predicates plus the ownership fixture and returns a list of `{ modelId, expectedOwner, actualOwners }` results. It imports no runner. Two thin wrappers consume it — a `node:test` wrapper inside pi-cache-optimizer's suite and a `vitest` wrapper inside deep-pi's — each asserting the same results with its own runner's assertion API.

Concrete detail that must not be missed: pi-cache-optimizer's test script names exactly one file (`package.json:31`, `node --import jiti/register tests/review-findings.test.ts`). Adding a second test file requires changing that script to enumerate or glob the test directory, otherwise the new test silently never runs. Cross-fork TypeScript loading under `node:test` uses `createJiti`, already imported by that suite at `tests/review-findings.test.ts:6`.

Fallback if the two-wrapper bridge proves unworkable: run the composition body only under `node:test` + `jiti` (which can load both forks' TypeScript), and have deep-pi's vitest suite assert its own half against the same fixture. This still satisfies REQ-002's divergence alarm and REQ-004's one-owner assertion; it just localizes the combined host to one runner. The fallback must be recorded in `checklist.md` if taken, not applied silently.

**REQ-004 — combined-host composition test.** `deep-pi/tests/fake-pi.ts` already models what is needed: `FakePi.on` (`:11-13`) appends handlers per event type rather than replacing them, and `FakePi.emit` (`:26-30`) awaits every registered handler in order. Registering both extensions' default exports against one `FakePi`, then emitting `session_start` / `model_select` with `fakeContext({ provider, id })` (`:36-61`, which captures `statuses`, `notifications`, and `notificationSeverities`), produces an observable record of which extension reacted. Assertions are on that observed behavior — status published, tool activated, notification emitted — not on predicate return values, which REQ-002 already covers separately.

**REQ-005 — hook-level guard tests (pi-cache-optimizer).** One test per guard, each invoking the real handler with an owned model and asserting the suppressed effect did not occur:

| Hook | Guard | Suppressed effect to assert absent |
|------|-------|-------------------------------------|
| `session_start` | `index.ts:7280` | No status published; cache stats not restored |
| `model_select` | `index.ts:7298` | No compat notification; no status publish |
| `before_agent_start` | `index.ts:7304` | `__piCacheOptimizerCacheKey__` global untouched (compare against `:7291`/`:7309`) |
| `before_provider_request` | `index.ts:7425` | Payload deep-equal to the input payload |
| `after_provider_response` | `index.ts:7479` | No response-side processing observable |
| `message_end` | `index.ts:7541` | No cache stats recorded for that turn |

The exact observation handle for each row must be confirmed against the source at implementation time rather than assumed from this table — several run through module-level state reachable only via the `__internals_for_tests` export (`index.ts:6508` sits inside that export block). Existing precedent for the shape: `deep-pi/tests/telemetry.test.ts:200-226` builds a hook `Map`, registers the real hook, emits a synthetic `message_end`, and asserts the counter stayed at zero.

**REQ-006 — report command side effect (`deep-pi/extensions/deeppi.ts:67`).** `TelemetryState.latestChurn` has exactly one reader and one writer, both verifiable by grep:

- Declared `telemetry.ts:31`, initialized `:43`, reset `:127`
- Read only by `formatDeepPiReport` at `:98-100`
- Written only by the `/deeppi` handler at `deeppi.ts:67`
- The real owner of the data is `StabilityState.latestChurn` (`stability.ts:142`, initialized `:152`, written by the `before_provider_request` hook at `:201`, cleared at `deeppi.ts:51`)

So the fix is a field move, not a workaround: add `latestChurn: PrefixChurnReason[]` to `ReportInput` (`telemetry.ts:80-92`), have `formatDeepPiReport` read `input.latestChurn`, delete `deeppi.ts:67`, and pass `latestChurn: stability.latestChurn` in the existing object literal at `deeppi.ts:68-80`. `TelemetryState.latestChurn` then has no readers and can be removed along with its initialization and reset lines; `deep-pi/tests/telemetry.test.ts:64` sets it directly and must be updated in the same change.

### Data Flow
Unchanged in every respect that determines activation. `isDeepPiModel` and `isDeepPiOwned` keep their exact current semantics — REQ-002 checks them against one shared definition and against each other over a wide synthetic candidate space, it does not alter either. (A HANDOFF review correctly noted the original fixture-only check proved agreement only on its own four entries, not equivalence in general; see `checklist.md` CHK-012 for the fix.) Inside deep-pi, one recorder guard admits a class of turn it currently discards, and one report field is sourced from its real owner instead of a copy. Everything else — hook registration, tool activation, status publishing — is untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture a real baseline in both forks before any edit: `npm test` and `npm run typecheck` in each, output and exit status read, numbers recorded (deep-pi: 8 files/60 tests; optimizer: 25 tests; all four baseline commands exited 0)
- [x] Confirm the vendored copies still match their spec-recorded state, so the diff at the end is attributable to this phase
- [x] Re-run the four P0 citation checks against the live source one more time immediately before editing

### Phase 2: Core Implementation
- [x] REQ-001: split `recordUsage`'s guard and include `cacheWrite` in the token test
- [x] REQ-006: move `latestChurn` from `TelemetryState` into `ReportInput`; delete the command handler's write
- [x] REQ-002: author the shared ownership fixture; wire both forks' suites to assert against it
- [x] REQ-003: author the runner-free composition body plus its two wrappers; update pi-cache-optimizer's test script so the new file actually runs
- [x] REQ-004: build the combined host on `FakePi` and assert one owner per model id
- [x] REQ-005: add the six hook-level guard tests

### Phase 3: Verification
- [x] Negative control per fix: revert the fix, confirm its test fails with the predicted error, restore, confirm green again
- [x] Full suites and typechecks re-run in both forks; output read, not inferred from a dispatch's summary
- [x] Confirm the composition test actually ran — check the runner's reported test count, not just its exit status
- [x] `git diff --numstat` scoped to `spec.md` §3's file list, with any surprise reconciled before completion is claimed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (deep-pi) | Cache-write-only turn recorded and `usageUnavailable` not latched; fully-empty usage still rejected; the documented intermediate accounting state asserted explicitly | vitest |
| Unit (deep-pi) | `/deeppi` invocation leaves telemetry state unchanged while still rendering the correct churn line | vitest |
| Contract (both forks) | Each fork's ownership predicate agrees with the shared fixture on every owned and excluded entry | vitest and `node:test` |
| Composition (combined host) | Both extensions registered on one `FakePi`; exactly one reacts per model id | runner-free body plus per-runner wrappers |
| Integration (pi-cache-optimizer) | Six hook guards exercised through their real handlers with an owned model | `node:test` + `jiti` |
| Negative control | Each fix reverted in turn; its test must fail with the predicted error | both runners |
| Type check | Both forks compile clean | `tsc --noEmit` in each fork |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator authorization to modify `.pi/extensions/` | Process | Granted by the implementation request | The phase could be executed within the requested scope |
| `deep-pi/tests/fake-pi.ts` supporting multiple handlers per event | Internal | Green (confirmed at `:11-13` and `:26-30`) | The combined host would need a new double built from scratch |
| `jiti` able to load both forks' TypeScript from one `node:test` process | External | Green — ownership wrapper passed 3/3 under `node:test` | The documented fallback was not needed |
| `007-research-fork-improvements` findings | Internal (predecessor) | Green (Complete) | Nothing to plan against |
| `.pi/settings.json` still enabling the boundary models | Environment | Green (`opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` both listed) | The excluded-entry half of the fixture loses its real-world anchor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of — a fix's negative control does not reproduce the predicted failure; the runner bridge cannot be made to execute; either fork's existing suite goes red and cannot be brought back without widening scope; or the diff escapes `spec.md` §3's file list
- **Procedure**: these are vendored, live extensions, so rollback is a working-tree revert of the touched files under `.pi/extensions/` followed by re-running both suites to confirm the baseline from Phase 1 is restored exactly. Nothing here writes outside the two extension directories and the new shared fixture path, and nothing is committed, so no history rewrite or environment restore is involved
- **Partial rollback**: the four items are independent. Any one can be reverted on its own without disturbing the others, with the single ordering caveat that REQ-004 depends on REQ-002's fixture and REQ-003's bridge existing
<!-- /ANCHOR:rollback -->
