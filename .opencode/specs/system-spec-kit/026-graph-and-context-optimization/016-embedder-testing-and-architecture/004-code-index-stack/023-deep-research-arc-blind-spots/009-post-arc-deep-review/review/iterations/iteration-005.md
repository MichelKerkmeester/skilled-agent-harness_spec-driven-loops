# Iteration 005 — 023/003 (upstream spike) + 023/004 (metadata-fingerprint)

## Hypotheses going in

023/003 upstream-rebase-spike should have real delta classification (not placeholder). 023/004 metadata-fingerprint should implement IndexMetadata dataclass with HARD_REFUSE on dimension mismatch. Expected:
- IndexMetadata dataclass exists with embedder_dim field
- HARD_FIELDS includes embedder_dim for hard refusal
- cross-packet-impact.md has concrete technical guidance, not placeholder text

## Files read

- 023/003-upstream-rebase-spike/research/cross-packet-impact.md
- 023/004-metadata-fingerprint/spec.md
- cocoindex_code/observability/index_metadata.py

## Findings

### INFO — 023/004 IndexMetadata dataclass + HARD_REFUSE on dim mismatch verified

**Evidence:**
- `cocoindex_code/observability/index_metadata.py:86-116` defines `IndexMetadata` dataclass with `embedder_dim: int | None` field
- `cocoindex_code/observability/index_metadata.py:136-145` defines `HARD_FIELDS` set which includes `"embedder_dim"`
- `cocoindex_code/observability/index_metadata.py:164-196` implements `check()` method that compares expected vs actual metadata and assigns `CompatibilitySeverity.HARD_REFUSE` for fields in `HARD_FIELDS`
- `cocoindex_code/observability/index_metadata.py:81-83` implements `raise_for_hard_refusal()` which raises `IndexCompatibilityError` if hard_refusals exist

**Analysis:** The IndexMetadata dataclass correctly includes embedder_dim, and dimension mismatch is classified as HARD_REFUSE. The compatibility checker will raise IndexCompatibilityError when embedder_dim differs between runtime and stored metadata.

**Severity:** INFO — closure verified.

### INFO — 023/003 upstream-rebase delta classification is real (not placeholder)

**Evidence:**
- `023/003-upstream-rebase-spike/research/cross-packet-impact.md:1-51` contains specific technical guidance for 023A1, 023A2, 023A3, and 023B
- For 023A1 (Prompt Policy): maps local query prompt registry to upstream `query_params.prompt_name` and EmbeddingGemma asymmetry to upstream `indexing_params.prompt_name` and `query_params.prompt_name`
- For 023A2 (License and Registry Metadata): provides a table mapping local registry fields (provider/model id, query prompt behavior, license/registry metadata, requires Ollama daemon) to upstream analogs with explicit actions
- For 023A3 (Dimension Handling): explicitly states "dimensions are not a per-side param" and warns against adding `indexing_params.dimensions` or `query_params.dimensions`
- For 023B (Fixture Expansion): references upstream SDK test files and suggests adding minimal `.svelte` and `.vue` files to local fixture

**Analysis:** The cross-packet-impact.md document contains concrete, specific technical guidance with explicit mappings and guardrails. This is not placeholder text—it provides actionable direction for how each packet should align with upstream changes.

**Severity:** INFO — delta classification is real and actionable.

## Updates to review.md

Iteration 005 completed. Verified 023/004 IndexMetadata dataclass with embedder_dim field and HARD_REFUSE on dimension mismatch. Verified 023/003 upstream-rebase delta classification is real (not placeholder) with specific technical guidance for prompt policy, license registry, dimension handling, and fixture expansion.

## NO-EARLY-STOP confirmation

Iteration 5 of 10 complete. Continuing to iteration 6.
