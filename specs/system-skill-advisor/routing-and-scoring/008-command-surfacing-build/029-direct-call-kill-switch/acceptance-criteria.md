---
title: "Acceptance Criteria: Phase 29: direct-call-kill-switch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "direct call kill switch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/029-direct-call-kill-switch"
    last_updated_at: "2026-11-15T07:01:22Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-029-direct-call-kill-switch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 29: direct-call-kill-switch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 029-direct-call-kill-switch
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fake warm daemon that answers whatever the switch says, When the CLI client runs `advisor_recommend` under the canonical name set to `1` or `true`, a `_HOOK_DISABLED` name set to `yes`, the master switch or a flags-file entry, Then it prints the empty envelope that names the key the resolver returned and sends the daemon no request | The kill-switch cases of T003 failed before T004 and pass after it | Unmet | - |
| AC-002 | REQ-002 | Given the fixed and rebuilt tree and a warm workspace daemon, When the reproduction runs, Then all fourteen lines print `match=yes`, the canonical line abstains through the built shim and the lease lines are equal | The `rg -c` checks and the lease check of T012 | Unmet | - |
| AC-003 | REQ-003 | Given no switch, When the client runs against the warm daemon, Then it prints the rows it printed before, and the environment's `0` over the file's `1` still asks the daemon | The control case of T003 and the `diff` of the `hook=on` lines in T012 prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given the fixed module, When it and the client's closure are searched, Then the module calls `.hookFlagDecision(` once, holds no truthy literal and no name list of its own, the built module names the canonical switch, and the client loads no package beyond `zod` | The `rg`, import and `CLOSURE` checks of T004, and `closure-after.txt` of T012 | Unmet | - |
| AC-005 | REQ-005 | Given the fixed tree, When the floors, the eval and every gate run, Then each floor and eval line equals its before line and every gate passes | `cmp` of the before and after files in T011 prints nothing, and `after.txt` of T010 | Unmet | - |
| AC-006 | REQ-006 | Given the flags file named in the daemon's environment, When the handler answers, Then it does not abstain, and the launcher file and its allowlist are unchanged | The flags-file case of T005 failed before its change and passes after, and the launcher checks of T013 | Unmet | - |
| AC-007 | REQ-007 | Given the phase diff, When the compat files are compared with `BASE`, Then `compat-contract.json`, `lib/compat/` and `skill_advisor.py` show no change | The `G diff --quiet` check of T013 exits 0 | Unmet | - |
| AC-008 | REQ-008 | Given `SYSTEM_SKILL_ADVISOR_DISABLED=1` or `HOOK_FLAGS_CONFIG` exported in the shell, When the handler suite and the dual-client suite run, Then each reports 0 failed | The exported runs of T005 and T006 | Unmet | - |
| AC-009 | REQ-009 | Given the three documents, When each is searched for its new sentence, Then each states the shipped behaviour, the example file's lines still take effect, and the lines `plan.md` lists as unchanged or handed on still read as they did | The `rg` checks of T007 to T009, `EXT` and `playbook-after.txt` of T012 | Unmet | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment and doc lines are searched and the row files, the baselines, `AGENTS.md`, the package files and the touched paths are checked, Then nothing is found and nothing outside `FILES` and phase 025's own paths changed | The checks of T013 and the commit listing of T014 | Unmet | - |
| AC-011 | REQ-011 | Given the fix commit, When one Opus reviewer reads its diff, Then no P0 or P1 stays open | `scratch/review/report.txt` and the record on T015 | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

The phase is planned and not built, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
