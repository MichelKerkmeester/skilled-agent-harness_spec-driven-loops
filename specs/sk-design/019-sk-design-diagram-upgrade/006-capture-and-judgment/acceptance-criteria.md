---
title: "Acceptance Criteria: Phase 6: capture-and-judgment"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment"
    last_updated_at: "2026-09-10T23:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 6"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T017 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-006-capture-and-judgment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: capture-and-judgment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment
**Level:** 3
**Status:** Draft
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `manual-testing-playbook.md` names three scenario categories today, When the persistence-contract scope is extended, Then it covers a capture-review scenario whose PASS/FAIL/SKIP outcome and reason persist only through `run-manual-playbook-scenario.cjs` into a dated `benchmark/reports/` directory | `grep -n "MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT"` output; the dated directory's generation provenance | Unmet | - |
| AC-002 | REQ-002 | Given F1.10's judged half names five specific reads, When the judged column is defined, Then each of the six checkable reads (connector overlap, fan, visible gap, behind-box, focal balance, type fit) is a yes/no question a reader can answer while looking at a capture | Direct read of the judged-column section in `manual-testing-playbook.md`; two independent readers reach the same verdict on a sample capture | Unmet | - |
| AC-003 | REQ-003 | Given pairwise connector geometry stays judged until a 2D pass exists, When the graduation threshold is stated, Then it names what that pass must compute for connector overlap and fan specifically | Direct read of the graduation-threshold statement | Unmet | - |
| AC-004 | REQ-004 | Given F3.3's risk is named but not measured, When the measurement plan is specified, Then it names the page, the disabled font stack, the comparison, and the fail threshold, scoped to the 7 arrow-label mask rects among `example-high-level.html`'s 36 raw `<rect>` elements | Direct read of the measurement-plan section; `grep -c "<rect" assets/examples/example-high-level.html` reports 36 | Unmet | - |
| AC-005 | REQ-005 | Given a judged item may become computable, When the graduation record is defined, Then its schema names the item, the family, the date and the evidence, and states plainly that nothing travels the other way | Direct read of the graduation-log section; the judged-boundary block and the graduation log never list the same item at once | Unmet | - |
| AC-006 | REQ-006 | Given `manual-testing-playbook.md`'s own split-document philosophy, When the new category and graduation log are added, Then both live inside the existing document rather than a new sibling file | `test -f` confirming no new top-level file was created for either | Unmet | - |
| AC-007 | REQ-007 | Given the comment-hygiene hard block, When any new marker comment or code snippet is added, Then none embeds a task id, finding id, ADR id, or REQ id, and the existing persistence-contract marker is quoted verbatim as a durable contract surface | `grep` for a bare `T[0-9]{3}`, `F[0-9]\.[0-9]+`, `ADR-[0-9]+`, or `REQ-[0-9]+` inside an HTML comment in the touched sections; none found | Unmet | - |
| AC-008 | REQ-008 | Given the skin-pinned third capture must prove the one-skin-per-file contract by eye, When the "different picture" test is specified and applied, Then a reader confirms the paper and ink swatches visibly differ from the unpinned capture, and an identical picture is recorded as a failed capture | Direct read of ADR-001; T014's recorded verdict on the first skin-pinned capture reviewed | Unmet | - |
| AC-009 | REQ-009 | Given headless Chrome follows the host machine's theme rather than a flag, When the double-capture convention is settled, Then it names the two captures, when each is taken, and what a reader compares between them | Direct read of the double-capture section | Unmet | - |
| AC-010 | REQ-010 | Given the persistence contract's own "every skip carries its reason" clause, When a `SKIP` verdict is persisted through `run-manual-playbook-scenario.cjs`, Then its reason field is non-empty, and an empty reason is recorded as a process failure rather than a neutral outcome | The first dated report's `results.csv`; zero rows with verdict `SKIP` and an empty reason | Unmet | - |
| AC-011 | REQ-011 | Given phases 002-005 close when their tasks finish, When this phase's METADATA and Phase Context are read, Then `Successor: None` and the surrounding prose state plainly this phase is permanent, not finished | Direct read of spec.md §1 METADATA and Phase Context | Unmet | - |
| AC-012 | Phase gate | Given the judged column, the graduation door, and the extended persistence contract all exist, When the first capture-review scenario runs, Then a dated report exists under `benchmark/reports/` with no hand-authored Markdown and every `SKIP` verdict carries a non-empty reason | The first dated report's `results.csv`; its generation provenance naming `run-manual-playbook-scenario.cjs` | Unmet | - |

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

This packet is authored, not executed: T001-T017 have not run, so every AC row above is
observationally `Unmet` by construction. Unlike phases 002-005, "closing" this document does not
retire the discipline it describes — the phase gate (AC-012) is proven once, by the first dated
report, but the capture-review process itself keeps running on every future release. This document
closes only after 005's judged-boundary block is confirmed on disk (T001), the judged column and
capture conventions are authored (T004-T011), the first scenario run produces a clean, reasoned
report (T012-T015), and the judged-boundary/graduation-log reconciliation holds (T016-T017), with
every row above moved to `Met`.
<!-- /ANCHOR:closure -->
