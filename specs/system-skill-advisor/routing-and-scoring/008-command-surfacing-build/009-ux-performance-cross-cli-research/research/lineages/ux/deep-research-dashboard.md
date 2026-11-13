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
- Topic: Find further improvements to command surfacing after the planned phases 005 to 008: better UX for the person and the model (what the hook brief says, when a command is offered, asked or started, the install and setup path for an external repository), better performance (hook time, embedder cost, cold start, token cost of the brief) and above all usefulness across the six CLIs (claude, codex, opencode, pi, devin, dsh): whether a model on each runtime actually starts an offered command, and what stops it.
- Started: 2026-11-12T22:53:18Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-ux-1794523629654-v541y3
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
| 1 | The model-visible brief: measured payload, withheld document path, unobservable offer, and the argued-route scoring defect | brief-contract | 0.90 | 5 | complete |
| 2 | Before-arm runtime behaviour: the policy split behind each start rate, the path-versus-outcome gap, and the policy that stops at the command | cross-cli-behaviour | 0.88 | 4 | complete |
| 3 | Per-runtime command discovery: the 12-command Claude loss, the three native spellings, and the missing visibility check | discovery-surface | 0.83 | 3 | complete |
| 4 | First run in an external repository: the skipped cold advisor, the first-start budget inversion, the shadowed hook config, and the spelling correction | first-run | 0.88 | 4 | complete |
| 5 | The cost ledger: measured brief and hook cost, the invisible part, and the missing session total | cost | 0.88 | 4 | complete |

- iterationsCompleted: 5
- keyFindings: 20
- openQuestions: 2
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/5
- [x] Which before-arm runtime behaviour explains the start rates (claude 3 of 12, codex 0 of 12, pi 0 of 12, devin 2 of 12 or 12, opencode 4 of 9, dsh 3 of 8), and what stops a model from starting an offered command?
- [x] What does a person installing Skilled into an external repository see on first run, and where does the setup path still fail silently after the embedder work phase 008 plans?
- [x] What is the measured cost of the brief and of the hook (latency, tokens, cold start, embedder), and which part of that cost is invisible to the person paying it?
- [ ] What does the hook brief actually put in front of a model today, and can a model on each of the six CLIs act on it without guessing the command id, its policy, the document to read and whether it was already offered? [legacy-import]
- [ ] Which command-discovery surface defects (the g5 `skill.md` collision and its siblings) keep a command from being offered or found on each runtime, and what detects them before a user hits one? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] What does the hook brief actually put in front of a model today, and can a model on each of the six CLIs act on it without guessing the command id, its policy, the document to read and whether it was already offered?
- [ ] Which command-discovery surface defects (the g5 `skill.md` collision and its siblings) keep a command from being offered or found on each runtime, and what detects them before a user hits one?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▆▆▅▄▃▂▂▃▄▅▆▆▆▆▆▆
- score sparkline: ██▇▇▆▆▅▄▃▂▂▃▄▅▆▆▆▆▆▆
- Last 3 ratios: 0.83 -> 0.88 -> 0.88
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.88
- coverageBySources: {"code":47,"other":17}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename. (iteration 1)
- **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation. (iteration 1)
- Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5. (iteration 1)
- Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85] (iteration 1)
- **Re-running the before arm to stabilise the numbers.** The arm is still growing (devin 16, opencode 14, dsh 12 at 23:01) and phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs. (iteration 2)
- **Treating the low claude start rate as a briefing failure.** The per-row split shows claude starts every read-only doctor row it meets (3 of 4) and no mutating one; a wording change would have to explain why the same brief works for one class and not the other, so the cause is the model's judgment about its own capability, not the text alone. (iteration 2)
- Looking for a per-policy figure in the existing summary: `--summary` prints one aggregate per arm and no policy breakdown, so the split had to be recomputed per session in this iteration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640] (iteration 2)
- Looking for a rule that binds a command's policy to its skill path: Gate 2 has no command clause today, and the phase 006 bullet draft binds only "a brief or advisor result that names a command". [SOURCE: AGENTS.md:63] (iteration 2)
- **Renaming the `create` ids to flat names across all runtimes.** It would unify the spelling and remove the collision, but operator answer Q025 leaves the create ids as a recorded limitation. The visibility count and the spelling column reach the same operational goal without the rename. (iteration 3)
- **Treating the OpenCode mirror as safe because its command syntax differs.** The mirror is built from the same canonical tree and includes the same `skill.md`; the difference in syntax is a hypothesis, not a measurement, and the g5 probe has not run there. (iteration 3)
- Looking for a command-visibility metric in the existing doctor routes: `/doctor:runtime-mirrors` reports link and directory drift, and no route reports how many commands a runtime exposes. [SOURCE: .skilled/commands/doctor/_routes.yaml:227] (iteration 3)
- Looking for a native command root for Devin: `.devin` holds agents, hooks, skills and repo rules; there is no command or prompt directory. (iteration 3)
- **Adding a recommendation leg to `/doctor:setup`.** The route's own invariant forbids starting the advisor daemon, and a leg that starts it would make the read-only diagnostic write runtime state. The "Prove it" step belongs in the install guide, where starting the daemon is the point. (iteration 4)
- **Showing a degraded-lane line in the hook brief.** Operator answer Q037 keeps the hook brief unchanged for a switched-off meaning lane; the setup check, the status tool and the JSON warning are the chosen surfaces, and phase 008 already adds them. (iteration 4)
- Looking for a first-prompt cold-start number in the packet: the measured files record warm embeddings, warm CLI calls and warm hook latency, and no recorded cold daemon start. The gap is stated rather than guessed. (iteration 4)
- Looking for a setup leg that reads the target's hook config: the five legs (six after 008) cover sk-code, sk-git, trigger index, runtime mirrors, the advisor and the embedder, and all run in the checkout or against the checkout's store. (iteration 4)
- **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162] (iteration 5)
- **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation. (iteration 5)
- **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected. (iteration 5)
- Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands. (iteration 5)
- Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout. (iteration 5)

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
Follow up on: **No session-total cost is recorded.** The pieces are measured separately — hook per call, embedder per call, CLI per call — and no committed script reports a session-shaped total of N prompts plus one daemon start pl...

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
