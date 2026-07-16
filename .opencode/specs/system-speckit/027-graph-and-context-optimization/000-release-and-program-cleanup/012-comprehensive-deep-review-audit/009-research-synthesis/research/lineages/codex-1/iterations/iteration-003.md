# Iteration 003: Determine whether metadata drift is systemic or isolated.

## Focus

Determine whether metadata drift is systemic or isolated.

## Findings

1. Metadata drift is systemic. A read-only scan found 732 graph-metadata files, with conservative lower bounds of 23 Draft specs marked graph-complete and 64 In Progress specs with completion docs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:5]
2. The generator logic explains the pattern: explicit frontmatter wins, then checklist/tasks/plan/spec fallbacks, and implementation-summary without checklist can produce complete. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:987] [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:1030]
3. Tests encode this fallback as expected behavior, so the drift is not just accidental stale files; it is partly a sanctioned derivation model. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-schema.vitest.ts:310]
4. A concrete 027 packet says Status Draft while graph metadata says complete, matching the broad scan pattern. [SOURCE: .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/graph-metadata.json:42]
5. The 026 root claims recency tracking behavior while graph metadata points at an older active child, showing the same source-of-truth problem at track level. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:136] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156]

## Sources Consulted

- .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:987
- .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:1030
- .opencode/skills/system-spec-kit/graph/graph-metadata-schema.vitest.ts:310
- .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/spec.md:48
- .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/graph-metadata.json:42
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:136
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:2

## Assessment

Question 2 answer: systemic. The failure mode comes from broad generator semantics plus stale/non-authoritative packet fields, not only individual missed edits.

## Reflection

The fix likely needs a stricter readiness schema, not another sweep that rewrites statuses once.

## Recommended Next Focus

Analyze fanout/deep-loop blast radius and whether previous artifacts are suspect.

## Iteration Metrics

- Status: complete
- Findings count: 5
- New information ratio: 0.55
- Novelty justification: Added broad metadata counts and identified the parser fallback that can systemically mark packets complete.
