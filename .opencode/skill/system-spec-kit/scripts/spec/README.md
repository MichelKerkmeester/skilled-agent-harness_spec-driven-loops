# Spec Scripts

> Bash scripts for creating, validating, and managing spec folders in the SpecKit workflow.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

## 1. 📖 OVERVIEW

### What are Spec Scripts?

The `scripts/spec/` directory contains Bash scripts that automate spec folder lifecycle management in the SpecKit system. These scripts handle creation, validation, archiving, level recommendation, and completion verification for spec folders.

### Key Features

| Feature | Description |
|---------|-------------|
| **Template-Based Creation** | Generate spec folders from templates (Level 1-3+) with appropriate documentation files |
| **Validation Orchestration** | Validate spec folders against rule-based requirements with detailed error reporting |
| **Level Recommendation** | Algorithmic level recommendation based on LOC, files, and complexity factors |
| **Completion Tracking** | Calculate completeness percentage and verify task completion status |
| **Archive Management** | Archive old spec folders to maintain clean workspace |

### Requirements

| Requirement | Minimum | Details |
|-------------|---------|---------|
| Bash | 3.2+ | macOS and Linux compatible |
| Core Utils | standard | date, readlink, grep, sed |

---

## 2. 🚀 QUICK START

### Create a New Spec Folder

```bash
# Create Level 1 spec folder (default)
./scripts/spec/create.sh my-feature

# Create Level 2 spec folder with checklist
./scripts/spec/create.sh --level 2 my-feature

# Create Level 3 spec folder with decision record
./scripts/spec/create.sh --level 3 my-feature
```

### Validate a Spec Folder

```bash
# Validate with standard output
./scripts/spec/validate.sh specs/042-my-feature

# Validate with JSON output
./scripts/spec/validate.sh --json specs/042-my-feature

# Strict mode (warnings as errors)
./scripts/spec/validate.sh --strict specs/042-my-feature
```

### Check Completion Status

```bash
# Check completion percentage
./scripts/spec/check-completion.sh specs/042-my-feature

# Calculate completeness score
./scripts/spec/calculate-completeness.sh specs/042-my-feature
```

---

## 3. 📁 STRUCTURE

```
scripts/spec/
├── create.sh                  # Create spec folders from templates
├── validate.sh                # Validate spec folders against rules
├── recommend-level.sh         # Recommend SpecKit level based on complexity
├── check-completion.sh        # Verify completion status
├── calculate-completeness.sh  # Calculate completeness percentage
└── archive.sh                 # Archive old/completed spec folders
```

### Key Files

| File | Purpose |
|------|---------|
| `create.sh` | Creates spec folders with template files based on level (1, 2, 3, 3+) |
| `validate.sh` | Orchestrates validation rules for spec folder completeness and correctness |
| `recommend-level.sh` | Analyzes task complexity (LOC, files, risk factors) and recommends appropriate level |
| `check-completion.sh` | Verifies all P0/P1 checklist items are complete |
| `calculate-completeness.sh` | Calculates percentage of completed checklist items |
| `archive.sh` | Moves completed or old spec folders to archive directory |

---

## 4. 🛠️ TROUBLESHOOTING

### Common Issues

#### Validation fails with "file not found"

**Symptom**: `ERROR: Required file missing: spec.md`

**Cause**: Spec folder created manually without required template files

**Solution**:
```bash
# Recreate with proper templates
./scripts/spec/create.sh --level 1 <folder-name>
```

#### Level recommendation seems incorrect

**Symptom**: Script recommends Level 1 but task feels complex

**Cause**: Algorithm weights multiple factors (LOC, files, risk, complexity)

**Solution**: Override recommendation if needed or add flags:
```bash
# Add complexity flags for accurate scoring
./scripts/spec/recommend-level.sh --loc 200 --files 8 --api --db --architectural
```

#### Archive script moves active spec folder

**Symptom**: Working spec folder moved to archive

**Cause**: Folder matches archive pattern (z_, archive, old)

**Solution**: Rename folder to avoid archive patterns:
```bash
# Don't use archive-triggering prefixes
mv specs/z_042-feature specs/042-feature
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Permission denied | `chmod +x scripts/spec/*.sh` |
| Template not found | Ensure `.opencode/skill/system-spec-kit/templates/` exists |
| Validation rules failing | Run `./scripts/spec/validate.sh --verbose` for details |
| JSON output malformed | Update to Bash 4+ or use `--json` without color output |

### Diagnostic Commands

```bash
# Check script permissions
ls -la scripts/spec/*.sh

# Test validation with verbose output
./scripts/spec/validate.sh --verbose specs/042-feature

# View available templates
ls -la .opencode/skill/system-spec-kit/templates/
```

---

## 5. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [system-spec-kit/SKILL.md](../../SKILL.md) | Parent skill documentation |
| [templates/](../../templates/) | Template files for each level |
| [scripts/rules/](../rules/) | Validation rule definitions |
| [references/validation/validation_rules.md](../../references/validation/validation_rules.md) | Validation rule reference |

### External Resources

| Resource | Description |
|----------|-------------|
| [Bash Best Practices](https://google.github.io/styleguide/shellguide.html) | Google Shell Style Guide |
| [ShellCheck](https://www.shellcheck.net/) | Shell script static analysis tool |

---

*Documentation version: 1.0 | Last updated: 2026-01-21*
