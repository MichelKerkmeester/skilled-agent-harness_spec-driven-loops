---
title: "Implementation Plan: verification and docs"
description: "Run the pair over every fixture from the final tree, capture each transcript, settle the two inferred claims by hand and land the documentation rows."
trigger_phrases:
  - "agents md verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: verification and docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell and Node.js commands; Markdown documentation rows |
| **Framework** | The doctor family's own runner and the spec-kit validator |
| **Storage** | `scratch/e2e/` transcripts and the documentation folders the sk-doc router resolves |
| **Testing** | The six baseline commands plus the nine-fixture end-to-end pass |

### Overview
Resolve the three documentation locations first, because they decide where the work lands. Then run the pair over every fixture from a clean tree, capture each transcript, and rerun the whole baseline. The two manual rows are answered in a live session or recorded as unknown with the reason.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Children 001 to 004 are complete and their suites pass
- [x] The three documentation locations are resolved and recorded in `scratch/doc-locations.txt`
- [x] The six baseline commands are recorded in `scratch/baseline.txt`

### Definition of Done
- [x] Every baseline command reruns from the final tree with the same pass lines
- [x] Nine transcripts exist under `scratch/e2e/`
- [x] The two manual rows carry a recorded unknown with its reason and the steps that answer it
- [x] `validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One verification pass, one documentation pass, no code.

### Key Components
- **End-to-end runner**: a shell loop over the nine fixture copies, capturing stdout and the exit code per fixture.
- **Manual rows**: two playbook entries whose answers come from a live session, not from a script.
- **Documentation rows**: the script README, the playbook and the changelog, each at its resolved location.

### Data Flow
Each fixture is copied to a temporary directory, checked, then planned, and both outputs go to one transcript. The transcripts are the evidence the acceptance criteria cite.
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
| End-to-end | Nine fixtures, check then plan | The two engines, with output captured |
| Regression | Every baseline command from the final tree | The commands themselves |
| Manual | A live Devin session and a Cursor window | The two playbook rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 001 to 004 | Internal | Yellow | Nothing to verify |
| A live Devin session | External | Yellow | The row records an unknown with its reason |
| The sk-doc router | Internal | Green | The documentation locations cannot be resolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A baseline command regresses from its recorded pass line.
- **Procedure**: Revert the offending child's commit and rerun this pass; the transcripts show which step changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Verification pass ──► Documentation pass
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Children 001 to 004 | The verification pass |
| Verification pass | Nine fixture copies | The documentation pass |
| Documentation pass | The recorded answers | Phase closure |
<!-- /ANCHOR:phase-deps -->

---
