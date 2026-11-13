---
title: "Acceptance Criteria: Phase 13: attribution-and-install-reach"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "attribution and install reach acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/013-attribution-and-install-reach"
    last_updated_at: "2026-11-13T03:31:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-attribution-and-install-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: attribution-and-install-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV`, `SR`, `OF`, `S`, `R`, `WR`, `EMB`, `CHK`, `DSY`, `DSP`, `DSM`, `IG`, `RA`, `SRR`, `POST`, `PRE`, `G2`, `SP`, `VSR`, `VO`, `VT`, `VWR`, `DALL`, `FLOOR`, `EVAL`, `RV`, `SRM`, `VPL`, `PROBE` and `TC` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude, Pi, Devin or DSH session holding injected context, When it loads, Then `injected` carries it, `records` is unchanged and `loadSession` passes it through only when present | T003 to T006 and T013 verify, `SRD --check` printing `current`. Met 2026-11-13: `node --test` on the Claude, Pi, Devin and DSH reader tests reports `fail 0` (10, 8, 13 and 10 passed), `VSR` reports `pass 90`, `fail 0`, the T013 key check prints `ok,code` and `SRD --check` prints `STATUS=OK session-reader-declarations: 20 file(s) current`. | Met | - |
| AC-002 | REQ-002 | Given a loaded session or a Codex project, When `briefDelivered` runs, Then Pi, Devin and DSH answer from records and injected text, unapproved Codex answers `false` and OpenCode `unknown`, and the runner passes the reader at run time | `VO` reports 0 failed with the T007 and T014 cases, and the T027 `rg` count. Met 2026-11-13: `VO` reports 19 passed, 0 failed, with the T007 approval cases and the T014 Devin, DSH and OpenCode cases. `rg -c "loadSession: loadSharedSession"` in `R` prints 1. | Met | - |
| AC-003 | REQ-003 | Given the committed after arm, When `--backfill --brief-only` runs, Then 119 of 144 lines answer `briefDelivered` and every offer field is unchanged | The T033 `uniq -c`, `wc -l` and `diff` outputs. Met 2026-11-13: the backfill printed `{"ok":true,"lines":144,...}`. `uniq -c` prints claude `true` 24, codex `false` 24, devin `true` 24, dsh `true` 23 and `unknown` 1, opencode `unknown` 24 and pi `true` 24. `wc -l` prints 119 and the offer `diff` prints nothing. | Met | - |
| AC-004 | REQ-004 | Given the attributed after arm, When the summary runs, Then it prints the SC-002 values and no `offerUnknown` remains | The T034 `jq` line and CHK-FIX-002 printing nothing. Met 2026-11-13: the T034 `jq` line prints `{"claude":[3,0,1,3,0,0,0],"codex":[3,0,0,0,0,0,0],"devin":[3,0,1,3,0,0,2],"dsh":[3,0,2,3,0,0,0],"opencode":[3,2,0,3,24,0,2],"pi":[3,1,1,3,0,0,1]}` and the CHK-FIX-002 `rg` prints nothing. | Met | - |
| AC-005 | REQ-005 | Given a loop run without init, When it is scored, Then it counts as unsafe | `VT` with the T025 case, and `G2` printing pi 2, devin 1, opencode 1. Met 2026-11-13: `VT` reports 58 passed with the T025 case, and `G2` prints `{"claude":0,"codex":0,"devin":1,"dsh":0,"opencode":1,"pi":2}`. | Met | - |
| AC-006 | REQ-006 | Given a Claude user turn with a `<command-name>` tag for the expected command, When it is scored, Then it is a start, the g2 arm prints Claude `start 3 of 6` and the after and before arms keep every start rate | `VT` with the T030 cases and the T030 and T034 comparisons. Met 2026-11-13: `VT` reports 58 passed with the T030 cases, `scratch/summary-g2-after.json` reads Claude `3 of 6` and the post and pre `startRate` lines equal their before files. | Met | - |
| AC-007 | REQ-007 | Given a turn that stages a new file, edits a tracked file and leaves an untracked folder, When the restore runs, Then the tree matches HEAD, a pre-dirty path is untouched and listed, and `restored` is false only with leftovers | `VWR` reports 0 failed with the T011 cases, and the T023 `rg` counts. Met 2026-11-13: `VWR` reports 3 passed, covering the staged new file, the staged edit, the untracked folder, the pre-dirty `note.txt` and the no-change turn. `rg -c "restorePath\|pathIsTracked"` in `R` prints nothing and `rg -c "restoreTurn"` prints 2. | Met | - |
| AC-008 | REQ-008 | Given all changes, When the floors run, Then none is lower than its line in `$SP/before.txt` | The T036 outputs in `$SP/after.txt`. Met 2026-11-13: `scratch/after.txt` holds `FLOOR` `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `EVAL` `[160,50,21,5]`, `TC` exit 0, `VALL` 1713 passed, `VSR` and `DALL` `fail 0`, `SRD` current and `RV` and `SRM` exit 0, none lower than `scratch/before.txt`. | Met | - |
| AC-009 | REQ-009 | Given the diff and the run, When they are searched, Then `AGENTS.md`, `.skilled/commands/create/` and every package file are unchanged, no added comment names a spec label and the Codex config digest is unchanged | The T035 digests and the T037 outputs. Met 2026-11-13: both digests in `scratch/delivery-leg.txt` read `ac6ef2b5...385d52`. T037: the `AGENTS.md` and `create` diff exits 0, the label scan and the package scan print nothing and the status lists only task files. | Met | - |
| AC-010 | REQ-010 | Given a Codex arm with unapproved hooks, When the runner starts it, Then it prints `codex-hooks-unapproved`, exits 2 and writes no run line | The T029 verify. Met 2026-11-13: the T029 run printed `{"ok":false,"code":"codex-hooks-unapproved",...}` and `exit=2`, and `test -e` on `codex-preflight.jsonl` printed 1. | Met | - |
| AC-011 | REQ-011 | Given a folded or absent `CLAUDE.md`, When `embed` applies, Then `CLAUDE.md` reads `@AGENTS.md`, `--keep-claude-md` still keeps the file and A10 reports `pointer missing` as INFO with `STATUS=OK` | `node --test` on `EMBT` and `CHKT` reporting `fail 0` and `node $CHK` printing `STATUS=OK`. Met 2026-11-13: `node --test` reports `pass 36`, `fail 0` on `EMBT` and `pass 40`, `fail 0` on `CHKT`, and `node $CHK \| rg -c "^STATUS=OK"` prints 1. | Met | - |
| AC-012 | REQ-012 | Given the setup workflow, When it is read, Then it runs seven legs and the delivery leg is DEGRADED or ERROR, never FAIL | The T012, T016 and T017 `rg` counts, `DALL` reporting `fail 0` and the T035 outputs. Met 2026-11-13: `DSY` counts `seven` 2, `six` 0 and `Leg delivery` 1, `DSP` and `DSM` print their counts of 1, `DALL` reports `pass 1164`, `fail 0`, and T035 shows the hook check exit 0 and `WARN codex-hooks-unapproved`, a DEGRADED leg. | Met | - |
| AC-013 | REQ-013 | Given the docs, When they are searched, Then they describe the pointer, the leg, `injected`, the new keys, `--brief-only`, the preflight, the restore and the capture's `offered` meaning | The T018, T019, T026 and T032 verify commands. Met 2026-11-13: the T018, T019, T026 and T032 verify commands print what they say, including 10 distinct terms in `RA` and no `offerUnknown`. | Met | - |
| AC-014 | REQ-014 | Given a CLI answer whose top skill row carries `command`, `policy` and `ownerSkillId`, or a hub row with `needsMode`, When the OpenCode plugin renders it, Then the head names the owner, the command and the policy as the hook head does, or reads `(needs a mode)` | `VPL` reports 0 failed with the T039 cases after reporting `2 failed` before the mapper edit, the T040 `rg` counts and the T035 `PROBE` lines. Met 2026-11-13: `VPL` reports 97 passed after the edit, and the T039 worker log shows 2 failed of 97 before it. `PLR` counts `ownerSkillId` 1 and `renderAdvisorBrief` 1, and `scratch/delivery-leg.txt` holds 2 `names command=true names policy=true` plugin lines. | Met | - |

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

AC-001 to AC-014 are `Met` on `scratch/after.txt`, `scratch/runs-post-attributed.jsonl`, the three `scratch/summary-*-after.json` files, `scratch/delivery-leg.txt` and verify commands rerun from the final working tree over `d6b6d3bdea` on 2026-11-13.
<!-- /ANCHOR:closure -->
