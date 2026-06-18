# Iteration 007 — Angle 7

**Angle:** Scan event-loop saturation: memory_index_scan starves the IPC bridge (observed live: health timeouts during scan) — yielding/job-queue/progress-event design.

**Summary:** Source evidence supports the live observation: memory_index_scan is foreground work on the same daemon/IPC event loop that must answer health probes. I could not reproduce live timing because a read-only warm-only health probe returned exit 75: backend unavailable: connect ECONNREFUSED /tmp/mk-spec-memory/daemon-ipc.sock.

**Findings kept:** 4

## [P1][BUG] memory_index_scan runs as one foreground JSON-RPC call

- Evidence: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1137-1141 awaits dispatchTool inline; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:910-929 awaits processBatches for all files before response; .opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:946 sends tools/call under one timeout
- Detail: The code does not enqueue memory_index_scan or return early with a job id; the caller waits for the full scan result. During a long scan, the same Node process must also serve IPC liveness and health requests, so heavy synchronous portions of scan handling can make the daemon look unhealthy or cause client-side tools/call timeouts.
- Fix sketch: Convert memory_index_scan to a queued scan job that returns jobId immediately, with scan_status polling and bounded per-slice execution.

## [P1][BROKEN-FEATURE] activeScanJob health signal is served through the saturated path

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:580-583 computes activeScanJob from scan_started_at; .opencode/bin/lib/launcher-ipc-bridge.cjs:145-230 deepProbe requires a JSON-RPC initialize reply; .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1043-1084 routes all tool calls through the same async handler path
- Detail: Health has an activeScanJob field, but callers can only obtain it by making another MCP/IPC request to the same event loop that the scan is occupying. This makes the intended observability path unreliable precisely during the condition it is supposed to diagnose.
- Fix sketch: Expose lightweight daemon liveness/scan-progress outside normal MCP tool dispatch, or move scan work to a worker/job queue so health remains responsive.

## [P2][REFINEMENT] Batching does not guarantee cooperative event-loop yielding

- Evidence: .opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:138-151 processes each batch via Promise.all and only delays between batches; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:151-219 recursively walks specs with fs.readdirSync; .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:251-258 parses each file with existsSync/readFileSync/statSync
- Detail: The scan has some batch delay, but discovery and per-file parse/index setup still include synchronous filesystem and SQLite-heavy work. With the default batch size of 5 and delay only between batches, a large workspace can still produce long non-yielding stretches.
- Fix sketch: Add explicit cooperative yields such as await setImmediate every N discovered nodes/files and after synchronous DB/file phases, or migrate discovery to async iteration.

## [P2][REFINEMENT] Existing ingest job queue pattern is not reused for full scans

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263-287 creates a job, enqueues it, and tells callers to poll memory_ingest_status; .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:1-6 documents sequential worker, progress, retry, and crash recovery; .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:636-640 shows memory_index_scan has no jobId/status/cancel companion
- Detail: The repo already has a queue/progress design for bulk ingestion, but memory_index_scan remains a synchronous bulk operation. That is a missed reuse opportunity for the exact starvation class under investigation.
- Fix sketch: Generalize the ingest queue into a maintenance-job queue and implement memory_index_scan_start/status/cancel or make memory_index_scan return the same job envelope.
