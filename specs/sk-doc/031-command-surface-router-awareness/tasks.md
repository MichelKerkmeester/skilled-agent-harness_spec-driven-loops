---
title: "Tasks: Command-Surface Root ROUTER.md Awareness Remediation"
description: "Phase-tagged, executor-ready task list for the six audit gaps; each task carries its file, exact change, and verification."
trigger_phrases:
  - "router awareness remediation tasks"
  - "router md remediation task list"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Command-Surface Root `ROUTER.md` Awareness Remediation

> Status legend: `[ ]` open · `[x]` done. Executor: deepseek/luna (operator directive). Each task is self-contained; cite `research/lineages/dsflashgo/research.md` for evidence.

<!-- ANCHOR:tasks -->
## Phase 1 — CI fleet-gate hardening (HIGH) — DONE (commit 4dfd1f33e5; deepseek-flash GAP-1, LUNA GAP-2)

- [x] T001 [P0] Added `.opencode/skills/*/ROUTER.md` to the `push` `paths:` block of `.github/workflows/routing-registry-drift.yml`. (GAP-1) — `grep -c ROUTER.md` = 2
- [x] T002 [P0] Added `.opencode/skills/*/ROUTER.md` to the `pull_request` `paths:` block of the same workflow. (GAP-1)
- [x] T003 [P0] Added `ROUTER.md` to `REQUIRED_BY_CLASS[CLASS_HUB]` in `skill-root-metadata-contract.cjs`. (GAP-2)
- [x] T004 [P0] Wired `root-router-contract.cjs` `validateRootRouter` into the class-H branch of `ci-skill-root-metadata.cjs`; violations propagate to a non-zero exit. Reused the frozen codes; no parallel validator. (GAP-2)
- [x] T005 [P0] Verified: gate exits 0 over the 7 real hubs (`checked=13 passed=13`); removing a hub `ROUTER.md` exits 1 with `MISSING_REQUIRED_FILE` + `RRC-001`; comment-hygiene scan clean.

## Phase 2 — Doctor fleet-ROUTER sweep (MEDIUM) — RESOLVED BY PHASE 1 (no code needed)

- [x] T006 [P1] Not required as separate work. The `parent-skill` route (`_routes.yaml:150`) already runs `ci-skill-root-metadata.cjs` fleet-wide (no `--skill`), and Phase 1 made that gate ROUTER-aware — so `/doctor parent-skill` now audits root `ROUTER.md` across all seven hubs in one invocation. (GAP-3)
- [x] T007 [P1] Verified transitively: the fleet gate's negative control (Phase 1) proves a broken hub `ROUTER.md` → exit 1; the doctor route invokes that exact command fleet-wide. Adding a second sweep would duplicate coverage.

## Phase 3 — Documentation citation cleanup (MEDIUM/LOW) — DONE (commit e07b5f2ae1; deepseek-v4-flash max)

- [x] T008 [P2] `phase-detection.md` — both `./smart-routing.md` links repointed to `../../ROUTER.md` (resolves to sk-code/ROUTER.md). (GAP-4)
- [x] T009 [P2] `sk-code-adapter.md` (4) and `sk-code-known-deviations.md` (3) — `smart-routing.md` citations rewritten to `sk-code/ROUTER.md`. (GAP-5)
- [x] T010 [P3] Both deep-review playbook files — dropped the dangling `ANCHOR:smart-routing` (deep-review SKILL.md has no anchors); file pointer kept. (GAP-6)
- [x] T011 [P2] Verified: `grep -c smart-routing.md` = 0 in all three FIX-A/B files; `ANCHOR:smart-routing` = 0 in both playbook files; new link target exists. Follow-up noted: `sk-code.cjs:134` carries a `smart_routing.md` (underscore) variant — latent, out of scope.

## Phase 4 — Cosmetic template rename (LOW) — HELD: bigger than estimated (operator decision pending)

> Discovery: `parent-skill-smart-routing-template.md` is a ROUTED LEAF resource, not just an asset — referenced in `sk-doc/ROUTER.md:218` (active RESOURCE_MAP) and `sk-doc/leaf-manifest.json:249,289` (typed leaf, 2 modes). A rename therefore cascades into leaf-manifest regeneration → route-gold / compiled-routing churn → the CI byte-drift freshness checks hardened in Phase 1. This is a routing-leaf migration, not a filename edit. GAP-7 is rated cosmetic / no functional impact. Recommendation: DEFER unless a full leaf-rename migration is explicitly wanted.

- [ ] T012 [P3] (deferred) rename the template file. (GAP-7)
- [ ] T013 [P3] (deferred) regenerate `sk-doc/leaf-manifest.json` + update `sk-doc/ROUTER.md` leaf path + ~8 live doc cross-refs (NOT the frozen benchmark reports or historical spec docs).
- [ ] T014 [P3] (deferred) verify no old-name reference remains in live surfaces; leaf-manifest byte-drift + route-gold stay green.
<!-- /ANCHOR:tasks -->
