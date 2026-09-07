---
title: "Feature Specification: Command surface contract realignment"
description: "Bring the /speckit:* workflow assets, the validator's help printer and the five confirmed perimeter defects from the overengineering lane back to the system that runs: the retired checklist leaves the command surface, template names become real paths, the printer lists every rule, and the optimizer, fingerprint and fixture residue is stated or removed."
trigger_phrases:
  - "command surface contract realignment"
  - "retired checklist command workflows"
  - "validate help lists every rule"
  - "symbolic template names"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Command surface contract realignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 005-overengineering-simplification |
| **Successor** | 012-pre-existing-test-repair |
| **Handoff Criteria** | Every row of `005-overengineering-simplification/research/confirmed-findings.md` is fixed, documented or carries a recorded decision, and the command assets, the help printer and their tests agree with the level contract |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the spec-kit simplification research program.

**Scope Boundary**: the eight `/speckit:*` workflow assets, their four presentation assets, the command README and two command documents; the validator's help printer; the skill README's rule count; the freshness clause in the validation reference; the optimizer README; the resource-map README; one golden fixture and one drift-test comment.

**Dependencies**:
- `005-overengineering-simplification/research/confirmed-findings.md`, the censused ledger this phase closes
- `010-template-contract-alignment`, which established the contract the command assets are brought to

**Deliverables**:
- Command workflows that scaffold, verify and report the acceptance-criteria document and the tasks.md verification checklist instead of the retired `checklist.md`, name real template paths, and defer level choice to `recommend-level.sh`
- A help printer that lists every registry category, held by a new test
- The dashboard promise, the strict-only count, the fingerprint definition, the optimizer's adoption and the resource-map link stated as they are
- The readerless flag gone from the golden fixture and the drift-test comment

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The level contract retired `checklist.md` and made `acceptance-criteria.md` the closure document, and child 010 brought the skill's own documents to that contract. The command surface never followed: every `/speckit:*` workflow asset still listed the retired file as required at Level 2, carried a step that loads its template and creates it, a step that verifies it, an inline scaffold for it, and a note that LOC thresholds are soft guidance where the governance document says the scorer decides. The assets also named their templates by a `level_contract_*` convention that resolved to no file. Beside that, the validator's help printer hid six rules, one README counted four strict-only rules where there are three, the completion command promised six dashboards its assets do not hold, no document said what the continuity fingerprint hashes, the optimizer README implied use it has never had, and a retired flag survived in a fixture and a comment.

### Purpose
An agent running any `/speckit:*` command is told to create and verify the documents the contract scaffolds and the validator enforces, and a maintainer reading the printer, the READMEs or the reference finds the count, the promise and the definition that the code carries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The command-surface rewrite listed above, applied by one literal-replacement script that aborts on any site it cannot find
- The help printer change and its test
- The six document corrections and the fixture and comment removal

### Out of Scope
- Collapsing the ten multiplexed registry rows, porting the out-of-process hook adapters, deleting the optimizer, or adding provenance lines to the manual playbook: each carries a recorded decision in the lane's confirmed-findings document
- The novelty default written in the deep-loop skill
- The other session's staged work in this checkout

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/assets/speckit-{complete,implement,plan,resume}-{auto,confirm}.yaml` | Modify | Retired checklist replaced by the acceptance-criteria document and the tasks checklist; real template paths; scorer-led level note; ticket ids dropped from comments |
| `.opencode/commands/speckit/assets/speckit-{complete,plan,implement}-presentation.txt` | Modify | Artifact lines name the closure document |
| `.opencode/commands/speckit/{complete,implement}.md`, `README.txt` | Modify | Presentation boundary, workflow summary, phase-child file list |
| `runtime/cli/spec/validate.sh` | Modify | Help printer derives categories from the registry |
| `runtime/cli/tests/validate-help-lists-every-rule.vitest.ts` | Create | Every rule id and every category appear in `--help` |
| `README.md` (skill), `references/validation/validation-rules.md`, `runtime/cli/optimizer/README.md`, `runtime/cli/resource-map/README.md` | Modify | Strict-only count, fingerprint definition, optimizer adoption, template link |
| `runtime/tests/fixtures/golden-queries.json`, `runtime/tests/env-reference-drift.vitest.ts` | Modify | Readerless flag removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No `/speckit:*` asset names `checklist.md`, a `level_contract_*` symbol or a ticket id, and every workflow asset still parses as YAML |
| REQ-002 | `validate.sh --help` prints every rule id and every category the registry declares, asserted by a test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The completion command's presentation boundary names what the presentation asset holds |
| REQ-004 | The validation reference names the input the continuity fingerprint hashes |
| REQ-005 | The optimizer README states its adoption to date and its remaining consumer |
| REQ-006 | `SPECKIT_BM25_ENGINE` appears in no fixture and no test comment |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The eight workflow assets parse, and a search for the retired names returns nothing in the command surface
- **SC-002**: The new help test, the template parity suite and the env-reference drift guard pass together
- **SC-003**: The sk-doc validator exits zero on every touched document
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A literal replacement misses one asset variant | A workflow keeps instructing the retired document | The script asserts zero residue per asset and across the command directory before it exits |
| Risk | Renaming workflow step keys breaks a reader | A consumer keyed on `step_5_quality_checklist` finds nothing | No code reads the step keys; the search over the skill, the sk-doc scripts and CI found only `check-level-match.sh`, which builds its list from the contract |
| Dependency | Child 010's contract | The assets are brought to a contract that must already be true | 010 is Complete and committed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The help test spawns `validate.sh --help` once and reads a 410-line registry
- **NFR-P02**: The printer's category set is computed once per help call

### Security
- **NFR-S01**: No asset gains a new command; template paths are repository-relative and read-only
- **NFR-S02**: No validation rule became less strict

### Reliability
- **NFR-R01**: A future registry category reaches `--help` without a printer change
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a registry with one category prints one heading
- Maximum length: not applicable
- Invalid format: an unreadable registry still prints the existing fallback line

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: the eight assets, the printer, the test and the documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Twenty-two files, mostly workflow assets and documents |
| Risk | 8/25 | One shell printer change and step-key renames with no code reader |
| Research | 4/20 | Findings arrived censused |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The recorded decisions live in the research lane's confirmed-findings document.
<!-- /ANCHOR:questions -->
