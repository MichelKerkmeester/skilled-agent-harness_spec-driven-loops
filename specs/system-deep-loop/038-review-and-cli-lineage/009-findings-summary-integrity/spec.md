---
title: "Feature Specification: Phase 9: findings-summary-integrity"
description: "The review reducer drops a delta finding written with findingId and pads cumulative summary counts against per-run findings, so a registry can carry phantom summary-only findings."
trigger_phrases:
  - "findings summary integrity"
  - "phase 9 findings summary integrity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: findings-summary-integrity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-lineage-proof-enforcement |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Deep-loop review and CLI lineage specification.

**Scope Boundary**: The review reducer's finding intake, its summary fallback and its resolved-id scans in `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, the delta finding keys that `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` enumerates, the tests for both, and the reviewed relaunch-loop registry. Phase 008 is planned separately and is not touched. The Pi Fast Mode guard and the other review items that came in with the final review wave belong to `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/`, not to this phase.

**Dependencies**:
- The deep review of `specs/hooks/023-session-relaunch-loop`, whose registry shows the defect: 23 open P2 where 12 are real.

**Deliverables**:
- The reducer accepts a delta finding row keyed `findingId`, as `verify-iteration.cjs` already does.
- The summary fallback pads only the shortfall a cumulative `findingsSummary` leaves after every finding active by that run.
- Regression tests, and the affected registry regenerated without phantom rows.
- The verifier and the reducer agree on the delta finding key: `verify-iteration.cjs` enumerates a finding row keyed `id` or `findingId`, and the reducer reads the same two keys.
- The resolved-id scans (`resolvedIdsSeenByRun`, `resolvedIdSet`) read the merged main and delta iteration records, with an iteration-type guard, and the cumulative-summary heuristic carries a comment that states its trade-off.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deltaRecordToFinding` (`reduce-state.cjs:625`) accepts a delta finding only when it carries `id`, while `verify-iteration.cjs` accepts `id` or `findingId`. A leaf that writes `findingId` passes verification, then the reducer drops the row, treats the run as having no structured findings and falls back to the iteration's `findingsSummary`. That fallback compares the counts with findings seen in that run only, but the contract's example writes `findingsSummary` as the running total, equal to `findingsCount`. The relaunch-loop review hit both: iteration 7 listed one new finding under `findingId` with a cumulative `P2: 12`, and the reducer added eleven `SUMMARY-P2-*` rows.

### Purpose
The registry lists exactly the findings the leaves reported, whichever id key a delta row uses and whether `findingsSummary` is per run or cumulative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `findingId` as an alias of `id` in the reducer's delta finding intake.
- Make the summary fallback count every finding active by the run when the summary is the running total (its sum equals the record's `findingsCount`), and keep today's per-run padding otherwise.
- Accept `findingId` in the verifier's delta finding enumeration (`verify-iteration.cjs`), with two table cases in `verify-iteration.vitest.ts`.
- Merge the main and delta iteration records in the resolved-id scans, with an iteration-type guard and a comment at `summaryIsCumulative`.
- Dispose of the findings from the two fresh SWE reviews (rv-open and rv2) that fall in this phase's scope.
- Tests for each change, and a rerun of the reducer on the relaunch-loop review folder.

### Out of Scope
- Phase 008 lineage proof enforcement - planned separately.
- Changing the leaf contract or the append-only state log - the log is hash-chained and stays as written.
- Verifier handling of string-only finding ids: the schema already says strings, and this behavior predates this phase. Accepted by the reviews (ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`).
- The Pi Fast Mode guard and its review findings - tracked in `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | `findingId` alias; cumulative-aware fallback; merged resolved-id scans; comment at `summaryIsCumulative` |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` | Modify | Regression tests |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | Delta finding rows enumerate when keyed `id` or `findingId` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | Cases `review-delta-finding-id` and `review-delta-no-id-key` |
| `specs/hooks/023-session-relaunch-loop/review/deep-review-findings-registry.json`, `deep-review-dashboard.md` | Verify | Derived outputs; already at P2 12 with no summary-only row, and a scratch rerun reproduces them, so this phase does not write them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A delta finding row keyed `findingId` reaches the registry exactly as one keyed `id` does. |
| REQ-002 | A cumulative `findingsSummary` creates no summary-only finding when every counted finding is already in the registry by that run. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The existing summary-fallback tests still pass: summary counts with no other source still produce summary-only rows. |
| REQ-004 | Rerunning the reducer on the relaunch-loop review leaves 12 open P2 findings and no `SUMMARY-` row. |
| REQ-005 | The verifier enumerates a delta finding row keyed `findingId` as it enumerates one keyed `id`, and a row with neither key still does not enumerate. |
| REQ-006 | The resolved-id scans count an iteration record's resolved findings from both the main log and the delta files, and only from iteration-type records. |
| REQ-007 | Each finding from the fresh SWE reviews (rv-open and rv2) that falls in this phase's scope is fixed or accepted with its ledger entry, and the reviewed lanes pass the deep-loop tests. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relaunch-loop registry reports P2 12, matching its review report.
- **SC-002**: The deep-review script tests pass with the new regression tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A per-run summary whose sum happens to equal `findingsCount` is read as cumulative | Med | Then every active finding is counted, which can only lower padding; a test covers a per-run summary that must still pad |
| Risk | Other reducer consumers rely on `findingId` rows being dropped | Low | Run the whole deep-loop script test suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new pass over the state log; the fallback reuses the finding map it already holds.

### Security
- **NFR-S01**: No change to how state is written; the reducer only reads the append-only log.

### Reliability
- **NFR-R01**: Rerunning the reducer on the same folder gives the same registry.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A row with both `id` and `findingId`: `id` wins.
- A summary with no `findingsCount`: treated as per run, as today.

### Error Scenarios
- A row whose `findingId` is empty: dropped, as an empty `id` is today.

### State Transitions
- A finding first seen in an earlier run counts toward a later cumulative summary.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One script, one test file, one regenerated folder |
| Risk | 8/25 | Shared reducer used by every review run |
| Research | 4/20 | Root cause traced to two lines |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
