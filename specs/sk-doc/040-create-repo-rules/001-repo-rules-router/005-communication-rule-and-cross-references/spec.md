---
title: "Feature Specification: Phase 5: Communication Rule and Per-Section Rule Pointers"
description: "AGENTS.md section 8 held 34 lines of one-line assertions about how a reply reads, with no room to say how - while demanding of everyone else that a best practice name the failure it prevents. And no section of AGENTS.md named the rule file that expands it, so the seven-rule set was reachable only from Gate 5. This phase moves section 8 into an eighth rule and gives every governed section a pointer."
trigger_phrases:
  - "communication rule"
  - "agents md section 8"
  - "repo rule pointers"
  - "per-section cross references"
  - "eighth rule file"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: Communication Rule and Per-Section Rule Pointers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-research-adoption |
| **Successor** | None |
| **Handoff Criteria** | Section 8 is a pointer, `communication.md` carries what it held, and every governed section names its rule |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the repo-rules router packet, added after the packet had closed
because the operator reopened a question phase 3 had deferred.

**Scope Boundary**: `AGENTS.md` section 8, one new rule file, pointer lines in the
`AGENTS.md` sections that have a governing rule, and the two router rows plus the scope
statement that reach the new file. No change to any rule file's existing content.

**Dependencies**:
- Phase 1's heading and divider convention, so the new rule is born conforming.
- Operator approval for the `AGENTS.md` edits, which phase 4 made a precondition.

**Deliverables**:
- `repo-rules/communication.md` - the eighth rule.
- `AGENTS.md` section 8 reduced to a pointer plus the two clauses that must bind unconditionally.
- Pointer lines in every `AGENTS.md` section with a governing rule.
- Router trigger row, index row, and a widened scope statement.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two problems, one cause. `AGENTS.md` section 8 was 34 lines - the fourth-largest section - carrying twelve one-line assertions about how a reply reads. Each is correct and none has room to say *how*: "vary the rhythm" is not actionable from one line, and the section instructs everyone else to name the failure a best practice prevents while doing that for none of its own bullets. Separately, and more quietly, **no section of `AGENTS.md` named a specific rule file.** All seven mentions were generic - the top-block description, GATE 5, the Self-Check line, and a Quick Reference row. A reader in section 3 thinking about blast radius was never told `blast-radius.md` existed. The rule set was reachable only from the gate that loads it, which means it was discoverable at the start of a session and invisible at the moment of need.

### Purpose
Give the communication rules somewhere to expand, and make every rule file reachable from the `AGENTS.md` section it governs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `repo-rules/communication.md` - registers, sentence and paragraph shape, words, length, filler, verdict-first ordering, presenting a recommendation, Ask-then-Do framing, the modality-change response, what the rule is not, and a self-check.
- `AGENTS.md` section 8 reduced to a pointer that names the broad trigger, plus the two clauses that must bind when nothing loads.
- Pointer lines in the `AGENTS.md` sections that have a governing rule.
- `REPO RULES.md` trigger row, index row, and scope statement.

### Out of Scope
- **Any change to the other seven rule files** - this phase adds and points; it does not revise doctrine shipped in phases 1 through 4.
- **Moving `uncertainty-and-honesty.md` section 6** - the two-registers material landed there one phase ago and is cross-referenced rather than relocated, because moving doctrine twice in two phases is churn, not design.
- **Pointers for sections with no governing rule** - Comment Hygiene, Gates 1 through 4, Violation Recovery, and the spec-folder mechanics have no rule file by design, and inventing one to make the table symmetrical is the failure `overengineering.md` names.
- **Enforcement tooling** - still excluded, consistent with every prior phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/communication.md` | Create | The eighth rule, carrying what section 8 held plus the expansion it had no room for |
| `AGENTS.md` | Modify | Section 8 reduced to a pointer; 18 pointer lines added across governed sections |
| `REPO RULES.md` | Modify | Trigger row, index row, widened scope statement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `repo-rules/communication.md` carries every rule `AGENTS.md` section 8 held, and none is lost in the move. |
| REQ-002 | The rule's trigger is every substantive reply, not only a complex or ambiguous one, so the writing register cannot go quiet on the short answers it most applies to. |
| REQ-003 | Section 8 retains the two clauses that must bind when no rule file has loaded: delivery never softens rigor, and voice is not a performance. |
| REQ-004 | Every `AGENTS.md` section with a governing rule names that rule by a link that resolves. |
| REQ-005 | No `AGENTS.md` edit lands without recorded operator approval, per the precondition phase 4 set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The new rule follows the established shape and phase 1's format. |
| REQ-007 | Each moved rule gains the *how* and the failure it prevents, which is what section 8 demanded of others and did not do for itself. |
| REQ-008 | The rule cross-references rather than duplicates doctrine owned elsewhere, particularly `uncertainty-and-honesty.md` section 6. |
| REQ-009 | The router's scope statement covers delivery, so the new rule is not sitting outside the stated scope of its own router. |
| REQ-010 | Sections with no governing rule get no pointer, and that absence is deliberate rather than an oversight. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent reading any governed `AGENTS.md` section learns which rule expands it, without going back to GATE 5.
- **SC-002**: All eight rule files are reachable from `AGENTS.md` by a resolving link.
- **SC-003**: Section 8's line count falls from 34 to under 10, and nothing it bound is lost.
- **SC-004**: The always-loaded net change is reported honestly, including the case where pointers cost more than the reduction saved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The writing register goes quiet - a triggered file does not load on a turn with no trigger, and most turns have none | High, and it is the risk the operator accepted knowingly when choosing the deeper move over a split | The trigger is written as every substantive reply rather than a specific action, and section 8's surviving pointer says so in bold. The two unconditional clauses stay always-loaded |
| Risk | Pointers cost more lines than section 8 saved | Med - the change would grow the always-loaded document while being sold as a reduction | Measured and reported rather than assumed; the net is stated plainly in the summary |
| Risk | Pointer rot - a rule is renamed and 18 links break | Med | Every link resolved against the filesystem as a closing check; the same audit re-runs cheaply |
| Risk | Pointers become noise, one on every heading | Low | Only sections with a governing rule get one; sections excluded by design get none, and REQ-010 makes that a requirement rather than an omission |
| Dependency | Operator approval for `AGENTS.md` | Phase 4 blocked `AGENTS.md` edits without it | Granted explicitly in the request that opened this phase, and recorded in the implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Context Cost
- **NFR-C01**: The net change to the always-loaded document is measured and reported, in either direction.
- **NFR-C02**: A pointer costs one line plus a blank; no pointer restates what the rule says.

### Discoverability
- **NFR-D01**: Every rule file is named from at least one `AGENTS.md` section.
- **NFR-D02**: A reader at the point of need finds the rule without returning to the gate.

### Consistency
- **NFR-K01**: The new rule matches the format and anatomy of its seven siblings.
- **NFR-K02**: Pointer lines share one shape, so they read as a class rather than as ad-hoc asides.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Pointer Boundaries
- **A section governed by more than one rule**: all are named, each with the aspect it governs, rather than picking one.
- **A section with no governing rule**: no pointer, deliberately - symmetry is not a reason to invent a rule.
- **A hard blocker with a related rule**: the pointer says the rule expands it and cannot override it, so no reader concludes otherwise.

### Trigger Boundaries
- **A short factual reply**: still fires the communication trigger, which is the whole point of writing the trigger broadly.
- **A turn that writes no reply**: nothing fires, and nothing is lost.
- **The rule already in context**: not re-read, like every sibling.

### Move Boundaries
- **A section-8 rule already owned elsewhere**: cross-referenced, not copied.
- **A section-8 clause that must bind unconditionally**: stays in section 8; the move is not allowed to be total just because it is tidier.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 new file (~190 lines), 2 modified, 18 pointer insertions |
| Risk | 12/25 | Touches `AGENTS.md` under approval; the accepted quiet-register risk dominates |
| Research | 4/20 | The question was already framed by phase 3's RQ2 and the parent's deferred open question |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the pointers be compacted into one mapping table beside GATE 5 instead of distributed? **No, and deliberately: a central table re-centralizes exactly what the operator asked to distribute. The cost is measured and reported instead.**
- Does the quiet-register risk need a follow-up measurement? **Yes, but not here - it can only be observed in live sessions, and inventing a proxy check for it now would be the speculation `overengineering.md` refuses. Raised for the operator rather than absorbed.**
<!-- /ANCHOR:questions -->

---
