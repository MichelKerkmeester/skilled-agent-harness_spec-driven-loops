---
title: "Feature Specification: Doctor scripts conformance"
description: "The twelve doctor scripts drift from the sk-code OpenCode standards, carry confirmed false-PASS and crash bugs, keep dead code, and seven of them have no test while the five suites that exist never run in CI. This phase fixes each verified finding, adds a test for every script and wires one runner into CI."
trigger_phrases:
  - "doctor scripts conformance"
  - "doctor script tests"
  - "doctor false pass fixes"
  - "doctor scripts dead code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctor scripts conformance

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-doctor-gates-and-drift |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance criterion Met; the doctor test runner passes locally and is wired into CI |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the doctor audit follow-ups. Phases 001 to 003 repaired what the doctor reports; this phase repairs the doctor's own scripts.

**Scope Boundary**: the code under `.skilled/commands/doctor/scripts/`, its tests, the doctor workflow assets and route rows whose wording or exit-code mapping a fix changes, the mutation-class manifest, and one CI step. No new doctor command.

**Dependencies**:
- The sk-code OpenCode standards and checklists for JavaScript, Python and shell.
- `verify_alignment_drift.py`, shellcheck and the TypeScript compiler already in the repo, for objective checks.

**Deliverables**:
- Fixed scripts, each with the standard header and numbered sections.
- A test for every script, and one runner that CI calls.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An audit of the twelve doctor scripts on 2026-10-03 found:
- **Standards drift.** Ten files lack the standard header line (`MODULE:` in JavaScript, `COMPONENT:` in shell and Python), three large JavaScript files have no numbered sections, and `skill-graph-freshness.cjs` has no `'use strict'`.
- **Dead code.** `get_node_major_version`, `BLUE` and the `CONFIG_CHECK_*` variables in `mcp-doctor-lib.sh`, `rec` and several set-but-unread fields in `release-update.cjs`, parser options two subcommands never read, and the `--fix` path in `mcp-doctor.sh` that both MCP workflows forbid.
- **Behaviour bugs.** Four independent reviews, each finding reproduced in scratch fixtures, found false PASS results in the catalog, freshness, parent-skill and mutation-class checks; crashes that exit with the drift code in place of the checker-error code; a bootstrap migration branch that can never run; a missing `flock` read as "busy" with exit 0; and three `release-update` paths that fail on ordinary input.
- **Tests.** Seven scripts have no test, and nothing in CI or any npm script runs the five suites that do exist.

### Purpose
Every doctor script follows the OpenCode standards, does what its workflow says, carries no unreachable code, and is covered by a test that CI runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix each verified finding in the twelve scripts and their existing tests.
- Add tests for the untested scripts and regression tests for every fixed bug.
- Add one test runner and call it from CI.
- Update the doctor workflow assets, route rows and READMEs whose text a fix makes untrue.

### Out of Scope
- New doctor commands or checks beyond what a script's own contract already claims.
- The 313 older `check-goal` findings in other packets; other workstreams own them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/*.cjs`, `*.sh`, `*.py` | Modify | Fixes, headers, sections, dead code removal |
| `.skilled/commands/doctor/scripts/tests/*` | Modify/Create | Regression and coverage tests, test README, runner |
| `.skilled/commands/doctor/assets/*.yaml`, `_routes.yaml` | Modify | Only where a fix changes a flag or exit-code mapping |
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Modify | Rows for the MCP scripts the hook already sends to the guard |
| `.github/workflows/spec-kit-check.yml` | Modify | Runs the doctor test runner |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every verified P1 behaviour bug in the twelve scripts is fixed, each with a regression test that fails against the previous code and passes after the fix |
| REQ-002 | Every script exits with the code its workflow maps: a checker crash or malformed input is the checker-error code, never the drift code |
| REQ-003 | Every script has an automated test covering its happy path, the main drift or failure it must catch, and its error path |
| REQ-004 | One runner executes every doctor test, and CI calls it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every script carries the standard header, `'use strict'` where required, and numbered sections when over 150 lines; `verify_alignment_drift.py` with every opt-in check reports no finding for the folder |
| REQ-006 | No unreachable function, branch, variable or CLI option remains; shellcheck and the TypeScript unused-locals check report none |
| REQ-007 | Workflow assets, route rows and READMEs agree with the scripts' flags, outputs and exit codes after the fixes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The doctor test runner passes locally and in the CI step, covering all twelve scripts.
- **SC-002**: Every doctor gate still exits as it did before on the real repository, so the fixes change no verdict on healthy input.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stricter check turns a currently passing gate red on the real repository | Med | Run every gate on the real tree before and after; a new failure is either real drift to fix or a check bug to correct |
| Risk | Refactoring `parent-skill-check.cjs` changes a verdict | High | Characterisation tests over all real hubs and every invariant land before the refactor |
| Dependency | `vocabulary-agreement.vitest.ts` reads constants from the checker's source text | Med | Keep those constant names and shapes; rerun that suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full doctor test runner finishes in under five minutes on a developer machine.

### Security
- **NFR-S01**: No test or output records a credential value; tests that touch credential checks use sentinel values and assert they never appear.
- **NFR-S02**: Tests write only under temporary directories they create and remove.

### Reliability
- **NFR-R01**: Tests run on macOS bash 3.2 and on the Linux CI runner without GNU-only flags.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or `null` JSON input: the checker-error exit and a status line, never a stack trace or a pass.
- Prefix-sharing ids (`/create:skill` and `/create:skill-parent`): matched exactly.

### Error Scenarios
- Missing optional tool (`flock`, python3, PyYAML): a named failure or a documented fallback, never a silent success.
- Uncommitted local edits during `release-update align`: read from the worktree.

### State Transitions
- A second `release-update apply` without decisions after a completed apply plans afresh.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 12 scripts, about 7,500 lines, plus new tests |
| Risk | 12/25 | Gates other workflows and CI depend on |
| Research | 6/20 | Four reviews already ran |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Removing `mcp-doctor.sh --fix` follows from both MCP workflows forbidding it and the request to leave nothing dead.
<!-- /ANCHOR:questions -->

---


