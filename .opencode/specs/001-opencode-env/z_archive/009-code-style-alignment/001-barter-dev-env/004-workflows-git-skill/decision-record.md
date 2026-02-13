# Decision Record: workflows-git Skill for Barter

## Overview

This document records architectural and design decisions made during the creation of the Barter workflows-git skill.

---

## DR-001: Read-Only Policy Enforcement

### Context
The Barter Coder agent needs git workflow guidance, but operates in a controlled environment where repository modifications are prohibited.

### Decision
Implement a **strict read-only policy** with comprehensive NEVER rules in SKILL.md Section 4.

### Rationale
1. **Safety**: Prevents accidental commits, pushes, or branch modifications
2. **Control**: Barter environment requires controlled access to repositories
3. **Clarity**: Explicit forbidden list leaves no ambiguity
4. **Auditability**: Clear documentation of what's blocked and why

### Alternatives Considered
1. **Soft warnings only**: Rejected - too easy to bypass
2. **No git skill at all**: Rejected - read operations are valuable for code understanding
3. **Configuration-based read/write toggle**: Rejected - adds complexity, Barter always read-only

### Consequences
- Agent cannot help with commit workflows, PRs, or branch management
- Clear separation from anobel.com's full-featured workflows-git
- May need separate documentation for manual git operations

---

## DR-002: Skill Structure - Flat vs Hierarchical

### Context
The anobel.com workflows-git uses a 3-phase hierarchical structure (worktrees, commit, finish). Should Barter follow this pattern?

### Decision
Use a **flat skill structure** with no sub-skill routing.

### Rationale
1. **Simplicity**: Read-only operations don't need phase management
2. **All phases eliminated**: Worktrees (write), commit (write), finish (write) - all forbidden
3. **Single concern**: Only read operations remain
4. **Reduced complexity**: No smart routing between sub-skills needed

### Alternatives Considered
1. **Mirror anobel.com structure**: Rejected - 90% of content would be "FORBIDDEN"
2. **Create read-only sub-skills**: Rejected - unnecessary complexity for simple use case

### Consequences
- Simpler SKILL.md with all content in one file
- Minimal references/assets folders
- Easier to maintain

---

## DR-003: Integration Approach

### Context
How should the Barter workflows-git integrate with the broader OpenCode environment?

### Decision
**Minimal integration** - skill_advisor.py and AGENTS.md only, no MCP.

### Rationale
1. **No GitHub MCP**: Write operations (PR, merge) are forbidden
2. **Bash-only**: All read operations work via Bash tool
3. **Standard routing**: skill_advisor.py handles discovery
4. **AGENTS.md update**: Documents git tool routing

### Alternatives Considered
1. **GitHub MCP for read-only remote queries**: Rejected - adds complexity, most queries are local
2. **Dedicated git MCP server**: Rejected - overkill for read-only operations

### Consequences
- Simpler allowed-tools list: [Bash] only
- No Code Mode integration needed
- Relies on standard git CLI

---

## DR-004: Reference Documentation Scope

### Context
The anobel.com workflows-git has 5 reference files and 3 asset files. How much documentation does Barter need?

### Decision
**Minimal documentation** - 1 reference file (quick_reference.md) and 1 asset file (command_patterns.md).

### Rationale
1. **Reduced scope**: Only read operations to document
2. **Avoid duplication**: External git docs cover basics
3. **Focus on patterns**: What matters is showing allowed commands
4. **Maintainability**: Less to update when git changes

### Alternatives Considered
1. **Full parity with anobel.com**: Rejected - most content would be irrelevant
2. **No reference files**: Rejected - quick reference is valuable

### Consequences
- Compact skill folder
- SKILL.md carries most content
- Easy to add more references later if needed

---

## DR-005: Keyword Triggers for Routing

### Context
What keywords should trigger routing to workflows-git via skill_advisor.py?

### Decision
Focus on **read-operation verbs and git-specific nouns**.

### Keywords Selected
```
git log, git history, git show, git diff,
git branch, git branches, git tag, git tags,
git blame, git status, git remote, git fetch,
view commits, see changes, compare branches
```

### Rationale
1. **Action-oriented**: "view", "see", "compare" indicate read operations
2. **Git-specific**: "log", "diff", "blame" are unambiguous
3. **Avoid write triggers**: No "commit", "push", "merge" in keywords
4. **User language**: "see changes" is how users ask

### Alternatives Considered
1. **Include all git keywords**: Rejected - would catch write operations
2. **Only technical terms**: Rejected - misses natural language queries

### Consequences
- Clear routing to read-only skill
- Write-oriented queries won't match (good)
- May need tuning based on actual usage

---

## DR-006: Handling Write Operation Requests

### Context
What happens when a user asks the agent to commit, push, or create a branch?

### Decision
**Hard block with explanation** - skill documents that operation is forbidden and explains why.

### Response Pattern
```
BLOCKED: git commit is a write operation.

This environment uses read-only git access. The following operations are FORBIDDEN:
- git commit, git push, git merge, git branch -b, etc.

If you need to commit changes, please use manual git commands outside of this agent.
```

### Rationale
1. **Transparency**: User knows why operation failed
2. **Education**: Lists what's forbidden
3. **Workaround**: Suggests manual path
4. **No silent failure**: Explicit feedback

### Alternatives Considered
1. **Silently ignore**: Rejected - confusing user experience
2. **Suggest alternative agent**: Rejected - no write agent exists
3. **Execute and hope**: Rejected - violates requirements

### Consequences
- Clear user communication
- Documented in ESCALATE IF section
- Agent maintains trust by being explicit

---

## Summary Table

| ID | Decision | Key Factor |
|----|----------|------------|
| DR-001 | Read-only policy | Safety/Control |
| DR-002 | Flat skill structure | Simplicity |
| DR-003 | Minimal integration | Reduced complexity |
| DR-004 | Minimal documentation | Maintainability |
| DR-005 | Read-focused keywords | Accurate routing |
| DR-006 | Hard block with explanation | User transparency |

---

## Future Considerations

1. **GitHub MCP Read-Only**: If remote queries become valuable, could add read-only GitHub MCP integration
2. **Git Graph Visualization**: Could integrate with Narsil for git history visualization
3. **Audit Logging**: Could add logging of blocked write attempts for security review
