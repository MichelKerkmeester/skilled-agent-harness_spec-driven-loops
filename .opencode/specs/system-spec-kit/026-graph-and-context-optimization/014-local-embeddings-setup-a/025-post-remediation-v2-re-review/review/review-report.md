# Deep Review Report — Post-Remediation V2 Re-Review

## 1. Stop Reason — "max_iterations_reached" (10/10 artifact-confirmed; prompt expected 20/20)

The synthesis prompt says 20/20, but the local source artifacts under `review/iterations/` contain `iteration-001.md` through `iteration-010.md` only. `deep-review-config.json` and `deep-review-state.jsonl` also record `maxIterations: 10`. Findings below use the iteration files as source of truth.

## 2. Iteration Count — 10 artifact-confirmed

Ten iteration markdown files were read. No `iteration-011.md` through `iteration-020.md` files exist in the requested path.

## 3. Dimension Coverage

| Dimension | Finding Count After Dedup |
|-----------|---------------------------|
| correctness | 30 |
| traceability | 28 |
| maintainability | 25 |

## 4. Severity Counts

| Severity | Total After Dedup |
|----------|-------------------|
| P0 | 0 |
| P1 | 51 |
| P2 | 32 |

## 5. Verdict — CONDITIONAL

CONDITIONAL because P1 findings are present. hasAdvisories=true because P2 findings are present.

## 6. Release-Readiness

The canonical post-014 default state is not yet consistent across the repo. Runtime intent appears stable around the Voyage -> OpenAI -> llama-cpp -> hf-local cascade and profile-keyed database filenames, but documentation, command mirrors, installer notes, fixtures, and troubleshooting surfaces still expose singleton DB names, dtype-less Voyage filenames, stale hf-local-only fallback wording, ONNX runtime claims, MiniLM/Nomic defaults, or Voyage Code 3 default guidance. No P0 blocks were reported, but the P1 spread is broad enough that closing the remediation packet as clean would be premature.

## 7. Top P0 Findings

No P0 findings after dedup.

## 8. Top P1 Findings

| ID | Dimension | File:Line | Evidence | Recommendation |
|----|-----------|-----------|----------|----------------|
| L-010-001 | correctness | .claude/commands/doctor.md:43 | "`mcp_server/database/context-index.sqlite` + voyage embedding DB" | Regenerate the Claude `/doctor` mirror so the memory mutation boundary names the active profile-keyed DB contract instead of singleton + vague Voyage sidecar. |
| L-010-002 | correctness | .claude/commands/doctor.md:44 | "`mcp_server/database/context-index.sqlite` causal_edges table" | Update the causal-graph location to resolve the active profile-keyed memory DB that hosts `causal_edges`. |
| L-010-012 | correctness | .claude/commands/doctor/assets/doctor_causal-graph.yaml:161 | `"Bash: stat -f '%m %z' mcp_server/database/context-index.sqlite"` | Probe the resolved active profile DB path so Claude `/doctor causal-graph` does not report the live DB as missing. |
| L-010-011 | correctness | .claude/commands/doctor/assets/doctor_causal-graph.yaml:78 | `"mcp_server/database/context-index.sqlite"  # host DB for causal_edges table` | Resolve the causal-graph host DB through the active embedding profile instead of whitelisting the singleton filename. |
| L-010-008 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:102 | `"mcp_server/database/context-index.sqlite"  # memory FTS/metadata DB` | Change the Claude YAML allowed target to the active profile-keyed memory DB contract or resolve the concrete DB at runtime. |
| L-010-009 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:104 | `"mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"  # memory vector DB` | Replace the stale Voyage literal with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-010-010 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:416 | `const db = new Database('.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite');` | Use `resolveActiveProfileDbPath` or the same shared profile resolver used by the runtime before counting indexed specs. |
| L-010-003 | correctness | .claude/commands/doctor/update.md:213 | "`mcp_server/database/context-index.sqlite`" | Replace the `/doctor:update` context-index contract with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a resolver-backed active DB path. |
| L-010-004 | correctness | .claude/commands/doctor/update.md:214 | "`mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | Replace the dtype-less hardcoded Voyage vector DB with the profile-keyed pattern, including the dtype segment. |
| L-010-005 | correctness | .claude/commands/doctor/update.md:268 | "`mcp_server/database/context-index.sqlite` and `mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak`" | Snapshot/rollback boundaries should be derived from the resolved active profile filename, not the removed singleton DB. |
| L-010-006 | correctness | .claude/commands/doctor/update.md:269 | "`mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` and `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite.pre-doctor-update.*.bak`" | Use a dtype-bearing profile-keyed vector DB boundary or runtime-resolved active DB example. |
| L-010-007 | correctness | .claude/commands/doctor/update.md:323 | "`snapshot_path\": \"mcp_server/database/context-index.sqlite.pre-doctor-update.3.4.1.0.20260509T130100Z.bak`" | Regenerate the state-log example from an active profile-keyed DB snapshot path. |
| L-007-005 | correctness | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:161 | `"Bash: stat -f '%m %z' mcp_server/database/context-index.sqlite"` | Replace the hardcoded stat probe with a resolved active DB path probe so causal-graph diagnostics do not report the active profile DB as missing. |
| L-007-004 | correctness | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:78 | `"mcp_server/database/context-index.sqlite"  # host DB for causal_edges table` | Change the causal-graph mutation boundary to resolve the active profile-keyed memory DB path instead of whitelisting the removed singleton. |
| L-007-001 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:102 | `"mcp_server/database/context-index.sqlite"  # memory FTS/metadata DB` | Replace the singleton memory DB allowed target with the active profile-keyed DB resolution contract, or resolve the concrete active DB path at runtime before snapshot/mutation validation. |
| L-007-002 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:104 | `"mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"  # memory vector DB` | Update doctor update's vector DB boundary to include the dtype-bearing profile filename pattern, e.g. `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`, instead of the stale Voyage literal. |
| L-007-003 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:416 | `const db = new Database('.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite');` | Resolve the active profile DB path via the shared embedding profile helper before counting indexed specs; the current post-run count can inspect the wrong database. |
| L-008-003 | traceability | .opencode/install_guides/README.md:1289 | "sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__*.sqlite \"SELECT COUNT(*) FROM memory_index;\"" | Make the troubleshooting command use the actual file selected by the preceding `ls context-index__*.sqlite` step, not a llama-cpp-only wildcard. |
| L-008-002 | traceability | .opencode/install_guides/README.md:643 | "- [ ] Embeddings provider loads on first run (OpenAI or HF local depending on config)" | Replace the stale validation note with the canonical first-run resolver: Voyage if keyed, OpenAI if keyed, llama-cpp when GGUF runtime is available, then hf-local. |
| L-005-010 | traceability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:446 | "**Cloud alternative:** `voyage/voyage-code-3` via LiteLLM provider. Requires `VOYAGE_API_KEY` and a full index rebuild." | Change the install guide cloud alternative to `voyage/voyage-4` or clearly label Voyage Code 3 as legacy/non-default. |
| L-005-011 | traceability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:620 | "\\| **Cloud option** \\| Voyage Code 3 via LiteLLM (API key required, rebuild required)             \\|" | Update the summary table to name the canonical Voyage cloud model (`voyage-4`) instead of Voyage Code 3. |
| L-005-008 | traceability | .opencode/skills/mcp-coco-index/README.md:162 | "Available alternatives include `voyage/voyage-code-3` (1024d cloud via LiteLLM, requires `VOYAGE_API_KEY`)." | Replace the visible Voyage alternative with `voyage/voyage-4`, or mark `voyage-code-3` as a non-default legacy/code-search option. |
| L-006-007 | maintainability | .opencode/skills/mcp-coco-index/README.md:210 | "\| `voyage/voyage-code-3` \| Cloud via LiteLLM \| 1024 \| `VOYAGE_API_KEY` \| Higher dimensional cloud embeddings (requires API key) \|" | Replace this repeated model-table entry with `voyage/voyage-4` or move `voyage-code-3` into explicitly legacy/alternate documentation. |
| L-005-009 | traceability | .opencode/skills/mcp-coco-index/README.md:506 | "Switch to `voyage/voyage-code-3` (1024d cloud via LiteLLM) when you want higher-dimensional cloud embeddings" | Update the recommendation path to `voyage/voyage-4` and remove the promotional Voyage Code 3 rationale unless it is explicitly framed as a non-default alternative. |
| L-005-005 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:127 | "`voyage/voyage-code-3`" | Align the supported cloud model table with `voyage/voyage-4` as the current Voyage default and move `voyage-code-3` to clearly marked legacy/alternate status if retained. |
| L-005-006 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:202 | "`VOYAGE_API_KEY` \\| `voyage/voyage-code-3`" | Map `VOYAGE_API_KEY` to `voyage/voyage-4` in default/shortcut documentation. |
| L-005-003 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:55 | "### Example: Voyage Code 3 Cloud Model" | Update the cloud example heading to the canonical Voyage default (`voyage/voyage-4`) or label Voyage Code 3 as a non-default legacy/code-search alternative. |
| L-005-004 | traceability | .opencode/skills/mcp-coco-index/references/settings_reference.md:60 | "model: voyage/voyage-code-3" | Change the example model to `voyage/voyage-4`, unless this section is explicitly retitled as a legacy/non-default alternative. |
| L-006-006 | maintainability | .opencode/skills/mcp-coco-index/SKILL.md:272 | "\| `voyage/voyage-code-3` \| Cloud via LiteLLM \| 1024 \| `VOYAGE_API_KEY` required \| Cloud alternative requiring a rebuild \|" | Align the skill's embedding model table with canonical `voyage/voyage-4`, keeping `voyage-code-3` only as clearly marked legacy/non-default support if needed. |
| L-005-001 | traceability | .opencode/skills/system-spec-kit/.env.example:66 | "#   1. Set EMBEDDINGS_PROVIDER explicitly (otherwise auto-cascade picks VOYAGE → OPENAI → llama-cpp → hf-local)" | Change the setup checklist so `EMBEDDINGS_PROVIDER=auto`/unset is the recommended default; mention explicit provider selection only as an override. |
| L-002-005 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1019 | "`cp .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | Backup instructions should copy the active profile-keyed DB rather than the removed singleton filename. |
| L-002-006 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1059 | "`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`" | Restore instructions should target the same active profile DB path that was backed up. |
| L-002-007 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1081 | "`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` \\\| Canonical database (runtime)" | Replace the resource-table row with the profile-keyed sqlite naming pattern and resolver source. |
| L-002-008 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1113 | "`sqlite3 mcp_server/database/context-index.sqlite \\`" | Update the operational checklist's database inspection commands to require the resolved active profile DB. |
| L-001-001 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:113 | "`\\| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` \\| Default repo-local memory database used by the checked-in configs \\|`" | Replace the fixed default DB row with the active profile filename contract: `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-002-009 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1138 | "`DB PATH:      mcp_server/database/context-index.sqlite`" | Replace the quick-reference DB path with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-001-002 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:116 | "`local fallback stays on `context-index.sqlite`, while Voyage and OpenAI profiles get their own profile-specific filenames`" | Remove the local-fallback exception; hf-local, llama-cpp, OpenAI, and Voyage should all be documented as profile-keyed sqlite files. |
| L-002-002 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120 | "`code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)" | Replace the singleton memory DB reference with "stored in the active memory DB directory" or the profile-keyed DB contract. |
| L-001-003 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:212 | "`- `onnxruntime-common` (ONNX model runtime)`" | Update the current dependency list so it no longer claims `onnxruntime-common` is a direct runtime dependency after the ONNX runtime backend rejection. |
| L-002-001 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:82 | "`mcp_server/database/context-index.sqlite (memory)`" | Update the architecture diagram to describe the active profile-keyed memory DB filename contract. |
| L-002-003 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:826 | "`sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | Change troubleshooting commands to resolve or substitute the active profile-keyed sqlite path before querying. |
| L-002-004 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:948 | "`sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | Refresh the empty-memory diagnostic block to use the resolved active profile DB path. |
| L-006-003 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103 | "it('T513-01d: auto mode defaults to hf-local with no keys', () => {" | Rename/split the test so hf-local is expected only when llama-cpp is mocked unavailable, and add coverage for llama-cpp auto-selection when installed. |
| L-008-004 | traceability | .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:50 | "│    Quality: Highest (optimized for code/technical content)        │" | Remove the unsubstantiated quality ranking and describe Voyage neutrally as the first cloud provider selected when `VOYAGE_API_KEY` is present. |
| L-001-004 | correctness | .opencode/skills/system-spec-kit/references/memory/memory_system.md:25 | "`\\| Database \\| `mcp_server/dist/database/context-index.sqlite` \\| SQLite with FTS5 + vector embeddings (canonical runtime path; `mcp_server/database/context-index.sqlite` is a compatibility symlink) \\|`" | Rewrite the architecture row around the resolved active-profile DB path and keep singleton-path language only as legacy/compatibility context if still needed. |
| L-004-001 | correctness | .opencode/skills/system-spec-kit/scripts/setup/install.sh:195 | `"_NOTE_3_CLOUD_PROVIDERS": "In auto mode: VOYAGE_API_KEY selects Voyage embeddings + rerank-2.5, OPENAI_API_KEY selects OpenAI, otherwise HF local fallback stays active"` | Update the generated MCP config note to the canonical auto cascade: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local fallback. |
| L-007-006 | correctness | .vscode/mcp.json:20 | `"Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'"` | Align the committed VS Code MCP config note with the canonical cascade: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local, and include `llama-cpp` in options. |
| L-007-007 | correctness | .vscode/mcp.json:22 | `"Get Voyage key: https://dash.voyageai.com/api-keys (recommended, 8% better than OpenAI)"` | Remove the marketing/performance claim or replace it with neutral key setup text; Voyage auto-selection is intentional, but the unsubstantiated "8% better" recommendation is not canonical. |
| L-007-008 | correctness | .vscode/mcp.json:39 | `"Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"` | Update the CocoIndex VS Code MCP note to the canonical default `google/embeddinggemma-300m` with 768 dimensions, or point to the shared settings resolver. |
| L-004-002 | correctness | opencode.json:50 | `"_NOTE_3": "If you switch to LiteLLM with VOYAGE_API_KEY, use voyage/voyage-code-3 for code embeddings"` | Align the checked-in CocoIndex config note with the canonical Voyage default (`voyage/voyage-4`) or explicitly label `voyage-code-3` as a non-default legacy/code-search alternative. |
| L-007-009 | correctness | PUBLIC_RELEASE.md:25 | `context-index.sqlite` | Replace the project-local database example with a profile-keyed sqlite filename or a wildcard/profile pattern so consumer projects do not seed the obsolete singleton path. |

## 9. Top P2 Findings (advisories)

| ID | Dimension | File:Line | Advisory |
|----|-----------|-----------|----------|
| L-009-008 | maintainability | .gemini/commands/doctor.toml:2 | Regenerate the Gemini `/doctor` command mirror after fixing the OpenCode prompt source. |
| L-009-009 | maintainability | .gemini/commands/doctor/update.toml:2 | Regenerate the Gemini `/doctor update` command mirror so it stops shipping the dtype-less Voyage DB literal. |
| L-009-001 | maintainability | .opencode/commands/doctor.md:43 | Update the router prompt-pack Gate 3 table to describe resolved profile-keyed memory DBs rather than the singleton DB plus an unnamed Voyage sidecar. |
| L-009-002 | maintainability | .opencode/commands/doctor.md:44 | Change the causal-graph command prompt source to refer to the active profile-keyed memory DB or resolver, not a fixed singleton file. |
| L-009-003 | maintainability | .opencode/commands/doctor/update.md:213 | Refresh the `/doctor:update` subsystem contract to use the active profile DB path contract. |
| L-009-004 | maintainability | .opencode/commands/doctor/update.md:214 | Replace the dtype-less hardcoded Voyage filename with the profile-keyed pattern or runtime-resolved active DB path. |
| L-009-005 | maintainability | .opencode/commands/doctor/update.md:268 | Update mutation-boundary examples so snapshots are keyed from the resolved active profile filename. |
| L-009-006 | maintainability | .opencode/commands/doctor/update.md:269 | Replace the stale Voyage literal with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a resolver-backed example. |
| L-009-007 | maintainability | .opencode/commands/doctor/update.md:323 | Regenerate the state-log example from a profile-keyed DB snapshot path. |
| L-008-001 | traceability | .opencode/install_guides/README.md:567 | Change the count to four concrete providers, or say "multiple embedding providers" so it matches the table and canonical resolver. |
| L-003-005 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:161 | Align the optional Voyage template with the canonical `voyage-4` default, or explicitly mark `voyage-code-3` as a non-default legacy/code-search alternative. |
| L-006-004 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:180 | Update the optional cloud embedding template to `voyage/voyage-4`, or label `voyage-code-3` as a non-default legacy alternative. |
| L-006-009 | maintainability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:844 | Update the external-resource pointer to Voyage 4/current Voyage embeddings docs, or mark the Code 3 pointer as legacy. |
| L-005-007 | traceability | .opencode/skills/mcp-coco-index/README.md:160 | Qualify this as same EmbeddingGemma family/dimension only, or remove it unless Memory MCP and CocoIndex are proven to use the exact same model/runtime vector space. |
| L-006-008 | maintainability | .opencode/skills/mcp-coco-index/README.md:278 | Refresh the settings example comment to reference `voyage/voyage-4` as the current cloud alternative. |
| L-006-005 | maintainability | .opencode/skills/mcp-coco-index/SKILL.md:8 | Remove the stale `voyage-code-3` routing keyword or replace it with `voyage-4` so skill discovery metadata matches current defaults. |
| L-005-002 | traceability | .opencode/skills/system-spec-kit/.env.example:15 | Replace the marketing recommendation with neutral wording such as "Voyage AI (cloud provider selected when `VOYAGE_API_KEY` is set)". |
| L-002-010 | traceability | .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32 | Remove the ONNX runtime probe from current setup-traceability docs, or mark it historical if the probe no longer applies post-014. |
| L-009-011 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md:46 | Refresh the manual playbook example to a dtype-bearing Voyage profile filename or a wildcard that preserves the dtype segment. |
| L-001-006 | correctness | .opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100 | Reword the comment to avoid teaching the singleton DB name; reference the production memory DB mapping script or active-profile DB generically. |
| L-003-002 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210 | Replace the provider-specific Nomic wording with provider-neutral embedding text, or name current EmbeddingGemma profiles plus legacy compatibility separately. |
| L-001-007 | correctness | .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169 | Use a neutral backup suffix such as `pre-restore-memory-db.sqlite`, or include the active profile key when naming restore backups. |
| L-009-010 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:246 | Update the startup-profile assertion to the canonical dtype-bearing profile filename or make the expected path come from `resolveActiveProfileDbPath`. |
| L-008-007 | traceability | .opencode/skills/system-spec-kit/README.md:687 | Distinguish four concrete providers from the `auto` resolver mode so the count does not imply an extra embedding backend. |
| L-001-005 | correctness | .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10 | Refresh the eval script header to reference the active provider-keyed production DB resolved by the shared embedding profile helpers. |
| L-006-001 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:194 | Regenerate or patch the compiled fixture to match the TypeScript source's active hf-local profile DB filename. |
| L-006-002 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380 | Refresh the seeded fixture text to name the active profile-keyed disposable DB instead of the singleton filename. |
| L-003-003 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22 | Update this non-vitest functional fixture to resolve the active profile-keyed DB path or label the singleton path as a legacy compatibility fixture. |
| L-003-004 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:942 | Refresh the path-alignment assertion so it no longer encodes the old singleton DB as the expected runtime location. |
| L-003-001 | maintainability | .opencode/skills/system-spec-kit/shared/chunking.ts:18 | Reword the shared chunking comment around the current provider-neutral limit, or cite current EmbeddingGemma/local profile constraints instead of Nomic. |
| L-008-006 | traceability | .opencode/skills/system-spec-kit/shared/README.md:260 | Expand the auto-detection description to include API-key precedence plus local llama-cpp probing and hf-local fallback. |
| L-008-005 | traceability | .opencode/skills/system-spec-kit/shared/types.ts:53 | Include `llama-cpp` in the provider list or make the comment provider-neutral. |

## 10. Recommendation

Scaffold 022-local-llm-legacy-remediation packet.

Top batch-able remediation groups:

| Group | Scope | Representative Findings |
|-------|-------|-------------------------|
| Profile-keyed DB docs and commands | Replace singleton `context-index.sqlite` and dtype-less Voyage examples in install guides, memory docs, doctor command assets, and mirrors. | L-001-001, L-002-001..L-002-009, L-007-001..L-007-005, L-009-001..L-009-007, L-010-001..L-010-012 |
| Canonical auto-cascade wording | Align setup notes, VS Code MCP notes, install guides, and embedding resilience docs with Voyage -> OpenAI -> llama-cpp -> hf-local. | L-004-001, L-005-001, L-007-006, L-008-002, L-008-004 |
| CocoIndex cloud model cleanup | Replace visible Voyage Code 3 default/alternative guidance with Voyage 4 or explicitly mark Code 3 as legacy/non-default. | L-003-005, L-004-002, L-005-003..L-005-011, L-006-004..L-006-009 |
| Test and fixture refresh | Update fixtures and embedding tests that still assert singleton or dtype-less profile DB names and hf-local-only auto behavior. | L-003-003, L-003-004, L-006-001..L-006-003, L-009-010 |
| Low-risk advisory polish | Neutralize marketing/performance claims, provider counts, and comments that can rot future traces. | L-005-002, L-005-007, L-008-001, L-008-005..L-008-007 |

## Appendix A. Excluded as Historical Context

No finding-table row used the `intentional-historical` disposition, so no rows were counted here. Iteration summaries reported 330 out-of-scope/historical hits that were intentionally not flagged. Recurring exclusions were frozen review/evidence/archive artifacts, historical changelogs and playbooks, allowed legacy model registries, `test_backward_compat.py`, vitest temp database idioms, package-lock/transitive ONNX references, and already-covered prior iteration findings.

- Saturation is already visible for correctness. I did not flag the canonical cloud/local cascade, the committed llama-cpp default DB notes, Voyage auto-pick wording, legacy model-dimension registries, `test_backward_compat.py`, vitest temp-dir `context-index.sqlite` idioms, doctor provider-detection branches, frozen review/evidence/archive artifacts, or package-lock transitive ONNX entries from `@huggingface/transformers`.
- Saturation is emerging outside the System Spec Kit install guide. CocoIndex `voyage-code-3` references were not flagged because they describe an optional cloud alternative, not the memory MCP default. Model registry/backward-compatibility references to Nomic/MiniLM and test-fixture `context-index.sqlite` paths were also left unflagged per the prompt constraints.
- Saturation is starting on maintainability residue. Most remaining hits are prior iteration duplicates, intentional legacy registries, vitest temp-dir DB patterns, current llama-cpp default-local wording, historical changelogs/research, or CocoIndex references that correctly name EmbeddingGemma as the default while listing optional alternatives.
- Saturation reached for the correctness pass. Remaining hits were prior-iteration duplicates (`INSTALL_GUIDE.md`, `memory_system.md`, `run-bm25-baseline.ts`, `ground-truth-generator.ts`, `restore-checkpoint.ts`, `chunking.ts`, `content-normalizer.ts`, `test-folder-detector-functional.js`, `config_templates.md`), allowed legacy lookup registries (`nomic-ai/nomic-embed-text-v1.5`, `voyage-code-3` dimensions), vitest/temp DB fixtures using `context-index.sqlite`, package-lock/node_modules transitive ONNX entries, and historical changelog/playbook text rather than current default-asserting production behavior.
- Prior iteration findings in `INSTALL_GUIDE.md`, `opencode.json`, `config_templates.md`, singleton `context-index.sqlite` references, legacy hf-local model registries, vitest temp DB names, and frozen review/evidence artifacts were treated as covered or intentional and were not duplicated.
- No new ONNX runtime package manifest residue was found in package.json/pyproject surfaces. I treated the resolver cascade, llama-cpp auto-selection, Voyage auto-pick, provider model-dimension registries, `test_backward_compat.py`, package-lock transitive ONNX strings, vitest temp `context-index.sqlite` filenames, and prior-iteration duplicate lines as non-findings. Saturation is starting to show: the remaining fresh residue is mostly duplicated CocoIndex auxiliary text plus one stale generated fixture/test pair.
- Saturation is starting on the mcp-coco documentation side; most remaining new correctness residue is in doctor workflow assets and alternate runtime config mirrors. I did not re-flag prior mcp-coco `voyage-code-3` docs, vitest temp `context-index.sqlite` fixtures, intentional legacy model registries, `test_backward_compat.py`, historical changelogs, or package-lock transitive ONNX entries.
- Saturation is close for traceability. Most high-signal hits remaining in the broad sweep were already covered by iterations 001-007, explicitly historical changelogs/review artifacts, intentional legacy model registries, or accepted cloud-key/local fallback cascade wording.
- Saturation is close for maintainability. Most remaining hits were already covered in iterations 001-008, intentional legacy-model lookup support, allowed `test_backward_compat.py` assertions, vitest temp-dir `context-index.sqlite` idioms, or excluded forensic/history paths.
- No new disagreement with the clarified Voyage -> OpenAI -> llama-cpp -> hf-local cascade was found. ONNX hits were limited to already-covered docs or dependency-lock/transitive contexts, and MiniLM/Nomic hits were either already covered, intentional backward-compat tests, or legacy model registry support.

