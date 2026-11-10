---
title: "Implementation Plan: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides"
description: "Let --explain take several paths, resolve them in one pass, and add the surface folder, the checklist seat and the parsed rule overrides to each file's entry."
trigger_phrases:
  - "quality resolver plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None, the runner writes no file |
| **Testing** | `node:test` with the throwaway git fixtures in `scripts/tests/fixtures.cjs` |

### Overview
`--explain` collects every path after it, as `--files` does, and may repeat. One call builds facts for every file, labels them with the declared surfaces and resolves the checklists once. Each file's entry adds the folder of every surface that detected it, the seat that listed each checklist and the checklist's override section, read through the shared linter.
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
- [x] The six new cases fail against the `HEAD` runner and pass against the changed one
- [x] Docs updated (spec/plan/tasks, runner contract, changelog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One resolver, many readers: the explanation reuses the run's own facts, labels and checklist resolution.

### Key Components
- **`parseArgs`**: `--explain` pushes its first value and every following non-flag argument.
- **`checklistRows` and `resolveChecklists`**: each row carries a `seat`, and the resolution returns a `seats` map beside the checklist list, so run rows keep their shape.
- **`surfaceSkills`**: the folder of each surface that detected a file, decided by the same `skillRoots` and `hubLabels` sets `fileLabels` filled.
- **`overridesReader`**: loads the linter and its contract once and returns `lintOverrides` per checklist file.
- **`explainFile` and `explain`**: one entry per file, and the single-path top-level fields when one path is named.

### Data Flow
Named paths become facts, facts get labels from `declaredSurfaces`, one `resolveChecklists` call lists the rows and their seats, and each file entry filters those rows to the ones that list it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `quality-gate.cjs` explain path | Explains one file | update | the six explain cases |
| `quality-gate.cjs` `runGate` | Reads `checklists`, `errors`, `warnings` from `resolveChecklists` | unchanged, it ignores the new `seats` key | the full suite, 129 of 129 |
| `router-replay-lib.cjs` `declaredSurfaces` | Lists surfaces and outside skill folders | reused, not changed | the trusted and untrusted link case |
| `check-rule-overrides.cjs` `lintOverrides` | The one override reader | reused, not changed | the valid and floor override case |
| Review (child 005) | Will read the explanation | consumer, not changed here | the contract in `runner-contract.md` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures the current single-path behavior, Implementation adds the fields and the tests, and Verification runs the suite and compares single-path output against the `HEAD` runner.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Six explain cases in `quality-gate.test.cjs` | `node --test --test-name-pattern="^explain"` |
| Integration | The full quality runner suite | `node --test *.test.cjs` |
| Manual | Single-path output of the `HEAD` runner and the changed one on four real files, with the added fields removed | `node -e` JSON comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/scripts/check-rule-overrides.cjs` and `rule-overrides.json` | Internal | Green | No override field |
| `router-replay-lib.cjs` and `private-skill-target.cjs` | Internal | Green | No outside folder |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A caller breaks on the explanation's shape, or the run verdict changes.
- **Procedure**: Revert the commit that carries `quality-gate.cjs`, its test file and the contract change.
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
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
