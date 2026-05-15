---
title: "Iter 014 — Track 5: doc version + framework metric footer"
iteration: 14
track: 5
focus: "doc version + framework metric footer"
status: complete
newInfoRatio: 0.20
---

# Iter 014 — Track 5: doc version + framework metric footer

## RQ

Find the footer line in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` (currently around line 1497 / 1494: "Documentation version: 4.11 | Last updated: 2026-05-15 | Framework: 11 agents, 20 skills, 22 commands, 66 MCP tools"). Verify each number against current reality:
- doc version: trace 4.11 to a commit / changelog entry
- last updated date: most recent README commit
- 11 agents (cross-check with iter 002 findings if available)
- 20 skills
- 22 commands
- 66 MCP tools (cross-check with iter 001 finding of 69 actual)

Flag drift in any of these.

## Findings

### F-014-001: Documentation version 4.11
- **Claim in README**: "Documentation version: 4.11" (line 1497)
- **Current truth**: Cannot verify. No source found for version 4.11 in:
  - No CHANGELOG.md at project root
  - package.json shows version "0.0.0"
  - No VERSION file found
  - Git log access blocked (permission mode)
- **Status**: UNKNOWN (cannot verify without git access or changelog)
- **Suggested edit**: None pending verification

### F-014-002: Last updated date 2026-05-15
- **Claim in README**: "Last updated: 2026-05-15" (line 1497)
- **Current truth**: Date matches today's date (2026-05-15 per system context), but cannot verify against actual README commit history due to git access restriction
- **Status**: UNKNOWN (cannot verify without git log access)
- **Suggested edit**: None pending verification

### F-014-003: Agent count 11
- **Claim in README**: "11 agents" (line 1497)
- **Current truth**: 11 agents verified by counting .opencode/agents/*.md files
- **Cross-check**: Matches iteration 002 finding (F-002-001: CURRENT)
- **Status**: CURRENT
- **Suggested edit**: None

### F-014-004: Skill count 20
- **Claim in README**: "20 skills" (line 1497)
- **Current truth**: 20 skills verified by counting .opencode/skills/*/SKILL.md files
- **Cross-check**: Matches iteration 002 finding (F-002-002: CURRENT)
- **Status**: CURRENT
- **Suggested edit**: None

### F-014-005: Command count 22
- **Claim in README**: "22 commands" (line 1497)
- **Current truth**: 22 commands verified by counting .opencode/commands/**/*.md files
- **Cross-check**: Matches iteration 002 finding (F-002-003: CURRENT)
- **Status**: CURRENT
- **Suggested edit**: None

### F-014-006: MCP tools total 66
- **Claim in README**: "66 MCP tools" (line 1497)
- **Current truth**: 69 tools per iteration 001 finding (F-001-001: DRIFTED)
- **Cross-check**: Confirmed drifted - actual breakdown is 39 + 9 + 11 + 7 + 2 + 1 = 69
- **Status**: DRIFTED
- **Suggested edit**: Change "66" -> "69"

### F-014-007: MCP tools breakdown
- **Claim in README**: "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking"
- **Current truth**: Per iteration 001 findings:
  - mk-spec-memory: 39 (CURRENT)
  - mk_skill_advisor: 9 actual vs 8 claimed (DRIFTED)
  - mk_code_index: 11 actual vs 10 claimed (DRIFTED)
  - code_mode: 7 (CURRENT)
  - CocoIndex: 2 actual vs 1 claimed (DRIFTED)
  - sequential_thinking: 1 (CURRENT)
- **Status**: 3 of 6 breakdown values drifted
- **Suggested edit**: Update breakdown to "39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 CocoIndex + 1 sequential thinking"

## Coverage notes

Footer line verified at line 1497. Cross-checked with iteration 001 (MCP tool counts) and iteration 002 (agent/skill/command counts). Git access blocked for version/date verification.

## newInfoRatio rationale

newInfoRatio: 0.20 - Low novelty because this iter primarily confirms known drifts from iterations 001 and 002. The only new verification is the doc version and date fields, which could not be verified due to git access restrictions. The MCP tool drift (66→69) was already documented in iteration 001.

ITER_014_COMPLETE: 3 findings, newInfoRatio=0.20
