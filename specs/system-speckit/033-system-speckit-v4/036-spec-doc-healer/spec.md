---
title: "Feature Specification: A healer that restores what a document lost, and refuses what it cannot prove"
description: "323 spec documents carried an empty required frontmatter field. The value they lost is defined literally by their template, so it can be recovered rather than invented. A healer restores exactly that class and refuses everything it cannot justify from evidence in the document itself."
trigger_phrases:
  - "spec doc healer"
  - "restore template default"
  - "empty trigger phrases"
  - "auto heal validation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: A healer that restores what a document lost, and refuses what it cannot prove

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "We want 0 failures", then "Automatically healed ideally" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

323 spec documents across 137 packets carried a required frontmatter field with no value, almost always `trigger_phrases` written as an empty inline list. That fails validation, and it also empties the retrieval index, since trigger phrases are how a packet is found. Nothing cleared it, because the existing repair tool correctly refuses to author content and this looked like content. It is not: every one of those fields has a literal default defined by the document's own template, so the lost value is recoverable rather than inventable. The distinction had never been drawn, so the whole class sat untouched.

### Purpose

The documents that lost a scaffold value get it back, and every document whose correct value cannot be proven from evidence is left alone with the reason stated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A healer that restores an empty required frontmatter field from the literal default its template defines
- A healer that writes a missing template-source header only when the document's own anchors already match that template's anchor set
- A dry run that doubles as the census, so the measurement and the fix come from one tool
- Applying it across every track, and chaining the metadata re-derive the heal invalidates

### Out of Scope
- **Authoring anything.** A document with no frontmatter block has nothing to restore into, and one without anchors cannot be shown to follow a template. Both are reported and left
- **Fields without a literal template default.** A title or description is written for one packet and cannot be recovered from a shared scaffold
- **The remaining validation failures.** What survives the heal needs a person, and this packet does not pretend otherwise

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/spec/heal-spec-docs.cjs` | Create | The healer |
| `specs/**/{spec,plan,tasks,implementation-summary}.md` | Modify | 326 documents restored |
| `specs/**/graph-metadata.json` | Modify | 148 packets re-derived, because healing changes what the fingerprint attests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A field is restored only from a literal default defined by that document class's template |
| REQ-002 | A template-source header is written only when the document's anchors match that template's anchor set |
| REQ-003 | Every refusal states which evidence was missing, rather than failing silently or guessing |
| REQ-004 | A dry run writes nothing and reports what it would do |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Both empty-list spellings are detected, the bare key and the inline `[]` |
| REQ-006 | The heal is followed by a metadata re-derive, since healing invalidates the fingerprint |
| REQ-007 | The effect is measured before and after on the same packets, not asserted |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dry run's prediction matches what the apply actually writes
- **SC-002**: A packet that failed only on this class validates clean afterwards
- **SC-003**: A document the healer refuses is unchanged, and its reason names the missing evidence
- **SC-004**: A before-and-after over the same tracks shows the failure count moving
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A healer that guesses poisons the retrieval index it is meant to fix | High | It writes only values defined literally by a template, and only into fields that are present and empty. Anything else is refused by name |
| Risk | Naming a template the document does not follow | High | The anchor set is the evidence. A document missing any of the template's anchors is refused, and the message lists which |
| Risk | 326 files written at once | Med | Dry run first, its prediction checked against the outcome, and every write is a tracked file so `git checkout -- specs` undoes the run |
| Risk | The heal leaves packets failing a different rule | Med | Healing changes what the fingerprint attests, so the metadata re-derive is part of the procedure rather than a follow-up someone might forget |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The census reads documents only and completes in one pass over the corpus

### Security
- **NFR-S01**: No credential, network or permission surface is touched

### Reliability
- **NFR-R01**: Dry run is the default. Writing requires an explicit flag
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An empty inline `[]`: the form the scaffold actually leaves behind, and the one an earlier version of the check missed entirely
- A field absent rather than empty: a different problem, deliberately not healed
- A populated field: never touched, because the check requires the value to be empty

### Error Scenarios
- No frontmatter block: refused, since there is nothing to restore into
- Anchors do not match any template: refused, with the missing anchors listed
- A document class with no known signature: skipped rather than guessed at

### State Transitions
- A healed document invalidates its own metadata fingerprint, so the packet trades one error for another until the re-derive runs. That is why the two tools chain
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One new tool, 466 files written across 137 packets |
| Risk | 12/25 | Wide write into authored documents, fully reversible, no runtime path |
| Research | 10/20 | The measurement was wrong three times before the right question was asked |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The remaining failures need documents written by hand. Whether that is worth doing for packets already shipped is an operator decision, not a tooling one.
<!-- /ANCHOR:questions -->

---
