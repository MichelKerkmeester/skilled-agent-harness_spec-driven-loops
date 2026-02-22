---
description: Verify accuracy of an existing visual-explainer HTML output and correct errors with artifact-aware checks
argument-hint: "[html-file-path] [--source-file <path>] [--spec-folder <path>] [--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Fact Check

Verify factual and structural correctness of an existing visual-explainer HTML file, then emit a corrected output and verification summary.

---

## 1. PURPOSE

Run deterministic checks against source truth (codebase/files/data), fix inaccuracies, and provide a transparent verification report for trustworthy visual outputs.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional:
- `[html-file-path]`
- `--source-file <path>`
- `--spec-folder <path>`
- `--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>`

**Defaults:**
- target HTML: newest file in `.opencode/output/visual/` when omitted
- artifact: `auto`

**Outputs:** `{original-name}-verified.html` and structured verification summary

**Status:** `STATUS=OK ACTION=verify PATH=<verified-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` verification resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/speckit_artifact_profiles.md`
- `references/speckit_user_guide_profiles.md`
- `references/quality_checklist.md`

---

## 4. ARGUMENT ROUTING

- If `[html-file-path]` is provided: verify that file.
- If omitted: select newest file under `.opencode/output/visual/`.
- If no candidate exists: return `STATUS=FAIL ERROR="No visual output found to verify"`.
- Resolve source-of-truth in this order:
  1. `--source-file`
  2. `ve-source-doc` metadata in HTML
  3. inferred file from `--spec-folder` + artifact profile

---

## 5. INSTRUCTIONS

### Step 1: Parse Existing Output

- read target HTML
- extract factual claims, numbers, file references, relationship statements
- parse metadata contract tags when present:
  - `ve-artifact-type`
  - `ve-source-doc`
  - `ve-speckit-level`
  - `ve-view-mode`

### Step 2: Resolve Artifact Profile

- if `--artifact != auto`, use explicit artifact
- otherwise infer from metadata + source doc signatures
- if artifact is unknown, continue generic checks and mark profile status as `unresolved`

### Step 3: Verify Against Sources

- check referenced files and paths exist
- validate snippets and counts against source docs
- recompute numerical claims (coverage %, counts, statuses)
- validate graph/matrix consistency for traceability mode
- for SpecKit artifacts, validate required sections/anchors/cross refs

### Step 4: Run Quality Checks

Execute quality checklist items and capture pass/fail status per check, including:
- placeholder leakage detection
- cross-doc link integrity
- metadata contract completeness (when artifact-aware output)

### Step 5: Correct and Save

- apply required corrections
- save corrected output with `-verified` suffix
- preserve original unless user explicitly requests overwrite

### Step 6: Return Structured Status

Return:
- verified claims count
- accuracy percentage
- corrections list
- metadata/profile validation summary
- quality check summary
- `STATUS=OK ACTION=verify PATH=<verified-path>`

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Target HTML not found | Return `STATUS=FAIL ERROR="HTML file not found: <path>"` |
| Source data unavailable for claim verification | Mark claim as unverified and include in report |
| `--source-file` or `--spec-folder` path missing | Return `STATUS=FAIL` with missing path detail |
| Parse failure on malformed HTML | Return `STATUS=FAIL ERROR="Unable to parse HTML for verification"` |
| Write failure for verified output | Return `STATUS=FAIL ERROR="Unable to write verified output"` |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=verify PATH=<verified-path>
SUMMARY="Verified visual output with artifact-aware checks and applied factual/quality corrections"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:fact-check
/visual-explainer:fact-check ".opencode/output/visual/generate-auth-flow-20260222-103000.html"
/visual-explainer:fact-check ".opencode/output/visual/plan-review-auth-20260222-113000.html" --source-file "specs/007-auth/plan.md" --artifact plan
/visual-explainer:fact-check ".opencode/output/visual/plan-review-auth-20260222-113000.html" --spec-folder "specs/007-auth" --artifact auto
```
