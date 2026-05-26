# Synthesis Report - Real-World Usefulness Test

## VERDICT (per system axis)
- Code graph: USEFUL - The sandbox-direct graph queries completed 12 assisted trials across caller lookup, module touch maps, blast-radius preview, and invariants. Mean relevance stayed high, and graph output was more precise than lexical grep for caller and blast-radius questions.
- Hooks: MIXED - The advisor and Gate 3 classifier were strong on the sampled corpus, while session-prime startup context was useful but generic. Compaction recovery was deferred because it needs live long-session state.
- Plugin/runtime integration: OVERHEAD - In this sandbox, external CLI cells added setup friction without a completed model response: Codex hit session-home and DNS restrictions, Copilot lacked auth, and Gemini tried to open browser auth.

## TOP 5 WINS
1. S-HK-02 advisor routing matched 8/10 sampled labels from the routing corpus; the two misses routed to adjacent deep-loop skills.
2. S-HK-03 Gate 3 classifier matched 10/10 mixed write/read labels.
3. S-CG-01 caller lookup returned structural caller rows directly for all three target functions.
4. S-CG-03 blast-radius preview separated structural dependencies from raw lexical occurrences.
5. S-CG-04 invariant checks produced compact structural evidence for three cross-file rules.

## TOP 5 OVERHEADS
1. S-PL-01 cli-codex external startup failed after a session-home workaround because DNS to `api.openai.com` is blocked.
2. S-PL-01 cli-copilot external startup failed before model execution because no auth token was available.
3. S-PL-01 cli-gemini external startup opened an interactive browser-auth prompt, which is not viable in this headless sandbox.
4. S-HK-01 startup context stayed generic for Gate 3 review prompts, so relevance was lower than advisor-specific context.
5. S-CG-02 module touch maps are useful, but graph rows need grouping to beat a quick import-header scan for small files.

## DEFERRED CELLS
- S-CG-01/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-01/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-02/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-02/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-03/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-03/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-04/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-04/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-01/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-02/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-03/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-CG-04/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/cli-codex-54-medium: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-01/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/cli-codex-54-medium: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-02/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-03/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-03/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-03/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-04/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-04/cli-codex-55-high: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-HK-04/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/cli-codex-54-medium: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/cli-codex-55-high: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-01/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/cli-codex-54-medium: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/cli-codex-55-high: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-02/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-03/cli-codex-55-high: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-03/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-03/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-03/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/claude-code-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/cli-codex-54-medium: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/cli-copilot-default: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/cli-gemini-31-pro: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/cli-claude-code-external: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.
- S-PL-04/opencode-native: deferred because it requires a live native runtime, authenticated external CLI, network access, or long-session compaction state unavailable from this sandbox.

## IMPROVEMENT BACKLOG
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:5`: add a documented headless smoke mode that verifies hook payload formatting without creating Codex session files or contacting the API.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:27`: add an explicit "offline/unauthenticated preflight" path for the managed-instructions workaround so execution campaigns can distinguish hook failure from Copilot auth failure.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:15`: document a no-browser headless validation command for `session-prime.ts`, because the CLI auth prompt blocked the sandbox run.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:328`: consider prompt-aware startup brief shaping; the static startup surface is useful for graph work but weaker for Gate 3 review prompts.
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:10`: preserve the simple CLI contract, but add a batch JSONL mode so routing accuracy campaigns do not need one Python process per prompt.

## CONFIDENCE NOTE
This is a partial execution pass. The parent matrix table sums to 62 cells, despite the parent narrative naming 58, so this packet uses the table-derived count and records 8 completed cells plus 54 deferred cells. The local evidence is solid for code graph, skill advisor, and Gate 3 classifier behavior because it used repo data and compiled/local tools. Runtime integration confidence is lower: the result is a sandbox verdict, not a full product verdict. Broader execution needs authenticated cli-codex, cli-gemini, Claude Code native, and OpenCode native sessions with network access and controlled compaction tests.
