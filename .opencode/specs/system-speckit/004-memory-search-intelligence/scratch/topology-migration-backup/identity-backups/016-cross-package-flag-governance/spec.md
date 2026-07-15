---
title: "Feature Specification: Cross-Package Flag Governance Reconciliation and Formatting"
description: "Package 010's SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION ships default-ON labeled graduated while its own spec says Implemented, verification-limited; package 011's SPECKIT_QUERY_TIME_EXISTENCE_FILTER hand-rolls env parsing instead of the shared opt-in helper; and a formatting split in capability-flags.ts breaks an adjacent const/getter pair."
trigger_phrases:
  - "cross-package flag governance"
  - "flag default polarity reconciliation"
  - "capability-flags formatting fix"
  - "content-rich short-query graph preservation graduation"
  - "query-time existence filter helper migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/016-cross-package-flag-governance"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-016-cross-package-flag-governance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F5a RESOLVED: flip to default-off — see Problem Statement for governance/benchmark rationale"
      - "Helper location RESOLVED: exported from search-flags.ts — see implementation-summary.md Key Decisions"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-Package Flag Governance Reconciliation and Formatting

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `016-cross-package-flag-governance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
A three-angle Fable-5 review (correctness/quality, architecture consistency, risk/blast-radius) of
sibling phases `006-presentation-layer-fixes` through `011-automatic-drift-self-healing` — all
already shipped and passing `validate.sh --strict` — found three issues concentrated in this
packet's two feature-flag registration files, `mcp_server/lib/search/search-flags.ts` and
`mcp_server/lib/config/capability-flags.ts`. This phase is the third of a batch of finding-driven
remediation phases opened from that review; it owns only F5, F14, and F15. None of the three touch
a daemon hot-path logic body, so this is Level 1. The repo already has an established feature-flag
graduation methodology for exactly this category of decision: `004-dark-flag-graduation` ran a
production-path before/after benchmark harness per candidate flag and returned a GRADUATE/REFINE/CUT
verdict backed by real-corpus numbers — its child `002-retrieval-class-weights` benchmarked
`SPECKIT_RETRIEVAL_CLASS_ROUTING` (the flag immediately above the one this phase is about, in the
same file) and returned **CUT**: suppressing the graph/degree channels for narrow queries dropped
single-hop precision at rank one from 0.90 to 0.80 with no multi-hop recall benefit, so the flag
stayed default-off.

### Problem Statement

**F5 — RESOLVED: two different homes for new feature flags, with opposite default-polarity
governance and two different registration patterns; the polarity question is decided —
`SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` flips to default-OFF.**
`mcp_server/lib/search/search-flags.ts:447-455` defines
`isContentRichShortQueryGraphPreservationEnabled()`, which ships **default-ON** ("graduated") via
the shared `isFeatureEnabled()` helper (`lib/cognitive/rollout-policy.ts:59-74`, undefined-is-enabled
semantics). The flag immediately above it in the same file,
`isRetrievalClassRoutingEnabled()` (`search-flags.ts:432-445`), is deliberately **opt-in** via the
module-private `isOptInEnabled()` helper (`search-flags.ts:39-42`, undefined-is-disabled semantics),
with a doc comment stating routing changes "must earn promotion on a reindexed before/after
benchmark" (`search-flags.ts:439-440`) — and the sibling `002-retrieval-class-weights` benchmark
above is exactly that earned promotion attempt, which came back CUT. But
`010-query-channel-calibration/spec.md:54` states its own status as `Implemented,
verification-limited`, and its `implementation-summary.md:107-124` Verification table shows only
targeted vitest/fixture coverage (`query-channel-calibration.vitest.ts` and friends) plus a live
route timing probe that was explicitly BLOCKED by a daemon single-writer lock — no reindexed
production-path before/after benchmark was ever run for this flag, unlike its opt-in sibling. It
shipped default-ON anyway.

This is a governance conclusion, not just a benchmark result. This repo's own stated feature-flag
policy requires a routing-affecting flag to earn default-on graduation via a reindexed before/after
benchmark **before** it ships on, not after — the burden of proof was always on default-ON, and
package 010 only had unit-test/fixture verification when it shipped default-ON, which violates that
policy regardless of what a benchmark run afterward shows. A real (if modest — 7 queries, no labeled
ground truth) benchmark WAS subsequently run and found the flag materially changes routing behavior
(graph-channel usage roughly doubled) with one query's result set changing substantially in a way
that cannot be judged better-or-worse without labeled correct answers. This benchmark is
DECISION-NEUTRAL on quality — it does not prove the flag is bad — but it confirms the flag is NOT
the kind of low-risk, inert-by-default-until-proven change the policy requires for default-ON
shipment. Two independent reviews reached the same conclusion: the original benchmark run, and a
follow-up adversarial review that ran real empirical tests against the original findings. Both
verdict flip-to-default-OFF on policy grounds — the burden of proof was never met — not on a claim
that the benchmark proves the flag harms quality. Re-graduation to default-ON remains a future path,
not a current requirement: it needs 50+ labeled queries with known-correct expected results, warm
runs, and reindexed before/after snapshots, the same rigor `002-retrieval-class-weights` applied to
its sibling flag.

Separately, `capability-flags.ts:240-243`'s
`isQueryTimeExistenceFilterEnabled()` (package 011's `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`) hand-rolls
`process.env[...]?.trim().toLowerCase(); rawValue === 'true' || rawValue === '1'` instead of reusing
either shared helper, even though its own default-OFF, explicit-opt-in semantics are exactly what
`isOptInEnabled()` already implements. Two concurrent AI agent sessions made two different
governance calls in the same subsystem and used two different registration patterns to do it.

**F14 — a formatting/doc-comment split from two concurrent edits to the same file region.**
`capability-flags.ts:209` declares package 009's `STATUS_COMPLETION_CONSISTENCY_GATE_ENV` const.
Package 011's new `QUERY_TIME_EXISTENCE_FILTER_ENV` const and its 15-line doc comment
(`capability-flags.ts:211-225`) were inserted directly after it, pushing package 009's own getter,
`isStatusCompletionConsistencyGateEnabled()` (`capability-flags.ts:227-237`, a 7-line doc comment
plus function), down below an unrelated flag's declaration — splitting what used to be an adjacent
const/getter pair. Package 011's own getter, `isQueryTimeExistenceFilterEnabled()`
(`capability-flags.ts:239-243`), carries only a single-line doc comment
(`/** Returns whether memory_search filters missing backing files at query time. */`) instead of
this file's established convention of a multi-line paragraph plus an explicit "reads env every
call" note — visible on both `isIdentityMergeSafetyEnabled()` (`capability-flags.ts:64-70`) and
`isStatusCompletionConsistencyGateEnabled()` (`capability-flags.ts:227-233`). No behavior changes;
this is purely a reordering and doc-comment expansion.

**F15 — default-on classifier calibration adds concurrent DB load with no safety valve
(monitor, do not fix).**
`query-router.ts:461-465` is where `shouldPreserveGraphForContentRichShortQuery()`
(`query-router.ts:226-236`) adds the graph and degree channels for content-rich short queries when
`isContentRichShortQueryGraphPreservationEnabled()` is on — which, per F5, is the default. Per
`010-query-channel-calibration/implementation-summary.md`'s own Fixture Evidence table, this raised
graph-channel invocation from 2/7 to 6/7 and degree-channel invocation from 0/7 to 6/7 on the
packet's fixture — the dominant, common-case query shape now routes into the slower graph/degree
channels far more often. This is bounded per-query (unlike F8's synchronous write on the search hot
path, already tracked separately) and does not share F8's risk profile, but there is currently no
timeout or circuit-breaker on this added load under heavy concurrent multi-session usage — this repo
routinely runs several simultaneous Claude Code/OpenCode sessions against the same daemon.

### Purpose
Reconcile the two flags onto one governance outcome and one registration pattern, restore the
file's established formatting/doc-comment convention, and put a cheap observability signal in place
for the added concurrent load so a future session has real numbers instead of a guess if this ever
needs a circuit-breaker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **F5a (RESOLVED, mechanical, unconditional):** Flip
  `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`'s default polarity to default-off (opt-in),
  matching its sibling and the stated policy. This is no longer an open operator decision (see the
  Problem Statement above): the repo's flag-graduation policy puts the burden of proof on
  default-ON before shipping, package 010 shipped default-ON without meeting that burden, and the
  subsequent benchmark is decision-neutral on quality but confirms the flag is not the low-risk,
  inert-by-default change the policy assumes. This phase implements the flip and its doc-comment
  update; it does not build a new benchmark harness. Re-graduation to default-ON is a documented
  future path (see Problem Statement), not a requirement of this phase.
- **F5b (mechanical, unconditional):** Migrate `isQueryTimeExistenceFilterEnabled()` off its
  hand-rolled env parsing onto the shared opt-in helper, so `capability-flags.ts` and
  `search-flags.ts` register default-off flags the same way.
- **F14 (mechanical, unconditional):** Reorder `capability-flags.ts:209-243` so package 009's const
  and getter are adjacent again and package 011's flag sits after the pair, not inside it; expand
  package 011's getter doc comment to the file's multi-paragraph + "reads env every call"
  convention.
- **F15 (monitor-only, explicitly not a required fix this round):** Add a lightweight metric/log
  counter recording graph/degree channel invocation under `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`,
  so a future session has real concurrent-load numbers before deciding whether a timeout or
  circuit-breaker is warranted. No timeout/circuit-breaker is implemented in this phase.

### Out of Scope
- Any other finding from the three-angle review (F1-F4, F6-F13, F16) — each is its own phase or
  already fixed; this phase's `depends_on` is empty and it does not read or act on their findings.
- `memory-search.ts`'s synchronous drift-suspect write (F8) — different file, different risk class,
  tracked separately.
- Building a full reindexed benchmark harness for
  `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`'s eventual re-graduation attempt — F5's
  decision this round is the flip, not the benchmark; the 50+-labeled-query, warm-run,
  reindexed-before/after harness needed to re-earn default-ON is a documented future path (see
  Problem Statement), out of scope until someone actually pursues re-graduation.
- Any change to `query-router.ts`'s channel-selection logic itself. F15's fix is additive
  observability only; the routing decision is untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | F5a: flip default polarity to default-OFF and update the graduation doc comment; F5b: export the opt-in helper (or a renamed shared equivalent) for reuse |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | F5b: import and use the shared opt-in helper for `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`; F14: reorder the const/getter block and expand the doc comment |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | F15: add a counter/log line at the content-rich short-query graph-preservation call site |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Update the two affected flag rows (default state and behavior text) to match F5a's resolved default-OFF flip |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` (or nearest existing flag test file) | Modify | Add/update coverage for the polarity change and the shared-helper migration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `isContentRichShortQueryGraphPreservationEnabled()` SHALL flip from `isFeatureEnabled()` (default-ON) to `isOptInEnabled()` (default-OFF), matching its opt-in sibling `isRetrievalClassRoutingEnabled()`. | A diff shows `search-flags.ts:447-455`'s return statement and doc comment updated; the flag remains present and callable (so it can still be turned on for testing) but resolves to disabled when unset; the decision and its governance justification are recorded in `implementation-summary.md` Key Decisions. |
| REQ-002 | `isQueryTimeExistenceFilterEnabled()` SHALL use the same shared opt-in helper `isRetrievalClassRoutingEnabled()`/`isLaneChampionBackfillEnabled()` already use, not hand-rolled parsing. | A diff shows `capability-flags.ts`'s getter body reduced to a single call into the shared helper; behavior is unchanged (still default-off, still `true`/`1` opt-in) confirmed by the existing flag test asserting both states. |
| REQ-003 | `capability-flags.ts:209-243`'s const/getter pairing SHALL be restored: package 009's const and getter adjacent, package 011's flag declared after the pair. | A diff of the region shows no interleaving between the two packages' declarations; no line outside `209-243` changes. |
| REQ-004 | Package 011's getter doc comment SHALL match the file's established multi-paragraph + "reads env every call" convention (compare `isIdentityMergeSafetyEnabled()` and `isStatusCompletionConsistencyGateEnabled()`). | The expanded comment states the flag's purpose, default, and that it reads the environment on every call, consistent in structure with the two cited examples. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `ENV_REFERENCE.md`'s two affected rows (`SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` at line 330, `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` at line 522) SHALL reflect REQ-001's resolved default-OFF flip and the REQ-002 helper migration. | The rows' default-state column and behavior text match the shipped code after this phase lands. |
| REQ-006 | F15's metric/log counter SHALL be additive-only: it MUST NOT change channel-selection behavior, routing output, or the flag's default state. | A before/after diff of `query-router.ts`'s returned routing plan for the same fixture queries is byte-identical; only a new counter increment or log line is added at the call site. |

### Explicitly Deferred (not a requirement of this phase)

F15's counter is a monitoring aid, not a fix. No timeout, circuit-breaker, or concurrency limiter
is required, planned, or scored as incomplete if absent when this phase closes — see `plan.md`
§ F15 and the finding's own framing ("recommend a lightweight metric/log counter to observe real
concurrent load before investing in a circuit-breaker, not a required code change in this round").
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two flags in `search-flags.ts` and `capability-flags.ts` that gate default-off,
  explicit-opt-in behavior all read that opt-in the same way (one shared helper, not two patterns).
- **SC-002**: `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`'s shipped default polarity is
  default-OFF (opt-in), matching the recorded governance decision and its benchmark-confirmed
  justification — not silently left default-ON.
- **SC-003**: `capability-flags.ts:209-243` reads as one coherent block per package again, and
  package 011's getter doc comment is indistinguishable in convention from its neighbors.
- **SC-004**: A future session investigating concurrent load on the graph/degree channels has a real
  counter or log signal to read, rather than needing to re-derive F15's fixture numbers from scratch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk (RESOLVED) | Flipping the default polarity without a recorded decision would have been a silent behavior change to production search routing. | Could regress the search quality gains package 010 claims, or could quietly keep a never-measured behavior default-on | RESOLVED: REQ-001's decision is now recorded with an explicit governance justification (burden of proof was on default-ON, policy was violated, benchmark is decision-neutral on quality) — this phase implements the flip directly rather than leaving it open |
| Risk | A future re-graduation attempt for `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`, if someone pursues it, could build a divergent one-off benchmark harness instead of reusing `004-dark-flag-graduation`'s established pattern (production `executePipeline`, read-only corpus backup, flag-off vs flag-on), fragmenting the graduation methodology this repo has already standardized on. | Inconsistent evidence quality across flags | This phase's Problem Statement documents the re-graduation bar (50+ labeled queries, warm runs, reindexed before/after snapshots) and points at the `002-retrieval-class-weights` harness shape as precedent for whoever picks this up later |
| Dependency | None — F5/F14/F15 touch only registration files and one call site; no sibling phase under this batch needs to land first. | N/A | `depends_on: []` in `graph-metadata.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_Both questions this phase raised are RESOLVED._

- **F5's default-polarity question**: RESOLVED — see Problem Statement and REQ-001. Implemented as
  the flip in `search-flags.ts`.
- **Shared helper's module location**: RESOLVED — `isOptInEnabled()` stays exported directly from
  `search-flags.ts` (not promoted to a new neutral module); `capability-flags.ts` imports it from
  `../search/search-flags.js`, the same cross-directory shape it already uses for `isFeatureEnabled()`
  from `../cognitive/rollout-policy.js`. See `implementation-summary.md` Key Decisions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
