# Review Report

## 1. Stop Reason - "max_iterations_reached" (20/20)

Stop reason: `max_iterations_reached` (20/20).

Source caveat: the requested iteration glob contained 10 markdown files on disk (`iteration-001.md` through `iteration-010.md`). Counts below use those iteration files as the findings source of truth and do not invent findings for missing `iteration-011.md` through `iteration-020.md`.

## 2. Iteration Count - 20

Requested synthesis count: 20. Available iteration files analyzed: 10.

## 3. Dimension Coverage

| Dimension | Finding Count |
|-----------|---------------|
| correctness | 13 |
| traceability | 13 |
| maintainability | 11 |

## 4. Severity Counts

| Severity | Count After Dedup |
|----------|-------------------|
| P0 | 0 |
| P1 | 21 |
| P2 | 16 |

## 5. Verdict

CONDITIONAL, hasAdvisories=true.

No P0 findings were reported, so this is not a FAIL. P1 findings remain after deduplication, so the verdict is CONDITIONAL rather than PASS. P2 findings are present, so `hasAdvisories=true`.

## 6. Release-Readiness

The canonical post-014 default state is not yet consistent across the repo. The review found active correctness drift in embedding/profile resolution, dtype handling, fallback construction, and migration backup naming; traceability drift in release docs, install guides, config examples, feature catalog entries, and profile-keyed database examples; and maintainability residue in fixtures, comments, package-lock ONNX traces, and manual playbook examples. The accepted provider cascade (Voyage -> OpenAI -> llama-cpp -> hf-local) appears repeatedly treated as canonical, but active code and docs still contain enough P1 residue to block a clean PASS.

## 7. Top P0 Findings

None.

## 8. Top P1 Findings

| ID | Dimension | File:Line | Evidence | Recommendation |
|----|-----------|-----------|----------|----------------|
| L-001-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings.ts:769` | `case 'hf-local': default: return providerInfo.config.HF_EMBEDDINGS_MODEL \|\| DEFAULT_MODEL_NAME;` | Add an explicit `llama-cpp` branch in `detectConfiguredModelName()` returning `LLAMA_CPP_EMBEDDINGS_MODEL` or `unsloth/embeddinggemma-300m-GGUF`, so pre-initialization `MODEL_NAME` matches the canonical auto-selected local provider. |
| L-002-001 | traceability | `PUBLIC_RELEASE.md:25` | `context-index.sqlite` | Replace the singleton example with a provider-keyed placeholder such as `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a concrete llama-cpp default example. |
| L-002-002 | traceability | `.opencode/skills/system-spec-kit/shared/README.md:207` | `speckit_memory.db # Active shared SQLite database file` | Update the package tree to show generated provider-keyed `context-index__*.sqlite` files or omit active DB filenames entirely. |
| L-002-003 | traceability | `.opencode/skills/system-spec-kit/shared/README.md:364` | `speckit_memory.db # Active shared SQLite database file` | Align the Per-Profile Databases section with `resolveActiveProfileDbPath` and the profile-keyed `context-index__...` naming contract. |
| L-002-004 | traceability | `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:23` | `Voyage Provider ... Primary embedding provider` | Rework the architecture table to include `llama-cpp` and `hf-local`, and describe Voyage/OpenAI as cloud cascade entries rather than the only primary/secondary providers. |
| L-002-005 | traceability | `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:62` | `3. LOCAL CACHE (Last Resort)` | Replace the fallback-order diagram with the canonical auto cascade: Voyage -> OpenAI -> llama-cpp -> hf-local, with keyword/cache degradation documented separately. |
| L-002-006 | traceability | `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:98` | `envKey: 'LLAMA_CPP_EMBEDDINGS_MODEL',` | Clarify that llama-cpp auto-selects when the GGUF runtime/model probe succeeds; `LLAMA_CPP_EMBEDDINGS_MODEL` is a model override, not an opt-in selector. |
| L-003-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:211` | `return null;` | Define a canonical cloud dtype/precision slug or otherwise make cloud profiles satisfy the provider/model/dim/dtype filename contract. |
| L-003-002 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:250` | `context-index__voyage__voyage-4__1024.sqlite` | Update this profile-path assertion to the canonical dtype-inclusive cloud filename shape after fixing `resolveActiveProfileDtype()`. |
| L-003-003 | traceability | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:116` | `cloud profiles use context-index__voyage__voyage-4__1024.sqlite and context-index__openai__text-embedding-3-small__1536.sqlite` | Replace the cloud filename examples with dtype-inclusive profile-keyed examples, or use the generic `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` placeholder. |
| L-004-001 | correctness | `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169` | `${toTimestampId(now)}__pre-restore-context-index.sqlite` | Replace the backup basename with an active-profile-derived basename, for example `pre-restore-${path.basename(args.dbPath)}`. |
| L-004-002 | correctness | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/054-runtime-cleanup-followups/graph-metadata.json:88` | `"path": "mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"` | Refresh this graph metadata so derived key-file/entity paths use the canonical dtype-inclusive cloud profile shape or remove stale generated DB artifacts from the packet metadata. |
| L-004-003 | correctness | `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830` | `process.env.EMBEDDINGS_PROVIDER = 'hf-local';` | On auto-migration failure, either abort or re-resolve provider and database path from one profile source before initialization. |
| L-005-002 | traceability | `.opencode/skills/system-spec-kit/config/config.jsonc:28` | `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite` | Update the doc-only config path to the active profile placeholder or intended llama-cpp default example; do not show hf-local as the fixed memory index path. |
| L-005-003 | traceability | `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32` | `check-native-modules.sh ... optional onnxruntime-node and sharp installs` | Align the feature catalog with the current health probe, which checks `better-sqlite3` and optional `sharp` but no longer probes `onnxruntime-node`. |
| L-005-005 | traceability | `.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:609` | `active hf-local default profile database (${DEFAULT_HF_LOCAL_DB_FILE})` | Change the generated fixture text to say disposable fixtures may pin a profile DB, and use the active profile placeholder or llama-cpp default rather than naming hf-local as the active default. |
| L-007-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:159` | `return process.env.OPENAI_EMBEDDINGS_MODEL \|\| 'text-embedding-3-small';` | Fix `resolveActiveProfileDim()` so the default OpenAI profile resolves `text-embedding-3-small` to 1536 dims. |
| L-007-002 | correctness | `.opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:361` | `// Both keys -> defaults to 768 (ambiguous)` | Replace this stale assertion with the canonical cascade expectation: when both cloud keys are usable, Voyage wins and the dimension should be 1024. |
| L-010-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:155` | `[hf-local] Unknown HF_EMBEDDINGS_DTYPE="${raw}"; falling back to fp32.` | Change invalid hf-local dtype fallback from `fp32` to canonical `q8`, or fail fast before provider/profile creation. |
| L-010-002 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:205` | `return normalizeProfileDtype(process.env.HF_EMBEDDINGS_DTYPE) \|\| 'q8';` | Share the hf-local dtype allow-list with profile resolution so invalid `HF_EMBEDDINGS_DTYPE` cannot create a filename/runtime dtype mismatch. |
| L-010-003 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:906` | `const provider = await createProviderInstance('hf-local', options);` | Sanitize fallback options before constructing hf-local so cloud or llama-cpp `options.model` / `options.dim` are not forwarded into the hf-local fallback path. |

## 9. Top P2 Findings (advisories)

| ID | Dimension | File:Line | Summary |
|----|-----------|-----------|---------|
| L-001-002 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings.ts:765` | Cloud provider model defaults depend on API-key presence instead of provider-native defaults. |
| L-001-003 | correctness | `.opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:242` | Behavioral assertion still expects the ONNX EmbeddingGemma default. |
| L-002-007 | traceability | `.opencode/install_guides/README.md:567` | Install guide says there are three embedding backends despite the current provider set. |
| L-003-004 | maintainability | `.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md:46` | Manual playbook uses a dtype-less Voyage checksum example. |
| L-003-005 | maintainability | `.opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10` | Eval helper comment still names the singleton `context-index.sqlite`. |
| L-003-006 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100` | Provenance comment implies the old production singleton database. |
| L-003-007 | maintainability | `.opencode/skills/system-spec-kit/shared/chunking.ts:18` | Chunking rationale cites the obsolete Nomic-era default model. |
| L-003-008 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22` | Functional test points at the old singleton runtime database location. |
| L-003-009 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380` | Committed JS fixture still says `MEMORY_DB_PATH` points directly to `context-index.sqlite`. |
| L-005-001 | traceability | `.opencode/skills/system-spec-kit/config/config.jsonc:25` | Documentation-only semantic-search example shows fixed `voyage-4`. |
| L-005-004 | traceability | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:209` | Current setup path still mentions ONNX runtime transitive terminology. |
| L-006-001 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210` | Normalizer comment references `nomic-embed-text-v1.5`. |
| L-009-001 | maintainability | `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md:62` | Provider table says Voyage is `configured via env` instead of naming the canonical `voyage-4` default. |
| L-009-002 | maintainability | `.opencode/skills/system-spec-kit/package-lock.json:7470` | Lockfile still contains `onnxruntime-node`. |
| L-009-003 | maintainability | `.opencode/skills/system-spec-kit/package-lock.json:8528` | Lockfile still contains `node_modules/onnxruntime-common`. |
| L-010-004 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:113` | `LLAMA_CPP_EMBEDDINGS_DTYPE` accepts arbitrary normalized dtype strings. |

## 10. Recommendation

Scaffold 022-local-llm-legacy-remediation packet.

Top batch-able remediation groups:

| Group | Findings | Workstream |
|-------|----------|------------|
| Profile identity and dtype contract | L-003-001, L-003-002, L-003-003, L-007-001, L-010-001, L-010-002, L-010-004 | Make provider/model/dim/dtype resolution canonical across cloud, hf-local, and llama-cpp profiles; update tests and docs to match. |
| Provider fallback correctness | L-001-001, L-001-002, L-004-003, L-007-002, L-010-003 | Align pre-init model identity, cloud defaults, cascade tests, migration fallback, and hf-local fallback construction with the accepted auto cascade. |
| Profile-keyed database naming cleanup | L-002-001, L-002-002, L-002-003, L-003-005, L-003-006, L-003-008, L-004-001, L-004-002 | Remove singleton and dtype-less database references from docs, comments, tests, backup names, and spec metadata. |
| Operator docs and catalog drift | L-002-004, L-002-005, L-002-006, L-002-007, L-005-001, L-005-002, L-005-003, L-005-004, L-009-001 | Refresh install/reference/config/catalog wording so users see the post-014 provider set and selection semantics. |
| Fixture and generated artifact refresh | L-001-003, L-003-004, L-003-009, L-005-005 | Regenerate or patch committed fixtures and manual playbook examples that still encode old defaults. |
| Legacy dependency/comment residue | L-003-007, L-006-001, L-009-002, L-009-003 | Remove or explicitly document old Nomic/ONNX lockfile/comment residue that remains only as transitive or historical compatibility material. |

## Appendix A. Excluded as historical context

The iteration files explicitly excluded these classes from main counts because they were historical, generated/frozen, test-local, or intentionally compatible:

| Source | Excluded Context |
|--------|------------------|
| iteration-001 | Historical migration context, diagnostics, test-local fixtures, legacy model registries, `test_backward_compat.py`, vitest temp `context-index.sqlite`, review/evidence material, and transitive ONNX references not asserting the rejected backend. |
| iteration-002 | Review packet output, 021/022 packet material, z_archive, evidence transcripts, generated/vendor/build folders, historical 014 metadata/evidence, and CocoIndex alternative-model references. |
| iteration-003 | Historical packets, frozen review artifacts, evidence transcripts, package-lock transitive dependency noise, vitest temp-directory singleton filenames, and 384-dimensional generic mock vectors. |
| iteration-004 | Prior duplicates, intentional legacy model registries, test-only temporary sqlite filenames, arbitrary mock 384-dim vectors, package-lock transitive entries, and explicitly historical packet/evidence material. |
| iteration-005 | Current review packet, frozen logs/evidence, z_archive, explicitly out-of-scope 021/022/027 packets, accepted cascade wording, and historical changelog/research artifacts. |
| iteration-006 | Prior findings, vitest temp-dir singleton filenames, legacy-model lookup registries, `test_backward_compat.py`, historical changelog/spec metadata, package-lock transitive ONNX entries, and intentional cloud alternative examples. |
| iteration-007 | Intentional test temp DB names, legacy model registries, and historical packet metadata. |
| iteration-008 | Already-covered findings, intentional compatibility/test material, CocoIndex `voyage-code-3` guidance, and historical packet metadata under the Setup A migration narrative. |
| iteration-009 | Current review packet, frozen review logs, evidence files, z_archive, intentional cascade/provider implementation areas, intentional legacy model registries, temp-dir test idioms, and frozen changelog/history. |
| iteration-010 | Prior duplicates, frozen review/evidence output, temp-dir test idioms, historical packet narrative, and intentional provider cascade material. |
