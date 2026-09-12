---
title: "Feature Specification: Phase 3: root-doc-and-repo-rules"
description: "Execute the adopted allocations that land in the root doc, the rule router and the communication-shaped repo rules, including any new rule file."
trigger_phrases:
  - "agents md communication"
  - "repo rule communication change"
  - "colon rule adoption"
  - "verbless fragment ban"
  - "new repo rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: root-doc-and-repo-rules

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-synthesis-and-decisions |
| **Successor** | 004-sk-communication-upgrade |
| **Handoff Criteria** | The split lands, the router reaches both halves, and no two rules disagree on the same mark |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-communication clarity program.

**Scope Boundary**: The split of the reply-shape rule, plus the router rows that make both halves
reachable. Rule *content* moved out of this phase once the research showed the split is a
prerequisite rather than a contingency: the ten reply-shape candidates are phase 006's, the other
five are phase 008's, and the wording standard is phase 007's. The root doc is in scope only if
phase 002 finds a clause that cannot live below it, which the research says it will not.

**Dependencies**:
- Phase 002's allocation table, which is the only source of this phase's scope.
- The current text of `AGENTS.md`, `REPO RULES.md` and the three communication-shaped rules.

**Deliverables**:
- The reply-shape rule split in two along the seam the research named: sentence and paragraph
  mechanics on one side, whole-reply shape on the other. No new rule content.
- A router trigger row and index row for the new half, landing in the same change as the file.
- A recorded per-half size baseline, so phases 006 and 008 can check their own additions against it.
- A recorded per-mark instruction baseline, which every later phase compares against.
- Root-doc clauses only if phase 002 found one that cannot live below.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reply-shape rule takes ten of the twenty-nine adopted candidates, the largest single allocation
in the program. It also records its own length ceiling and an earlier split, made when the
decision-shape rules were moved out of it. Ten more candidates do not fit. The research therefore
promoted the split from a contingency to this phase's whole deliverable, and moved every piece of
rule content to the phases that follow.

Two baselines have to be captured here as well, because nothing later can be checked without them.
Nobody can claim a per-half size is acceptable without the pre-split size, and nobody can claim no
new contradiction without the pre-split instruction set.

### Purpose

Split the rule at the seam the merge exposed, make both halves reachable, and capture the two
baselines every later phase measures against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `repo-rules/communication.md`: the named-tic bans and the relation-word rule, as allocated.
- `repo-rules/presenting-decisions.md` and `repo-rules/handoff-and-questions.md`: the allocated sharpenings.
- New `repo-rules/*.md` files the allocation table created, each with its own trigger row and index row.
- `REPO RULES.md`: the trigger table row, the index row, and the scope statement if a widening is needed.
- `AGENTS.md`: only the clauses that must bind when nothing loads, and the register section if the thread-length instruction is adopted.

### Out of Scope
- `sk-communication` and its commands, which are phase 004's.
- The Human Voice Rules, which are phase 004's where they are touched at all.
- Runtime mirrors of the root doc, which are phase 005's rollout step.
- Any recommendation the allocation table did not adopt, however reasonable it reads on a second look.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/communication.md` | Modify | Named-tic bans, relation-word rule, resolved mark instruction |
| `repo-rules/presenting-decisions.md` | Modify | Allocated sharpenings to the decision shape |
| `repo-rules/handoff-and-questions.md` | Modify | Allocated sharpenings to the handback and the question surface |
| `repo-rules/[new-rule].md` | Create | Rules owning recommendations no existing file covers |
| `REPO RULES.md` | Modify | Trigger row, index row, and the scope statement if widened |
| `AGENTS.md` | Modify | Clauses that must bind when no rule file loads |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every change traces to an adopted row in phase 002's allocation table, and no change appears that the table did not authorize |
| REQ-002 | Every new rule file is reachable: the router's trigger table names it, and the trigger matches an action rather than a topic |
| REQ-003 | After the change, no two rule files give different instructions for the same punctuation mark or construction |
| REQ-004 | Every rule added names the failure it prevents, in the rule text, not only in the decision record |
| REQ-005 | `AGENTS.md` receives only clauses that must bind when no rule file loads, and each one says why it cannot live below |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each touched rule file keeps its stated length discipline, and a file at its ceiling splits rather than grows |
| REQ-007 | Each new rule file carries the standard header: routed-from line, the bounded-by statement, a fires-when list, and a self-check |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A walk of the router's trigger table reaches every file under `repo-rules/`, and every file under `repo-rules/` is named by at least one trigger.
- **SC-002**: A contradiction scan across `repo-rules/` and `AGENTS.md` for each punctuation mark and named construction returns one instruction per mark.
- **SC-003**: Every added rule paragraph names a failure, checked by reading rather than by grep, because a named failure is a judgment about specificity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 allocation table | No authorized scope | This phase does not open until the table is complete |
| Risk | A change to `AGENTS.md` reaches every session on every runtime | A bad clause degrades every reply until reverted | Keep the root-doc change to clauses that cannot live below, and revert the single file to roll back |
| Risk | A new rule file with no trigger row | The rule is never loaded and the work is invisible | REQ-002 makes reachability a blocker, verified by a trigger-table walk |
| Risk | Two rules disagreeing on one mark | The reader follows whichever loaded, so behavior becomes load-order dependent | REQ-003 makes a single instruction per mark a blocker |
| Risk | Rule set growth past what a reader can hold | The rules stop being followed, which is the failure the sources describe | Adopt only what the table authorized, and split a file at its ceiling rather than growing it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The root doc stays within the size that loads on every session without displacing task context.
- **NFR-P02**: A rule file stays readable in one pass, which is the constraint that forced the earlier split.

### Security
- **NFR-S01**: No credential, path secret or private identifier enters a rule file.
- **NFR-S02**: No rule file relaxes a hard blocker, and where one appears to, the root doc wins and the rule is wrong.

### Reliability
- **NFR-R01**: Every rule file is reachable through exactly the router, with no second discovery path.
- **NFR-R02**: A rule's trigger names an action, so it fires on what is about to happen rather than on the topic of the request.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an allocation table with no root-doc rows leaves `AGENTS.md` untouched, which is a valid outcome.
- Maximum length: a rule file that would exceed its readable ceiling splits, and the router gains a row for the new half.
- Invalid format: a rule file missing the standard header fails its own gate before the router is touched.

### Error Scenarios
- External service failure: not applicable, no dispatch runs in this phase.
- Network timeout: not applicable.
- Concurrent access: this phase holds the repository, so no lineage may run against it.

### State Transitions
- Partial completion: a half-applied allocation leaves the router and the rule file inconsistent, so the router row and the file land together.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Six or more documents, one of which loads on every session |
| Risk | 20/25 | The root doc governs every runtime, so a bad clause is felt everywhere at once |
| Research | 6/20 | The investigation happened in phases 001 and 002 |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does any adopted clause genuinely need the root doc, or does the router's reach cover it once Gate 5 is satisfied?
- If a read-only turn never loads the reply-shape rule, is the fix a root-doc clause, a gate change, or a mechanism, and is that this phase's call or phase 005's?
<!-- /ANCHOR:questions -->

---

