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
- Topic: Second-pass, expand-do-not-converge deep audit of the sk-doc/019-skill-routing-refactor parent packet AND its full 21-child tree, going BEYOND the first audit which only covered the parent-level docs; find what the first pass missed or could not reach. Investigate at minimum: (1) each child packet internal consistency and completion-truthfulness (spec.md status vs implementation-summary vs graph-metadata vs checklist), including the two known committed child errors 012-sk-doc-routing-fixes (missing a required Level-3 file plus LEVEL_MATCH inconsistency) and 017-system-code-graph-routing-research (frontmatter _memory-block violation), and whether similar defects exist in other children; (2) drift between the parent routing-reference docs (routing-config-and-advisor-reference.md, routing-before-after.md, context-index.md, spec.md) and the ACTUAL live state of the compiled-routing runtime at .opencode/bin/lib/compiled-routing/ and all 7 hubs hub-router.json / mode-registry.json / leaf-manifest.json / shared/references/smart-routing.md; (3) whether the just-landed parent-doc fixes in commit 140266be3e introduced any NEW inconsistency, stale cross-reference, wrong metric, or broken link; (4) lifecycle-status truthfulness parent-vs-child across the whole tree, and correctness of derived.last_active_child_id and children_ids; (5) any broken, stale, or non-repo-rooted cross-document link anywhere in the tree; (6) resume-safety and nested-topology gaps (the 020/007 duplicate-012 prefix collision and the 14-child 015 sub-parent). For EVERY finding give file:line evidence, a severity (P1 or P2), state whether it is NEW (introduced by the recent fixes) or PRE-EXISTING, and verify the claim against the real file before reporting. Do NOT treat frozen historical artifacts as defects; EXCLUDE research/**, benchmark/**, lineages/**, *.out, *.log, and run-record artifacts.
- Started: 2026-07-23T19:09:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-luna-1784833766851-nhdtp
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Direct-child packet consistency, required-file completeness, and completion truthfulness | - | 0.92 | 5 | complete |
| 2 | Parent routing references versus live compiled runtime | - | 0.84 | 2 | complete |
| 3 | Commit 140266be3e, metrics, and links | - | 0.73 | 1 | complete |
| 4 | Nested topology, lifecycle metadata, and resume safety | - | 0.67 | 3 | complete |
| 5 | Full seven-hub identity and serving-surface audit | - | 0.55 | 0 | complete |
| 6 | Authored path references in child packets | - | 0.46 | 2 | complete |
| 7 | Exhaustive lifecycle-status matrix | - | 0.38 | 1 | complete |
| 8 | Typed resource-contract replay | - | 0.52 | 1 | complete |
| 9 | Independent finding re-read and commit-boundary audit | - | 0.22 | 0 | complete |
| 10 | Max-iteration lineage integrity | - | 0.08 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 15
- openQuestions: 3
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/3
- [ ] Do all 21 child packets agree internally on status, required files, metadata, checklists, and completion truthfulness? [legacy-import]
- [ ] Does the parent documentation match the compiled-routing runtime and all seven hub manifests after commit 140266be3e? [legacy-import]
- [ ] Are lifecycle metadata, links, duplicate prefixes, nested topology, and resume paths safe across the entire tree? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Do all 21 child packets agree internally on status, required files, metadata, checklists, and completion truthfulness?
- [ ] Does the parent documentation match the compiled-routing runtime and all seven hub manifests after commit 140266be3e?
- [ ] Are lifecycle metadata, links, duplicate prefixes, nested topology, and resume paths safe across the entire tree?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▆▅▅▄▄▄▄▄▄▃▂▂▁
- score sparkline: ██▇▇▇▆▆▆▅▅▄▄▄▄▄▄▃▂▂▁
- Last 3 ratios: 0.52 -> 0.22 -> 0.08
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.08
- coverageBySources: {"code":37,"other":18}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs. (iteration 2)
- Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration. (iteration 2)
- Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution. (iteration 3)
- Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion. (iteration 3)
- A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents. (iteration 4)
- The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation. (iteration 4)
- Manifest regeneration drift in any of the seven hubs. (iteration 5)
- Missing serving-closure files or activation manifests. (iteration 5)
- Registry/router/manifest mode-set drift across the seven hubs. (iteration 5)
- Historical underscore references in frozen verification/research artifacts were not promoted to findings. (iteration 6)
- The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally. (iteration 6)
- `in_progress` states with explicit deferred requirements or blocked gates were not treated as contradictions by themselves. (iteration 7)
- Frozen historical review/research/benchmark statuses were excluded from the matrix. (iteration 7)
- No equivalent unresolved typed contract was found in representative replays for the other six hubs. (iteration 8)
- No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean. (iteration 8)
- The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking. (iteration 8)
- No promotion of frozen historical artifacts or missing Markdown links to current findings. (iteration 9)
- No severity downgrade: the P1 findings affect validator correctness, lifecycle/resume safety, serving-contract truthfulness, or live typed resource resolution. (iteration 9)
- No excluded research, benchmark, lineage, log, output, or run-record artifact was promoted into the result. (iteration 10)
- No speculative or duplicate finding was added merely to fill the tenth iteration. (iteration 10)

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
Synthesis must consolidate the evidence without rewriting or mutating the audited parent/child packets.

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
