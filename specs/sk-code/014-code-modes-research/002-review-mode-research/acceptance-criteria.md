---
title: "Acceptance Criteria: Phase 2: review-mode-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "review mode research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/002-review-mode-research"
    last_updated_at: "2026-10-25T08:55:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Probe the executors, run the ten iterations, then meet each criterion with command output"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: review-mode-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/014-code-modes-research/002-review-mode-research
**Level:** 2
**Status:** Planned
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Run every command from this phase folder, `specs/sk-code/014-code-modes-research/002-review-mode-research`. Read counts rather than exit status, because `grep` here is ugrep. `BASE_SHA` in AC-009 is the sha written in the Baseline row of the parent goal log before the first iteration.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-004 | Given the finished run, When the synthesis is read, Then `research/research.md` exists and holds a Ranked Recommendations section | `test -s research/research.md` exits 0 and `grep -c "Ranked Recommendations" research/research.md` prints 1 or more | Unmet | - |
| AC-002 | REQ-004 | Given that section, When its labelled rows are counted, Then at least eight carry an evidence label | `awk '/Ranked Recommendations/{f=1} f&&/OBSERVED/{n++} f&&/DERIVED/{n++} f&&/INFERRED/{n++} END{print n}' research/research.md` prints 8 or more | Unmet | - |
| AC-003 | REQ-006 | Given the finished loop, When the iteration folder is listed, Then ten record files exist | `ls -1 research/iterations/iteration-0*.md` prints `iteration-001.md` through `iteration-010.md`, 10 paths | Unmet | - |
| AC-004 | REQ-006 | Given the state log, When its iteration records are counted, Then there are ten | `grep -c '"type":"iteration"' research/deep-research-state.jsonl` prints 10 | Unmet | - |
| AC-005 | REQ-006 | Given the state log, When the synthesis record is read, Then a stop reason is recorded | `grep '"event":"synthesis_complete"' research/deep-research-state.jsonl` prints one record with `stopReason` set and `totalIterations` equal to 10 | Unmet | - |
| AC-006 | REQ-001 | Given the synthesis, When Repo-Agnostic Findings is read, Then each repo-bound assumption is classed and carries a source tag | `grep -c "Repo-Agnostic Findings" research/research.md` prints 1 or more, and three source tags from that section opened by hand resolve to the quoted text | Unmet | - |
| AC-007 | REQ-002 | Given the synthesis, When Usefulness Findings is read, Then its judgements cite the packet's own benchmark, playbook, changelog or scripts | `grep -c "Usefulness Findings" research/research.md` prints 1 or more and `grep -c "benchmark/reports" research/research.md` prints 1 or more | Unmet | - |
| AC-008 | REQ-003 | Given the synthesis, When Integration Findings is read, Then it covers the sibling modes and an External-User Modes subsection | `grep -c "External-User Modes" research/research.md` prints 1 or more and `grep -c "parent-skills-nested-packets" research/research.md` prints 1 or more | Unmet | - |
| AC-009 | REQ-005 | Given the recorded baseline, When the diff is taken, Then no path under `.skilled/` changed | `git diff --stat $BASE_SHA -- ':/.skilled'` prints nothing | Unmet | - |
| AC-010 | REQ-006 | Given the packet, When strict validation runs, Then it passes and the source tags resolve | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research/002-review-mode-research --strict` prints `RESULT: PASSED` and no SOURCE_TAGS warning | Unmet | - |
| AC-011 | REQ-006 | Given the run, When the research files are searched for the sibling phase's research path, Then none names it | `grep -rc "001-quality-mode-research/research" research` prints 0 for every file | Unmet | - |

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

Every row is Unmet because no iteration has run. Write the closing statement when the packet closes, naming which criteria carried it and what was left out on purpose.
<!-- /ANCHOR:closure -->
