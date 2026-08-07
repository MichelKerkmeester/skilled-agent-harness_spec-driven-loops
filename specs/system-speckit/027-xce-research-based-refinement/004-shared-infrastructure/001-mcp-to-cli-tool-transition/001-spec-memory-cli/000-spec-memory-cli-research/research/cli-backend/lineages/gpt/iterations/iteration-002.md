# Iteration 2: Dual-Stack Coexistence

## Focus

KQ2: concurrent CLI + MCP clients against one daemon, write serialization, session propagation, env/db parity, fallback ergonomics, and explicit non-goals.

## Findings

1. The CLI should behave as another IPC client. The context server starts stdio only when not in backend-only mode, then always starts an IPC socket server whose `createServer` callback creates a new MCP server instance and registers the same handlers for secondary clients. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2168] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2183] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2187]

2. Multi-client behavior is already tested at the socket layer. `launcher-ipc-bridge.vitest.ts` opens three sockets to one bridge and sends `tools/list` concurrently; all three receive the expected tool response. That is the model for MCP+CLI coexistence. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:279] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:290] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:295]

3. Single ownership is enforced by the launcher, not by the MCP protocol. The launcher acquires an owner lease and bridges second launchers to the existing owner. Tests assert that two concurrent launchers result in exactly one running owner and one blocked/bridged caller. The CLI should call the same launcher when auto-spawning and never start a second direct DB writer. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:365] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1353] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:308]

4. Session continuity is preserveable if CLI exposes `--session-id` and defaults sanely. The server resolves `sessionId` from tool args, transport metadata, then `CODEX_THREAD_ID`, and stores a sticky `lastKnownSessionId` for follow-on correlation. CLI calls should pass an explicit `sessionId` whenever the runtime has one, while Codex can rely on `CODEX_THREAD_ID` as a fallback. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:522] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:530] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:535] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:538]

5. Env and dbDir parity is a hard requirement. The launcher loads `.env.local` and `.env` before spawning, preserving existing process env, while `core/config.ts` resolves `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, and `MEMORY_DB_PATH` at runtime with boundary checks. Runtime configs pin `SPECKIT_IPC_SOCKET_DIR` to `/tmp/mk-spec-memory` to avoid socket path limits. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:47] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:157] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/core/config.ts:63] [SOURCE: file:.codex/config.toml:65] [SOURCE: file:.claude/mcp.json:14]

6. Fallback guidance should be explicit and narrow. Current AGENTS guidance requires memory MCP and says graphless fallback uses Grep/Glob plus direct reads when code graph is unavailable; the CLI text should add a new branch for memory-MCP transport failure without changing the primary MCP-first rule. [SOURCE: file:AGENTS.md:73] [SOURCE: file:AGENTS.md:118]

Recommended guidance text:

```text
If mk-spec-memory MCP tools are unavailable or a memory call returns a retryable transport/lease error, use the dual-stack CLI fallback without unregistering MCP:

  node .opencode/bin/spec-memory <tool-name-or-alias> --json '<args>' --format json --session-id "$CODEX_THREAD_ID"

Prefer MCP when it is live. Use the CLI for hooks, cron, CI, scripts, and MCP-transport-down recovery. Treat CLI calls as the same memory surface: pass specFolder/sessionId, preserve Gate 3 behavior for memory saves, and do not start a direct database writer.
```

Explicit non-goals:

- Do not remove the `mk-spec-memory` MCP registration. Run 2 is dual-stack by charter. [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/cli-backend/deep-research-strategy.md:5]
- Do not migrate the roughly 120-125 existing MCP references in this packet. Run 1 makes migration a later phase, and run 2 asks for the back-end design only. [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/research.md:68] [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/cli-backend/deep-research-strategy.md:15]
- Do not make CLI a second database writer. It should call the daemon over IPC for the 37-tool surface.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`
- `.codex/config.toml`
- `.claude/mcp.json`
- `AGENTS.md`

## Assessment

`newInfoRatio`: 0.82. The coexistence behavior is well-supported by existing IPC, lease, and session-code evidence. Confidence is high that the CLI can coexist as an IPC client; confidence is medium for runtime-specific fallback wording until implementation tests each hook surface.

## Reflection

What worked: tests already encode the concurrency assumptions.

What failed: searching all runtime configs at once produced too much historical artifact noise.

Ruled out: using the CLI to bypass daemon queues or session tracking.

## Recommended Next Focus

KQ3: convert the design into a file-level implementation and test plan.
