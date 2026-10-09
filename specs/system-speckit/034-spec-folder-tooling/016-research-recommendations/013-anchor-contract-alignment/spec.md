---
title: "Feature Specification: Phase 13: anchor-contract-alignment"
description: "The validator, the registry and the docs disagree on what ANCHORS_VALID checks. The operator chose a nesting check that allows adr-NNN parents, plus duplicate-closer detection, shipped as a warning after phase 001 and an error after phase 011."
trigger_phrases:
  - "anchor contract alignment"
  - "ANCHORS_VALID order nesting"
  - "anchor contract specification"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: anchor-contract-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 16 |
| **Predecessor** | 012-fold-one-off-repairs |
| **Successor** | 014-gate-3-menu-parity |
| **Handoff Criteria** | ANCHORS_VALID flags nesting (allowing `adr-NNN` to contain `adr-NNN-*`) and duplicate closers, the code, registry and docs agree, and the corpus is baselined before each severity step |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Research recommendations specification. SH-13 is a contract-alignment fix. The operator decided the anchor rules on 2026-10-08 (section 10).

**Scope Boundary**: The ANCHORS_VALID check code in orchestrator.ts, the registry description in validator-registry.json, and the documented rules in validation-rules.md.

**Dependencies**:
- Phase 001 (spec-template-anchor-nesting) lands before the nesting check ships as a warning, so new scaffolds do not nest.
- Phase 011 (anchor-repair-mode) lands before the nesting check becomes an error, so the corpus, archived documents included, is un-nested first.
- A baseline of the corpus before each severity step.

**Deliverables**:
- A nesting check and duplicate-closer detection in validateAnchorIntegrity()
- Nesting reported as a warning after 001, then as an error after 011
- Registry description updated to match the code
- validation-rules.md updated to match the code

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ANCHORS_VALID check in the validator code only detects duplicate anchor opens, unopened closes, unclosed opens, and documents with zero anchors. But the validator registry description says it "validates anchor syntax, pairing, order, and uniqueness" and validation-rules.md says "No nesting - anchors cannot contain other anchors". This three-way disagreement creates confusion about what the check actually enforces and what the documentation promises.

### Purpose
Make ANCHORS_VALID catch an anchor wrapped inside an unrelated anchor, which makes retrieval return the wrong region, and make the code, the registry description and validation-rules.md describe the same rules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A nesting check in validateAnchorIntegrity() that allows `adr-NNN` to contain `adr-NNN-*`, the layout the decision-record template uses by design
- Duplicate-closer detection: a name closed more times than it is opened
- Nesting severity in two steps: a warning after 001 lands, an error after 011 lands
- A corpus baseline before each step
- Registry description and validation-rules.md updated to match the code

### Out of Scope
- Template-sequence order (anchors in the order the template lists them). Rejected by the operator
- Retrofitting historical packets to the new rule (that is handled by repair tooling, SH-11)
- Changing how anchors are used for retrieval or merging (that is downstream behavior)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Add the nesting check with the `adr-NNN` allowance and duplicate-closer detection to validateAnchorIntegrity() |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Update description for ANCHORS_VALID to match the code |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Update the Anchor Rules section to match the code and registry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | validateAnchorIntegrity() reports an anchor opened while another is open, except a child `adr-NNN-*` inside its parent `adr-NNN` |
| REQ-002 | validateAnchorIntegrity() reports a name closed more times than it is opened |
| REQ-003 | The validator registry description for ANCHORS_VALID matches the code behavior |
| REQ-004 | The validation-rules.md documentation matches the code behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A corpus baseline is captured before each severity step |
| REQ-006 | The spec-kit CLI test suite passes with no new test failures |
| REQ-007 | Nesting is a warning until phase 011 has landed, then an error. The step to error is a separate change |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A nested fixture is reported and a decision-record fixture with `adr-001` holding `adr-001-context` is not
- **SC-002**: The code, registry, and docs all describe the same anchor rules
- **SC-003**: A corpus baseline is captured before each severity step
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tightening fails historical packets | About 416 live packets would fail nesting today (section 10) | Warning first. Error only after 011 has un-nested the `questions` layout |
| Risk | About 13 live packets carry other nesting 011 does not target | They fail once nesting is an error | Fix them by hand before the error step |
| Risk | Code change creates new test failures | Fixtures may carry nesting | Update fixtures. The suite must pass after any fixture update |
| Dependency | Phase 001 | New scaffolds nest until it lands | Ship the warning only after 001 |
| Dependency | Phase 011 | The corpus nests until it lands | Ship the error only after 011 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance impact from the anchor check changes (no new O(n) or O(n^2) operations)

### Security
- **NFR-S01**: No new security surface; anchor validation is read-only

### Reliability
- **NFR-R01**: The check is deterministic; same input always produces same result
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Nested Anchors
- An anchor opened inside the `questions` anchor: reported
- `adr-001-context` inside `adr-001`: allowed
- `adr-002` inside `adr-001`: reported, since it is not a child of that parent
- An anchor inside a fenced code block: ignored, as today

### Anchor Order
- A close that comes before its own open: reported by the stack-based nesting check
- Order relative to the template: not checked, by decision

### Duplicate Closers
- The code already reports a name that is closed but never opened (`orchestrator.ts:731-732`)
- The new check reports a name closed more times than it is opened, for example a second `/ANCHOR:questions`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Three files, modest code change in orchestrator.ts |
| Risk | 15/25 | Tightening the check can fail historical packets; baseline first |
| Research | 0/20 | Fully researched in SH-13 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. Decided 2026-10-08 by the operator:

- **Option 2, with an allowance.** ANCHORS_VALID adds a nesting check. A child named `adr-NNN-*` may sit inside its parent `adr-NNN`, because `templates/addons/decision-record.md.tmpl:34-128` nests that way by design. Every other anchor opened inside another is reported.
- **Duplicate closers are detected.** A name closed more times than it is opened is reported. This costs no new failures today.
- **Two severity steps.** Nesting is a warning once phase 001 lands, since warnings do not fail `--strict` (`orchestrator.ts:1086-1092`). It becomes an error once phase 011 lands.
- **Template-sequence order is rejected.** It would regrade the corpus whenever a template moves a section, the problem the comment at `orchestrator.ts:687-692` says template diffing caused.
- **The registry and docs follow the code.** `validator-registry.json:109` and `validation-rules.md:392` are rewritten to say exactly what the check does.

### Measured cost (approximate)

Packets that pass ANCHORS_VALID today and would newly fail, measured 2026-10-08 on the working tree. Packets already failing (live 6, archived 11, scratch 17) and exempt phase parents are excluded. Scanned: live 2,201, archived 2,214, research or review copies 6, scratch copies 204.

| Option | Live | z_archive | Research or review copies | Scratch |
|--------|------|-----------|---------------------------|---------|
| Literal "no nesting" | 586 | 426 | 2 | 66 |
| Nesting with the `adr-NNN` allowance (chosen) | 416 | 190 | 0 | 47 |
| of which the `questions` layout is the only cause | 403 | 164 | 0 | 47 |
| left after 011 un-nests `questions` | 13 | 26 | 0 | 0 |
| Allowance plus template-sequence order (rejected) | 461 | 285 | 0 | 47 |
| Duplicate closers, added to any option | 0 | 0 | 0 | 0 |

Method: a read-only Node walk over `specs/` that copies the validator's anchor regex and fence stripping. It is approximate in three ways. It checks the 13 doc names that have anchored templates instead of the validator's per-level doc list. It detects phase parents with the same child-folder test as `isPhaseParent`. The order row compares only spec.md, plan.md, tasks.md and implementation-summary.md with the current template's close order. Other agents were editing `specs/` while it ran.

<!-- /ANCHOR:questions -->

---


