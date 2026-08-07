# Unit H P0 Findings

Packet: `026/000/002-vitest-baseline-recovery-followup`
Run: Unit H parked-test closure

## Findings

| Source packet | File | Finding | Fix |
|---------------|------|---------|-----|
| `026/000/007` follow-up surfaced drift from plural `.opencode/skills` rollout | `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Code graph indexing still matched singular `.opencode/skill`, `.opencode/agent`, and `.opencode/command` roots, so shipped plural skill/agent/command files were treated as out of scope. | Updated index-scope matching to plural `.opencode/skills`, `.opencode/agents`, and `.opencode/commands`; verified with code graph indexer tests. |
| `026/000/007` follow-up surfaced layer registry drift | `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | `memory_retention_sweep` was registered as an L4 mutation tool but missing from the L4 tool list, leaving architecture/layer coverage inconsistent. | Added `memory_retention_sweep` to the L4 mutation tool set; verified with layer definition tests. |
| `026/000/007` follow-up surfaced MCP stdio-safety drift | `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Structural indexer diagnostics used `console.info`, which writes to stdout and can corrupt MCP stdio responses when invoked through runtime surfaces. | Moved structural indexer diagnostic logging to `console.error`; updated stdio-safety coverage and structural logging tests. |

## Verification

- Targeted parked-file subset: PASS, `/tmp/unit-h-targets7.json`.
- Full vitest: PASS, `11,804 passed / 0 failed / 90 skipped / 11 todo`, `scratch/vitest-post-unit-h.json`.
