---
title: "Feature Specification: CLI package residue removal"
description: "Remove every dead module, orphan test and stale record the CLI runtime research lane confirmed, correct the package's self-descriptions and the validation story, unify the phase-child regex, and give the CLI check gate and test suites a CI runner."
trigger_phrases:
  - "cli package residue removal"
  - "coverage graph cluster removal"
  - "spec kit check workflow"
  - "phase child regex unification"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI package residue removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 002-cli-runtime-utilization |
| **Successor** | None |
| **Handoff Criteria** | Every row of `002-cli-runtime-utilization/research/confirmed-findings.md` is removed, corrected or carries a recorded decision, and the CLI gates pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the spec-kit simplification research program.

**Scope Boundary**: the `@spec-kit/cli` package under `runtime/cli/`, its READMEs, the skill's ARCHITECTURE and README, the two plan command contracts, the implement command contract, the deep-research playbook scenario that named a removed module, the sk-code conventions tree, the sk-doc code-folder fixtures, and one new GitHub workflow.

**Dependencies**:
- `002-cli-runtime-utilization/research/confirmed-findings.md`, the reproduced ledger this phase closes

**Deliverables**:
- Forty-six dead files gone: seven scan leftovers, two continuity helpers and their orphan test, the kpi folder, an unsourced setup helper, three research harnesses, a doctor script, two one-time migrations, a ranking CLI, a router check, the dead scorer and its two tests, the renderers module, two registries, the five-module coverage-graph cluster with nine tests, four ops stubs, and a test that could not run
- One package description in three documents, a validation story that names the orchestrator hop and the 39 registered rules, a save contract key that no longer promises indexing
- One phase-child regex in every document, comment and code site
- A `spec-kit-check` workflow that runs the CLI check gate, typecheck, the shared tests, the CLI vitest project and the five mirror checks

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI package carried around thirty files that nothing called: modules whose only importers were tests written to explain them, a registry that disagreed with the tree and was read by nobody, a coverage-graph engine duplicated from another skill and patrolled by nine tests, and healers that reported their own absence. Its three self-descriptions named three different packages, its validation story said twenty rules where the registry dispatches thirty-nine, and the check gate that blocks reverse imports ran in nobody's CI.

### Purpose
The package holds only what a command, hook, doctor, workflow or live test reaches, and every document that describes it says the same thing the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove every confirmed dead file and the tests, fixtures, tree listings and README rows that named them
- Correct the package description, the CLI README overview, ARCHITECTURE and the rules README
- Rename the save contract key and unify the phase-child regex
- Rewrite the ops README around the two helpers that remain
- Repoint the deep-research playbook scenario at the command contract
- Add the `spec-kit-check` workflow

### Out of Scope
- Merging the save-path phase-parent copy into the engine - it recognises derived children and hardened membership, which the engine does not
- Wiring the resource-map extractor into the deep commands - decided with lane 004
- The failing manifest test that reads another session's live packet - not this program's to touch

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/` (46 files) | Delete | The confirmed dead set; the full list is in `implementation-summary.md` |
| `runtime/cli/package.json`, `runtime/cli/README.md`, `ARCHITECTURE.md` | Modify | One package description; corrected validation story and parity row |
| `runtime/cli/rules/README.md` | Modify | The dispatch hop named once |
| `runtime/cli/{continuity,lib,ops,setup,evals,spec,types,loaders,extractors,config}/README.md` | Modify | Rows and trees for removed members |
| `runtime/cli/tsconfig.json`, `runtime/cli/config/index.ts` | Modify | Renderers include and comment |
| `runtime/cli/tests/{task-enrichment,description-enrichment,quality-scorer-calibration}.vitest.ts`, `tests/test-scripts-modules.js` | Modify | Mocks, blocks and sections for removed modules |
| `runtime/cli/spec/check-placeholders.sh`, `rules/check-placeholders.sh`, `rules/check-comment-hygiene.sh` | Modify | Headers naming the sibling lane |
| `runtime/lib/{MODULE-MAP.md,spec/is-phase-parent.ts,resume/resume-ladder.ts}`, `runtime/cli/{lib/shell-common.sh,rules/check-folder-naming.sh,spec/validate.sh}`, `assets/template-mapping.md`, `references/{validation/validation-rules,structure/phase-definitions}.md` | Modify | The enforced regex everywhere |
| `.opencode/commands/speckit/assets/speckit-{plan-auto,plan-confirm,implement-auto}.yaml` | Modify | `post_save_write`; the detection-rule note |
| `README.md`, `.opencode/skills/system-spec-kit/README.md`, `feature-catalog/tooling-and-scripts/*.md` | Modify | Rows for removed members |
| `.opencode/skills/sk-code/.../directory-and-test-conventions.md`, `.opencode/skills/sk-doc/scripts/tests/code-folder/*.json` | Modify | Tree and fixture rows for removed folders |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md` | Modify | Scenario repointed at the command contract |
| `.github/workflows/spec-kit-check.yml` | Create | The CI runner for the check gate, typecheck, tests and mirror checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No removed file is named by any document, test, fixture or import outside `specs/`, changelogs and benchmark reports |
| REQ-002 | The CLI package rebuilds clean and `npm run check` passes, including the source-to-dist alignment check |
| REQ-003 | The CLI vitest project passes except the one test that reads another session's live packet |
| REQ-004 | The documented phase-child regex equals the enforced one in every site |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `package.json`, the CLI README and ARCHITECTURE describe the same package |
| REQ-006 | ARCHITECTURE names the registered rule count and the orchestrator hop |
| REQ-007 | A workflow runs the CLI check gate, typecheck, the shared tests, the CLI vitest project and the five mirror checks on pull requests |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A residue search for every removed name returns nothing outside specs, changelogs, benchmark reports and generated fixtures
- **SC-002**: The legacy module suite prints all tests passed with the removed sections gone
- **SC-003**: The staged diff carries only this phase's hunks; the other session's punctuation sweep stays in the working tree
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another session's uncommitted README sweep touched files this phase edits | A pathspec commit would carry their hunks | Every edit was re-applied onto HEAD copies and staged by object id, so the index holds only this phase's hunks |
| Risk | A dynamic string-built import of a removed module | Would fail at first use | The census covered every file type; the lineage flagged the same bound; the CLI vitest project and legacy suites ran green after removal |
| Risk | Tightening the folder-name regex rejects an existing folder | A packet named with a leading hyphen after its number would fail validation | No such folder exists under `specs/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The CLI vitest project stays under five minutes so the workflow can run it on every pull request
- **NFR-P02**: The workflow builds every package once and reuses the outputs across steps

### Security
- **NFR-S01**: The workflow has read-only contents permission
- **NFR-S02**: No removed file held a credential or a secret path

### Reliability
- **NFR-R01**: The source-to-dist alignment check fails on the next orphaned dist file
- **NFR-R02**: Every gate result was read from command output, not inferred from an exit code alone
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a manifest with zero entries still validates against the stricter regex, since the loop never runs
- Maximum length: not applicable
- Invalid format: a folder named `001--x` now fails folder naming everywhere instead of only in phase detection

### Error Scenarios
- External service failure: none; every gate reads local files
- Network timeout: not applicable
- Concurrent access: the other session's sweep and this phase touched the same READMEs; staging by object id kept them apart

### State Transitions
- Partial completion: the removals and the doc corrections are one commit, so no state exists where a README names a file that is gone
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Ninety-three files, mostly deletions |
| Risk | 9/25 | Dead code by census; one regex tightened; one CI workflow |
| Research | 4/20 | Findings arrived reproduced |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Both carried questions live in the research lane's confirmed-findings document with the decision taken here.
<!-- /ANCHOR:questions -->
