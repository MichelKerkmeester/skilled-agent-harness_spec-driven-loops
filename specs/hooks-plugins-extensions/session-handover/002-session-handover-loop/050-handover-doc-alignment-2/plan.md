---
title: "Implementation Plan: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check"
description: "DeepSeek V4.1 Flash at max fixes the findings in five briefs grouped by doc area and run one at a time inside the worktree, a fresh Opus medium agent reviews every changed line against the code, and DeepSeek applies what the review confirms."
trigger_phrases:
  - "handover doc alignment 2 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, Node test runner |
| **Framework** | Session hand-over loop (`skilled-loop`, per-runtime adapters) |
| **Storage** | None |
| **Testing** | `node --test` hand-over suites, drift guards, hook registration check |

### Overview
The findings come from one `/local-doc-alignment session-handover` run over all 86 docs with six lanes. DeepSeek V4.1 Flash at max fixes them in five briefs (G1 to G5) grouped by doc area, run one at a time through the alignment lane runner inside worktree 431. A fresh Opus medium agent reviews the result, and a sixth brief (G6) applies what it confirms.
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
Report, fix, review: a findings report drives fix briefs, and an independent model reviews the fixes against the code.

### Key Components
- **Findings report**: `~/.local/state/local-doc-alignment/Skilled/20261116T100930Z/findings.json`, 50 findings.
- **Fix briefs**: G1 hook docs, G2 spec-kit catalog and README, G3 playbooks, G4 root and command READMEs, G5 cli skill docs, G6 review fixes, each run by `run-lanes.cjs --lanes <id>` with the `opencode-go` preset.
- **Review**: a fresh Opus medium agent with the diffs, the code roots and the findings, and no conclusions.

### Data Flow
findings.json → five area briefs → DeepSeek edits in 431 → Opus review → G6 brief → final checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hand-over docs under `.skilled/hooks/` and `.skilled/bin/` | Describe the loop to readers | update | Opus review against the code at HEAD |
| Spec-kit catalog and playbooks | Describe and test the loop | update | CL-6 and CX-4 probes run with eleven PASS lines each |
| Root `README.md` | Product overview | unchanged: main's rewrite removed all five flagged sentences | grep finds no history-lookup, build-step or locator text |
| Hand-over code | Source of truth | unchanged | `git diff --stat` lists docs only |
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
| Unit | The CL-6 and CX-4 playbook probes as edited | Run in a sandbox by the reviewer |
| Integration | Hand-over loop suites and the OpenCode plugin suite on the merged tree | `node --test` with `AI_SESSION_CHILD` cleared |
| Manual | Every changed doc line against the code | Fresh Opus medium review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode Go DeepSeek V4.1 Flash | External | Green | No fix executor |
| Main's root README rewrite | Internal | Green: merged before this pass | Five README findings would need edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A merged doc proves wrong in use.
- **Procedure**: Revert the merge commit of `worktrees/431-handover-doc-alignment-2` on main. No code changed, so nothing else depends on it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: report, worktree, briefs | The doc alignment run | Implementation |
| Implementation: G1 to G5, review, G6 | Setup | Verification |
| Verification: suites, validation | Implementation | Merge to main |
<!-- /ANCHOR:phase-deps -->
