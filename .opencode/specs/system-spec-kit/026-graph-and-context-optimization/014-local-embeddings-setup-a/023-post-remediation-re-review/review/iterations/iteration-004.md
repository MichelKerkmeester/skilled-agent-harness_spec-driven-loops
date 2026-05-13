# Iteration 004 — Local-LLM Legacy Hunt

## Focus
This iteration scanned correctness-sensitive runtime surfaces for post-022 residue: active MCP launchers, doctor command assets, production scripts, embedding profile code, and current config files that can select or inspect the wrong database/provider. I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade and llama-cpp auto-selection as canonical, skipped the 023 packet itself, and did not flag legacy model registries, temp-test sqlite filenames, forensic logs, or historical packet content.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-004-001 | P1 | correctness | .gemini/scripts/spec-kit-memory.sh:11 | "EMBEDDINGS_PROVIDER   - auto \| voyage \| openai \| hf-local (default: auto)" | confirmed-residue | Add `llama-cpp` to the launcher contract so Gemini users see the canonical provider set. |
| L-004-002 | P1 | correctness | .gemini/scripts/spec-kit-memory.sh:32 | "DEFAULT_DB_PATH=\"${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite\"" | confirmed-residue | Stop defaulting `MEMORY_DB_PATH` to the singleton sqlite file; let the server derive the provider-keyed DB from `SPEC_KIT_DB_DIR` or the active profile. |
| L-004-003 | P1 | correctness | .gemini/scripts/spec-kit-memory.sh:33 | "HF_LOCAL_DB_PATH=\"${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__nomic-ai_nomic-embed-text-v1.5__768.sqlite\"" | confirmed-residue | Remove the stale nomic hf-local path or replace it with the current EmbeddingGemma q8 fallback only for explicit hf-local fallback scenarios. |
| L-004-004 | P1 | correctness | .gemini/scripts/spec-kit-memory.sh:50 | "Fall back to HF-local database when no API keys are available" | confirmed-residue | Change the no-cloud-key branch to respect the canonical llama-cpp-when-installed default before hf-local fallback. |
| L-004-005 | P1 | correctness | .gemini/scripts/spec-kit-memory.sh:53 | "auto\|hf-local)" | confirmed-residue | Do not route `auto` through the hf-local DB override; reserve hf-local path pinning for explicit `EMBEDDINGS_PROVIDER=hf-local` if any override remains. |
| L-004-006 | P1 | correctness | .opencode/commands/doctor/scripts/mcp-doctor.sh:200 | "local db_file=\"$db_dir/context-index.sqlite\"" | confirmed-residue | Resolve the active provider profile DB for the database health check instead of checking only the legacy singleton filename. |
| L-004-007 | P1 | correctness | .opencode/commands/doctor/assets/doctor_memory.yaml:22 | "Memory doctor workflows treat context-index.sqlite and the voyage vector DB as" | confirmed-residue | Rewrite the memory doctor invariant around active provider-keyed profile DBs, including llama-cpp and OpenAI profiles. |
| L-004-008 | P1 | correctness | .opencode/commands/doctor/assets/doctor_memory.yaml:64 | "- \"mcp_server/database/context-index.sqlite\"  # primary memory FTS/metadata DB" | confirmed-residue | Replace the fixed allowed target with canonical active-profile DB resolution or a constrained provider-keyed target set. |
| L-004-009 | P1 | correctness | .opencode/commands/doctor/assets/doctor_memory.yaml:145 | "- \"Bash: stat -f '%m %z' database/context-index.sqlite (mtime + size)\"" | confirmed-residue | Make Phase 0 discovery stat the active resolved profile DB rather than the legacy singleton file. |

## Iteration summary
- Files scanned: 3282
- New findings: 9 (P0=0, P1=9, P2=0)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: Saturation is not reached for correctness. The main remaining risk is duplicated active command surfaces: the same singleton-DB assumption appears in doctor router mirrors and update/causal assets already covered by prior iterations, while this pass adds the Gemini launcher and memory-doctor-specific execution path.
