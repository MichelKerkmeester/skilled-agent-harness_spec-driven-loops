---
title: "017 Last 50 Commits Review Remediation"
description: "Remediated all actionable findings from the 016 review across four parallel streams plus a test round. Shutdown, IPC and socket, validator and memory, and contract and config fixes shipped, with six items deliberately accepted as no-code-change ADRs."
trigger_phrases:
  - "017 last 50 commits review remediation"
  - "shutdown fence ingest worker"
  - "socket symlink reject fail closed"
  - "session id dfs bound"
  - "deploy-mcp.sh rebuild recycle helper"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-05

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup`

### Summary

This packet remediated all actionable findings from the 016 review across four parallel streams plus a test round. The streams covered shutdown, IPC and socket, validator and memory, and contract, config and docs. Six items were accepted with no code change as deliberate ADRs recorded in the decision record. The work shipped on 2026-06-05 with the mk-spec-memory daemon recycled to a fresh dist and verified live.

### Added

- Tests: a `processLiveness` drift guard, shutdown-fence and fresh-bind-symlink validation, and coverage for auto-fix-default, the 3-node contradiction cycle and rollout bucketing.
- `scripts/deploy-mcp.sh`, a rebuild-all-MCP-dists plus transparent-recycle helper, documented across the READMEs, feature-catalog 243 and the doctor surface.

### Changed

- `scripts/deploy-mcp.sh` was registered across the relevant READMEs, the feature catalog entry 243 and the doctor command surface so operators can find the rebuild-and-recycle helper.
- `TOOL_LAYER_MAP` now lists the embedder tools so the contract layer matches the live tool set.
- The `.claude` and `.codex` mirrors dropped the dangling `.gemini/agents` references, and the codex and devin configs gained HF-socket notes.
- The 015 P0 miscount was corrected from 2 to 1.

### Fixed

- Shutdown: the ingest worker is now fenced before DB close, and the two divergent SIGTERM and SIGINT handler stacks were unified.
- IPC and socket: a symlink is now rejected on fresh socket bind, `fchmod` is `lstat`-guarded, canonicalization fails closed, `startIpcSocketServer` is re-entrant and the launcher lease is `fsync`ed. Both socket-server copies were kept byte-identical.
- Validator and memory: the session-id DFS is now bounded by directory, depth and time caps, the enrichment skip-guard also skips `archived`, and the E089 `access denied:` check was tightened.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS. `tsc` reported 0 errors across `mcp_server`, `shared` and `code-graph`. |
| Affected suites | PASS. 1055 affected tests plus 154 new or extended and 3 fork-parity tests all pass. |
| Alignment drift | PASS. The alignment-drift check passed. |
| Packet validation | PASS. `validate.sh 017-last-50-commits-review-remediation --strict` exited 0. |
| Deploy | PASS. Deployed 2026-06-05. The mk-spec-memory daemon recycled to fresh dist and was verified live, the code-graph dist was rebuilt, and the launcher `.cjs` activates on the next fresh session. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/ops/job-queue.ts` | Modified | Fenced ingest worker before DB close and unified the SIGTERM and SIGINT handler stacks. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` and its byte-identical copy | Modified | Reject symlink on fresh bind, `lstat`-guarded `fchmod`, fail-closed canonicalization and re-entrant `startIpcSocketServer`. |
| `.opencode/bin/*-launcher.cjs`, `bin/lib/*.cjs` | Modified | Launcher lease `fsync`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts`, memory save handlers | Modified | Bounded session-id DFS, enrichment skip-guard skips `archived` and tightened E089. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Modified | Added embedder tools to `TOOL_LAYER_MAP`. |
| `.claude/**`, `.codex/**` mirrors and codex and devin configs | Modified | Dropped dangling `.gemini/agents` references and added HF-socket notes. |
| `scripts/deploy-mcp.sh` | Created | Rebuild-all-MCP-dists plus transparent-recycle helper. |
| Test suites under `mcp_server/tests/**` and `code-graph/**/tests/**` | Created, modified | `processLiveness` drift guard, shutdown-fence and fresh-bind-symlink validation, auto-fix-default, 3-node contradiction cycle and rollout-bucketing coverage. |
| `017-last-50-commits-review-remediation/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` | Created | Level 3 remediation packet documentation and metadata. |

### Follow-Ups

- None. The six accept-no-action items are deliberate and recorded in the decision record.
