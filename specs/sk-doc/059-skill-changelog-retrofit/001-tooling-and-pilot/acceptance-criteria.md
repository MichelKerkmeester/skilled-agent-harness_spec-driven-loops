---
title: "Acceptance Criteria: Phase 1: tooling and pilot"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/001-tooling-and-pilot"
    last_updated_at: "2026-09-24T18:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded pilot run 2 evidence against the criteria"
    next_safe_action: "Read the ten pilot files and report the style to the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: tooling and pilot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/059-skill-changelog-retrofit/001-tooling-and-pilot
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the checker, When it runs on the exemplar, the compliant changelogs and legacy ones, Then the first two pass and the legacy ones fail | Rerun 2026-09-24: exemplar exit 0, 25 of 25 compliant files pass, 543 of the 549 listed files still fail and the other 6 are the pilot passes | Met | - |
| AC-002 | REQ-001 | Given a kept pilot rewrite, When the checker runs with `--old` and the fact check reads both texts, Then the checker finds no new identifier or number and the fact check returns PASS | `../scratch/pilot-state.jsonl` has `status: pass` for six files, which requires both gates, and the checker rerun on all six exits 0 | Met | - |
| AC-003 | REQ-002 | Given a kept pilot rewrite, When the orchestrator reads it beside its original, Then no user-visible change, breaking change, migration step or required action is missing | The orchestrator read all ten on 2026-09-24 and reported two soft losses (cli-devin, cli-claude-code) that drop context, not a behavior, action or correction | Met | - |
| AC-004 | REQ-003 | Given a kept pilot rewrite, When `hvr_scan.py` runs on it, Then it reports 0 hard blockers | Rerun on all six: 0 hard blockers each | Met | - |
| AC-005 | REQ-004 | Given a pilot file that failed its gates twice, When the driver finished with it, Then the file equals its original and its draft is kept | `git diff` is empty for all four failures, and `ls -A ../scratch/failed` lists all four drafts | Met | - |
| AC-006 | REQ-005 | Given a pilot original with frontmatter, When it is rewritten, Then the frontmatter is byte-identical | Frontmatter comparison rerun on all six passes: identical | Met | - |
| AC-007 | REQ-006 | Given pilot run 2, When dispatches are counted, Then no gateway dispatch happened without a GPT usage-limit reply | `../scratch/driver-status.json`: 32 GPT dispatches, 0 gateway, no limit recorded | Met | - |
| AC-008 | REQ-007 | Given the pilot report, When the operator reviews it, Then the operator approves the style or names the changes | 2026-09-24: the operator chose "Approve with fixes" (thin H4 items merged, no repeated sentences, a narrower drop definition, three attempts per file) | Met | - |

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

Every row is Met, but the check run that applies the approved fixes to the four restored files and to sk-design v2.0.0.0 has not finished. The phase closes when that run's results are recorded.
<!-- /ANCHOR:closure -->
