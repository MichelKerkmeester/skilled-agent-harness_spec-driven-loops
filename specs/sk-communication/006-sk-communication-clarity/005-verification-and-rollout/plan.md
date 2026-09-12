---
title: "Implementation Plan: Phase 5: verification-and-rollout"
description: "Score a fixed case set blind against a baseline captured in phase 003's setup, attribute every recorded result to its provider plus its change kind, then regenerate each derived runtime surface."
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
| **Framework** | The skill's existing benchmark folder plus the repository's existing hook surfaces |
| **Storage** | Recorded run directories under the benchmark folder, immutable once written |
| **Baseline provenance** | Captured in phase 003's setup before its first edit, never at this phase's start |

### Overview

Score a fixed case set under two conditions, blind to which produced which, then report the
per-dimension delta against a baseline captured during phase 003's setup. A negative control comes
first, because a control case whose score moves means the harness measured the label rather than the
reply.

Four things follow from the two research runs.

- **The baseline is phase 003's.** A baseline taken after the rules change cannot support a regression claim. The capture therefore precedes phase 003's first edit. This phase inherits that capture rather than re-deriving it.
- **The release gate names a gap.** The source's four numbered conditions include one that needs a powered blind human study. This repository cannot produce that evidence, so the gate names the gap instead of inheriting the condition.
- **Every result names its provider.** Both profiles use provider-default thinking mode, so two providers can default differently. The variable is recorded rather than assumed away.
- **A no-op is not a rewrite.** Phase 004 adds the change-kind field, without which a quality delta describes the mix of rows rather than the rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The baseline from phase 003's setup is present. Its capture predates phase 003's first edit

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] The delta report carries a provider and a change kind on every row
- [ ] Each derived runtime surface matches its source
- [ ] Recursive strict validation reports PASSED for the parent and every child folder it carries
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A blind two-condition comparison over fixed cases, where the conditions are the pre-change and post-change rule sets and the cases are fixed before either run. The baseline run happens during phase 003's setup, which is the last moment at which the pre-change rule set stays observable.

### Baseline Provenance

The baseline is captured in phase 003's setup before its first edit, because a baseline taken after
the rules change cannot support a regression claim. It uses the same cases, rubric and procedure the
after-run uses. REQ-001 makes that equality the criterion rather than an assumption.

This phase confirms the capture instead of repeating it. It reads the recorded baseline, its manifest and its capture time, then checks that the three predate phase 003's first edit. A missing capture leaves no regression claim possible, so the phase reports the absence.

### Release Gate

REQ-004 restricts the gate to observable conditions. Each one below names the command or the artifact
that produces it.

1. No blocking finding in the candidate condition, as the rubric's blocking class defines one.
2. Correctness and safety each hold within 0.1 points of the baseline or better.
3. The weighted score beats the baseline.
4. Every derived runtime surface matches its source.
5. Recursive strict validation reports PASSED for the parent and every child folder it carries.
6. No measured regression stands unfixed or unwaived.

The source's absolute blocking rule is not inherited unmodified, because it failed a release that
improved every dimension. A blocking finding is counted against the rubric's blocking class instead.

**Named gap.** One of the source's four numbered conditions needs a powered blind human study, meaning a study with enough participants to detect the effect and judged blind. This repository has no capability that produces that evidence, so the gate names the condition as a gap and no completion claim may state that it was met.

### Result Interpretation

Both profiles use provider-default thinking mode, which kept a provider from being refused for a
capability it cannot prove. The cost lands here, because two providers can apply different defaults
and a delta therefore cannot be fully attributed to the rules.

The harness records the provider that produced every result in the same row as the score, so the
variable stays visible without being controlled. Where a dimension moves and the cases do not explain
the move, the first check is whether the two compared rows came from different providers.

Phase 004 also records what kind of change a candidate made. An unchanged candidate carries a no-op value instead of hiding inside a pass, so the harness can report no-op rows apart from rewrite rows. The separation matters because a no-op row measures the judge and the run rather than the rules. A row whose change kind is missing is reported as unclassified and blocks the delta's interpretation.

### Components

- **Case set and negative control**: reply prompts targeting the failures the adopted rules name, plus control cases no adopted rule covers and whose scores must not move.
- **Rubric**: weighted dimensions with a blocking class, scored one to five, with condition labels withheld from the judge.
- **Runner**: one result file per condition, a refusal on a malformed case set, a provider plus a change kind on every row. No-op rows are reported apart from rewrite rows.
- **Persistence mechanism and regeneration step**: the opt-in fail-open re-assertion surface if phase 002's allocation names one, plus the rebuild of runtime root-doc sections that derive from the repository root doc.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a measurement surface and regenerates derived content, so the table applies in full and the inventories below are required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill benchmark folder | Holds the skill's existing benchmark reports | Extend with the reply-scoring harness | The runner executes from a clean checkout and writes a result file |
| Phase 004's accept record | Carries the change-kind field including its no-op value | Read here, never written from here | Every scored row names a change kind that exists in the record |
| Provider profiles | Both use provider-default thinking mode | Read here, never written from here | Every recorded row names the provider that produced it |
| Session-start hook surface | Runs at session start across runtimes | Add an opt-in, fail-open mechanism, only if phase 002's allocation names one | A deliberately broken flag file still exits zero and starts the session |
| Codex runtime root doc | Carries a section generated from the repository root doc | Regenerate | Compare the generated section against its source |
| Per-runtime sync manifests | Document which surfaces derive from which | Update if a derived surface is added | Read each manifest against the surfaces it claims |

Required inventories:
- Same-class producers: every surface generated from the repository root doc. `rg -n 'generated from the root AGENTS.md|generated from' .codex .claude .cursor .pi .devin --glob '*.md'`
- Consumers: every runtime that reads a regenerated section, per its own sync manifest.
- Matrix axes: condition by case class, so two conditions times target cases and control cases. Algorithm invariant: a control case's score does not move between conditions.
- Adversarial shapes: a judge that can infer the condition, a case set edited mid-run, a default score recorded on a scoring failure, rows carrying no provider.
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
| Manual | The control score did not move. The judge could not see the condition. Every row names its provider and its change kind | Read the recorded runs, the blinding block and phase 004's accept record |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Every phase that changes a rule or a contract has landed, which the parent map orders as 003, 006, 008, 007, 004 and 009 | Internal | Red until each closes | The after-condition measures a partly changed rule set, so the delta describes the mix |
| The baseline captured in phase 003's setup | Internal | Yellow. It must predate phase 003's first edit | No regression claim is possible. The phase reports the absence rather than a before |
| Phase 004's change-kind field including its no-op value | Internal | Yellow | A no-op is indistinguishable from a rewrite, so a quality delta is uninterpretable |
| The recorded provider on every result | Internal | Yellow, because provider-default thinking mode leaves that variable uncontrolled | A dimension's movement has nothing to be traced to |
| A recorded gate-strictness rule | Internal | Red, the decision record's eight ADRs do not carry one | The gate would inherit the source's absolute blocking rule, which failed a release that improved every dimension |
| The regeneration script for derived root-doc sections | Internal | Green | The Codex root doc drifts from the repository root doc |

REQ-007 states that recursive strict validation covers the parent and five children. The parent map lists nine phase folders, because folders 006 to 009 were created after the research changed the work. The criterion is checked against every child folder the parent carries rather than against that count.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The persistence mechanism interferes with a session start. A measured regression on any dimension triggers the same response.
- **Procedure**: Remove the opt-in flag file to disable the mechanism without a code change, then remove the mechanism itself if the interference persists. A measured regression is reverted in the phase that landed the rule, not here, because this phase owns no rule text.
- **Measurement artifacts**: The recordings stay in place, because a run that revealed a problem is the evidence for it. A deleted baseline cannot be re-captured once the rules have changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline provenance ──► Frozen cases and rubric ──► Negative control ──► Two-condition run ──► Delta report with provider and change kind ──► Mechanism and regeneration ──► Packet closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline provenance | Phase 003's setup, which captured it | Every later step, because a before has to exist before an after |
| Frozen cases and rubric | Phase 003's setup, which froze them | Negative control |
| Negative control | Frozen cases and rubric | Two-condition run |
| Two-condition run | Baseline provenance plus the frozen cases and rubric | Delta report |
| Delta report | Two-condition run plus phase 004's change-kind field | Mechanism and regeneration |
| Mechanism and regeneration | Delta report | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2 hours confirming the baseline's provenance plus the frozen cases, which are inherited rather than drafted here |
| Core Implementation | High | 5 to 7 hours for the runner, the rubric wiring, the attribution fields and the mechanism |
| Verification | Medium | 2 hours for the run, the delta and the recursive validation |
| **Total** | | **About 9 to 11 hours** |
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
3. Start a fresh session and confirm it starts cleanly, leaving the recorded runs in place because a run that revealed a problem is the evidence for it

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, the recorded runs and the baseline are append-only artifacts
<!-- /ANCHOR:enhanced-rollback -->

---
