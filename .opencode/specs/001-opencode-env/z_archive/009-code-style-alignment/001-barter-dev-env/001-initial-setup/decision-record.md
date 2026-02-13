---
title: ADRs - Barter Dev Environment Initial Setup
description: Architecture Decision Records for skill knowledge organization
level: 3
status: accepted
created: 2024-12-31
---

# Architecture Decision Records

This document contains ADRs for the Barter development environment initial setup.

---

## ADR-001: Knowledge Migration to Skill Subfolders

### Status

**ACCEPTED** - 2024-12-31

### Context

The Barter development environment uses a symlink-based architecture where:
- Stack-specific knowledge lives in `repositories/*/knowledge/`
- The `workflows-code` skill uses a REDIRECT.md file pointing to `.opencode/knowledge/`
- `.opencode/knowledge/` is a symlink to the project's knowledge folder

**Problem:** This pattern breaks OpenCode's skill calling mechanism because:
1. Skills expect resources at RELATIVE paths inside the skill folder
2. REDIRECT.md points to EXTERNAL paths outside the skill
3. Symlinks require environment setup (`BARTER_AI_SPECKIT`)
4. The skill is not self-contained or portable

### Decision

**Migrate all stack-specific knowledge INTO the skill as subfolders.**

#### New Structure

```
workflows-code/references/
├── common/                     # Universal patterns
├── backend-system/             # Go knowledge (from repositories/)
├── fe-partners-app/            # Angular knowledge
├── barter-expo/                # React Native knowledge
├── gaia-services/              # Python knowledge
└── postgres-backup-system/     # DevOps knowledge
```

#### Key Design Choices

1. **Use repository folder names** (not stack names) for consistency
   - `backend-system` not `go`
   - `fe-partners-app` not `angular`

2. **Add stack-to-folder mapping** in SKILL.md
   - `GO_BACKEND` → `backend-system`
   - `ANGULAR` → `fe-partners-app`

3. **Keep original files** in `repositories/*/knowledge/` as backup

4. **Keep specs separate** - `repositories/*/specs/` stays where it is

### Alternatives Considered

#### Option A: Keep Symlink Pattern (Rejected)
- **Pros:** No migration effort
- **Cons:** Fundamentally breaks skill calling; not portable

#### Option B: Create Stack-Specific Skills (Rejected)
- **Pros:** Clean separation
- **Cons:** Duplicates common patterns; 5+ skills to maintain

#### Option C: Create New `stack-standards` Skill (Rejected)
- **Pros:** Separation of concerns
- **Cons:** Two skills to coordinate; more complexity

#### Option D: Bundle Into workflows-code (ACCEPTED)
- **Pros:** Self-contained; follows skill design; single source
- **Cons:** Larger skill folder (47 files, ~690 KB)

### Consequences

#### Positive
- Skill calling works correctly
- No external dependencies required
- Skill is portable across environments
- Single source of truth for patterns

#### Negative
- Skill folder grows significantly (~47 files)
- Changes to knowledge require updating the skill
- Duplicate copies (originals remain in repositories/)

#### Neutral
- Stack detection logic moves into SKILL.md
- Project specs remain in repositories/

### Implementation

See `plan.md` for detailed implementation steps.

### References

- Analysis findings: `implementation-summary.md`
- OpenCode skill architecture: `.opencode/skill/workflows-documentation/`
- Existing subfolder pattern: `workflows-documentation/assets/flowcharts/`

---

## ADR-002: References vs Assets Classification

### Status

**ACCEPTED** - 2024-12-31

### Context

After migrating 46 knowledge files to `references/` subfolders (ADR-001), analysis revealed that not all files serve the same purpose. Some are conceptual documentation (read to understand), while others are templates or copy-paste resources (copy to use).

This distinction was not addressed in the initial migration, resulting in all files being placed in `references/` regardless of their actual usage pattern.

### Decision

**Classify bundled knowledge into two categories based on usage pattern.**

#### Classification Criteria

| Category | Purpose | Example Content |
|----------|---------|-----------------|
| `references/` | READ to understand | Standards, patterns, architecture docs |
| `assets/` | COPY to use | Templates, deployment scripts, test fixtures |

#### Decision Rules

1. **references/** - Files you read to gain knowledge or context
   - Coding standards and conventions
   - Architectural patterns and decisions
   - API documentation (conceptual)
   - Best practices guides

2. **assets/** - Files you copy, adapt, or execute
   - Boilerplate templates
   - Deployment scripts and configurations
   - Test fixtures and sample data
   - Copy-paste code snippets

### Alternatives Considered

#### Option A: Keep Everything in references/ (Rejected)
- **Pros:** Simpler structure, no reclassification needed
- **Cons:** Unclear when to read vs copy; cognitive overhead

#### Option B: Create Category Subfolders (Rejected)
- **Pros:** More granular organization
- **Cons:** Too many hierarchy levels; harder to navigate

#### Option C: Use Naming Conventions (Rejected)
- **Pros:** No folder changes needed
- **Cons:** Inconsistent; relies on naming discipline

#### Option D: Two Top-Level Folders (ACCEPTED)
- **Pros:** Clear mental model; aligns with workflows-documentation conventions
- **Cons:** Requires maintaining two folder hierarchies

### Consequences

#### Positive
- Clearer mental model for when to read vs copy
- Aligns with existing `workflows-documentation` skill conventions
- Reduces confusion about file purpose
- Enables different handling (e.g., assets could be auto-copied)

#### Negative
- Requires maintaining two folder hierarchies
- Migration effort to reclassify existing files
- Some files may be ambiguous (judgment calls needed)

#### Neutral
- Total file count remains the same
- No changes to file content, only location

### Implementation

**Files Reclassified (10 files moved from `references/` to `assets/`):**

| Stack | File | Reason |
|-------|------|--------|
| backend-system | `fly_deployment.md` | Deployment template/script |
| backend-system | `fly_machines.md` | Infrastructure configuration |
| fe-partners-app | `angular_style_guide.md` | Code patterns to copy |
| fe-partners-app | `component_templates.md` | Boilerplate templates |
| fe-partners-app | `form_patterns.md` | Copy-paste patterns |
| fe-partners-app | `testing_patterns.md` | Test fixture templates |
| barter-expo | `test_fixtures.md` | Testing template |
| postgres-backup-system | `deployment_runbook.md` | Deployment script |
| postgres-backup-system | `api_endpoints.md` | API template/reference |
| postgres-backup-system | `backup_scripts.md` | Executable scripts |

### References

- ADR-001: Knowledge Migration to Skill Subfolders
- workflows-documentation skill: `.opencode/skill/workflows-documentation/`
- Asset folder convention: `workflows-documentation/assets/`
