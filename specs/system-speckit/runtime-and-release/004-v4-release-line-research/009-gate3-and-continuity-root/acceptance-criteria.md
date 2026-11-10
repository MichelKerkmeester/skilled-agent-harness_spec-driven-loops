---
title: "Acceptance Criteria: Phase 9: gate3-and-continuity-root"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gate3 and continuity root acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/009-gate3-and-continuity-root"
    last_updated_at: "2026-11-08T23:39:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-gate3-and-continuity-root"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: gate3-and-continuity-root

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `009-gate3-and-continuity-root`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the rebuilt `shared/dist`, When `PROBE` classifies "Update the README and review the result." and "Review the README and update it.", Then both print `true` | `g3probe2.mjs` on rebuilt `shared/dist`: both print `true file_write_match` | Met | - |
| AC-002 | REQ-002 | Given the rebuilt `shared/dist`, When `PROBE` classifies "review the packet and resume" and "review the packet", Then they print `true` and `false` | probe: `true resume_match` and `false no_match` | Met | - |
| AC-003 | REQ-003 | Given a working directory outside any repository, When a save runs without `--project-root`, Then it exits non-zero, names `--project-root` and writes nothing in the runtime repository | `generate-context-cli-authority.vitest.ts` passes; manual run from a non-repository dir exits 1 naming `--project-root` | Met | - |
| AC-004 | REQ-004 | Given the doctor install assets and `validate.sh`, When searched for the CLI writer and the repair command, Then both install files probe `runtime/cli/dist/continuity/generate-context.js` and every `Run:` line in `validate.sh` builds `runtime/cli` | `rg` finds the writer path in both doctor install files; `validate.sh` lines 409, 417, 432 print `npm --prefix .skilled/skills/system-spec-kit run build` | Met | - |
| AC-005 | REQ-005 | Given a scratch git repository with no `.skilled` tree, When `create.sh --level 1` runs there, Then it creates the folder from the skill's own templates, and `SPECKIT_TEMPLATES_BASE` appears in `ENV-REFERENCE.md` | scratch repo run exit 0 with folder created; `ENV-REFERENCE.md:206` documents the variable | Met | - |
| AC-006 | REQ-006 | Given the 195-row labeled corpus, When scored after the change, Then agreement is at least 191 and no row that agreed before disagrees | 191/195 after, same four disagreeing ids as before | Met | - |

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

**Closeable:** Yes

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
