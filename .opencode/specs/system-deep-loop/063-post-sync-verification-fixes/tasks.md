---
title: "Tasks: Fix test failures surfaced by post-sync verification"
description: "Task tracking for 5 test-failure root-causes and fixes across system-spec-kit and deep-ai-council."
trigger_phrases:
  - "tasks"
  - "post-sync"
  - "verification fixes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/063-post-sync-verification-fixes"
    last_updated_at: "2026-07-12T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Packet completed: 5 test failures root-caused and fixed"
    next_safe_action: "None - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-sync-verification-fixes/063"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fix test failures surfaced by post-sync verification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 [P] Trace `.opencode/agents/deep-review.toml` history — confirm never existed vs. dropped (`git log --all --follow`)
- [x] T002 [P] Trace canonical runtime registry (`runtime_capabilities.json`) — confirm real runtime count/IDs
- [x] T003 [P] Trace `buildTraceabilityRollup`'s `gatingFailures` computation against a sibling passing test's fixture convention (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`)
- [x] T004 [P] Trace the missing CLI validation guard and locate the existing shared `EXECUTOR_KINDS` constant (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Drop dead `.toml` mirror path from `runtimeMirrors` (`.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts`)
- [x] T006 Fix hardcoded runtime-ID expectation to `['opencode', 'claude']` (same file)
- [x] T007 Add `gateClass: 'hard'`, `applicable: true` to the LG-0006 fixture (`.opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts`)
- [x] T008 Add `main()`-level `executor.model` vs. `EXECUTOR_KINDS` guard (`.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run `deep-review-contract-parity.vitest.ts` + `reducer-backlog-remediation.vitest.ts` — confirm pass
- [x] T010 Re-run `orchestrate-session-cli.vitest.ts` + `orchestrate-topic.vitest.ts` — confirm pass
- [x] T011 Re-run the full 5-file `system-spec-kit` combined-config batch — confirm 35/35 pass
- [x] T012 Re-run `system-deep-loop/runtime` (161 tests) + `deep-improvement` (48 tests) — confirm zero regressions
- [x] T013 Update spec documentation with implementation notes - [evidence: `implementation-summary.md` Key Decisions + Verification tables filled with real root-cause evidence and `35/35` + `161/161` + `48/48` test-run results]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-up — wire deep-ai-council into a real vitest config

- [x] T014 Add `.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs` (mirrors `deep-improvement/scripts/vitest.config.mjs`)
- [x] T015 Run the full suite post-wiring — discover 2 new pre-existing failures - [evidence: `npx vitest run` output before the fix, `Test Files 2 failed | 8 passed (10)` across 94 total tests, up from the 2 files/12 tests originally checked]
- [x] T016 Trace `persist-artifacts.vitest.ts` failure — `execution_provenance` computed in `dispatchSeat()` but dropped before reaching `persistSeatStepwise`
- [x] T017 Trace `orchestrate-session.vitest.ts` failure — `route_fields` had no `requested`/`effective` split, unlike the seat-level equivalent
- [x] T018 Fix: add `execution_provenance` to `persistedSeat` (`orchestrate-session.cjs`) and carry it through `buildProgressRecord`/`persistSeatStepwise` (`persist-artifacts.cjs`)
- [x] T019 Fix: add `requested`/`effective` to `route_fields` in `withCouncilRouteConfig()` (`orchestrate-session.cjs`), additive alongside the existing flat fields
- [x] T020 Re-run the full `deep-ai-council` suite — confirm 10/10 files, 94/94 tests pass - [evidence: `npx vitest run` output, `Test Files 10 passed (10) / Tests 94 passed (94)`]
- [x] T021 Re-run the system-spec-kit combined batch again — confirm the deep-ai-council changes caused zero cross-suite regressions - [evidence: `35/35` tests still pass]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 originally-failing assertions pass; zero regressions elsewhere

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---
