---
title: "Acceptance Criteria: CI push gates and runtime document truth"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ci push triggers criteria"
  - "round three criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/019-ci-push-gates-and-runtime-doc-truth"
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
# Acceptance Criteria: CI push gates and runtime document truth

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 030-spec-kit-simplification-research/019-ci-push-gates-and-runtime-doc-truth
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
| AC-001 | REQ-001 | Given the two workflow files, When their triggers are read, Then both name push for main and the release lines | `.github/workflows/spec-kit-check.yml:4` and `changed-packet-validation.yml:4` carry the push block; both parse | Met | - |
| AC-002 | REQ-002 | Given the validation lane, When it runs, Then the four harnesses run after the suites | `runtime/cli/package.json:22` names them; the lane's log lists each with exit 0 | Met | - |
| AC-003 | REQ-003 | Given the four lanes and the program, When they run, Then all pass | `implementation-summary.md:110` records the check: the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 | Met | - |
| AC-004 | REQ-004 | Given the reference and the save asset, When read, Then the skip switch has a row and the categories match the runtime | `runtime/ENV-REFERENCE.md` row for the switch; `.opencode/commands/speckit/save.md:48` lists the six names in `runtime/lib/validation/spec-doc-structure.ts:156` | Met | - |

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

Every criterion is met by observed output. Consciously left out: the workflow files parse, and the first push after this commit is where their runs appear.
<!-- /ANCHOR:closure -->
