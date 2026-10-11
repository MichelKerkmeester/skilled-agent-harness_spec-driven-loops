---
title: "Goal: Phase 5: silent-input-sweep"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "silent input sweep goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep"
    last_updated_at: "2026-10-11T16:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: silent-input-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find every CLI script under .skilled that accepts bad input silently or exits 0 on a detected problem, with a severity and a reproducing command for each.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No product file changes. |
| D2 | The run uses the `/deep:review` workflow for 10 iterations. A convergence stop before 10 is not done. |
| D3 | Each row of `review/review-report.md` reads `\| F<n> \| <P0, P1 or P2> \| <path:line> \| Repro: <command and the exit or output it shows> \| <recommendation> \| <move> \| <why the cheaper move fails> \|`, ordered by severity. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md: it names its move and, above Build nothing, says what fails at the cheaper move. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review -name deep-review-state.jsonl -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least one line, and every line it prints is 10.
- [ ] `test -f specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md`, run from the repository root, exits 0.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md | grep -cvE '\| P[012] \| [^|]*[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+[^|]* \| Repro: '`, run from the repository root, prints 0, so every finding row has a severity, a path:line and a reproducing command.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every row names its move from the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep --strict`, run from the repository root, prints RESULT: PASSED.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet scaffolded | Done | create.sh phase mode with `--with-goal`; strict validation passed on the scaffold commit |
| deep-review run | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
