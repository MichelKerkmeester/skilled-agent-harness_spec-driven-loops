---
title: "Feature Specification: Consolidate the communication repo rules"
description: "The five communication rules repeated each other, contradicted each other in two places and broke their own punctuation rules. This packet merges the duplicates, fixes the conflicts and adds the changelog template's reader-impact habits."
trigger_phrases:
  - "communication rules consolidation"
  - "consolidate the communication repo rules move the writing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Consolidate the communication repo rules

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `scaffold/018-communication-rules-consolidation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
"Lead with the answer" was stated in five places, and two of them disagreed (payload in the first line against outcome within two lines). The working and boundary writing styles lived in an honesty rule that Gate 6 never loads. The complex-request opening asked for a restatement that the filler rule bans. The rule files also broke their own bans on em dashes, semicolons and serial commas.

### Purpose
One home for each communication norm. No rule contradicts another, and the rules follow their own house style. Add the reader-impact habits the operator liked in the changelog template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five agreed changes and three optional changes the operator chose after four reviews.
- A compliance baseline, so a later measurement can show whether the edits moved behavior.

### Out of Scope
- A reply card or any other delivery change. Packet `016-repo-rule-advisor-surfacing` found the bottleneck is binding, not delivery volume, and a card does not fit in Devin's 16 KB prefix.
- Moving the per-runtime question-tool table. The operator kept it there over a research refusal (REPO RULES.md).
- Renaming `answer-the-actual-request.md`. Three of four reviewers refused it.
- Moving the plain-rewrite procedure into the human-voice skill. That skill's triggers do not match "say that more plainly", so the procedure would stop loading when it is needed. It was shortened in place instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/communication.md` | Modify | Registers moved in, one answer-first section, reader-impact and say-once guidance, shorter re-render |
| `.skilled/repo-rules/communication-prose.md` | Modify | Identifier and number guidance, the semicolon join made explicit |
| `.skilled/repo-rules/communication-decisions.md` | Modify | Answer-first opening for ambiguous requests, the restate/approach/questions preface removed |
| `.skilled/repo-rules/communication-handoff.md` | Modify | Receipts after the outcome, beside the claim |
| `.skilled/repo-rules/answer-the-actual-request.md` | Modify | House-style fixes |
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modify | Registers moved out, the hedge rule kept, house-style fixes |
| `REPO RULES.md` | Modify | Router and index rows matched to the edited text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every norm the edited sections carried survives in exactly one home | The research ledger maps each moved or merged clause |
| REQ-002 | Rule guards stay green | `check-repo-rules` 11/11, `check-rule-copies` OK, the rule measurement tests pass |
| REQ-003 | The rule files carry no hard voice blockers of their own | `hvr_scan.py` reports 0, apart from quoted examples of banned words |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A baseline exists for a later before-and-after | `research/baseline-2026-10-07.txt` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No two communication rules state the same norm differently.
- **SC-002**: A later run of `measure-rule-compliance.py` can compare the new rule versions with the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A clause lost in a merge | Med | Clause ledger in research.md and reviewer cross-check |
| Risk | Edits change no behavior | Med | Baseline recorded, re-measure after more sessions |
| Dependency | Too few sessions since Gate 6 to judge delivery | Low | Delivery work deferred |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this packet. Whether the semicolon rate falls under the new wording waits on more sessions.
<!-- /ANCHOR:questions -->

---
