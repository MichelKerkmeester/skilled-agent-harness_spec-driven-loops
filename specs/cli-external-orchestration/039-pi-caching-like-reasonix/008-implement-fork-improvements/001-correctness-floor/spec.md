---
title: "Feature Specification: Correctness Floor"
description: "Implemented correctness floor for deep-pi and pi-cache-optimizer: cache-write-only telemetry recording, test-scoped ownership contract, two-runner composition coverage, six real hook-guard tests, and a read-only /deeppi report command."
trigger_phrases:
  - "correctness floor"
  - "deep-pi cold start bug"
  - "combined host composition test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/001-correctness-floor"
    last_updated_at: "2026-08-08T09:03:34Z"
    last_updated_by: "implementation"
    recent_action: "Implemented and verified the correctness floor"
    next_safe_action: "Hand off to phase 002"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every P0 citation from research.md was re-read against the live source during authoring; all four confirmed."
      - "sol's f-deeppi-cas-gap TOCTOU claim is excluded: hashlines.ts:91-101 already verifies landed content after rename."
      - "The shared ownership definition is a test-only JSON fixture, not a runtime module, because the two independently shipped packages should not share a release or vendoring dependency for a test contract."
      - "The combined-host test uses the existing deep-pi FakePi; its append-and-emit behavior is sufficient to observe both extensions reacting without a real Pi session."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Correctness Floor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-observability-and-economics |
| **Handoff Criteria** | All four P0 items implemented with tests that fail without their fix; both forks' suites green; the DeepSeek ownership boundary provably single-sourced and exercised through a real combined host |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 008 "Implement Fork Improvements" decomposition — the correctness and contract floor. It owns the four P0 items from `../../007-research-fork-improvements/research/research.md`'s closing priority-ranked action list. All four lineages independently ranked this tier above the observability and maintainability work; phases 002 and 003 depend on the guarantees established here.

**Scope Boundary**: This phase is implemented. Its writable surface was `.pi/extensions/deep-pi/` (source and tests), `.pi/extensions/pi-cache-optimizer/` (tests and the test-script enumeration), `.pi/extensions/shared/` (test-only fixture and runner-free composition body), and this phase's own documents.

**Dependencies**:
- `../../007-research-fork-improvements/research/research.md` — the findings and their citations, all of which were re-read against the live source while authoring this spec
- Both forks are shipped, vendored in-repo, and live-verified (packets 003, 004, 005, 006), so there is a real baseline to fix rather than a moving target

**Deliverables** (verified in the final state):
- deep-pi records a session's first cache-write turn instead of discarding it, and no longer latches `usageUnavailable` on that turn
- One source of truth for the `deepseek-v4-flash`/`deepseek-v4-pro` ownership boundary, plus a combined-host test that fails if the two forks ever disagree about who owns a model id
- Hook-level early-return tests for pi-cache-optimizer's six DeepSeek-guarded hooks
- `/deeppi`'s report command stops mutating telemetry state
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four P0 defects were found by 007's four-lineage research and re-confirmed against the live source while authoring this spec. Each is a real, reproducible source-level defect, not a design opinion.

**1. deep-pi drops every session's first cache-write turn and latches `usageUnavailable` for the rest of that session** (research Tier 1, `deepseek-v4-flash`'s `f-deeppi-coldstart-invisible`; action-list item 1). `recordUsage`'s first guard reads `if (!model || usage.input + usage.cacheRead === 0) { state.usageUnavailable = true; return false; }` — `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:52-55`. The condition never looks at `usage.cacheWrite`. The sibling fork documents exactly why that matters: Pi normalizes `input` to "the uncached prompt portion (total prompt minus cacheRead minus cacheWrite)" and guarantees all three fields are present at least as zero — `.pi/extensions/pi-cache-optimizer/index.ts:2135-2143`. A turn whose entire prompt is newly written into the cache therefore arrives as `input=0, cacheRead=0, cacheWrite=N`, which is precisely the shape deep-pi discards. Worse, `usageUnavailable` is cleared only by `resetTelemetry` (`telemetry.ts:123-128`), itself called only from `session_start` (`.pi/extensions/deep-pi/extensions/deeppi.ts:47`), so one such turn makes `/deeppi` print `Usage unavailable` (`telemetry.ts:110`) for the remainder of the session even after later turns record cleanly. The research is explicit that this must be fixed *before* any cold-start economics benchmark runs, or the benchmark measures the recorder's own bug rather than the cache.

**2. The DeepSeek ownership boundary is hardcoded twice with nothing forcing the two copies to move together** (research Tier 1 #1, all four lineages, grok scored it P0; action-list item 2). `pi-cache-optimizer` defines it as `model?.provider === "deepseek" && (model.id === "deepseek-v4-flash" || model.id === "deepseek-v4-pro")` at `.pi/extensions/pi-cache-optimizer/index.ts:1279-1281`; `deep-pi` defines the same set as `DEEPPI_MODEL_IDS` plus `isDeepPiModel` at `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18`. Adding a future DeepSeek model to one and not the other silently breaks the split — either both extensions activate for it, or neither does. No test anywhere loads both extensions into one host and asserts that exactly one owns each model id. The 4th lineage found the concrete blocker for writing that test (`f-composition-test-seam`): the two suites use different runners — `pi-cache-optimizer/package.json:31` runs `node --import jiti/register tests/review-findings.test.ts` (`node:test` plus `jiti`, confirmed at `tests/review-findings.test.ts:1-8`), while `deep-pi/package.json:52` runs `vitest --run`. A composition fixture cannot simply be dropped into either suite; the seam has to be resolved as part of this work, not skipped past it.

**3. pi-cache-optimizer's DeepSeek exclusion is asserted only as a pure predicate, never through a hook** (research Tier 1 #5; action-list item 3). Six hooks carry the `if (isDeepPiOwned(...)) return;` early return — `index.ts:7280` (`session_start`), `:7298` (`model_select`), `:7304` (`before_agent_start`), `:7425` (`before_provider_request`), `:7479` (`after_provider_response`), `:7541` (`message_end`). The only existing coverage is `tests/review-findings.test.ts:75-78`, which asserts `isDeepPiOwned` against four model shapes and never invokes a hook. A regression that removed or misplaced any one of the six guards would pass the current suite. This is the same gap class a `gpt-5.6-sol` HANDOFF review already found and closed on the deep-pi side in `../../006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/tasks.md` T010 item 2, so the fix shape is known and precedented.

**4. `/deeppi`'s report command mutates state while reading like a read-only report** (research Tier 4, `f-report-command-side-effect`; action-list item 4). The command handler's first statement is `telemetry.latestChurn = stability.latestChurn;` — `.pi/extensions/deep-pi/extensions/deeppi.ts:67` — before it renders anything. Invoking a report should not change telemetry state. The research flags this as needing to land before or alongside phase 002's structured-report refactor, since that refactor would otherwise carry the same bug into its new shape.

### Purpose
Establish a correctness and contract floor for both forks: telemetry that does not discard the one turn that establishes the cache, an ownership boundary that cannot silently diverge, hook guards that are actually exercised, and a report command with no side effects. Phases 002 and 003 build on these guarantees, which is why all four research lineages placed this tier first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correcting `recordUsage`'s first guard so a turn carrying only cache-write tokens is recorded rather than discarded, and so it does not set `usageUnavailable`
- Producing one authoritative definition of the `deepseek-v4-flash`/`deepseek-v4-pro` ownership set that both forks' checks are proven against
- Resolving the `node:test`+`jiti` versus `vitest` runner seam far enough to run a single fixture against both extensions in one host
- A combined-host composition test asserting exactly one extension activates per model id, across the owned pair and the deliberately-excluded neighbours (`opencode/deepseek-v4-flash-free`, `opencode-go/deepseek-v4-flash`)
- Hook-level early-return tests for all six of pi-cache-optimizer's `isDeepPiOwned`-guarded hooks
- Removing the `telemetry.latestChurn` mutation from `/deeppi`'s command handler while keeping the report's churn line correct
- A negative control per fix: the new test must fail with the fix reverted

### Out of Scope
- **Any code change during this planning pass.** No file under `.pi/extensions/` is touched while authoring this document set
- Cache-write *accounting* — where cacheWrite tokens land in `ModelTotals`, whether `actualInputCost` includes `usage.cost.cacheWrite`, and the `cacheHitRate` denominator choice. This phase only stops the turn from being thrown away; phase 002 owns what the recorded numbers then mean. The seam is stated the same way in both specs so neither phase assumes the other did it
- The `stopReason` guard on `message_end` — phase 002, REQ-004
- Persisting deep-pi stats to disk, restructuring the report, or any cost-labeling change — phase 002
- Extracting pi-cache-optimizer's monolith, drift checks, or `benchmark:live` packaging — phase 003
- **sol's `f-deeppi-cas-gap` TOCTOU claim — deliberately excluded, see §7**

### Files to Change

> Final implementation surface. Runtime ownership predicates remain unchanged; both test suites exercise the real predicates against the shared test fixture.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | Modify | Cold-start guard at `:52-55` no longer discards cache-write-only turns or latches `usageUnavailable` |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Modify | `/deeppi` handler at `:67` stops mutating `telemetry.latestChurn` |
| `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` | Verify only | Real `isDeepPiModel` predicate remains unchanged and is exercised against the shared fixture |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Verify only | Real `isDeepPiOwned` predicate remains unchanged and is exercised through its test export |
| `.pi/extensions/shared/deepseek-ownership.json` | Create | Single test-scoped `{provider, id}` ownership set both forks assert against |
| `.pi/extensions/shared/composition/one-owner.ts` | Create | Runner-free pure composition body returning one-owner results |
| `.pi/extensions/deep-pi/tests/ownership-composition.test.ts` | Create | Vitest wrapper for the ownership contract and combined host |
| `.pi/extensions/pi-cache-optimizer/tests/ownership-composition.test.ts` | Create | `node:test` wrapper for the ownership contract and combined host |
| `.pi/extensions/deep-pi/tests/fake-pi.ts` | Modify | Test host context supplies the session/model handles needed by both real extensions |
| `.pi/extensions/pi-cache-optimizer/tests/hook-guards.test.ts` | Create | Hook-level early-return tests for the six guarded hooks |
| `.pi/extensions/pi-cache-optimizer/package.json` | Modify | Test script enumerates all `tests/*.test.ts` files |
| `.pi/extensions/deep-pi/tests/telemetry.test.ts` | Modify | Cache-write-only turn recorded, `usageUnavailable` not latched |
| `.pi/extensions/deep-pi/tests/deeppi.integration.test.ts` | Modify | `/deeppi` invocation leaves telemetry state unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A turn carrying only cache-write tokens is recorded, and does not latch `usageUnavailable` for the session | A new test calls `recordUsage` with `input: 0, cacheRead: 0, cacheWrite: N` and asserts it returns `true`, that `state.usageUnavailable` stays `false`, and that a subsequent normal turn still records. Negative control: with the guard at `telemetry.ts:52-55` restored to its current form, the test fails |
| REQ-002 | Exactly one authoritative definition of the DeepSeek ownership set exists, and both forks are proven against it | A single fixture or module holds the `{provider, id}` pairs. Tests in both forks assert their own predicate (`isDeepPiOwned` at `index.ts:1279-1281`; `isDeepPiModel` at `eligibility.ts:14-18`) agrees with it on every entry. Adding a synthetic entry to the shared definition without updating a fork fails that fork's test |
| REQ-003 | The test-runner seam is resolved well enough to run one fixture against both extensions | The composition test actually executes and reports pass/fail under a named runner, with the chosen bridge documented in `plan.md` §3. A skipped, `.todo`, or never-invoked test does not satisfy this |
| REQ-004 | A combined-host composition test proves exactly one extension activates per model id | Both extensions are registered against one host double. For `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro`, deep-pi activates and pi-cache-optimizer's six hooks early-return. For `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash`, the inverse holds. Assertion is on observed hook behavior, not on predicate return values alone |
| REQ-005 | All six of pi-cache-optimizer's `isDeepPiOwned` guards are exercised through their real hooks | Tests invoke each of `index.ts:7280`, `:7298`, `:7304`, `:7425`, `:7479`, `:7541` with an owned model and assert the observable side effect the guard suppresses does not occur. Negative control: deleting any one guard fails exactly one test |
| REQ-006 | `/deeppi`'s report command performs no state mutation | Invoking the handler leaves `telemetry.latestChurn` at its pre-call value while the rendered report still shows the current prefix churn. Negative control: restoring the assignment at `deeppi.ts:67` fails the test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | No regression in either fork's existing behavior or suite | `npm test` green in both forks (deep-pi's vitest suite and pi-cache-optimizer's `node:test` suite); `npm run typecheck` exits 0 in both; the diff is limited to the files listed in §3 |
| REQ-008 | The excluded finding stays excluded, with its reason on record | `spec.md` §7 records why `f-deeppi-cas-gap` is not a fix item and what would have to be re-checked before it could be re-added. No task, requirement, or checklist item anywhere in 008 proposes changing `atomicWriteFile`'s rename path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the four P0 defects has a fix and a test that genuinely fails without it — verified by reverting the fix, not asserted
- **SC-002**: The ownership boundary can no longer diverge silently: a change to one fork's model set without the other fails a test rather than shipping
- **SC-003**: The composition test runs for real under a named runner; the runner mismatch is resolved rather than documented as a reason the test does not exist
- **SC-004**: Neither fork's activation boundary changes behavior. This phase adds tests and fixes defects; it does not widen or narrow which models either extension owns
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixing REQ-001's guard could admit genuinely empty or malformed usage records that the current condition happens to filter | A zero-token turn would inflate `responses` and skew the hit rate | Replace the condition with an explicit total-token test (`input + cacheRead + cacheWrite === 0`) rather than deleting it, so empty turns stay excluded while cache-write-only turns are admitted. Cover both cases with separate tests |
| Risk | The runner bridge (REQ-003) grows into a migration of one of the two suites | A P0 item becomes a large refactor and stalls the phase | Plan a runner-neutral fixture that both suites can consume, and treat migrating either suite as out of scope. `plan.md` §3 states the fallback if the bridge proves unworkable |
| Risk | The combined-host test needs a host double faithful enough to be meaningful | A too-thin double proves nothing about real coexistence | Build on `deep-pi/tests/fake-pi.ts`, which already models hook registration, tool activation, and notification severity for a single extension; extend it to register two extensions rather than inventing a new double |
| Risk | REQ-006's fix removes the churn data the report legitimately needs | `/deeppi` reports `Prefix churn: none` when churn actually occurred | Pass `stability.latestChurn` into `formatDeepPiReport` as report input instead of writing it onto telemetry state first; assert the rendered churn line still matches in the same test |
| Dependency | Both vendored forks at `.pi/extensions/` are the live, shipped copies | Edits here affect the operator's running Pi sessions | Treat the vendored copies as production: implement against them only under explicit authorization, keep the diff scoped to §3, and re-run both suites before claiming completion |
| Dependency | 007's findings and citations | The whole phase is derived from them | Every P0 citation was re-read against the live source while authoring this spec, not carried over on trust |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

All questions for this phase are resolved below.

- **Decision — test-only fixture.** `.pi/extensions/shared/deepseek-ownership.json` is the authoritative test contract. Both suites load it and assert the real `isDeepPiModel` / `isDeepPiOwned` predicates. A runtime module was not built because it would couple two independently versioned packages' release and vendoring paths without improving runtime behavior in this phase.
- **Decision — existing FakePi is sufficient.** Both extensions are registered on one `deep-pi/tests/fake-pi.ts` host, and the test asserts tool activation and status behavior for all four fixture entries. A real Pi session is not needed to prove the ownership split; hook dispatch ordering remains outside this phase.

### Deliberately excluded: sol's `f-deeppi-cas-gap`

sol's first-pass finding claimed a cross-process TOCTOU window in deep-pi's `edit_lines`, between its expected-content check and the rename. **This is NOT a fix item in this phase or anywhere else in 008, and it must not be re-added without first re-tracing `atomicWriteFile`.**

The 4th research lineage (`deepseek-v4-flash`) independently traced that function and found the claimed gap already closed (`f-post-rename-verification`); `research/research.md` §Tier 2 #7 records the downgrade explicitly. Re-read directly against the live source while authoring this spec and confirmed: `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:91-101` renames the temp file, then re-reads the target and throws `File changed during replacement; refusing to report success` if the landed content differs from what was written. The expected-content check sits at `:83-90`, and the whole sequence runs inside `withWriteQueue` (`:41-56`, entered at `:66`). The temp file is created with `open(temporary, "wx", 0o600)` at `:67` and cleaned up in a `finally` at `:104`.

Note the narrow scope of this exclusion: it downgrades only the deep-pi `edit_lines` claim. The separate pi-cache-optimizer stats-persistence concurrency finding (research Tier 2 #7, `index.ts:4264-4316`) stands unaffected and is planned in phase 002's context, not here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Successor**: `../002-observability-and-economics/spec.md`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md` (Tier 1 #1/#5, Tier 4, and action-list items 1-4)
- **Precedent**: `../../006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/spec.md` (the same fork-patch-and-negative-control pattern, including the real-hook test gap this phase mirrors for pi-cache-optimizer)
