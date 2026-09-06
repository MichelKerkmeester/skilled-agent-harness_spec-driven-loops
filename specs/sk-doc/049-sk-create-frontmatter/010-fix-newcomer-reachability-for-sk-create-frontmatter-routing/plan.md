---
title: "Implementation Plan: fix newcomer reachability for sk-create-frontmatter routing"
description: "Baseline ten newcomer prompts, add plain-language phrases to every routing surface, replay against out-of-domain prompts, refresh the compiled routing the pinned sources require, and re-measure."
trigger_phrases:
  - "newcomer reachability plan"
  - "routing alias replay plan"
  - "compiled routing refresh sequence"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: fix newcomer reachability for sk-create-frontmatter routing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing metadata, one markdown keyword line |
| **Framework** | sk-doc parent hub, compiled-routing tooling |
| **Storage** | None |
| **Testing** | Advisor replays, `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `validate-canary.cjs`, `validate.sh --strict` |

### Overview
Vocabulary only. Ten phrases go onto stage one and all four stage-two surfaces at once, so no phrase
produces a hub-only hit. Each is replayed against an out-of-domain prompt. The registry and hub
router are pinned sources, so the edit carries a manifest re-mint, an artifact rebuild and a digest
re-pin, and the same ten prompts are replayed after the compile.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage routing. Stage one decides the hub from `graph-metadata.json`. Stage two picks the mode
from the registry aliases the hub router projects. A phrase must be on both, or the reader lands on
the hub with no packet.

### Key Components
- **Stage one**: `graph-metadata.json` `intent_signals` and `derived.trigger_phrases`
- **Stage two**: `mode-registry.json` aliases, `hub-router.json` alias class, `ROUTER.md` keyword map
- **Identity rule**: the mode keyword line equals the registry aliases

### Data Flow
Prompt to advisor, advisor to hub on stage one, hub to mode on stage two, compiled policy resolves
the target from the registry. The compile is why a stage-two edit is a refresh event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-metadata.json` | Stage-one vocabulary | Add ten phrases to both lists | Newcomer prompts reach the hub |
| `mode-registry.json`, `hub-router.json`, `ROUTER.md` | Stage-two vocabulary | Add the same ten | Compiled targets resolve after rebuild |
| `sk-create-frontmatter/SKILL.md` keyword line | Identity with the registry | Add the same ten | `diff` of the two lists empty |
| Compiled artifacts and canary digests | Pinned sources | Regenerate and re-pin | Guard fresh, canary green |
| Advisor scorer | Scores the residual prompts below the floor | Not changed | Recorded |

Required inventories:
- Consumers of the alias list: `rg -n 'yaml header' .opencode/skills/sk-doc`
- Matrix axes: ten newcomer prompts, eighteen declared triggers, five out-of-domain prompts, five version probes
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
| Manual | Reachability before and after | Advisor replays |
| Integration | Hub invariants and compiled routing | `parent-skill-check.cjs`, guard, sync verify, canary |
| Documents | Everything written | `validate.sh --strict`, `hvr_scan.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon | Internal | Green, `live` | No routing claim |
| Compiled-routing tooling | Internal | Green before the edit | No refresh proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a declared trigger stops routing, or an out-of-domain prompt reaches the mode
- **Procedure**: `git checkout` the five surfaces, re-mint, rebuild, re-pin
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline ──► Add phrases on five surfaces ──► Out-of-domain replay ──► Refresh and re-pin ──► After replay
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | After replay |
| Add phrases | Baseline | Replays |
| Refresh and re-pin | Add phrases | After replay |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Minutes |
| Core Implementation | Low | One pass |
| Verification | Medium | Two replays and four gates |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured
- [x] Guard fresh before the edit
- [x] No data changes

### Rollback Procedure
1. `git checkout` the five surfaces
2. Re-mint, rebuild, re-pin
3. Replay the declared triggers

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐    ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Baseline │───►│ Five surfaces│───►│ Refresh and re-pin│───►│ After replay │
└──────────┘    └──────────────┘    └──────────────────┘    └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline | None | Before numbers | Replay |
| Five surfaces | Baseline | Vocabulary | Refresh |
| Refresh and re-pin | Surfaces | Green gates | Replay |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Refresh and re-pin** - the step that can fail a gate - CRITICAL
2. **After replay** - the measurement that decides the phase - CRITICAL

**Total Critical Path**: one session

**Parallel Opportunities**:
- Packet documents are written while the replays run
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline | Ten prompts recorded with generation | Start |
| M2 | Vocabulary landed | Parity check empty | Mid |
| M3 | Compiled | Guard fresh, canary green | Late |
| M4 | Measured | After table recorded | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions for this phase are recorded in `decision-record.md`: the over-capturing phrase dropped,
the version phrases refused, and the tool-digest re-pin.
