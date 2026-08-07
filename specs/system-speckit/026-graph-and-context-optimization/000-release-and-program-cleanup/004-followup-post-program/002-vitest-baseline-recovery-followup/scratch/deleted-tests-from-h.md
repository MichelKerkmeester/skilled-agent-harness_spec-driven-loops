# Unit H Deleted Tests

Packet: `026/000/002-vitest-baseline-recovery-followup`
Run: Unit H parked-test closure

| File | Deleted assertion | Retiring packet / behavior | Reason |
|------|-------------------|----------------------------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Direct expected import row for `./lib/parsing/memory-parser.js`. | `026/000/007` shipped the current context-server boundary. | `context-server` no longer imports `memory-parser` directly; the parser remains covered at its actual call sites, so the old import-boundary assertion was obsolete. |
