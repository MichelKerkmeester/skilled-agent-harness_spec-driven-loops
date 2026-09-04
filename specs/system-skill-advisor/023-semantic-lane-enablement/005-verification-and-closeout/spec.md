---
title: "Feature Specification: Phase 5: verification-and-closeout"
description: "Re-run every gate from the final state, reconcile the predecessor packet's roadmap and findings register, and close the packet with its numbers rather than its intentions."
trigger_phrases:
  - "closeout verification"
  - "final state proof"
  - "findings reconciliation"
  - "packet closure"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Re-run every gate from the final state"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-005-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-gated-enable |
| **Successor** | None |
| **Handoff Criteria** | Every gate passes from the final state, and the predecessor packet's open items are closed or reassigned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Semantic lane enablement specification.

**Scope Boundary**: Verification and reconciliation. No new capability and no further weight change.

**Dependencies**:
- Phase 004, for the enabled state this phase verifies.
- Packet 052, whose roadmap and findings register point at this packet.

**Deliverables**:
- A final-state run of every gate, from the state the packet actually leaves behind.
- The predecessor packet's roadmap entry and finding 10 marked closed, with evidence.
- The packet's own documents reconciled so no two of them claim different completion states.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A packet that measured well during its work can still leave a repository that disagrees with
itself. The gates were run at different moments, one against a state that has since moved. The
predecessor packet carries a roadmap entry and a register finding that both point here, and
neither closes itself. And the packet's own documents can end up claiming different completion
states, which is how a green validation run certifies a packet nobody can trust.

There is a specific trap here. The validation orchestrator refuses to run when its compiled build
is stale: it exits with a system error and emits no rule output at all, so a sweep looking only
for a failure line reads that silence as a pass. A closeout that trusts an exit code rather than
reading for a passing result would certify nothing.

### Purpose

Prove the final state, close what this packet's predecessor left pointing at it, and leave one
consistent account of what happened.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-running the accuracy ratchet, the frozen corpus, the controls and the canaries from the final state.
- Re-deriving the corpus hashes and the coverage count after the run, so nothing moved underneath.
- Closing the predecessor packet's roadmap entry and its finding 10 with evidence.
- Reconciling this packet's documents so their completion claims agree.
- Regenerating the metadata pair for every folder and validating the packet recursively.

### Out of Scope
- Any further weight change. If the numbers argue for one, that is an amendment or a new packet.
- The legacy duplicate entries and the cross-hub collisions, which packet 052 phase 004 owns.
- Removing the retired shadow vocabulary from the code.
- Reconciling the two scorers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/final-state.md` | Create | Every gate's number from the final state, with the command that produced it |
| `specs/sk-doc/052-routing-completeness/roadmap.md` | Modify | The Later entry closed with evidence |
| `specs/sk-doc/052-routing-completeness/research/findings-register.md` | Modify | Finding 10 marked resolved, naming this packet |
| `../spec.md` | Modify | The parent Phase Documentation Map statuses |
| `../goal.md` | Modify | The parent progress table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Re-run every gate from the final state and record its number beside the command that produced it |
| REQ-002 | Require an explicit passing result from the validator rather than reading an exit code, and rebuild the orchestrator first if it reports itself stale |
| REQ-003 | Regenerate the metadata pair for every folder in the packet and validate recursively |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Close the predecessor packet's roadmap entry and finding 10, each with evidence |
| REQ-005 | Reconcile every completion claim inside this packet so no two documents disagree |
| REQ-006 | Re-derive the corpus hashes and the coverage count after the final run, to prove nothing moved during it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every gate has a final-state number beside its command. Matches AC-001.
- **SC-002**: Every folder in the packet reports a passing validation result with rule lines present. Matches AC-002.
- **SC-003**: The predecessor's roadmap entry and finding 10 both carry closing evidence. Matches AC-004.
- **SC-004**: No two documents in the packet claim different completion states. Matches AC-005.
- **SC-005**: The corpus hashes and the coverage count are unchanged across the final run. Matches AC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled validation orchestrator | A stale build makes the validator refuse and emit nothing | Rebuild first, then require a passing result rather than an absent failure |
| Dependency | Packet 052 documents | Another agent may be editing them | Re-read immediately before the edit and record what was there |
| Risk | A gate is re-run from a state that has since moved | High | Every gate runs in one pass at the end, and the hashes are re-derived afterwards |
| Risk | The packet closes with documents that disagree | Medium | The reconciliation is a requirement with its own criterion rather than a habit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full final-state pass completes in one session, or it is split with each part naming the state it ran against.
- **NFR-P02**: Recommendation latency at the final weight is recorded beside the figure phase 001 captured.

### Security
- **NFR-S01**: Closeout reads the runtime and writes only inside this packet and the two named predecessor documents.

### Reliability
- **NFR-R01**: Validation is invoked through a resolved real path, because the spec scripts can silently do nothing when reached through a symlink.
- **NFR-R02**: A phase parent's validation output continues past the folder asked about, so the first result line is the one that describes it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a gate that returns no rows, which is treated as a failed run rather than as a pass.
- Maximum length: the recursive validation across six folders, whose output is read per folder rather than at its tail.
- Invalid format: a metadata pair whose fingerprint no longer matches its documents, which fails integrity and is regenerated rather than edited by hand.

### Error Scenarios
- External service failure: the embedding backend is down during the final run, which makes the numbers unrepresentative and postpones the closeout.
- Network timeout: a long gate, which is re-run rather than partially recorded.
- Concurrent access: another agent edits packet 052 mid-closeout, which the immediate re-read catches.

### State Transitions
- Partial completion: a closeout interrupted after some gates, which restarts rather than resumes, because a final state has to be one state.
- Session expiry: a daemon restart between gates, which invalidates the pass and forces a rerun.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five files, roughly 140 lines, mostly documents |
| Risk | 6/25 | No runtime change, but a wrong closeout certifies a broken packet |
| Research | 8/20 | Reconciling two packets and one register |
| **Total** | **22/70** | **Level 2** |

`recommend-level.sh --loc 140 --files 6` returns level 1 at score 25. This phase is authored at
level 2 because it closes against acceptance criteria.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the running weight and the committed default agree at closeout. The reconciliation answers it, and a disagreement is recorded rather than quietly fixed.
- Whether packet 052 phase 004 has moved on the legacy duplicate entries by the time this closes. The register edit names the current state rather than assuming one.
<!-- /ANCHOR:questions -->

---
