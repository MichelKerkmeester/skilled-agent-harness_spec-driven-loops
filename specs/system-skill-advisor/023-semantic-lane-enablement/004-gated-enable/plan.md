---
title: "Implementation Plan: Phase 4: gated-enable"
description: "Set the researched weight through the environment override, read the resolved weights back, measure every gate before and after, and move the committed default only once the override has held."
trigger_phrases:
  - "weight override"
  - "enable rollback"
  - "canary prompts"
  - "ratchet run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/004-gated-enable"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan"
    next_safe_action: "Record the pre-enable numbers, then set the override"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-004-gated-enable"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: gated-enable

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | The advisor daemon, restarted to pick up an override |
| **Storage** | No schema change. The vectors are already in place from phase 002 |
| **Testing** | The accuracy ratchet, the frozen corpora and five named canaries |

### Overview

Set the weight through the environment override, restart, and read the resolved weights back from
the status surface before measuring anything, because a malformed override is ignored in favour of
the defaults and would otherwise produce a confident measurement of no change. Then run every gate
the project has, compare against phase 001, and decide.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Coverage is full, re-counted immediately before the enable
- [ ] Phase 003 reported a weight with the sweep behind it
- [ ] The pre-enable numbers are recorded for every gate this phase will run

### Definition of Done
- [ ] Every acceptance criterion is met or waived against a decision record
- [ ] The revert was executed once and its effect recorded, rather than described
- [ ] The decision record names the weight, the target, the revert rule and the order the default moves in

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A configuration change behind an environment override, measured against frozen gates.

### Key Components

- **The override**: `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, read once at registry load, merged over the defaults, clamped per lane between zero and one, and discarded silently when it fails to parse.
- **The read-back**: the status surface reports resolved lane weights, which is how a run proves it measured what it intended to set.
- **The gates**: the accuracy ratchet with its six metrics, the frozen 180-row corpus, the 224 out-of-scope controls, and the five canaries.
- **The default**: the value in the lane registry, which only moves after the override has held.

### The Gate B target

Gate B stands at 8 of 172. The target is 30 of 172 and the revert line is 20 of 172, derived
rather than chosen:

| Quantity | Value | Where it comes from |
|----------|-------|---------------------|
| Rows in the frozen corpus | 180 | The committed corpus file |
| Rows that can be advisor-routed | 172 | 180 less the eight rows owned by command-bridge modes, which are never scored |
| Reached the right mode first, today | 8 | The predecessor measurement |
| Appeared anywhere in the list, today | 20 | The same measurement, counted loosely |
| Returned nothing at all | 94, plus 15 that returned only floor noise | The miss-mechanism table |
| Revert line | 20 | The lane must at least promote every row the advisor already surfaces somewhere. Failing that, the weight bought nothing |
| Target | 30 | The 8 held, plus roughly a fifth of the 109 silent rows recovered. It deliberately claims nothing about the 40 wrong-hub rows or the 12 shadowed by a legacy duplicate, which another packet owns |

### Data Flow

The override changes the resolved weight at registry load. Fusion normalizes across the live
lanes, so raising one lane lowers the share of the other four. Every gate is re-run against the
same frozen inputs, and the comparison is against phase 001 rather than against memory.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/scorer/lane-registry.ts` | Holds the default weights and reads the override | update, only after the override held | The resolved weights read back match the intended ones |
| `lib/scorer/fusion.ts` | Normalizes across live lanes | unchanged | No diff. The normalization already handles a different weight |
| `handlers/advisor-status.ts` | Reports resolved weights | unchanged, consumed | The read-back is taken from here before every measurement |
| `scripts/routing-accuracy/scorer-eval-baseline.json` | The ratchet baseline | update only on an improvement | A re-capture is a deliberate act with the commit recorded |
| `references/scoring/advisor-scorer.md` | Documents the weights | update | The document states the new weight and the revert rule |
| `references/scoring/lane-weight-tuning.md` | Documents tuning | update | The sweep result is recorded where the next person will look |

Required inventories:
- Same-class producers: `rg -n 'LANE_WEIGHTS|laneWeights|DEFAULT_SCORER_LANE_WEIGHTS' .opencode/skills/system-skill-advisor/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: `rg -n 'semantic_shadow' . --glob '*.ts' --glob '*.json' --glob '*.md'`.
- Matrix axes: weight applied or not, override valid or malformed, backend up or down. Eight rows before completion is claimed.
- Algorithm invariant: the resolved weights read back from the status surface equal the weights the run intended to set. A measurement taken without that read-back proves nothing.

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
| Unit | The override resolver against a malformed value, an out-of-range value and a valid one | Vitest |
| Integration | The full accuracy ratchet and the lane weight sweep suite | Vitest |
| Manual | The five canaries and the frozen corpus through the live daemon, before and after | The advisor CLI |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 weight | Internal | Red until phase 003 closes | Nothing to apply |
| Phase 002 coverage | Internal | Yellow | A weight on partial vectors measures the wrong thing |
| Phase 001 baseline | Internal | Yellow | No before to compare against |
| Local embedding backend | External | Yellow | The lane contributes nothing, which makes the enable a no-op rather than a regression |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any ratchet metric drops, the controls lose a prompt, the abstain failures rise, or Gate B lands below 20 of 172.
- **Procedure**: Unset the override, restart the daemon, read the resolved weights back to confirm the defaults returned, and re-run the ratchet.

<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Record before ──► Apply override ──► Read back ──► Measure ──► Decide
                                                      │
                                                      └──► Revert (always exercised once)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Record before | 001, 002, 003 | Apply |
| Apply | Record before | Read back |
| Read back | Apply | Measure |
| Measure | Read back | Decide |
| Decide | Measure | 005 |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | An hour, mostly recording the before numbers |
| Core Implementation | Medium | Four to six hours, most of it measurement |
| Verification | Medium | Three to four hours, including the revert run |
| **Total** | | **Eight to eleven hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Every gate's pre-enable number is recorded
- [ ] The committed baseline file is copied into `scratch/`
- [ ] The resolved weights are read back and match the defaults before anything changes

### Rollback Procedure
1. Unset `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` in the daemon environment
2. Restart the daemon
3. Read the resolved weights back and confirm the defaults returned
4. Re-run the accuracy ratchet and confirm every metric matches the pre-enable record

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The vectors stay, and only the weight moves

<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Record     │────►│   Apply     │────►│  Measure    │
│  before     │     │  override   │     │  every gate │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │
                     ┌─────▼─────┐       ┌─────▼─────┐
                     │ Read back │       │  Revert   │
                     │ resolved  │       │  once     │
                     └───────────┘       └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Record before | Phases 001, 002, 003 | The comparison point | Apply |
| Apply override | Record before | A running daemon at the new weight | Read back |
| Read back | Apply | Proof the weight took effect | Measure |
| Measure | Read back | Ratchet, corpus, controls and canary numbers | Decide, Revert |
| Decide | Measure | The decision record and possibly a new default | Phase 005 |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Record the before numbers** - one hour - CRITICAL
2. **Apply and read back** - under an hour - CRITICAL
3. **Measure every gate** - four hours - CRITICAL
4. **Exercise the revert** - one hour - CRITICAL

**Total Critical Path**: about seven hours

**Parallel Opportunities**:
- The canaries and the controls can run while the corpus sweep is in flight
- The reference documents can be drafted while the measurement runs

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Before numbers recorded | Every gate has a pre-enable value | Start of the phase |
| M2 | Override applied and proven | The resolved weights read back match the intended ones | Day one |
| M3 | Gates measured | Ratchet, corpus, controls and canaries all reported | Day two |
| M4 | Revert exercised | Every metric returned to its pre-enable value | Day two |
| M5 | Decision recorded | The weight, the target and the revert rule are written down | Phase close |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The override is the switch, and the default follows it

**Status**: Proposed

**Context**: Raising the lane weight changes every routing decision, and the accuracy gate that
would normally authorize the change is captured under a regime that substitutes fixture vectors.
A change that cannot be authorized by the usual gate has to be reversible without a release.

**Decision**: The weight is applied through the environment override the registry already reads.
The committed default moves only after the override has held through a full gate run.

**Consequences**:
- The revert is one unset and a restart, with no build and no migration.
- The running weight and the committed weight can disagree for a while, so every measurement reads the resolved weights back before it starts.

**Alternatives Rejected**:
- Change the default directly: a bad result then costs a code change and a rebuild, on a system whose gate cannot see the variable.
- Add a new feature flag: the override already exists, is per lane, and is clamped. A second switch would be a second thing to get wrong.

Full reasoning, the target derivation and the revert rule live in `decision-record.md`.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
