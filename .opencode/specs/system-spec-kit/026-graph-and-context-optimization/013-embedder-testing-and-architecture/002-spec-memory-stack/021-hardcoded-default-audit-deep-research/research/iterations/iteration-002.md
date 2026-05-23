# Iteration 002 — CocoIndex Python Subsystem Audit

**Date:** 2026-05-23
**Iteration:** 2 of 10
**Status:** insight
**newInfoRatio:** 0.72

---

## Focus

Pivot to CocoIndex Python subsystem audit: `.opencode/skills/mcp-coco-index/mcp_server/`. Audit embedder config drift, reranker drift, chunking/scoring defaults, inline string fallbacks in handlers + benchmarks. Cross-check against the May 2026 cocoindex arc ADRs (nomic-CodeRankEmbed + jina-reranker-v3 / Qwen3-Reranker-0.6B promotion). Confirm whether CocoIndex follows the registry-derived pattern from packet 020 or has parallel drift.

## Actions Taken

1. **Read** `embedders/registered_embedders.py` (378 lines) — central registry of MANIFESTS, DEFAULT_EMBEDDER_NAME, DEFAULT_RERANKER_NAME, validate_registry()
2. **Read** `embedders/registry.py` (31 lines) — stable re-export wrapper, no logic
3. **Read** `config/config.py` (883 lines) — Config.from_env(), all default constants, env parsing that validates against registry
4. **Read** `config/settings.py` (377 lines) — YAML settings, default_user_settings(), EmbeddingSettings dataclass
5. **Read** `rerankers/reranker.py` (506 lines) — CrossEncoderRerankerAdapter, HttpSidecarRerankerAdapter, get_reranker_adapter(), rerank()
6. **Read** `rerankers/rerankers_jina_v3.py` (207 lines) — JinaRerankerAdapter, model_name default parameter
7. **Read** `rerankers/adapter_lifecycle.py` (66 lines) — cleanup utilities, no model strings
8. **Read** `indexer/indexer.py` (413 lines) — chunk splitting, path classification, indexing flow
9. **Read** `retrieval/query.py` (975 lines) — query_codebase(), hybrid RRF, rerank integration
10. **Read** `retrieval/query_expansion.py` (256 lines) — query expansion, synonym dict
11. **Read** `core/shared.py` (213 lines) — embedder factory, prompt name resolution from registry
12. **Read** `server.py` (669 lines) — FastAPI tool handlers, no model strings found
13. **Read** benchmarks `bench_rss_core.py` — RSS measurement utilities, no model strings

## Findings

### P0 — Active Drift: NONE
CocoIndex has **zero P0 active-drift sites**. All embedder and reranker defaults trace cleanly through a single-source-of-truth chain:
- `registered_embedders.py::DEFAULT_EMBEDDER_NAME` = `"sbert/nomic-ai/CodeRankEmbed"` → matches May 2026 arc
- `registered_embedders.py::DEFAULT_RERANKER_NAME` = `"Qwen/Qwen3-Reranker-0.6B"` → matches 2026-05-20 promotion (supersedes jina-v3)
- `config.py` imports both and uses as module-level sentinels (`_DEFAULT_MODEL`, `_DEFAULT_RERANK_MODEL`)
- `config.py::Config.from_env()` validates unknown embedders against `_is_registered_embedder()` and falls back to default
- `shared.py::resolve_query_prompt_name()` and `resolve_document_prompt_name()` resolve prompts from registry, with env override capability
- `reranker.py::get_reranker_adapter()` dispatches via config values; no inline model string override
- `server.py` delegates all model decisions to the daemon/config layer — no hardcoded model strings in FastAPI handlers

### P1 — Latent Duplicates / Parallel Drift: 2 sites

**P1-002-001: `indexer/indexer.py:38-40` parallel chunk defaults**
```python
CHUNK_SIZE = 1500       # duplicates config.py:_DEFAULT_CHUNK_SIZE
MIN_CHUNK_SIZE = 250    # duplicates config.py:_DEFAULT_MIN_CHUNK_SIZE
CHUNK_OVERLAP = 200     # duplicates config.py:_DEFAULT_CHUNK_OVERLAP
```
These module-level constants mirror `config.py:22-24`. The indexer uses `getattr(config, "chunk_size", CHUNK_SIZE)` at line 321-323, so the config takes precedence. However, if the module-level fallback diverges from config, the `getattr` fallback silently changes behavior. The config defaults are empirically tuned (017 benchmark); the indexer duplicates are just copied values with no provenance. **Risk:** moderate — silent fallback path if Config.chunk_size is renamed or removed.

**P1-002-002: `reranker.py:31-42` vs `config.py:770` parallel `COCOINDEX_RERANK_VIA_SIDECAR` env read**
```python
# reranker.py:_rerank_via_sidecar_enabled()
raw = os.environ.get("COCOINDEX_RERANK_VIA_SIDECAR")
if raw is None or raw.strip() == "":
    return True  # hardcoded True

# config.py:Config.from_env()
rerank_via_sidecar = _parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", True)
```
Two independent code paths read the same env var with the same default (True). The `reranker.py` function is self-documented: "Both code paths must read the same default or the dispatch silently diverges from the documented behavior." The fact this comment exists confirms the duplication was recognized but not unified. Currently both default to True, so no active divergence — but this is a textbook latent drift vector. **Risk:** low today (same default), high if default ever changes.

### P2 — Cosmetic / Soft: 3 sites

**P2-002-001: `settings.py:87` dataclass default vs factory override conflict**
```python
@dataclass
class EmbeddingSettings:
    provider: str = "litellm"  # dataclass default

def default_user_settings():
    return UserSettings(embedding=EmbeddingSettings(
        provider="sentence-transformers",  # factory override
        model=_DEFAULT_MODEL,
    ))
```
The dataclass default is `"litellm"` but the factory (`default_user_settings()`) overrides to `"sentence-transformers"`. Any code constructing EmbeddingSettings without explicitly passing `provider` will get `"litellm"`, which routes to a different embedder factory in `shared.py::_build_embedder()`. **Risk:** low — the factory function is the canonical entry point, but the dataclass default is a trap.

**P2-002-002: `rerankers_jina_v3.py:54` unused parameter default**
```python
def __init__(self, model_name: str = "jinaai/jina-reranker-v3") -> None:
```
In practice, JinaRerankerAdapter is always instantiated via `get_reranker_adapter()` which passes the explicit model_name from config. The default is never used, but if someone constructs `JinaRerankerAdapter()` directly, they get jina-v3 regardless of config. **Risk:** minimal — internal-only class.

**P2-002-003: `registered_embedders.py:137-139` jina-v2-base-code as "Former default"**
Correctly labeled and retained as fallback only. `DEFAULT_EMBEDDER_NAME` was promoted to nomic-CodeRankEmbed. No drift — this is a properly managed superseded default.

### Registry Pattern Conformance

**Verdict: CocoIndex follows the registry-derived pattern correctly — cleaner than pre-020 spec-memory.**

The single-source-of-truth chain is:
```
registered_embedders.py (MANIFESTS + DEFAULT_*_NAME)
  → config.py (imports defaults, validates via _is_registered_embedder)
    → settings.py (imports _DEFAULT_MODEL from config)
    → shared.py (resolves prompts from registry)
    → reranker.py (imports _DEFAULT_RERANK_MODEL from config)
```
Unlike pre-020 spec-memory (which had inline model strings in profile.ts:192,195 and embeddings.ts:774), CocoIndex has **no inline model-string fallbacks in any handler or query path**. The `validate_registry()` function provides runtime integrity checks. All env-var-configurable defaults flow through `Config.from_env()` with bounded parsing and fallback warnings.

## Questions Answered

1. **Does CocoIndex have embedder config drift?** No. DEFAULT_EMBEDDER_NAME = nomic-CodeRankEmbed matches the May 2026 arc. All modules source embedder metadata from the registry. ✅

2. **Does CocoIndex have reranker drift?** No active drift. DEFAULT_RERANKER_NAME = Qwen3-Reranker-0.6B reflects the 2026-05-20 promotion over jina-v3. jina-v3 is correctly labeled "Pre-2026-05-20 default" and retained as opt-in fallback. ✅

## Questions Remaining

1. Skill-advisor TypeScript subsystem — pending audit (next iteration)
2. Code-graph subsystem — pending audit
3. Rerank-sidecar (system-rerank-sidecar) — pending audit
4. Cross-subsystem latent duplicate patterns between spec-memory and cocoindex (shared env var conventions, shared model selection patterns) — synthesis pending

## Next Focus

Iteration 003: Pivot to **skill-advisor TypeScript subsystem** audit. Audit `.opencode/skills/system-skill-advisor/` for hardcoded-default anti-patterns matching the packet-020 pattern (registry.ts vs auto-select.ts drift, inline model strings in evaluate/score codepaths, any ADR-implementation mismatch).
