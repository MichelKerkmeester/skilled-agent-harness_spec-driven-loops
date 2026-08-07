# Iteration 4: Cursor Adapter End-to-End Injection Audit

## Focus
Audit Cursor's SessionStart and per-turn injection surfaces end to end: registration, adapter and content ownership, ordering, conditional/fallback variants, configured-versus-live status, and the fixture matrix required for later token measurement. The explicit dispatch focus takes precedence over the reducer's truncated next-focus sentence.

## Route Proof
- Requested/resolved mode: `research` / `research`
- Requested/resolved target: `deep-research` / `deep-research`
- Artifact root: `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`
- Iteration: `4`
- Executor: `{kind:"cli-codex",model:"gpt-5.6-sol"}`

## Findings
1. Cursor's configured SessionStart order is: session context, spec-gate prebind, four warn-only maintenance checks, then active-goal context. Only the first and seventh entries deliberately return model context; prebind mutates guard state, and the four checks are documented stderr-only advisories. The context adapter delegates to `session-prime.js` and wraps non-empty plain text as `agent_message`; the goal adapter separately emits an active-goal `agent_message` only for an enabled, active goal. [SOURCE: .cursor/hooks.json:4-40] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15-23] [SOURCE: .opencode/hooks/injection-contract.md:191-197,231-236] [SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:57-80]
2. The ordinary Cursor SessionStart context is narrower than the shared owner can express. `toClaudeShape()` hard-codes `source: 'startup'`, so Cursor currently reaches only `handleStartup`, never the owner's `resume`, `clear`, or `compact` branches. Its actual variants are: base `Session Context` + `Recovery Tools`; optionally `Session Continuity` for an accepted cached summary; optionally `Spec Memory CLI Fallback` when no recovered-continuity section exists and the warm CLI returns a section; then pressure-sensitive truncation. Missing/invalid input, child timeout/nonzero, or empty stdout becomes `{permission:"allow"}` without context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:81-131,138-162] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:150-223,277-296,303-360] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15-23]
3. The second live SessionStart producer is conditional active-goal steering, owned by `goal-core.cjs`'s `renderGoalBrief` and transported by `goal-inject.mjs`. Its exact family is full `[active_goal:<id>]` block or compact fallback, with sanitized/clamped objective and goal prompt, Cursor-relabeled Role line, verifier state, usage, and continuation directive; missing/malformed input, disabled plugin, absent/non-active goal, empty render, or any core error emits allow-only. It is recorded as reaching Cursor's response envelope, but model visibility is explicitly not proven end to end. [SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:5-27,57-80] [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:250-278,282-334]
4. Configured per-turn order is Gate 3 first and advisor/directives second: `.cursor/hooks.json` lists `spec-gate-classify.mjs` before the compiled `user-prompt-submit.js`. Gate 3 emits the fixed A-E question only when `classifyIntent()` returns `question`; otherwise it allows silently. The advisor adapter explicitly adds `prompt`, delegates to the shared Claude shim, unwraps `hookSpecificOutput.additionalContext`, and emits it as Cursor `agent_message`; invalid input, adapter timeout/nonzero, malformed envelope, or empty context is allow-only. [SOURCE: .cursor/hooks.json:79-90] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:47-76] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:19-52] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:138-162,169-212]
5. The exact configured advisor content family matches Claude: live or stale single recommendation, live/stale ambiguous two-recommendation form, directives-only fallback, or silence. Every non-silent advisor branch carries the three fixed directives (comment hygiene, governor, proof-over-appearance); the shared `renderAdvisorTimeoutFallback()` is not called by this adapter path. Gate 3 contributes either the exact five-choice `GATE_3_QUESTION` or zero bytes, independently and before the advisor entry. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-228] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:55-69]
6. The configured-but-dormant contradiction is real and unresolved at the host boundary: both per-turn entries are present in `.cursor/hooks.json`, their source and compiled adapters are executable, but three `cursor-agent -p` probes (including `--continue`) recorded no `beforeSubmitPrompt` delivery under installed version `2026.07.23-e383d2b`. The README calls both entries registered for forward compatibility, while the classifier header still says “dormant, not wired” and instructs registration only after re-confirmation—even though it is registered now. Thus today's evidence-backed injectable set is SessionStart context plus optional goal brief; advisor/directives and Gate 3 are config-only/dead for Cursor CLI until a new live probe proves the event fires. Editor behavior remains unverified because the project config is shared by CLI and editor. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:17-33] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:3-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:18-36,51-64] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md:104-106] [SOURCE: command `cursor-agent --version`: `2026.07.23-e383d2b`]
7. Later token measurement needs separate observed-live and dormant-config fixture sets. Live SessionStart fixtures: startup base; accepted cached continuity; each rejected/missing continuity status that changes the Memory line; warm CLI section present/absent; pressure-truncated output; adapter invalid-input/timeout/nonzero silence; goal disabled/absent/non-active silence; full goal; compact goal. Dormant per-turn fixtures: mutation/non-mutation Gate 3; advisor live/stale single; live/stale ambiguous; directives-only; silent invalid/missing prompt, no recommendation, timeout/nonzero, malformed child envelope; plus combined Gate-3-then-advisor aggregate. Host-capture fixtures must independently retest CLI first turn, CLI `--continue`, and editor prompt submission before assigning any real per-turn token cost. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15-23; .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:81-212; .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:150-223,277-360; .opencode/hooks/goal/cursor/goal-inject.mjs:57-80; .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:156-228; .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md:27-53]

## Ruled Out
- Counting the registered `beforeSubmitPrompt` entries as current CLI token cost: registration and standalone executability do not establish host delivery.
- Measuring Cursor resume/clear/compact SessionStart variants: the Cursor translator hard-codes `source: 'startup'`, making those owner branches unreachable through this adapter today.
- Counting prebind or maintenance checks as intentional model context: their contracts are state mutation or stderr-only advisory output.

## Dead Ends
- Source-only inspection cannot resolve editor delivery or prove model visibility of `sessionStart.agent_message`; those require host capture.
- Repeating the same tested CLI-build probe without a version change adds no evidence; re-probe when Cursor changes or when editor capture is available.

## Edge Cases
- Ambiguous input: “actually injectable today” is interpreted as evidence-backed Cursor CLI delivery; editor delivery is deferred because the shared configuration does not prove event behavior.
- Contradictory evidence: registration and executable adapters claim parity, while live probes and runtime docs establish non-delivery; the observed host behavior is stronger for current CLI cost accounting.
- Missing dependencies: no captured editor transcript or reliable model-visibility oracle exists; standalone adapter replay remains valid only for byte fixtures.
- Partial success: none; the static inventory is complete, while host-delivery uncertainty is explicitly preserved.

## Sources Consulted
- [SOURCE: .cursor/hooks.json:4-40,79-90]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts:15-23]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5-52]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:17-40,81-212]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:3-20,47-76]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:18-36,51-64]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:150-223,277-360]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-228]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:103-119]
- [SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:5-27,57-80]
- [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:250-334]
- [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md:104-106]
- [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md:27-53]

## Assessment
- New information ratio: 1.0
- Questions addressed: Which exact blocks does Cursor configure and actually inject at SessionStart and per turn; what owns and orders them; which variants require measurement?
- Questions answered: Cursor static ownership, ordering, conditions, fallback paths, live-versus-dormant set, contradiction, and token-fixture matrix are mapped; editor/live transcript capture and counts remain.

## Reflection
- What worked and why: registration-to-adapter-to-shared-owner tracing separated executable content from host event delivery and exposed the hard-coded startup-only narrowing.
- What did not work and why: broad test grep was noisy and produced no Cursor-specific adapter fixture suite; the manual live-fire record and narrow source anchors were stronger.
- What I would do differently: future measurement should materialize the fixture matrix as byte-exact standalone replays before spending a host session on delivery confirmation.

## Recommended Next Focus
Audit Devin end to end using the same configured-versus-observed split, then begin byte-exact token fixtures only after all command-hook runtimes' variant matrices are complete.
