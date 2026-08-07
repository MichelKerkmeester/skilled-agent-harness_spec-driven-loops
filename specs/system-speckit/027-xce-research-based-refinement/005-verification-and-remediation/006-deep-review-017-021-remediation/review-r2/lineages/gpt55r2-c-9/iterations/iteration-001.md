# Iteration 001 - C-rest-of-server

## Review Context

Scope `C-rest-of-server` covers MCP server infrastructure outside the search pipeline and store/index/lifecycle review scopes. This single iteration focused on security-sensitive path handling, scoped mutation boundaries, and IPC socket lifecycle behavior.

## Files Reviewed

| File | Reason |
| --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Direct `memory_save` file-path validation and parser entry path |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | `memory_index_scan` scoping and stale deletion orchestration |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Stale-path detection and DB delete lookup |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Scoped spec-doc discovery behavior |
| `.opencode/skills/system-spec-kit/shared/utils/path-security.ts` | Allowed-root validation contract |
| `.opencode/bin/lib/model-server-supervision.cjs` | Lazy model-server demand listener and socket perimeter |
| `.opencode/bin/spec-memory.cjs` | CLI socket-dir setup before daemon launch |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Main IPC bridge hardening contrast |

## Findings

### P1 - DR-C9-P1-001 - `memory_save` probes raw caller paths before allowed-root validation

`handleMemorySaveInner` resolves the raw caller-supplied `args.filePath` and calls `fs.existsSync(probePath)` before `validateFilePathLocal` runs. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3108-3125] The allowed-root validation does not happen until after database update checks. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3185-3188] The shared path validator is the boundary that canonicalizes realpaths and rejects outside-root paths. [SOURCE: .opencode/skills/system-spec-kit/shared/utils/path-security.ts:18-102]

Risk: an MCP caller can distinguish an existing outside-root path from a missing outside-root path. Existing outside-root paths advance to the access-denied branch, while missing outside-root paths return `File not found`. This is also filesystem I/O against an untrusted path before the containment guard.

Finding class: class-of-bug.

Recommended fix: run containment validation before any existence probe, then check existence only on the validated path. Return the same access-denied response for all outside-root paths regardless of target existence.

### P1 - DR-C9-P1-002 - Scoped `memory_index_scan` stale deletion is globally scoped

`runIndexScan` accepts `specFolder` and passes it into spec-doc and graph-metadata discovery. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:410-415] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:537-543] Discovery therefore produces a scoped file list. That scoped list is passed into `categorizeFilesForIndexing`; from there `listStaleIndexedPaths(filePaths)` scans all indexed memory rows, not just rows in the requested scope. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:269-313] The DB query has no `spec_folder` or path-prefix constraint. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:323-333] Any absent indexed path found there is later passed to `deleteStaleIndexedRecords`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:650-655]

Risk: a caller using `memory_index_scan({ specFolder })` can cause stale records outside that spec folder to be deleted. The docs describe `specFolder` as limiting the scan, so global stale deletion violates the requested mutation boundary and can surprise governed or packet-local maintenance runs.

Finding class: class-of-bug.

Recommended fix: thread the normalized `specFolder` into stale-path discovery and delete lookup, or skip stale deletion on scoped scans. Deletion should only target rows whose `spec_folder` or canonical file path is inside the requested scope.

### P1 - DR-C9-P1-003 - hf model-server demand listener accepts writable socket directories

`assertSocketDirOwnership` rejects symlinked socket directories and foreign-owned directories, but it does not reject group-writable or world-writable existing directories. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:471-501] The lazy demand path calls that assertion, then `mkdirSync(..., { mode: 0o700 })`; mkdir mode does not fix permissions on an existing directory. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1219-1222] The listener then binds the UDS path and chmods the socket file to `0600`. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1367-1380] The CLI front door similarly creates the socket directory with mode `0700` only when needed and does not reject or repair an already-loose directory. [SOURCE: .opencode/bin/spec-memory.cjs:103-109]

Risk: on a shared host or with a misconfigured `SPECKIT_IPC_SOCKET_DIR`, another user with directory write permission can unlink or replace the socket path around bind/reconnect windows. Socket-file mode `0600` is not enough if the parent directory allows path replacement.

Finding class: class-of-bug.

Recommended fix: after resolving non-TCP socket directories, fail closed unless `(mode & 0o077) === 0`, or actively chmod directories created or owned by the current user before binding. Re-run the same assertion before stale socket reclaim.

## Dismissed Checks

No P0 was confirmed. `memory_save` itself validates with `validateFilePathLocal` before `memoryParser.parseMemoryFile` on the main direct-save path, so the issue is the pre-validation existence probe rather than unrestricted parsing.

## Iteration Summary

P0: 0. P1: 3. P2: 0. The release-readiness state for this lineage is CONDITIONAL.

Review verdict: CONDITIONAL
