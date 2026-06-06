# Iteration 059: Reducer Telemetry Gates

## Focus
Define shadow-to-live gates for Phase 008 feedback reducers using the current feedback ledger, relation-coverage, and Stage 4 constraints; identify reducer behavior that must remain default-off.

## Findings
1. Phase 008 is intentionally a phase parent, not a direct implementation packet; its root purpose is to coordinate reducer children only after correctness preconditions land, with all reducer behavior default-off and shadow-first until evaluation gates allow live mutation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:86]
2. The feedback ledger is suitable as a shadow evidence source because it records five event types with confidence tiers into SQLite, defaults logging on, and explicitly has no ranking side effects. Reducer gates should consume ledger aggregates, not live event callbacks. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:20] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:161]
3. The shared aggregator child should be the only interpretation layer for feedback windows: it aggregates by memory, tracks strong/medium/weak counts and sessions/queries, and defines a bounded `weightedHitCount` formula. Shadow-to-live gates must verify deterministic reruns and bounded window memory behavior before consumers run. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/001-aggregator/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/001-aggregator/spec.md:101]
4. Causal reducer live promotion must be stricter than "has citations": it emits weak `ENABLED` edges only from deferred same-session evidence, preserves manual-edge guards, caps 3-5 prior shown sources, and should check relation coverage floors before insertion so it does not overfill already-saturated relation types. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:56] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:36]
5. Retention reducer live promotion must respect Stage 4's read-only score invariant and tier limits: Stage 4 removes/annotates results without reordering or score changes, while the reducer owns retention decisions as a separate deferred/audited mutation surface. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:6] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:128] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer/spec.md:56]
6. Coco rerank is the only reducer allowed to adjust ranking, but still only through aggregate counts/deltas, min support, clamped `[-0.10,+0.10]`, and a default-off flag; raw comments and active rollout without eval gate remain out of scope. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:56] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:64]

## Decisions / Recommendations
- **Gate 1 — ledger quality:** require a minimum feedback window, valid confidence distribution, deterministic aggregation rerun, and no malformed/duplicate-event drift before any consumer reads a window.
- **Gate 2 — shadow replay:** each consumer must run in shadow over the same window and emit would-change counts, bounded impact, skipped-safety counts, and idempotency evidence.
- **Gate 3 — consumer-specific live criteria:** coco requires support thresholds and clamped deltas; causal requires manual-edge and relation-coverage safety; retention requires dry-run audit and Stage 4 consistency.
- **Default-off must remain:** `SPECKIT_COCOINDEX_FEEDBACK_RERANK`, `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`, `SPECKIT_FEEDBACK_RETENTION_LEARNING`, and retention `active` mode. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/005-env-tests-integration/spec.md:56]
- **Do not promote:** live per-event reducer invocation, raw comment ingestion into learned tables, broad tier-floor protection for auto-derived edges, and retention active mode without an eval gate. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:65] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer/spec.md:64]

## Ruled Out
- Per-event live reducer firing: explicitly out of scope for causal reducer and incompatible with shadow-first phase-parent policy. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:65]
- Stage 4 score adjustment by reducers: Stage 4 has compile-time and runtime no-score-mutation invariants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:230]

## Dead Ends
- A single global "feedback reducers enabled" switch is unsafe because the three consumers have different mutation surfaces, support thresholds, and rollback requirements. [INFERENCE: based on separate flags and consumer scopes]

## Edge Cases
- Ambiguous input: "008 reducers" could refer to parent or child folders; this iteration treated the parent as governance and children 001-005 as implementation surfaces.
- Contradictory evidence: none found.
- Missing dependencies: actual reducer modules are scaffolded/planned; gates are defined from specs and existing ledger/relation/Stage 4 code, not live reducer implementation.
- Partial success: live telemetry thresholds could not be calibrated without production/shadow run data.

## Sources Consulted
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:47`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/001-aggregator/spec.md:48`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:56`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/spec.md:56`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer/spec.md:56`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/005-env-tests-integration/spec.md:56`
- `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:36`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:6`

## Assessment
- New information ratio: 0.83
- Questions addressed: reducer telemetry gates; shadow-to-live promotion; default-off constraints.
- Questions answered: what must remain default-off and what evidence gates must pass before live reducer effects.

## Reflection
- What worked and why: reading parent plus child specs separated governance gates from consumer-specific safety gates.
- What did not work and why: no live shadow logs existed for numerical thresholds, so recommendations remain threshold classes rather than calibrated constants.
- What I would do differently: after implementation, replay one fixed ledger window through all consumers and freeze expected would-change metrics as promotion fixtures.

## Recommended Next Focus
Final synthesis should keep Phase 008 but revise it with an explicit shadow-to-live gate matrix and merge duplicated default-off documentation into the closeout child.
