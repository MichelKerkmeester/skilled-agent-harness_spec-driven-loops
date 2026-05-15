# Iteration 019 — Track 7: Copilot support + hook coverage per runtime

## Summary

Walked every claim in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` about runtime support. The README claims 5 mirrored runtimes (OpenCode, Codex CLI, Claude Code, Gemini CLI, Copilot). Cross-checked against actual hook coverage documented in `.opencode/skills/system-spec-kit/references/config/hook_system.md`.

## Findings

### 1. Misleading "5 mirrored runtimes" claim

**Location:** Line 11  
**Issue:** Runtimes are NOT mirrored - they have significantly different hook coverage  
**Details:**
- README claims "⚡ 5 Mirrored Runtimes" implying parity across all runtimes
- Actual hook coverage from `hook_system.md` §8 shows major differences:
  - Claude: Full hook surface (UserPromptSubmit, SessionStart, PreCompact, Stop)
  - Gemini: Full hook surface (BeforeAgent, SessionStart, PreCompress, SessionEnd)
  - OpenCode: Plugin-based (experimental.chat.system.transform, event handlers for startup/compact/cleanup)
  - Codex: Partial (UserPromptSubmit + SessionStart only when codex_hooks enabled; NO compaction or stop hooks)
  - Copilot: Limited (file-based custom instructions with NEXT-PROMPT freshness; SessionStart writer; limited cache/writer path; no model-visible precompute injection)
- "Mirrored" implies identical capabilities, which is false - this is a fundamental misrepresentation

### 2. Copilot coverage mischaracterized as "MCP and startup-surface workflows"

**Location:** Line 7  
**Issue:** Copilot does NOT have MCP hook parity with other runtimes  
**Details:**
- README claims "Copilot support for MCP and startup-surface workflows"
- Actual Copilot support from `hook_system.md` §33, §105:
  - File-based custom instructions refresh in `$HOME/.copilot/copilot-instructions.md`
  - NEXT-PROMPT freshness: current prompt sees PRIOR turn's brief (not in-turn injection)
  - SessionStart writer exists but has limited cache/writer path
  - NO model-visible precompute injection for compaction
  - Hook output remains `{}` with next-prompt semantics
- This is NOT "MCP hook support" in the same sense as Claude/Gemini/Codex - it's a file-writer workaround with delayed freshness

### 3. "All four supported runtimes" claim is inaccurate

**Location:** Line 595  
**Issue:** Copilot is NOT a full peer in the "four supported runtimes" for code graph startup injection  
**Details:**
- README states: "All four supported runtimes (Claude Code, Gemini CLI, GitHub Copilot, Codex CLI) transport the same compact startup shared-payload"
- `hook_system.md` §105 shows Copilot has "limited cache/writer path; no model-visible precompute injection"
- Copilot refreshes a managed block but does NOT inject model-visible context during the precompute phase
- The phrase "transport the same compact startup shared-payload" implies identical delivery mechanisms, which is false for Copilot

### 4. Codex requires explicit opt-in for native hooks (not documented in README)

**Location:** Line 60, Line 744  
**Issue:** README implies Codex has full hook support by default  
**Details:**
- README lists Codex CLI alongside Claude/Gemini as a runtime with hook adapters
- `hook_system.md` §35, §104, §109 shows Codex only has live native-hook readiness when:
  - `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` or equivalent launch flag
  - User/workspace `hooks.json` is wired
  - The checked-in `.codex/settings.json` is explicitly marked as "template/example, not the live readiness predicate"
- Codex has NO compaction or stop hooks even when enabled
- README does not mention this opt-in requirement, misleading users about Codex's out-of-the-box readiness

### 5. Inconsistent runtime naming across README sections

**Location:** Lines 7, 60, 595, 744  
**Issue:** Runtime names are inconsistent (Copilot CLI vs GitHub Copilot vs Copilot)  
**Details:**
- Line 7: "Copilot support for MCP and startup-surface workflows"
- Line 60: "plus Copilot MCP/startup support"
- Line 595: "GitHub Copilot"
- Line 744: "Copilot CLI"
- `hook_system.md` uses "Copilot CLI" consistently
- This inconsistency makes it unclear whether the README refers to GitHub Copilot (the VS Code extension) or a CLI variant

## Verified Accurate (No Issues)

The following claims are accurate based on `hook_system.md`:

1. **Line 7**: Mentions OpenCode, Codex CLI, Claude Code, Gemini CLI as supported runtimes - these all have some form of hook support
2. **Line 595**: Claude/Gemini/Codex do transport startup payloads through their hooks (though Codex requires opt-in)
3. **Line 744**: Claude/Codex/Gemini do call prompt-time hook adapters under `.opencode/skills/system-spec-kit/mcp_server/hooks/`
4. **Line 745**: OpenCode does use plugin-based transport rather than shell wrappers

ITER_019_COMPLETE: 5 findings, newInfoRatio=0.42
