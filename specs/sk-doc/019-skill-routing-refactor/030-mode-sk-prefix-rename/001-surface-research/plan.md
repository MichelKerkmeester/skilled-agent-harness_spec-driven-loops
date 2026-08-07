---
title: "Implementation Plan: Find every surface an sk- prefix rename touches"
description: "Two independent models on two CLIs enumerate every consumer of a mode packet directory or workflowMode key."
trigger_phrases:
  - "sk prefix rename research"
  - "mode rename surface discovery"
importance_tier: "critical"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Implementation Plan: Find every surface an sk- prefix rename touches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executors** | Grok 4.5 high (cli-cursor) x5 iterations, GLM 5.2 (cli-devin) x5 iterations |
| **Output** | `research/lineages/grok-4-5-high/research.md`, `research/lineages/glm-5-2/research.md` |

### Overview
Run two independent research lineages over the four sk- hubs, each enumerating consumer classes of
packet directory names and workflowMode keys, then merge into the phase 002 contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope fixed to the four sk- hubs; executors chosen by the operator

### Definition of Done
- [x] Both lineages delivered surface inventories
- [x] Findings merged into the frozen contract and map (phase 002)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each lineage sweeps independently (registries, routers, manifests, gold, mirrors, prose), so a class
one model misses the other can surface; the union feeds the contract.
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
