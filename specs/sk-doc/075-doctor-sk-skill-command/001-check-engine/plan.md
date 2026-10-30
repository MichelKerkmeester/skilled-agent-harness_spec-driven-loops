---
title: "Implementation Plan: Phase 1: check-engine"
description: "Build sk-skill-check.cjs and lib/sk-skill-surface.cjs as thin Node orchestration over the existing format validators, resolver, parser and advisor CLI. Select a Python interpreter that can import PyYAML and prove the behavior with PATH stubs, fixture tests and a fleet run against the recorded baseline."
trigger_phrases:
  - "check engine plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: check-engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts that spawn Python 3 validators |
| **Framework** | None; doctor scripts follow the `ci-report.cjs` per-target naming |
| **Storage** | None; `check` writes nothing |
| **Testing** | `node --test` |

### Overview
Add one check script and one shared probe library under `.skilled/commands/doctor/scripts/`. Each row C1 to C13 either calls an existing validator and parses its JSON, or runs a small new probe (path test, slug-default compare, changelog link, collision scan, regression row count). When `PYTHON` is unset, select the first distinct `python3` on `PATH` that imports PyYAML; when set, use only that interpreter. Prove the precondition with PATH stubs, fixture tests and a fleet run that reports the baseline verdict for every shipped root.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `ls .skilled/commands/doctor/scripts/sk-skill-check.cjs` reports no such file before work starts
- [ ] `scratch/baseline/` holds `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs` output for every shipped root
- [ ] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin validator orchestration

### Key Components
- **`sk-skill-check.cjs`**: argument parsing, the C1 to C13 row loop, text and JSON rendering, exit 0/1/2.
- **`lib/sk-skill-surface.cjs`**: locate a skill by name or path, classify its input kind, scan collisions, wrap each spawned validator with its exit-code mapping.

### Data Flow
The script resolves the target to a skill root, runs each row's probe through `sk-skill-surface.cjs`, and collects one `{row, status, detail}` record per row. Text mode prints a table; `--json` prints the records. No argument walks every direct child of `.skilled/skills` holding `SKILL.md` and prints one row per root.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds new read-only scripts and fixes no reported finding. The surfaces it reads are listed in design section 2.1 rows C1 to C13.
<!-- /ANCHOR:affected-surfaces -->


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
| Unit | Classifier, slug-default compare, collision scan, changelog probe and Python interpreter discovery in `lib/sk-skill-surface.cjs` | `node --test` |
| Integration | `sk-skill-check.cjs` over the seven fixtures, text and `--json` | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` |
| Manual | Fleet run compared with `scratch/baseline/` | `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check --json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `package_skill.py --json --strict`, `ci-skill-root-metadata.cjs --format json`, `regenerate-skill-derived.cjs` | Internal | Green | C3, C4, C6 cannot run; exit 2 |
| `router-file-resolver.cjs`, `router-replay-lib.cjs` in sk-code-skilled | Internal | Green | C2, C7 exit 2 with a named cause |
| `skill-advisor.cjs advisor_recommend --warm-only` | Internal | Yellow | Exit 75 gives UNKNOWN for C8 |
| `sync-skills-hermes.cjs --check` | Internal | Green | C9 Hermes row exits 2 without `@spec-kit/shared` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fleet run reports a verdict that differs from `scratch/baseline/`, or `git status --porcelain` changes after a `check` run.
- **Procedure**: delete the four new paths (two scripts, one test, the fixture folder) in one revert commit; nothing else is touched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baseline, fixtures) | None | Implementation |
| Implementation (two scripts) | Setup | Verification |
| Verification (tests, fleet run) | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---
