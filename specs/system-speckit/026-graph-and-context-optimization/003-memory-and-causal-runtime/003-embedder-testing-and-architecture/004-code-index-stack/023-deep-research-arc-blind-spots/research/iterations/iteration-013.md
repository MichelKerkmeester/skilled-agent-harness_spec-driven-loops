# Iteration 013 - Prompt-policy invariant contract test [PASS-2]

## Pass 1 claim under attack
- HIGH-LATENT-RISK #3 / FINDING-006-A: prompt policy is not first-class index metadata.

## Hypotheses going in
- H1: The risk is overstated if a compact contract test can catch the model-swap mismatch cheaply.
- H2: The risk survives if current metadata cannot state document prompts, task modes, or index-time policy fingerprints.

## Evidence gathered
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60` maps query prompt names and explicitly says EmbeddingGemma document prompt is not applied at indexing time.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713` passes `query_prompt_name` when embedding dense query variants.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:314-329` embeds chunk text with `await embedder.embed(chunk.text)` and no prompt argument.
- Absence evidence: `rg -n "query_prompt_name|EmbeddingGemma|document prompt" tests cocoindex_code` finds prompt comments/source but no test enforcing query/document policy symmetry.
- External evidence: CocoIndex query docs recommend sharing transformation logic between indexing and querying when vector embedding computation must be consistent: `https://cocoindex.io/docs-v0/query/`.

## Pass-1 attack outcome
- [STRENGTHENED]: The invariant is real: query and document embedding paths are asymmetric today.
- [FALSIFIED]: The mitigation cost is smaller than Pass 1 implied. A narrow contract test can catch the present failure mode before a larger schema migration exists.

## Findings (severity-tagged)
- **FINDING-013-A** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: FALSIFIES-#3]:
  - **What**: A first guard is cheap. The following test would fail today for EmbeddingGemma-style policies if the expected document prompt is made explicit:

```python
def test_index_and_query_prompt_policy_are_explicit(monkeypatch):
    from cocoindex_code.shared import resolve_query_prompt_name

    model = "google/embeddinggemma-300m"
    assert resolve_query_prompt_name(model) == "InstructionRetrieval"

    # Expected new registry fields, not present today:
    policy = EmbedderPromptPolicy.for_model(model)
    assert policy.query_prompt_name == "InstructionRetrieval"
    assert policy.document_prompt_name == "DocumentRetrieval"
    assert policy.index_fingerprint() != policy.without_document_prompt().index_fingerprint()
```

  - **Why Pass 1 / deep-review missed this**: Pass 1 jumped to index metadata architecture and did not separate "small failing contract test" from "full metadata migration."
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:49-58`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:314-329`; absence grep output above.
  - **What to do**: Add the failing contract test first, then implement minimal `EmbedderPromptPolicy` metadata.

- **FINDING-013-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#3]:
  - **What**: Contract tests alone do not solve existing-index compatibility. The index still lacks a stored fingerprint of the model, dimension, query prompt, document prompt, and task mode used to generate embeddings.
  - **Why Pass 1 / deep-review missed this**: Current tests can mock embed calls, but no runtime check compares live policy with stored index policy before search.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:122-140` exposes project/daemon status without model or prompt fingerprints; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:314-329`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713`.
  - **What to do**: Store an `index_metadata` row with embedder, dimension, prompt policy, chunking policy, and corpus settings; reject searches on mismatch with a clear reindex instruction.

- **FINDING-013-C** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: Expected false-positive rate for the contract test is low because it keys off explicit registry metadata, not model-card scraping.
  - **Why Pass 1 / deep-review missed this**: The test design was not decomposed from the larger architecture.
  - **Evidence**: The proposed test depends only on local registry fields and deterministic fingerprint serialization.
  - **What to do**: Keep model-card checks in docs/doctor; keep CI tests local and deterministic.

## Hypotheses that FAILED falsification (valuable!)
- "Prompt-policy risk requires a large migration before any test can catch it" failed. A small failing test can pin the invariant.
- "The existing code already has symmetric prompt metadata" failed. The index path embeds raw chunk text.

## Updates to research-pass-2.md
- Added contract-test mitigation and separated low-cost guardrails from full index metadata migration.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

