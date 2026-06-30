# Iteration 46 — gpt55

**Angle:** Audit which L2/L3 tools are systematically excluded from command allowed-tools and whether this creates a 'write-heavy, read-poor' pattern across the command surface

**Findings:** 3

- **[P1] misalignment** `.opencode/commands/deep/agent-improvement.md:4` — agent-improvement workflow requires memory_search but command disallows it
  - evidence: `allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task`; however `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:67` says `tool: memory_search` and confirm mode has the same requirement at `deep_agent-improvement_confirm.yaml:68`.
  - fix: Add `mcp__mk_spec_memory__memory_search` to `/deep:agent-improvement` allowed-tools or change both workflow assets to use only permitted tooling.
- **[P1] misalignment** `.opencode/commands/deep/model-benchmark.md:4` — model-benchmark workflow requires memory_search but command disallows it
  - evidence: `allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task`; however `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:70` says `tool: memory_search` and confirm mode repeats it at `deep_model-benchmark_confirm.yaml:70`.
  - fix: Add `mcp__mk_spec_memory__memory_search` to `/deep:model-benchmark` allowed-tools or remove the startup memory-search requirement from both workflow assets.
- **[P2] undocumented** `.opencode/commands/memory/save.md:4` — memory save is write/index heavy with no L2 retrieval precheck
  - evidence: `allowed-tools: Read, Edit, Bash, Task, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_update`; the save workflow then resolves target alignment and extracts decisions at lines 33-38, but no L2 retrieval tool (`memory_context`, `memory_search`, `memory_quick_search`, or `memory_match_triggers`) is allowed for pre-save duplicate/context lookup.
  - fix: Either add the intended L2 read tool(s) for pre-save context checks, or document that `/memory:save` intentionally performs no semantic read/duplicate lookup before writing/indexing.
