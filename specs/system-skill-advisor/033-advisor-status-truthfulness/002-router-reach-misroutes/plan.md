---
title: "Implementation Plan: Phase 2: router-reach-misroutes"
description: "Rerun the full router-reach fleet against the live advisor, classify the recorded wrong-hub and outranked phrases into reproduced and no-longer-reproduced, then fix only the reproduced cases in the owning skills' routing vocabulary and rerun to zero."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: router-reach-misroutes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS probe script; JSON routing metadata and Markdown routers |
| **Framework** | Skill advisor CLI (`skill-advisor.cjs`) over the local daemon; doctor route contract as the consumer |
| **Storage** | On-disk `graph-metadata.json` intent signals and `ROUTER.md` declarations |
| **Testing** | The probe's own full-fleet run plus `bash .skilled/commands/doctor/scripts/route-validate.sh` |

### Overview
Establish live truth first: run the probe over every hub with no filter and no limit, confirm the answer is live and carries a generation, and classify the recorded list. Then fix only the phrases that reproduce, in the vocabulary of the hub that declares them, and rerun the full fleet. The probe script, the doctor workflow and the run command stay untouched; the only artifacts are the routing metadata, the recorded evidence and any decision-covered allowlist entry.
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
Probe-driven verification over a declarative routing corpus; no new runtime component.

### Key Components
- **`ci-router-vocabulary-reach.cjs`** (`sk-doc/sk-create-skill/scripts/`): enumerates each hub's declared phrases, probes the live advisor and classifies wrong-hub, outranked, no-reach, allowed and probe-error.
- **`router-reach-allowlist.json`**: pins a phrase to its accepted winner; changes require a recorded rationale.
- **`graph-metadata.json` intent signals** (each skill root): the declarations that decide which hub a phrase selects.
- **`ROUTER.md` intent signals** (each skill root): the in-hub intent resolution the probe also enumerates.
- **The live advisor scorer**: the authority the run measures; its tables stay unchanged unless a reproduced case requires one and that need is recorded first.

### Data Flow
Probe reads each hub's declarations → sends each phrase to the live advisor over the CLI → compares the top recommendation against the declaring hub → writes one classification row. The operator then edits the owning vocabulary, and the next full-fleet run re-measures every phrase, so a fix that steals a phrase elsewhere surfaces in the same report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ci-router-vocabulary-reach.cjs` | Produces the classifications | unchanged | `node --check` plus the live fleet run |
| `router-reach-allowlist.json` | Accepts pinned disputes | update only with a recorded decision | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` reports allowed rows matching the file |
| `graph-metadata.json` (`intent_signals`, derived triggers) | Declares hub selection vocabulary | update for reproduced phrases only | full-fleet rerun plus `rg -n '<phrase>' .skilled/skills` |
| `ROUTER.md` intent signals | Declares in-hub intent vocabulary | update where the phrase is declared there | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| Advisor explicit scorer table | Scores phrases in the explicit lane | unchanged by default; a fix that needs it is recorded before editing | `rg -n '<phrase>' .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` |

Required inventories:
- Same-class producers: `rg -n 'intent_signals|intentSignals' .skilled/skills/*/graph-metadata.json`.
- Consumers of changed phrases: `rg -n '<reproduced-phrase>' .skilled/skills --glob '*.json' --glob '*.md'` for every phrase fixed.
- Matrix axes: phrase class (wrong-hub, outranked, no-reach, allowed, probe-error) × declaring hub (7 hubs at audit time) × declaration site (intent signals, router intent signals, scorer table).
- Algorithm invariant: for every phrase a hub declares, the live advisor must rank that hub first at or above the confidence threshold; adversarial cases are a phrase declared by two hubs, a phrase containing another phrase, and a phrase whose competitor carries an explicit boost.
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
| Unit | Not applicable: the change is declarative routing metadata, pinned by the probe rather than a fixture | - |
| Integration | Full-fleet live run before and after the fixes; per-hub probe for each edited hub; route validator | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`; `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub <id>`; `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| Manual | Diff the before/after classification rows for the edited phrases and read each winner | `diff scratch/live-fleet.log scratch/verification.log` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live advisor daemon | Internal | Green | Without it the run is degraded; record the blocker and stop instead of scoring fallback output |
| Doctor route contract and validator | Internal | Green | Route parity cannot be checked; note as pending and still run the script directly |
| Hub inventory (7 hubs with ROUTER plus mode registry) | Internal | Green | The fleet run's scope is unknown; recompute from disk before running |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A vocabulary edit produces new wrong-hub or outranked rows in the full-fleet rerun, or an allowlist entry hides a phrase a decision record cannot justify.
- **Procedure**: Revert the routing metadata and allowlist files to `HEAD`, rerun the full fleet, and confirm the pre-edit classification is restored; record the revert and its reason in the phase evidence.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: live pre-check) ──► Phase 2 (Run + fix reproduced) ──► Phase 3 (Verify: full-fleet rerun)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Run and fix | Medium | 3-5 hours (includes two full-fleet runs) |
| Verification | Low | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop editing vocabulary; the current on-disk declarations remain usable.
2. Revert the routing metadata and allowlist files with `git checkout -- <paths>`.
3. Rerun the full fleet and confirm the classification returns to the recorded baseline.
4. Record the revert and its reason in the phase evidence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Live pre-check   │────►│ Full fleet run   │────►│ Reproduced list  │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
┌──────────────────┐     ┌──────────────────┐     ┌────────▼─────────┐
│ Final rerun      │◄────│ Vocabulary fixes │◄────│ Per-phrase fixes │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Live pre-check | Daemon | A runnable probe state | Full fleet run |
| Full fleet run | Pre-check | Classification rows | Fixes |
| Vocabulary fixes | Reproduced list | Updated metadata | Final rerun |
| Final rerun | Fixes | Zero-failure evidence | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Live full-fleet run** - 30-60 minutes of runtime - CRITICAL
2. **Reproduction classification** - 1-2 hours - CRITICAL
3. **Vocabulary fixes and final rerun** - 3-6 hours - CRITICAL

**Total Critical Path**: 5-9 hours

**Parallel Opportunities**:
- Per-hub probes can validate an edited hub while other fixes are still being prepared.
- The reference/rationale write-up for reproduced cases can proceed while the final rerun runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Live run recorded | Full-fleet output with a live generation and complete counts | Setup |
| M2 | Reproduced list fixed | Every reproduced phrase edited in its owning vocabulary | Implement |
| M3 | Rerun clean | Full-fleet rerun reports zero wrong-hub and zero outranked, or decision-waived remainders | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Verify live before fixing any recorded misroute

**Status**: Proposed

**Context**: The audit's 14 wrong-hub and 18 outranked phrases were scored from a degraded local-scorer envelope with `advisor generation: unknown`. Live probes of the three cited examples at planning time showed each reaching its expected hub, so the recorded list is not reliable as a fix list.

**Decision**: Treat the live full-fleet run as the gate. Classify every recorded phrase into reproduced, no-longer-reproduced or probe-error against a live advisor answer with a generation number, and edit vocabulary only for reproduced cases.

**Consequences**:
- Fixes rest on live routing facts and can be re-measured by anyone with the same command.
- The phase may legitimately end with little or no vocabulary change; the run itself is the deliverable that closes the open audit finding.

**Alternatives Rejected**:
- **Fix the recorded 14/18 directly**: they describe the fallback scorer, and two of three sampled examples already pass live, so edits would be ungrounded.
- **Rerun only the affected hubs**: a hub-local fix can steal phrases from other hubs; only the full fleet measures that.

