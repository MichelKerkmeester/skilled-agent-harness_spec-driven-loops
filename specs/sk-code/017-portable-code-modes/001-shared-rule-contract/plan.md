---
title: "Implementation Plan: Phase 1: shared-rule-contract"
description: "Add one shared contract for a checklist's Rule overrides section, write its hard floor as JSON and add a CommonJS linter that reads that JSON, proven by a node:test suite that fails without the linter."
trigger_phrases:
  - "shared rule contract plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: shared-rule-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview

The phase adds three files to the sk-code hub's `shared/` folder: the contract reference, the hard floor as JSON and a linter. The linter reads the JSON, so the floor exists in one machine-readable place, and a test compares the reference's floor table with that JSON. A `node --test` suite proves each refusal and each pass, and it fails when the linter is absent.
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
- [x] `node --test .skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` prints `pass 11` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One data file, two readers.

### Key Components
- **`rule-overrides.json`**: the fixed ids, each an exact id or a `<class>.*` pattern, and the machine-checked classes.
- **`rule-overrides.md`**: the contract, with the floor table mirroring the JSON.
- **`check-rule-overrides.cjs`**: parses a checklist's section and refuses floor ids and `replace:` rows on machine-checked ids. It exports `lintOverrides` as the only reading path, so a mode refuses exactly what the command line refuses.

### Data Flow

The linter loads the JSON floor, reads each checklist file named on the command line, finds the `## Rule overrides` heading outside fenced code, parses the table rows and checks the id grammar, the action, repeats and the floor. It prints one `OK` or `FAIL` line per file and exits 0, 1 or 2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/references/universal/` | Holds the universal floor | update: add the contract and its JSON | `ls` lists both files |
| `shared/scripts/` | Did not exist | update: add the linter and its suite | `node --test` reports `fail 0` |
| `.github/workflows/sk-code-script-tests.yml` | Runs the sk-code suites | update: one step for the shared suite | `actionlint` exit 0, `check-gate-inputs.sh` RESULT: PASSED |
| `sk-code-quality`, `sk-code-review` | Read checklists today | not a consumer yet | `git status --short` lists no file under either mode |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the existing grammar and floor, Implementation writes the four files, and Verification runs the suite both ways and validates the docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `lintOverrides`, the floor and machine-class agreement | `node --test` |
| Integration | The CLI run on a temporary checklist, with its exit code and output | `node --test` with `spawnSync` |
| Manual | The linter on the contract reference itself | `node check-rule-overrides.cjs rule-overrides.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js built-ins (`node:fs`, `node:path`, `node:test`) | Internal | Green | None. No package is added |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The contract or the floor list proves wrong before a mode reads it.
- **Procedure**: Revert the phase commit. No mode reads the files yet, so nothing else changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->
