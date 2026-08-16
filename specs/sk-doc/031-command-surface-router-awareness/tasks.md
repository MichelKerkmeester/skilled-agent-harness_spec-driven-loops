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

## Phase 2 — Doctor fleet-ROUTER sweep (MEDIUM) — after Phase 1

- [ ] T006 [P1] Extend the `parent-skill` route in `.opencode/commands/doctor/_routes.yaml` (and `assets/doctor-parent-skill.yaml`) to loop the per-hub `ROUTER.md` check over every `mode-registry.json`-bearing hub, OR add a dedicated fleet-ROUTER sweep route. (GAP-3)
- [ ] T007 [P1] Verify: the chosen `/doctor` route enumerates all 7 hubs and prints each `router_state`; a broken fixture hub is reported failing.

## Phase 3 — Documentation citation cleanup (MEDIUM/LOW) — parallelizable

- [ ] T008 [P2] `.opencode/skills/sk-code/shared/references/phase-detection.md:40,110` — repoint the two `./smart-routing.md` links to `../ROUTER.md` (or drop the rows). (GAP-4)
- [ ] T009 [P2] `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-adapter.md:123,255,263,286` and `sk-code-known-deviations.md:125,230-231` — rewrite `smart-routing.md §N` citations to `sk-code/ROUTER.md §…`. (GAP-5)
- [ ] T010 [P3] deep-review playbook `invalid-or-contradictory-review-state-halts-for-repair.md:76` and `resume-classification-from-valid-prior-review-state.md:77` — replace `ANCHOR:smart-routing` with the real deep-review SKILL.md anchor, or drop it. (GAP-6)
- [ ] T011 [P2] Verify: `grep -rn "smart-routing.md" .opencode/skills` shows only legitimate legacy-rejection/migration/test/template hits; the three files have no dead links.

## Phase 4 — Cosmetic template rename (LOW, optional) — last or skip

- [ ] T012 [P3] `git mv` `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md` → `parent-skill-root-router-template.md`. (GAP-7)
- [ ] T013 [P3] Update the ~9 cross-references (create-skill-parent auto/confirm YAMLs, `parent-skill-hub-template.md`, `parent-hub-router-schema.md`, `parent-skills-nested-packets.md`, `skill-smart-router.md`, `.opencode/agents/markdown.md` + `.claude` mirror).
- [ ] T014 [P3] Verify: no reference to the old filename remains; the new filename resolves from every referencing file; create-skill-parent still loads the template.
<!-- /ANCHOR:tasks -->
