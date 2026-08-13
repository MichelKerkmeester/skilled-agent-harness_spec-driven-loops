---
title: "Tasks: Observability and Economics"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "observability and economics tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/002-observability-and-economics"
    last_updated_at: "2026-08-08T09:43:42Z"
    last_updated_by: "codex"
    recent_action: "Recorded implementation and verification evidence"
    next_safe_action: "Proceed to phase 003 maintainability and provenance"
    blockers: []
    key_files: ["tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Observability and Economics

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

- [x] T001 Capture a real pre-change baseline in `.pi/extensions/deep-pi/`: `npm test` reported 9 files/66 tests passing and `npm run typecheck` exited 0
- [x] T002 Confirm phase 001 is complete and its suite green; the ownership file exists and the cache-write-only tests reach `recordUsage`
- [x] T003 Obtain explicit operator authorization to modify files under `.pi/extensions/`. Evidence: the user requested implementation of phase `008/002-observability-and-economics` with the listed in-scope files and verification gates.
- [x] T004 Write the characterization test pinning today's exact `/deeppi` report text before any refactor touches `formatDeepPiReport`; the pre-change focused run passed 11 tests
- [x] T005 Confirm `ExtensionCommandContext` guarantees `ctx.ui` by reading `@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts`: `ui` is required and `hasUI` is separate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 REQ-004: add and accumulate `ModelTotals.cacheWriteTokens` first; cache-write-only coverage asserts 500 tokens reach the bucket
- [x] T007 REQ-004: read the real assistant stop-reason union and add it to the inline event structural type; `aborted` returns before recording while `stop` records
- [x] T008 REQ-004: validate finite, non-negative usage and pricing before any totals mutation; `NaN` and `-1` negative controls leave totals unchanged
- [x] T009 REQ-003: add `usage.cost.cacheWrite` to `actualInputCost`; the cache-write-only test now records its 0.02 cost
- [x] T010 REQ-003: rename the field to `noCacheCounterfactualSavings` and render `No-cache counterfactual savings`
- [x] T011 REQ-003: confirm Pi live model metadata: Flash cost input 0.14/cache-read 0.0028/cache-write 0; Pro input 0.435/cache-read 0.003625/cache-write 0 [EVIDENCE: `models-store.json` live metadata]
- [x] T012 REQ-006: add all three counters to `ReportInput`, the builder, transport, and renderer; tests assert nonzero lines and clean omission
- [x] T013 REQ-006: confirm `resetStormBreaker` clears `errorsEnhanced` and `session_start` clears `prunedThinking`/`preservedThinking`; no redundant reset added
- [x] T014 REQ-001: author `stats.ts` with schemaVersion 1, session records, and cumulative UTC-date daily records
- [x] T015 REQ-001: use the existing exported `atomicWriteFile` and `expectedContent` CAS; no duplicate rename logic was added
- [x] T016 REQ-001: corrupt JSON and schemaVersion 99 return explicit `unreadable` results and preserve original bytes
- [x] T017 REQ-001: flush stats on `session_shutdown` and `/deeppi`; the report transport test proves `message_end` does not create the stats file
- [x] T018 REQ-002: split `buildDeepPiReport`, `renderDeepPiReport`, and the compatibility formatter; the exact-text characterization remains green
- [x] T019 REQ-002: transport writes the JSON snapshot unconditionally and calls `ctx.ui.notify` only when `ctx.hasUI` is true
- [x] T020 REQ-008: write `denominator-note.md` with both formulas and the normalize-before-combining rule
- [x] T021 REQ-005: build and run `benchmarks/before-provider-request.mjs` outside Vitest; timings are recorded below and the hot path is unchanged
- [x] T022 REQ-007: write `benchmark-protocol.md`; it is design-only and states phase 001 true plus phase 003 packaging still required
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Stats round-trip: session replacement and cumulative daily aggregation pass in `stats.test.ts`; lifecycle flush is covered in `report.test.ts`
- [x] T024 Corrupt-file and unknown-version cases return explicit unreadable results and leave source bytes unchanged [EVIDENCE: `stats.test.ts`]
- [x] T025 Two prepared concurrent writers share one expected content; one commit succeeds and one CAS commit rejects [EVIDENCE: `stats.test.ts`]
- [x] T026 Characterization test remains green after the report split; the final exact output is pinned byte-for-byte [EVIDENCE: `telemetry.test.ts`]
- [x] T027 UI-less command writes a versioned snapshot and emits zero notifications [EVIDENCE: `report.test.ts`]
- [x] T028 `aborted` is rejected and `stop` records one response in the focused telemetry test
- [x] T029 Harness measured clone/digest/combined cost at 10, 50, 200, and 800 conversation turns; no optimization justified [EVIDENCE: `benchmarks/before-provider-request.mjs` 1.698734 ms/op]
- [x] T030 Final verification pass: `npm test` 11 files/76 tests passed; `npm run typecheck` exited 0
- [x] T031 Scoped diff/status reviewed; task files are limited to the declared deep-pi additions/modifications and phase documents, with unrelated dirty worktree changes preserved [EVIDENCE: `git diff` review]
- [x] T032 Effective date recorded as 2026-08-08: `actualInputCost` now includes `usage.cost.cacheWrite`, and the no-cache field/label is explicit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] T002 and T003's blocks cleared, with no `[B]` tasks remaining [EVIDENCE: `tasks.md` completion gate]
- [x] REQ-005 closed with real numbers on record, with no hot-path change
- [x] No savings figure published without T011's pricing confirmation
- [x] deep-pi green on `npm test` and `npm run typecheck` from the final state
- [x] `validate.sh <this-folder> --strict` exits with 0 errors and 0 warnings — final validator run recorded in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../001-correctness-floor/`
- **Successor**: `../003-maintainability-and-provenance/`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md`
<!-- /ANCHOR:cross-refs -->
