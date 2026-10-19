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
- Topic: Map every reference to the sk-code-opencode surface (all spellings: sk-code-opencode, bare code-opencode, path/title/snake forms) across the repo — skill folder, sk-code hub registry/router/graph-metadata/SKILL.md mode tables, system-skill-advisor DB and compiled routes and integration code, runtime mirrors (.hermes/.claude/.codex etc.), scripts, tests, fixtures, and markdown (live docs vs history: changelogs, z_archive, research logs) — and produce an ordered, test-guarded plan for renaming it to sk-code-skilled, with exclusions for the OpenCode runtime's own names (.opencode/, cli-opencode) and a recommendation on rewriting history references
- Started: 2026-10-18T17:35:32.240Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-10-18T17:35:32.240Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence? | - | 0.85 | 0 | insight |
| 2 | Follow up on: Compiled routing itself is registry-driven: `.skilled/bin/compiled-route.cjs` contains no `sk-code-opencode` literal (absent from the complete 38-match `.cjs` sweep) — it resolves through the hub JSONs in F2. | - | 0.65 | 0 | insight |
| 3 | Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)? | - | 0.60 | 0 | insight |
| 4 | Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it? | - | 0.62 | 0 | insight |
| 5 | Q4: ordered test-guarded rename plan; Q5: history-reference counts and rewrite-vs-exclude; residuals closed: advisor_rebuild command and trigger-index --check guard | - | 0.80 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 39
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence?
- [x] Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?
- [x] Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it?
- [x] Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- [x] Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▄▃▂▂▂▁▁▁▁▁▁▂▂▃▄▆▇
- score sparkline: █▇▆▄▃▂▂▂▁▁▁▁▁▁▂▂▃▄▆▇
- Last 3 ratios: 0.60 -> 0.62 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

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
