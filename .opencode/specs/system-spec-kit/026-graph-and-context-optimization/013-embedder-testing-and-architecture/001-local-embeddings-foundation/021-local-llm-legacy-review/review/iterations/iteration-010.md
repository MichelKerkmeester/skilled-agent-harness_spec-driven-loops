# Iteration 010 — Local-LLM Legacy Hunt

## Focus
I scanned correctness-oriented source and config surfaces for post-014 default drift: runtime provider resolution hints, installer-generated MCP config, profile-derived database handling, package manifests, and ONNX/runtime residue. The pass intentionally filtered out the 014 migration narrative, optional provider registries, fallback-provider implementations, backward-compatibility tests, and already-reported findings from iterations 001-009.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .mcp.json:20 | `"_NOTE_3_EMBEDDINGS_PROVIDER": "Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'",` | confirmed-residue | Align the root MCP config note with the canonical hf-local default and present cloud providers as explicit/optional, not the visible `auto` cascade. |
| L-010-002 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:145 | `const LLAMA_CPP_INSTALL_HINT = "Run 'bash .opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh' to enable the faster default.";` | confirmed-residue | Change the runtime hint to say the installer enables explicit `EMBEDDINGS_PROVIDER=llama-cpp`; hf-local remains the default no-key profile. |
| L-010-003 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/setup/install.sh:195 | `"_NOTE_3_CLOUD_PROVIDERS": "In auto mode: VOYAGE_API_KEY selects Voyage embeddings + rerank-2.5, OPENAI_API_KEY selects OpenAI, otherwise HF local fallback stays active",` | confirmed-residue | Update the installer-generated config note so new configs lead with `auto -> hf-local` for no-key startup and keep cloud providers as explicit opt-in guidance. |
| L-010-004 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/setup/install.sh:253 | `local local_fallback_db_path="${canonical_db_dir}/context-index.sqlite"` | confirmed-residue | Replace the legacy generic sqlite probe with active-profile database resolution, or remove the probe and only report the derived database directory. |
| L-010-005 | P2 | correctness | .opencode/skills/system-spec-kit/package.json:50 | `"onnxruntime-common": "^1.21.0"` | confirmed-residue | Remove or justify the direct `onnxruntime-common` dependency after the ONNX runtime backend rejection; keep only dependencies required by the accepted hf-local path. |
| L-010-006 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/package.json:58 | `"onnxruntime-common": "^1.21.0",` | confirmed-residue | Remove or justify the MCP server's direct `onnxruntime-common` dependency so package manifests do not preserve rejected-backend residue. |

## Iteration summary
- Files scanned: 175
- New findings: 6 (P0=0, P1=4, P2=2)
- Out-of-scope/historical noted but NOT flagged: 7
- Notes: Correctness is near saturation. Remaining unflagged hits were mostly optional provider code, backward-compat tests, Qwen registry entries kept for opt-in, package-lock transitive dependencies, local reranker `node-llama-cpp` references, and the intentional 014 migration/spec history.
