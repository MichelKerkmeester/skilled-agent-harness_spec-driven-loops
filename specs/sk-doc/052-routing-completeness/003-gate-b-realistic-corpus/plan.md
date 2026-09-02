---
title: "Implementation Plan: Phase 3: gate-b-realistic-corpus"
description: "How the realistic corpus was built and measured: prompts written by hand against each registry, one daemon call per row with exit status read from a file, and every miss classified by mechanism from the same JSON."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/003-gate-b-realistic-corpus"
    last_updated_at: "2026-09-02T17:36:09Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the approach taken and its verification commands"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "assets/realistic-corpus.tsv"
      - "research/gate-b-measurement.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-003-gate-b-realistic-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: gate-b-realistic-corpus

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node for the advisor CLI, Python for the tally, TSV and Markdown for the artifacts |
| **Framework** | The system-skill-advisor daemon |
| **Storage** | `assets/realistic-corpus.tsv` for the corpus, `skill-graph.sqlite` read for the embedding count |
| **Testing** | A second run of the same corpus, plus two independent hit counts over the same replies |

### Overview

The corpus was written by hand against each hub's `mode-registry.json` and its packets'
`SKILL.md` files, at least four prompts per mode across all 43 modes. No prompt names its own
mode. Eight prompts sit deliberately on a boundary between two modes, each carrying a one-line
reason for which should win. Each prompt went to the live daemon once, and every miss was then
classified by mechanism from the same JSON rather than re-measured.
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
- [x] Tests passing (not applicable, since the phase adds no code)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A hand-authored corpus measured once, then read many times. Every derived number in this phase
comes from the same 180 JSON replies, so the strict count, the loose count and the miss
classification check each other instead of being separate experiments.

### Key Components
- **`assets/realistic-corpus.tsv`**: hub, intended mode, prompt, and an optional boundary reason.
- **The measurement loop**: one `advisor_recommend` call per row, output to a file, exit status separate.
- **The hit rule**: a row is a hit when the intended `workflowMode` appears among the `compiledRoute.targets` of `recommendations[0]`.
- **The miss classifier**: assigns each non-hit to one mechanism, reading the same reply.

### Data Flow

A corpus row becomes one prompt, one reply and one verdict. The strict verdict reads only
`recommendations[0]`. The loose verdict reads the whole array. The mechanism classifier reads
the same reply a third time and answers why the strict verdict failed.

### Miss mechanisms

| Mechanism | Count | Share of the corpus |
|---|---|---|
| No recommendation at all | 94 | 52.2% |
| Wrong hub | 40 | 22.2% |
| No recommendation, confidence-floor noise only | 15 | 8.3% |
| Right hub, shadowed by a legacy duplicate entry | 12 | 6.7% |
| Right hub, deferred with no target | 11 | 6.1% |
| Right hub, wrong mode | 0 | 0.0% |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase measures and does not fix. The only surface it changed outside its own folder is
the scope of the phase its result invalidated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/realistic-corpus.tsv` | The committed corpus | Created, 181 lines including the header | A scan for a row naming its own mode returns zero |
| `research/gate-b-measurement.md` | The measurement record | Created at 498 lines, then extended with the denominator correction | `4a5de9e52b` and `8c6d6fd455` |
| `../004-cross-hub-vocabulary/spec.md` | The next phase's scope | Re-scoped, since keyword work cannot move this number | `4a5de9e52b`, 42 lines touched |
| The semantic lane | The only lane that could match meaning | Unchanged, and recorded as the structural cause | Weight `0.05` shadow-only, zero embedded nodes |

Required inventories:
- Same-class producers: `rg -n 'routingClass' .opencode/skills/*/mode-registry.json`.
- Consumers of changed symbols: none. No symbol changed in this phase.
- Matrix axes: five hubs by 43 modes, with at least four prompts per mode.
- Algorithm invariant: a hit is the intended mode inside `compiledRoute.targets` of the first
  recommendation. Confidence clearing 0.82 is never treated as evidence of a match.
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
| Corpus integrity | No row names its own mode | An `awk` scan over the TSV |
| Measurement | 180 prompts, one call each | The daemon CLI |
| Reproduction | A second run of the same corpus | The same driver, with cache hits observed |
| Cross-check | Strict and loose hit counts from the same replies | Two independent passes |
| Structural cause | Lane weight and embedding count | `advisor_status` and one `sqlite3` query |

Verification commands, all run from the repository root:

```bash
awk -F'\t' 'NR>1 && index(tolower($3),tolower($2))>0 {c++} END{print c+0}' \
  specs/sk-doc/052-routing-completeness/003-gate-b-realistic-corpus/assets/realistic-corpus.tsv

node .opencode/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"<prompt>"}' --format json --timeout-ms 60000

node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json

sqlite3 .opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite \
  "select count(*) from skill_nodes where embedding is not null;"
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 reading rules | Internal | Green | A confidence of 0.8200 would be read as a hit |
| Advisor daemon | Internal | Green | The corpus cannot be measured |
| Hub mode registries | Internal | Green | The corpus cannot be written against real modes |
| Phase 004 | Internal | Yellow | Its premise depends on this result, and this result re-scoped it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The corpus turns out to encode a preference rather than a realistic phrasing, or the hit rule is wrong.
- **Procedure**: The corpus and the measurement are additive documents with no runtime effect, so reverting `4a5de9e52b` and `8c6d6fd455` removes them cleanly. The re-scope of phase 004 rides in the same commit and would revert with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Write corpus ──► Measure ──► Classify misses ──► Correct denominator
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Write corpus | Hub registries | Measure |
| Measure | Write corpus, phase 001 rules | Classify |
| Classify | Measure | Denominator correction |
| Denominator correction | Classify | Phase 004 scope |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | High | 180 prompts written by hand against 43 registries |
| Core Implementation | Med | 180 calls at roughly five seconds each |
| Verification | Med | A second run, two hit counts and two structural probes |
| **Total** | | **One long working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created. The corpus is committed, so any later run measures against a fixed input
- [x] Feature flag configured (not applicable, since nothing was switched on)
- [x] Monitoring alerts set (not applicable, since no runtime behaviour changed)

### Rollback Procedure
1. Revert `4a5de9e52b` and `8c6d6fd455` to remove the corpus and the measurement.
2. Confirm phase 004 returns to its earlier scope, since the re-scope rides in the same commit.
3. Re-read the parent findings register, where findings 9, 10 and 11 point at this phase.
4. Notify the phase 004 owner, since their scope depends on this result.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐   ┌───────────┐   ┌──────────────────┐
│ Write corpus  │──►│  Measure  │──►│ Classify misses  │
└───────────────┘   └─────┬─────┘   └────────┬─────────┘
                          │                  │
                    ┌─────▼─────┐   ┌────────▼─────────┐
                    │ Second run│   │ Structural cause │
                    └───────────┘   └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Corpus | Hub registries | 180 rows across 43 modes | Measurement |
| Measurement | Corpus, phase 001 rules | 180 replies | Hit counts, classification |
| Classification | Measurement | Six mechanisms with counts | Phase 004 scope |
| Structural probe | None | Lane weight and embedding count | The decision on finding 10 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Write 180 prompts against 43 registries by hand** - the slowest step - CRITICAL
2. **Measure every row once through the live daemon** - the number - CRITICAL
3. **Classify every miss by mechanism** - what turns a bad number into a usable one - CRITICAL

**Total Critical Path**: One authoring pass, one measurement pass, one classification pass.

**Parallel Opportunities**:
- The strict and loose hit counts run over the same replies independently.
- The structural probe does not depend on the corpus at all.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Corpus committed | 180 rows, none naming its own mode | `4a5de9e52b` |
| M2 | Rate recorded | 8 of 180 top-only, 20 of 180 any-position | `4a5de9e52b` |
| M3 | Denominator corrected | 8 of 172 published beside 8 of 180 | `8c6d6fd455` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The corpus shares no vocabulary with the declared keywords

**Status**: Accepted

**Context**: An earlier corpus scored 44 percent using phrasings close to the declared
keywords, and the advisor matches keywords by substring.

**Decision**: Every prompt is written the way a person would describe the need, and no prompt
contains its own mode name.

**Consequences**:
- The number fell to 4.4 percent, and that is the honest starting point.
- The two corpora are not comparable, and the difference is the measurement rather than a regression.

**Alternatives Rejected**:
- Keeping the keyword-shaped corpus: it measures the corpus rather than the routing.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Phase 001 reading rules are loaded, so a confidence of 0.8200 is never read as a hit.
- [x] Each prompt is checked against its own mode name before the corpus is committed.
- [x] Exit status is read from a file rather than through a pipe.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Write the whole corpus before measuring any of it, so no prompt is tuned to a result. |
| TASK-SCOPE | Measure only. No scorer, weight, embedding or vocabulary change. |
| TASK-EVIDENCE | Every derived number comes from the same committed replies, computed twice. |

### Status Reporting Format

Report the rate with its denominator and its reading, since a bare percentage hides whether it
counts the top pick or any position.

### Blocked Task Protocol

A task is BLOCKED when a mode cannot be reached through a prompt at all. Record the routing
class rather than writing a prompt that pretends otherwise, and remove the mode from the
denominator with the reason stated.
