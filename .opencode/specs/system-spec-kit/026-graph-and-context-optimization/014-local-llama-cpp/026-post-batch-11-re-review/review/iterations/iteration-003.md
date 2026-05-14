# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration scanned maintainability surfaces that tend to preserve stale defaults after remediation: generated runtime config templates, command-pack mirrors, launcher scripts, test fixtures, root release notes, and skill references. I prioritized residue that would keep regenerating bad configuration or preserving outdated expectations even after the post-022 documentation fixes.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P1 | maintainability | .opencode/skills/system-spec-kit/scripts/setup/install.sh:195 | "otherwise HF local fallback stays active" | confirmed-residue | Update the generated MCP config note to document the full auto cascade: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local fallback. |
| L-003-002 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103 | "auto mode defaults to hf-local with no keys" | confirmed-residue | Rework the provider-resolution test so no-key auto mode expects llama-cpp when the GGUF runtime probe succeeds and hf-local only when that probe is unavailable. |
| L-003-003 | P1 | maintainability | .gemini/commands/doctor.toml:2 | "`memory`        \| `mcp_server/database/context-index.sqlite` + voyage embedding DB" | confirmed-residue | Regenerate the Gemini `/doctor` command pack from the corrected router source so it names provider-keyed active profile DBs instead of the singleton plus Voyage DB. |
| L-003-004 | P2 | maintainability | .gemini/scripts/spec-kit-memory.sh:32 | "DEFAULT_DB_PATH=\"${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite\"" | confirmed-residue | Remove the unused `DEFAULT_DB_PATH` or rename it to an explicit hf-local fallback constant so the launcher does not imply hf-local is the default active DB. |
| L-003-005 | P2 | maintainability | PUBLIC_RELEASE.md:25 | "context-index.sqlite" | confirmed-residue | Refresh the public release layout example to show provider-keyed active profile DB filenames or a neutral `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` placeholder. |

## Iteration summary
- Files scanned: 11692
- New findings: 5 (P0=0, P1=3, P2=2)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Skipped current review packet artifacts, packet 021/022 artifacts, z_archive, evidence logs, vitest temp-dir `context-index.sqlite` idioms, backward-compat model registry tests, intentional legacy model-dimension lookup tables, and historical migration narratives. The strongest remaining maintainability residue is generated-surface drift: OpenCode/Claude command mirrors are mostly corrected, while Gemini still carries stale generated text.
