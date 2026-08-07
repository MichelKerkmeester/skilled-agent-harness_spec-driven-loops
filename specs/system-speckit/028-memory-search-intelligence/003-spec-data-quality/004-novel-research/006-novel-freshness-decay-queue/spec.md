---
title: "Feature Specification: Novel Freshness Decay Auto-Refresh Queue [template:level_2/spec.md]"
description: "The shipped FSRS retrievability number ranks and decays memories but nothing reads it to queue stale docs for maintenance. A decayed doc silently rots with no report-only signal that it needs a human refresh."
trigger_phrases:
  - "freshness decay queue"
  - "fsrs retrievability"
  - "auto-refresh queue"
  - "staleness maintenance queue"
  - "report-only freshness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/004-novel-research/006-novel-freshness-decay-queue"
    last_updated_at: "2026-06-27T17:15:39.015Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored novel freshness decay queue spec from research synthesis"
    next_safe_action: "Author plan.md and tasks.md for the queue build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Novel Freshness Decay Auto-Refresh Queue

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
| **Branch** | `024-novel-freshness-decay-queue` |
| **Verdict** | novel-GO (thin), GO-on-cost |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../005-novel-typed-relation-kg/spec.md |
| **Successor** | ../007-novel-per-doc-quality-slas/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The FSRS retrievability number is SHIPPED and computed live on every read. `computeMemoryState` returns a per-memory `retrievability` plus a tier state (`tier-classifier.ts:325-328`), the inline power-law formula and the `calculateRetrievabilityScore` consumer both run today (`composite-scoring.ts:299,357`), and the tier thresholds are set (`tier-classifier.ts:39-41`, HOT at 0.80, WARM at 0.25, COLD at 0.05). Nothing reads that decayed number to flag a doc for a human refresh. A grep for `refresh_queue`, `freshness_queue`, or `auto.?refresh` across `mcp_server/` returns empty, so a doc that has decayed past COLD into DORMANT rots silently with no report-only maintenance signal.

### Purpose
A report-only freshness queue reads the SHIPPED retrievability number, queues a doc that has decayed below a configured threshold as a maintenance candidate, and surfaces it through the existing sweep report. It never auto-refreshes a body.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new detector `freshness.decay` on the shared registry that reads the SHIPPED per-memory `retrievability` and tier state and emits a queue row for any doc below the configured staleness threshold.
- A `refresh_queue` table mirrored on the `learned_feedback_audit` governance shape (age eligibility, TTL expiry, no auto-apply), gated default-off behind a flag.
- A `fixClass` of `none` and advisory on this detector so it can never apply a body edit.
- Surfacing the queued rows through the B1 sweep report and the description.json governance block, read-only.
- A configured threshold keyed on the existing retrievability tier boundary (COLD to DORMANT) with no new decay math.

### Out of Scope
- The FSRS retrievability or stability math - SHIPPED, consumed verbatim, never re-implemented.
- Any auto-refresh, re-embed, or body rewrite of a memory or authored doc - the hard rail, permanently excluded.
- The shared safe-fix engine and detector registry - owned by 026-shared-safe-fix-engine, consumed here.
- The per-doc quality SLA layer - a downstream consumer that files into this queue, built only after this queue exists.
- Any retrieval-class change - this queue emits findings not vector rows, so it carries no C2 gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/detectors/freshness-decay.ts` | Create | Detector reading the shipped retrievability number, emitting report-only queue rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/refresh-queue.ts` | Create | `refresh_queue` table and accessor mirrored on the `learned_feedback_audit` governance |
| Detector registry entry | Modify | Register `freshness.decay` with `fixClass: none`, default-off flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When the detector runs, the system SHALL read the SHIPPED `retrievability` number from `computeMemoryState` and never compute its own decay value. | Detector output for a fixture memory equals the value `computeMemoryState` returns for the same memory, byte for byte, with no parallel formula in the detector. |
| REQ-002 | The system SHALL NEVER auto-refresh, re-embed, or rewrite a memory body or authored doc body. | The detector `fixClass` is `none`, the registry safe allow-list does not contain it, and an apply run over a stale fixture produces an empty diff. |
| REQ-003 | When a memory has decayed below the configured staleness threshold, the system SHALL emit a report-only queue row, not an applied change. | A fixture memory below the threshold produces one `refresh_queue` row in report mode and zero body writes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The `refresh_queue` SHALL mirror the `learned_feedback_audit` governance: age eligibility, TTL expiry, and no auto-apply. | The queue accessor enforces the same age gate and TTL fields as `learned-feedback.ts`, verified by a parity test against the audit shape. |
| REQ-005 | The detector SHALL be default-off behind a flag so the legacy corpus never gains a new signal without an opt-in. | With the flag unset the detector emits zero rows, with the flag set it emits rows for sub-threshold docs only. |
| REQ-006 | The queued rows SHALL surface through the B1 sweep report and the description.json governance block, read-only. | A sweep run lists the queued candidates in its report and writes none of them back as a fix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The detector reads only the shipped FSRS retrievability number, owns zero decay math, and a stale fixture below the threshold produces a queue row with no body mutation.
- **SC-002**: The novel value proven is the queue wiring on a non-retrieval governance metric: a count of correctly-queued stale docs with zero false body refreshes, distinct from any recall measurement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | The detector has no registry or `fixClass` of its own | Build after the engine and registry land, register one entry with `fixClass: none` |
| Dependency | Shipped FSRS retrievability (`tier-classifier.ts:325`, `composite-scoring.ts:299`) | The queue is wiring atop this number and breaks if it is re-implemented | Consume `computeMemoryState` verbatim, add no decay math |
| Dependency | B1 sweep report (011-scheduled-dq-sweep) and B3 governance precedent (013-retrieval-feedback-edge) | The queue surfaces through the sweep and mirrors the `learned_feedback_audit` shape | Reuse the report channel and the audit governance, fork neither |
| Risk | An auto-refresh creeping into the queue | Crosses the no-body-mutate hard rail | `fixClass` is `none`, the queue is report-only, no fix path exists for this detector |
| Risk | A new always-on signal on the legacy corpus | Noise on docs that decay by design | Default-off behind a flag, age eligibility and TTL expiry bound the queue |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The detector reads an already-computed retrievability number per memory, so it adds no decay computation and runs inside the existing sweep fan-out wall clock.
- **NFR-P02**: The `refresh_queue` is bounded by age eligibility and TTL expiry so it cannot grow unbounded over the corpus lifetime.

### Security
- **NFR-S01**: The detector has `fixClass: none`, so it holds no write path to any memory or authored body and cannot mutate the corpus.

### Reliability
- **NFR-R01**: A re-run over an unchanged corpus produces the same queue set, since the input is the deterministic shipped retrievability number for a fixed elapsed time.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A pinned or constitutional memory: `computeMemoryState` returns `retrievability: 1.0` and never decays (`tier-classifier.ts:300-308`), so it is never queued.
- A memory with no `last_reviewed` timestamp: elapsed days is clamped to zero (`tier-classifier.ts:311-316`), so it reads as fresh and is not queued.
- A doc already in the queue: the age eligibility and TTL guard dedups it rather than re-queueing.

### Error Scenarios
- The shipped retrievability accessor unavailable: the detector reports the read failure and emits zero rows rather than guessing a decay value.
- A queue write fails mid-batch: the report-only contract means no body was touched, so a re-run is safe with no partial-refresh state.
- The flag set but the `refresh_queue` table missing: the detector aborts before emitting and reports the missing table.

### State Transitions
- A doc that crosses back above the threshold after a human refresh: its queue row expires via the TTL, the detector does not re-queue a now-fresh doc.
- The threshold tier boundary retuned: the queue set shifts on the next run, no migration needed because the detector holds no stored decay state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One detector, one report-only table, one registry entry, all thin over shipped machinery |
| Risk | 10/25 | Report-only with `fixClass: none`, the no-body-refresh rail is mechanical not advisory |
| Research | 6/20 | Retrievability and governance seams verified to file:line, the engine dependency carries the design |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree.

- The SHIPPED input is the per-memory `retrievability` number. `computeMemoryState` computes it and returns `{ state, retrievability, effectiveHalfLife }` (`tier-classifier.ts:325-328`), the power-law formula is live (`composite-scoring.ts:357`), and `calculateRetrievabilityScore` is the existing consumer (`composite-scoring.ts:299`). The detector reads this number and owns no decay math.
- The staleness threshold keys on the existing retrievability tier boundary (`tier-classifier.ts:39-41,282-284`): HOT at 0.80, WARM at 0.25, COLD at 0.05, then DORMANT below. The configured queue threshold sits at the COLD to DORMANT edge so only genuinely-decayed docs queue, reusing the shipped thresholds rather than inventing a new cutoff.
- `freshness-decay.ts` is the new detector. It iterates the corpus memories, reads the shipped retrievability per memory, and emits a `refresh_queue` row for any below the threshold. Its registry entry declares `fixClass: none`, so the frozen safe allow-list never contains it and no `fix()` runs.
- `refresh-queue.ts` is the new report-only table mirrored on the `learned_feedback_audit` governance (`learned-feedback.ts`): age eligibility, shadow period, TTL expiry, no auto-apply. The detector is gated behind a default-off flag matching the B3 precedent.
- The queued rows surface through the B1 sweep report and the description.json governance block, read-only. The queue proposes a maintenance candidate, a human refreshes the body, the detector never writes one.

## 8. DEPENDENCIES AND VERDICT

- **Depends on 026-shared-safe-fix-engine**: the detector is one registry entry with `fixClass: none` on the shared `detector-registry.ts`. It is a report-only consumer of the engine, not a parallel implementation. Build it after the engine and registry land.
- **Depends on the shipped FSRS retrievability**: the whole feature is queue wiring atop `computeMemoryState` (`tier-classifier.ts:325`) and the shipped tier thresholds (`tier-classifier.ts:39-41`). The novelty is the queue, not the decay number.
- **Sibling B1 and B3**: the queue surfaces through the B1 sweep report (011-scheduled-dq-sweep) and mirrors the `learned_feedback_audit` governance the B3 feedback edge (013-retrieval-feedback-edge) also reuses. It forks neither.
- **Not gated on 015-prodmode-recall-gate**: the queue emits findings not vector rows, so the C2 prod-mode completeRecall@3 gate does not block it. This is floor-bypassing by construction.
- **Verdict: novel-GO (thin), GO-on-cost**. Floor-bypassing, it queues maintenance report-only on top of the shipped FSRS retrievability number, novel only as the queue wiring. It must NEVER auto-refresh a body. It ships on cost with the queued-stale-doc count as its own non-retrieval proof.

---

## 10. OPEN QUESTIONS

- Does the staleness threshold sit exactly at the COLD to DORMANT tier edge, or one configured step below, given the corpus decay profile.
- Does the per-doc quality SLA layer file into this same `refresh_queue` once it exists, or carry its own queue keyed by a named SLA threshold.
<!-- /ANCHOR:questions -->
