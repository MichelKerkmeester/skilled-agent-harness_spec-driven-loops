# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This pass scanned maintained command manifests, installer templates, provider-resolution tests, eval helpers, and prompt/config surfaces for maintainability residue left after packet 022. The emphasis was on fixture rot, command/template drift, and stale test assertions that still encode the pre-014 singleton database or hf-local-default mental model while excluding historical packets, review artifacts, evidence files, legacy compatibility registries, and vitest temp-directory idioms.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-006-001 | P1 | maintainability | .opencode/skills/system-spec-kit/scripts/setup/install.sh:195 | "otherwise HF local fallback stays active" | confirmed-residue | Update the generated MCP config note so auto mode documents Voyage -> OpenAI -> llama-cpp -> hf-local, with hf-local only as the final fallback. |
| L-006-002 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103 | "auto mode defaults to hf-local with no keys" | confirmed-residue | Rework this test to model llama-cpp availability explicitly: assert llama-cpp when the GGUF runtime is available and hf-local only when the availability probe fails. |
| L-006-003 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:249 | "startup profile keeps the local fallback database path when no API keys are present" | confirmed-residue | Change the startup-profile test to expect the llama-cpp profile DB under the installed-runtime path, or rename/setup it as an explicit llama-cpp-unavailable fallback case. |
| L-006-004 | P1 | maintainability | .opencode/commands/doctor/_routes.yaml:29 | "mcp_server/database/context-index.sqlite + context-index__voyage__voyage-4__1024.sqlite" | confirmed-residue | Replace the fixed memory route boundary with active provider-keyed profile DB language; do not single out the legacy singleton or Voyage-only vector DB as the mutation target set. |
| L-006-005 | P2 | maintainability | .opencode/commands/doctor.md:43 | "`mcp_server/database/context-index.sqlite` + voyage embedding DB" | confirmed-residue | Refresh the human-readable doctor router mirror to match `_routes.yaml` after the active-profile wording is fixed, including the help text that still teaches a singleton missing-DB warning. |
| L-006-006 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100 | "production context-index.sqlite DB" | confirmed-residue | Reword the eval helper comment around the active provider-keyed production DB, or reference the mapping script without naming the obsolete singleton file. |

## Iteration summary
- Files scanned: 4284
- New findings: 6 (P0=0, P1=5, P2=1)
- Out-of-scope/historical noted but NOT flagged: 12
- Notes: Saturation is visible for this residue class. Most remaining hits were prior-iteration duplicates, frozen changelog/history, intentional provider/model registries, test-only temp sqlite filenames, or optional CocoIndex Voyage examples that correctly preserve EmbeddingGemma as the default.
