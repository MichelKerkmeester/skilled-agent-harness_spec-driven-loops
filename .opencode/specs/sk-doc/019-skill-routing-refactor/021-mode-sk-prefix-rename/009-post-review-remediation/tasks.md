---
title: "Tasks: Post-review remediation"
description: "Fix every remaining deep-review finding: route-gold refresh, phase-parent status rollup, pre-existing repairs, additive advisor vocabulary."
trigger_phrases:
  - "post review remediation"
  - "route gold refresh"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---

# Tasks: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Scaffold this phase and freeze lane order and gates
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T101 Lane C: family-registry repair + dead-mode cleanup (SOL dispatch, verify, commit)
- [ ] T102 Lane D: additive advisor vocabulary (SOL dispatch, verify, commit)
- [ ] T103 Lane B: phase-parent rollup + tests (SOL dispatch, verify, commit)
- [ ] T104 Lane A: route-gold refresh + re-baseline (SOL dispatch, verify, commit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T201 Final 4-hub matrix with Lane A baseline recorded
- [ ] T202 validate.sh --recursive --strict Errors 0; review-report reconciliation updated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All tasks complete with evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Findings: `../review/review-report.md` - Contract: `../002-rename-contract-and-map/contract.md`
<!-- /ANCHOR:cross-refs -->
