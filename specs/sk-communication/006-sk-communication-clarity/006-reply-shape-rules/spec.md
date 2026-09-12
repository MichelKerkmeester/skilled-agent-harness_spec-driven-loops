---
title: "Feature Specification: Phase 6: reply-shape-rules"
description: "Write the ten reply-shape candidates into the split communication rule, each naming the failure it prevents."
trigger_phrases:
  - "reply shape rules"
  - "first line contract"
  - "concise not compressed"
  - "tangent suppression"
  - "sentence relation rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: reply-shape-rules

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 003-root-doc-and-repo-rules |
| **Successor** | 008-decision-and-handoff-rules |
| **Handoff Criteria** | Every added rule names its prevented failure and no mark carries two instructions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-communication clarity program.

**Scope Boundary**: The ten candidates the research assigned to the reply-shape rule, and nothing
else. The split that makes room for them belongs to phase 3. The other rule files belong to phase 8.

**Dependencies**:
- Phase 2's decisions, which settle the colon question before any punctuation guidance is touched.
- Phase 3's split, which is a hard prerequisite. The rule is at its stated length ceiling, so
  adding ten candidates before the split pushes it past the size that made the earlier split necessary.

**Deliverables**:
- Ten rules written into the correct half of the split reply-shape rule.
- A prevented failure named in the rule text for each one, specific enough to argue with.
- No new instruction for any punctuation mark that another file already governs.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Ten adopted candidates belong to the rule that governs how a reply reads. It is the single largest
allocation in the program and it lands on the file with the broadest trigger in the set. Three of
the ten govern relations the current rule does not reach: the link between two sentences, the
progression from one paragraph to the next, and the first line's obligation to carry payload rather
than a label. One of the ten is a counterweight rather than a constraint, because every rule
currently in the file pushes toward brevity and none protects the connective tissue brevity removes.

### Purpose

Land the ten candidates in the split rule so a reader who follows it produces a reply that can be
acted on after one pass, without the rule set growing past what a reader can hold.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Say the relation between two sentences rather than implying it through adjacency.
- Make each paragraph answer the previous one's question or raise the next one's.
- First line carries the answer, never a label, a fragment or a setup.
- Name the moving parts when explaining a mechanism.
- Concise is not compressed: brevity may not delete a step the reader needs to climb.
- Number multi-step work, one bounded action per step.
- First and last line together must convey what happened and what to do next.
- Cap the visible item count without dropping anything relevant from the analysis.
- Finish the first issue, then offer the second once, at the end.
- State why each rule exists, not only what it forbids.

### Out of Scope
- The split itself, which is phase 3's deliverable and this phase's prerequisite.
- Any punctuation instruction, since the colon decision is phase 2's and the em-dash rule is untouched here.
- The other rule files, which are phase 8's.
- The wording standard, which is phase 7's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/communication.md` | Modify | The reply-shape half, after phase 3 splits it |
| `repo-rules/[split-sibling].md` | Modify | The sentence-mechanics half, for the candidates that belong there |
| `REPO RULES.md` | Modify | Only if a trigger phrase changes; the rows themselves are phase 3's |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the ten candidates appears in exactly one of the two split halves, chosen by whether it governs a sentence or a whole reply |
| REQ-002 | Each added rule names the specific failure it prevents, in the rule text rather than only in the decision record |
| REQ-003 | No added rule gives an instruction for a punctuation mark or construction that another file already governs |
| REQ-004 | The concise-is-not-compressed rule is written as a limit on the brevity rules, and the brevity rules point at it, so a reader cannot apply one without seeing the other |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each half stays within the readable ceiling the original file recorded, measured the same way |
| REQ-006 | The first-line rule states the positive test as well as the bans, because the current rule bans openers without saying what the first line must do |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten candidates, ten rules, each traceable to its row in the allocation table.
- **SC-002**: A contradiction scan across the rule set returns one instruction per mark, unchanged from the phase 3 baseline.
- **SC-003**: Each half's size is at or under the recorded ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3's split | Ten candidates would push the file past the size that forced the first split | This phase does not open until the split lands and validates |
| Dependency | Phase 2's colon decision | A punctuation edit here could contradict a decision not yet made | No punctuation instruction is in scope |
| Risk | Ten rules at once exceeds what a reader holds | The rules stop being followed, the failure the sources describe | Each rule earns its place by naming a failure; a rule that cannot is dropped and recorded |
| Risk | The counterweight rule is read as licence to pad | Replies get longer with no gain | It is written as a limit on the brevity rules and cross-referenced from them |
| Risk | A candidate lands in the wrong half | The rule loads on the wrong trigger | REQ-001 assigns by governed unit, sentence or reply, and the assignment is checked against the trigger table |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each half loads in one pass, which is the constraint that forced the original split.
- **NFR-P02**: The pair together does not increase total resident rule text by more than the ten rules require.

### Security
- **NFR-S01**: No credential, private path or identifier enters a rule file.
- **NFR-S02**: No rule here relaxes a hard blocker or a verification standard.

### Reliability
- **NFR-R01**: Both halves are reachable through the router, verified in both directions.
- **NFR-R02**: A rule's trigger names an action or an about-to-write moment, never a topic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a candidate that cannot name a failure is dropped, and the drop is recorded rather than silent.
- Maximum length: a half that would exceed its ceiling splits again rather than absorbing the overflow.
- Invalid format: a rule written without the file's standard shape fails the file's own gate before the router is touched.

### Error Scenarios
- External service failure: not applicable, no dispatch runs here.
- Network timeout: not applicable.
- Concurrent access: this phase holds the rule files, so no sibling phase may edit them simultaneously.

### State Transitions
- Partial completion: rules land one at a time and each is independently valid, so a stopped session leaves a consistent file.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two rule files, ten rules, prose is the product |
| Risk | 12/25 | Broadest trigger in the set, so a bad rule is felt on every reply |
| Research | 4/20 | The investigation is complete; this is execution |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the first-line rule's positive test belong in the reply-shape half or with the decision-shape rule that already governs verdict placement?
- Should the rationale layer be a per-rule sentence or one section explaining the set, given that per-rule rationale is what grew the original file past its ceiling?
<!-- /ANCHOR:questions -->

---

