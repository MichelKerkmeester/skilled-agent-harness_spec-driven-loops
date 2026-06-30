# Iteration 3 — gpt55

**Angle:** Undocumented features: code paths, env vars (ENV_REFERENCE.md), MCP tools, CLI flags present in code but absent from any doc.

**Findings:** 4

- **[P1] undocumented** `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:204` — LLM provider envs are missing from ENV_REFERENCE
  - evidence: Code reads `const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();`, then `LLM_REFORMULATION_API_KEY` and `LLM_REFORMULATION_MODEL` at lines 210-211; targeted grep found no `LLM_REFORMULATION_*` rows in `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`.
  - fix: Add ENV_REFERENCE rows for `LLM_REFORMULATION_ENDPOINT`, `LLM_REFORMULATION_API_KEY`, and `LLM_REFORMULATION_MODEL`, with defaults and consumers (`llm-reformulation.ts`, `hyde.ts`, `memory-save.ts`).
- **[P2] undocumented** `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:228` — `spec-memory --session-id` is implemented but absent from CLI reference
  - evidence: CLI help exposes `spec-memory <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--session-id ID] [--warm-only]`; `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:48` documents the same generic form without `--session-id`.
  - fix: Document `--session-id` as a spec-memory CLI flag, including its mapping to `args.sessionId` and when hooks/operators should use it.
- **[P2] contradiction** `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:623` — CLI env reference still says spec-memory has 37 tools
  - evidence: ENV_REFERENCE says `node .opencode/bin/spec-memory.cjs` has `(37 tools)`, but `.opencode/skills/system-spec-kit/README.md:259` says `identical 39 tools`, and `tool-schemas.ts:916-965` exports the current tool list including `embedderList`, `embedderSet`, and `embedderStatus`.
  - fix: Update ENV_REFERENCE and related current docs/manual tests from 37 to 39, or replace hard-coded counts with generated/parity-source wording.
- **[P2] misalignment** `.opencode/commands/memory/README.txt:231` — Memory command coverage matrix omits current public maintenance tools
  - evidence: The section claims `Primary MCP tools mapped to their command home`, but the matrix ends at `36 | code_graph_context`; current `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:936-962` includes additional public mk-spec-memory tools such as `memoryRetentionSweep`, `memoryEmbeddingReconcile`, `memoryIndexScanStatus`, `memoryIndexScanCancel`, `embedderList`, `embedderSet`, and `embedderStatus`.
  - fix: Regenerate the `/memory` coverage matrix from `TOOL_DEFINITIONS`; add command homes/subcommands or explicitly mark tools as MCP-only/no slash-command home.
