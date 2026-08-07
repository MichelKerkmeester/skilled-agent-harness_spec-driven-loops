---
title: "Tasks: Freeze the rename contract and map"
description: "One frozen contract and machine-readable map: 21 workflowModes, 20 packet directories, the shared-packet exception, gate definitions and history exclusions."
trigger_phrases:
  - "rename contract freeze"
  - "sk rename map"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Tasks: Freeze the rename contract and map

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 LUNA merges both research lineages into contract.md
- [x] T002 Generate and freeze ../assets/rename-map.json (21 keys / 20 dirs / 1 shared packet)
- [x] T003 Capture pre-rename gates (Lane C reports x4, 84-entry link baseline)
- [x] T004 Commit before execution (6645d48d6a)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T101 Apply the edits for this phase (see implementation summary for the full inventory)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T201 Reproduce the Lane C gate exactly (verdict and aggregate)
- [x] T202 Link set-diff equals the frozen baseline (relocations only)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks above complete with evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Contract: `../002-rename-contract-and-map/contract.md`
- Frozen map: `../assets/rename-map.json`
- Spec: `./spec.md` · Plan: `./plan.md` · Summary: `./implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
