# Iteration 061 — CocoIndex purge: the 008 reducer family

**Focus:** Confirm `008/002-coco-rerank-consumer` is wholly removable dead scope; enumerate every coco reference across the 008-learning-feedback-reducers family with REMOVE/REWRITE classification.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.74.

## Findings

- **[F-061-01]** `008/002-coco-rerank-consumer` is **wholly removable dead scope** — it requires `cocoindex_code/feedback_reducer.py`, `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl`, `_ranked_result()`, the `SPECKIT_COCOINDEX_FEEDBACK_RERANK` flag, and the (also-coco) `028/006-coco-intent-steering`. None of that substrate survives the deprecation. `008-learning-feedback-reducers/002-coco-rerank-consumer/spec.md:57,59,61,62,103`
- **[F-061-02]** Parent `008/spec.md` carries coco in its description, soft-deps, phase map, execution order, and consumer criteria → **REWRITE** to drop `002` + `028/006-coco-intent-steering`, leaving aggregator + causal/retention consumers. `008-learning-feedback-reducers/spec.md:3,38,60,75,89,91`
- **[F-061-03]** `001-aggregator` **survives** — real scope is TS `batch-learning.ts`/`feedback_events`; its coco mentions are stale out-of-scope + related-doc links → REMOVE the out-of-scope coco line, REWRITE related docs to surviving consumers. `008-learning-feedback-reducers/001-aggregator/spec.md:50,61,68,155`
- **[F-061-04]** `003-causal-reducer` **survives** — only coco ref is an out-of-scope phrase → REMOVE "Coco rerank learning", keep the deferred session-trace causal reducer. `008-learning-feedback-reducers/003-causal-reducer/spec.md:57,64,69`
- **[F-061-05]** `004-retention-reducer` **survives** — coco phrase bundled with causal-edge inference in Out-of-Scope → REWRITE to keep "causal-edge inference", strip "Coco rerank". `008-learning-feedback-reducers/004-retention-reducer/spec.md:57,63,68`
- **[F-061-06]** `005-env-tests-integration` → **REWRITE** from `001,002,003,004` / "three consumers" to `001,003,004` / two consumers; REMOVE `SPECKIT_COCOINDEX_FEEDBACK_RERANK` docs + the `002-coco` related-doc link. `008-learning-feedback-reducers/005-env-tests-integration/spec.md:38,57,60,64,79,148`
- **[F-061-07]** Post-removal topology is coherent: surviving consumers `003-causal-reducer` + `004-retention-reducer`, both depending on `001-aggregator`; closeout (`005`) depends on `001,003,004` only. `008-learning-feedback-reducers/spec.md:61,62`

## Coco reference table (REMOVE/REWRITE)

| file | line | snippet | fate | coco-free equivalent |
|---|---|---|---|---|
| 008/spec.md | 3 | coco rerank consumer | REWRITE | description = aggregator + causal + retention + env/tests |
| 008/spec.md | 38 | 028/006-coco-intent-steering | REMOVE | — |
| 008/spec.md | 60 | 002-coco / feedback_reducer.py | REMOVE | — |
| 008/spec.md | 75 | 002-coco-rerank-consumer | REWRITE | exec order runs 003+004 after 001 |
| 008/spec.md | 89 | Coco rerank parity/lift evidence | REWRITE | criteria = causal-edge safety + retention audit only |
| 008/002-coco-rerank-consumer/** | (whole packet) | spec/plan/tasks/checklist | REMOVE | delete the sub-phase folder |
| 008/001-aggregator/spec.md | 68 | Python coco rerank persistence | REMOVE | — |
| 008/001-aggregator/spec.md | 155 | ../002-coco-rerank-consumer/ | REWRITE | related docs = 003-causal + 004-retention |
| 008/003-causal-reducer/spec.md | 69 | Coco rerank learning | REMOVE | — |
| 008/004-retention-reducer/spec.md | 68 | Coco rerank or causal-edge inference | REWRITE | "Causal-edge inference" |
| 008/005-env-tests-integration/spec.md | 38 | 002-coco-rerank-consumer | REWRITE | deps = 001,003,004 |
| 008/005-env-tests-integration/spec.md | 57 | SPECKIT_COCOINDEX_FEEDBACK_RERANK | REMOVE | — |
| 008/005-env-tests-integration/spec.md | 148 | ../002-coco-rerank-consumer/spec.md | REMOVE | — |

(Full per-line list incl. 002's plan/tasks/checklist captured in `prompts/iteration-061.out`.)

## Ruled out (negative knowledge)
- `001-aggregator` needs no coco replacement — in-scope impl is existing TS `batch-learning.ts`/`feedback_events`, not Python/coco substrate.
- `003`/`004` reducers have no coco substrate dependency — coco appears only in out-of-scope text.
- `002` has **no viable coco-free rewrite path** inside its own packet — plan/tasks/checklist are all bound to Python rerank / the COCO flag / `cocoindex_code/`. Hence DELETE, not rewrite.

## Verdict contribution
**008 = REMOVE (sub-phase 002) + REWRITE (family).** Delete `002-coco-rerank-consumer/` entirely; rewrite parent + `001/003/004/005` to the coco-free `001 → {003,004} → 005` topology.
