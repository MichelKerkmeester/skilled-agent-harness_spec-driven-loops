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
- Topic: Continue the conversation-adoption audit for the 28 manual-testing-playbook packages the first lineage never read. Apply the four ordered questions in .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md section Choosing the Scenario Style (Q1 human judgment -> single prompt; Q2 more than one exchange, answer-dependent next step, restart or compaction -> conversation; Q3 several runtimes or a regression gate with shell-checkable turns -> conversation; Q4 otherwise single prompt). The runner supports only claude-code, opencode, codex, pi and devin, and its only session actions are send, restart and compact. For each package below give convert, update, add or keep verdicts, or an explicit no-candidate note, each with a [SOURCE: path:line] tag and its deciding question. Packages (under .skilled/skills/): cli-classifier, cli-classifier/cli-jev, mcp-code-mode, mcp-tooling (hub), mcp-tooling/mcp-mobbin, mcp-tooling/mcp-refero, sk-code (hub), sk-code/sk-code-ci, sk-code/sk-code-quality, sk-code/sk-code-skilled, sk-design (hub), sk-design/sk-design-diagram, sk-design/sk-design-fundamentals, sk-design/sk-design-md-generator, sk-prompt, and sk-doc modes sk-create-agent, sk-create-benchmark, sk-create-changelog, sk-create-command, sk-create-diff, sk-create-feature-catalog, sk-create-frontmatter, sk-create-goal, sk-create-quality-control, sk-create-readme, sk-create-repo-rule, sk-create-skill, sk-create-with-human-voice. Each package's playbook is its manual-testing-playbook/ folder. The first lineage's results for the other 28 packages are in specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md; read it for the principles and do not re-audit those packages. Read only; change no playbook, skill or runner file.
- Started: 2026-11-02T18:18:53Z
- Status: COMPLETE
- Iteration: 6 of 6
- Session ID: fanout-devin-1793643468783-m86yfa
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
| 1 | First four unaudited packages: cli-classifier, cli-jev, mcp-code-mode, mcp-tooling hub | - | 1.00 | 5 | complete |
| 2 | mcp-mobbin, mcp-refero, sk-code hub, sk-code-ci, sk-code-quality | - | 1.00 | 5 | complete |
| 3 | sk-code-skilled, sk-design hub, sk-design-diagram, sk-design-fundamentals | - | 1.00 | 4 | complete |
| 4 | sk-design-md-generator, sk-prompt, sk-create-agent, sk-create-benchmark | - | 1.00 | 4 | complete |
| 5 | sk-create-changelog, sk-create-command, sk-create-diff, sk-create-feature-catalog, sk-create-frontmatter | - | 1.00 | 5 | complete |
| 6 | sk-create-goal, sk-create-quality-control, sk-create-readme, sk-create-repo-rule, sk-create-skill, sk-create-with-human-voice | - | 1.00 | 6 | complete |

- iterationsCompleted: 6
- keyFindings: 29
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Which scenarios in the 28 unaudited packages meet Q2 or Q3 and should convert or gain a conversation companion, and which are blocked by the runner's five runtimes and three session actions?
- [x] Which existing single-prompt scenarios need updating rather than converting because the behavior is multi-turn but the current scenario checks it only once?
- [x] Which packages have no conversation candidate at all, so every scenario stays single prompt under Q1 or Q4?
- [x] Which multi-turn, answer-dependent, restart, compaction or cross-runtime behaviors in these packages lack any scenario that a conversation would add?
- [ ] Which candidates rank highest by risk reduction relative to authoring and run cost across the 28 packages? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Which candidates rank highest by risk reduction relative to authoring and run cost across the 28 packages?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"other":48}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=6 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=6 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check. (iteration 1)
- Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior. (iteration 1)
- Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it. (iteration 1)
- Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation. (iteration 2)
- Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior. (iteration 2)
- Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload. (iteration 2)
- Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn. (iteration 3)
- Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch. (iteration 3)
- Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator. (iteration 3)
- Converting sk-prompt's SP-012 deliver-first scenario. Its rule explicitly forbids a clarifying question before the prompt, so a conversation would contradict the behavior it tests. (iteration 4)
- Searching sk-prompt for approval language. The only blocking branch is SP-008's `needs_disambiguation`; the rest of the skill is designed to deliver first and list open items. (iteration 4)
- Treating GUIDED-014's stop-before-validation as an approval gate. The wrapper halts because `DESIGN.md` does not exist; there is no operator answer that changes the next step. (iteration 4)
- Converting sk-create-command's CMI-001 and CMI-002. Their gates and confirm modes are authored-file properties; the scenario does not run the command, so there is no live question to answer. (iteration 5)
- Reading every changelog scenario for an approval gate. CHG-007 is the only one that asks; the release scenarios either prepare text or refuse to publish. (iteration 5)
- Treating sk-create-diff SNAP-002's "oh, I never saved a baseline" as a conversational correction. The scenario deliberately runs `compare` then `compare-pair` as two commands in one operator session. (iteration 5)
- Converting RRD-001, RRD-002 or RRD-003. Their refusals name a destination or an owner; only RRD-004 explicitly invites the user to return with new evidence. (iteration 6)
- Looking for a question in the with-human-voice scanner. Its unchecked categories are for a reader, not for the runtime, so the judgment pass is Q1 and never a conversation. (iteration 6)
- Treating SCG-007's session-goal redirect as a new conversation candidate. The first lineage already recommends the goal-injection companion family, and SCG-008's resend is that same shape; counting it again here would double-count the same behavior. (iteration 6)

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
Follow up on: sk-create-with-human-voice has no conversation candidate: its nine scenarios run the mechanical scanner, the scope gate and a re-scan, and the judgment pass is a reader's one-prompt review; Q1 governs the judged reads...

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
