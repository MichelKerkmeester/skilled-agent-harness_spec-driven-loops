---
title: "Resource Map: 017-last-50-commits-review-remediation"
description: "Path catalog of the files the 017 remediation changed, grouped by stream, plus the new deploy helper and the doc surfaces it was registered in."
trigger_phrases:
  - "resource map"
  - "017-last-50-commits-review-remediation resource map"
  - "path catalog 017 remediation"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Seeded changed-path catalog grouped by remediation stream"
    next_safe_action: "None. Remediation shipped and was verified live"
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Scope**: Files the 017 remediation changed, grouped by stream, plus the new `scripts/deploy-mcp.sh` helper and the doc surfaces it was registered in.
- **Generated**: 2026-06-05T00:00:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:skills -->
## 1. Shutdown, IPC and Socket, Validator and Memory, Contract

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts` | Updated | OK | Shutdown stream: fence ingest worker before DB close. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Updated | OK | Shutdown stream: unified SIGTERM and SIGINT handler stacks. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Updated | OK | Shutdown stream: ingest worker lifecycle. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Updated | OK | IPC and socket stream: reject symlink on fresh bind, lstat-guarded fchmod, fail-closed canonicalization, re-entrant startIpcSocketServer. Kept byte-identical with its copy. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Updated | OK | Validator and memory stream: bounded session-id DFS, enrichment skip-guard skips archived, tightened E089. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Updated | OK | Validator and memory stream: enrichment skip-guard. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Updated | OK | Contract stream: added embedder tools to TOOL_LAYER_MAP. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:scripts -->
## 2. Launcher and Deploy Helper

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/bin/*-launcher.cjs` | Updated | OK | IPC and socket stream: launcher lease fsync. |
| `.opencode/bin/lib/*.cjs` | Updated | OK | IPC and socket stream: launcher helper modules. |
| `scripts/deploy-mcp.sh` | Created | OK | Rebuild-all-MCP-dists plus transparent-recycle helper. |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 3. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/**` | Created, Updated | OK | processLiveness drift guard, shutdown-fence and fresh-bind-symlink validation, auto-fix-default, 3-node contradiction cycle and rollout bucketing. |
| `.opencode/skills/system-code-graph/mcp_server/tests/**` | Updated | OK | Code-graph dist coverage in the test round. |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:meta -->
## 4. Contract, Config and Docs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.claude/**` mirrors | Updated | OK | Config and docs stream: dropped dangling .gemini/agents references. |
| `.codex/**` mirrors and codex config | Updated | OK | Config and docs stream: dropped .gemini/agents references and added HF-socket notes. |
| devin config | Updated | OK | Config and docs stream: added HF-socket notes. |
| Feature catalog entry 243 | Updated | OK | Docs stream: registered scripts/deploy-mcp.sh. |
| Doctor command surface and the relevant READMEs | Updated | OK | Docs stream: registered scripts/deploy-mcp.sh and corrected the 015 P0 miscount from 2 to 1. |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:notes -->
## 5. Notes

Paths grouped by the four remediation streams plus the test round: shutdown, IPC and socket and launcher, validator and memory, and contract and config and docs. Glob rows are used where every file under the glob received the same action. The byte-identical second copy of `socket-server.ts` was kept in lockstep with the primary copy. The new `scripts/deploy-mcp.sh` was registered across the READMEs, feature-catalog entry 243 and the doctor surface.
<!-- /ANCHOR:notes -->
