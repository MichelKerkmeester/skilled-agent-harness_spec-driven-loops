---
title: "Feature Specification: Phase 8: deferred-surface-items"
description: "Phase 007 left four surface items out of scope because each needed an owner or a decision. This phase closes them: the metadata gate validates an external surface_detection block, the two private surface skills declare theirs, the public quality overlay stops imposing the Webflow house style on SKILLED code, the comment-hygiene allowlist keeps only entries a verdict depends on, and the language checklists list naming at P1."
trigger_phrases:
  - "deferred surface items"
  - "phase 8 deferred surface items"
  - "external surface detection validation"
  - "javascript css overlay naming"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 8: deferred-surface-items

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-shared-references-and-detection-order |
| **Successor** | None |
| **Handoff Criteria** | The contract tests and the CI-form metadata check pass, and recursive strict validation of the parent prints `RESULT: PASSED` for all nine folders |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the private surface skills packet. Phase 007 made detection order data and trimmed the shared references, and its Out of Scope list held four items that each belonged to another owner or needed a decision. On 2026-10-25 the operator approved two of them by name and delegated the other two: "decisions can wait untill end or you make best judgement and verifiy at end".

**Scope Boundary**: the four items phase 007 listed as out of scope, plus one the overlay work found: the SKILLED language checklists still list naming under P0, against the operator's P1 decision.

**Dependencies**:
- Phase 007 on `main` (`1c317e13c5`)
- The operator's answers of 2026-10-25: "Add both (Recommended)" for the private blocks and "Validate the fields (Recommended)" for the gate

**Deliverables**:
- Field rules for an external `surface_detection` block in the skill-root metadata gate, with a test per rule
- A specific block in each private surface skill, verified against the detection readers
- A public JavaScript and CSS overlay that no longer contradicts the SKILLED naming rule
- An allowlist decision for the WEBFLOW, MOTION and LENIS entries in `check-comment-hygiene.sh`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An external sk-code family skill can declare a broken `surface_detection` block today, and the metadata gate accepts it while every reader silently ignores it. The operator's two private surfaces still lose to SKILLED, because neither declares a block. And `sk-code-quality` loads a JavaScript and CSS overlay for every `.js` or `.css` target whose P0 rules require snake_case variable and function names, the opposite of the camelCase rule the hub's own SKILLED references set.

### Purpose
The hub's gate, its private surfaces and its quality overlay agree with the detection contract and the SKILLED naming rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validate an external `surface_detection` block in `ci-skill-root-metadata.cjs`: a non-empty label, the role `specific` and at least one marker, every marker a non-empty string, with a test per rule
- Declare a block in the private `local-webflow` and `local-obsidian` skills, backed up first and checked against the detection readers
- Remove from the public overlay the Webflow house-style checks `local-webflow` already carries, keep the surface-neutral checks at their strength, and set any naming rule that stays to P1
- Keep each WEBFLOW, MOTION and LENIS allowlist entry in `check-comment-hygiene.sh` only if a verdict depends on it
- Move the naming items of the SKILLED language checklists from P0 to P1, the tier the operator chose for naming

### Out of Scope
- Changing how the detection readers match a workspace, for example walking up from a subfolder to the repository root - the readers follow `stack-detection.md` section 2, and a session normally starts at the repository root
- The stale wording in the private `local-obsidian` SKILL.md, which still names the old plugin and the `esbuild.config.mjs` marker - the operator owns that file and approved only the block
- Cross-skill label uniqueness and unknown-key rejection inside a block - nobody asked for them, and no current block needs them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Field rules for an external block |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | One case per rule, a valid block and the absent key |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Section 2 states the new rules |
| `.skilled/skills/sk-code/sk-code-quality/` overlay checklists, `SKILL.md`, `README.md`, playbook and changelog | Modify | The overlay keeps only checks that hold on every public surface |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` and its tests | Modify | The allowlist decision |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/` language checklists | Modify | Naming items move from P0 to P1 |
| `local-webflow/graph-metadata.json`, `local-obsidian/graph-metadata.json` | Modify (private, in two other repositories) | The two blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The metadata gate rejects an external block with a missing or blank label, a role other than `specific`, no marker array, or a marker that is blank or not a string | The contract test file has one failing case per rule plus a passing valid block, and the CI-form run of the check passes on the tree |
| REQ-002 | No P0 check that `sk-code-quality` loads for a public `.js` target contradicts the SKILLED camelCase naming rule | No overlay check requires snake_case JavaScript variables or functions, and every naming check that stays is P1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both private skills declare a specific block that ranks them ahead of SKILLED | The detection scripts print WEBFLOW then SKILLED, and OBSIDIAN then SKILLED, for a mixed request, and a hub-only path still prints SKILLED alone |
| REQ-004 | Each allowlist entry left in `check-comment-hygiene.sh` decides at least one verdict | The checker's tests pass, and this phase records the evidence for each entry kept or removed |
| REQ-005 | Every doc that described the old behaviour states the new one | A search for the old sentences returns nothing, and `validate_document.py` prints VALID for each edited doc |
| REQ-006 | No SKILLED language checklist lists a naming item under P0 | Each naming item sits in its checklist's P1 section, and `check-rule-copies.test.sh` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` exits 0 with the new cases
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills --recursive --strict` prints `RESULT: PASSED` for all nine folders
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's delegation of 2026-10-25 | The operator could reject a decision at the end | Each decision is recorded here with its evidence, and each is one revert away |
| Risk | An overlay check the private skill lacks gets deleted | Med | A Webflow check not found in `local-webflow` stays and is reported, never deleted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the gate check a block the operator's private skills declare? Decision: no change. The gate skips every `local-*` folder and every symlinked folder by design, so the rules protect skills an adopting repository adds.
- Should the public overlay keep the Webflow house style? Decision: no, under the operator's delegation. The hub's only public surface is SKILLED, whose JavaScript rule is camelCase, and the Webflow rules already live in `local-webflow`.
<!-- /ANCHOR:questions -->

---
