# Deep Research Strategy - GPT Lineage, CLI Back-End Design

## Research Topic

Design the `spec-memory` CLI back-end for dual-stack operation. The MCP registration stays primary for interactive agent sessions; the CLI becomes the resilience and universal surface for hooks, cron, CI, scripts, and MCP-transport-down recovery.

## Known Context

- Run 1 settled the architecture premise: CLI over the existing daemon/IPC socket with auto-spawn preserves zero feature loss; pure per-invocation CLI fails. [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/research.md:12]
- Run 2 explicitly scopes this lineage to a dual-stack back-end and says not to relitigate MCP removal. [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/cli-backend/deep-research-strategy.md:5]
- The artifact root was bound directly to the fan-out override path. No resolve-artifact-root command was run.
- The parent spec has no `resource-map.md`; coverage gate is therefore skipped. [SOURCE: command:sed-resource-map-missing]

## Key Questions

- [x] KQ1: CLI architecture - entrypoint, packaging, daemon IPC connect/spawn, 37-tool subcommand layer, output contracts, exit-code map.
- [x] KQ2: Dual-stack coexistence - concurrent MCP+CLI clients, session propagation, env/db parity, fallback ergonomics, explicit non-goals.
- [x] KQ3: Delivery plan - file-level implementation, module reuse, tests, permission allowlists, packaging, risks, effort.

## Answered Questions

- KQ1 answer: implement a compiled `mcp_server` CLI plus a stable `.opencode/bin/spec-memory` shim. Drive the existing daemon JSON-RPC IPC path, auto-spawn with the existing launcher when the socket is absent/dead, generate subcommands from `TOOL_DEFINITIONS`, and reuse strict Zod schemas at the argv boundary.
- KQ2 answer: treat CLI as another IPC client, not as a second database writer. Preserve session behavior by passing `sessionId` through tool args and falling back to `CODEX_THREAD_ID` where available. Preserve launcher env/db resolution exactly.
- KQ3 answer: deliver in 8-12 focused engineering days plus rollout time. The critical tests are schema/subcommand parity, IPC connect/spawn, dual-client MCP+CLI concurrency, session propagation, exit-code mapping, and live daemon smoke.

## What Worked

- Line-numbered reads of launcher, IPC bridge, context server, tool schema, Zod schema, dispatch modules, runtime configs, and existing tests.
- Using the prior merged synthesis as premise avoided relitigating the daemon-retention verdict.

## What Failed

- A broad permission/config grep was too noisy and returned large historical artifacts. Narrowed line-numbered reads gave cleaner evidence.

## Exhausted Approaches

- Pure daemon-free CLI: out of scope and already rejected by run 1.
- Full migration of all MCP references: out of scope for this dual-stack back-end design.
- Direct handler invocation from CLI as the primary path: rejected for watcher/session/queue parity because it bypasses daemon-resident runtime.

## Ruled-Out Directions

- Do not replace MCP registration in this packet.
- Do not fork a second memory database writer.
- Do not handwrite 37 unrelated argv parsers unless a generated schema cannot express a specific ergonomic alias.

## Next Focus

Synthesis complete. Next safe implementation packet: build the `spec-memory` daemon-backed CLI behind a feature flag with MCP unchanged.

## Non-Goals

- MCP removal.
- Migration of the existing MCP references in agents, commands, hooks, and docs.
- Benchmark execution.
- Reworking the memory handler surface.

## Stop Conditions

- Stop at three iterations, one key question per iteration.
- Stop after all three key questions have evidence-backed answers.
