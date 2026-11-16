---
title: "Implementation Plan: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim"
description: "DeepSeek V4.1 Flash at max fixes the findings in small literal briefs run one at a time inside the worktree, a fresh Opus medium agent reviews every changed line against the code, and DeepSeek applies what the review confirms."
trigger_phrases:
  - "handover doc alignment plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, a bash and zsh shell shim, Node test runner |
| **Framework** | Session hand-over loop (`skilled-loop`, per-runtime adapters) |
| **Storage** | None |
| **Testing** | `node --test` hand-over and shim suites, drift guards, mirror checks |

### Overview
The findings come from one `/local-doc-alignment session-handover` run. The 13 in the READMEs worktree 411 rewrites go to that session. The rest go to DeepSeek V4.1 Flash at max in five briefs, run one at a time through the alignment lane runner inside worktree 424, each naming its allowed files and the code to check first. A fresh Opus medium agent then reviews the result.
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
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Report, fix, review: a findings report drives literal fix briefs, and an independent model reviews the fixes against the code.

### Key Components
- **Findings report**: `~/.local/state/local-doc-alignment/Skilled/20261116T053904Z/findings.json`, 58 findings.
- **Fix briefs**: G0 for the shim, G1 to G4 by doc area, G5 for the review fixes, each run by `run-lanes.cjs --lanes <id>` with the `opencode-go` preset.
- **Review**: a fresh Opus medium agent with the diffs, the code roots and the findings, and no conclusions.

### Data Flow
findings.json → split by overlap with 411 → G0 to G4 briefs → DeepSeek edits in 424 → Opus review → G5 brief → final checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skilled-loop-shell.sh` | Starts a plain runtime launch under the loop | update: wrap `vibe` | shim suite 37 of 37, and the suite fails with vibe removed |
| `.skilled/bin/skilled-loop` | Relaunch wrapper, already handles `vibe` | unchanged | its `vibe)` case and flag tables at lines 630 to 647 and 694 |
| Hand-over docs outside 411's rewrite | Describe the loop to readers | update | Opus review against the code at HEAD |
| Seven hook READMEs 411 rewrote | Describe the loop to readers | not changed here, sent to 411 | 411 reported 10 already fixed, 2 fixed in `0af73b5d4d5`, 1 folded into this pass |
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
| Unit | Shim resolver, pass-through lists and launch function | `node --test skilled-loop-shell.test.cjs`, plus a mutation run with vibe removed |
| Integration | Hand-over loop suites and the OpenCode plugin suite on the merged tree | `node --test` with `AI_SESSION_CHILD` cleared |
| Manual | Every changed doc line against the code | Fresh Opus medium review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Worktree 411 rewrite of the hook READMEs | Internal | Green: merged as `0c6cd13ab0e` and `0af73b5d4d5` | Its 13 findings would stay open |
| OpenCode Go DeepSeek V4.1 Flash | External | Green | No fix executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A merged doc or the shim proves wrong in use.
- **Procedure**: Revert the merge commit of `worktrees/424-handover-doc-alignment` on main. The shim change is one commit, `f3a2624d047`, and reverts on its own.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: report, split, worktree | The doc alignment run | Implementation |
| Implementation: G0 to G4, review, G5 | Setup | Verification |
| Verification: suites, validation | Implementation | Merge to main |
<!-- /ANCHOR:phase-deps -->
