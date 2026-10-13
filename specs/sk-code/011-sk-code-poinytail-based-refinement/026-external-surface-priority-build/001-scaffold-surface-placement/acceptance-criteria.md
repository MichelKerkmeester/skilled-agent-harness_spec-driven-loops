---
title: "Acceptance Criteria: Scaffold surface placement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "scaffold surface placement acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-001-ac"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Scaffold surface placement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement
**Level:** 2
**Status:** Draft
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the built phase, When the rule phrase is searched, Then it sits on identical lines in both twins and in both references | `goal.md` criterion 1 prints ok | Unmet | - |
| AC-002 | REQ-002 | Given a full-tree copy, When the update workflow adds a stand-in surface, Then `tieBreak` is `[sk-code-quality, sk-code-review, sk-code-acme, sk-code-opencode, sk-code-obsidian, sk-code-webflow]` and the doctor passes 5e and 5i | Ledger rows P8-2 and P8-3 | Unmet | - |
| AC-003 | REQ-003 | Given that copy after the re-mint, When the tie prompt routes, Then the result is `[sk-code-acme, sk-code-opencode]` | Ledger row P8-4 | Unmet | - |
| AC-004 | REQ-004 | Given a `--surfaces` run, When its completion report is read and followed, Then it names both follow-ups and the doctor, guard and sync `--check` end at exit 0 | `goal.md` criterion 2; ledger rows P8-5 and P8-6 | Unmet | - |
| AC-005 | REQ-005 | Given the live tree after the build, When the doctors, drift guards and doc validator run, Then each exits 0 | `goal.md` criterion 4 prints ok | Unmet | - |
| AC-006 | REQ-006 | Given this phase's commits, When their added changelog files are listed, Then there is exactly one, under `sk-create-skill/changelog/` | `goal.md` criterion 6 prints ok | Unmet | - |

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

The phase is planned and not built. The builder writes this statement when the packet closes.
<!-- /ANCHOR:closure -->
