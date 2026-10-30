---
title: "Implementation Plan: Phase 5: integration"
description: "Add step V9 to sk-skill-convert.cjs with integration rows I1 to I6, and an opt-in --skill flag to the router reach script. Prove it in a temp repo using HERMES_SKILLS_OUTPUT_DIR and SKILL_GRAPH_FRESHNESS_ROOT, and by a byte comparison of the reach script's fleet output."
trigger_phrases:
  - "integration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS spawning the advisor CLI and Python compiler |
| **Framework** | None |
| **Storage** | Tracked `skill-graph.json`; relative symlink under `.skilled/changelog/` |
| **Testing** | `node --test` with a temp repo |

### Overview
Append V9 to convert: six rows, each printed as its own plan line and run only after V8 passes. Add `--skill <id>` to the reach script without touching its default path. Prove it in a temp repo and with `cmp` on the reach script's fleet output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004 closed: the plain fixture ends strict PASS. Evidence: the 004 suite passes 51/51 and its acceptance rows are Met
- [x] Fleet reach output captured before the change in `scratch/reach-before.txt`
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met. Evidence: AC-001 through AC-008 each cite the end-to-end convert case and the library case
- [x] `sync-skills-hermes.cjs --check` PASS, `skill-graph-freshness.cjs --strict` exit 0 and `cmp scratch/reach-before.txt scratch/reach-after.txt` prints nothing
- [x] Docs updated (spec/plan/tasks)

The rows are built here and called from the conversion: `buildPlainPlan` prints `planIntegration(...).lines`
beside the conversion steps, and `applyPlainPlan` calls `applyIntegration({ ..., apply: true })` only after
both format validators pass. A failed format gate therefore never reaches a row. Each row's result is printed
and each recorded write joins the undo list; a row that reports FAILED leaves the staged tree in place and
makes the run exit non-zero, so the operator still has the undo commands. The rows took the converted skill
root as an argument and never read the convert script, which is what let the two phases proceed side by side.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered integration steps

### Key Components
- **The call site in `sk-skill-convert.cjs`**: plans I1 to I6 beside the conversion, runs them after the format gate, prints each result and adds each recorded write to the undo list.
- **`sk-skill-surface.cjs` wrappers**: spawn scan, compiler, Hermes sync and regression runner with exit-code mapping.
- **Reach `--skill <id>`**: probes one standalone root; with no flag the script runs exactly as before.

### Data Flow
After V8, convert scans the skill into the advisor, exports the compiled graph, syncs and checks Hermes, prints or appends regression rows, creates the changelog file and link, and runs warm-only probes on three phrases. Each step's created and overwritten paths feed the undo list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ci-router-vocabulary-reach.cjs` | CI reach probe over hubs | update (opt-in flag only) | Fleet output byte-identical |
| `skill-graph.json` | Tracked compiled graph | update per converted skill | `skill-graph-freshness.cjs --strict` exit 0 |
| `.skilled/changelog/` | Changelog index of links | update (one new link) | Link resolves |
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
| Unit | Changelog link target, regression row rendering | `node --test` |
| Integration | Convert in a temp repo with `HERMES_SKILLS_OUTPUT_DIR` and `SKILL_GRAPH_FRESHNESS_ROOT` | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` |
| Manual | Reach fleet output before and after | `node ci-router-vocabulary-reach.cjs` then `cmp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-advisor.cjs` scan and warm-only recommend | Internal | Yellow | I1 and I3 report UNKNOWN on exit 75 |
| `skill_graph_compiler.py --export-json` | Internal | Green | I2 cannot refresh the graph |
| `sync-skills-hermes.cjs` with `@spec-kit/shared` | Internal | Green | I5 exits 2 with a provision command |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the reach fleet output changes, or freshness fails after I2.
- **Procedure**: remove the created changelog link and file, regenerate the compiled graph from the restored tree, rerun Hermes sync; for the code, revert the phase commit.
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
| Setup (reach baseline, temp repo harness) | Phase 004 closed | Implementation |
| Implementation (I1 to I6, reach flag) | Setup | Verification |
| Verification (temp repo checks, `cmp`) | Implementation | Phase 006 |
<!-- /ANCHOR:phase-deps -->

---
