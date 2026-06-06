# Iteration 002 - Hook Latency and Socket Platform Closure

## Scope

Questions addressed: RQ2 and RQ4.

This pass checked whether the CLI fallback can fit prompt-time hook ceilings and whether Unix socket path length/platform risk still leaves unknowns.

## Evidence

### Hook ceiling inventory

- Claude `UserPromptSubmit`, `PreCompact`, and `SessionStart` hooks are configured with 3 second timeouts; `Stop` and `PostToolUse` are 10 seconds: `.claude/settings.local.json:31-98`.
- Codex `SessionStart`, `UserPromptSubmit`, and `PreToolUse` hooks are configured with 3 second timeouts: `.codex/settings.json:1-36`.
- Codex hook JSON also contains 3 second `PreCompact`, `SessionStart`, and `UserPromptSubmit` hooks: `.codex/hooks.json:3-33`.
- OpenCode plugin docs expose bridge timeouts, while current source defaults differ by plugin. `mk-code-graph` uses timeout-wrapped bridge loading: `.opencode/plugins/mk-code-graph.js:248-258`, `.opencode/plugins/mk-code-graph.js:268-307`.

### Local warm process measurement

Measured on this host without spawning or mutating daemon state:

- Empty `node -e` process: average 37.24ms, p50 37.18ms, p95 40.85ms.
- `node -e` requiring `launcher-ipc-bridge.cjs`: average 40.71ms, p50 40.35ms, p95 46.09ms.

This measures shell/Node process overhead plus bridge module load, not full IPC RTT. Prior packet evidence for IPC warm path remains relevant, but prompt-time hook policy must use the safer process-level number.

### Socket path length and configured mitigation

Measured on this host:

- Default database socket path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/daemon-ipc.sock`, length 134 bytes.
- Darwin Unix socket path ceiling used by the bridge: 104 bytes.
- Pinned path `/tmp/mk-spec-memory/daemon-ipc.sock`, length 35 bytes.
- TCP endpoint `tcp://127.0.0.1:0`, length 17 bytes as a config string.

Configuration already pins the daemon socket to a short directory:

- `.codex/config.toml:61-68` registers the launcher with `SPECKIT_IPC_SOCKET_DIR="/tmp/mk-spec-memory"`.
- `.codex/config.toml:76` documents the macOS default path length issue.
- `opencode.json:18-28` sets the same short socket directory.
- `opencode.json:35` carries the same macOS path note.

Bridge code supports both short Unix sockets and TCP:

- `getIpcSocketPath()` respects `SPECKIT_IPC_SOCKET_PATH`, `SPECKIT_IPC_SOCKET_DIR`, and `tcp://` endpoints: `.opencode/bin/lib/launcher-ipc-bridge.cjs:59-67`.
- `toConnectionOptions()` handles `tcp://` endpoints: `.opencode/bin/lib/launcher-ipc-bridge.cjs:69-78`.
- TCP socket tests exist: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:261-277` and `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:321-336`.

## Classification

RQ2 is terminal MITIGATED. Warm CLI process overhead is below 50ms p95 on this host, comfortably under 3 second hook ceilings. Cold daemon spawn must not happen on prompt-time hooks; D4 is sufficient if it enforces timeout and spawn policy.

RQ4 is terminal MITIGATED for macOS/Linux dual-stack delivery. The default deep socket path exceeds the Darwin limit, but current config already pins the socket to `/tmp/mk-spec-memory`, and the bridge supports TCP fallback. Windows remains an accepted non-goal unless an explicit TCP endpoint is configured.

## Required Delta Detail

D4 must add `--timeout-ms N` and an explicit spawn policy such as `--spawn-policy=never|if-dead|always` or `--warm-only`. Prompt-time hooks should use warm-only behavior: return cached/no-op context on timeout or missing warm daemon and exit 75 for transient timeout. Cold spawn is acceptable only from session-start/prewarm/background paths where the configured timeout can tolerate it.

D6 must make the CLI shim default `SPECKIT_IPC_SOCKET_DIR` to `/tmp/mk-spec-memory` when unset, while respecting explicit user overrides. On Darwin, the shim should reject too-long Unix socket paths with exit 69 or require an explicit TCP fallback. Directory creation should preserve the existing local socket hardening posture.

## Convergence Delta

New information gained: medium-high. Hook and socket risks now have concrete numeric and config evidence.

Remaining open: RQ5, RQ6, RQ7, RQ8.
