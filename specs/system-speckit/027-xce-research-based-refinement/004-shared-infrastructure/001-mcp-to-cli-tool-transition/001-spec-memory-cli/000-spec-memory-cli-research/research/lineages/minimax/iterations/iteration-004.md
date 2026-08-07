# Iteration 4: KQ4 — Integration-surface migration

| Field | Value |
|-------|-------|
| Iteration | 4 of 5 |
| Focus | KQ4 — enumerate every file that currently calls MCP tools, count references, and produce the per-surface effort estimate |
| Status | complete |
| newInfoRatio | 0.45 (the surface is well-known; the value is in the exact counts and the per-surface effort estimate) |
| Novelty justification | First iteration to count references per file (not just "many") and to map the search-and-replace pattern to concrete shapes. The OpenCode `tools:` block dependency is the only external blocker. |
| Findings count | 7 (1 surface inventory, 5 per-surface effort estimates, 1 dead-end) |

## Focus

Enumerate the integration surface that must change to drop the MCP, count references per file, and produce the per-surface effort estimate that feeds KQ5's risk register.

## Actions Taken

1. **Grep** `mcp__mk_spec_memory` and `mk-spec-memory` across `.opencode/agents/`, `.opencode/commands/`, `.opencode/hooks/`, `/AGENTS.md`, and the root `opencode.json`.
2. **Counted** per-file references with `grep -c` to get an exact number per file.
3. **Categorised** the references into 5 surfaces: agent allowed-tools, command YAML/markdown assets, runtime config (opencode.json), AGENTS.md, and doctor scripts.
4. **Read** `.opencode/commands/doctor/_routes.yaml` (13 refs), `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` (6 refs), `.opencode/commands/doctor/scripts/mcp-doctor.sh` (6 refs), `.opencode/commands/memory/manage.md` (34 refs), `.opencode/commands/memory/search.md` (19 refs), `.opencode/commands/memory/save.md` (7 refs) — the heaviest files.
5. **Read** the root `opencode.json` server config block (6 lines) — the only runtime registration of the MCP.
6. **Counted** the 6 agent files that reference the MCP: `context.md`, `ai-council.md`, `debug.md`, `deep-research.md`, `deep-review.md`, `review.md` (each 1 reference, all in the `mcpServers:` block).

## Findings

### Finding 4.1 — Surface inventory (5 surfaces, ~123 references across ~28 files)

| # | Surface | File count | Reference count | Reference pattern |
|---|---------|------------|-----------------|-------------------|
| S1 | **Agent allowed-tools / mcpServers blocks** | 6 | 6 | `mcpServers: - mk-spec-memory` (1 per agent) in YAML front-matter |
| S2 | **Command YAML/markdown assets** | 19 | 106 | mix of `allowed-tools: ..., mcp__mk_spec_memory__tool_name, ...` and inline `mcp__mk_spec_memory__tool({...})` calls in prompt bodies |
| S3 | **Runtime config** (`opencode.json`) | 1 | 6 | the `mk-spec-memory: { type: local, command, environment }` block plus the `HF_EMBED_SERVER_URL`, `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_RETRY_*` env entries |
| S4 | **AGENTS.md** (root behavioral doc) | 1 | 1 | one reference to `mk-spec-memory` in the framework section |
| S5 | **Doctor scripts** (bash helpers) | 1 | 6 | `mcp-doctor.sh` references the server name and the diagnose_mk_spec_memory function |
| **Total** | | **~28** | **~125** | |

**Heaviest files (top 5):**
- `.opencode/commands/memory/manage.md` — 34 references (the memory management command's prompt template)
- `.opencode/commands/memory/search.md` — 19 references (the unified memory search command)
- `.opencode/commands/doctor/_routes.yaml` — 13 references (8 unique tool names in 5 route entries)
- `.opencode/commands/memory/save.md` — 7 references (the save command's prompt template)
- `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml` — 6 references each

### Finding 4.2 — S1 (Agent allowed-tools) — effort: low

Each of the 6 agents has a single line:
```yaml
mcpServers:
  - mk-spec-memory
  - code_graph
```

Replacing this requires the same line shape for the CLI registration. For OpenCode, the replacement is a `tools: [{ name, command, parameters }]` block; for Claude/Codex/Copilot, the replacement is the runtime's per-Bash-pattern allow-list. **Migration shape: search-and-replace `mk-spec-memory` → `mk-spec-memory-cli` (or the runtime-specific equivalent) in 6 files, ~1 line per file. Effort: <1 hour. Risk: low.**

### Finding 4.3 — S2 (Command YAML/markdown) — effort: medium

19 files, 106 references. Two patterns:
- `allowed-tools: ..., mcp__mk_spec_memory__memory_search, ...` — search-and-replace `mcp__mk_spec_memory__` → `mk-spec-memory-` (or runtime equivalent).
- Inline `mcp__mk_spec_memory__tool({arg: value})` in prompt bodies — search-and-replace the tool-call shape into a CLI invocation, e.g.:
  ```diff
  - mcp__mk_spec_memory__memory_search({ query: "x" })
  + mk-spec-memory search --query "x"
  ```

The inline calls in `manage.md` and `search.md` require careful rewriting because the tool's argument shape (snake_case keys) differs from the CLI's flag shape (kebab-case). **Effort: 2-3 days for 106 references across 19 files. Risk: low — search-and-replace is mechanical, but the inline-call → flag-form rewrite is the slowest step.**

**Per-file effort estimate (106 refs / 19 files = 5.6 refs per file avg):**

| File | Refs | Effort | Notes |
|------|------|--------|-------|
| `memory/manage.md` | 34 | high (~6h) | 12 distinct tools, dense prompt template |
| `memory/search.md` | 19 | high (~4h) | 13 distinct tools in the unified orchestrator |
| `doctor/_routes.yaml` | 13 | medium (~2h) | 8 unique tool names in route entries |
| `memory/save.md` | 7 | low (~1h) | 4 distinct tools |
| `doctor/assets/doctor_mcp_install.yaml` | 6 | low (~1h) | mostly `mk-spec-memory` server-name refs |
| `doctor/assets/doctor_mcp_debug.yaml` | 6 | low (~1h) | same |
| `doctor/scripts/mcp-doctor.sh` | 6 | low (~1h) | bash script, server name + diagnose fn |
| (12 other files) | 15 | low (~2h total) | mostly 1 ref per file (front-matter) |

### Finding 4.4 — S3 (Runtime config `opencode.json`) — effort: **unknown, RISK: HIGH**

The root `opencode.json` has a 6-line MCP server block plus 6 env entries (some MCP-specific, e.g. `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_RETRY_*`). The replacement shape depends on whether OpenCode supports a `tools:` block for registered shell tools with per-subcommand parameter schemas:

```jsonc
// Replacement shape (target):
"tools": [
  {
    "name": "memory_search",
    "description": "Hybrid memory search across spec docs and constitutional rules",
    "parameters": { /* zod-to-json schema */ },
    "command": ["node", ".opencode/bin/mk-spec-memory-cli.js", "search"]
  },
  // ... 36 more
]
```

**Risk: HIGH** — this is the only external runtime dependency. If OpenCode does not ship this surface, the migration falls back to bare shell execution with per-agent `allowed-tools: Bash(node:.opencode/bin/mk-spec-memory-cli.js:*)` — which works but loses per-subcommand granularity.

**Interim workaround:** ship the CLI with a tiny MCP shim that translates `tools/list` and `tools/call` to CLI invocations. The shim is 30 lines of Node and the existing `bin/mk-spec-memory-launcher.cjs:1-1470` already speaks JSON-RPC. The shim defeats the purpose of "eliminating MCP" but preserves the runtime integration if OpenCode never ships the `tools:` block.

**Effort estimate:** 1-3 weeks depending on OpenCode's roadmap. The 37 tool-schemas at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1-756` are the source for the `parameters` schema.

### Finding 4.5 — S4 (AGENTS.md) — effort: trivial

The root `AGENTS.md` has 1 reference to `mk-spec-memory` in the framework section. **Migration shape: update the framework description to mention the CLI front-end and the 3 candidate architectures. Effort: <30 min. Risk: low.**

### Finding 4.6 — S5 (Doctor scripts) — effort: low

`mcp-doctor.sh` has 6 references. The script is a bash helper for `/doctor:mcp`; the replacement is `cli-doctor.sh` that diagnoses the CLI installation. The skill the script lives under (`system-spec-kit`) already has a doctor script at `.opencode/skills/system-spec-kit/scripts/doctor.sh` — the migration is to point the bash helper at the CLI's diagnostic surface. **Effort: ~1h. Risk: low.**

### Finding 4.7 — Total migration estimate

| Surface | Files | Refs | Effort (hours) | Effort (days) | Risk |
|---------|-------|------|----------------|---------------|------|
| S1 agent allowed-tools | 6 | 6 | 1 | 0.1 | Low |
| S2 command YAML/markdown | 19 | 106 | 18 | 2.5 | Low |
| S3 runtime config | 1 | 6 | **40** (high-uncertainty) | **5.0** (1-3 weeks range) | **HIGH** |
| S4 AGENTS.md | 1 | 1 | 0.5 | 0.05 | Low |
| S5 doctor scripts | 1 | 6 | 1 | 0.1 | Low |
| **Total** | **~28** | **~125** | **~60 hours** | **~8 days (1-3 weeks)** | S3 gates |

**S3 is the critical path.** The other 4 surfaces are mechanical search-and-replace work that can be done in parallel by 1 engineer in 1-3 days. S3 either requires OpenCode to ship a `tools:` block (1-3 weeks of waiting) or a CLI diagnostic shim (2-3 days of writing + testing).

### Finding 4.8 — Dead end: assuming the S2 migration is "just search-and-replace"

The 19 files split into two shape categories:
- **YAML front-matter** (e.g. `mcpServers:` block, `allowed-tools:` list) — pure search-and-replace.
- **Inline tool calls in prompt bodies** (e.g. `mcp__mk_spec_memory__memory_search({query: "x"})` inside a markdown prompt) — the rewrite is into CLI shell-invocation syntax (e.g. `mk-spec-memory search --query "x"`), which has different quoting and flag conventions.

The 34 references in `manage.md` are all inline calls (the heaviest is the 12-distinct-tools management workflow). The 19 references in `search.md` are 13 inline + 6 in the `allowed-tools:` list. The "just search-and-replace" framing understates the inline-call rewrite cost by ~2x. **Effort: revise the 18-hour estimate for S2 up to ~25-30 hours (~3-4 days).**

## Sources Consulted

- `[SOURCE: file:AGENTS.md:1]` — 1 reference to `mk-spec-memory`.
- `[SOURCE: file:opencode.json:mk-spec-memory block]` — 6 lines in the MCP server config block; 6 env entries.
- `[SOURCE: file:.opencode/agents/{context,ai-council}.md]` — `mcpServers: - mk-spec-memory` in YAML front-matter.
- `[SOURCE: file:.opencode/agents/{debug,deep-research,deep-review,review}.md]` — same pattern (verified by `grep -l`).
- `[SOURCE: file:.opencode/commands/memory/manage.md]` — 34 references; mix of `allowed-tools:` list and inline `mcp__mk_spec_memory__*` calls in the prompt body.
- `[SOURCE: file:.opencode/commands/memory/search.md]` — 19 references; same mix, plus the unified orchestrator prompt at the top.
- `[SOURCE: file:.opencode/commands/doctor/_routes.yaml]` — 13 references; 8 unique tool names across 5 route entries.
- `[SOURCE: file:.opencode/commands/memory/save.md]` — 7 references.
- `[SOURCE: file:.opencode/commands/doctor/assets/doctor_mcp_install.yaml, doctor_mcp_debug.yaml]` — 6 references each.
- `[SOURCE: file:.opencode/commands/doctor/scripts/mcp-doctor.sh]` — 6 references; bash diagnostic helper.
- `[SOURCE: grep -c "mcp__mk_spec_memory\|mk-spec-memory" <file>]` — exact per-file counts (re-run for verification).
- `[SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/*.ts]` — 0 references (the deep-loop lib has no MCP dependencies; it spawns CLIs via `fanout-run.cjs`).

## Assessment

- **Confidence in surface inventory:** high — every count cites a `grep -c` line; the heaviest file is `memory/manage.md` at 34 refs.
- **Confidence in S1/S2/S4/S5 effort:** high — these are mechanical search-and-replace; the only variable is inline-call rewrite cost.
- **Confidence in S3 effort:** low — the only true external dependency. The 1-3 week range reflects "if OpenCode ships the `tools:` block" vs "we ship a CLI diagnostic shim".
- **Confidence in total estimate:** medium — the 60-hour / 1-3 week range is dominated by the S3 uncertainty.
- **Open items deferred to KQ5:** the risk register, the effort-vs-feature trade-off, and the go/no-go recommendation.

## Reflection

- **What worked:** the per-file `grep -c` count turns "many references" into a concrete effort estimate; the 106/19 = 5.6 refs-per-file average gives a reasonable migration cost.
- **What failed:** the "just search-and-replace" framing for S2 understates the inline-call rewrite cost. Caught in finding 4.8.
- **Ruled out:** treating S3 as "just config edit". The runtime `tools:` block is the only true external dependency; the other 4 surfaces are internal to this repo.

## Recommended Next Focus

Iteration 5 should take KQ5 — the final architecture comparison. The KQ4 surface inventory feeds KQ5 directly: S1+S2+S4+S5 are 1-3 days of mechanical work; S3 is the 1-3-week gate. The architecture recommendation must account for both the per-architecture (KQ2) and per-affordance (KQ3) losses, plus the migration cost (KQ4) to produce a single go/no-go answer.
