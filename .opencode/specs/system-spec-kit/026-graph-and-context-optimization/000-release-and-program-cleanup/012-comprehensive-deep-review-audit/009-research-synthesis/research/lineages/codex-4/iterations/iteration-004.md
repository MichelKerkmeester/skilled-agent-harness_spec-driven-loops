# Iteration 4: P0 Severity Calibration

## Focus

Decide whether the two scope/auth P0 findings should remain P0 under the local single-user MCP threat model.

## Actions Taken

- Read the merged retrieval/causal review registry and the codex-5 report that contributed the two active P0s.
- Inspected `memory_search` community fallback, causal graph handlers, causal edge storage, scope-governance helpers, trusted-session handling, and tool schemas.
- Checked local stdio trust-boundary documentation and changelog notes about opt-in scope enforcement.

## Findings

1. The two scoped-security P0 findings are real governed-boundary bugs. `memory_search` passes tenant/user/agent/scope values into the main retrieval pipeline, but the community fallback later calls `searchCommunities()`, takes raw member IDs, and fetches `memory_index` rows with `WHERE id IN (...)` only. The fallback query does not include `spec_folder`, `tenant_id`, `user_id`, `agent_id`, or `session_id` predicates. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006]

2. The causal graph tools are outside the governed-scope API surface. `memory_drift_why`, `memory_causal_link`, and `memory_causal_unlink` schemas accept bare memory/edge IDs and no scope fields. The handlers then traverse, create, or delete by those IDs without scope authorization. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:442] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:448] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:460] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:76]

3. Causal link creation is especially broad because the storage layer explicitly defers foreign-key validation, then upserts causal edges by caller-supplied source and target IDs. That makes the issue both authorization and integrity, not only response filtering. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:298]

4. The default runtime threat boundary is weaker than a multi-tenant service threat model. `context-server.ts` says local stdio MCP runs inside the same user-owned process boundary and treats that caller as trusted unless metadata opts out; the same comment says stdio session binding is advisory and frames HTTP/WS transports as the place for validated server-generated session IDs. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:573] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:581]

5. Governance enforcement has intentionally been made opt-in for normal single-user search. The changelog says default deny was wrong for a non-governed environment, normal single-user search should work without identity parameters, and multi-tenant deployments should enable access-scope enforcement explicitly. [SOURCE: file:.opencode/skills/system-spec-kit/changelog/v3.2.0.0.md:179] [SOURCE: file:.opencode/skills/system-spec-kit/changelog/v3.2.0.0.md:373]

6. Other handlers prove the intended scoped behavior is stricter when scope is supplied. `scope-governance` provides exact-match predicates that fail closed without constraints, and `memory_match_triggers` validates caller-supplied sessions and post-filters candidates by spec/tenant/user/agent. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:521] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:710] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:307]

## Questions Answered

- Q4 is answered. Under the default local single-user stdio threat model, the two scope/auth findings should be recalibrated from unconditional P0 to P1 or conditional P0. They remain P0 if the release advertises governed or multi-tenant isolation as an active guarantee, because supplied scope is bypassed after the main pipeline and causal tools ignore scope entirely.

## Questions Remaining

- Q5 deep-loop blast radius.

## Reflection

What worked: reading the local trust-boundary comments prevented over-classifying local stdio issues as remote multi-tenant security failures.

What failed: using only the merged registry would have hidden the conditional nature; the implementation has both single-user defaults and governed-scope APIs.

Ruled out: "not a bug because stdio is trusted" is too permissive. Once a caller supplies governed scope, the system has a contract to preserve it.

## Recommended Next Focus

Q5 fan-out reliability: inspect failed lineage accounting, iteration propagation, provenance, and prior artifact summaries.

## Assessment

- newInfoRatio: 0.68
- Novelty justification: Recalibrates severity by separating default local stdio trust from governed/multi-tenant scope contracts.
- Confidence: High that the bugs are real under governed scope; medium-high that default local stdio should be P1/conditional P0 rather than unconditional P0.
