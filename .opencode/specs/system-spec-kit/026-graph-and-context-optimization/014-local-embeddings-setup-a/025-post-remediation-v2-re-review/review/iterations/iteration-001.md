# Iteration 001 — Local-LLM Legacy Hunt

## Focus
Scanned the correctness surface for post-022 residue around active embedding profile resolution, provider-keyed sqlite filenames, rejected ONNX runtime package claims, and production-code literals that still name the legacy singleton `context-index.sqlite`. I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp default-local wording, and legacy model registries as intentional per the user clarifications, then read surrounding lines before flagging anything.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-001-001 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:113 | "`\| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` \| Default repo-local memory database used by the checked-in configs \|`" | confirmed-residue | Replace the fixed default DB row with the active profile filename contract: `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-001-002 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:116 | "`local fallback stays on `context-index.sqlite`, while Voyage and OpenAI profiles get their own profile-specific filenames`" | confirmed-residue | Remove the local-fallback exception; hf-local, llama-cpp, OpenAI, and Voyage should all be documented as profile-keyed sqlite files. |
| L-001-003 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:212 | "`- `onnxruntime-common` (ONNX model runtime)`" | confirmed-residue | Update the current dependency list so it no longer claims `onnxruntime-common` is a direct runtime dependency after the ONNX runtime backend rejection. |
| L-001-004 | P1 | correctness | .opencode/skills/system-spec-kit/references/memory/memory_system.md:25 | "`\| Database \| `mcp_server/dist/database/context-index.sqlite` \| SQLite with FTS5 + vector embeddings (canonical runtime path; `mcp_server/database/context-index.sqlite` is a compatibility symlink) \|`" | confirmed-residue | Rewrite the architecture row around the resolved active-profile DB path and keep singleton-path language only as legacy/compatibility context if still needed. |
| L-001-005 | P2 | correctness | .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10 | "`// Live production context-index.sqlite and record results in the`" | confirmed-residue | Refresh the eval script header to reference the active provider-keyed production DB resolved by the shared embedding profile helpers. |
| L-001-006 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100 | "`* IDs were mapped from the production context-index.sqlite DB via`" | confirmed-residue | Reword the comment to avoid teaching the singleton DB name; reference the production memory DB mapping script or active-profile DB generically. |
| L-001-007 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169 | "`${toTimestampId(now)}__pre-restore-context-index.sqlite`," | confirmed-residue | Use a neutral backup suffix such as `pre-restore-memory-db.sqlite`, or include the active profile key when naming restore backups. |

## Iteration summary
- Files scanned: 4337
- New findings: 7 (P0=0, P1=4, P2=3)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: Saturation is already visible for correctness. I did not flag the canonical cloud/local cascade, the committed llama-cpp default DB notes, Voyage auto-pick wording, legacy model-dimension registries, `test_backward_compat.py`, vitest temp-dir `context-index.sqlite` idioms, doctor provider-detection branches, frozen review/evidence/archive artifacts, or package-lock transitive ONNX entries from `@huggingface/transformers`.
