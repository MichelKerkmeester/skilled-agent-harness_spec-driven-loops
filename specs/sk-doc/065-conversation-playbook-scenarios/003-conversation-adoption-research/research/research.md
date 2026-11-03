---
title: "Research: where playbook scenarios should adopt the json conversation format"
description: "Two research lineages, eight Luna iterations and six DeepSeek iterations through Devin, applied the four ordered style questions to all 56 manual testing playbook packages. About 28 scenarios should gain a conversation or a conversation companion, and most stay single prompt."
trigger_phrases:
  - "conversation adoption research"
  - "playbook conversation candidates"
  - "which playbook scenarios should be conversations"
importance_tier: "normal"
contextType: "research"
---
# Research: Where Playbook Scenarios Should Adopt the JSON Conversation Format

<!-- ANCHOR:research-summary -->

## 1. RUN PROVENANCE

| Field | Value |
|-------|-------|
| Workflow | `/deep:research:auto`, fan-out with one lineage |
| Lineage `luna` | cli-codex, `gpt-6-luna`, reasoning xhigh, service tier fast. 8 of 10 planned iterations, 17:48Z to 18:03Z on 2026-11-02, stopped by the Luna usage limit. The operator chose to synthesize them |
| Lineage `devin` | cli-devin, `deepseek-v4-1-flash-max`. 6 of 6 iterations, 18:17Z to 18:24Z on 2026-11-02, scoped to the 28 packages `luna` never read |
| New-information ratio | `luna`: 1.00, 0.84, 0.78, 0.65, 0.56, 0.72, 0.71, 0.63. `devin`: 1.00 every iteration, because each iteration read packages no earlier one had |
| Converged | No. Coverage completed instead: every package has a verdict |
| Merged findings | 70 key findings in `findings-registry.json` across 14 iterations |
| Synthesis | Written by the orchestrating session from the 14 iteration files, after spot-checking five `luna` claims and five `devin` claims against the scenario files |

The decision rule applied throughout is the four ordered questions in `SKILL.md` §6, Choosing the Scenario Style. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:243]

- **Q1**: does a person judge the result? Then single prompt.
- **Q2**: does the behavior need more than one exchange, an answer-dependent next step, or a restart or compaction? Then conversation.
- **Q3**: must several runtimes or a regression gate repeat it, with every turn checkable by a shell command? Then conversation.
- **Q4**: otherwise single prompt.

The runner accepts five runtimes: claude-code, opencode, codex, pi and devin. A scenario whose behavior lives in any other runtime cannot be a runnable conversation today, whatever Q2 says. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39]

## 2. EXECUTIVE SUMMARY

Most scenarios should stay single prompt. Across all 56 packages the conversation format fits a narrow class: behavior that only shows on a later turn, behavior that branches on the user's answer, and behavior that crosses a compaction. Long test procedures, multi-command sequences and the word "session" do not qualify on their own.

The work splits into five groups:

1. **Already conversations, keep.** The three system-spec-kit decision-capture scenarios and the runner's own MTP-007.
2. **Highest value.** Pi PI-020 interactive `/compact`, OpenCode CO-046 later-request relaunch marker, system-spec-kit directive-lifecycle dedup and the `/doctor:skill-advisor` DOC-367 menu. Each closes behavior that no scenario checks today.
3. **Answer-dependent approval gates.** The `/doctor` switch flows DOC-370, DOC-372, DOC-359 and the declined branch of DOC-394, plus the Pi dispatch-preflight clarification turn.
4. **Answer turns after a question the skill already asks.** The second lineage found seven scenarios that stop at a clarifying question, an approval halt or a refusal that invites a follow-up, and never script the answer: sk-code SD-003, sk-design SD-007, diagram DIA-003, sk-prompt SP-008, changelog CHG-007, goal SCG-005 and repo-rule RRD-004. It also found the mcp-route-guard live adapter path, which its own file records as unautomatable.
5. **Companions next to existing evidence.** Goal injection, session-cleanup and CLI session continuity. A conversation proves the model saw the state on a later turn, and the existing command-level checks stay primary.
6. **Q2 but blocked by the runner.** Cursor, Hermes, MCP Aside, Orca, Chrome DevTools and OpenCode fork stay manual, because the runtime is not one of the five or the needed action is not `restart` or `compact`.

Every package now has a verdict. 20 of the 28 packages the second lineage read have no candidate: their scenarios are one routing decision, one command or one validator run.

<!-- /ANCHOR:research-summary -->

<!-- ANCHOR:coverage -->

## 3. PER-PACKAGE COVERAGE

Scenario counts come from `validate-playbook-package.cjs --no-strict`. The Status column names the lineage that read the package.

| Package | Scenarios | Status | Verdict |
|---------|-----------|--------|---------|
| `.skilled/manual-testing-playbook` (root `/doctor`) | 62 | Audited (luna) | Convert DOC-367. Add conversations to DOC-370, DOC-372, DOC-359 and the DOC-394 declined branch. Keep DOC-403 and DOC-390 single prompt (Q4) |
| cli-classifier | 7 | Audited (devin) | No candidate. One routing decision or scorer run each (Q4) |
| cli-classifier/cli-jev | 22 | Audited (devin) | No candidate. Each drives the `jev` binary from one command, not a runtime session (Q4) |
| cli-external-orchestration (hub) | 24 | Audited (luna) | Add a Pi clarification turn to dispatch-preflight authorization. Keep the Codex hook parity matrix command-driven |
| cli-claude-code | 52 | Audited (luna) | Companions for CC-016 and CC-015. Keep CC-021 and the goal scenario single prompt (Q4) |
| cli-codex | 42 | Audited (luna) | Companion for CX-017 |
| cli-cursor | 40 | Audited (luna) | CU-015, CU-016 and goal hook are Q2 but stay manual: Cursor is not a runner runtime |
| cli-devin | 36 | Audited (luna) | Companions for resume-continue and goal hook. Keep DV-001 single prompt (Q4) |
| cli-hermes | 44 | Audited (luna) | HERMES-011 is Q2 but stays manual: Hermes is not a runner runtime. Keep HERMES-030 single prompt (Q4) |
| cli-opencode | 71 | Audited (luna) | Update CO-046. Companions for CO-019, CO-018 and goal hook. Keep CO-020 manual (fork is not a runner action). Keep CO-026 and CO-027 single prompt (Q4) |
| cli-pi | 35 | Audited (luna) | Companion for PI-020 `/compact`. Companion for goal hook |
| cli-orca | 8 | Audited (luna) | Runtime-stopped recovery is Q2-shaped but stays on its native commands |
| mcp-code-mode | 27 | Audited (devin) | Add a two-turn mcp-route-guard companion on claude-code or opencode (Q2). The other 26 stay single prompt (Q4) |
| mcp-tooling (hub) | 16 | Audited (devin) | No candidate. Routing gold, one prompt per `workflowMode` (Q4) |
| mcp-aside-devtools | 29 | Audited (luna) | ASD-005 is Q2 but stays manual: Aside is not a runner runtime |
| mcp-chrome-devtools | 30 | Audited (luna) | Keep BDG-002 single prompt (Q4). Dead-session recovery stays on its native commands |
| mcp-click-up | 42 | Audited (luna) | Keep MCP-H004 single prompt (Q1: the operator confirms the task is disposable) |
| mcp-figma | 17 | Audited (luna) | Keep FG-R05 single prompt (Q4) |
| mcp-mobbin | 18 | Audited (devin) | No candidate. "Fresh Code Mode session" reloads an MCP server, not a runner session (Q4) |
| mcp-notion | 33 | Audited (luna) | Keep PAGE-005 single prompt (Q4) |
| mcp-obsidian | 19 | Audited (luna) | Keep MCP-H004 single prompt (Q1) |
| mcp-refero | 17 | Audited (devin) | No candidate. The funnel runs inside one prompt (Q4) |
| sk-code (hub) | 25 | Audited (devin) | Add an SD-003 companion that answers the UNKNOWN disambiguation question (Q2). The rest stay single prompt (Q4) |
| sk-code-ci | 8 | Audited (devin) | No candidate (Q4) |
| sk-code-quality | 23 | Audited (devin) | No candidate. CQ-009's trust grant is a config key between runs, not an answer (Q4) |
| sk-code-review | 48 | Audited (luna) | Keep CR-013 single prompt (Q1) |
| sk-code-skilled | 12 | Audited (devin) | No candidate. Routing recall (Q4) |
| sk-design (hub) | 4 | Audited (devin) | Add an SD-007 companion that answers the disambiguation question (Q2). Keep SD-007 as routing gold |
| sk-design-chart | 9 | Audited (luna) | Keep CHT-009 single prompt (Q1) |
| sk-design-diagram | 10 | Audited (devin) | Update DIA-003 to approve or decline the style-guide write (Q2). Keep DIA-002 and CAP-001 single prompt (Q1), the rest (Q4) |
| sk-design-fundamentals | 12 | Audited (devin) | No candidate. SKD-022 infers the shadow system rather than asking (Q4) |
| sk-design-md-generator | 18 | Audited (devin) | No candidate. GUIDED-014 stops at a boundary, not a question (Q4, Q1 for provenance judgments) |
| sk-doc (hub) | 29 | Audited (luna) | Keep SD-012 single prompt (Q4) |
| sk-create-agent | 6 | Audited (devin) | No candidate (Q4) |
| sk-create-benchmark | 3 | Audited (devin) | No candidate (Q4) |
| sk-create-changelog | 13 | Audited (devin) | Add a CHG-007 companion that names the component and checks the write path (Q2). The rest (Q4) |
| sk-create-command | 6 | Audited (devin) | No candidate. Gates belong to the authored command, which the scenarios do not run (Q4) |
| sk-create-diff | 11 | Audited (devin) | No candidate (Q4) |
| sk-create-feature-catalog | 6 | Audited (devin) | No candidate (Q4) |
| sk-create-frontmatter | 11 | Audited (devin) | No candidate. FMC-003 is a refusal, not a question (Q4) |
| sk-create-goal | 9 | Audited (devin) | Add an SCG-005 companion that supplies the missing decision and checks the goal passes (Q2). The rest (Q4) |
| sk-create-manual-testing-playbook | 8 | Audited (luna) | Keep MTP-007, already a conversation. No new candidate |
| sk-create-quality-control | 6 | Audited (devin) | No candidate (Q4, Q1 for the HVR judgment) |
| sk-create-readme | 4 | Audited (devin) | No candidate (Q4, Q1 for the skip judgment) |
| sk-create-repo-rule | 15 | Audited (devin) | Add an RRD-004 companion that names a present-day failure and checks the rule is authored (Q2). The rest (Q4) |
| sk-create-skill | 11 | Audited (devin) | No candidate (Q4) |
| sk-create-with-human-voice | 9 | Audited (devin) | No candidate (Q1 for judged reads, Q4 for scanner runs) |
| sk-git | 40 | Audited (luna) | Keep GIT-011 and GIT-034 single prompt (Q4) |
| sk-prompt | 28 | Audited (devin) | Update SP-008 to answer the four-item checklist (Q2). Keep SP-012, which forbids a clarifying question. The rest stay single prompt |
| system-deep-loop (hub) | 16 | Audited (luna) | Keep the mode-hint scenario single prompt (Q4) |
| deep-ai-council | 33 | Audited (luna) | Keep cross-critique single prompt (Q4) |
| deep-research | 62 | Audited (luna) | Keep run-now and resume-classification single prompt (Q1) |
| deep-review | 55 | Audited (luna) | Keep convergence single prompt (Q1). Keep setup handoff single prompt (Q4) |
| system-deep-loop/runtime | 55 | Audited (luna) | Keep crash-resume and torn-tail single prompt (Q4): they are file-state recovery, not conversation |
| system-skill-advisor | 48 | Audited (luna) | Companion for CL-007 goal injection |
| system-spec-kit | 104 | Audited (luna) | Keep the three decision-capture conversations. Update directive-lifecycle dedup. Companions for goal-opencode-plugin and session-cleanup-plugin. Session-relaunch scenarios get partial companions only. Runtime-family census is Q3 but low value |

Totals: 56 packages, all audited: 28 by `luna`, 28 by `devin`. All 16 top-level skills appear.

<!-- /ANCHOR:coverage -->

<!-- ANCHOR:recommendations -->

## 4. RANKED RECOMMENDATIONS

Ranked by the behavior a conversation would newly cover, then by authoring and run cost. Each runs on one supported runtime unless stated.

### Tier 1: convert or update, behavior uncovered today

1. **Pi PI-020, add a `/compact` companion (Q2).** The scenario skips `session_compact` because it only fires in an interactive session, and leaves `/compact` as an optional manual check. A conversation that sends a turn, compacts, then sends a follow-up closes that skip. Runtime: pi. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md:31]
2. **OpenCode CO-046, update to two sends (Q2).** The asserted `[session-relaunch]` nudge appears on a later request, which one prompt cannot show. Keep the request-capture and event-file checks. Runtime: opencode. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md:27]
3. **system-spec-kit directive-lifecycle dedup, update (Q2).** The first request, a same-session repeat and a post-compaction request each expect different delivery. A conversation checks delivery after each turn. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:30]
4. **`/doctor:skill-advisor` DOC-367, convert the safe menu branches (Q2).** Cancel, invalid answer twice, help and a numeric target each change the next screen or status. The cross-target and unknown-target failures stay as plain command checks. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md:27]

### Tier 2: answer-dependent approval gates

5. **DOC-370 git-hook switch (Q2).** A declined change must write nothing and an approved one must apply one command. Run it in a disposable checkout, and do it first of the four because its rollback is one config key. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:14]
6. **DOC-372 standards edit (Q2).** Same no-versus-approve branch over `.sk-git/` prose. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:22]
7. **DOC-359 release update (Q2).** The approval decides the writes and the rollback path. Higher setup cost than DOC-370. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:22]
8. **DOC-394 CI toggle, declined branch only (Q2).** The approved branch needs an authenticated `gh` and changes a remote, so it stays manual. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md:27]
9. **Dispatch-preflight authorization, add a Pi clarification turn (Q2).** Send a dispatch without a named executor, check the denial, then send a follow-up that names it and check the allowed path and audit line. Keep the inspector unit evidence. [SOURCE: .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:24]

### Tier 2b: answer turns after a question the skill already asks

These scenarios stop where the skill asks, halts for approval or refuses with an invitation, so the answer-dependent turn is unchecked. Each is a small companion on one supported runtime, usually claude-code.

10. **sk-design-diagram DIA-003, update (Q2).** The contract says `style-guide.md` changes only after explicit approval and tells the agent to stop and wait. Script an approve and a decline and check the file. [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:31] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:49]
11. **sk-prompt SP-008, update (Q2).** The unknown fallback prints a four-item checklist and sets `needs_disambiguation`; answer it and check the chosen intent drives the enhancement. [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md:30]
12. **sk-code SD-003, add (Q2).** The scenario stops at the runtime and verification question that `ROUTER.md` requires; answer it and check the loaded resources. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:33]
13. **sk-design SD-007, add (Q2).** The router may ask the user to pick between two intents; answer and check CHART or FLOWCHART is selected. Keep SD-007 itself as routing gold. [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:97]
14. **sk-create-changelog CHG-007, add (Q2).** The workflow asks for a component when the evidence is ambiguous; name it and check the write path. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md:29]
15. **sk-create-goal SCG-005, add (Q2).** The goal check fails on a leftover placeholder; supply the decision and check the goal passes. [SOURCE: .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md:31]
16. **sk-create-repo-rule RRD-004, add (Q2).** The refusal invites the user to name a present-day failure; name one and check the rule is authored. [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal.md:33]
17. **mcp-code-mode mcp-route-guard, add (Q2).** The guard exists to change the model's next tool choice, and the file records the live OpenCode adapter path as unautomatable. Keep the unit and live-core commands primary. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/devin/iterations/iteration-001.md:21]

### Tier 3: companions next to existing evidence

A companion adds a conversation proving the model saw the state on a later turn. The existing command-level checks remain the primary evidence.

18. **Goal injection (Q2).** system-skill-advisor CL-007 and system-spec-kit goal-opencode-plugin: bind a goal, send a later task, check the active-goal prompt arrived. The same shape applies to the Devin, OpenCode and Pi goal-hook scenarios. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:82] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md:24]
19. **system-spec-kit session-cleanup-plugin (Q2).** The first send shows the startup guard, the second proves it arrives once, and a restart checks cleanup. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md:3]
20. **CLI session continuity (Q2).** CO-019, CC-016 and CX-017 first, because an explicit session id guards against resuming the wrong session. CC-015, CO-018 and Devin resume-continue next. Keep the headless flag checks primary: the runner resumes through its own adapter, not through the `-s` or `--resume` flags these scenarios test. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md:2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md:27] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md:2]
21. **system-spec-kit session-relaunch scenarios, partial companions only (Q2).** Task state crosses a process handoff, but the runner's `restart` does not run `skilled-loop`, so a conversation covers only the in-session half. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/luna/iterations/iteration-002.md:11]

### Tier 4: low value

22. **system-spec-kit runtime-family count census (Q3).** Deterministic per-mirror counts could be three sends, but the current single prompt already reports all three counts together. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/luna/iterations/iteration-003.md:11]

### Blocked by the runner: Q2, but keep manual

- **Cursor CU-015, CU-016 and goal hook; Hermes HERMES-011.** The runtime is not one of the five. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md:2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md:2]
- **MCP Aside ASD-005.** Same reason. [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md:2]
- **OpenCode CO-020 fork.** Fork is not a runner action; the runner offers only `restart` and `compact`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md:2]
- **Orca runtime-stopped recovery and Chrome DevTools dead-session recovery.** These restart a product process, which the runner's `restart` cannot do. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/luna/iterations/iteration-008.md:13]

### Keep as conversations

- The three system-spec-kit decision-capture scenarios and MTP-007 already use the format and cover question tools, restart and compaction. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md:69] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md:49]

### Stay single prompt

- **Q1, a person judges:** CHT-009 dark-theme legibility, CR-013 whether findings are truly closed, ClickUp and Obsidian MCP-H004 delete confirmation, deep-research run-now and resume classification, deep-review convergence. [SOURCE: .skilled/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/a-delivery-on-a-dark-system.md:32] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/re-review-and-stale-context/re-review-after-fixes.md:27]
- **Q4, one deterministic request:** DV-001, system-spec-kit CLI compact, GIT-011, GIT-034, SD-012, BDG-002, CC-021, deep-review setup handoff, the deep-loop mode hint, council cross-critique, runtime crash-resume and torn-tail, CO-026, CO-027, DOC-403, DOC-390, PAGE-005, FG-R05, the Codex hook parity matrix, HERMES-030 and the Claude goal scenario. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/luna/iterations/iteration-004.md:9] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/luna/iterations/iteration-007.md:13]

<!-- /ANCHOR:recommendations -->

## 5. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Convert every scenario with a long TEST EXECUTION section | A command followed by a status read is still one request. Length is not Q2 | `iteration-004.md:11` | 4 |
| Convert by runtime name or the word "session" alone | Cursor and Hermes goal scenarios mention sessions but are unsupported or Q4 | `iteration-008.md:7` | 8 |
| Automate the approve branch of a destructive delete | Q1 wins: a person confirms the target is disposable before deletion | `iteration-004.md:7` | 4, 8 |
| Replace headless resume-flag checks with conversations | The runner resumes through its adapter, so it does not test `-s`, `--resume` or `--fork` | `iteration-006.md:5` | 2, 6 |
| Treat an MCP-server or Code Mode restart as the runner's `restart` | The runner restarts the subject runtime, not an MCP server, and no turn would observe the reload | `lineages/devin/iterations/iteration-001.md:25` | devin 1, 2 |
| Count SCG-007's goal redirect as a new candidate | The goal-injection companion family already covers that shape | `lineages/devin/iterations/iteration-006.md:25` | devin 6 |
| Model OpenCode fork as a runner restart | The adapter resumes the same session; fork needs a new action | `iteration-006.md:9` | 6 |

## 6. DIVERGENCE MAP

- **Companion versus replacement.** Iterations 2 and 6 agree that continuity scenarios keep their command evidence and gain a companion. No iteration proposed replacing a passing command-level scenario outright.
- **Approval-gate order.** Iteration 3 ranked DOC-370 then DOC-372 by setup cost. Iteration 7 added DOC-359 and DOC-394, called DOC-372 and DOC-359 higher value but costlier, and limited DOC-394 to its declined branch. This synthesis keeps DOC-370 first for its one-key rollback and follows iteration 7 on DOC-394.
- **Runtime census.** Iteration 3 called it Q3 with low authoring cost but low-to-medium value, because the current single prompt already reports all three counts. No later iteration revisited it.

## 7. OPEN QUESTIONS

- Should the runner gain a `fork` action and adapters for Cursor and Hermes? Phase 002 owns that; this research only records that six Q2 scenarios wait on it.
- Can a conversation companion exercise the real `skilled-loop` relaunch, or does that stay a wrapper-level check?
- The ranking weighs value against cost by judgment. No scenario was converted and run to measure its cost.

## 8. CONVERGENCE REPORT

- `luna`: executor quota exhausted after iteration 8 of 10; the operator chose to synthesize. Last new-information ratio 0.63.
- `devin`: ran its 6 iterations to the cap over the 28 packages `luna` skipped, each at ratio 1.00 because each read new packages.
- Not converged by ratio; complete by coverage: 56 of 56 packages and all 16 skills have a verdict.
- Questions answered: which session, compaction, approval and goal behaviors need later-turn coverage; which Q2 behaviors the runner cannot run; which classes stay single prompt.

## 9. REFERENCES

- Iteration files: `research/lineages/luna/iterations/iteration-001.md` to `iteration-008.md`, and `research/lineages/devin/iterations/iteration-001.md` to `iteration-006.md`
- Merged registry: `research/findings-registry.json`
- Source map: `research/resource-map.md`
- Attribution: `research/fanout-attribution.md`
- Style rule: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` §6
