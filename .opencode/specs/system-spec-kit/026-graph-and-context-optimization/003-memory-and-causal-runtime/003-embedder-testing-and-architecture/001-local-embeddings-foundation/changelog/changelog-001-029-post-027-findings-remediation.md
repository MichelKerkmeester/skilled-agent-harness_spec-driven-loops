---
title: "Post-027 Findings Remediation: 21 P1 and 16 P2 Fixes Across 6 Workstreams"
description: "Closed all 37 findings from the 027 deep-review across six workstreams: profile identity and dtype contract, provider fallback correctness, profile-keyed DB naming, operator docs and catalog drift, fixture refresh and legacy dependency comment residue. Cloud providers now carry a synthetic 'cloud' dtype for a uniform four-part filename contract."
trigger_phrases:
  - "post-027 remediation"
  - "cloud dtype contract"
  - "profile-keyed db naming"
  - "provider fallback cascade correctness"
  - "embeddings p1 p2 findings"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-post-027-findings-remediation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The 027 deep-review surfaced 21 P1 and 16 P2 findings against the post-014 local embeddings stack. The two highest-impact problems were cloud provider DB filenames missing the dtype segment (breaking the `provider/model/dim/dtype` contract) plus a one-hop factory fallback that jumped directly to hf-local rather than resuming the full cascade order. All 37 findings were resolved in a single batch commit shipped 2026-05-13, covering code fixes, doc updates, fixture refreshes and legacy comment cleanup. Operators now get a uniform four-part filename for every provider and a cascade fallback that tries each downstream provider in order before giving up.

### Added

- `shared/embeddings/llama-cpp-availability.ts` (NEW) extracting `getLlamaCppAvailability`, `resolveLlamaCppModelPath` and `resolveWorkspaceNodeLlamaCppEntrypoint` so `profile.ts` can mirror the factory cascade without a circular import
- `mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` (NEW) with assertions for the dtype-inclusive filename contract across all four providers
- `ALLOWED_HF_LOCAL_DTYPES` and `ALLOWED_LLAMA_CPP_DTYPES` allow-lists in `profile.ts` with `q8` canonical fallback
- Cascade fallback helper `getCascadeFallbackOrder(failedProvider)` in `factory.ts` enabling ordered fallback: Voyage fail to OpenAI to llama-cpp to hf-local

### Changed

- `profile.ts` `resolveActiveProfileDtype` now returns `'cloud'` for voyage and openai providers to satisfy the uniform four-part DB filename contract
- `factory.ts` cascade fallback replaced the single-hop hf-local jump with an ordered cascade that tries each remaining provider in sequence
- `shared/types.ts` `EmbeddingProfileDtype` union widened to include the `'cloud'` literal
- `shared/embeddings.ts` `detectConfiguredModelName` gained an explicit `llama-cpp` branch. Cloud branches use provider-native model defaults.
- `mcp_server/context-server.ts` auto-migration failure path re-resolves the provider via the shared resolver instead of hardcoding `EMBEDDINGS_PROVIDER=hf-local`
- `mcp_server/scripts/migrations/restore-checkpoint.ts` backup basename now uses the active DB basename rather than the singleton `pre-restore-context-index.sqlite`
- Operator docs updated across `INSTALL_GUIDE.md`, `shared/README.md`, `references/memory/embedding_resilience.md`, `install_guides/README.md`, `config/config.jsonc` and provider READMEs to reflect the four-provider cascade and dtype-inclusive filename examples

### Fixed

- Cloud provider DB filenames lacked the dtype segment. Voyage and openai DBs now follow the uniform shape `context-index__voyage__voyage-4__1024__cloud.sqlite`.
- Factory fallback jumped directly to hf-local on any provider failure rather than resuming the cascade. All intermediate providers are now tried in order.
- `hf-local.ts` invalid dtype fell back to `fp32` instead of the canonical `q8`
- `llama-cpp.ts` did not validate `LLAMA_CPP_EMBEDDINGS_DTYPE` against the allowed dtype list; unknown values now fall back to `q8`
- hf-local fallback construction forwarded `options.model` and `options.dim` from a failed cloud provider. Fresh hf-local options are now built from env or defaults.
- Stale singleton `speckit_memory.db` references replaced in `shared/README.md`, `run-bm25-baseline.ts`, `ground-truth-generator.ts` and `test-folder-detector-functional.js`
- Legacy Nomic-era rationale comment in `chunking.ts` and `content-normalizer.ts` updated to EmbeddingGemma

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/embeddings.vitest.ts` | Evidence from commit `fce970add6`: test suite updated to dtype-inclusive cloud filename assertions |
| `grep -nE 'speckit_memory\.db' shared/README.md` | 0 matches post-fix per commit evidence |
| `grep -nE "process\.env\.EMBEDDINGS_PROVIDER = 'hf-local'" context-server.ts` | 0 matches post-fix per commit evidence |
| `grep -nE 'pre-restore-context-index\.sqlite' restore-checkpoint.ts` | 0 matches post-fix per commit evidence |
| `grep -nE 'case .llama-cpp.' shared/embeddings.ts` | Confirmed present in shipped code |
| `profile-db-filename.vitest.ts` assertions | Dtype-inclusive cloud filenames asserted for voyage and openai profiles |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts` | `resolveActiveProfileDtype` returns `'cloud'` for cloud providers. Added `ALLOWED_HF_LOCAL_DTYPES` and `ALLOWED_LLAMA_CPP_DTYPES` allow-lists with `q8` fallback. llama-cpp probed between OpenAI and hf-local in cascade order. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | One-hop hf-local fallback replaced with ordered cascade fallback. Cloud startup profiles get `'cloud'` dtype. hf-local fallback strips failed-provider model/dim options. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts` | `getProfile()` return includes `dtype: 'cloud'`. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts` | `getProfile()` return includes `dtype: 'cloud'`. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Invalid dtype now falls back to `q8` instead of `fp32`. |
| `.opencode/skills/system-spec-kit/shared/types.ts` | `EmbeddingProfileDtype` union widened to include `'cloud'` literal. |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | `detectConfiguredModelName` gains explicit llama-cpp branch. Cloud branches use provider-native defaults. `DEFAULT_MODEL_NAME` set to `onnx-community/embeddinggemma-300m-ONNX`. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Auto-migration failure re-resolves provider via shared resolver, not hardcoded hf-local. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Backup basename uses active DB basename instead of singleton. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` (NEW) | Dtype-inclusive filename assertions for all four providers. |
| `.opencode/skills/system-spec-kit/shared/chunking.ts` | Rationale comment updated from Nomic-era to EmbeddingGemma. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts` | Comment reference to nomic-embed-text-v1.5 updated. |
| `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md` | Architecture table updated for four-provider cascade. Voyage-primary and local-cache-last-resort framing corrected. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Cloud filename examples updated to dtype-inclusive shape. |
| `.opencode/install_guides/README.md` | "three embedding backends" corrected to "four providers in cascade". |
| `.opencode/skills/system-spec-kit/config/config.jsonc` | Doc-only voyage-4 hardcode removed. Placeholder used for model example. |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh` | `_NOTE_2_PROVIDERS` updated to include llama-cpp. |

### Follow-Ups

- Verify that `llama-cpp-availability.ts` extraction is no longer needed after the llama-cpp surface was purged in a subsequent packet and remove the file if it is now dead code.
- Confirm `profile-db-filename.vitest.ts` assertions remain green after the nomic consolidation that followed this remediation batch.
