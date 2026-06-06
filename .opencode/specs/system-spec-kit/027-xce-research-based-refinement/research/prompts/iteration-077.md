DEEP-RESEARCH

# Deep-Research Iteration 077 — phase ordering/handoff re-validation (post-coco, post-026-dedup)

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`. Reasoned synthesis allowed.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT (prior-iteration conclusions to build on)
- 002 STILL-RELEVANT (3 P0s real; minimal repath). 008 depends on 002 safety landing first.
- 003 STILL-RELEVANT (foundation unbuilt). 004 depends on 003 incremental foundation.
- 004 NEEDS-RESCOPE (14 delete-sites; tombstone before promotion). 005 depends on 004 tombstone support for generated-edge cleanup.
- 005 KEEP-NARROWED (parent/children/parentChain promotion only). 006 consumes generated edge sets as statediff candidates.
- 006 NEEDS-RESCOPE (sync DiffAction + async replay).
- 007 NEEDS-RESCOPE (largest; embedding-profile + cache identity). Should ship LAST.
- 008 family: 002-coco DELETED; 001 reuse batch-learning; 003/004 reducers; 005 env-tests; depends on 002 P0 safety + 003/004 vocab/STATE_LIMITS fixes.

## FOCUS — answer only this
Re-validate the 027 parent PHASE HANDOFF table against these updated dependencies. Read:
1. `spec.md` PHASE MAP + "Phase Handoff Criteria" + "Continuation Research Planning Amendments".
2. Confirm/repair each handoff edge given the updated verdicts.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-5 findings `[F-077-NN]`. Cover: which existing handoff edges still hold; which are now stale (e.g. references to deleted 002-coco, or 028 deps); the correct dependency-driven order.

### UPDATED_ORDER
The recommended execution order across 002-008 with one-line dependency justification each. Note which can run in parallel.

### HANDOFF_FIXES
Bullets: specific edits to the parent spec.md handoff table (remove coco/028 edges, add 002→008 safety precondition, 003→004, 004→005, 005→006, etc.).

### VERDICT
ordering = {VALID | NEEDS-UPDATE} + headline.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
