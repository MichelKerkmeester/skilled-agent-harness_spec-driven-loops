---
title: "Feature Specification: Phase 1: broken-references"
description: "README references whose target moved under the sk-design hub or was removed point nowhere; this phase fixes those and records which audit hits are accurate references the audit cannot resolve."
trigger_phrases:
  - "broken references"
  - "phase 1 broken references"
  - "readme broken reference fix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: broken-references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/231-repo-doc-debt` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-readme-template-conformance |
| **Handoff Criteria** | Every reference whose target moved or was removed is fixed, and every remaining audit hit is classified with a reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts specification.

**Scope Boundary**: README path references the audit reports as unresolved. No change to the audit itself.

**Dependencies**:
- `audit_readmes.py` for the before and after counts

**Deliverables**:
- Fixed references in the READMEs whose targets moved
- A classification of every remaining hit in `implementation-summary.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit reports 119 broken references. Some point at paths that moved when `sk-design-md-generator` went under the `sk-design` hub, or at a file that was removed, so a reader who follows them finds nothing. Many others are accurate: symlink targets in tree diagrams, package-root shorthand, placeholders and gitignored runtime files that the audit resolves only from the README's own folder or the repo root.

### Purpose
Every reference that is really dead is fixed or its sentence is rewritten, and every hit left in place is listed with its reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --json-out audit.json --markdown-out audit.md
  "readmes_total": 753,
  "broken_references": 119,
(exit 0; 43 of the 119 resolve to gitignored paths per `git check-ignore`)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.skilled/skills/sk-design-md-generator/` paths to `.skilled/skills/sk-design/sk-design-md-generator/` in four READMEs
- Point the sk-design-fundamentals `tokens.css` copy command at its real location
- Drop the sentence pointing at the removed `styles/docs/manual-testing-playbook.md`
- Correct the relative path to `trigger-index.json` in the retrieval README

### Out of Scope
- Accurate references the audit cannot resolve - changing them would degrade a correct doc to satisfy a checker
- Generated benchmark reports - their writer is retired; see phase 002

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-md-generator/README.md` | Modify | Hub path |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/README.md` | Modify | Hub path |
| `.skilled/skills/sk-design/sk-design-md-generator/styles/README.md` | Modify | Hub path |
| `.skilled/skills/sk-design/sk-design-md-generator/styles/lib/database/README.md` | Modify | Hub path |
| `.skilled/skills/sk-design/sk-design-md-generator/styles/tests/README.md` | Modify | Drop dead pointer |
| `.skilled/skills/sk-design/sk-design-fundamentals/README.md` | Modify | tokens.css path |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Relative index path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every fixed reference resolves on disk, and no fact in the edited README is lost |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Every remaining audit hit is listed with its reason in `implementation-summary.md` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An audit rerun reports fewer broken references than 119, and none of the remaining hits is a moved or removed target
- **SC-002**: `validate_document.py` reports 0 blocking errors on every edited README
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `audit_readmes.py` | Counts come from it | Rerun it on the final state |
| Risk | A rewrite invents a target | Med | Each new path is checked with `ls` before it is accepted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: documentation-only change; no service runs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README with no broken reference is not touched.
- Maximum input: a README with many hits on one moved prefix gets one replace-all edit.
- Failure path: a target that cannot be found has its sentence rewritten rather than pointed somewhere guessed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Seven READMEs, about 26 lines |
| Risk | 3/25 | Docs only |
| Research | 10/20 | Classifying 119 hits |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. Changing the audit to follow symlink annotations and package-relative paths is a separate decision.
<!-- /ANCHOR:questions -->

---
