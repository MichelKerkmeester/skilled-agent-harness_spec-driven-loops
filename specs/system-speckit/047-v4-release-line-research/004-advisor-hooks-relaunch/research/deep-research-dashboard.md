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
- Started: 2026-11-08T20:14:40.000Z
- Status: INITIALIZED
- Iteration: 22 of 22
- Session ID: 2026-11-08T20:14:40.000Z
- Parent Session: 2026-11-08T20:14:40.000Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Advisor transport and parity: MCP remnant sweep, CI parity wiring, daemon lease/lock reading, live two-front-door comparison | - | 0.72 | 0 | insight |
| 2 | Advisor prompt hook across runtimes: adapter, single-source import vs copy, timeout and slow/fail emission for Claude, Codex, Cursor, Devin, OpenCode, Pi and dsh. | - | 0.66 | 0 | insight |
| 3 | Session relaunch (v4.0.0.13 endless sessions, v4.0.0.14 opt-in per-runtime handover) | - | 0.68 | 0 | insight |
| 4 | History after compaction (v4.0.2.0): the read-only session lookup, its per-runtime producers, its refusal paths and its read-only guarantee | - | 0.64 | 0 | insight |
| 5 | Question-tool decision capture: ask-surface-guard detector accuracy, once-guard enforcement and decision-capture write paths | - | 0.72 | 0 | insight |
| 6 | Hook safety (three-second stdin deadline + git-call time limit) and Hermes residue. | - | 0.70 | 0 | insight |
| 7 | Over-engineering across hooks, plugins and the advisor: name the release that added each surface, count live production callers, produce a cut list with evidence | - | 0.66 | 0 | insight |
| 8 | Unread releases for the advisor: surfaceHint schema bounds and plugin marker logic (v4.0.0.6), doctor-command suggestions on three release-note prompts (v4.0.0.12, v4.0.1.0), and where doctor routing lives plus its coverage of .skilled/commands/doctor | - | 0.55 | 0 | insight |
| 9 | Unread releases for hooks and plugins: v4.0.0.3 live-sync on Cursor/Devin plus the hook list's why-not notes, v4.0.0.13 17-plugin dual-compat claim with the shared shim and the plugin test run, and injection-contract.md against today's adapters. | - | 0.62 | 0 | insight |
| 10 | Close-out: UX and extension — root cause of the AI_SESSION_CHILD relaunch-suite failure, operator enable-relaunch/brief/history UX, and three extension proposals | - | 0.58 | 0 | insight |
| 11 | Unread releases v4.0.0.5, v4.0.0.10, v4.0.0.11 and v4.0.0.12 (advisor, hook, relaunch claims only) | - | 0.58 | 0 | insight |
| 12 | Unread releases v4.0.0.5, v4.0.0.15 and v4.0.0.16, cluster paths only | - | 0.55 | 0 | insight |
| 13 | Least-read release notes v4.0.0.9/.4/.3/.11: advisor respawn switch, hook-flags precedence, /doctor:git setup check count and tool enum | - | 0.50 | 0 | insight |
| 14 | Release-claim audit of v4.0.0.1, v4.0.0.6, v4.0.0.9 and v4.0.0.10 in the advisor, hook and relaunch cluster | - | 0.45 | 0 | insight |
| 15 | Final read-only verification pass: re-verify eight open P1s at their cited path:line, state per-item regression coverage, name strongest finding per type | - | 0.35 | 0 | insight |
| 15 | Final read-only verification pass: re-verify eight open P1s at their cited path:line, state per-item regression coverage, name strongest finding per type | - | 0.30 | 0 | insight |
| 17 | Verify the ask-surface once-guard keying per adapter and every non-test caller of the Python advisor | - | 0.40 | 0 | insight |
| 18 | Dispatch-audit log rooting across the six runtime adapters, plus the decision-capture and goal hooks and every writer of .skilled/logs | - | 0.60 | 0 | insight |
| 19 | Read the goal hook (.skilled/hooks/goal/**, per-runtime adapters, goal-core.cjs, goal-slice.cjs, bin/goal.cjs) and its tests; check goal claims in v4.0.0.16 and v4.0.2.0 against code with path:line; run the hook's suites read-only; report bugs, drift and sk-code misalignment. | - | 0.35 | 0 | insight |
| 19 | Read the goal hook (.skilled/hooks/goal/**, per-runtime adapters, goal-core.cjs, goal-slice.cjs, bin/goal.cjs) and its tests; check goal claims in v4.0.0.16 and v4.0.2.0 against code with path:line; run the hook's suites read-only; report bugs, drift and sk-code misalignment. | - | 0.62 | 0 | insight |
| 21 | Decision-capture paths and README fidelity; DSH hook registration vs every .skilled/hooks/*/dsh/ adapter | - | 0.50 | 0 | insight |
| 22 | Final iteration at the ceiling: misalignment sweep against repository code conventions over .skilled/skills/system-skill-advisor/runtime, .skilled/hooks and .opencode/plugins — comment-embedded ephemeral labels, and hook entry file module header blocks. | - | 0.30 | 0 | insight |

- iterationsCompleted: 22
- keyFindings: 203
- openQuestions: 3
- resolvedQuestions: 8

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 8/11
- [x] Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?
- [x] Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?
- [x] Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?
- [x] Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim?
- [x] History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names?
- [x] Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative?
- [x] Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?
- [x] Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md? [legacy-import]
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks? [legacy-import]
- [ ] Advisor follow-ups from generation 1: does the sk-doc mode-registry shared-packet entry (sk-create-skill-parent) and the duplicate package_skill.py cause any routing or package-check defect when the advisor routes a /create:skill-parent request? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md?
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks?
- [ ] Advisor follow-ups from generation 1: does the sk-doc mode-registry shared-packet entry (sk-create-skill-parent) and the duplicate package_skill.py cause any routing or package-check defect when the advisor routes a /create:skill-parent request?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇█▇▆▆▆▆▅▄▃▂▂▅▃▅▅▁
- score sparkline: █▇▇▇█▇▆▆▆▆▅▄▃▂▂▅▃▅▅▁
- Last 3 ratios: 0.62 -> 0.50 -> 0.30
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.30
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
**New — which is the canon, `MODULE` or `COMPONENT`?** f-iter022-004 records the split but not the decision. `sk-code`'s module-header reference is the arbiter; if it says `MODULE`, the 4 files are the defect, and if it says nothing, the finding is the missing rule rather than the 4 files.

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
