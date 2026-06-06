# Iteration 077 — ordering NEEDS-UPDATE (minor): core edges hold; add 007-last global edge; purge stale 028/coco coupling from amendments text

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.34. **Findings:** 4.
**Raw analysis:** `research/prompts/iteration-077.out`

### FINDINGS
[F-077-01] `002 → 008` still holds: parent table already gates reducers on P0 feedback safety, and 008 declares 002 as hard dependency/execution step 1. `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:164`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:37`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:73`

[F-077-02] `003 → 004 → 005 → 006` still holds: parent table matches child specs for incremental foundation, tombstone-before-promotion, and generated-edge/statediff handoff. `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:165-167`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:80`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:82-83`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:85-87`

[F-077-03] Parent table is incomplete for updated `007` verdict: 007 is only represented as shadow→union internal promotion, but no global edge forces it to ship last despite embedding-profile/cache-identity rescope. `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:171`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:41`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:52-57`

[F-077-04] No current parent handoff-table row points to deleted coco/028 work; stale 028/Coco coupling is outside the table in continuation amendments and child metadata, so table fix is additive/guarded rather than deletion-heavy. `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:151`, `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:162-172`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:76`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:38`

### UPDATED_ORDER
1. `002-memory-write-safety`: land first or in parallel with 003; required P0 causal/retention safety before feedback reducers.
2. `003-incremental-index-foundation`: can run parallel with 002; foundation for precise fingerprints/dependency DAG.
3. `004-causal-edge-tombstones`: after 003; tombstone lifecycle before generated-edge volume expands.
4. `005-metadata-edge-promoter`: after 004; generated metadata edges need tombstone-backed cleanup.
5. `006-write-path-reconciliation`: after 005; consumes generated edge sets as statediff target candidates.
6. `005-learning-feedback-reducers`: after 002; can run parallel with 003→006 chain once 002 lands, with 008 child 003/004 vocab/STATE_LIMITS fixes before 008/005 env-tests.
7. `004-semantic-trigger-fallback`: last; largest/hottest cache+embedding profile rescope, keep after durable write/reducer foundations.

### HANDOFF_FIXES
- Keep `002-memory-write-safety → 005-learning-feedback-reducers`; strengthen wording to mention 002 P0 safety as hard precondition for all 008 reducer consumers.
- Keep `003-incremental-index-foundation → 004-causal-edge-tombstones`.
- Keep `004-causal-edge-tombstones → 005-metadata-edge-promoter`.
- Keep `005-metadata-edge-promoter → 006-write-path-reconciliation`.
- Add `006-write-path-reconciliation → 004-semantic-trigger-fallback`: DiffAction/action replay and cache identity conventions land before trigger embedding/backfill work.
- Add `005-learning-feedback-reducers → 004-semantic-trigger-fallback`: reducer shadow/eval evidence and feedback-safety surfaces settle before semantic trigger promotion.
- Do not add or retain parent handoff rows to deleted coco/028 phases; current parent table has none, but line 151 amendment should be reworded separately to remove stale 028/Coco coupling.

### VERDICT
ordering = NEEDS-UPDATE + core 002→008 and 003→006 edges are valid, but parent handoff table must encode 007-last and purge stale 028/Coco coupling from planning text.

### RULED_OUT
- No need to reorder 005 before 004; child 005 explicitly requires 004 tombstones.
- No need to make 007 a prerequisite for 008; 007 is hot-path semantic trigger work and should remain last.
- No parent-table deletion for coco/028 edges because none are currently present in rows 162-172.

### METRICS
newInfoRatio: 0.34  
novelty: Re-validation mostly confirms existing handoff rows, with one important missing global 007-last edge and stale non-table 028/Coco wording.  
status: complete  
sources: `specs/system-spec-kit/027-xce-research-based-refinement/spec.md:128-172`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:37-49`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:80-89`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:80-90`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:82-91`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:85-95`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:41-57`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:37-65`
