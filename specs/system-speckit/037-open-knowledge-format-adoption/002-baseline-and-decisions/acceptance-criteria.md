---
title: "Acceptance Criteria: Phase 2: baseline-and-decisions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "baseline and decisions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions"
    last_updated_at: "2026-10-04T08:04:51Z"
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
# Acceptance Criteria: Phase 2: baseline-and-decisions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the pinned commit, When the census commands in `baseline.md` run twice, Then both outputs are byte-identical and every baseline number names its command | `baseline.md:34` (commands) and two runs with SHA-256 prefix `44f685b3d0a25cc2` | Met | - |
| AC-002 | REQ-002 | Given the 10-value and 11-value lists, When their call sites are read, Then `baseline.md` answers document kind or session kind with `file:line` evidence | `baseline.md:103` (section 4), lines checked against `input-normalizer.ts:1133-1136`, `session-extractor.ts:576-588`, `collect-session-data.ts:1396-1408` | Met | - |
| AC-003 | REQ-003 | Given the phase needs four decisions, When `decision-record.md` is read, Then D1 to D4 each carry context, evidence, an owner and alternatives | `decision-record.md:36` ADR-001, with ADR-002 at `:138`, ADR-003 at `:234` and ADR-004 at `:335` | Met | - |
| AC-004 | REQ-004 | Given D3 was written first, When the enlarged sample is labeled, Then two labelers from different model families label every row, or the shortfall is recorded | `baseline.md:135` (section 6), with `scratch/labels-claude.jsonl` and `scratch/labels-deepseek.jsonl` | Met | - |
| AC-005 | REQ-005 | Given sk-doc governs skill-doc frontmatter, When the addendum is read, Then each frontmatter class and each validator is listed with what it checks | `baseline.md:117` (section 5) | Met | - |
| AC-006 | REQ-003 | Given D1 to D4 are recorded, When the operator reviews them, Then each is marked approved | `decision-record.md:42` (Accepted with changes, operator 2026-10-04), with ADR-003 accepted in part and condition 3 deferred to phase 006 by the operator | Met | - |
| AC-007 | REQ-001 | Given this phase is research only, When `git status --short .skilled/skills` runs, Then it prints nothing | `plan.md:77` names the command; it printed nothing on 2026-10-04 | Met | - |

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

Every row is met. The operator approved D1, D2 and D4 on condition that the UX for existing docs and specs is clean before any update and that the doctor, speckit, deep-loop and sk-doc commands carry the change. That condition is written into ADR-001, ADR-002 and ADR-004 and into phases 003 to 007. D3 condition 3 was deferred to phase 006.
<!-- /ANCHOR:closure -->
