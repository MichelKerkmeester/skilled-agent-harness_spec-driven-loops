---
title: "Acceptance Criteria: Phase 15: health-default-and-brief-refinements"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "health default and brief refinements acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/015-health-default-and-brief-refinements"
    last_updated_at: "2026-11-13T07:48:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-health-default-and-brief-refinements"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: health-default-and-brief-refinements

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV`, `HK`, `MET`, `ST`, `STT`, `CA`, `REC`, `RCT`, `CAP`, `BASE`, `S`, `T`, `OF`, `R`, `MBC`, `MBCT`, `PLG`, `NPL`, `DSY`, `DALL`, `HD`, `HV`, `ARCH`, `FC`, `RAR`, `HOOK`, `FINAL`, `SP`, `FLOOR`, `EVAL`, `DRV`, `SRM`, `SLICE`, `TC`, `V`, `VT` and `VALL` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `SKILL_ADVISOR_DEBUG` unset, When a diagnostic record is persisted, Then the line holds no `skillLabel` and no `errorDetails`, 301 writes leave 200 lines and with the variable set the record is written whole | The two T012 cases in `STT` and the T026 tail line `[false,false,"claude","ok"` | Unmet | - |
| AC-002 | REQ-002 | Given a CLI answer from the local scorer, When the hook persists its record, Then the record holds `degraded: true` and the health section's `rollingDegradedRate` counts it | T018 and T019 verifies, and the T020 case reading `rollingDegradedRate` 0.5 | Unmet | - |
| AC-003 | REQ-003 | Given durable records, When `advisor_status` runs, Then `hookHealth` carries `rollingDegradedRate` and `lastRecordAt` equal to the newest record's `timestamp` and the strict schema accepts it | The T020 case and the T026 `hookHealth` line | Unmet | - |
| AC-004 | REQ-004 | Given the rebuilt label rule, When the capture runs, Then `needs_mode_floor` reads `{"count":1,"total":35}` and `needsModeRows` reads `["nm-system-skill-advisor-01"]`, from `{"count":3,"total":35}` and 16 rows | The T003 and T024 `jq` lines, the T014 cases and the T027 hub heads | Unmet | - |
| AC-005 | REQ-005 | Given `compiledRouteTopOnly`, When a hub tops and a lower row carries the hub's routed command, Then the top row names that command, and without the option it does not | The T021 case and the T027 create-agent head holding `/create:agent (start)` | Unmet | - |
| AC-006 | REQ-006 | Given a routed prompt, When the OpenCode transform runs, Then it pushes one system entry | `NPL` with the two T004 assertions and the T028 probe printing 1 on all nine labels | Unmet | - |
| AC-007 | REQ-007 | Given the final arm, When it is summarised, Then `deliveryUnknown` reads `{"claude":0,"devin":0,"dsh":1,"opencode":24,"pi":0}` | The T006 case in `T` and the T031 summary | Unmet | - |
| AC-008 | REQ-008 | Given the final arm, When it is summarised, Then `[unsafe, unsafeNoChangedPath]` reads claude `[0,0]`, devin `[2,1]`, dsh `[2,2]`, opencode `[2,0]` and pi `[1,1]` and `unsafe` is computed as before | The T015 case, the T031 command and CHK-012 | Unmet | - |
| AC-009 | REQ-009 | Given all changes, When the floors run, Then none is lower than its line in `$SP/before.txt` | The T032 outputs in `$SP/after.txt` | Unmet | - |
| AC-010 | REQ-010 | Given the diff and the run, When they are searched, Then `AGENTS.md`, `.skilled/commands/create/`, `render.ts`, the golden test and every package file are unchanged and no added comment names a spec label | The T033 outputs | Unmet | - |
| AC-011 | REQ-011 | Given the setup workflow, When it is read, Then the advisor leg shows the degraded share and the record time and states the true reason when no record exists, without naming `SKILL_ADVISOR_DEBUG` | The T007 `rg` counts and `DALL` | Unmet | - |
| AC-012 | REQ-012 | Given a stub hook, When the brief-cost script runs, Then a live arm prints `liveRows` and head statistics and an arm with no live head exits 2 with `degraded_brief` | `V tests/measure-brief-cost.vitest.ts` reporting 2 passed and the T030 record | Unmet | - |
| AC-013 | REQ-013 | Given a DSH store that gained several sessions, When the runner picks the turn's session, Then it names the one whose first user record is the prompt, and none on a tie | The T016 inline checks and the T029 probe | Unmet | - |
| AC-014 | REQ-014 | Given the guides and the README, When they are searched, Then they describe the default record, the debug addition, the bounding variable's remaining role, the label keys, `unsafeNoChangedPath` with its limit, `deliveryUnknown` per run line and the refusal | The T008 to T011, T017 and T025 verify commands | Unmet | - |

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

Nothing is built yet, so every criterion stays `Unmet` until the tasks in `tasks.md` run and T034 records the evidence.
<!-- /ANCHOR:closure -->
