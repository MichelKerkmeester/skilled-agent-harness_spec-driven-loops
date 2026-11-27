---
title: "Acceptance Criteria: Phase 1: channel-ux-and-message-map"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "channel ux and message map acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the acceptance criteria"
    next_safe_action: "Run each block and mark the rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-001-channel-ux"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: channel-ux-and-message-map

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root with no tty, no token and no network, with the two variables `tasks.md` sets:

```bash
P=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map
D=$P/design
```

The catalog check and the mockup check are written out once in `tasks.md` under Task Notation, and a row below names each by its output.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog, When each row is read, Then it names a surface, a producer, whether it carries bot-authored text, its varying fields and its golden | `awk '/^## 2\. THE CATALOG/,/^## 3\./' $D/message-catalog.md \| rg -c '^\| M[0-9]{2} \| '` prints 23. Observed 2026-11-27: 23, and the M01 and M02 rows name the Slack surface each one takes | Met | - |
| AC-002 | REQ-002 | Given the goldens, When each is compared to the catalog, Then there is one per row and each first line is in the catalog | The catalog check prints 23 as its second line and no `DRIFT` line. Observed 2026-11-27: 40, 23 and no `DRIFT` line. A whole-file comparison of all 23 goldens against their catalog blocks also matched | Met | - |
| AC-003 | REQ-003 | Given the chat refusals of `contracts/refusals.md` section 3.10 and the channel refusals of `contracts/answer-seam.md` section 1, When the catalog is searched for each name, Then each has a row | The catalog check prints no `MISSING` line. Observed 2026-11-27: no `MISSING` line | Met | - |
| AC-004 | REQ-004 | Given three surfaces and four situations, When the mockups are counted and measured, Then there are twelve and no view line is wider than 73 columns | The mockup check prints 12 and then 0. Observed 2026-11-27: 12 and 0 | Met | - |
| AC-005 | REQ-005 | Given the reply grammar, When it is read, Then it has five rows, names the open prompt a reply answers and what an unmatched line becomes | `rg -c '^\| [1-5] \| ' $D/reply-grammar.md` prints 5 and `rg -n '^## 3\. WHAT A LINE THAT MATCHES NONE BECOMES' $D/reply-grammar.md` prints one line. Observed 2026-11-27: 5 and `45:## 3. WHAT A LINE THAT MATCHES NONE BECOMES` | Met | - |
| AC-006 | REQ-006 | Given the catalog, When it is searched, Then it states the fatigue rule and the reply-text decision | `rg -c 'fatigue notice never reaches a chat\|The run.s reply text is not sent' $D/message-catalog.md` prints 2. Observed 2026-11-27: 2 | Met | - |
| AC-007 | REQ-007 | Given the limits and the cut rule, When the six chunk sizes are searched for, Then each is in the mockups | The mockup check prints no `MISSING` line. Observed 2026-11-27: no `MISSING` line, and each size follows from the merged limits of `../002-adapter-and-record-contracts/design/capabilities.md` section 2 | Met | - |
| AC-008 | REQ-008 | Given the tinychannels sources, When the design's lines are compared with theirs, Then no line of reference source appears | `R=specs/system-skilled-bots/context/tinychannels-main; comm -12 <(find $R/src/providers $R/crates/tinychannels-bus $R/crates/tinychannels-runtime $R/crates/tinychannels-conformance -name '*.rs' -exec cat {} + \| sort -u \| awk 'length>30') <(sort -u $D/*.md) \| wc -l \| tr -d ' '` prints 0. Observed 2026-11-27: 0 against 48968 reference lines. A scratch copy with one planted reference line printed 1 | Met | - |
| AC-009 | REQ-009 | Given every row above, When its Verification cell is read, Then it names a command that runs here without a tty, a token or a network | `rg -c '^\| AC-0' $P/acceptance-criteria.md` prints 9. Observed 2026-11-27: 9 | Met | - |

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

All nine rows are Met. The unit orchestrator ran each command in the unit worktree on 2026-11-27 and read its output and exit status, after the one catalog edit that names the Slack surface of rows M01 and M02. No task in `tasks.md` is blocked.
<!-- /ANCHOR:closure -->
