# Task Breakdown: workflows-git Skill for Barter

## Phase 1: Core Skill Creation

- [ ] **T1.1** Create skill folder structure
  - Path: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-git/`
  - Create `references/` subfolder
  - Create `assets/` subfolder

- [ ] **T1.2** Create SKILL.md with frontmatter
  - name: workflows-git
  - description: Read-only git operations
  - allowed-tools: [Bash]
  - version: 1.0.0
  - Keywords comment for discoverability

- [ ] **T1.3** Write Section 1: WHEN TO USE
  - Activation triggers (read-only git queries)
  - When NOT to use (any write operations)
  - Keyword triggers list

- [ ] **T1.4** Write Section 2: SMART ROUTING
  - Simple routing (no sub-skills)
  - Resource loading logic
  - Phase detection (not needed - flat skill)

- [ ] **T1.5** Write Section 3: HOW IT WORKS
  - Read-only operations overview
  - Command categories
  - Output interpretation guidance

- [ ] **T1.6** Write Section 4: RULES (CRITICAL)
  - ALWAYS rules for read-only operations
  - NEVER rules for ALL write operations (comprehensive list)
  - ESCALATE IF conditions

- [ ] **T1.7** Write Section 5: SUCCESS CRITERIA
  - Read-only query complete
  - No write operations attempted
  - Output correctly interpreted

- [ ] **T1.8** Write Section 6: INTEGRATION POINTS
  - Framework integration (AGENTS.md reference)
  - Bash tool usage
  - No MCP integration note

- [ ] **T1.9** Write Section 7: QUICK REFERENCE
  - Essential read-only commands
  - Common patterns
  - Quick lookup table

- [ ] **T1.10** Write Section 8: RELATED RESOURCES
  - Link to quick_reference.md
  - Link to command_patterns.md
  - External git documentation

## Phase 2: Reference Documentation

- [ ] **T2.1** Create references/quick_reference.md
  - View history commands
  - Compare code commands
  - View structure commands
  - File history commands
  - Examples for each

- [ ] **T2.2** Create assets/command_patterns.md
  - Allowed command patterns
  - Real-world examples
  - Output interpretation tips
  - Common use cases

## Phase 3: Integration

- [ ] **T3.1** Update skill_advisor.py
  - Add workflows-git entry
  - Define keywords for routing
  - Set confidence threshold

- [ ] **T3.2** Update AGENTS.md
  - Add git read-only to Tool Routing Decision Tree
  - Add to Skills System section
  - Cross-reference with workflows-git skill

## Phase 4: Validation

- [ ] **T4.1** Test skill discovery
  - Verify skill_advisor.py routes correctly
  - Test keyword matching

- [ ] **T4.2** Validate SKILL.md structure
  - Compare with mcp-narsil structure
  - Compare with workflows-code structure
  - Ensure all sections present

- [ ] **T4.3** Verify forbidden operations documentation
  - Check comprehensive coverage
  - Ensure no write operations missed
  - Cross-reference with git documentation

- [ ] **T4.4** Test read-only command examples
  - Verify all examples work
  - Confirm output format
  - Check edge cases

## Priority Classification

| Priority | Tasks | Rationale |
|----------|-------|-----------|
| P0 (Blocker) | T1.6 (RULES) | Core requirement - must block writes |
| P0 (Blocker) | T1.2 (SKILL.md frontmatter) | Required for skill discovery |
| P1 (Must) | T1.3-T1.5, T1.7-T1.10 | Complete skill documentation |
| P1 (Must) | T2.1, T2.2 | Reference documentation |
| P1 (Must) | T3.1, T3.2 | Integration for routing |
| P2 (Should) | T4.1-T4.4 | Validation (can defer) |

## Dependencies

```
T1.1 (folder structure)
  └── T1.2-T1.10 (SKILL.md sections)
        └── T2.1, T2.2 (references, assets)
              └── T3.1, T3.2 (integration)
                    └── T4.1-T4.4 (validation)
```

## Estimated Effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| Phase 1 | T1.1-T1.10 | 60 min |
| Phase 2 | T2.1-T2.2 | 30 min |
| Phase 3 | T3.1-T3.2 | 30 min |
| Phase 4 | T4.1-T4.4 | 30 min |
| **Total** | 16 tasks | ~2.5 hours |
