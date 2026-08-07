# Iteration 13: Cross-runtime target architecture and reversible rollout

## Focus

Derived a cross-runtime-consistent architecture and rollout/verification contract from iterations 001-012, without final ranking. Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, `Resolved route: mode=research target_agent=deep-research`. Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained this lineage; progressive synthesis is false.

## Findings

1. **Shared policy, native serializers.** Add a runtime-neutral planner beside the live renderer—prefer `.opencode/skills/system-skill-advisor/mcp-server/lib/injection-policy.ts`—returning ordered `{stable[], dynamic[], identities, decisions}`. `render.ts` remains the canonical sanitizing text owner; `hooks/claude/user-prompt-submit.ts` invokes the planner for Claude-derived lanes; Codex/Cursor/Devin translate native envelopes; OpenCode/Pi serialize their native channels. One universal string would erase real channel and ordering differences. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-243] [SOURCE: iterations/iteration-010.md]

2. **Canonical identity separates policy, lifecycle, and turn delivery.** Use immutable IDs `policy.comment-hygiene.v1`, `policy.governor.v1`, `policy.terminal-proof.v1`, `route.advisor.v1`, `gate.spec-folder-question.v1`, `runtime.pi-dispatch.v1`, `session.start-context.v1`, `session.continuity.v1`, `route.compiled-summary.v1`. Compute `contentHash=sha256(UTF8(canonicalText))`, `policySetHash=sha256(ordered id+contentHash)`, and a sanitized `dynamicHash`; exclude raw prompt/path/session data. Minimal state: `{schemaVersion,runtime,workspaceKey,sessionKey,sessionEpoch,turnIdentity?,blockId,contentHash,deliveredAt,deliveryStatus}`. Commit `delivered` only after envelope completion; indeterminate delivery emits again. [SOURCE: iterations/iteration-009.md] [SOURCE: iterations/iteration-011.md: finding 4] [INFERENCE: content-addressed IDs isolate version invalidation from route and lifecycle state]

3. **Replay is a state transition, not a timer.** New/unknown epoch emits full stable policy and applicable dynamic blocks. Within an epoch, emit route on `dynamicHash` change, Gate on first open-epoch delivery or invalid-answer re-ask, and relevance-triggered blocks when applicable. Verified resume/compaction/reload/policy-version change increments or resets the epoch and replays full stable policy plus recomputed continuity/route; duplicate lifecycle event IDs are idempotent. Missing/corrupt/expired/cross-workspace state means emit. A host lacking a verified lifecycle signal cannot suppress across turns. [SOURCE: iterations/iteration-009.md] [SOURCE: iterations/iteration-011.md: findings 4,7] [SOURCE: .pi/extensions/README.md:65-69]

4. **Capability matrix gates activation.** [SOURCE: iterations/iteration-001.md: findings 1-6] [SOURCE: iterations/iteration-002.md: findings 2-7]

| Runtime | Delivery/lifecycle evidence | State/serializer | Initial compatible behavior |
|---|---|---|---|
| Claude | canonical prompt hook; SessionStart | durable store; one `additionalContext` | shadow, then receipt-gated first/repeat dedup |
| Codex | configured Claude adapter; compact receipt incomplete | same durable store; normalized envelope | shadow until pinned lifecycle receipt |
| Cursor | prompt hook registered but observed non-delivering; preCompact unconfirmed | no suppression state | counterfactual only; observed prompt saving remains zero |
| Devin | configured/live evidence; `post-compaction.cjs` | durable store; normalized envelope | shadow then post-compact-gated canary |
| OpenCode | system transform may multi-fire; session events | bounded in-process map; separate system entries | same-message dedup only after message-ID receipt; cross-turn later |
| Pi | input transform; `session_start`/`session_compact` | bounded parent-session map; transformed user text | full first/replay, compact parent reminder, child bypass |

[SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:20-64] [SOURCE: .opencode/plugins/mk-skill-advisor.js:785-906] [SOURCE: .pi/extensions/prompt-advisor.ts:49-106]

5. **Failure semantics are block-specific.** Advisor lookup, telemetry, cache/store, identity, and continuity failures fail open: never block the turn, and emit safe stable policy when state is unknown. Only existing opt-in deterministic Gate enforcement may fail closed for Write/Edit under `MK_SPEC_GATE_ENFORCE=1`; classifier/state errors remain fail-open. `AI_SESSION_CHILD=1` bypasses Gate question/state/advice/denial/telemetry. Pi child/leaf prompts must omit the parent arbitration reminder; unknown parent status retains current parent behavior but cannot copy the reminder into a child prompt. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:882-1058] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md:12-27] [SOURCE: .pi/extensions/prompt-advisor.ts:49-106]

6. **Stable-first ordering enables cache friendliness without claiming cache hits.** Serialize stable blocks in fixed ID order before dynamic route, bounded compiled summary, Gate, runtime reminder, and host-required continuity. Keep prompt, timestamps, session IDs, volatile scores, Gate state, and continuity outside stable identity. Emit privacy-safe metrics: planned/emitted/suppressed block counts and bytes/UTF-16 units, suppression/replay reason, state result, delivery status, runtime, epoch, turn-identity quality, OpenCode transform count, and provider cached-input fields when exposed. Hash/session log values; never log raw prompt/path. [SOURCE: iterations/iteration-008.md] [SOURCE: iterations/iteration-010.md: finding 5] [SOURCE: .opencode/plugins/mk-skill-advisor.js:685-862]

7. **Owners and missing tests are exact.** Shared planner/IDs/hash/order: new `lib/injection-policy.ts` + `tests/injection-policy.vitest.ts`; text/sanitization: `lib/render.ts` + `tests/legacy/advisor-renderer.vitest.ts`; durable state/invocation: `hooks/claude/user-prompt-submit.ts` + its hook tests and new corrupt/restart/epoch tests. Six-envelope coverage belongs in `tests/hooks/runtime-parity.vitest.ts` (currently not six distinct transports). OpenCode owns changes/tests in `mk-skill-advisor.js`, `mk-spec-gate.js`, `mk-spec-memory.js` and corresponding plugin tests, including same-message multi-fire. Pi owns parent/child/leaf and replay behavior in `prompt-advisor.ts`, `spec-gate-classify.ts`, `session-start-context.ts`, `session-compact-context.ts`; tests are missing. Cursor/Codex/Devin need pinned receipts beside adapters. Gate epochs remain in `spec-gate-core.mjs` and core/adapter tests. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:45-100] [SOURCE: .opencode/plugins/tests/mk-spec-gate.test.cjs:356-384] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:1634-1756] [SOURCE: iterations/iteration-011.md: finding 8]

8. **Seven reversible slices preserve attribution.** A: planner IDs/hashes/shadow metrics with byte-identical output; reverse on output diff, privacy leak, or hook-error increase. B: centralized stable/dynamic serialization without suppression; reverse on envelope clause/order mismatch. C: OpenCode same-message dedup; reverse on missing first delivery or ambiguous identity. D: Gate open-epoch delivery dedup; reverse on missing first-question receipt or enforcement change. E: directive first/replay plus route-only repeats per proven runtime; reverse per block on negative-control regression, missed replay, corrupt-state suppression, or route disagreement. F: Pi compact reminder; reverse on unauthorized dispatch/child leakage. G: lifecycle suppression per runtime only after pinned receipts. Iteration-12 ten-turn (`N=10,g=3,r=1`) envelopes: shared configured `9,626→1,715 B` (82.2%), Pi `15,189→3,478 B` (77.1%). Hundred-turn (`N=100,g=10,r=3`): shared `86,598→8,933 B` (89.7%), Pi `142,208→23,602 B` (83.4%), OpenCode known components `85,820→8,155 B` (90.5%) only at `q=1,L=C=0`; Cursor observed prompt saving is zero. These are byte budgets, not effectiveness/billing claims. [SOURCE: iterations/iteration-012.md: Per-Runtime Results] [INFERENCE: slices isolate state, transport, Gate, policy, Pi, and lifecycle reversal]

## Structured Architecture Contract

`resolve facts → planInjection → ordered stable/dynamic blocks + identities → native serializer → delivery outcome → epoch/turn delivery state + telemetry`.

Suppression requires `provenDelivery && provenIdentity && validCurrentEpochState && hashAlreadyDelivered`; any false/unknown term emits. OpenCode additionally needs same-user-message identity; Cursor currently fails proven delivery; Pi children bypass Gate and parent-only policy.

## Ruled Out

- Universal concatenated transport or storage implementation.
- Marking delivery before envelope completion.
- Cursor cross-turn suppression before pinned live proof.
- Prompt-hash-only OpenCode multi-fire identity.
- Fail-closed advisor/cache/telemetry/continuity behavior.
- Volatile data in the stable prefix; all reductions behind one flag; final ranking before receipts.

## Dead Ends

Static evidence cannot prove Cursor delivery, OpenCode transform multiplicity, provider cache hits, or model retention after compaction. More arithmetic cannot resolve these; instrumented receipts are required.

## Edge Cases

- Ambiguous input: consistency means shared semantics plus capability-gated native serialization, not byte-identical envelopes.
- Contradictory evidence: Cursor registration versus observed non-delivery is preserved; suppression stays disabled.
- Missing dependencies: provider acknowledgement/cache fields, stable OpenCode message identity, and pinned lifecycle receipts.
- Partial success: architecture, ownership, rollout, rollback, tests, and cost envelopes are specified; effectiveness and realized savings are not.

## Negative Knowledge

- No current canonical cross-runtime delivery-state owner exists; scorer caches do not prove model delivery.
- No evidence supports raw prompt/path/session telemetry, Cursor suppression/savings, or OpenCode `q=1`.
- Pi's 130-byte reminder/177-byte composite remains modeled, not executed.
- This architecture does not rank reduction candidates.

## Sources Consulted

- Packet config/state/strategy/registry and `iterations/iteration-001.md` through `iteration-012.md`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-225`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:203-243`
- `.opencode/plugins/mk-skill-advisor.js:540-915`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:80-150,882-1060`
- `.pi/extensions/prompt-advisor.ts:49-106`; `.pi/extensions/README.md:65-69`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md:20-64`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts:45-100`

## Assessment

- New information ratio: 0.69 (`3 fully new + 0.5×5 partially new = 5.5/8 = 0.6875`, rounded; no bonus).
- Questions addressed/answered: specified shared policy, IDs/hashes, epoch/turn dedup, replay, capability matrix, failure policy, telemetry/order, exact owners/tests, rollout/reversal, and scenario savings without final ranking.

## Reflection

- What worked and why: explicit capability predicates prevented configured hooks and caches from being mistaken for delivery proof.
- What did not work and why: static sources cannot establish host acknowledgement or runtime cadence.
- What I would do differently: define one receipt schema first, then run identical scenario IDs through each adapter.

## Recommended Next Focus

Run a no-production-change receipt harness for Slice A: first/repeat/route-change/abstention/failure/corrupt-store/version-change, Gate first/repeat/invalid answer, child, resume, compact, Cursor pinned-build delivery, and OpenCode same-message multi-fire. Record planned/emitted block IDs/hashes, epoch, identity, exact bytes, delivery outcome, and guardrail result; promote runtime capabilities only from those receipts.
