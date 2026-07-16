# Deep Review Resource Map - gpt55r2-c-1

## Scope Snapshot
- Scope file: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md`
- Resource map present at init: false
- Coverage gate: skipped because scope packet had no `resource-map.md`.

## Reviewed Files
| File | Iteration | Findings |
|------|-----------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts` | 1 | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | 1 | F001 |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | 1 | F002 |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | 1 | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | 1 | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | 1 | F002 |

## Novel Logic Gaps
- F001: Checkpoint scope predicates treat absent metadata as a scoped match.
- F002: Server-side IPC resolver does not preserve documented TCP socket endpoints.
