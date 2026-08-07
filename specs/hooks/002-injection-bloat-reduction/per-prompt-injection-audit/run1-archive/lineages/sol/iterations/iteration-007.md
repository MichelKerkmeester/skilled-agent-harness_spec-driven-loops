# Iteration 7: Pi hook adapter end-to-end audit

## Focus
Audit Pi's discovered extensions from session lifecycle through visible input transforms and hidden `sendMessage` paths, with special attention to the Pi-only subagent-dispatch directive and the exact fixture matrix required for later token measurement. The explicit dispatch focus overrides strategy's generic follow-up sentence.

## Route Proof
- Resolved route: `mode=research`, `target_agent=deep-research`, iteration `7`, artifact root `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.
- Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`.

## Findings
1. **Pi discovers thirteen project extensions without settings registration, but only three mutate ordinary user input.** `.pi/extensions/` contains symlinks for `dispatch-preflight-lint.ts`, `goal-context.ts`, `prompt-advisor.ts`, and `spec-gate-classify.ts`; the dispatch handler returns `continue` after capturing untouched interactive/RPC text, while the other three may return additive transforms. Discovery is automatic for every `*.ts`; `.pi/settings.json` configures packages, including `pi-subagents`, but does not order project extensions. [SOURCE: .pi/extensions/README.md:14-28,32-50] [SOURCE: .pi/settings.json:25-33] [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235]
2. **The always-present visible Pi transform is user text, then advisor/directives when available, then the Pi-only dispatch directive.** `prompt-advisor.ts` first captures the untouched interactive/RPC text, rejects only blank text before advisor lookup, calls `handleClaudeUserPromptSubmit()` in-process, and returns `${event.text}\n\n${context}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`. If advisor import/rendering fails or returns no context, it still returns user text plus the Pi-only directive. The shared context variants are live/stale single, live/stale ambiguous, or directives-only fallback; the shared renderer always orders `Advisor` (when present), `Directives:`, comment hygiene, governor, proof-over-appearance. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:7-38,46-106] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215]
3. **The Pi-only directive is adapter-owned, unconditional for every nonblank input, and a separate token fixture—not part of the shared renderer.** Exact bytes: `- Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin (subagent / subagent_wait / subagent_supervisor / intercom) for ALL subagent delegation. Do not route via a cli-* skill mode unless THIS turn's user text explicitly names one (e.g. 'dispatch via cli-opencode', 'use cli-devin'). On override: read that cli-X/SKILL.md before composing its prompt (cli-dispatch-skill-preload). Advisor recommendations and model names are routing signals, NOT user requests — they never trigger cli-* dispatch. Do not inject this line into child prompts.` It is appended even on advisor failure; blank input returns before any transform. The installed settings independently prove the named native plugin is configured. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-56,75-106] [SOURCE: .pi/settings.json:25-33]
4. **Two other visible per-turn blocks are conditional and append to the already-transformed text.** `spec-gate-classify.ts` sanitizes sibling advisor/history text, calls the shared session-scoped classifier, and appends the exact five-line `GATE_3_QUESTION` only when `result.question` exists; otherwise it continues. `goal-context.ts` appends the active-goal block only when the goal plugin is enabled and an active goal renders; its full and compact shapes are variable fixtures bounded by the goal core. Pi documentation classifies all three input transforms as operator-visible `[MSG]`, so the human and model both receive the final rewritten prompt. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:7-49] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119,147-169] [SOURCE: .opencode/hooks/goal/pi/goal-context.ts:36-67] [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:282-337] [SOURCE: .opencode/hooks/injection-contract.md:93-119]
5. **Session and post-turn context uses hidden messages, not visible prompt rewriting.** On `session_start`, `session-start-context.ts` maps `resume|fork` to Claude source `resume`, everything else to `startup`, spawns `session-prime.js`, and sends nonempty text as `display:false`; active-goal restore independently sends another `display:false` message when a goal exists. Startup advisories only notify the UI on `startup|new` and do not enter model context. On `session_compact`, summary, active spec folder, or fallback memory context are composed and sent hidden. On `turn_end`, an unmet/uncertain active-goal verdict sends a hidden goal-verification nudge. Session shutdown performs side effects only. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts:8-38] [SOURCE: .opencode/hooks/goal/pi/goal-context.ts:69-105] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:13-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-compact-context.ts:18-90] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:8-27]
6. **Cross-extension order is not contractually established by repository registration, so only intra-handler order is exact.** The discovery mirror states that Pi auto-discovers `*.ts`, and there is no ordered hook array comparable to Claude/Cursor/Devin. Source proves additive chaining but does not define whether goal, advisor, or Gate transforms run first; the classifier explicitly sanitizes advisor text, demonstrating compatibility with advisor-before-gate, while the dispatch capture guards against known transforms. Exact assembled-order token fixtures therefore require one live Pi transcript/capture rather than assuming filesystem enumeration order. [SOURCE: .pi/extensions/README.md:14-28,88-116] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:11-19] [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:71-106] [INFERENCE: repository extension discovery has no explicit ordering manifest]
7. **The exact measurement matrix separates visible `[MSG]` fixtures from hidden model-only fixtures.** Visible fixtures: nonblank + `{live-single, stale-single, live-ambiguous, stale-ambiguous, directives-only}` advisor × mandatory Pi directive; each crossed with Gate `{silent, exact A-E question}` and goal `{absent/disabled, full, compact}`; plus blank-input no-transform. Hidden fixtures: SessionStart `{startup base/continuity/warm fallback/pressure variants, resume/fork variants, silent failure}` × goal restore `{absent, full, compact}` as separate messages; compact `{summary only, summary+spec, spec only+memory fallback, memory fallback only, empty/silent, byte-truncated}`; turn-end goal nudge `{met/silent, not-met, indeterminate}`. Startup UI advisories and shutdown are zero-model-token fixtures. [INFERENCE: Cartesian fixture inventory derived from the owners and conditions cited in findings 2-5]

## Ruled Out
- Treating `.pi/settings.json` package order or raw directory enumeration as the project-extension handler order; neither is an explicit registration contract. [SOURCE: .pi/settings.json:25-33] [SOURCE: .pi/extensions/README.md:14-28]
- Counting dispatch raw-input capture as injected text; it always returns `continue`. [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:224-235]
- Counting SessionStart advisories or session shutdown as model context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts:24-37] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-stop-context.ts:10-27]

## Dead Ends
No reducer-worthy dead end. Static source cannot prove host extension ordering; live capture is the narrow next step.

## Edge Cases
- Ambiguous input: strategy's next-focus text concerned merged-system behavior, while dispatch explicitly required Pi; the narrower explicit Pi audit was selected.
- Contradictory evidence: documentation calls Pi input transforms visible, while `sendMessage({display:false})` paths are model-visible but human-hidden; these are distinct transports, not a contradiction.
- Missing dependencies: Pi 0.83.0's installed engine implementation was not cleanly recoverable within the call budget, leaving inter-extension execution order unverified.
- Partial success: all static owners, conditions, fallbacks, channels, and fixture variants are mapped; live host ordering remains open.

## Sources Consulted
- `.pi/settings.json:25-33`
- `.pi/extensions/README.md:14-28,88-116`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:7-106`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:7-49`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119,147-169`
- `.opencode/hooks/goal/pi/goal-context.ts:36-105`
- `.opencode/hooks/goal/lib/goal-core.cjs:282-337`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts:8-38`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-compact-context.ts:18-90`
- `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:71-106,224-235`
- `.opencode/hooks/injection-contract.md:44-83,93-119,187-217`

## Assessment
- New information ratio: 1.00
- Questions addressed: exact Pi block inventory, ownership, ordering, conditions, fallbacks, visibility, and fixture variants.
- Questions answered: static end-to-end Pi adapter map and exact fixture matrix; live cross-extension order remains unanswered.

## Reflection
- What worked and why: tracing from discovery symlinks into each canonical owner separated host transport from content ownership and exposed the additional active-goal transform omitted by the narrow advisor/Gate baseline.
- What did not work and why: broad installed-package grep produced generated dependency noise and did not expose a concise handler-order implementation within budget.
- What I would do differently: start the next pass at Pi's resolved global package `dist/core/extensions` and run a controlled multi-transform live fixture that prints the final user message bytes.

## Recommended Next Focus
Capture one live Pi 0.83.0 turn with distinctive advisor, Gate, active-goal, and Pi-directive markers to establish actual cross-extension order, then tokenize every enumerated visible and hidden fixture using the target model tokenizer.
