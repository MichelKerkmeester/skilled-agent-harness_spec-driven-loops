---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Fail-closed scope, FK, and session-trust hardening for the retrieval and causal-graph handlers in the Spec Kit Memory MCP server."
trigger_phrases:
  - "retrieval scope summary"
  - "causal graph hardening summary"
  - "session trust summary"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-retrieval-scope-hardening"
    last_updated_at: "2026-06-04T20:45:41Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Completed and documented B1-B5"
    next_safe_action: "Central runs mcp_server tsc and vitest"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-retrieval-scope-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-retrieval-scope-hardening |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five retrieval and causal-graph surfaces now fail closed against the governed `{tenantId, userId, agentId}` boundary instead of leaking rows or trusting forged identity. Each change is a no-op for unscoped single-user callers, so local stdio continuity is untouched.

### Community fallback now respects scope (B1)

When `memory_search` falls back to community members on a weak result, it now selects `tenant_id, user_id, agent_id` alongside the member columns and, whenever a governance scope is present, runs `filterRowsByScope` over those rows before scoring them. `sessionId` is deliberately excluded from the filter, matching the canonical pipeline contract. Unscoped callers get the same rows as before.

### Causal-graph traversal and links are scope-gated (B2)

`memory_drift_why` now post-filters on scope. When a caller supplies a scope, the handler reads the source memory's scope columns first and returns the same empty shape as "no relationships" if the source is out of scope, so it never leaks a chain or signals that an out-of-scope memory exists. Related rows are gated the same way. `memory_causal_link` rejects the write when either endpoint is outside the supplied scope. The handler-local arg interfaces gained optional `tenantId/userId/agentId`; the matching input-schema fields are cluster D's work.

### Causal links can no longer create orphan edges (B3)

Before inserting an edge, `memory_causal_link` checks that both `sourceId` and `targetId` exist in `memory_index` and returns an error listing the missing endpoint(s) when they do not. The check lives at the handler boundary so the shared `insertEdge` primitive and its 20+ synthetic-id unit tests are untouched.

### memory_search validates caller sessions (B4)

`memory_search` now routes a caller-supplied `sessionId` through `resolveTrustedSession`, mirroring `memory_match_triggers` and `memory_context`. A forged or untracked id returns an `E_SESSION_SCOPE` error; a validated id replaces the local value so dedup, boost, and the progressive scope key all use the trusted id. Omitting `sessionId` behaves exactly as before.

### No-session callers no longer collapse onto one bucket (B5)

`memory_context` keeps the stable process-wide continuity anchor for the unscoped single-user case and for an explicit `SPECKIT_MEMORY_SESSION_ID` override. But when a caller supplies a governance scope without a `sessionId`, the anchor now mixes the normalized scope into the hash, so two distinct scoped callers in one process get distinct session buckets instead of cross-contaminating inferred mode, dedup, and working memory.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| handlers/memory-search.ts | Modified | B1 community scope filter; B4 session-trust gate |
| handlers/causal-graph.ts | Modified | B2 scope post-filter; B3 FK existence check |
| handlers/memory-context.ts | Modified | B5 scope-derived no-session anchor + test export |
| tests/community-search.vitest.ts | Modified | B1 scope-filter cases |
| tests/handler-causal-graph.vitest.ts | Modified | B2/B3 scope + FK cases (real in-memory DB) |
| tests/gate-d-regression-session-dedup.vitest.ts | Modified | B4 session-trust cases |
| tests/session-lifecycle.vitest.ts | Modified | B5 anchor-isolation cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix was implemented exactly per its verified backlog spec, sequenced B1, then B4, then B2+B3 as one coordinated edit to `handleMemoryCausalLink`, then B5. Per the cluster verification policy, `mcp_server` tsc and vitest were not run here because peers are editing the same package concurrently; verification is deferred to central. A careful read-back compile-safety review covered every diff: type narrowing of the new `let sessionId`, predicate generics, closure variable scoping, and response-envelope shapes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the FK check in the handler, not insertEdge | Keeps the 20+ synthetic-id unit tests passing while still blocking orphan edges at the production boundary |
| Exclude sessionId from every scope filter | sessionId is a dedup/continuity key, not a row-access boundary; mirrors the canonical pipeline P0 contract |
| Authorize drift-why source independently of includeMemoryDetails | Denial must not be skippable by omitting details; fail-closed |
| Keep the bare process anchor for unscoped callers | Preserves intended hookless single-user resume continuity; only scoped multi-callers get a derived anchor |
| Add optional scope fields to handler-local interfaces only | Tool input schemas are cluster D's ownership; handler stays correct regardless |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Read-back compile-safety review (all diffs) | PASS, no type or scope issues found |
| mcp_server tsc | DEFERRED to central (peers editing concurrently) |
| mcp_server vitest | DEFERRED to central (peers editing concurrently) |
| Tests authored for B1-B5 | PASS, cases added to the four named vitest files |
| validate.sh --strict | PASS (Errors: 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **B2 is gated on cluster D.** Until cluster D adds optional `tenantId/userId/agentId` to the `memory_drift_why` and `memory_causal_link` input schemas, real MCP traffic cannot pass scope, so the B2 post-filter is dormant for those callers. The handler code is correct now; the tests pass scope directly.
2. **Verification deferred.** tsc and vitest for `mcp_server` were not run in this packet; central runs them after concurrent edits settle.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
