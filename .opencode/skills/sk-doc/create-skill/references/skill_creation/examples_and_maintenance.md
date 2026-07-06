---
title: Skill Examples and Maintenance
description: Worked example skills (PDF editor, brand guidelines, database query) and the maintenance workflow for updating and versioning skills over time.
trigger_phrases:
  - "example skills directory structure"
  - "skill maintenance workflow"
  - "when to update skills"
  - "skill semantic versioning"
  - "skill update triggers"
importance_tier: normal
contextType: implementation
version: 1.8.0.1
---

# Skill Examples and Maintenance

Concrete example skill layouts to model new skills on, plus the workflow for keeping a skill healthy and versioned after it ships.

---

## 1. OVERVIEW

This reference pairs worked example skills with the ongoing maintenance workflow. The examples show how anatomy and bundled resources come together for real skill types; the maintenance section covers when and how to update and version a skill.

**Core Principle**: A skill is never "done" — model new skills on proven layouts, then iterate from real usage.

**When to Use**:
- Looking for a concrete layout to model a new skill on
- Deciding whether an existing skill needs an update
- Choosing a version bump (major/minor/patch) for a skill change

**Key Sources**:
- [overview.md](./overview.md) - skill anatomy these examples instantiate
- [creation_workflow.md](./creation_workflow.md) - the create process that produces them

---

## 2. EXAMPLE SKILLS

### Example 1: PDF Editor Skill

**Purpose**: Rotate, crop, and edit PDF files

**Directory Structure**:
```
pdf-editor/
├── SKILL.md
├── scripts/
│   ├── rotate_pdf.py
│   ├── crop_pdf.py
│   └── merge_pdfs.py
└── references/
    └── pdf_operations.md
```

**SKILL.md Highlights**:
- When to use: PDF manipulation tasks
- How it works: References scripts for operations
- Rules: Always validate PDF before processing
- Success criteria: Operation completes without corruption

**Bundled Resources**:
- `scripts/rotate_pdf.py` - Rotate PDF pages
- `scripts/crop_pdf.py` - Crop PDF regions
- `scripts/merge_pdfs.py` - Merge multiple PDFs
- `references/pdf_operations.md` - PyPDF2 documentation

### Example 2: Brand Guidelines Skill

**Purpose**: Apply company branding to documents

**Directory Structure**:
```
brand-guidelines/
├── SKILL.md
├── assets/
│   ├── logo.png
│   ├── logo-dark.png
│   └── color_palette.json
└── references/
    └── brand_guidelines.md
```

**SKILL.md Highlights**:
- When to use: Creating customer-facing documents
- How it works: Apply branding from assets/
- Rules: Always use official logo, follow color palette
- Success criteria: Document matches brand guidelines

**Bundled Resources**:
- `assets/logo.png` - Primary logo
- `assets/logo-dark.png` - Dark mode logo
- `assets/color_palette.json` - Official colors
- `references/brand_guidelines.md` - Detailed brand rules

### Example 3: Database Query Skill

**Purpose**: Query company database with proper schemas

**Directory Structure**:
```
database-query/
├── SKILL.md
└── references/
    ├── schema.md
    └── common_queries.md
```

**SKILL.md Highlights**:
- When to use: Querying company database
- How it works: Reference schema, construct queries
- Rules: Always use prepared statements, check permissions
- Success criteria: Query executes successfully, returns expected data

**Bundled Resources**:
- `references/schema.md` - Database schema documentation
- `references/common_queries.md` - Query pattern examples

---

## 3. SKILL MAINTENANCE

### When to Update Skills

**Update triggers**:
1. Skill struggles with common use cases
2. User feedback indicates confusion
3. New features needed
4. Bundled resources become outdated
5. Writing style inconsistencies discovered

### Update Workflow

1. **Identify Issue**: Use skill, notice problem
2. **Diagnose**: SKILL.md unclear? Missing resource? Outdated info?
3. **Fix**: Update relevant files
4. **Validate**: Run quality validation
5. **Repackage**: Create new zip file
6. **Test**: Try skill on real task
7. **Document**: Note changes in version history

### Versioning

**Semantic Versioning** (recommended):
- Major (1.0.0 → 2.0.0): Breaking changes, complete restructure
- Minor (1.0.0 → 1.1.0): New features, new bundled resources
- Patch (1.0.0 → 1.0.1): Bug fixes, typo corrections

**Update frontmatter version field**:
```yaml
---
name: markdown-optimizer
description: Complete document quality pipeline...
version: 2.0.0
---
```

---

## 4. RELATED RESOURCES

### Sibling Skill-Creation References
- [overview.md](./overview.md) - Skill anatomy and structure system
- [creation_workflow.md](./creation_workflow.md) - The 6-step skill creation process
- [validation_and_packaging.md](./validation_and_packaging.md) - Validation requirements and distribution

### Reference Files
- [core_standards.md](../../../shared/references/global/core_standards.md) - Document type rules and structural requirements
