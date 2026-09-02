# Iteration 002 — live consumer and route census

## Route proof and state boundary

This is iteration 2 of the detached `research` loop. The resolved route remains `mode=research`, `target_agent=deep-research`, `executor=cli-codex model=gpt-5.6-luna reasoning=max service-tier=fast`; the executor is recorded as metadata only because this process is already the detached cli-codex child and cannot safely self-invoke another Codex. The only write root is this lineage. `inventory.external.json` is the line-level evidence index from iteration 1: 22,024 external matched files and 57,308 external matching lines, excluding `z_archive`, this lineage, ignored dependency trees, and the MCP server tree.

## Finding 1 — canonical context agent is a live high-risk retrieval consumer

The canonical `.opencode/agents/context.md` grants the `system-spec-memory` server in frontmatter (`:20-21`), exposes `memory_match_triggers`, `memory_context`, `memory_search`, `memory_list`, and `memory_stats` in its routing table (`:74-80`), and makes those tools part of the default sequence and deep-memory layers (`:146`, `:172-198`). The text explicitly says the daemon is an optional accelerator, but the tool grants and default routing still speak the old contract. The `.claude/agents/context.md`, `.codex/agents/context.toml`, and `.pi/agents/context.md` mirrors preserve the same grants and retrieval guidance (for example `.claude/agents/context.md:4,63,129-180`, `.codex/agents/context.toml:61-67,133,159-185`, `.pi/agents/context.md:62-68,134,160-186`).

Ownership: phase 002 rewires the canonical context agent and regenerates/updates mirrors so continuity reads use packet-local `handover.md`, `_memory.continuity`, spec docs, a generated trigger index, and scoped `rg`/file reads. Remove all old MCP grants and calls; do not preserve a “fallback” that still names the retired server. The impact is high: context is the exclusive exploration entry point and callers depend on it for prior-work retrieval.

## Finding 2 — multiple command front doors directly expose the retiring tool family

`/memory:search` is a live direct-dispatch router: it prefers `memory_context`, falls back to `memory_quick_search` and `memory_search`, and supplements with `memory_match_triggers` (`.opencode/commands/memory/search.md:59-69`); its analysis table routes causal, health, ablation, and dashboard operations to memory tools (`:124-138`). `/memory:save` grants the server and routes `memory_index_scan`, `memory_save`, and `memory_update` (`.opencode/commands/memory/save.md:4,65-72`). `/memory:manage` grants stats, list, search, scan, validate, update/delete, retention, checkpoints, ingest, and health tools in its frontmatter (`.opencode/commands/memory/manage.md:1-4`). These are not historical mentions: they are executable command contracts.

The `/speckit:plan`, `/speckit:implement`, `/speckit:complete`, and `/speckit:resume` command grants and assets also expose search/save/context/trigger/session tools. Their auto and confirm YAML variants are live command workflow assets, not merely copied documentation. `/deep:research` itself grants memory context/search in frontmatter (`.opencode/commands/deep/research.md:1-4`), and the auto workflow calls `memory_context` before initialization and `memory_save`/`memory_context` around each iteration (`.opencode/commands/deep/assets/deep-research-auto.yaml:53-60,1757-1782,2339-2347`).

Ownership: phase 002 rewires commands that remain part of the replacement continuity workflow. Phase 003 deletes the obsolete `/memory:*` command family, `/doctor memory`, causal/ablation/database-management routes, and their grants/assets once callers are moved. Deep-loop research state stays lineage/file based; its memory-upsert and context-refresh steps are removed or made no-op only in the decommissioned consumer route, while the loop’s own state/ledger contract remains.

## Finding 3 — doctor routing is a separate live integration surface

`.opencode/commands/doctor/_routes.yaml` registers a `memory` target with health/drift/search/stats tools and a warm-only `spec-memory.cjs` probe (`:33-50`), registers `causal-graph` with causal stats/drift/search tools (`:65-79`), and even gives the retained `skill-advisor` target memory context/search tools (`:105-117`). `doctor-memory.yaml` treats `context-index.sqlite` as the canonical store and calls `memory_health`, `memory_stats`, and `memory_drift_why` (`:21-44,143-172`); it names the CLI launcher and database/snapshot paths (`:30-36,64-79`). The route and asset contract is live and would fail closed or misdiagnose after blind server removal.

Ownership: phase 003 removes the memory and causal-graph routes, YAML assets, validation grants, and warm-only CLI probes. Phase 002 preserves the advisor route but removes its old memory fallback if the advisor contract can operate on its own index; do not remove advisor-owned routing or the shared embedder while doing so. The concrete negative-risk is that deleting only `system-spec-memory` leaves `/doctor memory` advertised and its route validator still granting tools.

## Finding 4 — five runtime MCP configuration files bind the old server and shared socket

`.claude/mcp.json`, `.codex/config.toml`, `opencode.json`, `.cursor/mcp.json`, and `.pi/mcp.json` each contain a live `system-spec-memory` entry that launches `.opencode/bin/system-spec-memory-launcher.cjs`; the JSON/TOML env blocks carry `SPECKIT_IPC_SOCKET_DIR`, retry/secondary-client settings, and an `HF_EMBED_SERVER_URL` such as `unix:///tmp/system-hf-embed/hf-embed.sock` (`.claude/mcp.json:3-16`; corresponding entries are indexed in `inventory.external.json`). Their comments/config notes say the memory and advisor services share the HF socket. `.utcp_config.json` was read as a negative control and contains no system-spec-memory transport entry.

Ownership: phase 003 deletes the memory server blocks, launcher references, memory-only socket/retry/DB variables, and stale comments from each runtime config. Phase 002 rewrites any surviving advisor configuration to its own launcher/index and retains the HF socket/model server wherever advisor still depends on it. Removing `/tmp/system-hf-embed/hf-embed.sock`, the HF model server, or shared `SPECKIT_IPC_SOCKET_DIR` wholesale would break the retained advisor contract.

## Finding 5 — launchers, CLI shims, plugin, hook, and IPC allowlist form one coupled deletion set

The live `.opencode/bin/system-spec-memory-launcher.cjs` is the process launcher and owns socket/daemon lifecycle, while `.opencode/bin/spec-memory.cjs` is the CLI front door. `.opencode/bin/lib/launcher-session-proxy.cjs` allowlists memory/session/checkpoint/embedder tool IDs; deleting the server without removing this proxy branch leaves stale routing. `.opencode/plugins/system-spec-memory.js` implements the OpenCode continuity plugin/bridge and publishes a `system_spec_memory_status` tool (`:32-52,93-126,603-626`). `.opencode/hooks/spec-memory/README.md` documents the active plugin bridge, cache, injection, and `SYSTEM_SPEC_MEMORY_DISABLED` switch (`:18-20,30,44-69,79-84,98-126`); `.opencode/hooks/shared/hook-flags.cjs` carries the spec-memory alias set (`:70-75`).

Ownership: phase 003 deletes the memory launcher, CLI shim, memory branch of the session proxy/IPC bridge, plugin, hook adapter/symlink/readme, status tests, and memory-only flag aliases. Phase 002 first reroutes continuity injection and any shared proxy consumers to file-local/generated-index sources. The high-risk seam is the shared launcher/IPC/HF boundary: `.opencode/bin/system-skill-advisor-launcher.cjs` must be audited for shared environment filtering and memory pin/filter references, but it is an advisor surface and is not a delete target under D1/D2.

## Finding 6 — agent mirrors and command assets multiply one logical consumer into many physical rows

The inventory records live grants in 35 agent files and live command hits in 87 command files. The physical fan-out includes canonical OpenCode definitions plus Claude, Codex, and Pi mirrors; `.devin` has no live matched agent row in the scoped inventory. The command fan-out includes both auto/confirm YAML assets and compiled/presentation assets. Treating each mirror as an independent product understates the edit strategy, but treating all matching lines as separate consumers overstates the number of logical routes. Phase 002 should update the source-of-truth OpenCode definitions and the workflow/template generators that materialize mirrors; phase 003 should delete obsolete command families and their corresponding generated assets rather than leaving orphaned grants.

## Finding 7 — parent estimates need qualification

The parent estimate of 41 exposed tools is confirmed by the MCP `TOOL_DEFINITIONS` registry, but the tracked tree is 1,482 files and 453,964 lines, not 1,480 files and 453,813 lines. The broad external inventory finds 423 unique live files with a tool grant, tool-call instruction, or code-import classification, while the narrow command/agent family alone is 123 files; therefore the parent’s “about 167 external consumers” is not reproducible without a stated inclusion/exclusion rule. The 373-flag estimate is also not a safe deletion count: the live server tree exposes 407 distinct `SPECKIT_*` tokens in the machine inventory, while external files contain 649 distinct flag tokens including advisor, git, deep-loop, and historical/read-site references. Deletion work must use an authoritative server/export catalog and classify retained advisor/shared infrastructure separately.

## Classified phase worklist

| Surface | Live evidence | Phase 002 action | Phase 003 action | Break risk |
|---|---|---|---|---|
| Agents and mirrors | grants + retrieval tables in canonical/mirrored agents | replace continuity retrieval and remove grants | delete only obsolete agent routes if no longer needed | High for context callers |
| `/memory:*` and `/speckit:*` commands | frontmatter and tool maps | rewire surviving spec workflows | delete memory admin/search/save/learn assets | High; stale commands fail at runtime |
| `/deep:*` YAML | memory pre-context, upsert, refresh, save | make loop file/ledger-local | remove memory-only integration branches | Medium/high for research loop |
| Doctor routes/assets | memory, causal, embedder, advisor routes | retain advisor-only path; remove old fallback | delete memory/causal routes and probes | High for `/doctor` dispatch |
| Runtime configs | five MCP config entries | isolate retained advisor/HF variables | delete memory server blocks and flags | High if shared socket is removed |
| Launcher/CLI/proxy/plugin/hook | server process, bridge, allowlist, injection | reroute shared consumers | delete memory-specific implementation and tests | High at IPC/HF seam |

The full one-row-per-hit assignment remains in `inventory.external.json`; this iteration adds the route-level interpretation needed to reconcile physical hits with logical deletion work. Every hit carries path, line, surface type, reference kind, lifecycle, phase, action, and break-risk fields.

## Gaps and negative controls

- No MCP memory call was made; the research is grounded in source files and the line-level inventory because the task explicitly decommissions that dependency.
- No `z_archive` material is included in the external scan.
- `.utcp_config.json` was inspected and did not match the target transport.
- The child packet remains a scaffold; no parent/child spec files were modified under detached-lineage scope.

## New information ratio

`0.80` — this iteration added the live consumer-route classification and shared-resource break analysis; the exact server/tool/runtime baseline and raw inventory were established in iteration 1.
