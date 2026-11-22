---
title: "Feature Specification: Phase 2: playbook-marker-backfill"
description: "Eleven playbook roots lacked the results contract marker that phase 1 made a validator error. This phase adds the Result persistence block to each, so the fleet passes and every root names the recorder."
trigger_phrases:
  - "playbook marker backfill"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: playbook-marker-backfill

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/514-playbook-run-recording` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-run-recorder-and-validator |
| **Successor** | None |
| **Handoff Criteria** | The fleet validator exits 0 under `--strict` with no `RESULT_PERSISTENCE_MARKER_MISSING` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the playbook run recording program. The operator chose the full backfill on 2026-11-22, so no root is left failing the new error.

**Scope Boundary**: the root `manual-testing-playbook.md` of the 11 roots without the marker. Scenario files and the roots that already carry the marker are not touched.

**Dependencies**:
- 001-run-recorder-and-validator, which fixed the block's text and made the marker an error.

**Deliverables**:
- The Result persistence block in each of the 11 roots, naming that root's own path in the recorder command.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 1, 11 roots fail the fleet validator because they never carried the results marker: `mcp-browser-use/mcp-chrome-devtools`, `mcp-code-mode`, `mcp-tooling`, `mcp-tooling/mcp-figma`, `mcp-tooling/mcp-mobbin`, `mcp-tooling/mcp-refero`, `sk-design`, `sk-doc`, `sk-prompt`, `system-deep-loop/deep-research` and `system-deep-loop/deep-review`. CI runs the fleet with `--strict`, so a merge without them would fail the Playbook Operator Contract job.

### Purpose
Every playbook root tells its runner how to save results, and the fleet passes again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs > v.txt; echo "exit=$?"; grep -c '^  RESULT_PERSISTENCE_MARKER_MISSING' v.txt
exit=1
11
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Insert the template's Result persistence block above `## 1. OVERVIEW` in each of the 11 roots.
- Name each root's own playbook path in its recorder command.

### Out of Scope
- Changelog entries for the 11 skills - the block adds no behavior to those skills, and the commit hook raises each root's doc edition.
- Other validator warnings in those roots - they predate this program and are counted unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/<skill>/manual-testing-playbook/manual-testing-playbook.md` for the 11 roots | Modify | The Result persistence block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fleet validator exits 0 and reports no `RESULT_PERSISTENCE_MARKER_MISSING` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Every other fleet count equals the baseline, and each root's `validate_document.py` issue count is unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate-playbook-package.cjs` exits 0 across all 59 roots.
- **SC-002**: The fleet's warning counts match the baseline except the 11 marker warnings, which are gone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1's final block text | A later wording change means editing 11 roots again | The block was frozen before this phase started |
| Risk | Editing 11 skills trips their commit gates | Med | Leaf-manifest, parent-skill and signal checks ran on every touched skill |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. Documentation only.
- **NFR-P02**: N/A. No service runs.

### Security
- **NFR-S01**: N/A. No credential or network surface.
- **NFR-S02**: N/A. No data handling.

### Reliability
- **NFR-R01**: The insertion stops on any root whose shape differs from the expected `---` then `## 1. OVERVIEW`.
- **NFR-R02**: N/A. No error budget applies.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a root that already carries the marker is refused by the insertion script.
- Maximum input: N/A. Eleven fixed files.
- Failure path: a root without `## 1. OVERVIEW` two lines after `---` stops the script before it writes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Eleven files, one block each |
| Risk | 4/25 | Documentation only, in other skills |
| Research | 2/20 | One structural check per root |
| **Total** | **14/70** | **Level 2, inherited from the program** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
