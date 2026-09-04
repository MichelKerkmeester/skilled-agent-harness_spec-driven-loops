---
title: "Feature Specification: Phase 4: cross-hub-vocabulary"
description: "The cross-hub collision is real and smaller than it looked. Both gates now show vocabulary was never the binding constraint, so this phase fixes the collisions worth fixing and stops pretending keyword work reaches natural language."
trigger_phrases:
  - "cross hub vocabulary"
  - "bare token collision"
  - "gate b vocabulary limit"
  - "executor delegation override"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase spec against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/graph-metadata.json"
      - ".opencode/skills/sk-doc/graph-metadata.json"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Vocabulary work cannot move Gate B; 94 of 180 prompts match no declared word"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: cross-hub-vocabulary

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Three bare single-word tokens let the code hub swallow the documentation hub's entire
purpose, and a run-time override inserted routeless entries at rank one under bare executor
names. Both were fixed against each losing hub's own written boundary, both hubs were
re-measured, and no hub lost a prompt it owned. The phase then recorded plainly that keyword
ownership cannot reach the 94 of 180 realistic prompts that contain none of the declared
words in any form.

**Key Decisions**: only vocabulary-shaped collisions are in scope, and the duplicate
bare-name entries are removed rather than reweighted.

**Critical Dependencies**: the advisor daemon holding still, since the parent packet's D2
forbids a scorer change while these numbers stand.

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
| **Phase** | 4 of 7 |
| **Predecessor** | 003-gate-b-realistic-corpus |
| **Successor** | 005-hub-surface-truth |
| **Handoff Criteria** | Both hubs re-measured with no owned prompt lost, manifests fresh, five canaries green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the routing completeness phases specification.

**Scope Boundary**: hub vocabulary declarations and the executor-delegation override that
synthesizes rank-one entries. The scorer itself is out of bounds under the parent's D2.

**Dependencies**:
- Gate A, measured in phase 002, which supplies the declared-signal denominator.
- Gate B, measured in phase 003, which is what re-scoped this phase after the fact.
- The five hub canaries and the compiled-route manifests, which gate every routing edit.

**Deliverables**:
- Three bare tokens qualified to the sense they meant, in `sk-code/graph-metadata.json`.
- Documentation-hub phrasings that match how people ask, in `sk-doc/graph-metadata.json`.
- An executor override that lifts the hub instead of inserting a routeless rank-one entry.
- A written statement of what keyword ownership cannot reach.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This phase was scoped before either gate was measured, on the belief that a cross-hub
vocabulary collision was the main obstacle. Both measurements have since arrived and the
belief was half right.

The collision is real. One hub wins fourteen rows it does not own, another wins sixteen
across three hubs on surface vocabulary, and one identical intent loses decisively when
phrased with a product name and returns nothing at all without it.

But vocabulary is not what holds the realistic number down. Ninety-four of one hundred and
eighty prompts return nothing at all, because they contain none of the declared words in any
form. Adding words to the same lists moves signals, which is the other gate, and leaves a
sentence that shares no vocabulary exactly where it was.

So this phase narrows to the collisions that are genuinely vocabulary-shaped and hands the
rest to a decision it cannot make alone.

### Purpose

Every collision that keyword ownership can settle is settled, both hubs are re-measured, and
the part that keyword ownership cannot reach is stated plainly rather than absorbed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The duplicate uncompiled entries under bare executor names, which outrank their own
  compiled routes. One hub, twelve rows, one shape.
- The surface-vocabulary bundling that takes rows belonging to three other hubs.
- Removing the command-surface modes from the realistic denominator, since they route by a
  channel this corpus does not exercise.
- Re-measuring both hubs after every change, with canaries and manifests, so a win here is
  not a loss somewhere unmeasured.

### Out of Scope

- Reaching the realistic target by adding keywords. The measurement says that does not work,
  and a phase that tried would report progress without producing any.
- Enabling the semantic lane. That is the work that would move the number, it is a scoring
  change rather than a vocabulary one, and it needs its own decision because it invalidates
  every measurement in this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/graph-metadata.json` | Modify | Three bare tokens qualified to the code sense they meant (`f8c2595ce0`) |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | Documentation-hub phrasings people actually use (`f8c2595ce0`) |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Stage-two classes for phrases that reached the hub and dropped (`461ef9261f`, `08eb67a0de`) |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Modify | Executor routing rebuilt around the compiled route (`08eb67a0de`) |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Modify | Mode declarations aligned with the router (`08eb67a0de`) |
| `.../system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts` | Modify | The override lifts the hub rather than inserting a routeless entry (`08eb67a0de`) |
| `.../scripts/routing-accuracy/holdout-prompts.jsonl` | Modify | Gold labels re-captured after the override change (`08eb67a0de`) |
| `.../013-live-activation/activation/*/manifest.json` | Modify | Compiled-route manifests regenerated with each routing edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Duplicate uncompiled entries under bare executor names are removed so the compiled route wins, rather than reweighted |
| REQ-002 | Every vocabulary change is re-measured on both hubs, and neither loses a prompt it owns |
| REQ-003 | Any routing file edit ships with regenerated compiled-route manifests and green canaries in the same commit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | What keyword ownership cannot reach is written down rather than absorbed into a progress claim |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No routeless rank-one entry survives under any bare executor name, and the
  compiled route carries the result instead.
- **SC-002**: A before and after run of both hubs' own prompt sets shows no row moving away
  from its owner.
- **SC-003**: Compiled-route manifest freshness reports fresh for all five hubs and all five
  hub canaries exit 0.
- **SC-004**: The limit of keyword ownership is recorded with its number, not implied.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon and its frozen weights | Every number in this phase is void if the scorer moves | The parent packet's D2 forbids a scorer change while these numbers stand |
| Dependency | Compiled-route manifests and the five canaries | A routing edit without them is unverifiable | Regenerate manifests and re-pin canary digests in the same commit as the edit |
| Risk | A vocabulary fix helps one hub by taking rows from another | High | Re-measure both hubs and treat any owned row lost as a revert trigger |
| Risk | A phrase declared in stage one with no stage-two class | Medium | Sweep all declared signals for the reach-then-drop shape and give each a class |
| Risk | Reporting a Gate B move as routing improvement | Medium | Record the move as one mechanism removed, which is what the commit message says |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A vocabulary change adds no measurable latency to a recommendation, since it
  changes declared words rather than the scoring path.

### Security
- **NFR-S01**: No credential, token or path outside the repository enters a routing file.

### Reliability
- **NFR-R01**: Scorer accuracy metrics stay byte-identical to the committed baseline after
  the override change, with gold labels re-captured.

---

## 8. EDGE CASES

### Data Boundaries
- A prompt containing none of the declared words: returns nothing, and no keyword change
  reaches it. This is the 94-row bucket.
- A prompt containing a bare token in its incidental sense: a qualified match must beat it.

### Error Scenarios
- A signal reaches a hub and resolves to nothing: stage one and stage two draw from different
  files, so the phrase lands on the hub and drops.
- A canary fixture fails mid-change: the change is reverted rather than the digest re-pinned.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 9, LOC: ~200, Systems: 3 hubs plus the scorer |
| Risk | 17/25 | Auth: N, API: N, Breaking: Y for routing behavior |
| Research | 14/20 | Two gates measured before the scope could be settled |
| Multi-Agent | 6/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: manifests, canaries, gold labels |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A fix moves rows away from their owning hub | H | M | Three-suite regression control across 444 signals, 180 prompts and 224 controls |
| R-002 | A stale canary digest disarms the tripwire | H | L | Digests recomputed from files, and a stale digest still fails |
| R-003 | Gate B movement is read as routing improvement | M | H | The commit message and this spec both name it as one mechanism removed |

---

## 11. USER STORIES

### US-001: The compiled route wins under a bare executor name (Priority: P0)

**As a** routing operator, **I want** a bare executor name to resolve through its compiled
route, **so that** the recommendation carries a destination rather than a rank-one entry with
none.

**Given** a bare executor name declared under the executor hub, **When** the advisor is
asked, **Then** the top result is the hub identity carrying a compiled route.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A vocabulary change costs no hub a prompt it owns (Priority: P0)

**As a** hub owner, **I want** every vocabulary change re-measured on both hubs, **so that** a
win on one surface is not a silent loss on another.

**Given** a corpus row whose owner is one of the two changed hubs, **When** both hubs are
re-measured, **Then** the row still resolves to its owner.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Findings 13, 14 and 15 name collisions this phase did not attempt, and they remain owned
  rather than closed.
- The 94-row bucket needs the semantic lane, which the parent packet routes to its own packet
  under `specs/system-skill-advisor/`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
