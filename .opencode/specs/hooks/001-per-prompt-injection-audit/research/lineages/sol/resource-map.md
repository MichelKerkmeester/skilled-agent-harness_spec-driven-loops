# Resource Map — Per-Prompt Injection Audit

Derived from the 15 iteration narratives and `deltas/iter-001.jsonl` through `iter-015.jsonl`. Paths are evidence sources, not new write authority.

## Runtime Registries and Adapters

| Surface | Primary resources | Evidence use |
|---|---|---|
| Claude Code | `.claude/settings.json`; `hooks/claude/session-prime.ts`; `hooks/claude/user-prompt-submit.ts` | Canonical lifecycle and prompt owners |
| Codex | `.codex/hooks.json`; `hooks/codex/session-start.ts`; `hooks/codex/user-prompt-submit.ts` | Native envelope over Claude owners |
| Cursor | `.cursor/hooks.json`; `hooks/cursor/session-start.ts`; `hooks/cursor/user-prompt-submit.ts`; Cursor README/prebind | Configured versus observed non-delivery |
| Devin | `.devin/hooks.v1.json`; `hooks/devin/session-start.ts`; `hooks/devin/user-prompt-submit.ts` | Devin envelope and partial live evidence |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js`; `mk-spec-gate.js`; `mk-spec-memory.js` | Independent transform owners, cadence/order gaps |
| Pi | `.pi/extensions/session-start-context.ts`; `prompt-advisor.ts`; `spec-gate-classify.ts`; Pi README | Input/lifecycle transforms and Pi-only policy |

## Canonical Policy and Measurement Sources

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-225` — advisor and three directives.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts:1-140` — recomputation cache, not delivery dedup.
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:62-119,882-1058` — Gate question/state/enforcement.
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:150-246,652-843` — lexical classification and read-only suppression.
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts:13-118` — lifecycle budgets and repository token estimator.
- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` and `AGENTS.md` — durable policy overlap.

## Tests and Behavioral Contracts

- Advisor canonical/OpenCode fallback and identical-repeat tests.
- Claude/Codex Gate terminal-state and repeated-classification tests.
- Cursor runtime probe/README documenting tested prompt-hook non-delivery.
- Pi prompt-advisor and dispatch-preflight lint tests.
- Runtime parity fixtures, with lifecycle/receipt gaps recorded in iterations 10-14.

## Official External Sources

- OpenAI prompt caching: `https://developers.openai.com/api/docs/guides/prompt-caching`.
- Anthropic prompt caching and prompting: `https://platform.claude.com/docs/en/build-with-claude/prompt-caching` and linked prompting guides.
- Gemini caching: `https://ai.google.dev/gemini-api/docs/caching` and `generate-content/caching`.
- Amazon Bedrock prompt caching: `https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html`.
- Claude hooks, OpenCode plugin lifecycle, and Pi extension/compaction documentation cited in iterations 8-9.

## Lineage Evidence

- `iterations/iteration-001.md` through `iteration-015.md`: write-once narratives.
- `deltas/iter-001.jsonl` through `iter-015.jsonl`: structured iteration evidence.
- `deep-research-state.jsonl`: canonical 15-iteration sequence and terminal events.
- `research.md`: canonical deduplicated synthesis.

## Coverage Gaps

- Provider tokenizer/cache/billing receipts.
- Pinned combined host delivery and post-compaction traces.
- Current Cursor prompt/preCompact delivery.
- OpenCode message identity, transform cadence, and global ordering.
- Behavioral guardrail A/B negative controls.

