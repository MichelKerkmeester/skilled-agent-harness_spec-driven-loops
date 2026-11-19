---
title: "Implementation Plan: Phase 15: skilled-alignment-check"
description: "Run the confirm workflow of /local-skilled-alignment over the merged worktree 474 branch, copy its report into evidence/ and triage each finding. No source file changes."
trigger_phrases:
  - "skilled alignment check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: skilled-alignment-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scripts under `.skilled/commands/assets/local-skilled-alignment/` |
| **Framework** | The `/local-skilled-alignment` confirm workflow YAML |
| **Storage** | Run folder under `~/.local/state/local-skilled-alignment/Skilled/`, outside the checkout |
| **Testing** | The run's own battery rows, review lanes and critic |

### Overview
The phase runs one alignment check and keeps its output. The command resolves the scope from git, runs the existing checks for every surface the scope fires, sends read-only review lanes and a critic at those surfaces, and writes `report.md`. The phase copies the report into `evidence/` and triages it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope resolves to the 34 merged code files: `resolve-scope.cjs` printed `files=220 commits=20`, 34 of them outside `specs/`
- [x] The battery plan exists: `run-battery.cjs --plan` exited 0 and fired S1 to S8, S13 and S14
- [x] The operator approved the scope and picked a lane preset

### Definition of Done
- [x] `ls evidence` prints `findings.json`, `fix-plan.md`, `report.md` and `scope-summary.json`
- [x] Strict validation of this folder prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Report-only command run.

### Key Components
- **`local-skilled-alignment-confirm.yaml`**: The workflow that owns every step, checkpoint and artifact write.
- **`evidence/`**: Where this phase keeps the copies, because the run folder sits outside the checkout and the post-run prune deletes old runs.

### Data Flow
Git topology gives `scope.json`. The surface map turns it into battery rows and lanes. Lanes and the critic return findings as JSON. `aggregate-findings.cjs` merges them into `findings.json`, `fix-plan.md` and `report.md`, which the phase copies into `evidence/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup resolves the scope and builds the battery plan. Implementation runs the battery, the lanes, the critic and the report, with the operator answering the two checkpoints. Verification copies the report into `evidence/`, triages it and validates this folder strict. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The run tests nothing new. Its battery rows are the existing checks, and their results go into the report as data.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `git` and the lane preset's CLI binary. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run writes nothing in the checkout outside `evidence/`. To undo the phase, delete `evidence/`.
<!-- /ANCHOR:rollback -->

---
