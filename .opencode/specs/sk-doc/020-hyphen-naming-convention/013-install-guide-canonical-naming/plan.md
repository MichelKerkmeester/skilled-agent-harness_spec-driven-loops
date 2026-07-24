---
title: "Implementation Plan: INSTALL-GUIDE canonical filename normalization (sk-doc 021)"
description: "Plan for normalizing skill install-guide filenames to INSTALL-GUIDE.md: additive classifier hyphen-stem recognition, git-mv renames (two-step for case-only), and .md-suffixed filename reference updates, preserving the install_guide doc-type contract."
trigger_phrases:
  - "install-guide normalization plan"
  - "INSTALL-GUIDE rename plan"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/020-hyphen-naming-convention/013-install-guide-canonical-naming"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/013-install-guide-canonical-naming"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the plan for the INSTALL-GUIDE canonical-naming migration"
    next_safe_action: "Rename the 14 files and update filename references"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: INSTALL-GUIDE canonical filename normalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc classifier + skill install-guide documents under `.opencode/skills/**` |
| **Change class** | Documentation filename normalization with an additive classifier update |
| **Execution** | Classifier first (accept hyphen stem), then rename, then filename references |

### Overview
Normalize three inconsistent install-guide filename casings (`INSTALL_GUIDE.md`, `install-guide.md`, `install_guide.md`) to the
single canonical `INSTALL-GUIDE.md`. The classifier `detect_document_type` types by the lowercased filename stem, so it gains
additive recognition of the `install-guide` (hyphen) stem before the rename to avoid a silent downgrade to `readme`. The
internal doc-type identifier `install_guide` is preserved everywhere it is a code contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive classifier recognition followed by filename normalization and reference updates.

### Key Components
- **`detect_document_type`**: Recognizes the hyphenated filename stem while preserving the `install_guide` document-type identifier.
- **Install-guide files and references**: Renamed to `INSTALL-GUIDE.md`, with `.md`-suffixed references updated to the canonical name.

### Data Flow
The classifier accepts the hyphen stem first, the 14 files are renamed, and old `.md`-suffixed filename references are replaced without changing the bare `install_guide` contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Classifier
- Add `or 'install-guide' in Path(path_lower).stem` to the install_guide branch of `detect_document_type`.

### Phase 2: Rename
- `git mv` the 14 files → `INSTALL-GUIDE.md`; two-step through a temp name for the 3 case-only (`install-guide.md`) renames.

### Phase 3: References
- Replace `.md`-suffixed filename references (`INSTALL_GUIDE.md`/`install-guide.md`/`install_guide.md` → `INSTALL-GUIDE.md`) across `.opencode` (excluding `specs/`) and the root `README.md`; never replace the bare `install_guide` doc-type id or JSON key.

### Phase 4: Verify
- Classify a renamed `INSTALL-GUIDE.md` fixture → expect `install_guide`; scan for over-reach (prefixed `*INSTALL-GUIDE.md`) and revert; confirm no install-guide link breakage; baseline the pre-existing validator test state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Classifier result for an `INSTALL-GUIDE.md` path | Direct `detect_document_type` test |
| Integration | Filename references and markdown links after renaming | Grep and markdown link-check |
| Manual | Over-reach scan and validator baseline comparison | Shell checks |

The checks are planned for the implementation phases; this packet is currently Planned.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate_document.py` classifier | Internal | Planned | Renamed files could be typed as `readme` |
| 14 skill install-guide files | Internal | Planned | The canonical filename set cannot be completed |
| Filename references under `.opencode` and root `README.md` | Internal | Planned | Links and setup pointers could remain stale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A renamed file misclassifies, or a filename reference breaks.
- **Procedure**: Revert the path-scoped commit (`git revert`); the renames are `git mv` (history preserved) and the classifier change is a single additive line.
<!-- /ANCHOR:rollback -->
