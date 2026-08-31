---
title: "Feature Specification: Phase 4: Research Adoption and Rule-Set Reconciliation"
description: "Phase 3 produces a ranked list of proposed changes to the rule set, to AGENTS.md, and to the rule inventory, and a research finding is a hypothesis until something tests it. This phase gives every recommendation a recorded disposition — accept, decline, or defer with an owner — implements the accepted ones, and reconciles the packet so no document claims a state the others contradict."
trigger_phrases:
  - "research adoption"
  - "recommendation disposition"
  - "rule set reconciliation"
  - "agents md amendment"
  - "packet closure"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: Research Adoption and Rule-Set Reconciliation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-disposition-and-gap-research |
| **Successor** | None |
| **Handoff Criteria** | Every phase-3 recommendation has a recorded disposition; every accepted one is implemented and validated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the repo-rules router packet, and the one that closes it.

**Scope Boundary**: Only what phase 3 recommended and this phase accepted. A change nobody proposed does not enter here on the grounds that it seemed sensible while the files were open - that is the drift `scope-discipline.md` names.

**Dependencies**:
- Phase 3's ranked recommendation list, complete and validated.
- Operator approval for any recommendation touching `AGENTS.md`, since that document carries hard blockers and gates.

**Deliverables**:
- A disposition table: every recommendation marked accepted, declined, or deferred, with a one-line reason.
- The accepted changes, implemented in the phase-1 format.
- Parent-packet reconciliation: the Phase Documentation Map, statuses, and the parent's own completion claims all agreeing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 3 returns a ranked list from a single executor family running five iterations. Nothing about that makes it right: `evidence-and-proof.md` already binds this repository to treating a finding as a hypothesis, and the delegation rule from phase 2 says a single model's verdict does not close a question. So the list arrives needing a decision, not an application. Two specific hazards follow. A research loop asked to find gaps will find gaps, so accepting the list wholesale would inflate a six-file rule set on the strength of an agreeable model - the exact over-engineering `overengineering.md` guards against, committed inside the packet that shipped it. And any recommendation touching `AGENTS.md` touches a document whose section 1 cannot be overridden, which makes it an operator decision rather than an implementation detail. Meanwhile the parent packet currently reports `Complete` in documents written before these four children existed, so the packet also needs its own state reconciled before it can honestly close.

### Purpose
Turn phase 3's proposals into recorded decisions, implement only what survives that judgment, and leave the packet in a state where no document contradicts another.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A disposition table covering every phase-3 recommendation: accepted, declined, or deferred, each with a one-line reason and, for deferrals, an owner.
- Implementation of accepted recommendations under `repo-rules/` and `REPO RULES.md`.
- An operator decision request for any accepted recommendation that touches `AGENTS.md`, presented with the change, the reason, and the line delta.
- Reconciliation of the parent packet: Phase Documentation Map statuses, parent `spec.md` status, and the parent's `implementation-summary.md` completion claims.
- Recursive validation of the parent and all four children.

### Out of Scope
- **Changes nobody recommended** - if the research did not raise it, it is not adopted here; it is raised separately.
- **Re-running or extending the research** - if the list is inadequate, that is a phase-3 defect to report, not a licence to research more inside an adoption phase.
- **Enforcement tooling** - still excluded, consistent with the parent packet, unless the research recommended it and the operator accepted it.
- **Editing `AGENTS.md` without approval** - the document carries hard blockers; an unapproved edit to it would be the violation the rule set exists to prevent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `adoption-decisions.md` (this folder) | Create | The disposition table: every recommendation, its verdict, and the reason |
| `repo-rules/*.md` | Modify/Create | Only where a recommendation was accepted |
| `REPO RULES.md` | Modify | Router rows for any accepted new rule; index updates |
| `AGENTS.md` | Modify | Only with recorded operator approval |
| `../spec.md` | Modify | Phase Documentation Map statuses and parent status |
| `../implementation-summary.md` | Modify | Reconciled completion claims covering the phased work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every phase-3 recommendation has exactly one recorded disposition, and no recommendation is silently dropped. |
| REQ-002 | Every declined recommendation carries a reason that names why the change is not warranted, not merely that it was not done. |
| REQ-003 | No `AGENTS.md` edit lands without a recorded operator approval naming the change. |
| REQ-004 | Accepted changes are implemented in the phase-1 heading and divider format, so the rule set stays internally consistent. |
| REQ-005 | The parent packet's status, Phase Documentation Map, and completion claims agree with each other and with the children's actual states. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every accepted recommendation is verified against the repository before it is written, rather than trusted because the research asserted it. |
| REQ-007 | Any new rule file is reachable from the router by a resolving link, and costs exactly one file plus two router rows. |
| REQ-008 | The adoption rate is reported honestly, including the case where most recommendations were declined - a low rate is a finding about the research, not a failure of this phase. |
| REQ-009 | Deferred recommendations name an owner or a follow-on packet, so a deferral is a decision rather than a disappearance. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recommendation count in phase 3 equals the row count in the disposition table; no row is blank.
- **SC-002**: `validate.sh --recursive --strict` on the parent returns `RESULT: PASSED` for the parent and all four children.
- **SC-003**: No document in the packet claims a completion state another document contradicts.
- **SC-004**: The rule set after adoption is still a router plus independently readable leaves, with no rule file needing another to be actionable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wholesale acceptance - the list is applied because it is ranked and looks thorough | High - it would inflate the rule set on one model's judgment | REQ-006 requires each accepted item verified against the repository first; REQ-008 makes a low adoption rate a reportable outcome rather than an embarrassment |
| Risk | An `AGENTS.md` edit lands without approval | High - that document carries hard blockers | REQ-003 blocks it; the approval must name the specific change, not the general phase |
| Risk | Scope drift: adjacent improvements ride along because the files are open | Med - the drift `scope-discipline.md` names | Only recommended items enter; anything else is raised separately |
| Risk | The parent's `Complete` claims are left stale | Med - a packet that lies about its own state | REQ-005 and the completion verification rule both require reconciliation before closure |
| Risk | The research returns too few or too vague recommendations to act on | Med - adoption would become invention | That is reported as a phase-3 defect; this phase does not quietly widen to fill the gap |
| Dependency | Phase 3 output | No list, nothing to adopt | Phase ordering enforced by the parent's handoff criteria |
| Dependency | Operator availability for `AGENTS.md` decisions | Those items stall | They are batched into one consolidated request rather than asked one at a time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every accepted change traces to a numbered recommendation, and every recommendation traces to a disposition.
- **NFR-T02**: The disposition table is readable on its own, without the research transcripts.

### Context Cost
- **NFR-C01**: The always-loaded surface does not grow unless an accepted, operator-approved recommendation requires it, and the line delta is stated when it does.
- **NFR-C02**: Any new rule file stays under the ~160-line ceiling the parent packet set.

### Consistency
- **NFR-K01**: New and edited rule files match the phase-1 format exactly.
- **NFR-K02**: The router keeps holding no rules of its own - a rule that leaks into the router breaks the architecture the packet exists for.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Disposition Boundaries
- **Zero recommendations accepted**: a legitimate outcome; recorded as such with reasons, and the packet still closes.
- **A recommendation that contradicts another**: both are dispositioned, and the contradiction is resolved explicitly rather than by picking the higher-ranked one.
- **A recommendation already satisfied by an existing rule**: declined as redundant, citing the file and section that already covers it.

### Approval Boundaries
- **The operator declines an `AGENTS.md` change**: recorded as declined with the operator as the decider; the rest of the phase proceeds.
- **The operator is unavailable**: the `AGENTS.md` items are deferred with a named follow-on, and the phase closes on what it could decide.

### Reconciliation Boundaries
- **A child left incomplete**: the parent map says so; the parent does not report Complete over an incomplete child.
- **The parent's own baseline docs versus the new children**: the baseline is preserved as phase 0's record, and the parent's status reflects the packet as a whole.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Unknown until phase 3 lands; bounded by the recommendation list |
| Risk | 14/25 | Touches `AGENTS.md` under approval, and closes the packet |
| Research | 6/20 | The research is done; this phase verifies rather than investigates |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- If the research recommends restoring the governor disposition as a rule file, does that need operator approval even though it touches no hard blocker? **Leaning yes: retiring it was an operator-level call, so re-homing its content is one too. Confirmed or corrected when the recommendation actually exists.**
- Should declined recommendations be kept in the packet or dropped once decided? **Kept. A declined recommendation with its reason is what stops the same suggestion arriving again next quarter with nobody remembering why it was refused.**
<!-- /ANCHOR:questions -->

---
