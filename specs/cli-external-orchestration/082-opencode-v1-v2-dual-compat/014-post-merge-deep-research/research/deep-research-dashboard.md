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
- Topic: What drift, bugs and refinements remain in the work four branches merged to main on 2026-10-19 (OpenCode v1/v2 dual compatibility, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner), what is the best dual-version architecture, and where do the changed code and docs miss the sk-code-skilled and sk-doc contracts
- Started: 2026-10-19T19:08:58.499Z
- Status: INITIALIZED
- Iteration: 4 of 10
- Session ID: 2026-10-19T19:08:58.499Z
- Parent Session: 2026-10-19T18:20:15.000Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | A21 Pi fast-mode claim in a trusted project: zero --fast in trusted main checkout | - | 0.90 | 0 | insight |
| 2 | A22 plugin bridge drift: dualPlugin coverage of .opencode/plugins entry files, hard-coded plugin lists in the v2 test suites and doctor battery, bridge event/hook mapping coverage, README and mirror sync | - | 0.90 | 0 | insight |
| 3 | A26 Command, agent and config dual reads: the compiled-manifest writer, per-version registration risk, parity of commands/agents/config reads, and the orphaned compiled manifest in the main checkout | - | 0.75 | 0 | insight |
| 4 | A30 architecture synthesis and ranked remediation: absorb this session's iterations 1-3 (A21, A22, A26) and the four sibling reports (015 A23, 016 A24/A25, 017 A27, 018 A28/A29), decide the dual-version architecture, and emit one ranked remediation list across all ten angles with evidence labels preserved. | - | 0.60 | 0 | insight |

- iterationsCompleted: 4
- keyFindings: 35
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Why does a plain `pi --help` in the trusted main checkout register no `--fast`, and what claim design registers exactly one copy in every layout?
- [x] Which sk-vision OpenCode 2 runtime paths can still misbehave (registration, grace, close, interpreter checks, venv race)?
- [x] Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main?
- [x] Where do the changed code and docs miss sk-code-skilled and sk-doc, and what dual-version architecture should the remediation converge on?
- [ ] Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████████▇▇▆▅▅▄▄▃▃▂▂▁
- score sparkline: ████████▇▇▆▅▅▄▄▃▃▂▂▁
- Last 3 ratios: 0.90 -> 0.75 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
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
Sibling open questions folded into the record (owner: operator probes or later checks): 015 — does OpenCode 2.0.32's `@opencode/plugin` context declare `session`/`tool` domains (retires f-004); how often does a real `ctx.session.get` fail (weights f-002). 016 — does 1.19.3 accept `--share` at runtime; which agent directory does the binary read; which plugin failed the v1 import harness at `6d7f6b8499` (the `battery-v1` artifact of run 39308825187 holds it). 017 — does any repo gate run the `.pi` extension packages' tests (weights row 2); are the `mcp-code-mode` and `sk-design-md-generator/backend` lockfiles tracked; should the hooks tree join the existing guard workflow or get its own. 018 — does the vitest run report 80; does a dedicated adapter-suite runner already cover `.pi` (retires row 32); do the remaining ~227 docs pass their validators.

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
