---
title: "Feature Specification: State records a deep loop can trust"
description: "Stamp deep-loop state records with the time they were appended instead of a time a model invented, and stop failing a completed lineage over the event name it chose."
trigger_phrases:
  - "deep loop state records"
  - "fabricated timestamps"
  - "synthesis_complete validation"
  - "stop policy event name"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/005-trustworthy-state-records"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed both fixes with covering tests"
    next_safe_action: "Watch the next real fan-out for a quiet timestamp_anomaly channel"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: State Records A Deep Loop Can Trust

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `004-deep-alignment-integrity`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/005-trustworthy-state-records |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Owner** | system-deep-loop, which owns the fan-out runtime and the state-record contract |
| **Consumers** | Every deep-command surface: research, review, alignment, ai-council, the benchmark modes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two defects, both surfaced by fan-out runs during unrelated work, both costing completed analysis.

**State records carry times that never happened.** The command templates build each record as text
containing a literal `{ISO_8601_NOW}` placeholder for a model to substitute. A model has no clock, so
it writes something plausible. Observed logs carry iteration times minutes past the moment the run
ended, and neat ten-minute cadences for runs that finished in six. There are 145 such placeholders
across 12 deep-command files, so every loop is affected, not one.

**A finished lineage is failed over the word it chose.** The stop-policy validator required the exact
event name `synthesis_complete`. Across three runs of one model on one prompt, producers wrote
`synthesis_complete`, then `phase_synthesis_complete`, then `synthesis`. The third completed all five
iterations and wrote a full report, findings registry and resource map, and was failed terminally
anyway. Compliance is not deterministic, so the exact match is not a reliable gate.

### Purpose

Make the recorded time the time something happened, and judge completion by what a lineage produced
rather than by how it described itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Authoritative timestamping in the single helper every state record is appended through.
- Preserving the producer's claimed time so fabrication stays auditable.
- Recognising the synthesis event names producers have actually written.
- An artifact-based completion fallback when no event name is recognised.

### Out of Scope

- Removing `{ISO_8601_NOW}` from the 12 command templates. The appender overrides it, so the
  placeholders are now inert; editing 145 of them is churn against a fixed defect.
- Changing what any loop measures, or any scoring contract.
- The `timestamp_anomaly` detector, which keeps working and should simply go quiet.

### Files to Change

| File | Change |
|------|--------|
| `runtime/scripts/append-state-record.cjs` | Stamp the append time; keep the claim as `reportedTimestamp` |
| `runtime/scripts/fanout-run.cjs` | Recognise synthesis name variants; fall back to artifacts |
| `runtime/tests/unit/trustworthy-state-records.vitest.ts` | Cover both, using the strings from real runs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recorded time is observed, not claimed | A record submitted with a future timestamp is stored with the append time |
| REQ-002 | The claim survives | The submitted value is retained under a separate field when it differs |
| REQ-003 | A completed lineage passes regardless of event name | Each name seen in a real run is recognised |
| REQ-004 | An incomplete lineage still fails | An explicit incomplete report, or too few iterations on disk, is still a violation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The fallback can reach the artifacts | The lineage directory is threaded in explicitly rather than read off a config object that lacks it |
| REQ-006 | No unrelated field is altered | Every other key on a record round-trips unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A fan-out log can be read as a timeline without cross-checking it against wall-clock evidence.
- A lineage that produced a report and its iterations is not discarded for a naming mismatch.
- Fabrication remains visible rather than being silently corrected away.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A tolerant validator admits a lineage that did not finish | Completion still requires the iteration count to meet the cap, and `synthesis_incomplete` stays excluded |
| Overwriting the timestamp hides that a producer invented one | The claim is preserved under its own field, so the evidence is kept rather than destroyed |
| The fallback silently never fires | The lineage directory is passed explicitly and asserted by test, because it is not a field on the lineage config |

**Dependencies:** the fan-out runtime and the deep-command state-record contract.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether the `timestamp_anomaly` detector should be repointed at `reportedTimestamp`, so it reports
   producer fabrication rather than going permanently quiet now that the stored field is authoritative.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **One choke point:** the timestamp fix lands where every record already passes, so no producer needs
  to change and no template needs editing.
- **Evidence over assertion:** completion is judged by what exists on disk before it is judged by what
  a producer said about itself.
- **No behaviour change to measurement:** nothing here alters what a loop scores.
<!-- /ANCHOR:nfr -->
