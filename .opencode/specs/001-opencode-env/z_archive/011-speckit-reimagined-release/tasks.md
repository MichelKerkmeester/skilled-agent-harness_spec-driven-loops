# Tasks: Causal Memory & Command Consolidation (v1.2.0.0)

---

## Task Overview

| ID | Task | Status | Agent |
|----|------|--------|-------|
| T01 | Read skill CHANGELOGs | Pending | Sonnet x9 |
| T02 | Analyze source specs | Pending | Opus x6 |
| T03 | Draft CHANGELOG entries | Pending | Opus x3 |
| T04 | Draft GitHub release notes | Pending | Opus x1 |
| T05 | Update global CHANGELOG.md | Pending | Main |
| T06 | Update skill CHANGELOGs | Pending | Main |
| T07 | Review README.md | Pending | Main |
| T08 | Git review (status/diff) | Pending | Main |
| T09 | User approval gate | Pending | Main |
| T10 | Git commit and push | Pending | Main |
| T11 | Create GitHub release | Pending | Main |
| T12 | Update PUBLIC_RELEASE.md | Pending | Main |

---

## Detailed Tasks

### T01: Read Skill CHANGELOGs [PARALLEL - Sonnet]
**Objective:** Verify current state of all skill CHANGELOGs
**Agents:** 9 Sonnet agents (one per skill)
**Output:** Current version and last entry for each skill

Skills to check:
1. system-spec-kit
2. workflows-documentation
3. mcp-code-mode
4. mcp-figma
5. mcp-narsil
6. workflows-code--web-dev
7. workflows-code--full-stack
8. workflows-chrome-devtools
9. workflows-git

---

### T02: Analyze Source Specs [PARALLEL - Opus]
**Objective:** Extract key changes from each spec
**Agents:** 6 Opus agents (one per spec)
**Output:** Structured summary of changes

Specs to analyze:
1. 082-speckit-reimagined
2. 083-memory-command-consolidation
3. 083-speckit-reimagined-bug-fixes
4. 084-speckit-30-agent-audit
5. 085-speckit-audit-fixes
6. 004-style-enforcement

---

### T03: Draft CHANGELOG Entries [PARALLEL - Opus]
**Objective:** Write CHANGELOG entries following template
**Agents:** 3 Opus agents
**Output:** Markdown content ready to insert

1. Global CHANGELOG.md entry
2. system-spec-kit CHANGELOG.md entry
3. workflows-documentation CHANGELOG.md entry

---

### T04: Draft GitHub Release Notes [Opus]
**Objective:** Create release notes following PUBLIC_RELEASE.md template
**Output:** Complete release notes with:
- Summary with bold stats
- Highlights with emoji headers
- Files Changed
- Upgrade section
- Full Changelog link

---

### T05-T12: Sequential Execution [Main]
**Objective:** Execute release workflow with user approval gate
**Depends:** T01-T04 complete
