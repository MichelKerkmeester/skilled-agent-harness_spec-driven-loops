DEEP-RESEARCH

# Deep-Research Iteration 061 — CocoIndex purge: the 008 reducer family

You are a LEAF deep-research analyst. READ-ONLY iteration. Do NOT dispatch sub-agents. Do NOT modify any source or spec files. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — this is a read-only analysis, you write NOTHING).

## CONTEXT (authoritative constraints)
- CocoIndex is DEPRECATED. ALL coco-derived scope must be removed from 027. The `mcp-coco-index` skill and `cocoindex_code/` substrate no longer exist as a target.
- 026 graph-and-context-optimization is CLOSED/Complete. Live embedder is ollama `nomic-embed-text-v1.5` 768-dim (NOT Voyage-4/1024d).
- This run complements the 2026-06-05 relevance-audit (which predates the coco deprecation). Go DEEPER than that audit.

## FOCUS — answer only this
Enumerate every CocoIndex reference across the **008-learning-feedback-reducers** phase family and decide its fate.

Read in this order (repo root = `specs/system-spec-kit/027-xce-research-based-refinement/`):
1. `008-learning-feedback-reducers/spec.md`
2. `008-learning-feedback-reducers/002-coco-rerank-consumer/{spec.md,plan.md,tasks.md,checklist.md}`
3. `008-learning-feedback-reducers/001-aggregator/spec.md`
4. `008-learning-feedback-reducers/003-causal-reducer/spec.md`
5. `008-learning-feedback-reducers/004-retention-reducer/spec.md`
6. `008-learning-feedback-reducers/005-env-tests-integration/spec.md`

## DELIVER (return as plain text — the orchestrator writes the artifacts)
Return EXACTLY these sections:

### FINDINGS
3-7 findings. Each: `[F-061-NN] <claim>` + `file:line` citation. Cover:
- Is `008/002-coco-rerank-consumer` wholly removable dead scope? (cite the coco-dependent substrate it requires)
- Every coco reference in the other 008 children, each classified **REMOVE** (coco-only, delete) or **REWRITE** (keep the idea, strip coco — say what the coco-free equivalent is).
- Does removing 002-coco leave the 008 aggregator→consumers shape coherent? Which consumers survive?

### COCO_REFERENCE_TABLE
One row per coco reference found: `file | line | snippet | REMOVE|REWRITE | coco-free equivalent (if REWRITE)`

### RULED_OUT
What you checked that did NOT yield coco scope (negative knowledge), 1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0 — how much is NEW vs the known "002-coco is dead" baseline>
novelty: <1 sentence justifying the ratio>
status: complete
sources: <comma-separated file:line list you actually cited>

Be terse and evidence-dense. No preamble.
