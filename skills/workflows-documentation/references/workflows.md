# Workflows - Execution Modes and Enforcement Patterns

Comprehensive reference for execution modes, validation patterns, structure workflows, and step interactions for the markdown documentation workflow.

---

## 1. 📖 INTRODUCTION & PURPOSE

### What Are Workflows?

Workflows define the execution patterns and operational modes for the markdown documentation workflow. These workflows orchestrate structure checks, AI-assisted review, and (when desired) content improvement.

**Core Purpose**:
- **Mode selection** - Four execution modes for different use cases
- **Validation workflow** - Post-operation and pre-submission validation patterns
- **Phase orchestration** - Sequential or independent phase execution
- **Error handling** - Graceful degradation with clear error messages

**Progressive Disclosure Context**:
```
Level 1: SKILL.md metadata (name + description)
         └─ Always in context (~100 words)
            ↓
Level 2: SKILL.md body
         └─ When skill triggers (<5k words)
            ↓
Level 3: Reference files (this document)
         └─ Loaded as needed for workflow details
```

This reference file provides Level 3 deep-dive technical guidance on execution modes, validation patterns, and workflow orchestration.

### Core Principle

**"Structure first, optimize second, validate always"** - Enforce valid markdown structure before content optimization, then verify quality at every stage.

---

## 2. ⚙️ FOUR EXECUTION MODES

| Workflow | Phases | Command | Use When | Output |
| --- | --- | --- | --- | --- |
| **Script-assisted review** | 1+2 | `extract` + AI eval | Critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations |
| **Structure checks** | 1 | `validate` | File save, structural validation | Checklist results + fix list |
| **Content optimization** | 2 | `extract` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
| **Audit snapshot** | 1 (JSON only) | `extract` | Quality audit, no changes | JSON report for another agent |

**Mode selection**:
- Creating new SKILL/Knowledge → Script-assisted review
- Saving files → Structure checks
- Improving README → Content optimization
- Pre-release check → Structure checks + review

---

## 3. 🔗 VALIDATION INTEGRATION

> **Note:** In environments with hooks, these validations run automatically.
> Otherwise, apply these checks manually after file operations.

**Post-Write Validation** (`enforce-markdown-post`):
- **Trigger**: After Write/Edit operations on `.md` files
- **Action**: Filename corrections (ALL CAPS → lowercase, hyphens → underscores)
- **Blocking**: No (logs only)
- **Speed**: <50ms per file

**Pre-Submit Validation** (`enforce-markdown-strict`):
- **Trigger**: Before processing prompts
- **Action**: Structure validation + safe auto-fixes
- **Blocking**: Yes (on critical violations)
- **Speed**: <200ms per file

**Validation workflow**:
```
User saves file
    ↓
Post-Write: Fix filename (non-blocking)
    ↓
User submits prompt
    ↓
Pre-Submit: Validate structure
    ├─ Safe violations → Auto-fix → Continue
    └─ Critical violations → Block → Show fixes
```

---

## 4. 🛠️ ENFORCEMENT WORKFLOWS

### ️ Workflow 1: Add Missing Frontmatter

**Detection**: SKILL/Command file, no `---` at line 1

**Fix approach**:
1. Determine document type (SKILL vs Command)
2. Ask the user for metadata
3. Insert frontmatter template at line 1

**Approval prompt template**:
```
Missing required frontmatter. Add the following to line 1?

---
name: [skill-name]
description: [Brief description]
allowed-tools: Read, Write, Edit, Bash
---

Options:
A) Add frontmatter as shown
B) Let me edit manually
C) Skip this file
```

### Workflow 2: Fix Section Order

**Detection**: Required sections out of sequence

**Fix approach**:
1. Identify current section order
2. Map to required order for document type
3. Show proposed reordering

**Approval prompt template**:
```
Section order incorrect. Reorder to match standard?

Current: [current order]
Required: [required order]

Options:
A) Reorder automatically
B) Let me reorder manually
C) Skip validation
```

### Workflow 3: Add Missing Sections

**Detection**: Required section absent (e.g., RULES in SKILL)

**Fix approach**:
1. Identify missing sections
2. Generate section template
3. Insert at appropriate position

**Approval prompt template**:
```
Missing required section: [SECTION NAME]

Add template section at line [N]?

## N.  [SECTION NAME]
[Template content]

Options:
A) Add template section
B) Let me add manually
C) Skip this section
```

---

## 5. 🔄 PHASE INTERACTIONS

**Independent execution**:
- Phase 1 (Enforcement) → Standalone structure validation
- Phase 2 (Optimization) → Standalone content improvement
- Step 3 (Recommendations) → Standalone review output

**Sequential chaining** (script-assisted review):
```
Phase 1: Extract structure (extract_structure.py)
    ├─ Critical violations in checklist? → STOP
    └─ Valid → Continue
        ↓
Phase 2: AI evaluates JSON output
    ├─ Low quality assessment? → WARNING
    └─ Continue
        ↓
Phase 3: AI provides recommendations
    ├─ Issues found? → REPORT
    └─ Complete
```

**Error handling**:
- Phase 1 critical → Block execution, manual fix required
- Phase 2 weak content coverage → Warning + suggestions, continues
- Phase 3 major gaps detected → Report + improvement plan

---

## 6. 📝 COMMON WORKFLOW EXAMPLES

**Example 1: New SKILL Creation**
```bash
# 1. Create file
mkdir .opencode/skills/my-skill
cd .opencode/skills/my-skill

# 2. Write initial SKILL.md
# (Run quick validation to check frontmatter)
scripts/quick_validate.py .

# 3. Extract structure for AI analysis
scripts/extract_structure.py SKILL.md
# AI evaluates JSON output and provides quality assessment

# Expected: No checklist failures, high AI-friendliness rating
```

**Example 2: README Optimization**
```bash
# Extract current README structure
scripts/extract_structure.py README.md

# AI receives JSON with:
# - Metrics (word count, heading depth, code ratio)
# - Checklist results for README type
# - Evaluation questions to answer

# AI provides improvement recommendations
```

**Example 3: Pre-Commit Validation**
```bash
# Extract spec structure for review
scripts/extract_structure.py specs/042/spec.md

# AI evaluates:
# - Structure checklist results
# - Content quality assessment
# - Improvement recommendations (if any)
```

---

## 7. 📦 BATCH PROCESSING

**Multi-file extraction**:
```bash
# Extract structure from all spec files for batch analysis
for file in $(find specs/ -name "spec.md"); do
  echo "=== $file ==="
  scripts/extract_structure.py "$file"
done
```

**Quick validation batch**:
```bash
# Validate all skills in directory
for skill in $(find .opencode/skills/ -maxdepth 1 -type d); do
  scripts/quick_validate.py "$skill" --json
done
```

---

## 8. 🔧 QUICK TROUBLESHOOTING

| Issue | Cause | Solution |
|-------|-------|----------|
| "Execution blocked" | Critical violation | Read error message, apply suggested fix |
| JSON parse error | Invalid markdown structure | Check for unclosed code blocks or frontmatter |
| Wrong type detected | File location mismatch | Check document type detection in JSON output |
| Checklist failures | Structure issues | Review checklist results in JSON, fix violations |
| Validation not running | Environment difference | Apply checks manually (see Section 3) |
| Safe fix not applied | Permission issue | Check file permissions |

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [core_standards.md](./core_standards.md) - Document type rules and structural requirements
- [optimization.md](./optimization.md) - Content transformation patterns
- [validation.md](./validation.md) - Quality scoring and validation workflows
- [quick_reference.md](./quick_reference.md) - Quick command reference

### Templates
- [skill_md_template.md](../assets/skill_md_template.md) - SKILL.md file templates
- [command_template.md](../assets/command_template.md) - Command file templates