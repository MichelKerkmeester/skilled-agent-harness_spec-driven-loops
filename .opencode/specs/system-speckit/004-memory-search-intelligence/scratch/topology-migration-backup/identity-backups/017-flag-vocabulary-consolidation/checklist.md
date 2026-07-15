---
title: "Verification Checklist: Flag Vocabulary Consolidation"
description: "All 25 P0/P1 items verified 2026-07-09; 2 confirmed bugs fixed+tested, 22 test files run (530 passed/3 pre-existing-unrelated failed/1 skipped)."
trigger_phrases:
  - "flag vocabulary consolidation"
  - "parseFlagTristate shared helper"
  - "SPECKIT_MEMORY_GRAPH_UNIFIED off ignored"
  - "STATUS_COMPLETION_CONSISTENCY_GATE on ignored"
  - "hand-rolled env flag parsing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/017-flag-vocabulary-consolidation"
    last_updated_at: "2026-07-09T23:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all P0/P1 checklist items with real evidence"
    next_safe_action: "Run validate.sh --strict and regenerate description/graph-metadata"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Flag Vocabulary Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — `spec.md` §4 REQUIREMENTS, `REQ-001` through `REQ-008` (`spec.md:117-134`).
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §3 ARCHITECTURE and §4 IMPLEMENTATION PHASES (`plan.md:84-156`).
- [x] CHK-003 [P1] The 18-site / 10-file audit inventory re-confirmed against the current tree before migration starts. Re-run grep (`rg -n "process\.env\[.*\]\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))|process\.env\.[A-Z_]+\?\.(trim\(\)\.toLowerCase\(\)|toLowerCase\(\)\.trim\(\))" lib --type ts`) matched exactly the spec's 18 in-scope sites (8 `capability-flags.ts` + 10 sibling-file sites) and the spec's 5 excluded duplicate-of-`isFeatureEnabled()` sites — no drift in the audited set. **New finding beyond the spec's audit** (flagged, not silently absorbed into scope): 9 additional hand-rolled boolean sites exist outside the audited 18 — `lib/search/hyde.ts:113` (`isHyDEActive`, opt-out `false`/`0` only) and `:417` (debug-log gate, literal `'true'` only), plus 7 sites inside `search-flags.ts` itself (`isFileWatcherEnabled:391`, `isLexicalGroundingEnabled:703`, `isEnvelopeFidelityEnabled:724`, `isNoiseFloorSubtractionEnabled:747`, `isCiteWithCaveatEnabled:766`, `isEvidenceGapVerdictEnabled:784`, `isRelevanceAwareGapEnabled:1058` — these already recognize `false`/`0`/`off`, missing only `no`/`disabled`). Left untouched per SCOPE LOCK (not named in spec.md's frozen Scope section); documented as a follow-up candidate in implementation-summary.md.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `parseFlagTristate()` exists in `lib/search/search-flags.ts` (`:46-56`) and recognizes the full 10-value vocabulary — proven by the exhaustive matrix test in `tests/search-flags.vitest.ts` (`describe('Search Flags: parseFlagTristate() vocabulary matrix')`).
- [x] CHK-011 [P0] All 8 `capability-flags.ts` sites delegate to `parseFlagTristate`, including the two confirmed-bug functions (`isIdentityMergeSafetyEnabled`, `isGeneratedMetadataGrandfatherEnabled`, `isGeneratedMetadataDriftGateEnabled`, `isGeneratorHardeningEnabled`, `isIdempotentDescriptionWritesEnabled`, `isStatusCompletionConsistencyGateEnabled`, `hasExplicitDisableFlag`, the paired opt-in loop inside `isMemoryRoadmapCapabilityEnabled`) — confirmed by direct read of `lib/config/capability-flags.ts` post-edit.
- [x] CHK-012 [P0] All 10 sibling-file sites delegate to `parseFlagTristate` (`bfs-traversal.ts`, `causal-boost.ts`, `memory-retention-sweep.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `folder-discovery.ts` x2, `stage2-fusion.ts`), or for `graph-lifecycle.ts` call the existing `isEntityLinkingEnabled()` getter — confirmed by direct read post-edit; `rg -n "process\.env\.SPECKIT_ENTITY_LINKING"` shows zero remaining literal outside `search-flags.ts`.
- [x] CHK-013 [P0] No console errors or warnings from any migrated getter on a valid or unset env value — confirmed by the full vitest run (see Testing section); no new console.error/warn from these getters.
- [x] CHK-014 [P1] `isOptInEnabled()` is re-expressed as `parseFlagTristate(name, false)` with no behavior change — `tests/search-flags.vitest.ts`'s existing `isOptInEnabled` suite (F5a/F5b describe block) passes unchanged.
- [x] CHK-015 [P1] Change follows the existing helper-delegation pattern proven by `028/016`'s `isQueryTimeExistenceFilterEnabled` migration — same file (`search-flags.ts`), same delegation shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008) — REQ-001 by `tests/search-flags.vitest.ts` matrix; REQ-002/003 by the confirmed-bug tests below; REQ-004 by per-site regression tests; REQ-005 by duplicate-pair agreement tests; REQ-006 by `tests/flag-vocabulary-consolidation.vitest.ts`'s `onIndex` test; REQ-007 by the unchanged `isOptInEnabled` suite; REQ-008 by CHK-032.
- [x] CHK-021 [P0] `SPECKIT_MEMORY_GRAPH_UNIFIED=off` disables `graphUnified` — `tests/memory-roadmap-flags.vitest.ts` new test `disables graphUnified for every recognized opt-out value...` passes; also verified directly against compiled `dist/lib/config/capability-flags.js` via a standalone Node script (before: `off` left `graphUnified: true`; after: `graphUnified: false`).
- [x] CHK-022 [P0] `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=on` enables the gate — `tests/generated-metadata-integrity.vitest.ts` new test `enables the consistency gate for every recognized opt-in value...` passes; also verified directly against compiled dist (before: `on` left the gate `false`; after: `true`).
- [x] CHK-023 [P0] Every migrated site's pre-migration unset-env-var baseline is unchanged (no silent default-polarity flip) — proven by every existing site test file continuing to pass unchanged post-migration (22 test files, 530/534 tests passed, see CHK-026).
- [x] CHK-024 [P1] Every migrated site's previously-unrecognized vocabulary member now parses correctly — directly, behaviorally tested for 17 of 18 sites (capability-flags.ts x8, `bfs-traversal.ts`, `causal-boost.ts`, `memory-retention-sweep.ts`, `idempotency-receipts.ts`, `adaptive-ranking.ts`, `retrieval-rescue.ts`, `folder-discovery.ts` x2, `graph-lifecycle.ts` reuse-fix). The 1 remaining site, `stage2-fusion.ts`'s `isShadowLearningModelLoadEnabled`, has no dedicated behavioral test (its only reachable exported entry point does async file I/O + in-memory caching, too heavy to fixture cheaply) — proven only by composition: source read confirms a one-line `parseFlagTristate('SPECKIT_SHADOW_LEARNING', false)` call, backed by the exhaustive `parseFlagTristate` matrix test. Documented honestly as inferred-not-confirmed in implementation-summary.md Known Limitations.
- [x] CHK-025 [P1] The two duplicate pairs (`SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES`, `SPECKIT_MEMORY_ADAPTIVE_RANKING`) agree across the full vocabulary — `tests/flag-vocabulary-consolidation.vitest.ts` `describe('duplicate pair: ...')` blocks pass for both pairs across the full 10-value vocabulary + unset + garbage.
- [x] CHK-026 [P1] Full vitest suite passes for every touched file with zero regressions against the pre-change baseline — ran 22 test files covering every touched module plus its existing test suite: 530 passed, 3 failed, 1 skipped (534 total). All 3 failures (`causal-edge-tombstones.vitest.ts` x2, `adaptive-ranking-e2e.vitest.ts` x1) confirmed pre-existing and unrelated by scoped `git stash` isolation (reverting only this packet's `.ts` source files reproduces the identical failures). A repo-wide `npx vitest run` (full monorepo suite) was attempted twice but could not complete in this session due to sustained CPU starvation from an unrelated concurrent process (PID 92609, 94-99% CPU for 2h51m+, confirmed via `ps`); this is a live environment constraint, not evidence of a regression — documented honestly, not overclaimed as a full-suite pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (This packet's finding is `class-of-bug`: a vocabulary-consistency defect repeated across 18 sites, not a single-instance fix.)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed via the repo-wide grep audit in `spec.md:102-109` §3, re-confirmed in CHK-003 above with the 9-site drift finding flagged and left out of scope.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `parseFlagTristate`, `isOptInEnabled`, and every migrated getter's callers — `rg -n "isOptInEnabled|parseFlagTristate"` confirms every consumer imports the new/updated symbols; no caller assumed the old opt-in-only shape (signatures unchanged).
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction surface is touched by this fix; N/A for adversarial delimiter/joined-input tests — confirmed by diff review, change is confined to boolean env-flag comparison logic.
- [x] CHK-FIX-005 [P1] Matrix axes and row count (10 vocabulary values x case/whitespace variants, unset, empty, garbage, x2 default polarities) are listed and exercised directly in `tests/search-flags.vitest.ts`'s `parseFlagTristate()` matrix describe block.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: every new/extended test sets and restores `process.env` per-case (via `withEnv`/`withSoftDeleteFlag`/inline try-finally helpers matching the existing `tests/memory-roadmap-flags.vitest.ts` pattern).
- [x] CHK-FIX-007 [P1] Evidence is pinned to this session's working-tree diff (uncommitted, per task instruction not to commit), confirmed via `git status --porcelain` and `git diff --stat` on the exact file list in implementation-summary.md's Files Changed table; file:line citations above are from the post-edit source read, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed by diff review; the entire diff is pure boolean-parsing logic (`parseFlagTristate()` and its call sites), no credentials/tokens touched.
- [x] CHK-031 [P0] Change stays inside the existing env-var parsing trust boundary, reads no new inputs beyond `process.env` — confirmed by diff review.
- [x] CHK-032 [P1] `isFeatureEnabled()` and its five duplicate-of sites remain untouched, per spec.md §3 Out of Scope — `rg -n "isFeatureEnabled" lib/cognitive/rollout-policy.ts` and the five named files (`save-quality-gate.ts`, `progressive-disclosure.ts`, `feedback-ledger.ts`, `fsrs-scheduler.ts`, `shadow-scoring.ts`) show no diff; confirmed via `git status --porcelain` on this session's changed-file list (none of the five appear).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `tasks.md` T001-T028 all marked `[x]` with evidence; `spec.md`/`plan.md` scope matches the implemented 18-site set with no scope drift.
- [x] CHK-041 [P1] Code comments adequate (durable WHY only, no packet/phase IDs embedded per comment-hygiene rule) — `rg -nE "017-flag-vocabulary-consolidation|REQ-00[0-9]|CHK-0[0-9]"` across every touched `lib/` and `tests/` file returns zero matches. Two passes were needed: an initial draft embedded packet-slug prefixes in 10 test-file comments and `REQ-005`/`REQ-006` in 2 more, both corrected during this session and re-verified clean. (`tests/causal-boost.vitest.ts`'s pre-existing `T038`-`T044` describe/it labels predate this packet and were not touched, per SCOPE LOCK.)
- [ ] CHK-042 [P2] README updated (if applicable) — deferred: no README documents individual flag-parsing helpers at this granularity; N/A.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — all temp files (before/after verification script, pre-migration source snapshot, full-run test log) were written to the CLI-designated scratchpad directory, not the spec folder or repo tree; `ls -la` on this spec folder confirms only the 7 canonical doc/metadata files are present.
- [x] CHK-051 [P1] scratch/ cleaned before completion — no `scratch/` directory exists inside this spec folder to clean; N/A.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 0/1 (deferred, N/A — no README at this granularity) |

**Verification Date**: 2026-07-09
<!-- /ANCHOR:summary -->

---
