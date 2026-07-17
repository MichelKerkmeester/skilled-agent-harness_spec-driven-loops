---
title: "Implementation Plan: INSTALL-GUIDE canonical filename normalization (sk-doc 021)"
description: "Plan for normalizing skill install-guide filenames to INSTALL-GUIDE.md: additive classifier hyphen-stem recognition, git-mv renames (two-step for case-only), and .md-suffixed filename reference updates, preserving the install_guide doc-type contract."
trigger_phrases:
  - "install-guide normalization plan"
  - "INSTALL-GUIDE rename plan"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/021-install-guide-canonical-naming"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-install-guide-canonical-naming"
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

<!-- ANCHOR:phases -->
## 2. IMPLEMENTATION PHASES

### Phase 1: Classifier
- Add `or 'install-guide' in Path(path_lower).stem` to the install_guide branch of `detect_document_type`.

### Phase 2: Rename
- `git mv` the 14 files → `INSTALL-GUIDE.md`; two-step through a temp name for the 3 case-only (`install-guide.md`) renames.

### Phase 3: References
- Replace `.md`-suffixed filename references (`INSTALL_GUIDE.md`/`install-guide.md`/`install_guide.md` → `INSTALL-GUIDE.md`) across `.opencode` (excluding `specs/`) and the root `README.md`; never replace the bare `install_guide` doc-type id or JSON key.

### Phase 4: Verify
- Classify a renamed `INSTALL-GUIDE.md` fixture → expect `install_guide`; scan for over-reach (prefixed `*INSTALL-GUIDE.md`) and revert; confirm no install-guide link breakage; baseline the pre-existing validator test state.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:rollback -->
## 3. ROLLBACK PLAN

- **Trigger**: A renamed file misclassifies, or a filename reference breaks.
- **Procedure**: Revert the path-scoped commit (`git revert`); the renames are `git mv` (history preserved) and the classifier change is a single additive line.
<!-- /ANCHOR:rollback -->
