---
title: "Feature Specification: Phase 4: catalog-and-playbook"
description: "The inventory and the test plan for the cli-jev transport: a feature catalog with implementation anchors and a 22-scenario manual testing playbook whose scenarios a shell can execute without a credential."
trigger_phrases:
  - "cli-jev feature catalog"
  - "cli-jev playbook"
  - "transport feature inventory"
  - "jev validation scenarios"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: catalog-and-playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/004-catalog-and-playbook` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-hub-mode-registration |
| **Successor** | 005-docs-governance-and-closeout |
| **Handoff Criteria** | The catalog names a file for every feature it lists and a deliberate-absence list for what the mode is not; the playbook's package validator reports 22 scenarios across 5 categories with 0 violations; every executed scenario records its evidence and every unexecuted one names its blocker |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract specification.

**Scope Boundary**: The inventory and the operator test plan. No behavior, registration or routing change; those belong to phases 002 and 003.

**Dependencies**:
- Phase 001's live pin, which supplies the recorded evidence for the scenarios.
- Phase 002's packet, whose rules and references the catalog anchors.
- Phase 003's registration, so every anchor the catalog cites already exists on disk.

**Deliverables**:
- `feature-catalog/` with a root index, four category files and implementation anchors, built with `sk-create-feature-catalog`.
- `manual-testing-playbook/` with a root and 22 scenario files, one per scenario across five categories, built with `sk-create-manual-testing-playbook`.
- The run report under `benchmark/reports/` recording which scenarios were executed and which are skipped.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A transport mode is invisible until something goes wrong. The judgment that comes back has no file to inspect, the exit code that means "not billed" looks like an ordinary failure, and the guard that refuses a command the CLI would happily send never announces itself. Without an inventory, a reader cannot tell which surfaces exist; without a test plan, an upgrade silently changes an answer shape and nobody notices.

### Purpose
Produce both: a catalog naming what exists and what deliberately does not, and a playbook whose every scenario is built around something a shell can observe — an exit status, a stdout string, a JSON field, or a test-suite verdict — so it is usable without a provider key.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The catalog root plus four category files: transport classification, judgment primitives, dispatch guards and surfaces.
- The playbook root plus 22 scenario files: four invocation, eleven exit-code, three dispatch-guard, three provider and one MCP scenario.
- Execution of every scenario the phase-001 pin left executable, with its evidence recorded, and honest skips for the two that need a credential.
- The run report with verdicts, raw evidence paths and a delta statement.

### Out of Scope
- Any code, registration or routing change.
- A live judgment call; no provider credential existed at phase close, so the two authenticated scenarios were recorded as SKIP with the blocker named and were closed later by the authenticated verification.
- Retrofitting the catalog or the playbook into a validation gate of their own; the package validators are the gates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-jev/feature-catalog/feature-catalog.md` | Create | Root index with the category table and the deliberate-absence list |
| `cli-jev/feature-catalog/{transport-classification,judgment-primitives,dispatch-guards,surfaces}/**` | Create | Four category files with implementation anchors |
| `cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Create | Playbook root: execution policy, evidence rules, the 22-entry index, triage |
| `cli-jev/manual-testing-playbook/{cli-invocation,exit-codes,dispatch-guards,providers,mcp-server}/*.md` | Create | One file per scenario, each carrying its contract table and recorded result |
| `cli-jev/benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md` | Create | The run record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog names the file that implements every feature it lists, and lists what the mode deliberately is not | Each entry resolves to a file that exists; the absence list names the executor kind, the MCP registration and the write capability |
| REQ-002 | Every scenario states a command and an observable a shell can check, and the playbook package validator passes | `validate-playbook-package.cjs --package cli-external-orchestration/cli-jev` → `PASS`, 22 scenarios, 5 categories, 0 violations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Executed scenarios record their evidence and skipped ones name their blocker as a skip rather than being reformulated into something that passes | The run report's tally matches the scenario files: 20 executed, 2 skipped |
| REQ-004 | The guard and cardinality claims cite a passing suite test rather than a remembered result | Both dispatch suites pass and the run report names them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can find the implementation of every documented feature by opening the file the catalog names.
- **SC-002**: An operator can run the playbook without a provider key and get verdicts for 20 of 22 scenarios.
- **SC-003**: Both package validators pass for the packet, at 0 violations.
- **SC-004**: The two scenarios that cannot be run say so, with the exact variables that would close them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scenario written around an observable that only exists behind a credential | Coverage that reads as complete but is not | Those scenarios are recorded as SKIP with the blocker named, never reformulated into a weaker check |
| Risk | The catalog written before the anchors resolve | A document that looks verified and is not | Anchors were written after the registration landed and every cited path was checked |
| Dependency | Phase 001's pin | The exit-code scenarios would have no evidence | The matrix transcripts are cited directly rather than re-run |
| Dependency | The per-scenario package contract | The playbook would fail its validator | The playbook was restructured to one file per scenario, then the validator re-run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **The two authenticated scenarios.** JEV-021's authenticated half and JEV-022 in full needed one stored credential. Neither was a pass and neither was dropped; the run report records them as skips with the variable names that would close them, and the authenticated verification later closed both with an operator-stored `official` key.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The playbook's scenarios run in seconds; the only slow member is the MCP handshake probe, which starts and kills a server.

### Security
- **NFR-S01**: No scenario requires a credential value in a command line, and one scenario exists solely to prove the value never reaches a stream.

### Reliability
- **NFR-R01**: Every scenario's observable is a shell-visible fact, not an inference from source.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8b. EDGE CASES

### Data Boundaries
- A scenario whose command needs state: each names the exact state form it uses, inline or `@file`.
- A scenario whose observable requires a credential: recorded as SKIP, never as an inferred pass.

### Error Scenarios
- External service failure: covered deliberately — the transport negative control is a refused connection.
- Network timeout: not exercised; no authenticated call is made in this phase.
- Concurrent access: not applicable to a read-only judgment.

### State Transitions
- Partial completion: the run report's tally was reconciled against the scenario files after a counting slip was found, rather than left standing.
- Session expiry: every result is in the report, not only in the transcript.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two document trees, 28 files at the end |
| Risk | 5/25 | Docs only; the risk is a false completeness claim, handled by the skip discipline |
| Research | 3/20 | The facts came from phase 001 |
| **Total** | **18/25** | **Level 2** |

The scorer's Level 2 matches the scaffolded level, so no upgrade applied here.
<!-- /ANCHOR:complexity -->
