---
title: Git Finish - Detailed Workflow Reference
description: Complete workflow documentation for completing development work with structured integration options.
trigger_phrases:
  - "merge back to main locally"
  - "push and create a pull request"
  - "four integration options"
  - "worktree cleanup after merge"
  - "create github release tag"
  - "discard failed experiment branch"
  - "pushed work not visible in main checkout"
  - "reconcile primary checkout after worktree push"
importance_tier: normal
contextType: implementation
version: 1.1.0.18
---

# Git Finish - Detailed Workflow Reference

Complete workflow documentation for completing development work with structured integration options.

This workflow assumes any branch already came from `git worktree add -b ...`, not from direct branch creation commands.

---

## 1. OVERVIEW

Systematically complete development work by verifying tests, presenting integration options, and executing the chosen workflow. Ensures work is properly integrated with clean branch management.

**Core principle**: Verify tests → Present options → Execute choice → Clean up = reliable completion workflow

> **Continuous-integration note**: When a session runs under the launch wrapper's continuous-integration model, each commit is already **autosynced** to the shared live branch via `git-sync.sh` (see [continuous-integration.md](continuous-integration.md)), and the primary checkout follows it with `git-live-follow.sh`. In that mode the Step 5b manual reconciliation below is normally already done for you; "finish" is then just the final PR/merge decision. To publish outstanding commits on demand outside a commit, run `bash .opencode/bin/git-sync.sh` from the session worktree.

---

## 2. PROCESS OVERVIEW

1. Verify all tests pass (blocking gate)
2. Determine base branch for integration
3. Present 4 structured options (merge, PR, keep, discard)
4. Execute chosen workflow safely
5. Clean up worktree if appropriate

**Key Principles**:
- **Test gate**: Tests must pass before any integration option is presented; a failing suite blocks until the user explicitly overrides
- **Structured choices**: Always present same 4 options
- **Safe execution**: Verify before destructive operations
- **Clean state**: Remove worktrees and temp branches appropriately
- **Confirmation required**: Never delete work without explicit approval

---

## 3. COMPLETE WORKFLOW

### Step 1: Verify Tests

**Purpose**: Ensure code quality before integration

**Actions**:

1. **Detect test command**:
```bash
# Auto-detect based on project type
if [ -f package.json ]; then npm test; fi     # Node.js
if [ -f Cargo.toml ]; then cargo test; fi     # Rust
if [ -f pytest.ini ] || [ -f pyproject.toml ]; then pytest; fi  # Python
if [ -f go.mod ]; then go test ./...; fi      # Go
```

2. **Run tests**:
```bash
# Execute appropriate test suite
<detected-test-command>
```

3. **Evaluate results**:
   - **All pass**: Continue to Step 2
   - **Any fail**: STOP and report

**If tests fail**:
```text
Tests failing (<N> failures). Must fix before completing:

[Show failure details]

Cannot proceed with merge/PR until tests pass.
```

**Do not proceed to Step 2 with failing tests unless the user explicitly overrides.**

**Validation**: `tests_verified`

### Step 2: Determine Base Branch

**Purpose**: Identify target branch for integration

**Actions**:

1. **Auto-detect base branch**:
```bash
# Try common base branches
git merge-base HEAD main 2>/dev/null && echo "main" || \
git merge-base HEAD master 2>/dev/null && echo "master" || \
git merge-base HEAD develop 2>/dev/null && echo "develop"
```

2. **Confirm with user** (if ambiguous):
```text
Detected base branch: <branch-name>

Is this correct? (y/n)
```

3. **Store base branch** for later steps

**Validation**: `base_branch_determined`

### Step 3: Present Options

**Purpose**: Give user structured choices for integration

**Present exactly these 4 options (no modifications)**:

```text
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option? (1-4)
```

**Important**:
- Do NOT add explanations or descriptions
- Keep options concise and clear
- Wait for explicit user choice (1, 2, 3, or 4)
- Do NOT proceed without user input

**Validation**: `options_presented`

### Step 4: Execute Choice

**Purpose**: Safely execute the chosen integration workflow

#### Option 1: Merge Locally

**Workflow**:
```bash
# 1. Switch to base branch
git checkout <base-branch>

# 2. Pull latest changes
git pull

# 3. Merge feature branch
git merge <feature-branch>

# 4. Verify tests on merged result
<test-command>

# 5. If tests pass, delete feature branch
if [ $? -eq 0 ]; then
  git branch -d <feature-branch>
else
  echo "Tests failed after merge. Fix before proceeding."
fi
```

**Note**: Post-merge test run is a safety verification only. The Step 1 test gate ensures the feature branch is already tested, so merge should be safe. This catches integration issues only (e.g., conflicts with recent main changes).

**Then**: Proceed to Step 5 (Cleanup Worktree)

**Validation**: `merge_complete`

#### Option 2: Push and Create PR

Selecting this option is itself the operator's go-ahead for this push — see [remote-branch-policy.md](remote-branch-policy.md). No separate remote-push confirmation is needed here; the hook still needs `SPECKIT_ALLOW_REMOTE_PUSH=1` set for this invocation whenever `<feature-branch>` is not on the remote allowlist (`main`, `skilled/v*`, or `remote-branch-allowlist.txt`), since a chat-level yes has no hook-visible signal of its own.

**Workflow**:
```bash
# 1. Push branch to remote (SPECKIT_ALLOW_REMOTE_PUSH=1 satisfies the
#    remote-push-permission gate — only needed when <feature-branch> isn't
#    on the remote allowlist; see remote-branch-policy.md)
SPECKIT_ALLOW_REMOTE_PUSH=1 git push -u origin <feature-branch>

# 2. Create PR using GitHub CLI (preferred)
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullet points of what changed>

## Test Plan
- [ ] <verification steps>
- [ ] All tests pass

## Related Issues
Closes #<issue-number> (if applicable)
EOF
)"
```

**Alternative: GitHub MCP (via Code Mode)**

If `gh` CLI is unavailable or you need richer PR features, use GitHub MCP:

```javascript
// Create PR via GitHub MCP
call_tool_chain(`github.github_create_pull_request({
  owner: '<repo-owner>',
  repo: '<repo-name>',
  title: 'feat(scope): description',
  head: '<feature-branch>',
  base: '<base-branch>',
  body: '## Summary\\n- Change 1\\n- Change 2\\n\\n## Test Plan\\n- [ ] Tests pass'
})`)
```

**Note**: GitHub MCP runs via `npx @modelcontextprotocol/server-github`. Requires a GitHub Personal Access Token configured in `.utcp_config.json`. See SKILL.md Section 2 for full tool list and usage.

**PR Title Guidelines**:
- Use conventional commit format: `feat: `, `fix: `, `refactor: `
- Be specific and descriptive
- Example: `feat(auth): add OAuth2 login support`

**Ask user about worktree**:
```text
Keep worktree for PR updates? (y/n)
- y: Preserve worktree (you can make changes for review feedback)
- n: Remove worktree (switch to other work immediately)
```

**If user chooses 'n'**: Proceed to Step 5 (Cleanup Worktree)
**If user chooses 'y'**: Skip Step 5, report worktree location

**Validation**: `pr_created`

#### Option 3: Keep As-Is

**Workflow**:
```bash
# Report status
echo "Keeping branch <feature-branch>. Worktree preserved at <path>."
```

**Important**: Do NOT cleanup worktree for this option

**Validation**: `branch_preserved`

#### Option 4: Discard

**Confirm first (REQUIRED)**:
```text
⚠️  WARNING: This will permanently delete:
- Branch: <feature-branch>
- All commits:
  <commit-hash-1> <commit-message-1>
  <commit-hash-2> <commit-message-2>
  ...
- Worktree at: <path>

This action CANNOT be undone.

Type 'discard' to confirm (or anything else to cancel):
```

**Wait for exact confirmation**. If user types anything other than "discard", cancel operation.

**If confirmed**:
```bash
# 1. Switch to base branch
git checkout <base-branch>

# 2. Force delete feature branch
git branch -D <feature-branch>

# 3. Report completion
echo "Branch <feature-branch> discarded."
```

**Then**: Proceed to Step 5 (Cleanup Worktree)

**Validation**: `branch_discarded`

### Step 5: Cleanup Worktree

**Purpose**: Remove worktree directories when appropriate

**Cleanup Rules**:
- **Option 1 (Merge)**: Cleanup worktree ✓
- **Option 2 (PR)**: Ask user (may need for PR updates)
- **Option 3 (Keep)**: Do NOT cleanup ✗
- **Option 4 (Discard)**: Cleanup worktree ✓

**Actions** (for Options 1, 4, and Option 2 if user chose 'n'):

1. **Check if in worktree**:
```bash
# Get current branch (empty if detached HEAD)
current_branch=$(git branch --show-current)

if [ -z "$current_branch" ]; then
  # Detached HEAD - find worktree by path
  worktree_path=$(git worktree list | grep "$(pwd)" | awk '{print $1}')
else
  # Normal branch - find worktree by branch name
  worktree_path=$(git worktree list | grep "$current_branch" | awk '{print $1}')
fi
```

2. **If worktree exists**:
```bash
# Remove worktree
if [ -n "$worktree_path" ] && [ "$worktree_path" != "$(git rev-parse --show-toplevel)" ]; then
  git worktree remove "$worktree_path"
  echo "Cleaned up worktree at $worktree_path"
else
  echo "Not in a worktree (in main repository)"
fi
```

3. **If not in worktree**:
```bash
echo "No worktree cleanup needed."
```

**Validation**: `worktree_cleaned`

### Step 5b: Reconcile the Primary Checkout (detached / worktree push to a shared branch)

**Purpose**: Prevent the "invisible work" trap when work is finished by pushing a **detached HEAD or an isolated worktree** onto a shared long-lived branch (e.g. a short-lived agent worktree finishing onto an integration branch that the operator's main tree also tracks).

**The trap**: `git push origin HEAD:<branch>` advances the *remote* `<branch>` but does **NOT** move the local `<branch>` ref that another working tree — usually the operator's primary checkout — has checked out. The pushed folder is safe on origin, yet does not appear in that checkout's editor until it runs a separate sync. Nothing is lost; the work is only invisible, which reads as "my push disappeared."

**Applies to**: Option 2 (Push and Create PR) and any finish that ends in `git push origin HEAD:<branch>` from a detached HEAD or a linked worktree. It is a post-push reconciliation, not a fifth menu choice — the Step 3 menu stays at 4 options.

**Actions**:

```bash
# 1. Rebase the worktree's own commits onto the CURRENT shared tip (avoid non-ff),
#    then push. Never --force a shared branch. Add SPECKIT_ALLOW_REMOTE_PUSH=1
#    if <branch> is not on the remote allowlist — see remote-branch-policy.md.
git fetch origin <branch>
git rebase origin/<branch>          # replays ONLY your local worktree commits
git push origin HEAD:<branch>

# 2. MANDATORY: check whether the PRIMARY checkout of <branch> now contains the push.
#    The primary checkout is the tree the operator actually looks at (often the repo root).
git -C <primary-worktree> rev-parse HEAD
git -C <primary-worktree> merge-base --is-ancestor <pushed-sha> HEAD \
  && echo "primary already has the work" \
  || echo "primary is BEHIND — work is on origin but not yet visible here"
```

**Reconcile — or state why you cannot**:

- **Primary tree clean and fast-forwardable** → offer to sync it, then confirm the folder appears:
  ```bash
  git -C <primary-worktree> merge --ff-only origin/<branch>
  ```
- **Primary tree dirty, diverged, or owned by a concurrent session** → **DO NOT** stash / rebase / reset it. A live session mid-sync (its own stash on the stack, its HEAD moving between commands) must be left alone — forcing a sync there risks orphaning its autostash (SKILL.md ALWAYS #14) or clobbering its in-flight commits. Report plainly and stop:
  ```text
  Your work is on origin as <sha> (branch <branch>). It is not yet in your
  main checkout because that tree is <dirty / diverged / has a concurrent
  session running>. From a clean tree, sync with:
    git pull --rebase
  or, if you have uncommitted work to preserve:
    git stash && git rebase origin/<branch> && git stash pop
  ```
- **A concurrent session is actively converging** (its HEAD advances between two `rev-parse` reads, or origin already contains your push) → the sync often completes on its own; verify with a re-read and report that the work has landed, rather than intervening.

**Validation**: `primary_checkout_reconciled`

### Step 6: Create Release (Optional)

**Purpose**: Create an annotated git tag AND a GitHub release with formatted release notes. This step runs only when the user explicitly asks for a release.

**Trigger phrases**: "create release", "make release", "tag release", "new release", "publish release", "release vX.X.X", "new version"

**Actions**:

1. **Determine version number**:
   - If user provided version: use it exactly
   - If not: check latest tag and suggest next patch increment
   ```bash
   git tag --sort=-v:refname | head -5
   ```

2. **Locate or create changelog**:
   - Check for existing changelog at `.opencode/changelog/*/vX.X.X.X.md`
   - If found: use as release notes source
   - If not found: ask user whether to create one or use commit log

**Guided workflow available:** For a structured changelog + release workflow, use the `/create:changelog --release :auto` command. It handles changelog creation, tag creation, and GitHub release publishing in one guided flow. Step 6 below is the manual alternative.

3. **Create annotated tag**:
   ```bash
   git tag -a vX.X.X.X -m "vX.X.X.X: Release description"
   ```

4. **Push commit(s) and tag to remote**:
   ```bash
   git push origin <branch> --tags
   ```

5. **Create GitHub release** (CRITICAL — tags alone do NOT create releases):
   ```bash
   gh release create vX.X.X.X \
     --title "vX.X.X.X — Release Title" \
     --notes "$(cat <<'EOF'
   Plain-English summary of what this release does and why it matters.

   ## What Changed

   ### [Category name]
   - **[Fix/Feature name]** -- What was broken. What we did. Why it matters.

   ## Files Changed

   | File | What changed |
   |------|-------------|
   | `path/to/file` | Brief description |

   ## Upgrade
   No action required. / Steps if needed.

   Full changelog: [changelog/<component>/vX.X.X.X.md](<link>)
   EOF
   )"
   ```

**Important**:
- `gh release create` is MANDATORY — pushing a tag does NOT create a GitHub release
- Release notes MUST use plain-English style -- see PUBLIC-RELEASE.md Section 7 for the full template and rules
- Write like you are explaining to a smart person who is not a developer
- Every fix explained as: what was broken, what we did, why it matters
- No jargon without explanation; no metrics soup
- Technical details (file paths, line numbers) go in the Files Changed table, not in descriptions
- **H1 contract**: repo changelog md files KEEP their `# vX.X.X.X — Title` heading (it is the file's identity in the repo); GitHub release bodies NEVER include it — the release title field already renders the name, so a body-leading H1 duplicates it. Strip the leading H1 and blank lines when publishing from a file:
  ```bash
  tail -n +2 changelog/vX.X.X.X.md | sed '/./,$!d' > /tmp/release-body.md
  gh release create vX.X.X.X --title "vX.X.X.X — Release Title" --notes-file /tmp/release-body.md
  ```
- Always include a link back to the full changelog file in the repo

**Validation**: `release_created`

**Common Mistakes**:

**Only pushing tag without gh release create**:
- **Problem**: Tag appears under "Tags" on GitHub but NOT under "Releases". No release page, no release notes, no downloadable assets.
- **Fix**: Always run `gh release create` after pushing the tag
- **Detection**: If user says "release" or "make release" → must include `gh release create`, not just `git tag` + `git push`

**Using --notes-file with unprocessed changelog**:
- **Problem**: Local changelog files include wrapper headers (`# vX.X.X.X`, `> Part of ...`) that look wrong on GitHub
- **Fix**: Strip the leading H1 + wrapper lines into a temp notes file (`tail -n +2 file | sed '/./,$!d'`) or compose the release body directly with HEREDOC; never edit the H1 out of the repo changelog file itself
- **Detection**: Check if notes start with `# v` or `> Part of` → strip before publishing; after publishing, `gh release view vX.X.X.X --json body --jq .body | head -1` must NOT start with `# `

---

## 4. DECISION MATRIX

| Scenario | Recommended Option | Rationale |
|----------|-------------------|-----------|
| Solo project, simple change | Option 1 (Merge locally) | Fast, no review needed |
| Team project, needs review | Option 2 (Create PR) | Enables code review, CI checks; keep worktree for updates |
| Work in progress, need to switch contexts | Option 3 (Keep as-is) | Preserve work for later |
| Experimental code, failed approach | Option 4 (Discard) | Clean up failed experiments |
| Short-lived feature worktree (merge back immediately) | Option 1 (Merge locally) | Aligns with the merge-back-fast wt/{NNNN}-{name} lane |
| Long-running feature worktree | Option 2 (Create PR) | Aligns with the PR-review wt/{NNNN}-{name} lane |
| Hotfix for production | Option 1 or 2 (Merge/PR) | Never discard or keep hotfixes |
| Spike/research | Option 4 (Discard) | Research doesn't need to be merged |
| Release requested by user | Step 6 (Create Release) | Creates annotated tag + GitHub release with formatted notes |
| Release with changelog | `/create:changelog --release :auto` | Guided changelog + tag + release workflow |

---

## 5. COMMON MISTAKES

**Skipping test verification**:
- **Problem**: Merge broken code, create failing PR
- **Fix**: Always run tests in Step 1 before offering options
- **Detection**: If user says "skip tests" → refuse and explain risk

**Open-ended questions instead of structured options**:
- **Problem**: "What should I do next?" → ambiguous, confusing
- **Fix**: Always present exactly the same 4 options in Step 3
- **Detection**: If tempted to ask "what next?" → use structured options

**Automatic worktree cleanup for Option 3 (Keep)**:
- **Problem**: Remove worktree when user explicitly chose to keep it
- **Fix**: Skip cleanup for Option 3; for Option 2, ask user preference
- **Detection**: Check option number before cleanup in Step 5

**No confirmation for discard (Option 4)**:
- **Problem**: Accidentally delete work permanently
- **Fix**: Require typed "discard" confirmation with clear warning
- **Detection**: Option 4 selected → show warning and wait for exact match

**Merge without pulling latest base branch**:
- **Problem**: Merge conflicts or outdated base
- **Fix**: Always `git pull` base branch before merging (Step 4, Option 1)
- **Detection**: Before merge → check if base is up to date

**Skip tests after merge**:
- **Problem**: Merged code breaks tests even though feature tests passed
- **Fix**: Run tests again after merge in Option 1
- **Detection**: After merge → verify test command runs again

**Pushed from a worktree, work invisible in the main checkout**:
- **Problem**: Work committed in a detached/worktree HEAD is pushed with `git push origin HEAD:<branch>`; it lands on origin but the operator's primary checkout still shows the old tree, so the folder looks lost.
- **Fix**: Run the Step 5b reconciliation — verify the primary checkout contains the pushed commit; if not, fast-forward it when clean, or hand over the sync recipe when it is dirty/diverged/live. Never force-sync a concurrent session's tree.
- **Detection**: After `git push origin HEAD:<branch>`, if the current HEAD is detached or in a worktree → the local `<branch>` ref elsewhere did not move; check and report before claiming the user will see the work.

---

## 6. EXAMPLE WORKFLOWS

### Example 1: Quick Fix with Local Merge (Option 1)

```text
User: "I've fixed the modal bug, ready to finish"

Agent: "I'm using the git-finish skill to complete this work."

[Step 1: Verify Tests]
> npm test
✓ All tests passing (47 tests, 0 failures)

[Step 2: Determine Base Branch]
> git merge-base HEAD main
Detected base branch: main

[Step 3: Present Options]
Implementation complete. What would you like to do?

1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option? (1-4)

User: "1"

[Step 4: Execute Choice - Option 1]
> git checkout main
> git pull
> git merge wt/0001-modal-fix
> npm test
✓ Tests still passing after merge

> git branch -d wt/0001-modal-fix
Deleted branch wt/0001-modal-fix

[Step 5: Cleanup Worktree]
> git worktree list | grep wt/0001-modal-fix
Found worktree at .worktrees/0001-modal-fix

> git worktree remove .worktrees/0001-modal-fix
✓ Cleaned up worktree

✅ Complete! Branch merged to main and cleaned up.
```

### Example 2: Feature Branch with PR (Option 2)

```text
User: "Authentication feature is done, let's create a PR"

Agent: "I'm using the git-finish skill."

[Step 1: Verify Tests]
> pytest
✓ All tests passing (152 tests, 0 failures)

[Step 2: Determine Base Branch]
Detected base branch: main

[Step 3: Present Options]
Implementation complete. What would you like to do?

1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option? (1-4)

User: "2"

[Step 4: Execute Choice - Option 2]
> git push -u origin wt/0002-user-auth
Pushed to origin/wt/0002-user-auth

> gh pr create --title "feat(auth): add OAuth2 user authentication" --body "$(cat <<'EOF'
## Summary
- Implements OAuth2 authentication flow
- Adds JWT token management
- Includes login/logout endpoints

## Test Plan
- [x] All unit tests pass (152 tests)
- [ ] Manual testing of login flow
- [ ] Security review

## Related Issues
Closes #234
EOF
)"

✓ PR created: https://github.com/user/repo/pull/456

Agent: Keep worktree for PR updates? (y/n)
User: "y"

✅ Complete! PR created.
Worktree preserved at .worktrees/0002-user-auth for addressing review feedback.
To cleanup later: git worktree remove .worktrees/0002-user-auth
```

### Example 3: Keep Work for Later (Option 3)

```text
User: "I need to switch to a hotfix, but want to keep this work"

Agent: "I'm using the git-finish skill."

[Step 1: Verify Tests]
> cargo test
✓ All tests passing (89 tests, 0 failures)

[Step 2: Determine Base Branch]
Detected base branch: main

[Step 3: Present Options]
Implementation complete. What would you like to do?

1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option? (1-4)

User: "3"

[Step 4: Execute Choice - Option 3]
Keeping branch wt/0003-performance-optimization.
Worktree preserved at .worktrees/0003-performance-optimization

[Step 5: Cleanup Worktree]
Skipping cleanup (Option 3 selected)

✅ Complete! Branch and worktree preserved for later.
To resume: cd .worktrees/0003-performance-optimization
```

### Example 4: Discard Failed Experiment (Option 4)

```text
User: "This approach didn't work out, let's discard it"

Agent: "I'm using the git-finish skill."

[Step 1: Verify Tests]
> go test ./...
✓ All tests passing (234 tests, 0 failures)

[Step 2: Determine Base Branch]
Detected base branch: main

[Step 3: Present Options]
Implementation complete. What would you like to do?

1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option? (1-4)

User: "4"

[Step 4: Execute Choice - Option 4]
⚠️  WARNING: This will permanently delete:
- Branch: wt/0004-alternative-approach
- All commits:
  a1b2c3d Try alternative caching strategy
  e4f5g6h Add performance benchmarks
  h7i8j9k Revert to previous approach
- Worktree at: .worktrees/0004-alternative-approach

This action CANNOT be undone.

Type 'discard' to confirm (or anything else to cancel):

User: "discard"

> git checkout main
> git branch -D wt/0004-alternative-approach
Deleted branch wt/0004-alternative-approach

[Step 5: Cleanup Worktree]
> git worktree remove .worktrees/0004-alternative-approach
✓ Cleaned up worktree

✅ Complete! Branch and worktree discarded.
```

### Example 5: Commit, Push, and Release

```text
User: "commit and push all changes and create release v2.1.0.0"

Agent: "I'm using the git-commit skill to commit, then creating the release."

[Commit and Push]
> git add -A
> git commit -m "release(v2.1.0.0): add OAuth2 authentication + API rate limiting"
> git push origin main

[Create Changelog]
Created .opencode/changelog/01--system-spec-kit/v2.1.0.0.md

[Tag and Release]
> git tag -a v2.1.0.0 -m "v2.1.0.0: OAuth2 authentication + API rate limiting"
> git push origin v2.1.0.0

> gh release create v2.1.0.0 \
    --title "v2.1.0.0 — OAuth2 Authentication + API Rate Limiting" \
    --notes "$(cat <<'EOF'
Adds secure login and request throttling so the API can handle real-world traffic safely.

## What Changed

### Security
- **OAuth2 authentication** -- The API only supported basic auth, which is vulnerable to brute-force attacks. We added a full OAuth2 login/logout flow with token management. Users now get industry-standard authentication.
- **API rate limiting** -- Without limits, a single client could overwhelm the server. We added per-endpoint rate limits backed by Redis. This protects the service under heavy load.

## Files Changed

| File | What changed |
|------|-------------|
| `src/auth/oauth.ts` | New OAuth2 flow implementation |
| `src/middleware/rate-limit.ts` | Rate limiting middleware |
| `src/config/redis.ts` | Redis connection for rate limit counters |

## Upgrade
1. Run database migration: `npm run migrate`
2. Set `OAUTH_CLIENT_ID` and `OAUTH_SECRET` environment variables

Full changelog: [changelog/01--system-spec-kit/v2.1.0.0.md](https://github.com/user/repo/blob/main/.opencode/changelog/01--system-spec-kit/v2.1.0.0.md)
EOF
)"

✓ Release created: https://github.com/user/repo/releases/tag/v2.1.0.0

✅ Complete! Committed, pushed, tagged, and GitHub release published.
```

---

## 7. TROUBLESHOOTING

### Tests Fail Before Options

**Symptom**: Test suite has failures in Step 1

**Diagnosis**:
```bash
# Run tests with verbose output
npm test -- --verbose
cargo test -- --nocapture
pytest -v
go test -v ./...
```

**Solutions**:
1. **Fix tests first**: Address failures before proceeding
2. **Check test environment**: Ensure dependencies installed
3. **Verify test command**: Confirm correct test command for project
4. **Ask user**: "Tests failing. Options: (A) Fix now (B) Show me failures (C) Skip (not recommended)"

**Never proceed to Step 3 with failing tests unless user explicitly overrides**

### Cannot Determine Base Branch

**Symptom**: Auto-detection fails, multiple candidates

**Diagnosis**:
```bash
# List all branches
git branch -a

# Check current branch's upstream
git rev-parse --abbrev-ref HEAD@{upstream}

# Check merge-base with common branches
git merge-base HEAD main
git merge-base HEAD master
git merge-base HEAD develop
```

**Solutions**:
1. **Ask user explicitly**: "Cannot determine base branch. Which branch should I merge into? (main/master/develop/other)"
2. **Check AGENTS.md**: Look for project-specific branch conventions
3. **Default to main**: If project uses main as primary branch

### PR Creation Fails (Option 2)

**Symptom**: `gh pr create` command fails

**Common Causes**:
- `gh` CLI not installed
- Not authenticated with GitHub
- No upstream remote configured
- Branch already has open PR

**Diagnosis**:
```bash
# Check gh CLI installation
gh --version

# Check authentication
gh auth status

# Check remote configuration
git remote -v

# Check existing PRs
gh pr list --head $(git branch --show-current)
```

**Solutions**:

**Not installed**:
```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
choco install gh
```

**Not authenticated**:
```bash
gh auth login
# Follow interactive prompts
```

**No upstream remote**:
```bash
# Add remote
git remote add origin <repository-url>

# Verify
git remote -v
```

**PR already exists**:
```bash
# List existing PRs
gh pr list

# Ask user: "PR already exists for this branch. Options: (A) Update existing (B) Cancel (C) Create draft PR"
```

### Merge Conflicts (Option 1)

**Symptom**: Merge fails with conflicts

**Diagnosis**:
```bash
# Check conflict status
git status

# Show conflicts
git diff --name-only --diff-filter=U
```

**Solutions**:
1. **Report conflicts**:
```text
Merge conflicts detected in:
- src/file1.js
- src/file2.py

Would you like to:
A) Resolve conflicts now
B) Abort merge and use Option 2 (PR) instead
C) Abort merge and keep branch (Option 3)
```

2. **Resolve conflicts** (if user chooses A):
```bash
# Show conflict details
git diff <file>

# After user resolves
git add <resolved-files>
git commit

# Verify tests
<test-command>
```

### Worktree Removal Fails

**Symptom**: `git worktree remove` fails

**Common Causes**:
- Worktree has uncommitted changes
- Worktree is locked
- Worktree directory doesn't exist

**Diagnosis**:
```bash
# List all worktrees
git worktree list

# Check worktree status
cd <worktree-path> && git status

# Check if locked
git worktree list | grep locked
```

**Solutions**:

**Uncommitted changes**:
```bash
# Stash changes
cd <worktree-path> && git stash

# Or commit them
git add . && git commit -m "Save work before cleanup"

# Then remove
git worktree remove <path>
```

**Locked worktree**:
```bash
# Unlock
git worktree unlock <path>

# Then remove
git worktree remove <path>
```

**Directory missing**:
```bash
# Prune stale worktree references
git worktree prune

# Verify clean state
git worktree list
```

### User Cancels Discard (Option 4)

**Symptom**: User types something other than "discard"

**Expected Behavior**:
```text
User typed: "cancel" (not "discard")

✓ Discard cancelled. Branch preserved.

What would you like to do instead?
1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)

Which option? (1-3)
```

**Re-present options 1-3** (exclude Option 4 since user just cancelled it)

---

## 8. SUCCESS CRITERIA

### Workflow Success

**Step 1 Complete**:
- ✅ Test command auto-detected or provided by user
- ✅ All tests pass (0 failures)
- ✅ Test results reported to user
- ✅ If tests fail, workflow blocks at Step 1

**Step 2 Complete**:
- ✅ Base branch determined (auto-detected or confirmed)
- ✅ Base branch verified as valid git branch
- ✅ User confirmation received (if ambiguous)

**Step 3 Complete**:
- ✅ Exactly 4 options presented
- ✅ Options formatted consistently
- ✅ User choice captured (1, 2, 3, or 4)

**Step 4 Complete** (varies by option):

**Option 1 (Merge)**:
- ✅ Base branch checked out successfully
- ✅ Latest changes pulled from remote
- ✅ Feature branch merged without conflicts
- ✅ Tests pass after merge
- ✅ Feature branch deleted (if tests pass)

**Option 2 (PR)**:
- ✅ Branch pushed to remote
- ✅ PR created with proper title and body
- ✅ PR URL provided to user

**Option 3 (Keep)**:
- ✅ Branch status reported
- ✅ Worktree path provided
- ✅ No cleanup performed

**Option 4 (Discard)**:
- ✅ Warning displayed with commit details
- ✅ User typed exact "discard" confirmation
- ✅ Branch force-deleted
- ✅ Deletion confirmed to user

**Step 5 Complete**:
- ✅ Worktree existence checked
- ✅ Worktree removed (Options 1, 2, 4 only)
- ✅ Worktree preserved (Option 3)
- ✅ Final status reported

### Quality Gates

**Before presenting options (Step 3)**:
- All tests must pass
- Base branch must be determined
- User must be informed of current state

**Before merge (Option 1)**:
- Base branch must be up to date
- No merge conflicts
- Tests must pass after merge

**Before PR (Option 2)**:
- Branch must be pushed successfully
- `gh` CLI must be available and authenticated
- PR title and body must be properly formatted

**Before discard (Option 4)**:
- User must type exact "discard" confirmation
- Warning must be displayed with full context
- No ambiguity in user intent

### Overall Success

**git-finish is successful when**:
- ✅ Tests verified before integration
- ✅ User presented with structured options
- ✅ Chosen workflow executed correctly
- ✅ Branch state is clean (merged, PR'd, kept, or discarded)
- ✅ Worktree cleaned up appropriately
- ✅ User informed of final state and next steps
- ✅ No data loss or accidental deletions
- ✅ Git repository in expected final state
- ✅ If release requested: annotated tag created AND `gh release create` executed (not just tag pushed)

---

## 9. RELATED RESOURCES

### Reference Files
- [worktree-workflows.md](./worktree-workflows.md) - Create isolated git workspaces with minimal branching
- [commit-workflows.md](./commit-workflows.md) - Professional commit practices with Conventional Commits
- [quick-reference.md](./quick-reference.md) - One-page cheat sheet for all git workflows
- [shared-patterns.md](./shared-patterns.md) - Common patterns and conventions across workflows

### External Resources
- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [Git Branch Management](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management) - Git branching best practices
- [Git Merge Strategies](https://git-scm.com/docs/git-merge) - Understanding git merge behavior
- [GitHub CLI Documentation](https://cli.github.com/manual/) - Complete gh CLI reference
- [Creating Pull Requests](https://cli.github.com/manual/gh_pr_create) - PR creation with gh CLI
- [GitHub Flow Guide](https://docs.github.com/en/get-started/quickstart/github-flow) - GitHub's recommended workflow
- [Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) - Effective PR collaboration
