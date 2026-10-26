---
title: "Feature Specification: Phase 8: claim-error-per-state"
description: "claimHandoff refuses every non-open note with one bare message. This phase adds a sentence per state so a session knows a done note is finished and who holds a claimed one."
trigger_phrases:
  - "claim error per state"
  - "phase 8 claim error per state"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: claim-error-per-state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 (wave 1) |
| **Predecessor** | ../007-compaction-pointer-staleness/spec.md |
| **Successor** | ../009-pi-arm-on-agent-settled/spec.md |
| **Handoff Criteria** | All six ACs Met and both test suites green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the research remediation packet. It makes each `claimHandoff` refusal say what the note's non-open state means.

This phase belongs to wave 1 and is independent. Build order follows the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: The refusal message in `claimHandoff` and the tests that cover it. Claim locking and seed text stay as they are.

**Dependencies**:
- None. The phase touches no code another wave 1 phase changes.

**Deliverables**:
- A per-state refusal message in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- Five new tests in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`claimHandoff` refuses any non-open note with one message, `cannot claim handoff with status ${status || 'missing'}` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1072-1076`). A session reading it does not learn that a done note is finished work, or who holds a claimed note. Research section 11a, lesson 3, names this gap.

### Purpose
A refused claim says what the note's state means, so a session never continues finished work or another session's claim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the prefix and add one sentence per state: done, claimed, missing status; an unknown status keeps the prefix only
- Failing-first tests for each new sentence

### Out of Scope
- Claim locking - the lock already serializes claims; this phase changes only the words
- Seed text - the relaunch seed is another phase's surface

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Per-state refusal sentence in `claimHandoff` |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Five new failing-first tests |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify only if needed | Today no CLI test asserts the full message; touch it only if one does |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every refusal keeps the prefix `cannot claim handoff with status X`. |
| REQ-002 | A done note's error says the work is finished and must not be continued, and names `superseded_by` when the note carries it. |
| REQ-003 | A claimed note's error names `claimed_by` and `claimed_at`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A note with no status says it is not a handoff note. |
| REQ-005 | Existing prefix tests pass unedited. |
| REQ-006 | An unknown status keeps the prefix only: `cannot claim handoff with status X`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a done note, **When** claimed, **Then** the error starts `cannot claim handoff with status done` and says it is finished, do not continue. (AC-001)
- **SC-002**: **Given** a note claimed by `s-1` at `2026-10-25T10:00:00Z`, **When** claimed again, **Then** the error names `s-1` and that time. (AC-002)
- **SC-003**: **Given** a note with no status, **When** claimed, **Then** the error starts `cannot claim handoff with status missing` and says it is not a handoff note. (AC-003)
- **SC-004**: **Given** the existing tests at about line 302 and line 1940, **When** run, **Then** they pass unedited. (AC-004)
- **SC-005**: **Given** a done note with `superseded_by: s-2`, **When** claimed, **Then** the error names `s-2`. (AC-005)
- **SC-006**: **Given** a note with status `withdrawn`, **When** claimed, **Then** the error is exactly `cannot claim handoff with status withdrawn`. (AC-006)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | - | - |
| Risk | A new sentence breaks a test that matches the full message | Low | Tests match the prefix by regex; keep the prefix first |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No added file reads; the message uses the frontmatter already parsed.

### Security
- **NFR-S01**: Note-supplied values come from `parseHandoff`, which reads one line per field, so they cannot carry a line break into the message.

### Reliability
- **NFR-R01**: The refusal still throws inside the lock and leaves the note unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty status: reported as `missing` with the not-a-handoff-note sentence.
- Claimed note with no `claimed_by` or `claimed_at`: the message says the value is unknown rather than printing blank.
- Unknown status such as `withdrawn`: the prefix only, `cannot claim handoff with status withdrawn`.

### Error Scenarios
- Concurrent access: two claims race; the lock makes the second see `claimed` and get the owner sentence.

### State Transitions
- Done note: refusal tells the session not to continue the work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function, one test file, about 40 LOC |
| Risk | 5/25 | Message text only; prefix kept |
| Research | 2/20 | Cause already located |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


