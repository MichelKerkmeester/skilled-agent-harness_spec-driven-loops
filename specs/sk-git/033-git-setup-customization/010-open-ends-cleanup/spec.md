---
title: "Feature Specification: Phase 10: open-ends-cleanup"
description: "Four open ends remain after the doctor releases: an adapter check that reads text, a hub check run on a standalone skill, a synthesis count check that double-counts, and Human Voice Rules blockers in two doc sets."
trigger_phrases:
  - "open ends cleanup"
  - "phase 10 open ends cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: open-ends-cleanup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-second-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Each of the four items is fixed with a test or rejected with evidence, and every gate in plan.md passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the sk-git setup customization specification. It closes the open ends the doctor releases left behind in the areas sk-git, sk-doc, sk-prompt and deep-loop own.

**Scope Boundary**: the four items below, and nothing beside them. The advisor runtime, `_routes.yaml`, the bridge files, the playbook validator and the advisor launcher belong to the parallel packet `specs/system-skill-advisor/036-routing-and-launcher-hardening`.

**Dependencies**:
- The parallel 036 build edits the advisor surfaces at the same time, so shared files are diffed before each edit.

**Deliverables**:
- A battery adapter check that proves the OpenCode and Pi event binding is exported or registered, with fixture tests.
- A parent-hub checker that refuses a standalone skill root instead of reporting hub failures on it, with a test.
- A synthesis close-out count check that counts distinct findings on both sides, with tests that fail on the old logic.
- Zero Human Voice Rules hard blockers in the four sk-create-command docs and the 033 parent spec.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. The coordinator writes it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/doctor:git setup` battery accepts an OpenCode or Pi adapter when the event name and a function sit anywhere in the file, so an unused object or an uncalled helper reads as a registered advisory. `parent-skill-check.cjs` prints five hub failures for sk-prompt, which has been a standalone skill since v3.0.0.0, and phase 9 recorded those failures as an open hub defect. The deep-loop synthesis close-out sums cumulative per-iteration finding snapshots and adds `repeatedFindings` (a subset of `openFindings`) to the registry total, so its count check compares inflated totals. Forty-one Human Voice Rules hard blockers sit in the sk-create-command docs and the 033 parent spec.

### Purpose
Each check reports what is true: a registration is real, a hub check runs only on hubs, the close-out compares distinct findings, and the docs pass the voice scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Item 1: the OpenCode and Pi branch of `checkAiToolHooks` in the git setup battery, plus its tests.
- Item 2: sk-prompt's hub status, and the checker behavior that produced the false finding.
- Item 3: the count comparison in `synthesis-closeout.cjs`, plus its tests.
- Item 4: the hard blockers in the four named sk-create-command docs and the 033 parent `spec.md`, then the Hermes skill sync.

### Out of Scope
- `reduce-state.cjs`, which the brief forbids touching. It is read only to confirm what `repeatedFindings` holds.
- Advisor runtime, `_routes.yaml`, bridge files, playbook validator and launcher, which the 036 packet owns.
- Changelog entries, which the coordinator writes.
- Soft and review-level Human Voice findings, which are not hard blockers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Prove the OpenCode and Pi binding sits in the default export |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Unused-binding failing fixtures plus passing shapes |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Refuse a class S root with exit 2 and a clear reason |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Standalone-root test |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modify | Count distinct findings on the state and registry sides |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-latest-record.vitest.ts` | Modify | Cumulative-snapshot and duplicate-registry tests |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md` | Modify | Clear 31 hard blockers |
| `.skilled/skills/sk-doc/sk-create-command/references/common-pitfalls.md` | Modify | Clear 2 hard blockers |
| `.skilled/skills/sk-doc/sk-create-command/references/worked-example.md` | Modify | Clear 2 hard blockers |
| `.skilled/skills/sk-doc/sk-create-command/references/argument-hints-and-modes.md` | Modify | Clear 1 hard blocker |
| `specs/sk-git/033-git-setup-customization/spec.md` | Modify | Clear 5 hard blockers, fill the phase 10 map row |
| `.hermes/skills/sk-create-command/SKILL.md` | Regenerate | Hermes sync after the SKILL.md change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The adapter check accepts a binding only inside the default export: the object an OpenCode plugin returns, or an `.on("tool_call", ...)` call on a Pi extension's parameter | A fixture with an unused binding fails, the real adapters pass, and the battery never executes inspected code |
| REQ-002 | sk-prompt's hub status is decided from its contract class, and the false finding's cause is fixed | sk-prompt stays class S, and `parent-skill-check.cjs` refuses a class S root with a reason instead of five hub failures |
| REQ-003 | The close-out count check compares distinct findings | A cumulative-snapshot fixture closes complete, and a registry that covers fewer distinct findings than the state closes incomplete. Both tests fail on the old logic |
| REQ-004 | No Human Voice Rules hard blockers remain in the five docs | `hvr_scan.py` reports 0 hard blockers on each, and `validate_document.py` passes on each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression in any gate named in plan.md | Every gate's result line matches or improves on its baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each code fix has a test that fails when the fix is reverted, shown by a mutation check.
- **SC-002**: The doctor runner, the deep-loop suites and every listed gate pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parallel 036 build | A shared file changes under this build | Diff each shared file before editing it, never stash or restore files this build did not change |
| Risk | A stricter adapter check rejects a valid adapter shape | Med | The real OpenCode and Pi adapters are passing fixtures |
| Risk | The class S refusal hides a hub that lost both routing files | Low | The refusal exits 2, which the doctor maps to ERROR, and `ci-skill-root-metadata.cjs` still flags the missing class S files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The four items were verified against the code before planning, and plan.md records the evidence.
<!-- /ANCHOR:questions -->

---
