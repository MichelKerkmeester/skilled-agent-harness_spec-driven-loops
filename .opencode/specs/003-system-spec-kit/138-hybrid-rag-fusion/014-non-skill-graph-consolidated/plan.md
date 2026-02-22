# Implementation Plan: 014 - Non-Skill-Graph Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + spec folder structure |
| **Framework** | system-spec-kit spec template governance |
| **Storage** | Filesystem folder consolidation |
| **Testing** | Spec validation + path verification |

### Overview

Consolidate non-skill-graph child specs into one canonical folder (`014`) and archive four legacy source folders while preserving all historical artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source folders identified (`005/008/010/011`)
- [x] Target canonical folder defined (`014`)
- [x] Archive path defined (`z_archive/non-skill-graph-legacy`)

### Definition of Done
- [x] Source folders moved to archive
- [x] Canonical 014 docs created
- [x] Validation executed without errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Archive-and-canonicalize: historical preservation in archive + single active canonical folder.

### Data Flow

`active child folders (005/008/010/011)` -> `archive/non-skill-graph-legacy/*`

`canonical active docs` -> `014-non-skill-graph-consolidated/*`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural Merge
- [x] Create canonical `014` folder and base directories
- [x] Move `005/008/010/011` to `z_archive/non-skill-graph-legacy`

### Phase 2: Canonical Documentation
- [x] Create `spec.md`
- [x] Create `plan.md`
- [x] Create `tasks.md`
- [x] Create `checklist.md`
- [x] Create `decision-record.md`
- [x] Create `implementation-summary.md`
- [x] Create `supplemental-index.md`

### Phase 3: Verification
- [ ] Validate 014 folder
- [ ] Validate 138 root folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run spec validator on `014-non-skill-graph-consolidated`.
- Run spec validator on root `138-hybrid-rag-fusion`.
- Verify source folder paths now resolve under archive.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scripts/spec/validate.sh` | Internal | Green | Completion cannot be verified |
| Root phase docs | Internal | Yellow | Pre-existing phase-link warnings may remain |
| Archive path structure | Internal | Green | Historical lookup would fail if path drifts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Consolidation introduces broken references or missing historical folders.
- **Procedure**: Move archived folders back under root and rerun validation.
- **Scope**: Documentation and folder structure only; no runtime code rollback required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm all source folders exist before move.
- Confirm target archive and canonical paths.
- Confirm no unrelated spec folders are modified.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope lock | Touch only consolidation-related folders/files |
| Preservation | Archive by move, do not delete source content |
| Verification | Validate child and root spec folders post-merge |
| Traceability | Record mapping in `supplemental-index.md` |

### Status Reporting Format
- `STATE`: current phase
- `ACTIONS`: concrete filesystem/doc changes
- `RESULT`: pass/fail and follow-up

### Blocked Task Protocol
1. Stop further moves or edits.
2. Record the failing command/path.
3. Attempt one bounded fix.
4. Escalate with options.
<!-- /ANCHOR:ai-protocol -->

---
