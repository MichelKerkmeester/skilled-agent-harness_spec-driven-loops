---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Restructure the sk-design styles tree so the 1290 downloaded style data folders are separated from the backend code (database, engine, harness, manifests), aligned to the proven system-deep-loop/runtime architecture (code in lib-style modules, real sqlite under a database directory, kebab-case throughout). Deliver a concrete target folder layout, a migration path from the current flat mixed structure, and the git-mv rename plan.
- Started: 2026-07-21T06:43:40Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-sol-high-fast-1784616068213-1azjys
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Map the exact current styles-tree topology and all path consumers before proposing names. | - | 0.89 | 9 | complete |
| 2 | Reference-architecture transfer rules and intentional styles-specific differences. | architecture | 0.88 | 8 | complete |
| 3 | Concrete target tree and exact ownership of every current artifact class. | architecture | 0.88 | 8 | complete |
| 4 | Dependency-ordered migration, exact shell-safe git mv plan, compatibility policy, verification ladder, and rollback. | migration | 0.86 | 8 | complete |
| 5 | Final conformance audit, contradiction resolution, inventory completeness, command safety, and implementation-ready adjudication. | audit | 0.44 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 33
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What is the exact current ownership and dependency topology across style data, engine, database, harness, manifests, tests, docs, and consumers?
- [x] Which parts of system-deep-loop/runtime transfer directly, and where should styles intentionally differ?
- [x] What target layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation?
- [x] What dependency-ordered migration preserves behavior and avoids a flag day across imports, path constants, fixtures, commands, and docs?
- [x] What exact git mv sequence, verification ladder, rollback boundary, and compatibility policy should implementation use?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████████████▇▅▄▂▁
- score sparkline: ███████████████▇▅▄▂▁
- Last 3 ratios: 0.88 -> 0.86 -> 0.44
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.44
- coverageBySources: {"code":27,"other":75}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable. (iteration 2)
- Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes. (iteration 2)
- Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own. (iteration 2)
- Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers. (iteration 2)
- Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model. (iteration 2)
- Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree. (iteration 2)
- A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary. (iteration 3)
- Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together. (iteration 3)
- Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`. (iteration 3)
- Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory. (iteration 3)
- Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again. (iteration 3)
- Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove. (iteration 3)
- Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots. (iteration 3)
- CLI wrappers during relocation: duplicate an existing dual-purpose contract without need. (iteration 4)
- Database creation during verification: persistent state is opt-in and separate from source rollback. (iteration 4)
- Old-path aliases or database fallback: hide incomplete migration without a concrete consumer. (iteration 4)
- Production oracle under `lib/database`: no production importer exists. (iteration 4)
- Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs. (iteration 4)
- Whole `_db` move: can carry ignored mutable artifacts. (iteration 4)
- Aliases, old-database fallback, or database creation: no concrete consumer justifies them. (iteration 5)
- Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries. (iteration 5)
- Committed example database artifacts: mutable and rebuildable. (iteration 5)
- Fixture-local manifest renames: fixtures intentionally exercise explicit paths. (iteration 5)
- New wrappers or production oracle code: contradicted by exports and importers. (iteration 5)
- Whole backend subtree moves: preserve false ownership and may carry ignored state. (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
