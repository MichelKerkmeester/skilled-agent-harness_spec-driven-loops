---
title: "Acceptance Criteria: Scaffold, placeholder and upgrade truth"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "scaffold placeholder truth criteria"
  - "round three criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Scaffold, placeholder and upgrade truth

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 030-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Level 1 scaffold with the goal flag, When its documents are read, Then no title carries a provenance token and no summary carries `[Feature Name]` | `runtime/cli/spec/create.sh:646` strips the token and substitutes the name; `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136` asserts both on five scaffolded documents; 3 files, 15 tests pass with 3 snapshots updated | Met | - |
| AC-002 | REQ-002 | Given a phase-parent scaffold, When the compiled generator is absent, Then create.sh exits 1 naming the generator | `runtime/cli/spec/create.sh:1428` exits with the message; the smoke with the generator present still lists description.json | Met | - |
| AC-003 | REQ-003 | Given the four lanes and the program, When they run, Then all pass | `implementation-summary.md:114` records the check: the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 | Met | - |
| AC-004 | REQ-004 | Given a Level 1 packet without a summary, When it is upgraded, Then implementation-summary.md exists and decision-record.md does not | `runtime/cli/spec/upgrade-level.sh:766` creates the summary before the case; the 2-3 case creates nothing; `runtime/cli/tests/test-upgrade-level.sh` passes 14 of 14 | Met | - |

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

Every criterion is met by observed output. Consciously left out: the 1,240 closed documents with a provenance token, which the standalone script reports and the scaffolder no longer produces.
<!-- /ANCHOR:closure -->
