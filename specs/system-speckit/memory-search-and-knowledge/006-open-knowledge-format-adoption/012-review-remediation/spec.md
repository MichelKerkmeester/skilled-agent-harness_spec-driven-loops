---
title: "Feature Specification: Phase 12: review-remediation"
description: "Fix the four P2 advisories the packet 050 deep review raised: an impossible source-tag cutoff date, YAML inline comments and case in the frontmatter-value readers, and newline pathnames in the census batch read."
trigger_phrases:
  - "050 review remediation"
  - "frontmatter value comment parsing"
  - "source tag cutoff date"
  - "census newline pathname"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/090-deep-review-okf-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-frontmatter-values-to-sk-doc |
| **Successor** | None |
| **Handoff Criteria** | Each of the four review findings has a test that fails on the old code and passes on the fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Open Knowledge Format adoption packet. It acts on the packet's own deep review (`../review/review-report.md`), which closed with no P0 or P1 and four P2 advisories.

**Scope Boundary**: the four findings R1-P2-001, R1-P2-002, R2-P2-001 and R5-P2-001, plus one test each. The review's open search debt is not in scope.

**Dependencies**:
- The shared value list from 011-frontmatter-values-to-sk-doc, which all four readers load.

**Deliverables**:
- Fixes in five tooling files and one new test case in each of five test files.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found four small defects in the packet's tooling. A date-shaped but impossible `SPECKIT_SOURCE_TAG_CUTOFF` such as `9999-99-99` turns the source-tag rule off. A YAML inline comment after `contextType` or `importance_tier` is read as part of the value. The skill-doc checker compares those values case-sensitively while the other readers lowercase. And a tracked path holding a line feed shifts the census's batched git replies onto the wrong documents.

### Purpose
The four readers of the shared value list agree on what a value is, and the two inputs the review named cannot silently skew a result.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A real calendar-date check on the source-tag cutoff override.
- YAML inline-comment handling in the three frontmatter-value readers, and case folding in the skill-doc checker.
- Leaving line-feed pathnames out of the census batch read.

### Out of Scope
- The review's search debt (replaying historical measurements, auditing the redirect table, a cross-reader parity suite) - it calls for review work, not code changes.
- Comment handling for `title`, `description` and trigger phrases in the skill-doc checker - no finding covers them, and stripping ` #` there would change how existing descriptions read.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Modify | `cutoffDate` also requires a real calendar day |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Modify | Read a scalar without its YAML inline comment |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | The same scalar rule in `validate_frontmatter_values` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modify | The two shared-list fields drop the comment and fold case |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Line-feed paths skip the batch and read one at a time |
| Five matching test files | Modify | One case per finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An impossible cutoff date falls back to the default with a note | `cutoffDate` returns `CUTOFF_DEFAULT` for `9999-99-99` and `2026-02-30`, and keeps `2028-02-29` |
| REQ-002 | `planning # note` and `"normal" # note` read as `planning` and `normal` in all three readers | The new rule, Python and checker tests pass |
| REQ-003 | The skill-doc checker accepts `Planning` and `HIGH` as the other readers do | The new checker test passes |
| REQ-004 | A document named with a line feed is read under its own path | The new census test passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No change in result on the real tree | The skill-doc checker reports the same `docs=101 violations=0` before and after, in both modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test fails against the pre-fix source and passes against the fix.
- **SC-002**: The existing suites for all five files still pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Comment stripping cuts a real value that holds ` #` | Low | Applied only to the two enum fields, whose shared-list values hold no `#` |
| Risk | Folding case in the skill-doc checker lets a mixed-case value through that CI used to reject | Low | The other three readers already accept it, so this aligns the checker with them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
