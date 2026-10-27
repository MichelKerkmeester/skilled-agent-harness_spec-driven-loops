---
title: "Feature Specification: Phase 2: readme-template-conformance"
description: "244 READMEs fail the sk-create-readme validator for a missing overview; this phase fixes the hand-authored ones, closes real inventory gaps and traces the generated reports to their retired writer."
trigger_phrases:
  - "readme template conformance"
  - "phase 2 readme template conformance"
  - "readme missing overview"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: readme-template-conformance

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
| **Phase** | 2 of 3 |
| **Predecessor** | 001-broken-references |
| **Successor** | 003-changelog-omissions |
| **Handoff Criteria** | Every hand-authored template failure validates, and every remaining failure is traced to its producer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts specification.

**Scope Boundary**: READMEs the audit marks template-invalid, its one warning, and the missing-key-artifact findings that name a real folder.

**Dependencies**:
- `validate_document.py` and `audit_readmes.py`

**Deliverables**:
- Conforming hand-authored READMEs
- The producer trace for the generated benchmark reports

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit reports 244 template-invalid READMEs, each for a missing overview section, plus 19 missing key artifacts and 1 numbering warning. 235 of the invalid READMEs are benchmark report folders written by a writer that no longer exists, and the renderer that replaced it would drop facts if rerun.

### Purpose
Every hand-authored README passes the validator with its facts intact, and the generated ones are left with their producer named.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --json-out audit.json --markdown-out audit.md
  "template_invalid": 244,
  "template_warnings": 1,
  "missing_key_artifacts": 19,
$ node .skilled/skills/sk-code/benchmark/scripts/render-report.cjs --check <each failing report folder>
  227 folders: differs from a render of its record in 6 of 7 file(s)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an overview section to the 7 hand-authored READMEs that lack one
- Name the undocumented `lib/`, `tests/` and `SKILL.md` in 4 READMEs
- Renumber the one README whose sections start at 0

### Out of Scope
- The 235 generated benchmark report READMEs - their writer is retired and the surviving renderer is lossy
- `.pi/extensions/**` and advisor runtime tests - other lanes own them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 7 hand-authored READMEs | Modify | Overview section and numbered sections |
| 4 READMEs with inventory gaps | Modify | Name the folder or file beside them |
| `sk-create-with-human-voice/scripts/README.md` | Modify | Sections numbered from 1 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each edited README reports 0 blocking errors and keeps every sentence, table row, link and command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each remaining template failure or coverage finding is traced to its producer or reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit's template-invalid count drops by the 7 hand-authored files, and its warning count reaches 0
- **SC-002**: The audit's missing-key-artifact count drops for every folder-inventory gap fixed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | README template | Defines the target shape | Briefs quote it |
| Risk | Renumbering breaks an inbound anchor | Low | `rg` for `#anchor` links and section numbers before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: documentation-only change; no service runs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README already valid is not touched.
- Maximum input: a README with no numbered sections gets every H2 numbered.
- Failure path: a README that documents its own exemption keeps that text word for word.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Twelve READMEs |
| Risk | 3/25 | Docs only |
| Research | 12/20 | Tracing 235 reports to a deleted writer |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How the 235 generated reports should conform is an operator decision, recorded in the parent spec.
<!-- /ANCHOR:questions -->

---
