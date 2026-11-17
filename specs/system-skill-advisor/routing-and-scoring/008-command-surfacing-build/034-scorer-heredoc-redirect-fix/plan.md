---
title: "Implementation Plan: Phase 34: scorer-heredoc-redirect-fix"
description: "Strip heredoc bodies in the scorer's redirect parser, pin it with three tests, rescore the committed phase 033 lines and log the corrected verdict and B-5 trigger."
trigger_phrases:
  - "scorer heredoc redirect fix plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 34: scorer-heredoc-redirect-fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules in the advisor runtime's `routing-accuracy` folder, Vitest |
| **Framework** | `score-command-transcripts.mjs`, its `normalize`, `startedCommand` and `--summary` paths |
| **Storage** | Rescore summary and evidence in this phase's `scratch/`. Sessions read from the five runtimes' stores through `loadSession` |
| **Testing** | `tests/command-transcript-score.vitest.ts`, the full advisor suite, `FLOOR` and `EVAL` as no-change checks |

### Overview
`redirectTargets` gains the same first line `shellReadTargets` and `shellWriteTargets` already have: it replaces each heredoc body with its opening line before it scans for `>`. Three tests pin the body case, the opening-line case and the DSH start shape. Then the committed 033 run lines are rescored with the fixed scorer, the 026 filters write the evidence, and the arm target and the B-5 rule (P036) decide the goal rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The worktree is clean at the segment five commit and the advisor suite reports 0 failed
- [ ] `heredoc-probe.mjs` prints the body write `0:` and `heredoc-reach.mjs` prints 12 lines, as `spec.md` quotes
- [ ] All 401 run lines of 033 load through `loadSession`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The probe prints `body [] started null`, and the reach script prints 0 on all five runtimes
- [ ] The goal log holds the rescored verdict and B-5 trigger rows
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: the parser that names a write target, not each reader of the write boundary.

### Key Components
- **`redirectTargets`**: scans a shell command for `>` outside quotes and returns each target. It now strips heredoc bodies first
- **`HEREDOC_BODY`**: the existing pattern that keeps a heredoc's opening line and drops its body and end word
- **Rescore**: the committed `--summary ... --pair off,on --json` call over 033's logs, written to this phase's `scratch/`

No new file, module, option or dependency in the runtime. The two scratch scripts are the committed source of the measured numbers.

### Data Flow
`normalize` passes each shell command to `redirectTargets` and `shellWriteTargets`. A target becomes a `write` event, and `firstWritePosition` makes the first in-checkout one the boundary that `startedCommand`, `followedBeforeWrite` and `workflowPath` read. The summary pairs the arms and the 026 filters print the evidence lines.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `redirectTargets` | Names redirect targets, heredoc bodies included | Strip bodies first | The three new tests and the probe |
| `shellReadTargets`, `shellWriteTargets` | Already strip bodies | None | Existing tests stay green |
| `firstWritePosition` consumers: `startedCommand`, `followedBeforeWrite`, `ownerLoadedBeforeWrite`, `workflowPath` | Read the boundary | None, they get fewer false writes | The rescore diff |
| `033-untuned-arm-arena-run/scratch/` | The arm's committed evidence | Read only | `git diff --quiet` on that folder |
| `../goal.md` | Parent goal log | New rows through the goal log command | `rg -c` per row and `packet_budget=ok` |

Required inventories:
- Same-class producers: `shellReadTargets` and `shellWriteTargets` (both already strip), `patchPaths` (reads patch headers, no `>` scan).
- Consumers of changed symbols: `normalize` is the only caller of `redirectTargets`.
- Matrix axes: heredoc body comparison, opening-line redirect, redirect after the end word, quoted `>`, unterminated heredoc.
- Algorithm invariant: a word counts as a redirect target only when the shell would open that file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the before state: suite, `FLOOR`, `EVAL`, the probe, the reach count and a load check of all 033 lines. Implementation changes `redirectTargets` and adds three tests. Verification reruns the gates, rescores the 033 lines, writes the evidence and diff and logs the goal rows. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Body comparison, opening-line redirect, DSH start shape | Vitest |
| Integration | The full advisor suite, `FLOOR` and `EVAL` before and after | Vitest, the two capture scripts |
| Manual | None. The rescore and the goal rows come from printed lines | The scorer and the 026 filters |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Session stores of claude, opencode, pi, devin and dsh holding the 033 sessions | Internal | Green, 401 of 401 loaded on 2026-11-16 | The rescore cannot cover a runtime, and the phase stops |
| 026 jq filters `FOLLOWED`, `PAIRED`, `POOLED`, `STARTS`, `DELIVERY` and `MISMATCH` | Internal | Green | The evidence cannot be written as 033 wrote it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite failure that the fix causes, or `FLOOR` or `EVAL` changing
- **Procedure**: revert the one commit that changes `score-command-transcripts.mjs` and its test file. The rescore files live only in this phase's `scratch/`, and goal rows are append-only, so a wrong row gets a correction row
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
| Setup (before state, load check) | A clean worktree | Implementation |
| Implementation (fix, tests) | The before state on file | Verification |
| Verification (gates, rescore, evidence, goal rows) | A green suite with the fix | Close-out |
<!-- /ANCHOR:phase-deps -->

---
