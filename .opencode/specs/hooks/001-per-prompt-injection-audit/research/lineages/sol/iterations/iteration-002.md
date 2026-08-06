# Iteration 2: Exact per-turn payload inventory and composition order

## Focus

Inventoried every requested model-visible block across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi: the skill-advisor line, its three always-on directives, conditional Gate-3 question, Pi-only dispatch directive, and startup/continuity context that can overlap later turns. This iteration distinguishes configured registration, source-proven composition, and live-observed delivery.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **One canonical renderer owns four blocks delivered together on every successful advisor invocation.** `renderAdvisorBrief()` emits a capped `Advisor: live|stale; use …` (or ambiguity) line followed, outside that cap, by `Directives:` and the comment-hygiene, governor, and proof-over-appearance bullets. If no recommendation renders, `renderAdvisorFallbackDirective()` still emits all three directives. Thus the directives are unconditional per advisor hook execution, while only the recommendation line is threshold-dependent. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:207] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:213]

2. **Claude Code, Codex, and Devin configure the same per-turn order: advisor/directives first, conditional Gate-3 second.** Claude's `UserPromptSubmit` array lists the advisor shim before `spec-gate-classify.mjs`; Codex places those in consecutive hook groups in the same order; Devin lists them in one group in the same order. The advisor owner is `handleClaudeUserPromptSubmit()` -> `renderAdvisorBrief()` -> `additionalContext`; Codex and Devin only translate that envelope. Gate text is separately owned by `spec-gate-core.mjs::GATE_3_QUESTION` and returned by `classifyIntent()`. Devin is live-observed for both genuine startup and Gate-3 model context; the inspected Claude/Codex sources and registration prove configuration but contain no equivalent live-fire receipt. [SOURCE: .claude/settings.json:77] [SOURCE: .claude/settings.json:83] [SOURCE: .claude/settings.json:88] [SOURCE: .codex/hooks.json:33] [SOURCE: .codex/hooks.json:38] [SOURCE: .codex/hooks.json:47] [SOURCE: .devin/hooks.v1.json:34] [SOURCE: .devin/hooks.v1.json:40] [SOURCE: .devin/hooks.v1.json:45] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:202] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:240] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md:16] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md:20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md:46]

3. **Cursor reverses configured order but currently delivers neither per-turn block in the tested CLI.** Its `beforeSubmitPrompt` array lists Gate-3 before the advisor adapter, unlike the other external-hook configs. The live probe found `beforeSubmitPrompt` did not fire, so configured per-turn payload is `Gate-3? -> advisor+directives`, but actually observed payload is zero. `sessionStart` does fire, so session-prime context and Gate prebinding may still affect the session without repeating these prompt blocks. [SOURCE: .cursor/hooks.json:79] [SOURCE: .cursor/hooks.json:81] [SOURCE: .cursor/hooks.json:86] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:18] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:22] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:30] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:64]

4. **Pi adds a fifth, Pi-only block and has source-proven local ordering but no repository-proven cross-handler order.** `promptAdvisor()` transforms `user text -> advisor+three directives -> PI_SUBAGENT_DISPATCH_DIRECTIVE`; it appends the Pi directive even when advisor generation fails. `specGateClassify()` is a separate `input` transform that appends Gate-3 to the text it receives, and sanitizes sibling-injected prose before classification. Pi auto-discovers top-level extension files, but the inspected repository documentation does not promise filename or registration ordering, so the global order between the advisor/Pi capsule and Gate-3 is unverified. Loader symlink discovery is probe-verified; actual combined model delivery was not evidenced by the consulted files. [SOURCE: .pi/extensions/prompt-advisor.ts:49] [SOURCE: .pi/extensions/prompt-advisor.ts:51] [SOURCE: .pi/extensions/prompt-advisor.ts:64] [SOURCE: .pi/extensions/prompt-advisor.ts:103] [SOURCE: .pi/extensions/spec-gate-classify.ts:7] [SOURCE: .pi/extensions/spec-gate-classify.ts:12] [SOURCE: .pi/extensions/spec-gate-classify.ts:38] [SOURCE: .pi/extensions/README.md:16] [SOURCE: .pi/extensions/README.md:112]

5. **OpenCode has three independent system transforms; only intra-transform append order is proven.** `mk-skill-advisor.js::appendAdvisorBrief()` appends advisor+directives (or the directives-only fallback), then may append a compiled-route summary as another block. `mk-spec-gate.js` independently appends Gate-3 when classification returns a question. `mk-spec-memory.js::appendContinuityBrief()` independently appends marked continuity and suppresses only a duplicate already present in the current `output.system` array. All three are auto-discovered plugin files; no explicit cross-plugin order is declared in `opencode.json`, so a stable global order is not proven. These transforms can execute on each system transform, making continuity a per-turn competitor even though `session.created` itself emits no context. [SOURCE: .opencode/plugins/mk-skill-advisor.js:785] [SOURCE: .opencode/plugins/mk-skill-advisor.js:836] [SOURCE: .opencode/plugins/mk-skill-advisor.js:849] [SOURCE: .opencode/plugins/mk-spec-gate.js:186] [SOURCE: .opencode/plugins/mk-spec-gate.js:208] [SOURCE: .opencode/plugins/mk-spec-memory.js:477] [SOURCE: .opencode/plugins/mk-spec-memory.js:485] [SOURCE: .opencode/plugins/mk-spec-memory.js:492] [SOURCE: .opencode/plugins/mk-spec-memory.js:505]

6. **SessionStart context is shared by Claude Code/Codex/Cursor/Devin/Pi, but it is not normally a per-user-turn block.** Canonical `session-prime.ts::handleStartup()` emits ordered `Session Context`, `Recovery Tools`, and optional `Session Continuity`; `main()` then optionally adds a CLI warm-fallback section, formats, budget-truncates, and writes stdout. Claude invokes it directly; Codex/Cursor/Devin proxy it; Pi sends the raw result once as a hidden `session_start` message. It can interact with later advisor directives by repeating memory/spec workflow guidance in persistent conversation context, but only OpenCode's continuity transform is structurally re-appended per transform. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:176] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:201] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:320] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:343] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:355] [SOURCE: .pi/extensions/session-start-context.ts:15] [SOURCE: .pi/extensions/session-start-context.ts:25] [SOURCE: .pi/extensions/session-start-context.ts:33]

7. **Configured-versus-observed inventory by runtime is now explicit.** Claude Code: configured `startup; each turn advisor/directives -> Gate-3?`, observed status not established here. Codex: same configured order through native envelopes, observed status not established here. Cursor: configured `startup; Gate-3? -> advisor/directives`, observed startup only and zero prompt-hook delivery. Devin: configured `startup; advisor/directives -> Gate-3?`, both startup and Gate-3 observed live. OpenCode: configured/implemented `continuity? + advisor/directives (+route summary?) + Gate-3?` on system transforms, global order and live combined receipt unproven. Pi: implemented `startup hidden message; each input advisor/directives -> Pi directive`, plus separately chained Gate-3, with combined global order/live receipt unproven. [INFERENCE: based on findings 2-6 and their cited registration, implementation, and probe evidence]

## Ruled Out

- Treating the three directives as part of the advisor token cap: concatenation occurs after `capText()`, and the fallback emits them without any recommendation.
- Treating Cursor registration as token cost actually paid: the installed CLI probe establishes non-delivery.
- Claiming a deterministic Pi or OpenCode cross-plugin order from alphabetical filenames: the repository proves discovery/handlers, not loader ordering.
- Treating all SessionStart context as per-turn injection: only OpenCode continuity is attached to a recurring transform.

## Dead Ends

- Broad greps across the complete advisor tree hit fixtures, generated artifacts, and archived transcripts. Future ownership work should remain restricted to renderer, runtime registry, direct adapter, and live-probe README anchors.

## Edge Cases

- Ambiguous input: “composition order” can mean registry order or actual model concatenation. Both are reported; actual global order is left unclaimed where the loader contract is absent.
- Contradictory evidence: Cursor is registered but live-probed as non-delivering; configured and observed inventories remain separate.
- Missing dependencies: no Pi/OpenCode loader-order contract or combined live transcript was present in consulted repository sources.
- Partial success: exact block owners and local composition are complete; cross-plugin global order and live receipts remain open for four runtimes.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-69`, `:163-215`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:202-244`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105-112`, `:880-979`
- `.claude/settings.json:77-91`; `.codex/hooks.json:33-51`; `.cursor/hooks.json:79-89`; `.devin/hooks.v1.json:34-48`
- `.opencode/plugins/mk-skill-advisor.js:785-865`; `mk-spec-gate.js:186-218`; `mk-spec-memory.js:477-505`
- `.pi/extensions/prompt-advisor.ts:49-106`; `spec-gate-classify.ts:7-47`; `session-start-context.ts:15-38`
- Runtime README live-probe evidence: Devin `:16-25`, `:46-51`; Cursor `:18-36`, `:56-64`; Pi `:16`, `:112-116`

## Assessment

- New information ratio: 0.86 (`(5 fully new + 0.5 × 2 partially new) / 7 = 0.857`, rounded; no simplicity bonus)
- Novelty justification: Five findings add exact block/composition facts, while the shared startup owner and high-level adapter map partially refine iteration 1.
- Questions addressed: exact module ownership; configured and observed runtime composition; which context repeats every turn.
- Questions answered: every requested block now has an owner and configured delivery surface; actual delivery is resolved for Cursor and Devin and explicitly unproven elsewhere.

## Reflection

- What worked and why: tracing renderer concatenation, registry order, adapter append sites, and live-probe tables separately prevented configuration from masquerading as runtime evidence.
- What did not work and why: broad term searches were dominated by fixtures and historical documents, and no local loader contract established Pi/OpenCode cross-plugin order.
- What I would do differently: use one controlled mutating and one read-only prompt per runtime, capture the exact model-visible envelope, and hash block order directly.

## Recommended Next Focus

Measure exact UTF-8 bytes and tokenizer-estimated tokens for each canonical block, including directives-only fallbacks, Gate-3, Pi dispatch, startup sections, and OpenCode continuity. Report configured and observed totals separately; include live-fire envelope capture for Claude Code, Codex, Pi, and OpenCode rather than inferring delivery from registration.
