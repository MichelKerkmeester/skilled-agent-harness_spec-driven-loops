---
title: "Feature Specification: Gate 5 card pilot"
description: "A rule's card plus self-check is 17% of its bytes and keeps each norm in checklist form, but nobody has measured behaviour under it. Pilot Gate 5 loading cards with the full file on demand, and a third arm with the five reply-rule cards resident in AGENTS.md §8, against full files."
trigger_phrases:
  - "gate 5 card pilot"
  - "card plus self-check"
  - "resident reply rule cards"
  - "rule card generator"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-table-wording-experiment |
| **Successor** | None |
| **Handoff Criteria** | Pre-registered decision reached and the winning arm committed, or every pilot artifact removed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: A card generator, a sync check, two loading variants and the pilot. The rules themselves do not change.

**Dependencies**:
- Phase 003 shipped (AGENTS.md budget)
- Phase 004 analyzer
- Phase 006 shipped
- Phase 007 finished, so the windows do not overlap

**Deliverables**:
- `build-rule-cards.cjs` and 13 generated cards
- Check 11, cards in sync with sources
- Pre-registration, measurement blocks, result and decision

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A plain card drops the operative bans in 6 of 13 rules. Card plus self-check keeps each norm in checklist form at 18,699 bytes for all 13 rules, 17% of the corpus, and 7,453 bytes for the five reply rules (`002-rule-concision-and-loading/prep/evidence-pack.md` §5). No lineage measured behaviour under any card. The reply rules are rarely loaded: `answer-the-actual-request.md` was read in 4 of 82 sessions.

### Purpose
Data that decides whether Gate 5 should load cards with full text on demand, and whether the reply-rule cards should be resident in `AGENTS.md` §8.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic generator writing `.skilled/repo-rules/cards/<rule>.md` (Fires when, The rule, SELF-CHECK and a link to the full file)
- Check 11 in `check-repo-rules.cjs`: regenerated cards equal committed cards
- Arm A full files, arm B router loads cards with "open the full file when the card does not settle it", arm C arm B plus the five reply-rule cards resident in `AGENTS.md` §8
- Pre-registration, rotating blocks and analysis with the phase 004 analyzer

### Out of Scope
- Plain cards without the self-check - already shown unsafe
- A hook that injects cards - deferred until a measured miss rate justifies it, as 002 recommends
- Changing rule text - phase 006 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs` | Create | Card generator |
| `.skilled/repo-rules/cards/` | Create | 13 generated cards |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Check 11, card sync |
| `REPO RULES.md` | Modify | Arm B and C variants of the Load column, swapped at block boundaries |
| `AGENTS.md` | Modify | Arm C resident cards, swapped at block boundaries |
| `preregistration.md` | Create | Metrics, sample size, schedule and decision rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The generator is deterministic and check 11 fails when a card drifts from its source |
| REQ-002 | The pre-registration is committed before the first block |
| REQ-003 | Each arm reaches the pre-registered sample size |
| REQ-004 | The result reports the five prohibition checks, the fallback rate, delivered rule bytes per window and the Gate 5 and §8 miss rates per arm, with denominators and intervals, and applies the decision rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Arm C runs only if `AGENTS.md` plus 7,453 bytes stays at or under 32,768 bytes. Otherwise arm C is dropped and the reason recorded |
| REQ-006 | If an arm is rejected, its artifacts are removed. If both card arms are rejected, the generator, the cards and check 11 go too |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The decision follows the pre-registered rule.
- **SC-002**: The repository holds no unused card artifact after the decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cards lose content a rule needs, such as the blast-radius tier table | High | Full-file fallback in the router line, the fallback rate as a metric, and the pre-registered no-worse rule |
| Risk | Arm C pushes `AGENTS.md` past Codex's cap | Med | REQ-005 size condition |
| Risk | Resident cards sit past Devin's 16,384-byte cut | Med | Arm C is measured on Claude Code and Codex only, and the result says so |
| Risk | Overlap with phase 007 confounds both | Med | This phase starts after phase 007 closes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: The generator runs in under one second for 13 rules.
- **NFR-R01**: The generator output is byte-identical across runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A rule without a SELF-CHECK section: the generator fails, since rule anatomy requires one.
- A rule whose Fires-when list changes in a later edit: check 11 fails until the card is regenerated.
- A session that reads both the card and the full file: counted as a fallback, both deliveries recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Generator, 13 cards, checker, two instruction files |
| Risk | 15/25 | Changes what Gate 5 and every runtime load during the blocks |
| Research | 8/20 | Pilot design and sample size |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Is arm C worth its always-on cost of about 1.9k tokens? The §8 miss rate from the phase 004 baseline sets the bar in the pre-registration.
- What counts as a fallback? A full rule file read after its card in the same compaction window.
<!-- /ANCHOR:questions -->

---
