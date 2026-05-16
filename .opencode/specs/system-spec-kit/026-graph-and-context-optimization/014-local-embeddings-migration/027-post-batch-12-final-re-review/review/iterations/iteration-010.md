# Iteration 010 — Local-LLM Legacy Hunt

## Focus
This iteration focused on correctness residue in the active embedding resolver, profile filename derivation, provider fallbacks, runtime configs, package manifests, and executable migration/eval scripts. I specifically re-checked the post-022 canonical defaults against production `.ts`/`.py`/`.cjs` surfaces and committed config-like files, while filtering prior iteration duplicates, frozen review/evidence output, temp-dir test idioms, historical packet narrative, and the intentional Voyage -> OpenAI -> llama-cpp -> hf-local cascade.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:155 | "`[hf-local] Unknown HF_EMBEDDINGS_DTYPE=\"${raw}\"; falling back to fp32. Allowed: ${ALLOWED_HF_DTYPES.join(', ')}`" | confirmed-residue | Change invalid hf-local dtype fallback from `fp32` to canonical `q8`, or fail fast before provider/profile creation so invalid env cannot silently switch precision away from the post-014 q8 default. |
| L-010-002 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:205 | "return normalizeProfileDtype(process.env.HF_EMBEDDINGS_DTYPE) \|\| 'q8';" | confirmed-residue | Share the hf-local dtype allow-list with profile resolution; otherwise an invalid `HF_EMBEDDINGS_DTYPE` can be encoded into a provider-keyed sqlite filename while the provider falls back to a different runtime dtype. |
| L-010-003 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:906 | "const provider = await createProviderInstance('hf-local', options);" | confirmed-residue | Sanitize fallback options before constructing hf-local; cloud or llama-cpp `options.model` / `options.dim` should not be forwarded into the hf-local fallback path because it can try to load a non-hf model or use a mismatched profile dimension. |
| L-010-004 | P2 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:113 | "return configured.replace(/[^a-z0-9-_.]/g, '_').replace(/__+/g, '_');" | confirmed-residue | Validate `LLAMA_CPP_EMBEDDINGS_DTYPE` against the supported GGUF dtype contract, or normalize unsupported values back to `q8`, so profile filenames cannot claim arbitrary dtype strings for the q8 default model. |

## Iteration summary
- Files scanned: 4343
- New findings: 4 (P0=0, P1=3, P2=1)
- Out-of-scope/historical noted but NOT flagged: 12
- Notes: Saturation is close on the explicitly listed legacy-default residue. Remaining new correctness residue is mostly profile/runtime mismatch around invalid dtype and fallback construction, not another contradiction of the canonical cascade. Prior unresolved items such as `MODEL_NAME` pre-init behavior, cloud dtype-less filenames, singleton backup names, package-lock ONNX entries, and documented install-guide drift were observed but not duplicated here.
