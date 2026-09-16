---
title: "Acceptance Criteria: Phase 4: migration-design"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "migration design acceptance criteria"
  - "skilled design closure gate"
  - "design review adjudication criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Wrote one criterion per requirement, all Unmet"
    next_safe_action: "Meet the criteria once phase 003 records resolve ADR-001"
    blockers:
      - "Phase 003 probe records for P1 to P3 do not exist yet"
    key_files:
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-004-acceptance-criteria"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: migration-design

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design
**Level:** 3
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the surface classes of phase 001 and the map classes of phase 002, When each is looked up in the traceability table, Then it appears in exactly one row with exactly one step | `plan.md` section "Surface class traceability": 17 rows, each with one step number, cross-checked against `001-deep-research/research/research.md:91-101` and `reconciliation.json:8-31` | Met | - |
| AC-002 | REQ-002 | Given the 25 cutover steps, When each step's check line is read, Then it names a runnable command whose output or exit status differs between success and failure | `grep -c '\*\*Check\*\*' plan.md` prints 25, and the T015 read-through finds no check worded as a description | Met | - |
| AC-003 | REQ-003 | Given the same 25 steps, When each rollback line is read, Then it names concrete commands or states why none is needed, and step 24 is named the point of no return | `grep -c '\*\*Rollback\*\*' plan.md` prints 25, step 24's heading in `plan.md` reads "This is the point of no return", and ADR-002 repeats it | Met | - |
| AC-004 | REQ-004 | Given blockers B1 to B6 (`001-deep-research/research/research.md:57-73`), When the blocker table is read, Then each is marked resolved or routed around with the step or probe that does it | `plan.md` section "Blocker resolution": six rows, each naming a step, an ADR or the decision tree | Met | - |
| AC-005 | REQ-005 | Given the phase 003 records, When ADR-001 is resolved, Then it names L1, L2 or a named stop, each probe verdict it rests on cites a phase 003 record, and the chosen shape keeps `.opencode/skills/system-spec-kit/SKILL.md` resolvable | `decision-record.md` ADR-001 Status reads Accepted, its Decision names one outcome, and the `goal.md` log lists the P1 to P3 record paths from T001 | Met | - |
| AC-006 | REQ-006 | Given the seven ordering constraints, When the cutover sequence is checked against them, Then no constraint is broken | `plan.md` section "Ordering constraints": seven rows, each naming the steps that satisfy it, and no accepted review finding reports an ordering break | Met | - |
| AC-007 | REQ-007 | Given the resolved design, When GPT-5.6 sol reviews it read-only on cli-codex, Then the return is kept and every finding carries a ruling | `review/gpt-5-6-sol-design-review.md` exists, and the adjudication table in `decision-record.md` holds one accept, reject or defer row per finding in that file | Met | - |
| AC-008 | REQ-008 | Given the chosen layout, When the keep-list is read, Then every kept `.opencode` reference names its reader and a file:line | `decision-record.md` ADR-003 table: rows K1 to K10 completed by T009, each with a Where cell and a Why cell | Met | ADR-003 now runs K1 to K13: K10 is marked not applicable under L1, and K11 to K13 were added by T009 and the review |
| AC-009 | REQ-009 | Given the four delegated evidence units, When each has run, Then its output exists under a kebab-case name and the orchestrator's verification is logged | `evidence/hook-opencode-lines.md`, `evidence/ci-workflow-root-surface.md`, `evidence/gitignore-root-rules.md` and `evidence/hand-made-link-targets.md` exist, `check_no_new_snake_case.py --changed-since 728c4f3efc` reports no offender in this folder, and the `goal.md` log holds one verification row per unit | Met | E2's first ten workflows were derived by the orchestrator after two empty lane returns, logged in the evidence file |

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

**Closeable:** No

All nine criteria are open. The phase can close once the phase 003 records resolve ADR-001 and the GPT-5.6 review is adjudicated, which together settle AC-005 and AC-007, the two criteria the others depend on.
<!-- /ANCHOR:closure -->
