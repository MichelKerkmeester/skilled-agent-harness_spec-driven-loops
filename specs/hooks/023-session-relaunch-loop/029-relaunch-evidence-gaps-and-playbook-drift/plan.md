---
title: "Implementation Plan: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "Capture the missing Codex and Claude evidence, find the cause of the Claude retry, record a current Pi baseline, and fix the two playbook lines to match what a run prints."
trigger_phrases:
  - "relaunch evidence gaps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell, tmux, Node.js tests and Markdown playbooks |
| **Framework** | The session-relaunch playbooks and suites |
| **Storage** | None, evidence is under scratch/ |
| **Testing** | Live reruns, the Pi suites, the import smoke and the shim suite |

### Overview
Rerun each thin run with the evidence it lacked, trace the retry to its producer, record the Pi baseline and fix the two playbook lines to what a run prints.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Credentials for Codex and Claude available, or the rerun recorded as SKIP

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Every gap closed or recorded as open with its reason
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe, trace, correct.

### Key Components
- **Evidence records**: Transcripts, rates and baselines under scratch/.
- **Playbook edits**: Two lines corrected to observed output.

### Data Flow
A rerun produces a transcript or a number, the number is compared with the playbook line, and the line is corrected or the code is fixed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| session-relaunch-pi-opencode.md import smoke and shim steps | Documents expected output | Correct to observed output | The command output pasted in the record |
| Claude nudge path | Fires the extra nudge | Unchanged unless a producer is found | A failing-first test if changed |
| Codex withdraw path | Prints the withdraw notice | Unchanged | A transcript with the receiver reply |

Required inventories:
- Same-class producers: `rg -n "import smoke|shim" .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks` lists lines of the same shape.
- Consumers of the playbook text: the playbook index and the feature catalog entry.
- Matrix axes: runtime (Codex, Claude, Pi, OpenCode), gap (four).
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
| Manual | Codex and Claude reruns | tmux and the runtime CLIs |
| Unit | Pi suites, import smoke and shim suite | `node --test`, `vitest` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Codex and Claude runtimes | External | Yellow | A rerun is a SKIP |
| Pi suites | Internal | Green | No Pi baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix for the retry lowers the relaunch gate below baseline.
- **Procedure**: Revert the fix and keep the evidence record, then reopen the gap as open with the cause named.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Reruns ──► Retry cause ──► Fix if defective
Pi baseline ──────────────► Playbook edits
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reruns and baseline | None | Playbook edits |
| Retry cause | Reruns | Fix if any |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Reruns and trace | Med | 3 to 5 hours |
| Doc fixes and verification | Low | 1 to 2 hours |
| **Total** |  | **5 to 8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline relaunch gate recorded
- [ ] Leftover hand-over records cleared

### Rollback Procedure
1. Revert any code fix.
2. Rerun the relaunch gate.
3. Mark the affected gap open with the cause.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
