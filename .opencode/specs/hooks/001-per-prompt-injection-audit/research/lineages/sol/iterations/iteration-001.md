# Iteration 1: Six-runtime hook entrypoint and ownership map

## Focus

Mapped the SessionStart-equivalent and per-user-turn context-injection entrypoints for Claude Code, Codex, Cursor, Devin, OpenCode, and Pi, following the dispatch focus over the strategy's broader future measurement work. "SessionStart" is interpreted as the lifecycle surface that can establish model-visible startup context; OpenCode has no equivalent one-shot context emitter in these adapters, so its `session.created` initialization and its actual per-transform emitter are reported separately.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority was restricted to `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **Claude Code owns the canonical lifecycle implementations.** `.claude/settings.json` registers `SessionStart` to compiled `hooks/claude/session-prime.js` and `UserPromptSubmit` to compiled `hooks/claude/user-prompt-submit.js`; the source owner for startup is `session-prime.ts`, whose `handleStartup()` builds the startup sections and whose `main()` selects the source handler. The prompt shim's `runShim()` resolves and spawns the skill-advisor implementation, whose true owner is exported `handleClaudeUserPromptSubmit()`. [SOURCE: .claude/settings.json:77] [SOURCE: .claude/settings.json:106] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:303] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/user-prompt-submit.ts:78] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154]

2. **Codex is a thin native-envelope adapter over the Claude owners.** `.codex/hooks.json` registers compiled `codex/session-start.js` and `codex/user-prompt-submit.js`. Each source module owns a CLI-local `main()`: SessionStart reads Codex input, calls `runClaudeHookAdapter('session-prime.js', ...)`, then `emitCodexContext()`; UserPromptSubmit similarly calls `user-prompt-submit.js` then `emitNormalizedCodexContext()`. [SOURCE: .codex/hooks.json:3] [SOURCE: .codex/hooks.json:33] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/session-start.ts:15] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:15]

3. **Cursor uses `sessionStart` and `beforeSubmitPrompt`, but the per-turn route is registered rather than proven live.** `.cursor/hooks.json` maps these events to compiled Cursor adapters. `session-start.ts::main()` converts Cursor input and proxies `session-prime.js`; `user-prompt-submit.ts::main()` explicitly preserves `input.prompt`, proxies `user-prompt-submit.js`, and unwraps the advisor envelope. The source itself records that `beforeSubmitPrompt` delivery was unconfirmed in the tested CLI build, so inventory must not equate registration with observed injection. [SOURCE: .cursor/hooks.json:4] [SOURCE: .cursor/hooks.json:79] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:45]

4. **Devin mirrors Codex through Devin-specific envelope functions.** `.devin/hooks.v1.json` registers top-level `SessionStart` and `UserPromptSubmit` commands. `devin/session-start.ts::main()` proxies canonical `session-prime.js` and emits via `emitDevinContext()`; `devin/user-prompt-submit.ts::main()` proxies the canonical prompt shim and emits via `emitNormalizedDevinContext()`. [SOURCE: .devin/hooks.v1.json:2] [SOURCE: .devin/hooks.v1.json:34] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts:15] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:15]

5. **OpenCode is plugin-native and has no one-shot SessionStart context emitter matching the other adapters.** `mk-spec-memory.js` handles `session.created` only by marking runtime readiness; its model-visible continuity owner is `appendContinuityBrief()`, registered as `experimental.chat.system.transform`, so it can run on every system transform. Per-turn advisor context is independently owned by `mk-skill-advisor.js::appendAdvisorBrief()`, registered on the same transform. Gate-3 prompting is a third transform owner, `mk-spec-gate.js`'s anonymous `experimental.chat.system.transform` handler. [SOURCE: .opencode/plugins/mk-spec-memory.js:477] [SOURCE: .opencode/plugins/mk-spec-memory.js:489] [SOURCE: .opencode/plugins/mk-skill-advisor.js:785] [SOURCE: .opencode/plugins/mk-skill-advisor.js:869] [SOURCE: .opencode/plugins/mk-spec-gate.js:160] [SOURCE: .opencode/plugins/mk-spec-gate.js:186]

6. **Pi is in-process at both lifecycle edges and adds a Pi-only turn transform.** `session-start-context.ts::sessionStartContext()` registers `pi.on('session_start')`, calls `runClaudeHookAdapter('session-prime.js', ...)`, then delivers hidden context with `pi.sendMessage()`. `prompt-advisor.ts::promptAdvisor()` registers `pi.on('input')`, dynamically imports and calls canonical `handleClaudeUserPromptSubmit()`, then returns a transformed user text containing the advisor context plus `PI_SUBAGENT_DISPATCH_DIRECTIVE`; the directive is therefore owned by this Pi adapter, not the shared advisor renderer. [SOURCE: .pi/extensions/session-start-context.ts:16] [SOURCE: .pi/extensions/session-start-context.ts:25] [SOURCE: .pi/extensions/prompt-advisor.ts:46] [SOURCE: .pi/extensions/prompt-advisor.ts:51] [SOURCE: .pi/extensions/prompt-advisor.ts:65] [SOURCE: .pi/extensions/prompt-advisor.ts:79]

## Ruled Out

- Treating compiled `dist/` files as the semantic owners was ruled out: runtime configuration executes them, but the TypeScript sources name the owning functions and show that Codex/Cursor/Devin/Pi proxy canonical Claude modules.
- Treating OpenCode `session.created` as a SessionStart context injection was ruled out: the handlers only initialize readiness/cache lifecycle; model-visible content is appended later by `experimental.chat.system.transform`.
- Treating Cursor's configured `beforeSubmitPrompt` as observed runtime behavior was ruled out because the source explicitly labels live delivery unconfirmed.

## Dead Ends

- A broad repository grep for generic hook terms produced substantial generated/spec-history noise and truncated output. Narrowing to runtime configuration files, adapter directories, and named plugin transform hooks produced authoritative anchors. Future iterations should not repeat the unconstrained search.

## Edge Cases

- Ambiguous input: "SessionStart" does not map uniformly to OpenCode. The narrow interpretation above distinguishes session initialization from model-visible context emission.
- Contradictory evidence: Cursor configuration proves registration, while the adapter source says delivery was unconfirmed; both are preserved and the runtime effect remains unresolved.
- Missing dependencies: none required; focused memory retrieval was already recorded unavailable in packet state, and repository sources were sufficient.
- Partial success: none. The ownership question is answered, while live-fire validation and payload measurement remain separate questions.

## Sources Consulted

- `.claude/settings.json:77`, `.claude/settings.json:106`
- `.codex/hooks.json:3`, `.codex/hooks.json:33`
- `.cursor/hooks.json:4`, `.cursor/hooks.json:79`
- `.devin/hooks.v1.json:2`, `.devin/hooks.v1.json:34`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176`, `:303`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/user-prompt-submit.ts:78`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/session-start.ts:15`, `user-prompt-submit.ts:15`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15`, `user-prompt-submit.ts:5`, `:45`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts:15`, `user-prompt-submit.ts:15`
- `.opencode/plugins/mk-spec-memory.js:477`, `:489`
- `.opencode/plugins/mk-skill-advisor.js:785`, `:869`
- `.opencode/plugins/mk-spec-gate.js:160`, `:186`
- `.pi/extensions/session-start-context.ts:16`, `:25`
- `.pi/extensions/prompt-advisor.ts:46`, `:51`, `:65`, `:79`

## Assessment

- New information ratio: 1.0 (six fully new runtime mappings out of six findings; no simplicity bonus needed)
- Novelty justification: This first lineage iteration establishes all six runtime entrypoint/owner mappings and identifies two non-equivalences—OpenCode's transform-based startup continuity and Cursor's unconfirmed prompt-hook delivery.
- Questions addressed: What exact module owns every SessionStart and per-user-turn injected block for each runtime?
- Questions answered: The adapter entrypoints and canonical owning functions are mapped for all six runtimes; Cursor live delivery remains explicitly unproven rather than silently assumed.

## Reflection

- What worked and why: Reading runtime registration files alongside source adapters separated configured transport paths from semantic owners and exposed the shared Claude implementation layer.
- What did not work and why: The initial broad grep crossed generated artifacts and archived research, obscuring the live sources.
- What I would do differently: Start from the five runtime configuration/extension registries, then trace only their direct imports and bridge targets.

## Recommended Next Focus

Inventory the exact text blocks each per-turn owner emits (advisor, always-on directives, Gate-3, Pi-only directive, OpenCode continuity), then measure bytes/tokens per runtime. Include a live-fire probe for Cursor `beforeSubmitPrompt` so configured cost and observed cost are reported separately.
