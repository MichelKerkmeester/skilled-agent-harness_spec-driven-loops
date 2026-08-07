# Iteration 5: Long-Running Scan and Apply Semantics

## Focus

Classify CLI subcommands by latency, mutability, and safe hook usage.

## Findings

1. `code_graph_scan` discovers files, indexes structures, records manifests, can verify, and can force scope or zero-node resets. It is a maintenance command, not hook-safe by default. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:32]
2. `ensure-ready` uses a 10s inline auto-index timeout and a default selective reindex threshold of 50 stale files; the CLI should expose full scan explicitly rather than hide it behind read commands. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:71] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:84]
3. `code_graph_apply` is verification-gated and writes JSONL audit logs; hard-stale recovery requires `confirm=true` before mutation. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:361] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:415]
4. Apply-mode snapshots a known-good triplet before mutation and rolls back if operation dispatch or postflight verification fails. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:446] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:480]
5. `code_graph_status` is the proper hook/readiness subcommand; it reads readiness first so degraded state can still be surfaced when stats fail. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:196]

## Sources Consulted

- `handlers/scan.ts`
- `lib/ensure-ready.ts`
- `lib/apply-orchestrator.ts`
- `handlers/status.ts`

## Assessment

`newInfoRatio`: 0.70. Added operational CLI split: quick status/read/classify vs maintenance scan/verify/apply.

Confidence: high.

## Reflection

Worked: apply-mode tracing clarified confirmation and rollback requirements.

Failed/ruled out: making all commands prompt-hook safe.

## Recommended Next Focus

Integration-surface measurement.
