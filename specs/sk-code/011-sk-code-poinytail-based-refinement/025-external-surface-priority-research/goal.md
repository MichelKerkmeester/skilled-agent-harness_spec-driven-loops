---
title: "Goal: Phase 25: external-surface-priority-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "external surface priority research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research"
    last_updated_at: "2026-10-12T16:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-025"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: external-surface-priority-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recommend, with evidence, how a user's own sk-code surface outranks sk-code-opencode once the obsidian and webflow example surfaces are deleted, while the operator's repository keeps its order.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No skill, script, command or README changes; delete experiments run in a copy outside the worktree. |
| D2 | `/deep:research` runs two lineages of 10 iterations, stop policy max-iterations: `dsflash-devin` on `cli-devin` with `deepseek-v4-1-flash-max`, and `luna-max-fast` on `cli-codex` with `gpt-6-luna`, effort max, tier fast. An unavailable executor stops the run with no substitute. |
| D3 | `research/research.md` holds F rows `\| F<n> \| <ORDER, PRESENCE, BREAK, DOC or OK> \| <claim> \| <evidence> \| <severity> \| <lineage> \|`, ranked R rows, rejected X rows, proposed P rows and a section on where the lineages disagree. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md and names the cheaper move it rejects. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line and reruns the delete experiment before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/deep-research-state.jsonl`, run from the repository root, prints 10.
- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/deep-research-state.jsonl`, run from the repository root, prints 10.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md | grep -cvE '\| (ORDER|PRESENCE|BREAK|DOC|OK) \|.*[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, and the same grep without the inverted filter counts 1 or more rows, so every F row names its class and cites a path:line.
- [ ] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, and `grep -cE '^\| R1 \|'` on the same file prints 1.
- [ ] `grep -cE '^\| X[0-9]+ \|'` and `grep -cE '^\| P[0-9]+ \|'` on specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md each print 1 or more, and `grep -ciE '^## .*disagree'` on it prints 1 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal` under the 011 epic; create.sh numbered it 023, so the folder and its ids were renamed to 025 |

### Deviations and findings

| Item | Note |
|------|------|
| Numbered 025 | Phases 023 and 024 exist on `worktrees/122-readme-freshness-research` and are not on origin/main; the orchestrator merges the two branches |
<!-- /ANCHOR:log -->
