---
title: "Implementation Plan: Phase 5: verification-and-rollout"
description: "Score a fixed case set blind against a baseline captured in phase 003's setup, attribute every recorded result to its provider and its change kind, then regenerate each derived runtime surface."
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
| **Testing** | The harness is the test. Its own correctness is checked by a negative control |
| **Baseline provenance** | Captured during phase 003's setup, before its first edit, never at this phase's start |

### Overview

Score a fixed set of reply cases under two conditions, blind to which produced which, and report the
per-dimension delta against a baseline captured during phase 003's setup. A negative control comes
first: a case the adopted rules should not affect must score the same under both conditions, or the
harness has measured the label rather than the reply.

Four things follow from the two research runs, and each one changes what the harness must do.

1. **The baseline belongs to phase 003's setup.** A baseline taken after the rules change cannot
   support a regression claim, so the capture precedes phase 003's first edit. This phase inherits
   the recorded baseline plus the frozen cases and rubric. It confirms their provenance and it does
   not re-derive them.
2. **The release gate names a gap.** The source's gate carries four numbered conditions. One of them
   needs a powered blind human study, meaning a study with enough human participants to detect the
   effect and judged blind. This repository has no capability that produces that evidence, so the gate
   names the condition as a gap rather than inheriting it.
3. **Every recorded result names its provider.** Both provider profiles now use provider-default
   thinking mode, so two providers can default differently. The provider is an uncontrolled variable
   and it is recorded per result rather than assumed away.
4. **A no-op is separated from a rewrite.** Phase 004 adds the change-kind field. While a no-op row
   stays indistinguishable from a rewrite, a quality delta describes the mix of rows rather than the
   rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The baseline from phase 003's setup is present, and its capture predates phase 003's first edit
- [ ] The cases and the rubric are frozen, so neither condition can be tuned to them after the fact
- [ ] Phase 004's accept record exposes the change-kind field including its no-op value

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

A blind two-condition comparison over fixed cases. The conditions are the pre-change and the
post-change rule sets. The cases are fixed before either run, so neither condition can be tuned to
them after the fact. The baseline run happens during phase 003's setup, which is the last moment at
which the pre-change rule set stays observable.

### Baseline Provenance

The baseline is captured in phase 003's setup before its first edit, because a baseline taken after
the rules change cannot support a regression claim. It is recorded with the same cases, rubric and
scoring procedure the after-run uses, and REQ-001 makes that equality the criterion rather than an
assumption.

The capture is confirmed here and not repeated. This phase reads the recorded baseline, its manifest
and its capture time, then checks that the three predate phase 003's first edit. Where the capture is
missing, no regression claim is possible, so the phase reports the absence instead of constructing a
before from a state that has already changed.

### Release Gate

REQ-004 restricts the gate to conditions this repository can observe. Every condition below names the
command or the artifact that produces it, and the gate carries no condition resting on evidence this
repository cannot produce.

1. No blocking finding in the candidate condition, where the rubric's blocking class defines what a blocking finding is.
2. Correctness and safety each hold within 0.1 points of the baseline or better, which is the tolerance the source's rubric uses.
3. The weighted score beats the baseline.
4. Every derived runtime surface matches its source.
5. Recursive strict validation reports PASSED for the parent and every child folder it carries.
6. No measured regression stands unfixed or unwaived.

The source's gate is stricter than condition 1 and that strictness is not inherited unmodified. Its
absolute rule failed a release that improved every dimension it measured, so a blocking finding is
counted against the rubric's blocking class rather than against the survival of any finding anywhere.

**Named gap.** The source's gate carries four numbered conditions. One condition needs a powered
blind human study, and this repository has no capability that produces that evidence. The gate names
that condition as a gap, and no completion claim in this program may state that it was met.

### Result Attribution

Both provider profiles use provider-default thinking mode, which kept a provider from being refused
for a capability it cannot prove. The cost of that decision lands here: two providers can apply
different defaults, so a quality delta cannot be fully attributed to the rules.

The harness records the provider that produced every result, in the same row as the score, so the
variable stays visible even though it is not controlled. Where a dimension moves and the cases do not
explain the move, the first check is whether the two compared rows came from different providers.
That check is recorded with the delta rather than left to the reader.

### No-op Separation

Phase 004 records what kind of change a candidate made, and an unchanged candidate carries its own
no-op value instead of hiding inside a pass. The harness reads that field and reports no-op rows
apart from rewrite rows.

The separation matters because a no-op row measures the judge and the run rather than the rules. Its
score can move with no rule having changed the reply, so counting it inside the rule delta would
credit the rules for that movement. A row whose change kind is missing is reported as unclassified,
and an unclassified row blocks the delta's interpretation rather than defaulting to a value.

### Key Components

- **Case set**: reply prompts targeting the specific failures the adopted rules name, plus control cases no adopted rule covers.
- **Negative control**: a case the adopted rules should not affect, whose score must not move. The research proposed a reader asking for a restatement. A control case that moves means the harness has stopped measuring the rules.
- **Rubric**: weighted dimensions with a blocking class, scored one to five, with condition labels withheld from the judge.
- **Runner**: produces one scored result file per condition, refuses to run on a malformed case set, and records the provider plus the change kind on every row.
- **Change-kind separator**: reads the accept record phase 004 writes, and reports no-op rows apart from rewrite rows.
- **Persistence mechanism**: an opt-in, fail-open re-assertion surface, and only if phase 002's allocation names one.
- **Regeneration step**: rebuilds the sections of runtime root docs that derive from the repository root doc.

### Data Flow

Cases plus a condition produce replies. Replies plus the rubric produce scores. Every scored row
carries the provider that produced the reply and, where the engine lane produced it, the change kind
from the accept record. Scores plus the baseline produce the delta. The delta is what the program's
completion claim rests on, so it is recorded as an artifact rather than quoted from memory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a measurement surface and regenerates derived content, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill benchmark folder | Holds the skill's existing benchmark reports | Extend with the reply-scoring harness | The runner executes from a clean checkout and writes a result file |
| Phase 004's accept record | Carries the change-kind field including the no-op value | Read here, never written from here | Every scored row names a change kind that exists in the record |
| Provider profiles | Both use provider-default thinking mode | Read here, never written from here | Every recorded row names the provider that produced it |
| Session-start hook surface | Runs at session start across runtimes | Add an opt-in, fail-open mechanism, and only if phase 002's allocation names one | A deliberately broken flag file still exits zero and starts the session |
| Codex runtime root doc | Carries a section generated from the repository root doc | Regenerate | Compare the generated section against its source |
| Per-runtime sync manifests | Document which surfaces derive from which | Update if a new derived surface is added | Read each manifest against the surfaces it claims |
| Rule files and skill contracts | The subject being measured | Not a consumer, unchanged here | The scoped diff shows no change under `repo-rules/` or the skill's contract |

Required inventories:
- Same-class producers: every surface generated from the repository root doc. `rg -n 'generated from the root AGENTS.md|generated from' .codex .claude .cursor .pi .devin --glob '*.md'`
- Consumers of changed symbols: every runtime that reads a regenerated section. Each runtime directory's own sync manifest is the inventory.
- Matrix axes: condition by case class. Two conditions times target cases and control cases is the required row set.
- Algorithm invariant: a control case's score does not move between conditions.
- Adversarial cases carry four shapes of their own.
  - A judge that can infer the condition from formatting
  - A case set edited after the first run
  - A run that records a default score on a scoring failure
  - A run whose rows carry no provider
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The order carries one hard constraint. Setup confirms the phase 003 baseline plus the frozen cases, so
nothing in Implementation may run against an unverified before-state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The runner's case parsing and its refusal on a malformed set | The repository's existing Node test runner |
| Integration | A full two-condition run producing two result files and a delta | The harness itself, from a clean checkout |
| Manual | The negative control's score did not move, and the judge could not see the condition | Read the recorded runs and the rubric's blinding block |
| Manual | Every row names its provider, and no-op rows sit apart from rewrite rows | Read each run manifest against phase 004's accept record |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Every phase that changes a rule or a contract has landed, which the parent map orders as 003, 006, 008, 007, 004 and 009 | Internal | Red until each closes | The after-condition measures a partly changed rule set, so the delta describes the mix |
| The baseline captured in phase 003's setup | Internal | Yellow, and it must have been captured before phase 003's first edit | No regression claim is possible, and the phase reports the absence rather than a before |
| Phase 004's change-kind field including its no-op value | Internal | Yellow | A no-op is indistinguishable from a rewrite, so a quality delta is uninterpretable |
| The recorded provider on every result | Internal | Yellow, because provider-default thinking mode leaves that variable uncontrolled | A dimension's movement has nothing to be traced to |
| A recorded gate-strictness rule | Internal | Red, the decision record's eight ADRs do not carry one | The gate would inherit the source's absolute blocking rule, which failed a release that improved every dimension |
| A scoring surface independent of the author | External | Yellow | A self-judged run is the same opinion twice, so the result is reported as such |
| The regeneration script for derived root-doc sections | Internal | Green | The Codex root doc drifts from the repository root doc |

REQ-007 states that recursive strict validation covers the parent and five children. The parent map
lists nine phase folders, because folders 006 to 009 were created after the research changed the work.
The criterion is therefore stated against every child folder the parent actually carries.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The persistence mechanism interferes with a session start, or a measured regression appears on any dimension.
- **Procedure**: Remove the opt-in flag file to disable the mechanism without a code change, then remove the mechanism itself if the interference persists. A measured regression is reverted in the phase that landed the rule, not here, because this phase owns no rule text.
- **Measurement artifacts**: The recorded runs and the baseline stay in place. A run that revealed a problem is the evidence for it, and a deleted baseline cannot be re-captured once the rules have changed.
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
3. Start a fresh session and confirm it starts cleanly
4. Leave the recorded runs in place, because a run that revealed a problem is the evidence for it

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, the recorded runs and the baseline are append-only artifacts
<!-- /ANCHOR:enhanced-rollback -->

---
