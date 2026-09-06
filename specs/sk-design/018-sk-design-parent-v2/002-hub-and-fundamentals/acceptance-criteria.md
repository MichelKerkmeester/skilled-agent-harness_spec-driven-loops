---
title: "Acceptance Criteria: Reinstate the sk-design parent hub"
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
    packet_pointer: "scaffold/001-phase-1-provide-descriptive-slug"
    last_updated_at: "2026-09-06T13:52:16Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Reinstate the sk-design parent hub

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/002-hub-and-fundamentals`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a standalone `sk-design`, When the root is converted, Then the fleet metadata gate classifies it class H with every hub-required file present and no hub-forbidden file | Fleet metadata audit, class H pass; `description.json`, `mode-registry.json`, `hub-router.json` added and `leaf-manifest.config.json` deleted in `112d5471f4` | Met | - |
| AC-002 | REQ-002 | Given the recorded baseline, When the two design phrases are replayed, Then both score at or above their baseline | `what padding should this have` and `contrast ratio failure on this button` at or above 0.82 and 0.95 in the replay beside `scratch/routing-baseline.txt` | Met | - |
| AC-003 | REQ-003 | Given the hub router, When stage two resolves, Then `sk-design-fundamentals` returns a non-empty leaf set | `mode-registry.json` and the regenerated `leaf-manifest.json` at `.opencode/skills/sk-design/` | Met | - |
| AC-004 | REQ-004 | Given a shared branch, When the conversion lands, Then it is one commit and no intermediate state shows a hub root without its `SKILL.md` | Commit `112d5471f4`, single commit covering the root rewrite and the 28 moves | Met | - |
| AC-005 | REQ-005 | Given the moved content, When the index is inspected before commit, Then git records renames rather than delete-plus-add | `git diff --cached --name-status -M` showing 28 `R100` entries | Met | - |

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

REQ-001 and REQ-005 carried this phase: the class conversion is what makes `sk-design` a hub at all,
and the rename requirement is what keeps the fundamentals history readable. One phrase regressed by
design of the sequencing and was deliberately left for phase 003 rather than tuned here, because the
tuning would have been undone by the merge; it is recorded as a known limitation rather than waived.
<!-- /ANCHOR:closure -->
