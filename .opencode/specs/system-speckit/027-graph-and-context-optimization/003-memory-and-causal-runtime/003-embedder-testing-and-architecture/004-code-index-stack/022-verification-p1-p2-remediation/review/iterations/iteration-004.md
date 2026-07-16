# Iteration 004 — Regression Hunt: RRF/Hybrid Math + Embedder Defaults

## Files / DBs / commands read

- `query.py:38-39` — _HYBRID_PATH_CLASS_SHIFT=0.01, _HYBRID_CANONICAL_RESOURCE_BOOST=0.02
- `test_dedup_mirrors.py:161-194` — test_hybrid_boosts_do_not_override_strong_rrf_lead implementation
- `registered_embedders.py:147-148` — DEFAULT_EMBEDDER_NAME with nomic default notes
- `config.py:15` — _DEFAULT_MODEL derivation from DEFAULT_EMBEDDER_NAME
- `README.md:69,147` — Correctly documents nomic-ai/CodeRankEmbed as default
- `feature_catalog/feature_catalog.md:293,745` — Stale reference to google/embeddinggemma-300m as default
- `feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md:23` — Stale reference to google/embeddinggemma-300m as default
- `manual_testing_playbook/manual_testing_playbook.md:327` — Stale reference to google/embeddinggemma-300m as default
- `manual_testing_playbook/03--configuration/001-default-model-verification.md:31,42` — Stale reference to google/embeddinggemma-300m as default
- `references/tool_reference.md:422` — Stale reference to google/embeddinggemma-300m as default
- `references/settings_reference.md:53,132` — Stale reference to google/embeddinggemma-300m as default
- `pyproject.toml:58` — Comment about EmbeddingGemma 300m as default install

**Commands run:**
- `rg -i "jina-v2-base-code|gemma-300m.*default|default.*gemma"` — Found stale references in documentation files

## Findings (P0/P1/P2/INFO)

### P2 Documentation inconsistency: Stale embedder defaults in docs — P2
- **Severity**: P2 (documentation inconsistency)
- **Evidence**:
  - `feature_catalog/feature_catalog.md:293,745` — References google/embeddinggemma-300m as default user settings
  - `feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md:23` — References google/embeddinggemma-300m as default
  - `manual_testing_playbook/manual_testing_playbook.md:327` — References google/embeddinggemma-300m as default
  - `manual_testing_playbook/03--configuration/001-default-model-verification.md:31,42` — References google/embeddinggemma-300m as default
  - `references/tool_reference.md:422` — References google/embeddinggemma-300m as default
  - `references/settings_reference.md:53,132` — References google/embeddinggemma-300m as default
  - `pyproject.toml:58` — Comment about EmbeddingGemma 300m as default install
  - These files were not updated in P1-G (operator docs match shipped defaults) or P2-3 (config dedup)
- **Why it matters**: Documentation inconsistency could confuse operators. The code is correct (settings.py, config.py, registry all use nomic), but some documentation files still reference the old gemma default.
- **Recommendation**: Update these documentation files to reference nomic-ai/CodeRankEmbed as the current default, or add a note that these files describe historical defaults. This is a documentation cleanup task, not a code regression.
- **Original-finding link**: NEW (not in 019 findings, missed by P1-G remediation)

### RRF/hybrid boost scaling — VERIFIED_NO_REGRESSION
- **Severity**: INFO (verified no regression)
- **Evidence**:
  - `query.py:38-39` sets _HYBRID_PATH_CLASS_SHIFT=0.01, _HYBRID_CANONICAL_RESOURCE_BOOST=0.02
  - `test_dedup_mirrors.py:161-194` test_hybrid_boosts_do_not_override_strong_rrf_lead
  - Test creates docs record with RRF=0.10, implementation record with RRF=0.03 + path-class + canonical boosts
  - Test expects docs (strong RRF) to rank ahead of implementation (weak RRF with boosts)
  - Test passes
- **Why it matters**: The test correctly verifies that strong RRF leads are not overridden by additive boosts
- **Recommendation**: None — implementation is correct and tested
- **Original-finding link**: N/A (regression verification)

### Embedder default consistency (code surfaces) — VERIFIED_NO_REGRESSION
- **Severity**: INFO (verified no regression)
- **Evidence**:
  - `registered_embedders.py:147-148` sets DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"
  - `config.py:15` sets _DEFAULT_MODEL = DEFAULT_EMBEDDER_NAME
  - `settings.py:121` uses model=_DEFAULT_MODEL in default_user_settings()
  - `README.md:69,147` correctly documents nomic-ai/CodeRankEmbed as default
  - Test test_default_model_is_nomic_coderankembed passes
- **Why it matters**: Code surfaces (settings, config, registry, README) are consistent on nomic default
- **Recommendation**: None — code surfaces are correct
- **Original-finding link**: N/A (regression verification)

## Updates to review.md

Added documentation inconsistency finding to new findings table. Updated regression hunt summary.

## Convergence signal

New findings vs prior iter: 1 P2 (documentation inconsistency, not a code regression)
