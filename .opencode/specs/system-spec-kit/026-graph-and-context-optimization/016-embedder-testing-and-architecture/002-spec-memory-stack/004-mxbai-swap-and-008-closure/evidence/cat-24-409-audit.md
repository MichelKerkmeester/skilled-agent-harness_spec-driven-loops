# cat-24/409 Fixture Fairness Audit

## Verdict

**BROKEN -- fixture and corpus hygiene need surgery before a reranker gate.**

cat-24/409 is not broken by absent rows or missing embeddings: the 10 expected source memories from the reused 008/409 sample all still exist in the active Memory MCP DB and all have `embedding_status=success`.

It is broken as a fairness gate because **5 of the 10 expected ids are orphaned indexed rows whose `file_path` no longer exists on disk**. Several have live successor/sibling rows in the current spec tree, so an actually-good retrieval system can legitimately return the live row and still fail the exact-id ground truth. One additional sample uses the single-token trigger `routing`, which is too generic to uniquely identify its expected graph-metadata row.

Under the requested ceiling formula, the realistic max for the fixture as-is is **4/10**: `(10 - 5 stale/orphaned - 0 missing DB rows - 1 ambiguous) / 10`. The 8/10 PASS threshold is therefore not achievable as a fair exact-source test until stale rows are pruned/remapped and the generic trigger is replaced.

## Scenario Predicate

The scenario file does not define a static 10-pair fixture. It defines a runtime sampling predicate:

- sample 10 random rows from the active profile DB where `trigger_phrases IS NOT NULL AND length(trigger_phrases) > 5`;
- for each sampled memory, pick the first trigger phrase;
- query `memory_search({ query: "<trigger phrase>", limit: 10 })`;
- pass if the source memory appears in top-3 for at least 8 of 10 samples.

Evidence:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md:19-25`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md:39-59`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md:80-86`

The current 016/004 reruns reused the same 10 trigger-bearing samples from prior 008 evidence rather than drawing a fresh random sample. The explicit sample ids are visible in later rerun rows, especially the Jina, Nomic, bge-m3, and Snowflake evidence:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:12`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:15`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:18`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:21`

## Test Pair Inventory

Active DB inspected:

`.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`

All rows below are present in `memory_index` with `embedding_status=success`. Filesystem checks distinguish live sources from stale/orphaned indexed rows.

| # | Expected id | Query / first trigger | Expected source | Ground truth status | Difficulty | Current quick `memory_search` rank | Notes |
|---:|---:|---|---|---|---|---:|---|
| 1 | 4460 | `027 phase 004` | `027-xce-research-based-refinement/013-cocoindex-complete-fork/004-docs/checklist.md` | present, embedded | medium | 2 | Specific packet/phase shorthand; enough metadata overlap for a trigger-aware system. |
| 2 | 4493 | `cocoindex coreml` | `014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/plan.md` | stale/orphaned: indexed row exists, file missing | broken | 3 | Live successor rows exist under `014-local-embeddings-migration/043-cocoindex-coreml-ep-investigation/`, so exact id 4493 is stale ground truth. |
| 3 | 4754 | `routing` | `00--ai-systems/001-global-shared/005-routing-review/graph-metadata.json` | present, embedded | adversarial / ambiguous | >5 | Single generic word. Many memories are legitimately about routing, so the expected row is arbitrary without sample provenance. |
| 4 | 7479 | `contextador summary` | `001-research-and-baseline/003-contextador/implementation-summary.md` | present, embedded | easy | 1 | Exact title/spec overlap. |
| 5 | 4437 | `040 checklist` | `014-local-llama-cpp/040-v-rule-cross-spec-overreach/checklist.md` | stale/orphaned: indexed row exists, file missing | broken | 1 | Live/current row exists as id 5143 under `014-local-embeddings-migration/040-v-rule-cross-spec-overreach/checklist.md`; exact id 4437 is stale. |
| 6 | 9326 | `020 mcp namespace operational sweep` | archived `007-034-mcp-namespace-operational-sweep/spec.md` | present, embedded | medium | 4 | Correct source is archived and has close sibling rows; top-3 may be sensitive to sibling dedup/reassembly. |
| 7 | 4400 | `template consolidation decision` | `008-template-levels/001-template-consolidation-investigation/decision-record.md` | stale/orphaned: indexed row exists, file missing | broken | 3 | Live/current equivalent exists as id 8048 under `008-template-levels/001-consolidation-investigation/decision-record.md`; exact id 4400 is stale. |
| 8 | 687 | `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/014-phase-parent-documentation` | `014-phase-parent-documentation/description.json` | stale/orphaned: indexed row exists, file missing | broken | 1 | Current phase-parent docs live under `000-release-cleanup/003-cleanup/009-phase-parent-documentation/...`; exact id 687 points at a removed path. |
| 9 | 7183 | `037/003-testing-playbook-trio resource map` | `003-testing-playbook-trio/resource-map.md` | present, embedded | easy | 1 | Exact title/spec overlap. |
| 10 | 1534 | `FIX-010-v2` | `005-code-graph/010-fix-iteration-quality-meta-research/tasks.md` | stale/orphaned: indexed row exists, file missing | broken | 2 | Current packet is `005-code-graph/009-fix-iteration-quality-meta-research`; exact id 1534 points at a removed/renumbered path. |

Difficulty distribution:

- easy: 3/10
- medium: 2/10
- adversarial / ambiguous: 1/10
- stale/orphaned exact source ids: 5/10
- missing DB rows: 0/10
- broken expected source for current filesystem corpus: 5/10

This is not a clean embedder-quality fixture. The dense-only failures are confounded by stale exact-id ground truth and by at least one underspecified trigger phrase.

## Retrieval Evidence

016/004 already measured the same sample across five pure dense swaps:

| Embedder | 409 top-3 recall | Evidence |
|---|---:|---|
| `embeddinggemma-300m` baseline | 1/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/embedder-comparison.csv:2` |
| `mxbai-embed-large-v1` | 2/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:9` |
| `jina-embeddings-v3` | 4/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:12` |
| `nomic-embed-text-v1.5` | 5/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:15` |
| `bge-m3` | 2/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:18` |
| `snowflake-arctic-embed-l-v2.0` | 1/10 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-mxbai-swap-and-008-closure/evidence/cat-24-rerun.jsonl:21` |

Current audit spot-check with `memory_search(..., profile: "quick", rerank: false)` found 9/10 expected ids in the top-5. That does **not** rescue the fixture: several of those hits are stale rows pointing at missing files. The system can currently return orphaned records, which is a corpus hygiene defect, not evidence that exact-id ground truth is fair.

## Threshold Provenance

The 8/10 threshold was authored in commit:

`837f7e0d82 test(playbook,014/028): add 24--local-llm-query-intelligence operator scenarios`

The commit message describes 10 operator-driven scenarios for the post-014 local-LLM stack and says they complement mechanical tests with human-verifiable pass/fail criteria. It does not cite a known-good system achieving 8/10 on cat-24/409. The threshold appears aspirational/operator-defined, not empirically calibrated.

Relevant commit evidence:

- `git log --all --oneline -- .opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md` returns only `837f7e0d82`.
- `git show --format=fuller --no-patch 837f7e0d82` contains no benchmark calibration note.
- Current scenario lines encode the threshold directly: `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md:23-25`.

## Realistic Max Score

Formula requested:

`(10 - broken - missing - ambiguous) / 10`

Counts:

- stale/orphaned expected source ids: 5 (`4493`, `4437`, `4400`, `687`, `1534`)
- missing DB rows: 0
- ambiguous source/query pair: 1 (`4754` / `routing`)

Realistic max as a blind exact-source benchmark: **4/10**.

If the evaluator is allowed to return stale DB rows even when their files are gone, the MCP can still find some expected ids. That is not a fair user-facing retrieval ceiling; it rewards returning records that no longer map to readable source files.

The 8/10 pass threshold is therefore **not** achievable as a fair gate until stale exact ids are repaired.

## Recommended 409 Action

Repair corpus and fixture ground truth before using 409 as a hard closure gate:

1. Prune or remap orphaned `memory_index` rows whose `file_path` no longer exists.
2. Replace stale expected ids with live source ids where equivalent content exists, for example `4437 -> 5143`, `4400 -> 8048`, and `1534 -> 7636/7639/4356` depending on the intended document type.
3. Make the 409 sampler reject trigger phrases below a specificity threshold, for example single-token generic triggers like `routing`, `review`, `spec`, `plan`, `tasks`, `checklist`, `handover`.
4. Record the sampled ids and trigger phrases as a deterministic evidence fixture for reruns, rather than relying on `ORDER BY random()` without a seed.
5. Then test reranking or trigger-lane weighting. A cross-encoder can help, but the strongest signal for 409 is probably exact trigger metadata plus current-file liveness, not dense semantic similarity alone.

## cat-24 Surface Fairness

### 402 -- Synonymy across vocabularies

Verdict: **BROKEN / stale ground truth risk.**

The scenario expects four query pairs to achieve >=60% top-5 Jaccard for at least 3 of 4 pairs, and it names canonical targets for memory pair A/B and CocoIndex pair C/D:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/402-synonymy-across-vocabularies.md:21-25`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/402-synonymy-across-vocabularies.md:41-63`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/402-synonymy-across-vocabularies.md:68-73`

The memory ground truth is stale or under-specified:

- `references/memory/memory_system.md` documents six importance tiers and constitutional always-surface behavior, but it does not define "Tier 1 ephemeral memories" as the scenario expects. See `.opencode/skills/system-spec-kit/references/memory/memory_system.md:62-89`.
- Exact `Tier 1 ephemeral memories` and `importance tier 5` content appears in test fixtures, not in live canonical memory docs: `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json`.
- Current `memory_search` for `Tier 1 ephemeral memories` and `short-term temporary memories` returned weak, noncanonical results with no useful overlap during this audit.

The 0% top-5 Jaccard anomaly across Nomic/Jina/bge-m3 is therefore not strong evidence against those embedders. The pair definitions are asking for overlap around concepts that are not consistently represented in the current corpus.

### 408 -- Compound concept synthesis

Verdict: **STRETCH / hard but partly fair.**

The expected constituent set is explicit:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/408-compound-concept-synthesis.md:23-29`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/408-compound-concept-synthesis.md:43-56`

The sources mostly exist:

- `shared/embeddings/factory.ts` owns provider resolution and auto-migration support. See `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:66-87` and `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:138-220`.
- `mcp_server/context-server.ts` runs auto-migration and logs fallback re-resolution on failure. See `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1554-1557`.
- `014-local-embeddings-migration/018-llama-cpp-auto-migration/implementation-summary.md` documents the startup auto-migration behavior and fallback. See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration/implementation-summary.md:51`.

The fairness problem is duplication and source-set rigidity. CocoIndex often returns mirrored `.codex`, `.gemini`, or generated declaration variants of the same implementation, so path-level scoring can mark semantically correct hits as misses. The scenario is still useful as a breadth stress test, but its PASS bar should dedupe equivalent mirrored files before applying the "2 of 4 in top-3, 3 of 4 in top-5" rule.

## Final Direction

For 409: do not spend another cycle on same-shape dense embedder swaps or reranker-only work. First fix stale/orphaned memory rows and the ambiguous trigger sampling rule, then test reranking or trigger-lane weighting.

For cat-24 overall: repair 402 ground truth before treating its 0% Jaccard as model evidence, and adjust 408 to dedupe equivalent mirrored implementation paths.
