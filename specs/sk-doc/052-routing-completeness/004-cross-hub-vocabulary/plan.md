---
title: "Implementation Plan: Phase 4: cross-hub-vocabulary"
description: "How the bare-token collisions and the executor override were fixed, which files moved, and the three suites that proved no hub lost a prompt it owned."
trigger_phrases:
  - "cross hub vocabulary plan"
  - "executor override approach"
  - "three suite regression control"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase plan against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: cross-hub-vocabulary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing declarations plus TypeScript in the advisor scorer |
| **Framework** | The skill-advisor daemon and its two-stage hub routing |
| **Storage** | `graph-metadata.json`, `hub-router.json`, `mode-registry.json`, compiled manifests |
| **Testing** | Five hub canaries, three prompt suites, the committed scorer baseline |

### Overview

Each collision was decided by the losing hub's own written boundary rather than by
preference. Three bare tokens were qualified to the sense they meant, four declared phrases
were given a stage-two class so they stopped dropping after reaching their hub, and the
executor override was changed to lift the hub instead of inserting a rank-one entry with no
compiled route. Every routing edit shipped with regenerated manifests and re-pinned canary
digests in the same commit.
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
- [x] Tests passing: five canaries exit 0, manifests fresh for five hubs
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-stage hub routing. Stage one scores declared vocabulary to reach a hub identity, stage
two resolves a mode inside that hub, and the two stages read different files.

### Key Components
- **Hub vocabulary (`graph-metadata.json`)**: the declared words stage one scores.
- **Hub router (`hub-router.json`)**: the stage-two classes a reached hub resolves through.
- **Executor delegation (`executor-delegation.ts`)**: the run-time override that used to
  synthesize bare executor names at rank one with no compiled route.
- **Compiled-route manifests**: the frozen destination each hub serves, regenerated per edit.

### Data Flow

A prompt is scored against declared vocabulary, the winning hub identity is returned with its
compiled route, and the hub router picks the mode. A phrase declared in stage one with no
stage-two class reaches the hub and then drops, which reads as success everywhere except at
the point of use.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code/graph-metadata.json` | Declares the code hub's stage-one vocabulary | Updated: three bare tokens qualified | Code-hub own prompts unchanged across the corpus run |
| `sk-doc/graph-metadata.json` | Declares the documentation hub's vocabulary | Updated: phrasings people use rather than internal labels | `parent skill hub` moved from 0.48 to 0.77 |
| `sk-doc/hub-router.json` | Resolves a reached hub to a mode | Updated: stage-two classes for four dropping phrases | The declared-signal sweep found no signal left dropping |
| `cli-external-orchestration/hub-router.json` | Resolves executor modes | Updated: rebuilt around the compiled route | Bare executor names return the hub with a compiled route |
| `executor-delegation.ts` | Synthesizes executor candidates at run time | Updated: lifts the hub rather than inserting a routeless entry | Accuracy metrics byte-identical to the committed baseline |
| `holdout-prompts.jsonl`, `scorer-eval-baseline.json` | Gold labels and accuracy baseline | Updated: labels re-captured | Metrics compared against the previous baseline |
| Five hub canaries | Tripwire on any routing edit | Unchanged in behavior, digests re-pinned | All five exit 0, and a stale digest still fails |

Required inventories:
- Same-class producers: every hub declaring a bare single-word token was swept, not only the two that collided.
- Consumers of changed symbols: the stage-two class of each of the 84 declared hub signals was checked for a reach-then-drop shape.
- Matrix axes: hub owned prompts, cross-hub collisions, and out-of-scope controls, run as three separate suites.
- Algorithm invariant: a qualified match must outrank an incidental bare-token match, and no hub may lose a prompt it owns.
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
| Unit | Executor delegation override behavior | The advisor scorer parity fixtures |
| Integration | 444 declared signals, 180 realistic prompts, 224 out-of-scope controls | The advisor daemon through `skill-advisor.cjs` |
| Manual | Spot phrasings on both changed hubs, before and after | `advisor_recommend --format json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The advisor daemon | Internal | Green | Every number in the phase is unobtainable |
| Compiled-route manifests | Internal | Green | A routing edit cannot be shipped verified |
| The five hub canaries | Internal | Green | Regressions land unnoticed |
| Gate B corpus from phase 003 | Internal | Green | The phase cannot know its own limit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any hub losing a prompt it owns, or a canary failing after an edit.
- **Procedure**: revert the routing file to its previous state, regenerate the manifest, and
  re-run the three suites. One attempted fix was reverted this way during the phase.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Measure (Gate A, Gate B) ──┐
                           ├──► Fix vocabulary ──► Re-measure and re-pin
Sweep declared signals ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Measuring both gates first |
| Core Implementation | High | Four routing commits across three hubs |
| Verification | High | Three suites plus canaries and manifests per commit |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: the committed scorer accuracy baseline
- [x] Canary digests recomputed from files rather than copied from failure text
- [x] Manifest freshness confirmed for all five hubs

### Rollback Procedure
1. Revert the routing declaration that moved the row.
2. Regenerate the compiled-route manifest for the affected hub.
3. Re-run the three suites and the five canaries.
4. Record the reverted attempt as a finding rather than dropping it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Measure    │────►│  Fix        │────►│  Re-measure │
│  both gates │     │  collisions │     │  and re-pin │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Sweep    │
                    │  signals  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gate measurement | None | The corpus numbers that re-scoped the phase | Fix, Sweep |
| Vocabulary fix | Gate measurement | Qualified tokens and hub phrasings | Re-measure |
| Signal sweep | Gate measurement | Stage-two classes for dropping phrases | Re-measure |
| Executor override | Gate measurement | A hub lift instead of a routeless entry | Re-measure |
| Re-measure and re-pin | Fix, Sweep, Override | Manifests, canary digests, gold labels | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Measure Gate A and Gate B** - blocking, since the scope depends on the answer - CRITICAL
2. **Fix the bare-token collision** - the largest single move on the documentation hub - CRITICAL
3. **Change the executor override** - the commit that carries the Gate A move - CRITICAL
4. **Re-measure, re-pin, regenerate** - CRITICAL

**Total Critical Path**: one session, ordered by measurement before change.

**Parallel Opportunities**:
- The declared-signal sweep runs alongside the vocabulary fix.
- Out-of-scope hub controls run alongside the owned-prompt suites.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Bare tokens qualified | Documentation hub reaches its own creation intents | `f8c2595ce0` |
| M2 | Dropping phrases resolved | No declared signal reaches a hub and resolves to nothing | `461ef9261f` |
| M3 | Executor override corrected | Gate A 234 to 328 of 444, metrics byte-identical to baseline | `08eb67a0de` |
| M4 | Limit recorded | The 94-row bucket is stated with its number | `4a5de9e52b` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Remove the duplicate bare-name entries rather than reweight them

**Status**: Accepted

**Context**: bare executor names outranked their own compiled routes. The brief assumed a
leftover data row. There was none: the entries were synthesized at run time by a deliberate,
tested override that inserted them at rank one carrying no compiled route.

**Decision**: change the override so it lifts the hub identity, and re-capture every gold
label against the new behavior.

**Consequences**:
- The compiled route now carries the result, which is what the hub doctrine beside it says.
- Accuracy metrics came out byte-identical to the committed baseline, so the change is a
  correctness fix rather than a tuning move.

**Alternatives Rejected**:
- Reweighting the synthesized entries: it leaves a routeless entry competing on rank, which
  is the defect rather than its size.

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Read `goal.md` before touching a routing file, since its decisions bind.
- [x] Confirm the advisor daemon is live and its weights are frozen.
- [x] Capture the before number for any surface a change can move.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Measure before changing. A scope set before the measurement is a hypothesis |
| TASK-SCOPE | Only vocabulary-shaped collisions. A prompt matching no declared word is out |
| TASK-EVIDENCE | Every claim carries the run that produced it, not a recollection of one |
| TASK-ATOMIC | A routing edit, its manifest regeneration and its canary re-pin ship together |

### Status Reporting Format

Report the gate, the before number, the after number, and the mechanism. Where a move is one
mechanism removed rather than routing improved, say so in the same sentence as the number.

### Blocked Task Protocol

A BLOCKED task names the hub it would cost a prompt, the suite that showed it, and the revert
that restored the row. A reverted attempt is recorded as a finding rather than dropped.
