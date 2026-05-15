---
title: "Iter 002 — Track 1: agent + skill + command counts"
iteration: 2
track: 1
focus: "agent + skill + command counts"
status: complete
newInfoRatio: 0.00
---

# Iter 002 — Track 1: agent + skill + command counts

## RQ
Walk every claim about agent count (currently "11 agents"), skill count (currently "20 skills"), and command count (currently "22 commands") in the project root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md`. Verify by:
- Agents: count `.opencode/agents/*.md` (exclude README.txt)
- Skills: count `.opencode/skills/*/SKILL.md`
- Commands: count `.opencode/commands/**/*.md`

Report exact actual counts and any drift. Cite README line numbers + ls output for evidence.

## Actions
- Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md`
- Find files matching `*.md` in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents`
- Find files matching `SKILL.md` in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills`
- Find files matching `**/*.md` in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands`

## Findings

### F-002-001: Agent count
- **Claim in README**: "11 agents, 20 skills, 22 command entry points" (line 7), "🤖 11 Specialized Agents" (line 11), "🤖 11 Agents" (line 54)
- **Current truth**: 11 agents (code.md, context.md, debug.md, deep-agent-improvement.md, deep-ai-council.md, deep-research.md, deep-review.md, markdown.md, orchestrate.md, prompt-improver.md, review.md)
- **Status**: CURRENT
- **Suggested edit**: None

### F-002-002: Skill count
- **Claim in README**: "20 skills" (line 7), "🎯 20 On-Demand Skills" (line 11), "🎯 20 Skills" (line 55)
- **Current truth**: 20 skills (cli-claude-code, cli-codex, cli-devin, cli-gemini, cli-opencode, deep-agent-improvement, deep-ai-council, deep-research, deep-review, mcp-chrome-devtools, mcp-coco-index, mcp-code-mode, sk-code-review, sk-code, sk-doc, sk-git, sk-prompt, system-code-graph, system-skill-advisor, system-spec-kit)
- **Status**: CURRENT
- **Suggested edit**: None

### F-002-003: Command count
- **Claim in README**: "22 command entry points" (line 7), "⌨️ 22 Commands" (line 56)
- **Current truth**: 22 commands (agent_router.md, create/agent.md, create/changelog.md, create/feature-catalog.md, create/folder_readme.md, create/sk-skill.md, create/testing-playbook.md, doctor.md, doctor/mcp.md, doctor/update.md, improve/agent.md, improve/prompt.md, memory/learn.md, memory/manage.md, memory/save.md, memory/search.md, spec_kit/complete.md, spec_kit/deep-research.md, spec_kit/deep-review.md, spec_kit/implement.md, spec_kit/plan.md, spec_kit/resume.md)
- **Status**: CURRENT
- **Suggested edit**: None

## Coverage notes
Lines scanned in README.md: 7, 11, 54-56 (primary claim locations for agent/skill/command counts)

## newInfoRatio rationale
All claimed counts match actual filesystem counts exactly. No new information discovered; this is a verification pass that confirms existing documentation is accurate.
