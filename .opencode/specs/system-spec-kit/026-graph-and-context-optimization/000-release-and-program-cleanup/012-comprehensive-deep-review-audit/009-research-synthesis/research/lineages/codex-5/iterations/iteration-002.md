# Iteration 2: Metadata Drift Systemic-Ness Across 026 and 027

## Focus
Decide whether graph-metadata and launch/completion drift are isolated edits or a systemic weakness in metadata generation and refresh.

## Findings

1. The 026 root `graph-metadata.json` says the last active child is `004-code-graph` and last active time is `2026-05-29T18:21:38+02:00` [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156]. The adjacent timeline ranks `006-operator-tooling`, `003-memory-and-causal-runtime`, and `000-release-and-program-cleanup` as active on `2026-06-03` [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76].

2. `generate-context.ts` updates a phase-parent pointer only for the direct parent of a saved child, or clears the active child when saving the parent itself [SOURCE: file:.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:493]. That explains why a parent pointer can lag if saves happen outside the pointer's direct-child assumptions or if later manual/git activity does not run canonical save.

3. The graph metadata backfill traverses every discovered spec folder and refreshes metadata mechanically [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193]. It emits review flags for thin/ambiguous metadata [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:159], but those heuristics do not prove that a draft placeholder is not marked complete or that renumbered descriptions are semantically fresh.

4. The affected surface is large. This worktree contains 714 `graph-metadata.json` files under 026 and 18 under 027, so even a low per-folder drift rate is operationally significant [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:5] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:8].

5. The 008 launch-state registry shows 027 drift across placeholder phase children, renumbered metadata, graph-derived status, and resource-map readiness [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/deep-review-findings-registry.json].

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `004-026-integrity/review/deep-review-findings-registry.json`
- `008-027-launch-state/review/deep-review-findings-registry.json`

## Assessment
newInfoRatio: 0.74

Novelty justification: the pass moved from known symptoms to mechanism and blast-radius estimates.

Confidence: high for systemic tooling gap; medium for exact count affected because we counted metadata files, not corrupted files.

## Reflection
Worked: comparing root metadata to timeline gave a direct stale-pointer proof.

Failed: metadata scripts explain how drift can occur, but they do not by themselves enumerate every affected packet.

Ruled out: "manual edits only." The tooling's current scope is too narrow to enforce all semantic freshness.

## Recommended Next Focus
Memory-correctness impact: test whether write-path findings matter under ordinary single-user operation.
