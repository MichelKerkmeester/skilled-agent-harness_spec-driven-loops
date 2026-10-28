---
title: "Review Agent Severity Verdict"
description: "The @review agent applies the review mode's rules and decides pass or fail from severity alone, with its 100-point score kept as advisory information."
trigger_phrases:
  - "review agent severity verdict"
  - "review agent advisory score"
  - "review gate follows severity"
  - "CODE-REVIEW marker"
version: 1.0.0.0
---

# Review Agent Severity Verdict (@review)

## 1. OVERVIEW

The `@review` agent applies the review mode's rules and decides pass or fail from severity alone, with its 100-point score kept as advisory information.

The agent used to carry a checklist and a score gate of its own. A change with no blocking finding could fail on a low score, and the agent's house rules, such as conventional commits and files under 500 lines, were applied to every repository. Now the agent keeps no checklist and no house rule, and a gate that dispatches it gets the verdict the mode defines.

---

## 2. HOW IT WORKS

### The Verdict

A verdict table derives the result from the findings. Any P0 finding, or an open P1, means `REQUESTED_CHANGES` and a failed gate. A review with only P2 findings may be `APPROVED` or `COMMENTED`, and `COMMENTED` passes the gate. The score is traceable to five dimensions and appears as `Advisory score`, but no score, band or threshold changes the verdict, and a dispatch that names a score threshold still gets the severity verdict. Every report format uses the mode's three status values, and the older `APPROVE`, `REQUEST CHANGES` and `BLOCK` words are retired.

### Rules And Paths

The agent's section on rules points at the mode's floor, default lens, checklists and `Rule sources:` line. Pull-request and commit rules come from what the reviewed repository declares, such as its sk-git rule files or its contributing guide, at the declared severity or P2. The agent and `@deep-review` read the review mode from the installed sk-code folder, wherever the runtime put it.

### Dispatch And Checks

`@orchestrate` starts the prompt of a code review with the `CODE-REVIEW` marker and never adds it to a deep-loop dispatch. It also reads `@code`'s `Quality Gate` field with one action per runner verdict. The `/speckit:implement` and `/speckit:complete` review entries state the same marker. `check-review-final-line.js` compares a `Recommendation:` line with the status line, `check-review-findings.js` fails an approval over a P0 or P1 finding and a request for changes over P2 findings alone, and `check-rule-copies.js --mode-only` checks the skill's own pins in a repository that lacks this repository's `AGENTS.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/agents/review.md` | Handler | The verdict table, advisory score and rules-applied section |
| `.skilled/agents/orchestrate.md` | Handler | The `CODE-REVIEW` marker and the `Quality Gate` reading |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Script | Final status line, `Recommendation:` and `Rule sources:` checks |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js` | Script | Finding numbering and the severity comparison |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Script | The canary and its `--mode-only` form |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` | Automated test | The checker and canary cases, including the contradicting-report fixtures |
| `.opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` | Node test | The marker and `Quality Gate` text in the agent, the orchestrator and the speckit entries |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/cross-cli-orchestration/native-claude-code-invocation.md` | Manual playbook | CR-016, a native `@review` invocation |

---

## 4. SOURCE METADATA

- Group: Review Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-calibration/review-agent-severity-verdict.md`

Related references:
- [review-floor-lens-and-overrides.md](review-floor-lens-and-overrides.md) for the rules the agent applies.
- [review-reach-calibration.md](review-reach-calibration.md) for the reach rule every severity follows.
