---
title: "Feature Specification: Phase 4: Creation Standards and Guardrails"
description: "Phase 3 proved a generated rule can be structurally correct and thin. Structure is checkable and quality is not, so this phase writes the bar that decides whether a well-formed rule is worth loading — what a section must earn, what a trigger phrase must do, and the failures that produce a rule nobody obeys."
trigger_phrases:
  - "creation standards"
  - "rule quality bar"
  - "dos and donts"
  - "worth loading"
  - "well-formed but thin"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: Creation Standards and Guardrails

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
| **Phase** | 4 of 7 |
| **Predecessor** | 003-skill-scaffold-and-template |
| **Successor** | 005-agents-md-integration |
| **Handoff Criteria** | Every standard names the failure it prevents, and the thin sample from phase 3 fails the bar |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the create-repo-rule packet.

**Scope Boundary**: one reference document inside the mode packet, plus the `SKILL.md`
hook that loads it. No template change unless a standard proves the template permits
something it should not.

**Dependencies**:
- Phase 3's structural floor. Standards sit above it and do not restate it.
- The eight shipped rules as worked examples of the bar being met.

**Deliverables**:
- `references/creation-standards.md` in the mode packet.
- A `SKILL.md` loading hook so the standards reach the authoring step.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 3 generated a rule that passed all eleven structural assertions and is thin: two sections, one obligation, nothing a reader would change their behaviour over. That is the honest limit of a structural contract - it can guarantee a file is shaped like a rule and cannot guarantee anyone should load it. The shipped corpus meets a higher bar, and that bar is currently invisible: every section names a failure it prevents, every trigger phrase is a symptom someone would actually type, and every rule says what it is *not* when it could be misread. None of that is written down, so a generated rule will only clear it if whoever fills the template already knows.

### Purpose
Write the bar the shipped set already meets, as standards a generator can apply and a reviewer can check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The section test**: what a numbered section must earn to exist - a named failure, not a topic.
- **The trigger-phrase test**: symptom vocabulary, no collision with another rule, and what makes a phrase useless.
- **The binding-sentence test**: one sentence, one obligation, no conjunction hiding a second rule.
- **The self-check test**: one item per obligation the body creates, not a summary of section titles.
- **Do's and don'ts**, each naming its failure, derived from what the corpus does and what it avoids.
- **The misreading guard**: when a rule needs a "what this is not" section, from the three shipped rules that added one after being misread.
- The `SKILL.md` hook that loads the standards at the authoring step.

### Out of Scope
- **Restating the structural floor** - phase 3 owns it, and duplication would put the two out of step.
- **The wiring contract** - phase 5.
- **An automated quality score** - the bar needs a reader; a checkable proxy would measure the proxy. Recorded as a deliberate exclusion.
- **Re-editing the phase-3 sample** - it is the fixture that proves the bar bites.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../sk-create-repo-rule/references/creation-standards.md` | Create | The quality bar |
| `.../sk-create-repo-rule/references/README.md` | Modify | Route to it |
| `.../sk-create-repo-rule/SKILL.md` | Modify | Load it at the authoring step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every standard names the failure it prevents. A standard that cannot is cut, by its own rule. |
| REQ-002 | Every standard is met by the eight shipped rules, checked rather than assumed. |
| REQ-003 | The standards are testable by a reader against a draft, without running anything. |
| REQ-004 | The phase-3 sample fails the bar, and the standards say which tests it fails. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Don'ts are stated as observed failures rather than style preferences. |
| REQ-006 | The document does not restate the structural floor. |
| REQ-007 | The misreading guard cites the shipped rules that needed one and why. |
| REQ-008 | The standards fit inside the length bands, since they are a reference the mode loads. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Applied to the eight shipped rules, every standard passes - the bar describes the corpus rather than an ideal above it.
- **SC-002**: Applied to the phase-3 sample, the standards fail it and name the tests.
- **SC-003**: A reviewer can judge a draft with this document alone.
- **SC-004**: No standard restates a structural assertion phase 3 already checks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The standards become style preferences with no failure behind them | High - it is the exact thing `AGENTS.md` forbids when citing a best practice | REQ-001 cuts any standard that cannot name its failure |
| Risk | The bar is set above the corpus, so the shipped rules fail their own standards | High - it would make the mode's output an outlier | REQ-002 checks all eight against every standard before the document closes |
| Risk | The bar is unfalsifiable, passing everything | Med | REQ-004 requires the thin sample to fail, which is what proves the bar bites |
| Risk | Restating structure because it is easy to write | Med - two sources for one rule | REQ-006, and a cross-check against phase 3's assertion list |
| Dependency | Phase 3's structural floor and its thin sample | The bar has nothing to sit above and nothing to fail | Both exist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Testability
- **NFR-T01**: Every standard is expressible as a question a reader answers yes or no.
- **NFR-T02**: Each standard cites at least one shipped rule that meets it.

### Restraint
- **NFR-R01**: The document fits the length bands it teaches.
- **NFR-R02**: No standard exists without a failure behind it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Bar Boundaries
- **A shipped rule that fails a proposed standard**: the standard is wrong, or the rule is a recorded exception. Either way it is written down, never resolved silently.
- **A rule that passes every standard and still reads badly**: recorded as the known limit of a written bar.
- **A standard that only one shipped rule demonstrates**: admissible only with the failure it prevents stated.

### Application Boundaries
- **A draft failing one standard**: named, with what would fix it.
- **A draft failing the section test everywhere**: it is probably not a rule; back to the decision tests.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One reference document plus two small hooks |
| Risk | 7/25 | No runtime surface; the risk is an unfalsifiable or over-set bar |
| Research | 10/20 | Every standard checked against eight rules |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should a standard exist for how a rule opens, given all eight use the same two-line preamble? **Leaning no: that is structure and phase 3 owns it. Recorded because the temptation to restate it here is real.**
- Does the bar apply to the router template as well? **Partly, and the parts differ enough that forcing one document to carry both would blur it. Decide during authoring; record whichever way it goes.**
<!-- /ANCHOR:questions -->

---
