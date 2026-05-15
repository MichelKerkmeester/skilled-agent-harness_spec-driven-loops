---
status: in-progress
spec: 018-isolation-arc-remediation
track: system-spec-kit/026-graph-and-context-optimization
updated: 2026-05-15
---

# Implementation Summary

This is a multi-phase remediation packet for isolation-arc findings from the 017 deep-review. Phase summaries append here as each scoped remediation lands.

## Phase A+B — Path Validation + Atomic Write

Files modified:
- `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-boundary-path-validation.vitest.ts`
- `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts`

Findings closed:
- P0-1/4: path traversal risk in boundary wrapper marker reads
- P0-2/5: directory traversal risk in readiness marker writes
- P0-3: marker read/write race handling
- P1-5: no atomic write pattern for readiness marker

Code walkthrough:
- `code-graph-boundary.ts` now computes a fixed marker base directory for `system-code-graph/mcp_server/database/`, validates the marker path with `validateMarkerPath()`, logs and returns `null` for validation failures, and retries once after a `SyntaxError` before falling back to missing-marker semantics.
- `readiness-marker.ts` now validates marker writes against the fixed code-graph database base directory before any `writeFileSync` call. Out-of-bounds writes log and return without throwing through the daemon path.
- Marker writes now use a temp file named `<marker>.tmp.<pid>` followed by `renameSync()` to publish atomically. Rename failures trigger best-effort temp cleanup and skip the marker write.

Verification results:
- `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` passed.
- `cd .opencode/skills/system-code-graph/mcp_server && ../node_modules/typescript/bin/tsc --noEmit` passed. The requested `npx tsc --noEmit` command in this directory resolves to the deprecated `tsc` shim because the local `.bin/tsc` symlink is broken; the installed TypeScript compiler itself passes cleanly.
- `npx vitest run tests/code-graph-boundary-path-validation.vitest.ts --reporter=default` passed: 5/5 tests.
- `npx vitest run tests/readiness-marker-atomic-write.vitest.ts --reporter=default` passed: 5/5 tests.
- `npx vitest run tests/structural-contract.vitest.ts tests/session-bootstrap.vitest.ts --reporter=default` passed: 18/18 tests.
- Hard import audit returned no `system-code-graph` imports from `system-spec-kit/mcp_server`.
