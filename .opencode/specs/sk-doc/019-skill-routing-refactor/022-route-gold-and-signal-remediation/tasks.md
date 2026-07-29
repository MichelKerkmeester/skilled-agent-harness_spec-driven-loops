---
title: "Tasks: Clear the two hubs' BLOCKED route-gold verdicts"
description: "Lane 1 sk-design interface signals; Lane 2 sk-code surface-detection gold; each gated per-scenario."
trigger_phrases:
  - "route gold remediation tasks"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Tasks: Clear The Two Hubs' BLOCKED Route-Gold Verdicts

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

- [x] T001 Identify the twelve failing scenarios with expected-vs-observed evidence
- [ ] T002 Capture pre-change per-scenario baselines for sk-design and sk-code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T101 Lane 1 confirm: read SR-002 / AI-001 vocabulary; find the folded-vocabulary gap in interface routerSignals
- [ ] T102 Lane 1 fix: minimal signal edit in sk-design/hub-router.json; re-gate; commit
- [ ] T103 Lane 2 decide: from the route-gold scorer contract, is surface-detection route-gold-scored (author gold) or exempt?
- [ ] T104 Lane 2 apply: author typed gold OR add the exemption for the ten sk-code scenarios; re-gate; commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T201 Per-scenario diff: exactly the targeted rows move on each hub
- [ ] T202 sk-prompt PASS 100 and sk-doc PASS 98 reproduce; record the new sk-design/sk-code baselines
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All tasks complete with evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Prior finding: `../021-mode-sk-prefix-rename/review/review-report.md` section 6
- Spec: `./spec.md` · Plan: `./plan.md` · Checklist: `./checklist.md`
<!-- /ANCHOR:cross-refs -->
