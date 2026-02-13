# Implementation Plan: workflows-git Skill for Barter

## Technical Approach

### Architecture Overview

The Barter workflows-git skill will be a **stripped-down, read-only variant** of the anobel.com workflows-git skill. Key architectural decisions:

1. **Single-file primary structure**: SKILL.md as the main entry point
2. **Minimal references/assets**: Only read-only patterns and quick reference
3. **No sub-skill routing**: Unlike anobel.com (worktrees/commit/finish), this is a flat skill
4. **Hard enforcement via RULES section**: NEVER rules for all write operations

### File Structure

```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-git/
├── SKILL.md                           # Main skill file
├── references/
│   └── quick_reference.md             # Read-only command reference
└── assets/
    └── command_patterns.md            # Allowed command patterns with examples
```

### Skill Structure (Following Barter Conventions)

Based on analysis of existing Barter skills (mcp-narsil, workflows-code), the SKILL.md will follow this structure:

```markdown
---
name: workflows-git
description: "Read-only git operations guidance for viewing history, branches, tags, and diffs. STRICTLY PROHIBITS all write operations."
allowed-tools: [Bash]
version: 1.0.0
---

# Sections (matching Barter pattern):
1. WHEN TO USE
2. SMART ROUTING (simplified - no sub-skill routing)
3. HOW IT WORKS
4. RULES (CRITICAL - forbidden operations)
5. SUCCESS CRITERIA
6. INTEGRATION POINTS
7. QUICK REFERENCE
8. RELATED RESOURCES
```

### Integration Points

1. **skill_advisor.py**: Add entry for workflows-git with git-related keywords
2. **AGENTS.md**: Update Tool Routing Decision Tree for git operations
3. **No MCP integration**: Pure Bash-based skill (no GitHub MCP)

## Implementation Phases

### Phase 1: Core Skill Creation
**Duration**: ~1 hour
**Deliverables**:
- SKILL.md with complete structure
- Frontmatter with correct metadata
- All 8 sections populated

### Phase 2: Reference Documentation
**Duration**: ~30 minutes
**Deliverables**:
- references/quick_reference.md with read-only commands
- assets/command_patterns.md with examples

### Phase 3: Integration
**Duration**: ~30 minutes
**Deliverables**:
- skill_advisor.py updated with git keywords
- AGENTS.md updated with git routing

### Phase 4: Validation
**Duration**: ~30 minutes
**Deliverables**:
- Skill invocation test
- Verify forbidden operations are clearly documented
- Cross-reference with existing skills for consistency

## Technical Details

### SKILL.md Key Sections

#### Section 4: RULES (CRITICAL)

```markdown
### NEVER (HARD BLOCK - Write Operations)

1. **NEVER create commits**
   - `git commit` - FORBIDDEN
   - `git commit -m` - FORBIDDEN
   - `git commit --amend` - FORBIDDEN

2. **NEVER push to remote**
   - `git push` - FORBIDDEN
   - `git push origin` - FORBIDDEN
   - `git push --force` - FORBIDDEN
   - `git push --tags` - FORBIDDEN

3. **NEVER create or delete branches**
   - `git branch -b <name>` - FORBIDDEN
   - `git checkout -b <name>` - FORBIDDEN
   - `git branch -d <name>` - FORBIDDEN
   - `git branch -D <name>` - FORBIDDEN

4. **NEVER modify history**
   - `git rebase` - FORBIDDEN
   - `git reset` - FORBIDDEN
   - `git cherry-pick` - FORBIDDEN

5. **NEVER create tags**
   - `git tag <name>` - FORBIDDEN
   - `git tag -a` - FORBIDDEN

6. **NEVER merge**
   - `git merge` - FORBIDDEN

7. **NEVER stash**
   - `git stash` - FORBIDDEN
   - `git stash pop` - FORBIDDEN
```

#### Section 3: HOW IT WORKS

Focus on read-only operations:
- Viewing history (`git log`, `git show`)
- Comparing code (`git diff`)
- Understanding structure (`git branch`, `git tag`)
- File history (`git blame`)

### Keyword Triggers for skill_advisor.py

```python
"workflows-git": {
    "keywords": [
        "git log", "git history", "git show", "git diff",
        "git branch", "git branches", "git tag", "git tags",
        "git blame", "git status", "git remote", "git fetch",
        "view commits", "see changes", "compare branches"
    ],
    "description": "Read-only git operations (history, branches, diffs)"
}
```

## Differences from anobel.com workflows-git

| Aspect | anobel.com | Barter |
|--------|------------|--------|
| Write operations | Allowed (worktrees, commits, finish) | FORBIDDEN |
| Sub-skills | 3 (worktrees, commit, finish) | None |
| GitHub MCP | Full integration | None |
| PR workflow | Included | Excluded |
| Merge guidance | Included | Excluded |
| Reference files | 5 (worktree, commit, finish, shared, quick) | 1 (quick_reference) |
| Asset files | 3 (worktree, commit, pr templates) | 1 (command_patterns) |

## Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Create SKILL.md | 1 hour |
| 2 | Create references/quick_reference.md | 20 min |
| 2 | Create assets/command_patterns.md | 10 min |
| 3 | Update skill_advisor.py | 15 min |
| 3 | Update AGENTS.md | 15 min |
| 4 | Testing and validation | 30 min |
| **Total** | | ~2.5 hours |

## Rollback Plan

If issues arise:
1. Remove skill folder from Barter's .opencode/skill/
2. Revert skill_advisor.py changes
3. Revert AGENTS.md changes
4. Document issues in decision-record.md
