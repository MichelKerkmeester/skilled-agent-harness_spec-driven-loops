---
title: "Feature Specification: Phase 1: skill-and-tag-move"
description: "Nine doctor commands about putting Skilled into a project are credited to system-spec-kit and one to sk-doc, so integration requests route to skills whose purpose does not cover them. This phase adds the standalone system-skilled-doctor skill and moves those ten commands' skill_agent tags to it."
trigger_phrases:
  - "skill and tag move"
  - "phase 1 skill and tag move"
  - "system skilled doctor scaffold"
  - "doctor skill agent tag move"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 1: skill-and-tag-move

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Ten doctor commands about supporting and integrating Skilled into a project are credited to `system-spec-kit` or `sk-doc`, so a request to install or update Skilled routes to a spec-folder skill. This phase adds the standalone skill `system-skilled-doctor` and moves each command's `skill_agent` tag to it, with no command file moving. The doctor contract tests pass at the same 1005 tests before and after, and the regenerated bridges credit all ten commands to the new skill.

**Key Decisions**: one standalone skill rather than a parent hub; the command files stay in `.skilled/commands/doctor/`.

**Critical Dependencies**: `derive-command-bridges.cjs`, which credits each doctor bridge to its router's `skill_agent` tag.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-06 |
| **Branch** | `worktrees/320-system-skilled-doctor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-overlay-engine |
| **Handoff Criteria** | The skill passes `validate_skill_package.py --strict`, the doctor contract tests pass, and every moved bridge names `system-skilled-doctor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build system-skilled-doctor and the doctor overlay command specification.

**Scope Boundary**: the new skill's folder, one line in each of ten command routers, the four contract tests that pin the old tag, the regenerated bridge outputs and the `system-spec-kit` README doctor table.

**Dependencies**:
- The decided design in `../research/design-plan.md` §3, which names the owned and the left commands.

**Deliverables**:
- `.skilled/skills/system-skilled-doctor/` in the standalone shape.
- Ten moved `skill_agent` tags and regenerated command bridges.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`install`, `symlink`, `update`, `setup`, `helper`, `runtime-mirrors`, `env`, `speckit` and `mcp` carry `skill_agent: system-spec-kit`, and `agents-md` carries `skill_agent: sk-doc`. `derive-command-bridges.cjs` credits each doctor bridge to that tag, so a request to put Skilled into a project is credited to a skill whose purpose is spec folders or documentation.

### Purpose
Every doctor command about supporting and integrating Skilled into a project is credited to one skill whose purpose matches it, and every command keeps its name and behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run in the worktree before any change, on 2026-11-06:

```text
$ grep -m1 -H skill_agent .skilled/commands/doctor/{install,symlink,update,setup,helper,runtime-mirrors,env,speckit,mcp,agents-md}.md
install.md <!-- skill_agent: system-spec-kit -->      (and the same for symlink, update, setup,
helper, runtime-mirrors, env, speckit, mcp)
agents-md.md <!-- skill_agent: sk-doc -->
$ node --test .skilled/commands/doctor/scripts/tests/*.test.cjs
ℹ tests 1005
ℹ pass 1005
ℹ fail 0
$ npx vitest run tests/command-bridges-drift-guard.vitest.ts      # in system-skill-advisor/runtime
      Tests  5 passed (5)
$ advisor_recommend "put Skilled into my project repo"
command-doctor-helper:0.80
$ advisor_recommend "install skilled into this repository"
(no recommendation)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scaffold `.skilled/skills/system-skilled-doctor/` with `init_skill.py` and fill `SKILL.md`, `ROUTER.md`, `README.md`, `graph-metadata.json`, the changelog and the playbook.
- Change the `skill_agent` tag in ten command routers to `system-skilled-doctor`.
- Update the four contract tests that pin the old tag.
- Regenerate the command bridges with `derive-command-bridges.cjs`.
- Move the `system-spec-kit` README doctor table to the new README and keep a one-sentence pointer.

### Out of Scope
- The `/doctor:overlay` command and its engine - phase 002.
- Moving any command file - the bridge deriver, `_routes.yaml` and the runtime mirrors read the fixed doctor folder.
- The six doctor commands that stay with their domain skill - each checks that skill's own surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-doctor/` | Create | `SKILL.md`, `ROUTER.md`, `README.md`, `graph-metadata.json`, `leaf-manifest.config.json`, generated `leaf-manifest.json` and `leaf-aliases.json`, `changelog/v1.0.0.0.md`, `manual-testing-playbook/`, `benchmark/` |
| `.skilled/commands/doctor/{install,symlink,update,setup,helper,runtime-mirrors,env,speckit,mcp,agents-md}.md` | Modify | One `skill_agent` line each |
| `.skilled/commands/doctor/scripts/tests/doctor-{install,helper,symlink,agents-md}-contract.test.cjs` | Modify | The pinned tag |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/scripts/skill_advisor.py` | Generate | The two deriver outputs whose content changed |
| `.skilled/skills/system-spec-kit/README.md` | Modify | The doctor table moves out, one pointer sentence stays |
| `.hermes/skills/system-skilled-doctor/SKILL.md` | Generate | The Hermes copy of the new skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids follow the design packet's numbering, so this phase carries REQ-008 only.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-008 | Every existing `/doctor:*` command keeps its name and behavior after its tag moves, and each moved bridge names `system-skilled-doctor` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-014 | The new skill passes `validate_skill_package.py --strict` and the skill-graph validator |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` reports 1005 passing and 0 failing, the baseline count.
- **SC-002**: `advisor_recommend` ranks `system-skilled-doctor` first for "put Skilled into my project repo".
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `derive-command-bridges.cjs` | Without it the bridges keep crediting the old owners | Rerun it and read the owner of every doctor bridge |
| Risk | Advisor routing moves for prompts `system-spec-kit` won before | Medium | Capture `advisor_recommend` on 12 prompts before and after |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. No command's runtime path changes, only the tag the deriver reads.

### Security
- **NFR-S01**: N/A. No command gains or loses a write.

### Reliability
- **NFR-R01**: The skill-graph validator passes, because an asymmetric edge blocks the `sk-skill` converter tests.

---

## 8. EDGE CASES

- Empty input: a doctor router with no `skill_agent` tag is unchanged, since all ten carry exactly one.
- Maximum input: all sixteen doctor routers are read by the deriver, and only the ten owned ones change owner.
- Failure path: a contract test that still pins the old tag fails with an assertion on its count, which is how the move was proven.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: about 25, LOC: about 500, Systems: skills, commands, advisor |
| Risk | 8/25 | Auth: N, API: N, Breaking: routing ownership only |
| Research | 4/20 | Done in the design packet |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: the bridge deriver and the Hermes sync |
| **Total** | **28/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A moved command routes worse than before | M | L | Before and after advisor runs on 12 prompts |
| R-002 | A graph edge without its mirror breaks the graph validator | M | M | Use `enhances` edges, which need no mirror, and rerun the validator |

---

## 11. USER STORIES

### US-001: Install requests reach the right skill (Priority: P0)

**As a** person adding Skilled to a project, **I want** "put Skilled into my project repo" to route to the integration commands, **so that** I am not sent to the spec-folder skill.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Existing commands keep working (Priority: P1)

**As a** person who already runs `/doctor:install` or `/doctor:update`, **I want** those names to run what they ran before, **so that** my scripts and habits keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The operator decided every question in the design packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decisions**: See `decision-record.md`

---
