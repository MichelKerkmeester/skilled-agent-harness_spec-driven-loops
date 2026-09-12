---
title: "Feature Specification: Phase 9: adjacent-surface-rules"
description: "Land the two candidates that belong to surfaces outside the communication stack: the code-comment checklist and the repo-rule template."
trigger_phrases:
  - "adjacent surface rules"
  - "comment present state"
  - "rule file example and repair"
  - "no archaeology in comments"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: adjacent-surface-rules

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 007-wording-standard-restructure |
| **Successor** | 005-verification-and-rollout |
| **Handoff Criteria** | Each owning skill's own gate passes, and no communication rule text leaked into either surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the sk-communication clarity program.

**Scope Boundary**: Two candidates on two surfaces that belong to other skills. This phase touches
no communication rule and no wording standard. It is last among the content phases because both
surfaces are owned elsewhere and a change here should follow the decisions rather than lead them.

**Dependencies**:
- Phase 2's decision record, which is the only authority for adopting either candidate.
- Nothing else. Neither surface is touched by any other phase in this program.

**Deliverables**:
- The code-comment candidate landed in the code skill's quality checklist: comments describe present behaviour, not the history of abandoned approaches.
- The rule-file shape candidate landed in the repo-rule authoring template: a rule shows an example and its repair, not only the habit it names.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two adopted candidates have owners outside this program's usual surfaces. The first is about code
comments, and the existing hard blocker there bans ephemeral labels and keeps the durable reason,
but nothing says a comment should describe present behaviour rather than narrate the path that was
abandoned. The second is about how a rule is written: the style source's own README argues that a
concrete rule with an example and a repair is followed far better than a stated preference, and the
repo-rule files use rule plus prevented failure plus self-check without the example-and-repair
ingredient. Both are small. Both would be distorted if forced onto a communication surface, because
neither is about how a reply reads.

### Purpose

Put each candidate where its own skill's gate will check it, and leave the communication stack
untouched by either.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The present-state comment rule, in the code skill's quality checklist where comment hygiene is already checked per file.
- The example-and-repair shape, in the template that repo-rule files are authored from.
- Verification through each owning skill's own gate rather than this program's.

### Out of Scope
- The existing comment-hygiene hard blocker, which is unchanged and outranks anything added here.
- Rewriting existing rule files into the new shape, which is a separate migration nobody has asked for.
- Any communication rule or the wording standard.
- The visual aesthetics guidance the style source pairs with its comment rule, which was not verified against the code skill's existing checklist during research and is therefore not adopted.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/**/code-quality-checklist/*.md` | Modify | The present-state comment rule, in the existing comment section |
| `.opencode/skills/sk-doc/**/sk-create-repo-rule/**` | Modify | The example-and-repair ingredient in the rule template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both candidates trace to adopted rows in phase 2's decision record, and neither is adopted on this phase's own judgment |
| REQ-002 | The comment rule does not weaken or restate the existing comment-hygiene hard blocker, and says which one wins if they appear to collide |
| REQ-003 | Each change passes the gate of the skill that owns the surface, not this program's validation |
| REQ-004 | No communication rule text, and no wording-standard text, is copied into either surface |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The template change is additive, so existing rule files stay valid against it without a migration |
| REQ-006 | The exact checklist file is confirmed by reading the code skill's own routing rather than assumed from the path pattern above |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two candidates landed, each on the surface its owning skill routes to, confirmed by reading that routing.
- **SC-002**: Each owning skill's gate passes from the final state, output and exit status read.
- **SC-003**: Existing rule files still validate against the changed template with no edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2's decision record | Neither candidate is authorised without it | The phase does not open until both rows are adopted or rejected |
| Dependency | The code skill's own routing | The checklist path above is a pattern, not a confirmed file | REQ-006 requires reading the routing before editing |
| Risk | The comment rule reads as softening the existing hard blocker | A hard block appears negotiable, which is the worst possible outcome | REQ-002 requires naming which wins, and the hard blocker always does |
| Risk | The template change invalidates existing rule files | A migration nobody asked for lands as a side effect | REQ-005 makes the change additive and SC-003 checks it |
| Risk | These two small items get folded into a larger phase for convenience | They are validated by other skills' gates, which a communication phase would not run | They stay their own phase for exactly that reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Neither surface grows enough to change what a reader loads for an ordinary task.
- **NFR-P02**: The template change adds an optional ingredient, not a required section.

### Security
- **NFR-S01**: No credential or private identifier enters either surface.
- **NFR-S02**: Nothing added here relaxes the comment-hygiene hard blocker or any verification standard.

### Reliability
- **NFR-R01**: Each surface stays reachable through its own skill's router, unchanged by this phase.
- **NFR-R02**: The template stays backward compatible with every rule file already written from it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: if phase 2 rejected either candidate, this phase lands only the other and records the rejection.
- Maximum length: neither addition is long enough to hit a ceiling; if the checklist section is at one, the rule replaces a weaker line rather than appending.
- Invalid format: an addition outside the host surface's shape fails that skill's gate before it lands.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: both surfaces belong to other skills, so this phase must not run while those skills' own packets are editing them.

### State Transitions
- Partial completion: the two changes are independent, so either can land alone.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two additions on two surfaces |
| Risk | 10/25 | One sits beside a hard blocker, the other is a template every future rule reads |
| Research | 6/20 | One path is unconfirmed and must be resolved by reading the owning skill's routing |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which file in the code skill's quality checklist actually owns comment guidance, since the research deferred that verification for read budget?
- Does the template change need a companion note in the rule router, so a future author sees the new ingredient without opening the template?
<!-- /ANCHOR:questions -->

---

