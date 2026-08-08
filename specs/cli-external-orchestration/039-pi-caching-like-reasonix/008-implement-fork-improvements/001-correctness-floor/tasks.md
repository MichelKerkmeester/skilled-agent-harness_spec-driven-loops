---
title: "Tasks: Correctness Floor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "correctness floor tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/001-correctness-floor"
    last_updated_at: "2026-08-08T09:03:34Z"
    last_updated_by: "implementation"
    recent_action: "Completed and evidenced all correctness-floor tasks"
    next_safe_action: "Hand off to phase 002"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The operator authorized implementation in the user request; T002 is complete."
      - "The two-wrapper runner bridge worked, so the documented fallback was not taken."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Correctness Floor

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture a real pre-change baseline in both forks: `npm test` and `npm run typecheck` in `.pi/extensions/deep-pi/` and `.pi/extensions/pi-cache-optimizer/`, recording test counts and exit statuses from the actual output (read-only, executable before authorization). Evidence: deep-pi `Test Files 8 passed (8)`, `Tests 60 passed (60)`; optimizer `ℹ pass 25`, `ℹ fail 0`; all four commands exited 0.
- [x] T002 Obtain explicit operator authorization to modify files under `.pi/extensions/`. Evidence: the user explicitly requested “Implement phase 008/001-correctness-floor of the pi-cache-optimizer / deep-pi improvement work” and authorized the listed file changes.
- [x] T003 Immediately before editing, re-verify the four P0 citations against the live source: `telemetry.ts:52-55`, `index.ts:1279-1281` plus `eligibility.ts:1-18`, the six guard sites at `index.ts:7280/7298/7304/7425/7479/7541`, and `deeppi.ts:67`. Evidence: the live-source line dump recorded the split guard, both unchanged predicates, all six guards, and the report call site before implementation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] REQ-001: split `recordUsage`'s first guard in `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` — keep `!model` as its own early return, and change the token test to `usage.input + usage.cacheRead + usage.cacheWrite === 0` so a cache-write-only turn is recorded instead of discarded and `usageUnavailable` is not latched. Evidence: live source shows separate guards at lines 50-56; deep-pi full suite passed 66/66.
- [x] T005 [P] REQ-001: add vitest coverage in `.pi/extensions/deep-pi/tests/telemetry.test.ts` for three cases — a cache-write-only turn records and leaves `usageUnavailable` false; a fully zero-token turn still sets it; a later normal turn still records after a cache-write-only turn. Evidence: `npm test` reported `Test Files 9 passed (9)` and `Tests 66 passed (66)`.
- [x] T006 [P] REQ-001: assert the documented intermediate accounting state explicitly (`responses` incremented, `hitTokens`/`missTokens` unchanged, `actualInputCost` omitting `usage.cost.cacheWrite`), so phase 002 starts from a known state rather than an assumption. Evidence: the cache-write-only test asserts `responses === 1`, both token counters `=== 0`, and `actualInputCost === 0`.
- [x] T007 [P] REQ-006: add `latestChurn` to `ReportInput` in `telemetry.ts`, read it in `formatDeepPiReport` instead of `input.telemetry.latestChurn`, delete the write at `.pi/extensions/deep-pi/extensions/deeppi.ts:67`, and pass `latestChurn: stability.latestChurn` in the existing call-site object literal. Evidence: live `rg -n latestChurn` shows the report input and stability source, with no telemetry-state field or command assignment.
- [x] T008 [P] REQ-006: remove the now-unread `TelemetryState.latestChurn` field with its initialization and reset lines, and update `.pi/extensions/deep-pi/tests/telemetry.test.ts:64` which sets it directly; confirm by grep that no reader remains. Evidence: `rg -n latestChurn` returned only stability, `ReportInput`, the report reader, and explicit test inputs.
- [x] T009 [P] REQ-006: add a test asserting a `/deeppi` invocation leaves telemetry state byte-identical while the rendered report still shows the current prefix churn. Evidence: `npx vitest --run tests/deeppi.integration.test.ts -t "renders current prefix churn"` reported `Tests 1 passed | 5 skipped (6)`.
- [x] T010 REQ-002: author the shared ownership fixture (proposed `.pi/extensions/shared/deepseek-ownership.json`) with an `owned` list and an `excluded` list covering `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash`. Evidence: the JSON contains exactly two owned and two excluded entries.
- [x] T011 REQ-002: wire deep-pi's suite to assert `isDeepPiModel` agrees with the fixture on every entry, and pi-cache-optimizer's suite to assert the same for `isDeepPiOwned` via its `__internals_for_tests` export. Evidence: both ownership wrappers passed their named contract test; the optimizer full run included `keeps both real predicates aligned with the shared fixture`.
- [x] T012 REQ-003: author the runner-free composition body (proposed `.pi/extensions/shared/composition/one-owner.ts`) with no runner imports, taking both predicates plus the fixture and returning structured per-model results. Evidence: the module exports the pure `composeOneOwner` function and imports no runner package.
- [x] T013 REQ-003: add the two thin wrappers — a `node:test` wrapper in pi-cache-optimizer's suite and a `vitest` wrapper in deep-pi's — and update pi-cache-optimizer's `package.json` test script, which currently names exactly one file and would otherwise never run the new one. Evidence: package script is `node --import jiti/register --test tests/*.test.ts`; both wrappers ran 3/3.
- [x] T014 REQ-004: build the combined host on `deep-pi/tests/fake-pi.ts`, registering both extensions on one `FakePi` instance, and assert on observed hook behavior that exactly one extension reacts per model id across the owned pair and both excluded neighbours. Evidence: both wrappers reported `observes exactly one extension reacting in the combined host` as passing.
- [x] T015 REQ-005: add six hook-level early-return tests in pi-cache-optimizer covering `session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, and `message_end`, each asserting the suppressed side effect does not occur for an owned model. Evidence: full hook run reported six named checks and `ℹ pass 6`, `ℹ fail 0`.
- [x] T016 REQ-005: confirm each test's observation handle against the real source before relying on it — several run through module-level state reachable only via the `__internals_for_tests` export, and the handles listed in `plan.md` §3 are a starting point, not a verified contract. Evidence: the live line dump confirmed guards at 7280/7298/7304/7425/7479/7541; the tests invoke registered handlers and observe status, notification, global, payload, and cache-stat effects.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Negative control for REQ-001: restore the original guard condition, confirm the cache-write-only test fails, restore the fix, confirm green. Evidence: failure was `AssertionError: expected false to be true` at `tests/telemetry.test.ts:51:6`; restored run passed 1/1.
- [x] T018 Negative control for REQ-006: restore the `telemetry.latestChurn` assignment and the old telemetry reader/state shape, confirm the no-mutation test fails, restore the fix, confirm green. Evidence: failure was `AssertionError: expected ... to contain 'Prefix churn:       tool-schema'` with actual `Prefix churn:       none` at `tests/deeppi.integration.test.ts:132:37`; restored run passed 1/1.
- [x] T019 Negative control for REQ-002: add a synthetic entry to the shared fixture without updating either fork, confirm both forks' contract tests fail, remove it, confirm green. Evidence: deep-pi failed `AssertionError: expected false to be true` at `tests/ownership-composition.test.ts:61:40`; optimizer failed `AssertionError [ERR_ASSERTION]: deepseek/deepseek-v4-ultra` followed by `false !== true` at `tests/ownership-composition.test.ts:65:23`; both restored.
- [x] T020 Negative control for REQ-005: delete one guard at a time, confirm exactly one hook test fails per deletion and no other test changes state, restore after each [evidence: `tests/hook-guards.test.ts:86` through `:151`; restored tests 6 passed]. Evidence: the six exact failures are recorded below; each run reported 5 pass / 1 fail, then the guard was restored.
- [x] T021 Confirm the composition test genuinely executed rather than silently skipping: check the runner's reported test count and named test output, not just the process exit status. Evidence: deep-pi reported `Tests 3 passed (3)`; optimizer reported `ℹ tests 3`, `ℹ pass 3`, `ℹ fail 0`, with all three named tests printed.
- [x] T022 Re-run `npm test` and `npm run typecheck` in both forks from the final state, read the output and exit status, and compare against T001's baseline. Evidence: final deep-pi 9 files/66 tests and optimizer 34 tests; all four final commands exited 0, with exact output below.
- [x] T023 `git diff --numstat` limited to `spec.md` §3's file list plus the new shared fixture paths; reconcile any file that appears and was not planned before claiming completion. Evidence: the scoped status/diff review below lists only the requested implementation and phase-document paths; unrelated pre-existing worktree changes were left untouched.
- [x] T024 Confirm no task, requirement, or checklist item anywhere in 008 proposes changing `atomicWriteFile`'s rename path — the excluded `f-deeppi-cas-gap` finding stays excluded (REQ-008). Evidence: `rg -n "atomicWriteFile|hashlines|rename path|f-deeppi-cas-gap" specs/.../008-implement-fork-improvements` finds only the exclusion rationale and no implementation task.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:evidence -->
## Evidence Record

### Baseline captured before implementation (T001)

Deep-pi `npm test`:

```text
> @arter/deep-pi@1.0.0 test
> vitest --run

 Test Files  8 passed (8)
      Tests  60 passed (60)
```

Deep-pi `npm run typecheck`:

```text
> @arter/deep-pi@1.0.0 typecheck
> tsc --noEmit
```

Pi-cache-optimizer `npm test`:

```text
> pi-cache-optimizer@2.8.0 test
> node --import jiti/register tests/review-findings.test.ts

ℹ tests 25
ℹ suites 7
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Pi-cache-optimizer `npm run typecheck`:

```text
> pi-cache-optimizer@2.8.0 typecheck
> tsc --noEmit --pretty false
```

All four baseline commands exited 0.

### Negative controls (T017-T020)

REQ-001, with the old `usage.input + usage.cacheRead === 0` guard restored:

```text
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

❯ tests/telemetry.test.ts:51:6
49| totalTokens: 500,
50| cost: { input: 0, output: 0.01, cacheRead: 0, cacheWrite: 0.02, tota…
51| })).toBe(true);
52| expect(state.usageUnavailable).toBe(false);
```

REQ-002, after adding `deepseek/deepseek-v4-ultra` to the fixture:

```text
deep-pi:
AssertionError: expected false to be true // Object.is equality
❯ tests/ownership-composition.test.ts:61:40

pi-cache-optimizer:
AssertionError [ERR_ASSERTION]: deepseek/deepseek-v4-ultra

false !== true

at .../pi-cache-optimizer/tests/ownership-composition.test.ts:65:23
```

REQ-004, after removing the optimizer registration from the combined host:

```text
AssertionError [ERR_ASSERTION]: opencode/deepseek-v4-flash-free
+ actual - expected

+ 'undefined'
- 'string'

at .../pi-cache-optimizer/tests/ownership-composition.test.ts:105:25
```

REQ-005, after deleting each real guard in turn:

```text
session_start:
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

4 !== 0

at tests/hook-guards.test.ts:86:19

model_select:
Expected values to be strictly equal:

1 !== 0

at tests/hook-guards.test.ts:95:19

before_agent_start:
+ actual - expected

+ 'hook-guard-session'
- 'sentinel-cache-key'

at tests/hook-guards.test.ts:109:21

before_provider_request:
+ {
+   messages: [...]
+   prompt_cache_key: 'hook-guard-session'
+ }
- undefined

at tests/hook-guards.test.ts:124:19

after_provider_response:
Expected values to be strictly equal:

1 !== 0

at tests/hook-guards.test.ts:136:19

message_end:
Expected values to be strictly equal:

1 !== 0

at tests/hook-guards.test.ts:151:19
```

Each REQ-005 negative-control run reported `tests 6`, `pass 5`, `fail 1`; each guard was restored immediately. The restored full hook run reported `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`.

REQ-006, after restoring the old `TelemetryState.latestChurn` reader/state and the command assignment:

```text
AssertionError: expected 'Model:              deepseek-v4-pro\n…' to contain 'Prefix churn:       tool-schema'

- Expected
+ Received
+ Model:              deepseek-v4-pro
+ Responses:          0
+ Cache read:         0 tokens
+ Uncached input:     0 tokens
+ Cache hit rate:     unavailable
+ Actual input cost:  $0.0000
+ Estimated savings:  $0.0000
+ Prefix churn:       none
❯ tests/deeppi.integration.test.ts:132:37
```

All five controls were restored before the final gate. The final focused tests and both full suites passed.

### Final authoritative gate (T022)

Deep-pi `npm test`:

```text
> @arter/deep-pi@1.0.0 test
> vitest --run

 RUN  v4.1.10 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/deep-pi

 Test Files  9 passed (9)
      Tests  66 passed (66)
   Start at  10:51:34
   Duration  574ms (transform 431ms, setup 0ms, import 595ms, tests 535ms, environment 0ms)
```

Deep-pi `npm run typecheck`:

```text
> @arter/deep-pi@1.0.0 typecheck
> tsc --noEmit
```

Pi-cache-optimizer `npm test`:

```text
> pi-cache-optimizer@2.8.0 test
> node --import jiti/register --test tests/*.test.ts

✔ session_start guard suppresses restore and status effects (1045.84475ms)
✔ model_select guard suppresses compatibility and status effects (4.873584ms)
✔ before_agent_start guard leaves the cache key global untouched (4.261375ms)
✔ before_provider_request guard preserves the payload (3.956125ms)
✔ after_provider_response guard suppresses response diagnostics (3.560958ms)
✔ message_end guard suppresses cache-stat recording (3.722458ms)
▶ DeepSeek ownership contract
  ✔ keeps both real predicates aligned with the shared fixture (1056.1635ms)
  ✔ composes one owner from both real predicates (36.855125ms)
  ✔ observes exactly one extension reacting in the combined host (44.225417ms)
✔ DeepSeek ownership contract (1138.532917ms)
▶ stable prompt reordering
  ✔ preserves an ambiguous candidate inside dynamic marked content (0.770875ms)
  ✔ lifts a unique candidate deterministically (0.654125ms)
  ✔ preserves dynamic content nested inside a full context-file candidate (0.23925ms)
✔ stable prompt reordering (2.502042ms)
▶ DeepSeek Pi-owned model detection
  ✔ matches only DeepSeek V4 Flash and Pro models (0.184917ms)
✔ DeepSeek Pi-owned model detection (0.403834ms)
▶ footer stats modes
  ✔ defaults to total and accepts session, total, or process environment values (0.982625ms)
  ✔ persistent configuration overrides the environment mode (0.054667ms)
  ✔ selects direct model stats from the requested scope (0.110417ms)
  ✔ uses the requested scope for exact router restore (0.634833ms)
  ✔ restores only the matching session bucket (0.288042ms)
  ✔ keeps router fallback inside the requested scope (0.298458ms)
  ✔ persists the command override atomically (5.473459ms)
  ✔ config command overrides the environment mode (7.397459ms)
  ✔ interactive menu exposes and applies footer mode (5.918625ms)
✔ footer stats modes (21.559792ms)
▶ Pi 0.83 adaptive-thinking compatibility
  ✔ reports missing adaptive compat for native Claude Opus 5 (1.062167ms)
  ✔ does not report adaptive compat when Claude Opus 5 is configured (0.110416ms)
  ✔ keeps older non-adaptive Claude models as a negative case (0.384084ms)
✔ Pi 0.83 adaptive-thinking compatibility (1.650459ms)
▶ explicit compat precedence
  ✔ modelOverrides true wins over false model and provider values (0.148625ms)
  ✔ modelOverrides false wins over true model and provider values (0.036291ms)
  ✔ custom model wins over provider and provider remains the fallback (0.047333ms)
  ✔ before_provider_request reads modelOverrides from the active agent directory (5.597833ms)
✔ explicit compat precedence (5.950708ms)
▶ modelOverrides JSONC fixes
  ✔ surgically repairs an existing override and preserves comments (1.40525ms)
  ✔ self-check rejects a lower-layer edit shadowed by modelOverrides (0.153375ms)
  ✔ creates only a modelOverrides entry for a built-in model (0.377375ms)
  ✔ creates a comment-safe modelOverrides-only provider entry (0.156542ms)
✔ modelOverrides JSONC fixes (2.168917ms)
▶ /cache-optimizer fix command
  ✔ direct and menu paths repair the effective modelOverride (14.039625ms)
✔ /cache-optimizer fix command (14.291166ms)
ℹ tests 34
ℹ suites 8
ℹ pass 34
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1273.06675
```

Pi-cache-optimizer `npm run typecheck`:

```text
> pi-cache-optimizer@2.8.0 typecheck
> tsc --noEmit --pretty false
```

All four final commands exited 0.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] T002's authorization block cleared, with no `[B]` tasks remaining
- [x] Every P0 requirement has a negative control that reproduced its predicted failure, run and read rather than assumed
- [x] Both forks green on `npm test` and `npm run typecheck` from the final state
- [x] `validate.sh <this-folder> --strict` exits with 0 errors and 0 warnings. Evidence: final run returned `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`, exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Successor**: `../002-observability-and-economics/`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md`
<!-- /ANCHOR:cross-refs -->
