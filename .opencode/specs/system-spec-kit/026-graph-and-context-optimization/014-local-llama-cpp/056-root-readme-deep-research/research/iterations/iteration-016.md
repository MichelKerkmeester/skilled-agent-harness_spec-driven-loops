# Iteration 016 — Track 6: FAQ Q&A accuracy

## Summary

Walked every Q&A in the FAQ section of `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` (lines 1415-1462). Verified each answer for current accuracy: tool counts, file paths, workflows, and commands.

## Findings

### 1. MCP tool count discrepancy (Q: How many MCP tools are there and where are they defined?)

**Location:** Line 1453-1455  
**Issue:** Stale tool count and incorrect breakdown  
**Details:**
- Claims "66 total across 6 native MCP servers" but actual count is 67
- Breakdown claims "1 semantic code search tool (cocoindex_code)" but cocoindex_code actually has 2 tools: `search` and `cocoindex_refresh_index`
- Correct breakdown should be: 39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 2 cocoindex_code + 1 sequential thinking = 67 total
- Evidence from `mcp_list_tools` calls and `.claude/mcp.json` NOTE_2_TOOLS confirms mk-spec-memory has 39 tools

### 2. Broken agent path (Q: How do I contribute a new agent definition?)

**Location:** Line 1451  
**Issue:** Non-existent directory path  
**Details:**
- Answer states: "copy the adapter to `.agents/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`"
- The `.agents/agents/` directory does not exist in the repository
- Verified with `ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.agents/` — exit code 1 (directory not found)
- The other three paths (`.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) exist and contain agent files
- This would mislead users attempting to follow the contribution workflow

### 3. Feature catalog count discrepancy (Q: What is the feature catalog?)

**Location:** Line 1459  
**Issue:** Stale feature entry count  
**Details:**
- Claims "290-entry reference across 22 categories" but actual count is 218 features
- Verified with `grep -c "^### [A-Z]"` on feature catalog file returns 218
- The 22 categories count is correct (sections 1-22 exist)
- File path `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` is correct
- This is a numerical discrepancy that could mislead users about the catalog's scope

## Verified Accurate (No Issues)

The following Q&A were verified as current and accurate:

1. **Q: Do I need all 20 skills installed to use the framework?** (Line 1421) — 20 skills count confirmed via SKILL.md file count
2. **Q: Is this only for OpenCode, or does it work with other runtimes?** (Line 1425) — Runtime support verified via agent directory existence
3. **Q: What happens if I do not use a spec folder?** (Line 1429) — Gate 3 behavior description aligns with framework documentation
4. **Q: How does the memory system know what is relevant to my current task?** (Line 1433) — Memory functions and commands referenced are current
5. **Q: Can I use this framework without the cognitive memory features?** (Line 1437) — Spec Kit independence accurately described
6. **Q: How do I add a new skill to the framework?** (Line 1441) — `/create:sk-skill` command exists at `.opencode/commands/create/sk-skill.md`
7. **Q: What does "local-first" mean for the memory system?** (Line 1445) — Embedding providers (Voyage AI, OpenAI, HuggingFace) match mcp.json configuration

ITER_016_COMPLETE: 3 findings, newInfoRatio=0.30
