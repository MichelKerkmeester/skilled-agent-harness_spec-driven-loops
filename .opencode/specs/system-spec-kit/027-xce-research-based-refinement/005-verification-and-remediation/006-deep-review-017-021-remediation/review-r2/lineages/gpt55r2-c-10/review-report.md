# Deep Review Report - gpt55r2-c-10

## Executive Summary
Verdict: CONDITIONAL

Active findings: P0=0, P1=2, P2=0. The lineage hit `config.maxIterations=1` after one evidence-bearing pass and found two required fixes in server infrastructure: one daemon IPC correctness issue and one async-ingest path validation issue. `hasAdvisories=false`.

## Planning Trigger
Route to remediation planning for the two P1 findings. A clean PASS is not available until both active P1 findings are fixed or disproved.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Documented tcp IPC fallback is not passed through by the daemon-side resolver | .opencode/bin/spec-memory.cjs:107-113; .opencode/bin/lib/launcher-ipc-bridge.cjs:80-87; .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211; .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321 | active |
| F002 | P1 | security | Async ingest path prevalidation falls back on missing targets and later follows whatever path exists | .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:198-205; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:252-258; .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2203; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2833-2850; .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:251-257 | active |

## Remediation Workstreams
1. IPC endpoint consistency: make `resolveIpcSocketPath()` preserve `tcp://` endpoint values before filesystem canonicalization, then add a regression that verifies the CLI shim, launcher bridge, owner lease, and daemon bind all agree on the endpoint.
2. Async ingest path revalidation: either reject missing ingest paths at enqueue or re-run `realpath` plus allowed-root containment immediately before worker parsing. Store the canonical real path, not the unresolved candidate, when enqueue validation succeeds.

## Spec Seed
- Add an explicit requirement that daemon IPC endpoint resolution must be identical between the CLI shim, launcher bridge, owner lease, and daemon listener for both Unix sockets and tcp endpoints.
- Add an explicit requirement that async ingestion must fail closed on missing or replaced paths and must revalidate symlink targets at worker read time.

## Plan Seed
1. Patch `shared/ipc/socket-server.ts` so `resolveIpcSocketPath()` returns `SPECKIT_IPC_SOCKET_DIR` unchanged when it starts with `tcp://`.
2. Add unit coverage for `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>` through the spec-memory launcher path or the shared resolver.
3. Patch `memory-ingest.ts` or the ingest worker to reject missing files or revalidate `realpath` against canonical allowed roots immediately before `indexSingleFile`.
4. Add a regression where an allowed-root path is replaced by a symlink after enqueue and before worker processing; expected result is a validation failure, not indexing the symlink target.

## Traceability Status
| Protocol | Status | Gate | Summary |
|----------|--------|------|---------|
| spec_code | partial | hard | Scope spec reviewed and mapped to daemon IPC and async ingest code. |
| checklist_evidence | partial | hard | No checklist.md exists in this scope folder. |
| feature_catalog_code | partial | advisory | Not fully covered under maxIterations=1. |
| playbook_capability | partial | advisory | Not fully covered under maxIterations=1. |

## Deferred Items
- Maintainability review across the rest of `handlers/` and `lib/providers/` remains incomplete because this lineage was capped at one iteration.
- Broader error taxonomy consistency was not fully reviewed.

## Audit Appendix
| Iteration | Focus | Files Reviewed | New P0/P1/P2 | Verdict |
|-----------|-------|----------------|--------------|---------|
| 1 | daemon IPC and async ingest path handling | 9 | 0/2/0 | CONDITIONAL |

Stop reason: maxIterationsReached. Claim adjudication passed for both P1 findings. Resource-map coverage gate was skipped because the scope folder did not contain resource-map.md at init.
