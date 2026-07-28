---
title: Workflow Examples and Batch Processing - Mode 1
description: Worked command examples and batch/multi-file extraction recipes for document-quality runs.
trigger_phrases:
  - "doc quality command examples"
  - "batch extract structure"
  - "multi file quality check"
  - "quick validate batch"
importance_tier: normal
contextType: implementation
version: 1.8.0.1
---

# Workflow Examples and Batch Processing

Worked command recipes for common create-quality-control runs and batch/multi-file processing. These are copy-paste starting points; the executable workflow lives in `SKILL.md` §2.

For execution modes see [workflows.md](./workflows.md). For the validation sequence see [validation-and-enforcement.md](./validation-and-enforcement.md).

---

## 1. OVERVIEW

This file collects copy-paste command recipes for the create-quality-control workflow: single-file worked examples (new SKILL creation, README optimization, pre-commit validation) plus multi-file and batch-processing recipes.

---

## 2. COMMON WORKFLOW EXAMPLES

**Example 1: New SKILL Creation**
```bash
# 1. Create file
mkdir .opencode/skills/my-skill
cd .opencode/skills/my-skill

# 2. Write initial SKILL.md
# (Run quick validation to check frontmatter)
../shared/scripts/quick_validate.py .

# 3. Extract structure for AI analysis
../shared/scripts/extract_structure.py SKILL.md
# AI evaluates JSON output and provides quality assessment

# Expected: No checklist failures, high AI-friendliness rating
```

**Example 2: README Optimization**
```bash
# Extract current README structure
../shared/scripts/extract_structure.py README.md

# AI receives JSON with:
# - Metrics (word count, heading depth, code ratio)
# - Checklist results for README type
# - Evaluation questions to answer

# AI provides improvement recommendations
```

**Example 3: Pre-Commit Validation**
```bash
# Extract spec structure for review
../shared/scripts/extract_structure.py specs/042/spec.md

# AI evaluates:
# - Structure checklist results
# - Content quality assessment
# - Improvement recommendations (if any)
```

---

## 3. BATCH PROCESSING

**Multi-file extraction**:
```bash
# Extract structure from all spec files for batch analysis
for file in $(find specs/ -name "spec.md"); do
  echo "=== $file ==="
  ../shared/scripts/extract_structure.py "$file"
done
```

**Quick validation batch**:
```bash
# Validate all skills in directory
for skill in $(find .opencode/skills/ -maxdepth 1 -type d); do
  ../shared/scripts/quick_validate.py "$skill" --json
done
```

---

## RELATED RESOURCES

- [workflows.md](./workflows.md) - Four execution modes and mode selection
- [validation-and-enforcement.md](./validation-and-enforcement.md) - Validation touchpoints, enforcement prompts, troubleshooting
- [quick-reference.md](../../shared/references/quick-reference.md) - Quick command reference
