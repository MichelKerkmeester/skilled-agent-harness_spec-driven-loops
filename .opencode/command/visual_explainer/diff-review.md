---
description: Generate a styled HTML visual review of git diffs, commits, or pull requests
argument-hint: "[branch|commit|PR#]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Diff Review

Generate a comprehensive HTML review for branch diffs, single commits, PRs, or the current working tree.

---

## 1. PURPOSE

Transform raw git changes into a review artifact that highlights scale, risk, architecture impact, and recommended reviewer action.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional target (`branch`, `commit`, or `PR#`).
**Outputs:** `.opencode/output/visual/diff-review-{branch-or-commit}-{timestamp}.html`
**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and review references:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/library_guide.md`
- `references/navigation_patterns.md`
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

---

## 5. INSTRUCTIONS

### Step 1: Collect Change Data

Gather:
- Changed files with additions/deletions
- Full diff content
- Commit messages (branch/PR)
- PR metadata/comments when a PR target is used

### Step 2: Analyze Risk and Coverage

- Identify high-risk changes (security, breaking, performance)
- Detect dependency or migration-impact changes
- Estimate test coverage gaps based on changed areas

### Step 3: Build Visual Review

Include these sections:
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

Default aesthetic: `blueprint`.

### Step 4: Validate and Deliver

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
| No diff data found | Return `STATUS=FAIL ERROR="No changes found for target"` |
| Render/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated visual diff review with risk and recommendation sections"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:diff-review
/visual-explainer:diff-review "feature/oauth-refresh"
/visual-explainer:diff-review "abc1234"
/visual-explainer:diff-review "PR#42"
```
