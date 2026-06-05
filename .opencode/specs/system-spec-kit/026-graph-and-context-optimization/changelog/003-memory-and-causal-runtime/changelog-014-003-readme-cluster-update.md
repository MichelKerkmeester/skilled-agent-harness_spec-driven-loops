---
title: "014/003 README Cluster Update"
description: "The system-spec-kit README cluster was refreshed for backend-only mode, schema v28 through v30, checkpoint rebuild sentinels, front-proxy recycle behavior, error codes, sk-git worktrees and MCP server reference parity."
trigger_phrases:
  - "README cluster SPECKIT_BACKEND_ONLY"
  - "014 003 README changelog"
  - "schema v30 front proxy error codes README"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh`

### Summary

Refreshed the system-spec-kit README cluster so operator-facing documentation matched the deployed runtime. Three documentation artifacts changed: the skill README, the MCP server README and the MCP server environment reference. No runtime code, schema code or behavior changed.

The packet documented backend-only mode, schema v28 through v30, checkpoint rebuild sentinels, MCP front-proxy recycle behavior, `E429`, `-32001`, `-32002`, sk-git worktree naming and the MCP server reference surface.

### Added

- `SPECKIT_BACKEND_ONLY` documentation in the skill README and MCP server environment reference.
- Schema v28 through v30 and `.needs-rebuild` sentinel prose in the skill README.
- MCP front-proxy recycle and error-code prose covering `E429`, live retryable `-32001` and terminal `-32002`.
- Deep-reference parity in the MCP server README for checkpoint v2, enrichment markers, front-proxy behavior and schema v30.
- sk-git `wt/{NNNN}-{name}` and `.worktrees/{NNNN}-{name}` cross-reference.

### Changed

- Updated the skill README footer to the 2026-06-02 documentation state.
- Preserved the verified 36-tool MCP server count.
- Treated `1.7.2` as historical evidence captured at authoring time where later review identified current source as `1.8.0`.

### Fixed

- Closed README cluster gaps for backend-only mode, schema history, checkpoint self-heal behavior, front-proxy recycle behavior and runtime error semantics.

### Verification

| Check | Result |
|-------|--------|
| Source anchors | PASS - schema, context server, checkpoint, health, launcher proxy and sk-git anchors checked before writing |
| Tool count | PASS - 36-tool count confirmed and preserved |
| Backend-only docs | PASS - skill README and ENV_REFERENCE rows added |
| Schema and sentinel docs | PASS - schema v28 through v30 and `.needs-rebuild` subsection added |
| Front-proxy docs | PASS - retryable recycle and fail-closed protocol semantics documented |
| MCP server README parity | PASS - checkpoint v2, enrichment, front-proxy and schema v30 references added |
| Strict validation | PASS - packet records `validate.sh --strict` with 0 errors |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/README.md` | Modified | Added backend-only mode, schema history, sentinel, front-proxy, error-code, sk-git and footer updates |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Added deep-reference parity for checkpoint v2, enrichment markers, front-proxy behavior and schema v30 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Added `SPECKIT_BACKEND_ONLY` infrastructure reference |

### Follow-Ups

- Deep review later flagged README accuracy drift for historical `serverInfo` evidence and replay-boundary wording. Track corrections in the follow-up remediation packet.
- Future runtime changes such as schema v31 or new front-proxy error codes need source-anchor re-verification before README edits.
