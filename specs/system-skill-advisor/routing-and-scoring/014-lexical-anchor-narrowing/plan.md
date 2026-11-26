---
title: "Implementation Plan: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "Measure each false lift, attribute it to its anchor clause, and try candidate rules against the ratchet, the probes and the pinned slices before landing any."
trigger_phrases:
  - "lexical anchor narrowing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Advisor scorer (`fusion.ts`, `lanes/lexical.ts`) |
| **Storage** | None |
| **Testing** | In-process ratchet metrics and probes, the full advisor vitest suite, the browser hub replay |

### Overview

Candidate changes to when a skill counts as named, with ranking left alone: score the lexical anchor only on prompt words few skills share, make the direct-score lift need a named anchor, and read the id noun's companion word from the prompt. Each candidate is measured on the ratchet, the probes and the full suite. None landed: every candidate moved pinned command and doctor rows, and the operator chose to record and stop (Q012).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Each probe lift is attributed to the anchor clause that fired it.

### Definition of Done

- Every REQ in `spec.md` is Met in `acceptance-criteria.md`, and `validate.sh --strict` prints RESULT: PASSED.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure, attribute, then change the producer. A temporary trace in `fusion.ts` recorded each clause per skill and was removed.

### Key Components

- `anchoringLexicalScore` in `lanes/lexical.ts`, with a per-projection count of skills sharing each word.
- `hasNamedAnchor`, `promptNamesIdNoun` and the direct-score branch of `confidenceFor` in `fusion.ts`.
- `lexicalAnchorMaxSkillShare` in `scoring-constants.ts`.

### Data Flow

The lexical lane still ranks on expanded tokens. Only the confidence floor reads the new anchor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Lexical anchor clause | Lifts a skill to 0.82 on a 0.45 lexical score | Score distinctive prompt words only | Probes; ratchet |
| Direct-score lift | Lifts any skill with direct score 0.65 or more | Needs a named anchor | Probes; ratchet; suite |
| Id-noun clause | Accepted a synonym as the second word | Prompt word in the skill's text | Doctor probe keeps its lift |
| Pinned slices and baselines | Consumers | Must not move | Full suite |
| Browser hub replay | Consumer | Must still fail only MBU-PB-04 | Replay |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Baseline the metrics and probes, then trace each lift to its clause.
2. Try candidate rules in order, measuring each: prompt words only, a sharing cap, the direct-lift anchor, the id-noun companion.
3. Land a candidate only if the full suite holds every pin; otherwise record the measurements and stop.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Pinned slices and scorer tests | `npx vitest run` in the advisor runtime |
| Integration | Two-stage routing | The browser hub replay |
| Manual | The five probe prompts | In-process probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pinned slices | Internal | Green | A moved pin stops the change for an operator decision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the advisor commit and rebuild `dist` with `npm run build` in the advisor runtime.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Attribution | Baseline | Candidates |
| Candidates | Attribution | Landing |
| Landing | Candidates | Closure |
<!-- /ANCHOR:phase-deps -->
