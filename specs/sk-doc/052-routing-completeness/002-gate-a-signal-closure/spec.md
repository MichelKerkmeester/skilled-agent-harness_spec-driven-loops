---
title: "Feature Specification: Phase 2: gate-a-signal-closure"
description: "Across five hubs 234 of 444 declared signals resolved to exactly one mode. The distribution was the finding rather than the total, and the fixes each unresolved signal was given have now been applied and measured at 345 of 388."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-04T12:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the seven named fixes and measured the sweep on both sides"
    next_safe_action: "Hand the three scorer-held signals to the scorer owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-fix-before-2026-09-04.tsv"
      - "research/gate-a-fix-after-2026-09-04.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate A baseline is 234 of 444 across five hubs"
      - "The executor hub resolved 7 of its 115 signals and had never been measured"
      - "All 50 unresolved signals carry a decision, grouped by twelve distinct mechanisms"
      - "Nineteen of the 21 deferrals are declared discovery-only by their own hub router"
      - "Raising a phrase means declaring it in the hub's top-level intent_signals, not editing a weight"
      - "deep-review, dom inspect, task list and lighthouse are held by scorer abstention gates no hub metadata reaches"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: gate-a-signal-closure

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Every signal the five parent hubs declare was swept through the daemon-backed advisor and
classified into one bucket. The baseline came out at 234 of 444 resolved, one hub had never
been measured at all, and the follow-up fix moved the total to 328 against the same frozen
corpus. A fresh sweep on 2026-09-03 returns 339 of 389 against today's declared vocabulary once a
stale activation pin is held aside, and every one of the 50 signals outside that total carries a
recorded decision. On 2026-09-04 the fixes those decisions named were applied and measured on
both sides: 338 of 389 before, 345 of 388 after, with no hub losing a signal and both accuracy
gates returning the same numbers they returned before.

**Key Decisions**: Gate A is measured across all five hubs rather than the hub under audit,
and rank is read from the comparator output rather than re-derived from the `score` field.

**Critical Dependencies**: Phase 001, which named the daemon as the transport that governs
automatic routing, and the advisor graph database that holds each hub's declared signals.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-transport-and-baseline |
| **Successor** | 003-gate-b-realistic-corpus |
| **Handoff Criteria** | Every declared signal is classified, and none sits in an unexplained bucket |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the routing completeness phases specification.

**Scope Boundary**: Declared vocabulary and the stage-one and stage-two routes it reaches. The
measurement itself touched no routing file. The follow-up fix touched hub routers, mode
registries, graph metadata and one run-time override, and it left the scorer alone.

**Dependencies**:
- Phase 001, for the transport, the confidence-floor rule and the rank rule.
- `skill-graph.sqlite` and each hub's `graph-metadata.json`, the two sources of declared signals.

**Deliverables**:
- `research/gate-a-measurement.md`, the method, the per-hub distribution and every non-resolved signal.
- `research/gate-a-raw.tsv`, one row per declared signal so the number can be re-derived.
- `research/unresolved-signal-decisions.md`, one recorded decision per signal outside RESOLVED.
- `research/gate-a-rerun-2026-09-03.tsv` and its denominator, the closure sweep at HEAD.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across all five hubs, 234 of 444 declared signals resolve end to end to exactly one mode.
The rest split into 73 that reach their hub and are then dropped, 72 that reach a different
hub, 59 that surface nothing at all, and 6 that name several modes at once.

The distribution is the finding rather than the total. The documentation hub sits at 90
percent and every audit this session looked there. The executor hub sits at **6 percent**,
and nobody had measured it. Forty-seven of its signals are bare executor-name fragments that
surface nothing, and its own headline phrase loses to a lexical alias carrying no route.

One methodological correction is recorded with the data, because it changed the answer.
Ranking is not by the score field. The comparator adds command, intent and conflict
adjustments and then falls through to rank fusion, so the first element is the only rank
source. A pass that re-sorted by score inflated one hub from 7 to 44 purely through
tie-break direction.

### Purpose

Every declared signal either resolves to exactly one mode or is retired, with the choice
recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extracting every declared signal from all five parent hubs and measuring each through the daemon.
- Classifying each reply into exactly one of five buckets and committing the raw result.
- Acting on the sweep: retiring vocabulary that reaches nothing, and giving stage-one signals a stage-two class.

### Out of Scope
- Any scorer, weight or embedding change. Parent decision D2 forbids it, since it would void the baseline.
- Realistic phrasings. Gate A measures declared words, and phase 003 measures sentences.
- Cross-hub collisions that no single hub can settle alone. Those belong to phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/gate-a-measurement.md` | Create | Method, per-hub distribution, every non-resolved signal, reproduction commands |
| `research/gate-a-raw.tsv` | Create | One row per declared signal with its bucket |
| `research/gate-a-rerun-2026-09-03.tsv` | Create | The closure sweep, with an engine-direct column beside each bucket |
| `research/declared-signals-2026-09-03.tsv` | Create | The denominator behind that sweep |
| `research/unresolved-signal-decisions.md` | Create | A decision per unresolved signal, grouped by mechanism |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Modify | Stage-two classes for signals that reached the hub and dropped |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Modify | Mode declarations aligned with the router |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modify | Retired vocabulary removed from the advisor projection |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Modify | The run-time override lifts the hub instead of inserting a routeless entry |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Gold labels re-captured after the override change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Measure every declared signal across all five hubs through the daemon, and classify each reply into exactly one of five buckets |
| REQ-002 | Commit the raw replies so the headline count can be re-derived by a second method rather than trusted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Resolve each unresolved signal to exactly one mode, or retire it with the choice recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 444 declared signals carry exactly one bucket value in the committed raw
  file. Matches AC-001. Met.
- **SC-002**: The headline 234 of 444 is reproduced by two independent tallies over the same
  replies. Matches AC-002. Met.
- **SC-003**: A fresh sweep leaves no signal in an unresolved bucket without a decision beside
  it. Matches AC-003. Met: the 2026-09-03 re-sweep leaves the same 50 of 389, and
  `research/unresolved-signal-decisions.md` decides each one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon | Without it there is no measurement at all | Calls batch 20 wide with a 60 second timeout, and exit status is read from a file |
| Dependency | `skill-graph.sqlite` | A stale database measures vocabulary the hubs no longer declare | Signals are unioned with each hub's `graph-metadata.json` and de-duplicated |
| Risk | A vocabulary fix costs a hub a prompt it owned | High | Three suites re-run after the fix: 444 signals, 180 realistic prompts, 224 controls |
| Risk | Retiring a signal that was resolving | High | All 67 retirements were audited first, and none was resolving |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full sweep of the declared vocabulary completes in one run at 20 concurrent
  daemon requests. The 381-signal re-run at 12 concurrent finished inside four minutes.

### Security
- **NFR-S01**: The sweep is read-only against the advisor. No mutation command was issued, so
  no trusted-context flag was needed.

### Reliability
- **NFR-R01**: Every call records its own exit status in a separate file, so a failed call
  cannot be hidden by a pipeline.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty `recommendations` array is the NO_RECOMMENDATION bucket, which is a
  measured outcome rather than a failed call.
- Maximum length: some declared signals are single tokens rather than sentences. Short
  executor names are the main case. They were measured as they are, with nothing excluded.

### Error Scenarios
- A hub declares a signal that another hub also declares: cross-hub overlap was checked and
  found to be zero, so no signal is counted twice.
- A reply ties on `score`: rank is read from the array order, since re-sorting inflated one
  hub from 7 to 44.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 8, LOC: 760 in docs plus 8 routing files, Systems: 2 |
| Risk | 17/25 | Auth: N, API: N, Breaking: Y for routing vocabulary |
| Research | 16/20 | A 444-signal sweep and a per-signal audit before retirement |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 11/15 | Dependencies: phase 001 rules, phase 004 collisions |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A retired signal was still routing | H | L | Every retirement audited first, and none was resolving |
| R-002 | A fix trades one hub's reachability for another's | H | M | Canary fixtures caught two regressions mid-flight, both reverted |
| R-003 | The headline hides a hub at 6 percent | H | H | The per-hub table is published beside the total |

---

## 11. USER STORIES

### US-001: Measure declared vocabulary across every hub (Priority: P0)

**As a** person auditing routing, **I want** every hub's declared signals measured rather than
the one hub under review, **so that** a comfortable number cannot stand in for the real one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Close or retire every signal (Priority: P1)

**As a** hub owner, **I want** each declared signal to resolve to one mode or be retired with
the choice recorded, **so that** no vocabulary sits in an unexplained bucket.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None left inside this phase. The fifty signals that do not resolve each carry a decision in
`research/unresolved-signal-decisions.md`, and the hub self-names that looked undecided turned
out to be declared discovery-only by their own routers.

Two questions leave the phase rather than close inside it. Fourteen signals are cross-hub
boundaries that phase 004 owns, and `sk-doc` is serving legacy on a stale activation pin,
which belongs to whoever owns the compiled-routing re-pin.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Measurement**: See `research/gate-a-measurement.md`
- **Decisions**: See `research/unresolved-signal-decisions.md`
