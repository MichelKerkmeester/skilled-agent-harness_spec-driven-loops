# Iteration 023 — Angle 23

**Angle:** Reducer interaction safety: aggregator, causal reducer, retention reducer — composition order, double-processing guards, idempotency across reducers.

**Summary:** Reducer composition is mostly guarded on active mutation paths, but shadow/replay surfaces do not fully validate the same guards. The main safety gaps are duplicate event amplification and shadow modes whose behavior is not transparent composition over the existing reducers.

**Findings kept:** 4

## [P1][BROKEN-FEATURE] Causal shadow replay skips the guards it is supposed to validate

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts:250-255 skips immediately on dryRun before existing-edge/manual checks at 255-281; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/003-causal-reducer/plan.md:43-47 and 81-87 claim shadow replay proves caps/manual-edge protection.
- Detail: The dry-run path records every candidate as `dry_run` and never calls `readExistingEdge` or `insertEdge`, so it cannot report `already_created`, `manual_protected`, or insert-cap failures. The active path has those guards, but the shadow replay evidence required before active rollout does not exercise them.
- Fix sketch: Move dry-run handling after read-only guard classification, returning would-skip reasons without calling the mutating insert path.

## [P1][BUG] Aggregator does not gate duplicate feedback events before retention decisions

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:85-87 requires duplicate events be counted and gated; .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:128-140 has no uniqueness key and 195-205 inserts every event; .opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:270-293 increments counts for every row.
- Detail: The shared aggregator treats duplicate ledger rows as independent signal volume. Retention uses those inflated `weightedHitCount`, `sessionCount`, and `queryCount` summaries, so duplicate event bursts can push an `important` row into `extend` without an explicit duplicate guard.
- Fix sketch: Add a deduplication key or duplicate counter/gate in `aggregateEvents` before emitting reducer-facing signal fields.

## [P2][REFINEMENT] Retention shadow mode replaces the baseline sweep instead of composing with it

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:433-435 builds feedback retention when enabled, then 458-483 returns `swept: 0` for shadow or active-blocked modes; .opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-feedback-learning.vitest.ts:141-168 asserts shadow mode writes audits and leaves rows unchanged.
- Detail: Enabling retention learning in shadow mode pauses normal TTL deletion/protection behavior for that sweep, not just feedback-driven mutation. That is safe for learning, but it is not a transparent audit overlay and can surprise operators expecting baseline retention to keep running while feedback learning is shadowed.
- Fix sketch: Either document shadow mode as a sweep pause or split feedback shadow auditing from the baseline retention mutation path.

## [P2][DOC-DRIFT] Batch feedback default is documented both ON and OFF

- Evidence: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3019 says `Default OFF`; .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:89 and .opencode/skills/system-spec-kit/references/config/environment_variables.md:289 say ON; .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:601-606 says default TRUE.
- Detail: The code and current ENV references agree that `SPECKIT_BATCH_LEARNED_FEEDBACK` is graduated on by default, while the aggregate feature catalog still says it is off. This matters for reducer composition because `runBatchLearning` is invoked at startup and writes audit rows when enabled.
- Fix sketch: Update the aggregate feature catalog default to ON and keep a single generated source for flag defaults.
