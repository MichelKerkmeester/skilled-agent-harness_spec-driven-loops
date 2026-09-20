---
title: "Feature Specification: Phase 5: Integration and Lifecycle Contract"
description: "A rule that exists but is not wired never loads. This phase contracts the three wiring points a rule needs to be reachable, and closes the gap phases 3 and 4 both recorded: what revising and retiring a rule actually do to the router rows, the governed pointer and the version field."
trigger_phrases:
  - "agents md integration"
  - "wiring contract"
  - "router rows"
  - "retire a rule"
  - "revise a rule"
  - "rule lifecycle"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: Integration and Lifecycle Contract

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
| **Phase** | 5 of 7 |
| **Predecessor** | 004-creation-standards-and-guardrails |
| **Successor** | 006-command-and-hub-wiring |
| **Handoff Criteria** | The contract reproduces the wiring phase 1 performed by hand, and retire leaves nothing dangling |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the create-repo-rule packet, and it closes a gap two earlier phases
both recorded rather than solved.

**Scope Boundary**: one reference document contracting create, revise and retire wiring.
It changes no `AGENTS.md` and no router - it states what the mode does to them.

**Dependencies**:
- Phase 1 performed all of this by hand across six phases; it is the worked example.
- Phase 3 named revise and retire as routes with deferred mechanics. This is where they land.

**Deliverables**:
- `references/agents-md-integration.md` in the mode packet.
- Reference-router and `SKILL.md` hooks so it loads at the wiring step.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A rule file that nothing points at is inert: the router's trigger table is the only thing that loads one, and the pointer from the governed `AGENTS.md` section is the only thing that makes it findable at the moment of need. Phase 1 wired eight rules by hand and the cost showed - the router's scope statement had to be widened twice, once for delegation posture and once for delivery, each time because a trigger row pointed at a rule the same document said was out of scope. Meanwhile the reverse operation has never been performed at all. Phases 3 and 4 both name revise and retire as routes the mode owns and both defer the mechanics, so nobody has said what a removal does to two router rows, a governed-section pointer, and a `version` field.

### Purpose
Contract all three operations, so wiring a rule is reproducible and unwiring one leaves nothing behind.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The three wiring points**: the router trigger row, the router index row, and the pointer from the `AGENTS.md` section the rule governs - with what is lost by skipping each.
- **The scope-statement check**: before adding a trigger row, confirm the router's In/Out statement admits the rule. Phase 1 hit this twice.
- **The create path**: order of operations, and why the rule file is written before the rows that point at it.
- **The revise path**: when a change alters the firing condition the trigger row changes too, and the `version` field moves.
- **The retire path**: file, both rows, the pointer, and a recorded reason - in an order that never leaves a row pointing at a missing file.
- **The `AGENTS.md` boundary**: a pointer is mechanical, anything else is an operator decision.

### Out of Scope
- **Editing any real `AGENTS.md` or router** - this phase writes a contract.
- **Automating the operator approval** - the always-loaded document carries hard blockers, and a mode cannot grant itself permission to touch them.
- **Hub and command registration** - phase 6.
- **A validator for dangling rows** - enforcement stays excluded, consistent with every prior phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../sk-create-repo-rule/references/agents-md-integration.md` | Create | The wiring and lifecycle contract |
| `.../sk-create-repo-rule/references/README.md` | Modify | Route to it |
| `.../sk-create-repo-rule/SKILL.md` | Modify | Load it at the wiring step; replace the deferral notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | All three wiring points are named, each with what is lost when it is skipped. |
| REQ-002 | The create path reproduces what phase 1 did by hand for eight rules. |
| REQ-003 | The retire path leaves no dangling router row and no orphan pointer, and its ordering makes a half-finished removal safe. |
| REQ-004 | The scope-statement check runs before a trigger row is added, because phase 1 hit that failure twice. |
| REQ-005 | No path edits `AGENTS.md` beyond adding or removing a pointer without recorded operator approval. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The revise path says when a change forces the trigger row to change with it. |
| REQ-007 | The `version` field's behaviour is stated for all three paths. |
| REQ-008 | A retirement records why, so the same rule is not re-proposed. |
| REQ-009 | The contract states what a repository with no router requires first, consistent with the prerequisite framing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Following the create path on a shipped rule reproduces its actual wiring.
- **SC-002**: Following the retire path on a shipped rule leaves the router self-consistent - row counts equal file counts, every link resolving.
- **SC-003**: The scope-statement check would have caught both phase-1 widenings before they became contradictions.
- **SC-004**: An interrupted retirement leaves the set in a state the next session can finish or reverse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The retire path is written from imagination, since nobody has retired a rule | High - it is the one operation with no worked example | Derive it as the inverse of the create path, then dry-run it against a shipped rule and check the router stays self-consistent |
| Risk | An ordering that leaves a row pointing at a deleted file | High - a dangling row looks like coverage | REQ-003 fixes the order: rows and pointer first, file last |
| Risk | The contract implies the mode may edit `AGENTS.md` freely | High - hard blockers live there | REQ-005 bounds it to the pointer; anything else escalates |
| Risk | Duplicating the router's own scope statement, so the two drift | Med | Reference it; do not copy it |
| Dependency | Phase 1's hand-wiring across eight rules | The only worked example of the create path | Complete and inspectable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reproducibility
- **NFR-R01**: The create path is followable without reading phase 1.
- **NFR-R02**: The retire path is the create path inverted, in reverse order, so one document teaches both.

### Safety
- **NFR-S01**: Every path is interruptible at a step boundary without leaving a dangling reference.
- **NFR-S02**: No path can touch a hard blocker.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Wiring Boundaries
- **No section of `AGENTS.md` governs the rule**: it probably failed decision test 4, which requires an anchor. Back to the tests.
- **Two sections govern it**: both get pointers, each naming the aspect it governs.
- **The scope statement excludes it**: stop. Either the rule is out of bounds or the boundary needs an operator decision — the mode does not widen it unilaterally.

### Lifecycle Boundaries
- **Revising a rule so it fires differently**: the trigger row changes in the same edit, or the router now lies.
- **Retiring a rule another rule cross-references**: the referencing rule is updated first, since the corpus averages under one sideways link per file and this is rare by construction.
- **Retiring the last rule**: the router stays, empty tables and all. Removing it is a separate decision about the repository, not about a rule.

### Interruption Boundaries
- **Interrupted create**: rows exist, file does not — the only genuinely broken state, which is why the file is written first.
- **Interrupted retire**: rows gone, file remains — inert but harmless, and the next session finishes or reverses it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One reference document plus two hooks |
| Risk | 12/25 | Contracts the only operation that touches `AGENTS.md`, and one path has no precedent |
| Research | 9/20 | Phase 1's wiring read across eight rules and two scope widenings |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should retirement archive the rule rather than delete it? **Leaning delete: git holds the history, and an archive directory becomes a place rules go to be ignored. Record the decision either way.**
- Does bumping `version` on revision follow a scheme, or is any increment fine? **UNKNOWN. The eight shipped rules are all at 1.0.0.0, so the corpus offers no evidence. Pick the cheapest defensible rule and record that it was a choice, not a finding.**
<!-- /ANCHOR:questions -->

---
