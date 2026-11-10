---
title: "Feature Specification: sk-code surface consistency"
description: "The three sk-code surfaces sk-code-skilled, sk-code-obsidian and sk-code-webflow share a routing contract but lay out their SKILL.md, references and assets differently. This packet researched the gaps and plans the remediation: one surface setup, doctor checks that enforce it, a scaffold for new surfaces and routing that reads the surface list from the registry."
trigger_phrases:
  - "surface consistency research"
  - "sk-code surface consistency"
  - "sk-code-skilled obsidian webflow consistency"
  - "sk-code surface remediation"
  - "sk-code surface scaffold"
  - "doctor sk-code surface alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-code surface consistency

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/145-sk-code-surface-consistency-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code hub has three code surfaces that route the same way but are built differently. sk-code-skilled and sk-code-webflow group references into language or topic folders, while sk-code-obsidian keeps 13 topical references flat at the top of `references/`, keeps its checklists flat in `assets/` and puts two sections after Assets. Two `SKILL.md` files also describe the shared workflow links and the sibling map wrongly. Nothing enforces a surface layout: `/doctor:sk-code` never opens a surface's folders, the router-sync guard hard-codes two of the three surfaces so sk-code-obsidian's map escapes its union check, and adding a fourth surface means editing about a dozen files from memory.

### Purpose
Bring all three surfaces onto the one setup that round 1 defines (`research_archive/20261019T081751Z/research.md` §7), make `/doctor:sk-code` enforce it, give the hub a scaffold for creating a new surface, and derive the surface list from `mode-registry.json` instead of hard-coding it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Research (done):** round 1, 5 iterations comparing the three surfaces (`research_archive/20261019T081751Z/research.md`); round 2, 3 iterations on doctor alignment, a surface scaffold and routing (`research/research.md`).
- **Remediation (planned, not started):** 15 steps, detailed in `plan.md` and `tasks.md`. Steps 1-7 come from round 1 §9:
  - wording fixes in the sk-code-skilled and sk-code-webflow `SKILL.md` files
  - moving sk-code-obsidian's Rules and Integration points ahead of Assets
  - moving the flat checklists of sk-code-obsidian and sk-code-webflow into `assets/checklists/`
  - grouping sk-code-obsidian's 13 flat references into topic folders
  - updating every map, router, manifest, playbook, README and mirror that names a moved file
- Steps 8-15 come from round 2 §7:
  - **Routing:** derive the surface list in `verify-router-sync.cjs` from `mode-registry.json`, and add sk-code-obsidian to `router-replay-lib.cjs` and to the surface-hint tests
  - **Doctor:** add the `3g-layout`, `3g-workflow-trio`, `3g-checklists-home`, `3g-reference-depth` and `13d-surface-version` checks to `parent-skill-check.cjs`, each with its own repair line in `/doctor:sk-code`
  - **Scaffold:** add `sk-code/shared/assets/surface-scaffold/` with template files and a `REGISTRATION.md` checklist naming every file a new surface touches

### Out of Scope
- The other sk-code children (sk-code-review, sk-code-quality and the rest). The request names only these three.
- Renaming or flattening sk-code-skilled's or sk-code-webflow's topic folders. The research rejected identical folder names (`research_archive/20261019T081751Z/research.md` §10).
- Adding `shared/`, `scripts/` or `benchmark/` where a surface has no content for them, or any surface `graph-metadata.json`.
- A new `/doctor:sk-code` leg. The `parent-skill` leg already runs `parent-skill-check.cjs`, so the new checks live there (`research/research.md` §4).
- A script that registers a new surface automatically. Round 2 chose a checklist, because the steps cross hand-written docs, routing JSON and generated manifests (`research/research.md` §5).
- Rewriting recorded benchmark reports and machine logs that name the old paths. They stay as the record of their run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | Workflow-link line, sibling-map comment, §4 title |
| `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` | Modify | Workflow-link line, sibling-map comment, checklist paths |
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` | Modify | Section order, reference and checklist paths |
| `.skilled/skills/sk-code/sk-code-obsidian/references/**` | Move | 13 root references into topic folders |
| `.skilled/skills/sk-code/sk-code-obsidian/assets/*.md` | Move | 7 checklists into `assets/checklists/` |
| `.skilled/skills/sk-code/sk-code-webflow/assets/*-checklist.md` | Move | 2 checklists into `assets/checklists/` |
| `.skilled/skills/sk-code/{SKILL.md,ROUTER.md,leaf-manifest.json}` and the compiled route | Modify | Hub union and resource paths |
| Surface and hub `manual-testing-playbook/**`, READMEs, cross-surface references | Modify | Links to moved files |
| `.hermes/skills/sk-code*` | Regenerate | Mirror sync |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` and its tests | Modify | Surface list read from the registry; a fourth-surface fixture |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | Obsidian prefix and markers |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`, advisor plugin vitest | Modify | Matched-prompt hint cases for all three surfaces |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and its tests | Modify | Five new surface checks |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, `assets/doctor-sk-code-setup.yaml`, `sk-code.md` | Modify | A repair line per check id; summary text |
| `.skilled/skills/sk-code/shared/assets/surface-scaffold/` | Create | Template files and `REGISTRATION.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 5 deep-research iterations with cli-codex `gpt-6-luna` at `max` effort on the `fast` tier | round 1 archive holds 5 iteration records with the route-proof fields; round 2 `research/` holds 3 |
| REQ-002 | Synthesize a target layout and per-surface gap list | `research_archive/20261019T081751Z/research.md` names the target and every gap with `path:line` evidence |
| REQ-004 | Every moved file stays reachable through routing | Drift guards, router-sync guard and compiled-route guard pass; a hub probe for each surface resolves its moved resources |
| REQ-005 | No check regresses against the step-1 baseline | The step-1 commands rerun with the same or better result |
| REQ-008 | The router-sync guard checks every registered surface | A fourth-surface fixture fails before the change and passes after; sk-code-obsidian's map is compared with the hub union |
| REQ-009 | `/doctor:sk-code` enforces the surface layout | Each of the five new checks fails on an injected violation with its own id and repair line, and passes on the migrated tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Order the migration and name the check that guards each step | `research_archive/20261019T081751Z/research.md` §9, `research/research.md` §7 and `plan.md` §4 list a check per step |
| REQ-006 | All three `SKILL.md` files share the section order and workflow-link wording of `research_archive/20261019T081751Z/research.md` §7 | A heading diff of the three files shows the shared order |
| REQ-007 | Every surface keeps its checklists under `assets/checklists/` | No `*checklist*.md` file sits directly in a surface `assets/` folder |
| REQ-010 | A new surface can be created from the hub scaffold | A dry run copies the scaffold into a temp hub, and the parent check and router sync pass on it |
| REQ-011 | Routing replay and hint tests cover all three surfaces | `router-replay-lib.cjs` classifies an Obsidian prompt as OBSIDIAN; a matched-prompt hint test passes for SKILLED, OBSIDIAN and WEBFLOW |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every recommendation in both rounds' `research.md` cites a file in one of the three surfaces or the canon it is measured against.
- **SC-002**: The packet passes `validate.sh --strict`.
- **SC-003**: After remediation, sk-code-obsidian has no topical reference at its `references/` root, and the doctor and drift checks match or beat the baseline.
- **SC-004**: `/doctor:sk-code` reports `STATUS=OK legs=8` on the migrated tree with the five new checks active.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A moved file keeps a stale path in a map, router, playbook or mirror | High | Move with `git mv`, then grep the old path across the repo outside `specs/` and recorded reports before each commit |
| Risk | The leaf manifest or compiled route goes stale after a move | Med | Regenerate the manifest and refresh the compiled route in the same change, then run the parent-skill check |
| Risk | The new doctor checks fail on today's tree | High | Land steps 11-13 only after the file moves in steps 4 and 5 |
| Risk | Deriving the surface list exposes existing sk-code-obsidian union mismatches | Med | Step 8 fixes any mismatch it finds in the same change, or records it before going further |
| Dependency | sk-code hub tooling: drift guards, `verify-router-sync.cjs`, parent-skill check, setup check | Moves cannot be verified without them | Run the step-1 baseline first and stop if any check is already failing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Each step lands as its own commit, so any one step can be reverted alone.
- **NFR-R02**: Content of moved files is unchanged apart from relative links that the move breaks.

### Maintainability
- **NFR-M01**: Each surface keeps one routing source of truth, its §2b block, kept equal to the hub union.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Relative links inside a moved file:** a reference moved one level deeper breaks its `../` links to siblings, assets and the hub. Recheck each moved file's links after the move.
- **Symlinked workflow files:** the three `workflow-*.md` links stay at the `references/` root. They are not moved.
- **Recorded reports:** benchmark reports and retrieval fixtures that name old paths are records and are not rewritten. A fixture that a live test reads is updated.
- **Mirrors:** `.hermes/skills/` copies are regenerated, never hand-edited.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | About 60 files: moves and link updates, plus changes to two guard scripts, the doctor and a new scaffold |
| Risk | 15/25 | The guard and doctor changes are code; new checks can break the doctor on an unmigrated tree |
| Research | 6/20 | Done in two rounds; grouping confirmed |
| **Total** | **42/70** | **Level 2** (`recommend-level.sh`: 68/100 for round 1's scope, phases not recommended) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should sk-code-obsidian get a `benchmark/`? The research says only if a measured baseline is wanted; this plan does not add one.
- Should `SK_CODE_EXAMPLE_SURFACES` in `parent-skill-check.cjs` be derived from the registry, or stay a hand-kept list that `REGISTRATION.md` names? Decide in step 14.

### Research Context

Both rounds ran on cli-codex `gpt-6-luna` at `max` effort on the `fast` tier: round 1, 5 iterations, archived at `research_archive/20261019T081751Z/research.md`; round 2, 3 iterations, in `research/research.md`, which summarizes round 1 and is the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Round 1 (archived in `research_archive/20261019T081751Z/`): standardize the surface packet contract and reference-tree grammar, give every surface `assets/checklists/`, keep `shared/`, `scripts/` and `benchmark/` optional, never add a surface `graph-metadata.json`; 7-step migration.
- Doctor: keep the 8 `/doctor:sk-code` legs and add hard `3g-layout`, `3g-workflow-trio`, `3g-checklists-home`, `3g-reference-depth` and `13d-surface-version` checks inside `parent-skill-check.cjs`, with a repair line per id in the setup check.
- Scaffold: add `sk-code/shared/assets/surface-scaffold/` (template SKILL.md, README, references tree, §2b block, checklists home, changelog, `REGISTRATION.md`); it stays in sk-code, not sk-create-skill.
- Routing: `verify-router-sync.cjs` hard-codes two of three surfaces, so sk-code-obsidian's map escapes the union check; derive the inventory from `mode-registry.json` `packetKind: surface`, keep tie-break and signals authored.
- The three §2b blocks already share one schema; load tiers stay only in the hub `ROUTER.md`; `router-replay-lib.cjs` and the hint tests need Obsidian coverage.
- Round 2 adds steps 8-15 to the plan; steps 11-13 land only after round 1's file moves (research.md §7).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
