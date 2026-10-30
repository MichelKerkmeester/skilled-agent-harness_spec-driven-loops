---
title: "Implementation Plan: check engine"
description: "Build one read-only engine that classifies a repository against the manifest, and prove each row on a synthetic fixture that carries exactly one planted defect."
trigger_phrases:
  - "agents md check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: check engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, `node:test` |
| **Framework** | None; the engine calls the canary, the pointer sync and the repo-rules checker as child processes where it reuses them |
| **Storage** | Reads the manifest and the target tree; writes nothing |
| **Testing** | `node:test`, picked up by `scripts/tests/run-all.sh` |

### Overview
One engine module with a pure classifier per row, one report renderer for text and JSON, and nine fixture trees built from the manifest so no fixture can drift from it. The suite comes first and every fixture is asserted by its A1 state before any row detail is asserted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001's manifest reports `PASS` and the shared segmenter is importable
- [ ] The six baseline commands are recorded in `scratch/baseline.txt`
- [ ] The canary, pointer sync and repo-rules checker paths are read from the manifest, not typed twice

### Definition of Done
- [ ] `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 with `STATUS=OK` on this repository
- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` reports `fail 0`
- [ ] `git status --porcelain | shasum` is unchanged by a run over all nine fixtures
- [ ] Every row appears in both the text and JSON report
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure classifiers behind one report renderer.

### Key Components
- **`agents-md-check.cjs`**: argument parsing, the twelve row functions, the renderer and the exit-code mapping.
- **Fixtures**: nine trees under `scripts/tests/fixtures/agents-md/`, each built from the manifest with exactly one planted defect.
- **External tools it calls rather than reimplements**: the rule-copy canary for A6, the pointer sync for A10 and the repo-rules checker for A11.

### Data Flow
The engine segments the target `AGENTS.md` with the shared library, compares each section's hash against the manifest's `derived` bodies, then runs the child tools whose output it embeds. Every row returns a state and a detail list, the renderer prints them in a stable order, and the exit code is the maximum severity across rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each row function against one fixture | `node:test` |
| Contract | Exit codes, JSON shape and the write-spy | `node:test` |
| Manual | The `forked` fixture through `--json` | `agents-md-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001's manifest and segmenter | Internal | Yellow | No classification is possible without them |
| Rule-copy canary | Internal | Green | A6 reports `UNKNOWN`, which the suite asserts |
| Repo-rules checker | Internal | Green | A11 reports `INFO` with the reason |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A run writes any file, or a fixture classifies as a state other than its own.
- **Procedure**: Revert the single commit; the engine has no data to migrate and no state outside the tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001's manifest | Implementation |
| Implementation | The fixture trees | Verification |
| Verification | All twelve rows | Child 003, which plans an embed from this report |
<!-- /ANCHOR:phase-deps -->

---
