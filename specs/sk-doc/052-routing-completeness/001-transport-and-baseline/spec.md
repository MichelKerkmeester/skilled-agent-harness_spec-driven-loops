---
title: "Feature Specification: Phase 1: transport-and-baseline"
description: "Two scorers answer the routing question and disagree on roughly a third of prompts. Until one is named as the governing caller, every routing number in this packet is ambiguous, so this phase settles it and freezes the baseline."
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
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T19:56:10Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase specification from shipped evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "research/transport-finding.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The advisor daemon governs automatic routing, and the Python scorer never routes"
      - "A confidence of 0.8200 is a floor rather than a score"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: transport-and-baseline

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Two scorers answer the same routing question and disagree on roughly a third of prompts, so
no routing number in this packet could be read until one of them was named as the caller the
runtime calls. This phase named it by reading the dispatch chain, repointed the
repository's manual fallback at the same scorer, and froze two reading rules that every later
measurement depends on.

**Key Decisions**: The advisor daemon governs automatic routing and the Python scorer only
validates, and a confidence of 0.8200 is a floor that is never reported as a score.

**Critical Dependencies**: The daemon-backed CLI at `.opencode/bin/skill-advisor.cjs`, which
every later sweep calls.

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
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-gate-a-signal-closure |
| **Handoff Criteria** | The governing transport is named with a code path a reader can open, and the two reading rules are recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the routing completeness phases specification.

**Scope Boundary**: Reading the dispatch chain and recording what it shows. No scorer, weight
or registry was changed. The one runtime edit is the Gate 2 fallback line in `AGENTS.md`.

**Dependencies**:
- The advisor daemon and its CLI front door, which must answer for the baseline to be taken.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts`, read for the rank rule.

**Deliverables**:
- `research/transport-finding.md`, the dispatch-path read with the floor and rank caveats.
- The Gate 2 manual fallback in `AGENTS.md`, repointed at the daemon CLI.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two scorers answer the same question. They disagree on roughly a third of prompts, and the
invocation bar often falls between their answers, so a request routes or does not depending
on which replied. Every routing measurement is ambiguous until the governing caller is named.

### Purpose

The governing transport is named with the code path that proves it, and a reproducible
baseline exists for every later phase to measure against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the advisor dispatch chain end to end and naming the scorer the runtime calls.
- Recording the confidence-floor rule and the rank-source rule as frozen reading rules.
- Repointing the Gate 2 manual fallback at the scorer the hook consults.

### Out of Scope
- Reconciling the two scorers. That is a scoring change, and parent decision D2 forbids it
  here because it would void every number measured in this packet.
- Producing an exact row-level disagreement rate between the two scorers. The finding carries
  the rate as roughly a third, which is what the read supports.
- Any registry, weight or vocabulary edit. Those belong to phases 002 and 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/transport-finding.md` | Create | The dispatch-path read, the floor caveat and the rank rule in one citable document |
| `AGENTS.md` | Modify | Gate 2 manual fallback repointed from the Python scorer to the daemon CLI |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Name the scorer that governs automatic routing by reading the dispatch chain, and cite a file and line a reader can open |
| REQ-002 | Record that a confidence of 0.8200 is the floor the daemon applies to anything it surfaces, and that `score` is the discriminator |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Record that rank comes from the returned array order, never from re-sorting by the `score` field |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The governing transport is named with a file and line a reader can open, and no
  live hook path invokes the Python scorer. Matches AC-001.
- **SC-002**: The confidence floor is demonstrated on measured replies rather than asserted,
  with the score field shown to differ underneath it. Matches AC-002.
- **SC-003**: The comparator is shown to blend adjustments the reply does not expose, so rank
  cannot be re-derived from `score`. Matches AC-003.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon | The baseline cannot be measured while it is cold or unreachable | The CLI self-starts the daemon, verified by stopping it and issuing one call |
| Risk | The two scorers stay unreconciled | Medium. A number measured through the Python command describes the manual path only | Every later sweep calls the daemon CLI, and the finding says so in writing |
| Risk | A later reader re-sorts replies by `score` | High. It inflated one hub from 7 to 44 resolved signals on tied scores | The rank rule is frozen here and repeated in the Gate A method |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single `advisor_recommend` call returns within the 60 second timeout the
  later sweeps set. Observed cold-start call: 6.8 seconds.

### Security
- **NFR-S01**: The phase runs read-only tools plus one documentation edit. No mutation
  command was issued against the advisor, so no trusted-context flag was needed.

### Reliability
- **NFR-R01**: The named transport answers from a cold daemon, since the CLI self-starts it.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty `recommendations` array is a real answer and means the prompt
  surfaced nothing. It is not an error and is never read as a low-confidence hit.
- Maximum length: declared signals range from single tokens to full sentences. Single tokens
  reach the low-information abstention path, and are measured as they are.

### Error Scenarios
- Daemon cold or stopped: the CLI self-starts it, which was verified live before the Gate 2
  fallback text was rewritten.
- Output read through a pipe: exit status is taken from a separate file instead, so a pipeline
  cannot mask a failed call.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: 67, Systems: 1 |
| Risk | 6/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | The whole phase is a dispatch-chain investigation |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 12/15 | Dependencies: every later phase reads the rules frozen here |
| **Total** | **48/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A reader treats confidence 0.8200 as a passing score | H | H | The floor is recorded with measured evidence and repeated in every method section |
| R-002 | A later pass re-sorts replies by `score` | H | M | The rank rule is frozen, and the inflation it caused is named with its numbers |
| R-003 | The written gate and the automation disagree on which scorer to use | M | L | `AGENTS.md` now names the daemon CLI, verified against a cold daemon |

---

## 11. USER STORIES

### US-001: Name the routing transport (Priority: P0)

**As a** person reading a routing number, **I want** the scorer that produced it named with a
code path, **so that** I know whether the number describes the automatic path or a manual one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Read a reply correctly (Priority: P1)

**As a** person measuring routing, **I want** the confidence floor and the rank source stated
as rules, **so that** I do not report a floor as a score or a re-sort as a ranking.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None open in this phase. Whether the two scorers should be reconciled at all is carried by
the parent spec, since it is a decision about the scoring engine rather than about this
measurement.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Finding**: See `research/transport-finding.md`
