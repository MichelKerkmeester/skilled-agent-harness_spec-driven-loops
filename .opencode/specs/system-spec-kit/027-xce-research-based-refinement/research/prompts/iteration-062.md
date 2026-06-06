DEEP-RESEARCH

# Deep-Research Iteration 062 — CocoIndex purge: the 002/003/004/006 specs

You are a LEAF deep-research analyst. READ-ONLY iteration. Do NOT dispatch sub-agents. Do NOT modify any file. Max ~12 tool calls. Cite every claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, you write NOTHING).

## CONTEXT
- CocoIndex is DEPRECATED. ALL coco-derived scope must be removed from 027. `mcp-coco-index` / `cocoindex_code/` / `028/006-coco-intent-steering` no longer exist as targets.
- 026 is CLOSED. Live embedder is ollama nomic 768d. Iteration 061 already covered the 008 family — do NOT re-cover 008.

## FOCUS — answer only this
Enumerate every CocoIndex reference in the NON-008 memory phase specs and classify each. Read:
1. `002-memory-write-safety/spec.md`
2. `003-incremental-index-foundation/spec.md` (+ its `graph-metadata.json`)
3. `004-causal-edge-tombstones/spec.md` (+ its `graph-metadata.json`)
4. `006-write-path-reconciliation/spec.md` (+ its `graph-metadata.json`)
Also grep these four phase folders for `coco` to catch references outside spec.md.

For each reference decide: **REMOVE** (coco-only, delete) or **REWRITE** (keep the idea, strip coco — give the coco-free equivalent). Flag any **coco-only requirement/acceptance-criterion that disappears entirely** (not just a mention) — those are the dangerous ones.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-7 findings `[F-062-NN] <claim>` + `file:line`. Must state, per phase, whether coco is incidental (mention) or structural (a requirement/AC depends on it).

### COCO_REFERENCE_TABLE
`file | line | snippet | REMOVE|REWRITE | coco-free equivalent`

### DISAPPEARING_SCOPE
Any requirement/AC/scope-item that vanishes entirely once coco is removed (with file:line). "None" if none.

### RULED_OUT
1-3 bullets of what you checked that had no coco scope.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
