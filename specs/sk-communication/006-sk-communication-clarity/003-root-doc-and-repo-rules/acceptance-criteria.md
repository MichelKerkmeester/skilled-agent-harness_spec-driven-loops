---
title: "Acceptance Criteria: Phase 3: root-doc-and-repo-rules"
description: "The criteria this packet must satisfy before it may be closed, one row per requirement in this phase's spec."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules"
    last_updated_at: "2026-09-12T17:55:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Aligned the plan, the tasks and these criteria with the rewritten spec"
    next_safe_action: "Open the phase, take the two captures, then split the reply-shape rule"
    blockers:
      - "Phase 002's allocation table is not yet recorded, so the split and its two baselines are the only changes this phase may make"
    key_files:
      - "repo-rules/communication.md"
      - "REPO RULES.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: root-doc-and-repo-rules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules
**Level:** 2
**Status:** Draft
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion, so there is one row per requirement in `spec.md`. The phase's own deliverable
is the split, so the split counts as an authorized change and every other change must trace to an
adopted allocation row. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the scoped diff, When each change is traced, Then it maps to an adopted row in phase 002's allocation table or to the split this phase's spec names as its own deliverable, so nothing else appears | Walk the diff against the allocation table and the spec's deliverable list, in both directions | Unmet | - |
| AC-002 | REQ-002 | Given the new half file, When the router is walked, Then a trigger row names it, the index names it and the trigger describes the action the file governs rather than a topic | Open every file each trigger row names, then walk every file under `repo-rules/` back to a row | Unmet | - |
| AC-003 | REQ-003 | Given any punctuation mark or named construction, When the stack is scanned, Then exactly one instruction governs it and it is the instruction the pre-change baseline recorded | Scan each mark across `AGENTS.md`, `REPO RULES.md` and `repo-rules/`, compared with the recorded per-mark baseline | Unmet | - |
| AC-004 | REQ-004 | Given the two halves, When each is read, Then no rule sentence was added, removed or reworded and every failure statement from before the move still sits with the rule it belongs to | Compare both halves against the pre-change file, sentence by sentence, by reading rather than by grep | Unmet | - |
| AC-005 | REQ-005 | Given `AGENTS.md`, When the scoped diff is inspected, Then the file does not appear, because no clause needs the root doc and its three pointers still read true with the new half reached through the router | Confirm the file is absent from the diff, then read each pointer against the router's rows | Unmet | - |
| AC-006 | REQ-006 | Given the split, When each half's size is measured, Then both are recorded as the per-half size baseline, measured the same way and neither half is past the length statement the pre-split file carried | Measure and record each half, then read the length statement the pre-split file made about itself | Unmet | - |
| AC-007 | REQ-007 | Given the new half file, When it is opened, Then it carries the routed-from line, the bounded-by statement, a fires-when list and a self-check | Read the new file's header and its closing section | Unmet | - |

### Evidence the rows share

Three captures back these rows. The pre-change per-mark instruction set is taken during setup. The
per-half size baseline is taken immediately after the split. Phase 005's pre-change measurement
baseline is taken during this phase's setup as well, before the first edit, because a baseline taken
after the rules change cannot support a regression claim. The first two are the baselines that
phases 006 and 008 read. The third is phase 005's. This phase only performs the capture.

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

Every row is `Unmet` because this phase has not run. The phase is blocked on phase 002's allocation
table for anything beyond the split. The split itself is authorized by the research that made it this
phase's starting step rather than a contingency.

When the phase runs, this statement names which criteria carried it and what was consciously left
out. Three things are already outside these rows. The ten reply-shape candidates are phase 006's. The
wording standard's restructure and its six candidates are phase 007's. The five decision, handback
and evidence candidates are phase 008's. No rule content lands here, so no row here can be satisfied
by writing a rule.

Phase 005's pre-change measurement baseline is captured during this phase's setup, before the first
edit, so the measurement has a before that predates every rule change in the program.
<!-- /ANCHOR:closure -->
