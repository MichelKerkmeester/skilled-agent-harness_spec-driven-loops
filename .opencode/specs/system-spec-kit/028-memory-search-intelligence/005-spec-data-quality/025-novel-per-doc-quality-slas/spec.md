---
title: "Feature Specification: Per-Doc Quality SLAs [template:level_2/spec.md]"
description: "No per-doc quality threshold exists today, so a doc whose computed quality score drifts below an acceptable bar is never flagged for attention. This phase adds a named SLA threshold over the already-computed quality score that files a report-only ticket into the freshness or B3 refinement queue while reusing the description.json governance block. It builds only after one of those queues exists."
trigger_phrases:
  - "per doc quality sla"
  - "quality threshold"
  - "report only ticket"
  - "freshness queue"
  - "description governance block"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/025-novel-per-doc-quality-slas"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research.md novel per-doc-quality-SLAs row"
    next_safe_action: "Run generators then author plan.md and tasks.md once a host queue exists"
    blockers:
      - "Host queue (freshness decay queue or B3 refinement_queue) must exist before build"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/pe-gating.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/write-provenance.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Per-Doc Quality SLAs

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
| **Branch** | `025-novel-per-doc-quality-slas` |
| **Verdict** | novel-GO (thin, GO-on-cost, floor-irrelevant governance, report-only, build only after a host queue exists) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system computes a per-doc quality score but never holds a doc to a named quality bar over time. The pure scorer `computeMemoryQualityScore` ships and runs on the live save path (`quality-loop.ts:392`). The governance fields that describe a doc (provenance, source_kind, document-weight, content_type, temporal and freshness governance) are already computed on the memory side at `pe-gating.ts` and `write-provenance.ts`. What is missing is a named threshold that says this score is below an acceptable level for this surface and that turns that fact into a tracked actionable item. Today a doc whose quality drifts below a reasonable bar is silently acceptable. There is no SLA and no ticket and no queue entry, so quality regression on an authored doc is invisible until someone reads it again.

### Purpose
Add a named per-doc quality SLA, a threshold over the already-computed quality score declared in the description.json governance block, that files a report-only ticket into an existing maintenance queue when a doc falls below its bar, so quality drift becomes a tracked item without ever auto-mutating the doc.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A named SLA threshold declared in the description.json governance block. The block already carries the A8 governance fields, so the SLA is an additive field (the threshold value plus the surface it applies to) on the same block, validated by the existing passthrough description schema.
- A thin SLA evaluator that reads the already-computed quality score for a doc and compares it against its declared threshold. It computes no new score of its own. It reuses the shipped `computeMemoryQualityScore` output verbatim.
- A report-only ticket emitter. When a doc is below its SLA, the evaluator files one ticket row into an existing maintenance queue, either the freshness decay auto-refresh queue or the B3 `refinement_queue`, whichever host queue exists at build time. The ticket is report-only and is never auto-actioned.
- A default-off flag gating the whole evaluator so the SLA path adds nothing until it is explicitly enabled.

### Out of Scope
- Building any queue. This phase files into a queue that must already exist. It builds NO queue substrate of its own. See dependencies.
- Any auto-fix, auto-refresh, or body mutation. The ticket is a flag for a human or a downstream report, never a change to the doc.
- A new or parallel quality scorer. The SLA reuses the shipped pure scorer only. A second scorer is an explicit NO-GO in research.md Tier D.
- A leaderboard or dashboard. That is a separate NO-GO folded into the sweep report.
- Any retrieval-class change. The SLA is floor-irrelevant governance and touches no ranking or vector path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-sla.ts` | Create | Thin SLA evaluator that reads the computed quality score, compares it to the declared per-doc threshold, then returns an at-risk verdict without computing any new score |
| `.opencode/skills/system-spec-kit/mcp_server/lib/quality/sla-ticket.ts` | Create | Report-only ticket emitter that writes one queue row into the existing host queue when a doc is below its SLA, behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Modify | Document the additive SLA governance field on the description block (threshold value plus target surface), validated through the existing passthrough schema |
| `.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts` | Create | Threshold-comparison, report-only, plus default-off governance tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The SLA evaluator MUST reuse the already-computed quality score and MUST NOT compute a new score. | A test asserts the evaluator reads the `computeMemoryQualityScore` output and never re-derives a score. No new scoring path is introduced. |
| REQ-002 | When a doc's quality score is below its declared SLA threshold, the system MUST file exactly one report-only ticket into the existing host queue and MUST NOT mutate the doc. | A test asserts one queue row is written for a below-threshold doc and that no doc body or metadata field is changed. |
| REQ-003 | While the SLA flag is unset or false, the evaluator MUST be fully dormant and add no cost. | A test asserts the evaluator and ticket emitter are never entered when the flag is absent. |
| REQ-004 | The SLA threshold MUST be declared on the description.json governance block and validated through the existing passthrough schema, never as a new top-level schema or new store. | A test asserts a description.json carrying the SLA field validates and a doc without the field is treated as having no SLA, not as a failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The ticket MUST be report-only and carry the doc identity, the measured score, the threshold, plus the surface, so a human or a downstream report can triage without re-running the evaluator. | A test asserts the ticket row carries all four fields and is tagged report-only. |
| REQ-006 | The evaluator MUST degrade to a no-op when no host queue exists rather than fail or create a queue. | A test asserts that with no freshness queue and no B3 `refinement_queue` present, the evaluator logs and skips and creates nothing. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag off, the SLA path is dormant and the search and save paths are byte-for-byte unchanged.
- **SC-002**: With the flag on and a host queue present, a doc whose computed quality score is below its declared SLA threshold produces exactly one report-only ticket carrying the doc identity, score, threshold, plus surface, while producing no doc mutation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A host queue (freshness decay auto-refresh queue OR B3 `refinement_queue` from `013-b3-retrieval-feedback-edge`) | Hard blocker. The SLA files a ticket and has nowhere to file until one queue exists. | Build this phase only after a host queue ships. The evaluator degrades to a no-op until then per REQ-006. |
| Dependency | A8 governance fields and the shipped pure scorer (`pe-gating.ts`, `write-provenance.ts`, `quality-loop.ts:392`) | The SLA reuses the computed score and the governance block. If the block lacks the score, the SLA has no input. | Read the already-computed score. Add no new computation. Declare the threshold on the same governance block A8 populates. |
| Risk | Scope creep into building a queue | High | The phase files into an existing queue only. Building a queue is out of scope and is the dependency above. |
| Risk | An SLA ticket auto-actioned into a doc refresh | High | The ticket is report-only and carries no apply path. A test asserts no mutation. The host queue's own governance decides any later action, not this phase. |
| Risk | A second quality scorer creeping in | Medium | Reuse the shipped pure scorer verbatim. A parallel scorer is an explicit NO-GO. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With the flag off, zero added cost on any path.
- **NFR-P02**: With the flag on, the evaluator is a single comparison over an already-computed score and adds no scoring cost.

### Security
- **NFR-S01**: The ticket stays inside the existing host queue and the existing memory DB trust boundary and adds no new external surface.

### Reliability
- **NFR-R01**: An evaluator or ticket-write failure MUST degrade to a no-op and never break the save or search response, matching the conservative error handling used across the quality and feedback paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A doc with no declared SLA: treated as having no bar, no ticket, not a failure.
- A doc exactly at its threshold: a test pins the comparison boundary (at-or-above passes, strictly below files a ticket).
- A doc with no computed quality score yet: the evaluator skips it rather than treating a missing score as zero.

### Error Scenarios
- No host queue present: the evaluator logs and skips and creates nothing per REQ-006.
- Queue write failure: log and continue, the save and search responses are unaffected.
- A duplicate ticket for the same doc: the emitter dedups on doc identity so a repeated below-SLA reading does not stack rows.

### State Transitions
- A doc recovers above its SLA: no new ticket is filed and any prior ticket follows the host queue's own TTL and expiry, not a new code path here.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One thin evaluator, one report-only emitter, one additive schema field, one test file. Files into an existing queue, builds none |
| Risk | 8/25 | No breaking change, default-off, report-only, no body mutation, reuses the shipped scorer |
| Research | 6/20 | Verdict and seams grounded in research.md (novel row plus A8 and B3 grounding), thin by design |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which host queue this phase targets at build time, the freshness decay auto-refresh queue or the B3 `refinement_queue`, decided by which one ships first.
- Whether SLA thresholds are per-doc declarations only or also carry a per-surface default the doc-level value overrides.
<!-- /ANCHOR:questions -->
