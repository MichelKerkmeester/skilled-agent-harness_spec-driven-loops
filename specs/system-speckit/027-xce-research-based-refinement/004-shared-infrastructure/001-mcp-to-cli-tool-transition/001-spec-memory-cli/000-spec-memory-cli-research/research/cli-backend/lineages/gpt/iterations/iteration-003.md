# Iteration 3: Delivery Plan

## Focus

KQ3: file-level implementation plan, module reuse, unit/integration/live-daemon tests, dual-client parallel test, Claude Code allowlist patterns, packaging/install, risk register, and effort estimate.

## Findings

1. Implement the stable shim at `.opencode/bin/spec-memory.cjs`. It should mirror the launcher entrypoint pattern: load project env, resolve repo root, use `launcher-ipc-bridge.cjs` for socket path/probe/connect, spawn `mk-spec-memory-launcher.cjs` on absent/dead socket, then send one JSON-RPC `tools/call` request and print the selected format. `.opencode/bin/` already owns launcher bootstrap and runtime-spawned entrypoints. [SOURCE: file:.opencode/bin/README.md:18] [SOURCE: file:.opencode/bin/README.md:121] [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:124]

2. Implement the compiled command logic in `mcp_server`, not in ad hoc shell. The package already publishes `context-server` and `spec-kit-cli` bins, and depends on zod, MCP SDK, and shared modules. Add a new `spec-memory` bin pointing to a compiled TS entrypoint, or make `spec-kit-cli` dispatch to `spec-memory admin` plus `spec-memory tool`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:13] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:55]

3. Generate command metadata from `TOOL_DEFINITIONS` and cross-check with `TOOL_SCHEMAS`. There is already a parity-test pattern comparing public ListTools schema keys with Zod keys, but it only covers four tools today; extend it to all 37 tools and to CLI generated subcommands. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts:1] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts:15] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709]

4. Reuse dispatch names and handler coverage rather than inventing a parallel map. `tools/index.ts` already aggregates domain dispatchers, and the individual dispatch modules validate then call handlers. The CLI should call the daemon by public tool name; only direct unit tests should import dispatchers. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:17] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:29] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:65] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:55]

5. Test strategy fits current scripts. Root `system-spec-kit` has build/typecheck/test scripts, `@spec-kit/mcp-server` runs `node scripts/run-tests.mjs`, and existing focused tests cover tool schemas, MCP dispatch, launcher lease, IPC bridge, session proxy, session bootstrap, ingest, and CLI. [SOURCE: file:.opencode/skills/system-spec-kit/package.json:14] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:17] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:5]

6. Claude Code permission allowlist should be path-specific, not broad shell. The current `.claude/settings.local.json` allowlist includes broad `Bash(git *)` and `Bash(codex exec *)`; the new safer pattern is `Bash(node .opencode/bin/spec-memory.cjs *)` plus optionally `Bash(.opencode/bin/spec-memory *)` if a shell wrapper is added. [SOURCE: file:.claude/settings.local.json:8] [SOURCE: file:.claude/settings.local.json:14]

7. Existing tests already encode the hard concurrency and replay edges. Keep or extend `launcher-ipc-bridge.vitest.ts` for multiple clients, `launcher-lease.vitest.ts` for exactly-one-owner behavior, and `launcher-session-proxy.vitest.ts` for replayable/unsafe tool classification. Add a new live dual-client test that starts one daemon, issues `memory_stats` over MCP/stdio and `spec-memory memory_stats --format json` over CLI in parallel, and asserts both responses share the same database metadata. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:279] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:258]

File-level implementation plan:

| File | Change |
|---|---|
| `.opencode/bin/spec-memory.cjs` | New stable runtime shim. Loads env, resolves socket, invokes compiled CLI, and auto-spawns launcher when socket probe fails. |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | New TypeScript CLI. Parses subcommands, supports `--json`, `--format`, `--session-id`, `--timeout-ms`, and maps JSON-RPC/tool errors to process exits. |
| `.opencode/skills/system-spec-kit/mcp_server/cli-manifest.ts` | Generated or build-time derived manifest from `TOOL_DEFINITIONS` and `TOOL_SCHEMAS`, including aliases such as `search` -> `memory_search`. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Add `spec-memory` bin and focused test script. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` | Unit tests for argv coercion, validation errors, format rendering, aliases, and exit-code map. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-ipc.vitest.ts` | Integration tests for socket probe, auto-spawn fallback, retryable `-32001` -> 75, and live IPC call. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-dual-client.vitest.ts` | Live dual-client MCP+CLI parallel test against one daemon. |
| `.claude/settings.local.json`, runtime install docs | Add narrow allowlist pattern in the implementation packet; do not change this research lineage. |

Verification plan:

- `npm run build` from `.opencode/skills/system-spec-kit`
- `npm run typecheck` from `.opencode/skills/system-spec-kit`
- `npm run test --workspace=@spec-kit/mcp-server -- spec-memory-cli`
- Focused existing tests: `launcher-ipc-bridge`, `launcher-session-proxy`, `launcher-lease`, `tool-input-schema`, `tool-contract-parity`, `mcp-tool-dispatch`
- One live smoke with a temp DB dir and short socket dir: `SPEC_KIT_DB_DIR=<tmp> SPECKIT_IPC_SOCKET_DIR=<tmp> node .opencode/bin/spec-memory.cjs memory_stats --format json`

Risk register:

| Risk | Severity | Mitigation |
|---|---|---|
| CLI bypasses daemon and loses watcher/session/queue semantics | High | Make daemon IPC the only path for public 37-tool commands. Keep direct DB CLI under `admin`. |
| Schema drift between MCP and CLI | High | Generate manifest from `TOOL_DEFINITIONS`; all-37 parity test against `TOOL_SCHEMAS`. |
| Auto-spawn starts competing daemon | High | Reuse launcher owner lease and probe path; test concurrent launch. |
| Retry semantics become ambiguous | Medium | Map `-32001` and transient socket errors to exit 75; keep non-retryable protocol mismatch separate. |
| Runtime allowlist too broad | Medium | Add exact `Bash(node .opencode/bin/spec-memory.cjs *)` pattern. |
| Text/jsonl format diverges from JSON payload | Low | JSON is canonical; text/jsonl are renderers over parsed JSON. |

Effort estimate:

- CLI shim and JSON-RPC caller: 1.5-2 days.
- Manifest/codegen and argv validation: 2-3 days.
- Output and exit-code contracts: 1 day.
- Tests and live dual-client harness: 2-3 days.
- Packaging/docs/allowlists: 1-2 days.
- Total: 8-12 engineering days, plus rollout/monitoring.

## Sources Consulted

- `.opencode/bin/README.md`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/*`
- `.claude/settings.local.json`

## Assessment

`newInfoRatio`: 0.70. The final pass added practical delivery detail from package/test evidence, with some overlap from KQ1/KQ2. Confidence is high for file placement and tests; medium for exact implementation time because live-daemon tests can expose environment-specific flakiness.

## Reflection

What worked: current launcher and IPC tests already cover most hard cases.

What failed: no existing all-37 CLI manifest test exists; that must be added.

Ruled out: broad shell allowlisting as the recommended Claude Code permission pattern.

## Recommended Next Focus

Plan an implementation packet for the dual-stack CLI behind a feature flag.
