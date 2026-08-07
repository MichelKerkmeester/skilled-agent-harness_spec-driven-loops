# Iteration 14: Skeptical audit of reductions, cache claims, and enforcement preservation

## Focus

Independently challenged the emerging cost reductions and target architecture. The pass rechecked high-impact arithmetic and source anchors, searched for overlooked model-visible injection paths and tests, tested the counterargument that repeated reminders compensate for drift/compaction, and separated prompt-byte reduction from provider-billing claims. It produces an unranked go/no-go evidence matrix, not a final ranking. Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, `Resolved route: mode=research target_agent=deep-research`. Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained this lineage; progressive synthesis is false.

## Findings

1. **The dominant 763-byte measurement is reproducible, but the token and billing interpretations remain estimates.** Direct source extraction measured the fallback capsule at 759 UTF-16 units and 763 UTF-8 bytes: label 12 B, hygiene 206 B, governor 291 B, proof 255 B. The representative arithmetic also checks: `806 + 9×43 = 1,193` and `3×806 + 97×43 = 6,589`. These validate byte savings only; no exact provider tokenizer, request envelope, cache-hit rate, or billed-token receipt exists. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-69,207-215] [SOURCE: local Node source-extraction measurement, 2026-08-06] [SOURCE: iterations/iteration-012.md]

2. **“Stable-first” is architecturally sensible but does not itself save billed tokens.** Official cache evidence in iteration 008 requires an exact sufficiently long request prefix and provider/runtime cache support. The fixed capsule is below documented cache thresholds by itself, and the hooks do not prove control of the full provider request prefix, breakpoint, key, or usage telemetry. Moving directives before the dynamic advisor can improve cache eligibility only if host-controlled content before them is also stable and the runtime exposes cache behavior; absent `cached_tokens`/read/write receipts, billed savings are `UNKNOWN`. Prompt-byte suppression and cache placement must remain separate candidates and their savings must never be added for the same bytes. [SOURCE: iterations/iteration-008.md: findings 1-5,7] [SOURCE: iterations/iteration-012.md: finding 7] [INFERENCE: cache eligibility is necessary but insufficient for billed savings]

3. **The case for repeated directives is stronger than “redundant prose” suggests.** Source comments explicitly define hygiene as delivery when `AGENTS.md` is absent, the governor as an every-turn “thermostat” as context grows, and proof as an every-turn terminal-verification restatement. Canonical and OpenCode tests assert fallback delivery on skipped prompts, failures, and identical repeats. Those tests establish the current resilience contract, not behavioral necessity, but they make unconditional drop, abstention silence, or first-turn-only suppression a contract change requiring drift/long-context/compaction negative controls. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-65,213-215] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:88-108] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts:369-380] [INFERENCE: tests prove intended repetition, not empirical effectiveness]

4. **Gate “dedup” was overstated because the implementation already suppresses many repeats.** An open gate is silent on read-only turns, re-asks on invalid answer attempts, and returns the question again on a new mutation-positive turn; enforcement separately denies Write/Edit only when opt-in enforcement is active, otherwise it merely advises. Therefore the earlier `G_composite*(g-epochs)` saving is a valid worst-case mutation-positive scenario, not a general unresolved-session saving. First-open-only suppression can weaken user-facing enforcement when `MK_SPEC_GATE_ENFORCE` is off, when the eventual mutation uses a non-deny-capable tool, or when the user missed the first question. Preserve invalid-answer re-ask and mutation-positive reminders unless receipts show an equivalent visible enforcement surface. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:966-979,998-1057] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:48-119,143-203] [INFERENCE: question suppression changes the advisory path even when state remains open]

5. **The Pi 130-byte compact reminder is not preservation-equivalent to the current 554-byte policy.** The current directive carries four separable clauses: native subagents by default, explicit-turn-only CLI override, mandatory CLI skill preload on override, and “advisor/model signals are not user requests,” plus child-prompt exclusion. Any compact form must preserve all five semantics and prove parent/child detection before suppression. A size-only 130-byte target is modeled and cannot be treated as a go decision; dropping the preload or anti-false-override clauses weakens dispatch enforcement. [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-56,103-106] [SOURCE: iterations/iteration-007.md] [SOURCE: iterations/iteration-013.md: findings 5,8]

6. **The requested inventory is complete for the named audit blocks, but not for all model-visible OpenCode transform injections.** Repository search found additional conditional `experimental.chat.system.transform` producers, including one-shot startup cleanup warnings and queued git preflight advisories; active-goal and post-edit plugins also use this surface. They do not invalidate the named-block arithmetic, but they can appear before/after the proposed stable prefix and therefore affect cache identity, ordering tests, and whole-turn totals. A cross-runtime planner scoped only to advisor/Gate/continuity must not claim control of the complete OpenCode prompt. [SOURCE: .opencode/plugins/session-cleanup.js:173-187] [SOURCE: .opencode/plugins/mk-git-preflight-advisory.js:108-125] [SOURCE: repository `rg` inventory of `experimental.chat.system.transform`, 2026-08-06] [INFERENCE: independent plugin discovery prevents a planner-local global-order guarantee]

7. **The architecture remains viable only with fail-safe emission and runtime-specific proof; “delivery outcome” is still an inference in several adapters.** Source can prove that code wrote an envelope or mutated `output.system`, not that the host/provider accepted it or retained it after compaction. Cursor delivery and preCompact remain unconfirmed; OpenCode same-message identity/cadence is unmeasured; provider cache fields are absent. The iteration-013 predicate should be tightened to `hostReceiptOrPinnedBehavioralProbe && provenIdentity && validEpochState && hashAlreadyDelivered`; otherwise emit. This preserves the architecture while downgrading cross-runtime suppression from implementation-ready to receipt-gated. [SOURCE: iterations/iteration-009.md] [SOURCE: iterations/iteration-013.md: findings 2-4] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:20-64] [INFERENCE: serializer completion is not host acknowledgement]

## Go / No-Go Evidence Matrix (Unranked)

| Major candidate | Current verdict | Evidence supporting it | Enforcement / evidence blocker |
|---|---|---|---|
| Byte-identical shadow planner, block IDs, hashes, metrics | **GO for shadow only** | No prompt change; enables exact byte and lifecycle receipts. [SOURCE: iterations/iteration-013.md: findings 2,8] | Reverse on output diff, raw-data logging, or hook errors. |
| Stable-before-dynamic serialization without suppression | **GO conditionally** | Matches provider cache eligibility guidance. [SOURCE: iterations/iteration-008.md: findings 1,3] | Must preserve native envelope/order semantics; no billed-saving claim without provider telemetry. |
| Route-only repeats plus first/replay directive capsule | **NO-GO for activation; GO for eval/shadow** | Large reproducible byte reduction. [SOURCE: finding 1] | Current comments/tests intentionally require every-turn/failure fallback; needs drift, long-context, failure, resume, and compact behavioral receipts. |
| No-match / advisor-failure silence | **NO-GO** | Removes 763 B with no route signal. [SOURCE: iterations/iteration-006.md: finding 2] | Deletes the explicit fail-open guardrail payload asserted by canonical/OpenCode tests. [SOURCE: finding 3] |
| Relevance-conditional hygiene/governor/proof | **NO-GO pending classifiers/evals** | Semantic targeting could reduce irrelevant turns. [SOURCE: iterations/iteration-008.md: finding 6] | False negatives weaken hard-block/terminal behavior; no reliable completion/tool-heavy/comment-writing predicate is proven across six runtimes. |
| Gate first-open-only question | **NO-GO as universal policy** | Saves repeated mutation-positive question bytes. [SOURCE: iterations/iteration-012.md: finding 2] | Current repeat/re-ask paths preserve user visibility when enforcement is advisory/off; existing silence already covers read-only turns. [SOURCE: finding 4] |
| OpenCode same-message dedup | **GO only after stable message identity receipt** | Removes duplicate transform delivery without cross-turn retention assumptions. [SOURCE: iterations/iteration-013.md: findings 3,4] | Prompt hash alone can collide across repeated user messages; transform count/identity unmeasured. |
| Bound/digest OpenCode compiled-route targets | **GO conditionally** | Removes uncapped additive expansion while preserving route outcome/count/digest. [SOURCE: iterations/iteration-006.md: finding 5] | Clarification paths may require names; add explicit bounded reveal path and parity tests. |
| Compact Pi recurring reminder | **NO-GO at 130-byte target; GO for semantic-preserving prototype** | Current 554 B is a large recurring block. [SOURCE: iterations/iteration-007.md] | Must preserve all five current clauses, parent-only delivery, compact replay, and CLI preload. [SOURCE: finding 5] |
| Cross-turn suppression after lifecycle replay | **NO-GO globally; runtime-gated eval only** | Claude/Pi/Devin expose useful lifecycle surfaces. [SOURCE: iterations/iteration-009.md] | No universal host acknowledgement/retention; Cursor/OpenCode/Codex gaps remain. Unknown state must emit. |
| Provider prompt-cache placement | **GO as layout hygiene, NO-GO as quantified saving** | Stable prefixes are provider-recommended. [SOURCE: iterations/iteration-008.md] | Capsules are below thresholds alone; runtime control and billed cache metrics are unproven. [SOURCE: finding 2] |

## Ruled Out

- Treating cache-friendly placement as a measured billed-token reduction.
- Treating current repeated-directive tests as proof that repetition is behaviorally necessary; they prove the intended contract only.
- Treating Gate-positive repeats as every unresolved turn.
- Treating a shortened Pi reminder as equivalent when it omits override, preload, anti-signal, or child-exclusion semantics.
- Claiming the shared planner controls every OpenCode system-transform injection.
- Treating serializer completion as host/provider acknowledgement.

## Dead Ends

- Further static arithmetic cannot determine cache billing, host acceptance, compaction retention, drift resistance, Cursor delivery, or OpenCode transform cadence. These require pinned runtime receipts and behavioral negative controls.

## Edge Cases

- Ambiguous input: “cache savings” can mean local recomputation, provider prefill billing, or prompt-byte suppression; this iteration keeps them separate.
- Contradictory evidence: repeated directives look redundant by text identity, while source comments and tests deliberately require them as drift/failure resilience. The contradiction is unresolved behaviorally; activation remains blocked.
- Missing dependencies: provider usage fields, exact tokenizer receipts, pinned host delivery/compaction traces, and guardrail false-negative evals.
- Partial success: arithmetic, current contracts, overlooked transform producers, and enforcement risks are source-backed; effectiveness and billed savings remain unproven.

## Negative Knowledge

- No evidence in this lineage shows that stable-first placement produces any cache hit or billed-token saving in the six CLI runtimes.
- No behavioral experiment shows one-time directives survive long-context drift or compaction with equal compliance.
- No behavioral experiment shows every-turn repetition materially improves compliance either.
- No universal reliable classifier exists for comment-writing, tool-heavy, or terminal-completion turns.
- No proof establishes a 130-byte Pi reminder with all current semantics.
- No source-level write to an injection envelope proves host/provider acceptance.
- No complete OpenCode whole-prompt budget exists while independent transforms and uncapped/dynamic blocks remain outside the planner.

## Sources Consulted

- `.opencode/agents/deep-research.md`
- Packet config/state/strategy/registry and `iterations/iteration-001.md` through `iteration-013.md`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:43-225`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:88-108`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts:369-380`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:95-119,930-1057`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:48-203`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106`
- `.opencode/plugins/mk-skill-advisor.js:785-906`
- `.opencode/plugins/mk-spec-memory.js:477-505`
- `.opencode/plugins/session-cleanup.js:173-187`
- `.opencode/plugins/mk-git-preflight-advisory.js:108-125`
- Local Node source-extraction measurement and bounded repository `rg` inventory, 2026-08-06

## Assessment

- New information ratio: 0.64 (`3 fully new + 0.5×3 partially new over 7 findings = 0.643`; one finding is confirmation; no simplicity bonus).
- Novelty justification: Three findings newly expose Gate overstatement, additional OpenCode prompt producers, and the semantic loss in the Pi compact target; three partially tighten cache, directive, and receipt claims; one independently confirms arithmetic.
- Questions addressed: Which reductions have enough evidence to proceed without weakening enforcement, and which claims must be downgraded?
- Questions answered: Shadow instrumentation, layout-only serialization, bounded compiled summaries, and identity-gated same-message dedup have conditional paths; directive/Gate/Pi/cross-turn suppression and billed-cache claims remain blocked pending receipts.

## Reflection

- What worked and why: checking tests and source comments alongside byte arithmetic exposed where a “redundant” string is also an intentional failure/drift contract.
- What did not work and why: static repository evidence cannot adjudicate model compliance or provider billing.
- What I would do differently: build the receipt schema around host acknowledgement and guardrail outcomes before measuring aggregate savings.

## Recommended Next Focus

Iteration 15 should synthesize without ranking unless new receipts exist. Preserve the matrix’s evidence gates, explicitly separate byte/configured/observed/billed lanes, and require negative controls for drift, compaction, advisor failure, Gate advisory mode, Pi child leakage, and OpenCode independent-transform ordering before promoting suppression candidates.
