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
- Topic: Design first-class named sub-tracks in spec-kit (specs/<track>/<sub-track>/<NNN>-<slug>/) and the three smaller host-repository fixes, from the Barter handover barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/005-skilled-harness-support/handover.md and its research note 004-priority-numbering-subtracks/scratch/nested-tracks.md (both read-only). Item 1: every site that assumes a track sits directly under specs/ — known: runtime/cli/lib/track-roots.mjs:38-66,104-130; refresh-track-roots.mjs:76-79; create.sh:1012; lib/validation/orchestrator.ts:219-223,1340; validate.sh:186,273,315; repair-derived.cjs parent_id on move; archive.sh is_packet_home:207 and track_of:189; sweep-track-roots.mjs and the pre-push gate via track-roots. Find any others, define the sub-track level and its metadata, keep flat tracks unchanged, and give a failing-first test plan. Item 3: project_owned .env.example doctor manifest entry (Barter overlay at barter/ai-speckit/skilled/barter-overlays/doctor/). Item 4: the tracked .skilled/specs -> ../specs link dangling in a vendored copy. Item 5: a documented host-repository trigger index and how the Gate 1 lookup finds it. Item 2 (linked specs root writes) is out of scope: packet specs/system-speckit/037-symlinked-runtime-root owns it. Read-only outside the spec folder; never open any .env file. Cite file:line for every finding.
- Started: 2026-11-07T12:13:10.014Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: 2026-11-07T12:13:10.014Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: complete the inventory of one-level track assumptions and what each does with a sub-track packet today. | - | 0.62 | 0 | complete |
| 2 | Q2-Q5: define named sub-track metadata and failing-first tests, and resolve the doctor, vendored-link, and host-index design questions. | - | 0.74 | 0 | insight |
| 3 | Adversarially verify prior file-line claims and the sub-track contract against metadata, validation, archive, symlink, repair, hooks, retrieval, and host-integration edge cases. | - | 0.55 | 0 | insight |

- iterationsCompleted: 3
- keyFindings: 24
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Which spec-kit sites (code, hooks, generators, gates, docs) assume a track sits directly under specs/, beyond the seven already known, and what does each do with a packet inside a sub-track today?
- [x] Q2: How should a named sub-track be defined: its detection rule, its own graph-metadata.json and description.json, parent_id and children_ids on the track and the sub-track, and how ids and numbering work, with flat tracks unchanged?
- [x] Q3: What failing-first test plan proves sub-track support (track roots, refresh, create, validate, recursive validate, archive, pre-push sweep, repair-derived on move) and proves flat tracks unchanged?
- [x] Q4: How should a project-owned doctor manifest entry for .env.example work upstream: the manifest flag, the engine's project-owned status and the setup post-check, compared with Barter's overlay?
- [x] Q5: How should the dangling .skilled/specs link in a vendored copy be fixed, and how should a host-repository trigger index be documented, including how the Gate 1 lookup finds it?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▅▅▅▆▆▇▇██▇▆▅▅▄▃▂▂▁
- score sparkline: ▄▄▅▅▅▆▆▇▇██▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.62 -> 0.74 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
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
