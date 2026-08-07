---
title: "016/004: mk-spec-memory text-embedder bake-off. jina-v3 + retrieval-rescue layer ships"
description: "6-candidate text-embedder bake-off for mk-spec-memory. No pure dense swap closed cat-24/409. Retrieval-rescue layer (ADR-010/011) lifted Nomic to 8/10 top-3 and Jina v3 to 9/10. ADR-012 selects jina-embeddings-v3 plus rescue layer as the production default. Closes packet 008 cat-24/409 (51/51 FAILs)."
trigger_phrases:
  - "spec memory embedder bake-off"
  - "jina-v3 retrieval rescue ships"
  - "mk-spec-memory embedder shipped"
  - "cat-24/409 closure"
  - "retrieval-rescue layer default-on"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

mk-spec-memory had one outstanding retrieval failure blocking packet 008 closure: cat-24/409 (LLM-made-memory recall) could not reach the 8/10 top-3 threshold. The entry hypothesis was a targeted swap to mxbai-embed-large-v1, but the swap failed immediately due to a provider-tag mapping defect and then a context-length limit. The packet expanded into a 6-candidate bake-off covering mxbai, jina-embeddings-v3, nomic-embed-text-v1.5, bge-m3, snowflake-arctic-embed-l-v2.0 plus the gemma-300m baseline. No pure dense swap closed 409. A retrieval-rescue layer (trigger-lane hardening plus sibling/backfill injection) shipped as ADR-010 and was flipped default-on per ADR-011, lifting Nomic to 8/10 and Jina v3 to 9/10 top-3. ADR-012 selects jina-embeddings-v3 plus rescue as production default, closing packet 008 at 51/51 FAILs resolved.

### Added

- `lib/search/rerank/retrieval-rescue.ts` (NEW): trigger-lane hardening plus sibling/backfill rescue injection for the search pipeline
- `tests/retrieval-rescue.vitest.ts` (NEW): 4-case vitest suite covering the rescue layer behavior and the default-on path
- `tests/dist-freshness.vitest.ts` (NEW): build-currency gate preventing stale-dist false-passes after the post-publish rebuild incident
- `tests/embedder-ollama.vitest.ts` (NEW): 10 cases covering distinct `ollamaName`, no-`ollamaName` fallback plus JSON Ollama error body serialization
- `evidence/retrieval-rescue.ts` and companion JSONL evidence files for the rescue on/off comparison (ADR-010/011)
- `decision-record.md` ADR-001 through ADR-012 recording each candidate rollback and the final jina-v3 plus rescue selection

### Changed

- `lib/search/pipeline/stage2-fusion.ts`: wired rescue layer invocation into the fusion stage. Rescue fires unless `SPECKIT_RERANK_LAYER=false`
- `lib/embedders/adapters/ollama.ts`: OllamaAdapter now stores provider-facing tag as `ollamaName ?? name` and uses it for `ready()`, `/api/embed` plus `/api/embeddings`. Fixes the ADR-002 provider-tag mapping defect
- Embedder manifests for mxbai, jina-v3, nomic, bge-m3 plus Snowflake gained `maxInputChars` caps to prevent context-length failures on re-index batches
- `evidence/embedder-comparison.csv` and `evidence/embedder-comparison-with-rescue.jsonl` updated with all 6 candidates plus rescue-on scores

### Fixed

- OllamaAdapter provider-tag mapping defect: `mxbai-embed-large-v1` registry name did not map to the correct Ollama model tag, causing all swap jobs to fail at 0/N rows
- Re-index input sizing: full-document content exceeded the mxbai Ollama context window (19668 chars). `maxInputChars` capping on manifests prevents recurrence across all Ollama-backed candidates
- Orphaned `memory_index` rows (5446 pruned) that inflated corpus size and degraded fixture reproducibility for cat-24/409
- cat-24/409 runtime sampler replaced with deterministic `409-fixture.json` (10 live ID pairs, easy/medium/hard distribution) so threshold measurements are reproducible
- cat-24/402 stale target lineages repaired: `4437/5143 -> 7007`, `4400 -> 8048`, `1534 -> 7636/7639`. `4356` pruned
- Stale dist: `mcp_server/dist/` had not been rebuilt after the rescue layer source landed. A post-publish rebuild confirmed the layer was inactive at runtime. `dist-freshness.vitest.ts` prevents recurrence

### Verification

| Check | Target | Actual |
|-------|--------|--------|
| `npx vitest run tests/retrieval-rescue.vitest.ts` after default-on flip | exit 0 | PASS. 4/4 |
| `npx vitest run tests/embedder-ollama.vitest.ts` | exit 0 | PASS. 10/10 |
| retrieval/scoring regression slice with rescue flag unset | exit 0 | PASS. 4 files, 111 tests |
| representative 008 PASS smoke with rescue flag unset | exit 0 | PASS. 7 files, 359 tests |
| cat-24/409 retrieval-rescue (Nomic) | 8/10 top-3 | PASS. 8/10 top-3 with `SPECKIT_RERANK_LAYER` unset |
| cat-24/409 retrieval-rescue (Jina v3, ADR-012) | 8/10 top-3 | PASS. 9/10 top-3 |
| 008 PASS sample preservation after rescue | at least 19/20 preserved | PASS proxy. 20/20, 0 regressions |
| `npm run typecheck` after rescue | exit 0 | PASS |
| strict-validate 016/004 after ADR-011 | exit 0 | PASS |
| Nomic post-surgery swap job | completed | PASS. 7491/7491 |
| mxbai bounded-input retry | completed | PASS. 12929/12929 |
| checkpoint_create pre-swap | checkpoint id captured | PASS. id=3 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | Created (NEW) | Trigger-lane hardening plus sibling/backfill rescue logic |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | Wired rescue layer invocation. Default-on path added |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | Modified | Provider-tag mapping fix. `ollamaName` field used for Ollama API calls |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-rescue.vitest.ts` | Created (NEW) | 4-case vitest suite for rescue layer |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts` | Created (NEW) | 10-case vitest suite for OllamaAdapter |
| `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts` | Created (NEW) | Build-currency gate to catch stale dist after source changes |
| `evidence/embedder-comparison.csv` | Modified | All 6 candidate scores and rescue-on column |
| `evidence/embedder-comparison-with-rescue.jsonl` | Created (NEW) | Per-candidate rescue on/off comparison JSONL |
| `evidence/d-rescue-on-vs-off.jsonl` | Created (NEW) | Cost/benefit measurements for rescue layer |
| `decision-record.md` | Modified | ADR-001 through ADR-012 authored |

### Follow-Ups

- cat-24/402 and cat-24/408 remain FAIL under the rescue layer. They are not the packet 008 closure gate but should not be represented as improved.
- cat-24/409 reaches the required threshold (8/10 under Nomic, 9/10 under Jina v3) but remaining misses are `7639` duplicate/root-lineage displacement and `13310` weak-trigger stress-test task recall.
- The 20-scenario PASS sample was preserved through a guarded regression proxy. A full manual replay of all 20 playbook scenarios remains a follow-on verification task.
- ADR-012 ratification (jina-v3 vs gemma vs nomic with rescue) ran as a parallel codex dispatch and confirmed jina-v3 plus rescue as the production default. The comparison JSONL is in `evidence/embedder-comparison-with-rescue.jsonl`.
