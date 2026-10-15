---
title: "Acceptance Criteria: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor command routing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/035-doctor-command-routing"
    last_updated_at: "2026-10-15T16:30:00Z"
    last_updated_by: "speckit-plan"
    recent_action: "Authored one acceptance criterion per requirement"
    next_safe_action: "Run /speckit:implement and meet the criteria in task order"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-035-2026-10-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/035-doctor-command-routing
**Level:** 2
**Status:** Draft
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Gate IDs refer to `plan.md` section 5.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the slice file exists, When G8 runs, Then it scores only the slice and the pinned corpus hashes are unchanged | G8 output, plus G3 holdout-independence passing and `git diff --stat` showing no change to the three pinned corpora | Unmet | - |
| AC-002 | REQ-002 | Given the T001 per-prompt snapshot, When every wave has landed, Then no row that passed at T001 fails | G11 report with zero lost rows, plus G3 ratchet output | Unmet | - |
| AC-003 | REQ-003 | Given `_routes.yaml`, When the deriver runs, Then each route has one bridge with the documented id, `skillId` and `ownerMode`, and `--check` reports `fresh` | G1 output and the doctor entries in `command-bridges.generated.json` | Unmet | - |
| AC-004 | REQ-004 | Given an admitted doctor bridge, When both scorers load, Then it is active in both under one inventory id, and its Python markers are slash strings only | `scoring-compatibility.json` entries, G5 and G7 output | Unmet | - |
| AC-005 | REQ-005 | Given a prompt where a skill and a doctor bridge both pass, When the TypeScript scorer ranks them, Then the skill is first, and a typed doctor command keeps the doctor bridge first | The T014 ordering test, failing under its mutation check, then passing | Unmet | - |
| AC-006 | REQ-006 | Given a doctor recommendation, When the brief renders, Then it shows the runnable `/doctor:<command> <target>` string as the top line or as a second line after the skill, inside the token cap | T015 renderer tests and G4 hook tests | Unmet | - |
| AC-007 | REQ-007 | Given `/doctor:setup`, When it runs, Then it lists every doctor target, prints a repair command per failing leg and writes nothing | G2 output and the T028 `git status --short` before and after | Unmet | - |
| AC-008 | REQ-008 | Given the pinned regime, When "Help me set up skilled" and "check my environment variables" are scored, Then they return `/doctor:setup` and `/doctor:env list` | T027 scorer output for both prompts | Unmet | - |
| AC-009 | REQ-009 | Given Wave A has landed, When each Wave B route is activated alone, Then G11 shows zero lost rows before the next route starts, and `/doctor:deep-loop` and the `/doctor:mcp` sub-actions have no compatibility entry | One G11 report per wave task, T018 and T020 through T023, plus `scoring-compatibility.json` | Unmet | - |
| AC-010 | REQ-010 | Given the final diff, When it is read, Then no lane weight, threshold or confidence constant changed | `git diff` of `lib/scorer/` showing only the ordering rule and the generated blocks | Unmet | - |
| AC-011 | REQ-011 | Given the reach probe, When an admitted phrase is renamed, Then G9 fails, and with the phrase restored it passes | T019 mutation check output | Unmet | - |
| AC-012 | REQ-012 | Given no recommendation passes, When the prompt uses setup, install, check or configure wording, Then the fallback carries one sentence naming `/doctor:setup`. When the prompt is plain and unrelated, Then no hint appears. The directive block is unchanged in both cases | T016 tests for both prompts, the hint test failing when the flag check is deleted, and the recorded byte delta | Unmet | - |
| AC-013 | REQ-013 | Given the manifest, When it is read, Then `/doctor:env` has an entry with trigger phrases, `/doctor:update` has plain-word phrases and the header names the deriver as its consumer | `_routes.yaml` diff and G2 output | Unmet | - |
| AC-014 | REQ-014 | Given the new command, When the mirror and catalog checks run, Then every mirror exists and the catalog lists 10 doctor commands | G10 output and `.skilled/commands/README.txt` | Unmet | - |
| AC-015 | REQ-015 | Given the CI workflows, When each job that runs the bridge generator is listed, Then every one installs the `yaml` parser, through an install step added where it was missing | T010 job list in `scratch/ci-yaml-check.md` and the workflow diff | Unmet | - |

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

Planning is complete and implementation has not started, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
