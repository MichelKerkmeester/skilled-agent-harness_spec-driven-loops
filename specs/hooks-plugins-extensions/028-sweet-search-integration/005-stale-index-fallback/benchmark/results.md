# Phase 5 benchmark: stale index fallback

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Stale phrases found (exit 0, declared only by docs the index does not list) | 0/10 | 10/10 | 10/10 | yes |
| Already-matching queries with identical output (JSON and human digests, no `staleFallback` key) | n/a | 10/10 | 10/10 | yes |
| Undeclared phrases still exit 1 | 5/5 | 5/5 | 5/5 | yes |
| Median time, matching queries (median of row medianMs) | 73.621 ms | 71.571 ms (-2.78%) | within 10% | yes |
| Cold-lookup p95 over prompt-set.json (default index, fallback live) | 121.1 ms | 151.609 ms | at or under 200 ms | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Per query

| Class | Query | Before exit | After exit | After top path | After fallback line | Before medianMs | After medianMs |
|-------|-------|-------------|------------|----------------|---------------------|-----------------|----------------|
| stale | sweet search verdict | 1 | 0 | `…/028-sweet-search-integration/001-sweet-search-research/research/research.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 73.375 | 146.744 |
| stale | phase 1 sweet search research | 1 | 0 | `…/028-sweet-search-integration/001-sweet-search-research/spec.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 77.982 | 152.796 |
| stale | retrieval lessons research | 1 | 0 | `…/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md` | `fallback   : 197 unindexed doc(s) read, 5 match(es)` | 73.2 | 144.071 |
| stale | phase 2 retrieval lessons research | 1 | 0 | `…/028-sweet-search-integration/002-retrieval-lessons-research/spec.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 77.994 | 155.054 |
| stale | retrieval feature design research | 1 | 0 | `…/028-sweet-search-integration/003-retrieval-feature-design-research/research/research.md` | `fallback   : 197 unindexed doc(s) read, 5 match(es)` | 75.874 | 148.349 |
| stale | rg wrapper flood control design | 1 | 0 | `…/028-sweet-search-integration/003-retrieval-feature-design-research/research/research.md` | `fallback   : 197 unindexed doc(s) read, 1 match(es)` | 70.86 | 139.43 |
| stale | trigger lookup total candidates | 1 | 0 | `…/028-sweet-search-integration/004-total-candidate-count/spec.md` | `fallback   : 197 unindexed doc(s) read, 1 match(es)` | 71.117 | 142.877 |
| stale | total candidate count plan | 1 | 0 | `…/028-sweet-search-integration/004-total-candidate-count/plan.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 87.988 | 155.901 |
| stale | ripgrep one row per file | 1 | 0 | `…/028-sweet-search-integration/006-rg-flood-control/spec.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 76.02 | 150.76 |
| stale | sweet search integration | 1 | 0 | `…/028-sweet-search-integration/spec.md` | `fallback   : 197 unindexed doc(s) read, 2 match(es)` | 73.74 | 144.59 |
| match | spec folder question | 0 | 0 | `specs/system-speckit/runtime-and-release/001-system-speckit-v4/048-gate-3-mutation-time-delivery/spec.md` | - | 73.281 | 73.776 |
| match | memory save continuity | 0 | 0 | `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/memory-save.md` | - | 73.969 | 72.268 |
| match | deep research convergence loop | 0 | 0 | `.skilled/skills/system-deep-loop/deep-research/README.md` | - | 78.854 | 77.277 |
| match | trigger index | 0 | 0 | `specs/system-speckit/runtime-and-release/001-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/spec.md` | - | 71.273 | 70.062 |
| match | communication quality | 0 | 0 | `specs/agents-md/agent-behavior/002-communication-quality/implementation-summary.md` | - | 69.139 | 70.558 |
| match | playbook scenario | 0 | 0 | `.skilled/changelog/skilled/v4.0.1.0.md` | - | 73.422 | 69.157 |
| match | release notes | 0 | 0 | `.skilled/skills/sk-doc/sk-create-changelog/README.md` | - | 70.611 | 68.108 |
| match | deep research strategy | 0 | 0 | `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | - | 85.805 | 75.522 |
| match | skill advisor hook | 0 | 0 | `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-004-004-devin-advisor-hook-integration.md` | - | 128.954 | 75.147 |
| match | memory context | 0 | 0 | `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/002-mcp-runtime-improvement-research/research/research.md` | - | 73.819 | 70.873 |
| none | zzqx qwvbn xkjfp | 1 | 1 | - | `fallback   : 197 unindexed doc(s) read, 0 match(es)` | 69.559 | 137.282 |
| none | quantum toaster calibration | 1 | 1 | `.skilled/skills/sk-code/changelog/v3.9.4.0.md` | `fallback   : 197 unindexed doc(s) read, 0 match(es)` | 85.737 | 134.964 |
| none | llama yodel harmonics | 1 | 1 | `.skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/README.md` | `fallback   : 197 unindexed doc(s) read, 0 match(es)` | 76.484 | 134.795 |
| none | purple walrus banjo | 1 | 1 | - | `fallback   : 197 unindexed doc(s) read, 0 match(es)` | 68.329 | 139.281 |
| none | glacier kazoo omelette | 1 | 1 | - | `fallback   : 197 unindexed doc(s) read, 0 match(es)` | 68.443 | 145.781 |

Measured 2026-11-09T20:40:57.673Z in worktree 335; runner benchmark/run.mjs. Before measured 2026-11-09T19:16:00.336Z on the code before this phase.

Notes:

- A zero-hit now costs about 135-155 ms for the whole process, up from about 75 ms, because it walks `specs/` and reads the unindexed spec docs (197 here). A query that already matches never runs the walk, which is why the matching median did not move.
- The prompt-set p95 rose from 121.1 to 151.6 ms: 5 of the 90 samples are a zero-hit case, and nearest-rank p95 lands on them. It stays under the 200 ms budget.
- The repository's own `measure-cold-lookup.mjs` passes `--index`, which keeps the lookup index-only, so its budget run is unaffected: p95 66.917 ms, max 68.308 ms, within budget (exit 0).
- Scenario 490 (conversational, devin) passed 1/1; evidence in `scenario-490/`.
