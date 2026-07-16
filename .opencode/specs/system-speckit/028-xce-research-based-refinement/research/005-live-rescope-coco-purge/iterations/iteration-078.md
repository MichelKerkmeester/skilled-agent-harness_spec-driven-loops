# Iteration 078 — 028 number REUSED (028-026-program-research); all 027 028/* refs stale: coco DEAD->REMOVE, code-graph MOVED->repoint/evidence-gate; nothing blocks

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.78. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-078.out`

### FINDINGS
[F-078-01] Actual `028` today is only `028-026-program-research`, in both roots: `.opencode/specs/system-spec-kit/028-026-program-research` and `specs/system-spec-kit/028-026-program-research`. Title in both is `Feature Specification: 026 Program Research`. `.opencode/.../spec.md:20`, `specs/.../spec.md:20`, existence.

[F-078-02] 027’s own split index says old Code Graph/CocoIndex phases were extracted to sibling `028-code-graph-and-cocoindex`, not today’s reused numeric `028`; mapped old children include `001`-`004` code-graph and `005`-`008` coco. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:3`, `:9-16`, `:19`.

[F-078-03] Code-graph targets `028/001`, `028/002`, `028/003`, `028/004` are broken as current `028/*` paths. Concrete old equivalents exist under `.opencode/specs/z_future/code-graph-and-cocoindex/{001,002,003,004}...`; for 027 gates, prefer evidence-gate wording over coupling to reused `028`. existence.

[F-078-04] Coco targets `028/005-cocoindex-complete-fork`, `028/006-coco-intent-steering`, and `028/008-coco-memory-context-extras` are dead coco scope. Remove as dependencies or historical scaffold notes. `specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:248`, `.../005-learning-feedback-reducers/spec.md:38`.

[F-078-05] Some 007 docs already reconciled `028/004-code-graph-adoption-eval` correctly as “equivalent shadow-eval evidence,” so the remaining action is consistency cleanup, not a blocker. `specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:241`, `.../spec.md:76`, `.../resource-map.md:142`.

### DEP_RECONCILE_TABLE
`027 ref (file:line) | 028 target | status | action`

`002-memory-write-safety/spec.md:64` | `028/001-code-graph-hld-lld` | MOVED | REPOINT-to `.opencode/specs/z_future/code-graph-and-cocoindex/001-code-graph-hld-lld` or active `system-code-graph` follow-up.

`002-memory-write-safety/spec.md:64` | `028/002-code-graph-trace` | MOVED | REPOINT-to `.opencode/specs/z_future/code-graph-and-cocoindex/002-code-graph-trace` or active `system-code-graph` follow-up.

`002-memory-write-safety/spec.md:64` | `028/003-code-graph-impact-analysis` | MOVED | REPOINT-to `.opencode/specs/z_future/code-graph-and-cocoindex/003-code-graph-impact-analysis` or active `system-code-graph` follow-up.

`004-semantic-trigger-fallback/plan.md:241` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate; line already states dependency is evidence, not folder.

`004-semantic-trigger-fallback/spec.md:76` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate; line already states equivalent shadow-eval evidence.

`004-semantic-trigger-fallback/resource-map.md:142` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate; line already states old folder does not exist.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:143` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:238` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:262` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:263` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:272` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate.

`005-learning-feedback-reducers/spec.md:38` | `028/004-code-graph-adoption-eval` | MOVED | replace-with-evidence-gate; current wording mostly does this.

`004-semantic-trigger-fallback/decision-record.md:220` | `028/005-cocoindex-complete-fork` | DEAD-coco | REMOVE historical scaffold note.

`005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:238` | `028/005-cocoindex-complete-fork` | DEAD-coco | REMOVE historical scaffold note.

`005-learning-feedback-reducers/002-coco-rerank-consumer/implementation-summary.md:87` | `028/006-coco-intent-steering` | DEAD-coco | REMOVE; use local `general` fallback only if non-coco scope remains.

`005-learning-feedback-reducers/002-coco-rerank-consumer/plan.md:98` | `028/006-coco-intent-steering` | DEAD-coco | REMOVE.

`005-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:103` | `028/006-coco-intent-steering` | DEAD-coco | REMOVE.

`005-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:134` | `028/006-coco-intent-steering` | DEAD-coco | REMOVE.

`005-learning-feedback-reducers/spec.md:38` | `028/006-coco-intent-steering` | DEAD-coco | REMOVE.

`004-semantic-trigger-fallback/plan.md:248` | `028/008-coco-memory-context-extras` | DEAD-coco | REMOVE or rewrite as generic future downstream curator evidence, not a named dep.

### VERDICT
028-coupling = {current-028: `028-026-program-research` only; old-code-graph-028: MOVED/stale shorthand; coco-028: DEAD; eval gates: replaceable by local shadow/paired-comparison evidence}.

Net effect on 027: nothing blocks. All `028/*` deps are removable, repointable to non-028 code-graph locations, or replaceable with equivalent local evidence gates.

### RULED_OUT
- Current `028` as coco/code-graph home: ruled out by existence check; only `028-026-program-research` exists.
- Hard dependency on `028/004-code-graph-adoption-eval`: ruled out; current 007 docs already frame this as evidence, not folder coupling.
- Keeping coco soft deps: ruled out by CocoIndex deprecation and dead coco child targets.

### METRICS
newInfoRatio: 0.78

novelty: Confirms numeric `028` has been reused and all old `028/*` 027 links are stale, dead, or evidence-gate replaceable.

status: complete

sources: existence `.opencode/specs/system-spec-kit/028-026-program-research`, existence `specs/system-spec-kit/028-026-program-research`, `.opencode/specs/system-spec-kit/028-026-program-research/spec.md:20`, `specs/system-spec-kit/028-026-program-research/spec.md:20`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:3`, `:9-16`, `:19`, `specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety/spec.md:64`, `004-semantic-trigger-fallback/plan.md:241`, `:248`, `004-semantic-trigger-fallback/spec.md:76`, `004-semantic-trigger-fallback/decision-record.md:220`, `004-semantic-trigger-fallback/resource-map.md:142`, `005-learning-feedback-reducers/spec.md:38`, `005-learning-feedback-reducers/001-aggregator/legacy-decision-record.md:143`, `:238`, `:262`, `:263`, `:272`, `005-learning-feedback-reducers/002-coco-rerank-consumer/implementation-summary.md:87`, `plan.md:98`, `spec.md:103`, `spec.md:134`, existence `.opencode/specs/z_future/code-graph-and-cocoindex/001-code-graph-hld-lld/spec.md`, existence `.opencode/specs/z_future/code-graph-and-cocoindex/002-code-graph-trace/spec.md`, existence `.opencode/specs/z_future/code-graph-and-cocoindex/003-code-graph-impact-analysis/spec.md`, existence `.opencode/specs/z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/spec.md`.
