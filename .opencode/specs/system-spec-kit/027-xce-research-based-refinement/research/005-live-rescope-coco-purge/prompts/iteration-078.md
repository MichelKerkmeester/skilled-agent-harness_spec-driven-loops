DEEP-RESEARCH

# Deep-Research Iteration 078 — 028 status after CocoIndex deprecation; 027 soft-dep breakage

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line` / existence.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 027 docs reference several `028/*` folders as the home for coco + code-graph-adoption work: `028/004-code-graph-adoption-eval` (007 soft-dep), `028/006-coco-intent-steering` (008/002 + 008 parent soft-dep), `028/008-coco-memory-context-extras` (007 plan), `028/005-cocoindex-complete-fork` (007 decision-record historical).
- CocoIndex is DEPRECATED. The coco-028 children are dead.
- BUT a `028` number may now be reused: a concurrent process referenced `.opencode/specs/system-spec-kit/028-026-program-research/`. So "028" today may NOT be the coco home the 027 docs assume.

## FOCUS — answer only this
Determine the ACTUAL state of `028` today and reconcile every 027 soft-dependency on a `028/*` path.
Do:
1. `ls -d .opencode/specs/system-spec-kit/028* specs/system-spec-kit/028* 2>/dev/null` — what 028 folders actually exist?
2. For each existing 028 folder, one-line what it is (read its spec.md title only).
3. List every 027 reference to a `028/*` path (grep, excluding research/): `grep -rn "028/" specs/system-spec-kit/027-xce-research-based-refinement --include=*.md --include=*.json | grep -v /research/`
4. For each, decide: is the referenced 028 child (a) coco-dead → REMOVE the dep, (b) code-graph work that moved to `system-code-graph`/elsewhere → REPOINT, or (c) replace with "equivalent local evidence gate".

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-078-NN]`. Cover: what 028 actually is now; each 027→028 soft-dep and whether it's broken/dead/repointable.

### DEP_RECONCILE_TABLE
`027 ref (file:line) | 028 target | status (DEAD-coco / MOVED / NONEXISTENT) | action (REMOVE / REPOINT-to-X / replace-with-evidence-gate)`

### VERDICT
028-coupling = {…} + the net effect on 027 (does anything BLOCK, or are all deps removable/replaceable?).

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line / existence list>

Terse, evidence-dense, no preamble.
