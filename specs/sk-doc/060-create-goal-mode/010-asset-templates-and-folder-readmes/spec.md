---
title: "Feature Specification: Phase 10: asset-templates-and-folder-readmes"
description: "The mode had no goal templates of its own, no README for its code folders and a references index that should not exist. This phase adds three checked per-kind templates, two code-folder READMEs and removes the index."
trigger_phrases:
  - "goal asset templates"
  - "per-kind goal template"
  - "goal template parity test"
  - "create-goal code readme"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: asset-templates-and-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-verification-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Three per-kind goal templates match `goal.md.tmpl` under a parity test, the checker rejects an unfilled copy of each, both code folders have a valid README, `references/README.md` is gone with every link repointed, and the compiled route is republished. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Create the sk-create-goal sk-doc mode that authors packet goals specification. It was added after phase 009 closed, at the operator's request on 2026-09-26.

**Scope Boundary**: The `sk-create-goal` packet, its command files, the sk-doc hub router and leaf manifest, the compiled route for sk-doc and the generated Hermes copy. system-spec-kit's `goal.md.tmpl` stays unchanged.

**Dependencies**:
- Phase 009 shipped the mode, its checker and its playbook.
- The operator chose checked per-kind copies over standalone templates or fill guides.

**Deliverables**:
- `assets/goal-top-level-template.md`, `assets/goal-phase-parent-template.md` and `assets/goal-phase-child-template.md`.
- `scripts/tests/template-parity.test.cjs` and a checker that reads the templates' placeholder wording.
- `scripts/README.md` and `scripts/tests/fixtures/README.md`.
- `references/README.md` removed, the contract amended and the route republished.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode's `assets/` held only exemplars, so an author had no blank for a top-level, phase-parent or phase-child goal and had to render one through system-spec-kit tooling. Its `scripts/` and `scripts/tests/fixtures/` folders had no README, and `references/README.md` was an index the operator does not want and that fails the README validator's overview rule.

### Purpose
Give every goal kind a checked blank that cannot drift from system-spec-kit, document the code folders and drop the index.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three per-kind templates, built from `goal.md.tmpl` rendered at the matching level, with kind-specific placeholder wording.
- A parity test, and a checker change so an unfilled copy of any template fails the `placeholder` check.
- Two code-folder READMEs.
- Removing `references/README.md` and `assets/.gitkeep`, and amending every surface that named them or the render-only rule.
- Republishing the sk-doc compiled route, regenerating the leaf manifest and the Hermes copy, a v1.1.0.0 changelog and this phase's records.

### Out of Scope
- Changing `goal.md.tmpl` or the inline renderer. system-spec-kit owns both.
- The missing Overview section in `references/parent-and-nested-goals.md`. It predates this phase.
- Rewriting the v1.0.0.0 changelog into the newer changelog format.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/assets/goal-{top-level,phase-parent,phase-child}-template.md` | Create | The three blanks |
| `.skilled/skills/sk-doc/sk-create-goal/assets/.gitkeep`, `references/README.md` | Delete | No longer wanted |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Modify | Read placeholder wording from the templates |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/{check-goal,template-parity}.test.cjs` | Modify and create | Unfilled-template and parity tests |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md`, `scripts/tests/fixtures/README.md` | Create | Code-folder READMEs |
| `.skilled/skills/sk-doc/sk-create-goal/{SKILL.md,README.md,references/parent-and-nested-goals.md}` | Modify | Template workflow, links, version 1.1.0.0 |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/**` | Modify | Process prose names the templates |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.1.0.0.md` | Create | Release notes |
| `.skilled/commands/create/goal.md`, `assets/create-goal-{auto.yaml,confirm.yaml,presentation.txt}` | Modify | The command copies the template for the goal's kind |
| `.skilled/skills/sk-doc/{ROUTER.md,leaf-manifest.json}` | Modify | Goal-authoring resources |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its authored copy | Modify | Republished route |
| `.hermes/skills/sk-create-goal/SKILL.md` | Regenerate | Generated copy |
| `specs/sk-doc/060-create-goal-mode/{spec.md,goal.md}` and this folder | Modify and create | Phase records and parent binding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the three templates carries the fixed text of `goal.md.tmpl` at its level, and a test fails when the two differ. |
| REQ-002 | `check-goal.cjs` fails an unfilled copy of each template on the objective, a decision and a criterion, with no change to its report on the live goal corpus. |
| REQ-003 | `scripts/README.md` and `scripts/tests/fixtures/README.md` pass `validate_document.py --type code_folder`. |
| REQ-004 | `references/README.md` is deleted and no live file links to it. |
| REQ-005 | The compiled route for sk-doc is republished and every routing gate passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `SKILL.md`, the reference, the command files, the README and the playbook describe the template workflow, and the D2 decision in the parent goal says the same. |
| REQ-007 | The mode is versioned 1.1.0.0 with a changelog that passes the shape checker. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes 15 of 15.
- **SC-002**: `compiled-route-guard.cjs` reports every hub fresh, and the sk-doc canary passes 22 of 22.
- **SC-003**: `validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict` prints `RESULT: PASSED` for all 11 folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `goal.md.tmpl` | A change there breaks parity | The parity test names the first differing line |
| Risk | New placeholder wording the checker does not know | An unfilled template passes the check | The checker reads the wording from the templates themselves |
| Risk | The hub router still names the deleted index | Stage-two routing loads a missing file | ROUTER.md, the leaf manifest and the compiled route are regenerated together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The checker reads three small asset files once at load time.

### Security
- **NFR-S01**: The checker stays read-only and touches no session state.

### Reliability
- **NFR-R01**: A missing template block makes the checker throw instead of silently checking less.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty list values such as `blockers: []` count as fixed text in the parity test, not as placeholders.
- A top-level or child template skips heading number 2, as `goal.md.tmpl` does without the binding section.

### Error Scenarios
- A template without its BEGIN and END markers fails the parity test and stops the checker from loading.

### State Transitions
- A child that `create.sh --with-goal` scaffolded keeps its file. The child template guides how to fill it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 25 files across the mode, the command, the hub and routing |
| Risk | 8/25 | No runtime state; routing is republished with a rollback |
| Research | 4/20 | The template and the renderer output were read directly |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator chose checked per-kind copies on 2026-09-26.
<!-- /ANCHOR:questions -->

---
