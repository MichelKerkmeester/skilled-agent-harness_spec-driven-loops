---
title: "Feature Specification: Improve sk-create-readme writing-style guidance"
description: "sk-create-readme lacks the writing-style rules the root README rework proved: a two-register emoji policy, feature-named headings, per-item inventory descriptions, a problem-first option and a paragraph bound."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Improve sk-create-readme writing-style guidance

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README rework produced formatting patterns the skill never documented: decorative section emoji on a marketing front page versus semantic-only emoji elsewhere, headings that name the feature and its benefit, inventories where every item carries a description, a problem-first section before Overview and a per-feature H2 structure for large documents. Without those rules written down, the next README falls back to the old shapes.

### Purpose
Update `sk-create-readme` guidance and its fillable template so new and revised READMEs apply the proven patterns, scoped to the register each README type actually uses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md`: two-register emoji rule, heading-names-the-feature rule, per-item inventory description rule, 2-4 sentence paragraph bound and an optional `Problem` section row.
- `references/readme/writing-patterns.md`: `Problem` section standard, `Emoji Use` rule, `Paragraphs and Bullets` rule and the `Itemized Inventory` pattern.
- `references/readme/types-and-voice.md`: front-page marketing register versus technical register for all other README types.
- `references/readme/quality-and-checklist.md`: checklist items for the new rules.
- `assets/readme-template.md`: inventory-description writing rule, itemized pattern example and scaffold comment.
- `shared/references/core-standards.md`: README emoji line tightened to the two registers.
- `changelog/v1.2.0.0.md` plus version bumps on touched files.

### Out of Scope
- Rewriting existing READMEs - the additions are opt-in or advisory, existing valid READMEs stay valid.
- `readme-code-template.md` - code-folder READMEs already live on the technical register.
- Scanner changes - the rules are guidance-level, `hvr_scan.py` and the audit scripts need no edits.
- The in-flight cli-jev/orca migration work - owned by a parallel session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` | Modify | New format rules, Problem row, version 1.2.0.0 |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md` | Modify | New section standards and patterns, version 1.2.0.0 |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md` | Modify | Register distinction, version 1.2.0.0 |
| `.skilled/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modify | New checklist items, version 1.2.0.0 |
| `.skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md` | Modify | Itemized pattern guidance, version 1.2.0.0 |
| `.skilled/skills/sk-doc/shared/references/core-standards.md` | Modify | Emoji line two-register wording, version 2.1.0.37 |
| `.skilled/skills/sk-doc/sk-create-readme/changelog/v1.2.0.0.md` | Create | Release entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Emoji guidance names two registers: decorative section emoji only on the repository front-page README, semantic emoji (✅ ❌ ⚠️ 🔒 🚨) on all other READMEs |
| REQ-002 | Guidance requires headings to name the feature or artifact rather than a generic label |
| REQ-003 | Guidance requires every inventory item to carry a description, with the bold-name-plus-bullets pattern documented |
| REQ-004 | An optional `Problem` section is documented for front-page READMEs, placed before Overview |
| REQ-005 | New rules are opt-in or correctly scoped so existing conformant READMEs stay conformant |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Dedicated per-feature H2 guidance for documents with four or more major features |
| REQ-007 | A 2-4 sentence paragraph bound with a bullets-for-multi-point rule |
| REQ-008 | `readme-template.md` demonstrates the itemized pattern as an opt-in alternative |
| REQ-009 | Changelog entry and version bumps on all touched files |
| REQ-010 | `validate_document.py` returns VALID and `hvr_scan.py` reports no new hard blockers on every touched file |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py` reports VALID with 0 issues on all seven touched files.
- **SC-002**: `hvr_scan.py` reports 0 hard blockers introduced by this change (pre-existing blockers in untouched lines excluded).
- **SC-003**: `validate.sh --strict` on this packet returns `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `shared/references/core-standards.md` is shared across sk-doc packets | Other packets inherit the emoji wording | Change is one YAML block, tightens rather than relaxes |
| Risk | New rules read as mandatory and invalidate existing READMEs | Med | Wording is opt-in ("optional", "may use") or scoped to the README types it fits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation-only change, no runtime path affected.
- **NFR-P02**: Validation commands complete in seconds, same as before the change.

### Security
- **NFR-S01**: No secrets, credentials or environment values in the guidance or examples.
- **NFR-S02**: No executable code added, examples are fenced markdown snippets.

### Reliability
- **NFR-R01**: New guidance must not contradict existing format rules (numbered H2, `---` separators, no TOC).
- **NFR-R02**: Version bumps follow the per-file streams already in use.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a README with no inventory or no features gains no obligations from the new rules.
- Maximum length: the 2-4 sentence bound is a recommendation, not a validator gate.
- Invalid format: decorative emoji on a non-front-page README is flagged by the new checklist item, not by a scanner.

### Failure Scenarios
- External service failure: not applicable, local file edits only.
- Network timeout: not applicable.
- Concurrent access: the parallel cli-jev session touches no file in scope.

### State Transitions
- Partial completion: each file edit is independent, a partial set still validates.
- Session expiry: packet docs record the state for a clean resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Seven files, prose additions only |
| Risk | 4/25 | One shared file touched, wording tightened |
| Research | 5/20 | Patterns already proven on the root README |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Scope, spec handling and template inclusion were answered before this packet was scaffolded.
<!-- /ANCHOR:questions -->

---
