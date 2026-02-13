# Verification Checklist: workflows-git Skill for Barter

## Pre-Implementation Verification

### Research Complete
- [x] **P0** anobel.com workflows-git skill analyzed
- [x] **P0** Barter skill structure patterns documented
- [x] **P0** Read-only requirements from Dev Lead captured
- [x] **P1** Forbidden operations list comprehensive

### Spec Documentation Complete
- [x] **P0** spec.md created with requirements
- [x] **P0** plan.md created with technical approach
- [x] **P0** tasks.md created with task breakdown
- [x] **P0** checklist.md created (this file)
- [x] **P0** decision-record.md created

## Implementation Verification

### Phase 1: Core Skill (SKILL.md)
- [ ] **P0** Folder structure created at correct path
- [ ] **P0** SKILL.md frontmatter valid (name, description, allowed-tools, version)
- [ ] **P0** Section 4 (RULES) - ALL write operations listed in NEVER
- [ ] **P1** Section 1 (WHEN TO USE) complete
- [ ] **P1** Section 2 (SMART ROUTING) complete
- [ ] **P1** Section 3 (HOW IT WORKS) complete
- [ ] **P1** Section 5 (SUCCESS CRITERIA) complete
- [ ] **P1** Section 6 (INTEGRATION POINTS) complete
- [ ] **P1** Section 7 (QUICK REFERENCE) complete
- [ ] **P1** Section 8 (RELATED RESOURCES) complete

### Phase 2: Reference Documentation
- [ ] **P1** references/quick_reference.md created
- [ ] **P1** assets/command_patterns.md created
- [ ] **P2** All examples tested and working

### Phase 3: Integration
- [ ] **P1** skill_advisor.py updated with workflows-git
- [ ] **P1** AGENTS.md updated with git routing
- [ ] **P2** Routing tested with sample queries

### Phase 4: Validation
- [ ] **P2** Skill discovery via skill_advisor.py works
- [ ] **P2** SKILL.md structure matches Barter conventions
- [ ] **P0** No write operations appear in ALLOWED commands
- [ ] **P2** Read-only command examples verified

## Quality Gates

### Structure Validation
| Check | Status | Evidence |
|-------|--------|----------|
| SKILL.md has valid frontmatter | Pending | |
| All 8 sections present | Pending | |
| Keywords comment included | Pending | |
| Matches mcp-narsil structure | Pending | |

### Rules Validation (CRITICAL)
| Forbidden Operation | Documented in NEVER | Evidence |
|---------------------|---------------------|----------|
| git commit | Pending | |
| git push | Pending | |
| git branch -b | Pending | |
| git checkout -b | Pending | |
| git branch -d/-D | Pending | |
| git tag (create) | Pending | |
| git push --tags | Pending | |
| git push --force | Pending | |
| git merge | Pending | |
| git rebase | Pending | |
| git reset | Pending | |
| git stash | Pending | |
| git cherry-pick | Pending | |

### Integration Validation
| Check | Status | Evidence |
|-------|--------|----------|
| skill_advisor.py routes correctly | Pending | |
| AGENTS.md lists skill | Pending | |
| No conflicts with other skills | Pending | |

## Sign-Off

| Milestone | Date | Verified By |
|-----------|------|-------------|
| Spec folder created | 2026-01-06 | Agent |
| Research completed | 2026-01-06 | Agent |
| Implementation complete | Pending | |
| Validation complete | Pending | |
| Ready for deployment | Pending | |

## Notes

- Priority P0 = HARD BLOCKER (must complete before claiming done)
- Priority P1 = MUST complete OR explicit user-approved deferral
- Priority P2 = CAN defer without explicit approval

- **CRITICAL**: The RULES section (P0) is the most important part of this skill. Without comprehensive forbidden operations, the skill fails its primary purpose.
