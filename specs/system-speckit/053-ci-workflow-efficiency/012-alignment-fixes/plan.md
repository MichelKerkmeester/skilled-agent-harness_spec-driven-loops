---
title: "Implementation Plan: Phase 12: alignment-fixes"
description: "Fix seven CI and test alignment findings at their cause: correct four citations, run the advisor default suite in its own workflow, exempt one runtime-written name in the naming guard, pin two host-dependent hook tests and clear the runtime lint debt."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Python 3, Node ESM, TypeScript |
| **Framework** | node:test, vitest 4.1.12, unittest, ESLint 9 with typescript-eslint |
| **Storage** | The advisor runtime's ignored SQLite skill graph, built in CI by one scan |
| **Testing** | `node --test`, `npm test`, the guard's unittest file, `npm run check` |

### Overview
Each finding gets the smallest change at its producer: a citation edit, a CI step pair in the workflow that already installs and builds the advisor, one exact-name exemption in the guard, a cache or PATH seam in two tests, and a lint configuration that matches the file types ESLint actually reads. Each change is proven by a command that failed or reported the defect before the change.
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
- [x] `npm --prefix .skilled/skills/system-spec-kit/runtime run check` exits 0, and the advisor `npm test` reports `Test Files  150 passed (150)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer.

### Key Components
- **`skill-advisor-stress.yml`**: the one workflow that already filters on the advisor runtime and builds it, so the default suite reuses its install.
- **`check_no_new_snake_case.py`**: owns the exemption sets, so the runtime-written name joins them as `RUNTIME_GENERATED_NAMES`.
- **`opencode-version.mjs`**: its async resolver's `deps.probe` seam fills the cache the synchronous resolver reads.
- **`eslint.config.mjs`**: the `^_` ignore rule now covers `.js`, `.cjs` and `.mjs`. `cli/` stays linted, since its own `tsc` lint checks neither unused bindings nor `any`.

### Data Flow
CI push or pull request, path filter, install and build, stress suite, skill-graph scan, default suite. The naming guard reads the diff since the base and skips exact exempt names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check_no_new_snake_case.py` `_is_name_exempt` | Decides exact-name exemptions for both scan modes | update | guard unittest 9/9, replay since `583316d0833e` drops 18 to 8 |
| `spec-gate-core.mjs` `specGateConcernDisabled` | Reads the spec-gate kill switch | update, behaviour unchanged | spec-gate suites 152 pass, 0 fail |
| `advanceGate3LifecycleEpoch` callers | `.opencode/plugins/system-spec-gate.js:196` passes a reason | not a consumer of the rename | `rg -n advanceGate3LifecycleEpoch` lists the one caller, its argument still accepted |
| sk-code-ci reference docs | Cite workflow lines | update | `sed -n` on each cited line |
| Workflow README | Rows per workflow | update | `validate_document.py` 0 issues |

Required inventories:
- Same-class producers: the deep-loop runtime writes the marker in `runtime/scripts/fanout-run.cjs`, `reduce-state.cjs` and `synthesis-closeout.cjs`. The remaining 8 offenders (seven session transcripts under `scratch/` and one `research_archive` folder) are outside these findings and stay reported.
- Consumers of changed symbols: `rg -n 'specGateConcernDisabled'` finds only the three call sites inside `spec-gate-core.mjs`.
- Matrix axes: the guard test covers exempt file, non-exempt sibling, and both scan modes through the existing exemption test.
- Algorithm invariant: an exemption matches one exact basename of a file, never a directory and never a pattern.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures each defect, Implementation applies one fix per finding, Verification reruns every check from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Guard exemption, version-pinned hook cases | unittest, node:test |
| Integration | Advisor default suite after a fresh scan, runtime `npm run check` | vitest, ESLint, tsc |
| Manual | Guard replay over a commit range, gate-input check, YAML parse | `check_no_new_snake_case.py`, `check-gate-inputs.sh`, PyYAML |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor `dist/` build | Internal | Green | The scan step cannot start the daemon |
| `gh` run history for the advisor workflow | External | Green | The cost estimate would lack a run count |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the advisor job fails in CI on runner state rather than on a test, or the naming guard rejects a push it accepted before.
- **Procedure**: revert the commit that carries the workflow edit. The tests and the lint fixes stand alone and can stay.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The worktree at `ee64a63b2c` | Implementation |
| Implementation | Each defect measured | Verification |
| Verification | All fixes applied | Close |
<!-- /ANCHOR:phase-deps -->

---
