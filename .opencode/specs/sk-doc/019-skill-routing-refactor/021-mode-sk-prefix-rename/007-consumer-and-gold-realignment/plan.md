---
title: "Implementation Plan: Realign every external consumer of the renamed mode packets"
description: "Sweep live surfaces outside the four hubs — runtime mirrors, agent definitions, commands, workflows, cli-orchestration docs, metadata — to the sk- names, leaving history untouched."
trigger_phrases:
  - "mode rename consumer sweep"
  - "runtime mirror realignment"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---

# Implementation Plan: Realign every external consumer of the renamed mode packets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Skill hub mode packets, routing registries, benchmark gold, consumers |
| **Executor** | Orchestrator sweep (the planned LUNA dispatch was unnecessary: the surface was mechanical after the hub passes) |
| **Verification** | Lane C router-replay reproduction + link set-diff vs frozen baseline |

### Overview
Apply the frozen rename map for this slice: orchestrator performs git moves, the dispatched model
performs edits, the orchestrator verifies every claim against the gate before committing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Frozen map and contract committed before any move
- [x] Pre-rename Lane C report and link baseline captured

### Definition of Done
- [x] Gate reproduction exact (verdict and aggregate)
- [x] Link set-diff shows relocations only
- [x] Committed with paired renames
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Move directories with git mv so history pairs; rename typed positions (registry, router,
frontmatter, gold, smart-routing arrays) exactly per the map; regenerate generated artifacts
(leaf manifests) instead of editing them; sweep path-shaped inbound references in the same commit;
treat every dispatched model claim as a hypothesis and verify it against the gate.
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
