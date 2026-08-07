---
title: "Implementation Summary: Cross-Package Flag Governance Reconciliation and Formatting"
description: "Status: IMPLEMENTED. F5a/F5b/F14/F15 all shipped: default-polarity flip, shared opt-in helper, const/getter reorder, additive counter."
trigger_phrases:
  - "cross-package flag governance status"
  - "016 implemented"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-cross-package-flag-governance"
    last_updated_at: "2026-07-10T19:11:35.000Z"
    last_updated_by: "claude-code"
    recent_action: "Doc fixes: F5b bullet rewritten to reflect T020's strict-vocabulary delegate"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-016-cross-package-flag-governance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F5a RESOLVED: flip to default-off — see Key Decisions"
      - "Helper location RESOLVED: exported from search-flags.ts — see Key Decisions"
      - "Test-footprint accuracy RESOLVED: 4 undocumented query-text edits reverted (verified unneeded); blast-radius run re-scoped to 43 files/1069 tests (950 passed/13 failed/106 skipped), 13 failures confirmed pre-existing via baseline stash reproduction — see How It Was Delivered and Verification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-cross-package-flag-governance |
| **Completed** | 2026-07-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: IMPLEMENTED.** This phase was opened from a Fable-5 three-angle review
(correctness/quality, architecture consistency, risk/blast-radius) of sibling phases
`006-presentation-layer-fixes` through `011-automatic-drift-self-healing`, and owns findings F5,
F14, and F15 — all concentrated in the two feature-flag registration files, `search-flags.ts` and
`capability-flags.ts`, plus one call site in `query-router.ts`. A follow-up adversarial review ran
real empirical tests against the original findings and reached the same conclusion the original
benchmark did: F5's default-polarity question (REQ-001) was RESOLVED — flip to default-off — before
this implementation pass began, so F5a landed as a direct code change, not an open decision.

All four findings are now shipped:
- **F5a**: `isContentRichShortQueryGraphPreservationEnabled()` (`search-flags.ts`) now calls
  `isOptInEnabled()` instead of `isFeatureEnabled()`; default flipped from graduated-ON to
  opt-in-OFF. Doc comment states the governance justification.
- **F5b**: `isOptInEnabled()` is now exported from `search-flags.ts`, replacing
  `isQueryTimeExistenceFilterEnabled()`'s (`capability-flags.ts`) hand-rolled `process.env[...]`
  parsing — but T020 (see Key Decisions) reverted the resulting vocabulary widening: `search-flags.ts`
  gained a dedicated `isStrictOptInEnabled()` (strict `{true,1}` only), and
  `isQueryTimeExistenceFilterEnabled()` now delegates to that strict helper instead of the broader
  `isOptInEnabled()`.
- **F14**: `capability-flags.ts:209-243`'s const/getter block reordered so package 009's
  `STATUS_COMPLETION_CONSISTENCY_GATE_ENV` const and `isStatusCompletionConsistencyGateEnabled()`
  getter sit adjacent again, with package 011's `QUERY_TIME_EXISTENCE_FILTER_ENV` const and getter
  after the pair. The getter's doc comment expanded to the file's multi-paragraph +
  "reads env every call" convention.
- **F15**: `query-router.ts` gained a module-private counter
  (`_contentRichShortQueryGraphPreservationCount`), incremented immediately after the two
  `appendRoutingReason()` calls in the content-rich-short-query branch, with an exported getter
  (`getContentRichShortQueryGraphPreservationCount()`) and test-only reset
  (`resetContentRichShortQueryGraphPreservationCount()`). Additive only — not read by any routing
  decision; the counter variable is not part of `RouteResult`, so it cannot affect routing output
  by construction.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | F5a flip + doc comment; F5b export `isOptInEnabled`; T020 added strict-vocabulary sibling `isStrictOptInEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | F5b helper migration + import; F14 reorder + doc-comment expansion; T020 re-pointed the query-time existence flag to `isStrictOptInEnabled` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | F15 additive counter + getter/reset, exported |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Updated both flags' default-state/behavior rows (lines ~128, ~166, ~330, ~522) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` | Modify | New describe block: F5a polarity coverage (unset/off/on values) + `isOptInEnabled` export coverage |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts` | Modify | New test, later corrected by T020: initially asserted F5b's broader truthy set (`yes`/`on`/`enabled`) as a behavior-preserving superset for `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`, then re-scoped to the strict `{true,1}` vocabulary once T020 reverted that accidental expansion — see Key Decisions |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts` | Modify | Updated 2 pre-existing tests for the new default-off polarity (same measured 2/0 → 6/6 counts, opt-in explicit instead of unset); added F15 counter test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts` | Modify | Wrapped `012-T2.1` in explicit opt-in — it exercises the content-rich-short-query branch directly and depended on the old default-ON polarity |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in tasks.md order: F5b + F14 mechanical edits first (T001-T006), F5a's flip (T007),
F15's counter sequenced in the same edit pass as T007 (T008-T010), then `ENV_REFERENCE.md` (T011).
While implementing, three existing tests were found to assert the *old* default-ON polarity by
leaving the flag unset and expecting graduated behavior
(`query-channel-calibration.vitest.ts` x2, `query-router.vitest.ts` x1) — these are necessary
fallout of REQ-001's flip, not scope creep: the flag's shipped default changed, so tests asserting
its default-state behavior had to change with it. Each was updated to opt in explicitly (matching
what F5a's plan.md documents as the flag "remains present and callable... for testing") while
preserving the exact channel counts the tests originally measured, so the fixture evidence numbers
in `spec.md`'s Problem Statement (2/0 off, 6/6 on) stay accurate.

An independent adversarial verification pass later found that `query-router.vitest.ts` also carried
4 undocumented query-text edits beyond the one legitimate `012-T2.1` change (`T18`, `T20`, `T30`:
`'fix bug'` → `'hello'`; `012-T2.3`: `'refactor module'` → `'cli-opencode'`, title reworded). These
were reverted and the 3 affected `describe` blocks (`T026-04`, `012-T2`) re-run against the shipped
source: all 85 tests in the file pass with the original query text restored, confirming none of the
4 edits were required by this phase's flag-polarity flip — none of the four tests sets the
content-rich-short-query flag, so the default-OFF flip does not touch their assertions either way.
They were reverted rather than kept, and the file now matches the original "1 pre-existing test
touched" description exactly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope this phase to F5, F14, F15 only | These three findings share one root cause (two concurrent AI agent sessions editing the same flag-registration files with different conventions) and none touch daemon hot-path logic bodies, matching this batch's Level 1 assignment |
| RESOLVE F5a to flip-to-default-off rather than leaving it an open decision | A follow-up adversarial review independently reached the same conclusion the original benchmark did: the repo's flag-graduation policy puts the burden of proof on default-ON before shipping, package 010 never met that burden, and the subsequent 7-query benchmark is decision-neutral on quality but confirms the flag is not a low-risk, inert-by-default change — the policy violation stands regardless of the benchmark's quality verdict |
| Sequence F15's counter to land alongside or after F5a's flip | F15's own graph/degree channels have no wall-clock timeout or circuit breaker (confirmed via grep); flipping F5a off substantially reduces how often those unguarded paths run under real load, mirroring `014-self-healing-internals-hardening`'s F8 forward-dependency pattern |
| Frame F15 as monitor-only | The finding's own framing explicitly says a circuit-breaker is not required this round; manufacturing one would be scope creep past what the review actually asked for |
| Export `isOptInEnabled` directly from `search-flags.ts` rather than a new neutral module (answers `spec.md`'s open question) | `capability-flags.ts` already imports across directories for `isFeatureEnabled` from `../cognitive/rollout-policy.js`; a same-shape import from `../search/search-flags.js` is consistent with the existing pattern and is less churn than introducing a new module for one caller, matching `plan.md` Phase 1's stated default |
| Implement F15's counter as a module-private variable in `query-router.ts` with an exported getter/reset, not a new export from `routing-telemetry.ts` | `spec.md`'s Files-to-Change table scopes F15 to `query-router.ts` only; `routing-telemetry.ts`'s `recordInvocation()` already tracks general channel selection but has no reason-tagged counter, and extending it would touch a second file outside F15's stated scope. The counter variable is structurally outside `RouteResult`, so it cannot influence routing output, satisfying REQ-006 by construction rather than by convention |
| Update the 3 existing tests that hard-coded the pre-flip default-ON polarity (`query-channel-calibration.vitest.ts` x2, `query-router.vitest.ts` x1) rather than leave them broken | These tests exercise `isContentRichShortQueryGraphPreservationEnabled()`'s default (unset) state directly; REQ-001's flip is a real, intended behavior change to that default, so tests asserting the old default necessarily need updating — this is required fallout of the approved flip, not scope creep, and each update preserves the exact channel counts originally measured |
| T020 (DONE 2026-07-10): revert the shared-parser migration's accidental broadening of `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`'s accepted truthy set to `yes`/`on`/`enabled`; preserve strict `{true,1}` for that flag | The F5b migration moved `capability-flags.ts:252`'s query-time existence flag onto the shared `isOptInEnabled()` helper, which accepts the broader truthy set — an unintended widening for a hot-path flag that was never asked to change vocabulary. `search-flags.ts` gained a dedicated `isStrictOptInEnabled()` (strict `{true,1}` only), and the query-time existence flag now reads through it instead of `isOptInEnabled()`; a parser matrix test (unset/whitespace/case/true/1/yes/on/enabled/false/0/invalid) locks both vocabulary classes in place. See `tasks.md:130`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (`tsc --noEmit --composite false -p tsconfig.json`) | CONFIRMED clean, zero errors |
| `npm run build` (`tsc --build && node scripts/finalize-dist.mjs`) | CONFIRMED clean; verified `dist/lib/search/search-flags.js`, `dist/lib/config/capability-flags.js`, `dist/lib/search/query-router.js` all reflect the source changes (grep-checked post-build) |
| Scoped test run: every `.vitest.ts` file with either a static import of `search-flags.ts`, `capability-flags.ts`, or `query-router.ts` (23 files, `grep -rlE "from ['\"][^'\"]*/(search-flags\|capability-flags\|query-router)(\.js)?['\"]" tests`), OR a `vi.mock()`/`vi.doMock()` call targeting one of those three module paths (22 files, same pattern against `vi\.(mock\|doMock)\(...\)`; 2 files appear in both sets) — 43 files total, found via the two `grep -rlE` passes above | CONFIRMED 950/1069 passed, 106 skipped, 13 failed across 6 files: `deferred-features-integration.vitest.ts` (1, "creates causal edges from cross-document entity matches" — `entity-linker.ts`), `gate-d-regression-intent-routing.vitest.ts` (2, resume/legacy-memory fallback routing), `memory-save-fallback-fingerprint.vitest.ts` (1, canonical fallback fingerprint guard), `post-insert-deferred.vitest.ts` (4, `response-builder.ts`'s `database.prepare is not a function`), `query-router-channel-interaction.vitest.ts` (1, "T033-12: R2 promotes active channels below QUALITY_FLOOR" — `channel-representation.ts`), `spec-folder-prefilter.vitest.ts` (4, `structuralSearch`'s spec-folder scoping). None of the 13 failures' assertions or stack traces touch `search-flags.ts`, `capability-flags.ts`, or `query-router.ts`. CONFIRMED unrelated by direct baseline reproduction (stronger than source-location cross-check alone): `git stash` of this phase's entire changeset (all 3 source files + all test-file edits + spec docs), re-run of the identical 43-file set against the pre-packet baseline, same 13 failures with identical error messages and identical assertion lines — proving they pre-exist this phase and are not caused by it. Stash restored after confirming (`git stash pop`) |
| Direct scoped run: `search-flags.vitest.ts`, `memory-roadmap-flags.vitest.ts`, `query-channel-calibration.vitest.ts`, `flag-ceiling.vitest.ts`, `routing-telemetry-stress.vitest.ts`, `query-router.vitest.ts` | CONFIRMED 144/144 passed (subset of the 43-file/1069-test run above, re-run in isolation before the wider pass) |
| Full workspace `npx vitest run` (unscoped, background) | INCONCLUSIVE — the run crashed with `[vitest-pool]: Worker forks emitted error` / `Worker exited unexpectedly` before completing, after ~180 tests in. The visible failures before the crash (`check-contract-drift.vitest.ts` stale source-digest mismatches in `system-deep-loop`, `executor-provenance-mismatch.vitest.ts` dispatch-event shape mismatch, `offline-degradation.vitest.ts` `SqliteError: no such column: m.deleted_at`) are in unrelated skill packages and an unrelated SQL schema path — none touch `search-flags.ts`, `capability-flags.ts`, or `query-router.ts`. This corroborates rather than substitutes for the scoped 17-file run above: the unscoped suite is independently non-green right now for reasons this phase did not cause |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/016-cross-package-flag-governance --strict` | CONFIRMED: exit code 0, Errors 0 / Warnings 0, RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full unscoped workspace vitest suite did not complete (crashed, unrelated to this phase).** This
   phase touches exactly 3 production files; every test file with a static-import or mock dependency
   on them (43 files, 1069 tests) was run and passed except the 13 pre-existing failures (6 files)
   documented above, confirmed unrelated by direct baseline reproduction (same failures on a
   pre-packet stash). A background attempt at the full workspace suite was also made; it
   crashed with a vitest worker-pool error after ~180 tests, with visible failures in unrelated skill
   packages (`system-deep-loop` digest drift, an unrelated SQL schema error) — see Verification.
   INFERRED (not confirmed): the remaining untested files are unaffected, on the basis that none
   import or mock any of the three modified modules (confirmed via the two `grep -rlE` passes above).
2. **F15's counter is in-process, ephemeral, and not wired into `memory_health` or any persistence
   layer.** This matches `spec.md`'s explicit scope (monitor-only, no dashboard/export required this
   round) — a future session reading `getContentRichShortQueryGraphPreservationCount()` gets a
   real number since process start, not a historical time series.
3. **Re-graduation to default-ON for `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` remains
   unimplemented and out of scope**, per `spec.md`'s Problem Statement and Out of Scope sections —
   the 50+ labeled-query, warm-run, reindexed-before/after benchmark bar is a documented future path,
   not attempted here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
