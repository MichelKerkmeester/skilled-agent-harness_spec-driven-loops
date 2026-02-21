---
description: "Verify accuracy of an existing visual-explainer HTML output and correct errors"
argument-hint: "<html-file-path>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /visual-explainer:fact-check

Verify the accuracy of an existing visual-explainer HTML output file, correct any errors, and produce a verification summary.

## Skill Activation

Load the `sk-visual-explainer` skill:
1. Read `.opencode/skill/sk-visual-explainer/SKILL.md`
2. Load `references/quality_checklist.md` (detailed verification)

## Argument Parsing

```
INPUT: $ARGUMENTS
├─ Required: <html-file-path> — Path to the HTML file to verify
└─ If no arguments: look in .opencode/output/visual/ for the most recent file
```

## Verification Process

### Step 1: Parse Existing Output
- Read the HTML file
- Extract all factual claims, data points, code references, and relationships

### Step 2: Verify Against Sources
- Cross-reference code mentions with actual codebase files
- Verify file paths exist
- Check that code snippets match actual source
- Verify statistical claims (LOC counts, file counts, etc.)
- Validate diagram relationships against actual code structure

### Step 3: Run Quality Checks
Execute all 9 quality checks from `nodes/success-criteria.md`:
1. Squint test
2. Swap test
3. Both themes
4. Information completeness
5. No overflow
6. Mermaid zoom controls
7. File opens cleanly
8. Accessibility
9. Reduced motion

### Step 4: Generate Report
Produce a summary:
- Total claims verified
- Accuracy percentage
- List of corrections made
- Quality check results (pass/fail per check)

### Step 5: Fix and Save
- If errors found: create corrected version
- Save corrected file alongside original with `-verified` suffix
- Output corrections summary to console

## Output

- Corrected file: `{original-name}-verified.html`
- Console summary of all changes made
