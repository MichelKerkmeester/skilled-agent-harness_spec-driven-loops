---
title: "Research: conversation adoption across the 28 unaudited playbook packages"
description: "Six Devin iterations audited the 28 manual-testing-playbook packages the first lineage never read. Eight scenarios in eight packages merit a conversation or a conversation companion; twenty packages have no candidate. Every candidate is Q2 and answer-dependent; none is Q3, restart or compaction."
trigger_phrases:
  - "conversation adoption research devin"
  - "unaudited playbook conversation candidates"
  - "28 package conversation audit"
importance_tier: "normal"
contextType: "research"
---
# Research: Conversation Adoption Across the 28 Unaudited Playbook Packages

<!-- ANCHOR:research-summary -->

## 1. RUN PROVENANCE

| Field | Value |
|-------|-------|
| Workflow | `/deep:research:auto`, detached fan-out lineage |
| Executor | cli-devin, `deepseek-v4-1-flash-max` |
| Lineage | `devin` |
| Session id | `fanout-devin-1793643468783-m86yfa` |
| Planned iterations | 6 |
| Completed iterations | 6, from 18:18Z to 18:22Z on 2026-11-02 |
| Stop reason | `maxIterationsReached` (6 of 6) |
| New-information ratio per iteration | 1.00, 1.00, 1.00, 1.00, 1.00, 1.00 |
| Converged | No. Every iteration read packages no prior lineage had opened, so the ratio never approached the 0.05 threshold |
| Findings | 29 key findings in `findings-registry.json` |
| Packages covered | 28 of 28 assigned; 338 scenarios read at index level |
| Synthesis | Written from the six iteration files; no playbook, skill or runner file was changed |

The decision rule is the four ordered questions in `SKILL.md` §6, Choosing the Scenario Style. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:346]

- **Q1**: does a person judge the result? Then single prompt.
- **Q2**: does the behavior need more than one exchange, an answer-dependent next step, or a restart or compaction? Then conversation.
- **Q3**: must it hold on several runtimes or gate a release with shell-checkable turns? Then conversation.
- **Q4**: otherwise single prompt.

The runner drives only `claude-code`, `opencode`, `codex`, `pi` and `devin`, and its only session actions are `send`, `restart` and `compact`. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39]

The first lineage's principles for the other 28 packages are in `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`; those packages were not re-audited. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md:29]

## 2. EXECUTIVE SUMMARY

Eight scenarios in eight of the 28 packages merit a conversation or a conversation companion. All eight are Q2 and answer-dependent: the runtime asks a question, halts for an approval, or invites the user to return with new evidence. None is Q3, restart or compaction, and none is blocked by the runner's runtime list, because every candidate's behavior can be driven on `claude-code` or `opencode`.

The work splits into four groups:

1. **Approval and refusal follow-ups.** DIA-003's style-guide approval halt, RRD-004's invitation to name a present-day failure, and SCG-005's placeholder completion. Each scenario stops at a decision the operator must supply.
2. **Router disambiguation.** SP-008's `needs_disambiguation` flag and SD-003's UNKNOWN fallback. Both fail if the runtime proceeds without the answer, and neither scripts the answer.
3. **Component and canvas ambiguity.** CHG-007's component clarification and SD-007's chart-versus-flowchart tie. Both ask which target the work belongs to.
4. **Live hook effect.** mcp-route-guard's advisory is meant to change the next tool choice, and its OpenCode adapter path is recorded `UNAUTOMATABLE` today.

Twenty packages have no candidate. Their scenarios are one routing decision, one command run, one authoring check or one judged read, and Q4 (or Q1) keeps them single prompt. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/devin/iterations/iteration-006.md:11]

## 3. PER-PACKAGE COVERAGE

Scenario counts come from each root index. "No candidate" means every scenario stays single prompt; it is a verdict, not an omission.

| Package | Scenarios | Verdict | Deciding Q | Source |
|---------|-----------|---------|------------|--------|
| cli-classifier | 7 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md:83] |
| cli-classifier/cli-jev | 22 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/cli-classifier/cli-jev/manual-testing-playbook/manual-testing-playbook.md:98] |
| mcp-code-mode | 27 | Add a live-session companion for mcp-route-guard; keep 26 | Q2 | [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:109] |
| mcp-tooling (hub) | 16 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:31] |
| mcp-tooling/mcp-mobbin | 9 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md:25] |
| mcp-tooling/mcp-refero | 9 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/mcp-tooling/mcp-refero/manual-testing-playbook/manual-testing-playbook.md:25] |
| sk-code (hub) | 23 operator | Add an answer-turn companion for SD-003; keep 22 | Q2 | [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:33] |
| sk-code/sk-code-ci | 8 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md:37] |
| sk-code/sk-code-quality | 23 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:154] |
| sk-code/sk-code-skilled | 12 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md:28] |
| sk-design (hub) | 4 | Add a disambiguation companion for SD-007; keep 3 | Q2 | [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:97] |
| sk-design/sk-design-diagram | 10 | Update DIA-003 to a conversation; keep 9 | Q2 | [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:30] |
| sk-design/sk-design-fundamentals | 12 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md:111] |
| sk-design/sk-design-md-generator | 18 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/manual-testing-playbook.md:26] |
| sk-prompt | 28 | Update SP-008 to a conversation; keep 27 | Q2 | [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md:30] |
| sk-create-agent | 6 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/manual-testing-playbook.md:31] |
| sk-create-benchmark | 3 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/manual-testing-playbook.md:70] |
| sk-create-changelog | 13 | Add an answer-turn companion for CHG-007; keep 12 | Q2 | [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md:27] |
| sk-create-command | 6 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-command/manual-testing-playbook/manual-testing-playbook.md:175] |
| sk-create-diff | 11 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-diff/manual-testing-playbook/manual-testing-playbook.md:161] |
| sk-create-feature-catalog | 6 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/manual-testing-playbook.md:71] |
| sk-create-frontmatter | 11 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md:199] |
| sk-create-goal | 9 | Add a completion-turn companion for SCG-005; keep 8 | Q2 | [SOURCE: .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md:31] |
| sk-create-quality-control | 6 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/manual-testing-playbook.md:139] |
| sk-create-readme | 4 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-readme/manual-testing-playbook/manual-testing-playbook.md:137] |
| sk-create-repo-rule | 15 | Add a re-test companion for RRD-004; keep 14 | Q2 | [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal.md:33] |
| sk-create-skill | 11 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md:139] |
| sk-create-with-human-voice | 9 | Keep all; no candidate | Q4 | [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md:207] |

Totals: 28 packages, 338 scenarios, 8 packages with a candidate, 20 with no candidate.

<!-- /ANCHOR:research-summary -->

<!-- ANCHOR:recommendations -->

## 4. RANKED RECOMMENDATIONS

Ranked by the risk a conversation newly covers, then by authoring and setup cost. All eight run on `claude-code` or `opencode`; none needs a runtime the runner lacks.

### Tier 1: approval and refusal follow-ups, high risk

1. **DIA-003 onboarding approval, update to a conversation (Q2).** The scenario makes the approval halt load-bearing: `style-guide.md` changes only after explicit approval, and step 5 tells the agent to stop and wait. A two-turn script — propose the diff, then approve or decline — is the only way a shell check can observe the write decision. A wrong write changes every later diagram's brand identity silently. [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:30] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:49]
2. **SP-008 UNKNOWN_FALLBACK, update to a conversation (Q2).** The router sets `needs_disambiguation: true`, prints a four-item checklist and fails if it proceeds without prompting. The answer to that checklist is the missing turn: send a plain draft, answer the four items, and check the chosen intent drives the enhancement. Setup is a plain prose draft, so the cost is the lowest of the eight. [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md:30] [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md:60]
3. **RRD-004 restraint refusal, add a re-test companion (Q2).** The refusal explicitly invites the user to name a present-day failure, and the triage says a later concrete failure makes the proposal re-testable. A second turn that names the failure and checks whether the rule is now authored closes the documented follow-up. The risk is rule-set dilution, which the scenario exists to prevent. [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal.md:33] [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal.md:72]

### Tier 2: router and authoring disambiguation

4. **CHG-007 component clarification, add an answer-turn companion (Q2).** The workflow asks which component owns a changelog when path and hint evidence tie, and writes nothing to a guessed folder. A second turn that names the component and checks the write path covers the answer half. The failure it prevents — a polished entry in the wrong component — is silent. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md:27] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component.md:29]
5. **SD-003 UNKNOWN fallback, add an answer-turn companion (Q2).** The scenario stops at the disambiguation question; `ROUTER.md` §6 requires the runtime and verification answer before work proceeds. A second turn that supplies both and checks the next action covers behavior no scenario checks. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:33] [SOURCE: .skilled/skills/sk-code/ROUTER.md:162]
6. **SCG-005 placeholder refusal, add a completion-turn companion (Q2).** The scenario seeds an undecided decision as a template placeholder, fails the goal check and stops the handoff. A second turn that supplies the decision and checks the goal passes covers the completion path. Setup is a disposable scratch packet, so the cost is medium. [SOURCE: .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md:31] [SOURCE: .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md:34]

### Tier 3: ambiguity and live-hook companions

7. **SD-007 chart-versus-flowchart tie, add a disambiguation companion (Q2).** The contract allows the router to ask the user to disambiguate and cite both candidate intents, but no turn scripts the answer that would select CHART or FLOWCHART. Add an operator companion rather than convert the routing-gold file, which feeds the typed-gold gate. [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:97] [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:99]
8. **mcp-route-guard live session, add a companion (Q2).** The advisory exists to change the model's next tool choice, and the current file records the live OpenCode adapter path as `UNAUTOMATABLE`. A two-turn companion on `claude-code` or `opencode` would cover the effect, but it needs a scratch project with a non-exempt external MCP server registered, so it has the highest setup cost of the eight. Keep the unit and live-core commands as primary evidence. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:109]

<!-- /ANCHOR:recommendations -->

## 5. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Convert every scenario with a long TEST EXECUTION section | A command followed by a status read is still one request. Length is not Q2 | `research.md:179` | first lineage |
| Read "restart Code Mode" or "fresh Code Mode session" as the runner's `restart` | The runner restarts the subject runtime, not the MCP server; no check observes the server reload | `iteration-001.md:25` | 1, 2 |
| Convert cli-classifier routing because it gates release | Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation adds setup without a new check | `iteration-001.md:26` | 1 |
| Convert create-command CMI-001/CMI-002 | The gate and confirm mode are properties of the authored command, not an exchange in the authoring session | `iteration-005.md:27` | 5 |
| Count goal injection again for SCG-007/SCG-008 | The first lineage already recommends the goal-injection companion family; counting it here double-counts the same behavior | `research.md:148` | first lineage, 6 |
| Treat SKD-022's shadow choice as an approval gate | The reference tells the agent to choose from the project's needs, not to ask the operator | `iteration-003.md:26` | 3 |

## 6. DIVERGENCE MAP

No divergent pivots, saturated directions or audited overrides were recorded. Each of the six iterations read a disjoint package set, so there was no repeated focus to saturate and no contradiction to resolve. The only cross-iteration judgment was the boundary between an authored artifact's gate and a live exchange, settled in iteration 5 and applied in iteration 6. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/lineages/devin/iterations/iteration-005.md:27]

## 7. OPEN QUESTIONS

- The ranking weighs risk against setup cost by judgment. No candidate was converted and run, so no measured cost exists.
- The mcp-route-guard companion needs a scratch project with a non-exempt external MCP server; its setup cost is unmeasured and may exceed its value.
- DIA-003 depends on a live, crawlable site; an anti-bot response would turn the run into a documented `SKIP`.
- The first lineage's 28 packages and this lineage's 28 cover all 56. A combined ranking could reorder the eight candidates against the first lineage's Tier 1 set.
- None of the 28 packages produced a Q3, restart or compaction candidate. If cross-runtime parity matters for any of them, it is not expressed in their current scenarios.

## 8. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` (6 of 6).
- Total iterations: 6.
- Questions answered: 4 / 5. The ranking question is answered in §4 of this synthesis.
- Remaining questions: 1 in the registry; the open questions above are synthesis notes rather than registry questions.
- Last 3 iteration summaries: run 4 (four packages, 1.00), run 5 (five packages, 1.00), run 6 (six packages, 1.00).
- Convergence threshold: 0.05.
- Average newInfoRatio: 1.00. Not converged: each iteration opened packages no prior lineage had read, so novelty stayed maximal.
- Coverage: 28 of 28 assigned packages, 338 scenarios at index level, 29 findings.
- Divergence summary: no pivots recorded.

## 9. SCOPE NOTES

- No playbook, skill or runner file was changed. Every write landed under `research/lineages/devin/`.
- The YAML pre-init spec mutation, post-synthesis spec writeback and strict validation target the parent spec folder and were omitted under the lineage write bound. The fan-out merge and resource-map emission are coordinator work; this lineage records its local registry and dashboard for that merge.
- The lineage lock is released after synthesis.

Timestamp: 2026-11-02T18:22:17Z
