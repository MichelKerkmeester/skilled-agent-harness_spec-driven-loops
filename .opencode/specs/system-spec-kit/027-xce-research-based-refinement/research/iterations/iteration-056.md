# Iteration 056: Impact-Analysis Preflight

## Focus

Revalidate XCE-style impact analysis against the local structural code graph preflight contract, especially `detect_changes`, stale/unavailable graph blocking, and system-code-graph ownership boundaries.

## Findings

1. Local impact analysis should use `detect_changes` as a read-only diff preflight, not as an implementation step: the feature maps unified diff hunks to structural symbols through line-range overlap and explicitly refuses stale, empty, error, or failed-verification graphs instead of returning false-safe empty impact. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:15-18]
2. `detect_changes` deliberately passes `allowInlineIndex:false`, so the preflight does not silently index while assessing a patch; when blocked, the catalog says to run `code_graph_scan` first or fall back to plain diff review if freshness cannot be restored. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:21-32]
3. The general readiness contract matches the preflight safety model: read handlers must prove graph freshness before answering, and readiness checks include graph emptiness, scope fingerprint validation, git drift, mtime staleness, manifest drift, and deleted tracked files. [SOURCE: .opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:29-48]
4. Code graph ownership is explicitly outside system-spec-kit: system-code-graph owns structural indexing, readiness, impact-analysis workflows, handler schemas, parser/storage/readiness logic, and the SQLite-backed runtime. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:1-18] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:78-86]
5. The live MCP code-graph surface was unavailable in this iteration: `code_graph_status` and `detect_changes` returned `Not connected`. Under the documented false-safe contract, that should be treated as a blocked/unavailable preflight, not evidence that a diff has no impact. [INFERENCE: tool calls returned `Not connected`; behavior classified using .opencode/skills/system-code-graph/SKILL.md:25-29 and .opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:15-18]

## Negative Knowledge / Ruled Out Directions

- Do not let an XCE-style impact-analysis flow degrade to empty affected-symbol output when the graph is stale or unavailable; local docs call that a false-safe failure and require blocking instead. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:25-29]
- Do not place graph repair or ownership rules in 027 memory phases: the system-code-graph skill owns graph readiness, impact workflows, schemas, parser, storage, and runtime. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:78-86]
- Do not perform silent inline indexing during `detect_changes`; the preflight is read-only and `allowInlineIndex:false`. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:21-24]

## Recommendation

Adopt XCE-style impact analysis only as a gated preflight: run `detect_changes` on the unified diff, require fresh/live graph readiness, report blocked status when code graph is stale/unavailable, and delegate scan/repair/verification to system-code-graph before any structural impact claim. For 027, this means documenting the dependency boundary rather than adding code-graph implementation work.

## Cited Evidence

- .opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:15-32
- .opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:29-48
- .opencode/skills/system-code-graph/SKILL.md:1-18
- .opencode/skills/system-code-graph/SKILL.md:25-29
- .opencode/skills/system-code-graph/SKILL.md:78-86

## Assessment

- New information ratio: 0.70
- Questions addressed: impact-analysis preflight, stale graph blocking, ownership boundary
- Questions answered: local `detect_changes` is the correct structural preflight, but only when graph readiness is fresh/live; unavailable graph state is a blocker.

## Recommended Next Focus

Add a preflight checklist to implementation/review workflows: capture unified diff, call `detect_changes`, if blocked run/route code-graph freshness recovery under system-code-graph, and preserve a plain-diff fallback when the graph cannot be made fresh.
