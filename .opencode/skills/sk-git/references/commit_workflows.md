---
title: Git Commit - Detailed Workflow Reference
description: Complete workflow documentation for professional commit practices with Conventional Commits.
trigger_phrases:
  - "atomic commit strategy"
  - "scoped staging discipline"
  - "filter development artifacts"
  - "commit type selection"
  - "dirty working tree staging"
  - "staged deny pattern assertion"
importance_tier: normal
contextType: implementation
version: 1.1.0.9
---

# Git Commit - Detailed Workflow Reference

Complete workflow documentation for professional commit practices with Conventional Commits.

---

## 1. OVERVIEW

Systematically analyze changes, determine appropriate commit strategy, and craft professional commit messages following best practices. Ensures commits are atomic, well-documented, and exclude internal development artifacts.

**Core principle**: Atomic commits with clear intent + filtered artifacts = maintainable Git history

---

## 2. PROCESS OVERVIEW

1. Analyze all changed files (categorize, evaluate value, identify patterns)
2. Filter out internal artifacts and non-conventional files
3. Determine commit strategy (single/multiple commits)
4. Write commit message following Conventional Commits
5. Verify commit readiness with final checklist

**Key Principles**:
- **Atomic commits**: One logical change per commit
- **Public value**: Only commit files that benefit the project long-term
- **Conventional format**: Follow standard commit message structure
- **Self-contained**: Messages make sense without external context
- **Convention adherence**: Respect project structure and naming conventions

---

## 3. COMPLETE WORKFLOW

### Step 1: Analyze Changed Files

**Purpose**: Understand what has changed and categorize files

**Actions**:

1. **Get changed files**:
```bash
# Check both staged and unstaged changes
git status --short
git diff --name-only
git diff --cached --name-only
```

2. **Categorize file types**:
   - **Source code** (.py, .js, .ts, .java, etc.) - Require careful review
   - **Configuration** (.json, .yaml, .toml, etc.) - Check for breaking changes
   - **Documentation** (.md, .txt, .rst, etc.) - Evaluate public value
   - **Build/dependency** (package.json, requirements.txt, etc.) - May need separate commits
   - **Test files** (*test*, *spec*) - Should align with related code changes

3. **Evaluate file value**:
   - **Public value**: Benefits other developers or project maintenance?
   - **Internal artifacts**: Development process byproduct?
   - **Project necessity**: Essential for building, running, or understanding?
   - **Long-term relevance**: Will this be useful in 6 months?

**Validation**: `files_analyzed`

### Step 2: Filter Development Artifacts

**Purpose**: Exclude internal artifacts and non-conventional files

**Auto-Exclude Patterns**:

**Internal development artifacts**:
- Coverage reports, task lists, personal notes
- Temporary analysis files or debugging artifacts
- Internal planning documents or meeting notes
- IDE-specific configurations that don't benefit the team

**Non-conventional file placement**:
- Test files in root directory (should be in `tests/`, `__tests__/`, `test/`)
- Config files in wrong locations (check for `.github/`, `config/`, root conventions)
- Files violating naming conventions (camelCase, snake_case, kebab-case per language)
- Files breaking framework structure (Maven for Java, standard Python package layout, etc.)

**Critical Rule**: **Do NOT add artifacts to .gitignore** - simply exclude from commits

**Actions**:
```bash
# Review files for exclusion (don't stage these)
# Examples:
# - TASK_ANALYSIS.md (internal planning)
# - coverage_report.html (generated artifact)
# - debug_notes.txt (personal notes)
# - root_level_test.py (should be in tests/)
```

**Validation**: `artifacts_filtered`

### Step 3: Identify Change Patterns

**Purpose**: Determine if changes form cohesive logical unit

**Questions to Answer**:
- Are changes related to a single feature/fix?
- Are there multiple unrelated changes that should be split?
- Do changes affect multiple independent areas?
- Are there files that might cause merge conflicts?

**Change Pattern Types**:

1. **Cohesive (Single Commit)**:
   - All changes serve one purpose
   - Changes are interdependent
   - Single feature or fix
   - Related test updates

2. **Mixed (Multiple Commits)**:
   - Unrelated bug fixes
   - Feature + refactoring
   - Multiple independent changes
   - Different components affected

**Validation**: `patterns_identified`

### Step 4: Determine Commit Strategy

**Purpose**: Decide single vs. multiple commits

**Decision Logic**:

```markdown
IF all changes related to one feature/fix:
  → Single commit

IF changes affect multiple independent areas:
  → Multiple commits (one per logical unit)

IF mix of features, fixes, refactoring:
  → Split into separate commits by type

IF changes include both code and tests:
  → Single commit (tests belong with code)
```

**Staging Recommendations**:
- Use `git add <specific-files>` instead of `git add .`
- Stage related files together for atomic commits
- Review with `git diff --cached` before committing

**Validation**: `strategy_determined`

### Step 5: Write Commit Message

**Purpose**: Craft a commit message that is human-clear and AI-deterministic.

The full contract (subject format, type/scope selection order, summary
construction, body contract, and the deterministic self-check) is canonical
in [`../SKILL.md`](../SKILL.md) under "Commit Message Logic (Human-Clear and
AI-Deterministic)." Worked, repository-specific examples live in
[`../assets/commit_message_template.md`](../assets/commit_message_template.md).
Structure is enforced by
[`../../../scripts/git-hooks/commit-msg`](../../../scripts/git-hooks/commit-msg)
(bypass: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...`).

Quick summary: `type(scope)[!]: imperative summary`, both type and scope
required, scope is a stable subsystem name (never a numeric packet id),
subject target 80 / hard max 100 characters, a body is required whenever
four or more paths are staged or the reason isn't obvious from the subject
alone.

**Validation**: `message_written`

### Step 6: Verify Commit Readiness

**Purpose**: Final checklist before committing

**Checklist**:
```markdown
□ Only files with public value are staged
□ Internal development artifacts excluded
□ Non-conventional files skipped
□ All related changes staged together
□ Commit message follows Conventional Commits format
□ Message is clear to external developers (no jargon)
□ No sensitive information (passwords, keys, tokens)
□ Changes are logically grouped (atomic commit)
□ Tests pass (if applicable)
```

**Actions**:
```bash
# Review staged changes
git diff --cached

# Check commit message
git commit -v  # Opens editor with diff

# Or commit directly
git commit -m "type(scope): description" -m "Body explaining why"
```

**Validation**: `commit_ready`

### Step 7: Scoped-Staging Discipline (Dirty Working Tree)

**Purpose**: Prevent sweeping someone else's in-flight WIP into YOUR commit when the working tree is dirty (unrelated uncommitted or already-staged changes belonging to another packet/agent).

**Why this matters (real incident)**: During the 026 wave-4 reorg, an orchestrator ran a broad `git add` while the tree held unrelated WIP. 24 unrelated files (another packet plus install guides) were swept into the reorg commit and had to be backed out with `git reset --mixed HEAD~1` and re-staged precisely. See `shared_patterns.md` §10 for the rename-heavy merge half of the same incident.

**Hard rules**:

- **NEVER** use `git add -A`, `git add .`, or a broad `git add <folder>` when the tree contains unrelated uncommitted or staged changes. These sweep everything, including another agent's WIP and already-staged index entries.
- Stage **explicit pathspecs for YOUR change only**. Enumerate the files; do not stage by directory unless every file under it is yours.
- Some unrelated WIP may already be **staged** (in the index) before you start. A broad add is not required to capture it — it is already captured. You MUST inspect the index, not just the unstaged diff.

**Step 7a — Snapshot the tree before staging**:
```bash
git status --short                 # See BOTH staged (left col) and unstaged (right col)
git diff --cached --name-only      # Exactly what is ALREADY in the index
```
If `git diff --cached --name-only` is non-empty and those files are not yours, decide first: unstage them (`git reset HEAD <file>`) or stash them (see Step 7c) before building your commit.

**Step 7b — Stage only your pathspecs, then ASSERT before committing**:
```bash
# Stage explicit files (yours only)
git add path/to/your/file1 path/to/your/file2

# Pre-commit ASSERTION: staged set must contain NONE of the known unrelated paths.
# Maintain a deny-pattern of paths that are NOT part of this change.
DENY='(^other-packet/|/install-guide|^docs/install/|UNRELATED_WIP)'
if git diff --cached --name-only | grep -E "$DENY"; then
  echo "ABORT: unrelated paths are staged — un-stage before committing"; 
else
  echo "OK: staged set is clean"
fi
```
Adjust `DENY` to the concrete unrelated paths you identified in Step 7a. A non-empty grep means STOP and re-stage; do not commit.

**Step 7c — If you must clear the tree first, use stash carefully**:
```bash
git stash push -k -m "unrelated WIP"   # -k/--keep-index keeps YOUR staged change, stashes the rest
# ... build and verify your commit ...
git stash pop
git diff --cached --name-only          # RE-CHECK: `git stash pop` can restore entries as STAGED
```
> **Caveat**: `git stash pop` can restore previously-staged entries back into the index as staged. Always re-run `git diff --cached --name-only` after a pop and re-assert against your deny-pattern before the next commit.

**Step 7d — Recovery if unrelated WIP already got committed**:
```bash
git reset --mixed HEAD~1               # Un-commit, KEEP all changes (staged → unstaged)
git status --short                     # Confirm nothing is staged
git add path/to/your/file1 path/to/your/file2   # Re-stage YOUR pathspecs only
git diff --cached --name-only | grep -E "$DENY"  # Re-assert: must be empty
git commit -m "type(scope): description"
```
`--mixed` (the default for `git reset`) un-commits and unstages while preserving file contents in the working tree, so unrelated WIP returns to its prior uncommitted state rather than being lost.

**Validation**: `scoped_staging_verified`

---

## 4. DECISION MATRIX

| Scenario | Strategy | Commit Type | Notes |
|----------|----------|-------------|-------|
| Single feature with tests | Single commit | `feat` | Tests belong with feature |
| Bug fix + unrelated refactor | Multiple commits | `fix`, `refactor` | Separate concerns |
| Documentation only | Single commit | `docs` | Unless multiple unrelated topics |
| Multiple independent fixes | Multiple commits | `fix` (each) | One fix per commit |
| Feature + breaking change | Single commit | `feat` | Note breaking change in footer |
| Internal artifacts present | Exclude artifacts | N/A | Don't commit, don't add to .gitignore |
| Test files in wrong location | Exclude from commit | N/A | Fix structure first |
| Config + code changes | Single commit (if related) | `feat` or `fix` | Or split if config is breaking change |

---

## 5. COMMON MISTAKES

**Including internal artifacts**:
- **Problem**: Task lists, debug notes, coverage reports in commits
- **Fix**: Exclude these files; don't add to .gitignore

**Using `git add .` blindly**:
- **Problem**: Stages everything including artifacts and non-conventional files
- **Fix**: Use `git add <specific-files>` for targeted staging

**Vague commit messages**:
- **Problem**: "fix bug", "update code", "changes"
- **Fix**: Be specific about what and why

**Mixing unrelated changes**:
- **Problem**: Feature + refactor + fix in one commit
- **Fix**: Split into multiple atomic commits

**Internal references in messages**:
- **Problem**: "TASK-123: implement feature"
- **Fix**: Write self-contained messages for external developers

**Committing non-conventional files**:
- **Problem**: Test files in root, misplaced configs
- **Fix**: Exclude and fix structure before committing

**Breaking changes without notice**:
- **Problem**: Breaking API changes without `BREAKING CHANGE:` footer
- **Fix**: Always document breaking changes in commit footer

**Sweeping unrelated WIP into your commit (dirty tree)**:
- **Problem**: Broad `git add -A` / `git add <folder>` on a tree holding another agent's uncommitted or already-staged work captures their files into your commit
- **Fix**: Scoped-staging discipline (Step 7) — stage explicit pathspecs and assert the staged set against a deny-pattern before committing; recover with `git reset --mixed HEAD~1` if it already happened

---

## 6. TROUBLESHOOTING

### Cannot Determine Commit Scope

**Symptom**: Changes span multiple unrelated areas

**Actions**:
1. List all changed files by category
2. Ask user: "These changes affect multiple areas. Should I split into separate commits?"
3. If split: Create one commit per logical area
4. If single: Use the most representative single scope (scope is required, never omitted)

### Internal Artifacts Keep Getting Staged

**Symptom**: `git add .` stages unwanted files

**Solutions**:
```bash
# Unstage specific files
git reset HEAD TASK_NOTES.md debug_output.txt

# Use targeted staging instead
git add src/ tests/  # Stage only specific directories
```

### Unrelated In-Flight WIP Got Staged or Committed

**Symptom**: `git diff --cached --name-only` lists files that belong to another packet/agent, or a commit already includes them. Common when the working tree was dirty (someone else's uncommitted/staged work) and a broad `git add` was used.

**Solutions**:
```bash
# A) Still staged (not yet committed): unstage the intruders, keep yours
git reset HEAD other-packet/ docs/install/   # unstage unrelated paths only
git diff --cached --name-only                 # confirm only your files remain

# B) Already committed: un-commit keeping all changes, then re-stage precisely
git reset --mixed HEAD~1                       # un-commit, keep changes in tree
git add path/to/your/file1 path/to/your/file2 # re-stage YOUR pathspecs only
git diff --cached --name-only | grep -E '(^other-packet/|/install-guide)'  # must be empty
git commit -m "type(scope): description"
```
Prevent recurrence with Step 7 (Scoped-Staging Discipline): enumerate your pathspecs and run the pre-commit deny-pattern assertion. After any `git stash pop`, re-check the index — popped entries can return staged.

### Commit Message Too Long

**Symptom**: Subject line exceeds the 80-character target (100 is the hard maximum)

**Fix**:
- Move details to body
- Use shorter, more concise language
- Example:
  - Too long: "Add new user authentication system with JWT tokens and middleware"
  - Better: "feat(auth): add JWT authentication system"

### Breaking Change Not Documented

**Symptom**: API change breaks backward compatibility

**Fix**:
```
feat(api): change response format to JSON

Standardizes all API responses to use JSON format.
Removes support for XML responses.

BREAKING CHANGE: XML response format no longer supported.
Clients must update to handle JSON responses.
```

### Tests Failing Before Commit

**Symptom**: Test suite has failures

**Actions**:
1. Report failures: "Tests are failing. Fix before committing?"
2. If fix: Address failures first
3. If skip (rare): Document in commit message why tests are failing
4. Never commit broken tests without acknowledgment

---

## 7. SUCCESS CRITERIA

**Commit is successful when**:
- ✅ All changed files analyzed and categorized
- ✅ Internal artifacts filtered out
- ✅ Non-conventional files excluded
- ✅ Commit strategy determined (single/multiple)
- ✅ Message follows Conventional Commits format
- ✅ Subject targets 80 characters and never exceeds 100, imperative mood
- ✅ Body explains "what" and "why" (when applicable)
- ✅ No sensitive information included
- ✅ Changes are atomic and logically grouped
- ✅ Tests pass (or failures acknowledged)
- ✅ On a dirty tree, staged set asserted against a deny-pattern — no unrelated WIP captured (Step 7)
- ✅ `commit-msg` hook passed (or a documented bypass reason)

**Quality gates**:
- Only files with public value are committed
- Artifacts remain in workspace but not in Git
- Message is self-contained and clear to external developers
- Commit represents one logical change

---

## 8. RELATED RESOURCES

### Reference Files
- [../SKILL.md](../SKILL.md) - Canonical Commit Message Logic
- [../assets/commit_message_template.md](../assets/commit_message_template.md) - Repository-specific worked examples
- [../../../scripts/git-hooks/commit-msg](../../../scripts/git-hooks/commit-msg) - Structural enforcement hook
- [worktree_workflows.md](./worktree_workflows.md) - Create isolated git workspaces with minimal branching
- [finish_workflows.md](./finish_workflows.md) - Complete development work with structured integration options
- [quick_reference.md](./quick_reference.md) - One-page cheat sheet for all git workflows
- [shared_patterns.md](./shared_patterns.md) - Common patterns and conventions across workflows

### External Resources
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Standard commit message format
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project) - Pro Git book chapter on contributing
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) - The seven rules of great commits
- [Semantic Versioning](https://semver.org/) - Version numbering based on changes
