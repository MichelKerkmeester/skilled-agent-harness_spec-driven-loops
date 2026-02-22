---
description: Verify accuracy of an existing visual-explainer HTML output and correct errors
argument-hint: "[html-file-path]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Fact Check

Verify factual and structural correctness of an existing visual-explainer HTML file, then emit a corrected output and verification summary.

---

## 1. PURPOSE

Run deterministic checks against source truth (codebase/files/data), fix inaccuracies, and provide a transparent verification report for trustable visuals.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional `[html-file-path]`.
**Default:** Most recent file in `.opencode/output/visual/` when omitted.
**Outputs:** `{original-name}-verified.html` and structured verification summary.
**Status:** `STATUS=OK ACTION=verify PATH=<verified-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` verification resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quality_checklist.md`

---

## 4. ARGUMENT ROUTING

- If `[html-file-path]` provided: verify that file.
- If omitted: select newest file under `.opencode/output/visual/`.
- If no candidate exists: return `STATUS=FAIL ERROR="No visual output found to verify"`.

---

## 5. INSTRUCTIONS

### Step 1: Parse Existing Output

- Read the target HTML file.
- Extract factual claims, numbers, file references, and relationship statements.

### Step 2: Verify Against Sources

- Check referenced files and paths exist.
- Validate code snippets against source files.
- Recompute numerical claims (file counts, LOC, percentages).
- Validate diagram relationships against actual structure.

### Step 3: Run Quality Checks

Execute quality checklist items and capture pass/fail status per check.

### Step 4: Correct and Save

- Apply required corrections.
- Save corrected output with `-verified` suffix.
- Preserve original unless user explicitly requests overwrite.

### Step 5: Return Structured Status

Return:
- Verified claims count
- Accuracy percentage
- Corrections list
- Quality check summary
- `STATUS=OK ACTION=verify PATH=<verified-path>`

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Target HTML not found | Return `STATUS=FAIL ERROR="HTML file not found: <path>"` |
| No source data available for claim verification | Mark claim as unverified and include in report |
| Parse failure on malformed HTML | Return `STATUS=FAIL ERROR="Unable to parse HTML for verification"` |
| Write failure for verified output | Return `STATUS=FAIL ERROR="Unable to write verified output"` |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=verify PATH=<verified-path>
SUMMARY="Verified visual output and applied factual/quality corrections"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:fact-check
/visual-explainer:fact-check ".opencode/output/visual/generate-auth-flow-20260222-103000.html"
```
