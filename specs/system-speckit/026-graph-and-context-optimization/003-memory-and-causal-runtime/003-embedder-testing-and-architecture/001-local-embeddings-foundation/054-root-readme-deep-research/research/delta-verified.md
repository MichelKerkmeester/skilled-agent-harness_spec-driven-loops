# Root README delta — verified (056)

Date: 2026-05-15
Iterations source: 20 iter outputs under research/iterations/
Cross-checker: cli-devin SWE 1.6 (Phase 3 synthesis pass)

## Final action list

EDIT 1: README.md:57
  FROM: "66 MCP Tools"
  TO:   "69 MCP Tools"
  REASON: Total tool count drifted from 66 to 69 (39+9+11+7+2+1)
  ITER: 001, 014, 016

EDIT 2: README.md:1455
  FROM: "66 total across 6 native MCP servers"
  TO:   "69 total across 6 native MCP servers"
  REASON: FAQ tool count drifted from 66 to 69
  ITER: 001, 014, 016

EDIT 3: README.md:1497
  FROM: "66 MCP tools"
  TO:   "69 MCP tools"
  REASON: Footer tool count drifted from 66 to 69
  ITER: 001, 014

EDIT 4: README.md:57
  FROM: "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking"
  TO:   "39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 CocoIndex + 1 sequential thinking"
  REASON: MCP tool breakdown drifted: mk_skill_advisor 8→9, mk_code_index 10→11, CocoIndex 1→2
  ITER: 001, 014

EDIT 5: README.md:1455
  FROM: "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 semantic code search tool (cocoindex_code) + 1 sequential thinking"
  TO:   "39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 cocoindex_code + 1 sequential thinking"
  REASON: FAQ MCP tool breakdown drifted
  ITER: 001, 016

EDIT 6: README.md:1497
  FROM: "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking"
  TO:   "39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 CocoIndex + 1 sequential thinking"
  REASON: Footer MCP tool breakdown drifted
  ITER: 001, 014

EDIT 7: README.md:671
  FROM: "mk_skill_advisor (8)" / "Eight tools cover the public surface"
  TO:   "mk_skill_advisor (9)" / "Nine tools cover the public surface (8 public + 1 internal)"
  REASON: mk_skill_advisor has 9 tools (4 advisor + 5 skill-graph); README claims 8
  ITER: 001

EDIT 8: README.md:59
  FROM: "standalone MCP server identity `mk-code-index`"
  TO:   "standalone MCP server identity `mk_code_index`"
  REASON: Naming inconsistency - opencode.json uses underscore, README sometimes uses hyphen
  ITER: 004

EDIT 9: README.md:110
  FROM: "established `mk-code-index` as the standalone server identity"
  TO:   "established `mk_code_index` as the standalone server identity"
  REASON: Naming inconsistency - opencode.json uses underscore, README sometimes uses hyphen
  ITER: 004

EDIT 10: README.md:1451
  FROM: "copy the adapter to `.agents/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`"
  TO:   "copy the adapter to `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`"
  REASON: `.agents/agents/` directory does not exist; correct path is `.opencode/agents/`
  ITER: 016

EDIT 11: README.md:1459
  FROM: "290-entry reference across 22 categories"
  TO:   "218-entry reference across 22 categories"
  REASON: Feature catalog has 218 features, not 290
  ITER: 016

EDIT 12: README.md:133-135
  FROM: "cd .opencode/skills/system-spec-kit/mcp_server && npm install && npm run build"
  TO:   "[REWRITE REQUIRED] Quick Step 3: Use launcher script or document actual build process"
  REASON: No package.json exists in mcp_server directory; documented build process is broken
  ITER: 017

EDIT 13: README.md:137-139
  FROM: "cd .opencode/skills/system-skill-advisor/mcp_server && npm run build"
  TO:   "[REWRITE REQUIRED] Quick Step 4: Use launcher script or document actual build process"
  REASON: No package.json exists in skill-advisor mcp_server directory; documented build process is broken
  ITER: 017

EDIT 14: README.md:141-143
  FROM: "cd .opencode/skills/system-code-graph && npm install && node node_modules/typescript/bin/tsc -p tsconfig.json"
  TO:   "[REWRITE REQUIRED] Quick Step 5: Use launcher script or document actual build process"
  REASON: No package.json exists in system-code-graph directory; documented build process is broken
  ITER: 017

EDIT 15: README.md:145-147
  FROM: "cd .opencode/skills/system-spec-kit/scripts && npm install && npm run build"
  TO:   "[REWRITE REQUIRED] Quick Step 6: Use launcher script or document actual build process"
  REASON: No package.json exists in scripts directory; documented build process is broken
  ITER: 017

EDIT 16: README.md:175
  FROM: "node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js --help"
  TO:   "[REWRITE REQUIRED] Verification command - dist directory does not exist"
  REASON: No dist directory exists in mcp_server; verification step assumes successful build that cannot complete
  ITER: 017

EDIT 17: README.md:178
  FROM: "rg '"mk-spec-memory"|"mk_skill_advisor"|"mk_code_index"|"cocoindex_code"' opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json"
  TO:   "[REWRITE REQUIRED] Verification command - rg not standard and configs missing on fresh install"
  REASON: ripgrep not pre-installed on most systems; 3 of 4 config files don't exist on fresh clone
  ITER: 017

EDIT 18: README.md:11
  FROM: "⚡ 5 Mirrored Runtimes"
  TO:   "⚡ 5 Runtimes"
  REASON: Only 3 runtimes use agent mirroring; 2 use MCP/startup integration - "mirrored" is misleading
  ITER: 019, 020

EDIT 19: README.md:907
  FROM: "mirrored for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`), and Gemini CLI (`.gemini/agents/`)"
  TO:   "mirrored for Claude Code (`.claude/agents/`), Codex CLI (`.codex/agents/`), and Gemini CLI (`.gemini/agents/`); OpenCode and Copilot use runtime-specific MCP/startup integration"
  REASON: Clarify that only 3 runtimes use agent mirroring
  ITER: 019, 020

EDIT 20: README.md:1427
  FROM: "Agent definitions are mirrored in the checked-in Claude, Codex, and Gemini runtime directories; OpenCode and Copilot use runtime-specific MCP/startup integration rather than a dedicated agent mirror."
  TO:   "Agent definitions are mirrored in the checked-in Claude, Codex, and Gemini runtime directories; OpenCode and Copilot use runtime-specific MCP/startup integration rather than a dedicated agent mirror."
  REASON: This line is actually accurate; no edit needed - kept for reference
  ITER: 019

EDIT 21: README.md:7
  FROM: "Copilot support for MCP and startup-surface workflows"
  TO:   "Copilot support for startup-surface workflows (limited MCP integration)"
  REASON: Copilot does NOT have full MCP hook parity with other runtimes; support is limited to file-based custom instructions
  ITER: 019

EDIT 22: README.md:595
  FROM: "All four supported runtimes (Claude Code, Gemini CLI, GitHub Copilot, Codex CLI) transport the same compact startup shared-payload"
  TO:   "Three supported runtimes (Claude Code, Gemini CLI, Codex CLI) transport the same compact startup shared-payload; Copilot uses file-based custom instructions with limited cache/writer path"
  REASON: Copilot does not transport the same payload - has no model-visible precompute injection
  ITER: 019

EDIT 23: README.md:60, 744
  FROM: [existing Codex references without opt-in note]
  TO:   "Codex CLI (requires `[features].codex_hooks = true` opt-in for native hooks)"
  REASON: Codex requires explicit opt-in for native hooks; README implies full support by default
  ITER: 019

EDIT 24: README.md:7, 60, 595, 744
  FROM: [inconsistent: Copilot / GitHub Copilot / Copilot CLI]
  TO:   "Copilot CLI" (consistent)
  REASON: Runtime naming inconsistent across sections
  ITER: 019

EDIT 25: README.md:11
  FROM: "🪝 Cross-Runtime Hooks"
  TO:   [REMOVE from tagline OR add dedicated section]
  REASON: "Cross-Runtime Hooks" listed as pillar but has no dedicated explanatory section
  ITER: 020

EDIT 26: README.md:944-949
  FROM: "**Create** - Dedicated LEAF executor for the `/create:*` command family"
  TO:   "**Markdown** - Dedicated LEAF executor for the `/create:*` command family"
  REASON: README lists "Create" agent but actual file is "markdown.md"
  ITER: 011

EDIT 27: README.md:9
  FROM: "https://buymeacoffee.com/michelkermemeester"
  TO:   "https://buymeacoffee.com/michelkerkmeester" [VERIFY FIRST]
  REASON: Potential typo - double 'me' may be intentional if username differs from GitHub
  ITER: 013

EDIT 28: README.md:1497
  FROM: "Documentation version: 4.11"
  TO:   "Documentation version: 4.11 [INVESTIGATE]" or create changelog entry
  REASON: Version 4.11 does not correspond to any changelog entry; unclear what it tracks
  ITER: 004, 014

EDIT 29: README.md:89-97
  FROM: [current flat topology diagram]
  TO:   [ADD boundary notation or notes about shared contracts and pending migrations]
  REASON: Native MCP Topology diagram oversimplifies architecture; omits important boundary relationships
  ITER: 010

EDIT 30: README.md:HVR-PUNCT-FIX
  FROM: [183 violations: 4 em dashes, 100+ semicolons, 79 Oxford commas]
  TO:   [Rewrite per HVR rules - use iteration 8 findings file for per-occurrence edits]
  REASON: HVR punctuation hard-blocker violations throughout README prose
  ITER: 008

## Summary
- Total edits: 30
- HVR punctuation edits: 1 (bucket for 183 violations handled by iter 8 findings file)
- HVR banned-word edits: 0 (2 literal uses of "harness" allowed as technical terms)
- Tool-count edits: 7 (total count + breakdown across 3 locations)
- Naming-consistency edits: 3 (mk_code_index hyphen/underscore, agent Create/Markdown)
- FAQ/Quick Start edits: 10 (3 FAQ errors + 7 Quick Start critical failures)
- Footer + license edits: 3 (footer tool counts + doc version)
- Runtime terminology edits: 5 (mirrored runtimes, Copilot support, Codex opt-in, naming consistency)
- Other: 2 (tagline hooks, topology diagram)
