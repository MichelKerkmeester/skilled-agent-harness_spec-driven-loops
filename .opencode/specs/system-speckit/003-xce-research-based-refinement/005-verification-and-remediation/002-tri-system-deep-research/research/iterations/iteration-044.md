# Iteration 044 — Angle 44

**Angle:** Hook brief quality: UserPromptSubmit advisor latency, ambiguity presentation, and whether agents act on the brief correctly.

**Summary:** Hook brief quality is generally compact and prompt-safe, but latency controls and runtime parity have gaps. The most significant issues are Claude ignoring its timeout knob and OpenCode losing ambiguity presentation.

**Findings kept:** 5

## [P1][BUG] Claude hook timeout knob does not bound native advisor subprocess

- Evidence: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:185-188, .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:190-196, .opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts:77-79, .opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts:227-231
- Detail: The Claude hook defines and reads `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`, but the native `buildSkillAdvisorBrief` call is made without `subprocessTimeoutMs`. The subprocess layer falls back to `SPECKIT_CODEX_HOOK_TIMEOUT_MS` or 3000 ms, so Claude-specific latency tuning only applies after a native failure when CLI fallback is attempted.
- Fix sketch: Pass `subprocessTimeoutMs: claudeHookTimeoutMs()` into the Claude native `buildSkillAdvisorBrief` call, matching the Codex adapter.

## [P1][BROKEN-FEATURE] OpenCode plugin bridge silently drops ambiguous advisor recommendations

- Evidence: .opencode/skills/system-skill-advisor/SKILL.md:256-260, .opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:149-157, .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:292-318, .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:491-514
- Detail: The skill contract says ambiguous intent scores should disclose ambiguity instead of picking one silently, and the TypeScript renderer has an explicit ambiguous branch. The OpenCode plugin bridge uses its own renderer that always emits `use <topLabel>` and never checks the second recommendation, so OpenCode users do not see ambiguity even when the advisor result is tied.
- Fix sketch: Make the bridge use the shared compiled renderer or port the same token-cap and top-two ambiguity branch into the bridge renderer.

## [P1][README-MISALIGNMENT] OpenCode plugin README understates default advisor bridge timeout by 10x

- Evidence: .opencode/plugins/mk-skill-advisor.js:29-34, .opencode/plugins/README.md:78-85
- Detail: The plugin code sets `DEFAULT_BRIDGE_TIMEOUT_MS` to 10000 ms, but the plugin README documents the default `bridgeTimeoutMs` as 1000 ms. This is materially relevant to prompt-submit latency because the transform waits on the bridge subprocess until that timeout before fail-open.
- Fix sketch: Align the README default with the code or lower the code default to the documented 1000 ms if that is the intended latency budget.

## [P2][REFINEMENT] Most live agents do not explicitly consume hook-injected advisor context

- Evidence: Grep over `.opencode/agents` for `Skill Advisor|skill-advisor|advisor brief|hook-injected|Advisor:` returned only `.opencode/agents/markdown.md:258`; `.opencode/agents/code.md:51-60` and `.opencode/agents/context.md:50-59` list core workflows without a hook/advisor brief step.
- Detail: Global instructions say Gate 2 can use a hook brief, but live agent files mostly do not state how to treat hook-injected advisor context. The markdown agent has a dedicated hook-context section, while code/context/orchestrate rely on their own routing workflows, making brief uptake inconsistent across agents.
- Fix sketch: Add a small shared agent rule that treats hook-injected advisor context as a routing hint, verifies it against the agent's own scope gates, and never lets it override permissions.

## [P2][BROKEN-FEATURE] Codex timeout fallback marker is bypassed on the default CLI-fallback path

- Evidence: .opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts:335-345, .opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts:360-372, .opencode/skills/system-skill-advisor/mcp_server/lib/render.ts:166-176
- Detail: The Codex hook has a shared timeout fallback renderer with a telemetry marker, but the branch only runs when `cliFallbackAttempted` is false. In the default runtime path, a fail-open native timeout triggers CLI fallback first, setting `cliFallbackAttempted` true and preventing the explicit timeout fallback marker from being returned even if fallback also fails.
- Fix sketch: Emit the timeout fallback when the original native failure was a timeout and the CLI fallback does not produce a valid brief.
