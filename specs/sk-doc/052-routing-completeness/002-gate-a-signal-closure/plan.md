---
title: "Implementation Plan: Phase 2: gate-a-signal-closure"
description: "How the 444-signal sweep was built and read: two declared-signal sources unioned per hub, one daemon call per signal with exit status read from a file, and rank taken from the array order rather than the score field."
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
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-03T22:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the re-sweep method and its concurrency"
    next_safe_action: "Hand the sk-doc activation-pin defect to its owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-rerun-2026-09-03.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: gate-a-signal-closure

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node for the sweep driver and the advisor CLI, TypeScript for the scorer and the run-time override |
| **Framework** | The system-skill-advisor daemon, reached through `.opencode/bin/skill-advisor.cjs` |
| **Storage** | `skill-graph.sqlite` for declared signals, plus each hub's `graph-metadata.json` |
| **Testing** | Three regression suites after the fix, plus canary fixtures during it |

### Overview

Declared signals came from two sources per hub, unioned and de-duplicated by exact string: the
`intent_signals` column on that hub's row in the advisor graph database, and
`derived.trigger_phrases` in that hub's `graph-metadata.json`. Cross-hub overlap was checked
and found to be zero. Each signal went to the daemon-backed CLI rather than the Python scorer,
because phase 001 established the daemon as the transport that governs automatic routing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Acceptance criteria AC-001 and AC-002 met
- [x] AC-003 met. The 2026-09-03 re-sweep leaves the same 50 signals unresolved, and each carries a recorded decision
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A measurement pipeline in four stages: extract, sweep, classify, tally. Each stage writes its
output to disk so the next stage reads a file rather than a pipe.

### Key Components
- **Extraction**: `sqlite3` against `skill_nodes.intent_signals`, unioned with each hub's
  `derived.trigger_phrases`, de-duplicated by exact string.
- **Sweep driver**: a background script batching 20 concurrent daemon requests, one JSON reply
  per signal in its own file, exit status in a matching `.exit` file.
- **Classifier**: reads `recommendations[0]` and assigns exactly one of five buckets.
- **Tally**: two independent passes over the same raw replies, one in Python and one in `jq`.

### Data Flow

A declared signal becomes one CLI call, which becomes one JSON reply on disk. The classifier
reads the first array element, compares its `skillId` against the owning hub and its
`compiledRoute.targets` against the mode list, and emits one TSV row. The tally counts rows.

### Bucket definitions

| Bucket | Condition |
|---|---|
| RESOLVED | The top result is the owning hub and `targets` names exactly one mode |
| NO_RECOMMENDATION | `recommendations` is empty |
| WRONG_HUB | The top result is a different hub |
| DEFERRED | The owning hub wins but `targets` is empty or `action` is not `route` |
| MULTI | `targets` names more than one mode |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The measurement changed nothing. The follow-up fix in `08eb67a0de` changed the surfaces below.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cli-external-orchestration/hub-router.json` | Stage-two routing for the executor hub | Updated with classes for signals that reached the hub and dropped | Executor hub moved from 7 of 115 to 66 |
| `cli-external-orchestration/mode-registry.json` | Mode declarations | Aligned with the router | Re-swept in the same run |
| `cli-external-orchestration/graph-metadata.json` | The advisor projection of declared vocabulary | Retired vocabulary removed, 68 lines touched | 67 signals retired, each audited first |
| `lib/scorer/executor-delegation.ts` | Run-time override for bare executor names | Now lifts the hub instead of inserting a routeless entry at rank one | Accuracy metrics byte-identical to the committed baseline |
| `scripts/routing-accuracy/scorer-eval-baseline.json` and the holdout corpus | Gold labels | Re-captured to match the override change | Three suites re-run with no hub losing a prompt it owned |

Required inventories:
- Same-class producers: `rg -n 'routingClass|workflowMode' .opencode/skills/*/hub-router.json`.
- Consumers of changed symbols: `rg -n 'executor-delegation|advisorRouting' .opencode/skills --glob '!dist/**'`.
- Matrix axes: five hubs by five buckets, which is the published distribution table.
- Algorithm invariant: rank is the returned array order, since the sort key blends command,
  intent and conflict adjustments that the reply does not expose.
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
| Measurement | 444 declared signals across five hubs | The daemon CLI, one call per signal |
| Double tally | The same raw replies counted twice | One Python pass and one `jq` pass |
| Regression | 444 signals, 180 realistic prompts, 224 controls | The three committed suites |
| Canary | Mid-flight fixtures during the fix | `fixtures/skill-advisor-regression-cases.jsonl` |

Verification commands, all run from the repository root:

```bash
sqlite3 .opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite \
  "select intent_signals from skill_nodes where id='<hub>';"

node .opencode/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"<signal>"}' --format json --timeout-ms 60000
```

The 2026-09-02 re-run used the same two commands over the current declared vocabulary, at 12
concurrent requests, with exit status read from a per-signal file.

The 2026-09-03 re-sweep at HEAD `fe1ec30fe8` used them again over 389 declared signals. It
started at 12 concurrent, where 51 calls returned exit 75 and `socket closed before response`,
which is daemon back-pressure rather than a routing answer. Those 51 were cleared and re-run
at 4 concurrent, and all 389 replies in the committed capture are exit 0. Each row also
carries an engine-direct probe through
`014-runtime-engine/lib/compiled-route.cjs`, which reports what a hub's own compiled router
decides with the activation gate bypassed. That column is what separates a stale serving pin
from a signal whose vocabulary genuinely reaches no mode.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 reading rules | Internal | Green | Rank and confidence would be read wrongly, which already inflated one hub from 7 to 44 |
| Advisor daemon | Internal | Green | No sweep is possible |
| `skill-graph.sqlite` | Internal | Green | Declared signals cannot be extracted |
| Phase 004 | Internal | Yellow | Cross-hub collisions in the WRONG_HUB bucket cannot be settled by one hub |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hub loses a prompt it owned, or a retired signal turns out to have been routing.
- **Procedure**: `git revert 08eb67a0de` restores the routers, registries, graph metadata, the run-time override and the gold labels together. The two research documents are additive and carry no runtime effect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Extract ──► Sweep ──► Classify ──► Tally ──► Fix ──► Re-measure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Extract | Phase 001 transport | Sweep |
| Sweep | Extract | Classify |
| Classify | Sweep | Tally |
| Tally | Classify | Fix |
| Fix | Tally | Re-measure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Two extraction sources per hub, unioned and checked for overlap |
| Core Implementation | High | 444 calls, a per-signal audit, and eight routing files |
| Verification | High | Three regression suites plus a double tally |
| **Total** | | **Two working sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created. The frozen corpus lives in `research/gate-a-raw.tsv`
- [x] Feature flag configured (not applicable, since routing files carry no toggle)
- [x] Monitoring alerts set. Canary fixtures ran during the fix

### Rollback Procedure
1. `git revert 08eb67a0de` to restore routers, registries, metadata, the override and gold labels.
2. Re-run the sweep and confirm the hub totals return to 234 of 444.
3. Re-run the three regression suites and confirm no hub lost a prompt it owned.
4. Notify the phase 004 owner, since the collision list depends on these numbers.

### Data Reversal
- **Has data migrations?** No. The graph database is rebuilt from the skill tree.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Extract  │──►│  Sweep   │──►│ Classify │──►│  Tally   │
└──────────┘   └──────────┘   └────┬─────┘   └────┬─────┘
                                   │              │
                             ┌─────▼──────────────▼─────┐
                             │ Audit, retire, re-route  │
                             └──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Extraction | Phase 001 | 444 unique signals | Sweep |
| Sweep | Extraction | 444 JSON replies | Classification |
| Classification | Sweep, rank rule | `gate-a-raw.tsv` | Tally, audit |
| Audit and fix | Classification | 67 retirements, new stage-two classes | Re-measurement |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Extract declared signals from both sources per hub** - the denominator - CRITICAL
2. **Sweep all 444 through the daemon** - the measurement - CRITICAL
3. **Classify against `recommendations[0]`** - where the rank rule bites - CRITICAL
4. **Audit each unresolved signal before retiring it** - the slowest step - CRITICAL

**Total Critical Path**: Extraction, one sweep, one classification pass, one audit.

**Parallel Opportunities**:
- The two tallies run independently over the same replies.
- Per-hub audits are independent of each other.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline measured | 444 rows, one bucket each, double-tallied | `dbc8678c9d` |
| M2 | Vocabulary closed | Retirements audited, stage-two classes added | `08eb67a0de` |
| M3 | Every signal settled | A fresh sweep leaves no unresolved signal without a decision | Done, 2026-09-03. All 50 decided in twelve groups |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Measure Gate A across all five hubs

**Status**: Accepted

**Context**: Every audit in the session that produced these findings looked at the
documentation hub, which sits at 90 percent.

**Decision**: Gate A is measured across all five parent hubs in one sweep.

**Consequences**:
- The executor hub was found at 7 of 115, a number nobody had.
- The sweep is five times larger and takes a batched driver to run.

**Alternatives Rejected**:
- Measuring only the hub under audit: confirms a comfortable number and misses the real one.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Phase 001 reading rules are loaded before any reply is classified.
- [x] Declared signals come from both sources and are de-duplicated before the sweep starts.
- [x] Exit status is read from a per-signal file rather than through a pipe.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Extract, sweep, classify, tally, then fix. Never fix before the tally. |
| TASK-SCOPE | No scorer, weight or embedding change. Routing vocabulary and routes only. |
| TASK-EVIDENCE | Every count is re-derivable from the committed raw file by a second method. |

### Status Reporting Format

Report one line per task: the task id, its state, and the evidence. A count reports its
denominator, since a bare percentage hides which hub carries it.

### Blocked Task Protocol

A task is BLOCKED when a signal cannot be resolved without a decision another hub owns. Record
it against phase 004 rather than guessing, and leave the criterion Unmet.
