# Iteration 007

## Focus

Identify missing shared-runtime and command-contract tests for executor-family/model separation, per-seat model selection, and requested-versus-effective provenance.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, and iteration-006 artifacts before research, preserving the active focus and avoiding the exhausted council-delta parity direction. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:24-28] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-136] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-006.md:42-56]
2. Inventoried system-deep-loop tests and searched them for executor-family, model, seat, route, and requested/effective vocabulary. Existing council coverage concentrates on seat ids, fixed route fields, and session-level executor configuration; no test references `effective_primary_agent`, `requested_mode`, or a seat-local model input. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:170-198] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts:13-43,84-121]
3. Examined council session orchestration tests at the boundary where route configuration enters topic orchestration. Tests replace `orchestrateTopic` with a stub and assert the requested route header, so they never reach child-process argument construction or prove which model/agent executed a seat. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:62-75,103-121,138-198]
4. Examined the shared command-contract renderer suite. Its command type and test matrix include only `deep/review` and `deep/research`, leaving `deep/ai-council` outside byte-parity, compiled-contract, invocation-prefix, manifest-hash, and compare-CLI coverage. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:11-35,81-174]

## Findings

### F-ITER007-001 (P1): No boundary test proves per-seat model selection reaches the subprocess

The session tests inject an `orchestrateTopic` stub above the seat dispatcher. They can verify session-level configuration forwarding but cannot catch the iteration-006 defect where one globally resolved model is used for every seat and seat-local model fields are ignored. Add a subprocess-boundary test with at least two seats requesting distinct models; capture each spawn argv, assert one invocation per seat with the corresponding model, and assert executor family is never passed as the `--model` value. Include precedence cases for seat override, session default, and missing model. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:62-75,138-198] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-006.md:16-22]

### F-ITER007-002 (P1): Existing route assertions enshrine requested identity without testing effective identity

The sole route-contract assertion requires a fixed header and fields with `target_agent: @ai-council`. It does not distinguish requested workflow intent from the child process's effective primary agent, and no negative test rejects disagreement among the header, structured route fields, and completion record. Add table-driven tests that preserve `requested.mode`/`requested.target_agent`, leave unobserved effective fields null, populate effective fields only from execution receipts, and fail when rendered route views disagree with the normalized route object. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:170-198] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-006.md:24-34]

### F-ITER007-003 (P1): Persistence tests cannot detect loss of per-seat execution provenance

Current session assertions inspect topic ids, final-verdict registry entries, aggregate stability, and stop behavior. They do not reconstruct a completed round and verify a normalized provenance envelope for each seat. A round-state/replay test should persist two seats with different requested models and execution receipts, reload the JSONL, and assert stable separation of requested route, seat id/lens, executor family, requested model, effective model, and nullable effective agent across interruption/replay. It should also prove opaque seat output cannot silently substitute for provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:85-99,124-134] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-006.md:28-30]

### F-ITER007-004 (P1): Council has no shared command-contract rendering coverage

The generic renderer's closed `Command` union and `commands` matrix exclude `deep/ai-council`. Consequently, the shared suite cannot detect drift between the council command entrypoint, compiled contract, invocation prefix, or manifest hash, including future executor-family and provenance fields. Extend the renderer contract matrix to council or add an equivalent council-specific contract test that verifies both fallback/fix rendering and semantic route-schema assertions; byte identity alone is insufficient for requested-versus-effective correctness. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:11-35,81-174]

### F-ITER007-005 (P2): No cross-layer test rejects executor-family/model type confusion

Existing tests use an executor object containing `model: 'test-model'` or inspect route fields, but no contract test supplies family-shaped values such as `cli-opencode` to the model slot and expects rejection. Add schema/normalization tests for valid executor families, valid model identifiers, legacy ambiguous strings, unknown families, and family names in model fields, followed by one command-to-spawn integration test proving the normalized values retain their categories. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:46-87] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-006.md:16-18]

## Questions Answered

- **Which shared-runtime tests are missing?** Model-precedence and argv tests at the seat subprocess boundary; route normalization and contradiction tests; round-state/replay provenance tests; and executor-family/model schema rejection tests.
- **Which command-contract tests are missing?** Council is absent from the shared renderer matrix, so it needs fallback/fix rendering, invocation-prefix, manifest-hash, compare-CLI, and semantic normalized-route coverage.
- **What is the most important negative assertion?** Requested values must never be accepted as proof of effective values; absent execution evidence must persist as null/unknown, not `@ai-council` or the requested model.
- **Can current session tests catch per-seat model loss?** No. Their injected topic stub prevents execution from reaching seat model resolution and subprocess argv construction.

## Questions Remaining

- Which shared-runtime and command-contract tests are missing for the four cost/liveness defects from iteration 5?
- How do deep-improvement candidate prompts and reducer boundaries compare with the review and council failure patterns?
- Are review prompt/validator schema mismatches covered outside skill-local tests?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?

## Next Focus

Identify missing tests for synthetic-heartbeat liveness, council concurrency/dimension bounds, subprocess-tree timeout cleanup, and retry-aware fan-out budgets.

## Ruled-Out Directions

- Merely adding more assertions for the fixed `target_agent: @ai-council` header is ruled out because it strengthens requested-route coverage while leaving effective execution identity unobserved. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:170-198]
- Testing per-seat model diversity only through mocked `orchestrateTopic` calls is ruled out because that boundary does not execute model resolution or construct subprocess arguments. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:62-75,138-157]

## SCOPE VIOLATIONS

None. No researched runtime, skill, command, agent, config, or test file was modified.
