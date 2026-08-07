# Iteration 012 — Angle 12

**Angle:** active_memory_projection invariants: which other lookups join the projection while their write guards span all of memory_index (the class behind the scan unique-constraint crash).

**Summary:** No remaining code bug in the crash class was found: the same-key write guard now spans memory_index, while projection joins appear limited to active retrieval/scoring. One README row is stale and one low-cost invariant test would make the repaired contract harder to regress.

**Findings kept:** 2

## [P1][README-MISALIGNMENT] mcp_server README reports stale schema version and migration range

- Evidence: .opencode/skills/system-spec-kit/mcp_server/README.md:174 says SCHEMA_VERSION is currently 30 and only describes migrations 28-30; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:626 defines SCHEMA_VERSION = 37.
- Detail: The README claim is materially stale for anyone auditing active_memory_projection and the active-row unique guard because it stops at the v28-v30 era. The code has advanced to schema v37, so the README no longer accurately describes the current migration surface around memory_index/projection behavior.
- Fix sketch: Update the README key-file row to state schema v37 and summarize or link the current migration range instead of hard-coding v30-era details.

## [P3][REFINEMENT] Projection-vs-write-guard invariant is fixed but only locally guarded

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1841-1851 creates a unique index over memory_index active logical keys; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1781-1787 explicitly removes the projection join from get_by_folder_and_path; .opencode/skills/system-spec-kit/mcp_server/tests/index-dedup-projection-evicted.vitest.ts:11-14 documents the crash class and lines 49-68 cover the regression.
- Detail: The code path behind the scan unique-constraint crash is currently corrected: the same-key dedup lookup scans memory_index rather than active_memory_projection, matching the unique index domain. Other inspected projection joins are active retrieval/scoring paths such as vector_search, keyword_search, trigger search, counts, and interference scoring, not same-key insert guards.
- Fix sketch: Add a small invariant/static regression test that fails if same-key write-guard SQL reintroduces JOIN active_memory_projection while the unique guard remains memory_index-wide.
