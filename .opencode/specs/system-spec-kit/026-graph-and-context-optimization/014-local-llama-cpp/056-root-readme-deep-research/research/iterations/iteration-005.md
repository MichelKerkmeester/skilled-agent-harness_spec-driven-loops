# Iter 005 — Track 2: File Paths and Environment Variables Verification

## Summary

Verified 20 distinct file paths and 12 environment variables cited in README.md against the actual filesystem and codebase.

## File Paths Verification

All 20 sampled file paths resolve successfully:

| # | Path | Status | Notes |
|---|------|--------|-------|
| 1 | `.opencode/skills/mcp-coco-index/NOTICE` | ✅ RESOLVES | File exists, 2035 bytes |
| 2 | `.opencode/skills/system-code-graph/` | ✅ RESOLVES | Directory exists |
| 3 | `.opencode/skills/system-spec-kit/mcp_server` | ✅ RESOLVES | Directory exists |
| 4 | `.opencode/skills/system-skill-advisor/mcp_server` | ✅ RESOLVES | Directory exists |
| 5 | `.opencode/skills/system-spec-kit/scripts` | ✅ RESOLVES | Directory exists |
| 6 | `.opencode/skills/mcp-coco-index/scripts/install.sh` | ✅ RESOLVES | Executable script exists |
| 7 | `.opencode/skills/system-spec-kit/scripts/spec/` | ✅ RESOLVES | Directory exists |
| 8 | `.opencode/skills/system-spec-kit/scripts/memory/` | ✅ RESOLVES | Directory exists |
| 9 | `.opencode/skills/system-spec-kit/scripts/dist/` | ✅ RESOLVES | Directory exists |
| 10 | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | ✅ RESOLVES | File exists, 32732 bytes |
| 11 | `.opencode/skills/system-spec-kit/README.md` | ✅ RESOLVES | File exists, 78453 bytes |
| 12 | `AGENTS.md` | ✅ RESOLVES | File exists, 37360 bytes |
| 13 | `.opencode/skills/system-code-graph/README.md` | ✅ RESOLVES | File exists, 13785 bytes |
| 14 | `.opencode/skills/system-spec-kit/mcp_server/README.md` | ✅ RESOLVES | File exists, 15736 bytes |
| 15 | `.opencode/skills/system-code-graph/feature_catalog` | ✅ RESOLVES | Directory exists |
| 16 | `.opencode/skills/system-code-graph/manual_testing_playbook` | ✅ RESOLVES | Directory exists |
| 17 | `.opencode/skills/system-code-graph/SKILL.md` | ✅ RESOLVES | File exists, 8228 bytes |
| 18 | `.opencode/skills/system-skill-advisor/README.md` | ✅ RESOLVES | File exists, 8367 bytes |
| 19 | `.opencode/agents/` | ✅ RESOLVES | Directory exists |
| 20 | `.claude/agents/` | ✅ RESOLVES | Directory exists |
| 21 | `.opencode/skills/sk-doc/SKILL.md` | ✅ RESOLVES | File exists, 25051 bytes |
| 22 | `.opencode/skills/README.md` | ✅ RESOLVES | File exists, 23041 bytes |
| 23 | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | ✅ RESOLVES | File exists, 398417 bytes |
| 24 | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | ✅ RESOLVES | File exists, 5755 bytes |
| 25 | `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | ✅ RESOLVES | File exists, 9215 bytes |
| 26 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/` | ✅ RESOLVES | Directory exists |
| 27 | `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/` | ✅ RESOLVES | Directory exists |

**File path findings: 0 broken paths**

## Environment Variables Verification

All 12 sampled environment variables are referenced in the codebase:

| # | Env Var | Launcher Binary | Skill Code | Status |
|---|---------|-----------------|------------|--------|
| 1 | `VOYAGE_API_KEY` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | ✅ VERIFIED |
| 2 | `OPENAI_API_KEY` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | ✅ VERIFIED |
| 3 | `SPECKIT_CODE_GRAPH_INDEX_SKILLS` | ✅ Found in `mk-code-index-launcher.cjs` | ✅ Found in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | ✅ VERIFIED |
| 4 | `SPECKIT_CODE_GRAPH_INDEX_AGENTS` | ❌ Not found | ✅ Found in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | ✅ VERIFIED |
| 5 | `SPECKIT_CODE_GRAPH_INDEX_COMMANDS` | ❌ Not found | ✅ Found in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | ✅ VERIFIED |
| 6 | `SPECKIT_CODE_GRAPH_INDEX_SPECS` | ❌ Not found | ✅ Found in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | ✅ VERIFIED |
| 7 | `SPECKIT_CODE_GRAPH_INDEX_PLUGINS` | ❌ Not found | ✅ Found in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | ✅ VERIFIED |
| 8 | `SPECKIT_CODE_GRAPH_DB_DIR` | ❌ Not found | ✅ Found in `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | ✅ VERIFIED |
| 9 | `SPECKIT_RETENTION_SWEEP` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | ✅ VERIFIED |
| 10 | `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | ✅ VERIFIED |
| 11 | `MCP_SESSION_RESUME_AUTH_MODE` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | ✅ VERIFIED |
| 12 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` | ❌ Not found | ✅ Found in `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` | ✅ VERIFIED |

Additional env vars verified:
| # | Env Var | Launcher Binary | Skill Code | Status |
|---|---------|-----------------|------------|--------|
| 13 | `LLAMA_CPP_EMBEDDINGS_MODEL` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | ✅ VERIFIED |
| 14 | `HF_EMBEDDINGS_DTYPE` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.js` | ✅ VERIFIED |
| 15 | `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | ✅ VERIFIED |
| 16 | `MEMORY_DB_PATH` | ❌ Not found | ✅ Found in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | ✅ VERIFIED |
| 17 | `CLICKUP_API_KEY` | ❌ Not found | ✅ Found in `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | ✅ VERIFIED |
| 18 | `FIGMA_API_KEY` | ❌ Not found | ✅ Found in `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | ✅ VERIFIED |
| 19 | `GITHUB_PERSONAL_ACCESS_TOKEN` | ❌ Not found | ✅ Found in `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | ✅ VERIFIED |

**Environment variable findings: 0 missing env vars**

## Additional Notes

- `.opencode/bin/` directory exists with 3 launcher binaries: `mk-code-index-launcher.cjs`, `mk-skill-advisor-launcher.cjs`, `mk-spec-memory-launcher.cjs`
- `.env` file exists and contains Code Mode prefixed versions of some env vars (`clickup_CLICKUP_API_KEY`, `figma_FIGMA_API_KEY`, `github_GITHUB_PERSONAL_ACCESS_TOKEN`) plus `SPECKIT_ABLATION=true`
- Most env vars are referenced in skill code rather than launcher binaries
- Code-graph scope env vars are primarily in the `system-code-graph` skill
- Memory-related env vars are primarily in the `system-spec-kit` skill
- Code Mode integration env vars are documented in `mcp-code-mode/INSTALL_GUIDE.md`

ITER_005_COMPLETE: 0 findings, newInfoRatio=0.00
