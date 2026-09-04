---
title: "Feature Specification: Phase 6: validator-and-template-debt"
description: "A template scores clean and seeds what it emits, because the scanner skips the fenced block that is the template's whole payload. Three instances were found in one session."
trigger_phrases:
  - "validator and template debt"
  - "template payload scanning"
  - "fixture exemption validator"
  - "check that never looked"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-02T18:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase spec against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/core/plan.md.tmpl"
      - ".opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "45 of 53 templates carry a blocker once the payload is scanned, and that backlog is unstarted"
    answered_questions:
      - "The boilerplate count was 56 planning documents, not 48"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: validator-and-template-debt

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Three checks passed because they never looked. The voice scanner skipped the fenced payload
that is a template's entire output, the document validator blocked on fixtures the packaging
gate already exempts, and a corrected template left dozens of documents carrying what it used
to emit. Measured properly, 45 of 53 templates in the fleet carry a real blocker.

**Key Decisions**: a template's fenced block is the deliverable, so the scanner reads it, and
boilerplate is corrected at the template before the documents it seeded.

**Critical Dependencies**: the voice scanner and the document validator, which had to agree
about what a fixture is.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-hub-surface-truth |
| **Successor** | 007-spec-kit-residue |
| **Handoff Criteria** | Payload scanning on, fixture exemption shared by both gates, the template backlog recorded with its count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the routing completeness phases specification.

**Scope Boundary**: the two validators and the templates they measure. Rewriting a template
payload is a review-bearing change and stays out.

**Dependencies**:
- The packaging gate, whose fixture-tree exemption is the precedent the validator adopted.
- The scaffold golden snapshots, which pin what the plan template emits.
- The voice scanner's rule set, which supplies the blocker definitions.

**Deliverables**:
- Payload scanning for templates, detected by name and location.
- A fixture-tree exemption in the document validator, matching the packaging gate.
- Two seeded blockers corrected at the template, and the documents they seeded rewritten.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A template is the one document where the fenced block is the deliverable rather than a
quotation, and the voice scanner skips fenced content by default. So a template can score a
perfect zero and seed a banned character into every document authored from it. Twenty-four
of forty templates in this tree hide blockers that way, and the worst scores zero while
emitting forty-three.

Two related debts sit beside it. The document validator blocks on scanner fixtures whose
bytes are pinned by tests, where the packaging gate already exempts fixture trees on exactly
that reasoning. And forty-eight planning documents carry boilerplate from a template that has
since been corrected.

### Purpose

A template is measured against what it emits, and the two validators agree about what a
fixture is.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A fixture exemption in the document validator, matching the precedent already in the packaging gate.
- Template scanning that reads the payload, so a seeded blocker is caught rather than scoring clean.
- The forty-eight planning documents brought to the corrected boilerplate.

### Out of Scope

- Sweeping the inherited voice backlog in non-template documents. It is a writing job and it would bury this.
- Changing the scanner default for ordinary documents, where skipping a quoted command is correct.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | Modify | Banned character removed from the verbatim binding line (`c1b3b780c3`), overview section added (`d87e8dd162`) |
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modify | Measured table re-derived after five of nine rows drifted (`c1b3b780c3`) |
| `.../sk-create-with-human-voice/references/scope-and-exemptions.md` | Modify | Scanning a template with `--include-code`, and reading a zero without it as unmeasured (`c1b3b780c3`) |
| `.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | Scaffold line stripped of a semicolon and a serial comma (`9ae247d772`) |
| `.../tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Golden snapshots re-captured against the corrected template (`9ae247d772`) |
| Thirteen reference and readme files under three modes | Modify | Overview sections added, ten promoted from existing prose and five authored (`d87e8dd162`) |
| Fifty-six `plan.md` files across `specs/` | Modify | The superseded scaffold line replaced, each dropping exactly one blocker (`d229b0a24d`) |
| The document validator and the voice scanner | Modify | Fixture-tree exemption added, and template payload scanning enabled by name and location (`d229b0a24d`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The document validator exempts scanner fixtures whose bytes are pinned by tests, matching the packaging gate |
| REQ-002 | A template's fenced payload is scanned, so a seeded blocker is caught rather than scoring clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No planning document carries the superseded scaffold boilerplate once the phase closes |
| REQ-004 | Every template in the tree is re-scored with payload scanning on, and the count is recorded rather than swept |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The document validator exits 0 on both voice fixtures, and the packaging gate
  still exempts fixture trees.
- **SC-002**: A blocker seeded inside a template fence is caught, and removing it returns a
  pass.
- **SC-003**: A search across `specs/` for the superseded scaffold sentence returns only the
  criterion that describes this task.
- **SC-004**: The re-scored template count is recorded with both figures, the tree count and
  the fleet count, rather than one quoted for the other.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The packaging gate's fixture exemption | The validator needs a precedent to match rather than invent | The same reasoning was moved into the validator |
| Dependency | Scaffold golden snapshots | A template edit that skips them leaves the suite red | Snapshots re-captured in the same commit |
| Risk | Rewriting a template payload changes what it emits | High | The 45 of 53 backlog is recorded, not swept, and reviewed per template |
| Risk | Renumbering documents to add an overview breaks citations | High | Overviews go in a zero slot wherever a section number is cited |
| Risk | Quoting the fleet figure for the tree figure | Medium | Both numbers are stated with what each describes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Payload scanning applies only to paths that look like templates, so ordinary
  documents keep the existing masking behavior and the existing cost.

### Security
- **NFR-S01**: Both gates read files and write nothing, and the fixture exemption is decided
  by path rather than by content.

### Reliability
- **NFR-R01**: Every count in this phase is re-derived rather than inherited, and the
  re-derivation is repeatable from the committed tree.

---

## 8. EDGE CASES

### Data Boundaries
- A document about templates rather than a template: its name starts with the word instead of
  ending in it, which is how the detector tells them apart.
- A template outside an assets or templates tree: name alone does not qualify it.

### Error Scenarios
- A fixture padded to satisfy a validator: the thing the fixture exists to test breaks, which
  is why the exemption is the fix.
- A document whose overview would need a renumber: the zero slot is used instead, so cited
  section numbers keep resolving.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 75 or so, LOC: moderate per file, Systems: two gates plus the template tree |
| Risk | 14/25 | Auth: N, API: N, Breaking: N, though a template edit changes future output |
| Research | 12/20 | Every count had to be re-derived before it could be used |
| Multi-Agent | 5/15 | Workstreams: 1 |
| Coordination | 9/15 | Dependencies: golden snapshots and the packaging gate |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A template payload rewrite changes emitted output unreviewed | H | M | Recorded as a backlog, decided per template |
| R-002 | An inherited count is quoted without re-derivation | M | H | Forty-eight became fifty-six once counted |
| R-003 | Renumbering breaks citations from files out of scope | H | M | Zero slot where a number is cited, prescribed numbering elsewhere |

---

## 11. USER STORIES

### US-001: A template is measured against what it emits (Priority: P0)

**As a** template maintainer, **I want** the scanner to read the fenced payload, **so that** a
clean score means measured rather than unmeasured.

**Given** a template whose payload is a fenced block, **When** it is scanned, **Then** a
seeded blocker is caught and its removal returns a pass.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Two gates agree about what a fixture is (Priority: P0)

**As a** maintainer running both gates, **I want** the document validator to exempt what the
packaging gate exempts, **so that** a fixture is not padded into uselessness to quiet a check.

**Given** a scanner fixture whose bytes are pinned by tests, **When** the document validator
runs, **Then** it is exempt and exits 0.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Forty-five of fifty-three templates still carry a blocker in their payload, and whether that
  backlog becomes its own packet is a roadmap decision rather than a phase one.
- Two scanner fixtures still have no overview section on purpose, since their bytes are pinned
  by tests asserting findings on specific lines.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
