---
title: "Acceptance Criteria: Improve sk-create-readme writing-style guidance"
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
    packet_pointer: "sk-doc/056-sk-create-readme-writing-style"
    last_updated_at: "2026-09-20T13:20:00Z"
    last_updated_by: "devin"
    recent_action: "Marked all ten acceptance criteria Met after document and HVR validation"
    next_safe_action: "Run strict packet validation, then close"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-056-sk-create-readme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Improve sk-create-readme writing-style guidance

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 056-sk-create-readme-writing-style
**Level:** 2
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the emoji guidance, When an author reads any touched file, Then decorative section emoji is allowed on the front-page README only and all other READMEs get semantic-only emoji (✅ ❌ ⚠️ 🔒 🚨) | `SKILL.md` format rules, `writing-patterns.md` Emoji Use, `types-and-voice.md` register subsection, `core-standards.md` README block | Met | - |
| AC-002 | REQ-002 | Given a section heading, When the rule applies, Then the heading names the feature or artifact rather than a generic label | `SKILL.md` format rule "Name the feature or artifact in its heading", `writing-patterns.md` Features paragraph, checklist Structure item | Met | - |
| AC-003 | REQ-003 | Given an inventory, When it is documented, Then every item carries a description via the bold-name-plus-bullets pattern | `writing-patterns.md` Itemized Inventory pattern, `readme-template.md` §4 example, checklist Content item | Met | - |
| AC-004 | REQ-004 | Given a front-page README, When the author leads with reader pain, Then an optional `Problem` section is documented before Overview | `SKILL.md` section table Problem row, `writing-patterns.md` Problem standard | Met | - |
| AC-005 | REQ-005 | Given existing conformant READMEs, When the new rules land, Then none are invalidated because additions are opt-in or scoped | Changelog NOT CHANGED section, risk table mitigation, no README outside scope touched | Met | - |
| AC-006 | REQ-006 | Given a document with four or more major features, When structuring Features, Then each may get its own numbered H2 | `writing-patterns.md` Features paragraph second half | Met | - |
| AC-007 | REQ-007 | Given prose, When a paragraph stacks several points, Then it becomes bullets and paragraphs stay 2-4 sentences | `SKILL.md` paragraph rule, `writing-patterns.md` Paragraphs and Bullets, checklist Content item | Met | - |
| AC-008 | REQ-008 | Given the fillable scaffold, When an inventory item needs more than a line, Then the itemized pattern is offered as an alternative | `readme-template.md` §4 example and scaffold comment in §6 | Met | - |
| AC-009 | REQ-009 | Given the release, When files changed, Then a changelog entry exists and versions bumped | `changelog/v1.2.0.0.md`, frontmatter version fields 1.2.0.0 / 2.1.0.37 | Met | - |
| AC-010 | REQ-010 | Given the touched files, When validators run, Then `validate_document.py` returns VALID and `hvr_scan.py` shows no new hard blockers | Validation output: 7 files VALID 0 issues. HVR blockers all pre-existing in untouched lines | Met | - |

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

All ten criteria are Met with observed evidence. The two-register emoji policy,
feature-named headings, per-item inventory descriptions, the optional Problem
section and the paragraph bound are now written into the files authors load, and
the shared `core-standards.md` wording was tightened in the same direction.
Nothing was consciously left out. Scanner enforcement was deliberately excluded
because these are guidance-level rules.
<!-- /ANCHOR:closure -->
