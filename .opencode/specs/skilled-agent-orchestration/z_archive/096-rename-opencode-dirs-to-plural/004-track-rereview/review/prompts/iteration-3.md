# Deep-Review Iteration 3 Prompt Pack — CORRECTNESS (093/094/095 playbooks)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 10
Dimension: correctness (focus: 093/094/095 playbooks, RCAF naturalization integrity, sk-code-review playbook execution)
Prior Findings: P0=0 P1=3 P2=4 (P1-007, P1-015, P1-016 + 4 P2)
Dimension Coverage: [inventory, correctness] (2/5)
Traceability: spec_code=fail (source/dist drift) | checklist_evidence=fail | skill_agent=pass | agent_cross_runtime=pass | feature_catalog_code=fail | playbook_capability=pass
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 0.0 -> 0.2857
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 3 of 10
Mode: review
Dimension: correctness (playbooks)
Review Target: track:skilled-agent-orchestration packets 093/094/095 playbooks + RCAF naturalization
Review Scope Files (this iteration's focus):
  - .opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/
  - .opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/
  - .opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution/
  - .opencode/skills/sk-code-review/assets/manual_testing_playbook/
  - .opencode/skills/sk-git/assets/manual_testing_playbook/
  - .opencode/skills/cli-*/assets/manual_testing_playbook/ (16 RCAF-naturalized playbooks total; spot-check 3-4)
  - .opencode/skills/sk-doc/assets/templates/ (template updates for RCAF)
Prior Findings: P0=0 P1=3 P2=4

## CONTEXT — PLAYBOOK CORRECTNESS PASS

Iter 2 found source/dist drift. This iteration deep-dives the PLAYBOOK surfaces from packets 093,
094, 095 — which iter 1 only inventoried.

**FOCUS-A: prompt-equality contract (094 RCAF naturalization)**
The 094 packet naturalized prompts across 16 manual_testing_playbooks via RCAF. Spot-check 3-4
playbooks (e.g. sk-code-review, sk-git, cli-codex, sk-doc) for:
- The "naturalized prompt" matches what the playbook scenario actually requests (prompt-equality
  with the scenario's preconditions)
- No sed-collateral that broke prompt structure (RCAF=Reason/Context/Audience/Format)
- Section headers, frontmatter, and checklist references still correctly point into the playbook

**FOCUS-B: 093 sk-code-review + sk-git playbook structural soundness**
- spec.md / plan.md / tasks.md / checklist.md present and synchronized
- Playbook test scenarios reachable from the SKILL.md
- No broken cross-references after 096 plural rename

**FOCUS-C: 095 sk-code-review playbook execution against opencode+deepseek**
- Read 095 implementation-summary.md and confirm any code dispatched is reachable
- Spot-check that the execution evidence cited (e.g. an opencode session output, a deepseek dispatch
  log) is real and at the cited path

**FOCUS-D: spot-check on already-active findings**
- P1-015 (skill_graph_scan source) — re-verify file:line evidence stands
- P1-016 (scripts/dist) — count remaining stale singular references in scripts/dist

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`.

## CLAIM ADJUDICATION

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / soft 12 / hard 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.
- Workflow-resolved spec_folder is `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/`. Touch nothing else.

## OUTPUT CONTRACT

Three artifacts: iteration-003.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["correctness"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new", findingsSummary, traceabilityChecks, newFindingsRatio) + iter-003.jsonl delta with `{"type":"finding"}` records per finding. All three required.
