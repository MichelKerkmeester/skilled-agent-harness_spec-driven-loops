# Iteration 052: Context Bundle Workflow

## Focus
Revalidated a local context bundle concept for 027: start from packet state, combine `memory_context`/`session_resume`, resource-map coverage, code graph readiness, Grep/Read verification, and impact analysis into a repeatable pre-implementation bundle. The narrow interpretation chosen here is a workflow design recommendation, not implementation.

## Findings
1. A context bundle should start with Spec Kit memory/resume, not code search: `memory_context` is documented as the L1 entry point for context retrieval, supports resume mode, and explicitly routes code search to Code Graph plus Grep instead of pretending memory is code search. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:40-44]
2. `session_resume` is the right high-level bundle primitive when a session needs both memory and code-graph status, because its schema describes a merged resume payload and a `minimal` option that returns code-graph, structural-context, hints, and session-quality fields without the full memory payload. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:633-644]
3. `/spec_kit:resume` already gives the ordering model: prefer fresh `handover.md`, then `memory_context` resume mode, crash breadcrumbs, anchored search, recent-candidate discovery, and only then user confirmation; a 027 context bundle should reuse that sequence before adding resource-map and graph checks. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:280-296]
4. Code Graph belongs in the bundle as a readiness-gated structural layer: relationship tools answer callers/imports/outline/blast-radius, while stale or mismatched indexes return `status:"blocked"` with `requiredAction` instead of silent empties. [SOURCE: .opencode/skills/system-code-graph/README.md:27-35]
5. The bundle needs an explicit graph-readiness branch: status is read-only and does not repair, query/context may perform bounded selective repair, full-scan states must fall back to `code_graph_scan({ incremental:false })` or Grep, and `detect_changes` refuses stale graphs rather than doing inline indexing. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:46-66] [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:108-152]
6. For 027, resource-map data should be used as a coverage ledger inside the bundle because the template records total references, missing-on-disk counts, scope, actions, statuses, and category precedence; this gives the bundle a mechanical stale-path/coverage checkpoint before implementation. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:37-48] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:171-197]

## Implications for 027
- Recommended bundle order: state/resume context -> resource-map ledger -> code-graph status -> structural query/impact when fresh -> Grep/Read verification for cited paths -> delta-ready summary.
- The bundle should record blocked graph readiness as an honest limitation, not as a failed research result.
- The bundle should keep 028 code-graph implementation out of scope; 027 only needs readiness-aware consumption.

## Ruled Out
- Direct code-graph-only context was ruled out because Code Graph explicitly does not own spec folders, memory, resume, or hooks. [SOURCE: .opencode/skills/system-code-graph/README.md:37-44]
- Treating Grep as an impact-analysis substitute was ruled out because the Code Graph README distinguishes exact-string matching from structural callers/imports/blast-radius edges. [SOURCE: .opencode/skills/system-code-graph/README.md:31-35]

## Dead Ends
- Do not add a new ambient hook that auto-runs graph context; current Code Graph context is half-auto only after requested dispatch. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:144-152]

## Edge Cases
- Ambiguous input: "context bundle" could mean a new command, a prompt contract, or a reducer artifact. I treated it as a local workflow concept and deferred implementation.
- Contradictory evidence: none found.
- Missing dependencies: live Code Graph MCP status was unavailable in this runtime, so recommendations rely on checked-in Code Graph docs and bounded Grep/Read evidence.
- Partial success: complete enough to propose a workflow; no runtime bundle was executed.

## Sources Consulted
- .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:40-44
- .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:633-644
- .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:280-296
- .opencode/skills/system-code-graph/README.md:27-35
- .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:46-66
- .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:108-152
- .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:37-48
- .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:171-197

## Assessment
- New information ratio: 0.86
- Questions addressed: 052 context bundle workflow
- Questions answered: local context bundle should be a readiness-aware workflow sequence, not a new source of truth.

## Reflection
- What worked and why: Reading state first and then checked-in tool contracts exposed an existing sequence to reuse instead of inventing a new mechanism.
- What did not work and why: Live Code Graph status was unavailable, so runtime readiness could not be demonstrated.
- What I would do differently: In a non-fallback iteration, run `session_resume minimal:true` and a fresh `code_graph_status` to capture live bundle output.

## Recommended Next Focus
Turn this into a 027 design note or checklist gate: every implementation phase should produce a context bundle row with memory/resume source, resource-map coverage, graph readiness result, Grep/Read verification, and impact-analysis status.
