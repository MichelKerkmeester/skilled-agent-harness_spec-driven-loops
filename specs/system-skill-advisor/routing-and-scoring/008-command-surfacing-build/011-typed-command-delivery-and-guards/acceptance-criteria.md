---
title: "Acceptance Criteria: Phase 11: typed-command-delivery-and-guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "typed command delivery acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards"
    last_updated_at: "2026-11-13T00:31:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-typed-command-delivery-and-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: typed-command-delivery-and-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `CA`, `DB`, `DBC`, `CAP`, `BASE`, `RS`, `MBC`, `SRM`, `SRMT`, `DSY`, `IG`, `SP`, `VCA`, `VFT`, `VART`, `VHT`, `VST`, `DCT`, `FLOOR`, `EVAL`, `PY`, `PAR` and `TC` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the deriver after this phase, When it runs, Then `CA` holds a `TRACKED_COMMANDS` row for every bridge entry with policy, owner and `scorerRow` | The T003 `rg` lines and `DBC` printing `fresh` | Unmet | - |
| AC-002 | REQ-002 | Given a prompt, When the helpers read it, Then the longest whole typed key is found, a partial or a path finds none and the row is returned only for its owner or its command row | `VCA` reports 0 failed with the T008 cases | Unmet | - |
| AC-003 | REQ-003 | Given a typed command with no scorer row whose owner passes below rank 1, When the scorer ranks, Then the owner is first and every other order is unchanged | `VFT` reports 0 failed, and `jq -r '.attachedMetrics.typedRows["cmd-create-goal-typed-01"].top' $BASE` prints `sk-doc` | Unmet | - |
| AC-004 | REQ-004 | Given a top recommendation that is the typed command's owner or row, When the handler returns on either path, Then the top carries the command, its policy and its owner, and a hub-attached command carries a policy | `VART` reports 0 failed, the T016 `rg` counts and T020's 44 matching heads | Unmet | - |
| AC-005 | REQ-005 | Given the committed baseline, When it is read, Then `attachedMetrics.typed` is 44 of 44 and `typedRows` holds 44 ids with no prompt text | `jq -c '.attachedMetrics.typed' $BASE` prints `{"own":24,"attached":20,"combined":44,"total":44}` and `RS` reports 0 failed | Unmet | - |
| AC-006 | REQ-006 | Given all changes, When the floors run, Then none is lower than its line in `$SP/before.txt` | The T022 outputs in `$SP/after.txt` beside `$SP/before.txt` | Unmet | - |
| AC-007 | REQ-007 | Given the diff, When it is searched, Then no added comment names a spec label and `AGENTS.md` and `.skilled/commands/create/` are unchanged | The T024 outputs | Unmet | - |
| AC-008 | REQ-008 | Given this tree, When the mirror check runs, Then it prints `visibility claude 32/44, cursor 44/44` and exits 0, and a second folder with `skill.md` gives a `COLLAPSE` line | `node $SRM --check` output and `node --test $SRMT` reporting `fail 0` | Unmet | - |
| AC-009 | REQ-009 | Given diagnostic records for this checkout, When `advisor_status` runs, Then `hookHealth.rollingP95Ms` is a number, the setup advisor leg names it and the install guide has the prove-it command | The T023 output, `rg -c "hookHealth" $DSY` printing 1 and the T007 verify | Unmet | - |
| AC-010 | REQ-010 | Given every tracked command, When its head renders, Then it is at most 320 bytes, not truncated and names its command and policy | `VHT` reports 0 failed | Unmet | - |
| AC-011 | REQ-011 | Given the typed rows, When the cost script runs, Then it prints bytes and estimated tokens for 44 rows, refuses a holdout id and leaves no sandbox | The T006 verify and `jq '.rows \| length' $SP/brief-cost.json` printing 44 | Unmet | - |
| AC-012 | REQ-012 | Given the docs, When they are searched, Then the three READMEs name the new keys, the table, the script and the check line | The T011, T018 and T019 verify commands | Unmet | - |

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

The phase is planned and no build has started, so every criterion is unmet. No implementation task starts before the coordinator confirms that phases 005, 008 and 010 are committed.
<!-- /ANCHOR:closure -->
