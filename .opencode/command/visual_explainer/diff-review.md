---
description: "Generate a styled HTML visual review of git diffs, commits, or pull requests"
argument-hint: "<branch|commit|PR#>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /visual-explainer:diff-review

Generate a comprehensive, styled HTML page reviewing git changes — diffs, commits, or pull requests.

## Skill Activation

Load the `sk-visual-explainer` skill:
1. Read `.opencode/skill/sk-visual-explainer/SKILL.md`
2. Load `references/quick_reference.md` (always)
3. Load `references/css_patterns.md` (for styling)
4. Load `references/library_guide.md` (for Mermaid diagrams)
5. Load `references/navigation_patterns.md` (multi-section review pages)

## Argument Parsing

```
INPUT: $ARGUMENTS
├─ Accepts: branch name, commit hash, or PR number
├─ If branch: `git diff main...<branch>` and `git log main..<branch>`
├─ If commit: `git show <commit>`
├─ If PR#: `gh pr view <PR#>` and `gh pr diff <PR#>`
└─ If no arguments: diff of current working tree vs HEAD
```

## Data Gathering

Before generating, collect:
1. Changed files list with additions/deletions counts
2. Full diff content
3. Commit messages (if branch/PR)
4. PR description and comments (if PR)

## Section Architecture (10 sections)

1. **Executive Summary** — KPI cards: files changed, insertions, deletions, net change
2. **File Change Map** — Table of all files with change type badges (added/modified/deleted)
3. **Architecture Impact** — Mermaid diagram showing which components/modules are affected
4. **Risk Assessment** — Table of high-risk changes (security, breaking changes, performance)
5. **Key Changes** — Top 5 most significant changes with code snippets and explanation
6. **Test Coverage** — Which tests cover the changed files, any gaps
7. **Dependency Changes** — Any package.json/requirements.txt/go.mod changes
8. **Migration Notes** — Breaking changes that need documentation or migration steps
9. **Review Checklist** — Interactive checklist for the reviewer
10. **Recommendation** — Overall assessment: approve/request-changes/discuss

Default aesthetic: **Blueprint** (technical, precise, grid-line feel)

## Output

Save to `.opencode/output/visual/diff-review-{branch-or-commit}-{timestamp}.html`
Open in browser.
