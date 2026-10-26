---
title: "Feature Specification: Phase 4: doctrine"
description: "Amends the sk-code doctrine so an UNKNOWN surface gets the universal floor and the quality runner's built-in checks, and so the SKILLED house checklist loads only for SKILLED."
trigger_phrases:
  - "phase 4 doctrine"
  - "unknown surface iron law"
  - "skilled house checklist"
  - "sk-code shared doctrine amendment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 4: doctrine

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-config-and-doctor |
| **Successor** | 005-consumers-and-routing |
| **Handoff Criteria** | Iron Law 3, the UNKNOWN rows, the SKILLED house checklist and the three handoff lines are amended. The review-severity column is confirmed by sk-code-review. The strict validator, the document validator and the four drift guards pass. Every changed package has a version bump and a changelog entry. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Make sk-code-quality a codebase-agnostic, executable author gate specification.

**Scope Boundary**: The shared doctrine text, the SKILLED house checklist, the checklist lines that name an operator-private skill, the handoff lines and the version and changelog work for each changed package. The runner, the config file and the loading table belong to phases 002 and 003. The `@code` step, review routing and aliases belong to phase 005.

**Dependencies**:
- **001-honest-checker**: Phase 001 edits the spec-root rows of `universal-checklist.md` at lines 89 and 114. This phase retitles the same file, so it starts from the 001 result.
- **002-builtin-runner**: This phase names the runner `scripts/quality-gate.cjs`, its gate values (`NO_BLOCKER_FOUND`, `BLOCKED`, `NOTHING_CHECKED`, `UNVERIFIED` and `ERROR`), the envelope fields `checker_outputs`, `unverified` and `PENDING_AGENT_JUDGMENT`, and the built-in checks that the amended Iron Law 3 grants to UNKNOWN. The loading table in `sk-code-quality/SKILL.md` changes in phase 002, not here.
- **003-config-and-doctor**: The amended Iron Law 3 names the committed config `.sk-code/quality.json`. Phase 003 owns that name and its init route.
- **Outside the phase chain**: `sk-code-review` confirms the review-severity column before this phase closes (ADR-003).

**Deliverables**:
- Amended Iron Law 3 and UNKNOWN rows in the shared doctrine.
- A universal floor definition, a mechanical floor and a review-severity column in `code-quality-standards.md`.
- `universal-checklist.md` as the SKILLED house checklist.
- Handoff lines amended in the implement, debug and verify workflow references, six lines in total.
- Version bumps and changelog entries for each changed package, plus the packet changelog entry.

**Changelog**:
- At landing, write `changelog-015-004-doctrine.md` in `specs/sk-code/015-quality-agnostic-gate/changelog/`. The name uses the parent packet number plus this phase folder name. Task T020 owns it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Iron Law 2 makes the Phase 1.5 quality gate mandatory. Iron Law 3 forbids any standard on an UNKNOWN surface (`phase-detection.md` lines 108 and 109). A repository with no declared surface therefore cannot pass the gate, because the gate is required and every standard is forbidden. The SKILLED checklist `universal-checklist.md` also says it applies to all code files. Its header and spec-root rules then reach foreign repositories, and two checklist lines name an operator-private skill.

### Purpose
Give an UNKNOWN surface the universal floor and the runner's built-in checks, so the gate can complete there. Keep SKILLED's house rules off other repositories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Amend Iron Law 3 in `phase-detection.md`, and the UNKNOWN rows in `stack-detection.md` and `code-quality-standards.md`.
- Add the universal floor definition, the mechanical floor, the restraint citation and the review-severity column to `code-quality-standards.md`.
- Retitle `universal-checklist.md` as the SKILLED house checklist, loaded only when SKILLED resolves for the target.
- Remove the operator-private skill id from three checklist lines, and move CHK-CSS-09 to P2.
- Point the verification template, the style guide and the P0 table at the runner values and the standards.
- Name the runner in the implement and debug handoffs, and name the envelope read in the verify handoff.
- Bump versions and write changelog entries for each changed package.

### Out of Scope
- The runner, its gate values and its envelope grammar. Phase 002 owns them.
- The config file, its init route and its template. Phase 003 owns them.
- The loading table in `sk-code-quality/SKILL.md` that makes the house checklist conditional. Phase 002 owns it.
- The two P0 rows in `sk-code-quality/SKILL.md` that become UNVERIFIED. Phase 002 owns them, because UNVERIFIED is a runner state.
- The `@code` step, the review trigger, aliases, `ROUTER.md` and advisor vocabulary. Phase 005 owns them.
- Any change to review's severity ids or definitions in `review-core.md`. Review confirms the column only.
- The seven other tracked files that name the operator-private id. All seven are tests or fixtures outside this phase, and they appear in the open questions.
- Any change to CI or pre-commit scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modify | Iron Law 3 at line 109 takes the amended text. Version bump. |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | UNKNOWN row at line 32 and order step 4 at line 49 take the amended rule. Version bump. |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Restraint citation at line 57, universal floor definition, mechanical floor, review-severity column in sections 3 to 5, UNKNOWN row at line 122 and workflow step 2 at lines 131 to 140. Version bump. |
| `.skilled/skills/sk-code/shared/references/workflow-verify.md` | Modify | Line 55 states that the quality config never supplies verification commands. Line 56 reads the envelope fields and the hand-back rule. Version bump. |
| `.skilled/skills/sk-code/shared/references/workflow-implement.md` | Modify | Lines 41 and 119 name the runner in the handoff. Version bump. |
| `.skilled/skills/sk-code/shared/references/workflow-debug.md` | Modify | Lines 41 and 147 name the runner in the handoff. Version bump. |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | Retitled as the SKILLED house checklist at lines 2, 3, 5, 6, 14 and 16. Version bump. |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` | Modify | Lines 37 and 57 name an operator-private Webflow surface skill. CHK-CSS-09 at line 65 moves to P2. Version bump. |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` | Modify | Line 40 names an operator-private Webflow surface skill. Version bump. |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` | Modify | Gate Result lines 53 and 76 take the runner gate values. Version bump. |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modify | Neutral pointers at lines 40 and 105. Version bump. |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | The P0 table gains a link to standards section 3 at lines 190 to 196. ESCALATE IF item 1 at line 254 takes the UNKNOWN rule. Version bump. |
| `.skilled/skills/sk-code/SKILL.md`, `hub-router.json`, `mode-registry.json`, `description.json` | Modify | Hub version bump, one value in each file. |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | Version bump. |
| `.skilled/skills/sk-code/changelog/`, `sk-code-quality/changelog/`, `sk-code-skilled/changelog/` | Create | One changelog file per package at landing. Released entries stay unchanged. |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-004-doctrine.md` | Create | Packet changelog entry. It sits outside this folder and is written at landing. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Iron Law 3 in `phase-detection.md` names the universal floor, the runner's built-in checks and `.sk-code/quality.json`. No other standard or verification command applies to an UNKNOWN surface. |
| REQ-002 | The UNKNOWN row (`stack-detection.md` line 32) and order step 4 (line 49) take the same rule. No reader keeps the older "any standard" wording. |
| REQ-003 | The UNKNOWN row in `code-quality-standards.md` (line 122) names the universal floor and the built-in checks. The restraint citation at line 57 cites the repository's `AGENTS.md` and `.skilled/repo-rules/` when present. |
| REQ-004 | `code-quality-standards.md` defines the universal floor as sections 3 to 5. It adds a mechanical floor for parse failure, merge-conflict markers and credential signatures that applies on every surface. A parse finding in plain JavaScript stays heuristic and does not block. |
| REQ-005 | `universal-checklist.md` is the SKILLED house checklist. Its title, description and intro say so, and the intro names the condition that SKILLED resolves for the target. |
| REQ-006 | No file in `sk-code-quality/assets/code-quality-checklist/` names an operator-private skill id. Lines 37 and 57 of the naming file and line 40 of the overview file name an operator-private Webflow surface skill instead. |
| REQ-007 | CHK-CSS-09 in `naming-init-formatting-and-css.md` is P2. |
| REQ-008 | Every changed package has a version bump and a changelog entry. No released changelog entry changes. |
| REQ-009 | The packet passes `validate.sh --strict`. Every changed Markdown file passes `validate_document.py`. The four drift guards pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The review-severity column in sections 3 to 5 of `code-quality-standards.md` maps each rule onto the severity ids in `review-core.md` section 2. `sk-code-review` confirms each row, and each changed row is recorded in ADR-003. |
| REQ-011 | Lines 53 and 76 of the verification template take the runner gate values. Lines 40 and 105 of the style guide use neutral pointers. |
| REQ-012 | The P0 table in `sk-code-quality/SKILL.md` (lines 190 to 196) links to standards section 3. ESCALATE IF item 1 (line 254) no longer escalates on an UNKNOWN surface. It escalates when a required P0 check is UNVERIFIED and only the operator can name or install its tool. |
| REQ-013 | `workflow-implement.md` (lines 41 and 119) and `workflow-debug.md` (lines 41 and 147) name `quality-gate.cjs` in the handoff. `workflow-verify.md` line 55 states that the quality config supplies no verification commands. Line 56 reads the runner envelope fields and states the hand-back rule. |
| REQ-014 | Workflow step 2 of `code-quality-standards.md` (lines 131 to 140) runs the runner before commit. The hygiene check stays as one of its sensors. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each grep in the acceptance rows for REQ-001 to REQ-007 prints the expected line at the expected line number.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/004-doctrine --strict --no-recursive` prints `RESULT: PASSED` as its last line.
- **SC-003**: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and its last line reads `run-all-drift-guards: all 4 guards PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 runner names and gate values | Handoff and verify lines name fields that do not exist yet | Land this phase after 002. Check each name against `runner-contract.md` before T016 and T017 |
| Dependency | Phase 003 config name `.sk-code/quality.json` | Iron Law 3 names a file that does not exist yet | Land after 003. Take the name from the landed phase 003 decision record |
| Dependency | `sk-code-review` confirmation of the review-severity column | The column stays unconfirmed, so the review reader cannot rely on it | Ask review at landing. Record each changed row in ADR-003 |
| Risk | Iron Law 3 read as licence for surface standards on UNKNOWN | An UNKNOWN repository gets SKILLED or other stack standards | The text names the floor and the committed config only. AC-001 checks the exact sentence |
| Risk | The mechanical floor read as blocking for plain JavaScript | Heuristic parse findings block foreign JavaScript | The floor text marks the plain JavaScript parse finding as heuristic. AC-004 checks it |
| Risk | The operator-private id stays in seven other tracked files | The rule that no tracked file names a private skill stays broken | Recorded in the open questions with the program owner as the decision maker |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The phase changes Markdown and JSON metadata only. No code path runs in it.
- **NFR-P02**: N/A. The phase adds no runtime path, so no response time changes.

### Security
- **NFR-S01**: N/A. The phase adds no authentication or credential path.
- **NFR-S02**: The changed doctrine names no credential value and no operator-private skill id. AC-006 checks the id, and the signature grep in T023 prints nothing.

### Reliability
- **NFR-R01**: N/A. The phase runs no service.
- **NFR-R02**: The Iron Law and the UNKNOWN rows land in one change set. A partial landing makes the doctrine contradict itself, and AC-001 and AC-002 show the same state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: a repository with no `.skilled/` tree, no declared surface and no config. The mode reads UNKNOWN, applies the floor and the built-in checks, and asks for the surface and its commands. It applies no SKILLED standard.
- Maximum length: Iron Law 3 stays one heading and two sentences, so the law reads at a glance.
- Invalid format: a checklist line that names an operator-private skill id fails AC-006. A review-severity table without its column fails AC-011.

### Error Scenarios
- External service failure: N/A. The phase calls no service.
- Network timeout: N/A. The phase makes no network call.
- Concurrent access: another phase edits the same shared reference first. Rebase on the landed head and rerun T001 before any edit.

### State Transitions
- Partial completion: Iron Law 3 changes without the UNKNOWN rows. The doctrine then contradicts itself, so both land in one change set.
- Session expiry: N/A. The phase keeps no session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 15 files in five packages, four changelog files and the hub metadata. No code |
| Risk | 14/25 | Iron Law 3 changes what every UNKNOWN repository receives. The review column needs review confirmation |
| Research | 8/20 | The design answered the open questions. Landing still needs a recheck of the cited lines and review's confirmation |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Operator confirmation of ADR-001 (Iron Law 3) and ADR-002 (SKILLED house checklist) at program end. Both are accepted for this build, and neither blocks this packet.
- Should the seven tracked files outside this phase that name the operator-private id stay as they are? All seven are tests or fixtures, and several look like tests of private-skill containment. The program owner decides, and the decision does not block this phase.
- Do the `sk-code-review` confirmations of the review-severity column match the rows as written? This is open until task T021 is done.
<!-- /ANCHOR:questions -->

---

