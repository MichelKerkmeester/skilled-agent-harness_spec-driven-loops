---
title: "Goal: Phase 5: rule-amendments"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "rule amendments goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/005-rule-amendments"
    last_updated_at: "2026-10-10T07:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-005-rule-amendments"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: rule-amendments

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the six round-two gaps in the overengineering and evidence repo rules by amending those two files in place, leaving the router, AGENTS.md and the trigger index unchanged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Edits touch only `.skilled/repo-rules/prevent-overengineering.md` and `.skilled/repo-rules/evidence-and-proof.md`. `AGENTS.md`, `REPO RULES.md` and the trigger index stay unchanged, because parent decision D3 in `../goal.md` keeps the first two fixed and the index corpus excludes `.skilled/repo-rules/`. |
| D2 | Each amendment lands as a paragraph, item, bullet or self-check line inside the section that already owns its subject. No new file, trigger phrase or Fires-when bullet is added. |
| D3 | Each file's version changes in the fourth segment only: 1.0.1.2 to 1.0.1.3, and 1.1.1.2 to 1.1.1.3. |
| D4 | The moves-and-merges paragraph adds no Fires-when bullet. A bullet would need a router row that D1 keeps unchanged. The gap goes to the operator in the log. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n -e 'A short diff is not a cheaper move' -e 'list the tests, fixtures, config and exports' -e 'Moves and merges\.' -e 'Not a reason to cut accessibility\.' .skilled/repo-rules/prevent-overengineering.md; rg -n -e 'Five things, briefly' -e 'Known residual risk\.' .skilled/repo-rules/evidence-and-proof.md` prints six lines, at 86, 98, 145 and 158 from the first file and at 187 and 193 from the second, and exits 0. Covers REQ-001 to REQ-005.
- [ ] `rg -n -e 'When two moves cost the same, I took' -e 'I listed the tests, fixtures, config and exports' -e 'Moved or merged code kept' -e 'Restraint did not cut accessibility' -e 'names any known residual risk' -e '^version: 1\.' .skilled/repo-rules/prevent-overengineering.md .skilled/repo-rules/evidence-and-proof.md` prints `version: 1.0.1.3` at line 28, self-check lines at 165, 170, 173 and 174, then `version: 1.1.1.3` at line 29 and a self-check line at 231 in the second file. Covers REQ-001 to REQ-006.
- [ ] `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs; echo "exit=$?"` prints `[repo-rules-check] RESULT: PASSED (11/11 checks)` and `exit=0`, and its check 4 line reads `max=238`. Covers REQ-007.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/005-rule-amendments; for n in prevent-overengineering evidence-and-proof; do diff $F/scratch/before/$n.md .skilled/repo-rules/$n.md | rg '^>' | rg -e "$(printf '\342\200\224')" -e ';' -e ', [^,.;]+, (and|or) '; echo "exit=$?"; done` prints `exit=1` twice and no other line, so no added line holds an em dash, a semicolon or a serial comma. Covers REQ-008.
- [ ] `git status --porcelain -- .skilled/repo-rules/prevent-overengineering.md .skilled/repo-rules/evidence-and-proof.md AGENTS.md "REPO RULES.md" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` prints exactly two lines, ` M .skilled/repo-rules/evidence-and-proof.md` and ` M .skilled/repo-rules/prevent-overengineering.md`, and no line for `AGENTS.md`, `REPO RULES.md` or the trigger index. Covers REQ-009.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/005-rule-amendments --strict` prints `RESULT: PASSED`.
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
| C1, six amendments at their expected lines (REQ-001 to REQ-005) | Done | Orchestrator rerun: six lines at 86, 98, 145, 158, 187 and 193 |
| C2, self-check lines and version lines (REQ-001 to REQ-006) | Done | Orchestrator rerun: versions 1.0.1.3 and 1.1.1.3, self-check lines 165, 170, 173, 174 and 231 |
| C3, contract validator prints 11/11 PASSED (REQ-007) | Done | Orchestrator rerun: 11/11 PASSED, max=238, exit 0 |
| C4, added lines free of em dash, semicolon and serial comma (REQ-008) | Done | Orchestrator rerun: both files exit 1 with no added-line match |
| C5, only the two rule files changed (REQ-009) | Done | Orchestrator rerun: only the two rule files listed |
| C6, validate.sh --strict prints RESULT: PASSED (SC-002) | Done | Orchestrator rerun: RESULT: PASSED, 0 errors, 0 warnings |

### Deviations and findings

| Item | Note |
|------|------|
| Moves and merges has no Fires-when bullet | The paragraph loads only when the rule fires for another reason. A bullet would need a router row in `REPO RULES.md`, which D1 keeps unchanged. Operator decision, open question 1 in `spec.md`. |
| AGENTS.md section 10 keeps four close-out items | Evidence section 10 lists five after the change. AGENTS.md stays unchanged under parent decision D3, so the difference is recorded, not fixed. |
| validate.sh --strict passes on the scaffold | Its RESULT line does not prove the documents are filled. The bracket grep in `tasks.md` T038 is the gate for that. |
<!-- /ANCHOR:log -->
