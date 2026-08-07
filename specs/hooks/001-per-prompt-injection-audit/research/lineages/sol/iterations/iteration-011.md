# Iteration 11: Candidate reduction set stress-tested by action class

## Focus

Constructed, but did not rank, the reduction set across `trim`, `conditionalize`, `consolidate`, `cache/stable-place`, and `drop`. Each requested block is treated as a behavioral contract: candidate change, surviving enforcement path, failure mode, runtime coverage, rollback trigger, and validation evidence are explicit. Prior byte/token estimates are reused as scenario bounds rather than billing claims.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **Trim is viable for dynamic routing and the Pi dispatch reminder, but not as an untested shortening of enforcement semantics.** The recurring advisor candidate is the route-only line (representative 43 B/~11 estimated tokens) instead of the current combined 806 B/~201; preserve scorer thresholds, ambiguity, sanitization, and skill loading through the existing advisor producer and named-skill trigger rules. The Pi candidate is a compact arbitration reminder after one full delivery, preserving current-turn CLI authorization and explicit non-nesting/leaf restrictions in the durable Pi/framework contract. Failure modes are an omitted ambiguous second route or an agent treating compact text as permission to delegate; cover Claude/Codex/Devin/Pi and OpenCode serializers, keep Cursor measurement unclaimed. Roll back on route-selection disagreement, unauthorized Pi dispatch, or any fixture losing the preserved clauses. Validate with canonical full-versus-trim semantic fixtures, ambiguity cases, malicious skill labels, and Pi parent/child/leaf dispatch cases. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-006.md] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-007.md] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:157-215] [SOURCE: .pi/extensions/prompt-advisor.ts:49-106]

2. **Conditionalization is the primary candidate for the three directives, but each needs a distinct trigger and surviving machine/durable path.** Comment hygiene can emit on code/comment mutation intent and after lifecycle refresh; its durable AGENTS/constitutional rule and pre-commit detector remain enforcement. Governor can move to first delivery plus multi-step/delegation/loop triggers; its durable agent definitions remain the fallback, but no machine enforcement exists, so behavioral regression is the dominant risk. Proof-over-appearance can emit on implementation, completion claims, or failing checks; authoritative tests and completion gates remain enforcement. Estimated eligible-repeat saving is the 763 B/~190 fallback capsule per silent turn, but runtime relevance classifiers can miss paraphrases. Roll back each directive independently if negative-control tasks show forbidden comments, narration/indecision, or unsupported completion claims above baseline. Validate before/after blind task suites across six envelopes plus post-compaction replay, not string-presence alone. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-004.md] [SOURCE: AGENTS.md:57-105] [SOURCE: AGENTS.md:193-211] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-74] [INFERENCE: directive-specific triggers follow their cited enforcement boundaries]

3. **Consolidate can remove mirrored prose while preserving one canonical policy object, but a single universal transport is unsafe.** Candidate: return ordered `{stable[], dynamic[]}` blocks from the canonical advisor/policy layer and let Claude/Codex/Devin, Cursor, OpenCode, and Pi serialize their native envelopes. Preserve renderer caps/privacy, Gate state/enforcement, Pi placement, and each host's fail-open response. Failure modes are serializer ordering drift, doubled separators, or OpenCode/Pi message-channel semantic changes. Cover six source adapters, but capability-gate Cursor. Roll back if byte-equivalence fixtures or live receipts differ on required clauses/order. Evidence needed: six distinct runtime envelope fixtures, not the current `['claude','opencode','opencode']` test, plus compiled/source freshness checks. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:1-105] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md] [SOURCE: .opencode/hooks/injection-contract.md:35-71]

4. **Cache/stable-place is safe only as delivery-state with explicit replay, never as scorer memoization or provider-cache inference.** Candidate: record a versioned capsule hash, route digest, lifecycle epoch, and last prompt/message identity; emit stable content first, suppress byte-identical repeats, and re-emit on first turn, route/version change, verified resume/compact, missing/corrupt/stale state, or ambiguous identity. Existing advisor caches reduce recomputation only, so they cannot prove the model saw content. Failure modes are stale state suppressing a needed capsule, cross-session collision, and compaction erasing model context while delivery state says present. Cover durable subprocess state for Claude/Codex/Devin, in-process bounded stores for OpenCode/Pi, and no suppression for unconfirmed Cursor delivery. Roll back on any missed replay or cross-session suppression. Validate corrupt/expired/version-mismatch state, process restart, resume, compaction, and store-error emit-not-suppress cases. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts:1-140] [SOURCE: .opencode/plugins/mk-skill-advisor.js:685-754] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:80-145] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-009.md]

5. **Gate 3 supports conditionalization and open-epoch/message dedup, not dropping the first question.** Candidate: preserve first unresolved positive, invalid-answer re-ask, terminal state, and PreToolUse enforcement/advisory; suppress an unchanged positive only after recording question delivery for the current open epoch, and dedup OpenCode by last-user-message identity across repeated transforms. Failure modes are lexical ambiguity, stale open state, or a delivery record written before context reaches the model. Cover Claude/Codex/Devin/Pi, OpenCode transform cadence, and Cursor prebind rather than presumed prompt delivery. Roll back on any mutation reaching a tool without first-question receipt or correct deny/advisory. Validate ambiguous prompts, read-only-plus-write tails, invalid answers, corrupt state, child sessions, repeated transforms, and crash between state write and delivery. Prior saving is `521 × (eligible repeats-1)` bytes/~`131 × repeats` estimated tokens; first emission remains unchanged. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-1058] [SOURCE: .opencode/plugins/mk-spec-gate.js:186-215] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:138-224] [SOURCE: .opencode/plugins/tests/mk-spec-gate.test.cjs:88-178] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-005.md]

6. **Drop is justified only for payloads whose model-visible marginal value is zero and whose independent guardrail path is proven.** Candidate drops: advisor text on true abstention/no-match; repeated identical Gate question within a delivery-proven epoch; duplicate OpenCode compiled target enumeration in favor of bounded count+digest; Cursor per-turn cost claims until delivery is confirmed. Do not drop the first Gate question, all three directives together, Pi arbitration, or lifecycle continuity. Advisor failure is adversarial: dropping its 763 B fallback is acceptable only if directive delivery is independently refreshed; otherwise failure must retain current capsule. Roll back if daemon-failure tests lose guardrails or clarify routes lose actionable target names. Validate no-match versus fail-open as separate states, bounded compiled summaries, and host-level receipts. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-244] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:21-108] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-006.md]

7. **SessionStart/continuity should move to stable placement with event-class replay, not “once per session.”** Candidate: keep stable startup identity/instructions outside changing turn text, split dynamic continuity/goal/spec-folder facts, and refresh the dynamic portion on resume, compact, reload, version change, or continuity fingerprint change. Preserve canonical session-prime and post-compaction recovery paths. Failure modes are stale spec bindings after resume, replay duplication, and runtime event gaps. Claude and Pi have usable lifecycle surfaces; Codex requires pinned receipts; OpenCode is transform-based; Cursor/Devin remain capability-unknown. Roll back if post-compact/resume tasks act on stale folders or omit current continuity. Validate fresh start, resume into changed state, compact with/without saved continuity, process restart, and duplicate lifecycle events. Savings cannot be safely estimated as per-turn because SessionStart cadence is event-dependent. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-007.md] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-009.md] [SOURCE: .pi/extensions/README.md:23-69]

8. **Current regression coverage proves baseline envelopes and some Gate state, but does not validate the proposed guardrail-preserving reductions.** Existing advisor tests pin the full/fallback text, disabled hook, parse failure, and timeout fail-open; runtime parity duplicates OpenCode and omits four distinct hosts. Gate tests cover first open, read-only silence, enforcement/advisory, terminal state, OpenCode prompt recovery, and kill-switch ordering. Missing tests are: stable/dynamic contract; per-directive trigger false negatives; route/version/compact replay; stale/corrupt delivery state; state-write-before-delivery crash; advisor-daemon failure with independent directives; `AI_SESSION_CHILD=1` across all serializers; ambiguous Gate-3 tails and invalid-answer epochs; Cursor live delivery receipt; OpenCode same-message multi-fire; and Pi compact/resume plus unauthorized child dispatch. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:1-105] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:21-180] [SOURCE: .opencode/plugins/tests/mk-spec-gate.test.cjs:1-260] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:138-224] [SOURCE: .cursor/SYNC.md:74-115]

## Candidate Reduction Matrix

| Block | Action-class candidates | Preserved enforcement path | Main failure / rollback trigger | Runtime coverage and evidence gate | Estimated repeat saving |
|---|---|---|---|---|---:|
| Advisor route | trim; conditionalize; cache; drop on true abstention | scorer thresholds, ambiguity, named-skill rules | wrong/missing route; rollback on routing disagreement | five proven serializers; Cursor receipt first; route/change/failure fixtures | ~763 B/~190 per representative matched repeat after full capsule split |
| Comment hygiene | conditionalize; consolidate; stable-place | AGENTS + constitutional rule + pre-commit gate | forbidden artifact comment; rollback on any gate/compliance regression | six envelopes, mutation/compaction negative controls | included in 763 B capsule |
| Governor | conditionalize; consolidate; stable-place | durable agent definitions only | narration/indecision regression | behavioral A/B required; no machine proxy | included in 763 B capsule |
| Proof over appearance | conditionalize; consolidate; stable-place | verification/completion gates and test commands | unsupported completion claim | implementation/completion/failure/compact matrix | included in 763 B capsule |
| Gate 3 | conditionalize; cache open epoch/message; drop repeats | first question + atomic state + PreToolUse deny/advisory | mutation without delivered question; immediate rollback | all policy adapters; Cursor prebind; OpenCode multi-fire receipt | 521 B/~131 per eligible repeat |
| Pi dispatch | trim; conditionalize; stable-place | Pi/framework dispatch contract and current-turn authorization | unauthorized/nested dispatch | Pi parent/child/leaf, resume/compact | prior compact candidate saves 424 B/~105 per eligible turn |
| SessionStart/continuity | consolidate stable/dynamic; stable-place/cache with replay | session-prime + compact/resume recovery | stale/missing continuity | event-specific receipts; no universal once-only assumption | event-dependent; no per-turn claim |
| OpenCode compiled summary | trim; consolidate; drop duplicate targets | served-route metadata/digest | clarify route loses actionable target | native bridge + multi-fire tests | unbounded today; scenario-dependent |

## Adversarial Stress Cases

- **Compaction/resume:** suppression state must not outlive model-visible context; replay on verified event or emit on uncertainty. [SOURCE: iteration-009.md]
- **Stale session state:** version/hash/epoch mismatch and corrupt reads must emit, never suppress. [SOURCE: spec-gate-core.mjs:80-145]
- **Ambiguous Gate 3:** mixed read/write tails and malformed answers retain first/re-ask semantics; dedup only identical delivered epoch. [SOURCE: spec-gate-core.mjs:909-979]
- **Advisor daemon failure:** distinguish abstention from failure; independent directives must exist before dropping the fallback capsule. [SOURCE: claude-user-prompt-submit-hook.vitest.ts:90-180]
- **Child dispatch:** `AI_SESSION_CHILD=1` must suppress interactive Gate 3 without weakening scoped external write authority; `MK_SPEC_GATE_ENFORCE=0` is not equivalent executable suppression. [SOURCE: iteration-005.md]
- **Cursor unconfirmed delivery:** keep static/session guardrails and assign zero/unknown dynamic saving until a pinned live receipt exists. [SOURCE: .cursor/SYNC.md:81-115]
- **OpenCode multi-fire:** key delivery by session plus last-user-message identity and append idempotently to each output; do not count transforms as turns. [SOURCE: mk-spec-gate.js:186-215]

## Ruled Out

- Ranking candidates before the behavioral receipt matrix exists.
- Dropping all directives because durable prose exists.
- Treating provider prompt caching as delivery or semantic memory.
- Writing suppression state before confirmed/atomic model-context delivery without an emit-on-uncertainty recovery.
- Charging Cursor configured payload as observed cost.
- Treating OpenCode transform count as user-turn count.
- Treating SessionStart as universally once-only.

## Dead Ends

Generic test grep produces unrelated lifecycle/cache hits. The productive regression surface is the canonical advisor hook/renderer fixtures, shared Gate core plus adapter tests, Pi lifecycle adapters, Cursor receipts, and OpenCode plugin transform tests. Further broad search should be replaced by the explicit missing-test matrix above.

## Edge Cases

- Ambiguous input: “drop” could mean delete guardrail semantics or omit redundant delivery. Only the latter remains a candidate.
- Contradictory evidence: Cursor configuration claims a prompt hook while the pinned local receipt says it does not fire; savings remain zero/unknown.
- Missing dependencies: no six-runtime behavioral A/B baseline, Cursor live prompt receipt, OpenCode transform-count receipt, or post-compaction delivery-state test exists.
- Partial success: the candidate set, preservation contracts, rollback triggers, savings bounds, and missing gates are complete; effectiveness and final ranking remain intentionally unresolved.

## Negative Knowledge

No string-equivalence test proves behavioral guardrail effectiveness. No current suite proves six distinct advisor envelopes. No delivery-state store spans all runtimes. No provider-cache metric proves these small blocks earn cache hits. No test proves suppression survives compaction safely. No live evidence confirms Cursor per-turn delivery or OpenCode transform multiplicity. No machine enforcement substitutes for the governor directive. No safe basis exists yet for dropping the first Gate question, all directive delivery, Pi arbitration, or lifecycle continuity.

## Sources Consulted

- Iterations 001-010 and packet config/state/strategy/registry.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:157-215`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts:1-140`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-244`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:1-105`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:21-180`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:80-145,882-1058`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-codex.test.mjs:138-224`
- `.opencode/plugins/mk-spec-gate.js:186-215`; `.opencode/plugins/tests/mk-spec-gate.test.cjs:1-260`
- `.pi/extensions/prompt-advisor.ts:49-106`; `.pi/extensions/README.md:23-69`
- `.cursor/SYNC.md:74-115`; `AGENTS.md:57-105,193-211`

## Assessment

- New information ratio: 0.72 (`(4 fully new + 0.5×4 partially new) / 8 = 0.75`, reduced to 0.72 to reflect dependence on prior measurements; no simplicity bonus).
- Novelty justification: four findings add explicit rollback/evidence contracts and missing adversarial gates; four convert prior seams into action-class candidates without ranking them.
- Questions addressed: What candidate reductions exist by action class, what enforcement survives each, and what evidence would make each safe?
- Questions answered: The unranked candidate set and validation contract are specified for every requested payload block; behavioral effectiveness remains open.

## Reflection

Working backward from rollback conditions exposed which apparent byte savings lack an independent enforcement path. Existing tests are strongest for baseline text and Gate terminal state, weakest for model-visible delivery, lifecycle replay, and behavioral effectiveness. The next iteration should turn this matrix into executable receipt scenarios and collect actual first/repeat/refresh envelopes before any ranking.

## Recommended Next Focus

Define and, where feasible, run the behavioral receipt matrix: first delivery, identical repeat, route change, true abstention, daemon failure, stale/corrupt state, child session, ambiguous Gate prompt, invalid answer, resume, compaction, Cursor prompt delivery, and OpenCode same-message multi-fire. Record exact emitted hashes and guardrail outcomes; keep final ranking deferred until those receipts exist.
