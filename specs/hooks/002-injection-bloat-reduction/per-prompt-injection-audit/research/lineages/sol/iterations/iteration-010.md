# Iteration 10: Cross-runtime implementation seams for lower-repeat injection

## Focus

Identified concrete seams for conditionalization, cross-turn model-visible deduplication, stable-prefix placement, and one-time-versus-repeat delivery across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. This maps implementation and tests without implementing or ranking candidates.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **Canonical advisor seam — shared by Claude, Codex, Cursor, Devin, and Pi; OpenCode shares policy/render output but not transport.** `renderAdvisorBrief()` joins dynamic routing before fixed directives, while `handleClaudeUserPromptSubmit()` turns every null render into the 763-byte fallback. Claude calls it directly; Codex/Devin proxy and normalize its `additionalContext`; Cursor has the shim but unproven prompt delivery; Pi imports it in-process. Split the owner into stable and dynamic blocks plus an emission policy. OpenCode must consume that policy through its bridge/system transform because it separately appends compiled routing. Failure must remain turn-fail-open; preserve sanitization, dual thresholds, caps, no prompt/reason echo, and non-blocking errors. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-89] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-254] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:94-149] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:103-158] [SOURCE: .pi/extensions/prompt-advisor.ts:40-106]

2. **Conditionalization belongs beside canonical rendering, not in transport shims.** The renderer already owns typed recommendation, freshness, ambiguity, thresholds, and sanitized labels; the handler owns normalized prompt/workspace and diagnostics. A result such as `{stable,dynamic,reason,refreshCause}` can cover the same five consumers. OpenCode needs bridge-specific prompt recovery and compiled-route serialization. Codex/Devin merely normalize Claude JSON, Pi extracts `additionalContext`, and Cursor has a distinct response surface; duplicating policy there would drift. During rollout, evaluator failure should preserve current emission; later no-route silence must remain separate from stable-guardrail fallback. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-244] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/shared.ts:125-149] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/shared.ts:134-158] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/lib/claude-hook-adapter.ts:62-74] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:17-60]

3. **Delivery-state schema is portable; storage is adapter-specific.** A logical key can share `(session, capsuleVersion/hash, routeDigest, lifecycleEpoch, lastPromptIdentity)`. Gate 3 proves durable atomic cross-process state and canonical session keys. OpenCode already has session-keyed TTL/LRU/in-flight maps plus deletion eviction, but they memoize computation rather than delivery. Pi has a bounded `globalThis` session map but it does not survive reload. Claude/Codex/Devin subprocesses need durable state; Cursor stays capability-gated; OpenCode/Pi can use in-process state with explicit lifecycle reset and optional recovery. Store failure must emit rather than suppress. Preserve bounded retention, child suppression, session normalization, and hashes only—never raw prompts. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:80-145] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-985] [SOURCE: .opencode/plugins/mk-skill-advisor.js:286-351] [SOURCE: .opencode/plugins/mk-skill-advisor.js:685-754] [SOURCE: .opencode/plugins/mk-skill-advisor.js:876-902] [SOURCE: .pi/extensions/prompt-advisor.ts:7-37]

4. **Gate 3 is the existing six-runtime conditional/stateful seam, missing only open-epoch/message dedup.** The core suppresses disabled/child, terminal, non-trigger, self-bound, and prebound cases while preserving first ask and invalid-answer re-ask. Add `askedPromptDigest` or `lastQuestionEpoch` to its atomic state; OpenCode also needs last-user-message identity because one message can drive multiple transforms. Cursor remains startup/prebind-first. On error, keep fail-open classification and stale-open eviction so enforcement cannot deny from state the classifier reported closed. Preserve first ask, invalid-answer re-ask, terminal state, and pre-tool deny/advisory. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-985] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-238] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:138-220] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:17-40]

5. **Stable-prefix ordering can share a content contract, not one serializer.** The current shared string places fixed directives after changing advisor text. Claude/Codex/Devin carry one opaque `additionalContext`; Cursor has a native envelope; Pi transforms user text and places its fixed dispatch rule after advisor context; OpenCode independently pushes advisor, compiled route, Gate, and continuity system entries. Define ordered `stable[]` and `dynamic[]`, then serialize per adapter. Missing ordering/cache-control proof must retain repeat delivery. Keep user text, scores, Gate state, and continuity out of stable identity; preserve deterministic order, clamps, and compiled-summary privacy. This only enables cache-friendly placement—provider hits remain unverified. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:196-215] [SOURCE: .opencode/plugins/mk-skill-advisor.js:782-862] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-505] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-215] [SOURCE: .pi/extensions/prompt-advisor.ts:49-106] [INFERENCE: serializer split follows the cited payload contracts]

6. **Lifecycle policy can share event classes, while replay stays capability-gated.** Canonical classes can be `first`, `route-change`, `relevance-trigger`, `resume`, `compact`, and `version-change`. Claude and Pi have usable lifecycle/compact surfaces; OpenCode has session events but injects on transforms; Codex needs pinned receipts; Cursor and Devin lack sufficient replay proof. Missing lifecycle signals must repeat rather than optimistically suppress. Preserve startup recomputation/validation, Pi current-turn CLI authorization, Gate’s first-question/enforcement boundary, and terminal proof. [SOURCE: .pi/extensions/session-start-context.ts:15-38] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-compact-context.ts:64-72] [SOURCE: .opencode/plugins/mk-skill-advisor.js:876-906] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-505] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-009.md]

7. **Fixtures expose a concrete coverage gap.** Advisor tests hard-code the combined context and fallback; renderer fixtures cover null/ambiguity/sanitization. The named “3-runtime parity” test actually lists `['claude','opencode','opencode']`, so it proves neither three distinct runtimes nor six envelopes. Gate tests already cover first open, read-only silence, enforcement, and terminal byte stability. Required additions are canonical stable/dynamic fixtures; repeat/route/version/compact cases; six envelope tests; OpenCode same-message multi-transform; and store-error emit-not-suppress. Preserve diagnostic privacy and fail-open behavior. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:21-108] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:1-105] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:138-220]

8. **Likely savings are bounded by prior measurements and explicit assumptions.** After one full delivery, replacing recurring 806-byte/~201-estimate advisor+directives with 43-byte/~11 route-only saves 763 bytes/~190 per eligible repeat: 7,630 bytes/~1,900 over ten repeats (94.7%). Gate open-epoch dedup saves `521 × (positive repeats-1)`; ten identical positives save 4,689 bytes/~1,179. Pi’s 130-byte proposal instead of 554 bytes saves 424/~105 per turn (76.5% bytes); one full plus nine compact lines costs 1,724 bytes versus 5,540, saving 3,816 (~68.9%). Assumptions: hook delivery, no refresh boundary, repository `ceil(UTF-16/4)` estimates. Cursor stays zero/unknown; OpenCode scales by transforms, not user turns. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-003.md] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-005.md] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-007.md] [INFERENCE: arithmetic applies cited measurements]

## Candidate Seam Matrix

| Seam | Shared runtimes | Adapter-specific handling | Failure/fallback | Preserved semantics |
|---|---|---|---|---|
| Stable/dynamic advisor contract | Claude/Codex/Cursor/Devin/Pi; OpenCode shares schema | OpenCode system entries; Cursor flag; Pi placement | evaluator unavailable => current emission | sanitization, thresholds, caps, privacy |
| Delivery-state schema | all six | durable subprocess vs in-process plugin stores | store error => emit | bounded/no-raw-prompt/child/version refresh |
| Gate epoch/message dedup | canonical policy all six | OpenCode message identity; Cursor prebind | classifier/state error => fail open | first ask, invalid re-ask, enforcement |
| Stable-prefix ordering | taxonomy all six | four envelope serializers | no proof => repeat | deterministic order; dynamic excluded |
| Lifecycle replay | event classes all six | only verified events map | missing signal => repeat | resume/compact and turn auth |
| Fixtures | canonical cases all six | envelope/cadence suites | prove emit on store failure | privacy and fail-open |

## Ruled Out

- One universal storage implementation.
- Dedup policy in transport shims.
- Provider-cache savings without telemetry.
- Cursor savings before delivery proof.
- OpenCode transforms counted as user turns.
- Startup-only guardrails without refresh and emit-on-failure.

## Dead Ends

The existing parity test name overstates its actual coverage. Further provider-doc searching will not locate these local seams; pinned runtime receipts and source fixtures are the productive evidence.

## Edge Cases

- Ambiguous input: stable-prefix arrangement versus proven provider hits; only arrangement is covered.
- Contradictory evidence: Cursor is configured but live-probed non-firing; included in source design, excluded from savings.
- Missing dependencies: six-runtime receipts, cache metrics, and post-compaction behavioral matrix.
- Partial success: seams/fallbacks/savings are mapped; implementation and ranking remain deferred.

## Negative Knowledge

No store records model-visible capsule delivery across all six. Advisor caches do not suppress delivery. No shared stable/dynamic envelope abstraction exists. No universal lifecycle event, ordering rule, or store spans all six. No test proves six distinct advisor runtimes. State failure cannot safely suppress. Provider-cache and Cursor savings remain unmeasured.

## Sources Consulted

- Canonical renderer/handler, Gate core, four adapter families, three OpenCode plugins, and Pi extensions cited above.
- Advisor and Gate fixtures cited in finding 7.
- Iterations 001-009, especially measurements 003/005/007 and lifecycle constraints 008/009.

## Assessment

- New information ratio: 0.81 (`(5 + 0.5×3)/8 = 0.8125`; no bonus).
- Novelty justification: five new seam/store/fixture/fallback findings and three implementation-bound refinements.
- Questions addressed: shared seams, adapter-specific handling, fallback behavior, preserved guardrails, and likely savings.
- Questions answered: canonical ownership, storage/payload/lifecycle splits, fixture points, and bounded savings.

## Reflection

Tracing producers to serializers and state lifetimes separated reusable policy from host delivery. Broad grep was noisy; narrow line reads exposed the seams. Next work should use emitted hashes and lifecycle receipts, not registration as delivery evidence.

## Recommended Next Focus

Specify a behavioral receipt matrix for first delivery, identical repeat, route change, relevance trigger, store failure, resume, compaction, and version change across each verified runtime before ranking.

