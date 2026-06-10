---
title: "Implementation Summary: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/implementation-summary]"
description: "Implemented Phase 1 CLI Core: daemon-backed spec-memory CLI, shim, runtime command generation from TOOL_DEFINITIONS, Zod argv validation, IPC call path, exit mapping, targeted tests, and live daemon smoke."
trigger_phrases:
  - "spec-memory cli core implementation-summary"
  - "cli subcommand codegen implementation-summary"
  - "spec-memory shim implementation-summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
    last_updated_at: "2026-06-07T12:45:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Delivered daemon-backed spec-memory CLI core and shim"
    next_safe_action: "Run phase 002 hardening/parity suites and phase 003 runtime integration"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core |
| **Completed** | Core delivered; phase 002/003 hardening and runtime integration remain |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built a daemon-backed `spec-memory` CLI as a second IPC client over the unchanged mk-spec-memory daemon. The CLI generates its command map from `TOOL_DEFINITIONS`, validates argv-derived arguments with the existing Zod schemas, sends `tools/call` JSON-RPC frames over `daemon-ipc.sock`, auto-spawns via `mk-spec-memory-launcher.cjs` when the daemon probe fails, and renders `json`, `jsonl`, or text output. The shim defaults unset `SPECKIT_IPC_SOCKET_DIR` to `/tmp/mk-spec-memory`, rejects stale/missing dist with exit 69, and delegates to fresh `dist/spec-memory-cli.js`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | Created | Daemon-backed CLI entrypoint and runtime command generation |
| `.opencode/bin/spec-memory.cjs` | Created | Stable executable shim with dist freshness and socket path guards |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` | Created | Parser, IPC, retryable, and protocol-drift coverage |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Updated | Added `spec-memory` package bin |
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Updated | Included `spec-memory-cli.ts` in builds |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as a thin IPC client. No SQLite imports were added to the new CLI; persistence still happens inside the daemon. The existing MCP surface remains registered and unchanged. The old direct-DB `spec-kit-cli` maintenance surface remains untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Runtime command map instead of a generated checked-in manifest | Keeps schema drift impossible while avoiding a new generated artifact for 37 tools |
| Keep `spec-kit-cli` untouched | It is a direct-DB maintenance CLI; the new user-facing fallback must be IPC-only |
| Add targeted CLI tests in phase 001 | They verify parser, IPC, and exit-code invariants without pulling phase 002 race/parity scope forward |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CLI regression tests | `npx vitest run tests/cli.vitest.ts tests/spec-memory-cli.vitest.ts` -> 11 passed |
| TypeScript | `npm run typecheck` -> passed |
| Build | `npm run build` -> passed |
| Shim list-tools smoke | `node .opencode/bin/spec-memory.cjs list-tools --format json` -> returned `TOOL_DEFINITIONS` surface |
| Live daemon smoke | `node .opencode/bin/spec-memory.cjs memory_stats --format json --timeout-ms 5000` -> returned `Memory system: 9492 memories across 1123 folders` |
| Comment hygiene | `check-comment-hygiene.sh` on changed CLI/shim/test files -> passed |
| Alignment drift | Changed MCP server scope passed; broad scans surfaced unrelated existing shell strict-mode failures outside this phase |
| Strict spec validation | `validate.sh .../001-cli-core --strict` -> 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not a native MCP reconnect fix.** Existing `functions.mk-spec-memory_*` bindings can still remain disconnected until the runtime restarts; the CLI is the transport-down fallback path.
2. **Full hardening remains in successor phases.** Dual-spawn races, dual-client parity, full 37-command invocation matrix, warm-path p95 timing, and runtime allowlists remain phase 002/003 work.
<!-- /ANCHOR:limitations -->
