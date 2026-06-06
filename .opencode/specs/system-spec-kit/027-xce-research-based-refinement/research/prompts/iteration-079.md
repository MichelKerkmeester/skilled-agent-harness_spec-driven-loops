DEEP-RESEARCH

# Deep-Research Iteration 079 — re-plan sequencing & risk (clean-ship vs rescope-first)

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Reasoned synthesis of prior iterations is the main method; cite where a specific fact is load-bearing.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT — consolidated verdicts from iterations 061-078 (build on these; don't re-derive)
- 002 STILL-RELEVANT (3 P0s real, minimal repath; P0-2 distinct from conflict guard).
- 003 STILL-RELEVANT (foundation unbuilt; build ON self-maintaining scan).
- 004 NEEDS-RESCOPE (14 delete-sites; edge_lifecycle_generation rename; stale handler paths).
- 005 KEEP-NARROWED (parent/children/parentChain + provenance cols; DROP manual.* + doc-chain; internal REQ conflict to fix).
- 006 NEEDS-RESCOPE (sync DiffAction + async replay).
- 007 NEEDS-RESCOPE (largest: cache/schema identity profile_key+input_kind Nomic-768; thresholds; ship last).
- 008 family: 002-coco DELETE; 001 REUSE batch-learning; STATE_LIMITS export; DEFAULT_RELATION_TARGETS fix; structural metadata edits (keep gap).
- 001 REFINE (003-discipline warn→INFO residual wording).
- Coco purge: 1 DELETE + REWRITEs across 002/003/004/006/007/008.
- Drift: 026-status, path-root self-cites, 028/coco deps, 009→008 numbering, continuity 3-way conflict, 000 child-list.
- vocab NEEDS-FIX; XCE EXHAUSTED; ordering 002‖003→004→005→006, 007 last, 008 after 002.

## FOCUS — answer only this
Produce the recommended re-plan SEQUENCE and a risk classification, distinguishing what ships clean with minimal change vs what needs a rescope pass first, and the blocking prerequisites.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-5 findings `[F-079-NN]`: the cleanest-ship phases; the highest-risk phases; the cross-cutting prerequisites that gate everything (coco purge, drift reconcile, vocab/STATE_LIMITS).

### RECOMMENDED_SEQUENCE
Ordered steps (P0 first). Each step: what + why + dependency. Distinguish:
- Phase 0 (mechanical prereqs, do first): coco purge, parent drift reconcile, path/vocab/STATE_LIMITS fixes.
- Then the phase-implementation order.

### SHIP_CLASS_TABLE
`phase | class (CLEAN-SHIP / RESCOPE-THEN-SHIP / BLOCKED) | blocking prerequisite (if any)`

### TOP_RISKS
3-5 bullets: the riskiest items + mitigation.

### VERDICT
One-paragraph re-plan recommendation.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated list>

Terse, evidence-dense, no preamble.
