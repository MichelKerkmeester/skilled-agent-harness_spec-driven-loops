---
title: "Feature Specification: Phase 5: central-doctor-playbook"
description: "Phase 5 moves every doctor-command manual scenario out of the six skill playbooks into one top-level package at .skilled/manual-testing-playbook/, merges the six category guides into one environment guide, and leaves the feature catalogs in their skills with their links re-pointed."
trigger_phrases:
  - "central doctor playbook"
  - "phase 5 central doctor playbook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: central-doctor-playbook

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-command-contract-and-readme |
| **Successor** | None |
| **Handoff Criteria** | Every doctor-command scenario lives in the central package, the package validates, and this packet's own `validate.sh --strict` run prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Command contract alignment, README setup section and a central doctor playbook specification.

**Scope Boundary**: One package at `.skilled/manual-testing-playbook/` holds every doctor-command scenario and the one environment guide. The feature catalogs stay in their skills and only their links move. The scenario bodies move unchanged, so this phase rewrites paths, ids and counts, never a procedure.

**Dependencies**:
- `003-integration-and-docs/` wrote `doctor-symlink.md` and `doctor-install.md` into the system-spec-kit package, so those two move with the other 19 spec-kit scenarios
- The six skill playbook packages that held the scenarios: system-spec-kit, system-skill-advisor, sk-git, sk-code, mcp-code-mode, system-deep-loop
- `validate-playbook-package.cjs`, its fail-closed allowlist and the fleet run that walks every package
- The fixtures that pin scenario counts and scenario paths: leaf manifests, leaf aliases, the advisor vitest expectations, the spec-kit vitest files, the sk-doc code-folder fixtures and the trigger index

**Deliverables**:
- The package root `manual-testing-playbook.md` and `doctor-commands/README.md`, both carrying the merged environment guide
- The 57 moved scenarios, their 314 rewritten links and seven files outside the package with rewritten links
- Four new scenarios for the commands that had none, and the two colliding ids renumbered
- Six skill playbook indexes without their doctor rows, each pointing at the central package
- Four feature catalogs whose links point at the central scenarios
- Validator discovery, the fail-closed allowlist entry, a discovery test, and the regenerated dependent fixtures
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A doctor command was documented in whichever skill happened to own a neighbouring feature. The 57 scenarios that covered the family sat in six different playbook packages, under six category READMEs that each described the environment in their own words, so a reader who wanted to check `/doctor:update` had to know which skill to open first. Four commands, `/doctor:sk-skill check`, `/doctor:sk-skill convert`, `/doctor:agents-md check` and `/doctor:agents-md embed-restore`, had no scenario at all.

### Purpose

Put every doctor-command scenario and the one environment guide in one package, so a reader opens one folder for the whole family and the coverage count can be read off a single list.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook
PASS package=.skilled/manual-testing-playbook tier=FAIL_CLOSED scenarios=61 categories=1 operator=61 routing_gold_excluded=0 violations=0 warnings=12

$ ls -d .skilled/skills/*/manual-testing-playbook/doctor-commands
(no matches)
```

The `61` is the 57 moved scenarios, two of which phase 3 wrote, plus the four this phase wrote. The `(no matches)` line is what the move leaves behind: no skill keeps a doctor-commands folder. Every count this spec states about the package quotes this block.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.skilled/manual-testing-playbook/` with one environment guide in place of the six category READMEs
- Move the 57 doctor scenarios out of the six skill playbooks with `git mv`, and rewrite the 314 links inside them
- Rewrite the links in the seven files outside the package that pointed at a moved scenario
- Renumber the two colliding ids and write four scenarios for the commands that had none
- Drop the doctor rows from the six skill indexes, correct their counts and point each at the central package
- Re-point the four feature-catalog link sets, teach the validator the new package, and regenerate every dependent fixture

### Out of Scope
- Moving the feature catalogs out of their skills - a catalog describes that skill's feature, and only its links follow the scenario
- Rewriting a moved scenario's steps - a reader must find the same procedure in the new home, so only paths, ids and counts change
- One copy of the doctor scenarios per skill - a second copy drifts from the central one
- Commits and pushes - the packet records the work and the orchestrator owns the git write

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Create | Package root, holding the merged environment guide |
| `.skilled/manual-testing-playbook/doctor-commands/README.md` | Create | The category index, and the merged guide's home for the doctor family |
| `.skilled/manual-testing-playbook/doctor-commands/` | Create | The 57 moved scenarios plus four new ones |
| `.skilled/skills/*/manual-testing-playbook/` for the six skill packages | Modify | Lose their doctor scenarios, their doctor index rows and their doctor counts |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | Discovers the central package; the fail-closed allowlist names it |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modify | Gains a discovery test that fails when the central package drops out |
| Leaf manifests and leaf aliases for mcp-code-mode, sk-git and system-skill-advisor | Regenerate | Pinned scenario counts and paths |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | Modify | Expectations move to 48 scenarios across 9 categories |
| The spec-kit `workflow-invariance` and `playbook-provenance-paths` tests | Modify | The provenance walk covers the central package too |
| `.skilled/skills/sk-doc` code-folder fixtures and the trigger index | Regenerate | Path and vocabulary changes |
| `sk-code-quality`, `sk-code-ci`, the sk-git catalog and the system-spec-kit catalog | Modify | Links point at the central scenarios; the catalogs stay put |
| `005-central-doctor-playbook/scratch/old-doctor-readmes/` | Create | The old category READMEs, kept out of the package |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` exits 0 and prints `PASS` with `violations=0`. |
| REQ-002 | The 57 doctor scenarios leave the six skill packages, so `ls -d .skilled/skills/*/manual-testing-playbook/doctor-commands` prints no matches. |
| REQ-003 | No two of the 61 central scenarios share a `DOC-` id, so the duplicate count over the package is 0. |
| REQ-004 | Each of the 16 doctor commands is named by at least one central scenario, and the coverage list reads one entry per command. |
| REQ-005 | `validate-playbook-package.cjs` discovers the package and the fail-closed allowlist names it, so the no-argument fleet run exits 0 and its verdict list differs from main's by one line, `PASS package=.skilled/manual-testing-playbook`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The provenance walk covers the central package and every scenario, the category README and the package root carry a `Provenance:` line, so `workflow-invariance.vitest.ts` and `playbook-provenance-paths.vitest.ts` exit 0. |
| REQ-007 | The advisor playbook index and its vitest expectation agree at 48 scenarios across 9 categories, so `manual-testing-playbook.vitest.ts` and `scorer/native-scorer.vitest.ts` exit 0. |
| REQ-008 | Every runtime mirror, prompt mirror and advisor bridge is current after the move: `sync-runtime-mirrors.cjs --check` reports `211 mirrors across 9 trees are in sync`, each prompt sync reports `43 prompts are in sync`, and `derive-command-bridges.cjs --check` reports `"status": "fresh"`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints `PASS` with `violations=0`, and the duplicate-id count over the 61 scenarios is 0.
- **SC-002**: No skill keeps a doctor-commands folder, and the coverage list names all 16 doctor commands.
- **SC-003**: The no-argument fleet run exits 0 with one more `PASS` line than main, and the only verdict difference from main is that line.
- **SC-004**: The spec-kit provenance walk and the advisor playbook suite pass, and every mirror, prompt and bridge reports itself in sync.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate-playbook-package.cjs` discovery and the fail-closed allowlist | The package is invisible to the fleet run, so a broken scenario is caught by nothing | Teach the validator the package, add it to the allowlist, and add a discovery test that fails when it drops out |
| Dependency | `git mv` for the move | A copy-and-delete would lose the file history a reader follows to the old procedure | Move with `git mv`, and keep the old category READMEs in this packet's `scratch/` rather than the package |
| Risk | A stale link after the move | A reader lands on a file that no longer exists | Rewrite all 314 links and count the unresolved ones: 0 |
| Risk | A stale count in a skill index or in the advisor vitest expectation | The index check or the vitest file fails on a number, not on behavior | Correct the count the check names, never the check |
| Risk | A released changelog picked up by the link sweep | History is rewritten in a file that records it | Revert the edit and keep the sweep out of released changelogs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fleet run gains one `PASS` line and no second check pass, because the whole family validates as one package.
- **NFR-P02**: The validator reads the 61 scenarios in one walk of the package, so an added scenario costs one file read.

### Security
- **NFR-S01**: A scenario is a manual procedure, so the move adds no executable step and widens nothing a check writes.
- **NFR-S02**: The 12 `BACKTICK_PATH_UNRESOLVED` warnings name example paths the scenarios carried before the move; no warning names a live path on the operator's disk.

### Reliability
- **NFR-R01**: Every regenerated fixture is byte-identical on a rerun, so each generator's `--check` exits 0.
- **NFR-R02**: A central scenario without its `Provenance:` line fails `playbook-provenance-paths` instead of passing silently, which is how the nine missing lines surfaced at closeout.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a doctor command with no scenario drops the coverage list below 16 names, which is the state the four new scenarios close.
- Maximum input: 61 scenarios in one package, 314 links inside the moved files, seven files outside it, and two ids that collided with existing central numbers.
- Failure path: a moved file with no `Provenance:` line fails `playbook-provenance-paths`, a stale count fails `manual-testing-playbook.vitest.ts`, and the package validator prints the violation count and exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One new package, 61 scenarios, six skill indexes, four catalogs and nine fixture sets |
| Risk | 6/25 | Every edit is markdown, JSON or a fixture count; a missed line fails a check, not a user path |
| Research | 6/20 | Four commands had no scenario, and the link map had to be read before any path moved |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The scope came from the operator's second request and two follow-up answers: one top-level package, the doctor scenarios moved out of the skills, and the feature catalogs left in place.
<!-- /ANCHOR:questions -->

---


---
