---
title: "Tasks: Realign every external consumer of the renamed mode packets"
description: "Sweep live surfaces outside the four hubs — runtime mirrors, agent definitions, commands, workflows, cli-orchestration docs, metadata — to the sk- names, leaving history untouched."
trigger_phrases:
  - "mode rename consumer sweep"
  - "runtime mirror realignment"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

# Tasks: Realign every external consumer of the renamed mode packets

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

- [x] T001 Apply the frozen map slice (moves + typed edits) — see implementation summary
- [x] T002 Regenerate generated artifacts and repair engine/consumer paths as found
- [x] T003 Reproduce the Lane C gate and the link baseline exactly
- [x] T004 Commit with paired renames (2092be246b, dc625440f4)
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
