---
title: "Feature Specification: Phase 7: playbook-catalog-readme-alignment"
description: "Add eight manual playbook scenarios and four feature catalog entries for the placeholder gate, the section fill guidance, the example drift guard and the authoring card, then align the READMEs and four reference files with that behavior."
trigger_phrases:
  - "playbook catalog readme alignment"
  - "phase 7 playbook catalog readme alignment"
  - "template authoring manual scenarios"
  - "authoring card documentation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 7: playbook-catalog-readme-alignment

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phases 2 to 6 change the templates, the placeholder gate and the authoring path. The documentation still describes the old rules, so a weak model reads a stale instruction even after the code improves. This phase adds eight manual playbook scenarios for the new behavior, four feature catalog entries and the edits that make six existing docs say the same thing. It changes no logic file.

**Key Decisions**: eight scenarios in one new playbook category, four catalog leaves rather than one combined page, and verification of the phase 3 reference edits instead of a second write.

**Critical Dependencies**: the launch preconditions in `../spec.md` section 3, and phases 2 to 6 closed so the card and the two guard scripts exist.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-speckit-command-and-agent-alignment |
| **Successor** | 008-playbook-run-in-worktree |
| **Handoff Criteria** | Eight scenario files exist and the playbook validator prints `violations=0`, four catalog leaves exist with matching root entries, six docs are aligned, and phase 8 has the eight scenario paths |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Documentation only, under `.skilled/skills/system-spec-kit/`. Writes land in the manual testing playbook, the feature catalog, two READMEs and four reference files. No template, validator, runtime source, command or agent file changes.

**Dependencies**:
- Phase 2 closed, so the example descriptions the drift guard checks are repaired.
- Phase 3 closed, so the v2.3 stamp, the value token and the Draft lifecycle exist.
- Phase 4 closed, so `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` exists.
- Phase 5 closed, so `references/workflows/spec-authoring-card.md` and `runtime/cli/spec/check-card-sync.sh` exist.
- Phase 6 closed, so the command and agent surface names the card and the guards.
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.

**Deliverables**:
- Eight scenario files under `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/`, IDs 476 to 483.
- One new Section 7.9 in `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`.
- Four catalog leaves under `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/` and four matching root entries.
- Six aligned docs: the two READMEs and four reference files.
- `scratch/validation/docs.txt`, `scratch/validation/hygiene.txt`, `scratch/validation/playbook.txt` and `scratch/validation/catalog.txt`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh v2.3 scaffold carries value tokens and a Draft warning. The authoring intents load a short card. Two read-only guards hold the examples and the card in place. None of that appears in the manual playbook, the feature catalog or the READMEs. A reader still finds the `PLACEHOLDER` marker in the validation reference and no entry for any of the four new surfaces. Phase 8 cannot run a scenario that does not exist.

### Purpose
Every behavior phases 2 to 5 create has one operator scenario, one catalog entry and one aligned paragraph in each doc that describes it, so a weak model reads the same rule wherever it looks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Eight manual playbook scenarios, IDs 476 to 483, in a new `template-authoring/` category.
- Four feature catalog leaves with one root entry each.
- Five edits to `.skilled/skills/system-spec-kit/README.md` and two to `templates/README.md`.
- Two edits to `references/validation/validation-rules.md`, two to `references/validation/path-scoped-rules.md`, two to `references/templates/template-style-guide.md` and one to `references/workflows/quick-reference.md`.
- Verification of the phase 3 edits in `references/templates/template-guide.md` and the lifecycle section of `validation-rules.md`.
- One read-only frontier review of the diff before the phase closes.

### Out of Scope
- Any change to a template, a validator, a guard script, a command or an agent. Phases 2 to 6 own those.
- Running the eight scenarios. Phase 8 owns the run and its report.
- Re-editing the five `PLACEHOLDER` lines in `template-guide.md`. Phase 3 owns them, and this phase verifies them.
- A benchmark of authoring quality. Phase 9 owns that comparison.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Add the category bullet and Section 7.9 with eight rows |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md` | Create | Scenario 476 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md` | Create | Scenario 477 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md` | Create | Scenario 478 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md` | Create | Scenario 479 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md` | Create | Scenario 480 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-router-intents.md` | Create | Scenario 481 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` | Create | Scenario 482 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` | Create | Scenario 483 |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | Add four H3 entries under Section 2 |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md` | Create | Catalog leaf |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md` | Create | Catalog leaf |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/example-drift-guard.md` | Create | Catalog leaf |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md` | Create | Catalog leaf |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Five places: authoring row, Quick Fixes, upgrade answer, script table, related docs |
| `.skilled/skills/system-spec-kit/templates/README.md` | Modify | Two places: current state and Section 8 validation |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Rule summary row and Section 4 severity line |
| `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md` | Modify | Rule table row and placeholder pattern list |
| `.skilled/skills/system-spec-kit/references/templates/template-style-guide.md` | Modify | Placeholder section note and Section 8 rule rows |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Name the card in Related Resources |
| `tasks.md`, `goal.md`, `implementation-summary.md`, `acceptance-criteria.md` | Modify | Progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Eight scenario files exist under `template-authoring/`, each has the five sections in order, one `Provenance` line and a unique `id`, and the playbook package validator prints `violations=0`. |
| REQ-002 | The playbook root index lists each of the eight IDs exactly once, links each file, and names the catalog entry that owns the behavior. |
| REQ-003 | Four catalog leaves exist under `feature-catalog/tooling-and-scripts/`, each has the four sections, and each root H3 title and description matches its leaf word for word. |
| REQ-004 | The catalog package validator prints `PASS: 0 violations`. |
| REQ-005 | `README.md` names the value token, the authoring card and the two guard scripts, and holds no `PLACEHOLDER` instruction. |
| REQ-006 | `templates/README.md` states the v2.3 token rule and the fill line, and its Section 8 holds the three literal checks with their expected output. |
| REQ-007 | `validation-rules.md`, `path-scoped-rules.md`, `template-style-guide.md` and `quick-reference.md` describe the current behavior, and `template-guide.md` holds the phase 3 text. |
| REQ-008 | `validate_document.py` prints `VALID` for every edited document and every new catalog leaf named in `tasks.md` T011. |
| REQ-009 | `playbook-provenance-paths.vitest.ts` prints `Tests  3 passed (3)` and `workflow-invariance.vitest.ts` prints `Tests  2 passed (2)`. |
| REQ-010 | The spec-kit suite at phase close matches `scratch/baseline/suite-start.txt` on the `Test Files`, `Tests` and `exit=` lines, exits 0 as phase 001's `../001-template-drift-census-and-baseline/scratch/baseline/suite-start.txt` did and records its cumulative delta against phase 001. |
| REQ-011 | No file outside the file table in section 3 and this phase folder differs from the start commit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-012 | A read-only frontier review of the diff ran, and each finding it raised is either applied or recorded in `goal.md` section 4 with the reason it was not. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can run any new scenario from its file alone, without reading this phase folder.
- **SC-002**: A reader who searches the catalog for the placeholder rule, the fill line, the drift guard or the card finds one leaf for each.
- **SC-003**: A reader of either README learns the token rule, the card and the two guards without opening a phase packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 4 and 5 create the guards and the card | Three scenarios have nothing to run | T001 tests each path and stops the phase when one is missing |
| Dependency | Phase 3 owns the reference edits | A second write misses or duplicates | T006 verifies the phase 3 text and edits only the rows phase 3 leaves |
| Risk | A scenario command drifts from the real script | Phase 8 runs a command that no longer works | Every command is literal, and T009 plus T013 read the file it names |
| Risk | A catalog title or description differs between root and leaf | The catalog validator fails | The plan gives one text for both, and T010 checks parity |
| Risk | A new scenario file uses a word the vocabulary test rejects | The suite fails | T013 counts the four words and the em dash across every new file |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Seven scenarios finish under 10 minutes each, and scenario 483 finishes under 20 minutes because it spends one model run.

### Security
- **NFR-S01**: Briefs carry no credential, token or key. A Task subagent inherits the session model, so the brief never carries a provider login.

### Reliability
- **NFR-R01**: Each scenario removes the track it creates, so a second run starts from the same tree and prints the same lines.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lane that finds its target file already present reports the path and stops. It does not overwrite the file.
- Maximum length: a scenario block that would exceed 400 lines is split into one step per command list, not into a shorter command.

### Error Scenarios
- External service failure: a provider error in scenario 483 is a `FAIL` with the provider line, not a retry loop.
- Network timeout: handled as in NFR-P01, with the run recorded and the track removed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 24 written, 0 changed outside the declared surface. Systems: playbook, catalog, README, references |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 10/20 | Six phase docs, six target docs and three sk-doc contracts read before writing |
| Multi-Agent | 10/15 | Workstreams: 3 lanes, 1 review |
| Coordination | 6/15 | Dependencies: five predecessor phases |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A scenario runs a command the real script rejects | M | M | T009 and T013 read every named path, and phase 8 runs each scenario before closeout |
| R-002 | A catalog leaf and its root entry disagree | M | M | One text in `plan.md` section 3.10, and the catalog validator checks parity |
| R-003 | A new file uses a word the vocabulary test rejects | M | L | T013 scans every new file before the suite runs |

---

## 11. USER STORIES

### US-001: One scenario, one run (Priority: P0)

**As a** phase 8 conductor, **I want** each new behavior as one scenario with literal commands and a PASS or FAIL line, **so that** I can run the set without inventing a fixture or a check.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: One place to find the rule (Priority: P0)

**As a** weak authoring model, **I want** the placeholder rule, the fill line, the guard and the card in the catalog and the README, **so that** I find the same rule without reading a phase packet.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1.
- A phase 3 edit that a verify command cannot find is recorded in `goal.md` section 4 and blocks the task. This phase does not repair it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---

