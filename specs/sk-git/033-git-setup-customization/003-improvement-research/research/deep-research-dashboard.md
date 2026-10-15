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
- Topic: How can the read-only /doctor:git setup check and the /doctor:git command family be improved further? Study the shipped work: .skilled/commands/doctor/scripts/git-setup-check.cjs and its test, .skilled/commands/doctor/git.md, _routes.yaml, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, the sk-git skill (.skilled/skills/sk-git/SKILL.md, scripts/, hard-rules.json, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384) and the packets specs/sk-git/033-git-setup-customization (001 research, 002 build) and specs/sk-git/034-standards-template-round-trip. Find concrete improvements: checks still missing, failure modes the battery reads as healthy, repairs that could be wrong, untrusted-repository vectors not yet closed (any git or helper path a repository config can steer), drift between docs and behavior, test gaps, and the deferred items (a per-repository hard-rules.json overlay, the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests). Rank each with impact and effort and cite path:line for every claim. End with proposed implementation phases.
- Started: 2026-10-15T13:34:40Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-10-15T13:34:40Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 and Q2: inspect git-setup-check.cjs and its test end to end; map checks, subprocesses, repository-derived paths, false-healthy readings, and repository-steerable vectors. | - | 0.86 | 8 | complete |
| 2 | Q5: deferred hard-rules overlay design and current CI status for Gate Inputs and sk-doc Script Tests | - | 0.67 | 3 | complete |
| 3 | Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded? | documentation | 0.75 | 4 | complete |
| 4 | Q3 repair audit: compare every setup-battery repair and the hooks, standards, and setup targets with the operation they actually perform | doctor-git-repair-safety | 0.88 | 8 | complete |
| 5 | Q5 final iteration: close the per-repository hard-rules overlay design and verify Gate Inputs and sk-doc Script Tests CI evidence. | - | 0.50 | 4 | timeout |

- iterationsCompleted: 5
- keyFindings: 26
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Q1: Which sk-git settings or failure modes does git-setup-check.cjs still miss, or read as PASS/SKIP when the setting is actually broken (false-healthy readings)?
- [x] Q2: Which untrusted-repository vectors remain open, meaning any git invocation, helper path, hook path, config key or environment the inspected repository can steer while the battery runs?
- [x] Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- [x] Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded?
- [ ] Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests (root cause and fix)? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests (root cause and fix)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▅▄▅▅▅▅▆▆▇▇█▇▅▄▂▁
- score sparkline: █▇▆▅▅▄▅▅▅▅▆▆▇▇█▇▅▄▂▁
- Last 3 ratios: 0.75 -> 0.88 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"code":18,"other":33}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. (iteration 4)
- No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result. (iteration 5)

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
Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests? The two identified repository-wide sk-doc cases are statically traced, but the remaining historical failure names and present run status need a successful GitHub API lookup.

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
