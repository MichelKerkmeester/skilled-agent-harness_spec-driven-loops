---
title: "013/002 Retrieval Scope Hardening"
description: "Fail-closed scope, foreign-key and session-trust hardening for retrieval and causal-graph handlers in the Spec Kit Memory MCP server."
trigger_phrases:
  - "013/002 retrieval scope hardening"
  - "retrieval scope changelog"
  - "causal graph hardening changelog"
  - "memory search session trust"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

Five retrieval and causal-graph surfaces now respect the governed `{tenantId, userId, agentId}` boundary. Community fallback rows are filtered by scope, causal traversal and causal writes fail closed for out-of-scope endpoints, causal links reject missing endpoints before insert, forged `memory_search` session ids are rejected and scoped callers without explicit sessions no longer collapse into the same process-wide bucket. Unscoped single-user callers keep the prior local behavior.

### Added

- Scope and foreign-key regression coverage across community search, causal graph, session-dedup and session-lifecycle tests

### Changed

- `memory_search` now validates caller-supplied `sessionId` through `resolveTrustedSession`, returning `E_SESSION_SCOPE` for forged or untracked ids
- `memory_context` now derives a scoped no-session anchor when a governance scope is present, while preserving the bare process anchor for unscoped callers and explicit `SPECKIT_MEMORY_SESSION_ID`
- Handler-local causal graph argument interfaces gained optional `tenantId/userId/agentId`, with public schema exposure left to the contract-parity phase

### Fixed

- Community fallback search rows now select scope columns and run `filterRowsByScope` before scoring whenever a governance scope is present
- `memory_drift_why` now hides out-of-scope source memories and post-filters related rows so traversal cannot leak relationship existence
- `memory_causal_link` now rejects writes when either endpoint is out of scope or absent from `memory_index`, preventing orphan causal edges at the handler boundary

### Verification

- Read-back compile-safety review of all diffs: PASS
- Tests authored for B1-B5 across four vitest files: PASS by authoring and inspection
- `validate.sh --strict`: PASS, Errors 0
- `mcp_server` typecheck and vitest: DEFERRED to central because peer edits were active in the same package

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | Community scope filter and session-trust gate |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modified | Scope post-filter and endpoint existence check |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified | Scope-derived no-session anchor and test export |
| `.opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts` | Modified | Community fallback scope-filter cases |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts` | Modified | Causal scope and FK cases |
| `.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts` | Modified | Session-trust cases |
| `.opencode/skills/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts` | Modified | Scoped anchor-isolation cases |

### Follow-Ups

- Real MCP traffic can only pass causal graph scope fields after the contract-parity schema phase exposes `tenantId/userId/agentId` on `memory_drift_why` and `memory_causal_link`.
- Central verification owns the deferred `mcp_server` typecheck and vitest run after concurrent edits settle.
