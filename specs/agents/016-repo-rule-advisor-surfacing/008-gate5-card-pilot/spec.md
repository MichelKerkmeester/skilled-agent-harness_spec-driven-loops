---
title: "Feature Specification: Gate 5 card pilot"
description: "A rule's card plus self-check is 17% of its bytes and keeps each norm in checklist form, but nobody has measured behaviour under it. Pilot Gate 5 loading cards with the full file on demand against full files, in isolated test environments. The resident reply-rule card arm is dropped because it would push AGENTS.md past 32,768 bytes."
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
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-table-wording-experiment |
| **Successor** | 009-rule-delivery-debugging |
| **Handoff Criteria** | Pre-registered decision reached and the winning arm committed, or every pilot artifact removed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: A card generator, a sync check, one card loading arm against full files, and the pilot in isolated test environments. The rules themselves do not change.

**Dependencies**:
- Phase 003 shipped (AGENTS.md budget)
- Phase 004 analyzer
- The `rule-experiment.py` harness, committed in `edba53daeb`
- Phase 006 window measured before a winning arm goes live
- Phase 007 decision recorded before a winning arm goes live

**Deliverables**:
- `build-rule-cards.cjs` and 13 generated cards
- Check 11, cards in sync with sources
- Arm config `experiment/arms.json` and write-task prompts
- Pre-registration, scored runs, result and decision

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A plain card drops the operative bans in 6 of 13 rules. Card plus self-check keeps each norm in checklist form at 18,699 bytes for all 13 rules, 17% of the corpus, and 7,453 bytes for the five reply rules (`002-rule-concision-and-loading/prep/evidence-pack.md` §5). No lineage measured behaviour under any card. The reply rules are rarely loaded: `answer-the-actual-request.md` was read in 4 of 82 sessions.

### Purpose
Data that decides whether Gate 5 should load cards with full text on demand. Whether the reply-rule cards should sit resident in `AGENTS.md` §8 is settled by the REQ-005 size condition: they do not fit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic generator writing `.skilled/repo-rules/cards/<rule>.md` (Fires when, The rule, SELF-CHECK and a link to the full file)
- Check 11 in `check-repo-rules.cjs`: regenerated cards equal committed cards
- Arm `full` loads full files. Arm `cards` points the 13 trigger-table links at `cards/` and adds a sixth how-to-use line: open the full file when the card does not settle it
- Arm C, the five reply-rule cards resident in `AGENTS.md` §8, is dropped under REQ-005
- Pre-registration, isolated test environments built by `rule-experiment.py` with runs interleaved in a seeded order, and scoring with the phase 004 analyzer's checks

### Out of Scope
- Plain cards without the self-check - already shown unsafe
- A hook that injects cards - deferred until a measured miss rate justifies it, as 002 recommends
- Changing rule text - phase 006 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs` | Create | Card generator |
| `.skilled/repo-rules/cards/` | Create | 13 generated cards, live only if arm `cards` is adopted. The arm environments generate their own |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Check 11, card sync. Checks 2 and 10 too if arm `cards` is adopted |
| `REPO RULES.md` | Modify | Card links and the sixth how-to-use line, only if arm `cards` is adopted |
| `experiment/arms.json`, `experiment/prompts.json` | Create | Arm edits and the write-task prompts |
| `preregistration.md` | Create | Metrics, sample size, schedule and decision rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The generator is deterministic and check 11 fails when a card drifts from its source |
| REQ-002 | The pre-registration is committed before the first scored run |
| REQ-003 | Each arm reaches the pre-registered sample size |
| REQ-004 | The result reports the five prohibition checks, the fallback rate, delivered rule bytes per window and the Gate 5 and §8 miss rates per arm, with denominators and intervals, and applies the decision rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Arm C runs only if `AGENTS.md` plus the five reply-rule cards stays at or under 32,768 bytes. The spec estimated the cards at 7,453 bytes. Otherwise arm C is dropped and the reason recorded |
| REQ-006 | If arm `cards` is rejected, the generator, the cards and check 11 are removed |

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
| Risk | Arm C pushes `AGENTS.md` past Codex's cap | Closed | REQ-005 dropped arm C: 26,778 B plus 7,677 B of cards is 34,455 B |
| Risk | Overlap with phase 007 confounds both | Med | Both run in isolated environments that leave the live rule files unchanged, and a winner goes live only after 007 decides |
| Risk | Adopting arm `cards` breaks the corpus gate | Med | In the arm environment check 2 (row coverage) fails by design and check 10 passes with zero bullets. Both must resolve card links to their rules before the router change lands |
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
- The checker runs on the arm `cards` router: check 2 fails because no trigger row links a rule file, and check 10 finds zero Fires-when bullets to match.
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

- Is arm C worth its always-on cost of about 1.9k tokens? Settled without data: it does not fit under 32,768 bytes, so REQ-005 drops it.
- What counts as a fallback? A full rule file read after its card in the same compaction window.
<!-- /ANCHOR:questions -->

---
