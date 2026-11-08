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
- Topic: Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the advisor, hooks and relaunch cluster: .skilled/skills/system-skill-advisor/**, compiled routing (each skill's hub-router.json, ROUTER.md, mode-registry.json), .skilled/hooks/** with the runtime adapters in .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions and .dsh/plugins, session relaunch, history after compaction and question-tool decision capture. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.
- Started: 2026-11-08T19:57:04.000Z
- Status: INITIALIZED
- Iteration: 3 of 10
- Session ID: 2026-11-08T19:57:04.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | v4.0.1.0 every skill routes from its own file: sibling ROUTER.md, SKILL.md link, and hub registry/ROUTER/hub-router agreement | - | 0.52 | 0 | insight |
| 2 | Advisor scoring rules: path-mention, confidence-floor tie, typed-command owner, named-workflow-first | - | 0.60 | 0 | insight |
| 3 | unknown | - | 0.00 | 0 | error |

- iterationsCompleted: 3
- keyFindings: 40
- openQuestions: 10
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/12
- [x] Router files (v4.0.1.0): does every skill and mode under .skilled/skills/** have a ROUTER.md linked from SKILL.md in one line, and do each hub's hub-router.json and mode-registry.json agree with its ROUTER.md?
- [x] Advisor scoring (v4.0.0.7, v4.0.0.15, v4.0.0.16): do the path-mention rule, the confidence-floor tie rule and the typed-command owner rule in .skilled/skills/system-skill-advisor/** behave as the notes say when run through node .skilled/bin/skill-advisor.cjs advisor_recommend?
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md? [legacy-import]
- [ ] Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today? [legacy-import]
- [ ] Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit? [legacy-import]
- [ ] Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag? [legacy-import]
- [ ] Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim? [legacy-import]
- [ ] History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names? [legacy-import]
- [ ] Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative? [legacy-import]
- [ ] Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit? [legacy-import]
- [ ] Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed? [legacy-import]
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 10
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md?
- [ ] Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?
- [ ] Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?
- [ ] Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?
- [ ] Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim?
- [ ] History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names?
- [ ] Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative?
- [ ] Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?
- [ ] Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▇▇▇██████▇▆▅▅▄▃▂▂▁
- score sparkline: ▇▇▇▇▇██████▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.52 -> 0.60 -> 0.00
- Stuck count: 1
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.00
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
Does F-iter002-001 reproduce on other prompts whose top recommendation is confidence-floored, such as a doctor prompt with a single floored winner?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- Latest iteration reported error status.

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
