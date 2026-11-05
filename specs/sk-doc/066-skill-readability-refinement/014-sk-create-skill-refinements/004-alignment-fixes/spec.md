---
title: "Feature Specification: Phase 4: alignment-fixes"
description: "The local-skilled-alignment run over the whole readability program found two broken CI tests, a router callout the package validator no longer saw, a rewrite guard that matched citations by bare file name, and stale counts and section numbers in docs. This phase fixes every confirmed finding."
trigger_phrases:
  - "alignment fixes"
  - "phase 4 alignment fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-templates-and-fleet |
| **Successor** | None |
| **Handoff Criteria** | Every confirmed finding of run `20261105T151115Z` is fixed or recorded as not fixed with a reason, and the recheck reports no new row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-create-skill refinements specification. It fixes the defects the local-skilled-alignment run found across the 066 program, base `1af95fc818` to `0e88ba257b`.

**Scope Boundary**: the findings the completeness critic upheld in `report.md` and `critic.json` of run `20261105T151115Z`. Form-only rules from the program still hold: changelogs, playbooks, feature catalogs, benchmarks and tests are fixed only where a finding names them.

**Dependencies**:
- Phases 001 to 003 committed through `0e88ba257b`.
- The alignment run folder `~/.local/state/local-skilled-alignment/315-frontend-reference-restructure/20261105T151115Z`.

**Deliverables**:
- One commit per changed skill with a changelog and a hub version bump, plus commits for the doctor command tests, the Hermes router mirrors and the root release note.
- A recheck run folder with `recheck.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two doctor test suites failed in CI because their fixture routers did not open with OVERVIEW, and `/doctor:sk-skill` converted references whose description restated the intro, which the strict render check fails. The compiled-routing callout moved out of MACHINE ROUTER in two hub routers, so the package validator stopped reporting them as compiled-ready. The rewrite guard matched a cited file by bare name across skills, and several docs carried stale counts, section numbers and paths.

### Purpose
Every finding the critic upheld is fixed, and every gate the program used passes again from the final state.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --preserve-symlinks --preserve-symlinks-main recheck.cjs --from 20261105T151115Z --battery battery.json --out 20261105T165214Z-recheck
STATUS=OPEN recheck: resolved=8 still_open=6 new=0 needs_review=20

$ node --preserve-symlinks --preserve-symlinks-main run-probes.cjs --probes 20261105T151115Z/probes-input.json
STATUS=OK run-probes: pass=18 fail=0 cannot_run=0
```
The six still-open rows are the four S14 packet replays, which pass when run with the symlink flags, the S9 reference to a gitignored database, and the S2 overflow cap.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the routing-shape, integrate and convert doctor tests and the `describeResource` transform.
- Move the compiled-routing callout back into MACHINE ROUTER in the sk-doc and mcp-tooling routers.
- Make `doc-rewrite-guard.py` resolve the cited file, and make `validate_document.py` read section citations written as a code span or a link.
- Route rewrite-guard and render-ledger prompts to sk-create-skill, and document the render ledger and the sixteen render checks.
- Fix the stale counts, section numbers and paths in the named READMEs, playbook scenarios, the checklist and the v4.0.1.0 release note.

### Out of Scope
- B-04, the feature catalog entry - feature catalogs are outside the program's form-only scope.
- A-4, running the section-reference check on playbook docs - a design change, not a defect.
- The alignment command's REPO_ROOT resolution - the file is operator-local and gitignored in the main checkout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/tests/routing-shape-parity.test.cjs`, `sk-skill-integrate.test.cjs`, `sk-skill-convert.test.cjs` | Modify | Fixture routers open with OVERVIEW, the convert test reads a fixture ledger |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Modify | The description names the sections instead of quoting the intro |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py`, `validate_document.py` | Modify | Citation resolution |
| `.skilled/skills/sk-doc/ROUTER.md`, `hub-router.json`, `sk-create-skill/ROUTER.md`, `.skilled/skills/mcp-tooling/ROUTER.md` | Modify | Callout placement and routing vocabulary |
| `validation-and-packaging.md`, `render-known-debt.json`, five READMEs, eleven playbook scenarios, `javascript-checklist.md`, `v4.0.1.0.md`, root `README.md` | Modify | Stale text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed`. |
| REQ-002 | `validate_skill_package.py` reports no FAIL for any of the 13 program skills, and compiled-ready passes for sk-doc and mcp-tooling. |
| REQ-003 | The rewrite guard reports no citation of a same-named file in another skill, and no citation that was renumbered with its section. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every routing probe of the run routes to its expected skill. |
| REQ-005 | Every literal finding the recheck tests is resolved, and the recheck reports no new battery row. |
| REQ-006 | Each changed skill is committed on its own with a changelog and a hub version bump, and the Hermes mirrors pass `--check`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recheck of run `20261105T151115Z` reports `new=0` and every literal finding resolved.
- **SC-002**: The strict sweep prints 55 `Result: PASS` lines and no `::error::` line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skill advisor index | A stale index sends the new routing phrases nowhere | Force-rebuild the advisor and rerun the probes |
| Risk | A guard change hides a real dropped citation | Med | Mutation-check each new guard test against the old guard, and keep a test where a citation left on a renumbered section is still hard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the phase changes validators and docs, and runs no service.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a reference with no H2 other than OVERVIEW gets the description `Reference notes for <title>.`.
- Maximum input: a reference with many sections names only its first three in the description.
- Failure path: a citation left on a section that was renumbered under it is still a HARD guard finding, with exit code 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 50 files in nine commits across six skills, the doctor command and the root docs |
| Risk | 8/25 | Validator and guard behavior, covered by new tests |
| Research | 6/20 | Each finding came with a file and line from the run |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The REPO_ROOT fix to the operator-local alignment command waits on an operator yes.
<!-- /ANCHOR:questions -->

---
