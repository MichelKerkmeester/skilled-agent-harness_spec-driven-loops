---
title: "Implementation Plan: Cross-Package Flag Governance Reconciliation and Formatting"
description: "A resolved default-polarity flip for F5a, a mechanical helper migration for F5b, a mechanical reorder for F14, and an additive counter for F15 sequenced to land alongside/after F5a."
trigger_phrases:
  - "flag governance plan"
  - "shared opt-in helper migration"
  - "capability-flags reorder plan"
  - "content-rich short-query benchmark branch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/009-cross-package-flag-governance"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-016-cross-package-flag-governance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-Package Flag Governance Reconciliation and Formatting

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server) |
| **Subsystem** | `mcp_server/lib/search`, `mcp_server/lib/config`, `mcp_server/lib/cognitive` feature-flag registration |
| **Storage** | N/A — no runtime storage change in this phase; a future re-graduation benchmark for F5a (if ever pursued) would read a read-only backup of the live memory corpus, same pattern as `004-dark-flag-graduation` |
| **Testing** | Vitest flag-state tests only this round; a future re-graduation benchmark for F5a (if ever pursued) would reuse the `002-retrieval-class-weights` harness shape |

### Overview
Four small edits; only F15's landing order is sequenced (it lands alongside or after F5a). F5b and
F14 are pure mechanical fixes with no behavior change — reorder text and swap one function body for
a call into an existing helper. F5a is now resolved to a single mechanical fix — flip the default
polarity to off — rather than two conditional branches; the benchmark-vs-flip decision (REQ-001) is
answered on governance-policy grounds (see `spec.md` Problem Statement), so only the flip
implementation below is in scope this phase. F15 is a single additive counter at an existing call
site, explicitly not a routing change, but its landing is sequenced after F5a's flip: F15 documents
(via grep) that the graph/degree channels it observes — `hybrid-search.ts:1577-1600,1605-1649` and
`graph-search-fn.ts:95-140,616-668` — run synchronous SQLite work in a bare try/catch with no
wall-clock deadline, and flipping F5a off substantially reduces how often those unguarded code paths
run under real load. This mirrors the forward-dependency sequencing
`014-self-healing-internals-hardening` applied to its own F8 finding (that packet's REQ-002 makes
its fast-fail fix "a hard prerequisite before `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` is ever defaulted
on") — the same discipline applied here, in the other direction: land the risk-reducing change (F5a)
before or alongside the observability addition (F15) that depends on the reduced-exposure baseline
it creates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`)
- [x] Every cited file:line reference re-read against the live tree at plan time
- [x] REQ-001's decision recorded (RESOLVED — flip to default-off; see `spec.md` Problem Statement); all four phases are ready to implement

### Definition of Done
- [x] F5a implemented: default polarity flipped to default-OFF, doc comment updated, decision recorded
- [x] F5b: `isQueryTimeExistenceFilterEnabled()` calls the shared opt-in helper
- [x] F14: `capability-flags.ts:209-243` reordered, doc comment expanded
- [x] F15: counter/log line added at the `query-router.ts:461-465` call site, sequenced to land alongside or after F5a, routing output unchanged
- [x] `ENV_REFERENCE.md` rows updated to match
- [x] `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
No new pattern. Both flag files already implement the two polarities this repo uses:
`isFeatureEnabled()` (`rollout-policy.ts:59-74`, default-ON, undefined-is-enabled, `false`/`0`
opts out) for graduated behavior, and `isOptInEnabled()` (`search-flags.ts:39-42`, default-OFF,
undefined-is-disabled, `true`/`1`/`yes`/`on`/`enabled` opts in) for un-graduated behavior. The fix
is choosing the polarity that matches each flag's actual graduation status and making both files
read that polarity through the same helper.

### Key Components
- **`search-flags.ts`**: owns the graduated-vs-opt-in convention and the `isOptInEnabled()` helper
  today; becomes the shared source for F5b, one way or another (see F5b below).
- **`capability-flags.ts`**: package 009's status-consistency gate and package 011's existence
  filter live here; F14 reorders this file's `209-243` block, F5b changes one function body.
- **`query-router.ts`**: unchanged decision logic; F15 adds an observation point inside
  `shouldPreserveGraphForContentRichShortQuery()`'s caller at `:461-465`.

### Data Flow
No data-flow change for F5b/F14. For F15: `routeQuery()` already calls
`shouldPreserveGraphForContentRichShortQuery(classification)` and, on `true`, adds `graph`/`degree`
to `adjustedChannels` (`query-router.ts:461-465`). The counter increments at that same branch,
after the existing behavior, so it observes exactly the channel-preservation events F15 is
about — no new branch, no new query.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: F5b + F14 (mechanical, unconditional, no decision needed)

**F5b — shared opt-in helper migration.**
1. Decide the helper's home (this plan proposes exporting `isOptInEnabled()` from
   `search-flags.ts`'s existing export list, since `capability-flags.ts` already imports across
   directories for `isFeatureEnabled()` from `../cognitive/rollout-policy.js` — a same-shape import
   from `../search/search-flags.js` is consistent, not a new cross-directory precedent. The
   alternative, promoting it into a new neutral module, is more churn for one caller and is not
   proposed as the default; `spec.md`'s open question leaves room for either).
2. Export `isOptInEnabled` from `search-flags.ts`'s existing `export { ... }`-style surface (it
   currently has none as a named block for this helper — check whether it needs an explicit
   `export` keyword added to the function declaration, matching the file's existing
   `export function is...Enabled()` pattern).
3. In `capability-flags.ts`, import it and replace `isQueryTimeExistenceFilterEnabled()`'s body
   (`capability-flags.ts:240-243`) with `return isOptInEnabled(QUERY_TIME_EXISTENCE_FILTER_ENV);`.
4. Confirm the existing flag test (`memory-roadmap-flags.vitest.ts`, per `011`'s implementation
   summary) still asserts both states — unset stays disabled, `true`/`1` opts in — since
   `isOptInEnabled()`'s truthy set (`true`, `1`, `yes`, `on`, `enabled`) is a superset of the
   hand-rolled check's (`true`, `1`). If any existing test asserts that e.g. `yes` is currently
   rejected, that assertion changes; confirm no such assertion exists before landing.

**F14 — formatting/doc-comment fix.**
1. Move the `QUERY_TIME_EXISTENCE_FILTER_ENV` const declaration and its doc comment
   (`capability-flags.ts:211-225`) to after `isStatusCompletionConsistencyGateEnabled()`
   (`capability-flags.ts:227-237`), restoring package 009's const/getter adjacency.
2. Move `isQueryTimeExistenceFilterEnabled()` (`capability-flags.ts:239-243`) to directly follow
   its own const.
3. Expand `isQueryTimeExistenceFilterEnabled()`'s doc comment from the current one-liner to the
   file's convention: state the flag's purpose, its default-OFF/opt-in behavior, and add the
   explicit "reads the environment on every call so a test can flip the behavior per-case" note
   already present on `isIdentityMergeSafetyEnabled()` (`capability-flags.ts:64-70`) and
   `isStatusCompletionConsistencyGateEnabled()` (`capability-flags.ts:227-233`).
4. No line outside `209-243` changes; this is a pure reorder plus comment expansion, not a
   refactor of anything else in the file.

### Phase 2: F5a (mechanical, unconditional — RESOLVED, flip to default-off)

REQ-001 is resolved on governance-policy grounds (see `spec.md` Problem Statement): the burden of
proof was always on default-ON, package 010 shipped default-ON without meeting it, and the
subsequent 7-query benchmark is decision-neutral on quality but confirms the flag materially
changes routing — not the low-risk, inert-by-default change the policy assumes. This phase
implements the flip; it does not run or commission a new benchmark.

1. Change `isContentRichShortQueryGraphPreservationEnabled()` (`search-flags.ts:453-455`) from
   `return isFeatureEnabled('SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION');` to
   `return isOptInEnabled('SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION');`. Keep the flag
   itself in place (do not delete it) so it can still be turned on for testing/opt-in use.
2. Update the doc comment (`search-flags.ts:447-452`) from "Default: TRUE (graduated)" to
   "Default: FALSE (opt-in)", state the governance reason (burden of proof was on default-ON before
   shipping, not met by package 010's unit-test-only verification), and state it must earn
   promotion the same way `isRetrievalClassRoutingEnabled()` does, mirroring that flag's comment
   (`search-flags.ts:439-440`).
3. Update `ENV_REFERENCE.md:330` (and the summary table at `:128`) to reflect the new default.
4. `010-query-channel-calibration`'s own `spec.md`/`implementation-summary.md` status line is
   explicitly NOT touched by this phase — F5's scope is the flag registration, not rewriting a
   shipped sibling packet's history; note the polarity change and its governance justification in
   this phase's own `implementation-summary.md` instead.

**Future path (documented, out of scope this phase) — re-graduation to default-ON.** If a future
session wants to re-earn default-ON for this flag, it needs a benchmark meeting the bar this
phase's `spec.md` documents: 50+ labeled queries with known-correct expected results, warm runs,
and reindexed before/after snapshots — reusing the
`004-dark-flag-graduation/002-retrieval-class-weights` harness shape (production `executePipeline`,
read-only corpus backup, flag-off vs flag-on, three-run stability) rather than a divergent one-off
design. That harness is meaningfully larger scope than F5a/F5b/F14/F15 combined and, if ever
pursued, should be its own phase (mirroring `004`'s child-phase pattern), not absorbed into this
one.

### Phase 3: F15 (additive — sequenced to land alongside or after Phase 2/F5a)

**Sequencing rationale (cross-referenced from `014-self-healing-internals-hardening`'s F8
acceptance-criteria pattern).** F15's own graph/degree channels have no wall-clock timeout or
circuit breaker today — confirmed via grep: `hybrid-search.ts:1577-1600,1605-1649` and
`graph-search-fn.ts:95-140,616-668` both run synchronous SQLite work inside a bare try/catch with
no deadline. Flipping F5a's default to off substantially reduces how often these unguarded code
paths run under real load (per `010-query-channel-calibration`'s own Fixture Evidence, graph/degree
invocation drops back toward the pre-flag baseline once the flag defaults off instead of on). `014`
made an analogous forward dependency explicit in its own F8 REQ-002 ("a hard prerequisite before
`SPECKIT_QUERY_TIME_EXISTENCE_FILTER` is ever defaulted on") — this phase applies the same
discipline in the other direction: F15's counter should land alongside or after Phase 2 (F5a), not
before or independently of it, so the observability signal it adds is read against the
reduced-exposure baseline rather than the higher-exposure default-ON baseline this phase is
retiring.

1. Add a counter increment (or a structured log line, whichever this codebase's existing
   observability convention favors at this call site — check for an existing metrics/counter
   sink near `query-router.ts` before introducing a new one) immediately after the two
   `appendRoutingReason()` calls inside the `shouldPreserveGraphForContentRichShortQuery()` branch
   (`query-router.ts:461-465`).
2. The counter records that a content-rich-short-query graph/degree preservation event fired; it
   does not gate, delay, or alter the channels added.
3. Confirm via a fixture test that the routing plan output for the packet's existing 7-query
   fixture (`query-channel-calibration.vitest.ts`) is unchanged aside from the new counter/log
   side effect.
4. No timeout, no circuit-breaker, no rate limit — explicitly out of scope this round per
   `spec.md`'s Explicitly Deferred section.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isQueryTimeExistenceFilterEnabled()` still passes existing unset/true/1 assertions after the helper swap | Vitest (existing flag test file) |
| Unit | F14's reorder is a no-op for every existing flag test; a diff-only structural check | Vitest (existing flag test file), manual diff review |
| Unit/Fixture | F15's counter increments on the packet's existing 7-query fixture without changing the fixture's routing-plan assertions | `query-channel-calibration.vitest.ts` |
| Benchmark (future re-graduation, out of scope this phase) | Production-path precision/recall, flag-off vs flag-on, three-run stability | Self-contained harness under a future phase's folder, modeled on `002-retrieval-class-weights` |
| Manual | `capability-flags.ts:209-243` read end-to-end for adjacency and doc-comment convention parity | Read tool, human review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| REQ-001 decision | Internal (this phase) | RESOLVED (flip to default-off; see `spec.md` Problem Statement) | Phase 2 (F5a) can proceed immediately; Phase 3 (F15) is sequenced to land alongside or after Phase 2, not fully independent of it |
| `isOptInEnabled()` export surface in `search-flags.ts` | Internal | Green (function exists, just needs an export) | F5b blocked without it |
| `004-dark-flag-graduation/002-retrieval-class-weights` harness (reference only, not a runtime dependency) | Internal, informational | Green (already shipped, verdict CUT) | Only relevant to a future re-graduation attempt, not this phase; its shape is documented precedent for whoever picks that up later |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: F5a's flip regresses search quality unexpectedly, or F15's counter adds
  measurable overhead to the routing hot path.
- **Procedure**:
  1. F5a: revert the single-line polarity change in `search-flags.ts:453-455`; no state
     to clean up, the flag is stateless.
  2. F14: revert the reorder commit; purely textual, no functional risk to roll back.
  3. F5b: revert the helper-swap commit; the hand-rolled parsing and the shared helper are
     behaviorally equivalent for the currently-asserted states, so this is a safe, low-risk revert.
  4. F15: remove the counter increment/log line; it has no state and no downstream reader to
     migrate away from.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
