# Cross-Packet Impact

## 023A1 - Prompt Policy

023A1 should import upstream `indexing_params/query_params` before implementing any custom prompt-policy design.

Mapping:

- Local query prompt registry -> upstream `query_params.prompt_name`.
- EmbeddingGemma document/query asymmetry -> upstream `indexing_params.prompt_name` and `query_params.prompt_name` if the provider accepts those prompt names.
- LiteLLM asymmetric retrieval models -> upstream `input_type`.
- Legacy CodeRankEmbed/nomic behavior -> upstream legacy bridge plus curated defaults.

Guardrail: do not add a second prompt-policy schema unless upstream's accepted key set cannot represent the needed provider behavior.

## 023A2 - License and Registry Metadata

023A2 should keep local `registered_embedders.py` as the registry of model metadata, license, and operational requirements unless upstream expands `embedder_defaults.py` into a richer model abstraction.

Likely mapping:

| Local Registry Field | Upstream Analog | Action |
|----------------------|-----------------|--------|
| provider/model id | `DefaultParamsEntry.provider/model` | Map directly. |
| query prompt behavior | `indexing_params/query_params` | Move prompt behavior into upstream-style params. |
| license/registry metadata | None | Preserve local. |
| requires Ollama daemon | None | Preserve local and keep shared factory checks. |

## 023A3 - Dimension Handling

023A3 should follow upstream's invariant: dimensions are not a per-side param. Any local dimension abstraction must be model-wide, documented as requiring reindex, and verified against the active CocoIndex SDK constructor/embedder surface.

Do not add:

- `indexing_params.dimensions`
- `query_params.dimensions`
- separate index/query dimension overrides

## 023B - Fixture Expansion

023B should add Svelte/Vue fixture coverage if fixture expansion is still in scope. Upstream has open-source references:

- Main SDK `python/tests/ops/test_text.py` checks `detect_code_language(filename="App.svelte") == "svelte"` and `.vue == "vue"`.
- Main SDK `rust/ops_text/src/split/recursive.rs` has splitter tests for Svelte/Vue.
- Upstream `cocoindex-code` `v0.2.32` added default include patterns.

Local fixture suggestion:

- Add minimal `.svelte` and `.vue` files to code-search fixture projects.
- Verify they are included by default and detectable as `svelte`/`vue`.
- Do not require local `chunkers/grammars.py` support unless tree-sitter Python packages are added intentionally.
