# Validation Rules

> Modular shell scripts that validate spec folder structure, content quality, and documentation completeness.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

## 1. 📖 OVERVIEW

### What are Validation Rules?

Validation rules are modular shell scripts that check spec folders for structural correctness, content quality, and documentation completeness. Each rule focuses on a single validation concern and returns standardized results that the orchestrator (`validate-spec.sh`) aggregates.

### Key Statistics

| Category             | Count | Details                                  |
| -------------------- | ----- | ---------------------------------------- |
| Rules                | 9     | Modular validation scripts               |
| Severity Levels      | 3     | error, warn, info                        |
| Documentation Levels | 3     | L1, L2, L3 with progressive requirements |

### Key Features

| Feature                    | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| **Modular Design**         | Each rule is self-contained and independently testable         |
| **Level-Aware**            | Rules adapt validation based on documentation level (L1/L2/L3) |
| **Standardized Interface** | All rules export `run_check()` and set `RULE_*` variables      |
| **Remediation Guidance**   | Failed rules provide actionable fix instructions               |

### Requirements

| Requirement | Minimum | Recommended |
| ----------- | ------- | ----------- |
| Bash        | 3.2+    | 5.0+        |
| grep        | POSIX   | GNU grep    |
| awk         | POSIX   | gawk        |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# Rules are invoked via the orchestrator, not directly
# Navigate to a spec folder and run validation

cd specs/003-memory-and-spec-kit/046-post-release-refinement-1/

# Run validation (automatically invokes all rules)
../../.opencode/skill/system-spec-kit/scripts/validate-spec.sh .
```

### Verify Installation

```bash
# Check that rules are executable
ls -la .opencode/skill/system-spec-kit/scripts/rules/

# Expected: 9 .sh files with execute permissions
# -rwxr-xr-x check-files.sh
# -rwxr-xr-x check-priority-tags.sh
# ...
```

### First Use

```bash
# Validate a spec folder with verbose output
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/my-spec/ --verbose
```

---

## 3. 📁 STRUCTURE

```
rules/
├── check-anchors.sh        # ANCHORS_VALID - Memory file anchor pairs
├── check-evidence.sh       # EVIDENCE_CITED - P0/P1 completion evidence
├── check-files.sh          # FILE_EXISTS - Required files by level
├── check-folder-naming.sh  # FOLDER_NAMING - ###-short-name pattern validation
├── check-frontmatter.sh    # FRONTMATTER_VALID - YAML frontmatter validation
├── check-level.sh          # LEVEL_DECLARED - Explicit vs inferred level
├── check-placeholders.sh   # PLACEHOLDER_FILLED - Unfilled placeholders
├── check-priority-tags.sh  # PRIORITY_TAGS - Checklist priority context
├── check-sections.sh       # SECTIONS_PRESENT - Required markdown sections
└── README.md               # This file
```

### Key Files

| File                     | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `check-files.sh`         | Core validation - ensures required files exist for documentation level |
| `check-folder-naming.sh` | Structure validation - ensures ###-short-name pattern                  |
| `check-frontmatter.sh`   | Metadata validation - validates YAML frontmatter structure             |
| `check-priority-tags.sh` | Quality validation - ensures checklist items have P0/P1/P2 context     |
| `check-evidence.sh`      | Completion validation - ensures completed items cite evidence          |

---

## 4. ⚡ FEATURES

### Rule Interface

All rules implement a standardized interface:

| Variable           | Type   | Description                                    |
| ------------------ | ------ | ---------------------------------------------- |
| `RULE_NAME`        | string | Unique rule identifier (e.g., `FILE_EXISTS`)   |
| `RULE_STATUS`      | enum   | Result: `pass`, `fail`, `warn`, `skip`, `info` |
| `RULE_MESSAGE`     | string | Human-readable result summary                  |
| `RULE_DETAILS`     | array  | Specific issues found                          |
| `RULE_REMEDIATION` | string | How to fix the issue                           |

### Rule Catalog

#### FILE_EXISTS (check-files.sh)

**Purpose**: Validates required files exist for documentation level

| Level | Required Files                   |
| ----- | -------------------------------- |
| L1    | `spec.md`, `plan.md`, `tasks.md` |
| L2    | L1 + `checklist.md`              |
| L3    | L2 + `decision-record.md`        |

**Severity**: error (blocks validation)

---

#### PRIORITY_TAGS (check-priority-tags.sh)

**Purpose**: Validates checklist items have priority context (P0/P1/P2)

**Patterns Recognized**:
- Section headers: `## P0`, `### P1:`, `## P2 - Optional`
- Inline tags: `[P0]`, `[P1]`, `[P2]`, `**P0**`, `**P1**`, `**P2**`

**Severity**: warn (advisory)

---

#### EVIDENCE_CITED (check-evidence.sh)

**Purpose**: Checks completed P0/P1 items have evidence citations

**Evidence Patterns**:
- `[EVIDENCE: description]` or `[Evidence: ...]`
- `| Evidence:` (pipe-separated)
- `✓`, `✔`, `☑`, `✅` with description
- `(verified)`, `(tested)`, `(confirmed)` at end
- `[DEFERRED: reason]` counts as explained

**Severity**: warn (advisory)

---

#### PLACEHOLDER_FILLED (check-placeholders.sh)

**Purpose**: Detects unfilled placeholders in spec files

**Patterns Detected**:
- `[YOUR_VALUE_HERE: ...]`
- `[NEEDS CLARIFICATION: ...]`
- `{{mustache}}` style placeholders

**Severity**: fail (blocks validation)

---

#### ANCHORS_VALID (check-anchors.sh)

**Purpose**: Validates anchor pairs in memory files are properly matched

**Checks**:
- Every `<!-- ANCHOR:id -->` has matching `<!-- /ANCHOR:id -->`
- No orphaned closing anchors
- Reports line numbers for mismatches

**Severity**: fail (blocks validation)

---

#### SECTIONS_PRESENT (check-sections.sh)

**Purpose**: Checks for required markdown sections in spec files

| File                      | Required Sections                               |
| ------------------------- | ----------------------------------------------- |
| `spec.md`                 | Problem Statement, Requirements, Scope          |
| `plan.md`                 | Technical Context, Architecture, Implementation |
| `checklist.md` (L2+)      | P0, P1                                          |
| `decision-record.md` (L3) | Context, Decision, Consequences                 |

**Severity**: warn (advisory)

---

#### LEVEL_DECLARED (check-level.sh)

**Purpose**: Checks if documentation level was explicitly declared vs inferred

**Recommendation**: Add `| **Level** | N |` to spec.md metadata table

**Severity**: info (informational only)

---

#### FOLDER_NAMING (check-folder-naming.sh)

**Purpose**: Validates spec folder follows `###-short-name` naming convention

**Pattern**: `[0-9]{3}-[a-z0-9-]+`

**Examples**:
- ✓ `007-add-authentication`
- ✓ `042-fix-login-bug`
- ✗ `add-authentication` (missing number prefix)
- ✗ `7-feature` (number not zero-padded)
- ✗ `007_feature` (underscore instead of hyphen)

**Severity**: error (blocks validation)

---

#### FRONTMATTER_VALID (check-frontmatter.sh)

**Purpose**: Validates YAML frontmatter structure in markdown files

**Checks**:
- Frontmatter delimiters (`---`) present
- Valid YAML syntax
- No duplicate keys
- Optional: validates expected fields (title, description, etc.)

**Severity**: warn (advisory)

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Basic Validation

```bash
# Validate a spec folder
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/my-feature/

# Output:
# ✓ FILE_EXISTS: All required files present for Level 2
# ✓ PRIORITY_TAGS: All checklist items have priority context
# ⚠ EVIDENCE_CITED: Found 3 completed item(s) without evidence
# ✓ PLACEHOLDER_FILLED: No unfilled placeholders found
```

### Example 2: Verbose Output

```bash
# Get detailed output including passing rules
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/my-feature/ --verbose

# Shows all rule results with details
```

### Example 3: JSON Output

```bash
# Get machine-readable output
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/my-feature/ --json

# Returns structured JSON for programmatic processing
```

### Common Patterns

| Pattern         | Command                               | When to Use         |
| --------------- | ------------------------------------- | ------------------- |
| Quick check     | `validate-spec.sh <folder>`           | Before committing   |
| Detailed review | `validate-spec.sh <folder> --verbose` | Debugging failures  |
| CI integration  | `validate-spec.sh <folder> --json`    | Automated pipelines |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Rule Not Found

**Symptom**: `source: rules/check-*.sh: No such file or directory`

**Cause**: Running from wrong directory or rules not installed

**Solution**:
```bash
# Ensure you're in the project root
cd /path/to/project

# Verify rules exist
ls .opencode/skill/system-spec-kit/scripts/rules/
```

#### Permission Denied

**Symptom**: `bash: ./check-files.sh: Permission denied`

**Cause**: Rule scripts not executable

**Solution**:
```bash
chmod +x .opencode/skill/system-spec-kit/scripts/rules/*.sh
```

#### False Positive on Placeholders

**Symptom**: Rule flags placeholders inside code blocks

**Cause**: Code examples containing placeholder syntax

**Solution**: The rule filters fenced code blocks. If still flagged, wrap in backticks:
```markdown
Use `[YOUR_VALUE_HERE: example]` syntax for placeholders.
```

### Quick Fixes

| Problem           | Quick Fix                                        |
| ----------------- | ------------------------------------------------ |
| Missing files     | Create from templates in `templates/`            |
| No priority tags  | Add `## P0`, `## P1`, `## P2` headers            |
| Missing evidence  | Add `[EVIDENCE: description]` to completed items |
| Unmatched anchors | Check memory files for typos in anchor IDs       |

### Diagnostic Commands

```bash
# Check which rules are available
ls .opencode/skill/system-spec-kit/scripts/rules/*.sh

# Test a single rule manually (advanced)
source .opencode/skill/system-spec-kit/scripts/rules/check-files.sh
run_check "specs/my-spec" 2
echo "Status: $RULE_STATUS, Message: $RULE_MESSAGE"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document                                | Purpose                             |
| --------------------------------------- | ----------------------------------- |
| [validate-spec.sh](../validate-spec.sh) | Orchestrator that invokes all rules |
| [SKILL.md](../../SKILL.md)              | Parent skill documentation          |
| [templates/](../../templates/)          | Spec folder templates               |

### External Resources

| Resource                                                    | Description                  |
| ----------------------------------------------------------- | ---------------------------- |
| [Bash Reference](https://www.gnu.org/software/bash/manual/) | Bash scripting documentation |
| [ShellCheck](https://www.shellcheck.net/)                   | Shell script linting tool    |

---

*Documentation version: 1.0 | Last updated: 2025-12-26*