---
title: "Feature Specification: Phase 7: wording-standard-restructure"
description: "Restructure the wording standard as a base plus a supplement rather than two halves, then land its six candidates without breaking the document consumers."
trigger_phrases:
  - "wording standard restructure"
  - "base plus supplement"
  - "hand maintained exclusion"
  - "voice half delegation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: wording-standard-restructure

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
| **Phase** | 7 of 9 |
| **Predecessor** | 006-reply-shape-rules |
| **Successor** | 009-adjacent-surface-rules |
| **Handoff Criteria** | Document consumers still resolve, the hand-maintained exclusion list is exactly one row shorter, and both reply-facing candidates reach a reply |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-communication clarity program.

**Scope Boundary**: The wording standard's structure, and the six candidates assigned to it. The
skill that points at the standard is phase 4's. The reply-shape rule that delegates its voice half
is phase 6's.

**Dependencies**:
- Phase 2's decision on the standard's shape, which the research already answered but the operator has not ratified.
- Phase 6, because two of the six candidates are reply-facing and reach a reply only through the reply-shape rule's voice-half delegation.

**Deliverables**:
- The standard restructured as a base plus a supplement, with the base being what a reply loads.
- Six candidates landed, four on the base and two on the supplement or the base as their scope dictates.
- Exactly one hand-maintained exclusion removed, the scoring bands, with the other kept and its reason restated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The standard is written for documents. It carries a pre-publish checklist, a hundred-point score and
a publish threshold, and the projection consumes it for live replies by excluding two of its
sections by hand. A split into a document half and a reply half does not fix that. The research
established why: the voice-personality exclusion exists because a projection carries someone else's
message, which is a reason about ownership rather than about documentness, so that exclusion follows
the voice directives into whichever half a reply loads and gains a row, because the same section
also carries penalty machinery a reply never runs. Only the scoring bands genuinely disappear. The
section boundaries also do not match the document-versus-reply line, since the structural-patterns
section contains a reply-scoped subsection and the checklist's voice block depends on the section a
reply needs.

### Purpose

Give the standard a shape where a reply loads a proper subset and a document loads the subset plus
the publish machinery, so the reply consumer stops maintaining an exclusion list by hand for
anything the structure can express.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure as base plus supplement. The base is what a reply loads. The supplement is the publish machinery.
- Move the scoring bands and the attention-share table into the supplement, following the precedent that already routed the arithmetic out.
- Keep the voice-personality exclusion, and restate its reason as ownership rather than documentness so a later reader does not try to remove it structurally again.
- Land the six candidates: the borrowability test, the nominalization and stacked-compression pair, the plain-word test, literal over figurative, the document scan test, and the worked exemplar.
- Resolve the reply-scoped subsection that currently sits inside a document-structure section.

### Out of Scope
- The skill's pointer, which is phase 4's and needs no change if the base keeps the standard's name.
- The document consumers' own documents, which only read the standard.
- Rewriting the word lists or the metaphor tables, which no candidate touches.
- Any change to the scoring arithmetic itself, which already lives in its own file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Modify | Becomes the base; the publish machinery leaves |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/[supplement].md` | Create | The publish machinery a document adds |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modify | The scope gate, updated for the new shape |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | Modify | The mode's own routing to base and supplement |
| `repo-rules/communication.md` | Modify | Only the pointer sentence, if the base's name changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every existing consumer of the standard still resolves to the content it needs, checked by opening each one rather than by assuming the pointer holds |
| REQ-002 | The hand-maintained exclusion list is exactly one row shorter, and the surviving row states ownership as its reason |
| REQ-003 | A reply loads a proper subset: nothing a reply loads mentions a file, a score or a publish threshold |
| REQ-004 | The reply-scoped subsection currently inside a document-structure section reaches a reply after the restructure |
| REQ-005 | Each of the six candidates names the failure it prevents |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The document scan test and the worked exemplar land on the supplement, because both are document-shaped, unless phase 2 decided otherwise |
| REQ-007 | The base names the supplement, so a document author cannot load half the standard without noticing |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every consumer opened and confirmed to resolve, with the reply consumers reaching the base and the document consumers reaching both.
- **SC-002**: The exclusion list has exactly one row, down from two.
- **SC-003**: A search of the base for file, score and publish-threshold language returns nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2's ratification of the base-plus-supplement shape | The restructure could be the wrong shape | This phase does not open until the decision is recorded |
| Dependency | Phase 6's voice-half delegation | Two reply-facing candidates would load for documents and not for replies | Sequence after phase 6, and check both surfaces together |
| Risk | A document consumer silently loses content | Documents are the standard's original consumer and the regression would be invisible | REQ-001 requires opening each consumer, not trusting the pointer |
| Risk | The split is attempted along section boundaries | The boundaries do not match the line, so content lands in the wrong half | The research established this; the split follows the reply-versus-publish line, not the section numbers |
| Risk | Someone later removes the surviving exclusion structurally | A projection starts adding reactions the original never held, which is a fidelity failure | REQ-002 requires the reason be restated as ownership in the file itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The base is smaller than the current single file, since a reply loads less than a document.
- **NFR-P02**: A document author loads base plus supplement in one routing step, not two decisions.

### Security
- **NFR-S01**: No credential or private identifier enters either file.
- **NFR-S02**: The scope gate keeps naming the spans a rewrite may never touch: a quotation, an error string, a command, a path, an identifier.

### Reliability
- **NFR-R01**: Both files are reachable from the mode's own router, verified by opening what it names.
- **NFR-R02**: The base names the supplement, so neither can be loaded in ignorance of the other.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a section that turns out to belong to neither half is recorded as such rather than forced into one.
- Maximum length: if the base still exceeds what a reply should load, the overflow is recorded as a finding rather than silently kept.
- Invalid format: a file missing the standard's own shape fails the mode's gate before any consumer is repointed.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: the standard is shared with the documentation skill, so this phase must not run while that skill's own packets are editing it.

### State Transitions
- Partial completion: the base and the supplement land together, because a half-moved section leaves both consumers wrong.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | A shared standard with two consumer families and several dependent documents |
| Risk | 18/25 | The document consumers are the original users and a regression there is invisible from the reply side |
| Research | 6/20 | The shape question is answered; the section-by-section placement is not |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the base keep the current filename, which avoids repointing every consumer, or does the supplement keep it because documents were the original audience?
- Should the penalty machinery inside the voice section move to the supplement, which would shrink the surviving exclusion to a single sentence rather than a section?
<!-- /ANCHOR:questions -->

---

