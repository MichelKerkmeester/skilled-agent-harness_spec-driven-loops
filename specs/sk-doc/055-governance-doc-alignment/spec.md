---
title: "Feature Specification: Governance documentation alignment: 006-resume queue plus router and root-doc research"
description: "Carry the 006 clarity handover's open work: repair and validate the 006 packet, then research router alignment and root-doc staleness so the governance documents stop drifting from what they govern."
trigger_phrases:
  - "governance alignment"
  - "router alignment"
  - "root doc staleness"
  - "006 resume queue"
  - "governance-doc-alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/055-governance-doc-alignment"
    last_updated_at: "2026-09-13T12:02:43Z"
    last_updated_by: "pi-055-authoring-session"
    recent_action: "Scaffolded the packet and authored its specification from the 006 clarity handover"
    next_safe_action: "Author plan.md and tasks.md, then repair-derived and validate"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "REPO RULES.md"
      - "repo-rules/communication.md"
      - "specs/sk-communication/006-sk-communication-clarity/handover.md"
      - "specs/sk-communication/006-sk-communication-clarity/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pi-055-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does governance alignment land before or after 006's phase 003 adds a rule file and a router row?"
      - "Does the 006 decision record actually ratify the wording standard's base-plus-supplement shape, or must that ratification still be recorded?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Governance documentation alignment: 006-resume queue plus router and root-doc research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-13 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 006 clarity program paused with its validation state unproven: a swarm rewrote twelve documents, and the repair pass that would confirm them was killed partway. Its handover queues work that sits outside 006's frozen scope. Two governance surfaces drift with every rule the repository adds, the reply-shape router and the root instruction document, and nothing records when they last agreed with what they govern.

### Purpose

Return 006 to 10-of-10 validated state, then research the router and the root doc so the next governance change rests on evidence instead of scar tissue.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Stream A: repair 006's derived metadata, then hold it to recursive strict validation, 10 of 10 RESULT: PASSED
- Stream A: correct the two recorded stale items, the 006 phase-map row for the decision record and 007's ratification wording, each after the ratification question resolves
- Stream A: verify the twelve swarm-rewritten files against the pre-swarm commit, not against HEAD
- Stream B: the router alignment research, 3 iterations, findings written only inside this packet
- Stream C: the root-doc staleness and redundancy research, 5 iterations, findings written only inside this packet
- Acting on both findings, after the sequencing question recorded under Open Questions is answered

### Out of Scope

- 006's implementation, phases 003 through 009. The packet stays theirs to execute.
- The wording standard's six candidates and the sk-communication skill. Phases 007 and 004 own those surfaces.
- The skill-hub documentation, the cli-external-orchestration and system-deep-loop packets. This specification cites their contracts, it does not amend them.
- Publishing. The creation commit stays local under the recorded no-push decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| This packet's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Create | The Level 2 documentation that makes the three streams executable |
| `research/router-alignment/` | Create | Stream B, 3 iterations, its findings, deltas and synthesis, written only here |
| `research/root-doc-staleness/` | Create | Stream C, 5 iterations, its findings, deltas and synthesis, written only here |
| `specs/sk-communication/006-sk-communication-clarity/spec.md` | Modify | Stream A: the phase-map row for phase 002 records the decision record's existence |
| `specs/sk-communication/006-sk-communication-clarity/007-wording-standard-restructure/spec.md` | Modify | Stream A: both ratification references reworded once the decision record answers them |
| `specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/decision-record.md` | Modify | Conditional, only when the ratification is missing there |
| `AGENTS.md`, `REPO RULES.md`, `repo-rules/` | Modify | Deferred, acting on findings, after the sequencing question is answered |
| `specs/sk-communication/006-sk-communication-clarity/handover.md` | Add | The untracked handover joins this packet's creation commit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Repair 006's derived metadata, then recursive strict validation returns 10 of 10 RESULT: PASSED from the final state |
| REQ-002 | The twelve swarm-rewritten files each carry a confirmed or refuted verdict, traced to the pre-swarm comparison, every report claim checked with a receipt |
| REQ-003 | The router alignment research runs exactly 3 iterations, covering both-direction reachability between the router and the rule files, index accuracy against each rule's own description, action-phrased triggers, overlapping or dead rows and scope-statement drift across the current 11 rule files, 5 of which carry recent edits |
| REQ-004 | The root-doc research runs exactly 5 iterations, keeping the not-reality and redundant-detail failure classes apart, every finding citing its case under the three-way discrimination test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The 006 phase-map row and 007's two ratification references are corrected, after the decision record's ratification state is confirmed |
| REQ-006 | Both streams' adopted findings are acted on, each action citing its finding, redundancy findings additionally citing their case and, for case one, the delegate's own line |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From the final state, 006's recursive strict validation reports 10 of 10 RESULT: PASSED
- **SC-002**: Both research folders hold their promised iteration files and a synthesis, 3 and 5 iterations
- **SC-003**: All twelve rewritten files carry a verdict, confirmed or refuted, traced to the pre-swarm comparison
- **SC-004**: The sequencing question's answer is recorded in this packet before any finding is acted on
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 006's validation state, 9 of 10 folders pass today, the parent fails on stale derived metadata | Every later step trusts a packet nobody validated | The repair is idempotent, the handover records it as safe to re-run |
| Dependency | The LLM Gateway credential and the GLM-5.3-Flash roster slot | A research dispatch fails without a resolved key or a mapped literal | Dispatch-time preflight, credential presence in the child environment, roster mapping re-read from the enforcement file |
| Risk | Concurrent sessions edit the governance documents mid-research | A finding cites a file that has since changed | Each finding cites the commit it read, streams write only their own research folders |
| Risk | The ratification else-branch adds a third 006 edit | One decision-record append beyond the two named files | The conditional Files-to-Change row covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does governance alignment land before or after 006's phase 003 adds a rule file and a router row? The 006 handover raises the question and decides nothing.
- Does the 006 decision record actually ratify the wording standard's base-plus-supplement shape, or does the ratification still need recording before 007's wording changes?
<!-- /ANCHOR:questions -->

---
