# System-Spec-Kit Scripts

This directory contains shell scripts for spec folder management and validation.

## Scripts Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| `create-spec-folder.sh` | Create new spec folders with templates | `./create-spec-folder.sh --name feature --level 2` |
| `check-prerequisites.sh` | Validate spec folder has required files | `./check-prerequisites.sh specs/007-feature/` |
| `calculate-completeness.sh` | Calculate checklist completion percentage | `./calculate-completeness.sh specs/007-feature/` |
| `recommend-level.sh` | Recommend documentation level based on LOC | `./recommend-level.sh --loc 250 --files 5` |
| `archive-spec.sh` | Archive completed spec folders | `./archive-spec.sh specs/007-feature/` |
| `common.sh` | Shared utility functions | Sourced by other scripts |

## Dependencies

- **Bash 4.0+** - Required for associative arrays
- **bc** - Required for percentage calculations in calculate-completeness.sh
- **git** - Optional, for branch detection and git-aware features

## Script Details

### create-spec-folder.sh

Creates a new spec folder with appropriate templates based on documentation level.

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `--name` | Yes | Feature name (will be sanitized) |
| `--level` | Yes | Documentation level (1, 2, or 3) |
| `--prefix` | No | Custom number prefix (auto-detected if omitted) |

**Examples:**
```bash
# Create Level 1 spec folder
./create-spec-folder.sh --name "user-auth" --level 1

# Create Level 2 with custom prefix
./create-spec-folder.sh --name "api-refactor" --level 2 --prefix 015
```

**Exit Codes:**
- `0` - Success
- `1` - Invalid arguments or missing dependencies
- `2` - Folder already exists

### check-prerequisites.sh

Validates that a spec folder contains required files for its level.

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `[path]` | Yes | Path to spec folder |

**Checks Performed:**
- Level 1: spec.md, plan.md, tasks.md
- Level 2: Level 1 + checklist.md
- Level 3: Level 2 + decision-record.md

**Exit Codes:**
- `0` - All prerequisites met
- `1` - Missing required files

### calculate-completeness.sh

Calculates the completion percentage of a checklist.md file.

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `[path]` | Yes | Path to spec folder |
| `--json` | No | Output in JSON format |

**Output:**
```
Completeness: 75% (15/20 items)
P0: 100% (5/5)
P1: 80% (4/5)
P2: 60% (6/10)
```

### recommend-level.sh

Recommends a documentation level based on project metrics.

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `--loc` | Yes | Estimated lines of code |
| `--files` | No | Number of files affected |
| `--risk` | No | Risk level (low, medium, high) |

**Recommendation Logic:**
- Level 1: <100 LOC, low risk
- Level 2: 100-499 LOC, or medium risk
- Level 3: ≥500 LOC, or high risk, or architectural changes

### common.sh

Shared utility functions sourced by other scripts.

**Key Functions:**
- `log_info()` - Blue info messages
- `log_success()` - Green success messages
- `log_warning()` - Yellow warning messages
- `log_error()` - Red error messages
- `find_project_root()` - Locate project root directory
- `get_next_spec_number()` - Get next available spec folder number
- `sanitize_name()` - Sanitize folder names for filesystem

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPECKIT_TEMPLATES_DIR` | Auto-detected | Override templates directory |
| `SPECKIT_VERBOSE` | `false` | Enable verbose output |

## Troubleshooting

### "bc command not found"
Install bc: `brew install bc` (macOS) or `apt install bc` (Linux)

### "Templates directory not found"
Ensure you're running from the project root or set `SPECKIT_TEMPLATES_DIR`

### "Permission denied"
Make scripts executable: `chmod +x *.sh`

## Related Documentation

- [SKILL.md](../SKILL.md) - Main skill documentation
- [template_guide.md](../references/template_guide.md) - Template usage guide
- [level_specifications.md](../references/level_specifications.md) - Level requirements
