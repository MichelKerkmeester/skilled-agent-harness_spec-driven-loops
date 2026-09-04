---
title: "Feature Specification: Phase 3: gate-b-realistic-corpus [template:level-3/spec.md]"
description: "Eight of one hundred and eighty phrasings a person would actually type reach the right mode. The cause is not vocabulary, so no amount of keyword work moves this number."
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
    packet_pointer: "sk-doc/052-routing-completeness/003-gate-b-realistic-corpus"
    last_updated_at: "2026-09-02T17:36:09Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase specification from shipped evidence"
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
    answered_questions:
      - "Gate B is 8 of 180 top-only, 20 of 180 any-position, 8 of 172 excluding command-bridge"
      - "Right hub with the wrong mode happened zero times in 180 rows"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: gate-b-realistic-corpus

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A 180-row corpus of the phrasings people write was authored by hand, committed and
measured against the live daemon. Eight rows reached their intended mode as the top pick, and
94 returned nothing at all, which puts the cause outside vocabulary work and re-scopes the
phase that assumed otherwise.

**Key Decisions**: The corpus shares no vocabulary with the declared keywords, and modes that
route by command surface leave the denominator.

**Critical Dependencies**: Phase 001, for the transport and the confidence-floor rule, and each
hub's `mode-registry.json`, which the corpus was written against.

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
| **Phase** | 3 of 7 |
| **Predecessor** | 002-gate-a-signal-closure |
| **Successor** | 004-cross-hub-vocabulary |
| **Handoff Criteria** | The corpus is committed and re-runnable, and its rate is recorded with its denominator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the routing completeness phases specification.

**Scope Boundary**: Measuring realistic phrasings and locating the cause of the misses. No
scorer, weight or embedding was changed, and no vocabulary was added so the corpus would land.

**Dependencies**:
- Phase 001, for the transport, the confidence floor and the rank rule.
- Each hub's `mode-registry.json` and its packets' `SKILL.md` files, which the corpus was written against.

**Deliverables**:
- `assets/realistic-corpus.tsv`, 180 prompts across 43 modes in five hubs.
- `research/gate-b-measurement.md`, the rate, the miss mechanisms and the reproduction recipe.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Against a corpus of 180 prompts written the way people write, 8 reach the intended mode.
Reading generously, counting the mode appearing anywhere in the returned list rather than
first, 20 do. Ninety-four return no recommendation at all.

An earlier corpus scored 44 percent, and the difference between the two is the measurement
rather than a regression. That corpus used phrasings close to the declared keywords. This one
does not, and the advisor matches keywords by substring.

**The cause is structural.** The only lane that could match meaning rather than spelling is
weighted at 0.05, carries a shadow flag that excludes it from live scoring, and has no
embeddings at all: zero of fourteen skill nodes. Semantic matching exists as scaffolding, is
switched off, and has no data behind it. So vocabulary work cannot move this number, and a
phase that adds keywords would report progress while changing nothing a user experiences.

Three mechanisms underneath are precise and worth separating from that:

- One hub carries duplicate advisor entries under bare executor names, uncompiled, which
  outrank the correct compiled route. Twelve rows, one hub, one shape.
- Two modes route by command surface rather than by prompt, so they can never be reached
  through this channel and do not belong in the denominator.
- A hub outside the measured five wins fourteen rows, so the collision is wider than the
  five-hub framing assumed.

Right hub with the wrong mode happened zero times in 180 rows. Stage two is accurate whenever
it fires, which locates the whole problem at stage one.

### Purpose

The corpus is committed and re-runnable, the honest starting number is on record, and the
work that would actually move it is separated from the work that would only look like it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Writing a corpus of realistic phrasings by hand, at least four per mode across 43 modes.
- Measuring it through the live daemon and recording the rate with its denominator.
- Classifying every miss by mechanism, so the structural cause is separated from the cosmetic ones.
- Correcting the denominator for modes that route by command surface.

### Out of Scope
- Enabling the semantic lane. It is a scoring change, which parent decision D2 forbids here, and it moves to its own packet under `specs/system-skill-advisor/`.
- Adding vocabulary so the corpus would land. That measures the corpus rather than the routing.
- Fixing the cross-hub collisions this measurement exposed. Phase 004 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/realistic-corpus.tsv` | Create | 180 prompts across 43 modes, none naming its own mode |
| `research/gate-b-measurement.md` | Create | The rate, per-hub and per-mode tables, miss mechanisms, boundary rows, reproduction recipe |
| `research/gate-b-measurement.md` | Modify | Denominator correction appended, with both readings side by side |
| `../004-cross-hub-vocabulary/spec.md` | Modify | The next phase re-scoped, because this measurement invalidated its premise |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Commit a corpus of at least three realistic phrasings per mode, none of which contains its own mode name |
| REQ-002 | Measure the corpus through the daemon and record the hit rate with its denominator, reproducibly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Locate the structural cause of the misses by reading the semantic lane weight and its embedding count |
| REQ-004 | Exclude modes that route by command surface from the denominator, and state the reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The corpus is committed, 180 rows, and no row contains its own intended mode name. Matches AC-001.
- **SC-002**: The rate is recorded and reproducible against the state it was measured in. Matches AC-002.
- **SC-003**: The semantic lane weight and embedding count are on record as the structural cause. Matches AC-003.
- **SC-004**: Both command-surface modes are named with their routing class, and both denominators are published. Matches AC-004.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon | Without it the corpus cannot be measured at all | 180 calls at roughly five seconds each, run as a background script |
| Dependency | Each hub's `mode-registry.json` | A corpus written against a stale registry measures modes that no longer exist | Prompts were written against the registries and the packets' own `SKILL.md` files |
| Risk | The number is read as a regression against the earlier 44 percent | High | Both are recorded, with the difference named as the corpus rather than the routing |
| Risk | A reader concludes that more keywords would fix it | High | 94 of 180 rows match no declared word in any form, and that count is published |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single corpus call returns within the 60 second timeout. Observed: roughly five to six seconds per prompt.

### Security
- **NFR-S01**: The measurement is read-only against the advisor, so no trusted-context flag was needed.

### Reliability
- **NFR-R01**: Every call writes its output to a file and its exit status separately, so a failed call cannot be hidden by a pipeline.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty `recommendations` array is the largest single outcome at 94 of 180, and it is a measured result rather than a failed call.
- Maximum length: prompts are full sentences by design, since the point is to measure how people write rather than which keywords they hit.

### Error Scenarios
- A prompt mentions a product name in passing: one boundary row lost at score 0.920 to `sk-code-opencode` for that reason alone, and a near-identical prompt without the word returned nothing.
- A repeat call hits the cache: several rows showed `cache.hit: true` on a verbatim repeat with an identical result, which is what makes the second run a reproduction rather than a new sample.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 4, LOC: 679 added, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N |
| Research | 20/20 | A hand-written corpus, a live measurement and a miss-mechanism classification |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 13/15 | Dependencies: phase 001 rules, and phase 004 which this re-scoped |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A phase spends effort on keywords that cannot move the number | H | H | 94 rows match no declared word, and that is stated as the reason phase 004 was re-scoped |
| R-002 | The 4.4 percent is read as a regression | M | H | The earlier 44 percent corpus is named as a different experiment |
| R-003 | Command-surface modes are counted as routing failures | M | M | Both are named with their routing class, and both denominators are published |

---

## 11. USER STORIES

### US-001: Measure routing the way it is used (Priority: P0)

**As a** person deciding where routing work should go, **I want** the rate measured on
phrasings people write rather than on the declared keywords, **so that** the number describes
what a user experiences.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Separate real work from work that only looks like it (Priority: P1)

**As a** phase owner, **I want** each miss classified by mechanism, **so that** effort goes to
the cause rather than to the symptom that is easiest to fix.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None open in this phase. The semantic lane is the structural cause of the 94-row bucket, and
whether to enable it is carried by finding 10 as a recorded decision rather than as an
unknown, since turning it on would void every measurement here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Measurement**: See `research/gate-b-measurement.md`
- **Corpus**: See `assets/realistic-corpus.tsv`
