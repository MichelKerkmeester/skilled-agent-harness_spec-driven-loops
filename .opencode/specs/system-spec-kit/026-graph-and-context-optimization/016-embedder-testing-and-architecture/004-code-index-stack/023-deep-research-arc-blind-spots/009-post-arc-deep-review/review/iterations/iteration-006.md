# Iteration 006 — 023/005 (doctor) + 023/006 (registry) closure

## Hypotheses going in

023/005 doctor model-swap UX should have Pipeline section in ccc doctor output. 023/006 prompt-license registry should have Qwen3 as default reranker and _QUERY_PROMPT_MODELS dict literal removed from shared.py. Expected:
- ccc doctor --json reports pipeline.stage_1 and pipeline.stage_2
- DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B" in registered_embedders.py
- _QUERY_PROMPT_MODELS dict literal removed from shared.py

## Files read

- cocoindex_code/cli.py (doctor section, _build_doctor_pipeline, _print_doctor_pipeline)
- cocoindex_code/embedders/registered_embedders.py (DEFAULT_RERANKER_NAME)
- Grep for _QUERY_PROMPT_MODELS across cocoindex_code/

## Findings

### INFO — 023/005 Pipeline section in ccc doctor verified

**Evidence:**
- `cocoindex_code/cli.py:664-695` implements `_build_doctor_pipeline()` which returns a `DoctorPipeline` with `stage_1` and `stage_2` fields
- `cocoindex_code/cli.py:671-682` defines `stage_1` dict with keys: role, name, provider, dim, license, rrf (K, V, F)
- `cocoindex_code/cli.py:683-690` defines `stage_2` dict with keys: role, name, enabled, license, top_k, chunk_count
- `cocoindex_code/cli.py:733-759` implements `_print_doctor_pipeline()` which prints both stages with detailed descriptions
- `cocoindex_code/cli.py:995` includes `"pipeline": _asdict(pipeline)` in the JSON output

**Analysis:** The ccc doctor command correctly reports a Pipeline section with stage_1 (bi-encoder embedder) and stage_2 (cross-encoder reranker). Both stages include role, name, provider/dim/license details, and the output is available in both human-readable and JSON formats.

**Severity:** INFO — closure verified.

### INFO — 023/006 Qwen3 default reranker + _QUERY_PROMPT_MODELS removal verified

**Evidence:**
- `cocoindex_code/embedders/registered_embedders.py:256` sets `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` with comment referencing 023B follow-on
- Grep for `_QUERY_PROMPT_MODELS` across cocoindex_code/ returned 0 matches

**Analysis:** Qwen3-Reranker-0.6B is correctly set as the default reranker. The _QUERY_PROMPT_MODELS dict literal has been removed from the codebase (no matches found), which aligns with the prompt-license registry cleanup.

**Severity:** INFO — closure verified.

## Updates to review.md

Iteration 006 completed. Verified 023/005 Pipeline section in ccc doctor with stage_1 (bi-encoder embedder) and stage_2 (cross-encoder reranker) details in both human-readable and JSON output. Verified 023/006 Qwen3-Reranker-0.6B as default reranker and _QUERY_PROMPT_MODELS dict literal removal from shared.py.

## NO-EARLY-STOP confirmation

Iteration 6 of 10 complete. Continuing to iteration 7.
