# Audit Scope — Memory Store / Index / Lifecycle (002 non-search)

## Purpose
Independent gpt-5.5 deep-review **audit** of the memory store, index, and write-lifecycle code of the system-spec-kit MCP server — the 002-memory-store-and-search surface OUTSIDE the search/retrieval pipeline and outside the 017-021 fixes. REVIEW-SCOPE target (no new implementation). Report real P0/P1/P2 findings with `file:line` evidence; clean PASS is valid.

## Code under review
All paths under `.opencode/skills/system-spec-kit/mcp_server/`:
- `handlers/memory-index.ts` and the write/index/scan handlers — memory write safety, index scan, causal write lifecycle
- `lib/storage/` — maintenance markers, storage/index maintenance, retention
- `lib/ops/` — job-store, batch-processor, scan-job orchestration, cancellation lifecycle
- semantic trigger fallback, learning-feedback reducers, memclaw-derived memory hardening, OpenLTM retrieval/observability + continuity/resilience, provenance injection, idempotency flag-on correctness (the 002 store/index modules under `handlers/` and `lib/`)

## Review dimensions
correctness, security (SQL/injection, path handling), data integrity (write safety, idempotency, causal lifecycle), concurrency/cancellation, performance, maintainability, spec-vs-code drift. Emphasize write-path safety, transaction boundaries, and cancellation/cleanup correctness.

## Notes
This round BROADENS beyond 017-021. Focus on store/index/lifecycle code, not the search/retrieval pipeline (covered by scope A).

## If MCP tools hang or error
The `mk-spec-memory` / `mk-code-index` daemons can flap. NEVER block this review on a wedged MCP call. If an `mcp__mk_spec_memory__*` or `mcp__mk_code_index__*` call hangs or errors, immediately fall back — use plain Grep/Read for the code, or the warm-daemon CLI front doors: `node .opencode/bin/spec-memory.cjs <tool> --json '<args>' --format json --timeout-ms 5000` and `node .opencode/bin/code-index.cjs <tool> --format json --timeout-ms 5000 --warm-only`. This is a code audit — direct Grep/Read of the cited files is sufficient on its own.
