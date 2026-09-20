---
title: "Implementation Plan: Freeze the rename contract and map"
description: "One frozen contract and machine-readable map: 21 workflowModes, 20 packet directories, the shared-packet exception, gate definitions and history exclusions."
trigger_phrases:
  - "rename contract freeze"
  - "sk rename map"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Implementation Plan: Freeze the rename contract and map

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Author** | GPT-5.6-LUNA xhigh (cli-codex) |
| **Inputs** | Both phase 001 research lineages |
| **Outputs** | contract.md + ../assets/rename-map.json |

### Overview
LUNA merges the two research inventories into one executable contract; the orchestrator reviews,
freezes and commits before any move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 lineages complete

### Definition of Done
- [x] Map validates against on-disk packet inventory
- [x] Contract committed before execution
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The contract is a living document during execution: falsified assumptions become numbered section 8
amendments in the same file, so the executed truth and the planned truth stay in one place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Execute | Apply this phase's slice of the frozen map (moves, typed edits, regeneration) |
| Verify | Reproduce the Lane C gate and the link baseline exactly |
| Commit | Land with paired renames |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral parity is the test: the Lane C router-replay must reproduce the pre-rename verdict and aggregate exactly, and the repo-wide broken-link set must equal the frozen 84-entry baseline modulo relocations. Touched code additionally passes node --check and its own test files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002's frozen `rename-map.json` and contract (including gate definitions).
- The pre-captured pre-rename Lane C reports and link baseline.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each hub landed as its own commit with git-paired renames, so a hub reverts cleanly with `git revert` of its commit; the frozen map is never rewritten, so a disputed rename is re-derivable.
<!-- /ANCHOR:rollback -->
