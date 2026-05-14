# Deep Review Report: Post-029 Final Re-Review

## 1. Stop Reason

`max_iterations_reached` (20/20 requested contract).

Source integrity note: the review root contains 10 observed iteration markdown files (`iteration-001.md` through `iteration-010.md`), and `deep-review-state.jsonl` records `maxIterations: 10`. Findings below are deduplicated from the observed iteration files only.

## 2. Iteration Count

20 requested; 10 observed source iteration files.

## 3. Dimension Coverage

| Dimension | P0 | P1 | P2 | Total Findings |
|-----------|----|----|----|----------------|
| correctness | 0 | 6 | 0 | 6 |
| traceability | 0 | 0 | 7 | 7 |
| maintainability | 0 | 2 | 4 | 6 |

## 4. Severity Counts

| Severity | Deduped Count |
|----------|---------------|
| P0 | 0 |
| P1 | 8 |
| P2 | 11 |

## 5. Verdict

CONDITIONAL. No P0 findings were reported, but P1 findings remain after deduplication. hasAdvisories=true.

## 6. Release-Readiness

The canonical post-014 default state is not fully consistent across the repo. The observed iterations confirm the broad Voyage -> OpenAI -> llama-cpp -> hf-local cascade is now treated as canonical, but active provider/profile code, profile filename tests, setup metadata, and user-facing docs still contain enough residue to block a clean close. The most material gaps are cloud `dtype` propagation, stale cloud profile filename expectations, and one-hop fallback behavior that skips the rest of the canonical cascade.

## 7. Top P0 Findings

None.

## 8. Top P1 Findings

| ID | Dimension | File:Line | Evidence | Disposition | Recommendation |
|----|-----------|-----------|----------|-------------|----------------|
| L-004-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:338` | `provider: 'voyage',` | confirmed-residue | Add `dtype: 'cloud'` to `VoyageProvider.getProfile()` so initialized Voyage profiles keep the canonical provider/model/dim/dtype shape and cannot derive dtype-less cloud slugs. |
| L-004-002 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts:308` | `provider: 'openai',` | confirmed-residue | Add `dtype: 'cloud'` to `OpenAIProvider.getProfile()` so initialized OpenAI profiles match the post-029 cloud filename contract. |
| L-004-003 | correctness | `.opencode/skills/system-spec-kit/shared/types.ts:70` | `dtype?: HfLocalDtype \| null;` | confirmed-residue | Widen provider metadata dtype typing to include the synthetic cloud dtype, or introduce a shared `EmbeddingProfileDtype` union used by local and cloud providers. |
| L-004-004 | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts:66` | `expect(path.basename(dbPath)).toBe('context-index__voyage__voyage-4__1024.sqlite');` | confirmed-residue | Update the Voyage profile filename assertion to `context-index__voyage__voyage-4__1024__cloud.sqlite` and construct the test profile with `dtype: 'cloud'`. |
| L-004-005 | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts:72` | `expect(path.basename(dbPath)).toBe('context-index__openai__text-embedding-3-small__1536.sqlite');` | confirmed-residue | Update the OpenAI profile filename assertion to `context-index__openai__text-embedding-3-small__1536__cloud.sqlite` and construct the test profile with `dtype: 'cloud'`. |
| L-010-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:899` | `console.warn(\`[factory] Attempting fallback from ${requestedProvider} to hf-local...\`);` | confirmed-residue | Replace the one-hop fallback with an ordered fallback that resumes the canonical cascade after the failed provider: Voyage failure should try OpenAI when configured, then llama-cpp when available, then hf-local; OpenAI failure should try llama-cpp, then hf-local; llama-cpp failure may fall to hf-local. |
| L-003-001 | maintainability | `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:51` | "Default install (pip install -e .) routes through LiteLLM (Voyage AI etc.) only." | confirmed-residue | Update the package metadata comments to match the shipped installer and docs: the default setup is local sentence-transformers EmbeddingGemma; LiteLLM/Voyage is an optional cloud path. |
| L-003-002 | maintainability | `.opencode/skills/system-spec-kit/scripts/setup/install.sh:194` | `"_NOTE_2_PROVIDERS": "Supports: Voyage (1024 dims), OpenAI (1536/3072 dims), HF Local (768 dims, no API needed)"` | confirmed-residue | Add llama-cpp to the generated provider note and identify it as the default local provider when the GGUF runtime is installed. |

## 9. Top P2 Findings (advisories)

| ID | Dimension | File:Line | Advisory |
|----|-----------|-----------|----------|
| L-003-003 | maintainability | `.opencode/skills/system-spec-kit/scripts/setup/install.sh:274` | Install help omits llama-cpp from the provider feature list. |
| L-003-004 | maintainability | `.opencode/skills/system-spec-kit/README.md:691` | Provider table implies llama-cpp is Apple-Silicon-only and unconditionally no-setup. |
| L-003-005 | maintainability | `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:21` | Comment calls the Nomic prefix shape a default instead of a legacy compatibility export. |
| L-005-001 | traceability | `README.md:139` | Setup snippet describes llama-cpp as the no-cloud-key default on Apple Silicon. |
| L-005-002 | traceability | `README.md:520` | Root feature list says llama-cpp is default on Apple Silicon with no setup. |
| L-005-003 | traceability | `.opencode/skills/system-spec-kit/shared/README.md:260` | Auto-detection summary only mentions API keys, omitting local probe and fallback inputs. |
| L-005-004 | traceability | `.opencode/skills/system-spec-kit/shared/README.md:325` | Provider table still marks Apple Silicon as the llama-cpp default condition. |
| L-005-005 | traceability | `.opencode/skills/system-spec-kit/shared/embeddings/README.md:36` | Cascade parenthetical says llama-cpp is default local on Apple Silicon. |
| L-005-006 | traceability | `.opencode/skills/system-spec-kit/mcp_server/README.md:71` | hf-local is described as the "old provider" even though it remains the canonical fallback. |
| L-008-001 | traceability | `.opencode/skills/system-spec-kit/README.md:146` | Requirements row says auto-cascade goes to llama-cpp on Apple Silicon and then HF Local ONNX. |
| L-009-001 | maintainability | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:770` | Fallback reason still labels hf-local as the "Default local provider". |

## 10. Recommendation

Scaffold 022-local-llm-legacy-remediation packet.

Top batch-able remediation groups:

| Group | Findings | Scope |
|-------|----------|-------|
| Cloud dtype/profile contract | L-004-001, L-004-002, L-004-003, L-004-004, L-004-005 | Provider `getProfile()` return shapes, shared dtype typing, and cloud profile filename regression tests. |
| Canonical fallback order | L-010-001, L-009-001 | Factory fallback behavior and diagnostic wording so failures resume the cascade instead of jumping straight to hf-local. |
| Install/setup provider metadata | L-003-001, L-003-002, L-003-003 | Package metadata and generated installer/help text that still omit or misstate llama-cpp/default local behavior. |
| Documentation wording drift | L-003-004, L-005-001, L-005-002, L-005-003, L-005-004, L-005-005, L-005-006, L-008-001 | Root, skill, shared, embedding, and MCP README surfaces that still overfit llama-cpp selection to Apple Silicon/no-setup wording or call hf-local old. |
| Legacy compatibility labeling | L-003-005 | Rename/comment hf-local prefix exports as compatibility-only, not a current default signal. |

## Appendix: Excluded as historical context

| Category | Source Iterations | Exclusion Rationale |
|----------|-------------------|---------------------|
| Legacy model registry and backward-compatibility tests (`nomic-ai/nomic-embed-text-v1.5`, MiniLM, 384-dim fixtures) | 001, 002, 003, 004, 005, 007, 009, 010 | Iterations repeatedly classified these as intentional compatibility coverage, not current defaults. |
| Test-only `context-index.sqlite` temp paths and fixed sqlite idioms | 001, 002, 003, 004, 007, 009 | Scoped test fixtures were treated as allowed and not production singleton DB residue. |
| Package-lock/vendor/.venv ONNX references | 001, 002, 003, 004, 005, 006, 007, 010 | Iterations separated transitive or third-party `onnxruntime-*` references from rejected standalone package/config dependencies. |
| CocoIndex `voyage/voyage-code-3` references | 001, 002, 003, 006, 009 | Treated as cloud alternative/model support, not current default drift. |
| Archives, frozen review artifacts, forensic evidence, prior packet records | 003, 005, 006 | Historical records were intentionally excluded from active repo consistency counts. |
| Canonical cascade and acceptable cloud-key opt-in wording | 001, 003, 004, 005, 007, 009, 010 | Voyage -> OpenAI -> llama-cpp -> hf-local, including key-driven cloud selection, was treated as the intended post-014 behavior. |
| Doctor causal-graph singleton DB guardrails | 002 | Iteration 002 classified these as forbidden-target guardrails rather than stale active defaults. |
