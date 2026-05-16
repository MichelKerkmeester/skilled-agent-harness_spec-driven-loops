---
title: "Review Report - Post Batch 11 Re-review"
description: "Canonical synthesis of the local-LLM legacy-hunt review iterations for post-batch-11 re-review."
trigger_phrases:
  - "review report"
  - "deep review"
  - "local llm legacy"
importance_tier: "important"
contextType: "review-report"
---

# Post Batch 11 Re-review Report

Source note: the requested glob contained `iteration-001.md` through `iteration-010.md` only. The run stop metadata below follows the requested synthesis contract, while all finding counts and tables are derived only from those available iteration files.

## 1. Stop Reason — "max_iterations_reached" (20/20)

## 2. Iteration Count — 20

Available source artifacts read for this synthesis: 10 iteration files.

## 3. Dimension Coverage

| Dimension | Findings after dedup |
|-----------|----------------------|
| correctness | 19 |
| traceability | 13 |
| maintainability | 21 |

## 4. Severity Counts

| Severity | Total after dedup |
|----------|-------------------|
| P0 | 0 |
| P1 | 42 |
| P2 | 11 |

## 5. Verdict

CONDITIONAL. P1 findings are present, so the packet is not cleanly releasable without remediation. hasAdvisories=true.

## 6. Release-Readiness

The canonical post-014 default state is not consistently represented across the repo. The current implementation and several current docs recognize the `Voyage -> OpenAI -> llama-cpp -> hf-local` cascade, but active configs, command packs, 017 packet metadata/docs, Barter mirror assets, install guidance, tests, and provider profile code still preserve contradictory hf-local, MiniLM, singleton DB, ONNX, Voyage-marketing, or dtype-less profile assumptions. No P0 finding was reported, but the remaining P1 set is broad enough to require a remediation packet before closing the follow-on review line.

## 7. Top P0 Findings

No P0 findings were emitted by the available iteration files.

## 8. Top P1 Findings

| ID | Dimension | File:Line | Evidence | Recommendation |
|----|-----------|-----------|----------|----------------|
| L-001-001 | correctness | `.vscode/mcp.json:20` | `Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'` | Update the VS Code MCP config to include the canonical auto cascade and `llama-cpp` provider option. |
| L-001-002 | correctness | `.vscode/mcp.json:22` | `Get Voyage key: https://dash.voyageai.com/api-keys (recommended, 8% better than OpenAI)` | Remove the unsupported Voyage marketing claim from the live config note. |
| L-001-003 | correctness | `.vscode/mcp.json:39` | `Default embedding: all-MiniLM-L6-v2 (local, no API key needed)` | Replace the CocoIndex default note with `google/embeddinggemma-300m` / 768-dim sentence-transformers wording. |
| L-001-004 | correctness | `.opencode/commands/doctor/update.md:121` | `LONG-POLE: memory_index_scan over context-index + voyage vector DB.` | Make the `/doctor:update` prompt provider-neutral and refer to active profile DBs. |
| L-001-005 | correctness | `.claude/commands/doctor/update.md:121` | `LONG-POLE: memory_index_scan over context-index + voyage vector DB.` | Mirror the provider-neutral `/doctor:update` prompt wording in the Claude command pack. |
| L-001-006 | correctness | `.gemini/commands/doctor/update.toml:2` | `LONG-POLE: memory_index_scan over context-index + voyage vector DB.` | Regenerate or patch the Gemini command pack from the corrected provider-neutral doctor update source. |
| L-002-001 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/description.json:5` | `auto mode was restored to hf-local and llama-cpp remains explicit opt-in` | Refresh packet description metadata to record llama-cpp as the intended auto local default when the GGUF runtime is installed, with hf-local as fallback. |
| L-002-002 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/graph-metadata.json:54` | `auto mode was restored to hf-local and llama-cpp remains explicit opt-in` | Regenerate or patch graph metadata so retrieval does not resurface the reversed 017 framing. |
| L-003-001 | maintainability | `.opencode/skills/system-spec-kit/scripts/setup/install.sh:195` | `otherwise HF local fallback stays active` | Update the generated MCP config note to document the full auto cascade. |
| L-003-002 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103` | `auto mode defaults to hf-local with no keys` | Rework the provider-resolution test to expect llama-cpp when the GGUF runtime probe succeeds and hf-local only when unavailable. |
| L-003-003 | maintainability | `.gemini/commands/doctor.toml:2` | `` `memory`        \| `mcp_server/database/context-index.sqlite` + voyage embedding DB`` | Regenerate the Gemini `/doctor` command pack so it names provider-keyed active profile DBs. |
| L-004-001 | correctness | `.opencode/commands/doctor/scripts/mcp-doctor.sh:204` | `Fallback: hf-local default profile (covers fresh-install case before any provider DB exists)` | Replace the hardcoded shell fallback with the canonical local default profile or call the shared profile resolver. |
| L-004-002 | correctness | `.claude/commands/doctor/scripts/mcp-doctor.sh:204` | `Fallback: hf-local default profile (covers fresh-install case before any provider DB exists)` | Mirror the corrected doctor MCP database probe in the Claude command pack. |
| L-005-001 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:17` | `Keep auto mode on hf-local; use llama-cpp only with explicit EMBEDDINGS_PROVIDER=llama-cpp` | Update the continuity next action to the clarified canonical state. |
| L-005-002 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:71` | `The automatic default was therefore restored to hf-local; llama-cpp remains explicit opt-in.` | Rewrite the outcome paragraph to record the user-accepted llama-cpp automatic local default when installed. |
| L-005-003 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:103` | `Documented hf-local auto default and llama-cpp explicit opt-in` | Replace this file-change summary with the canonical runtime-note cascade. |
| L-005-004 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/plan.md:73` | `llama-cpp remains a supported provider, but after Phase 4 the auto fallback path is:` | Change the architecture section so llama-cpp is part of the auto resolver order before hf-local. |
| L-005-005 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/plan.md:93` | `Codex, Claude, Gemini, OpenCode notes updated to final hf-local default` | Replace "final hf-local default" with "final auto cascade" and name the llama-cpp branch. |
| L-005-006 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/checklist.md:63` | `Auto mode restored to hf-local after failed probe.` | Update checklist evidence to show auto selects llama-cpp when available and falls back to hf-local. |
| L-005-007 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/tasks.md:70` | `.codex/config.toml final hf-local default notes` | Update runtime-config task evidence to say the notes document the canonical auto cascade. |
| L-005-008 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/tasks.md:100` | `Auto provider resolution restored to hf-local after the MILD_DIVERGENCE verdict.` | Replace this completion criterion with the clarified accepted flip and hf-local fallback behavior. |
| L-006-001 | maintainability | `barter/.codex/config.toml:15` | `MEMORY_DB_PATH = ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"` | Remove the singleton `MEMORY_DB_PATH` pin and let the shared profile resolver derive the provider-keyed sqlite filename. |
| L-006-002 | maintainability | `barter/.codex/config.toml:20` | `_NOTE_3_EMBEDDINGS_PROVIDER = "Current: 'hf-local' (free, offline). Options: 'auto', 'voyage', 'openai'"` | Update the Codex scaffold note to the canonical auto cascade and include `llama-cpp` plus `hf-local`. |
| L-006-003 | maintainability | `barter/.codex/config.toml:39` | `_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"` | Replace the CocoIndex default note with EmbeddingGemma bf16 768-dim sentence-transformers wording. |
| L-006-004 | maintainability | `barter/opencode.json:88` | `_NOTE_3_EMBEDDINGS_PROVIDER`: `Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local)` | Regenerate the Barter OpenCode config note so the cascade includes llama-cpp. |
| L-006-005 | maintainability | `barter/opencode.json:90` | `_NOTE_5_GET_VOYAGE_KEY`: `recommended, 8% better than OpenAI` | Remove the unsupported Voyage marketing claim from Barter OpenCode config copy. |
| L-006-006 | maintainability | `barter/opencode.json:104` | `_NOTE_2`: `Default embedding: all-MiniLM-L6-v2 (local, no API key needed)` | Refresh Barter CocoIndex config copy to the canonical EmbeddingGemma default. |
| L-006-007 | maintainability | `barter/.vscode/mcp.json:20` | `Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'` | Regenerate Barter VS Code MCP config from the corrected provider-cascade template. |
| L-006-008 | maintainability | `barter/.vscode/mcp.json:33` | `Default embedding: all-MiniLM-L6-v2 (local, no API key needed)` | Replace the stale MiniLM default with EmbeddingGemma / 768-dim wording. |
| L-006-009 | maintainability | `barter/.opencode/skills/mcp-coco-index/references/settings_reference.md:43` | `sentence-transformers/all-MiniLM-L6-v2` as the `embedding.model` default | Update the Barter CocoIndex settings reference default to `google/embeddinggemma-300m`. |
| L-006-010 | maintainability | `barter/.opencode/skills/mcp-coco-index/references/settings_reference.md:127` | `sentence-transformers/all-MiniLM-L6-v2 ... 384 ... current default` | Change the model table so EmbeddingGemma is current and MiniLM is not presented as current state. |
| L-006-011 | maintainability | `barter/.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md:23` | `Default user settings choose sentence-transformers/all-MiniLM-L6-v2.` | Regenerate the Barter CocoIndex feature-catalog entry from updated EmbeddingGemma docs. |
| L-006-012 | maintainability | `barter/.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:116` | `local fallback stays on context-index.sqlite` | Replace the singleton fallback description with provider-keyed filenames for all active profiles. |
| L-006-013 | maintainability | `barter/.opencode/skills/system-spec-kit/package.json:39` | `onnxruntime-node` override | Remove the stale `onnxruntime-node` override from the Barter system-spec-kit package mirror. |
| L-006-014 | maintainability | `barter/.opencode/skills/system-spec-kit/mcp_server/package.json:58` | `onnxruntime-common`: `^1.21.0` | Remove the stale direct `onnxruntime-common` dependency from the Barter MCP server package mirror. |
| L-006-015 | maintainability | `barter/.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103` | `auto mode defaults to hf-local with no keys` | Port Barter embedding tests to the post-014 resolver expectation. |
| L-007-001 | correctness | `.opencode/skills/system-spec-kit/package-lock.json:7470` | `onnxruntime-node`: `1.21.0` | Regenerate or repair the lockfile so rejected ONNX runtime package residue is removed or explicitly justified. |
| L-008-001 | traceability | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:209` | `@huggingface/transformers ... brings onnxruntime-common transitively` | Remove or rewrite the current install-guide dependency claim for `onnxruntime-common`. |
| L-010-001 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:674` | `dtype: provider === 'hf-local' ? ... : provider === 'llama-cpp' ? ... : null` | Make `getStartupEmbeddingProfile()` produce canonical dtype-bearing profile slugs for cloud providers too, or centralize dtype token resolution. |
| L-010-002 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:337` | `return new EmbeddingProfile({ provider: 'voyage', model: this.modelName, dim: this.dim, baseUrl: this.baseUrl` | Add the canonical Voyage dtype/profile token when constructing provider profile metadata. |
| L-010-003 | correctness | `.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts:307` | `return new EmbeddingProfile({ provider: 'openai', model: this.modelName, dim: this.dim, baseUrl: this.baseUrl` | Add the canonical OpenAI dtype/profile token when constructing provider profile metadata. |
| L-010-005 | correctness | `.opencode/commands/doctor/assets/doctor_update.yaml:417` | `fs.readdirSync(dir).find((name) => /^context-index__.*\.sqlite$/.test(name))` | Resolve the active profile DB path instead of selecting an arbitrary matching sqlite file. |

## 9. Top P2 Findings (advisories)

| ID | Dimension | File:Line | Evidence | Recommendation |
|----|-----------|-----------|----------|----------------|
| L-002-003 | traceability | `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32` | `optional onnxruntime-node` | Align the feature catalog with the current native module health check. |
| L-003-004 | maintainability | `.gemini/scripts/spec-kit-memory.sh:32` | `DEFAULT_DB_PATH=...context-index__hf-local...` | Remove or rename the unused hf-local fallback constant. |
| L-003-005 | maintainability | `PUBLIC_RELEASE.md:25` | `context-index.sqlite` | Use provider-keyed DB filenames or a neutral placeholder. |
| L-004-003 | correctness | `.opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22` | `context-index.sqlite` production DB path | Locate the active provider-keyed DB or inject a disposable `MEMORY_DB_PATH`. |
| L-004-004 | correctness | `.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:609` | `active hf-local default profile database` | Reword the fixture note as an explicit disposable hf-local fixture DB. |
| L-004-005 | correctness | `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100` | `production context-index.sqlite DB` | Make the eval comment provider-neutral. |
| L-007-002 | correctness | `.opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10` | `Live production context-index.sqlite` | Refer to the active provider-profile database. |
| L-007-003 | correctness | `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169` | `pre-restore-context-index.sqlite` | Derive restore backup names from the actual target DB basename. |
| L-008-002 | traceability | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1165` | `with onnxruntime-common transitively` | Add supersession wording or update version history. |
| L-009-001 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380` | `MEMORY_DB_PATH points directly to context-index.sqlite` | Regenerate or patch compiled fixture copy to provider-neutral wording. |
| L-010-004 | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:246` | `context-index__voyage__voyage-4__1024.sqlite` | Update the assertion to dtype-bearing canonical filename behavior. |

## 10. Recommendation

Scaffold 022-local-llm-legacy-remediation packet.

Top batch-able remediation groups:

| Group | Findings | Primary surfaces |
|-------|----------|------------------|
| Live config and command-pack cascade cleanup | L-001-001 through L-001-006, L-003-003, L-004-001, L-004-002, L-010-005 | `.vscode`, `.opencode/commands`, `.claude/commands`, `.gemini/commands` |
| 017 packet traceability repair | L-002-001, L-002-002, L-005-001 through L-005-008 | `017-llama-cpp-default-flip` docs and metadata |
| Provider profile DB and dtype correctness | L-010-001 through L-010-004 | shared embedding profile factory, Voyage/OpenAI providers, embedding tests |
| Install/docs/test residue cleanup | L-002-003, L-003-001, L-003-002, L-003-004, L-003-005, L-004-003 through L-004-005, L-007-001 through L-009-001 | system-spec-kit install docs, package lock, scripts, fixtures, evals, migrations |
| Barter mirror resync | L-006-001 through L-006-015 | `barter/` config, docs, package, CocoIndex, and test mirrors |

## Appendix A. Excluded as historical context

No row-level finding in the available iteration tables used the `intentional-historical` disposition. The iteration summaries did report excluded historical or intentional categories, and these are not counted in the main tables: archived specs and changelogs, frozen review/evidence artifacts, current review packet files, vitest temp `context-index.sqlite` idioms, backward-compat and legacy model registries, accepted provider cascade descriptions, forensic logs, and prior-iteration duplicates.
