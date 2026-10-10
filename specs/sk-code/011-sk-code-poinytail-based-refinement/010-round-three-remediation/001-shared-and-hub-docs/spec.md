---
title: "Feature Specification: Phase 1: shared-and-hub-docs"
description: "The sk-code shared tier and hub front pages point into folders that no longer exist, describe two surfaces against a three-surface hub, ship a drifted second copy of two Webflow pattern files and restate contracts other documents own."
trigger_phrases:
  - "shared and hub docs"
  - "phase 1 shared and hub docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: shared-and-hub-docs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/001-shared-and-hub-docs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-review-mode |
| **Handoff Criteria** | Every shared pointer resolves, no owned doc describes two surfaces, the four guards pass and the hub is at 2.2.5.0 with its changelog |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Round-three remediation child specification.

**Scope Boundary**: Everything under `.skilled/skills/sk-code/shared/`, the hub-root `SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `feature-catalog/` and a new `changelog/v2.2.5.0.md`, plus the compiled sk-code manifest the re-mint rewrites. Nothing in the mode or surface packets.

**Dependencies**:
- Findings f-iter001-001, f-iter001-002, f-iter001-003, f-iter002-001, f-iter002-002, f-iter002-003, f-iter003-001, f-iter003-002, f-iter003-003, f-iter004-001, f-iter004-004, f-iter005-001, f-iter012-001, f-iter016-001, f-iter016-002, f-iter017-001, f-iter017-002, f-iter018-001 and f-iter018-002 in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/`
- The shared decisions in `../spec.md` on file ownership, live hook naming, comment budgets, shared controls, duplicated pattern assets, the surface list and versioning

**Deliverables**:
- Repointed shared references with one intra-shared link form
- One copy of the Webflow pattern assets, in the Webflow packet
- One canonical surface-list sentence in the hub `SKILL.md`
- A complete shared-control declaration in `ROUTER.md`, load-tier prose that matches its map, and hub docs that name three surfaces
- Hub release 2.2.5.0 with a changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared tier loads on every sk-code route, yet eight of its docs point into `references/webflow/`, `references/opencode/`, `references/motion_dev/`, `assets/webflow/` and `assets/universal/` families that no longer exist, and its links to its own files use three forms. The shared layer also ships older copies of `validation-patterns.js` and `wait-patterns.js` that drift from the Webflow packet's copies while both are routed. Several docs still describe two surfaces or old mode keys, `workflow-verify.md` copies a `validate.sh` contract its owner contradicts, the universal standard names legacy hooks as live gates, and `ROUTER.md` claims a universal tier loads on every route when its map does not emit one.

### Purpose
Every pointer in the shared tier resolves, each fact has one owner the copies point to, and every owned doc describes the hub as it is: three surfaces, two workflow modes, one pattern-asset copy and release 2.2.5.0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint every legacy-family path in the shared tier to the real packet file, and use the `./` relative link form the shared README uses for links inside the shared tier
- Delete the shared copies of the two pattern assets and their README, and drop their `ROUTER.md` route and shared-control entry
- Replace two-surface wording and old mode keys in the shared README, `phase-detection.md`, the hub README, `ROUTER.md`, the feature catalog, `description.json` and `mode-registry.json`, and add an OBSIDIAN phase table
- Replace the copied `validate.sh` contract in `workflow-verify.md` with a pointer, point the workflow trio's repo-rule floors to their owners, name the live hooks in the universal standard, and make the universal style guide the comment-density owner
- Make the `SHARED_CONTROL_RESOURCES` comment the one declared control set and point the hub `SKILL.md` to it, make `ROUTER.md` load-tier prose match its map, add the OBSIDIAN-versus-WEBFLOW collision row, complete the hub `SKILL.md` layout tree and add the canonical surface-list sentence
- Bump the hub release to 2.2.5.0 across the six hub-root version carriers, write `changelog/v2.2.5.0.md`, and re-mint the compiled sk-code manifest

### Out of Scope
- Moving the "OpenCode Surface Only" subsections out of the shared tier - the OpenCode packet has no reference holding that content yet, so it is a handoff to 005-opencode-and-guards (plan.md, Handoffs)
- Labelling the Webflow and OpenCode comment budgets as surface settings - those style guides belong to 004-webflow-and-obsidian and 005-opencode-and-guards
- The canary collision case, the router-sync guard's own allowlists and the quality-mode hook rows - owned by 005-opencode-and-guards and 003-quality-mode
- Regenerating the Hermes copies, the spec-kit trigger index and the sk-doc README test fixtures - the orchestrator runs those once after every build
- The "across WEBFLOW and OPENCODE" lines in the universal checklists and error-recovery description - they describe the two command sets those docs actually carry and are recorded as open in plan.md

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/SKILL.md` | Modify | Surface-list sentence, shared-control pointer, layout tree, version authority, doctrine glob, version 2.2.5.0 |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Pattern route and control entry removed, control-set comment, load-tier and route-time prose, two-surface wording, version 2.2.5.0 |
| `.skilled/skills/sk-code/README.md` | Modify | Three surfaces, Obsidian rows, version 2.2.5.0 |
| `.skilled/skills/sk-code/description.json` | Modify | Obsidian in the description, version, lastUpdated |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Version 2.2.5.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Three-surface description, doctrine glob, version 2.2.5.0, review-mode write scope note names the user cache path (batch 2) |
| `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | Modify | Live keys, three surfaces, last_updated |
| `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Modify | Live keys, three surfaces |
| `.skilled/skills/sk-code/changelog/v2.2.5.0.md` | Create | Hub release entry |
| `.skilled/skills/sk-code/shared/README.md` | Modify | Live keys, Obsidian, pattern pointer |
| `.skilled/skills/sk-code/shared/assets/patterns/README.md` | Delete | Shared duplicate |
| `.skilled/skills/sk-code/shared/assets/patterns/validation-patterns.js` | Delete | Shared duplicate |
| `.skilled/skills/sk-code/shared/assets/patterns/wait-patterns.js` | Delete | Shared duplicate |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modify | Three surfaces, real paths, guard umbrella, OBSIDIAN phases |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Real Motion paths, collision row, link form |
| `.skilled/skills/sk-code/shared/references/workflow-verify.md` | Modify | validate.sh pointer, repo-rule pointers, pointers to the OpenCode guardrails file in place of two OpenCode-only subsections |
| `.skilled/skills/sk-code/shared/references/workflow-implement.md` | Modify | Repo-rule pointer, pointer to the OpenCode guardrails file in place of the OpenCode-only subsection |
| `.skilled/skills/sk-code/shared/references/workflow-debug.md` | Modify | Repo-rule pointer |
| `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md` | Modify | Real paths, link form |
| `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` | Modify | Link form |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Real checklists, live hooks, link form |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modify | Real paths, comment-density owner, link form |
| `.skilled/skills/sk-code/shared/references/universal/error-recovery.md` | Modify | Real paths, link form |
| `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md` | Modify | Real paths, link form |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify | Re-mint output |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify | Copy of the re-minted manifest |
| `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md` | Modify | Real Webflow checklist paths (extra batch 1) |
| `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/opencode-plus-motion-dev.md` | Modify | Real Webflow checklist path (extra batch 1) |
| `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/non-webflow-plus-motion-dev.md` | Modify | Real Webflow checklist path (extra batch 1) |
| `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md` | Modify | Live packet keys, three surfaces (extra batch 1) |
| `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/stack-folders-validator.md` | Modify | Live packet key (extra batch 1) |
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` | Modify | Live packet key (extra batch 1) |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | Live packet keys in causal_summary (extra batch 1) |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify | Regenerated by the orchestrator after every build, not by the builder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every shared pointer resolves and no legacy family remains | `node specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/check-links.cjs` prints `checked=127 missing=0` and exits 0, and `rg -n 'references/webflow/\|references/opencode/\|references/motion_dev/\|assets/webflow/\|assets/universal/\|assets/opencode/' .skilled/skills/sk-code/shared` prints nothing and exits 1 |
| REQ-002 | One copy of each Webflow pattern asset | `.skilled/skills/sk-code/shared/assets` does not exist, `rg -n 'shared/assets/patterns' .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/shared` prints nothing and exits 1, and both Webflow copies still exist |
| REQ-003 | No owned doc describes two surfaces or uses old mode keys | The two-surface search in tasks.md T122 prints nothing and exits 1, and the hub `SKILL.md` holds exactly one `**Surface list.**` line |
| REQ-004 | `workflow-verify.md` defers the validate.sh contract to its owner | `only become a failing validation outcome` is gone, and the pointer naming `validation-rules.md` and `RESULT: PASSED` lives in `sk-code-opencode/references/shared/workflow-guardrails.md`, which `workflow-verify.md` links to. Amended after the build: the OpenCode-only subsection that carried the pointer moved there with f-iter003-003 |
| REQ-005 | The universal standard names the live gates | `code-quality-standards.md` names `.skilled/scripts/git-hooks/pre-commit` and `claude-posttooluse.cjs` as the gates and mentions the legacy files only as direct-test helpers |
| REQ-006 | The guards stay green | Router-sync prints `router-sync: 5/5 checks passed`, the rule-copy canary prints `OK: all rule invariants present`, the compiled-route guard lists `sk-code` as `fresh`, the leaf freshness check prints `failed=0` and `parent-skill-check.cjs` prints `OK: parent-skill-check`, each exiting 0 |
| REQ-007 | The hub release is 2.2.5.0 with a changelog | The six hub-root carriers read 2.2.5.0 and `changelog/v2.2.5.0.md` validates with `VALID` and `Total issues: 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | One declared shared-control set | `SHARED_CONTROL_RESOURCES` holds seven entries under a comment naming `DEFAULT_RESOURCE` as the other half, and the hub `SKILL.md` sentence points to `ROUTER.md` with no count |
| REQ-009 | Load-tier prose matches the machine map | `rg -n 'universal tier\|universal/\*. tier' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1, and the ALWAYS row names the three `DEFAULT_RESOURCE` paths |
| REQ-010 | Each copied floor points to its owner | The comment-density subsection is in `code-style-guide.md` section 4, and the workflow trio names `root-cause-and-debugging.md`, `evidence-and-proof.md` (twice) and `prevent-overengineering.md` |
| REQ-011 | Detection and link form are consistent | `stack-detection.md` section 4 carries the OBSIDIAN-versus-WEBFLOW row, and no shared reference links a sibling as `` `references/... `` or by its full `.skilled/skills/sk-code/shared/` path |
| REQ-012 | Hub front pages describe the hub | The layout tree lists `README.md`, `leaf-manifest.json`, `changelog/`, `benchmark/`, `feature-catalog/` and `manual-testing-playbook/`, `description.json` names Obsidian in its description, and the hub README version equals `SKILL.md` |
| REQ-013 | Edited docs stay valid and add no voice blockers | Every edited Markdown file prints `VALID` with the issue count it had before, the feature catalog package still reports `violations=2`, and no hard-blocker count rises |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who follows any pointer in the shared tier lands on a file that exists
- **SC-002**: Every owned doc that counts surfaces says three or points to the hub `SKILL.md` surface list
- **SC-003**: Each finding's reproducing case from the research iterations, rerun after the build, no longer reproduces
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled sk-code manifest | High: the version bump stales it and compiled routing falls back to legacy | T116 re-mints it and T117 copies it to its archive, then T126 checks `fresh` |
| Dependency | sk-doc README fixtures and the spec-kit trigger index | Med: deleting the shared pattern README makes `test_readme_manifest.py` and `test_readme_verdict_parity.py` fail until refreshed | Orchestrator tasks T120 and T121 refresh them once after every build |
| Risk | Sibling children edit sk-code packets in parallel | Med: router-sync or Hermes output may move for reasons outside this child | Phase 1 records baselines, and the scope check compares only this child's paths |
| Risk | The builder edits the wrong occurrence | Low | Every OLD text occurs exactly once at plan time and in the simulated sequence, proven by `scratch/gen_units.py` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The handoffs to 003-quality-mode, 004-webflow-and-obsidian and 005-opencode-and-guards are listed in plan.md section 3, Handoffs.
<!-- /ANCHOR:questions -->

---
