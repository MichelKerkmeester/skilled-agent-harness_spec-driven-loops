# Iteration 14: Cross-Runtime Reduction Architecture

## Focus
Design one reduction architecture from the accumulated six-runtime evidence: compare trim, conditionalize, consolidate, stable-prefix/cache placement, cross-turn hash/epoch deduplication, lifecycle-only delivery, and drop; define the adapter contract, invalidation and failure semantics, guardrail tests, old-contract compatibility, and unsafe reductions. The explicit dispatch focus overrides the reducer's narrower Pi follow-up while incorporating Pi as the hardest adapter case.

## Findings
1. The common contract should separate **decision cadence** from **delivery cadence**. Every user turn may still classify advisor and Gate intent, but delivery is an `InjectionDecision` with `{blockId, semanticHash, epoch, channel, cadence, content, enforcementState}`. Adapters emit only when cadence is `every-input`, the semantic edge changed, or the context epoch has not acknowledged that hash. This removes repeated bytes without disabling current-turn classification. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-245] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-989] [INFERENCE: the producers already separate classification from transport, so delivery suppression can be layered after classification]

2. The consistent state machine is `UNSEEN -> DELIVERED(hash,epoch) -> SUPPRESSED_SAME`; semantic change moves to `DIRTY -> DELIVERED`, while `session-start|resume|clear|compact|fork`, scope/binding change, active-goal mutation, policy/version change, and unknown/missing session identity advance the epoch and return relevant blocks to `UNSEEN`. An acknowledgement is recorded only after the adapter successfully forms a host envelope; unknown-session traffic must not share state. OpenCode's existing session generation/cache invalidation and marker checks are usable primitives, but its compute cache is not delivery dedup. [SOURCE: .opencode/plugins/mk-spec-memory.js:455-505] [SOURCE: .opencode/plugins/mk-goal.js:2560-2590] [SOURCE: .opencode/plugins/mk-skill-advisor.js:777-866] [INFERENCE: epoch plus semantic hash avoids both stale suppression and prompt-text-key cardinality]

3. Ranked reductions by safety and recurring-token impact are: **(1)** drop the 759-character directives-only fallback on no-match/error and move a consolidated 292-character policy capsule to lifecycle/epoch delivery; **(2)** emit advisor route text only on a passing changed route; **(3)** edge-trigger the 521-character Gate question while keeping open-state enforcement; **(4)** deliver unchanged continuity and active-goal blocks only at lifecycle or mutation edges; **(5)** order stable policy before dynamic route/state for cache friendliness; **(6)** drop only content proven redundant and independently enforced. For ordinary Claude/Codex/Devin/OpenCode turns this takes the fixed recurring estimate from ~190 tokens to zero when no route changes; Pi falls from ~329 to ~138 because its runtime-specific dispatch guard remains every input. Caching is an additional latency/cost optimization, not a token-removal claim. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/research.md:171-197] [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching]

4. Failure policy must be block-specific. Advisor lookup, dedup storage, lifecycle-policy relay, continuity, goal, and cache-placement failures are **fail-open for the user turn**: omit uncertain dynamic text, retain diagnostics, and retry after invalidation. Gate classification/state failure remains end-to-end fail-open as implemented, including eviction of stale open state; however, a valid persisted `open` gate continues to drive the independent mutation boundary, so suppressing a duplicate question must never synthesize `satisfied`. Pi's mandatory dispatch rule is **delivery-fail-safe**: if advisor lookup fails it still appends that exact guard, because its owner currently treats per-input enforcement as part of the runtime contract. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-1002] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106] [INFERENCE: fail-open classification and fail-safe transport are compatible only when enforcement state is independent of delivery acknowledgement]

5. What must still speak the old contract during rollout: the shared Claude renderer and compiled shim consumed by Claude plus Codex/Cursor/Devin; the OpenCode bridge mirror; Pi's visible transform and its separate dispatch literal; Gate adapters and mutation enforcers; lifecycle/session-prime and post-compaction ports; active-goal/continuity producers; installed Codex copies; and tests/docs that assert exact legacy strings. Use a versioned decision envelope behind legacy string renderers until all consumers understand `epoch/hash/cadence`; dual-render parity fixtures should precede switching delivery suppression on. Cursor's unobserved prompt hook remains compatibility-only and cannot contribute claimed live savings. [SOURCE: .opencode/hooks/injection-contract.md:44-83] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:1-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:1-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:1-51]

6. Guardrail efficacy needs behavioral, cadence, and failure tests rather than string-presence tests: six-adapter envelope parity; first/unchanged/changed hash transitions; reset after compact/resume/clear/fork and policy-version change; missing/unknown session non-dedup; advisor pass/ambiguous/no-match/error; Gate first-positive/repeated-positive/invalid-answer/valid-binding/task-change plus mutation denial; comment-hygiene violation detection after lifecycle-only delivery; unsupported completion blocked by real final-state checks; active-goal mutation refresh; Pi advisor failure retaining only the dispatch guard; OpenCode first/subsequent transform behavior; and host traces proving stable-prefix ordering before any cache-savings claim. Unsafe reductions are deleting Gate relay/enforcement, session-only advisor/Gate classification, global hash dedup, treating cache hits as context removal, dropping all directives before lifecycle retention is proven, moving volatile state into the stable prefix, or suppressing Pi's guard without an equivalent native enforcement point. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md:19-31] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-011.md:19-35] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-013.md:7-19]

## Ruled Out
- A universal cache API: provider and host controls differ, and cache reads remain input tokens.
- Prompt-text-keyed or global dedup: it grows with prompt cardinality and can suppress required context across sessions/scopes.
- Lifecycle-only advisor or Gate classification: both depend on current prompt semantics.
- Immediate deletion of legacy string producers: multiple proxies, installed copies, and exact-output tests still consume them.

## Dead Ends
- Treating successful computation/cache lookup as proof that content reached the model.
- Treating duplicate-question suppression as Gate satisfaction.
- Claiming Cursor or provider-cache savings without host delivery/usage evidence.

## Edge Cases
- Ambiguous input: the strategy requested a narrow Pi follow-up while dispatch explicitly requested the cross-runtime architecture; dispatch won, and Pi became the every-input exception.
- Contradictory evidence: the injection contract says Gate asks once until answered, while executable state logic re-emits on later positive/invalid-answer turns; the architecture follows executable behavior and makes edge-triggering an intentional change.
- Missing dependencies: no live host trace establishes cross-plugin prefix order or provider cache usage, so cache savings remain unclaimed.
- Partial success: quantitative component data exist, but the final ranked aggregate and scenario totals remain for iteration 15.

## Sources Consulted
- `.opencode/hooks/injection-contract.md:35-105`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:154-245`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-1002`
- `.opencode/plugins/mk-skill-advisor.js:777-866`
- `.opencode/plugins/mk-spec-memory.js:455-505`
- `.opencode/plugins/mk-goal.js:2560-2590`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-compact-context.ts:18-90`
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/research.md`

## Assessment
- New information ratio: 0.85 (3 fully new architectural findings + 3 partially new syntheses over 6 findings = 0.75, plus 0.10 simplicity bonus)
- Questions addressed: which injections remain valuable every turn; which cross-runtime reductions are safest; what adapter contract preserves guardrails
- Questions answered: consistent decision/delivery contract, epoch/hash state machine, invalidation, failure behavior, rollout compatibility, unsafe reductions, and efficacy test matrix

## Reflection
- What worked and why: reducing six transports to decision, delivery, state, and enforcement layers exposed where omission is safe without weakening classification or mutation controls.
- What did not work and why: static source cannot prove cache reuse or Cursor prompt delivery, so neither is included in savings claims.
- What I would do differently: iteration 15 should compute ranked session scenarios from one canonical assumptions table and show uncertainty bands for variable blocks.

## Recommended Next Focus
Iteration 15 should produce the final ranked quantitative synthesis: before/after formulas and 1/10/50-turn scenarios per runtime, separate fixed from variable and configured-from-observed costs, rank reductions by tokens saved versus guardrail risk, preserve explicit uncertainty, and treat convergence as telemetry only.
