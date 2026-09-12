---
title: "Implementation Plan: Phase 5: verification-and-rollout"
description: "Build a blind reply-scoring harness against a pre-change baseline, close the persistence gap if adopted, then regenerate every derived runtime surface."
trigger_phrases:
  - "verification plan"
  - "blind scoring"
  - "baseline and delta"
  - "derived surface regeneration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: verification-and-rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node for the harness and any session hook, Markdown for cases and rubric |
| **Framework** | The skill's existing benchmark folder, and the repository's existing hook surfaces |
| **Storage** | Recorded run directories under the benchmark folder, immutable once written |
| **Testing** | The harness is the test; its own correctness is checked by a negative control |

### Overview

Score a fixed set of reply cases under two conditions, blind to which produced which, and report
the per-dimension delta against a baseline captured before phase 003's first edit. A negative
control comes first: a case the adopted rules should not affect must score the same under both
conditions, or the harness is measuring the label rather than the reply.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A blind two-condition comparison over fixed cases. The conditions are the pre-change and
post-change rule sets. The cases are fixed before either run, so neither condition can be tuned to
the cases after the fact.

### Key Components
- **Case set**: reply prompts targeting the specific failures the adopted rules name, plus control cases no adopted rule covers.
- **Rubric**: weighted dimensions with a blocking class, scored one to five, with condition labels withheld from the judge.
- **Runner**: produces one scored result file per condition, and refuses to run on a malformed case set.
- **Negative control**: a case the adopted rules should not affect, whose score must not move.
- **Persistence mechanism**: an opt-in, fail-open re-assertion surface, if phase 002 adopted one.
- **Regeneration step**: rebuilds the sections of runtime root docs that derive from the repository root doc.

### Data Flow

Cases plus a condition produce replies. Replies plus the rubric produce scores. Scores plus the
baseline produce the delta. The delta is what the program's completion claim rests on, so it is
recorded as an artifact rather than quoted from memory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a measurement surface and regenerates derived content, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill benchmark folder | Holds the skill's existing benchmark reports | Extend with the reply-scoring harness | The runner executes from a clean checkout and writes a result file |
| Session-start hook surface | Runs at session start across runtimes | Add an opt-in, fail-open mechanism, only if adopted | A deliberately broken flag file still exits zero and starts the session |
| Codex runtime root doc | Carries a section generated from the repository root doc | Regenerate | Compare the generated section against its source |
| Per-runtime sync manifests | Document which surfaces derive from which | Update if a new derived surface is added | Read each manifest against the surfaces it claims |
| Rule files and skill contracts | The subject being measured | Not a consumer, unchanged here | The scoped diff shows no change under `repo-rules/` or the skill's contract |

Required inventories:
- Same-class producers: every surface generated from the repository root doc. `rg -n 'generated from the root AGENTS.md|generated from' .codex .claude .cursor .pi .devin --glob '*.md'`
- Consumers of changed symbols: every runtime that reads a regenerated section. Each runtime directory's own sync manifest is the inventory.
- Matrix axes: condition by case class. Two conditions times target cases and control cases is the required row set.
- Algorithm invariant: a control case's score does not move between conditions. Adversarial cases are a judge that can infer the condition from formatting, a case set edited after the first run, and a run that records a default score on a scoring failure.
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
| Unit | The runner's case parsing and its refusal on a malformed set | The repository's existing Node test runner |
| Integration | A full two-condition run producing two result files and a delta | The harness itself, from a clean checkout |
| Manual | The negative control's score did not move, and the judge could not see the condition | Read the recorded runs and the rubric's blinding block |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003 and 004 landed | Internal | Red until both close | Nothing to measure |
| A pre-change baseline | Internal | Yellow, must be captured in phase 003's setup | No regression claim is possible, and the program closes without one |
| A scoring surface independent of the author | External | Yellow | A self-judged run is the same opinion twice, so the result is reported as such |
| The regeneration script for derived root-doc sections | Internal | Green | The Codex root doc drifts from the repository root doc |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The persistence mechanism interferes with a session start, or a measured regression appears on any dimension.
- **Procedure**: Remove the opt-in flag file to disable the mechanism without a code change, then remove the mechanism itself if the interference persists. A measured regression is reverted in the phase that landed the rule, not here, because this phase owns no rule text.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Negative control ──► Case set and rubric ──► Two-condition run ──► Delta report ──► Mechanism and regeneration ──► Packet closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Negative control | Case set drafted | Two-condition run |
| Case set and rubric | Phases 003 and 004 landed | Two-condition run |
| Two-condition run | Negative control, baseline | Delta report |
| Delta report | Two-condition run | Mechanism and regeneration |
| Mechanism and regeneration | Delta report | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2 to 3 hours drafting cases that target named failures rather than general quality |
| Core Implementation | High | 4 to 6 hours for the runner, the rubric and the mechanism |
| Verification | Medium | 2 hours for the run, the delta and the recursive validation |
| **Total** | | **About 8 to 11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Remove the opt-in flag file, which disables the mechanism with no code change
2. Remove the mechanism and its hook registration if the interference persists
3. Start a fresh session and confirm it starts cleanly
4. Leave the recorded runs in place, because a run that revealed a problem is the evidence for it

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, recorded runs are append-only artifacts
<!-- /ANCHOR:enhanced-rollback -->

---

