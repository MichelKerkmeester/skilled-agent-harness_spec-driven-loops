---
title: "Implementation Plan: Phase 11: prerequisites-bound-folder-override"
description: "Prefix the five speckit workflow calls to check-prerequisites.sh with SPECIFY_FEATURE set from the bound spec folder, and document the override in the setup README. The script already honors it."
trigger_phrases:
  - "prerequisites bound folder override plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: prerequisites-bound-folder-override

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Workflow YAML read by the orchestrating model, one Bash script it runs |
| **Framework** | The speckit command workflows |
| **Storage** | None |
| **Testing** | `test-phase-command-workflows.js`, `gate-3-menu-parity.test.mjs` and two vitest files that read these YAMLs |

### Overview
Five lines in three workflow YAMLs run `check-prerequisites.sh` with no folder named. Each gains `SPECIFY_FEATURE=<bound folder without its leading specs/>`, which the script already reads at `:76-84`. The proof is the rewritten implement step 1 command, run for packet 015 on the worktree branch, exiting 0 where the bare call exits 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The four workflow tests print the baseline counts in `scratch/baseline.txt`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Caller names target. The script keeps its resolution logic, and each caller passes the packet it means.

### Key Components
- **The five workflow call lines**: each names the bound packet. Without the prefix, the script falls back to the branch name and exits 1 on any non-`NNN-` branch.

### Data Flow
The workflow binds `[SPEC_FOLDER]`. The step strips the leading `specs/` and runs `SPECIFY_FEATURE=<rest> bash .../check-prerequisites.sh`. `get_current_branch` returns the override, `check-prerequisites.sh:82` skips the branch check, and the folder check runs on the bound packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the bare and override calls and the four test counts. Implementation rewrites the five calls and the gate criterion, then adds the README paragraph. Verification reruns the tests and the rewritten step 1 command.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The YAMLs still parse and keep their checked text | `test-phase-command-workflows.js`, `yaml-intake-event-payloads.vitest.ts` |
| Integration | Workflow contracts the deep-loop and hook tests read | `speckit-autopilot-contract.vitest.ts`, `gate-3-menu-parity.test.mjs` |
| Manual | The rewritten implement step 1 command on packet 015 | Bash, exit status read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `check-prerequisites.sh` override at `:76-84` | Internal | Green | Without it the prefix is ignored; the measured override call exits 0 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a workflow test drops below its baseline count, or a bound run resolves the wrong folder.
- **Procedure**: revert the commit with `git revert <sha>`; the script is unchanged, so the old call works as before.
<!-- /ANCHOR:rollback -->


---

