---
title: "Acceptance Criteria: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T13:43:03Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/006-restraint-and-routing-gates
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a task whose prompt scores below the advisor threshold, When the agent is about to make its first code or markdown write, Then a routing obligation still binds | `AGENTS.md` Gate 2 carries the artifact trigger, stated as binding independently of the advisor score | Met | - |
| AC-002 | REQ-002 | Given an agent that has loaded only the root document, When it is about to add code, Then the restraint ladder is reachable and its authority is named | `AGENTS.md` names the six rungs in source order and cites `code-quality-standards.md` section 1 | Met | - |
| AC-003 | REQ-003 | Given a change that adds tests, When the agent decides how many, Then an author-time restraint rule applies and names its floor | `AGENTS.md` carries the test-restraint bullet citing the boundary-coverage floor; `git show HEAD~1:AGENTS.md` had no such rule | Met | - |
| AC-004 | REQ-004 | Given any rule added by this packet, When a reader follows its pointer, Then the pointer resolves and the rule does not restate what it points at | `test -e` loop over all cited paths returns present for each; no added line reproduces the ladder rationale or a mode table | Met | - |
| AC-005 | REQ-005 | Given a skill contract that fits the task badly, When the agent proceeds, Then it follows the contract and names a concrete amendment rather than working around it silently | `AGENTS.md` PLAN-WORKFLOW LOCK step 4, reinforced by the same clause in the Gate 2 artifact trigger | Met | - |
| AC-006 | REQ-006 | Given a user who signals they did not understand, When the agent responds, Then it changes modality via a skill the advisor can never recommend | `AGENTS.md` carries the routing rule naming both commands, and states the closing caveat does not waive it | Met | - |
| AC-007 | REQ-007 | Given the applied change set, When the diff is measured, Then it is at most twelve changed lines | Superseded by an operator-directed scope amendment; see the record | Superseded | ADR-001 |
| AC-008 | REQ-008 | Given the finished packet, When strict validation runs, Then it reports no errors and no warnings | `validate.sh <folder> --strict` exit 0 | Met | - |
| AC-009 | REQ-007 | Given the amended scope, When the change set is measured, Then the always-loaded file does not grow | Superseded by a second review-driven revision that adds one line; see the record | Superseded | ADR-002 |
| AC-010 | REQ-004 | Given that this document is symlinked into other repositories, When a rule names a skill, Then it must not name that skill's internal surfaces, modes, or packets | A regex sweep for this repo's mode names, surface and phase keys, and a mode placeholder matches no line added by this packet | Met | - |
| AC-011 | REQ-007 | Given the review-driven revision, When the file is measured, Then growth is at most one line and every other change is an in-place rewrite | 548 to 549 lines; the added line is the Self-Check item covering the new routing trigger, and six of the seven changes rewrite a line rather than add one | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

The packet carried on AC-001 and AC-004: the routing obligation now binds on what is about to be written rather than on how a prompt scored, and every rule it adds points at a contract instead of copying one. AC-010 was added after review caught the opposite failure in the first draft, and is the criterion most likely to matter to the next editor of this file.

Left out deliberately: the remaining review findings against pre-existing content, including the gate-architecture and confidence-threshold tensions and the always-loaded restatements in the spec-folder and git sections. They are real, they are logged, and they are outside the scope this packet froze.
<!-- /ANCHOR:closure -->
