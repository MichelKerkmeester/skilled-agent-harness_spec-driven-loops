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
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S`, `R`, `OF`, `CK`, `HW`, `PRE`, `SP`, `VT`, `VO`, `DCT` and `FLOOR` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the runner after this phase, When a turn ends, Then its line carries `offeredCommand`, `offeredPolicy` and `briefDelivered` | `rg -c "offeredCommand\|offeredPolicy\|briefDelivered" $R` prints at least 3, and the T031 smoke line holds all three keys. Met 2026-11-13: `rg -c` printed 5. In place of the T031 smoke line, all 144 after-arm lines of `../007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl` hold the three keys, the 24 Codex lines included. | Met | - |
| AC-002 | REQ-002 | Given a two-line fixture log, When it is backfilled, Then both lines carry the fields and `offerBackfilled`, the line with no checkout carries `no_checkout`, the same-path call exits 2 and a holdout id refuses the run | The T021 `jq` output, its `same_path` exit and `VO` reporting 0 failed. Met 2026-11-13: `jq` printed `{"offerBackfilled":true,"briefDelivered":"unknown","offerError":null,"has":true}` and a `"offerError":"no_checkout"` line, the same-path call printed `same_path` and exited 2 and `VO` passed 11 of 11 with the holdout refusal case. | Met | - |
| AC-003 | REQ-003 | Given the before arm with no offer field, When it is summarized, Then Claude reads `offered` 0 and `offerUnknown` 12, and the backfilled arm prints `offered X, started Y of X` for every runtime | The T020 `jq` output and `scratch/summary-attributed.txt`. Met 2026-11-13: the T020 `jq` printed `{"offered":0,"startedOfOffered":0,"offerUnknown":12}` and every runtime line in `scratch/summary-attributed.txt` reads `offered 0, started 0 of 0`. | Met | - |
| AC-004 | REQ-004 | Given a capped start row, When it is summarized, Then it counts in `cappedStartRows` and not in `startRate` | `VT` reports 0 failed and the T017 `jq` output. Met 2026-11-13: `VT` passed 49 of 49 and the T017 `jq` printed `{"startRate":"2 of 7","cappedStartRows":5}`, which sums to the 12 start rows of `"5 of 12"` in `scratch/summary-before.json`. | Met | - |
| AC-005 | REQ-005 | Given a runtime with fewer runs than another in the same arm, When it is summarized, Then its block reads `armIncomplete: true` and its text line ends with `arm incomplete` | `VT` reports 0 failed and the T022 `jq` output. Met 2026-11-13: `VT` passed 49 of 49 with the two-runtime case, and the T022 `jq` printed `[]`, matching six runtimes at 24 runs each in `scratch/summary-before.json`. | Met | - |
| AC-006 | REQ-006 | Given any arm, When it is summarized, Then `byPolicy` holds `run`, `start` and `ask` with `rows`, `capped`, `started` and `wrote` | `node $S --summary $PRE --json \| jq -c '.claude.pre.byPolicy \| keys'` prints `["ask","run","start"]`. Met 2026-11-13: printed `["ask","run","start"]`. | Met | - |
| AC-007 | REQ-007 | Given a run that read `doctor/git.md` before writing, When its row expects `/doctor:git hooks`, Then it scores `started: true` | `VT` reports 0 failed with the T005 case. Met 2026-11-13: `VT` passed 49 of 49, with the `/doctor:git hooks` case at line 384 of the test file. | Met | - |
| AC-008 | REQ-008 | Given a Codex checkout, When the check runs before and after approval, Then it prints `WARN codex-hooks-unapproved` and then `PASS codex-hooks-approved`, writes nothing and the install guide names the `/hooks` step | `node --test $CKT` reports `fail 0`, the unchanged `shasum` of `~/.codex/config.toml`, the T031 `PASS` line and `rg -n "codex-hooks-approved" INSTALL-SKILLED.md`. Partly met 2026-11-13: `node --test $CKT $HWT` fail 0, `rg` prints `INSTALL-SKILLED.md:69` and the config digest stayed the same across each check run. `WARN` came from an unapproved arena and `PASS` from the operator-approved main checkout. The same-checkout before and after pair needs the approval ADR-001 leaves to the operator. | Superseded | ADR-001 |
| AC-009 | REQ-009 | Given the DSH bundle, When its row flag is absent, Then the advisor registers, and the install guide names DSH | The bundle test reports `fail 0`, `grep -ci dsh INSTALL-SKILLED.md` prints at least 2 and the T033 step payload contains `Advisor: `. Met 2026-11-13: the bundle test reports fail 0, `grep -ci dsh` printed 3 and the stored DSH sessions hold a `repo-guards` message starting `Advisor: ` in 23 of 23 after-arm sessions (`scratch/closing-evidence.txt` item 4). | Met | - |
| AC-010 | REQ-010 | Given a target root whose Claude settings lack the prompt entry, When the check runs, Then it exits 1 naming `hook-missing claude`, and this repository's root exits 0 | `node --test $HWT` reports `fail 0`, `node $HW --root .` prints four `ok` lines and `DCT` reports `fail 0`. Met 2026-11-13: `node --test $CKT $HWT` fail 0, `node $HW --root .` printed `ok claude`, `ok codex`, `ok cursor` and `ok devin` with exit 0, and `DCT` passed 43 of 43. | Met | - |
| AC-011 | REQ-011 | Given a sandboxed socket directory, When a cold first prompt runs five times, Then the fail-open count is recorded and no shared daemon is touched | The last line of `scratch/cold-start-before.txt` and the unchanged count of `/tmp/system-skill-advisor`. Met 2026-11-13: the last line reads `fail-open 0 of 5`, and the T003 worker log records 39 entries in `/tmp/system-skill-advisor` before and 39 after. | Met | - |
| AC-012 | REQ-013 | Given the T003 count, When it is above 0, Then the warm-up and the probe default land through the registry and the launcher and the rerun reads `fail-open 0 of 5`, and When it is 0, Then T024 to T026 carry the measured numbers as dropped | `scratch/cold-start-after.txt` with `node $HS --check` exiting 0, or the dropped lines in `tasks.md`. Met 2026-11-13: the count was 0, so T024 to T026 carry `Dropped` with fail-open 0 of 5 at median 431 ms and, with no daemon alive, fail-open 0 of 5 at median 742 ms (`scratch/cold-arena-result.txt`). | Met | - |
| AC-013 | REQ-012 | Given all changes, When the floors and the boundaries are checked, Then the floors print their pinned lines, the typecheck exits 0, `AGENTS.md` and `.skilled/commands/create/` are unchanged and no added comment names a spec label | The T027 and T028 outputs. Met 2026-11-13: `FLOOR` printed `{"correct":24,"total":44}` and `{"count":0,"total":35}`, typecheck exit 0, the `git diff --quiet` boundary exit 0 and the comment scan printed nothing over `f8a7f6fc10..a57ce61a13` and the working tree. | Met | - |
| AC-014 | REQ-014 | Given the docs, When they are searched, Then the routing-accuracy README and the doctor scripts README name the new fields, mode, keys and scripts | The T018 and T023 verify commands. Met 2026-11-13: the T018 `rg -c` printed 6 and the T023 `rg -c` printed 6. | Met | - |

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

AC-001 to AC-007 and AC-009 to AC-014 are `Met` on checks rerun from the repository root on 2026-11-13 or on `scratch/closing-evidence.txt` where a row needs a model session or an arena. AC-008 is `Superseded` by ADR-001, because its same-checkout before and after pair needs a Codex hook approval that only the operator may give.
<!-- /ANCHOR:closure -->
