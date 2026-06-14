# Deep Research Synthesis - GPT Lineage: Code-Index CLI Feasibility

- Date: 2026-06-06
- Session: `fanout-gpt-1780754394644-rd2108`
- Executor requested: `cli-codex model=gpt-5.5`
- Executor actual: direct Codex session, because nested `cli-codex` self-invocation is prohibited by the executor skill
- Iterations: 10/10
- Stop reason: `maxIterationsReached`
- Key questions answered: 10/10

## 1. Verdict

**GO: build a daemon-backed dual-stack CLI for `mk_code_index`, with auto-spawn.**

The zero-feature-loss architecture is the same shape as the settled spec-memory design: a thin CLI over the existing daemon/IPC surface, not a daemon-free parser/indexer replacement. The CLI should preserve the current launcher, owner lease, IPC bridge, readiness markers, read-path blocked responses, scan/apply semantics, and MCP registration during the dual-stack window.

**NO-GO: pure per-invocation CLI.** It would either lose daemon behavior or reimplement the hardest parts of the runtime: lease ownership, stale-owner reclaim, IPC socket bridge, readiness state, secondary-client accounting, idle shutdown, dead-socket respawn, read-path blocked envelopes, scan persistence, and apply rollback.

## 2. 8-Tool Parity Matrix

| Tool | Class | CLI mapping | Zero-loss condition | Evidence |
|---|---|---|---|---|
| `code_graph_scan` | State-daemon maintenance | `code-index scan --json ...` | Calls existing scan handler through daemon; exposes full/incremental/scope/verify flags. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:13] |
| `code_graph_query` | Readiness-gated read | `code-index query --operation ... --subject ...` | Preserves blocked response when readiness is non-fresh. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1263] |
| `code_graph_status` | Stateless/daemon status | `code-index status --format json` | Uses existing handler so degraded readiness is surfaced. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:196] |
| `code_graph_context` | Readiness-gated read | `code-index context --json ...` | Preserves `requiredAction`, `blockReason`, and partial-output metadata. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:200] |
| `code_graph_classify_query_intent` | Stateless text utility | `code-index classify-query-intent --query ...` | Reuses dispatcher required-field validation. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:99] |
| `code_graph_verify` | State-daemon maintenance | `code-index verify --json ...` | Runs persisted gold battery through existing verify path; blocks when readiness is not fresh. | [SOURCE: file:.opencode/skills/system-code-graph/references/runtime/tool_surface.md:53] |
| `code_graph_apply` | Recovery/mutation maintenance | `code-index apply --operation ... --confirm` | Preserves pre/post battery, snapshot, audit log, rollback, and `confirm=true` hard-stale gate. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:361] |
| `detect_changes` | Readiness-gated read | `code-index detect-changes --diff-file ...` | Disables inline indexing and blocks on non-fresh graph before parsing diff. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:241] |

**Parity result:** 8/8 portable, 0 MCP-only, provided the CLI is daemon-backed.

## 3. Daemon Dependency Loss Table

| Runtime capability | Pure CLI | CLI over daemon | CLI over daemon + auto-spawn |
|---|---|---|---|
| Owner lease heartbeat and owner-moved shutdown | Lost/reimplemented | Kept | Kept |
| Bootstrap lock and stale-owner reclaim | Lost/reimplemented | Kept | Kept |
| Secondary IPC socket bridge | Lost | Kept | Kept |
| Deep JSON-RPC liveness probe before bridge | Lost | Kept | Kept |
| Dead-socket respawn path | Lost | Partial if user starts launcher | Kept |
| Session proxy replay / retryable failure taxonomy | Lost | Kept | Kept |
| Readiness marker and startup surface | Reimplemented | Kept | Kept |
| Scan DB persistence and candidate manifest | Reimplemented | Kept | Kept |
| Apply pre/post battery, audit, rollback | Reimplemented | Kept | Kept |
| Idle shutdown with active secondary-client protection | Lost | Kept | Kept |

The current server starts the owner heartbeat and IPC socket after connecting stdio. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:136] The launcher has stale-owner, stale-heartbeat, and orphan classification. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:328] The shared bridge refuses unsafe socket paths and serves secondary clients through `StdioServerTransport`. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:298]

## 4. Prior-Art Transfer Assessment

| Spec-memory decision | Transfer? | Code-index adjustment |
|---|---|---|
| CLI-over-daemon, not daemon-free | Yes | Same; daemon is even more visibly part of read-path safety. |
| Auto-spawn via launcher on absent/dead socket | Yes | Use `mk-code-index-launcher.cjs`; preserve dead-socket respawn lease checks. |
| Generate command manifest from canonical tool list | Yes | Generate from `CODE_GRAPH_TOOL_SCHEMAS`, not `TOOL_DEFINITIONS` from spec-memory. |
| Reuse Zod validation at argv boundary | No, not verbatim | Code-index has hand-coded JSON schema and `validateToolArgs()` subset validation. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200] |
| Exit codes 0/1/64/69/75 | Yes | Ensure blocked-read payload is not rendered as false success in text mode. |
| `--session-id` | Partial | Less central than memory; still useful for audit/provenance and future session-bound behavior. |
| Keep MCP registered during dual-stack | Yes | Required; parent packet keeps MCP migration/removal out of scope. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:111] |

## 5. CLI Architecture

Recommended shape:

1. Stable shim: `.opencode/bin/code-index.cjs` or `.opencode/bin/mk-code-index.cjs`.
2. Compiled implementation: `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` -> `dist/code-index-cli.js`.
3. Transport: JSON-RPC over `daemon-ipc.sock`, using the same socket resolution and launcher/bridge behavior as MCP.
4. Manifest: generated from `CODE_GRAPH_TOOL_SCHEMAS`.
5. Validation: call `validateToolArgs()` plus per-tool required-field checks, or dispatch through the existing `tools/index.ts` boundary.
6. Output: JSON canonical; optional text/jsonl renderers must preserve `status: blocked`, `requiredAction`, and retryability.
7. Spawn policy: warm connect first; if absent/dead socket, run the existing launcher path; prompt-time hooks are warm-only unless an explicit timeout allows retryable exit 75.

## 6. Integration Surface Map

Measured active surface for dual-stack implementation: about **51 files / 163 matching lines** across agents, commands, runtime configs, and plugins.

| Surface | Examples | Action |
|---|---|---|
| Runtime configs | `.codex/config.toml`, `.claude/mcp.json`, `opencode.json` | Keep MCP registration; add CLI fallback guidance only. |
| Agents | context/deep-research/deep-review across Codex, Claude, OpenCode | Teach fallback wording; do not remove MCP tool IDs. |
| Deep commands | `start-research-loop`, `start-review-loop`, AI council | Keep allowed-tools; add fallback only where transport-down recovery matters. |
| Doctor commands | `_routes.yaml`, `update.md`, `doctor_code-graph.yaml` | Later CLI mappings for `status`, `scan`, `apply`, `detect_changes`; maintenance commands require confirmation/timeout policy. |
| OpenCode plugin | `mk-code-graph.js`, plugin README | Treat as a separate transport-backed integration; do not rename the MCP prefix. |

Broad documentation/history references are larger and noisy. They belong to a future MCP-retirement packet, not the dual-stack CLI implementation.

## 7. Hook-Latency Fit

Warm CLI usage is plausible for hooks. The nearest measured precedent is spec-memory closure: empty Node p95 40.85ms and bridge-require p95 46.09ms. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:187] Code-index configs already pin short socket dirs (`/tmp/mk-code-index`) in all three runtime configs. [SOURCE: file:.codex/config.toml:92] [SOURCE: file:.claude/mcp.json:61] [SOURCE: file:opencode.json:73]

Policy:

- Prompt-time hooks: warm `status`/read fallback only, with `--timeout-ms`.
- SessionStart/prewarm/cron/manual recovery: cold auto-spawn allowed.
- Scan/apply/verify: not prompt-time hooks; explicit maintenance contexts only.

## 8. Dual-Stack Coexistence

Coexistence is feasible because the daemon already accepts secondary clients through the IPC bridge. The bridge counts active sockets, enforces max secondary clients, and pipes each secondary through MCP stdio transport. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:298]

Spawn race handling must reuse existing code:

- Owner lease acquisition and reclaim logic in the launcher. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:347]
- Owner-lease mutation lock in TypeScript helper. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:119]
- Deep JSON-RPC liveness probe before bridging. [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:356]
- Dead-socket respawn under bootstrap lock. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:537]
- Session proxy replay and protocol-drift fail-closed behavior. [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:623]

## 9. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| CLI bypasses daemon behavior | High | Public parity CLI is IPC-only; no direct SQLite writes for the 8 tools. |
| Schema drift | High | Generate manifest from `CODE_GRAPH_TOOL_SCHEMAS`; all-8 parity test against dispatcher. |
| Blocked-read false success | High | Preserve JSON `status`; text renderer must label blocked as blocked and exit according to policy. |
| Competing daemon owner | High | Reuse launcher owner lease and add dual-spawn test. |
| Dead socket / wedged daemon | Medium | Reuse deep probe and respawn path; map temporary failure to 75. |
| Hook overrun | Medium | Warm-only prompt hooks, `--timeout-ms`, cold spawn only in startup/manual contexts. |
| Maintenance command footgun | Medium | `apply` hard-stale requires `--confirm`; scan/apply not silent hook calls. |
| Broad migration churn | Medium | Keep MCP registered; postpone full migration. |
| Naming confusion (`mk-code-graph` plugin vs `mk-code-index` server) | Low | Document stable prefix; do not rename tool IDs in dual-stack. |

## 10. Required Design Deltas

| Delta | Requirement | Acceptance evidence |
|---|---|---|
| D1 | Stable bin shim for code-index CLI | Shim can call `status` over a warm daemon and returns JSON. |
| D2 | Compiled CLI implementation | Build emits dist CLI; package/bin wiring covered by tests. |
| D3 | All-8 manifest parity | Test proves every `CODE_GRAPH_TOOL_SCHEMAS` entry has a CLI command or `--json` escape. |
| D4 | Validation parity | Unknown keys, enum, minLength, and required-field checks match dispatcher behavior. |
| D5 | Readiness/blocked rendering | Query/context/detect_changes stale paths render blocked, never false empty success. |
| D6 | Exit taxonomy | Usage 64, non-retryable 69, retryable socket/backend/cold-start timeout 75. |
| D7 | Timeout and hook policy | `--timeout-ms` tested; prompt-time docs say warm-only. |
| D8 | Dual-client test | MCP and CLI clients hit one daemon/socket without owner conflict. |
| D9 | Dual-spawn/respawn test | Simultaneous starts and dead-socket takeover preserve single owner. |
| D10 | Dist freshness guard | Shim detects stale/missing dist and either builds via launcher or exits 69 with guidance. |

## 11. Effort Estimate

Bottom-up estimate: **6-9 engineering days**, excluding MCP removal and broad reference migration.

| Work | Estimate |
|---|---:|
| Shim + socket probe + auto-spawn path | 1.0-1.5d |
| Compiled CLI parser/renderer/JSON-RPC caller | 1.5-2.0d |
| Manifest + validation parity | 0.75-1.0d |
| Scan/apply/verify timeout and confirmation UX | 0.75-1.0d |
| Dual-client + dual-spawn + blocked-read tests | 1.5-2.0d |
| Runtime docs/allowlists/fallback guidance | 0.5-1.0d |
| Buffer | 0.5d |

The estimate is lower than spec-memory because there are 8 tools rather than 37, but higher than a wrapper because scan/apply/readiness/lease tests are real work.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Pure daemon-free CLI | Fails zero-feature-loss; must replace runtime safety and persistence behavior. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:139] | 3, 10 |
| Treat `detect_changes` as absent | Current schema and dispatcher register it. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:21] | 1 |
| Copy spec-memory Zod codegen path | Code-index validator is hand-coded JSON-schema subset plus dispatcher required checks. | [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200] | 4 |
| Prompt-time cold spawn | Prior-art Node overhead supports warm calls; cold spawn is startup/manual only. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:187] | 7 |
| Full MCP reference migration now | Parent packet excludes full migration until dual-stack proves itself. | [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/spec.md:111] | 6 |
| Separate CLI daemon manager | Existing launcher/bridge already own race safety; a second manager adds split-brain risk. | [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:347] | 8 |

## 12. Open Questions

No research-blocking questions remain.

Implementation packet should still choose exact command name (`code-index`, `mk-code-index`, or `mk-code-graph`) and final file placement. My lean recommendation is `code-index` for user clarity with shim docs noting the stable server key remains `mk_code_index`.

## 13. Convergence Report

| Metric | Value |
|---|---|
| Iterations | 10/10 |
| Stop reason | `maxIterationsReached` |
| Questions answered | 10/10 |
| newInfoRatio trend | `1.00 -> 0.92 -> 0.85 -> 0.78 -> 0.70 -> 0.62 -> 0.55 -> 0.47 -> 0.36 -> 0.22` |
| Legal-stop gates | Passed by terminal cap and full question coverage |
| Source diversity | Packet specs, prior-art research, runtime source, configs, commands, plugins |
| Graph gates | Not applicable; Code Graph unavailable in this session |

## 14. References

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/cli-backend/lineages/gpt/research.md`
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/{scan,status,query,context,detect-changes,apply}.ts`
- `.codex/config.toml`, `.claude/mcp.json`, `opencode.json`
- `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/update.md`
- `.opencode/commands/deep/start-research-loop.md`
- `.opencode/plugins/mk-code-graph.js`, `.opencode/plugins/README.md`
