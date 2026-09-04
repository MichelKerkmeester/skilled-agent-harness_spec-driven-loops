---
title: "Feature Specification: Phase 4: gated-enable"
description: "Turn the lane up behind the override the registry already reads, with five named canaries, a rollback that is one unset and a restart, and a Gate B target stated as a number with its derivation."
trigger_phrases:
  - "lane weight enable"
  - "advisor feature flag"
  - "canary prompts"
  - "gate b target"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/004-gated-enable"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Apply the researched weight through the environment override and measure"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-004-gated-enable"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the researched weight becomes the committed default or stays an override"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: gated-enable

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The lane runs at the weight phase 003 measured, applied through the environment override the lane
registry already reads, so the change is a restart rather than a release. Five canary prompts and
the full accuracy ratchet decide whether it stays. Gate B has to reach 30 of 172, and anything
below 20 of 172 reverts.

**Key Decisions**: The override is the switch, and the committed default only moves after the
override has held.

**Critical Dependencies**: Phase 002 for coverage, phase 003 for the weight, and phase 001 for the
baseline every comparison is made against.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-weight-and-fusion-research |
| **Successor** | 005-verification-and-closeout |
| **Handoff Criteria** | The lane runs at the researched weight, five canaries pass, and no ratchet metric dropped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Semantic lane enablement specification.

**Scope Boundary**: The lane weight and the switch around it. No embedding change, no fusion
rewrite and no scorer reconciliation.

**Dependencies**:
- Phase 002, because a weight applied to missing vectors changes the wrong variable.
- Phase 003, which supplies the number this phase applies.
- Phase 001, for the baseline and the instrumentation that shows the lane firing.

**Deliverables**:
- The lane running at the researched weight, reversible by one unset and a restart.
- `decision-record.md`, carrying the weight decision and the revert rule.
- The Gate B re-measurement against the frozen 180-row corpus.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Raising a lane weight changes every routing decision the advisor makes. The accuracy ratchet
holds six metrics against a committed baseline and treats a drop as a regression, which is the
right protection, and it is also captured under a regime that substitutes fixture vectors for real
ones. So the gate that would normally authorize this change cannot see the change.

That leaves two obligations. The enable has to be reversible without a release, and its effect has
to be measured on something the ratchet does not cover: the frozen realistic corpus, the
out-of-scope controls, and a small set of named prompts whose correct destination is not in doubt.

The reversibility is already available. The lane registry reads a weight override from the
environment, merges it over the defaults, clamps each lane between zero and one, and ignores the
value entirely when it fails to parse. So the switch exists, it is per lane, and it disappears when
the variable does.

### Purpose

Run the lane at a measured weight, prove it did not cost accuracy anywhere the project already
measures, and keep the revert to one command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Applying the researched weight through the environment override.
- Five canary prompts with their expected hub, run before and after.
- The full accuracy ratchet, the 224 out-of-scope controls and the frozen 180-row corpus.
- The revert rule, stated as a number and as a command.
- Moving the committed default only after the override has held.

### Out of Scope
- Changing embeddings. Phase 002 owns them, and moving both at once makes the result unreadable.
- Removing the retired shadow vocabulary from the code. It is dead weight rather than a blocker.
- Reconciling the daemon and Python scorers.
- Per-mode routing inside a hub, which never failed in the corpus and needs no change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/lib/scorer/lane-registry.ts` | Modify | The committed default, only after the override held |
| `mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Re-captured if a metric improves |
| `references/scoring/advisor-scorer.md` | Modify | The documented weight and the revert rule |
| `references/scoring/lane-weight-tuning.md` | Modify | The measured result and the sweep it came from |
| `decision-record.md` | Create | The weight decision, the target and the revert rule |
| `research/enable-measurement.md` | Create | Before and after numbers for every gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Apply the researched weight through the environment override, with no code change in the first run |
| REQ-002 | Prove the revert: unset the variable, restart, and show every metric returns to its pre-enable value |
| REQ-003 | Hold every accuracy ratchet metric at or above its committed baseline |
| REQ-004 | Reach at least 30 of 172 on the frozen realistic corpus, and revert below 20 of 172 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Pass five named canary prompts, each returning its intended hub at the top of the list |
| REQ-006 | Show the 224 out-of-scope controls did not lose a prompt, and the abstain failures did not rise |
| REQ-007 | Move the committed default only after the override has held across a full gate run, and record the decision |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The lane runs at the researched weight and the change is one environment variable. Matches AC-001.
- **SC-002**: One unset and a restart returns every metric to its pre-enable value. Matches AC-002.
- **SC-003**: No ratchet metric dropped. Matches AC-003.
- **SC-004**: Gate B reports at least 30 of 172 on the frozen corpus. Matches AC-004.
- **SC-005**: Five canaries return their intended hub first. Matches AC-005.
- **SC-006**: The controls lost nothing and the abstain failures did not rise. Matches AC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 weight | Without it this phase has nothing to apply | The phase does not start until the research reports a number |
| Dependency | Full coverage from phase 002 | A weight on partial vectors measures the gap | Coverage is re-counted immediately before the enable |
| Risk | The ratchet passes while real routing gets worse | High | The ratchet is necessary rather than sufficient here, and the corpus plus the controls carry the real verdict |
| Risk | The lane fires where the advisor should abstain | High | The abstain counts are a revert trigger, not a note |
| Risk | The committed default is moved too early | Medium | The default moves only after the override held through a full gate run |
| Risk | Another agent changes skill metadata mid-run | Medium | The corpus hashes and the coverage count are re-derived after the run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A recommendation stays inside the latency phase 001 recorded, and a rise above it is reported with the enable.
- **NFR-P02**: The per-call prompt embedding is the new cost. It is measured rather than assumed.

### Security
- **NFR-S01**: The override is read from the environment, so nothing about the enable is written into a committed file in the first run.

### Reliability
- **NFR-R01**: A missing embedding backend degrades the lane to no contribution rather than to an error.
- **NFR-R02**: The revert needs no build, no migration and no deploy.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a prompt that returns nothing even at the new weight, which stays a measured result.
- Maximum length: the full corpora at the new weight, which is the largest run this phase makes.
- Invalid format: an override that fails to parse, which the resolver ignores in favour of the defaults, so a typo silently keeps the old weight. The run records the resolved weights rather than the intended ones.

### Error Scenarios
- External service failure: the embedding backend stops, the lane contributes nothing, and routing falls back to the other four lanes.
- Network timeout: a slow embed on the prompt side, which shows up as latency rather than as a wrong answer.
- Concurrent access: two daemons with different overrides, which is why the resolved weights are read back from the status surface before any measurement.

### State Transitions
- Partial completion: the enable is applied and the measurement is interrupted, which leaves the override set. The revert command is the same either way.
- Session expiry: a daemon restart drops an override set only in one shell, which the read-back catches.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 6, LOC: about 320, Systems: 1 |
| Risk | 18/25 | Auth: N, API: Y, Breaking: routing behaviour for every caller |
| Research | 14/20 | Applying a measured number, and measuring what the default gate cannot see |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 12/15 | Dependencies: phases 001, 002 and 003 |
| **Total** | **62/100** | **Level 3** |

`recommend-level.sh --loc 320 --files 11 --architectural --db --api` returns level 3 at score 71.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A green ratchet is read as proof the change is safe | H | H | The fixture-vector regime is recorded in the phase and repeated in the decision record |
| R-002 | Gate B improves while the controls quietly lose prompts | H | M | The controls run at every point, and a loss is a revert trigger |
| R-003 | A typo in the override leaves the old weight and the run reports success | M | M | The resolved weights are read back from the status surface before any measurement |
| R-004 | The committed default lands before the override has held | M | L | REQ-007 sequences them, and the decision record names the order |

---

## 11. USER STORIES

### US-001: Route by meaning rather than spelling (Priority: P0)

**As a** person typing a request in their own words, **I want** the advisor to reach the right hub
without me using its declared keywords, **so that** routing works the way the system is actually used.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Undo it in one command (Priority: P0)

**As** the operator, **I want** a scoring change I can revert without a build or a deploy, **so that**
a bad result costs a restart rather than a release.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the researched weight becomes the committed default or stays an override. REQ-007 sequences the decision rather than answering it here, because the answer depends on how the override behaves across a full gate run.
- Whether the per-call prompt embedding cost is acceptable at the observed latency. It is measured in this phase, and a rise is reported with the enable rather than absorbed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
