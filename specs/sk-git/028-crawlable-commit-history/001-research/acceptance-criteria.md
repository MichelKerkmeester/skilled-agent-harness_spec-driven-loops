---
title: "Acceptance Criteria: Phase 1: research"
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
    packet_pointer: "sk-git/028-crawlable-commit-history/001-research"
    last_updated_at: "2026-09-11T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Met every criterion after the lineage settled"
    next_safe_action: "Start phase 002 from research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/028-crawlable-commit-history/001-research
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the brief and the launched lineage, When the run settles, Then ten iteration files exist and the synthesis record says maxIterationsReached | `ls research/lineages/deepseek/iterations` lists 10 files; state log line `synthesis_complete ... stopReason maxIterationsReached`, 16 records | Met | - |
| AC-002 | REQ-002 | Given any iteration file, When the conductor opens one cited file:line, Then the quoted text is there | SKILL.md:405 and commit-msg:72 matched the quotes in iteration-001.md; global hooks path confirmed by `git config --global core.hooksPath` | Met | - |
| AC-003 | REQ-003 | Given the lineage research.md, When the conductor reduces it, Then research/research.md ranks recommendations and marks each implementable today or needs a decision | research/research.md sections 3 and 4 | Met | - |
| AC-004 | REQ-004 | Given angle 4, When candidate messages are run through the hook regexes, Then each result is recorded | iteration-004.md What was measured; conductor re-ran a trailer-block message (exit 0) and a numeric scope (exit 1) | Met | - |
| AC-005 | REQ-005 | Given angle 8, When the rewrite method is chosen, Then the filter-repo invocation and the citation remap method are named | iteration-008.md (commit-callback on a mirror) and iteration-009.md (prefix remap from the commit map) | Met | - |
| AC-006 | US-002 | Given the run, When `git status` is read, Then the lineage wrote nothing outside `research/` | `git status --short` after the run: only research/ paths and metadata untracked | Met | - |

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

AC-001 and AC-003 carried the packet: the run reached its cap and the synthesis ranks what phase 002 must decide. Left out on purpose: a second model lens, which phase 002 supplies before the operator approves the grammar.
<!-- /ANCHOR:closure -->
