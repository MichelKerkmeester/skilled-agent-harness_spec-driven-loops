---
title: "Implementation Plan: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "Run four probes against the real runtimes, each with a negative control, record the output under scratch, and write one verdict per probe plus the path phase 27 follows."
trigger_phrases:
  - "goal rebind probes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 24: goal-rebind-claude-codex-hermes-probes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell and the runtime CLIs, with Markdown records |
| **Framework** | Claude Code, Codex and Hermes command lines and their hook surfaces |
| **Storage** | None, the records are Markdown under scratch/ |
| **Testing** | Recorded runs with a negative control each, no automated suite |

### Overview
Run each probe in a throwaway directory, save the command and output, run the control that could have shown the opposite, and write the verdict. The verdicts select the phase 27 path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator has said whether bypass flags may be used for this run

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Every probe record and control is saved and cited by the verdict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe, record, decide. No code is written.

### Key Components
- **Probe record**: One Markdown file per probe with the command, output, exit status and control.
- **Verdict table**: Lives in the implementation summary and names the phase 27 path.

### Data Flow
A probe command runs in a throwaway directory, its output is saved to scratch/, and the verdict cites that file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Claude start-prompt handling | Decides whether a slash command given as the start prompt runs | Observe only | Recorded run plus a plain-text control |
| Claude SessionStart hook output | Decides whether a hook can submit input | Observe only | Recorded run plus a silent-hook control |
| Codex goal creation | Decides whether a seed can create a goal | Observe only | Recorded run and the limit it shows |
| Hermes spec-folder export | Decides whether Hermes needs code at all | Observe only | Two sessions with different ids |

Required inventories:
- Same-class producers: not applicable, the phase writes no code.
- Consumers of the verdicts: phase 27 reads the Claude and Codex verdicts and phase 26 reads the Hermes verdict.
- Matrix axes: four probes, each with one run and one control, eight runs in all.
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
| Manual | Four probes and four controls | Runtime CLIs, tmux where the runtime needs a terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude CLI | External | Green | Probes A and B become inconclusive |
| Codex CLI | External | Yellow | Probe C becomes inconclusive, and phase 27 uses the seed path |
| Hermes CLI | External | Yellow | Probe D becomes inconclusive, and phase 26 binds Hermes through the shared core |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A probe leaves a goal, a hook or a process behind.
- **Procedure**: Clear the goal in the probe session, delete the throwaway hook and directory, and stop the process.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Probe A ──┐
Probe B ──┼──► Verdicts ──► Phase 27 path
Probe C ──┤
Probe D ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Probes A to D | None | Verdicts |
| Verdicts | Probes A to D | Phase 26 (Hermes) and phase 27 (Claude, Codex) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Four probes and controls | Med | 2 to 3 hours |
| Verdicts | Low | 30 minutes |
| **Total** |  | **3 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Throwaway directory created outside the repository
- [ ] Bypass flag question answered by the operator

### Rollback Procedure
1. Stop any running probe process.
2. Clear any goal the probe set.
3. Delete the throwaway hook and directory.
4. Confirm `git status` shows only this folder.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
