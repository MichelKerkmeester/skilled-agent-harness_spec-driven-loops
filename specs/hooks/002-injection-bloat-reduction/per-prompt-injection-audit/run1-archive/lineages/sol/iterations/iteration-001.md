# Iteration 1: Shared Hook Architecture and Cadence

## Focus
Mapped the shared prompt/session injection architecture, all six runtime entrypoints, and ownership boundaries. This is an inventory foundation, not runtime execution or token measurement.

## Findings
1. **The recurring advisor capsule has one canonical content owner, not six.** `render.ts` owns the advisor cap and the three always-on directives; the Claude lifecycle hook renders and emits it, other runtimes reuse it, and OpenCode maintains a fallback mirror. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-189] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-245] [SOURCE: .opencode/hooks/injection-contract.md:48-67]
2. **Gate 3 is conditional and session-scoped, unlike the advisor capsule.** The shared core owns the A-E question and mutation vocabulary; runtime classifiers call it. Intended cadence is mutation-like prompts, once per session until answered, versus the advisor on every submitted prompt. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-119,125-144] [SOURCE: .opencode/hooks/injection-contract.md:44-83]
3. **The six prompt entrypoints split into four command-hook surfaces and two native transforms.** Claude, Codex, Devin, and Cursor register advisor/Gate-3 commands; OpenCode uses system-transform plugins; Pi uses ordered input transforms and visibly appends advisor, Pi dispatch policy, and conditional Gate 3. [SOURCE: .claude/settings.json:77-90] [SOURCE: .codex/hooks.json:33-48] [SOURCE: .devin/hooks.v1.json:34-46] [SOURCE: .cursor/hooks.json:79-89] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:64-106] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts:7-48]
4. **Adapter ownership is translation, except for explicitly local policy.** Codex, Devin, and Cursor proxy the Claude advisor lifecycle; Pi imports it in-process and uniquely owns `PI_SUBAGENT_DISPATCH_DIRECTIVE`; OpenCode owns transport/cache and a fallback directive copy. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:3-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:3-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:16-51] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:40-56,79-106] [SOURCE: .opencode/plugins/mk-skill-advisor.js:30-52,527-545]
5. **SessionStart is a separate one-time/recovery surface, and configured cadence is not live cadence.** `session-prime.ts` owns startup/resume/compact content; adapters bridge it. Cursor's prompt adapter says the configured event failed to fire in live probes, so inventory must track configured and observed-live status separately. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:3-25,40-102,175-222] [SOURCE: .opencode/hooks/injection-contract.md:187-217] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts:10-34] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:3-14] [SOURCE: .cursor/SYNC.md:81]

## Ruled Out
- Treating adapter files as independent content owners.
- Treating registration as proof of delivery.

## Dead Ends
Broad repository grep was noisy; exact registration and owner files were productive.

## Edge Cases
- Ambiguous input: none; dispatch explicitly set focus.
- Contradictory evidence: Cursor is configured but documented dormant; preserved as configured-versus-observed facts.
- Missing dependencies: no resource map; checked-in source sufficed.
- Partial success: none for architecture inventory; live validation and token measurement are deferred.

## Sources Consulted
- [SOURCE: .opencode/hooks/injection-contract.md:44-83,187-217]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-189]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:98-144]
- [SOURCE: .claude/settings.json:77-90,106-110]
- [SOURCE: .codex/hooks.json:3-48]
- [SOURCE: .cursor/hooks.json:4-8,79-89]
- [SOURCE: .devin/hooks.v1.json:2-8,34-46]
- [SOURCE: .opencode/plugins/mk-skill-advisor.js:30-52,527-545]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:40-106]

## Assessment
- New information ratio: 1.0
- Questions addressed: shared modules, event paths, adapter entrypoints, cadence, ownership
- Questions answered: shared architecture and inventory plan; runtime live behavior remains open

## Reflection
- What worked and why: the injection contract located the topology; registrations and source confirmed boundaries.
- What did not work and why: broad grep mixed current source with specs, tests, and generated output.
- What I would do differently: inspect one runtime's registration, source, and live evidence together per pass.

## Recommended Next Focus
Use this schema per runtime: event; configured entrypoint; observed-live status; injected block; canonical content owner; transport owner; channel/visibility; condition/dedup; exact emitted bytes; token count. Start with Claude, then Codex, Devin, Cursor, OpenCode, Pi. Keep SessionStart separate from per-turn totals and fallback variants separate.

