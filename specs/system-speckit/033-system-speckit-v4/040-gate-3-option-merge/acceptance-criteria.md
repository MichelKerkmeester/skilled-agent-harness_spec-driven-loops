---
title: "Acceptance Criteria: Phase 1: gate-3-option-merge"
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
    packet_pointer: "scaffold/040-gate-3-option-merge"
    last_updated_at: "2026-09-14T20:22:07Z"
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
# Acceptance Criteria: Phase 1: gate-3-option-merge

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 040-gate-3-option-merge
**Level:** 2
**Status:** Draft
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `AGENTS.md` today shows five Gate 3 options, When the merge lands, Then it shows four: A Existing, B New, C Related, D Skip, and `CLAUDE.md` still resolves through its symlink | `grep -n "Options (stable labels)" -A6 AGENTS.md`, `readlink CLAUDE.md` | Unmet | - |
| AC-002 | REQ-002 | Given the hook prints five options and treats E as the skip letter, When the merge lands, Then it prints four and its letter regexes treat D as the skip letter | `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Unmet | - |
| AC-003 | REQ-003 | Given the 31-file inventory each show some form of the old option text, When the merge lands, Then every one of those 31 files carries the same four letters and wording as `AGENTS.md` | Manual diff of each file against the new `AGENTS.md` text, grouped by the affected-surfaces table in `plan.md` | Unmet | - |
| AC-004 | REQ-004 | Given a surface outside spec folders and archives might still print "E) Skip" or name "Extend phased packet", When the merge lands, Then the inventory grep returns zero such hits | `rg -ln "Update related\|Extend phased packet\|E\) Skip" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' --glob '!**/z_archive/**' .` returns empty | Unmet | - |
| AC-005 | REQ-005 | Given the classifier never reads an option letter today, When the merge lands, Then its source is unedited and its test suite still passes | `grep -n "satisfiedBy\|prior_answer\|[A-E])" .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` shows no letter dependency, the classifier's existing test suite passes | Unmet | - |
| AC-006 | REQ-006 | Given `CLAUDE.md` is a symlink to `AGENTS.md` today, When the merge lands, Then it is still a symlink resolving to `AGENTS.md`, carrying the new text with no separate edit | `test -L CLAUDE.md && [ "$(readlink CLAUDE.md)" = "AGENTS.md" ]` | Unmet | - |

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

This packet is planning only. No criterion is met because no implementation file outside this
packet's own four documents has been edited. Closure happens in a follow-on implementation packet
or a later phase of this one, after AC-001 through AC-006 are each verified.
<!-- /ANCHOR:closure -->
