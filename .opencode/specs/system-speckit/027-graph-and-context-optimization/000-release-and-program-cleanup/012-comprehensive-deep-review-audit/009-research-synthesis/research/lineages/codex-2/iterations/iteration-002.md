# Iteration 002 - Metadata Drift

## Focus

Determine whether metadata drift is systemic or isolated.

## Findings

1. The 026 integrity review found active P1 drift in graph metadata recency/status and changelog inventory counts, with root graph metadata pointing at older activity while timeline evidence showed newer activity. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-4/review-report.md:7`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-4/review-report.md:26`]

2. Another 026 lineage independently found stale graph metadata, stale changelog rollups, and completed packets still advertising in-progress status. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-1/review-report.md:23`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-1/review-report.md:50`]

3. The 027 launch-state review found parent/child metadata drift: renumbered children still advertised old phase numbers, graph metadata marked draft placeholder phases complete, and a listed child was not an executable spec folder. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/lineages/codex-1/review-report.md:67`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/lineages/codex-1/review-report.md:83`]

4. The governance/skdoc/skcode review found the target audit packet itself declared Level 1 while missing required plan/tasks/summary and mandatory metadata files. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-3/review-report.md:35`]

## Sources Consulted

- `004-026-integrity/review/lineages/codex-4/review-report.md`
- `004-026-integrity/review/lineages/codex-1/review-report.md`
- `008-027-launch-state/review/lineages/codex-1/review-report.md`
- `006-governance-skdoc-skcode/review/lineages/codex-3/review-report.md`

## Assessment

Metadata drift is systemic. It appears in at least three surfaces: 026 release/control metadata, 027 launch-state metadata, and the audit packet's own control artifacts. The repeated pattern is that generated or machine-readable metadata is treated as a document to be updated, not as a checked projection from canonical packet state.

## Reflection

The likely root cause is weak freshness validation. Existing validators can check file presence and shape, but the evidence shows they do not consistently prove that `graph-metadata.json`, `description.json`, changelog rollups, and phase maps match canonical specs, timelines, or implementation summaries.

## Recommended Next Focus

Separate memory-correctness findings into user-visible impact classes: transient routing, durable persistence inconsistency, or security boundary failure.
