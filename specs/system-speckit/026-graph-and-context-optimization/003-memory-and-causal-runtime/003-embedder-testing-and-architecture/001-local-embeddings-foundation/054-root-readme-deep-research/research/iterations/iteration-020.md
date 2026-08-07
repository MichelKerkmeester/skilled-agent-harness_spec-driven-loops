# Iteration 020 — Track 7: Residual Catch-All

## Finding 1: "Cross-Runtime Hooks" tagline pillar lacks dedicated section
**Location:** Line 11 tagline
**Issue:** The tagline lists "Cross-Runtime Hooks" as one of 8 pillars, but there is no dedicated section explaining what cross-runtime hooks are or how they work.
**Evidence:** 
- Line 11: "**📋 Spec Kit Framework** • **🧠 Cognitive Memory** • **🤖 11 Specialized Agents** • **🎯 20 On-Demand Skills** • **🔍 Code Index + Graph** • **🪝 Cross-Runtime Hooks** • **⚡ 5 Mirrored Runtimes** • **➕ More**"
- Hooks are mentioned incidentally in other sections (skill advisor hooks at line 744-747, startup hooks at line 595) but never as a cohesive feature with its own section
- Other pillars (Spec Kit, Memory, Agents, Skills, Code Index+Graph) all have dedicated sections
**Impact:** Documentation gap - a pillar in the tagline should have a corresponding explanatory section
**Recommendation:** Add a dedicated "Cross-Runtime Hooks" section explaining the hook system, or remove it from the tagline if it's not a first-class feature

## Finding 2: "5 Mirrored Runtimes" terminology is misleading
**Location:** Line 11 tagline, lines 907, 1427
**Issue:** Tagline claims "5 Mirrored Runtimes" but only 3 runtimes actually have mirrored agents
**Evidence:**
- Line 11: "**⚡ 5 Mirrored Runtimes**"
- Line 907: "11 custom specialist agents. Defined in `.opencode/agents/` (source of truth), **mirrored for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`), and Gemini CLI (`.gemini/agents/`)** runtime surfaces."
- Line 1427: "Agent definitions are mirrored in the checked-in Claude, Codex, and Gemini runtime directories; **OpenCode and Copilot use runtime-specific MCP/startup integration rather than a dedicated agent mirror.**"
- Line 60 runtime coverage table confirms 5 runtimes: "OpenCode, Codex CLI, Claude Code, Gemini CLI, plus Copilot MCP/startup support"
**Impact:** Terminology inaccuracy - "mirrored" implies agent mirroring, but only 3 of 5 runtimes use that pattern
**Recommendation:** Change tagline to "5 Runtimes" or "5 Runtime Coverage" and add clarification that only 3 use agent mirroring while 2 use MCP/startup integration
