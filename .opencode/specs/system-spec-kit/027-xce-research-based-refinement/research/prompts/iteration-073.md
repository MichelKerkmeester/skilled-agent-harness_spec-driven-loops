DEEP-RESEARCH

# Deep-Research Iteration 073 — 026-status drift + stale cross-ref sweep in 027

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 026 is now Status: Complete (005 deferred) per `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`.
- 027 parent `spec.md` still says "This refinement builds on the completed 026 track-000 ... The 026 program parent itself remains In Progress for its other in-flight tracks." → STALE.
- Note: 027 lives under `specs/system-spec-kit/...` but many 027 docs cite `.opencode/specs/system-spec-kit/...` paths. Both root families exist in this repo; flag inconsistent self-citations.

## FOCUS — answer only this
Sweep 027 for stale cross-references and status drift (NOT coco — covered by 061/062/067):
1. The 026 'In Progress' claim in 027 spec.md (and any other doc) — should now say 026 Complete.
2. `.opencode/specs/...` vs `specs/...` self-path inconsistency: does 027's own metadata/continuity cite the wrong root? `grep -rn "\.opencode/specs/system-spec-kit/027" specs/system-spec-kit/027-xce-research-based-refinement/*.md specs/system-spec-kit/027-xce-research-based-refinement/*.json | head -30`
3. References to `028` across 027 docs (coco-028 homes, code-graph-adoption-eval, etc.) — `grep -rn "028" specs/system-spec-kit/027-xce-research-based-refinement --include=*.md --include=*.json | grep -v research/ | head -40`
4. Any other obviously stale status/numbering claims in the parent spec.md / description.json / graph-metadata.json / context-index.md / resource-map.md.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-073-NN]` + `file:line`. Cover the 026-status drift, the path-root self-citation drift, and 028 references.

### DRIFT_TABLE
`file | line | stale claim | corrected claim`

### VERDICT
Parent-level drift severity + the specific edits the eventual reconcile pass must make (these go in parent spec.md/context-index.md, NOT inventing implementation).

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
