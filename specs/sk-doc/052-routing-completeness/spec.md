---
title: "Feature Specification: routing completeness and findings closure"
description: "Routing was measured rather than assumed and came back at 21 of 48 realistic phrasings. Around thirty further findings sat diagnosed and unfixed across one hub, three of its modes, a tooling skill and the spec-kit suite. Eight phases closed them against numbers, and the last phase re-measured the numbers after the tree moved underneath them."
trigger_phrases:
  - "routing completeness"
  - "gate a signal closure"
  - "gate b realistic corpus"
  - "advisor transport disagreement"
  - "close the routing findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: routing completeness and findings closure

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Routing across the five parent hubs was measured instead of assumed, and the measurement
became the packet: Gate A counts declared signals that reach exactly one mode, Gate B counts
phrasings people actually type that reach the intended mode. Seven phases moved Gate A from
234 of 444 to 345 of 388, found that Gate B is bounded by a structural cause keywords cannot
reach, gave every one of forty findings an owner, and closed the spec-kit residue against
the packet that deletes most of it. An eighth phase re-measured both gates two days after
closure, repaired the scaffolder a runtime nesting had broken, and recorded the two numbers
that moved.

**Key Decisions**: the advisor daemon governs and the scorer does not change while these
numbers stand; every finding is fixed, owned by a phase, or closed as a recorded decision;
a collision between hubs is decided by the losing hub's own written boundary.

**Critical Dependencies**: the advisor scorer holding still, and packet 049's delete list
for the spec-kit residue.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A hub can be complete in every registry and still not be reachable. That is not a
hypothesis here, it is a measurement: 21 of 48 phrasings a person would actually type
reached the right mode, six modes scored zero of three, and one mode was reachable at stage
one and dropped at stage two.

Around thirty further findings sit alongside it, each already diagnosed and evidenced during
the session that produced them. They are unfixed rather than unknown, which is a different
and more tractable problem.

The reason all of this survived is worth stating, because it shapes the work. Every
automated gate reads the registries. Nothing reads the README, nothing reads a link label
against its target, nothing checks whether a declared phrase resolves to anything, and
nothing compares a document's claim against the tree it describes.

### Purpose

Routing is provable rather than asserted, and every open finding is fixed, planned with an
owner, or closed as a recorded decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two measurable routing gates, defined so the word complete has a number behind it.
- The cross-hub vocabulary collision, which no single hub can fix alone.
- The hub surfaces that contradict their own registries and have no gate.
- The document-validator and template debt that lets a clean score hide a seeded defect.
- The spec-kit residue, its never-typechecked tests, and the five calls that need a human.
- The re-measurement after closure, and whatever it proves moved.

### Out of Scope

- Rewriting the advisor scoring engine. The two transports disagree and that is recorded as
  a finding rather than repaired here, because changing a scorer invalidates every number in
  this packet.
- The voice backlogs. They are measured in the thousands, they are a writing job rather than
  a substitution, and folding them in would bury the routing work.
- Anything that would edit a shipped rule or planning document purely to quiet a command
  that gates nothing.

### Files to Change

The per-phase tables in each child's `spec.md` and `implementation-summary.md` are the
authority. At packet level the surfaces are:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/*/graph-metadata.json`, `hub-router.json`, `mode-registry.json` for the five hubs | Modify | Vocabulary resolved, retired, or qualified so each declared signal reaches one mode |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` and `scripts/skill_advisor.py` | Modify | The delegation override lifts the owning hub instead of inserting a routeless executor entry |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Invariant 6c, the mode table's command column against the registry |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` | Modify | Template payload scanning, fence closing on a marker at least as long as the opener, emitted frontmatter masked |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Fixture-tree exemption matching the packaging gate |
| `.opencode/skills/system-spec-kit/runtime/cli/` tests, `generate-context.ts`, and three loader path literals | Modify | Residue closed against 049, injectable project root, scaffold loader resolved from the skill root |
| `research/findings-register.md` | Create | Forty-five findings, each Fixed, Planned or Decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Gate A and Gate B each have a committed corpus and a recorded number that a second run reproduces |
| REQ-002 | Every declared signal across the five hubs is classified into exactly one bucket, and every unresolved signal has a decision beside it |
| REQ-003 | Every finding in the register reads Fixed, Planned with an owner, or Decision with a reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every hub surface agrees with its registries, and a check exists that fails when they diverge |
| REQ-005 | The document validator exempts what the packaging gate exempts, and a template's fenced payload is scanned |
| REQ-006 | The spec-kit residue is decided against packet 049 first, and what survives is implemented |
| REQ-007 | The numbers are re-measured after any move of the tree they were measured on, and what moved is repaired or owned |

> Acceptance criteria for these requirements live in each phase's `acceptance-criteria.md`,
> which is the document that decides whether that phase may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Gate A reads 345 of 388 on 2026-09-04 and 343 of 388 on 2026-09-05, both from committed per-row artifacts, with the two moved rows ruled
- **SC-002**: Gate B reads 8 of 180 at baseline, 21 of 180 after the vocabulary fixes, and 20 of 180 on 2026-09-05, each from a committed artifact
- **SC-003**: All forty-five register rows carry a state, and `validate.sh --strict --recursive` prints `RESULT: PASSED` for the parent and every child
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor scorer holding still | Any scoring change voids Gate A and Gate B together | The semantic lane work moved to its own packet under `specs/system-skill-advisor/` |
| Dependency | Packet 049's delete list | A residue decision closed as superseded is wrong if the scope moves | Each ruling records the check date; 049 has since closed |
| Risk | A green gate that reads registries and nothing else | High | Phase 005 added the command-column check; phase 006 made templates scan their payload |
| Risk | The tree moving under the numbers after closure | Med | Phase 008 re-measured within two days and fixed the scaffold the move broke |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full Gate B sweep of 180 daemon calls completes inside one daemon generation window, so every row describes one state

### Security
- **NFR-S01**: No test in the residue writes into the real `specs/` tree; the save path's write guard stays in force

### Reliability
- **NFR-R01**: Every number in this packet is reproducible by re-running the committed corpus through the committed command

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a prompt that returns no recommendation is counted as empty, never as a wrong hub; 93 of 180 do
- Maximum length: the corpora are fixed at 388 signals and 180 prompts; a run returning a different count is a runner defect

### Error Scenarios
- External service failure: a daemon call that errors is an error row, excluded from the tally, with the error count stated
- Network timeout: each daemon call carries a 60 second bound

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: five hubs, the advisor, the doctor check, two scanners, the spec-kit CLI; Systems: routing, validation, spec-kit |
| Risk | 16/25 | Auth: N, API: N, Breaking: routing inputs every packet creation and every prompt pass through |
| Research | 18/20 | Two gates defined and measured, forty-five findings traced |
| Multi-Agent | 6/15 | Parallel review passes fed the register |
| Coordination | 12/15 | Depends on 049 and on the scorer freeze |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Vocabulary work that moves no Gate B row is reported as improvement | M | M | D5: such work is reported as moving nothing, and phase 004 was narrowed on that reading |
| R-002 | A collision fixed by preference costs the losing hub a prompt it owned | M | M | Phase 004's rule: decide by the losing hub's written boundary, and canaries on the five hubs outside scope |
| R-003 | The tree moves after closure and the numbers silently stop being true | H | H | Phase 008 exists for exactly this, and its artifacts keep the recorded bucket beside the re-run |

---

## 11. USER STORIES

### US-001: An operator asks whether routing is complete (Priority: P0)

**As an** operator, **I want** the word complete to have a number behind it that a second run reproduces, **so that** a hub's reachability is a measurement and not an impression.

**Acceptance criteria:** see phases 002 and 003, `acceptance-criteria.md`.

---

### US-002: A maintainer picks up a finding (Priority: P1)

**As a** maintainer, **I want** every finding in one register with a state and an owner, **so that** nothing diagnosed in a review session is lost to the next one.

**Acceptance criteria:** see `research/findings-register.md` and each phase's `acceptance-criteria.md`.

---

## 12. OPEN QUESTIONS

Two, and both are decisions rather than unknowns.

Whether the two scorers should be reconciled at all, or whether one is simply the automatic
path and the other a manual command that should stop being documented as equivalent. They
disagree on roughly a third of prompts, which is too much to leave undescribed and too
invasive to repair inside a packet whose every number depends on the scorer holding still.
Phase 008 adds evidence: the parity pin between them reads three different numbers in one
session depending on which skill-graph database the run sees.

Whether a request that genuinely spans two hubs should resolve to one of them or surface as
ambiguous. The runtime already surfaces ambiguity, so the honest answer may be that a tie is
the correct outcome and the target should exclude those rows rather than counting them as
misses.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Goal**: See `goal.md`
- **Roadmap**: See `roadmap.md`
- **Findings register**: See `research/findings-register.md`
- **Per-phase plans, tasks, criteria and decisions**: inside each child folder

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-transport-and-baseline/ | Settle which scorer governs automatic routing, then freeze the baseline every later number is measured against | Complete |
| 2 | 002-gate-a-signal-closure/ | Every declared signal across all five hubs resolves to exactly one mode | Complete |
| 3 | 003-gate-b-realistic-corpus/ | A committed corpus of phrasings people actually type, and the rate at which they land | Complete |
| 4 | 004-cross-hub-vocabulary/ | The collision no single hub can fix, decided jointly and re-measured | Complete |
| 5 | 005-hub-surface-truth/ | The hub documents that contradict their own registries, and a gate so they cannot again | Complete |
| 6 | 006-validator-and-template-debt/ | The fixture exemption, the template scanning gap, and the boilerplate a template keeps seeding | Complete |
| 7 | 007-spec-kit-residue/ | The remaining suite failures, the untypechecked tests, and the five calls that need a human | Complete |
| 8 | 008-drift-after-closure/ | Both gates re-measured after the runtime nesting, the scaffold it broke repaired, and the two moved numbers ruled | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | The governing transport is named with the code path that proves it, and a baseline is recorded | The named path is read end to end, and re-running the baseline reproduces its numbers |
| 002 | 003 | Every declared signal is classified, and none sits in an unexplained bucket | A fresh sweep reproduces the counts, and each unresolved signal has a decision beside it |
| 003 | 004 | The corpus is committed and re-runnable, and its rate is recorded | A second run of the same corpus returns the same rate |
| 004 | 005 | The collision is decided, both hubs re-measured, canaries green and manifests fresh | Neither hub lost a prompt it owned, shown by the before and after tables |
| 005 | 006 | Every hub surface agrees with its registries, and a check exists that fails when they diverge | Removing an entry makes the new check fail |
| 006 | 007 | The validator exempts what the packaging gate already exempts, and templates scan their own payload | A template with a seeded blocker is caught rather than scoring clean |
| 007 | 008 | Every residue decision is implemented or superseded with its reason, and the suite runs to the end | Both gates re-run after the tree moved, with the recorded bucket beside the re-run bucket |
<!-- /ANCHOR:phase-map -->
