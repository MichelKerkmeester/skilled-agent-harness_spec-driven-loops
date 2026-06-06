# Iteration 050: Feedback reducers revalidation

## Focus
Revalidated phase 008 against the current feedback ledger, learned-feedback module, Stage 3/Stage 4 pipeline boundaries, relation coverage, ENV slots, and absence of shipped reducer modules.

## Findings
1. Phase 008's reducer-parent shape remains valid: it is explicitly a phase parent for an aggregator plus three consumers and env/tests integration, with the shared aggregator reading SQLite `feedback_events` from `feedback-ledger.ts`. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:45-66]
2. The live feedback ledger is shadow-only and has no ranking side effects; it records five event types, confidence tiers, and a SQLite `feedback_events` table with indexes. This supports reducer learning as batch/deferred consumption rather than live mutation. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:1-12] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:115-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:161-169]
3. Existing `learned-feedback.ts` is not a replacement for phase 008 reducers: it writes learned triggers into `memory_index.learned_triggers`, has a separate `SPECKIT_LEARN_FROM_SELECTION` flag, and includes safeguards for term learning rather than reducer consumers for rerank weights, causal edges, or retention policy. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:7-24] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:71-93] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:57-63]
4. Stage 3 no longer has model-based reranking; it performs algorithmic MMR and MPAB only. The planned rerank consumer should therefore avoid assuming an active cross-encoder reducer target in Stage 3 and instead treat rerank-weight learning as a separate/legacy-adapter surface. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:87-117] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:118-130]
5. Stage 4 exposes tier priorities and `STATE_LIMITS` as file-local constants, while phase 008 says the retention reducer should import `STATE_LIMITS`; because the live constant is not exported in the read slice, the child plan needs an export-or-helper adjustment before implementation. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:61-63]
6. Relation coverage is a real guardrail for the causal reducer: default targets set minimum shares/counts for `caused` and `supports`, zero floors for others, and a max share for `supersedes`. The phase amendment to check these before inserting feedback-derived edges remains appropriate. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:36-45] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:71-99] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:61-62]
7. Reducer modules are absent under the live `mcp_server/lib` glob for `*reducer*`; this confirms phase 008 is still planned/scaffolded rather than partially shipped. [INFERENCE: based on Glob result `No files found` for `.opencode/skills/system-spec-kit/mcp_server/lib/**/*reducer*`] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:83-91]
8. The ENV reference still has only insertion comments for feedback reducer flags; implementation should fill the phase slot with concrete defaults before closeout. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:63-66]

## Ruled Out
- Treating `learned-feedback.ts` as the aggregator was ruled out: it learns search terms, not reducer events from `feedback_events`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47-68]
- Assuming Stage 3 model reranking still exists was ruled out by the current Stage 3 code. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:109-117]

## Dead Ends
- Do not implement a retention reducer that imports unexported file-local constants without first adding an explicit export/helper seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80]

## Edge Cases
- Ambiguous input: selected reducer-readiness drift rather than implementation.
- Contradictory evidence: phase 008 requests importing `STATE_LIMITS`, but live code keeps it local; unresolved until child implementation chooses export/helper.
- Missing dependencies: reducer modules absent; treated as planned work, not failure.
- Partial success: complete local revalidation; no reducer-runtime behavior could be tested because modules are absent.

## Sources Consulted
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/spec.md:45-107
- .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:1-170
- .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:1-180
- .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:87-130
- .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80
- .opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts:36-99
- .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105

## Assessment
- New information ratio: 0.88
- Questions addressed: feedback-ledger, learned-feedback, Stage 3/4, relation coverage, absent reducer modules, ENV slots
- Questions answered: phase 008 remains valid but must adapt to dead model rerank and unexported Stage 4 constants

## Reflection
- What worked and why: comparing the phase map to current live modules separated real prerequisites from stale assumptions.
- What did not work and why: module absence prevented behavioral verification of reducers.
- What I would do differently: next pass should inspect child packets individually and produce implementation deltas per child.

## Recommended Next Focus
Iteration 059 should define reducer telemetry gates and explicitly decide how Consumer A behaves now that Stage 3 has only MMR/MPAB.
