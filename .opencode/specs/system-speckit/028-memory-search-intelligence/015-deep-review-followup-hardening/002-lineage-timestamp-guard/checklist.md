---
title: "Verification Checklist: Lineage Timestamp Guard"
description: "Level 3 checklist for the timestamp window checker: detection correctness, outcome invariance, and boundary emission."
trigger_phrases:
  - "timestamp guard checklist"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/002-lineage-timestamp-guard"
    last_updated_at: "2026-07-03T10:01:10Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Checklist evidence filled"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-002-timestamp-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lineage Timestamp Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: see evidence line below]
  - **Evidence**: REQ-001..REQ-005 grounded in the live 2026-07-02 incident
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: see evidence line below]
  - **Evidence**: Pure-core thin-shell pattern, seam candidates named
- [x] CHK-003 [P1] Decisions recorded [EVIDENCE: see evidence line below]
  - **Evidence**: decision-record.md ADR-001 (warn-first) and ADR-002 (boundary placement)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Comment hygiene clean on all modified files [EVIDENCE: see evidence line below]
  - **Evidence**: `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` exited 0 for `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts`, and `.opencode/skills/deep-loop-runtime/tests/unit/lineage-timestamp-window.vitest.ts`. Initial `bash` invocation failed because the checker is Python despite its `.sh` suffix; rerun with `python3` passed.
- [x] CHK-011 [P1] Checker is pure (no I/O, no clock reads inside classification) [EVIDENCE: see evidence line below]
  - **Evidence**: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts` exports `checkLineageTimestampWindow(records, input)`; it only parses supplied values and reads no files or current clock.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001: fabricated-shape fixture fully flagged; honest fixture clean [EVIDENCE: see evidence line below]
  - **Evidence**: `npx vitest run tests/unit/lineage-timestamp-window.vitest.ts --no-coverage` reported `5 passed`; fabricated minute-spaced fixture asserted `anomalous: 11` and honest in-window fixture asserted `anomalous: 0`.
- [x] CHK-021 [P0] REQ-002: outcome invariance proven (exit/retry/salvage identical with anomalies) [EVIDENCE: see evidence line below]
  - **Evidence**: The anomalous fanout integration test in `tests/unit/lineage-timestamp-window.vitest.ts` asserted exit `0`, summary `{ succeeded: 1, failed: 0, all_failed: false }`, and no `retry_scheduled` event while emitting `timestamp_anomaly` telemetry.
- [x] CHK-022 [P1] Edge classes covered: boundary-exact, unparseable, untimestamped, retried-attempt window [EVIDENCE: see evidence line below]
  - **Evidence**: Focused vitest covered boundary-exact clean records, unparseable timestamp strings, untimestamped records, and the runner uses the per-attempt worker slot start/end for the successful attempt before emitting telemetry.
- [x] CHK-023 [P1] Mutation check: break the window comparison, confirm the fabricated fixture test fails for the right reason, restore [EVIDENCE: see evidence line below]
  - **Evidence**: Temporarily inverted `timestampMs < lowerBoundMs` to `timestampMs > lowerBoundMs`; targeted vitest failed with `expected { anomalous: +0, ... } to match object { anomalous: 11, ... }`, then restored and reran focused file: `5 passed`.
- [x] CHK-024 [P0] Full deep-loop-runtime vitest suite: 0 new failures [EVIDENCE: see evidence line below]
  - **Evidence**: Baseline `npm test`: `2 failed | 58 passed (60)` files and `2 failed | 578 passed (580)` tests in `dependency-seams.vitest.ts` and `executor-provenance-mismatch.vitest.ts`. Final restored-code `npm test`: `2 failed | 59 passed (61)` files and `2 failed | 583 passed (585)` tests in the same two files; delta is 0 new failures.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P1] Class coverage: the check runs for ALL lineage kinds (native, cli-opencode, cli-claude-code) through the shared completion path [EVIDENCE: see evidence line below]
  - **Evidence**: Integration is in the shared `runCappedPool` worker success path in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, after `buildLineageCommand()` handles `native`, `cli-opencode`, and `cli-claude-code` kinds.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No secrets, credentials, or external I/O
  - **Evidence**: Pure classification over already-read data; N/A by construction

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] implementation-summary.md with real evidence [EVIDENCE: see evidence line below]
  - **Evidence**: `implementation-summary.md` authored with command results from `node --check`, `npm run typecheck`, focused vitest, full vitest baseline/final counts, mutation check, hygiene, alignment, and spec validation.
- [x] CHK-041 [P1] Skew tolerance value and rationale documented where the constant lives [EVIDENCE: see evidence line below]
  - **Evidence**: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts` defines `DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS = 2 * 60 * 1000` and documents the skew/write-latency rationale on the exported checker.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only in-scope runtime files + this spec folder modified [EVIDENCE: see evidence line below]
  - **Evidence**: Authored changes only in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts`, `.opencode/skills/deep-loop-runtime/tests/unit/lineage-timestamp-window.vitest.ts`, and this packet folder.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Matches ADR-001: no outcome change anywhere [EVIDENCE: see evidence line below]
  - **Evidence**: Anomaly check runs only after existing failure gates (`timedOut/exitCode`, missing artifacts, max-iterations stop policy, salvage failure) and only appends warning telemetry; focused integration asserted exit `0`, no retry event, and unchanged success counts with anomalies present.
- [x] CHK-101 [P0] Matches ADR-002: window sourced from runner slot timing, never from lineage-reported values [EVIDENCE: see evidence line below]
  - **Evidence**: `fanout-run.cjs` supplies `slotWindowStartIso` and `slotWindowEndIso` from runner-owned `new Date().toISOString()` calls around the lineage slot; lineage JSONL contributes only candidate `timestamp` values.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P2] No additional file reads (single pass over already-loaded records) [DEFERRED: the existing runner does not retain salvage's state-log read for reuse]
  - **Evidence**: Deferred as P2. The pure checker has no I/O, and `fanout-run.cjs` performs one advisory post-salvage state-log read that is reused for max-iterations policy validation; eliminating the duplicate salvage read would require changing `fanout-salvage.cjs`, which is outside this child scope.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P1] Rollback verified trivial (call-site removal) [EVIDENCE: see evidence line below]
  - **Evidence**: The runner integration is additive and isolated to the post-success `timestamp_anomaly` block plus summary rollup in `fanout-run.cjs`; removing that call site leaves the pure helper and tests inert.

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P2] No regulatory or data-privacy surface
  - **Evidence**: Internal telemetry validation; N/A by construction

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All five docs agree on final state [EVIDENCE: see evidence line below]
  - **Evidence**: `spec.md` status is Complete; `plan.md` DoD is checked; `tasks.md` task ledger is checked; `checklist.md` records completed evidence plus one documented P2 deferral; `implementation-summary.md` records the same final state.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

- [x] CHK-150 [P0] Orchestrator (Claude) independently re-verified implementer claims with real command output [EVIDENCE: see evidence line below]
  - **Evidence**: Orchestrator verification, separate from the implementer session: focused new tests re-run (5/5), full suite re-run (59/61 files passing, same 2 baseline failures previously proven pre-existing by stash re-run), independent mutation check (inverted lower bound broke 4 of 5 tests in both correct directions — fabricated read clean AND honest read anomalous — restored to 5/5), comment hygiene re-run clean on all 3 files, deletion audit of fanout-run.cjs confirming the 14 removed lines are behavior-preserving refactors (shared state-log reader; summary rename with identical exit-code logic). Note: the implementer originally filled this item with its own command list; corrected because the sign-off requires verification independent of the implementer.

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 3 | 3/3 dispositioned |

**Verification Date**: 2026-07-02T16:08:01Z
**Verified By**: openai-gpt-5.5
**ADRs**: 2 documented (decision-record.md), both Accepted

<!-- /ANCHOR:summary -->
