---
title: "Goal: Phase 19: routing-miss-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "routing miss fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/019-routing-miss-fixes"
    last_updated_at: "2026-10-11T18:30:00Z"
    last_updated_by: "routing-miss-fixes-builder"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-019-routing-miss-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: routing-miss-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the three routing misses earlier passes closed as one-caller mechanisms (DOC-331, P4, P7) without moving any other row.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each fix extends an existing rule or router; no schema field, option or file index, and no probe string is special-cased |
| D2 | A miss that cannot be fixed without moving another row stops, and the conflict is reported in numbers |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs` and `python3 specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py`, run from the repository root, each print `positives 17/17 negatives-false-positive 0/5`.
- [ ] `node .skilled/bin/compiled-route-admission.cjs --all`, run from the repository root, exits 0 and prints `Every hub passes the admission check.`
- [ ] `npx vitest run`, run from `.skilled/skills/system-skill-advisor/runtime`, reports 137 test files passed and 0 failed.
- [ ] `for t in .skilled/bin/tests/*.test.cjs; do node --test $t; done`, run from the repository root, prints `ℹ fail 0` for every file.
- [ ] `node .skilled/bin/compiled-route-sync.cjs --check` and `node .skilled/bin/compiled-route-guard.cjs` both exit 0, and `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs` prints `all hubs failures 0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/019-routing-miss-fixes --strict`, run from the repository root, prints RESULT: PASSED, and `git status --short` prints nothing.
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
| DOC-331 | Done | Admission `system-deep-loop` 19 pass 1 drift, then 20 pass 0 drift; 82 scenarios, only that row changed; canaries 0 failures |
| P4 and P7 | Done | CLI battery 15/17 to 17/17, Python battery 16/17 to 17/17, 0 of 5 false positives; N3 unchanged |
| Rule tests | Done | Old sources: 2 golden rows, 1 Python case and 3 finished-run cases fail; new sources pass |
| Regression | Done | Advisor vitest 1,036 to 1,040 passed, 0 failed; regression suite `overall_pass` true; 1,342-prompt snapshot moves only the intended rows |

### Deviations and findings

| Item | Note |
|------|------|
| Admission corpus pin | `compiled-route-admission.test.cjs` pinned 86 scenarios and failed on main with 82, the count left after the improvement modes were removed; re-pinned at 82 |
| Ledger and baseline | The two fixes are improvements, so the eval baseline (full corpus 153 to 155, ambiguity 18 to 19) and the divergence ledger (rr-iter2-006 added, rr-iter3-061 re-approved) were recaptured |
| Python re-sort left alone | The shim sorts by confidence and drops the native rank; 8 labeled prompts differ between the two orders, in both directions, so the P4 mirror follows the native rank only on a code-authoring prompt |
<!-- /ANCHOR:log -->
