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
- Topic: Redesign /doctor:update into a release-aware updater for this framework. It must smartly detect which release tag the operator's checkout is on (tags, changelog versions, skill version frontmatter), find the latest upstream release, and compute what changed between the operator's current state and that release. For skills the operator has NOT customized, it updates them to the release. For skills the operator HAS customized or overridden locally (for example sk-git or sk-code), it must not overwrite: it proposes fixes that align them with the latest release while keeping the repo's own override specifics. Detection of customization and the alignment proposals must be smart (three-way merge against the release base, provenance markers, hashes, git history), and where manual, guided and evidence-backed. Decide whether this is one command or several (for example check, apply, align), what happens to today's database-rebuild behaviour of /doctor:update, and specify each resulting command's workflow YAML to the sk-create-command contract (thin router, -presentation.txt, workflow YAML with approval gates, rollback, dry-run). Ground every claim in this repository: .skilled/commands/doctor/, .skilled/changelog/, skill changelogs and versions, sk-git, sk-doc/sk-create-command, the install and sync scripts.
- Started: 2026-10-02T20:15:14.317Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-10-02T20:15:14.286Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | unknown | - | 0.85 | 0 | insight |
| 2 | unknown | - | 0.72 | 0 | insight |
| 3 | unknown | - | 0.60 | 0 | insight |
| 4 | unknown | - | 0.70 | 0 | insight |
| 5 | unknown | - | 0.70 | 0 | insight |
| 6 | unknown | - | 0.75 | 0 | insight |
| 7 | unknown | - | 0.60 | 0 | insight |
| 8 | unknown | - | 0.60 | 0 | insight |
| 9 | unknown | - | 0.62 | 0 | insight |
| 10 | unknown | - | 0.45 | 0 | insight |

- iterationsCompleted: 10
- keyFindings: 142
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: How can the updater determine which release the operator's checkout is on (git tags, `.skilled/changelog/` versions, skill `version` frontmatter, skill changelogs) and find the latest upstream release, and how is the delta between the two computed from repository evidence? [legacy-import]
- [ ] Q2: How should the updater detect that a skill is customized or overridden locally (three-way merge against the release base, provenance markers, content hashes, git history), and which of those signals does this repository already produce or could produce cheaply? [legacy-import]
- [ ] Q3: For a customized skill such as sk-git or sk-code, how should the updater build an alignment proposal against the latest release that keeps the repo's override specifics, and how is that proposal presented, approved and applied in a guided, evidence-backed way? [legacy-import]
- [ ] Q4: Should this be one command or several (for example check, apply, align), and what happens to today's database-rebuild behaviour of /doctor:update (kept, moved, renamed or retired)? [legacy-import]
- [ ] Q5: What does each resulting command look like under the sk-create-command contract (thin router, `-presentation.txt`, workflow YAML with approval gates, rollback and dry-run), and how does it reuse the existing install and sync scripts? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: How can the updater determine which release the operator's checkout is on (git tags, `.skilled/changelog/` versions, skill `version` frontmatter, skill changelogs) and find the latest upstream release, and how is the delta between the two computed from repository evidence?
- [ ] Q2: How should the updater detect that a skill is customized or overridden locally (three-way merge against the release base, provenance markers, content hashes, git history), and which of those signals does this repository already produce or could produce cheaply?
- [ ] Q3: For a customized skill such as sk-git or sk-code, how should the updater build an alignment proposal against the latest release that keeps the repo's override specifics, and how is that proposal presented, approved and applied in a guided, evidence-backed way?
- [ ] Q4: Should this be one command or several (for example check, apply, align), and what happens to today's database-rebuild behaviour of /doctor:update (kept, moved, renamed or retired)?
- [ ] Q5: What does each resulting command look like under the sk-create-command contract (thin router, `-presentation.txt`, workflow YAML with approval gates, rollback and dry-run), and how does it reuse the existing install and sync scripts?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▄▅▅▅▆▆▆▄▄▄▄▄▄▂▁
- score sparkline: █▇▆▅▄▄▅▅▅▆▆▆▄▄▄▄▄▄▂▁
- Last 3 ratios: 0.60 -> 0.62 -> 0.45
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.45
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
**Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (iteration 004 sketched both; iteration 009 fixed the registration surface).

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
