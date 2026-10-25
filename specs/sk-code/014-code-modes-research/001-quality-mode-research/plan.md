---
title: "Implementation Plan: Phase 1: quality-mode-research"
description: "Plan for ten deep-research iterations on sk-code-quality, one angle each, followed by one synthesis that ranks the recommendations. Research only, no hub change."
trigger_phrases:
  - "quality mode research plan"
  - "sk-code-quality research angles"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: quality-mode-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and shell scripts, all read only |
| **Framework** | The `/deep:research` loop of the system-deep-loop skill |
| **Storage** | Files under `research/` in this phase folder |
| **Testing** | `validate.sh --strict` and the command checks in `acceptance-criteria.md` |

### Overview

This phase runs ten research iterations on `sk-code-quality`, one angle each, then one synthesis pass that writes `research/research.md`. The loop reads the quality packet, the hub routing files and the mode-extension reference, and it writes nothing outside `research/`. The synthesis ranks the recommendations by how much they help the three goals: repo-agnostic, useful and integrated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Executor alternation unit confirmed (parent spec, open question 1)
- [ ] Each executor probed with a one-line dispatch

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `research/research.md` ranks at least eight recommendations
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A ten-angle research loop with one synthesis pass. Each iteration answers one angle and writes one record file. The synthesis merges the ten records into the four sections of `research/research.md`.

### Key Components
- **Brief**: names the reading list, the evidence labels and the source-tag format, and is the same for every iteration.
- **Iteration records**: `research/iterations/iteration-001.md` through `iteration-010.md`, one angle each.
- **Loop state**: `research/deep-research-state.jsonl`, which records each iteration and the stop reason.
- **Synthesis**: `research/research.md` with Repo-Agnostic Findings, Usefulness Findings, Integration Findings (External-User Modes inside it) and Ranked Recommendations.

### Data Flow

The reading list feeds each iteration. Each iteration appends a record to the state log and writes its file. After iteration ten the synthesis reads the ten files and writes `research/research.md`. Recommendations are ranked by gain across the three goals, with evidence strength and low effort breaking ties.

### The Ten Angles

Odd iterations run on Luna max fast via cli-codex and even iterations on DeepSeek flash max 1017 via cli-pi through llmgateway. Paths are relative to `.skilled/skills/sk-code/` unless stated.

| Iter | Angle | Starting sources | Question to answer |
|------|-------|------------------|--------------------|
| 1 | Repo-bound inventory | `sk-code-quality/SKILL.md`, `sk-code-quality/scripts/README.md` | Which `.skilled/`, `.opencode/` and `.github/` references does the packet hold, and is each portable, configurable or repo-bound? |
| 2 | The UNKNOWN-surface path | `shared/references/stack-detection.md` lines 36 and 89, `ROUTER.md` section 8 | What does a quality run do in a repository with no `.skilled/` tree, and what is the smallest portable core? |
| 3 | Checker portability | `scripts/check-comment-hygiene.sh`, `scripts/check-dist-staleness.sh`, `scripts/ceiling-report.sh` | What must a repository satisfy for each checker to run, and where would a repo-local setting go? |
| 4 | Usefulness evidence | `sk-code-quality/benchmark/reports/`, `manual-testing-playbook/quality-gate/`, `changelog/` | What does the gate catch, cost and miss, and where is it ceremony? |
| 5 | Handoff to verify and debug | `sk-code-quality/SKILL.md` lines 189 to 223, `shared/references/workflow-verify.md` | Who consumes the CODE_QUALITY_RESULT envelope, and where does the handoff go when no surface carries a workflow document? |
| 6 | Quality and review boundary | `sk-code-review/SKILL.md`, `sk-code-review/assets/code-quality-checklist.md`, `ROUTER.md` line 292, `hub-router.json` line 7 | How do the two checklists, the shared CODE_QUALITY intent and the tie-break order divide the work? |
| 7 | Surface packets | `sk-code-skilled/assets/checklists/`, `sk-code-ci/SKILL.md`, `mode-registry.json` line 18 | How does quality find the right checklist per surface, and could a surface declare its own? |
| 8 | User-authored modes | `parent-skills-nested-packets.md` sections 6 and 7, `.skilled/repo-rules/skill-hub-routing.md` | What does a user's workflow or surface mode need from quality, and which of the eleven rows carries it? |
| 9 | Repo-local configuration | `specs/sk-code/013-private-surface-skills/spec.md`, `hub-router.json`, `mode-registry.json` | Where could a repository keep its own target-path map, checklists and artifact-label patterns without forking the hub, and what does each option cost? |
| 10 | Floors and proof | `sk-code-quality/SKILL.md` section 4, `scripts/*.test.sh`, `.skilled/repo-rules/skill-hub-routing.md` | Which behaviors may no recommendation relax, and how would a later change be proven through both routing stages? |

### Launch

Run each iteration with the spec folder `specs/sk-code/014-code-modes-research/001-quality-mode-research`. The command line is:

```bash
/deep:research:auto "How to make sk-code-quality more repo-agnostic, more useful and better integrated with sibling and user-authored modes" --spec-folder=specs/sk-code/014-code-modes-research/001-quality-mode-research --max-iterations=10 --stop-policy=max-iterations
```

Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` and `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` before composing a dispatch brief for either executor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes nothing. The table records that the subject files are read and left alone.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/` | The subject under study | Unchanged | `git diff --stat` from the recorded HEAD prints no path under `.skilled/` |
| `research/` in this phase folder | The only write target | Create | `ls research/iterations` lists ten files |
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
| Structure | Ten iteration files, ten state records, a stop reason and the four `research.md` sections | `ls`, `grep -c` |
| Citation | Three source tags opened by the orchestrator and every tag resolved by the validator | `validate.sh --strict`, `SOURCE_TAGS` rule |
| Boundary | No changed path under `.skilled/` | `git diff --stat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` with Luna max fast | External | Yellow, not yet probed | Odd iterations cannot run |
| `cli-pi` with DeepSeek flash max 1017 through llmgateway | External | Yellow, not yet probed | Even iterations cannot run |
| The `/deep:research` command and its workflow | Internal | Green, present in `.skilled/commands/deep/` | The loop cannot start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A run writes outside `research/` or changes a path under `.skilled/`.
- **Procedure**: Restore any tracked path with `git restore -- .skilled`, then remove the stray untracked files the run created and relaunch from the state log.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (probe executors) ──► Iterations 1 to 10 ──► Synthesis ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Iterations |
| Iterations | Setup | Synthesis |
| Synthesis | Iterations | Verify |
| Verify | Synthesis | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Two one-line executor probes |
| Iterations | Medium | Ten relaunches from saved state, one per iteration |
| Synthesis | Medium | One pass over ten records |
| Verification | Low | The command checks in `acceptance-criteria.md` |
| **Total** | **Medium** | **Wall time depends on provider speed and is not estimated here** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- No data changes and no feature flag apply to a research phase.
- Record the HEAD sha in the goal log before the first iteration so the boundary check has a baseline.

### Rollback Procedure
1. Stop the loop and keep `research/deep-research-state.jsonl`.
2. Restore any tracked path outside `research/` with `git restore`.
3. Remove untracked files outside `research/` that the run created.
4. Relaunch from the state log once the stray write has a named cause.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

