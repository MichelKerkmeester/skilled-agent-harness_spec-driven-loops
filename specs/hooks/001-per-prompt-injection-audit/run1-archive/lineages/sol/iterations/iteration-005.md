# Iteration 5: Devin Hook Adapter End-to-End Audit

## Focus
Audit Devin SessionStart and UserPromptSubmit registration, order, owners, branches, fallbacks, token fixtures, live/configured distinctions, and delivery semantics.

## Route Proof
Resolved route: mode=`research`, target_agent=`deep-research`, artifact root `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`, iteration/run 5. Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`.

## Findings
1. Project-local `.devin/hooks.v1.json` orders compiled SessionStart context before four maintenance checks, and every UserPromptSubmit orders compiled advisor/directives before Gate 3—Codex order, not Cursor's reverse configured order. [SOURCE: .devin/hooks.v1.json:2-50] [SOURCE: .devin/SYNC.md:85-91]
2. `session-start.ts::main()` requires `session_id`, forwards the original payload to Claude-owned `session-prime.js`, and wraps nonempty text as `hookSpecificOutput.additionalContext`. It does not rewrite `source`, so startup, resume, clear, compact, and unknown→startup branches remain reachable. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-start.ts:15-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:60-96,103-143] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:303-364]
3. SessionStart token fixtures: startup base with accepted/rejected/missing continuity, optional continuity and warm CLI; resume with/without lastSpecFolder; clear; compact missing/stale/quarantined/valid cache with optional active folder; unknown source; pressure truncation; zero-output validation/child failures; and exact shell fallback `mk devin hook could not resolve; run npm run build in mcp-server`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,150-254,277-296,303-364] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:11-12,60-143] [SOURCE: .devin/hooks.v1.json:6-10]
4. Per turn, the first adapter re-emits Claude advisor `additionalContext`: live/stale single, live/stale ambiguous, or directives-only with comment hygiene, governor, and proof-over-appearance. Gate 3 independently emits the shared question only when `classifyIntent().question` exists. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:15-20] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-classify.mjs:39-70]
5. Per-turn fixtures must preserve independent combinations: advisor live/stale × single/ambiguous, directives-only, silent disabled/invalid/exception/normalization, resolver warning; plus Gate question, answer/no-repeat, read-only silence, disabled/child silence, invalid-session silence, terminal-state no-repeat. Internal failures exit zero and do not activate shell `||`. [SOURCE: .devin/hooks.v1.json:34-47] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:123-127,146-172] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:162-256] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-devin.test.mjs:91-119,149-169,239-302]
6. Registration is valid and consulted compiled artifacts exist. Authenticated Devin 3000.2.17 tests observed six events, genuine SessionStart context, and model-visible Gate 3. Installed Devin is 3000.3.27; this iteration did not re-run authenticated delivery, and interactive delivery remains untested. [SOURCE: .opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:29-79] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md:14-27] [SOURCE: command `devin --version` => `devin 3000.3.27 (0becb483)`]
7. Devin emits separate command envelopes with no adapter merge/dedup, so partial delivery and ordering depend on host array-order semantics. Later SessionStart checks are not canonical context producers; plain stdout model visibility is unverified. There is no Codex-like global installed-hook copy: project registration plus compiled artifacts are the configured surface. [SOURCE: .devin/hooks.v1.json:2-50] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:134-158] [SOURCE: .opencode/hooks/injection-contract.md:195-197,233-235] [INFERENCE: separate envelopes and no Devin installer/global manifest define these boundaries]

## Ruled Out
Maintenance checks as deliberate prompt blocks; internal fail-open as resolver warning; invalid-schema probes as current dormancy evidence.

## Dead Ends
Source inspection cannot prove delivery on installed 3000.3.27; authenticated capture is required.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: old zero-fire probes were resolved by schema correction.
- Missing dependencies: no authenticated current-version transcript.
- Partial success: current-version delivery unverified; static inventory and prior live delivery complete.

## Sources Consulted
- [SOURCE: .devin/hooks.v1.json:2-50]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:60-172]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:40-102,150-364]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,156-215]
- [SOURCE: .opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md:29-79]

## Assessment
- New information ratio: 1.0
- Questions addressed: ownership, order, conditions, fallbacks, fixtures, live/configured state, delivery semantics.
- Questions answered: complete static Devin adapter/fixture inventory and historical headless delivery.

## Reflection
- What worked and why: registration → adapter → shared owner → live record tracing separated transport, content, and delivery.
- What did not work and why: mirror checking found unrelated Cursor drift and cannot prove host delivery.
- What I would do differently: capture raw envelopes and transcript in an authenticated 3000.3.27 session.

## Recommended Next Focus
Audit OpenCode's merged system-transform semantics against Devin's separate envelopes.

