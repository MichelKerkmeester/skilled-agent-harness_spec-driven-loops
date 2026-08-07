---
title: "Feature Specification: Packet Metadata Regeneration"
description: "Close the stale phase map, stale continuity blocks, planned derived status and missing source fingerprints as the single defect they are — the close-time metadata generator was never run — and do it only after the regression is dispositioned."
trigger_phrases:
  - "stale phase documentation map"
  - "continuity completion_pct zero"
  - "generated metadata integrity failure"
  - "run generate-context at close"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/016-packet-metadata-regeneration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Regenerated packet metadata; fixed phase map"
    next_safe_action: "Proceed to phase 017"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/016-packet-metadata-regeneration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frontmatter memory-block errors were the narrative-overflow cause fixed by phase 015, independent of the missing generator pass"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Packet Metadata Regeneration

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Four findings were reported separately by three audit legs, and spread across three recommendations in the synthesis, as though they were four problems. They are one.

The parent's phase map lists all twelve children as Planned while all twelve are Complete. Continuity blocks across roughly ten of twelve children carry a completion percentage of zero against a Status of Complete. The parent's derived status reads planned with a null pointer to the last active child. And a generated-metadata integrity check fails across all thirteen folders because source fingerprints are absent everywhere.

The common cause is that the close-time metadata generator was never run when the program closed. One generator pass over the packet addresses all four. Treating them as four independent fixes multiplies the work and, worse, invites four partial hand-edits that drift apart again.

The reason this phase sits fourth rather than first is sequencing, not size. Flipping twelve status rows to Complete and setting completion to 100 percent while the regression from phase 013 is still open would take a visible inconsistency — a packet that looks unfinished because it is — and convert it into an invisible one: a packet that looks finished over an unresolved defect. Status reconciliation follows measurement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — running the close-time metadata generator across the packet and its children; verifying it resolves the phase map, continuity blocks, derived status and source fingerprints together; diagnosing the frontmatter memory-block errors on the five affected children, which may be a separate cause; and confirming the generated-metadata integrity check passes afterwards.

Out of scope — the regression (phase 013); the ratchet and CI (phase 014); checklist evidence and completion-claim honesty (phase 015), which decides *whether* Complete is the truthful value this phase then propagates; documentation path corrections (phase 017).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The four symptoms are fixed by one generator pass, not by hand-editing four surfaces | The phase map, continuity blocks, derived status and source fingerprints are all corrected by running the packet's own metadata generator. Any residue the generator cannot fix is listed explicitly as a separate defect rather than quietly hand-patched |
| REQ-002 | Propagated status values match what phase 015 established as true | The Status and completion values this phase writes are the ones phase 015 reconciled. If 015 withdrew the completion claim, this phase propagates the withdrawn state, not Complete |
| REQ-003 | The generated-metadata integrity check passes across every folder | Source fingerprints are present and current for all thirteen folders, and the integrity check reports no failures |
| REQ-004 | The frontmatter memory-block errors are diagnosed rather than assumed | The five affected children are examined and their errors attributed to a cause. If that cause is the missing generator pass, the pass resolves them; if not, the real cause is recorded and fixed or explicitly deferred |
| REQ-005 | The phase map distinguishes planning state from execution state, or is simply correct | Either the map's Status column reflects execution truth, or it is split so that planning-time and execution-time states are separately legible. What is not acceptable is a single column that silently means one thing in some rows and another elsewhere |
| REQ-006 | Regeneration does not overwrite authored content | A diff review confirms the generator changed only derived and metadata fields, leaving authored prose, requirements and evidence intact. Any authored content the generator would rewrite is protected before the pass runs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

One generator pass resolves the phase map, continuity blocks, derived status and fingerprints together; propagated status matches phase 015's reconciled truth; the integrity check passes across all thirteen folders; the frontmatter errors are attributed to a cause and fixed or deferred with reasons; the phase map is unambiguous about what its status column means; and a diff review confirms no authored content was overwritten.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | **Running this phase early would hide an open regression behind a green packet.** Setting twelve rows to Complete and completion to 100 percent while phase 013 is unresolved upgrades a visible inconsistency into an invisible one | Sequenced strictly after 013 and 015, stated as a blocker in this phase's own continuity so the dependency survives a context loss |
| Risk | The generator overwrites authored prose alongside derived fields | REQ-006 requires a diff review before the pass is accepted; the packet is committed beforehand so any overwrite is recoverable |
| Risk | Regenerating metadata makes the packet appear freshly closed, obscuring that its close was defective | The remediation phases remain in the packet as durable record; the phase map gains rows for them rather than being reset |
| Dependency | Phase 013 | Status must not be reconciled before the regression is dispositioned |
| Dependency | Phase 015 | 015 decides whether Complete is truthful; this phase only propagates that decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved: the frontmatter memory-block errors were independent of the missing-generator cause. They were narrative `recent_action`/`next_safe_action` fields over the 96-char compact limit on five children (004/007/008/009/012), diagnosed and fixed in phase 015. The generator pass here does not touch those authored fields; it confirms they no longer error and clears the separate source-fingerprint group.
<!-- /ANCHOR:questions -->
