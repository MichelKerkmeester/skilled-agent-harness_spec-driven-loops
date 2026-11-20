---
title: "Implementation Plan: Phase 16: doc-alignment-check"
description: "Add an advisor-pasted-reply topic to the doc alignment topics file, run the confirm workflow of /local-doc-alignment on it, copy its report into evidence/ and triage each finding."
trigger_phrases:
  - "doc alignment check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: doc-alignment-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON topic config and Node.js scripts under `.skilled/commands/assets/local-doc-alignment/` |
| **Framework** | The `/local-doc-alignment` confirm workflow YAML |
| **Storage** | Run folder under `~/.local/state/local-doc-alignment/Skilled/`, outside the checkout |
| **Testing** | The topic's vitest check, the review lanes and the critic |

### Overview
The command checks docs only for a listed topic, so the phase first adds one topic entry, the documented way to add a topic. Then it runs the check, which reads every doc naming the topic against the 13 changed source files, and keeps the report in `evidence/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The topic loads: `doc-alignment.cjs scope --topic advisor-pasted-reply` printed `STATUS=OK` with 15 docs in 4 lanes
- [x] Every code root exists on disk
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
Config entry plus report-only command run.

### Key Components
- **`topics.json` entry `advisor-pasted-reply`**: Without it the scope step stops with `unknown topic`, so the command cannot run on this change at all.
- **`evidence/`**: Where this phase keeps the copies, because the run folder sits outside the checkout and the post-run prune deletes old runs.

### Data Flow
The topic's terms and code roots pick the docs. The lanes read each doc against the code roots and return findings as JSON. The critic checks them, and `aggregate-findings.cjs` writes `report.md`, which the phase copies into `evidence/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup adds the topic entry and runs the scope step. Implementation runs the check, the lanes, the critic and the report, with the operator answering the two checkpoints. Verification copies the report into `evidence/`, triages it and validates this folder strict. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The topic's one check runs `npx vitest run tests/hooks tests/parity tests/handlers` from the advisor runtime folder, the same suite as parent criterion 2. Its result goes into the report as data.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `npx` and the lane preset's CLI binary. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To undo the phase, delete the `advisor-pasted-reply` key from `topics.json` and delete `evidence/`. No other file changes.
<!-- /ANCHOR:rollback -->

---
