## Focus

Validate project-close, registry-embedder cache, and adapter lifecycle recommendations against the actual mcp-coco-index and installed CocoIndex/LiteLLM API surfaces.

## Actions Taken

- Read the configured deep-research state, strategy, final synthesis, iterations 009 and 010, and deltas 009 and 010 before source validation.
- Checked prior continuation state for iteration 013's recommended next focus on adapter lifecycle and registry embedder cache validation.
- Inspected `Project.close`, `ProjectRegistry`, `create_embedder`, reranker adapters, and installed CocoIndex/LiteLLM package code for concrete close, stop, unload, and cleanup APIs.
- Compared source evidence to the final packet ordering from iteration 009 and the final synthesis from iteration 010.

## Sources Consulted

- `research/deep-research-config.json:3-8`
- `research/deep-research-strategy.md:21-25`
- `research/deep-research-state.jsonl:14-16`
- `research/research.md:80-108`
- `research/iterations/iteration-009.md:61-77`
- `research/iterations/iteration-009.md:84-101`
- `research/iterations/iteration-010.md:36-52`
- `research/iterations/iteration-010.md:74-99`
- `research/iterations/iteration-013.md:83-87`
- `research/deltas/iter-009.jsonl:2`
- `research/deltas/iter-009.jsonl:4`
- `research/deltas/iter-009.jsonl:8`
- `research/deltas/iter-010.jsonl:5`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:36-42`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:107-127`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/shared.py:144-197`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:342-417`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:660-707`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:816-841`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1280-1300`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:20-21`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:130-169`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:226-345`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:365-413`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/rerankers_jina_v3.py:43-117`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/app.py:130-240`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/environment.py:177-183`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/environment.py:411-427`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/context_keys.py:75-83`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/context_keys.py:122-123`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/connectors/sqlite/_target.py:65-117`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/ops/litellm.py:23-40`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/ops/litellm.py:46-78`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/ops/litellm.py:122-125`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/litellm/llms/custom_httpx/async_client_cleanup.py:8-14`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/litellm/llms/custom_httpx/async_client_cleanup.py:20-44`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/litellm/llms/custom_httpx/httpx_handler.py:26-40`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/sentence_transformers/cross_encoder/model.py:35-90`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/sentence_transformers/cross_encoder/model.py:242-276`

## Findings

1. `Project.close()` is a shallow, synchronous close API today. It retrieves the `SQLITE_DB` context value and calls `db.close()`, swallowing all exceptions, but it does not close the CocoIndex `App`, `Environment`, `ContextProvider`, project embedder, or any app update handle (`project.py:36-42`). The project creates raw context values with `ContextProvider.provide(...)`, then constructs `Environment` and `App` from that provider (`project.py:107-127`), so `ContextProvider.aclose()` would only matter for future `provide_with` or `provide_async_with` ownership, not for the current raw values.

2. Installed CocoIndex exposes a clear close API for `ManagedConnection`, but not a project-local `App.close()`. The SQLite connector's `ManagedConnection.close()` closes the underlying `sqlite3.Connection` (`_target.py:65-117`). `App` stores `_core_env_app` and exposes `update()`/`UpdateHandle` behavior (`app.py:130-240`), but source search did not find a public `close`, `stop`, or `unload` method on `App`. `Environment` explicitly says lifecycle is not driven by that class and points to default-environment `start()`/`stop()` or runtime context managers (`environment.py:177-183`); `LazyEnvironment.stop()` exists for the default env path (`environment.py:411-427`), not for the per-project `Environment` constructed in `Project.create`.

3. Registry embedder cache cleanup is source-supported and should keep a hard dependency on `remove-project-cancel-safety`. `ProjectRegistry` owns `_embedder_by_config_hash` and `_project_effective_config_hash` (`daemon.py:342-356`), creates a new cached embedder per effective config hash (`daemon.py:392-404`), and closes only the `Project` when a config changes (`daemon.py:413-416`). `remove_project` removes project maps and closes the project (`daemon.py:816-830`), while `close_all` clears projects, locks, and load-time events but leaves `_embedder_by_config_hash`, `_project_effective_config_hash`, and `_current_index_meta` uncleared (`daemon.py:832-841`). That makes the registry packet real, but eviction is only safe after active work cannot retain the old project/context/embedder.

4. Registry embedder lifecycle does not need adapter lifecycle first, and it should not rely solely on `project-close-full-release`. The registry cache owns embedders by config hash; reranker adapters live in module-level `_ADAPTERS` (`reranker.py:20-21`). They are different ownership domains. `Project.close()` can become deeper first, as iteration 010 ordered, but registry acceptance should be stated as "after remove-project safety" rather than "after project close exists," because the cache being fixed is registry-owned. The one nuance: `create_embedder()` also stores the latest created embedder in module-level `shared.embedder` (`shared.py:188-197`), so registry eviction tests should prove the evicted object is not still retained through that global.

5. Reranker adapters have no close/unload contract today. `CrossEncoderRerankerAdapter` lazily stores `_model` after constructing `sentence_transformers.CrossEncoder` (`reranker.py:130-169`), `HttpSidecarRerankerAdapter` lazily stores an `httpx.Client` plus a nested bundled fallback adapter (`reranker.py:226-274`), and sidecar failures call the fallback on exception, 5xx, or malformed payload (`reranker.py:297-340`). `get_reranker_adapter()` then caches sidecar/default/Jina adapters in `_ADAPTERS` (`reranker.py:385-413`). `JinaRerankerAdapter` similarly stores a loaded `AutoModel` in `_model` (`rerankers_jina_v3.py:43-117`). The implementation packet should add idempotent adapter-owned close methods plus a cache-level close/clear function.

6. Adapter close should be explicit owner-driven eviction, not per-request cleanup. The safe shape is: pop the adapter from `_ADAPTERS` under the cache owner, then call `adapter.close()` outside normal request flow. `HttpSidecarRerankerAdapter.close()` should close `_client` if present, set `_client = None`, call close on `_fallback_adapter` if it exists, then set `_fallback_adapter = None`. `CrossEncoderRerankerAdapter.close()` and `JinaRerankerAdapter.close()` can release `_model` and any future nested resources; if the adapter is evicted from `_ADAPTERS`, later reuse naturally constructs a fresh adapter. Closing only the fallback while keeping the sidecar adapter cached would break deliberate fallback reuse and should be avoided unless that is a documented memory-pressure operation.

7. LiteLLM has a package-level async client cleanup API, but `LiteLLMEmbedder` itself has no close method. `LiteLLMEmbedder` calls `litellm.aembedding(...)` through inner `_EmbedderInstance` objects (`litellm.py:23-40`), caches `_dim`, `_lock`, and `_instances` (`litellm.py:46-78`, `litellm.py:122-125`), and does not expose close/unload in the checked file. The installed LiteLLM package does expose `close_litellm_async_clients()` to close cached async HTTP/aiohttp clients (`async_client_cleanup.py:8-14`, `async_client_cleanup.py:20-44`), and its `HTTPHandler.close()` closes its async `httpx` client (`httpx_handler.py:26-40`). If registry embedder cleanup includes LiteLLM, it should call that cleanup deliberately at daemon shutdown or global eviction boundaries, not on every project refresh.

## Questions Answered

- Available close APIs:
  `Project.close()` exists but only closes target SQLite; `ManagedConnection.close()` exists and closes the sqlite connection; `ContextProvider.aclose()` exists but only releases context-manager-provided values; `LazyEnvironment.stop()` exists for default-environment lifecycle; no project-local `App.close()` or per-project `Environment.close()` API was found. Reranker adapters and CocoIndex `LiteLLMEmbedder` have no local close/unload API today. LiteLLM has package-level async HTTP client cleanup.

- Registry embedder cache ordering:
  The hard prerequisite is `remove-project-cancel-safety`. After that, registry cache lifecycle can land adjacent to `project-close-full-release`, but its acceptance should be registry-owned active-hash/refcount eviction rather than depending on `Project.close()` to do it. Keeping the iteration 010 order is acceptable if `project-close-full-release` is already the next resident-memory packet, but the registry packet should not wait on adapter lifecycle.

- Adapter nested close shape:
  Add idempotent close methods to adapters and a cache-level owner function that pops from `_ADAPTERS` before closing. `HttpSidecarRerankerAdapter.close()` should close the nested `httpx.Client` and nested fallback adapter together; normal `rerank()` should keep reusing both while the adapter remains cached.

- Tests needing fake heavy models or clients:
  Use fake embedders, fake CrossEncoder/Jina model objects, fake `httpx.Client`, and fake LiteLLM cleanup hooks. The tests should assert weakrefs/finalizers fire after registry eviction or adapter cache clear, and should prove that active project references keep objects alive until remove/close safety has quiesced work.

- Measurement needed to raise adapter lifecycle above P2:
  A controlled successful-search or sidecar-fallback benchmark must show sustained retained growth or memory-pressure failure attributable to `_ADAPTERS`, nested fallback adapters, or LiteLLM/httpx clients. A one-time model load or fixed resident sidecar cost is still P2-bound under iteration 009/010 evidence.

## Questions Remaining

- Whether `project-close-full-release` should introduce a reusable release helper that registry embedder cleanup can call for model objects with future close/unload hooks.
- Whether `shared.embedder` is still required for `CodeChunk` annotation after project-scoped embedders became config-hash cached; if it is required, eviction must avoid or update that global pointer.
- Whether LiteLLM cleanup should be called on daemon shutdown only, or also after evicting the last LiteLLM-backed embedder config hash.

## Ruled Out

- A project-local `App.close()` as the implementation anchor. Source inspection found `App.update()` and core app storage, but no public close/stop/unload method.
- Fixing registry embedder cache via reranker `_ADAPTERS` lifecycle. The caches are separate modules and ownership domains.
- Closing sidecar fallback adapters immediately after a failed request. That would trade memory for repeated heavy model reloads and surprise reuse behavior.
- Raising adapter lifecycle above P2 from current evidence. Iteration 009 ruled out escalation without successful-search or fallback-growth measurement (`iteration-009.md:99-101`), and this pass found API shape, not new growth evidence.

## Dead Ends

- System `python3` could not import `cocoindex` or `litellm`; installed API inspection used the mcp-coco-index packet-local `.venv` files instead.
- Searching for close/unload methods in reranker adapters confirmed absence rather than exposing a hidden cleanup hook.
- SentenceTransformers/Transformers inspection showed model construction surfaces, but not a simple universal close API that adapter cleanup could delegate to.

## Reflection

- What worked and why: Reading project, registry, adapter, and installed package APIs side by side separated real close APIs from hoped-for ones.
- What did not work and why: Package-level imports through system Python failed, so API validation had to use direct `.venv` file inspection.
- What I would do differently: Start with the installed package `rg` search earlier, because it quickly distinguishes CocoIndex default-environment lifecycle from the per-project environment in this daemon.

## Next Focus

Iteration 015 should turn these validated close surfaces into the final continuation synthesis: confirm packet ordering after iteration 011-014 refinements, list hard prerequisites, and keep adapter severity P2 unless a benchmark has produced growth evidence.

## Recommended Next Focus

Finalize the recommendation-validation addendum for iterations 011-014, preserving `remove-project-cancel-safety` as the first dependency and marking registry/adapter resident-memory cleanup as benchmark-gated.
