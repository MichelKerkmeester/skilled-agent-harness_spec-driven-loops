# Codex Pass Report — 016/004/013-018 Arc + Nomic Promotion

## Executive Summary

**Verdict**: FAIL

Codex found no P0, but found **8 new P1** and **10 new P2** findings beyond Devin's report. The key delta is that several issues are production-path defects, not only documentation debt:

- Fresh daemon-backed installs still default to `google/embeddinggemma-300m`, so the nomic promotion is entrypoint-dependent.
- The published nomic reproduction path pins the phase-2 smoke harness back to BGE.
- The rerank matrix analyzer accepts failed run JSON and renders it as benchmark output.
- Hybrid heuristic boosts can be larger than the entire calibrated RRF score.

Focused test command passed:

```text
36 passed in 0.59s
```

Sequential-thinking MCP caveat: the required MCP tool was attempted, but the runtime returned `user cancelled MCP tool call`. Each iteration records the requested five-point preflight manually.

## Cross-Reference Matrix

| Devin finding | Codex status | Codex note |
|---|---|---|
| P1-001 Query expansion shipped opt-in without root cause | EXPANDED | Serial dense fanout prioritizes identifier spellings over synonyms; plausible regression mechanism. |
| P2 Tree-sitter chunker broad fallback | CONFIRMED | Smoke-tested malformed/unicode/comment-only inputs; fail-soft works, observability gap remains. |
| P2 Path canonicalization duplication | CONFIRMED | No additional severity. |
| P2 RRF semantic consistency validation | EXPANDED | Production env alias mismatch and score-scale coupling are P1-level. |
| P2 Reranker path-class env parsing | EXPANDED | Parsed config fields are bypassed; Jina also composes with BGE-era factors. |
| P2 Default embedder consistency | EXPANDED | Config and registry agree, but daemon `default_user_settings()` still defaults to EmbeddingGemma. |
| P2 JSON env length limits | CONFIRMED | No additional severity. |
| P2 Path prefix malicious patterns | CONFIRMED | No additional severity. |
| P2 FTS5 quote escaping | CONFIRMED | No additional severity. |
| P2 Query expansion synonym cap | EXPANDED | Dense variant ordering can miss synonym signal while still paying extra embeddings. |
| P2 Bench harness JSON validation | EXPANDED | Matrix analyzer accepts failed run JSON as valid benchmark input. |
| P2 Shell bench env validation | EXPANDED | Reproduction docs pass env overrides as positional args. |
| P2 ADRs filed under embedder bake-off | CONFIRMED | No additional severity. |
| P2 ADR numbering gap | CONFIRMED | No additional severity. |
| P2 Nomic promotion lacks ADR | EXPANDED | Promotion evidence is not cleanly reproducible and daemon default was missed. |
| P2 018 Lane A bug not tracked | EXPANDED | Evidence uses/mentions `COCOINDEX_RERANK_ENABLED`, while runtime reads `COCOINDEX_RERANK`. |
| P2 Cross-packet dependencies not documented | CONFIRMED | No additional severity. |
| P2 Path-class boost agnosticism | EXPANDED | Boosts are larger than RRF scale in hybrid ranking and can apply to Jina scores. |
| P2 Jina adapter throwaway header | EXPANDED | Adapter also has unvalidated env parsing in production default path. |
| P2 RRF lock BGE-only | EXPANDED | Seven-cell evidence plus score-scale coupling weaken the lock. |
| P2 Opt-in BGE not post-018 tested | CONFIRMED | Also default Jina path lacks real-adapter tests. |
| P2 Dimension migration docs missing | CONFIRMED | No additional severity. |

## New Findings Registry

### P1 Findings

#### C-P1-001 — documented RRF rollback/env names do not affect production
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:561-578  
Production reads `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, and `COCOINDEX_HYBRID_RRF_K`; the 017 packet documents `COCOINDEX_RRF_*` rollback names. Operators following the packet can set no-op rollback vars.

#### C-P1-002 — invalid Jina max-doc-char env can crash default reranker path
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:145-153  
`int(os.environ.get("COCOINDEX_RERANK_JINA_MAX_DOC_CHARS", ...))` runs outside the protected model call and bypasses bounded config parsing.

#### C-P1-003 — operator docs contradict shipped default retrieval stack
**File**: `.opencode/skills/mcp-coco-index/README.md`:69-91  
Docs still describe hybrid/rerank as default-off and the reranker as GTE/BGE in places, while production defaults are hybrid on, rerank on, Jina reranker, and nomic embedder.

#### C-P1-004 — fresh daemon settings still default to EmbeddingGemma
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py`:115-121  
`default_user_settings()` writes `google/embeddinggemma-300m`; `server.py` creates that settings file on first run, and `daemon.py` builds the embedder from settings.

#### C-P1-005 — index failures can be reported as successful
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`:392-448  
`_run_index()` catches all exceptions and does not re-raise; `update_index()` then yields `IndexResponse(success=True)`.

#### C-P1-006 — nomic reproduction path is contradicted by the phase-2 smoke harness
**File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`:56-59  
The benchmark report instructs a nomic reindex, but the smoke script unconditionally exports `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`.

#### C-P1-007 — rerank matrix analyzer accepts failed run JSON as valid input
**File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`:57-66  
The analyzer loads all `lane*-iter*.json` files without checking `success`. It rendered a normal report from checked-in `success=false` evidence.

#### C-P1-008 — hybrid heuristic boosts can dominate calibrated RRF scores
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:473-487  
With `K=60,V=0.9,F=0.5`, a rank-1 two-lane RRF score is about `0.023`; heuristic boosts add `0.05` and `0.10`, swamping the calibrated RRF layer.

### P2 Findings

- C-P2-001 Path-class boost has two configuration authorities.
- C-P2-002 Reranker tests mock dispatch but miss real default-adapter failure modes.
- C-P2-003 Query expansion serially embeds up to six variants, mostly identifier spellings.
- C-P2-004 RRF future-proof harness is broader than the seven-cell evidence used to lock defaults.
- C-P2-005 Nomic registry guidance still calls the default an alternative.
- C-P2-006 Jina adapter still applies BGE-era path-class boost when enabled.
- C-P2-007 Benchmark lane switching stops the shared daemon without a lock.
- C-P2-008 Daemon lifetime lock is released immediately after listener creation.
- C-P2-009 Benchmark reproduction command passes env overrides as positional args.
- C-P2-010 Promoted benchmark docs rely on n=1 data while policy says not to.

## Dimension Coverage

| Dimension | Codex coverage |
|---|---|
| architecture | covered |
| code-quality | covered |
| maintainability | covered |
| tests | covered |
| documentation | covered |
| performance | covered |
| reproducibility | covered |
| embedder-agnosticism | covered |
| reranker-agnosticism | covered |
| correctness/security/traceability | adversarial follow-up only; Devin's findings cross-verified |

## Architectural Observations

The main architectural problem is split configuration authority. Defaults exist in `config.py`, `registered_embedders.py`, `settings.py`, docs, harness scripts, and daemon/user settings. The nomic promotion touched the config/registry path but not fresh daemon settings, so the system no longer has one reliable answer to "what is the default embedder?"

The second problem is score-scale coupling. RRF calibration is treated as a tuned retrieval layer, but fixed path/canonical boosts are added afterward at a larger numeric scale. That makes the empirical RRF conclusion less trustworthy.

The third problem is benchmark artifact trust. The harness and analyzer can produce convincing markdown even when the underlying run failed or used a different embedder than the report implies.

## Recommended Merge

Merge Devin's original P1 with Codex's new P1s into a single remediation gate:

1. Fix default authority first: settings default, config default, registry default, docs, and tests must derive from the same source.
2. Repair benchmark validity: make embedder explicit, reject failed runs, fix reproduction commands, and rerun nomic/BGE/Jina evidence from clean states.
3. Revisit RRF/path heuristics after score-scale normalization.
4. Then resolve Devin's query-expansion root-cause P1 with fresh measurements.

## Caveats

- Source files were not modified.
- Sequential-thinking MCP could not be executed because the runtime cancelled the tool call.
- I did not run heavyweight benchmark reruns; validation was code inspection plus focused pytest and analyzer smoke.
- Code graph was unavailable; search was direct file reads/rg plus sidecar review.

## STATUS=FAIL

No P0 was found, but the P1 set includes production defaults, benchmark validity, and rollback/config-contract defects. This should not be considered ready to merge as-is.
