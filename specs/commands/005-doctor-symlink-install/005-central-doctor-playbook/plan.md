---
title: "Implementation Plan: Phase 5: central-doctor-playbook"
description: "This phase moves the 57 doctor-command scenarios out of the six skill playbooks into one package at .skilled/manual-testing-playbook/, merges the six category guides into one environment guide, drops the doctor rows from the skill indexes, and regenerates every fixture that pins a scenario count or path."
trigger_phrases:
  - "central doctor playbook plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: central-doctor-playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and the Node CommonJS scripts the repository already ships |
| **Framework** | The manual-testing-playbook package, its validator and its fail-closed allowlist |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs`, the no-argument fleet run, vitest, Python unittest and `node:test` |

### Overview

The phase adds no behavior. It moves 57 markdown scenarios into one package, rewrites the 314 links inside them and the links in seven other files, drops the doctor rows from six skill indexes, and regenerates the fixtures that pin a count or a path. The move is proved by the package validator, the fleet run, a duplicate-id count, a coverage count over all 16 doctor commands, and the dependent suites, none of which writes to a source tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints `PASS` with `violations=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One central package, one validator.

### Key Components
- **The package root and `doctor-commands/README.md`**: the merged environment guide the six old category READMEs became
- **The 61 scenarios**: one procedure each, each carrying one `DOC-` id, one category row and one `Provenance:` line
- **`validate-playbook-package.cjs` and the fail-closed allowlist**: the gate that decides whether a package is complete
- **The six skill indexes and four feature catalogs**: pointers into the central scenarios, kept in the skill that owns the feature
- **The dependent fixtures**: the leaf manifests, leaf aliases, vitest expectations and trigger index that pin counts and paths

### Data Flow

A scenario file carries its `DOC-` id in the title, its row in the category index and its `Provenance:` line. The package root lists the categories, and `doctor-commands/README.md` lists the scenarios. The validator walks the package and reports scenario, category, operator and violation counts. The no-argument fleet run walks every package in the repository, so the central one appears beside the skill packages. Skill indexes and catalogs link into the package, and the fixtures pin the counts those links and lists produce.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase fixes no reported finding. The closeout corrections, a missing provenance line, three stale counts and one reverted changelog edit, are recorded in `implementation-summary.md`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the six playbook packages, counts their doctor scenarios and records the link map. Implementation moves the scenarios with `git mv`, rewrites the links, drops the skill rows, adds the four missing scenarios and regenerates every dependent fixture. Verification runs the package validator, the fleet run, the duplicate-id and coverage counts, the dependent suites and the derived checks.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Package validator, duplicate ids, the coverage count | `validate-playbook-package.cjs`, `node --test` |
| Integration | The dependent fixtures: leaf manifests, advisor vitest, spec-kit vitest, Python harness | vitest, Python unittest, `npx` |
| Manual | One moved scenario read in its new home, and the package root read as a reader would | `read` over the package |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate-playbook-package.cjs` discovery and its fail-closed allowlist | Internal | Green | The package is invisible to the fleet run, so a broken scenario is caught by nothing |
| `git mv` for the move | Internal | Green | A copy-and-delete loses the file history a reader follows back to the old procedure |
| node, python3 and npx | Internal | Green | No validator, fixture or suite can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A moved scenario loses a step, or the fleet run reports a violation against the central package.
- **Procedure**: Revert the move commit and the six index edits. The scenarios return to the skill packages they came from, and the fixtures are regenerated to the old counts. The four new scenarios and the id renumbering go with the revert, so no id is left pointing at a file that no longer exists.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
004 command contract ──┐
                       ├──► 005 move ──► 005 indexes and catalogs ──► 005 fixtures ──► 005 verification
003 doctor scenarios ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 005 move | 004 command contract, 003 doctor scenarios | Indexes and catalogs, fixtures |
| 005 indexes and catalogs | 005 move | Fixtures |
| 005 fixtures | 005 move, 005 indexes and catalogs | Verification |
| 005 verification | Fixtures | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
