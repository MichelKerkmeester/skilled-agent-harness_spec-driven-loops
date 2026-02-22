---
description: Generate a styled HTML visual review of git diffs, commits, or pull requests with optional SpecKit doc impact analysis
argument-hint: "[branch|commit|PR#] [--spec-folder <path>] [--include-doc-impact]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Diff Review

Generate a comprehensive HTML review for branch diffs, single commits, PRs, or the current working tree, including an optional SpecKit documentation impact lane.

---

## 1. PURPOSE

Transform raw git changes into a review artifact that highlights scale, risk, architecture impact, and recommended reviewer action with explicit doc impact diagnostics when requested.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional target and optional flags:
- `[branch|commit|PR#]`
- `--spec-folder <path>`
- `--include-doc-impact`

**Outputs:** `.opencode/output/visual/diff-review-{branch-or-commit}-{timestamp}.html`

**When doc-impact lane is enabled:**
- include SpecKit metadata tags with `ve-view-mode=artifact-dashboard`
- include a dedicated `SpecKit Doc Impact` section

**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and review references:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/library_guide.md`
- `references/navigation_patterns.md`
- `references/speckit_artifact_profiles.md` (when doc-impact lane is enabled)
- `references/quality_checklist.md`

---

## 4. ARGUMENT ROUTING

Resolve target from `$ARGUMENTS`:

| Input Pattern | Data Collection Command Set |
| --- | --- |
| branch name | `git diff main...<branch>` and `git log main..<branch>` |
| commit hash | `git show <commit>` |
| PR number (`PR#`) | `gh pr view <PR#>` and `gh pr diff <PR#>` |
| empty | `git diff HEAD` and working-tree status |

Resolve doc-impact inputs:
- `--include-doc-impact`: enable SpecKit doc lane
- `--spec-folder <path>`: constrain doc lane to that folder

---

## 5. INSTRUCTIONS

### Step 1: Collect Change Data

Gather:
- changed files with additions/deletions
- full diff content
- commit messages (branch/PR)
- PR metadata/comments when PR target is used

### Step 2: Analyze Risk and Coverage

- Identify high-risk changes (security, breaking, performance)
- Detect dependency or migration-impact changes
- Estimate test coverage gaps based on changed areas

### Step 3: Compute Doc Impact Lane (Optional)

Run this step when `--include-doc-impact` is set:
- Detect changed docs matching SpecKit artifact patterns (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `research.md`, `decision-record.md`).
- If `--spec-folder` is provided, include only files under that path.
- Summarize:
  - changed artifact types
  - missing expected sibling updates
  - recommended follow-up docs

### Step 4: Build Visual Review

Include baseline sections:
1. Executive Summary
2. File Change Map
3. Architecture Impact
4. Risk Assessment
5. Key Changes
6. Test Coverage
7. Dependency Changes
8. Migration Notes
9. Review Checklist
10. Recommendation

If doc-impact enabled, add:
11. SpecKit Doc Impact

Default aesthetic: `blueprint`.

### Step 5: Validate and Deliver

- Run quality checklist validations.
- Save to `.opencode/output/visual/diff-review-{branch-or-commit}-{timestamp}.html`.
- Open in browser.
- Return structured status.

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Invalid git target | Return `STATUS=FAIL ERROR="Invalid diff target: <target>"` |
| `gh` unavailable for PR mode | Return `STATUS=FAIL ERROR="GitHub CLI is required for PR targets"` |
| `--spec-folder` set but path does not exist | Return `STATUS=FAIL ERROR="Spec folder not found: <path>"` |
| No diff data found | Return `STATUS=FAIL ERROR="No changes found for target"` |
| Render/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated visual diff review with risk analysis and optional SpecKit doc-impact lane"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:diff-review
/visual-explainer:diff-review "feature/oauth-refresh"
/visual-explainer:diff-review "abc1234" --include-doc-impact
/visual-explainer:diff-review "PR#42" --spec-folder "specs/007-auth" --include-doc-impact
```
