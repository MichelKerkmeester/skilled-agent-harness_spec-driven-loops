---
title: "Acceptance Criteria: Phase 10: reachability-and-attribution"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reachability and attribution acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution"
    last_updated_at: "2026-11-12T23:24:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-reachability-and-attribution"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: reachability-and-attribution

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S`, `R`, `OF`, `CK`, `HW`, `PRE`, `SP`, `VT`, `VO`, `DCT` and `FLOOR` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the runner after this phase, When a turn ends, Then its line carries `offeredCommand`, `offeredPolicy` and `briefDelivered` | `rg -c "offeredCommand\|offeredPolicy\|briefDelivered" $R` prints at least 3, and the T031 smoke line holds all three keys | Unmet | - |
| AC-002 | REQ-002 | Given a two-line fixture log, When it is backfilled, Then both lines carry the fields and `offerBackfilled`, the line with no checkout carries `no_checkout`, the same-path call exits 2 and a holdout id refuses the run | The T021 `jq` output, its `same_path` exit and `VO` reporting 0 failed | Unmet | - |
| AC-003 | REQ-003 | Given the before arm with no offer field, When it is summarized, Then Claude reads `offered` 0 and `offerUnknown` 12, and the backfilled arm prints `offered X, started Y of X` for every runtime | The T020 `jq` output and `scratch/summary-attributed.txt` | Unmet | - |
| AC-004 | REQ-004 | Given a capped start row, When it is summarized, Then it counts in `cappedStartRows` and not in `startRate` | `VT` reports 0 failed and the T017 `jq` output | Unmet | - |
| AC-005 | REQ-005 | Given a runtime with fewer runs than another in the same arm, When it is summarized, Then its block reads `armIncomplete: true` and its text line ends with `arm incomplete` | `VT` reports 0 failed and the T022 `jq` output | Unmet | - |
| AC-006 | REQ-006 | Given any arm, When it is summarized, Then `byPolicy` holds `run`, `start` and `ask` with `rows`, `capped`, `started` and `wrote` | `node $S --summary $PRE --json \| jq -c '.claude.pre.byPolicy \| keys'` prints `["ask","run","start"]` | Unmet | - |
| AC-007 | REQ-007 | Given a run that read `doctor/git.md` before writing, When its row expects `/doctor:git hooks`, Then it scores `started: true` | `VT` reports 0 failed with the T005 case | Unmet | - |
| AC-008 | REQ-008 | Given a Codex checkout, When the check runs before and after approval, Then it prints `WARN codex-hooks-unapproved` and then `PASS codex-hooks-approved`, writes nothing and the install guide names the `/hooks` step | `node --test $CKT` reports `fail 0`, the unchanged `shasum` of `~/.codex/config.toml`, the T031 `PASS` line and `rg -n "codex-hooks-approved" INSTALL-SKILLED.md` | Unmet | - |
| AC-009 | REQ-009 | Given the DSH bundle, When its row flag is absent, Then the advisor registers, and the install guide names DSH | The bundle test reports `fail 0`, `grep -ci dsh INSTALL-SKILLED.md` prints at least 2 and the T033 step payload contains `Advisor: ` | Unmet | - |
| AC-010 | REQ-010 | Given a target root whose Claude settings lack the prompt entry, When the check runs, Then it exits 1 naming `hook-missing claude`, and this repository's root exits 0 | `node --test $HWT` reports `fail 0`, `node $HW --root .` prints four `ok` lines and `DCT` reports `fail 0` | Unmet | - |
| AC-011 | REQ-011 | Given a sandboxed socket directory, When a cold first prompt runs five times, Then the fail-open count is recorded and no shared daemon is touched | The last line of `scratch/cold-start-before.txt` and the unchanged count of `/tmp/system-skill-advisor` | Unmet | - |
| AC-012 | REQ-013 | Given the T003 count, When it is above 0, Then the warm-up and the probe default land through the registry and the launcher and the rerun reads `fail-open 0 of 5`, and When it is 0, Then T024 to T026 carry the measured numbers as dropped | `scratch/cold-start-after.txt` with `node $HS --check` exiting 0, or the dropped lines in `tasks.md` | Unmet | - |
| AC-013 | REQ-012 | Given all changes, When the floors and the boundaries are checked, Then the floors print their pinned lines, the typecheck exits 0, `AGENTS.md` and `.skilled/commands/create/` are unchanged and no added comment names a spec label | The T027 and T028 outputs | Unmet | - |
| AC-014 | REQ-014 | Given the docs, When they are searched, Then the routing-accuracy README and the doctor scripts README name the new fields, mode, keys and scripts | The T018 and T023 verify commands | Unmet | - |

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

The phase is planned and no build has started, so every criterion is unmet. No code task starts before the coordinator confirms that phase 007's before arm is finished.
<!-- /ANCHOR:closure -->
