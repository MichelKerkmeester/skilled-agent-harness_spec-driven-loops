# Addendum Templates

> Source components for the CORE + ADDENDUM v2.0 composition model extending base templates with level-specific sections.

---

## 1. 📖 OVERVIEW

The addendum templates implement the CORE + ADDENDUM v2.0 architecture where:
- **Core templates** (`../core/`) provide the base structure shared across all levels
- **Addendum files** (this directory) contain level-specific sections that extend the core
- **Level templates** (`../level_N/`) are composed by combining core + relevant addendums

This composition model eliminates duplication while maintaining flexibility. Each level inherits the core structure and adds incremental governance, verification, and architectural guidance.

---

## 2. 🏗️ COMPOSITION MODEL

The templates compose like building blocks:

| Level | Composition | Files Created |
|-------|-------------|---------------|
| **Level 1** | Core only | spec.md, plan.md, tasks.md, implementation-summary.md (4 files) |
| **Level 2** | Core + level2-verify | Level 1 + checklist.md (5 files) |
| **Level 3** | Core + level2-verify + level3-arch | Level 2 + decision-record.md (6 files) |
| **Level 3+** | Core + level2-verify + level3-arch + level3plus-govern | Level 3 + extended checklist sections (6 files) |

**How it works:**

1. **Level 1**: Uses core templates directly (no addendums)
2. **Level 2**: Core spec.md + level2-verify/spec-level2.md sections (NFRs, Edge Cases, Complexity)
3. **Level 3**: Level 2 composition + level3-arch/spec-level3.md sections (Executive Summary, Risk Matrix, User Stories)
4. **Level 3+**: Level 3 composition + level3plus-govern/spec-level3plus.md sections (Approval Workflow, Compliance, Stakeholder Matrix)

Each addendum file contains comment markers indicating where to insert sections into the core template.

---

## 3. 📁 CONTENTS

### level2-verify/

Level 2 verification and quality assurance sections:

| File | Purpose |
|------|---------|
| `spec-level2.md` | Non-functional requirements, edge cases, complexity assessment |
| `plan-level2.md` | Phase dependencies, effort estimation, enhanced rollback |
| `checklist.md` | QA verification checklist (new file for Level 2) |

**Target**: Medium features (100-499 LOC) requiring QA validation.

### level3-arch/

Level 3 architecture and design sections:

| File | Purpose |
|------|---------|
| `spec-level3.md` | Executive summary, full complexity matrix, risk matrix, extended user stories |
| `plan-level3.md` | Dependency graph, critical path analysis, milestone tracking |
| `decision-record.md` | Architecture Decision Record template (new file for Level 3) |

**Target**: Large features (500+ LOC) with architectural impact.

### level3plus-govern/

Level 3+ enterprise governance sections:

| File | Purpose |
|------|---------|
| `spec-level3plus.md` | Approval workflow, compliance checkpoints, stakeholder matrix, change log |
| `plan-level3plus.md` | AI execution framework, workstream coordination, communication plan |
| `checklist-extended.md` | Extended checklist with approval workflow and workstream verification |

**Target**: Complex multi-agent features requiring formal governance.

---

## 4. ⚠️ IMPORTANT WARNING

**DO NOT copy files from `addendum/` directly into your spec folder.**

These are source components used by the template system. When creating a spec folder:

1. Use the composed templates from `../level_N/` directories
2. The level-specific templates already include the appropriate addendum sections
3. Copying from `addendum/` will result in incomplete or incorrectly structured files

**Correct Usage:**
```bash
# Use composed templates from level directories
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/001-feature/
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/001-feature/
```

**Incorrect Usage:**
```bash
# DO NOT copy from addendum/ directly
cp .opencode/skill/system-spec-kit/templates/addendum/level2-verify/spec-level2.md specs/001-feature/
```

---

## 5. 📚 RELATED DOCUMENTS

**Template Directories:**
- `../core/` - Base templates shared across all levels
- `../level_1/` - Small features (<100 LOC)
- `../level_2/` - Medium features (100-499 LOC)
- `../level_3/` - Large features (500+ LOC)
- `../level_3+/` - Enterprise features (Complexity 80+)

**Documentation:**
- `../../references/templates/template_guide.md` - Complete template usage guide
- `../../references/structure/folder_structure.md` - Spec folder organization
- `../../assets/template_mapping.md` - Level selection decision matrix
- `../../assets/level_decision_matrix.md` - Complexity scoring criteria

---

<!--
ADDENDUM TEMPLATES - CORE + ADDENDUM v2.0
- Source components for template composition
- Extend core templates with level-specific sections
- Used by level_N/ templates, not directly by users
- Eliminates duplication while maintaining flexibility
-->
