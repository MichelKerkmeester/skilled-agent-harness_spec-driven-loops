---
title: "Verification Checklist: Observability and Economics"
description: "Verification gates for the P1 observability-and-economics phase: persistent stats, structured report, honest cost accounting, stopReason guard, and the measured hot-path investigation."
trigger_phrases:
  - "observability and economics checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/002-observability-and-economics"
    last_updated_at: "2026-08-08T09:43:42Z"
    last_updated_by: "codex"
    recent_action: "Recorded final verification evidence"
    next_safe_action: "Proceed to phase 003 maintainability and provenance"
    blockers: []
    key_files: ["checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stats schema and path are independent at <cwd>/.pi/deep-pi-stats.json."
      - "Savings is named noCacheCounterfactualSavings and labeled as a no-cache counterfactual."
      - "ctx.ui is required by Pi's type; hasUI controls notification."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Observability and Economics

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Completion status:** all gates below were checked against the implemented deep-pi source, focused negative controls, the standalone benchmark, and the final workspace verification pass.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 001 confirmed complete and green before this phase begins
  [EVIDENCE: baseline command and ownership file] Verification: baseline `npm test` reported 9 files/66 tests passing; `.pi/extensions/shared/deepseek-ownership.json` exists with both owned direct models.
- [x] CHK-002 [P0] Operator authorization to modify files under `.pi/extensions/` obtained and recorded
  [EVIDENCE: explicit user implementation request] Verification: `tasks.md` T003 records the user's explicit implementation request and its file/verification constraints.
- [x] CHK-003 [P0] The characterization test pinning today's `/deeppi` report text exists and passes before any refactor begins
  [EVIDENCE: focused characterization test] Verification: the focused pre-refactor `tests/telemetry.test.ts` run passed 11 tests; the final exact-string pin remains green after layering.
- [x] CHK-004 [P1] Real pre-change baseline captured in deep-pi
  [EVIDENCE: baseline test and typecheck output] Verification: baseline `npm test`: 9 files/66 tests, exit 0; baseline `npm run typecheck`: exit 0.
- [x] CHK-005 [P1] `ExtensionCommandContext`'s `ctx.ui` guarantee confirmed against Pi's type definitions
  [EVIDENCE: installed Pi type definitions] Verification: installed `types.d.ts` declares required `ui` on `ExtensionContext`; `ExtensionCommandContext` extends it; `hasUI` is the capability flag.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The read-modify-write update path reuses `atomicWriteFile`'s temp-and-rename; only first-time file creation uses a separate primitive
  [EVIDENCE: source import audit + HANDOFF correction] Verification: `commitStatsUpdate` calls `atomicWriteFile(prepared.path, prepared.content, prepared.expectedContent)` (`stats.ts:346`), no second temp-and-rename implementation exists. `seedFile` (`stats.ts:251`) is a deliberate, separate first-write bootstrap using its own exclusive `open(path, "wx", 0o600)` — not `atomicWriteFile` — because it only needs OS-level create-if-absent, not CAS-on-update; a HANDOFF review correctly flagged the original evidence line's "does not duplicate" claim as false. It is now cross-process-safe because `withCrossProcessLock` (`stats.ts:223`) wraps the whole update and snapshot cycles, `seedFile` included.
- [x] CHK-011 [P0] None of pi-cache-optimizer's three named persistence weaknesses is reproduced
  [EVIDENCE: stats negative controls and CAS test] Verification: corrupt/future files return unreadable; `expectedContent` CAS and the helper's verified rename are used; `stats.test.ts` proves a stale writer rejects; a real two-OS-process test proves `withCrossProcessLock` serializes the whole cycle (`stats.test.ts` "cross-process mutual exclusion").
- [x] CHK-012 [P0] Numeric validation happens before any `totals` mutation, never as a try/catch after
  [EVIDENCE: numeric all-or-nothing test] Verification: focused negative controls reject `NaN` and `-1`, increment the error count, and compare totals unchanged.
- [x] CHK-013 [P1] The report split is a genuine three-layer separation, not a rename
  [EVIDENCE: report layer source and tests] Verification: `buildDeepPiReport` returns only versioned data, `renderDeepPiReport` consumes that object, and `deeppi.ts` owns snapshot/notification transport.
- [x] CHK-014 [P1] The stats flush is not on the `message_end` hot path
  [EVIDENCE: lifecycle call-site audit and test] Verification: source call sites are `session_shutdown` and the command handler; `report.test.ts` confirms no stats file after only `message_end`.
- [x] CHK-015 [P1] No change touches activation, ownership, or hook registration
  [EVIDENCE: scoped source diff] Verification: `eligibility.ts` and the existing registration calls are unchanged; only report transport and persistence lifecycle were added.
- [x] CHK-016 [P1] No unrelated files or incidental edits
  [EVIDENCE: scoped status and diff audit] Verification: scoped status/diff audit separated task changes from pre-existing dirty files and found no `pi-cache-optimizer` change.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stats survive a real restart, and corruption and version skew fail loudly
  [EVIDENCE: stats and lifecycle test output] Verification: `stats.test.ts` passes round-trip, corrupt, future-version, and interleaved CAS cases; `report.test.ts` covers session-shutdown flush and subsequent read.
- [x] CHK-021 [P0] REQ-005 is closed with measured numbers, whichever way it went
  [EVIDENCE: standalone benchmark output] Verification: standalone output is recorded for 10/50/200/800 turns: clone 0.061804/0.088483/0.263095/0.857471 ms/op; digest 0.017594/0.060828/0.203471/0.904835; combined 0.073888/0.165869/0.496420/1.698734. No hot-path change justified.
- [x] CHK-022 [P0] The characterization test is still green after the report split
  [EVIDENCE: exact renderer assertion] Verification: exact output assertion passes; changing the label or whitespace would fail the `toBe([...].join("\n"))` pin.
- [x] CHK-023 [P0] The `stopReason` guard is proven both ways
  [EVIDENCE: stopReason negative control] Verification: the focused telemetry test rejects `aborted` and records `stop`; the structural type uses Pi's assistant stop-reason union.
- [x] CHK-024 [P1] The report snapshot is written with no UI attached
  [EVIDENCE: UI-less snapshot test] Verification: `report.test.ts` sets `hasUI=false`, observes zero notifications, and reads snapshot `schemaVersion: 1`.
- [x] CHK-025 [P1] Full suite and typecheck green from the final state
  [EVIDENCE: final npm test and typecheck output] Verification: final pass reported 11 files/76 tests and `npm run typecheck` exit 0.
- [x] CHK-026 [P1] The three surfaced counters appear only when nonzero
  [EVIDENCE: `report.test.ts` conditional counter assertions] Verification: report tests assert all three nonzero lines; the exact clean characterization input has all three at zero and no lines.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All five P1 action-list items are addressed, none silently dropped
  [EVIDENCE: `tasks.md` requirements-to-tests mapping] Verification: research action-list items 5-9 map to REQ-001, REQ-002, REQ-003, REQ-004, and REQ-005 respectively; each has tasks and gates here.
- [x] CHK-FIX-002 [P0] No savings figure is published without confirmed pricing
  [EVIDENCE: live Pi model metadata output] Verification: `tasks.md` T011 records the check against Pi's live model metadata for both owned model ids; the sibling fork's `index.ts:2183`/`:2186` evidence alone does not satisfy this.
- [x] CHK-FIX-003 [P1] The 001-to-002 seam held: cache-write tokens now land somewhere real
  [EVIDENCE: cache-write bucket assertion] Verification: phase 001's documented intermediate state (`responses` incremented, token buckets untouched) no longer applies — a cache-write-only turn now reaches a cache-write bucket, asserted by test.
- [x] CHK-FIX-004 [P1] The crossover benchmark stayed designed and unrun
  [EVIDENCE: `benchmark-protocol.md` and scope audit] Verification: REQ-007's protocol document exists and states both preconditions; no savings percentage is presented as causal anywhere in this phase's output.
- [x] CHK-FIX-005 [P1] Open questions from `spec.md` §7 resolved and recorded before this phase closes
  [EVIDENCE: spec section 7 resolutions] Verification: the stats-schema question, the rename-versus-relabel question, and the `ctx.ui` guarantee each answered with the reasoning.
- [x] CHK-FIX-006 [P2] The accounting change is dated so past figures remain interpretable
  [EVIDENCE: dated accounting decision] Verification: `tasks.md` T032; a reader comparing against the 2026-08-08 benchmark artifact can see why the numbers moved.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The new stats file contains no prompt content, message text, or credential material
  [EVIDENCE: `stats.ts` schema inspection] Verification: the schema holds token counts, costs, model ids, and dates only; a written stats file is inspected directly to confirm no conversation data leaked into it.
- [x] CHK-031 [P0] The stats file and report snapshot are written with safe permissions and refuse symlink targets
  [EVIDENCE: atomic helper + seed path source audit] Verification: the update path's `atomicWriteFile` creates its temp with mode `0o600` (`hashlines.ts:67`) and refuses to replace a symbolic link (`:75-80`). The separate first-write bootstrap `seedFile` (`stats.ts:251`) achieves the same two properties independently: `open(path, "wx", 0o600)` sets the mode directly, and `O_EXCL` fails on any pre-existing path entry — including a symlink — without following it, so it neither reuses nor bypasses the helper's guarantee, it duplicates the guarantee through its own primitive.
- [x] CHK-032 [P0] No secrets or credentials introduced in source, tests, or the benchmark protocol
  [EVIDENCE: secret-pattern scan] Verification: `grep -rnE` for assigned-secret patterns across the changed paths returns zero matches.
- [x] CHK-033 [P1] The report snapshot path is predictable and does not escape its intended directory
  [EVIDENCE: `stats.ts` fixed snapshot path source] Verification: the path is derived from a fixed base, not from model id or session id interpolation that could contain separators.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist reflect actual execution state, not planning-time defaults
  [EVIDENCE: completion metadata and evidence log] Verification: Status is Complete, task boxes reflect what really ran, and the evidence log carries real command or harness output.
- [x] CHK-041 [P1] The denominator asymmetry note exists and says what it must
  [EVIDENCE: `denominator-note.md`] Verification: REQ-008's note records both formulas with their line ranges and states that a combined dashboard must normalize first.
- [x] CHK-042 [P1] The new report data shape is documented for its future consumers
  [EVIDENCE: report schema documentation] Verification: `spec.md` §7 and `implementation-summary.md` document `schemaVersion`, model/totals/churn/counter fields, and the UI-less snapshot contract.
- [x] CHK-043 [P2] Any deviation from `plan.md` §3's approach is recorded with its reason
  [EVIDENCE: implementation evidence section] Verification: an undocumented deviation is the defect, not the deviation itself.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The new module sits inside deep-pi's shipped `extensions/` tree so packaging is not silently broken
  [EVIDENCE: isolated npm pack dry-run] Verification: `deep-pi/package.json:36-41` already allowlists `extensions`; `npm pack --dry-run` confirms `stats.ts` is included.
- [x] CHK-051 [P1] The benchmark harness and protocol live outside the assertion suite
  [EVIDENCE: standalone benchmark path and final suite] Verification: the timing harness is not run by `npm test`, so a slow machine cannot fail the suite.
- [x] CHK-052 [P1] No temp or scratch artifact left inside the extension directory or this spec folder
  [EVIDENCE: HANDOFF-driven cleanup + root-cause fix] Verification: a HANDOFF review correctly found this claim false — `.pi/deep-pi-stats.json` and a matching `.tmp` sibling existed at the repo root from manual testing, and `fakeContext()` in `tests/fake-pi.ts` defaulted `cwd` to the real `process.cwd()`, so any test exercising `/deeppi`'s handler without overriding `cwd` wrote real files into `.pi/extensions/deep-pi/.pi/` on every run. Both stray files were removed; `fakeContext()` now defaults `cwd` to a fresh `mkdtemp` directory per call. `git status --porcelain .pi/` shows zero stray paths after a full `npm test` run in both forks.
- [x] CHK-053 [P2] `implementation-summary.md` was added only after implementation completed
  [EVIDENCE: post-implementation summary creation] Verification: the summary is being created after code, tests, benchmark, cleanup, and final validation work.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 19 | 19/19 |
| P2 Items | 3 | 3/3 |

**Status**: Complete — all 37 gates are verified. The final deep-pi gate is 11 test files/76 tests passing with typecheck exit 0; the baseline was 9 files/66 tests. The standalone benchmark ran separately, the crossover protocol was not run, and no `pi-cache-optimizer` files were changed.
<!-- /ANCHOR:summary -->
