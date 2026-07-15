# Audit Scope — MCP Server Infrastructure (handlers / providers / daemon)

## Purpose
Independent gpt-5.5 deep-review **audit** of the system-spec-kit MCP server infrastructure OUTSIDE the search pipeline (scope A) and the store/index/lifecycle surface (scope B): the request handlers, embedding providers, daemon launcher, and server lifecycle. REVIEW-SCOPE target (no new implementation). Report real P0/P1/P2 findings with `file:line` evidence; clean PASS is valid.

## Code under review
Paths under `.opencode/skills/system-spec-kit/mcp_server/` and `.opencode/bin/`:
- `context-server.js`, `tool-schemas.ts`, the MCP tool dispatch + handler entry points under `handlers/` (request validation, envelopes, error taxonomy)
- `lib/providers/` — embedding providers, retry-manager, provider failover/health
- `.opencode/bin/mk-spec-memory-launcher.cjs` + `lib/model-server-supervision.cjs` — owner-lease, re-election, daemon supervision, socket/IPC, recycle/respawn
- `lib/ipc/` / the IPC transport, secondary-client management, and the daemon-backed CLI front door (`spec-memory.cjs`)

## Review dimensions
correctness, security (IPC trust boundaries, input validation, path/socket handling), concurrency (lease races, reconnect, respawn), resource lifecycle (handles, sockets, orphan processes), error taxonomy/exit codes, maintainability, spec-vs-code drift. Emphasize daemon lifecycle races, IPC trust, and fail-closed behavior.

## Notes
This round BROADENS to the server infrastructure. Focus on handler/provider/daemon code, not the search pipeline (scope A) or store/index/lifecycle (scope B).

## If MCP tools hang or error
The `mk-spec-memory` / `mk-code-index` daemons can flap. NEVER block this review on a wedged MCP call. If an `mcp__mk_spec_memory__*` or `mcp__mk_code_index__*` call hangs or errors, immediately fall back — use plain Grep/Read for the code, or the warm-daemon CLI front doors: `node .opencode/bin/spec-memory.cjs <tool> --json '<args>' --format json --timeout-ms 5000` and `node .opencode/bin/code-index.cjs <tool> --format json --timeout-ms 5000 --warm-only`. This is a code audit — direct Grep/Read of the cited files is sufficient on its own.
