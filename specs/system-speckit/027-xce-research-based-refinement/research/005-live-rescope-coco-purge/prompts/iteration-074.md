DEEP-RESEARCH

# Deep-Research Iteration 074 — 008 family STRUCTURAL/metadata re-shape after deleting 002-coco

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- Iteration 061 settled the CONTENT changes for the 008 family (002-coco-rerank-consumer = DELETE; family prose REWRITE to coco-free `001 → {003,004} → 005`).
- This iteration is the STRUCTURAL/metadata angle: after the `002-coco-rerank-consumer/` folder is physically deleted, what STRUCTURAL metadata + phase-map + dependency edits must follow so the packet stays valid (validator + graph traversal)?

## FOCUS — answer only this
Enumerate the structural/metadata edits the 002-coco deletion forces. Read:
1. `005-learning-feedback-reducers/description.json` and `005-learning-feedback-reducers/graph-metadata.json` (child lists, counts, derived pointers, manual edges referencing 002).
2. `005-learning-feedback-reducers/spec.md` PHASE MAP / handoff table / consumer counts ("three consumers").
3. `005-learning-feedback-reducers/005-env-tests-integration/{description.json,graph-metadata.json}` (does it list 002 as a dependency/child?).
4. `005-learning-feedback-reducers/001-aggregator/graph-metadata.json` (does it reference 002 as a downstream?).
5. Check the 027 PARENT `graph-metadata.json` / `description.json` / `context-index.md` for any 002-coco child reference.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-074-NN]` + `file:line`. Cover every structural reference to 002-coco that must be removed/renumbered, and whether remaining children renumber (003→002 etc.) or stay numbered with a gap.

### STRUCTURAL_EDIT_LIST
`file | what to change | (renumber? / remove edge? / fix count?)`

### RENUMBER_DECISION
Recommend: renumber 003/004/005 → 002/003/004 (closing the gap) OR keep numbering with 002 removed (gap). Justify per spec-folder-naming convention (NEVER delete+recreate; renames via git mv).

### VERDICT
008 structural = {edits enumerated} + renumber recommendation.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
