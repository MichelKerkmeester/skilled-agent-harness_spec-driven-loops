---
title: "Feature Specification: B3 Retrieval-Learning Feedback Edge [template:level_2/spec.md]"
description: "learned-feedback.ts records only the positive selection edge and no impression telemetry exists, so a doc that is never retrieved cannot be distinguished between a real recall gap and a below-floor truncation casualty. This phase captures an impression signal at the result-assembly seam and queues edge-tagged refinement actions report-only behind a default-off flag."
trigger_phrases:
  - "retrieval feedback edge"
  - "impression signal"
  - "recall gap"
  - "below floor truncation"
  - "refinement queue"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/013-b3-retrieval-feedback-edge"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research.md B3 row"
    next_safe_action: "Run generators then author plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: B3 Retrieval-Learning Feedback Edge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `013-b3-retrieval-feedback-edge` |
| **Verdict** | experiment (default-off, report-only, retrieval-class actions C2-gated) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval-learning loop records only the positive selection edge. `learned-feedback.ts:257 recordSelection` logs a term-add audit row when a user selects a result, but the grep for impression or never-retrieved telemetry across the search lib is empty, so the system has no signal for a doc that was never retrieved. That gap matters because the prod path truncates every query to a 3-result floor at `confidence-truncation.ts:35 DEFAULT_MIN_RESULTS`, which means a never-retrieved doc is one of two very different things and the system cannot tell them apart. One is a real recall gap where the doc ranked below the candidate set, the other is a below-floor truncation casualty where the doc was a real candidate the floor cut.

### Purpose
Capture an aggregate impression signal at the result-assembly seam, split never-retrieved into a recall-gap edge versus a below-floor-truncation edge using `min_rank_seen`, and queue edge-tagged refinement actions report-only behind a default-off flag so the loop can learn from what it failed to surface without ever auto-applying a change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An aggregate impression capture at the result-assembly seam in `hybrid-search.ts`, recording an `impression_count` and a per-doc `min_rank_seen` behind `SPECKIT_RETRIEVAL_GAP_DETECT` default-off.
- A `detect-retrieval-gaps.ts` detector that reads the captured impressions, classifies a never-retrieved doc into edge (a) recall-gap when the doc was seen but ranked outside the returned set, versus edge (b) below-floor truncation when the doc was a candidate the 3-result floor cut, using `min_rank_seen` as the discriminator.
- A `refinement_queue` table that stores edge-tagged refinement rows, mirroring the `learned_feedback_audit` governance shape (age eligibility, shadow period, TTL expiry, nuclear rollback).
- Report-only emission: the detector proposes refinement actions and never auto-applies them. The edge-a recall-gap enrich-triggers action is registered suggest-only, the edge-b below-floor row is advisory only.

### Out of Scope
- Acting on edge-b below-floor rows. They are C2-gated and require the prod-mode completeRecall@3 proof from `015-c2-prodmode-recall-gate`, which does not exist yet.
- Any auto-apply or auto-refine path. B3 proposes, it never refines.
- Changing the truncation floor itself at `confidence-truncation.ts`. The floor stays. B3 only observes what it cut.
- Re-embedding or any re-index work. The capture reads the assembled result set already in memory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Add aggregate impression capture at the result-assembly seam where `truncateByConfidence` is applied, recording `impression_count` and per-doc `min_rank_seen` behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts` | Create | New detector that classifies never-retrieved docs into recall-gap versus below-floor edges and writes edge-tagged rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` | Modify | Add the `refinement_queue` table DDL mirrored on the `learned_feedback_audit` governance columns |
| `.opencode/skills/system-spec-kit/mcp_server/tests/detect-retrieval-gaps.vitest.ts` | Create | Edge-discriminator and report-only governance tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | While `SPECKIT_RETRIEVAL_GAP_DETECT` is unset or false, the search seam MUST behave byte-for-byte as it does today. | Search output and timing are unchanged with the flag off. A test asserts the capture path is never entered when the flag is absent. |
| REQ-002 | When the flag is on, the seam MUST record an aggregate `impression_count` and a per-doc `min_rank_seen` at the result-assembly point before the floor truncates. | A test feeds a candidate set wider than the floor and asserts `min_rank_seen` reflects the pre-truncation rank, not the post-floor rank. |
| REQ-003 | The detector MUST split a never-retrieved doc into edge (a) recall-gap versus edge (b) below-floor truncation using `min_rank_seen` as the discriminator. | A test asserts a doc whose `min_rank_seen` is within the floor maps to edge-b and a doc whose `min_rank_seen` is outside the returned set maps to edge-a. |
| REQ-004 | The detector MUST queue refinement actions report-only and MUST NOT auto-apply any action. | A test asserts no body mutation and no learned-term write occur on a detector run. Only `refinement_queue` rows are written. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The `refinement_queue` MUST mirror the `learned_feedback_audit` governance: age eligibility, shadow period, TTL expiry, and nuclear rollback. | A test asserts a row younger than the age floor is ineligible, rows inside the shadow period are logged not actioned, expired rows drop on TTL, and the rollback path clears the queue. |
| REQ-006 | The edge-a recall-gap action MUST be registered suggest-only and the edge-b below-floor row MUST be advisory only, consistent with the research fixClass note. | The detector emits the edge-a action tagged as a suggestion and the edge-b row carries an advisory marker that names the C2 gate as its unblock condition. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag off, the search path is unchanged and the impression capture and detector are dormant.
- **SC-002**: With the flag on against a controlled corpus, the detector produces at least one edge-a recall-gap row and one edge-b below-floor row, each correctly classified by `min_rank_seen`, and writes nothing outside the `refinement_queue`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-c2-prodmode-recall-gate` | Edge-b below-floor actions cannot be acted on until the prod-mode completeRecall@3 gate exists. | Keep edge-b advisory only. The gate is the explicit unblock condition named in the row. |
| Dependency | `learned_feedback_audit` governance in `learned-feedback.ts` | The queue copies this shape, so a divergence would create a second un-governed audit surface. | Mirror the columns and the four safeguards verbatim rather than re-inventing them. |
| Risk | Per-query capture overhead on a hot search path | Medium | Aggregate the signal and gate the whole capture behind the default-off flag so prod pays nothing until the experiment is explicitly enabled. |
| Risk | Misreading `min_rank_seen` as the post-floor rank | High | Capture at the pre-truncation assembly point, before `truncateByConfidence` runs, and assert the pre-truncation rank in a test. |
| Risk | An action silently auto-applied | High | All actions are report-only. The edge-a action is suggest-only and the edge-b row is advisory. A test asserts no mutation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With the flag off, zero added cost on the search path.
- **NFR-P02**: With the flag on, the capture is aggregate and bounded per query so it does not change the search latency tier.

### Security
- **NFR-S01**: The `refinement_queue` stays inside the existing memory DB trust boundary and adds no new external surface.

### Reliability
- **NFR-R01**: A capture or detector failure MUST degrade to a no-op and never break the search response, matching the conservative error handling already used in `learned-feedback.ts`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty candidate set: no impression rows recorded and the detector returns an empty queue.
- All candidates returned (no truncation): no below-floor edge rows since nothing was cut.
- A doc seen at exactly the floor boundary: classified by the `min_rank_seen` comparison, which a test pins.

### Error Scenarios
- DB write failure on the queue: log and continue, the search response is unaffected.
- Schema not yet migrated: the capture is a no-op until the `refinement_queue` table exists.

### State Transitions
- Shadow period active: rows are logged but not surfaced as actionable.
- TTL expiry: stale queue rows drop on the same expiry discipline as learned terms.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One seam edit, one new detector module, one new table, one test file |
| Risk | 12/25 | No breaking change, default-off, but touches a hot search path and copies a governance shape |
| Research | 8/20 | Seams already grounded to file:line in research.md, edge taxonomy fixed |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What aggregation window bounds `impression_count` per query so the capture stays cheap on the hot path.
- Whether the `refinement_queue` reuses the `learned_feedback_audit` table with an edge column or stands as its own table mirroring the same columns.
<!-- /ANCHOR:questions -->
